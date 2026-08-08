export { APPROACH_COPY } from "./copy";

export const BAUMA_AMBER = "#d1a45f";

/**
 * Approach stroke channels (visibility lock).
 * Effective paint ≈ channel alpha × per-edge/node opacity.
 * Amber is the only accent — keep structural greys quieter than amber path.
 */
export const C = {
  /** Inactive structural lines (edge / outline) — white ~23% */
  primary: "rgba(255,255,255,0.23)",
  /** Support / secondary structure — white ~16% */
  secondary: "rgba(255,255,255,0.16)",
  /** Depth ghost — white ~10% */
  quiet: "rgba(255,255,255,0.10)",
  /** Field / possible lines — white ~20% */
  history: "rgba(255,255,255,0.20)",
  /** Structural nodes — white ~30% */
  node: "rgba(255,255,255,0.30)",
  /** Ambient / peripheral dots — white ~13% */
  ambientNode: "rgba(255,255,255,0.13)",
  amber: BAUMA_AMBER,
} as const;

export const EASE = [0.22, 1, 0.36, 1] as const;

export type StructuralState = "01" | "02" | "03";

export const APPROACH_MORPH = {
  between: 0.4,
  release: 0.56,
  amberDelay: 0.04,
  reduced: 0.045,
} as const;

export const RELEASE_EASE = [0.22, 1, 0.36, 1] as const;
