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

import { drawVisualLayerCube, REST_RX, REST_RY, SILHOUETTE, VIEWBOX } from "./visualLayerGeometry";

/** System-level follow. Calmer than the Pocket Cube. Pose only. */
const FOLLOW_YAW = 0.055;
const FOLLOW_PITCH = 0.034;
const WAKE_YAW = FOLLOW_YAW * 0.55;
const WAKE_PITCH = -FOLLOW_PITCH * 0.52;
const SCROLL_YAW_MAX = FOLLOW_YAW * 0.4;
const SCROLL_PITCH_MAX = FOLLOW_PITCH * 0.38;
const SCROLL_IMPULSE_PER_PX = 0.000055;
const SCROLL_VEL_CLAMP_YAW = 0.006;
const SCROLL_VEL_CLAMP_PITCH = 0.0036;

type Props = { className?: string };

export default function VisualLayerCube({ className = "" }: Props) {
  const reducedMotion = useReducedMotion();
  const [pose, setPose] = useState({ rx: REST_RX, ry: REST_RY });
  const hoveringRef = useRef(false);
  const targetRef = useRef({ yaw: 0, pitch: 0 });
  const offsetRef = useRef({ yaw: 0, pitch: 0 });
  const rafRef = useRef(0);
  const lastTickRef = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);
  const [hostEl, setHostEl] = useState<HTMLDivElement | null>(null);
  const tickRef = useRef<() => void>(() => {});
  const wakeHoldUntilRef = useRef(0);
  const scrollRef = useRef(createScrollNudge());
  const pointerFollowRef = useRef(false);

  const drawn = useMemo(() => drawVisualLayerCube(pose.rx, pose.ry), [pose.rx, pose.ry]);

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
      const scrollQuiet = scrollNudgeQuiet(scroll);
      const atRest =
        !hovering &&
        wakeHoldUntilRef.current === 0 &&
        Math.abs(offset.yaw) < POCKET_HOVER_REST_EPS &&
        Math.abs(offset.pitch) < POCKET_HOVER_REST_EPS &&
        scrollQuiet;

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
    const el = hostRef.current;
    if (!el) return;
    const { nx, ny } = pointerNormFromRect(event.clientX, event.clientY, el.getBoundingClientRect());
    wakeHoldUntilRef.current = 0;
    targetRef.current = pocketFollowTarget(nx, ny, FOLLOW_YAW, FOLLOW_PITCH);
  }, []);

  const canFollow = !reducedMotion;

  const onEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!canFollow || !pointerFollowRef.current || event.pointerType === "touch") return;
    hoveringRef.current = true;
    writeTarget(event);
    ensureLoop();
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canFollow || !pointerFollowRef.current || event.pointerType === "touch") return;
    hoveringRef.current = true;
    writeTarget(event);
    ensureLoop();
  };

  const onLeave = () => {
    hoveringRef.current = false;
    targetRef.current = { yaw: 0, pitch: 0 };
    if (canFollow) ensureLoop();
  };

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
        data-visual-layer-cube=""
        shapeRendering="geometricPrecision"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full overflow-visible"
      >
        {drawn.faces.map((face) => (
          <path key={face.id} d={face.d} fill={face.fill} stroke={face.fill} strokeWidth={0.6} />
        ))}
        <path
          d={drawn.silhouette}
          stroke={SILHOUETTE}
          strokeWidth={0.78}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
