"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

import { useReducedMotion } from "@/components/home/approach/useReducedMotion";
import {
  followToward,
  pocketHoverDt,
  pocketHoverFollowK,
  POCKET_HOVER_REST_EPS,
} from "@/lib/pocketHoverFollow";
import {
  applyScrollImpulse,
  createScrollNudge,
  pocketFollowTarget,
  pointerNormFromRect,
  POCKET_FAMILY_WAKE_HOLD_MS,
  POCKET_FAMILY_WAKE_IO_THRESHOLDS,
  POCKET_FAMILY_WAKE_LEAVE,
  POCKET_FAMILY_WAKE_VISIBLE,
  POCKET_POINTER_FOLLOW_MQ,
  resetScrollNudge,
  scrollNudgeQuiet,
  tickScrollNudge,
} from "@/lib/pocketSpatialMotion";

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
  rear: "#151310",
} as const;
const FILL_VARS =
  "[--system-fill-front:#171512] [--system-fill-side:#161411] sm:[--system-fill-front:#1a1815] sm:[--system-fill-side:#171512]";
/** Outline by camera depth — near edges carry the volume, rear edges stay quiet. */
const SILHOUETTE = {
  front: "rgba(255,255,255,0.3)",
  mid: "rgba(255,255,255,0.24)",
  rear: "rgba(255,255,255,0.17)",
} as const;
/** Interior cuts — clearly under the rear outline tier, readable on dim displays. */
const SEAM = "rgba(255,255,255,0.1)";
/** Rest T-stems (amber carriers) — a step above seams, not yet amber. */
const CARRIER = "rgba(255,255,255,0.12)";
const AMBER = "rgba(209,164,95,1)";
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
};

export default function SystemCubeObject({ className = "" }: SystemCubeObjectProps) {
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
  const sectionInViewRef = useRef(false);
  const wakeUsedRef = useRef(false);
  const wakeHoldUntilRef = useRef(0);
  const scrollRef = useRef(createScrollNudge());
  const lastScrollYRef = useRef(0);
  const pointerFollowRef = useRef(false);

  const drawn = useMemo(
    () => systemCubeDrawing(pose.yaw, pose.pitch, pose.on),
    [pose.on, pose.pitch, pose.yaw],
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
    const pointerMq = window.matchMedia(POCKET_POINTER_FOLLOW_MQ);
    const syncPointer = () => {
      pointerFollowRef.current = pointerMq.matches;
    };
    syncPointer();
    pointerMq.addEventListener("change", syncPointer);
    lastScrollYRef.current = window.scrollY;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const ratio = entry.intersectionRatio;
        sectionInViewRef.current = entry.isIntersecting && ratio > 0.02;
        if (ratio >= POCKET_FAMILY_WAKE_VISIBLE && !wakeUsedRef.current) {
          wakeUsedRef.current = true;
          startWake();
        }
        if (!entry.isIntersecting || ratio <= POCKET_FAMILY_WAKE_LEAVE) {
          wakeUsedRef.current = false;
          wakeHoldUntilRef.current = 0;
          if (!hoveringRef.current) {
            targetRef.current = { yaw: 0, pitch: 0, on: 0 };
            ensureLoop();
          }
        }
      },
      { threshold: POCKET_FAMILY_WAKE_IO_THRESHOLDS },
    );
    io.observe(root);

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastScrollYRef.current;
      lastScrollYRef.current = y;
      if (hoveringRef.current || !sectionInViewRef.current || dy === 0) {
        return;
      }
      applyScrollImpulse(
        scrollRef.current,
        dy,
        SCROLL_IMPULSE_PER_PX,
        SCROLL_VEL_CLAMP_YAW,
        SCROLL_VEL_CLAMP_PITCH,
      );
      ensureLoop();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      pointerMq.removeEventListener("change", syncPointer);
      window.removeEventListener("scroll", onScroll);
    };
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
        className={`h-full w-full overflow-visible ${FILL_VARS}`}
      >
        {drawn.fills.map((face) => (
          <path
            key={face.id}
            d={face.d}
            style={{ fill: FILL[face.fill] }}
            fillOpacity={face.joint ? 0.4 * pose.on : 1}
            stroke="none"
          />
        ))}
        {drawn.seams.map((edge) => (
          <path
            key={edge.id}
            d={edge.d}
            stroke={SEAM}
            strokeWidth={STROKE_W}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {drawn.silhouette.map((edge) => (
          <path
            key={edge.id}
            d={edge.d}
            stroke={SILHOUETTE[edge.tier ?? "mid"]}
            strokeWidth={STROKE_W}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {drawn.links.map((edge) => (
          <path
            key={`${edge.id}-carrier`}
            d={edge.d}
            stroke={CARRIER}
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
