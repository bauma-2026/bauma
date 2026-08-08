/**
 * Selection → Purposeful Form states for Approach.
 * Copied from Study 03 with production-like contrast retained.
 */

export const SELECTION_VIEWBOX = "0 0 400 260";

export type NodeState = {
  id: string;
  x: number;
  y: number;
  opacity: number;
  emphasis: boolean;
};

export type EdgeState = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  kind: "possible" | "support" | "amber" | "edge" | "depth";
};

export type SelectionScene = {
  nodes: NodeState[];
  edges: EdgeState[];
  outline: { d: string; opacity: number };
  depth: { d: string; opacity: number; ox: number; oy: number };
};

const FIELD_NODES: Record<string, { x: number; y: number }> = {
  n0: { x: 64, y: 52 },
  n1: { x: 148, y: 36 },
  n2: { x: 236, y: 64 },
  n3: { x: 100, y: 118 },
  n4: { x: 188, y: 140 },
  n5: { x: 292, y: 112 },
  n6: { x: 140, y: 196 },
  n7: { x: 252, y: 188 },
};

const FORM_NODES: Record<string, { x: number; y: number }> = {
  n0: { x: 88, y: 78 },
  n1: { x: 176, y: 58 },
  n2: { x: 268, y: 92 },
  n3: { x: 108, y: 132 },
  n4: { x: 196, y: 128 },
  n5: { x: 286, y: 148 },
  n6: { x: 132, y: 188 },
  n7: { x: 244, y: 172 },
};

function lerp(
  a: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function nodesAt(t: number, emphasis: Set<string>): NodeState[] {
  return Object.keys(FIELD_NODES).map((id) => {
    const p = lerp(FIELD_NODES[id], FORM_NODES[id], t);
    return {
      id,
      x: p.x,
      y: p.y,
      opacity:
        t > 0.85 && !emphasis.has(id) && (id === "n0" || id === "n5")
          ? 0.35
          : 1,
      emphasis: emphasis.has(id),
    };
  });
}

export const B01: SelectionScene = {
  nodes: nodesAt(0, new Set()),
  edges: [
    { id: "p0", x1: 64, y1: 52, x2: 148, y2: 36, opacity: 0.95, kind: "possible" },
    { id: "p1", x1: 148, y1: 36, x2: 236, y2: 64, opacity: 0.9, kind: "possible" },
    { id: "p2", x1: 64, y1: 52, x2: 100, y2: 118, opacity: 0.92, kind: "possible" },
    { id: "p3", x1: 236, y1: 64, x2: 292, y2: 112, opacity: 0.88, kind: "possible" },
    { id: "p4", x1: 100, y1: 118, x2: 140, y2: 196, opacity: 0.9, kind: "possible" },
    { id: "p5", x1: 188, y1: 140, x2: 252, y2: 188, opacity: 0.88, kind: "possible" },
    { id: "p6", x1: 292, y1: 112, x2: 252, y2: 188, opacity: 0.85, kind: "possible" },
    { id: "p7", x1: 148, y1: 36, x2: 188, y2: 140, opacity: 0.82, kind: "possible" },
    { id: "p8", x1: 100, y1: 118, x2: 188, y2: 140, opacity: 0.78, kind: "possible" },
    { id: "p9", x1: 188, y1: 140, x2: 292, y2: 112, opacity: 0.8, kind: "possible" },
    { id: "fail0", x1: 148, y1: 36, x2: 172, y2: 78, opacity: 0.5, kind: "possible" },
    { id: "fail1", x1: 236, y1: 64, x2: 220, y2: 108, opacity: 0.48, kind: "possible" },
    { id: "a0", x1: 100, y1: 118, x2: 188, y2: 140, opacity: 0.08, kind: "amber" },
    { id: "a1", x1: 188, y1: 140, x2: 252, y2: 188, opacity: 0.06, kind: "amber" },
  ],
  outline: { d: "", opacity: 0 },
  depth: { d: "", opacity: 0, ox: 0, oy: 0 },
};

export const B02: SelectionScene = {
  nodes: (() => {
    const emphasis = new Set(["n3", "n4", "n6", "n7"]);
    return Object.keys(FIELD_NODES).map((id) => {
      const p = lerp(FIELD_NODES[id], FORM_NODES[id], 0.28);
      return { id, x: p.x, y: p.y, opacity: 1, emphasis: emphasis.has(id) };
    });
  })(),
  edges: [
    { id: "p0", x1: 64, y1: 52, x2: 148, y2: 36, opacity: 0.72, kind: "possible" },
    { id: "p1", x1: 148, y1: 36, x2: 236, y2: 64, opacity: 0.65, kind: "possible" },
    { id: "p2", x1: 64, y1: 52, x2: 100, y2: 118, opacity: 0.72, kind: "possible" },
    { id: "p3", x1: 236, y1: 64, x2: 292, y2: 112, opacity: 0.65, kind: "possible" },
    { id: "p4", x1: 108, y1: 124, x2: 144, y2: 190, opacity: 0.95, kind: "support" },
    { id: "p5", x1: 192, y1: 138, x2: 248, y2: 184, opacity: 0.7, kind: "possible" },
    { id: "p6", x1: 292, y1: 112, x2: 252, y2: 188, opacity: 0.65, kind: "possible" },
    { id: "p7", x1: 148, y1: 36, x2: 188, y2: 140, opacity: 0.65, kind: "possible" },
    { id: "p8", x1: 108, y1: 124, x2: 192, y2: 138, opacity: 0.7, kind: "possible" },
    { id: "p9", x1: 192, y1: 138, x2: 292, y2: 112, opacity: 0.65, kind: "possible" },
    // Open noise stubs — gone once path is chosen (fade via morph opacity)
    { id: "fail0", x1: 148, y1: 36, x2: 172, y2: 78, opacity: 0, kind: "possible" },
    { id: "fail1", x1: 236, y1: 64, x2: 220, y2: 108, opacity: 0, kind: "possible" },
    { id: "a0", x1: 108, y1: 124, x2: 192, y2: 138, opacity: 0.9, kind: "amber" },
    { id: "a1", x1: 192, y1: 138, x2: 248, y2: 184, opacity: 0.88, kind: "amber" },
    { id: "s0", x1: 144, y1: 190, x2: 192, y2: 138, opacity: 0.95, kind: "support" },
  ],
  outline: { d: "", opacity: 0 },
  depth: { d: "", opacity: 0, ox: 0, oy: 0 },
};

export const B03: SelectionScene = {
  nodes: nodesAt(1, new Set(["n1", "n3", "n4", "n6", "n7"])),
  edges: [
    { id: "p0", x1: 88, y1: 78, x2: 176, y2: 58, opacity: 0.65, kind: "possible" },
    { id: "p1", x1: 176, y1: 58, x2: 268, y2: 92, opacity: 0.55, kind: "possible" },
    { id: "p2", x1: 88, y1: 78, x2: 108, y2: 132, opacity: 0.65, kind: "possible" },
    { id: "p3", x1: 268, y1: 92, x2: 286, y2: 148, opacity: 0.55, kind: "possible" },
    { id: "p4", x1: 108, y1: 132, x2: 132, y2: 188, opacity: 0.95, kind: "edge" },
    { id: "p5", x1: 196, y1: 128, x2: 244, y2: 172, opacity: 0.65, kind: "possible" },
    { id: "p6", x1: 286, y1: 148, x2: 244, y2: 172, opacity: 0.6, kind: "possible" },
    { id: "p7", x1: 176, y1: 58, x2: 196, y2: 128, opacity: 0.92, kind: "edge" },
    { id: "p8", x1: 108, y1: 132, x2: 196, y2: 128, opacity: 0.7, kind: "possible" },
    { id: "p9", x1: 196, y1: 128, x2: 286, y2: 148, opacity: 0.6, kind: "possible" },
    { id: "fail0", x1: 148, y1: 36, x2: 172, y2: 78, opacity: 0, kind: "possible" },
    { id: "fail1", x1: 236, y1: 64, x2: 220, y2: 108, opacity: 0, kind: "possible" },
    { id: "a0", x1: 108, y1: 132, x2: 196, y2: 128, opacity: 0.35, kind: "amber" },
    { id: "a1", x1: 196, y1: 128, x2: 244, y2: 172, opacity: 0.92, kind: "amber" },
    { id: "s0", x1: 132, y1: 188, x2: 196, y2: 128, opacity: 0.95, kind: "edge" },
    { id: "e0", x1: 176, y1: 58, x2: 268, y2: 92, opacity: 1, kind: "edge" },
    { id: "e1", x1: 268, y1: 92, x2: 244, y2: 172, opacity: 0.98, kind: "edge" },
    { id: "e2", x1: 108, y1: 132, x2: 176, y2: 58, opacity: 0.95, kind: "edge" },
  ],
  outline: {
    d: "M 176 58 L 268 92 L 244 172 L 132 188 L 108 132 Z",
    opacity: 0.85,
  },
  depth: {
    d: "M 176 58 L 268 92 L 244 172 L 132 188 L 108 132 Z",
    opacity: 0.32,
    ox: 10,
    oy: 12,
  },
};

export const SELECTION_STATES = {
  "01": B01,
  "02": B02,
  "03": B03,
} as const;
