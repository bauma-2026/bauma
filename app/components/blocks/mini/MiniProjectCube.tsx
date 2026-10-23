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

/** `palette="royal"`: the inner light in Royal Blue's own hue (#4169E1), not the default's slightly violet one. */
const ROYAL_GLOW = { core: "#5a7fe6", rgb: "65,105,225" } as const;

/**
 * `cue` (homepage pocket): the "Kako sodelujemo" link drives the cube. While the link is hovered or focused the cube
 * turns a little (CUE) and lifts its material (lum +CUE.lift); a press adds a short extra tilt (PRESS) that eases in fast
 * and out softly. Both ease from wherever the cube is and add on top of the pointer follow and the scroll nudge.
 * Reduced motion: no turn, only the material lift, applied directly.
 */
const CUE = { yaw: 0.06, pitch: 0.025, lift: 0.05, tauIn: 0.28, tauOut: 0.4 } as const;
const PRESS = { yaw: 0.04, pitch: 0.02, lift: 0.04, tauIn: 0.06, tauOut: 0.22 } as const;
const CUE_EPS = 0.002;

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

type Props = {
  className?: string;
  svgClassName?: string;
  /**
   * Multiplies the scroll nudge (impulse, velocity clamps and maximum angle). Default 1 keeps every caller as it was;
   * the homepage pocket passes 2.2 (at most about ±2.6° yaw / ±1.7° pitch), in step with the pocket System cube.
   */
  scrollGain?: number;
  /**
   * Narrows the cropped viewBox to this many stage units around the cube's centre (default: the full 520-unit stage
   * width). The rest silhouette is about 171 units wide and the pointer + scroll range changes it by about 2%, so 220
   * leaves ~24 units each side: the SVG box is then the cube's own footprint, with no wide empty canvas to overflow.
   */
  cropWidth?: number;
  /** `royal`: the opt-in Royal Blue ramp and inner light (homepage pocket). Default keeps the slate-blue material. */
  palette?: "default" | "royal";
  /** Link-driven response (see CUE above). Omitted: no change for any other caller. */
  cue?: { active: boolean; pressed: boolean };
};

export default function MiniProjectCube({
  className = "",
  svgClassName = "h-full w-full overflow-visible",
  scrollGain = 1,
  cropWidth = VIEWBOX_W,
  palette = "default",
  cue,
}: Props) {
  const royal = palette === "royal";
  const cueActive = cue?.active ?? false;
  const cuePressed = cue?.pressed ?? false;
  const viewBox =
    cropWidth === VIEWBOX_W ? CROP_VIEWBOX : `${CENTER.x - cropWidth / 2} ${CROP_Y} ${cropWidth} ${CROP_H}`;
  const reducedMotion = useReducedMotion();
  const [pose, setPose] = useState({ rx: REST_RX, ry: REST_RY, lift: 0 });
  const cueRef = useRef({ active: false, pressed: false });
  const cueAmtRef = useRef({ hover: 0, press: 0 });
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
  const scrollGainRef = useRef(scrollGain);
  useEffect(() => {
    scrollGainRef.current = scrollGain;
  }, [scrollGain]);

  /* Reduced motion: no loop runs, so the cue's material lift is applied directly (one tone step, no tilt). */
  const lift = reducedMotion ? (cueActive || cuePressed ? CUE.lift : 0) : pose.lift;
  const faces = useMemo(
    () => (royal || lift ? drawProjectCube(pose.rx, pose.ry, { royal, lift }) : drawProjectCube(pose.rx, pose.ry)),
    [pose.rx, pose.ry, royal, lift],
  );
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
      const gain = scrollGainRef.current;
      tickScrollNudge(scroll, dt, hovering, SCROLL_YAW_MAX * gain, SCROLL_PITCH_MAX * gain);

      const cue = cueRef.current;
      const amt = cueAmtRef.current;
      amt.hover = followToward(amt.hover, cue.active ? 1 : 0, 1 - Math.exp(-dt / (cue.active ? CUE.tauIn : CUE.tauOut)));
      amt.press = followToward(amt.press, cue.pressed ? 1 : 0, 1 - Math.exp(-dt / (cue.pressed ? PRESS.tauIn : PRESS.tauOut)));
      const cueQuiet = !cue.active && !cue.pressed && amt.hover < CUE_EPS && amt.press < CUE_EPS;

      const atRest =
        !hovering &&
        wakeHoldUntilRef.current === 0 &&
        Math.abs(offset.yaw) < POCKET_HOVER_REST_EPS &&
        Math.abs(offset.pitch) < POCKET_HOVER_REST_EPS &&
        scrollNudgeQuiet(scroll) &&
        cueQuiet;

      if (atRest) {
        offset.yaw = 0;
        offset.pitch = 0;
        amt.hover = 0;
        amt.press = 0;
        resetScrollNudge(scroll);
        setPose({ rx: REST_RX, ry: REST_RY, lift: 0 });
        rafRef.current = 0;
        lastTickRef.current = 0;
        return;
      }

      setPose({
        rx: REST_RX + offset.pitch + scroll.pitch + CUE.pitch * amt.hover + PRESS.pitch * amt.press,
        ry: REST_RY + offset.yaw + scroll.yaw + CUE.yaw * amt.hover + PRESS.yaw * amt.press,
        lift: CUE.lift * amt.hover + PRESS.lift * amt.press,
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

  /* The cue only writes its target; the loop eases toward it from the current state (no restart, no jump). */
  useEffect(() => {
    cueRef.current = { active: cueActive, pressed: cuePressed };
    const amt = cueAmtRef.current;
    if (!reducedMotion && (cueActive || cuePressed || amt.hover > 0 || amt.press > 0)) ensureLoop();
  }, [cueActive, cuePressed, reducedMotion, ensureLoop]);

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
        const gain = scrollGainRef.current;
        applyScrollImpulse(
          scrollRef.current,
          dy,
          SCROLL_IMPULSE_PER_PX * gain,
          SCROLL_VEL_CLAMP_YAW * gain,
          SCROLL_VEL_CLAMP_PITCH * gain,
        );
        ensureLoop();
      },
    });
  }, [ensureLoop, hostEl, reducedMotion, startWake]);

  const writeTarget = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = Math.min(rect.width / cropWidth, rect.height / CROP_H);
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
  }, [cropWidth]);

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
        viewBox={viewBox}
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
            <stop offset="0" stopColor={royal ? ROYAL_GLOW.core : "#6f8cf5"} stopOpacity={0.26} />
            <stop offset="0.5" stopColor={`rgb(${royal ? ROYAL_GLOW.rgb : GLOW_RGB})`} stopOpacity={0.09} />
            <stop offset="1" stopColor={`rgb(${royal ? ROYAL_GLOW.rgb : GLOW_RGB})`} stopOpacity={0} />
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
