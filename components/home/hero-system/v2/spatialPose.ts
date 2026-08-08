/**
 * Production V2 pose projection — canonical volume → yaw/pitch/roll → screen.
 * Transferred from lab; Lift / reveal helpers omitted.
 */

import {
  V2_FRONT_POINTS,
  V2_REAR_POINTS,
  V2_VOLUME_SCENE,
  type Point,
} from "./volumeScene";

export type PoseId = "S0" | "S1" | "S2";

export type Vec3 = { x: number; y: number; z: number };

export type PoseParams = {
  yawDeg: number;
  pitchDeg: number;
  rollDeg: number;
  depth: Vec3;
  scale: number;
  globalTiltDeg: number;
};

export const POSE_PARAMS: Record<PoseId, PoseParams> = {
  S0: {
    yawDeg: 0,
    pitchDeg: 0,
    rollDeg: 0,
    depth: { x: 0, y: 0, z: 0 },
    scale: 1,
    globalTiltDeg: V2_VOLUME_SCENE.canvas.tiltDeg,
  },
  S1: {
    yawDeg: 6.5,
    pitchDeg: 4.5,
    rollDeg: -0.5,
    depth: { x: 0, y: 0, z: -148 },
    scale: 1,
    globalTiltDeg: V2_VOLUME_SCENE.canvas.tiltDeg,
  },
  S2: {
    yawDeg: -6.5,
    pitchDeg: -4.0,
    rollDeg: 0.5,
    depth: { x: 0, y: 0, z: -148 },
    scale: 1,
    globalTiltDeg: V2_VOLUME_SCENE.canvas.tiltDeg,
  },
};

export type FaceId = "top" | "right" | "bottom" | "left";

export type PoseFace = {
  id: FaceId;
  points: [Point, Point, Point, Point];
  signedArea: number;
  winding: "cw" | "ccw";
  cameraFacing: boolean;
  useful: boolean;
  render: boolean;
  role: "primary" | "secondary" | "hidden";
};

export type PoseSample = {
  pose: PoseId;
  params: PoseParams;
  front: Point[];
  rear: Point[];
  depthVectorScreen: Point;
  joins: {
    upperRight: { a: Point; b: Point };
    lowerRight: { a: Point; b: Point };
    lowerLeft: { a: Point; b: Point };
    upperLeft: { a: Point; b: Point };
  };
  faces: PoseFace[];
};

function copy(p: Point): Point {
  return { x: p.x, y: p.y };
}

function centroid(pts: Point[]): Point {
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
    y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
  };
}

function bbox(pts: Point[]) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  return {
    width,
    height,
    diagonal: Math.hypot(width, height),
  };
}

function signedArea(pts: Point[]) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

function deg(d: number) {
  return (d * Math.PI) / 180;
}

function rotateLocal(p: Vec3, yaw: number, pitch: number, roll: number): Vec3 {
  let { x, y, z } = p;
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  const x1 = x * cr - y * sr;
  const y1 = x * sr + y * cr;
  const z1 = z;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = y1 * cp - z1 * sp;
  const z2 = y1 * sp + z1 * cp;
  const x2 = x1;

  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  return {
    x: x2 * cy + z2 * sy,
    y: y2,
    z: -x2 * sy + z2 * cy,
  };
}

const S0_FRONT = V2_FRONT_POINTS.map(copy);
const S0_REAR = V2_REAR_POINTS.map(copy);
const S0_FOOT = bbox([...S0_FRONT, ...S0_REAR]);
const S0_ALL_C = centroid([...S0_FRONT, ...S0_REAR]);
const FRONT_LOCAL_C = centroid(V2_FRONT_POINTS);

export function canonicalLocalCorners(depth: Vec3): {
  front: Vec3[];
  rear: Vec3[];
} {
  const front = V2_FRONT_POINTS.map((p) => ({
    x: p.x - FRONT_LOCAL_C.x,
    y: p.y - FRONT_LOCAL_C.y,
    z: 0,
  }));
  const rear = front.map((p) => ({
    x: p.x + depth.x,
    y: p.y + depth.y,
    z: p.z + depth.z,
  }));
  return { front, rear };
}

export function projectPose(params: PoseParams): {
  front: Point[];
  rear: Point[];
  scale: number;
} {
  const { front: locF, rear: locR } = canonicalLocalCorners(params.depth);
  const yaw = deg(params.yawDeg);
  const pitch = deg(params.pitchDeg);
  const roll = deg(params.rollDeg);

  let front = locF.map((p) => {
    const r = rotateLocal(p, yaw, pitch, roll);
    return { x: r.x, y: r.y };
  });
  let rear = locR.map((p) => {
    const r = rotateLocal(p, yaw, pitch, roll);
    return { x: r.x, y: r.y };
  });

  const diag = bbox([...front, ...rear]).diagonal || 1;
  const scale = S0_FOOT.diagonal / diag;
  front = front.map((p) => ({ x: p.x * scale, y: p.y * scale }));
  rear = rear.map((p) => ({ x: p.x * scale, y: p.y * scale }));

  const c = centroid([...front, ...rear]);
  const ox = S0_ALL_C.x - c.x;
  const oy = S0_ALL_C.y - c.y;
  front = front.map((p) => ({ x: p.x + ox, y: p.y + oy }));
  rear = rear.map((p) => ({ x: p.x + ox, y: p.y + oy }));

  return { front, rear, scale };
}

function buildPoseFaces(
  front: Point[],
  rear: Point[],
  depthScreen: Point,
): PoseFace[] {
  const [fTL, fTR, fBR, fBL] = front;
  const [rTL, rTR, rBR, rBL] = rear;

  const defs: { id: FaceId; points: [Point, Point, Point, Point] }[] = [
    { id: "top", points: [copy(fTL), copy(fTR), copy(rTR), copy(rTL)] },
    { id: "right", points: [copy(fTR), copy(rTR), copy(rBR), copy(fBR)] },
    { id: "bottom", points: [copy(fBL), copy(fBR), copy(rBR), copy(rBL)] },
    { id: "left", points: [copy(fTL), copy(fBL), copy(rBL), copy(rTL)] },
  ];

  const usefulIds = new Set<FaceId>();
  if (depthScreen.x < -4) usefulIds.add("left");
  if (depthScreen.x > 4) usefulIds.add("right");
  if (depthScreen.y > 4) usefulIds.add("bottom");
  if (depthScreen.y < -4) usefulIds.add("top");

  const analyzed: PoseFace[] = defs.map((d) => {
    const a = signedArea(d.points);
    const useful = usefulIds.has(d.id) && Math.abs(a) >= 600;
    return {
      id: d.id,
      points: d.points,
      signedArea: a,
      winding: a >= 0 ? "ccw" : "cw",
      cameraFacing: Math.abs(a) >= 600,
      useful,
      render: false,
      role: "hidden" as const,
    };
  });

  const candidates = analyzed
    .filter((f) => f.useful)
    .sort((a, b) => Math.abs(b.signedArea) - Math.abs(a.signedArea));

  const pool =
    candidates.length >= 2
      ? candidates
      : [...analyzed]
          .filter((f) => Math.abs(f.signedArea) >= 600)
          .sort((a, b) => Math.abs(b.signedArea) - Math.abs(a.signedArea));

  const selected = pool.slice(0, 2).map((f) => f.id);
  return analyzed.map((f) => {
    if (selected[0] === f.id)
      return { ...f, render: true, role: "primary" as const };
    if (selected[1] === f.id)
      return { ...f, render: true, role: "secondary" as const };
    return f;
  });
}

export function sampleFromPoseParams(
  params: PoseParams,
  label: PoseId = "S1",
): PoseSample {
  const { front, rear, scale } = projectPose(params);
  const depthVectorScreen = {
    x: rear[0].x - front[0].x,
    y: rear[0].y - front[0].y,
  };
  return {
    pose: label,
    params: { ...params, scale },
    front,
    rear,
    depthVectorScreen,
    joins: {
      upperRight: { a: front[1], b: rear[1] },
      lowerRight: { a: front[2], b: rear[2] },
      lowerLeft: { a: front[3], b: rear[3] },
      upperLeft: { a: front[0], b: rear[0] },
    },
    faces: buildPoseFaces(front, rear, depthVectorScreen),
  };
}

export function pointsAttr(points: Point[]) {
  return points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}
