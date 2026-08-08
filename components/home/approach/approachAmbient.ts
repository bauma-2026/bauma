/**
 * B02 ambient equilibria — locked pose targets + single-clock helpers.
 * Geometry offsets are LOCKED. Motion driver lives in useApproachAmbient.
 */

import { SELECTION_STATES } from "@/components/home/approach/approachStates";

export type AmbientVariant = "A" | "B" | "C";

export type AmbientPhase =
  | "off"
  | "idle"
  | "shift"
  | "hold"
  | "return"
  | "cancel"
  | "suppressed";

export type AuthorityMode = "rest" | "ambient" | "stateMorph" | "tension" | "handoff";

export type NodeOffset = { x: number; y: number };

export type AmberPathOffsets = {
  start: NodeOffset;
  joint: NodeOffset;
  end: NodeOffset;
};

export type AmbientDebug = {
  authority: AuthorityMode;
  phase: AmbientPhase;
  variant: AmbientVariant;
  rawProgress: number;
  easedProgress: number;
  framerActive: boolean;
  ambientStrength: number;
  suppressReason: string | null;
  leadNode: string | null;
};

const ZERO: NodeOffset = { x: 0, y: 0 };

export const NODE_IDS = [
  "n0",
  "n1",
  "n2",
  "n3",
  "n4",
  "n5",
  "n6",
  "n7",
] as const;

/**
 * B02-B — Open Tension. LOCKED.
 */
export const B02_B_OFFSETS: Record<string, NodeOffset> = {
  n0: { x: -7.5, y: -5.5 },
  n1: { x: 2.5, y: -3.8 },
  n2: { x: 7.5, y: -4.5 },
  n3: { x: 0, y: 0 },
  n4: { x: 0, y: 0 },
  n5: { x: 8.5, y: -2.5 },
  n6: { x: -2.2, y: 2.8 },
  n7: { x: 0, y: 0 },
};

/**
 * B02-C — Directed Compression. LOCKED.
 */
export const B02_C_OFFSETS: Record<string, NodeOffset> = {
  n0: { x: 5.5, y: 3.0 },
  n1: { x: 4.0, y: 3.5 },
  n2: { x: -5.0, y: 2.5 },
  n3: { x: 0, y: 0 },
  n4: { x: 0, y: 0 },
  n5: { x: -6.5, y: 2.5 },
  n6: { x: 2.8, y: -2.2 },
  n7: { x: 0, y: 0 },
};

export const VARIANT_OFFSETS: Record<"B" | "C", Record<string, NodeOffset>> = {
  B: B02_B_OFFSETS,
  C: B02_C_OFFSETS,
};

function mixOffsets(parts: { o: NodeOffset; w: number }[]): NodeOffset {
  let x = 0;
  let y = 0;
  for (const { o, w } of parts) {
    x += o.x * w;
    y += o.y * w;
  }
  return { x, y };
}

/** Amber path point offsets derived from locked peripheral node offsets. LOCKED targets. */
export function deriveAmberPath(variant: "B" | "C"): AmberPathOffsets {
  const n = VARIANT_OFFSETS[variant];
  if (variant === "B") {
    return {
      start: mixOffsets([
        { o: n.n0, w: 0.35 },
        { o: n.n6, w: 0.15 },
      ]),
      joint: mixOffsets([
        { o: n.n1, w: 0.25 },
        { o: n.n2, w: 0.22 },
      ]),
      end: mixOffsets([
        { o: n.n5, w: 0.42 },
        { o: n.n2, w: 0.16 },
      ]),
    };
  }
  return {
    start: mixOffsets([
      { o: n.n0, w: 0.4 },
      { o: n.n1, w: 0.22 },
    ]),
    joint: mixOffsets([
      { o: n.n1, w: 0.28 },
      { o: n.n2, w: 0.26 },
    ]),
    end: mixOffsets([
      { o: n.n5, w: 0.45 },
      { o: n.n2, w: 0.2 },
    ]),
  };
}

export const B02_B_AMBER_PATH = deriveAmberPath("B");
export const B02_C_AMBER_PATH = deriveAmberPath("C");
export const VARIANT_AMBER_PATH: Record<"B" | "C", AmberPathOffsets> = {
  B: B02_B_AMBER_PATH,
  C: B02_C_AMBER_PATH,
};

/** Locked B02-A amber endpoints from scene data */
export const B02_A_AMBER = {
  start: { x: 108, y: 124 },
  joint: { x: 192, y: 138 },
  end: { x: 248, y: 184 },
} as const;

export const VARIANT_LEAD: Record<"B" | "C", string> = {
  B: "n5",
  C: "n1",
};

/**
 * Grey-edge endpoint → node id (derive edges from interpolated nodes during ambient).
 */
export const B02_EDGE_NODES: Record<
  string,
  { start: string | null; end: string | null }
> = {
  p0: { start: "n0", end: "n1" },
  p1: { start: "n1", end: "n2" },
  p2: { start: "n0", end: "n3" },
  p3: { start: "n2", end: "n5" },
  p4: { start: "n3", end: "n6" },
  p5: { start: "n4", end: "n7" },
  p6: { start: "n5", end: "n7" },
  p7: { start: "n1", end: "n4" },
  p8: { start: "n3", end: "n4" },
  p9: { start: "n4", end: "n5" },
  fail0: { start: "n1", end: null },
  fail1: { start: "n2", end: null },
  a0: { start: null, end: null },
  a1: { start: null, end: null },
  s0: { start: "n6", end: "n4" },
};

export const AMBIENT_CYCLE_TIMING = {
  idleMs: [22000, 38000] as const,
  shiftMs: [900, 1200] as const,
  holdMs: [4000, 7000] as const,
  returnMs: [1400, 1800] as const,
  postInteractionCalmMs: [6000, 10000] as const,
  settleMs: 1100,
  cancelMs: 320,
} as const;

export const AMBIENT_CYCLE_TIMING_FAST = {
  idleMs: [1000, 1800] as const,
  shiftMs: [900, 1200] as const,
  holdMs: [2000, 2800] as const,
  returnMs: [1400, 1800] as const,
  postInteractionCalmMs: [700, 1100] as const,
  settleMs: 400,
  cancelMs: 280,
} as const;

export const ENTRY_BEZIER = [0.45, 0.02, 0.18, 1] as const;
export const RETURN_BEZIER = [0.22, 1, 0.36, 1] as const;

export function randIn([min, max]: readonly [number, number]) {
  return min + Math.random() * (max - min);
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

export function cubicBezierY(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const T = clamp01(t);
  let s = T;
  for (let i = 0; i < 6; i++) {
    const u = 1 - s;
    const bx = 3 * u * u * s * x1 + 3 * u * s * s * x2 + s * s * s;
    const dx =
      3 * u * u * x1 +
      6 * u * s * (x2 - x1) +
      3 * s * s * (1 - x2);
    if (Math.abs(dx) < 1e-6) break;
    s -= (bx - T) / dx;
    s = clamp01(s);
  }
  const u = 1 - s;
  return 3 * u * u * s * y1 + 3 * u * s * s * y2 + s * s * s;
}

export function ambientShiftEase(t: number) {
  const [x1, y1, x2, y2] = ENTRY_BEZIER;
  return cubicBezierY(t, x1, y1, x2, y2);
}

export function ambientReturnEase(t: number) {
  const [x1, y1, x2, y2] = RETURN_BEZIER;
  return cubicBezierY(t, x1, y1, x2, y2);
}

export type AmbientPose = {
  nodes: Record<string, NodeOffset>;
  amber: AmberPathOffsets;
};

function lerpPt(a: NodeOffset, b: NodeOffset, t: number): NodeOffset {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Base B02-A node positions from locked scene */
export function getB02ANodes(): Record<string, NodeOffset> {
  const scene = SELECTION_STATES["02"];
  const out: Record<string, NodeOffset> = {};
  for (const n of scene.nodes) {
    out[n.id] = { x: n.x, y: n.y };
  }
  return out;
}

export function getVariantNodes(variant: "B" | "C"): Record<string, NodeOffset> {
  const base = getB02ANodes();
  const off = VARIANT_OFFSETS[variant];
  const out: Record<string, NodeOffset> = {};
  for (const id of NODE_IDS) {
    const b = base[id] ?? ZERO;
    const o = off[id] ?? ZERO;
    out[id] = { x: b.x + o.x, y: b.y + o.y };
  }
  return out;
}

export function getVariantAmber(variant: "B" | "C"): AmberPathOffsets {
  const o = VARIANT_AMBER_PATH[variant];
  return {
    start: {
      x: B02_A_AMBER.start.x + o.start.x,
      y: B02_A_AMBER.start.y + o.start.y,
    },
    joint: {
      x: B02_A_AMBER.joint.x + o.joint.x,
      y: B02_A_AMBER.joint.y + o.joint.y,
    },
    end: {
      x: B02_A_AMBER.end.x + o.end.x,
      y: B02_A_AMBER.end.y + o.end.y,
    },
  };
}

export function getB02APose(): AmbientPose {
  return {
    nodes: getB02ANodes(),
    amber: {
      start: { ...B02_A_AMBER.start },
      joint: { ...B02_A_AMBER.joint },
      end: { ...B02_A_AMBER.end },
    },
  };
}

export function getVariantPose(variant: "B" | "C"): AmbientPose {
  return {
    nodes: getVariantNodes(variant),
    amber: getVariantAmber(variant),
  };
}

/**
 * Single-clock pose: same easedP for every node and amber point.
 * pose = lerp(from, to, easedP)
 */
export function interpolatePose(
  from: AmbientPose,
  to: AmbientPose,
  easedP: number,
): AmbientPose {
  const t = clamp01(easedP);
  const nodes: Record<string, NodeOffset> = {};
  for (const id of NODE_IDS) {
    nodes[id] = lerpPt(from.nodes[id] ?? ZERO, to.nodes[id] ?? ZERO, t);
  }
  return {
    nodes,
    amber: {
      start: lerpPt(from.amber.start, to.amber.start, t),
      joint: lerpPt(from.amber.joint, to.amber.joint, t),
      end: lerpPt(from.amber.end, to.amber.end, t),
    },
  };
}

/** Ambient strength from A toward variant: easedP when from=A */
export function ambientStrengthFromPose(
  pose: AmbientPose,
  variant: "B" | "C",
): number {
  const a = getB02APose();
  const v = getVariantPose(variant);
  const id = VARIANT_LEAD[variant];
  const pa = a.nodes[id];
  const pv = v.nodes[id];
  const pc = pose.nodes[id];
  const den = Math.hypot(pv.x - pa.x, pv.y - pa.y) || 1;
  const num = Math.hypot(pc.x - pa.x, pc.y - pa.y);
  return clamp01(num / den);
}
