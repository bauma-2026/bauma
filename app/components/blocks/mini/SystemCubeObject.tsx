"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

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

import type { MiniSurfaceTone } from "./miniObjectMaterial";
import {
  BASE_PITCH,
  BASE_YAW,
  FOLLOW_PITCH,
  FOLLOW_YAW,
  systemCubeDrawing,
  VIEWBOX,
} from "./systemCubeGeometry";

const STROKE_W = 0.78;
const STROKE_AMBER = 0.92;
/**
 * `sm`+: half-step from the prior System set toward Pocket Cube (`#1b1916 / #181613 / #161411`):
 * front leads, side and top stay distinct, still quieter than Pocket.
 * `max-sm`: prior set (`#171512 / #161411`) — fixed 0.78px strokes already carry
 * more weight at pocket size, so the lifted fills would outweigh Pocket Cube.
 * Switched in CSS so SSR and first paint pick the right set.
 */
const FILL = {
  front: "var(--system-fill-front)",
  side: "var(--system-fill-side)",
} as const;
const FILL_VARS =
  "[--system-fill-front:#171512] [--system-fill-side:#161411] sm:[--system-fill-front:#1a1815] sm:[--system-fill-side:#171512]";
/**
 * Neutral set (`/mini`): same white-overlay lift over the section surface as
 * above (previously over #0e0e0f), re-composited on the cool System surface
 * #0d0f15 so the cube keeps its depth without a brown or flat-grey cast.
 */
const FILL_VARS_NEUTRAL =
  "[--system-fill-front:#14161c] [--system-fill-side:#13151b] sm:[--system-fill-front:#17191f] sm:[--system-fill-side:#14161c]";
const REAR_FILL = { warm: "#151310", neutral: "#12141a" } as const;
/**
 * Line sets by tone. `warm` is the original white-alpha set. `neutral` (`/mini`) uses a
 * restrained cool silver (184,196,218): the tint costs luminance against white, so the
 * alphas are lifted ~15–20% in effective brightness over the cool System surface.
 */
const LINES = {
  warm: {
    /** Outline by camera depth — near edges carry the volume, rear edges stay quiet. */
    silhouette: {
      front: "rgba(255,255,255,0.3)",
      mid: "rgba(255,255,255,0.24)",
      rear: "rgba(255,255,255,0.17)",
    },
    /** Interior cuts — clearly under the rear outline tier, readable on dim displays. */
    seam: "rgba(255,255,255,0.1)",
    /** Rest T-stems (amber carriers) — a step above seams, not yet amber. */
    carrier: "rgba(255,255,255,0.12)",
  },
  neutral: {
    silhouette: {
      front: "rgba(184,196,218,0.48)",
      mid: "rgba(184,196,218,0.38)",
      rear: "rgba(184,196,218,0.28)",
    },
    seam: "rgba(184,196,218,0.17)",
    carrier: "rgba(184,196,218,0.19)",
  },
} as const;
/**
 * Refined (`/` only). Reads as one organised construction: hidden cuts seen
 * through the faces, one subsystem lifted by value, one quietly tinted toward
 * Royal Blue. Cool silver throughout; structure is carried by lines alone.
 */
const REFINED = {
  silhouette: { front: "rgba(184,196,218,0.6)", mid: "rgba(184,196,218,0.46)", rear: "rgba(184,196,218,0.3)" },
  seam: "rgba(184,196,218,0.3)",
  carrier: "rgba(184,196,218,0.34)",
  hidden: "rgba(150,172,222,0.27)",
  far: "rgba(150,172,222,0.16)",
  /** Face overlays by module: lead module lifted, one subsystem toned toward blue. */
  lift: { "a22-front-right": "rgba(184,196,218,0.045)", "a22-back-top": "rgba(184,196,218,0.03)" } as Record<string, string>,
  accent: { "a22-fl-top": "rgba(84,116,230,0.2)", "a22-back-bot-r": "rgba(84,116,230,0.12)" } as Record<string, string>,
} as const;
const AMBER = "var(--mini-accent-line, rgba(209,164,95,1))";
const AMBER_OPACITY = 0.72;
const ACTIVATION_EPS = 0.002;

/** One-shot section-enter: existing open + amber, then rest. Tiny pose vs Pocket intro. */
const WAKE_YAW = FOLLOW_YAW * 0.55;
const WAKE_PITCH = -FOLLOW_PITCH * 0.52;

/**
 * Pocket Cube scroll character, scaled under System hover
 * (`FOLLOW_YAW` 0.055 / `FOLLOW_PITCH` 0.034). Pose only — never drives `on`.
 */
const SCROLL_YAW_MAX = FOLLOW_YAW * 0.4;
const SCROLL_PITCH_MAX = FOLLOW_PITCH * 0.38;
const SCROLL_IMPULSE_PER_PX = 0.000055;
const SCROLL_VEL_CLAMP_YAW = 0.006;
const SCROLL_VEL_CLAMP_PITCH = 0.0036;

type SystemCubeObjectProps = {
  className?: string;
  /** `neutral` removes the warm undertone from the face fills (`/mini`). */
  tone?: MiniSurfaceTone;
  /** Hidden construction and face hierarchy (`/` only). */
  refined?: boolean;
};

export default function SystemCubeObject({
  className = "",
  tone = "warm",
  refined = false,
}: SystemCubeObjectProps) {
  const reducedMotion = useReducedMotion();
  const [pose, setPose] = useState({ yaw: BASE_YAW, pitch: BASE_PITCH, on: 0 });
  const hoveringRef = useRef(false);
  const targetRef = useRef({ yaw: 0, pitch: 0, on: 0 });
  const offsetRef = useRef({ yaw: 0, pitch: 0, on: 0 });
  const rafRef = useRef(0);
  const lastTickRef = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);
  const [hostEl, setHostEl] = useState<HTMLDivElement | null>(null);
  const tickRef = useRef<() => void>(() => {});
  const wakeHoldUntilRef = useRef(0);
  const scrollRef = useRef(createScrollNudge());
  const pointerFollowRef = useRef(false);

  const drawn = useMemo(
    () => systemCubeDrawing(pose.yaw, pose.pitch, pose.on, refined),
    [pose.on, pose.pitch, pose.yaw, refined],
  );

  useEffect(() => {
    const tick = (now: number) => {
      const dt = pocketHoverDt(now, lastTickRef.current || now);
      lastTickRef.current = now;
      const hovering = hoveringRef.current;
      const target = targetRef.current;
      const opening = !hovering && target.on > 0.5;
      const k = pocketHoverFollowK(dt, hovering || opening);
      const offset = offsetRef.current;
      offset.yaw = followToward(offset.yaw, target.yaw, k);
      offset.pitch = followToward(offset.pitch, target.pitch, k);
      offset.on = followToward(offset.on, target.on, k);

      if (!hovering && wakeHoldUntilRef.current > 0 && now >= wakeHoldUntilRef.current) {
        wakeHoldUntilRef.current = 0;
        target.yaw = 0;
        target.pitch = 0;
        target.on = 0;
      }

      const scroll = scrollRef.current;
      tickScrollNudge(scroll, dt, hovering, SCROLL_YAW_MAX, SCROLL_PITCH_MAX);
      const scrollQuiet = scrollNudgeQuiet(scroll);

      const atRest =
        !hovering &&
        wakeHoldUntilRef.current === 0 &&
        Math.abs(offset.yaw) < POCKET_HOVER_REST_EPS &&
        Math.abs(offset.pitch) < POCKET_HOVER_REST_EPS &&
        offset.on < ACTIVATION_EPS &&
        scrollQuiet;

      if (atRest) {
        offset.yaw = 0;
        offset.pitch = 0;
        offset.on = 0;
        resetScrollNudge(scroll);
        setPose({ yaw: BASE_YAW, pitch: BASE_PITCH, on: 0 });
        rafRef.current = 0;
        lastTickRef.current = 0;
        return;
      }

      setPose({
        yaw: BASE_YAW + offset.yaw + scroll.yaw,
        pitch: BASE_PITCH + offset.pitch + scroll.pitch,
        on: offset.on,
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
    const target = targetRef.current;
    target.yaw = WAKE_YAW;
    target.pitch = WAKE_PITCH;
    target.on = 1;
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
          targetRef.current = { yaw: 0, pitch: 0, on: 0 };
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

  const writeTarget = useCallback((event: PointerEvent<HTMLDivElement>, hovering: boolean) => {
    const el = hostRef.current;
    if (!el) return;
    const { nx, ny } = pointerNormFromRect(event.clientX, event.clientY, el.getBoundingClientRect());
    wakeHoldUntilRef.current = 0;
    const follow = pocketFollowTarget(nx, ny, FOLLOW_YAW, FOLLOW_PITCH);
    targetRef.current = { ...follow, on: hovering ? 1 : 0 };
  }, []);

  const canFollow = !reducedMotion;

  const onEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!canFollow || !pointerFollowRef.current || event.pointerType === "touch") return;
    hoveringRef.current = true;
    writeTarget(event, true);
    ensureLoop();
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canFollow || !pointerFollowRef.current || event.pointerType === "touch") return;
    hoveringRef.current = true;
    writeTarget(event, true);
    ensureLoop();
  };

  const onLeave = () => {
    hoveringRef.current = false;
    targetRef.current = { yaw: 0, pitch: 0, on: 0 };
    if (canFollow) ensureLoop();
  };

  const amberOpacity = pose.on * AMBER_OPACITY;
  const lines = refined ? REFINED : LINES[tone];

  return (
    <div
      ref={bindHost}
      className={className}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <svg
        viewBox={VIEWBOX}
        fill="none"
        aria-hidden="true"
        data-system-cube=""
        data-system-on={pose.on > 0.02 ? "1" : "0"}
        shapeRendering="geometricPrecision"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-full w-full overflow-visible ${tone === "neutral" ? FILL_VARS_NEUTRAL : FILL_VARS}`}
      >
        {drawn.fills.map((face) => (
          <path
            key={face.id}
            d={face.d}
            style={{ fill: face.fill === "rear" ? REAR_FILL[tone] : FILL[face.fill] }}
            fillOpacity={face.joint ? 0.4 * pose.on : 1}
            stroke="none"
          />
        ))}
        {refined
          ? drawn.fills.map((face) => {
              const tint = face.joint || !face.module ? undefined : REFINED.accent[face.module] ?? REFINED.lift[face.module];
              return tint ? <path key={`${face.id}-tint`} d={face.d} fill={tint} stroke="none" /> : null;
            })
          : null}
        {refined
          ? drawn.hidden.map((edge) => (
              <path
                key={edge.id}
                d={edge.d}
                stroke={edge.tier === "rear" ? REFINED.far : REFINED.hidden}
                strokeWidth={STROKE_W}
                vectorEffect="non-scaling-stroke"
              />
            ))
          : null}
        {drawn.seams.map((edge) => (
          <path
            key={edge.id}
            d={edge.d}
            stroke={lines.seam}
            strokeWidth={STROKE_W}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {drawn.silhouette.map((edge) => (
          <path
            key={edge.id}
            d={edge.d}
            stroke={lines.silhouette[edge.tier ?? "mid"]}
            strokeWidth={STROKE_W}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {drawn.links.map((edge) => (
          <path
            key={`${edge.id}-carrier`}
            d={edge.d}
            stroke={lines.carrier}
            strokeWidth={STROKE_W}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {amberOpacity > 0.02
          ? drawn.links.map((edge) => (
              <path
                key={edge.id}
                d={edge.d}
                stroke={AMBER}
                strokeOpacity={amberOpacity}
                strokeWidth={STROKE_AMBER}
                vectorEffect="non-scaling-stroke"
              />
            ))
          : null}
      </svg>
    </div>
  );
}
