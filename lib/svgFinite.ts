/**
 * Shared SVG coordinate guards for production spatial graphics.
 * Never coerce undefined → 0; skip primitives until values are finite.
 */

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isFinitePoint(
  point: { x?: unknown; y?: unknown } | null | undefined,
): point is { x: number; y: number } {
  return (
    point != null && isFiniteNumber(point.x) && isFiniteNumber(point.y)
  );
}

export function isFiniteLine(
  line: {
    x1?: unknown;
    y1?: unknown;
    x2?: unknown;
    y2?: unknown;
  } | null | undefined,
): line is { x1: number; y1: number; x2: number; y2: number } {
  return (
    line != null &&
    isFiniteNumber(line.x1) &&
    isFiniteNumber(line.y1) &&
    isFiniteNumber(line.x2) &&
    isFiniteNumber(line.y2)
  );
}

export function isFiniteCircle(
  circle: { cx?: unknown; cy?: unknown; r?: unknown } | null | undefined,
): circle is { cx: number; cy: number; r: number } {
  return (
    circle != null &&
    isFiniteNumber(circle.cx) &&
    isFiniteNumber(circle.cy) &&
    isFiniteNumber(circle.r)
  );
}

/** Read a Framer MotionValue only when its current value is finite. */
export function readFiniteMotion(
  value: { get: () => number } | null | undefined,
): number | null {
  if (!value || typeof value.get !== "function") return null;
  const current = value.get();
  return isFiniteNumber(current) ? current : null;
}
