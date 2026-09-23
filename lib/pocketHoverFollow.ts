/**
 * Pocket Cube hover-follow response (`MiniNextStepCube` `tickDecay`).
 * Shared so Pristop V2 uses the same damping family — not a third model.
 *
 * Pose is never assigned from the pointer. Pointer writes a target;
 * current offset eases toward it with a dt-normalized exponential:
 *   k = 1 - exp(-dt / tau)
 *   tau = 0.08s while hovering, 0.16s on return.
 */

export const POCKET_HOVER_TAU_ACTIVE = 0.08;
export const POCKET_HOVER_TAU_RETURN = 0.16;
/** Cube `tickDecay` dt clamp — keep follow independent of a stalled frame. */
export const POCKET_HOVER_DT_MAX = 0.05;
export const POCKET_HOVER_REST_EPS = 0.0005;

/** `hoverFollowCurve(nx, 2.25, 0.2)` in MiniNextStepCube. */
export const POCKET_HOVER_YAW_CURVE = { ease: 2.25, calm: 0.2 } as const;
/** `hoverFollowCurve(ny, 1.85, 0.52)` in MiniNextStepCube. */
export const POCKET_HOVER_PITCH_CURVE = { ease: 1.85, calm: 0.52 } as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

/** Calm at center, assertive through mid travel, eases into max. */
export function hoverFollowCurve(n: number, ease: number, calm: number) {
  const s = n < 0 ? -1 : n > 0 ? 1 : 0;
  const u = clamp(Math.abs(n), 0, 1);
  const out = 1 - Math.pow(1 - u, ease);
  return s * (calm * smoothstep(u) + (1 - calm) * out);
}

export function pocketHoverDt(now: number, previous: number) {
  return Math.min(Math.max(now - previous, 0) / 1000, POCKET_HOVER_DT_MAX);
}

export function pocketHoverFollowK(dtSeconds: number, hovering: boolean) {
  const tau = hovering ? POCKET_HOVER_TAU_ACTIVE : POCKET_HOVER_TAU_RETURN;
  return 1 - Math.exp(-dtSeconds / tau);
}

export function followToward(current: number, target: number, k: number) {
  return current + (target - current) * k;
}
