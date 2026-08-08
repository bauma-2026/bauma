import type { SystemIntensityId } from "./heroTypes";
import type { Point2D } from "./heroMath";

/** 0=TL · 1=TR · 2=BR · 3=BL */
export type CornerIndex = 0 | 1 | 2 | 3;

export type LocomotionGrammarPhaseId =
  | "idle"
  | "brace"
  | "reach"
  | "receive"
  | "transfer"
  | "settle";

export type PointerApproachId =
  | "upper-right"
  | "lower-right"
  | "center"
  | "default";

export type SupportSet = {
  grounded: [boolean, boolean, boolean, boolean];
  reaching: CornerIndex | null;
  receiving: CornerIndex | null;
  label: string;
};

export type LocomotionKeyframe = {
  corners: [number, number, number, number];
  depth: [number, number, number, number];
  support: SupportSet;
};

export type LocomotionIntensityTuning = {
  vertexPeakPx: number;
  centroidPeakPx: number;
  rotatePeakDeg: number;
  depthPeakPx: number;
  settleRetention: number;
};

/** Vertex role displacement multipliers (relative to intensity peak). */
export const VERTEX_ROLE_MULTIPLIER: Record<CornerIndex, number> = {
  0: 0.62,
  1: 1.0,
  2: 0.82,
  3: 0.38,
};

export const LOCOMOTION_INTENSITY: Record<
  SystemIntensityId,
  LocomotionIntensityTuning
> = {
  low: {
    vertexPeakPx: 1.5,
    centroidPeakPx: 0.8,
    rotatePeakDeg: 0.2,
    depthPeakPx: 0.4,
    settleRetention: 0.12,
  },
  medium: {
    vertexPeakPx: 3.2,
    centroidPeakPx: 1.6,
    rotatePeakDeg: 0.28,
    depthPeakPx: 0.9,
    settleRetention: 0.15,
  },
  "review-high": {
    vertexPeakPx: 4.5,
    centroidPeakPx: 2.5,
    rotatePeakDeg: 0.35,
    depthPeakPx: 1.4,
    settleRetention: 0.18,
  },
};

export function pointerToApproach(
  pointerX: number,
  pointerY: number,
): PointerApproachId {
  if (pointerX > 0.18 && pointerY < -0.08) return "upper-right";
  if (pointerX > 0.12 && pointerY > 0.12) return "lower-right";
  if (Math.abs(pointerX) < 0.12 && Math.abs(pointerY) < 0.12) return "center";
  return "default";
}

export function computeLocomotionMetrics(
  vertexOffsets: [Point2D, Point2D, Point2D, Point2D],
) {
  return {
    maxVertexDisplacement: Math.max(
      ...vertexOffsets.map((o) => Math.hypot(o.x, o.y)),
    ),
  };
}
