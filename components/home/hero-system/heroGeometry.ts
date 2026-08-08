import {
  clamp,
  interpolateVertices,
  type Point2D,
  verticesToPolygonPoints,
} from "./heroMath";

export type ScalePreset = "M+";

export type IdentityVariant = {
  id: "four-edge-narrow";
  rest: Point2D[];
  resolved: Point2D[];
};

/** Narrower Four-Edge — locked production geometry. */
const FOUR_EDGE_NARROW_REST: Point2D[] = [
  { x: 118, y: 160 },
  { x: 334, y: 120 },
  { x: 374, y: 290 },
  { x: 90, y: 276 },
];

const FOUR_EDGE_NARROW_RESOLVED: Point2D[] = [
  { x: 118, y: 160 },
  { x: 330, y: 118 },
  { x: 376, y: 288 },
  { x: 90, y: 276 },
];

export const FOUR_EDGE_NARROW: IdentityVariant = {
  id: "four-edge-narrow",
  rest: FOUR_EDGE_NARROW_REST,
  resolved: FOUR_EDGE_NARROW_RESOLVED,
};

export const CANVAS_WIDTH = 520;
export const CANVAS_HEIGHT = 440;

export const COMPOSITION = {
  anchorX: 260,
  anchorY: 232,
  restTiltDeg: -1.0,
};

const SCALE_PRESET = {
  factor: 1.08,
  anchorYOffset: 3,
} as const;

export function getIdentityVariant(): IdentityVariant {
  return FOUR_EDGE_NARROW;
}

export function getScaleAnchor(_scalePreset: ScalePreset = "M+") {
  return {
    x: COMPOSITION.anchorX,
    y: COMPOSITION.anchorY + SCALE_PRESET.anchorYOffset,
  };
}

export function scaleVerticesAroundAnchor(
  vertices: Point2D[],
  scale: number,
  anchor: Point2D = getScaleAnchor("M+"),
): Point2D[] {
  return vertices.map((vertex) => ({
    x: anchor.x + (vertex.x - anchor.x) * scale,
    y: anchor.y + (vertex.y - anchor.y) * scale,
  }));
}

export function getScaledVertices(
  variant: IdentityVariant,
  progress: number,
  _scalePreset: ScalePreset,
): Point2D[] {
  const base = interpolateVertices(variant.rest, variant.resolved, progress);
  return scaleVerticesAroundAnchor(base, SCALE_PRESET.factor, getScaleAnchor("M+"));
}

export { interpolateVertices, verticesToPolygonPoints, clamp };
