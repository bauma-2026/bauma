import { POSE_PARAMS, type PoseParams } from "./spatialPose";

/**
 * S1 ↔ S2 Field Force lock — pose-parameter interaction (not 2D morph).
 * Rest = S1. Far = S2. Depth vector locked. Angular midpoint path retained.
 */

export type ShiftBlend = number; // 0 = S1, 1 = S2

/** Mapping / damping micro-variants (B/C retained under Dev only). */
export type ShiftMode = "A" | "B" | "C";

export const SHIFT_LABELS: Record<ShiftMode, string> = {
  A: "A Field Force",
  B: "B Lateral Bias",
  C: "C Quiet Follow",
};

/** Locked interaction baseline. */
export const LOCKED_SHIFT_MODE: ShiftMode = "A";

/**
 * Locked Field Force damping (no spring).
 * Approach: quick recognition without cursor chase.
 * Release: calmer return to exact S1.
 */
export const FIELD_FORCE_DAMPING = {
  approachLambda: 11, // within 10–12
  releaseLambda: 6, // within 5–7
} as const;

/** Legacy per-mode damping (Dev comparison only). */
export const SHIFT_DAMPING: Record<ShiftMode, number> = {
  A: FIELD_FORCE_DAMPING.approachLambda,
  B: FIELD_FORCE_DAMPING.approachLambda,
  C: 6.5,
};

/**
 * Ambient travels a small fraction of the S1→S2 path.
 * Never near midpoint; enough to read spatial life.
 */
export const AMBIENT_PATH_AMPLITUDE = 0.08; // 8% of full path

export type AmbientPhase =
  | "idle"
  | "shift"
  | "hold"
  | "return"
  | "suppressed";

export type MotionAuthority = "rest" | "ambient" | "interaction" | "return";

/** Seconds — slight random within ranges; geometry direction never randomized. */
export const AMBIENT_TIMING = {
  initialIdle: [14, 26] as const,
  shift: [0.75, 1.05] as const,
  hold: [0.55, 0.9] as const,
  return: [1.35, 1.85] as const,
  nextIdle: [18, 34] as const,
  postInteractionCalm: [8, 12] as const,
};

/** Ambient Fast: idle / calm only — shift/hold/return durations unchanged. */
export const AMBIENT_FAST_IDLE = {
  initialIdle: [1.2, 2.2] as const,
  nextIdle: [1.6, 2.8] as const,
  postInteractionCalm: [1.0, 1.6] as const,
};

export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function randInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function easeInOutCubic(t: number) {
  const u = clamp01(t);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}

/**
 * Normalize pointer in the interaction field to nx,ny ∈ [-1,1]
 * (origin = field centre, +x right, +y down).
 */
export function normalizeFieldPointer(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { nx: number; ny: number } {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const nx = rect.width > 0 ? (2 * (clientX - cx)) / rect.width : 0;
  const ny = rect.height > 0 ? (2 * (clientY - cy)) / rect.height : 0;
  return {
    nx: Math.min(1, Math.max(-1, nx)),
    ny: Math.min(1, Math.max(-1, ny)),
  };
}

/**
 * Map normalized pointer → blend t ∈ [0,1].
 * Locked Field Force (A): right/up → S2, left/down → S1.
 */
export function targetBlendFromPointer(
  nx: number,
  ny: number,
  mode: ShiftMode = LOCKED_SHIFT_MODE,
): ShiftBlend {
  // ny down-positive; upper = negative ny → favors S2
  if (mode === "B") {
    return clamp01(0.5 + 0.55 * nx - 0.22 * ny);
  }
  // A & C — Field Force map (locked)
  return clamp01(0.5 + 0.42 * nx - 0.38 * ny);
}

export function dampToward(
  current: number,
  target: number,
  dtSec: number,
  lambda: number,
): number {
  // exponential smoothing — no spring overshoot
  const k = 1 - Math.exp(-lambda * Math.max(0, dtSec));
  return current + (target - current) * k;
}

/**
 * Blend S1→S2 by rotating the (yaw, pitch) vector at near-constant magnitude.
 * Linear angle lerp would pass near (0,0) and collapse projected depth mid-path.
 */
export function poseParamsFromBlend(t: ShiftBlend): PoseParams {
  const a = POSE_PARAMS.S1;
  const b = POSE_PARAMS.S2;
  const u = clamp01(t);

  const magA = Math.hypot(a.yawDeg, a.pitchDeg);
  const magB = Math.hypot(b.yawDeg, b.pitchDeg);
  const angA = Math.atan2(a.pitchDeg, a.yawDeg);
  const angB = Math.atan2(b.pitchDeg, b.yawDeg);

  let dAng = angB - angA;
  while (dAng > Math.PI) dAng -= Math.PI * 2;
  while (dAng < -Math.PI) dAng += Math.PI * 2;

  const ang = angA + dAng * u;
  const mag = magA + (magB - magA) * u;

  return {
    yawDeg: mag * Math.cos(ang),
    pitchDeg: mag * Math.sin(ang),
    rollDeg: a.rollDeg + (b.rollDeg - a.rollDeg) * u,
    depth: { ...a.depth },
    scale: 1,
    globalTiltDeg: a.globalTiltDeg,
  };
}

export function nearestPoseLabel(t: ShiftBlend): "S1" | "S2" | "mid" {
  if (t < 0.22) return "S1";
  if (t > 0.78) return "S2";
  return "mid";
}

export function joinLengthsFromSample(joins: {
  upperRight: { a: { x: number; y: number }; b: { x: number; y: number } };
  lowerRight: { a: { x: number; y: number }; b: { x: number; y: number } };
  lowerLeft: { a: { x: number; y: number }; b: { x: number; y: number } };
  upperLeft: { a: { x: number; y: number }; b: { x: number; y: number } };
}) {
  const len = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(b.x - a.x, b.y - a.y);
  return {
    upperRight: len(joins.upperRight.a, joins.upperRight.b),
    lowerRight: len(joins.lowerRight.a, joins.lowerRight.b),
    lowerLeft: len(joins.lowerLeft.a, joins.lowerLeft.b),
    upperLeft: len(joins.upperLeft.a, joins.upperLeft.b),
  };
}
