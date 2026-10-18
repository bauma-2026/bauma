/**
 * "Your Project" cube (`/` Mid CTA) — softly rounded satin-matte midnight slate.
 *
 * Form follows the Visual Layer cube: same camera (focal 3.4, camera z 2.45),
 * same rest pose, same unit cube with radius 0.28 and 8-step corners. The mesh is
 * rebuilt here, not imported, because `visualLayerGeometry.ts` fixes its own
 * scale, centre and fills and must not change.
 *
 * There are no strokes and no silhouette line. Every facet is shaded from one
 * soft light (above-left-front), so edges read through value change only.
 *
 * Size is anchored to the System cube: at 1440 it renders 163.8 × 174.3 px, and
 * the viewBox here maps 1:1 at that width. The rounded silhouette is scaled to
 * `TARGET_HEIGHT` viewBox units (≈ System height, see below).
 */

type Vec3 = { x: number; y: number; z: number };
type Vec2 = { x: number; y: number; z: number };

export const VIEWBOX_W = 520;
export const VIEWBOX_H = 400;
export const VIEWBOX = `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`;

/** Where the previous sharp cube's silhouette centred in this viewBox. Position is preserved. */
export const CENTER = { x: 259.93, y: 198.69 };

const FOCAL = 3.4;
const CAMERA_Z = 2.45;

/** Same rest pose as the Visual Layer cube: front face dominant on the left, side a real plane, top secondary. */
export const REST_RX = 0.4;
export const REST_RY = -0.54;

const RADIUS = 0.28;
const SEGS = 8;
/** Flat faces are cut into a grid so the light can fall off across them. 8 keeps neighbouring cells within ~1-2 8-bit levels (no visible stepping). */
const GRID = 8;

/**
 * Rendered silhouette height in viewBox units. 1 unit = 1px at 1440 (section
 * height 400, viewBox height 400). System cube measures 174.3 px tall and
 * 163.8 px wide; the rounded solid is slightly narrower in height and wider
 * in width than that, so the mean extent stays within ~2% of the System cube.
 */
export const TARGET_HEIGHT = 172;

/**
 * Single light, above-left-front, in view space (camera looks along +z, y is
 * down on screen). Low elevation keeps the family order front > top > side.
 */
const LIGHT = normalize({ x: -0.58, y: -0.28, z: -0.76 });
/** Wrap lighting so the unlit side face stays a material, not a void. */
const WRAP = 0.3;
/** Soft falloff across a face, toward the lower right of the screen. */
const FALLOFF_DIR = { x: 0.5, y: 0.5 };
const FALLOFF_GAIN = 0.08;

/**
 * Value ramp (lum 0..1 → colour). Muted slate-blue, saturation ~0.4, and
 * still below Royal Blue. Lifted a step for presence: the brightest rounded
 * edge (`#4A608C`) is a soft rim light, never a hotspot.
 *
 * Faces land at roughly: side ~0.0-0.2 (floor #1f2837), top ~0.45-0.65,
 * front ~0.75-0.9, with the top-front fillet peaking at the ceiling. Top is
 * deliberately darker than the front so the three planes separate by value.
 */
const RAMP: readonly { at: number; hex: string }[] = [
  { at: 0.0, hex: "#212b40" },
  { at: 0.06, hex: "#273249" },
  { at: 0.3, hex: "#2c3652" },
  { at: 0.66, hex: "#2f3f66" },
  { at: 0.85, hex: "#3a4d76" },
  { at: 1.0, hex: "#4a608c" },
];

type Poly = { id: string; pts: Vec3[] };

function v(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

function normalize(p: Vec3): Vec3 {
  const l = Math.hypot(p.x, p.y, p.z) || 1;
  return v(p.x / l, p.y / l, p.z / l);
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
  return normalize(v(nx, ny, nz));
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

function rotate(p: Vec3, rx: number, ry: number): Vec3 {
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  return v(x1, p.y * cx - z1 * sx, p.y * sx + z1 * cx);
}

/** Unit-scale projection about the origin; placement and size are applied after. */
function project(p: Vec3, rx: number, ry: number): Vec2 {
  const r = rotate(p, rx, ry);
  const s = FOCAL / (FOCAL + r.z + CAMERA_Z);
  return { x: r.x * s, y: r.y * s, z: r.z };
}

/** Rounded unit cube: 6 gridded flat faces, 12 edge strips, 8 corner patches. */
function roundedCube(): Poly[] {
  const r = RADIUS;
  const s = 1 - r;
  const polys: Poly[] = [];
  const signs = [-1, 1] as const;
  const arc = (i: number) => (i / SEGS) * (Math.PI / 2);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  for (let a = 0; a < GRID; a++) {
    for (let b = 0; b < GRID; b++) {
      const a0 = lerp(-s, s, a / GRID);
      const a1 = lerp(-s, s, (a + 1) / GRID);
      const b0 = lerp(-s, s, b / GRID);
      const b1 = lerp(-s, s, (b + 1) / GRID);
      for (const k of signs) {
        polys.push({
          id: `fx${k}-${a}-${b}`,
          pts: orientOut([v(k, a0, b0), v(k, a1, b0), v(k, a1, b1), v(k, a0, b1)]),
        });
        polys.push({
          id: `fy${k}-${a}-${b}`,
          pts: orientOut([v(a0, k, b0), v(a1, k, b0), v(a1, k, b1), v(a0, k, b1)]),
        });
        polys.push({
          id: `fz${k}-${a}-${b}`,
          pts: orientOut([v(a0, b0, k), v(a1, b0, k), v(a1, b1, k), v(a0, b1, k)]),
        });
      }
    }
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

const MESH = roundedCube().map((poly) => ({
  id: poly.id,
  pts: poly.pts,
  normal: newell(poly.pts),
}));

/** Silhouette box of the rounded mesh at rest, at unit scale. */
function restBox() {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const poly of MESH) {
    for (const p of poly.pts) {
      const q = project(p, REST_RX, REST_RY);
      minX = Math.min(minX, q.x);
      maxX = Math.max(maxX, q.x);
      minY = Math.min(minY, q.y);
      maxY = Math.max(maxY, q.y);
    }
  }
  return { minX, maxX, minY, maxY };
}

const BOX = restBox();
const SCALE = TARGET_HEIGHT / (BOX.maxY - BOX.minY);
/** Offsets that put the rest silhouette centre on `CENTER`. */
const OFFSET = {
  x: CENTER.x - ((BOX.minX + BOX.maxX) / 2) * SCALE,
  y: CENTER.y - ((BOX.minY + BOX.maxY) / 2) * SCALE,
};

function place(p: Vec3, rx: number, ry: number): Vec2 {
  const q = project(p, rx, ry);
  return { x: OFFSET.x + q.x * SCALE, y: OFFSET.y + q.y * SCALE, z: q.z };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const RAMP_RGB = RAMP.map((stop) => ({ at: stop.at, rgb: hexToRgb(stop.hex) }));

function colorAt(lum: number): string {
  const t = Math.min(Math.max(lum, 0), 1);
  let hi = RAMP_RGB.findIndex((stop) => stop.at >= t);
  if (hi <= 0) hi = 1;
  const lo = RAMP_RGB[hi - 1];
  const up = RAMP_RGB[hi];
  const u = (t - lo.at) / (up.at - lo.at);
  const ch = (i: number) =>
    Math.round(lo.rgb[i] + (up.rgb[i] - lo.rgb[i]) * u)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(0)}${ch(1)}${ch(2)}`;
}

function pathOf(pts: Vec2[]): string {
  return `${pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ")} Z`;
}

export type ProjectCubeFace = { id: string; d: string; fill: string };

/**
 * Visible facets, far to near. `lum` mixes wrapped Lambert (one light) with a
 * gentle falloff across the surface; the colour comes from the ramp.
 */
export function drawProjectCube(rx = REST_RX, ry = REST_RY): ProjectCubeFace[] {
  const out: { face: ProjectCubeFace; depth: number }[] = [];

  for (const poly of MESH) {
    const p2 = poly.pts.map((p) => place(p, rx, ry));
    let area = 0;
    for (let k = 0; k < p2.length; k++) {
      const a = p2[k];
      const b = p2[(k + 1) % p2.length];
      area += a.x * b.y - b.x * a.y;
    }
    if (area >= 0) continue;

    const depth = p2.reduce((sum, p) => sum + p.z, 0) / p2.length;
    const n = rotate(poly.normal, rx, ry);
    const lambert = (dot(n, LIGHT) + WRAP) / (1 + WRAP);

    const c = rotate(centroid(poly.pts), rx, ry);
    const fall = -(c.x * FALLOFF_DIR.x + c.y * FALLOFF_DIR.y) * FALLOFF_GAIN;

    out.push({
      depth,
      face: { id: poly.id, d: pathOf(p2), fill: colorAt(lambert + fall) },
    });
  }

  return out.sort((a, b) => b.depth - a.depth).map((item) => item.face);
}

/* -------------------------------------------------------------------------
 * Structural hint (hover reveal). Additive: nothing above depends on this.
 *
 * A few seams on the front plane, taken from the System cube's A2.2 front:
 * the vertical cut (X_FRONT -0.14), the horizontal cut that stops against it
 * (Y_FRONT 0.38, flipped because y is down here) and the short carrier stem
 * at their T-junction. They sit slightly *inside* the surface (so they move
 * with real parallax under the material) and are clipped to the front face's
 * flat footprint. Drawn only while revealed.
 * ---------------------------------------------------------------------- */

const STRUCT_DEPTH = 0.1;
const STRUCT_V = -0.14;
const STRUCT_H = -0.38;
/** Free ends stop short of the fillets, so nothing reaches a rounded edge. */
const STRUCT_REACH = 0.64;
const STRUCT_CARRIER = 0.15;
/** Clip footprint on the surface plane: just inside the flat face (0.72). */
const STRUCT_CLIP = 0.68;

export type ProjectStructureLine = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  tier: "seam" | "carrier";
  /** Which ends fade to nothing. The T-junction end of the horizontal seam stays joined. */
  fade: "both" | "start";
};

export type ProjectStructure = { clip: string; lines: ProjectStructureLine[] };

export function drawProjectStructure(rx = REST_RX, ry = REST_RY): ProjectStructure {
  const z = -1 + STRUCT_DEPTH;
  const at = (a: number, b: number) => place(v(a, b, z), rx, ry);
  const line = (
    id: string,
    from: [number, number],
    to: [number, number],
    tier: ProjectStructureLine["tier"],
    fade: ProjectStructureLine["fade"],
  ): ProjectStructureLine => {
    const p = at(from[0], from[1]);
    const q = at(to[0], to[1]);
    return { id, x1: p.x, y1: p.y, x2: q.x, y2: q.y, tier, fade };
  };

  const c = STRUCT_CLIP;
  const clip = pathOf([
    place(v(-c, -c, -1), rx, ry),
    place(v(c, -c, -1), rx, ry),
    place(v(c, c, -1), rx, ry),
    place(v(-c, c, -1), rx, ry),
  ]);

  return {
    clip,
    lines: [
      line("v", [STRUCT_V, -STRUCT_REACH], [STRUCT_V, STRUCT_REACH], "seam", "both"),
      line("h", [-STRUCT_REACH, STRUCT_H], [STRUCT_V, STRUCT_H], "seam", "start"),
      line(
        "t",
        [STRUCT_V, STRUCT_H - STRUCT_CARRIER],
        [STRUCT_V, STRUCT_H + STRUCT_CARRIER],
        "carrier",
        "both",
      ),
    ],
  };
}
