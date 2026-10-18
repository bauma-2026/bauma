"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { useFinePointer } from "@/components/home/approach/useFinePointer";
import {
  followToward,
  hoverFollowCurve,
  pocketHoverDt,
  POCKET_HOVER_PITCH_CURVE,
  POCKET_HOVER_REST_EPS,
  POCKET_HOVER_YAW_CURVE,
} from "@/lib/pocketHoverFollow";

import { MINI_OBJECT_FILL, MINI_OBJECT_STROKE } from "./miniObjectMaterial";

type MiniResponsivePlaneProps = {
  className?: string;
  variant?: "desktop" | "mobile";
};

/** Rest amber — same cue as before; no peak/activation. */
const AMBER_REST = 0.62;

/** Calmer than cube 0.08 / 0.048; same family as Pristop 0.07 / 0.045. */
const VL_YAW_MAX = 0.075;
const VL_PITCH_MAX = 0.045;

/** VL-only follow — faster than shared 0.08 / 0.16. */
const VL_HOVER_TAU = 0.05;
const VL_RETURN_TAU = 0.12;
const VL_PROXIMITY_TAU_ENTER = 0.05;
const VL_PROXIMITY_TAU_RETURN = 0.12;
const VL_PROXIMITY_REST_EPS = 0.002;
/** Screen-space separation along the existing rear offset. */
const VL_PROXIMITY_PX = 3.5;
/** Rest rear − front (viewBox): 136,102 − 118,88. */
const VL_DEPTH_DX = 18;
const VL_DEPTH_DY = 14;
const VL_DEPTH_LEN = Math.hypot(VL_DEPTH_DX, VL_DEPTH_DY);
const VL_DEPTH_UX = VL_DEPTH_DX / VL_DEPTH_LEN;
const VL_DEPTH_UY = VL_DEPTH_DY / VL_DEPTH_LEN;

/**
 * Hit polygon around the visible cassette.
 * Inflated from `94,68 346,90 362,118 338,318 96,286 72,260`
 * by 32px screen-space (35×29 viewBox units at the 420×420 stage).
 */
const VL_HIT_POINTS =
  "59,39 381,61 397,89 373,347 61,315 37,289";

function vlFollowK(dtSeconds: number, hovering: boolean) {
  const tau = hovering ? VL_HOVER_TAU : VL_RETURN_TAU;
  return 1 - Math.exp(-dtSeconds / tau);
}

function vlProximityK(dtSeconds: number, hovering: boolean) {
  const tau = hovering ? VL_PROXIMITY_TAU_ENTER : VL_PROXIMITY_TAU_RETURN;
  return 1 - Math.exp(-dtSeconds / tau);
}

const desktopStrokes = {
  front: MINI_OBJECT_STROKE.primary,
  rear: MINI_OBJECT_STROKE.rear,
  upperConnector: "rgba(255,255,255,0.08)",
  lowerConnector: MINI_OBJECT_STROKE.ghost,
  amber: "rgba(209,164,95,1)",
};

const mobileStrokes = {
  rear: "rgba(255,255,255,0.14)",
  amber: "rgba(209,164,95,1)",
};

const mobileFrontRest = "rgba(255,255,255,0.35)";

type Pose = { yaw: number; pitch: number };

function writeTilt(el: SVGGElement | null, yaw: number, pitch: number) {
  if (!el) return;
  el.style.transform = `perspective(980px) rotateY(${yaw}rad) rotateX(${pitch}rad)`;
}

function writeProximity(el: SVGGElement | null, proximity: number) {
  if (!el) return;
  const d = proximity * VL_PROXIMITY_PX;
  el.style.transform =
    d < 0.02
      ? "translate(0px, 0px)"
      : `translate(${d * VL_DEPTH_UX}px, ${d * VL_DEPTH_UY}px)`;
}

function DesktopPlane({ follow }: { follow: boolean }) {
  const objectRef = useRef<SVGGElement | null>(null);
  const rearRef = useRef<SVGGElement | null>(null);
  const hoveringRef = useRef(false);
  const offsetRef = useRef<Pose>({ yaw: 0, pitch: 0 });
  const targetOffsetRef = useRef<Pose>({ yaw: 0, pitch: 0 });
  const proximityRef = useRef(0);
  const targetProximityRef = useRef(0);
  const rafRef = useRef(0);
  const lastTickRef = useRef(0);
  const tickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const tick = (now: number) => {
      const dt = pocketHoverDt(now, lastTickRef.current || now);
      lastTickRef.current = now;
      const hovering = hoveringRef.current;
      const k = vlFollowK(dt, hovering);
      const offset = offsetRef.current;
      const target = targetOffsetRef.current;
      offset.yaw = followToward(offset.yaw, target.yaw, k);
      offset.pitch = followToward(offset.pitch, target.pitch, k);
      proximityRef.current = followToward(
        proximityRef.current,
        targetProximityRef.current,
        vlProximityK(dt, hovering),
      );

      const atRest =
        !hovering &&
        Math.abs(offset.yaw) < POCKET_HOVER_REST_EPS &&
        Math.abs(offset.pitch) < POCKET_HOVER_REST_EPS &&
        proximityRef.current < VL_PROXIMITY_REST_EPS;

      if (atRest) {
        offset.yaw = 0;
        offset.pitch = 0;
        proximityRef.current = 0;
        writeTilt(objectRef.current, 0, 0);
        writeProximity(rearRef.current, 0);
        rafRef.current = 0;
        lastTickRef.current = 0;
        return;
      }

      writeTilt(objectRef.current, offset.yaw, offset.pitch);
      writeProximity(rearRef.current, proximityRef.current);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    tickRef.current = () => {
      tick(performance.now());
    };

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, []);

  useEffect(() => {
    if (follow) return;
    hoveringRef.current = false;
    offsetRef.current = { yaw: 0, pitch: 0 };
    targetOffsetRef.current = { yaw: 0, pitch: 0 };
    proximityRef.current = 0;
    targetProximityRef.current = 0;
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    lastTickRef.current = 0;
    writeTilt(objectRef.current, 0, 0);
    writeProximity(rearRef.current, 0);
  }, [follow]);

  const ensureLoop = useCallback(() => {
    if (!follow || rafRef.current) return;
    lastTickRef.current = performance.now();
    rafRef.current = window.requestAnimationFrame(() => {
      tickRef.current();
    });
  }, [follow]);

  const writeTarget = useCallback((event: ReactPointerEvent<SVGPolygonElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const nx = Math.min(
      1,
      Math.max(-1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
    );
    const ny = Math.min(
      1,
      Math.max(-1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    targetOffsetRef.current = {
      yaw:
        hoverFollowCurve(
          nx,
          POCKET_HOVER_YAW_CURVE.ease,
          POCKET_HOVER_YAW_CURVE.calm,
        ) * VL_YAW_MAX,
      pitch:
        -hoverFollowCurve(
          ny,
          POCKET_HOVER_PITCH_CURVE.ease,
          POCKET_HOVER_PITCH_CURVE.calm,
        ) * VL_PITCH_MAX,
    };
  }, []);

  const onPointerEnter = useCallback(
    (event: ReactPointerEvent<SVGPolygonElement>) => {
      if (!follow) return;
      hoveringRef.current = true;
      targetProximityRef.current = 1;
      writeTarget(event);
      ensureLoop();
    },
    [ensureLoop, follow, writeTarget],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<SVGPolygonElement>) => {
      if (!follow) return;
      hoveringRef.current = true;
      targetProximityRef.current = 1;
      writeTarget(event);
      ensureLoop();
    },
    [ensureLoop, follow, writeTarget],
  );

  const onPointerLeave = useCallback(() => {
    hoveringRef.current = false;
    targetProximityRef.current = 0;
    targetOffsetRef.current = { yaw: 0, pitch: 0 };
    ensureLoop();
  }, [ensureLoop]);

  return (
    <svg
      viewBox="0 0 460 380"
      fill="none"
      aria-hidden="true"
      shapeRendering="geometricPrecision"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
      className="pointer-events-auto h-full w-full overflow-visible"
      data-vl-motion={follow ? "follow" : "static"}
    >
      <defs>
        <clipPath id="mini-responsive-plane-desktop-front-clip">
          <polygon points="118,88 326,106 298,286 92,248" />
        </clipPath>
      </defs>
      <g
        ref={objectRef}
        data-vl-tilt=""
        pointerEvents="none"
        style={{
          transformBox: "view-box",
          transformOrigin: "230px 190px",
          transform: "perspective(980px) rotateY(0rad) rotateX(0rad)",
        }}
      >
        <g
          style={{
            transform: "translate(1px, 0) rotate(-1deg)",
            transformBox: "view-box",
            transformOrigin: "230px 190px",
          }}
        >
          <g
            style={{
              transform: "scale(1.05)",
              transformBox: "view-box",
              transformOrigin: "218px 192.5px",
            }}
          >
            <g
              ref={rearRef}
              data-vl-rear=""
              style={{
                transformBox: "view-box",
                transformOrigin: "218px 192.5px",
                transform: "translate(0px, 0px)",
              }}
            >
              <polygon
                points="136,102 344,117 310,297 109,261"
                fill={MINI_OBJECT_FILL.rear}
                stroke={desktopStrokes.rear}
              />
              <line
                x1="326"
                y1="106"
                x2="344"
                y2="117"
                stroke={desktopStrokes.upperConnector}
              />
              <line
                x1="92"
                y1="248"
                x2="109"
                y2="261"
                stroke={desktopStrokes.lowerConnector}
              />
            </g>
            <polygon
              points="118,88 326,106 298,286 92,248"
              fill={MINI_OBJECT_FILL.side}
            />
            <g clipPath="url(#mini-responsive-plane-desktop-front-clip)">
              <path
                d="M113.9286 113.0547 L234.8 125.4 L228.8 163.1 L271.4 168.3 L254.2201 277.9241 L92 248 Z"
                fill={MINI_OBJECT_FILL.inset}
                style={{ fillOpacity: 1 }}
              />
              <path
                d="M113.9286 113.0547 L234.8 125.4"
                fill="none"
                stroke="rgba(255,255,255,0.21)"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                style={{ strokeOpacity: 0.21 }}
              />
              <line
                x1="271.4"
                y1="168.3"
                x2="254.2201"
                y2="277.9241"
                stroke="rgba(255,255,255,0.11)"
                strokeLinecap="butt"
              />
              <path
                d="M234.8 125.4 L228.8 163.1 L271.4 168.3"
                fill="none"
                stroke={desktopStrokes.amber}
                strokeWidth="1.25"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                style={{ opacity: AMBER_REST }}
              />
            </g>
            <polygon
              points="118,88 326,106 298,286 92,248"
              fill="none"
              stroke={desktopStrokes.front}
            />
          </g>
        </g>
      </g>
      <polygon
        data-vl-hit=""
        points={VL_HIT_POINTS}
        fill="rgba(0,0,0,0.001)"
        stroke="none"
        pointerEvents="all"
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      />
    </svg>
  );
}

function MobilePlane() {
  return (
    <svg
      viewBox="0 0 360 320"
      fill="none"
      aria-hidden="true"
      shapeRendering="geometricPrecision"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
      className="h-full w-full overflow-visible"
      data-vl-motion="static"
    >
      <defs>
        <clipPath id="mini-responsive-plane-mobile-front-clip">
          <polygon points="62,72 284,89 260,247 48,218" />
        </clipPath>
      </defs>
      <g pointerEvents="none">
        <g
          style={{
            transform: "translate(1px, 0) rotate(-1deg)",
            transformBox: "view-box",
            transformOrigin: "180px 160px",
          }}
        >
          <polygon
            points="63,79 293,101 267,251 49,225"
            fill={MINI_OBJECT_FILL.rear}
            stroke={mobileStrokes.rear}
          />
          <polygon
            points="62,72 284,89 260,247 48,218"
            fill={MINI_OBJECT_FILL.side}
          />
          <g clipPath="url(#mini-responsive-plane-mobile-front-clip)">
            <path
              d="M59.8041 94.9 L188.1 105.9 L183.7 139.5 L228.5 143.9 L214.936 240.8356 L48 218 Z"
              fill={MINI_OBJECT_FILL.inset}
              style={{ fillOpacity: 1 }}
            />
            <path
              d="M59.8041 94.9 L188.1 105.9"
              fill="none"
              stroke="rgba(255,255,255,0.26)"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              style={{ strokeOpacity: 0.26 }}
            />
            <line
              x1="228.5"
              y1="143.9"
              x2="214.936"
              y2="240.8356"
              stroke="rgba(255,255,255,0.13)"
              strokeLinecap="butt"
            />
            <path
              d="M59.8041 94.9 L188.1 105.9 L183.7 139.5 L228.5 143.9"
              fill="none"
              stroke={mobileStrokes.amber}
              strokeWidth="1.45"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              style={{ opacity: AMBER_REST }}
            />
          </g>
          <polygon
            points="62,72 284,89 260,247 48,218"
            fill="none"
            stroke={mobileFrontRest}
          />
          <line
            x1="206.3"
            y1="83.1"
            x2="254.3"
            y2="86.8"
            stroke={mobileStrokes.amber}
            opacity="0.02"
          />
          <line
            x1="284"
            y1="89"
            x2="293"
            y2="101"
            stroke="rgba(255,255,255,0.13)"
          />
          <line
            x1="48"
            y1="218"
            x2="49"
            y2="225"
            stroke="rgba(255,255,255,0.13)"
          />
        </g>
      </g>
    </svg>
  );
}

export default function MiniResponsivePlane({
  className = "",
  variant = "desktop",
}: MiniResponsivePlaneProps) {
  const mobile = variant === "mobile";
  const finePointer = useFinePointer();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const follow = !mobile && finePointer && !prefersReducedMotion;

  return (
    <div aria-hidden="true" className={className} data-vl-motion={follow ? "follow" : "static"}>
      {mobile ? <MobilePlane /> : <DesktopPlane follow={follow} />}
    </div>
  );
}
