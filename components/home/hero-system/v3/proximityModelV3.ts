/**
 * Production V3 — locked I1 Soft Resistance proximity model (P4).
 * Geometry sampler stays in spatialPathV3.ts. This file is math only.
 *
 * Lock: I1 · 75/25 · PR1 · directional ±8% · E1 (deadband / sustain / early-release)
 * X0: no CTA/nav exclusion corridor.
 */

import { V3_CANVAS, V3_S0_FRONT, type Point } from "./geometryV3";
import { V3_REVEAL_PRESSURE_SPLIT } from "./spatialPathV3";

export type ZoneId = "Z0" | "Z1" | "Z2" | "Z3";

export const V3_SPLIT = V3_REVEAL_PRESSURE_SPLIT;

export const ZONE_RADII = {
  awarenessOuter: 2.35,
  revealOuter: 1.35,
  pressureOuter: 0.42,
} as const;

export const PR1_MAX_PROGRESS = 0.03;
export const AWARENESS_MAX_REVEAL = 0.04;
export const DIRECTIONAL_RANGE = { min: 0.92, max: 1.08 } as const;

export const DEADBAND_RAW = 0.015;
export const DIST_LP_LAMBDA = 18;
export const ACTIVATION_SUSTAIN_SEC = 0.18;
export const ACTIVATION_COMMIT_RAW = 0.55;
export const PRESSURE_GATE_FRAC = 0.95;

export const EARLY_RELEASE = {
  progressCeiling: 0.18,
  lambdaMs: 280,
  elevatedMsCeiling: 850,
} as const;

const I1_CURVE: ReadonlyArray<{ raw: number; out: number }> = [
  { raw: 0, out: 0 },
  { raw: 0.15, out: 0.025 },
  { raw: 0.35, out: 0.18 },
  { raw: 0.6, out: 0.52 },
  { raw: 0.8, out: 0.74 },
  { raw: 0.92, out: 0.88 },
  { raw: 1, out: 1 },
];

export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function finite(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

export function msToLambda(ms: number) {
  return 3 / Math.max(0.05, ms / 1000);
}

export const TEMPORAL_I1 = {
  awarenessApproach: msToLambda(210),
  revealApproach: msToLambda(310),
  pressureApproach: msToLambda(410),
  release: msToLambda(780),
} as const;

export function dampToward(
  current: number,
  target: number,
  dtSec: number,
  lambda: number,
) {
  const k = 1 - Math.exp(-lambda * Math.max(0, dtSec));
  return current + (target - current) * k;
}

export function mapCurveI1(raw: number) {
  const r = clamp01(raw);
  const pts = I1_CURVE;
  if (r <= pts[0].raw) return pts[0].out;
  for (let i = 1; i < pts.length; i++) {
    if (r <= pts[i].raw) {
      const a = pts[i - 1];
      const b = pts[i];
      const u = (r - a.raw) / Math.max(1e-6, b.raw - a.raw);
      return a.out + (b.out - a.out) * u;
    }
  }
  return pts[pts.length - 1].out;
}

export function approachLambdaI1(targetProgress: number, split = V3_SPLIT) {
  if (targetProgress <= 0.04) return TEMPORAL_I1.awarenessApproach;
  if (targetProgress <= split) return TEMPORAL_I1.revealApproach;
  return TEMPORAL_I1.pressureApproach;
}

function applyCanvasTilt(p: Point, tiltDeg: number, anchor: Point): Point {
  const r = (tiltDeg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  const dx = p.x - anchor.x;
  const dy = p.y - anchor.y;
  return {
    x: anchor.x + dx * c - dy * s,
    y: anchor.y + dx * s + dy * c,
  };
}

/** Static tilted S0 front — distance reference (never animated front). */
export function buildStaticS0FrontTilted(): Point[] {
  const { tiltDeg, anchor } = V3_CANVAS;
  return V3_S0_FRONT.map((p) => applyCanvasTilt(p, tiltDeg, anchor));
}

export function halfDiagFromPoly(poly: readonly Point[]) {
  if (!poly.length) return 120;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of poly) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  return Math.hypot(maxX - minX, maxY - minY) / 2 || 120;
}

function distPointSeg(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = a.x + t * dx;
  const cy = a.y + t * dy;
  return {
    dist: Math.hypot(p.x - cx, p.y - cy),
    closest: { x: cx, y: cy },
  };
}

export function pointInPoly(p: Point, poly: readonly Point[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect =
      yi > p.y !== yj > p.y &&
      p.x < ((xj - xi) * (p.y - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function distanceToPolygon(p: Point, poly: readonly Point[]) {
  if (poly.length < 2) {
    return { dist: Infinity, closest: { x: 0, y: 0 }, inside: false };
  }
  if (pointInPoly(p, poly)) {
    const c = {
      x: poly.reduce((s, q) => s + q.x, 0) / poly.length,
      y: poly.reduce((s, q) => s + q.y, 0) / poly.length,
    };
    return { dist: 0, closest: c, inside: true };
  }
  let best = { dist: Infinity, closest: { x: poly[0].x, y: poly[0].y } };
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const hit = distPointSeg(p, a, b);
    if (hit.dist < best.dist) best = hit;
  }
  return { ...best, inside: false };
}

export function clientToViewBox(
  clientX: number,
  clientY: number,
  svgEl: SVGSVGElement,
  vbW: number = V3_CANVAS.width,
  vbH: number = V3_CANVAS.height,
): Point {
  const r = svgEl.getBoundingClientRect();
  return {
    x: ((clientX - r.left) / Math.max(1e-6, r.width)) * vbW,
    y: ((clientY - r.top) / Math.max(1e-6, r.height)) * vbH,
  };
}

export function zoneFromDistance(
  dist: number,
  halfDiag: number,
  inside: boolean,
): ZoneId {
  if (inside || dist <= ZONE_RADII.pressureOuter * halfDiag) return "Z3";
  if (dist <= ZONE_RADII.revealOuter * halfDiag) return "Z2";
  if (dist <= ZONE_RADII.awarenessOuter * halfDiag) return "Z1";
  return "Z0";
}

export function rawProximityFromDistance(
  dist: number,
  halfDiag: number,
  inside: boolean,
): number {
  if (inside) return 1;
  const outer = ZONE_RADII.awarenessOuter * halfDiag;
  const inner = ZONE_RADII.pressureOuter * halfDiag * 0.35;
  if (dist >= outer) return 0;
  if (dist <= inner) return 1;
  const u = 1 - (dist - inner) / Math.max(1e-6, outer - inner);
  return clamp01(u * u);
}

export function directionalMultiplier(
  pointer: Point,
  closest: Point,
  zone: ZoneId,
): number {
  if (zone === "Z0") return 1;
  const dx = closest.x - pointer.x;
  const dy = closest.y - pointer.y;
  const len = Math.hypot(dx, dy) || 1;
  if (!Number.isFinite(len) || len < 1e-9) return 1;
  const ax = dx / len;
  const ay = dy / len;
  const fromLeft = ax;
  const fromBelowN = -ay;
  const fromRight = -ax;
  const fromAbove = ay;
  let bias = 0;
  if (zone === "Z1" || zone === "Z2") {
    bias = 0.08 * (0.55 * fromLeft + 0.45 * fromBelowN);
  } else if (zone === "Z3") {
    bias = 0.08 * (0.55 * fromRight + 0.45 * fromAbove);
  }
  const mul = 1 + bias;
  if (!Number.isFinite(mul)) return 1;
  return Math.min(DIRECTIONAL_RANGE.max, Math.max(DIRECTIONAL_RANGE.min, mul));
}

export function zoneTargetProgress(
  zone: ZoneId,
  rawProx: number,
  split = V3_SPLIT,
): number {
  if (zone === "Z0") return 0;
  if (zone === "Z1") {
    return Math.min(PR1_MAX_PROGRESS, rawProx * PR1_MAX_PROGRESS);
  }
  if (zone === "Z2") {
    const t = clamp01(rawProx);
    const reveal =
      AWARENESS_MAX_REVEAL * split +
      t * (split - AWARENESS_MAX_REVEAL * split);
    return Math.min(split, reveal);
  }
  const t = clamp01(rawProx);
  const deep = Math.pow(t, 1.35);
  return split + deep * (1 - split);
}

export function blendTarget(
  zoneTarget: number,
  curved: number,
  zone: ZoneId,
  split = V3_SPLIT,
) {
  if (zone === "Z0") return 0;
  if (zone === "Z1") return zoneTarget;
  if (zone === "Z2") return Math.min(split, Math.max(zoneTarget, curved));
  if (curved <= split) return split * 0.98;
  return curved;
}

export function applyDeadband(
  raw: number,
  held: number,
  threshold = DEADBAND_RAW,
  enabled = true,
): { value: number; suppressed: boolean } {
  if (!enabled) return { value: raw, suppressed: false };
  if (Math.abs(raw - held) < threshold) {
    return { value: held, suppressed: raw !== held };
  }
  return { value: raw, suppressed: false };
}

/** E2 zone hysteresis fractions (lab control). E1 keeps hysteresis off. */
export const ZONE_HYSTERESIS = {
  revealEnterTighten: 0.04,
  revealExitWiden: 0.065,
  pressureEnterTighten: 0.08,
  pressureExitWiden: 0.14,
} as const;

export function zoneWithHysteresis(
  dist: number,
  halfDiag: number,
  inside: boolean,
  sticky: ZoneId,
  enabled: boolean,
): ZoneId {
  if (!enabled) return zoneFromDistance(dist, halfDiag, inside);

  const aw = ZONE_RADII.awarenessOuter * halfDiag;
  const rev = ZONE_RADII.revealOuter * halfDiag;
  const pre = ZONE_RADII.pressureOuter * halfDiag;

  if (inside) return "Z3";

  if (sticky === "Z3") {
    if (dist <= pre * (1 + ZONE_HYSTERESIS.pressureExitWiden)) return "Z3";
    if (dist <= rev) return "Z2";
    if (dist <= aw) return "Z1";
    return "Z0";
  }
  if (sticky === "Z2") {
    if (dist <= pre * (1 - ZONE_HYSTERESIS.pressureEnterTighten)) return "Z3";
    if (dist <= rev * (1 + ZONE_HYSTERESIS.revealExitWiden)) return "Z2";
    if (dist <= aw) return "Z1";
    return "Z0";
  }
  if (sticky === "Z1") {
    if (dist <= pre * (1 - ZONE_HYSTERESIS.pressureEnterTighten)) return "Z3";
    if (dist <= rev * (1 - ZONE_HYSTERESIS.revealEnterTighten)) return "Z2";
    if (dist <= aw * 1.04) return "Z1";
    return "Z0";
  }
  if (dist <= pre * (1 - ZONE_HYSTERESIS.pressureEnterTighten)) return "Z3";
  if (dist <= rev * (1 - ZONE_HYSTERESIS.revealEnterTighten)) return "Z2";
  if (dist <= aw) return "Z1";
  return "Z0";
}

export type ProximityGates = {
  deadband?: boolean;
  sustainGate?: boolean;
  earlyRelease?: boolean;
  hysteresis?: boolean;
};

export type ProximityTickInput = {
  pointer: Point | null;
  filteredDist: number;
  heldRaw: number;
  sustainSec: number;
  renderedProgress: number;
  peakRendered: number;
  elevatedMs: number;
  earlyReleaseActive: boolean;
  dtSec: number;
  halfDiag: number;
  poly: readonly Point[];
  blocked: boolean;
  split?: number;
  stickyZone?: ZoneId;
  gates?: ProximityGates;
};

export type ProximityTickResult = {
  rawProximity: number;
  weightedProximity: number;
  heldRaw: number;
  filteredDist: number;
  zone: ZoneId;
  rawZone: ZoneId;
  stickyZone: ZoneId;
  directionalMul: number;
  targetProgress: number;
  renderedProgress: number;
  sustainSec: number;
  peakRendered: number;
  elevatedMs: number;
  earlyReleaseActive: boolean;
  deadbandSuppressed: boolean;
  sustainGateClamped: boolean;
  pressureGateClamped: boolean;
  lambda: number;
  closest: Point | null;
  dist: number;
};

/**
 * One simulation step of the locked I1 proximity model.
 * Default gates = E1 (deadband + sustain + early-release, no hysteresis).
 * Pure — caller owns refs and RAF.
 */
export function tickProximity(input: ProximityTickInput): ProximityTickResult {
  const split = input.split ?? V3_SPLIT;
  const dt = Math.min(0.05, Math.max(0, input.dtSec));
  const gates = input.gates ?? {};
  const deadbandEnabled = gates.deadband !== false;
  const sustainGateEnabled = gates.sustainGate !== false;
  const earlyReleaseEnabled = gates.earlyRelease !== false;
  const hysteresisEnabled = gates.hysteresis === true;

  let filteredDist = input.filteredDist;
  let heldRaw = input.heldRaw;
  let sustainSec = input.sustainSec;
  let rendered = input.renderedProgress;
  let peak = input.peakRendered;
  let elevatedMs = input.elevatedMs;
  let earlyReleaseActive = input.earlyReleaseActive;
  let stickyZone: ZoneId = input.stickyZone ?? "Z0";

  let rawProximity = 0;
  let weightedProximity = 0;
  let zone: ZoneId = "Z0";
  let rawZone: ZoneId = "Z0";
  let dirMul = 1;
  let deadbandSuppressed = false;
  let closest: Point | null = null;
  let dist = Infinity;
  let target = 0;
  let sustainGateClamped = false;
  let pressureGateClamped = false;

  if (input.blocked || !input.pointer) {
    target = 0;
  } else {
    const hit = distanceToPolygon(input.pointer, input.poly);
    dist = finite(hit.dist, Infinity);
    closest = hit.closest;
    if (!Number.isFinite(filteredDist)) {
      filteredDist = dist;
    } else {
      const a = 1 - Math.exp(-DIST_LP_LAMBDA * dt);
      filteredDist = filteredDist + (dist - filteredDist) * a;
    }
    const fDist = filteredDist;
    rawZone = zoneFromDistance(fDist, input.halfDiag, hit.inside);
    zone = zoneWithHysteresis(
      fDist,
      input.halfDiag,
      hit.inside,
      stickyZone,
      hysteresisEnabled,
    );
    stickyZone = zone;
    const rawProx = rawProximityFromDistance(fDist, input.halfDiag, hit.inside);
    dirMul = directionalMultiplier(input.pointer, closest, zone);
    weightedProximity = clamp01(rawProx * dirMul);
    const db = applyDeadband(
      weightedProximity,
      heldRaw,
      DEADBAND_RAW,
      deadbandEnabled,
    );
    deadbandSuppressed = db.suppressed;
    heldRaw = db.value;
    rawProximity = db.value;

    const preTarget = zoneTargetProgress(zone, rawProximity, split);
    const curved = mapCurveI1(rawProximity);
    target = blendTarget(preTarget, curved, zone, split);
  }

  // Pressure gate — no skip past S1 while climbing
  if (
    zone === "Z3" &&
    rendered < split * PRESSURE_GATE_FRAC &&
    target > split
  ) {
    target = split;
    pressureGateClamped = true;
  }

  // Sustain gate — committed proximity for 180ms before > PR1
  if ((zone === "Z2" || zone === "Z3") && rawProximity >= ACTIVATION_COMMIT_RAW) {
    sustainSec += dt;
  } else if (zone === "Z0" || zone === "Z1") {
    sustainSec = 0;
  } else {
    sustainSec = Math.max(0, sustainSec - dt * 2.5);
  }
  if (
    sustainGateEnabled &&
    sustainSec < ACTIVATION_SUSTAIN_SEC &&
    target > PR1_MAX_PROGRESS
  ) {
    target = Math.min(target, PR1_MAX_PROGRESS);
    sustainGateClamped = true;
  }

  const releasing = target < rendered - 0.001;
  if (rendered > PR1_MAX_PROGRESS) {
    elevatedMs += dt * 1000;
  }
  if (
    earlyReleaseEnabled &&
    releasing &&
    target < 0.001 &&
    (peak < EARLY_RELEASE.progressCeiling ||
      elevatedMs < EARLY_RELEASE.elevatedMsCeiling)
  ) {
    earlyReleaseActive = true;
  }
  if (!releasing) {
    earlyReleaseActive = false;
    if (rendered < 0.002) elevatedMs = 0;
  }

  let lambda: number;
  if (releasing && earlyReleaseActive) {
    lambda = msToLambda(EARLY_RELEASE.lambdaMs);
  } else if (releasing) {
    lambda = TEMPORAL_I1.release;
  } else {
    lambda = approachLambdaI1(Math.max(target, rendered), split);
  }

  rendered = dampToward(rendered, target, dt, lambda);
  if (rendered < 0.001 && target < 0.001) rendered = 0;
  if (Math.abs(rendered - target) < 0.0005) rendered = target;
  peak = Math.max(peak, rendered);

  return {
    rawProximity: finite(rawProximity),
    weightedProximity: finite(weightedProximity),
    heldRaw: finite(heldRaw),
    filteredDist: finite(filteredDist, Infinity),
    zone,
    rawZone,
    stickyZone,
    directionalMul: finite(dirMul, 1),
    targetProgress: finite(clamp01(target)),
    renderedProgress: finite(clamp01(rendered)),
    sustainSec: finite(sustainSec),
    peakRendered: finite(peak),
    elevatedMs: finite(elevatedMs),
    earlyReleaseActive,
    deadbandSuppressed,
    sustainGateClamped,
    pressureGateClamped,
    lambda: finite(lambda),
    closest,
    dist: finite(dist, 0),
  };
}

export type ProximityDebugSnapshot = {
  zone: ZoneId;
  rawProximity: number;
  weightedProximity: number;
  heldRaw: number;
  targetProgress: number;
  renderedProgress: number;
  revealProgress: number;
  pressureProgress: number;
  directionalMul: number;
  earlyRelease: boolean;
  sustainSec: number;
  deadbandSuppressed: boolean;
  pressureGateClamped: boolean;
  sustainGateClamped: boolean;
  inputMode: "fine-pointer" | "coarse-pointer" | "reduced-motion" | "off";
  rafActive: boolean;
  fps: number;
};
