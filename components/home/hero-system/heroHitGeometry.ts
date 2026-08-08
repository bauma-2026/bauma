/**
 * Form-aligned pointer hit region for hero interaction.
 */

import type { Point2D } from "./heroMath";

/** Padding in SVG viewBox units (~32px at 1:1 hero render). */
export const FORM_HIT_PADDING = 32;

export type VisualPointerCoords = {
  nx: number;
  ny: number;
  pointerX: number;
  pointerY: number;
};

export function clientToVisualPointer(
  clientX: number,
  clientY: number,
  visualRect: DOMRect,
): VisualPointerCoords {
  const nx = (clientX - visualRect.left) / visualRect.width;
  const ny = (clientY - visualRect.top) / visualRect.height;
  return {
    nx,
    ny,
    pointerX: (nx - 0.5) * 2,
    pointerY: (ny - 0.52) * 2,
  };
}

/** Expand vertices outward from centroid by padding distance. */
export function padPolygonVertices(
  vertices: Point2D[],
  padding: number,
): Point2D[] {
  const cx = vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
  const cy = vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;
  return vertices.map((vertex) => {
    const dx = vertex.x - cx;
    const dy = vertex.y - cy;
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: vertex.x + (dx / len) * padding,
      y: vertex.y + (dy / len) * padding,
    };
  });
}

export function polygonBounds(vertices: Point2D[]) {
  const xs = vertices.map((v) => v.x);
  const ys = vertices.map((v) => v.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}
