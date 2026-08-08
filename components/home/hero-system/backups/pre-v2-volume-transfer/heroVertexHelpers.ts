import type { Point2D } from "./heroMath";

export function applyOffsets(
  points: Point2D[],
  offsets: Point2D[],
  influence: number,
): Point2D[] {
  if (influence <= 0.001) return points;
  return points.map((point, index) => ({
    x: point.x + offsets[index].x * influence,
    y: point.y + offsets[index].y * influence,
  }));
}
