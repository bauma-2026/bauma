"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

import { useReducedMotion } from "@/components/home/approach/useReducedMotion";
import {
  followToward,
  hoverFollowCurve,
  pocketHoverDt,
  pocketHoverFollowK,
  POCKET_HOVER_PITCH_CURVE,
  POCKET_HOVER_REST_EPS,
  POCKET_HOVER_YAW_CURVE,
} from "@/lib/pocketHoverFollow";

import { MINI_OBJECT_FILL, MINI_OBJECT_STROKE, mixHex } from "./miniObjectMaterial";
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
 * Visual Layer cassette as primary material reference.
 * Cassette front is `#181613` / rear `#161411`. System sits one step lighter.
 */
const CHARCOAL_BG = "#12100d";
const FILL = {
  front: mixHex(MINI_OBJECT_FILL.side, MINI_OBJECT_FILL.rear, 0.28),
  side: MINI_OBJECT_FILL.rear,
  rear: mixHex(MINI_OBJECT_FILL.rear, CHARCOAL_BG, 0.25),
} as const;
/** VL secondary — softer rim than prior 0.31 wire. */
const SILHOUETTE = MINI_OBJECT_STROKE.secondary;
/** Interior cuts — quieter than silhouette 0.21, readable on dim displays. */
const SEAM = "rgba(255,255,255,0.086)";
/** Rest T-stems (amber carriers) — a step above seams, not yet amber. */
const CARRIER = "rgba(255,255,255,0.105)";
const AMBER = "rgba(209,164,95,1)";
const AMBER_OPACITY = 0.72;
const ACTIVATION_EPS = 0.002;
const SCROLL_EPS = 0.00015;

/** One-shot section-enter: existing open + amber, then rest. */
const WAKE_YAW = FOLLOW_YAW * 0.55;
const WAKE_PITCH = -FOLLOW_PITCH * 0.52;
const WAKE_VISIBLE = 0.45;
const WAKE_LEAVE = 0.12;
const WAKE_HOLD_MS = 820;

/**
 * Pocket Cube scroll nudge, scaled under System hover
 * (`FOLLOW_YAW` 0.055 / `FOLLOW_PITCH` 0.034). Desktop only.
 */
const SCROLL_YAW_MAX = FOLLOW_YAW * 0.4;
const SCROLL_PITCH_MAX = FOLLOW_PITCH * 0.38;
const SCROLL_IMPULSE_PER_PX = 0.000055;
const SCROLL_VEL_DAMP_PER_S = 9.5;
const SCROLL_OFFSET_RETURN_PER_S = 5.8;
const SCROLL_VEL_CLAMP_YAW = 0.006;
const SCROLL_VEL_CLAMP_PITCH = 0.0036;
const SCROLL_PITCH_MIX = 0.26;
const DESKTOP_MOTION_MQ = "(min-width: 1024px)";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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
  const scrollRef = useRef({ yaw: 0, pitch: 0, velYaw: 0, velPitch: 0 });
  const lastScrollYRef = useRef(0);
  const desktopMotionRef = useRef(false);

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
      if (!hovering) {
        const velDamp = Math.exp(-SCROLL_VEL_DAMP_PER_S * dt);
        scroll.yaw += scroll.velYaw;
        scroll.pitch += scroll.velPitch;
        scroll.velYaw *= velDamp;
        scroll.velPitch *= velDamp;
        const returnK = 1 - Math.exp(-SCROLL_OFFSET_RETURN_PER_S * dt);
        scroll.yaw += (0 - scroll.yaw) * returnK;
        scroll.pitch += (0 - scroll.pitch) * returnK;
        scroll.yaw = clamp(scroll.yaw, -SCROLL_YAW_MAX, SCROLL_YAW_MAX);
        scroll.pitch = clamp(scroll.pitch, -SCROLL_PITCH_MAX, SCROLL_PITCH_MAX);
      } else {
        const returnK = 1 - Math.exp(-SCROLL_OFFSET_RETURN_PER_S * dt);
        scroll.yaw += (0 - scroll.yaw) * returnK;
        scroll.pitch += (0 - scroll.pitch) * returnK;
        scroll.velYaw = 0;
        scroll.velPitch = 0;
      }

      const scrollQuiet =
        Math.abs(scroll.yaw) < SCROLL_EPS &&
        Math.abs(scroll.pitch) < SCROLL_EPS &&
        Math.abs(scroll.velYaw) < SCROLL_EPS &&
        Math.abs(scroll.velPitch) < SCROLL_EPS;

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
        scroll.yaw = 0;
        scroll.pitch = 0;
        scroll.velYaw = 0;
        scroll.velPitch = 0;
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
    wakeHoldUntilRef.current = performance.now() + WAKE_HOLD_MS;
    ensureLoop();
  }, [ensureLoop]);

  const bindHost = useCallback((node: HTMLDivElement | null) => {
    hostRef.current = node;
    setHostEl(node);
  }, []);

  useEffect(() => {
    if (reducedMotion || !hostEl || typeof IntersectionObserver === "undefined") return;
    const root = hostEl.closest("section") ?? hostEl;
    const desktopMq = window.matchMedia(DESKTOP_MOTION_MQ);
    const syncDesktop = () => {
      desktopMotionRef.current = desktopMq.matches;
    };
    syncDesktop();
    desktopMq.addEventListener("change", syncDesktop);
    lastScrollYRef.current = window.scrollY;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const ratio = entry.intersectionRatio;
        sectionInViewRef.current = entry.isIntersecting && ratio > 0.02;
        if (ratio >= WAKE_VISIBLE && !wakeUsedRef.current && desktopMotionRef.current) {
          wakeUsedRef.current = true;
          startWake();
        }
        if (!entry.isIntersecting || ratio <= WAKE_LEAVE) {
          wakeUsedRef.current = false;
          wakeHoldUntilRef.current = 0;
          if (!hoveringRef.current) {
            targetRef.current = { yaw: 0, pitch: 0, on: 0 };
            ensureLoop();
          }
        }
      },
      { threshold: [0, 0.08, 0.2, 0.35, 0.45, 0.6, 1] },
    );
    io.observe(root);

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastScrollYRef.current;
      lastScrollYRef.current = y;
      if (
        !desktopMotionRef.current ||
        hoveringRef.current ||
        !sectionInViewRef.current ||
        dy === 0
      ) {
        return;
      }
      const scroll = scrollRef.current;
      scroll.velYaw += -dy * SCROLL_IMPULSE_PER_PX;
      scroll.velPitch += dy * SCROLL_IMPULSE_PER_PX * SCROLL_PITCH_MIX;
      scroll.velYaw = clamp(scroll.velYaw, -SCROLL_VEL_CLAMP_YAW, SCROLL_VEL_CLAMP_YAW);
      scroll.velPitch = clamp(
        scroll.velPitch,
        -SCROLL_VEL_CLAMP_PITCH,
        SCROLL_VEL_CLAMP_PITCH,
      );
      ensureLoop();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      desktopMq.removeEventListener("change", syncDesktop);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ensureLoop, hostEl, reducedMotion, startWake]);

  const writeTarget = useCallback((event: PointerEvent<HTMLDivElement>, hovering: boolean) => {
    const el = hostRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = Math.min(1, Math.max(-1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.min(1, Math.max(-1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    wakeHoldUntilRef.current = 0;
    targetRef.current = {
      yaw: hoverFollowCurve(nx, POCKET_HOVER_YAW_CURVE.ease, POCKET_HOVER_YAW_CURVE.calm) * FOLLOW_YAW,
      pitch:
        -hoverFollowCurve(ny, POCKET_HOVER_PITCH_CURVE.ease, POCKET_HOVER_PITCH_CURVE.calm) *
        FOLLOW_PITCH,
      on: hovering ? 1 : 0,
    };
  }, []);

  const canFollow = !reducedMotion;

  const onEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!canFollow || event.pointerType === "touch") return;
    hoveringRef.current = true;
    writeTarget(event, true);
    ensureLoop();
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canFollow || event.pointerType === "touch") return;
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
        className="h-full w-full overflow-visible"
      >
        {drawn.fills.map((face) => (
          <path
            key={face.id}
            d={face.d}
            fill={FILL[face.fill]}
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
            stroke={SILHOUETTE}
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
