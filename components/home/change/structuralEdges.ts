/**
 * Shape-shift structural mapping for Kaj se spremeni.
 *
 * Final A03 geometry is LOCKED — copied exactly from endpoint-resolution-study
 * Single Resolved Object. A01/A02 are precursors of these same edges only.
 *
 * Locked A03 vertices:
 *   A(120,156) B(176,120) C(248,98) D(300,90)
 *   H(290,128) I(262,152) J(196,170) K(134,164) E(318,78)
 * Amber: B→(228,104) on spine BC
 *
 * A01: compact unresolved (~105–115% of A03 bbox)
 * A02: near-assembly (small gaps, 85–95% closed)
 */

import { C, type StructuralState } from "./constants";

export const FIELD_VIEWBOX = "0 0 400 240";

export type EdgeId =
  | "spine_ab"
  | "spine_bc"
  | "spine_cd"
  | "rear_dh"
  | "lower_hi"
  | "lower_ij"
  | "lower_jk"
  | "lower_ka"
  | "rib_bj"
  | "rib_ci"
  | "cont_de";

export type EdgeRole =
  | "spine"
  | "lower"
  | "rear"
  | "rib"
  | "continuation";

export type EdgePose = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
};

export type StructuralEdge = {
  id: EdgeId;
  role: EdgeRole;
  /** Stagger into A02 (seconds) */
  alignDelay: number;
  /** Stagger into A03 (seconds) — locked character */
  resolveDelay: number;
  poses: Record<StructuralState, EdgePose>;
};

/** Locked A03 endpoint + amber — do not change */
export const LOCKED_A03 = {
  amber: { x1: 176, y1: 120, x2: 228, y2: 104, opacity: 0.92 },
  endpoint: { x: 318, y: 78, opacity: 0.9, r: 2.4 },
} as const;

/**
 * One edge = one persistent line, morphing A01 → A02 → A03.
 * A03 poses match the locked Single Resolved Object exactly.
 */
export const STRUCTURAL_EDGES: StructuralEdge[] = [
  // 1. Upper spine A→B→C→D
  {
    id: "spine_ab",
    role: "spine",
    alignDelay: 0.02,
    resolveDelay: 0.04,
    poses: {
      // Compact: flatter, slight inward fold — crosses lower_ka region
      "01": { x1: 122, y1: 148, x2: 168, y2: 134, opacity: 0.72 },
      // Near-final, small gap before B
      "02": { x1: 118, y1: 155, x2: 172, y2: 123, opacity: 0.88 },
      "03": { x1: 120, y1: 156, x2: 176, y2: 120, opacity: 0.92 },
    },
  },
  {
    id: "spine_bc",
    role: "spine",
    alignDelay: 0.04,
    resolveDelay: 0.06,
    poses: {
      // Dropped into body mass — overlaps rib space
      "01": { x1: 156, y1: 130, x2: 232, y2: 112, opacity: 0.7 },
      "02": { x1: 178, y1: 119, x2: 245, y2: 99, opacity: 0.9 },
      "03": { x1: 176, y1: 120, x2: 248, y2: 98, opacity: 0.92 },
    },
  },
  {
    id: "spine_cd",
    role: "spine",
    alignDelay: 0.06,
    resolveDelay: 0.08,
    poses: {
      // Slight rotate, still inside footprint
      "01": { x1: 238, y1: 106, x2: 292, y2: 100, opacity: 0.68 },
      "02": { x1: 249, y1: 98, x2: 297, y2: 91, opacity: 0.88 },
      "03": { x1: 248, y1: 98, x2: 300, y2: 90, opacity: 0.92 },
    },
  },

  // 3. Rear / right return D→H
  {
    id: "rear_dh",
    role: "rear",
    alignDelay: 0.08,
    resolveDelay: 0.12,
    poses: {
      // Steeper, pulled slightly inward
      "01": { x1: 296, y1: 98, x2: 282, y2: 132, opacity: 0.55 },
      // Unresolved joint at D (small gap from spine_cd)
      "02": { x1: 302, y1: 92, x2: 291, y2: 127, opacity: 0.68 },
      "03": { x1: 300, y1: 90, x2: 290, y2: 128, opacity: 0.58 },
    },
  },

  // 2. Lower outer contour H→I→J→K→A
  {
    id: "lower_hi",
    role: "lower",
    alignDelay: 0.08,
    resolveDelay: 0.14,
    poses: {
      // Lifted into body — crosses rear/spine region
      "01": { x1: 280, y1: 136, x2: 254, y2: 146, opacity: 0.52 },
      "02": { x1: 289, y1: 129, x2: 263, y2: 151, opacity: 0.68 },
      "03": { x1: 290, y1: 128, x2: 262, y2: 152, opacity: 0.58 },
    },
  },
  {
    id: "lower_ij",
    role: "lower",
    alignDelay: 0.1,
    resolveDelay: 0.16,
    poses: {
      // Flatter / higher — compresses belly
      "01": { x1: 246, y1: 156, x2: 198, y2: 160, opacity: 0.54 },
      "02": { x1: 261, y1: 153, x2: 198, y2: 169, opacity: 0.7 },
      "03": { x1: 262, y1: 152, x2: 196, y2: 170, opacity: 0.58 },
    },
  },
  {
    id: "lower_jk",
    role: "lower",
    alignDelay: 0.1,
    resolveDelay: 0.18,
    poses: {
      "01": { x1: 190, y1: 164, x2: 142, y2: 158, opacity: 0.5 },
      "02": { x1: 195, y1: 169, x2: 136, y2: 164, opacity: 0.66 },
      "03": { x1: 196, y1: 170, x2: 134, y2: 164, opacity: 0.58 },
    },
  },
  {
    id: "lower_ka",
    role: "lower",
    alignDelay: 0.12,
    resolveDelay: 0.2,
    poses: {
      // Angled up through spine_ab — breaks silhouette read
      "01": { x1: 138, y1: 154, x2: 126, y2: 142, opacity: 0.48 },
      // Unresolved joint at A
      "02": { x1: 133, y1: 163, x2: 122, y2: 157, opacity: 0.64 },
      "03": { x1: 134, y1: 164, x2: 120, y2: 156, opacity: 0.58 },
    },
  },

  // 4–5. Internal ribs
  {
    id: "rib_bj",
    role: "rib",
    alignDelay: 0.14,
    resolveDelay: 0.34,
    poses: {
      // More horizontal — crosses body instead of seating as rib
      "01": { x1: 164, y1: 136, x2: 198, y2: 148, opacity: 0.42 },
      "02": { x1: 174, y1: 123, x2: 194, y2: 166, opacity: 0.48 },
      "03": { x1: 176, y1: 120, x2: 196, y2: 170, opacity: 0.4 },
    },
  },
  {
    id: "rib_ci",
    role: "rib",
    alignDelay: 0.16,
    resolveDelay: 0.42,
    poses: {
      // Mild lean, still compact
      "01": { x1: 230, y1: 118, x2: 248, y2: 144, opacity: 0.38 },
      "02": { x1: 246, y1: 100, x2: 260, y2: 149, opacity: 0.44 },
      "03": { x1: 248, y1: 98, x2: 262, y2: 152, opacity: 0.34 },
    },
  },

  // 6. Continuation toward endpoint
  {
    id: "cont_de",
    role: "continuation",
    alignDelay: 0.06,
    resolveDelay: 0.1,
    poses: {
      "01": { x1: 294, y1: 92, x2: 312, y2: 84, opacity: 0.42 },
      "02": { x1: 301, y1: 89, x2: 316, y2: 79, opacity: 0.58 },
      "03": { x1: 300, y1: 90, x2: 318, y2: 78, opacity: 0.65 },
    },
  },
];

/** Amber pose — overlays spine_bc; locked at A03 */
export const AMBER_POSES: Record<
  StructuralState,
  { x1: number; y1: number; x2: number; y2: number; opacity: number }
> = {
  "01": { x1: 168, y1: 126, x2: 200, y2: 116, opacity: 0.3 },
  "02": { x1: 178, y1: 118, x2: 222, y2: 106, opacity: 0.58 },
  "03": { ...LOCKED_A03.amber },
};

/** Endpoint pose — locked at A03 */
export const ENDPOINT_POSES: Record<
  StructuralState,
  { x: number; y: number; opacity: number; r: number }
> = {
  "01": { x: 316, y: 82, opacity: 0.32, r: 2.4 },
  "02": { x: 320, y: 76, opacity: 0.62, r: 2.4 },
  "03": { ...LOCKED_A03.endpoint },
};

export function strokeForRole(role: EdgeRole): string {
  if (role === "spine" || role === "continuation") return C.primary;
  if (role === "rib") return C.secondary;
  return "rgba(255,255,255,0.22)";
}
