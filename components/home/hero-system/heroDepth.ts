import { lerp, type Point2D } from "./heroMath";

export type DepthRelationId = "corner-biased";

/** Per-corner depth offsets at rest and resolved (TL, TR, BR, BL). */
export type CornerOffsets = [Point2D, Point2D, Point2D, Point2D];

export type DepthRelation = {
  id: DepthRelationId;
  rest: CornerOffsets;
  resolved: CornerOffsets;
};

const CORNER_BIAS_REST: CornerOffsets = [
  { x: 2, y: 3 },
  { x: 8, y: 9 },
  { x: 7, y: 8 },
  { x: 3, y: 4 },
];

const CORNER_BIAS_RESOLVED: CornerOffsets = [
  { x: 1, y: 1 },
  { x: 3, y: 3 },
  { x: 2.5, y: 2.5 },
  { x: 1.5, y: 1.5 },
];

const CORNER_BIASED_RELATION: DepthRelation = {
  id: "corner-biased",
  rest: CORNER_BIAS_REST,
  resolved: CORNER_BIAS_RESOLVED,
};

export function getDepthRelation(_id: DepthRelationId): DepthRelation {
  return CORNER_BIASED_RELATION;
}

export function interpolateCornerOffsets(
  rest: CornerOffsets,
  resolved: CornerOffsets,
  progress: number,
): CornerOffsets {
  return rest.map((point, index) => ({
    x: lerp(point.x, resolved[index].x, progress),
    y: lerp(point.y, resolved[index].y, progress),
  })) as CornerOffsets;
}

export function depthOffsetVertices(
  vertices: Point2D[],
  cornerOffsets: CornerOffsets,
): Point2D[] {
  return vertices.map((vertex, index) => ({
    x: vertex.x + cornerOffsets[index].x,
    y: vertex.y + cornerOffsets[index].y,
  }));
}
