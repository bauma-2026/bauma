export const BAUMA_AMBER = "#d1a45f";

export const C = {
  primary: "rgba(255,255,255,0.32)",
  secondary: "rgba(255,255,255,0.17)",
  quiet: "rgba(255,255,255,0.10)",
  history: "rgba(255,255,255,0.06)",
  amber: BAUMA_AMBER,
} as const;

export const EASE = [0.22, 1, 0.36, 1] as const;

export const CHANGE_COPY = {
  eyebrow: "Kaj se spremeni",
  headline: "Vsak del strani vodi naprej.",
  supporting:
    "Brez poti uporabnik obstane. Z jasno strukturo vsak del pripelje bližje odločitvi.",
} as const;

export type StructuralState = "01" | "02" | "03";

/**
 * Shape-shift phases:
 * compact A01 → near-assembly A02 → locked A03
 */
export const PHASE = {
  fieldHold: 0.5,
  toAlign: 0.7,
  a02Hold: 0.32,
  toResolve: 0.72,
  reduced: 0.045,
} as const;

export const A03_SETTLE = {
  amber: 0.48,
  endpoint: 0.58,
} as const;

/** Shallow reverse after autoplay */
export const CHANGE_HOVER = {
  enter: 0.48,
  leave: 0.72,
  reduced: 0.045,
} as const;
