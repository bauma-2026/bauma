/**
 * Deterministic SVG number serialization for SSR/client hydration parity.
 */

import type { Point2D } from "./heroMath";

/** Default precision for SVG attributes (viewBox units). */
export const SVG_NUMBER_PRECISION = 4;

export function serializeSvgNumber(
  value: number,
  precision = SVG_NUMBER_PRECISION,
): string {
  if (!Number.isFinite(value)) return "0";
  return value.toFixed(precision).replace(/\.?0+$/, "");
}

export function roundSvgNumber(
  value: number,
  precision = SVG_NUMBER_PRECISION,
): number {
  return Number(serializeSvgNumber(value, precision));
}

export function serializeSvgPoints(
  points: ReadonlyArray<Pick<Point2D, "x" | "y">>,
  precision = SVG_NUMBER_PRECISION,
): string {
  return points
    .map(
      (point) =>
        `${serializeSvgNumber(point.x, precision)},${serializeSvgNumber(point.y, precision)}`,
    )
    .join(" ");
}

export type SvgRectBounds = {
  x: string;
  y: string;
  width: string;
  height: string;
};

export function serializeSvgRectBounds(input: {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}): SvgRectBounds {
  return {
    x: serializeSvgNumber(input.minX),
    y: serializeSvgNumber(input.minY),
    width: serializeSvgNumber(input.maxX - input.minX),
    height: serializeSvgNumber(input.maxY - input.minY),
  };
}

export function serializeSvgTransform(
  translateX: number,
  translateY: number,
  rotateDeg: number,
  rotateOriginX: number,
  rotateOriginY: number,
): string {
  return `translate(${serializeSvgNumber(translateX)}, ${serializeSvgNumber(translateY)}) rotate(${serializeSvgNumber(rotateDeg)} ${serializeSvgNumber(rotateOriginX)}, ${serializeSvgNumber(rotateOriginY)})`;
}
