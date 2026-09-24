/**
 * Pristop V2 — Family 2 open cubic structure.
 * Orthographic (axonometric) projection only — not the cube's perspective camera.
 * Open top; envelope is cubic so it sits in the System / Next Step family
 * without becoming a solid cube or a tray.
 */

export type Vec3 = { x: number; y: number; z: number };
export type Vec2 = { x: number; y: number; z: number };
export type Quad = readonly [Vec3, Vec3, Vec3, Vec3];
export type StructuralState = "01" | "02" | "03";

export const SHELL_VIEWBOX = "0 0 400 260";

/** Cube envelope — open face on top. Tiny inequality so this is not Next Step. */
const W = 1.0;
const H = 0.97;
const D = 1.0;

const ORIGIN = { x: 170, y: 130 };
/**
 * Pocket scale — match System’s rendered family (~167×187 at 1440).
 * Calibrated by screen-space ink bbox, not SCALE vs System’s 72.
 * SCALE 54 → ~221×262; 40 → ~164×194 (slightly larger than System, open/lighter).
 */
const SCALE = 40;

/** Rest pose: slightly above-right (~26° pitch, ~29° yaw) — upright, interior visible
 * without looking down into the box. Yaw well clear of the Necker-symmetric start (0.30). */
export const BASE_YAW = 0.5;
export const BASE_PITCH = 0.46;

export const PARALLAX_YAW = 0.07;
export const PARALLAX_PITCH = 0.045;

const L = -W;
const R = W;
const Btm = -H;
const Top = H;
const F = D;
const K = -D;

function v(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

export const SHELL_PANELS: { id: string; role: "back" | "side" | "lid"; points: Quad }[] = [
  {
    id: "floor",
    role: "lid",
    points: [v(L, Btm, F), v(R, Btm, F), v(R, Btm, K), v(L, Btm, K)],
  },
  {
    id: "back",
    role: "back",
    points: [v(L, Btm, K), v(R, Btm, K), v(R, Top, K), v(L, Top, K)],
  },
  {
    id: "front",
    role: "side",
    points: [v(R, Btm, F), v(L, Btm, F), v(L, Top, F), v(R, Top, F)],
  },
  {
    id: "left",
    role: "side",
    points: [v(L, Btm, F), v(L, Btm, K), v(L, Top, K), v(L, Top, F)],
  },
  {
    id: "right",
    role: "side",
    points: [v(R, Btm, K), v(R, Btm, F), v(R, Top, F), v(R, Top, K)],
  },
];

/** Top face is absent — these four edges are the opening rim. Amber on the near threshold. */
export const OPENING_EDGES: { id: string; a: Vec3; b: Vec3; amber: boolean }[] = [
  { id: "open-sill", a: v(L, Top, F), b: v(R, Top, F), amber: true },
  { id: "open-right", a: v(R, Top, F), b: v(R, Top, K), amber: false },
  { id: "open-back", a: v(R, Top, K), b: v(L, Top, K), amber: false },
  { id: "open-left", a: v(L, Top, K), b: v(L, Top, F), amber: false },
];

export type NoiseVariant = "edges" | "planes" | "ghost";

export const NOISE_VARIANTS: readonly NoiseVariant[] = [
  "edges",
  "planes",
  "ghost",
] as const;

/** Implemented 01 noise: one offset ghost of the same shell — two readings, not clutter. */
export const DEFAULT_NOISE_VARIANT: NoiseVariant = "ghost";

export type NoiseEdge = { id: string; a: Vec3; b: Vec3 };
export type NoisePlane = { id: string; points: Quad };

function scalePoint(p: Vec3, s: number, t: Vec3 = { x: 0, y: 0, z: 0 }): Vec3 {
  return { x: p.x * s + t.x, y: p.y * s + t.y, z: p.z * s + t.z };
}

function scaleQuad(q: Quad, s: number, t?: Vec3): Quad {
  return [
    scalePoint(q[0], s, t),
    scalePoint(q[1], s, t),
    scalePoint(q[2], s, t),
    scalePoint(q[3], s, t),
  ];
}

function uniqueShellEdges(): NoiseEdge[] {
  const seen = new Set<string>();
  const edges: NoiseEdge[] = [];
  const push = (a: Vec3, b: Vec3) => {
    const key = [a, b]
      .map((p) => `${p.x}:${p.y}:${p.z}`)
      .sort()
      .join("|");
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ id: `e-${edges.length}`, a, b });
  };
  for (const panel of SHELL_PANELS) {
    const pts = panel.points;
    push(pts[0], pts[1]);
    push(pts[1], pts[2]);
    push(pts[2], pts[3]);
    push(pts[3], pts[0]);
  }
  return edges;
}

const SHELL_EDGES = uniqueShellEdges();

/** Duplicate / offset edge lines — extra construction + competing inner paths. */
export const NOISE_EDGES: NoiseEdge[] = [
  ...SHELL_EDGES.map((edge) => ({
    id: `dup-${edge.id}`,
    a: scalePoint(edge.a, 1.045, { x: 0.03, y: 0.025, z: 0.02 }),
    b: scalePoint(edge.b, 1.045, { x: 0.03, y: 0.025, z: 0.02 }),
  })),
  {
    id: "path-mid-x",
    a: v(0, Btm, F * 0.86),
    b: v(0, Btm, K * 0.86),
  },
  {
    id: "path-mid-z",
    a: v(L * 0.86, Btm, 0),
    b: v(R * 0.86, Btm, 0),
  },
  {
    id: "inner-rim-f",
    a: v(L * 0.72, Top, F * 0.72),
    b: v(R * 0.72, Top, F * 0.72),
  },
  {
    id: "inner-rim-r",
    a: v(R * 0.72, Top, F * 0.72),
    b: v(R * 0.72, Top, K * 0.72),
  },
  {
    id: "inner-rim-k",
    a: v(R * 0.72, Top, K * 0.72),
    b: v(L * 0.72, Top, K * 0.72),
  },
  {
    id: "inner-rim-l",
    a: v(L * 0.72, Top, K * 0.72),
    b: v(L * 0.72, Top, F * 0.72),
  },
];

const INSET = 0.16;

/** Secondary internal planes — extra surfaces inside the same volume. */
export const NOISE_PLANES: NoisePlane[] = [
  {
    id: "shelf",
    points: [
      v(L + INSET, -0.08, F - INSET),
      v(R - INSET, -0.08, F - INSET),
      v(R - INSET, -0.08, K + INSET),
      v(L + INSET, -0.08, K + INSET),
    ],
  },
  {
    id: "divider",
    points: [
      v(0.22, Btm + 0.04, F - INSET),
      v(0.22, Btm + 0.04, K + INSET),
      v(0.22, Top - 0.04, K + INSET),
      v(0.22, Top - 0.04, F - INSET),
    ],
  },
  {
    id: "false-floor",
    points: [
      v(L + 0.1, Btm + 0.14, F - 0.1),
      v(R - 0.1, Btm + 0.14, F - 0.1),
      v(R - 0.1, Btm + 0.14, K + 0.1),
      v(L + 0.1, Btm + 0.14, K + 0.1),
    ],
  },
];

const GHOST_SHIFT = { x: 0.08, y: 0.06, z: 0.055 };

/** Ghost-shell — same size, one offset reading. No scale-up, no extra paths. */
export const NOISE_GHOST_PANELS: NoisePlane[] = SHELL_PANELS.map((panel) => ({
  id: `ghost-${panel.id}`,
  points: scaleQuad(panel.points, 1, GHOST_SHIFT),
}));

export const NOISE_GHOST_EDGES: NoiseEdge[] = OPENING_EDGES.map((edge) => ({
  id: `ghost-${edge.id}`,
  a: scalePoint(edge.a, 1, GHOST_SHIFT),
  b: scalePoint(edge.b, 1, GHOST_SHIFT),
}));

export type StateLook = {
  noise: number;
  fillBack: number;
  fillSide: number;
  fillLid: number;
  strokeBack: number;
  strokeSide: number;
  strokeLid: number;
  opening: number;
  amber: number;
};

export type Form03Variant = "portal" | "frame" | "guide";

export const FORM03_VARIANTS: readonly Form03Variant[] = [
  "portal",
  "frame",
  "guide",
] as const;

const GATE_L = L * 0.42;
const GATE_R = R * 0.42;
const LINTEL = Top - 0.2;

/**
 * A — portal / passage.
 * 02 amber sill becomes the lintel of a cut through front and back.
 */
const _portal: { id: string; role: "back" | "side" | "lid"; points: Quad }[] = [
  {
    id: "floor",
    role: "lid",
    points: [v(L, Btm, F), v(R, Btm, F), v(R, Btm, K), v(L, Btm, K)],
  },
  {
    id: "left",
    role: "side",
    points: [v(L, Btm, F), v(L, Btm, K), v(L, Top, K), v(L, Top, F)],
  },
  {
    id: "right",
    role: "side",
    points: [v(R, Btm, K), v(R, Btm, F), v(R, Top, F), v(R, Top, K)],
  },
  {
    id: "front-left",
    role: "side",
    points: [
      v(L, Btm, F),
      v(GATE_L, Btm, F),
      v(GATE_L, LINTEL, F),
      v(L, LINTEL, F),
    ],
  },
  {
    id: "front-right",
    role: "side",
    points: [
      v(GATE_R, Btm, F),
      v(R, Btm, F),
      v(R, LINTEL, F),
      v(GATE_R, LINTEL, F),
    ],
  },
  {
    id: "front-lintel",
    role: "side",
    points: [
      v(L, LINTEL, F),
      v(R, LINTEL, F),
      v(R, Top, F),
      v(L, Top, F),
    ],
  },
  {
    id: "back-left",
    role: "back",
    points: [
      v(L, Btm, K),
      v(GATE_L, Btm, K),
      v(GATE_L, LINTEL, K),
      v(L, LINTEL, K),
    ],
  },
  {
    id: "back-right",
    role: "back",
    points: [
      v(GATE_R, Btm, K),
      v(R, Btm, K),
      v(R, LINTEL, K),
      v(GATE_R, LINTEL, K),
    ],
  },
  {
    id: "back-lintel",
    role: "back",
    points: [
      v(L, LINTEL, K),
      v(R, LINTEL, K),
      v(R, Top, K),
      v(L, Top, K),
    ],
  },
];

export const FORM03_PORTAL = {
  panels: _portal,
  edges: [
    { id: "portal-lintel", a: v(L, Top, F), b: v(R, Top, F), amber: true },
    { id: "portal-inner", a: v(GATE_L, LINTEL, F), b: v(GATE_R, LINTEL, F), amber: false },
    { id: "portal-left", a: v(GATE_L, Btm, F), b: v(GATE_L, LINTEL, F), amber: false },
    { id: "portal-right", a: v(GATE_R, Btm, F), b: v(GATE_R, LINTEL, F), amber: false },
  ],
};

const FRAME_INSET_X = 0.38;
const FRAME_INSET_Y = 0.26;
const FRAME_DEPTH = 0.32;
const FX0 = L;
const FX1 = L + FRAME_INSET_X;
const FX2 = R - FRAME_INSET_X;
const FX3 = R;
const FY0 = Btm;
const FY1 = Btm + FRAME_INSET_Y;
const FY2 = Top - FRAME_INSET_Y;
const FY3 = Top;
const FZ0 = F;
const FZ1 = F - FRAME_DEPTH;

/**
 * B — frame / focus.
 * Crate collapses to a depth frame around the resolved path.
 * Amber stays on the near-top inner edge (02 sill, now the focused aperture).
 */
const _frame: { id: string; role: "back" | "side" | "lid"; points: Quad }[] = [
  {
    id: "frame-top-front",
    role: "side",
    points: [v(FX0, FY2, FZ0), v(FX3, FY2, FZ0), v(FX3, FY3, FZ0), v(FX0, FY3, FZ0)],
  },
  {
    id: "frame-bot-front",
    role: "lid",
    points: [v(FX0, FY0, FZ0), v(FX3, FY0, FZ0), v(FX3, FY1, FZ0), v(FX0, FY1, FZ0)],
  },
  {
    id: "frame-left-front",
    role: "side",
    points: [v(FX0, FY1, FZ0), v(FX1, FY1, FZ0), v(FX1, FY2, FZ0), v(FX0, FY2, FZ0)],
  },
  {
    id: "frame-right-front",
    role: "side",
    points: [v(FX2, FY1, FZ0), v(FX3, FY1, FZ0), v(FX3, FY2, FZ0), v(FX2, FY2, FZ0)],
  },
  {
    id: "frame-top-back",
    role: "back",
    points: [v(FX0, FY2, FZ1), v(FX3, FY2, FZ1), v(FX3, FY3, FZ1), v(FX0, FY3, FZ1)],
  },
  {
    id: "frame-bot-back",
    role: "back",
    points: [v(FX0, FY0, FZ1), v(FX3, FY0, FZ1), v(FX3, FY1, FZ1), v(FX0, FY1, FZ1)],
  },
  {
    id: "frame-left-back",
    role: "back",
    points: [v(FX0, FY1, FZ1), v(FX1, FY1, FZ1), v(FX1, FY2, FZ1), v(FX0, FY2, FZ1)],
  },
  {
    id: "frame-right-back",
    role: "back",
    points: [v(FX2, FY1, FZ1), v(FX3, FY1, FZ1), v(FX3, FY2, FZ1), v(FX2, FY2, FZ1)],
  },
  {
    id: "frame-top-depth",
    role: "lid",
    points: [v(FX0, FY3, FZ0), v(FX3, FY3, FZ0), v(FX3, FY3, FZ1), v(FX0, FY3, FZ1)],
  },
  {
    id: "frame-bot-depth",
    role: "lid",
    points: [v(FX0, FY0, FZ0), v(FX3, FY0, FZ0), v(FX3, FY0, FZ1), v(FX0, FY0, FZ1)],
  },
  {
    id: "frame-left-depth",
    role: "side",
    points: [v(FX0, FY0, FZ0), v(FX0, FY0, FZ1), v(FX0, FY3, FZ1), v(FX0, FY3, FZ0)],
  },
  {
    id: "frame-right-depth",
    role: "side",
    points: [v(FX3, FY0, FZ1), v(FX3, FY0, FZ0), v(FX3, FY3, FZ0), v(FX3, FY3, FZ1)],
  },
];

export const FORM03_FRAME = {
  panels: _frame,
  edges: [
    { id: "frame-amber", a: v(FX1, FY2, FZ0), b: v(FX2, FY2, FZ0), amber: true },
    { id: "frame-left", a: v(FX1, FY1, FZ0), b: v(FX1, FY2, FZ0), amber: false },
    { id: "frame-right", a: v(FX2, FY1, FZ0), b: v(FX2, FY2, FZ0), amber: false },
    { id: "frame-bot", a: v(FX1, FY1, FZ0), b: v(FX2, FY1, FZ0), amber: false },
  ],
};

const GUIDE_BACK = W;
const GUIDE_FRONT = 0.52;

/**
 * C — guiding form.
 * Volume tapers toward the 02 amber sill so the shape directs along that route.
 */
const _guide: { id: string; role: "back" | "side" | "lid"; points: Quad }[] = [
  {
    id: "guide-floor",
    role: "lid",
    points: [
      v(-GUIDE_FRONT, Btm, F),
      v(GUIDE_FRONT, Btm, F),
      v(GUIDE_BACK, Btm, K),
      v(-GUIDE_BACK, Btm, K),
    ],
  },
  {
    id: "guide-left",
    role: "side",
    points: [
      v(-GUIDE_FRONT, Btm, F),
      v(-GUIDE_BACK, Btm, K),
      v(-GUIDE_BACK, Top, K),
      v(-GUIDE_FRONT, Top, F),
    ],
  },
  {
    id: "guide-right",
    role: "side",
    points: [
      v(GUIDE_BACK, Btm, K),
      v(GUIDE_FRONT, Btm, F),
      v(GUIDE_FRONT, Top, F),
      v(GUIDE_BACK, Top, K),
    ],
  },
  {
    id: "guide-back",
    role: "back",
    points: [
      v(-GUIDE_BACK, Btm, K),
      v(GUIDE_BACK, Btm, K),
      v(GUIDE_BACK, Top, K),
      v(-GUIDE_BACK, Top, K),
    ],
  },
];

export const FORM03_GUIDE = {
  panels: _guide,
  edges: [
    {
      id: "guide-amber",
      a: v(-GUIDE_FRONT, Top, F),
      b: v(GUIDE_FRONT, Top, F),
      amber: true,
    },
    {
      id: "guide-left-rim",
      a: v(-GUIDE_FRONT, Top, F),
      b: v(-GUIDE_BACK, Top, K),
      amber: false,
    },
    {
      id: "guide-right-rim",
      a: v(GUIDE_FRONT, Top, F),
      b: v(GUIDE_BACK, Top, K),
      amber: false,
    },
    {
      id: "guide-back-rim",
      a: v(-GUIDE_BACK, Top, K),
      b: v(GUIDE_BACK, Top, K),
      amber: false,
    },
  ],
};

export const FORM03 = {
  portal: FORM03_PORTAL,
  frame: FORM03_FRAME,
  guide: FORM03_GUIDE,
} as const;

export type ShellPanel = {
  id: string;
  role: "back" | "side" | "lid";
  points: Quad;
};

export type ShellEdge = {
  id: string;
  a: Vec3;
  b: Vec3;
  amber: boolean;
};

export function shellForState(
  state: StructuralState,
  form03?: Form03Variant,
): { panels: readonly ShellPanel[]; edges: readonly ShellEdge[] } {
  if (state === "03" && form03) {
    return FORM03[form03];
  }
  return { panels: SHELL_PANELS, edges: OPENING_EDGES };
}

export type Hierarchy03Variant = "primary" | "support" | "path";

export const HIERARCHY03_VARIANTS: readonly Hierarchy03Variant[] = [
  "primary",
  "support",
  "path",
] as const;

/** Implemented 03 hierarchy: floor primary + back support. */
export const DEFAULT_HIERARCHY03: Hierarchy03Variant = "support";

type PanelWeight = { fill: number; stroke: number };

/** Structural remainder — present, not competing. */
const H_WIRE: PanelWeight = { fill: 0.006, stroke: 0.18 };
/** Quieter supporting face. */
const H_SUPPORT: PanelWeight = { fill: 0.04, stroke: 0.26 };
/** Primary assigned face — weight, not material. */
const H_PRIMARY: PanelWeight = { fill: 0.1, stroke: 0.38 };

/**
 * Lab-only 03 hierarchy. Same SHELL_PANELS; roles by fill/stroke weight only.
 * Floor = working plane. Back = enclosure. Front = face that carries the 02 sill.
 */
export const HIERARCHY03: Record<
  Hierarchy03Variant,
  Record<string, PanelWeight>
> = {
  primary: {
    floor: H_PRIMARY,
    back: H_WIRE,
    front: H_WIRE,
    left: H_WIRE,
    right: H_WIRE,
  },
  support: {
    floor: H_PRIMARY,
    back: H_SUPPORT,
    front: H_WIRE,
    left: H_WIRE,
    right: H_WIRE,
  },
  path: {
    floor: H_SUPPORT,
    front: H_PRIMARY,
    back: H_WIRE,
    left: H_WIRE,
    right: H_WIRE,
  },
};

export const STATE_LOOK: Record<StructuralState, StateLook> = {
  "01": {
    noise: 0.09,
    fillBack: 0.008,
    fillSide: 0.011,
    fillLid: 0.014,
    strokeBack: 0.16,
    strokeSide: 0.26,
    strokeLid: 0.22,
    opening: 0.2,
    amber: 0,
  },
  "02": {
    noise: 0,
    fillBack: 0.014,
    fillSide: 0.02,
    fillLid: 0.026,
    strokeBack: 0.2,
    strokeSide: 0.34,
    strokeLid: 0.3,
    opening: 0.3,
    amber: 0.7,
  },
  "03": {
    noise: 0,
    fillBack: 0.02,
    fillSide: 0.028,
    fillLid: 0.038,
    strokeBack: 0.18,
    strokeSide: 0.32,
    strokeLid: 0.36,
    opening: 0.28,
    amber: 0.7,
  },
};

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

/** Orthographic axonometric. Depth `z` is camera-space for painter's order. */
export function project(p: Vec3, yaw: number, pitch: number): Vec2 {
  const r = rotateYawPitch(p, yaw, pitch);
  return {
    x: Math.round((ORIGIN.x + r.x * SCALE) * 100) / 100,
    y: Math.round((ORIGIN.y - r.y * SCALE) * 100) / 100,
    z: Math.round(r.z * 1000) / 1000,
  };
}

export function projectQuad(quad: Quad, yaw: number, pitch: number): Vec2[] {
  return quad.map((p) => project(p, yaw, pitch));
}

export function pointsToPath(pts: Vec2[]): string {
  return `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} ${pts
    .slice(1)
    .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ")} Z`;
}

export function averageZ(pts: Vec2[]): number {
  return pts.reduce((s, p) => s + p.z, 0) / pts.length;
}
