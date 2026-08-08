export type FlipRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function rectToFlip(rect: DOMRectReadOnly | DOMRect): FlipRect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function computeFlipTransform(
  from: FlipRect,
  to: FlipRect,
): { x: number; y: number; scaleX: number; scaleY: number } {
  const scaleX = from.width / to.width;
  const scaleY = from.height / to.height;
  const x = from.left - to.left + (from.width - to.width) / 2;
  const y = from.top - to.top + (from.height - to.height) / 2;

  return { x, y, scaleX, scaleY };
}

export function flipTransformString(
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
): string {
  return `translate3d(${x}px, ${y}px, 0) scale(${scaleX}, ${scaleY})`;
}

export function isRectInViewport(rect: FlipRect, margin = 8): boolean {
  if (typeof window === "undefined") return false;
  const bottom = rect.top + rect.height;
  const right = rect.left + rect.width;
  return (
    rect.top >= -margin &&
    rect.left >= -margin &&
    bottom <= window.innerHeight + margin &&
    right <= window.innerWidth + margin
  );
}

export function isAnchoredDesktop(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 768px)").matches;
}
