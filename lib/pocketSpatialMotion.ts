/**
 * Shared Pocket-family spatial motion — pointer norm, scroll nudge, wake IO.
 * Amplitudes stay object-specific. Damping matches MiniNextStepCube.
 */

import { hoverFollowCurve, POCKET_HOVER_PITCH_CURVE, POCKET_HOVER_YAW_CURVE } from "./pocketHoverFollow";

export {
  followToward,
  hoverFollowCurve,
  pocketHoverDt,
  pocketHoverFollowK,
  POCKET_HOVER_DT_MAX,
  POCKET_HOVER_PITCH_CURVE,
  POCKET_HOVER_REST_EPS,
  POCKET_HOVER_TAU_ACTIVE,
  POCKET_HOVER_TAU_RETURN,
  POCKET_HOVER_YAW_CURVE,
} from "./pocketHoverFollow";

export const POCKET_SCROLL_VEL_DAMP_PER_S = 9.5;
export const POCKET_SCROLL_OFFSET_RETURN_PER_S = 5.8;
export const POCKET_SCROLL_PITCH_MIX = 0.26;
export const POCKET_SCROLL_EPS = 0.00015;

/** Pocket Cube intro uses 0.5; System/Pristop family wake uses the same band. */
export const POCKET_FAMILY_WAKE_VISIBLE = 0.45;
export const POCKET_FAMILY_WAKE_LEAVE = 0.12;
export const POCKET_FAMILY_WAKE_HOLD_MS = 820;
export const POCKET_FAMILY_IN_VIEW = 0.02;
export const POCKET_FAMILY_WAKE_IO_THRESHOLDS = [0, 0.08, 0.2, 0.35, 0.45, 0.6, 1];

export const POCKET_POINTER_FOLLOW_MQ =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

export type ScrollNudge = {
  yaw: number;
  pitch: number;
  velYaw: number;
  velPitch: number;
};

export function createScrollNudge(): ScrollNudge {
  return { yaw: 0, pitch: 0, velYaw: 0, velPitch: 0 };
}

export function resetScrollNudge(scroll: ScrollNudge) {
  scroll.yaw = 0;
  scroll.pitch = 0;
  scroll.velYaw = 0;
  scroll.velPitch = 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function pointerNormFromRect(
  clientX: number,
  clientY: number,
  rect: DOMRect,
) {
  const nx = clamp(((clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1, -1, 1);
  const ny = clamp(((clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1, -1, 1);
  return { nx, ny };
}

export function pocketFollowTarget(nx: number, ny: number, yawAmp: number, pitchAmp: number) {
  return {
    yaw: hoverFollowCurve(nx, POCKET_HOVER_YAW_CURVE.ease, POCKET_HOVER_YAW_CURVE.calm) * yawAmp,
    pitch:
      -hoverFollowCurve(ny, POCKET_HOVER_PITCH_CURVE.ease, POCKET_HOVER_PITCH_CURVE.calm) * pitchAmp,
  };
}

export function applyScrollImpulse(
  scroll: ScrollNudge,
  dy: number,
  impulsePerPx: number,
  velClampYaw: number,
  velClampPitch: number,
) {
  if (dy === 0) return;
  scroll.velYaw += -dy * impulsePerPx;
  scroll.velPitch += dy * impulsePerPx * POCKET_SCROLL_PITCH_MIX;
  scroll.velYaw = clamp(scroll.velYaw, -velClampYaw, velClampYaw);
  scroll.velPitch = clamp(scroll.velPitch, -velClampPitch, velClampPitch);
}

export function tickScrollNudge(
  scroll: ScrollNudge,
  dt: number,
  hovering: boolean,
  maxYaw: number,
  maxPitch: number,
) {
  const returnK = 1 - Math.exp(-POCKET_SCROLL_OFFSET_RETURN_PER_S * dt);
  if (hovering) {
    scroll.yaw += (0 - scroll.yaw) * returnK;
    scroll.pitch += (0 - scroll.pitch) * returnK;
    scroll.velYaw = 0;
    scroll.velPitch = 0;
    return;
  }
  const velDamp = Math.exp(-POCKET_SCROLL_VEL_DAMP_PER_S * dt);
  scroll.yaw += scroll.velYaw;
  scroll.pitch += scroll.velPitch;
  scroll.velYaw *= velDamp;
  scroll.velPitch *= velDamp;
  scroll.yaw += (0 - scroll.yaw) * returnK;
  scroll.pitch += (0 - scroll.pitch) * returnK;
  scroll.yaw = clamp(scroll.yaw, -maxYaw, maxYaw);
  scroll.pitch = clamp(scroll.pitch, -maxPitch, maxPitch);
}

export function scrollNudgeQuiet(scroll: ScrollNudge, eps = POCKET_SCROLL_EPS) {
  return (
    Math.abs(scroll.yaw) < eps &&
    Math.abs(scroll.pitch) < eps &&
    Math.abs(scroll.velYaw) < eps &&
    Math.abs(scroll.velPitch) < eps
  );
}

/** Shared viewport wiring for Pristop/System. Pocket Cube keeps its own intro IO + mobile-only scroll. */
export function subscribePocketFamilyMotion(args: {
  root: Element;
  getHovering: () => boolean;
  onPointerFollowChange: (enabled: boolean) => void;
  onWake: () => void;
  onLeaveView: () => void;
  onScrollImpulse: (dy: number) => void;
}) {
  const pointerMq = window.matchMedia(POCKET_POINTER_FOLLOW_MQ);
  const syncPointer = () => {
    args.onPointerFollowChange(pointerMq.matches);
  };
  syncPointer();
  pointerMq.addEventListener("change", syncPointer);

  let lastScrollY = window.scrollY;
  let inView = false;
  let wakeUsed = false;

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;
      const ratio = entry.intersectionRatio;
      inView = entry.isIntersecting && ratio > POCKET_FAMILY_IN_VIEW;
      if (ratio >= POCKET_FAMILY_WAKE_VISIBLE && !wakeUsed) {
        wakeUsed = true;
        args.onWake();
      }
      if (!entry.isIntersecting || ratio <= POCKET_FAMILY_WAKE_LEAVE) {
        wakeUsed = false;
        args.onLeaveView();
      }
    },
    { threshold: POCKET_FAMILY_WAKE_IO_THRESHOLDS },
  );
  io.observe(args.root);

  const onScroll = () => {
    const y = window.scrollY;
    const dy = y - lastScrollY;
    lastScrollY = y;
    if (args.getHovering() || !inView || dy === 0) return;
    args.onScrollImpulse(dy);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    io.disconnect();
    pointerMq.removeEventListener("change", syncPointer);
    window.removeEventListener("scroll", onScroll);
  };
}
