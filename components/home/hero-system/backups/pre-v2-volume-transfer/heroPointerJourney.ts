/**
 * Continuous pointer intent → shared envelope (One Envelope architecture).
 */

import { clamp, smootherstep, type Point2D } from "./heroMath";
import {
  pointerToApproach,
  type CornerIndex,
  type PointerApproachId,
} from "./heroSupportMotion";
import type { HeroPhase } from "./heroTypes";

/** Form anchor in normalized visual-column space (form centroid at rest). */
export const FORM_ANCHOR = { x: 0, y: -0.04 };

/** Proximity felt before tight active region. */
export const PROXIMITY_MAX_DISTANCE = 0.95;
export const ACTIVE_REGION_RADIUS = 0.48;

export const COUPLING_RECOGNITION_MAX = 0.2;
export const COUPLING_ENGAGEMENT_MAX = 0.72;
export const COUPLING_COMMITMENT_START = 0.72;
export const COUPLING_RESOLVE_START = 0.8;

export const PROXIMITY_DISPLACEMENT_MIN = 0.5;
export const PROXIMITY_DISPLACEMENT_MAX = 1.5;

export type CouplingPhaseId =
  | "rest"
  | "proximity"
  | "recognition"
  | "engagement"
  | "commitment"
  | "release";

export type JourneySource = "cta" | "object";

/** Brief recognition before object journey locks to the shared active path. */
export const OBJECT_JOURNEY_ACTIVATION_MS = 50;

export type ActiveJourneyTrigger = {
  source: JourneySource;
  initialApproach?: PointerApproachId;
  initialCorner?: CornerIndex;
};

export type PointerCouplingInputs = {
  pointerActive: boolean;
  pointerX: number;
  pointerY: number;
  ctaHovered: boolean;
};

export type ProximityResponse = {
  vertexOffsets: [Point2D, Point2D, Point2D, Point2D];
  depthOffsets: [Point2D, Point2D, Point2D, Point2D];
  nearestCorner: CornerIndex;
};

export type PointerCouplingState = {
  envelope: number;
  envelopeVelocity: number;
  targetEnvelope: number;
  intent: number;
  proximity: number;
  regionDepth: number;
  couplingPhase: CouplingPhaseId;
  approach: PointerApproachId;
  selectedCorner: CornerIndex;
  persistence: number;
  commitment: number;
  pointerVelocity: number;
  proximityOnly: boolean;
  proximityResponse: ProximityResponse | null;
  legacyPhase: HeroPhase;
  journeyActive: boolean;
  journeySource: JourneySource | null;
  /** Signal audit breakdown (live debug). */
  diagnostics: PointerCouplingDiagnostics;
};

export type PointerCouplingDiagnostics = {
  dwellContribution: number;
  velocityFactor: number;
  depthContribution: number;
  proximityContribution: number;
  directionContribution: number;
  locomotionEnvelope: number;
  maxVertexPx: number;
  maxDepthPx: number;
  resolveBlend: number;
  supportReaching: CornerIndex | null;
  supportReceiving: CornerIndex | null;
};

export type PointerCouplingTuning = {
  springStiffness: number;
  springDamping: number;
  releaseDamping: number;
  ctaIntentBoost: number;
  ctaCommitmentBoost: number;
  leftSideRestraint: number;
  dwellMsForEngagement: number;
  persistenceMsForCommitment: number;
};

export const POINTER_COUPLING_TUNING: PointerCouplingTuning = {
  springStiffness: 11,
  springDamping: 5.8,
  releaseDamping: 4.4,
  ctaIntentBoost: 0.22,
  ctaCommitmentBoost: 0.14,
  leftSideRestraint: 0.52,
  dwellMsForEngagement: 85,
  persistenceMsForCommitment: 420,
};

/** Corner positions in normalized pointer space (form centroid at FORM_ANCHOR). */
const CORNER_ANCHORS: Record<CornerIndex, Point2D> = {
  0: { x: -0.26, y: -0.3 },
  1: { x: 0.24, y: -0.26 },
  2: { x: 0.2, y: 0.2 },
  3: { x: -0.28, y: 0.16 },
};

const CORNER_DIRECTION: Record<CornerIndex, Point2D> = {
  0: { x: -0.35, y: -0.55 },
  1: { x: 0.72, y: -0.48 },
  2: { x: 0.58, y: 0.42 },
  3: { x: -0.28, y: 0.62 },
};

const CORNER_DEPTH_DIRECTION: Record<CornerIndex, Point2D> = {
  0: { x: -0.22, y: -0.18 },
  1: { x: 0.28, y: -0.14 },
  2: { x: 0.24, y: 0.2 },
  3: { x: -0.18, y: 0.16 },
};

const ZERO_OFFSETS: [Point2D, Point2D, Point2D, Point2D] = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

export type PointerCouplingRefs = {
  persistenceMs: number;
  dwellMs: number;
  lastPointer: { x: number; y: number; t: number };
  exitVelocity: number;
  wasActive: boolean;
  journeyActive: boolean;
  journeySource: JourneySource | null;
  frozenApproach: PointerApproachId;
  frozenCorner: CornerIndex;
};

export function emptyPointerCouplingRefs(): PointerCouplingRefs {
  return {
    persistenceMs: 0,
    dwellMs: 0,
    lastPointer: { x: 0, y: 0, t: 0 },
    exitVelocity: 0,
    wasActive: false,
    journeyActive: false,
    journeySource: null,
    frozenApproach: "default",
    frozenCorner: 1,
  };
}

/** Lock CTA and object hover onto one authored Clear Contact Lead journey. */
export function triggerActiveJourney(
  refs: PointerCouplingRefs,
  trigger: ActiveJourneyTrigger,
  fallbackApproach: PointerApproachId = "default",
  fallbackCorner: CornerIndex = 1,
): void {
  if (refs.journeyActive) return;
  refs.journeyActive = true;
  refs.journeySource = trigger.source;
  refs.frozenApproach = trigger.initialApproach ?? fallbackApproach;
  refs.frozenCorner = trigger.initialCorner ?? fallbackCorner;
}

export function clearActiveJourney(refs: PointerCouplingRefs): void {
  refs.journeyActive = false;
  refs.journeySource = null;
}

export function emptyPointerCouplingDiagnostics(): PointerCouplingDiagnostics {
  return {
    dwellContribution: 0,
    velocityFactor: 1,
    depthContribution: 0,
    proximityContribution: 0,
    directionContribution: 0,
    locomotionEnvelope: 0,
    maxVertexPx: 0,
    maxDepthPx: 0,
    resolveBlend: 0,
    supportReaching: null,
    supportReceiving: null,
  };
}

export function emptyPointerCouplingState(): PointerCouplingState {
  return {
    envelope: 0,
    envelopeVelocity: 0,
    targetEnvelope: 0,
    intent: 0,
    proximity: 0,
    regionDepth: 0,
    couplingPhase: "rest",
    approach: "default",
    selectedCorner: 1,
    persistence: 0,
    commitment: 0,
    pointerVelocity: 0,
    proximityOnly: false,
    proximityResponse: null,
    legacyPhase: "rest",
    journeyActive: false,
    journeySource: null,
    diagnostics: emptyPointerCouplingDiagnostics(),
  };
}

export function computeFormProximity(pointerX: number, pointerY: number): number {
  const dx = pointerX - FORM_ANCHOR.x;
  const dy = pointerY - FORM_ANCHOR.y;
  const distance = Math.hypot(dx, dy);
  return 1 - clamp(distance / PROXIMITY_MAX_DISTANCE, 0, 1);
}

export function computeRegionDepth(pointerX: number, pointerY: number): number {
  const dx = pointerX - FORM_ANCHOR.x;
  const dy = pointerY - FORM_ANCHOR.y;
  const distance = Math.hypot(dx, dy);
  if (distance >= ACTIVE_REGION_RADIUS) return 0;
  return 1 - clamp(distance / ACTIVE_REGION_RADIUS, 0, 1);
}

export function selectNearestCorner(
  pointerX: number,
  pointerY: number,
): CornerIndex {
  let best: CornerIndex = 1;
  let bestDist = Infinity;
  (Object.entries(CORNER_ANCHORS) as [string, Point2D][]).forEach(
    ([index, anchor]) => {
      const dist = Math.hypot(pointerX - anchor.x, pointerY - anchor.y);
      if (dist < bestDist) {
        bestDist = dist;
        best = Number(index) as CornerIndex;
      }
    },
  );
  return best;
}

export function computeProximityResponse(
  proximity: number,
  nearestCorner: CornerIndex,
): ProximityResponse {
  const magnitude = clamp(
    PROXIMITY_DISPLACEMENT_MIN +
      (PROXIMITY_DISPLACEMENT_MAX - PROXIMITY_DISPLACEMENT_MIN) *
        smootherstep(proximity),
    PROXIMITY_DISPLACEMENT_MIN,
    PROXIMITY_DISPLACEMENT_MAX,
  );

  const vertexOffsets = ZERO_OFFSETS.map((zero, index) => {
    if (index !== nearestCorner) return zero;
    const dir = CORNER_DIRECTION[nearestCorner];
    const len = Math.hypot(dir.x, dir.y) || 1;
    return {
      x: (dir.x / len) * magnitude,
      y: (dir.y / len) * magnitude,
    };
  }) as [Point2D, Point2D, Point2D, Point2D];

  const depthOffsets = ZERO_OFFSETS.map((zero, index) => {
    if (index !== nearestCorner) return zero;
    const dir = CORNER_DEPTH_DIRECTION[nearestCorner];
    const len = Math.hypot(dir.x, dir.y) || 1;
    return {
      x: (dir.x / len) * magnitude * 0.55,
      y: (dir.y / len) * magnitude * 0.55,
    };
  }) as [Point2D, Point2D, Point2D, Point2D];

  return { vertexOffsets, depthOffsets, nearestCorner };
}

function directionAlignment(
  pointerX: number,
  pointerY: number,
  approach: PointerApproachId,
): number {
  switch (approach) {
    case "upper-right":
      return clamp(0.55 + pointerX * 0.35 - pointerY * 0.2, 0.4, 1);
    case "lower-right":
      return clamp(0.55 + pointerX * 0.3 + pointerY * 0.25, 0.4, 1);
    case "center":
      return clamp(1 - Math.hypot(pointerX, pointerY) * 0.35, 0.55, 1);
    default:
      return clamp(0.72 - Math.abs(pointerX + 0.15) * 0.25, 0.35, 0.78);
  }
}

export function computePointerIntent(input: {
  proximity: number;
  regionDepth: number;
  dwellNormalized: number;
  persistence: number;
  pointerVelocity: number;
  approach: PointerApproachId;
  pointerX: number;
  pointerY: number;
  ctaHovered: boolean;
  activeJourney: boolean;
  tuning?: PointerCouplingTuning;
}): { intent: number; breakdown: Omit<PointerCouplingDiagnostics, "locomotionEnvelope" | "maxVertexPx" | "maxDepthPx" | "resolveBlend" | "supportReaching" | "supportReceiving"> } {
  const tuning = input.tuning ?? POINTER_COUPLING_TUNING;

  const emptyBreakdown = {
    dwellContribution: 0,
    velocityFactor: 1,
    depthContribution: 0,
    proximityContribution: 0,
    directionContribution: 0,
  };

  if (input.activeJourney) {
    return {
      intent: clamp(0.68 + tuning.ctaIntentBoost, 0, 1),
      breakdown: {
        ...emptyBreakdown,
        dwellContribution: 0.68,
        velocityFactor: 1,
      },
    };
  }

  if (input.ctaHovered && input.regionDepth < 0.2) {
    return {
      intent: clamp(0.68 + tuning.ctaIntentBoost, 0, 1),
      breakdown: {
        ...emptyBreakdown,
        dwellContribution: 0.68,
        velocityFactor: 1,
      },
    };
  }

  if (input.ctaHovered && input.proximity <= 0.001 && input.regionDepth <= 0.001) {
    return {
      intent: clamp(0.62 + tuning.ctaIntentBoost, 0, 1),
      breakdown: {
        ...emptyBreakdown,
        dwellContribution: 0.62,
        velocityFactor: 1,
      },
    };
  }

  if (input.proximity <= 0.001) {
    return { intent: 0, breakdown: emptyBreakdown };
  }

  const dwellGain = smootherstep(input.dwellNormalized);
  const depthGain = smootherstep(input.regionDepth);
  const directionGain = directionAlignment(
    input.pointerX,
    input.pointerY,
    input.approach,
  );

  const velocityFactor = clamp(1 - input.pointerVelocity * 0.38, 0.45, 1);

  const proximityContribution = input.proximity * 0.14;
  const depthContribution = depthGain * 0.58;
  const dwellContribution = dwellGain * 0.22;
  const directionContribution = directionGain * 0.06;

  let intent =
    proximityContribution +
    depthContribution +
    dwellContribution +
    directionContribution;

  intent *= velocityFactor;

  if (input.pointerX < -0.12) {
    intent *= tuning.leftSideRestraint;
  }

  if (input.ctaHovered) {
    intent = clamp(intent + tuning.ctaIntentBoost, 0, 1);
  }

  return {
    intent: clamp(Math.pow(intent, 1.02), 0, 1),
    breakdown: {
      dwellContribution,
      velocityFactor,
      depthContribution,
      proximityContribution,
      directionContribution,
    },
  };
}

export function intentToTargetEnvelope(
  intent: number,
  couplingPhase: CouplingPhaseId,
  commitment: number,
  activeJourney: boolean,
  persistence: number,
  tuning?: PointerCouplingTuning,
): number {
  const t = tuning ?? POINTER_COUPLING_TUNING;

  if (couplingPhase === "rest") return 0;

  if (couplingPhase === "proximity") {
    return smootherstep(intent) * 0.04;
  }

  if (couplingPhase === "recognition") {
    return smootherstep(intent) * COUPLING_RECOGNITION_MAX;
  }

  if (couplingPhase === "engagement") {
    const base =
      COUPLING_RECOGNITION_MAX +
      smootherstep(intent) * (COUPLING_ENGAGEMENT_MAX - COUPLING_RECOGNITION_MAX);
    return clamp(base, 0, COUPLING_ENGAGEMENT_MAX);
  }

  if (couplingPhase === "commitment") {
    let target =
      COUPLING_COMMITMENT_START +
      smootherstep(intent) * (1 - COUPLING_COMMITMENT_START);
    if (activeJourney) {
      target = clamp(target + t.ctaCommitmentBoost, 0, 1);
    }
    if (persistence >= 0.55) {
      target = Math.max(target, COUPLING_RESOLVE_START + 0.06);
    }
    return clamp(target, COUPLING_COMMITMENT_START, 1);
  }

  if (couplingPhase === "release") {
    const floor = commitment * 0.22;
    return clamp(floor + intent * 0.08, 0, commitment);
  }

  return 0;
}

export function couplingPhaseToLegacyPhase(
  phase: CouplingPhaseId,
  envelope: number,
): HeroPhase {
  if (phase === "commitment") {
    return envelope >= COUPLING_RESOLVE_START ? "resolution" : "engagement";
  }
  if (phase === "proximity") return "rest";
  if (phase === "recognition") return "recognition";
  if (phase === "engagement") return "engagement";
  if (phase === "release") return "release";
  return "rest";
}

export function stepPointerCoupling(
  previous: PointerCouplingState,
  inputs: PointerCouplingInputs,
  delta: number,
  now: number,
  refs: PointerCouplingRefs,
  tuning: PointerCouplingTuning = POINTER_COUPLING_TUNING,
): { state: PointerCouplingState; refs: PointerCouplingRefs } {
  const active = inputs.pointerActive || inputs.ctaHovered;

  let persistenceMs = refs.persistenceMs;
  let dwellMs = refs.dwellMs;
  let exitVelocity = refs.exitVelocity;

  const liveProximity = inputs.pointerActive
    ? computeFormProximity(inputs.pointerX, inputs.pointerY)
    : 0;
  const liveRegionDepth = inputs.pointerActive
    ? computeRegionDepth(inputs.pointerX, inputs.pointerY)
    : 0;
  const liveApproach = inputs.pointerActive
    ? pointerToApproach(inputs.pointerX, inputs.pointerY)
    : previous.approach;
  const liveCorner = inputs.pointerActive
    ? selectNearestCorner(inputs.pointerX, inputs.pointerY)
    : previous.selectedCorner;

  if (inputs.ctaHovered && !refs.journeyActive) {
    triggerActiveJourney(refs, { source: "cta", initialApproach: "default" });
  }

  if (
    inputs.pointerActive &&
    !inputs.ctaHovered &&
    !refs.journeyActive &&
    dwellMs >= OBJECT_JOURNEY_ACTIVATION_MS
  ) {
    triggerActiveJourney(refs, {
      source: "object",
      initialApproach: liveApproach,
      initialCorner: liveCorner,
    });
  }

  const journeyActive = refs.journeyActive;

  let proximity: number;
  let regionDepth: number;
  let approach: PointerApproachId;
  let selectedCorner: CornerIndex;

  if (journeyActive) {
    proximity = Math.max(previous.proximity, 0.72);
    regionDepth = Math.max(previous.regionDepth, 0.78);
    approach = refs.frozenApproach;
    selectedCorner = refs.frozenCorner;
  } else if (inputs.pointerActive) {
    proximity = liveProximity;
    regionDepth = liveRegionDepth;
    approach = liveApproach;
    selectedCorner = liveCorner;
  } else if (inputs.ctaHovered) {
    proximity = Math.max(previous.proximity, 0.72);
    regionDepth = Math.max(previous.regionDepth, 0.78);
    approach = previous.approach;
    selectedCorner = previous.selectedCorner;
  } else {
    proximity = Math.max(0, previous.proximity - delta * 1.8);
    regionDepth = 0;
    approach = previous.approach;
    selectedCorner = previous.selectedCorner;
  }

  let pointerVelocity = 0;
  if (inputs.pointerActive && !journeyActive) {
    const dt = Math.max(delta, 0.001);
    pointerVelocity = clamp(
      Math.hypot(
        inputs.pointerX - refs.lastPointer.x,
        inputs.pointerY - refs.lastPointer.y,
      ) / dt,
      0,
      2.4,
    );
    refs.lastPointer = { x: inputs.pointerX, y: inputs.pointerY, t: now };
  } else if (inputs.pointerActive && journeyActive) {
    refs.lastPointer = { x: inputs.pointerX, y: inputs.pointerY, t: now };
  }

  if (active) {
    persistenceMs += delta * 1000;
    if (journeyActive || regionDepth > 0.08) dwellMs += delta * 1000;
    else if (inputs.pointerActive) dwellMs += delta * 1000;
  } else if (previous.couplingPhase !== "release") {
    persistenceMs = Math.max(0, persistenceMs - delta * 220);
    dwellMs = 0;
  }

  if (refs.wasActive && !active) {
    exitVelocity = journeyActive ? 0 : pointerVelocity;
  }
  refs.wasActive = active;

  const persistence = clamp(
    persistenceMs / tuning.persistenceMsForCommitment,
    0,
    1,
  );

  let couplingPhase = previous.couplingPhase;
  let commitment = Math.max(previous.commitment, previous.envelope);

  if (!active && previous.couplingPhase !== "release") {
    if (previous.envelope > 0.06 || journeyActive) {
      couplingPhase = "release";
    } else {
      couplingPhase = proximity > 0.04 ? "proximity" : "rest";
    }
  } else if (active) {
    if (journeyActive) {
      couplingPhase = "commitment";
    } else if (regionDepth <= 0.001 && proximity > 0.06) {
      couplingPhase = "proximity";
    } else if (inputs.pointerActive && dwellMs < OBJECT_JOURNEY_ACTIVATION_MS) {
      couplingPhase = "recognition";
    } else if (inputs.ctaHovered && regionDepth < 0.2) {
      couplingPhase = "commitment";
    } else if (regionDepth > 0.001) {
      couplingPhase = "recognition";
    }
  }

  if (couplingPhase === "release") {
    const releaseRate = 0.35 + exitVelocity * 0.45;
    commitment = Math.max(
      0,
      previous.commitment - delta * releaseRate * (0.4 + previous.envelope),
    );
    if (commitment < 0.04 && previous.envelope < 0.05) {
      couplingPhase = proximity > 0.05 ? "proximity" : "rest";
      commitment = 0;
      persistenceMs = 0;
      dwellMs = 0;
      clearActiveJourney(refs);
    }
  }

  const dwellNormalized = clamp(
    dwellMs / tuning.dwellMsForEngagement,
    0,
    1.5,
  );

  const intentResult = computePointerIntent({
    proximity,
    regionDepth,
    dwellNormalized,
    persistence,
    pointerVelocity,
    approach,
    pointerX: inputs.pointerX,
    pointerY: inputs.pointerY,
    ctaHovered: inputs.ctaHovered,
    activeJourney: journeyActive,
    tuning,
  });
  const intent = intentResult.intent;

  let targetEnvelope = intentToTargetEnvelope(
    intent,
    couplingPhase,
    commitment,
    journeyActive,
    persistence,
    tuning,
  );

  if (couplingPhase === "release") {
    const shallow = previous.commitment < COUPLING_RECOGNITION_MAX;
    const decay = shallow ? 5.5 + exitVelocity * 2 : 2.2 + exitVelocity * 0.8;
    targetEnvelope = Math.max(0, previous.envelope - delta * decay);
    targetEnvelope = Math.min(targetEnvelope, commitment);
  }

  const stiffness = tuning.springStiffness;
  const damping =
    couplingPhase === "release" ? tuning.releaseDamping : tuning.springDamping;

  let envelopeVelocity = previous.envelopeVelocity;
  envelopeVelocity +=
    (targetEnvelope - previous.envelope) * stiffness * delta;
  envelopeVelocity *= Math.exp(-damping * delta);

  let envelope = previous.envelope + envelopeVelocity * delta;
  envelope = clamp(envelope, 0, 1);

  if (
    !journeyActive &&
    couplingPhase !== "commitment" &&
    couplingPhase !== "release"
  ) {
    envelope = Math.min(envelope, COUPLING_ENGAGEMENT_MAX + 0.02);
  }

  commitment = Math.max(commitment, envelope);

  const proximityOnly =
    !journeyActive &&
    (couplingPhase === "proximity" ||
      (couplingPhase === "recognition" &&
        inputs.pointerActive &&
        dwellMs < OBJECT_JOURNEY_ACTIVATION_MS)) &&
    envelope < 0.06;

  const proximityResponse =
    proximityOnly && proximity > 0.04
      ? computeProximityResponse(proximity, selectedCorner)
      : null;

  const legacyPhase = couplingPhaseToLegacyPhase(couplingPhase, envelope);

  refs.persistenceMs = persistenceMs;
  refs.dwellMs = dwellMs;
  refs.exitVelocity = exitVelocity;

  return {
    state: {
      envelope,
      envelopeVelocity,
      targetEnvelope,
      intent,
      proximity,
      regionDepth,
      couplingPhase,
      approach,
      selectedCorner,
      persistence,
      commitment,
      pointerVelocity,
      proximityOnly,
      proximityResponse,
      legacyPhase,
      journeyActive,
      journeySource: refs.journeySource,
      diagnostics: {
        ...intentResult.breakdown,
        locomotionEnvelope: 0,
        maxVertexPx: 0,
        maxDepthPx: 0,
        resolveBlend: 0,
        supportReaching: null,
        supportReceiving: null,
      },
    },
    refs,
  };
}
