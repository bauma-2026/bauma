/**
 * Production V2 Balanced Volume — locked scene constants.
 * Transferred from lab/hero-object-reframe (approved).
 */

export type Point = { x: number; y: number };

export const V2_MATERIAL_BASE = {
  primary: {
    stroke: "rgba(244,241,234,0.80)",
    strokeWidth: 1.2,
    fill: "rgba(244,241,234,0.028)",
  },
  depth: {
    stroke: "rgba(244,241,234,0.20)",
    strokeWidth: 0.75,
  },
  join: {
    stroke: "rgba(244,241,234,0.16)",
    strokeWidth: 0.65,
  },
} as const;

/** Locked V2 front / rear coordinates (do not mutate). */
export const V2_FRONT_POINTS: Point[] = [
  { x: 108, y: 152 },
  { x: 352, y: 114 },
  { x: 390, y: 298 },
  { x: 78, y: 286 },
];

export const V2_REAR_POINTS: Point[] = [
  { x: 124, y: 160 },
  { x: 368, y: 122 },
  { x: 408, y: 308 },
  { x: 98, y: 310 },
];

export const V2_VOLUME_SCENE = {
  id: "V2" as const,
  canvas: {
    width: 520,
    height: 440,
    anchor: { x: 260, y: 235 },
    tiltDeg: -2.0,
  },
  material: V2_MATERIAL_BASE,
};

export function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`;
}
