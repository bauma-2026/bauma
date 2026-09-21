/**
 * Display-stable object material for MiniNextStepCube and MiniResponsivePlane.
 *
 * Ultra-low-alpha white on near-black (`rgba(255,255,255,0.018–0.038)`) is
 * display-sensitive: MacBook vs sRGB Full HD disagree on the resulting hue.
 * Face fills are therefore pre-composited onto the Vizualna plast charcoal
 * `#12100d` (18, 16, 13) and stored as opaque hex.
 *
 *   C = a·255 + (1−a)·bg
 *   0.038 → #1b1916  (cube front)
 *   0.026 → #181613  (cassette front / cube side)
 *   0.018 → #161411  (cassette rear / cube top)
 *   0.035 over 0.026 → #201e1c  (cassette front inset)
 *
 * Strokes stay alpha — 0.06–0.35 is stable enough and must stay soft.
 */

export const MINI_OBJECT_FILL = {
  front: "#1b1916",
  side: "#181613",
  rear: "#161411",
  inset: "#201e1c",
} as const;

/** Slight lift matching the previous +0.006 / +0.008 white-alpha peaks. */
export const MINI_OBJECT_FILL_PEAK = {
  front: "#1d1b18",
  side: "#1a1815",
  rear: "#181613",
  inset: "#23211e",
} as const;

export const MINI_OBJECT_STROKE = {
  primary: "rgba(255,255,255,0.35)",
  secondary: "rgba(255,255,255,0.21)",
  rear: "rgba(255,255,255,0.085)",
  ghost: "rgba(255,255,255,0.06)",
} as const;

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mixHex(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const u = Math.min(Math.max(t, 0), 1);
  const ch = (i: number) =>
    Math.round(a[i] + (b[i] - a[i]) * u)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(0)}${ch(1)}${ch(2)}`;
}
