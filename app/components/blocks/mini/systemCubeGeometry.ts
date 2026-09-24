/**
 * Production System object — A2.2 interlocking cube (orthographic).
 * Wire-first pocket drawing. No concept states.
 */

export type Vec3 = { x: number; y: number; z: number };
export type Vec2 = { x: number; y: number; z: number };
export type FaceFill = "front" | "side" | "rear";
export type Quad = readonly [Vec3, Vec3, Vec3, Vec3];

export const VIEWBOX = "0 0 280 240";
export const ORIGIN = { x: 140, y: 120 };

/** Pocket bbox target ~160–190px at 1440. Measured in the section, not SCALE. */
export const SCALE = 72;

export const BASE_YAW = 0.62;
export const BASE_PITCH = 0.52;

/** Same family as Pristop pocket follow — smaller amplitude. */
export const FOLLOW_YAW = 0.055;
export const FOLLOW_PITCH = 0.034;

/** Module travel at full activation — 3% of CUBE_H, along cut axes only. */
export const SEPARATION = 0.03;

export const CUBE_H = 1;

const X_FRONT = -0.14;
const Y_FRONT = 0.38;
const Z_MID = 0.16;
const X_BACK = 0.4;
const Y_BACK = -0.2;

function v(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

function rotateYawPitch(p: Vec3, yaw: number, pitch: number): Vec3 {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = p.y * cp - z1 * sp;
  const z2 = p.y * sp + z1 * cp;
  return { x: x1, y: y2, z: z2 };
}

export function project(p: Vec3, yaw: number, pitch: number): Vec2 {
  const r = rotateYawPitch(p, yaw, pitch);
  return {
    x: Math.round((ORIGIN.x + r.x * SCALE) * 100) / 100,
    y: Math.round((ORIGIN.y - r.y * SCALE) * 100) / 100,
    z: Math.round(r.z * 1000) / 1000,
  };
}

export type DrawnFace = {
  id: string;
  d: string;
  z: number;
  fill: FaceFill;
  joint?: boolean;
};

export type DrawnEdge = {
  id: string;
  d: string;
  z: number;
  role: "silhouette" | "seam";
};

function quadPath(pts: Vec2[]): string {
  return `${pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ")} Z`;
}

function area2(pts: Vec2[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const n = pts[(i + 1) % pts.length];
    a += pts[i].x * n.y - n.x * pts[i].y;
  }
  return a;
}

function averageZ(pts: Vec2[]): number {
  return pts.reduce((s, p) => s + p.z, 0) / pts.length;
}

function fillFromNormal(n: Vec3, yaw: number, pitch: number): FaceFill {
  const r = rotateYawPitch(n, yaw, pitch);
  const ax = Math.abs(r.x);
  const ay = Math.abs(r.y);
  const az = Math.abs(r.z);
  if (ay >= ax && ay >= az) return "rear";
  if (az >= ax) return r.z >= 0 ? "front" : "rear";
  return "side";
}

function boxFaces(
  id: string,
  min: Vec3,
  max: Vec3,
): { id: string; quad: Quad; normal: Vec3 }[] {
  const { x: x0, y: y0, z: z0 } = min;
  const { x: x1, y: y1, z: z1 } = max;
  const all: { key: string; quad: Quad; normal: Vec3 }[] = [
    {
      key: "+x",
      normal: v(1, 0, 0),
      quad: [v(x1, y0, z0), v(x1, y1, z0), v(x1, y1, z1), v(x1, y0, z1)],
    },
    {
      key: "-x",
      normal: v(-1, 0, 0),
      quad: [v(x0, y0, z1), v(x0, y1, z1), v(x0, y1, z0), v(x0, y0, z0)],
    },
    {
      key: "+y",
      normal: v(0, 1, 0),
      quad: [v(x0, y1, z0), v(x0, y1, z1), v(x1, y1, z1), v(x1, y1, z0)],
    },
    {
      key: "-y",
      normal: v(0, -1, 0),
      quad: [v(x0, y0, z1), v(x0, y0, z0), v(x1, y0, z0), v(x1, y0, z1)],
    },
    {
      key: "+z",
      normal: v(0, 0, 1),
      quad: [v(x0, y0, z1), v(x1, y0, z1), v(x1, y1, z1), v(x0, y1, z1)],
    },
    {
      key: "-z",
      normal: v(0, 0, -1),
      quad: [v(x1, y0, z0), v(x0, y0, z0), v(x0, y1, z0), v(x1, y1, z0)],
    },
  ];
  return all.map((f) => ({ id: `${id}-${f.key}`, quad: f.quad, normal: f.normal }));
}

function onCubeHull(p: Vec3, h = CUBE_H, eps = 0.002): boolean {
  return (
    Math.abs(Math.abs(p.x) - h) < eps ||
    Math.abs(Math.abs(p.y) - h) < eps ||
    Math.abs(Math.abs(p.z) - h) < eps
  );
}

function faceOnCubeHull(quad: Quad): boolean {
  return quad.every((p) => onCubeHull(p));
}

type Box = { id: string; min: Vec3; max: Vec3 };

function boxesA22(): Box[] {
  const H = CUBE_H;
  return [
    { id: "a22-fl-bot", min: v(-H, -H, -H), max: v(X_FRONT, Y_FRONT, Z_MID) },
    { id: "a22-fl-top", min: v(-H, Y_FRONT, -H), max: v(X_FRONT, H, Z_MID) },
    { id: "a22-front-right", min: v(X_FRONT, -H, -H), max: v(H, H, Z_MID) },
    { id: "a22-back-bot-l", min: v(-H, -H, Z_MID), max: v(X_BACK, Y_BACK, H) },
    { id: "a22-back-bot-r", min: v(X_BACK, -H, Z_MID), max: v(H, Y_BACK, H) },
    { id: "a22-back-top", min: v(-H, Y_BACK, Z_MID), max: v(H, H, H) },
  ];
}

/** Unit cut-axis for each module, then scaled to SEPARATION. Not radial explode. */
const MODULE_AXIS: Record<string, Vec3> = {
  "a22-fl-bot": v(-1, -0.45, -1),
  "a22-fl-top": v(-1, 0.45, -1),
  "a22-front-right": v(1, 0, -1),
  "a22-back-bot-l": v(-0.55, -1, 1),
  "a22-back-bot-r": v(0.55, -1, 1),
  "a22-back-top": v(0, 1, 1),
};

function moduleShift(id: string, activation: number): Vec3 {
  if (activation <= 0) return v(0, 0, 0);
  const d = MODULE_AXIS[id];
  if (!d) return v(0, 0, 0);
  const len = Math.hypot(d.x, d.y, d.z) || 1;
  const s = SEPARATION * activation;
  return v((d.x / len) * s, (d.y / len) * s, (d.z / len) * s);
}

function shifted(p: Vec3, id: string, activation: number): Vec3 {
  const s = moduleShift(id, activation);
  return v(p.x + s.x, p.y + s.y, p.z + s.z);
}

/** Two short T-junction stems — unshifted, so they sit in the opening gap. */
export const ACTIVATION_LINKS: { id: string; a: Vec3; b: Vec3 }[] = [
  {
    id: "link-front-t",
    a: v(X_FRONT, Y_FRONT - 0.15, Z_MID),
    b: v(X_FRONT, Y_FRONT + 0.15, Z_MID),
  },
  {
    id: "link-back-t",
    a: v(X_BACK - 0.13, Y_BACK, Z_MID),
    b: v(X_BACK + 0.13, Y_BACK, Z_MID),
  },
];

function onCubeOutline(a: Vec3, b: Vec3, eps = 0.002): boolean {
  const H = CUBE_H;
  const lock = (axis: "x" | "y" | "z") =>
    Math.abs(a[axis] - b[axis]) < eps && Math.abs(Math.abs(a[axis]) - H) < eps;
  return [lock("x"), lock("y"), lock("z")].filter(Boolean).length >= 2;
}

function edgeKey(a: Vec3, b: Vec3): string {
  const fmt = (p: Vec3) => `${p.x.toFixed(3)},${p.y.toFixed(3)},${p.z.toFixed(3)}`;
  const ka = fmt(a);
  const kb = fmt(b);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

function lineD(a: Vec2, b: Vec2): string {
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} L ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

export type SystemCubeDrawing = {
  fills: DrawnFace[];
  silhouette: DrawnEdge[];
  seams: DrawnEdge[];
  links: DrawnEdge[];
};

export function systemCubeDrawing(
  yaw = BASE_YAW,
  pitch = BASE_PITCH,
  activation = 0,
): SystemCubeDrawing {
  const on = Math.min(1, Math.max(0, activation));
  const fills: DrawnFace[] = [];
  const boxes = boxesA22();

  for (const box of boxes) {
    for (const face of boxFaces(box.id, box.min, box.max)) {
      const hull = faceOnCubeHull(face.quad);
      if (!hull && on < 0.02) continue;
      const pts = face.quad.map((p) => project(shifted(p, box.id, on), yaw, pitch));
      if (area2(pts) >= 0) continue;
      fills.push({
        id: face.id,
        d: quadPath(pts),
        z: averageZ(pts),
        fill: hull ? fillFromNormal(face.normal, yaw, pitch) : "rear",
        joint: !hull,
      });
    }
  }
  fills.sort((a, b) => a.z - b.z);

  const silhouetteMap = new Map<string, DrawnEdge>();
  const seamMap = new Map<string, DrawnEdge>();

  for (const box of boxes) {
    for (const face of boxFaces(box.id, box.min, box.max)) {
      if (!faceOnCubeHull(face.quad)) continue;
      const q = face.quad.map((p) => shifted(p, box.id, on));
      const pts = q.map((p) => project(p, yaw, pitch));
      if (area2(pts) >= 0) continue;
      for (let i = 0; i < 4; i += 1) {
        const a0 = face.quad[i];
        const b0 = face.quad[(i + 1) % 4];
        const outline = onCubeOutline(a0, b0);
        const a = q[i];
        const b = q[(i + 1) % 4];
        const key = `${box.id}|${edgeKey(a, b)}`;
        const pa = project(a, yaw, pitch);
        const pb = project(b, yaw, pitch);
        const drawn: DrawnEdge = {
          id: `${outline ? "sil" : "seam"}-${key}`,
          d: lineD(pa, pb),
          z: (pa.z + pb.z) / 2,
          role: outline ? "silhouette" : "seam",
        };
        if (outline) silhouetteMap.set(key, drawn);
        else if (!silhouetteMap.has(key)) seamMap.set(key, drawn);
      }
    }
  }

  const links: DrawnEdge[] = [];
  for (const link of ACTIVATION_LINKS) {
    const pa = project(link.a, yaw, pitch);
    const pb = project(link.b, yaw, pitch);
    links.push({
      id: link.id,
      d: lineD(pa, pb),
      z: (pa.z + pb.z) / 2,
      role: "seam",
    });
  }

  return {
    fills,
    silhouette: [...silhouetteMap.values()],
    seams: [...seamMap.values()],
    links,
  };
}
