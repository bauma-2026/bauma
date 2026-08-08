/**
 * Production V3 — full spatial path S0 → S1 → S2 (P3).
 * Geometry sampling only. No proximity, damping, pointer, or RAF.
 *
 * Easing ownership (live interaction):
 *   pointer → runtime damping → rendered progress → linear spatial sample
 * Temporal feeling lives in the proximity runtime. This sampler maps
 * local segment progress into pose/corners — default easing is "linear".
 * "cubic" remains available for path-shape demos / historical analysis only.
 */

import {
  POSE_PARAMS,
  sampleFromPoseParams,
  type PoseFace,
  type PoseParams,
} from "../v2/spatialPose";
import {
  V3_CANVAS,
  V3_S0_FRONT,
  V3_S0_REAR,
  V3_S0_REAR_STUBS,
  type Point,
} from "./geometryV3";

/** Dev/runtime full-path progress. Production runtime must remain 0. */
export const V3_FULL_PATH_PROGRESS = 0;

/** @deprecated Prefer V3_FULL_PATH_PROGRESS — alias kept for P2 call sites. */
export const V3_PATH_PROGRESS = V3_FULL_PATH_PROGRESS;

/** Reveal (S0→S1) occupies [0, split]; Pressure (S1→S2) occupies (split, 1]. */
export const V3_REVEAL_PRESSURE_SPLIT = 0.75;

/** Continuity bridge: exact S0 → pose-space over first 4% of spatial Reveal progress. */
export const P1_BRIDGE = 0.04;

/** Live interaction / production sampling — never double-ease after runtime. */
export type SpatialEasing = "linear" | "cubic";

export type SpatialSampleOptions = {
  split?: number;
  /** Default `"linear"` for live runtime. Use `"cubic"` only for path demos. */
  easing?: SpatialEasing;
};

export const LIVE_SPATIAL_SAMPLE: Required<
  Pick<SpatialSampleOptions, "easing">
> = {
  easing: "linear",
};

/** Path-shape demos / historical analysis only — never live interaction. */
export const PATH_DEMO_SPATIAL_SAMPLE: Required<
  Pick<SpatialSampleOptions, "easing">
> = {
  easing: "cubic",
};

/** Fitted pose that best reproduces archive S0 under depth.z = −148. */
export const FITTED_S0_POSE: PoseParams = {
  yawDeg: -6.65,
  pitchDeg: 4.55,
  rollDeg: -0.85,
  depth: { x: 0, y: 0, z: -148 },
  scale: 1,
  globalTiltDeg: V3_CANVAS.tiltDeg,
};

export const S1_POSE: PoseParams = {
  ...POSE_PARAMS.S1,
  globalTiltDeg: V3_CANVAS.tiltDeg,
};

export const S2_POSE: PoseParams = {
  ...POSE_PARAMS.S2,
  globalTiltDeg: V3_CANVAS.tiltDeg,
};

export type PathStage =
  | "rest"
  | "bridge"
  | "path"
  | "s1"
  | "pressure"
  | "s2";
export type PathSegment = "reveal" | "pressure";
export type RearMode = "selective-stubs" | "complete-quiet";

export type PathFrame = {
  progress: number;
  eased: number;
  stage: PathStage;
  front: Point[];
  rear: Point[];
  depth: Point;
  depthMagnitude: number;
  depthAngle: number;
  rearMode: RearMode;
  upperLeftOpacity: number;
  revealMix: number;
  faces: PoseFace[];
  params: PoseParams | null;
  frontDevFromExactS0: number;
  frontDevFromExactS1: number;
  frontDevFromExactS2: number;
  finite: boolean;
};

export type FullPathFrame = PathFrame & {
  segment: PathSegment;
  localProgress: number;
  split: number;
};

function copy(p: Point): Point {
  return { x: p.x, y: p.y };
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpPt(a: Point, b: Point, t: number): Point {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

function lerpCorners(a: readonly Point[], b: readonly Point[], t: number): Point[] {
  return a.map((p, i) => lerpPt(p, b[i], t));
}

function easeInOutCubic(t: number) {
  const u = clamp01(t);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}

function resolveSegmentEase(t: number, mode: SpatialEasing) {
  return mode === "linear" ? clamp01(t) : easeInOutCubic(t);
}

function normalizeSampleOptions(
  splitOrOpts?: number | SpatialSampleOptions,
): Required<SpatialSampleOptions> {
  if (typeof splitOrOpts === "number") {
    return {
      split: splitOrOpts,
      easing: "linear",
    };
  }
  return {
    split: splitOrOpts?.split ?? V3_REVEAL_PRESSURE_SPLIT,
    easing: splitOrOpts?.easing ?? "linear",
  };
}

function shortestArc(a: number, b: number) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function depthOf(front: Point[], rear: Point[]): Point {
  return {
    x: (rear[0].x - front[0].x + rear[1].x - front[1].x) / 2,
    y: (rear[0].y - front[0].y + rear[1].y - front[1].y) / 2,
  };
}

function depthMag(d: Point) {
  return Math.hypot(d.x, d.y);
}

function depthAng(d: Point) {
  return Math.atan2(d.y, d.x);
}

function maxCornerDev(a: readonly Point[], b: readonly Point[]) {
  let m = 0;
  for (let i = 0; i < 4; i++) {
    m = Math.max(m, Math.hypot(a[i].x - b[i].x, a[i].y - b[i].y));
  }
  return m;
}

function allFinite(pts: readonly Point[]) {
  return pts.every(
    (p) => Number.isFinite(p.x) && Number.isFinite(p.y),
  );
}

export function poseParamsAngular(
  a: PoseParams,
  b: PoseParams,
  t: number,
): PoseParams {
  const u = clamp01(t);
  const magA = Math.hypot(a.yawDeg, a.pitchDeg);
  const magB = Math.hypot(b.yawDeg, b.pitchDeg);
  const angA = Math.atan2(a.pitchDeg, a.yawDeg);
  const angB = Math.atan2(b.pitchDeg, b.yawDeg);
  const ang = angA + shortestArc(angA, angB) * u;
  const mag = lerp(magA, magB, u);
  return {
    yawDeg: mag * Math.cos(ang),
    pitchDeg: mag * Math.sin(ang),
    rollDeg: lerp(a.rollDeg, b.rollDeg, u),
    depth: {
      x: lerp(a.depth.x, b.depth.x, u),
      y: lerp(a.depth.y, b.depth.y, u),
      z: lerp(a.depth.z, b.depth.z, u),
    },
    scale: 1,
    globalTiltDeg: a.globalTiltDeg,
  };
}

const EXACT_S0_FRONT = V3_S0_FRONT.map(copy);
const EXACT_S0_REAR = V3_S0_REAR.map(copy);
const EXACT_S1 = sampleFromPoseParams(S1_POSE, "S1");
const EXACT_S2 = sampleFromPoseParams(S2_POSE, "S2");

function pack(partial: {
  progress: number;
  eased: number;
  stage: PathStage;
  front: Point[];
  rear: Point[];
  rearMode: RearMode;
  upperLeftOpacity: number;
  revealMix: number;
  faces: PoseFace[];
  params: PoseParams | null;
}): PathFrame {
  const depth = depthOf(partial.front, partial.rear);
  return {
    ...partial,
    depth,
    depthMagnitude: depthMag(depth),
    depthAngle: depthAng(depth),
    frontDevFromExactS0: maxCornerDev(partial.front, EXACT_S0_FRONT),
    frontDevFromExactS1: maxCornerDev(partial.front, EXACT_S1.front),
    frontDevFromExactS2: maxCornerDev(partial.front, EXACT_S2.front),
    finite:
      allFinite(partial.front) &&
      allFinite(partial.rear) &&
      Number.isFinite(depth.x) &&
      Number.isFinite(depth.y),
  };
}

function paramDelta(a: PoseParams | null, b: PoseParams | null) {
  if (!a || !b) {
    return {
      yawDeg: a || b ? Infinity : 0,
      pitchDeg: a || b ? Infinity : 0,
      rollDeg: a || b ? Infinity : 0,
      depthZ: a || b ? Infinity : 0,
      maxAbs: a || b ? Infinity : 0,
    };
  }
  const yawDeg = Math.abs(a.yawDeg - b.yawDeg);
  const pitchDeg = Math.abs(a.pitchDeg - b.pitchDeg);
  const rollDeg = Math.abs(a.rollDeg - b.rollDeg);
  const depthZ = Math.abs(a.depth.z - b.depth.z);
  return {
    yawDeg,
    pitchDeg,
    rollDeg,
    depthZ,
    maxAbs: Math.max(yawDeg, pitchDeg, rollDeg, depthZ),
  };
}

/**
 * Sample locked P1 path.
 * t=0 → exact archive S0; t=1 → exact S1; mid → angular pose-space + 4% bridge.
 * Live: pass easing `"linear"` (default). `"cubic"` is path-demo only.
 */
export function sampleS0toS1Path(
  progress: number,
  easing: SpatialEasing = "linear",
): PathFrame {
  const t = clamp01(progress);
  const u = resolveSegmentEase(t, easing);

  if (t <= 0.0005) {
    return pack({
      progress: 0,
      eased: 0,
      stage: "rest",
      front: EXACT_S0_FRONT.map(copy),
      rear: EXACT_S0_REAR.map(copy),
      rearMode: "selective-stubs",
      upperLeftOpacity: 0,
      revealMix: 0,
      faces: [],
      params: null,
    });
  }

  if (t >= 0.9995) {
    return pack({
      progress: 1,
      eased: 1,
      stage: "s1",
      front: EXACT_S1.front.map(copy),
      rear: EXACT_S1.rear.map(copy),
      rearMode: "complete-quiet",
      upperLeftOpacity: 1,
      revealMix: 1,
      faces: EXACT_S1.faces,
      params: { ...EXACT_S1.params },
    });
  }

  const params = poseParamsAngular(FITTED_S0_POSE, S1_POSE, u);
  const poseSample = sampleFromPoseParams(params, "S1");
  let front = poseSample.front.map(copy);
  let rear = poseSample.rear.map(copy);
  let stage: PathStage = "path";

  // Spatial continuity blend inside the bridge window (not a second temporal ease).
  if (u < P1_BRIDGE) {
    const w = easeInOutCubic(u / P1_BRIDGE);
    front = lerpCorners(EXACT_S0_FRONT, front, w);
    rear = lerpCorners(EXACT_S0_REAR, rear, w);
    stage = "bridge";
  }

  const revealMix = easeInOutCubic(clamp01((u - 0.05) / 0.35));
  return pack({
    progress: t,
    eased: u,
    stage,
    front,
    rear,
    rearMode: u < 0.02 ? "selective-stubs" : "complete-quiet",
    upperLeftOpacity: easeInOutCubic(clamp01((u - 0.08) / 0.45)),
    revealMix,
    faces: poseSample.faces,
    params,
  });
}

/**
 * Sample locked angular Pressure path S1 → S2.
 * Live: local progress maps linearly into pose space (default).
 * t=0 → exact S1; t=1 → exact S2.
 */
export function sampleS1toS2Path(
  progress: number,
  easing: SpatialEasing = "linear",
): PathFrame {
  const t = clamp01(progress);
  const u = resolveSegmentEase(t, easing);

  if (t <= 0.0005) {
    return pack({
      progress: 0,
      eased: 0,
      stage: "s1",
      front: EXACT_S1.front.map(copy),
      rear: EXACT_S1.rear.map(copy),
      rearMode: "complete-quiet",
      upperLeftOpacity: 1,
      revealMix: 1,
      faces: EXACT_S1.faces,
      params: { ...EXACT_S1.params },
    });
  }

  if (t >= 0.9995) {
    return pack({
      progress: 1,
      eased: 1,
      stage: "s2",
      front: EXACT_S2.front.map(copy),
      rear: EXACT_S2.rear.map(copy),
      rearMode: "complete-quiet",
      upperLeftOpacity: 1,
      revealMix: 1,
      faces: EXACT_S2.faces,
      params: { ...EXACT_S2.params },
    });
  }

  const params = poseParamsAngular(S1_POSE, S2_POSE, u);
  const poseSample = sampleFromPoseParams(params, u < 0.5 ? "S1" : "S2");
  return pack({
    progress: t,
    eased: u,
    stage: "pressure",
    front: poseSample.front.map(copy),
    rear: poseSample.rear.map(copy),
    rearMode: "complete-quiet",
    upperLeftOpacity: 1,
    revealMix: 1,
    faces: poseSample.faces,
    params,
  });
}

/**
 * Full spatial path: Reveal [0, split] then Pressure (split, 1].
 * Global progress is linear; segment local → geometry uses `easing`
 * (default `"linear"` for live interaction).
 *
 * @example sampleFullSpatialPath(progress, { easing: "linear" })
 * @example sampleFullSpatialPath(progress, 0.75) // split, linear default
 */
export function sampleFullSpatialPath(
  progress: number,
  splitOrOpts: number | SpatialSampleOptions = {},
): FullPathFrame {
  const { split, easing } = normalizeSampleOptions(splitOrOpts);
  const p = clamp01(progress);
  const s = Math.min(0.999, Math.max(0.001, split));

  if (p <= s) {
    const local = p / s;
    const frame = sampleS0toS1Path(local, easing);
    return {
      ...frame,
      progress: p,
      segment: "reveal",
      localProgress: local,
      split: s,
    };
  }

  const local = (p - s) / (1 - s);
  const frame = sampleS1toS2Path(local, easing);
  return {
    ...frame,
    progress: p,
    segment: "pressure",
    localProgress: local,
    split: s,
  };
}

/** Path metrics for P2 deliverables (live linear spatial authority). */
export function analyzeS0toS1Path(steps = 101) {
  const easing = LIVE_SPATIAL_SAMPLE.easing;
  let minMag = Infinity;
  let minT = 0;
  let maxFrontDevS0 = 0;
  let maxFrontDevS1 = 0;
  let maxRearDevS0 = 0;
  let maxRearDevS1 = 0;
  let finiteOk = true;
  const mid = sampleS0toS1Path(0.5, easing);
  const series: Array<{
    t: number;
    mag: number;
    ang: number;
    depthX: number;
    depthY: number;
    stage: PathStage;
  }> = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const f = sampleS0toS1Path(t, easing);
    series.push({
      t,
      mag: f.depthMagnitude,
      ang: f.depthAngle,
      depthX: f.depth.x,
      depthY: f.depth.y,
      stage: f.stage,
    });
    if (f.depthMagnitude < minMag) {
      minMag = f.depthMagnitude;
      minT = t;
    }
    maxFrontDevS0 = Math.max(maxFrontDevS0, f.frontDevFromExactS0);
    maxFrontDevS1 = Math.max(maxFrontDevS1, f.frontDevFromExactS1);
    maxRearDevS0 = Math.max(
      maxRearDevS0,
      maxCornerDev(f.rear, EXACT_S0_REAR),
    );
    maxRearDevS1 = Math.max(
      maxRearDevS1,
      maxCornerDev(f.rear, EXACT_S1.rear),
    );
    if (!f.finite) finiteOk = false;
  }

  const at0 = sampleS0toS1Path(0, easing);
  const at1 = sampleS0toS1Path(1, easing);
  const fittedAt0 = sampleFromPoseParams(FITTED_S0_POSE, "S0");

  return {
    endpointMismatchS0: {
      frontMaxPx: maxCornerDev(at0.front, EXACT_S0_FRONT),
      rearMaxPx: maxCornerDev(at0.rear, EXACT_S0_REAR),
      fittedVsArchiveFrontMaxPx: maxCornerDev(
        fittedAt0.front,
        EXACT_S0_FRONT,
      ),
    },
    endpointMismatchS1: {
      frontMaxPx: maxCornerDev(at1.front, EXACT_S1.front),
      rearMaxPx: maxCornerDev(at1.rear, EXACT_S1.rear),
    },
    pathMaxFrontDevFromS0: maxFrontDevS0,
    pathMaxFrontDevFromS1: maxFrontDevS1,
    pathMaxRearDevFromS0: maxRearDevS0,
    pathMaxRearDevFromS1: maxRearDevS1,
    minDepthMagnitude: minMag,
    minDepthAtT: minT,
    midpointDepth: {
      x: mid.depth.x,
      y: mid.depth.y,
      magnitude: mid.depthMagnitude,
      angle: mid.depthAngle,
    },
    mag0: at0.depthMagnitude,
    mag1: at1.depthMagnitude,
    finiteOk,
    bridge: P1_BRIDGE,
    fittedS0: FITTED_S0_POSE,
    series,
  };
}

/** Full-path metrics for P3 deliverables (live linear spatial authority). */
export function analyzeFullSpatialPath(
  steps = 401,
  split: number = V3_REVEAL_PRESSURE_SPLIT,
) {
  const s = split;
  const live = { split: s, ...LIVE_SPATIAL_SAMPLE };
  const at0 = sampleFullSpatialPath(0, live);
  const atSplitReveal = sampleS0toS1Path(1, LIVE_SPATIAL_SAMPLE.easing);
  const atSplitPressure = sampleS1toS2Path(0, LIVE_SPATIAL_SAMPLE.easing);
  const atSplitFull = sampleFullSpatialPath(s, live);
  const at1 = sampleFullSpatialPath(1, live);
  const at749 = sampleFullSpatialPath(s - 0.001, live);
  const at750 = sampleFullSpatialPath(s, live);
  const at751 = sampleFullSpatialPath(s + 0.001, live);

  let minMag = Infinity;
  let minT = 0;
  let minMagA = Infinity;
  let minTA = 0;
  let minMagB = Infinity;
  let minTB = 0;
  let finiteOk = true;
  const clampNeg = sampleFullSpatialPath(-0.5, live);
  const clampOver = sampleFullSpatialPath(1.5, live);

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const f = sampleFullSpatialPath(t, live);
    if (!f.finite) finiteOk = false;
    if (f.depthMagnitude < minMag) {
      minMag = f.depthMagnitude;
      minT = t;
    }
    if (t <= s && f.depthMagnitude < minMagA) {
      minMagA = f.depthMagnitude;
      minTA = t;
    }
    if (t > s && f.depthMagnitude < minMagB) {
      minMagB = f.depthMagnitude;
      minTB = t;
    }
  }

  const midA = sampleFullSpatialPath(s * 0.5, live);
  const midB = sampleFullSpatialPath(s + (1 - s) * 0.5, live);

  // Micro-hold probe: corner speed across equal Δt near boundary
  const dt = 0.001;
  const preA = sampleFullSpatialPath(s - 2 * dt, live);
  const preB = sampleFullSpatialPath(s - dt, live);
  const postA = sampleFullSpatialPath(s + dt, live);
  const postB = sampleFullSpatialPath(s + 2 * dt, live);
  const speed = (a: PathFrame, b: PathFrame) =>
    maxCornerDev(a.front, b.front) / dt;
  const speedIntoBoundary = speed(preA, preB);
  const speedOutOfBoundary = speed(postA, postB);
  const speedAcrossBoundary = speed(preB, postA);

  const joinDelta = (a: PathFrame, b: PathFrame) => {
    const ja = pathJoinSegments(a);
    const jb = pathJoinSegments(b);
    if (ja.length !== jb.length) return Infinity;
    let m = 0;
    for (let i = 0; i < ja.length; i++) {
      m = Math.max(
        m,
        Math.hypot(ja[i].a.x - jb[i].a.x, ja[i].a.y - jb[i].a.y),
        Math.hypot(ja[i].b.x - jb[i].b.x, ja[i].b.y - jb[i].b.y),
        Math.abs(ja[i].opacity - jb[i].opacity),
      );
    }
    return m;
  };

  return {
    split: s,
    endpointIntegrity: {
      S0: {
        frontMaxPx: maxCornerDev(at0.front, EXACT_S0_FRONT),
        rearMaxPx: maxCornerDev(at0.rear, EXACT_S0_REAR),
      },
      S1fromReveal: {
        frontMaxPx: maxCornerDev(atSplitReveal.front, EXACT_S1.front),
        rearMaxPx: maxCornerDev(atSplitReveal.rear, EXACT_S1.rear),
      },
      S1fromPressure: {
        frontMaxPx: maxCornerDev(atSplitPressure.front, EXACT_S1.front),
        rearMaxPx: maxCornerDev(atSplitPressure.rear, EXACT_S1.rear),
      },
      S1atSplitFull: {
        frontMaxPx: maxCornerDev(atSplitFull.front, EXACT_S1.front),
        rearMaxPx: maxCornerDev(atSplitFull.rear, EXACT_S1.rear),
      },
      S2: {
        frontMaxPx: maxCornerDev(at1.front, EXACT_S2.front),
        rearMaxPx: maxCornerDev(at1.rear, EXACT_S2.rear),
      },
    },
    boundaryContinuity: {
      front749to750: maxCornerDev(at749.front, at750.front),
      front750to751: maxCornerDev(at750.front, at751.front),
      front749to751: maxCornerDev(at749.front, at751.front),
      rear749to750: maxCornerDev(at749.rear, at750.rear),
      rear750to751: maxCornerDev(at750.rear, at751.rear),
      joins749to750: joinDelta(at749, at750),
      joins750to751: joinDelta(at750, at751),
      depthDelta749to750: {
        x: at750.depth.x - at749.depth.x,
        y: at750.depth.y - at749.depth.y,
        mag: Math.abs(at750.depthMagnitude - at749.depthMagnitude),
      },
      depthDelta750to751: {
        x: at751.depth.x - at750.depth.x,
        y: at751.depth.y - at750.depth.y,
        mag: Math.abs(at751.depthMagnitude - at750.depthMagnitude),
      },
      poseParamDelta749to750: paramDelta(at749.params, at750.params),
      poseParamDelta750to751: paramDelta(at750.params, at751.params),
      revealVsPressureAtS1: {
        front: maxCornerDev(atSplitReveal.front, atSplitPressure.front),
        rear: maxCornerDev(atSplitReveal.rear, atSplitPressure.rear),
        joins: joinDelta(atSplitReveal, atSplitPressure),
        params: paramDelta(atSplitReveal.params, atSplitPressure.params),
        upperLeftOpacity: Math.abs(
          atSplitReveal.upperLeftOpacity - atSplitPressure.upperLeftOpacity,
        ),
        revealMix: Math.abs(
          atSplitReveal.revealMix - atSplitPressure.revealMix,
        ),
        rearModeMatch: atSplitReveal.rearMode === atSplitPressure.rearMode,
      },
      microHold: {
        speedIntoBoundaryPxPerUnit: speedIntoBoundary,
        speedOutOfBoundaryPxPerUnit: speedOutOfBoundary,
        speedAcrossBoundaryPxPerUnit: speedAcrossBoundary,
        note:
          "easeInOutCubic endpoints have near-zero derivative — brief micro-hold at S1 is expected without a temporal bridge.",
      },
    },
    volume: {
      minDepthMagnitudeA: minMagA,
      minDepthAtTA: minTA,
      minDepthMagnitudeB: minMagB,
      minDepthAtTB: minTB,
      minDepthMagnitudeFull: minMag,
      minDepthAtTFull: minT,
      midpointA: {
        x: midA.depth.x,
        y: midA.depth.y,
        magnitude: midA.depthMagnitude,
        angle: midA.depthAngle,
      },
      midpointB: {
        x: midB.depth.x,
        y: midB.depth.y,
        magnitude: midB.depthMagnitude,
        angle: midB.depthAngle,
      },
      mag0: at0.depthMagnitude,
      magSplit: atSplitFull.depthMagnitude,
      mag1: at1.depthMagnitude,
    },
    finite: {
      finiteOk,
      clampNegIsS0: clampNeg.frontDevFromExactS0 === 0,
      clampOverIsS2: clampOver.frontDevFromExactS2 === 0,
      exactEndpoints: {
        t0stage: at0.stage,
        tSplitStage: atSplitFull.stage,
        t1stage: at1.stage,
      },
    },
    poses: { S1: S1_POSE, S2: S2_POSE, fittedS0: FITTED_S0_POSE },
  };
}

export function pathRearSegments(
  frame: PathFrame,
): Array<{ id: string; a: Point; b: Point; opacity: number; strokeWidth: number }> {
  const { front: _f, rear } = frame;
  void _f;
  if (frame.rearMode === "selective-stubs") {
    return [
      {
        id: "rear-upper",
        a: V3_S0_REAR_STUBS.upperStart,
        b: rear[1],
        opacity: 1,
        strokeWidth: 0.75,
      },
      {
        id: "rear-right",
        a: rear[1],
        b: rear[2],
        opacity: 1,
        strokeWidth: 0.75,
      },
      {
        id: "rear-lower",
        a: rear[2],
        b: rear[3],
        opacity: 0.92,
        strokeWidth: 0.8,
      },
      {
        id: "rear-left",
        a: rear[3],
        b: V3_S0_REAR_STUBS.leftReturnEnd,
        opacity: 0.5,
        strokeWidth: 0.75,
      },
    ];
  }
  return [
    { id: "rear-upper", a: rear[0], b: rear[1], opacity: 1, strokeWidth: 0.75 },
    { id: "rear-right", a: rear[1], b: rear[2], opacity: 1, strokeWidth: 0.75 },
    { id: "rear-lower", a: rear[2], b: rear[3], opacity: 0.92, strokeWidth: 0.8 },
    { id: "rear-left", a: rear[3], b: rear[0], opacity: 0.7, strokeWidth: 0.75 },
  ];
}

export function pathJoinSegments(frame: PathFrame) {
  const { front, rear, upperLeftOpacity } = frame;
  return [
    {
      id: "join-upperRight",
      a: front[1],
      b: rear[1],
      opacity: 1,
    },
    {
      id: "join-lowerRight",
      a: front[2],
      b: rear[2],
      opacity: 1,
    },
    {
      id: "join-lowerLeft",
      a: front[3],
      b: rear[3],
      opacity: 1,
    },
    {
      id: "join-upperLeft",
      a: front[0],
      b: rear[0],
      opacity: upperLeftOpacity,
    },
  ].filter((j) => j.opacity > 0.01);
}

/** Quiet F2 face materials (static hierarchy, no active brightening). */
export const V3_F2_FACE = {
  primary: { fillAlpha: 0.04, strokeAlpha: 0.16, strokeWidth: 0.65 },
  secondary: { fillAlpha: 0.02, strokeAlpha: 0.11, strokeWidth: 0.55 },
} as const;
