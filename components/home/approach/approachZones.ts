/**
 * Spatial interaction anchors for Approach object.
 * Anchors / radii / purpose-path logic are LOCKED — display tension only.
 *
 * B01 noise  → n0 (FIELD)
 * B02 core   → n4 (B02 path centre)
 * B03 purpose → n1 (FORM upper)
 */

import type { StructuralState } from "./constants";

// Production Approach spatial zones — anchors/radii LOCKED.

export const APPROACH_VIEWBOX = { w: 400, h: 260 };

export const ZONE_ANCHORS = {
  noise: { id: "n0", x: 64, y: 52 },
  core: { id: "n4", x: 190.2, y: 136.6 },
  purpose: { id: "n1", x: 176, y: 58 },
} as const;

export const ZONE_CONFIG = {
  noiseRadius: 40,
  coreRadius: 62,
  purposeRadius: 44,
  purposeProgress: 0.65,
  purposeCorridor: 50,
  switchMargin: 10,
  hysteresisMs: 110,
  /** Max B01 pre-tension flee (display only) */
  noiseFleePx: 4.2,
  /** Max B03 pre-tension attract (display only) */
  purposeAttractPx: 3.2,
} as const;

/** Local tension timings — subordinate to state morph */
export const TENSION = {
  /** Exponential time constant for building response */
  onsetTau: 0.18,
  /** Exponential time constant for returning to rest */
  returnTau: 0.34,
  /** Relative opacity lift on the forming purpose relationship */
  purposeContrast: 0.1,
  /** Relative opacity drop on the noise peripheral relationship */
  noiseContrastDrop: 0.1,
  /** Slight quieting of unrelated floating nodes during tension */
  peripheralQuiet: 0.08,
} as const;

export type ZoneId = "01" | "02" | "03" | null;

export type TensionSample = {
  /** 0–1 overall pre-response strength */
  strength: number;
  kind: "none" | "noise" | "purpose";
  noiseFlee: { x: number; y: number };
  purposeAttract: { x: number; y: number };
  /** Multiplier for noise edge p0 opacity */
  noiseEdgeMul: number;
  /** Multiplier for purpose-forming edge p7 opacity */
  purposeEdgeMul: number;
  /** Multiplier for unrelated node opacity */
  peripheralMul: number;
};

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

export function clientToViewBox(
  clientX: number,
  clientY: number,
  svg: SVGSVGElement,
): { x: number; y: number } {
  const rect = svg.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * APPROACH_VIEWBOX.w;
  const y = ((clientY - rect.top) / rect.height) * APPROACH_VIEWBOX.h;
  return { x, y };
}

export function purposeProgressAt(x: number, y: number) {
  const { core, purpose } = ZONE_ANCHORS;
  const vx = purpose.x - core.x;
  const vy = purpose.y - core.y;
  const len = Math.hypot(vx, vy) || 1;
  const t = ((x - core.x) * vx + (y - core.y) * vy) / (len * len);
  const projX = core.x + vx * t;
  const projY = core.y + vy * t;
  const corridorDist = dist(x, y, projX, projY);
  return { t, corridorDist, len, vx, vy };
}

export function resolveZoneCandidate(x: number, y: number): ZoneId {
  const { noise, core, purpose } = ZONE_ANCHORS;
  const {
    noiseRadius,
    coreRadius,
    purposeRadius,
    purposeProgress,
    purposeCorridor,
  } = ZONE_CONFIG;

  const dNoise = dist(x, y, noise.x, noise.y);
  const dCore = dist(x, y, core.x, core.y);
  const dPurpose = dist(x, y, purpose.x, purpose.y);

  const inNoise = dNoise <= noiseRadius;
  const inCore = dCore <= coreRadius;
  const inPurposeNear = dPurpose <= purposeRadius;

  const { t, corridorDist } = purposeProgressAt(x, y);
  const inPurposePath =
    t >= purposeProgress &&
    t <= 1.15 &&
    corridorDist <= purposeCorridor;

  if (!inNoise && !inCore && !inPurposeNear && !inPurposePath) {
    const inSoftField =
      x >= 40 && x <= 320 && y >= 20 && y <= 220 && dCore < coreRadius * 1.55;
    return inSoftField ? "02" : null;
  }

  const noiseScore = inNoise ? dNoise : Infinity;
  const purposeScore =
    inPurposePath || inPurposeNear
      ? Math.min(
          inPurposeNear ? dPurpose : Infinity,
          inPurposePath ? corridorDist + (1 - Math.min(t, 1)) * 20 : Infinity,
        )
      : Infinity;
  const coreScore =
    inCore || (!inNoise && !inPurposePath && !inPurposeNear)
      ? dCore
      : Infinity;

  if (inPurposePath && purposeScore < noiseScore) return "03";
  if (noiseScore + ZONE_CONFIG.switchMargin < Math.min(coreScore, purposeScore))
    return "01";
  if (purposeScore + ZONE_CONFIG.switchMargin < coreScore) return "03";
  if (coreScore < Infinity) return "02";
  if (purposeScore < Infinity) return "03";
  if (noiseScore < Infinity) return "01";
  return "02";
}

const REST_TENSION: TensionSample = {
  strength: 0,
  kind: "none",
  noiseFlee: { x: 0, y: 0 },
  purposeAttract: { x: 0, y: 0 },
  noiseEdgeMul: 1,
  purposeEdgeMul: 1,
  peripheralMul: 1,
};

/**
 * Pre-response targets while still in B02 (before threshold commit).
 * Suppressed once B01/B03 is already committed.
 */
export function computeTensionTarget(
  pointer: { x: number; y: number } | null,
  committed: StructuralState,
  allow: boolean,
): TensionSample {
  if (!allow || !pointer || committed !== "02") return REST_TENSION;

  const { noise, purpose } = ZONE_ANCHORS;
  const dNoise = dist(pointer.x, pointer.y, noise.x, noise.y);

  // B01 pre-tension — outer noise zone
  if (dNoise <= ZONE_CONFIG.noiseRadius && dNoise > 0.001) {
    const strength = 1 - dNoise / ZONE_CONFIG.noiseRadius;
    const ux = (noise.x - pointer.x) / dNoise;
    const uy = (noise.y - pointer.y) / dNoise;
    const mag = strength * ZONE_CONFIG.noiseFleePx;
    return {
      strength,
      kind: "noise",
      noiseFlee: { x: ux * mag, y: uy * mag },
      purposeAttract: { x: 0, y: 0 },
      noiseEdgeMul: 1 - strength * TENSION.noiseContrastDrop,
      purposeEdgeMul: 1,
      peripheralMul: 1 - strength * TENSION.peripheralQuiet * 0.5,
    };
  }

  // B03 pre-tension — progress toward purpose, before threshold
  const { t, corridorDist, vx, vy, len } = purposeProgressAt(
    pointer.x,
    pointer.y,
  );
  if (
    t > 0.08 &&
    t < ZONE_CONFIG.purposeProgress &&
    corridorDist <= ZONE_CONFIG.purposeCorridor
  ) {
    const strength = Math.min(1, t / ZONE_CONFIG.purposeProgress);
    // Attract slightly along the directional axis (and mild pointer blend)
    const ax = vx / len;
    const ay = vy / len;
    const toPointerX = pointer.x - purpose.x;
    const toPointerY = pointer.y - purpose.y;
    const pd = Math.hypot(toPointerX, toPointerY) || 1;
    const blendX = ax * 0.7 + (toPointerX / pd) * 0.3;
    const blendY = ay * 0.7 + (toPointerY / pd) * 0.3;
    const bl = Math.hypot(blendX, blendY) || 1;
    const mag = strength * ZONE_CONFIG.purposeAttractPx;
    return {
      strength,
      kind: "purpose",
      noiseFlee: { x: 0, y: 0 },
      purposeAttract: { x: (blendX / bl) * mag, y: (blendY / bl) * mag },
      noiseEdgeMul: 1,
      purposeEdgeMul: 1 + strength * TENSION.purposeContrast,
      peripheralMul: 1 - strength * TENSION.peripheralQuiet,
    };
  }

  return REST_TENSION;
}

export { REST_TENSION };
