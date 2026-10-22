"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
} from "react";

import { useReducedMotion } from "@/components/home/approach/useReducedMotion";
import {
  applyScrollImpulse,
  createScrollNudge,
  followToward,
  pocketFollowTarget,
  pocketHoverDt,
  pocketHoverFollowK,
  pointerNormFromRect,
  POCKET_FAMILY_WAKE_HOLD_MS,
  POCKET_HOVER_REST_EPS,
  resetScrollNudge,
  scrollNudgeQuiet,
  subscribePocketFamilyMotion,
  tickScrollNudge,
} from "@/lib/pocketSpatialMotion";

import {
  CENTER,
  drawProjectCube,
  drawProjectStructure,
  REST_RX,
  REST_RY,
  TARGET_HEIGHT,
  VIEWBOX_H,
  VIEWBOX_W,
} from "./miniProjectCubeGeometry";

/**
 * "Your Project" cube. Visual Layer motion language, not the Pocket Cube lab
 * interaction: pointer follow of about ±3° yaw / ±2° pitch, eased toward the
 * pointer and eased back. No drag, no intro flip, no idle drift, no accent edges.
 * Wake and scroll nudge use the same shared utilities and amplitudes as
 * `VisualLayerCube`. Pointer follow is desktop-only (fine pointer, ≥1024px);
 * touch and reduced motion keep the rest pose.
 */
const FOLLOW_YAW = 0.052;
const FOLLOW_PITCH = 0.036;
const WAKE_YAW = FOLLOW_YAW * 0.55;
const WAKE_PITCH = -FOLLOW_PITCH * 0.52;
const SCROLL_YAW_MAX = FOLLOW_YAW * 0.4;
const SCROLL_PITCH_MAX = FOLLOW_PITCH * 0.38;
const SCROLL_IMPULSE_PER_PX = 0.000055;
const SCROLL_VEL_CLAMP_YAW = 0.006;
const SCROLL_VEL_CLAMP_PITCH = 0.0036;

/**
 * Pointer is read against a field around the cube, not the whole (wider) column,
 * so a pointer near the object reaches the full ±3° at about one cube-width away.
 */
const FIELD_HALF = 150;

/**
 * Structural reveal: "under the surface, there is a system". While a fine
 * pointer is over the cube itself, a few seams from the System cube's front
 * (see `drawProjectStructure`) fade in beneath the material. Rest state draws
 * nothing. The fade is CSS only (no extra loop); the lines are part of the same
 * SVG and projection, so they follow the pose. Off for touch and reduced motion.
 */
const REVEAL_IN = "opacity 650ms cubic-bezier(0.22, 0.61, 0.36, 1), visibility 0s linear 0s";
const REVEAL_OUT = "opacity 900ms cubic-bezier(0.22, 0.61, 0.36, 1), visibility 0s linear 900ms";
const SEAM_RGB = "#9db0cf";
const SEAM_ALPHA = { seam: 0.1, carrier: 0.14 } as const;
const SEAM_WIDTH = 0.75;
const SEAM_WIDTH_SOFT = 3;
const SEAM_SOFT_SHARE = 0.22;

/**
 * Material light. A Royal Blue core seen through the satin, clipped to the
 * body so it never reaches the surrounding space. Static: no halo, no ground
 * light, no animation.
 */
const GLOW_RGB = "74,108,236";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeFinePointer(onChange: () => void) {
  const mq = window.matchMedia(FINE_POINTER_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getFinePointer() {
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

function getFinePointerServer() {
  return false;
}

/**
 * The mesh is drawn in the 520x400 stage, but the cube only occupies y 113–285. The viewBox is cropped to
 * that band (same scale, centred on the stage midline y=200 so the lg position is unchanged) so the SVG box is the artwork's own height, not a taller stage.
 */
const CROP_Y = 98;
const CROP_H = 204;
const CROP_VIEWBOX = `0 ${CROP_Y} ${VIEWBOX_W} ${CROP_H}`;

type Props = { className?: string; svgClassName?: string };

export default function MiniProjectCube({ className = "", svgClassName = "h-full w-full overflow-visible" }: Props) {
  const reducedMotion = useReducedMotion();
  const [pose, setPose] = useState({ rx: REST_RX, ry: REST_RY });
  const hoveringRef = useRef(false);
  const targetRef = useRef({ yaw: 0, pitch: 0 });
  const offsetRef = useRef({ yaw: 0, pitch: 0 });
  const rafRef = useRef(0);
  const lastTickRef = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hostEl, setHostEl] = useState<HTMLDivElement | null>(null);
  const tickRef = useRef<() => void>(() => {});
  const wakeHoldUntilRef = useRef(0);
  const scrollRef = useRef(createScrollNudge());
  const pointerFollowRef = useRef(false);

  const faces = useMemo(() => drawProjectCube(pose.rx, pose.ry), [pose.rx, pose.ry]);
  const structure = useMemo(() => drawProjectStructure(pose.rx, pose.ry), [pose.rx, pose.ry]);
  const uid = useId().replace(/:/g, "");
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointer,
    getFinePointerServer,
  );
  const [overCube, setOverCube] = useState(false);
  const revealed = overCube && finePointer && !reducedMotion;

  useEffect(() => {
    const tick = (now: number) => {
      const dt = pocketHoverDt(now, lastTickRef.current || now);
      lastTickRef.current = now;
      const hovering = hoveringRef.current;
      const target = targetRef.current;
      const k = pocketHoverFollowK(dt, hovering);
      const offset = offsetRef.current;
      offset.yaw = followToward(offset.yaw, target.yaw, k);
      offset.pitch = followToward(offset.pitch, target.pitch, k);

      if (!hovering && wakeHoldUntilRef.current > 0 && now >= wakeHoldUntilRef.current) {
        wakeHoldUntilRef.current = 0;
        target.yaw = 0;
        target.pitch = 0;
      }

      const scroll = scrollRef.current;
      tickScrollNudge(scroll, dt, hovering, SCROLL_YAW_MAX, SCROLL_PITCH_MAX);
      const atRest =
        !hovering &&
        wakeHoldUntilRef.current === 0 &&
        Math.abs(offset.yaw) < POCKET_HOVER_REST_EPS &&
        Math.abs(offset.pitch) < POCKET_HOVER_REST_EPS &&
        scrollNudgeQuiet(scroll);

      if (atRest) {
        offset.yaw = 0;
        offset.pitch = 0;
        resetScrollNudge(scroll);
        setPose({ rx: REST_RX, ry: REST_RY });
        rafRef.current = 0;
        lastTickRef.current = 0;
        return;
      }

      setPose({
        rx: REST_RX + offset.pitch + scroll.pitch,
        ry: REST_RY + offset.yaw + scroll.yaw,
      });
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

  const ensureLoop = useCallback(() => {
    if (rafRef.current) return;
    lastTickRef.current = performance.now();
    rafRef.current = window.requestAnimationFrame(() => {
      tickRef.current();
    });
  }, []);

  const startWake = useCallback(() => {
    if (hoveringRef.current) return;
    targetRef.current = { yaw: WAKE_YAW, pitch: WAKE_PITCH };
    wakeHoldUntilRef.current = performance.now() + POCKET_FAMILY_WAKE_HOLD_MS;
    ensureLoop();
  }, [ensureLoop]);

  const bindHost = useCallback((node: HTMLDivElement | null) => {
    hostRef.current = node;
    setHostEl(node);
  }, []);

  useEffect(() => {
    if (reducedMotion || !hostEl || typeof IntersectionObserver === "undefined") return;
    const root = hostEl.closest("section") ?? hostEl;
    return subscribePocketFamilyMotion({
      root,
      getHovering: () => hoveringRef.current,
      onPointerFollowChange: (enabled) => {
        pointerFollowRef.current = enabled;
      },
      onWake: startWake,
      onLeaveView: () => {
        wakeHoldUntilRef.current = 0;
        if (!hoveringRef.current) {
          targetRef.current = { yaw: 0, pitch: 0 };
          ensureLoop();
        }
      },
      onScrollImpulse: (dy) => {
        applyScrollImpulse(
          scrollRef.current,
          dy,
          SCROLL_IMPULSE_PER_PX,
          SCROLL_VEL_CLAMP_YAW,
          SCROLL_VEL_CLAMP_PITCH,
        );
        ensureLoop();
      },
    });
  }, [ensureLoop, hostEl, reducedMotion, startWake]);

  const writeTarget = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = Math.min(rect.width / VIEWBOX_W, rect.height / CROP_H);
    const half = FIELD_HALF * scale;
    const field = new DOMRect(
      rect.left + rect.width / 2 - half,
      rect.top + rect.height / 2 - half,
      half * 2,
      half * 2,
    );
    const { nx, ny } = pointerNormFromRect(event.clientX, event.clientY, field);
    wakeHoldUntilRef.current = 0;
    targetRef.current = pocketFollowTarget(nx, ny, FOLLOW_YAW, FOLLOW_PITCH);
  }, []);

  const canFollow = !reducedMotion;

  /** Reveal only while the pointer is on the object (a facet path), not the wider follow field. */
  const trackOver = (event: PointerEvent<HTMLDivElement>) => {
    setOverCube(event.pointerType !== "touch" && event.target instanceof SVGPathElement);
  };

  const onEnter = (event: PointerEvent<HTMLDivElement>) => {
    trackOver(event);
    if (!canFollow || !pointerFollowRef.current || event.pointerType === "touch") return;
    hoveringRef.current = true;
    writeTarget(event);
    ensureLoop();
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    trackOver(event);
    if (!canFollow || !pointerFollowRef.current || event.pointerType === "touch") return;
    hoveringRef.current = true;
    writeTarget(event);
    ensureLoop();
  };

  const onLeave = () => {
    setOverCube(false);
    hoveringRef.current = false;
    targetRef.current = { yaw: 0, pitch: 0 };
    if (canFollow) ensureLoop();
  };

  return (
    <div
      ref={bindHost}
      className={className}
      data-project-cube=""
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <svg
        ref={svgRef}
        viewBox={CROP_VIEWBOX}
        fill="none"
        aria-hidden="true"
        shapeRendering="geometricPrecision"
        strokeLinejoin="round"
        className={svgClassName}
      >
        <defs>
          <radialGradient
            id={`${uid}-core`}
            gradientUnits="userSpaceOnUse"
            cx={CENTER.x - 14}
            cy={CENTER.y + 26}
            r={TARGET_HEIGHT * 0.78}
          >
            <stop offset="0" stopColor="#6f8cf5" stopOpacity={0.26} />
            <stop offset="0.5" stopColor={`rgb(${GLOW_RGB})`} stopOpacity={0.09} />
            <stop offset="1" stopColor={`rgb(${GLOW_RGB})`} stopOpacity={0} />
          </radialGradient>
          {/* Mask, not clipPath: the 1px stroke closes the anti-aliased facet seams. */}
          <mask id={`${uid}-body`} maskUnits="userSpaceOnUse" x={0} y={0} width={VIEWBOX_W} height={VIEWBOX_H}>
            {faces.map((face) => (
              <path key={face.id} d={face.d} fill="#fff" stroke="#fff" strokeWidth={1} />
            ))}
          </mask>
        </defs>
        {faces.map((face) => (
          <path key={face.id} d={face.d} fill={face.fill} stroke={face.fill} strokeWidth={0.6} />
        ))}
        <g mask={`url(#${uid}-body)`} pointerEvents="none">
          <rect x={0} y={0} width={VIEWBOX_W} height={VIEWBOX_H} fill={`url(#${uid}-core)`} />
        </g>
        <g
          data-project-structure=""
          pointerEvents="none"
          style={{
            opacity: revealed ? 1 : 0,
            visibility: revealed ? "visible" : "hidden",
            transition: revealed ? REVEAL_IN : REVEAL_OUT,
          }}
        >
          <defs>
            <clipPath id={`${uid}-clip`}>
              <path d={structure.clip} />
            </clipPath>
            {structure.lines.map((line) => {
              const peak = SEAM_ALPHA[line.tier];
              return (
                <linearGradient
                  key={line.id}
                  id={`${uid}-${line.id}`}
                  gradientUnits="userSpaceOnUse"
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                >
                  <stop offset="0" stopColor={SEAM_RGB} stopOpacity={0} />
                  <stop
                    offset={line.fade === "both" ? 0.14 : 0.3}
                    stopColor={SEAM_RGB}
                    stopOpacity={peak}
                  />
                  {line.fade === "both" ? (
                    <stop offset="0.86" stopColor={SEAM_RGB} stopOpacity={peak} />
                  ) : null}
                  <stop
                    offset="1"
                    stopColor={SEAM_RGB}
                    stopOpacity={line.fade === "both" ? 0 : peak}
                  />
                </linearGradient>
              );
            })}
          </defs>
          <g clipPath={`url(#${uid}-clip)`}>
            {structure.lines.map((line) => (
              <g
                key={line.id}
                stroke={`url(#${uid}-${line.id})`}
                strokeLinecap="round"
              >
                {/* Soft under-stroke: light seen through the satin, so the seam sits beneath it. */}
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  strokeWidth={SEAM_WIDTH_SOFT}
                  strokeOpacity={SEAM_SOFT_SHARE}
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  strokeWidth={SEAM_WIDTH}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
