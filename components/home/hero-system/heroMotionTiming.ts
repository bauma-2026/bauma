/**
 * Clear Contact Lead support-transfer timing — production active path.
 */

import { clamp, smootherstep, type Point2D } from "./heroMath";
import type { SystemIntensityId } from "./heroTypes";
import type {
  CornerIndex,
  LocomotionGrammarPhaseId,
  LocomotionKeyframe,
  LocomotionIntensityTuning,
  PointerApproachId,
  SupportSet,
} from "./heroSupportMotion";
import {
  LOCOMOTION_INTENSITY,
  VERTEX_ROLE_MULTIPLIER,
  computeLocomotionMetrics,
} from "./heroSupportMotion";

export type SupportTransferTimingId = "clear-contact-lead";

export const SUPPORT_TRANSFER_POSES: LocomotionKeyframe[] = [
  pose([0, 0, 0, 0], [0, 0, 0, 0], {
    grounded: [true, true, true, true],
    reaching: null,
    receiving: null,
    label: "rest",
  }),
  pose([0.04, 0.02, 0, 0.08], [0.06, 0.05, 0.02, 0.08], {
    grounded: [true, true, true, true],
    reaching: null,
    receiving: null,
    label: "S1: BL/TL brace · TR/BR near rest",
  }),
  pose([0.06, 0.72, 0.04, 0.06], [0.08, 0.58, 0.04, 0.06], {
    grounded: [true, false, true, true],
    reaching: 1,
    receiving: null,
    label: "S2: TR reach · BL anchor",
  }),
  pose([0.1, 0.58, 0.78, 0.06], [0.1, 0.42, 0.62, 0.06], {
    grounded: [true, false, false, true],
    reaching: 1,
    receiving: 2,
    label: "S3: BR receive · lower edge pivots at BL",
  }),
  pose([0.22, 0.55, 0.62, 0.08], [0.14, 0.38, 0.48, 0.07], {
    grounded: [true, false, true, true],
    reaching: null,
    receiving: 2,
    label: "S4: weight transfer · TL follows last",
  }),
  pose([0.14, 0.35, 0.45, 0.04], [0.1, 0.26, 0.35, 0.04], {
    grounded: [true, true, true, true],
    reaching: null,
    receiving: null,
    label: "S5: asymmetric settle · BR retains most",
  }),
];

type TimingProfile = {
  keyframeTimes: number[];
  cornerGates: Record<CornerIndex, { start: number; full: number }>;
  spatialDelayStart: number;
  settleRetentionBoost: number;
};

const CLEAR_CONTACT_LEAD_PROFILE: TimingProfile = {
  keyframeTimes: [0, 0.1, 0.28, 0.48, 0.68, 1],
  cornerGates: {
    0: { start: 0.48, full: 0.58 },
    1: { start: 0.1, full: 0.28 },
    2: { start: 0.48, full: 0.58 },
    3: { start: 0, full: 0.1 },
  },
  spatialDelayStart: 0.48,
  settleRetentionBoost: 0.04,
};

function pose(
  corners: [number, number, number, number],
  depth: [number, number, number, number],
  support: SupportSet,
): LocomotionKeyframe {
  return { corners, depth, support };
}

export function grammarPhaseFromSupportEnvelope(
  envelope: number,
): LocomotionGrammarPhaseId {
  const t = CLEAR_CONTACT_LEAD_PROFILE.keyframeTimes;
  if (envelope <= t[1]) return "brace";
  if (envelope <= t[2]) return "reach";
  if (envelope <= t[3]) return "receive";
  if (envelope <= t[4]) return "transfer";
  return "settle";
}

function interpolateAtTimes(
  keyframes: LocomotionKeyframe[],
  times: number[],
  t: number,
): LocomotionKeyframe {
  const clamped = clamp(t, 0, 1);
  let segment = 0;
  for (let i = 0; i < times.length - 1; i += 1) {
    if (clamped <= times[i + 1]) {
      segment = i;
      break;
    }
    segment = i;
  }
  const t0 = times[segment];
  const t1 = times[segment + 1];
  const localT = t1 > t0 ? smootherstep((clamped - t0) / (t1 - t0)) : 0;
  const a = keyframes[segment];
  const b = keyframes[Math.min(segment + 1, keyframes.length - 1)];

  const corners = a.corners.map((value, i) =>
    value + (b.corners[i] - value) * localT,
  ) as [number, number, number, number];

  const depth = a.depth.map((value, i) =>
    value + (b.depth[i] - value) * localT,
  ) as [number, number, number, number];

  return {
    corners,
    depth,
    support: localT < 0.5 ? a.support : b.support,
  };
}

function applyCornerGates(
  keyframe: LocomotionKeyframe,
  restKeyframe: LocomotionKeyframe,
  envelope: number,
  gates: TimingProfile["cornerGates"],
): LocomotionKeyframe {
  const corners = keyframe.corners.map((target, i) => {
    const corner = i as CornerIndex;
    const gate = gates[corner];
    const rest = restKeyframe.corners[i];
    if (envelope < gate.start) return rest;
    if (envelope < gate.full) {
      const progress = smootherstep(
        (envelope - gate.start) / (gate.full - gate.start),
      );
      return rest + (target - rest) * progress;
    }
    return target;
  }) as [number, number, number, number];

  return { ...keyframe, corners };
}

const CORNER_DIRECTION: Record<CornerIndex, Point2D> = {
  0: { x: -0.35, y: -0.55 },
  1: { x: 0.72, y: -0.48 },
  2: { x: 0.58, y: 0.42 },
  3: { x: -0.28, y: 0.62 },
};

const CORNER_DEPTH_DIRECTION: Record<CornerIndex, Point2D> = {
  0: { x: -0.4, y: -0.25 },
  1: { x: 0.55, y: -0.35 },
  2: { x: 0.45, y: 0.3 },
  3: { x: -0.35, y: 0.2 },
};

function approachBias(approach: PointerApproachId): Record<CornerIndex, number> {
  switch (approach) {
    case "upper-right":
      return { 0: 0.85, 1: 1.12, 2: 0.95, 3: 0.78 };
    case "lower-right":
      return { 0: 0.82, 1: 0.88, 2: 1.1, 3: 0.92 };
    default:
      return { 0: 1, 1: 1, 2: 1, 3: 1 };
  }
}

function cornersToOffsets(
  corners: [number, number, number, number],
  tuning: LocomotionIntensityTuning,
  approach: PointerApproachId,
): [Point2D, Point2D, Point2D, Point2D] {
  const bias = approachBias(approach);
  return corners.map((strength, index) => {
    const corner = index as CornerIndex;
    const magnitude =
      tuning.vertexPeakPx * strength * VERTEX_ROLE_MULTIPLIER[corner] * bias[corner];
    const dir = CORNER_DIRECTION[corner];
    return { x: dir.x * magnitude, y: dir.y * magnitude };
  }) as [Point2D, Point2D, Point2D, Point2D];
}

function depthToOffsets(
  depth: [number, number, number, number],
  tuning: LocomotionIntensityTuning,
): [Point2D, Point2D, Point2D, Point2D] {
  return depth.map((strength, index) => {
    const corner = index as CornerIndex;
    const dir = CORNER_DEPTH_DIRECTION[corner];
    const magnitude = tuning.depthPeakPx * strength;
    return { x: dir.x * magnitude, y: dir.y * magnitude };
  }) as [Point2D, Point2D, Point2D, Point2D];
}

function computeDelayedSpatial(
  vertexOffsets: [Point2D, Point2D, Point2D, Point2D],
  tuning: LocomotionIntensityTuning,
  envelope: number,
  profile: TimingProfile,
): { translateX: number; translateY: number; rotateDeg: number } {
  if (envelope < profile.spatialDelayStart) {
    return { translateX: 0, translateY: 0, rotateDeg: 0 };
  }
  const spatialT = smootherstep(
    (envelope - profile.spatialDelayStart) / (1 - profile.spatialDelayStart),
  );
  const cx =
    vertexOffsets.reduce((sum, o) => sum + o.x, 0) / vertexOffsets.length;
  const cy =
    vertexOffsets.reduce((sum, o) => sum + o.y, 0) / vertexOffsets.length;
  return {
    translateX: cx * 0.08 * spatialT,
    translateY: cy * 0.06 * spatialT,
    rotateDeg:
      ((vertexOffsets[1].x - vertexOffsets[3].x) * 0.012 +
        (vertexOffsets[2].y - vertexOffsets[0].y) * 0.008) *
      tuning.rotatePeakDeg *
      spatialT,
  };
}

export function computeSupportTransferPose(input: {
  timing?: SupportTransferTimingId;
  intensity: SystemIntensityId;
  eventEnvelope: number;
  approach?: PointerApproachId;
  interactionBoost?: number;
}): {
  keyframe: LocomotionKeyframe;
  vertexOffsets: [Point2D, Point2D, Point2D, Point2D];
  depthOffsets: [Point2D, Point2D, Point2D, Point2D];
  spatial: { translateX: number; translateY: number; rotateDeg: number };
  grammarPhase: LocomotionGrammarPhaseId;
  settleRetention: number;
} {
  const tuning = LOCOMOTION_INTENSITY[input.intensity];
  const profile = CLEAR_CONTACT_LEAD_PROFILE;
  const envelope = clamp(input.eventEnvelope, 0, 1);

  let effectiveEnvelope = envelope;
  if (envelope >= 0.99) {
    const retention = tuning.settleRetention + profile.settleRetentionBoost;
    effectiveEnvelope =
      retention +
      (1 - retention) *
        smootherstep(
          (envelope - profile.keyframeTimes[4]) /
            (1 - profile.keyframeTimes[4]),
        );
  }

  let keyframe = interpolateAtTimes(
    SUPPORT_TRANSFER_POSES,
    profile.keyframeTimes,
    effectiveEnvelope,
  );

  keyframe = applyCornerGates(
    keyframe,
    SUPPORT_TRANSFER_POSES[0],
    envelope,
    profile.cornerGates,
  );

  const vertexOffsets = cornersToOffsets(
    keyframe.corners,
    tuning,
    input.approach ?? "default",
  );
  const depthOffsets = depthToOffsets(keyframe.depth, tuning);

  const boost = clamp(input.interactionBoost ?? 0, 0, 1);
  const scaledVertices = vertexOffsets.map((o) => ({
    x: o.x * (1 + boost * 0.35),
    y: o.y * (1 + boost * 0.35),
  })) as [Point2D, Point2D, Point2D, Point2D];

  const spatial = computeDelayedSpatial(
    scaledVertices,
    tuning,
    envelope,
    profile,
  );

  return {
    keyframe,
    vertexOffsets: scaledVertices,
    depthOffsets,
    spatial,
    grammarPhase: grammarPhaseFromSupportEnvelope(envelope),
    settleRetention: tuning.settleRetention + profile.settleRetentionBoost,
  };
}

export { computeLocomotionMetrics };
