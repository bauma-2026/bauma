/**
 * Production Visual Layer object.
 * Pocket Cube projection and unit-cube mass.
 * Locked faces, radius 0.28, fillet alignment 0.94, 8-step corners.
 * Pose only — no cavity, ghost, or amber.
 */

type Vec3 = { x: number; y: number; z: number };
type Vec2 = { x: number; y: number; z: number };

const CX = 265;
const CY = 185.5;
const SCALE = 102;
const FOCAL = 3.4;
const CAMERA_Z = 2.45;

export const REST_RX = 0.4;
export const REST_RY = -0.54;

const RADIUS = 0.28;
const SEGS = 8;
const FACE_ALIGN = 0.94;

const NEAR = "#38342f";
const SIDE = "#181613";
const TOP = "#2a2622";

export const SILHOUETTE = "rgba(255,255,255,0.06)";

type Poly = { id: string; pts: Vec3[] };

function v(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

function dot(a: Vec3, b: Vec3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function newell(pts: Vec3[]): Vec3 {
  let nx = 0;
  let ny = 0;
  let nz = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    nx += (p.y - q.y) * (p.z + q.z);
    ny += (p.z - q.z) * (p.x + q.x);
    nz += (p.x - q.x) * (p.y + q.y);
  }
  const l = Math.hypot(nx, ny, nz) || 1;
  return v(nx / l, ny / l, nz / l);
}

function centroid(pts: Vec3[]): Vec3 {
  const n = pts.length;
  return v(
    pts.reduce((s, p) => s + p.x, 0) / n,
    pts.reduce((s, p) => s + p.y, 0) / n,
    pts.reduce((s, p) => s + p.z, 0) / n,
  );
}

function orientOut(pts: Vec3[]): Vec3[] {
  return dot(newell(pts), centroid(pts)) < 0 ? [...pts].reverse() : pts;
}

function mixHex(a: string, b: string, t: number): string {
  const channel = (hex: string, i: number) => Number.parseInt(hex.slice(i, i + 2), 16);
  const parts = [1, 3, 5].map((i) => {
    const mixed = Math.round(channel(a, i) + (channel(b, i) - channel(a, i)) * t);
    return mixed.toString(16).padStart(2, "0");
  });
  return `#${parts.join("")}`;
}

/** Flat face, then a blend that stays between the two face tones, then the next face. */
function fillFor(n: Vec3): string {
  const parts = [
    { v: Math.abs(n.x), color: SIDE },
    { v: Math.abs(n.y), color: TOP },
    { v: Math.abs(n.z), color: NEAR },
  ].sort((a, b) => b.v - a.v);
  const primary = parts[0];
  const secondary = parts[1];
  const theta = Math.atan2(secondary.v, primary.v);
  const theta0 = Math.atan2(Math.sqrt(Math.max(0, 1 - FACE_ALIGN * FACE_ALIGN)), FACE_ALIGN);
  const span = Math.PI / 2 - 2 * theta0;
  if (span <= 0.02 || theta <= theta0) return primary.color;
  const x = Math.min(1, Math.max(0, (theta - theta0) / span));
  const u = x * x * (3 - 2 * x);
  return mixHex(primary.color, secondary.color, u);
}

/** Same rotate + project as MiniNextStepCube. */
function project(p: Vec3, rx: number, ry: number): Vec2 {
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const y2 = p.y * cx - z1 * sx;
  const z2 = p.y * sx + z1 * cx;
  const s = FOCAL / (FOCAL + z2 + CAMERA_Z);
  return { x: CX + x1 * SCALE * s, y: CY + y2 * SCALE * s, z: z2 };
}

function roundedCube(): Poly[] {
  const r = RADIUS;
  const s = 1 - r;
  const polys: Poly[] = [];
  const signs = [-1, 1] as const;
  const arc = (i: number) => (i / SEGS) * (Math.PI / 2);

  for (const sx of signs) {
    polys.push({
      id: `x${sx}`,
      pts: orientOut([v(sx, -s, -s), v(sx, -s, s), v(sx, s, s), v(sx, s, -s)]),
    });
  }
  for (const sy of signs) {
    polys.push({
      id: `y${sy}`,
      pts: orientOut([v(-s, sy, -s), v(s, sy, -s), v(s, sy, s), v(-s, sy, s)]),
    });
  }
  for (const sz of signs) {
    polys.push({
      id: `z${sz}`,
      pts: orientOut([v(-s, -s, sz), v(-s, s, sz), v(s, s, sz), v(s, -s, sz)]),
    });
  }

  for (const sy of signs) {
    for (const sz of signs) {
      for (let i = 0; i < SEGS; i++) {
        const t0 = arc(i);
        const t1 = arc(i + 1);
        const at = (t: number, x: number) =>
          v(x, sy * s + sy * r * Math.cos(t), sz * s + sz * r * Math.sin(t));
        polys.push({
          id: `ex-${sy}-${sz}-${i}`,
          pts: orientOut([at(t0, -s), at(t1, -s), at(t1, s), at(t0, s)]),
        });
      }
    }
  }
  for (const sx of signs) {
    for (const sz of signs) {
      for (let i = 0; i < SEGS; i++) {
        const t0 = arc(i);
        const t1 = arc(i + 1);
        const at = (t: number, y: number) =>
          v(sx * s + sx * r * Math.cos(t), y, sz * s + sz * r * Math.sin(t));
        polys.push({
          id: `ey-${sx}-${sz}-${i}`,
          pts: orientOut([at(t0, -s), at(t1, -s), at(t1, s), at(t0, s)]),
        });
      }
    }
  }
  for (const sx of signs) {
    for (const sy of signs) {
      for (let i = 0; i < SEGS; i++) {
        const t0 = arc(i);
        const t1 = arc(i + 1);
        const at = (t: number, z: number) =>
          v(sx * s + sx * r * Math.cos(t), sy * s + sy * r * Math.sin(t), z);
        polys.push({
          id: `ez-${sx}-${sy}-${i}`,
          pts: orientOut([at(t0, -s), at(t1, -s), at(t1, s), at(t0, s)]),
        });
      }
    }
  }

  for (const sx of signs) {
    for (const sy of signs) {
      for (const sz of signs) {
        const corner = (i: number, j: number) => {
          const a = arc(i);
          const b = arc(j);
          return v(
            sx * s + sx * r * Math.cos(a) * Math.cos(b),
            sy * s + sy * r * Math.sin(a) * Math.cos(b),
            sz * s + sz * r * Math.sin(b),
          );
        };
        for (let i = 0; i < SEGS; i++) {
          for (let j = 0; j < SEGS; j++) {
            polys.push({
              id: `c-${sx}-${sy}-${sz}-${i}-${j}`,
              pts: orientOut([
                corner(i, j),
                corner(i + 1, j),
                corner(i + 1, j + 1),
                corner(i, j + 1),
              ]),
            });
          }
        }
      }
    }
  }

  return polys;
}

const POLYS = roundedCube();

function screenBox(pts: Vec2[]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY };
}

/** Rounding sits inside the sharp corners. Scale about the cube centre so apparent size matches. */
function fitScale(): number {
  const sharp: Vec2[] = [];
  for (const x of [-1, 1]) {
    for (const y of [-1, 1]) {
      for (const z of [-1, 1]) sharp.push(project(v(x, y, z), REST_RX, REST_RY));
    }
  }
  const mesh = POLYS.flatMap((poly) => poly.pts.map((p) => project(p, REST_RX, REST_RY)));
  return screenBox(sharp).w / screenBox(mesh).w;
}

const FIT = fitScale();

function fit(p: Vec3, rx: number, ry: number): Vec2 {
  const s = project(p, rx, ry);
  return { x: CX + (s.x - CX) * FIT, y: CY + (s.y - CY) * FIT, z: s.z };
}

function pathOf(pts: Vec2[]): string {
  return `${pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ")} Z`;
}

function keyOf(p: Vec3) {
  return `${p.x.toFixed(3)},${p.y.toFixed(3)},${p.z.toFixed(3)}`;
}

function restViewBox(): string {
  const pts = POLYS.flatMap((poly) => poly.pts.map((p) => fit(p, REST_RX, REST_RY)));
  const box = screenBox(pts);
  const pad = 10;
  return `${(box.minX - pad).toFixed(2)} ${(box.minY - pad).toFixed(2)} ${(box.w + pad * 2).toFixed(2)} ${(box.h + pad * 2).toFixed(2)}`;
}

export const VIEWBOX = restViewBox();

export type VisualLayerDrawing = {
  faces: { id: string; d: string; fill: string }[];
  silhouette: string;
};

export function drawVisualLayerCube(rx = REST_RX, ry = REST_RY): VisualLayerDrawing {
  const projected = POLYS.map((poly) => {
    const p2 = poly.pts.map((p) => fit(p, rx, ry));
    let area = 0;
    for (let k = 0; k < p2.length; k++) {
      const a = p2[k];
      const b = p2[(k + 1) % p2.length];
      area += a.x * b.y - b.x * a.y;
    }
    const depth = p2.reduce((sum, p) => sum + p.z, 0) / p2.length;
    return { poly, p2, facing: area < 0, depth };
  });

  const keyPoint = new Map<string, Vec2>();
  const edges = new Map<string, { a: string; b: string; seen: number; vis: number }>();
  projected.forEach((face) => {
    const keys = face.poly.pts.map((p, i) => {
      const k = keyOf(p);
      keyPoint.set(k, face.p2[i]);
      return k;
    });
    keys.forEach((ka, i) => {
      const kb = keys[(i + 1) % keys.length];
      if (ka === kb) return;
      const id = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
      const edge = edges.get(id) ?? { a: ka, b: kb, seen: 0, vis: 0 };
      edge.seen += 1;
      if (face.facing) edge.vis += 1;
      edges.set(id, edge);
    });
  });

  let silhouette = "";
  for (const edge of edges.values()) {
    if (edge.vis !== 1 || edge.seen < 1) continue;
    const a = keyPoint.get(edge.a);
    const b = keyPoint.get(edge.b);
    if (!a || !b) continue;
    silhouette += `M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
  }

  const faces = projected
    .filter((face) => face.facing)
    .sort((a, b) => b.depth - a.depth)
    .map((face) => ({
      id: face.poly.id,
      d: pathOf(face.p2),
      fill: fillFor(newell(face.poly.pts)),
    }));

  return { faces, silhouette };
}
