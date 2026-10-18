import { project, type Vec3 } from "./systemCubeGeometry";

/**
 * Homepage System cube (B5.1) scene; verbatim from the approved lab (`app/lab/system-cube/rotationalCubeScene.ts`).
 * B5 / B5.1 scene. B2's exterior (`SoftStructuralCube.tsx`) as a function of the camera:
 * every path is recomputed from 3D points with `project(p, yaw, pitch)`. Fillets are real
 * quadratic fillets in screen space. At (BASE_YAW, BASE_PITCH) the exterior strings match B2.
 *
 * Interior follows A's six interlocking modules and five cut planes, redrawn in B2's quieter
 * vocabulary (not A's 63-path stack):
 *
 *   Cuts:  x = X_FRONT, y = Y_FRONT, z = Z_MID, y = Y_BACK, x = X_BACK
 *   Far slab  (z ≤ Z_MID): left-bot, left-top, right
 *   Near slab (z ≥ Z_MID): bot-left, bot-right (blue), top
 *
 * Sparse keys (plane, e1, e2, e3, blueTop) stay for B5 / the recoverable B5.1 baseline.
 * Full keys add module fills, primary framework and secondary connections.
 */

type V = { x: number; y: number };

const H = 1;
export const Z_MID = 0.16;
export const Y_BACK = -0.2;
export const Y_FRONT = 0.38;
export const X_BACK = 0.4;
/** A's front-slab cut (far-slab vertical split in camera space). */
export const X_FRONT = -0.14;

const R_SIL = 5.5;
const R_NEAR = 4.5;
const R_BEND = 4;

const f2 = (n: number) => (Math.round(n * 100) / 100).toString();
const pt = (p: V) => `${f2(p.x)} ${f2(p.y)}`;
const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: V, b: V): V => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: V, k: number): V => ({ x: a.x * k, y: a.y * k });
const len = (a: V) => Math.hypot(a.x, a.y);
const unit = (a: V): V => mul(a, 1 / (len(a) || 1));
const mid = (a: V, b: V): V => mul(add(a, b), 0.5);

function fillet(prev: V, p: V, next: V, r: number) {
  const a = Math.min(r, len(sub(prev, p)) * 0.45);
  const b = Math.min(r, len(sub(next, p)) * 0.45);
  const rr = Math.min(a, b);
  return { s: add(p, mul(unit(sub(prev, p)), rr)), c: p, e: add(p, mul(unit(sub(next, p)), rr)) };
}
type Fillet = ReturnType<typeof fillet>;
const quad = (f: Fillet) => `Q${pt(f.c)} ${pt(f.e)}`;
function halves(f: Fillet) {
  const m = mul(add(add(f.s, mul(f.c, 2)), f.e), 0.25);
  return [
    `M${pt(f.s)}Q${pt(mid(f.s, f.c))} ${pt(m)}`,
    `M${pt(m)}Q${pt(mid(f.c, f.e))} ${pt(f.e)}`,
  ] as const;
}
const midpoint = (f: Fillet) => mul(add(add(f.s, mul(f.c, 2)), f.e), 0.25);

function roundedPoly(pts: V[], radii: number[]) {
  const n = pts.length;
  let d = "";
  pts.forEach((p, i) => {
    const prev = pts[(i + n - 1) % n];
    const next = pts[(i + 1) % n];
    if (radii[i] > 0) {
      const f = fillet(prev, p, next, radii[i]);
      d += `${d ? "L" : "M"}${pt(f.s)}${quad(f)}`;
    } else d += `${d ? "L" : "M"}${pt(p)}`;
  });
  return `${d}Z`;
}

function bend(a: V, b: V, c: V, r: number) {
  const f = fillet(a, b, c, r);
  return `M${pt(a)}L${pt(f.s)}${quad(f)}L${pt(c)}`;
}

const HEX_Z = [
  [-H, -H, H], [H, -H, H], [H, -H, -H], [H, H, -H], [-H, H, -H], [-H, H, H],
] as const;

/**
 * Line weight by camera depth. B2 steps it (.66 / .5 / .34 at z >= .2 / > -.2 / below); here the
 * steps are blended over +-.05 of the same thresholds so the weight does not jump while the cube
 * turns. B2's base values are all further than .13 from a threshold, so at rest they are unchanged.
 */
const sstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const alphaOf = (z: number) => {
  const a = 0.34 + 0.16 * sstep(-0.25, -0.15, z) + 0.16 * sstep(0.15, 0.25, z);
  return Math.round(a * 1000) / 1000;
};

export type Scene = ReturnType<typeof buildScene>;

export function buildScene(yaw: number, pitch: number) {
  const P = (x: number, y: number, z: number) => project({ x, y, z } as Vec3, yaw, pitch);
  const P2 = (x: number, y: number, z: number): V => {
    const p = P(x, y, z);
    return { x: p.x, y: p.y };
  };

  const C = {
    fl: P2(-H, -H, H),
    c2: P2(H, -H, H),
    c2b: P2(H, -H, -H),
    c3: P2(H, H, -H),
    c4: P2(-H, H, -H),
    c1: P2(-H, H, H),
    v: P2(H, H, H),
  };

  /* Silhouette: rounded hexagon, one segment per edge so depth can step the weight. */
  const HEX = [C.fl, C.c2, C.c2b, C.c3, C.c4, C.c1];
  const hexFillets = HEX.map((p, i) => fillet(HEX[(i + 5) % 6], p, HEX[(i + 1) % 6], R_SIL));
  const hexTier = HEX.map((_, i) => {
    const a = HEX_Z[i], b = HEX_Z[(i + 1) % 6];
    return P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2).z;
  });
  const hexEdge = HEX.map((_, i) => ({
    d: `M${pt(hexFillets[i].e)}L${pt(hexFillets[(i + 1) % 6].s)}`,
    alpha: alphaOf(hexTier[i]),
  }));
  const hexCorner = hexFillets.flatMap((f, i) => {
    const [h1, h2] = halves(f);
    return [
      { d: h1, alpha: alphaOf(hexTier[(i + 5) % 6]) },
      { d: h2, alpha: alphaOf(hexTier[i]) },
    ];
  });
  const body = roundedPoly(HEX, [R_SIL, R_SIL, R_SIL, R_SIL, R_SIL, R_SIL]);

  /* Near corner. */
  const outerEnds = [C.c1, C.c2, C.c3];
  const hexIdxOfEnd = [5, 1, 3];
  const nearEdgeEnds = outerEnds.map((_, k) => midpoint(hexFillets[hexIdxOfEnd[k]]));
  const nearEdges = outerEnds
    .map((c, k) => `M${pt(add(C.v, mul(unit(sub(c, C.v)), R_NEAR)))}L${pt(nearEdgeEnds[k])}`)
    .join("");
  const capTop = fillet(C.c1, C.v, C.c3, R_NEAR);
  const capFront = fillet(C.c2, C.v, C.c1, R_NEAR);
  const capRight = fillet(C.c3, C.v, C.c2, R_NEAR);
  const nearCaps = [capTop, capFront, capRight].map((f) => `M${pt(f.s)}${quad(f)}`).join("");

  /* Faces. */
  const top = `M${pt(C.c1)}L${pt(capTop.s)}${quad(capTop)}L${pt(C.c3)}L${pt(C.c4)}Z`;
  const front = `M${pt(C.fl)}L${pt(C.c2)}L${pt(capFront.s)}${quad(capFront)}L${pt(C.c1)}Z`;
  const right = `M${pt(C.c2)}L${pt(C.c2b)}L${pt(C.c3)}L${pt(capRight.s)}${quad(capRight)}Z`;
  const blue = `M${pt(P2(X_BACK, -H, H))}L${pt(C.c2)}L${pt(P2(H, Y_BACK, H))}L${pt(P2(X_BACK, Y_BACK, H))}Z`;

  /* Seams. */
  const belt = bend(P2(-H, Y_BACK, H), P2(H, Y_BACK, H), P2(H, Y_BACK, Z_MID), R_BEND);
  const depth = bend(P2(-H, H, Z_MID), P2(H, H, Z_MID), P2(H, -H, Z_MID), R_BEND);
  const post = `M${pt(P2(X_BACK, Y_BACK, H))}L${pt(P2(X_BACK, -H, H))}`;
  const step = `M${pt(P2(H, Y_FRONT, Z_MID))}L${pt(P2(H, Y_FRONT, -H))}`;

  /* Interior, same cube units as the exterior. */
  const poly = (pts: [number, number, number][], close = false) =>
    `M${pts.map((q) => pt(P2(...q))).join("L")}${close ? "Z" : ""}`;
  const Z = Z_MID;
  const XF = X_FRONT;
  const YF = Y_FRONT;
  const YB = Y_BACK;
  const XB = X_BACK;

  /* --- Sparse baseline (B5 / previous B5.1) --- */
  const plane = poly([[-H, -H, Z], [H, -H, Z], [H, H, Z], [-H, H, Z]], true);
  const e1 = poly([[H, -H, Z], [-H, -H, Z], [-H, H, Z]]);
  const e2 = poly([[-H, YB, Z], [H, YB, Z]]);
  const e3 = poly([[XB, -H, H], [XB, -H, Z], [XB, YB, Z], [XB, YB, H]]);
  const blueTop = poly([[XB, YB, Z], [H, YB, Z], [H, YB, H], [XB, YB, H]], true);

  /*
   * Full architecture: module end-caps on the slab interface, then the primary cut frame,
   * then quieter secondary runs that carry depth into both slabs, then the blue volume.
   *
   * Far slab on z = Z (looking +z through the front skin):
   *   left-bot [-H,-H]→[XF,YF] · left-top [-H,YF]→[XF,H] · right [XF,-H]→[H,H]
   * Near slab:
   *   bot-left [-H,-H,Z]→[XB,YB,H] · bot-right/blue [XB,-H,Z]→[H,YB,H] · top [-H,YB,Z]→[H,H,H]
   */
  const fillFarLBot = poly([[-H, -H, Z], [XF, -H, Z], [XF, YF, Z], [-H, YF, Z]], true);
  const fillFarLTop = poly([[-H, YF, Z], [XF, YF, Z], [XF, H, Z], [-H, H, Z]], true);
  const fillFarR = poly([[XF, -H, Z], [H, -H, Z], [H, H, Z], [XF, H, Z]], true);
  const fillNearL = poly([[-H, -H, Z], [XB, -H, Z], [XB, YB, Z], [-H, YB, Z]], true);
  const fillBlueBack = poly([[XB, -H, Z], [H, -H, Z], [H, YB, Z], [XB, YB, Z]], true);
  const fillNearFloor = poly([[-H, YB, Z], [H, YB, Z], [H, YB, H], [-H, YB, H]], true);
  const blueLeft = poly([[XB, -H, Z], [XB, -H, H], [XB, YB, H], [XB, YB, Z]], true);
  const blueFrontInner = poly([[XB, -H, H], [H, -H, H], [H, YB, H], [XB, YB, H]], true);

  /* Primary framework: the five cuts, drawn only where they read as structure. */
  const primZ = poly([[-H, -H, Z], [H, -H, Z], [H, H, Z], [-H, H, Z]], true);
  const primXF = poly([[XF, -H, Z], [XF, H, Z]]);
  const primYF = poly([[-H, YF, Z], [XF, YF, Z]]);
  const primYB = poly([[-H, YB, Z], [H, YB, Z]]);
  const primXB = poly([[XB, -H, Z], [XB, YB, Z]]);
  const primBlueCage = poly([[XB, -H, H], [XB, -H, Z], [XB, YB, Z], [XB, YB, H], [H, YB, H]]);
  const primNearPost = poly([[XB, YB, H], [XB, -H, H]]);
  /* Near-left module cage — same construction language as blue, without the accent fill. */
  const primNearLCage = poly([[-H, -H, H], [-H, -H, Z], [-H, YB, Z], [-H, YB, H], [XB, YB, H], [XB, -H, H]]);
  /* Far-left column cage on the interface, then a step back into the far slab. */
  const primFarLCage = poly([[-H, -H, Z], [XF, -H, Z], [XF, H, Z], [-H, H, Z]], true);
  const primFarLSplit = poly([[-H, YF, Z], [XF, YF, Z], [XF, YF, -H], [-H, YF, -H]]);

  /* Secondary: depth into the far slab and the near volume, quieter. */
  const secFarXFBot = poly([[XF, -H, Z], [XF, -H, -H]]);
  const secFarXFTop = poly([[XF, H, Z], [XF, H, -H]]);
  const secFarYFLeft = poly([[-H, YF, Z], [-H, YF, -H]]);
  const secFarYFXF = poly([[XF, YF, Z], [XF, YF, -H]]);
  const secFarRBack = poly([[H, -H, Z], [H, -H, -H], [H, H, -H], [H, H, Z]]);
  const secNearYBLeft = poly([[-H, YB, Z], [-H, YB, H]]);
  const secNearYBRight = poly([[H, YB, Z], [H, YB, H]]);
  const secNearLFloor = poly([[-H, -H, Z], [-H, YB, Z]]);
  const secNearLTop = poly([[-H, YB, H], [XB, YB, H]]);
  const secBlueFloor = poly([[XB, -H, Z], [H, -H, Z]]);
  const secBlueTopFront = poly([[XB, YB, H], [H, YB, H]]);
  const secBlueTopRight = poly([[H, YB, Z], [H, YB, H]]);

  return {
    body, top, front, right, blue,
    belt, depth, post, step,
    hexEdge, hexCorner, nearEdges, nearCaps,
    /* Sparse (recoverable baseline). */
    plane, e1, e2, e3, blueTop,
    /* Full architecture. */
    fillFarLBot, fillFarLTop, fillFarR, fillNearL, fillBlueBack, fillNearFloor,
    blueLeft, blueFrontInner,
    primZ, primXF, primYF, primYB, primXB, primBlueCage, primNearPost, primNearLCage, primFarLCage, primFarLSplit,
    secFarXFBot, secFarXFTop, secFarYFLeft, secFarYFXF, secFarRBack,
    secNearYBLeft, secNearYBRight, secNearLFloor, secNearLTop, secBlueFloor, secBlueTopFront, secBlueTopRight,
  };
}

/** Keys that form the previous sparse B5.1 interior (recoverable comparison). */
export const SPARSE_INTERIOR_KEYS = ["plane", "e1", "e2", "e3", "blueTop"] as const;

/** Keys that form the full architectural interior. */
export const FULL_INTERIOR_FILL_KEYS = [
  "fillFarR", "fillFarLTop", "fillFarLBot", "fillNearL", "fillBlueBack", "fillNearFloor",
  "plane", "blueFrontInner", "blueLeft", "blueTop",
] as const;

export const FULL_INTERIOR_PRIM_KEYS = [
  "primZ", "primXF", "primYF", "primYB", "primXB",
  "primFarLCage", "primFarLSplit", "primNearLCage", "primBlueCage", "primNearPost",
] as const;

export const FULL_INTERIOR_SEC_KEYS = [
  "secFarXFBot", "secFarXFTop", "secFarYFLeft", "secFarYFXF", "secFarRBack",
  "secNearYBLeft", "secNearYBRight", "secNearLFloor", "secNearLTop",
  "secBlueFloor", "secBlueTopFront", "secBlueTopRight",
] as const;
