/**
 * One Envelope — single shared envelope drives pose, depth, amber, and resolve.
 */

import { BALANCED_AMBER } from "../heroAccent";
import { clamp, smootherstep, type Point2D } from "../heroMath";
import {
  computeSupportTransferPose,
  type SupportTransferTimingId,
} from "../heroMotionTiming";
import { COUPLING_RESOLVE_START, type ProximityResponse } from "../heroPointerJourney";
import type {
  CornerIndex,
  LocomotionGrammarPhaseId,
  PointerApproachId,
} from "../heroSupportMotion";
import type { HeroPhase, SystemIntensityId } from "../heroTypes";

/** Hero-scale locomotion amplitude (~65% of locomotion-study peak). */
export const ONE_ENVELOPE_HERO_SCALE = 0.65;

/** Resolve blends in over the final 20% of the shared envelope. */
export const ONE_ENVELOPE_RESOLVE_START = COUPLING_RESOLVE_START;

export const ONE_ENVELOPE_PRIMARY_REST = 0.84;
export const ONE_ENVELOPE_PRIMARY_ACTIVE = 0.8;
export const ONE_ENVELOPE_DEPTH_OPACITY = 0.36;

export type OneEnvelopeAmber = {
  visible: boolean;
  corner: CornerIndex | null;
  opacity: number;
};

export type OneEnvelopeFrame = {
  envelope: number;
  locomotionEnvelope: number;
  resolveBlend: number;
  vertexOffsets: [Point2D, Point2D, Point2D, Point2D];
  depthOffsets: [Point2D, Point2D, Point2D, Point2D];
  spatial: { translateX: number; translateY: number; rotateDeg: number };
  grammarPhase: LocomotionGrammarPhaseId;
  amber: OneEnvelopeAmber;
  primaryOpacity: number;
  depthOpacity: number;
  resolveProgress: number;
  proximityOnly: boolean;
  supportReaching: CornerIndex | null;
  supportReceiving: CornerIndex | null;
};

function scaleOffsets(
  offsets: [Point2D, Point2D, Point2D, Point2D],
  scale: number,
): [Point2D, Point2D, Point2D, Point2D] {
  return offsets.map((o) => ({
    x: o.x * scale,
    y: o.y * scale,
  })) as [Point2D, Point2D, Point2D, Point2D];
}

function scaleSpatial(
  spatial: { translateX: number; translateY: number; rotateDeg: number },
  scale: number,
) {
  return {
    translateX: spatial.translateX * scale,
    translateY: spatial.translateY * scale,
    rotateDeg: spatial.rotateDeg * scale,
  };
}

function addOffsets(
  a: [Point2D, Point2D, Point2D, Point2D],
  b: [Point2D, Point2D, Point2D, Point2D],
): [Point2D, Point2D, Point2D, Point2D] {
  return a.map((offset, index) => ({
    x: offset.x + b[index].x,
    y: offset.y + b[index].y,
  })) as [Point2D, Point2D, Point2D, Point2D];
}

/** One normalized envelope for the full hover journey (legacy phase path). */
export function computeSharedEnvelope(input: {
  phase: HeroPhase;
  engagement: number;
  fadeProgress: number;
}): number {
  const { phase, engagement, fadeProgress } = input;

  if (phase === "rest") return 0;

  if (phase === "recognition") {
    return smootherstep(clamp(engagement / 0.05, 0, 1)) * 0.07;
  }

  if (phase === "engagement") {
    return 0.07 + smootherstep(clamp(engagement, 0, 1)) * 0.73;
  }

  if (phase === "resolution") {
    if (fadeProgress > 0.001) {
      return clamp(1 - fadeProgress * 0.12, 0.82, 1);
    }
    return 0.82 + smootherstep(clamp(engagement, 0, 1)) * 0.18;
  }

  if (phase === "release") {
    return clamp(0.88 - fadeProgress * 0.35, 0.45, 0.88);
  }

  return 0;
}

function amberFromPose(
  envelope: number,
  grammarPhase: LocomotionGrammarPhaseId,
  reaching: CornerIndex | null,
  receiving: CornerIndex | null,
  fadeProgress: number,
  phase: HeroPhase,
  proximityOnly: boolean,
): OneEnvelopeAmber {
  const hidden: OneEnvelopeAmber = {
    visible: false,
    corner: null,
    opacity: 0,
  };

  if (envelope < 0.09) return hidden;
  if (proximityOnly) return hidden;
  if (grammarPhase === "brace" || grammarPhase === "idle") return hidden;

  const corner = reaching ?? receiving;
  if (corner === null) return hidden;

  let opacity = BALANCED_AMBER.opacity;
  if (phase === "resolution" || phase === "release") {
    opacity = BALANCED_AMBER.opacity * (1 - fadeProgress * 0.9);
  }
  if (opacity < 0.04) return hidden;

  return { visible: true, corner, opacity };
}

export function computeOneEnvelopeFrame(input: {
  phase: HeroPhase;
  engagement: number;
  fadeProgress: number;
  intensity?: SystemIntensityId;
  timing?: SupportTransferTimingId;
  coupledEnvelope?: number;
  approach?: PointerApproachId;
  proximityResponse?: ProximityResponse | null;
  proximityOnly?: boolean;
}): OneEnvelopeFrame {
  const intensity = input.intensity ?? "medium";
  const timing = input.timing ?? "clear-contact-lead";
  const proximityOnly = input.proximityOnly ?? false;

  const envelope =
    input.coupledEnvelope !== undefined
      ? clamp(input.coupledEnvelope, 0, 1)
      : computeSharedEnvelope(input);

  const poseIntensity =
    input.coupledEnvelope !== undefined && envelope > 0.22
      ? envelope > 0.55
        ? ("review-high" as SystemIntensityId)
        : ("medium" as SystemIntensityId)
      : intensity;

  const resolveBlend =
    envelope <= ONE_ENVELOPE_RESOLVE_START
      ? 0
      : smootherstep(
          (envelope - ONE_ENVELOPE_RESOLVE_START) /
            (1 - ONE_ENVELOPE_RESOLVE_START),
        );

  const locomotionEnvelope =
    envelope <= ONE_ENVELOPE_RESOLVE_START
      ? envelope / ONE_ENVELOPE_RESOLVE_START
      : 1;

  const pose =
    envelope <= 0.001
      ? null
      : computeSupportTransferPose({
          timing,
          intensity: poseIntensity,
          eventEnvelope: locomotionEnvelope,
          approach: input.approach ?? "default",
          interactionBoost:
            input.coupledEnvelope !== undefined
              ? clamp((envelope - 0.12) / 0.55, 0, 1) * 0.42
              : 0,
        });

  const poseVertexOffsets = pose
    ? scaleOffsets(
        pose.vertexOffsets,
        ONE_ENVELOPE_HERO_SCALE *
          (input.coupledEnvelope !== undefined
            ? 1 + clamp((envelope - 0.1) / 0.55, 0, 1) * 0.58
            : 1),
      )
    : ([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ] as [Point2D, Point2D, Point2D, Point2D]);

  const poseDepthOffsets = pose
    ? scaleOffsets(
        pose.depthOffsets,
        ONE_ENVELOPE_HERO_SCALE *
          (input.coupledEnvelope !== undefined
            ? 1 + clamp((envelope - 0.1) / 0.55, 0, 1) * 0.48
            : 1),
      )
    : ([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ] as [Point2D, Point2D, Point2D, Point2D]);

  const proximity = input.proximityResponse;
  const vertexOffsets = proximity
    ? addOffsets(poseVertexOffsets, proximity.vertexOffsets)
    : poseVertexOffsets;
  const depthOffsets = proximity
    ? addOffsets(poseDepthOffsets, proximity.depthOffsets)
    : poseDepthOffsets;

  const spatial = pose
    ? scaleSpatial(pose.spatial, ONE_ENVELOPE_HERO_SCALE)
    : { translateX: 0, translateY: 0, rotateDeg: 0 };

  const amber = pose
    ? amberFromPose(
        envelope,
        pose.grammarPhase,
        pose.keyframe.support.reaching,
        pose.keyframe.support.receiving,
        input.fadeProgress,
        input.phase,
        proximityOnly,
      )
    : {
        visible: false,
        corner: null,
        opacity: 0,
      };

  const active =
    envelope > 0.001 && !proximityOnly && input.phase !== "rest";

  return {
    envelope,
    locomotionEnvelope,
    resolveBlend,
    vertexOffsets,
    depthOffsets,
    spatial,
    grammarPhase: pose?.grammarPhase ?? "idle",
    amber,
    primaryOpacity:
      proximityOnly || !active
        ? ONE_ENVELOPE_PRIMARY_REST
        : ONE_ENVELOPE_PRIMARY_ACTIVE,
    depthOpacity: ONE_ENVELOPE_DEPTH_OPACITY,
    resolveProgress: resolveBlend,
    proximityOnly,
    supportReaching: pose?.keyframe.support.reaching ?? null,
    supportReceiving: pose?.keyframe.support.receiving ?? null,
  };
}
