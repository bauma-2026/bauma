import { serializeSvgPoints } from "./svgSerialize";

export type Point2D = { x: number; y: number };

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

export function smootherstep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function interpolateVertices(
  rest: Point2D[],
  resolved: Point2D[],
  progress: number,
): Point2D[] {
  const t = clamp(progress, 0, 1);
  return rest.map((point, index) => ({
    x: lerp(point.x, resolved[index].x, t),
    y: lerp(point.y, resolved[index].y, t),
  }));
}

export function verticesToPolygonPoints(vertices: Point2D[]) {
  return serializeSvgPoints(vertices);
}

export function formCentroid(vertices: Point2D[]): Point2D {
  const sum = vertices.reduce(
    (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / vertices.length, y: sum.y / vertices.length };
}
