import type { Point2D } from "./heroMath";
import { serializeSvgPoints } from "./svgSerialize";

export function polylinePointsString(points: Point2D[]) {
  return serializeSvgPoints(points);
}
