"use client";

import { useCallback, useMemo, type PointerEvent } from "react";

import {
  clientToVisualPointer,
  FORM_HIT_PADDING,
  padPolygonVertices,
} from "./heroInteraction";
import type { Point2D } from "./heroMath";
import { verticesToPolygonPoints } from "./heroGeometry";
import { useHomeHero } from "./HomeHeroProvider";

type HeroHitSurfaceProps = {
  coreVertices: Point2D[];
  padding?: number;
};

export default function HeroHitSurface({
  coreVertices,
  padding = FORM_HIT_PADDING,
}: HeroHitSurfaceProps) {
  const { reducedMotion, setPointerInputs } = useHomeHero();

  const hitVertices = useMemo(
    () => padPolygonVertices(coreVertices, padding),
    [coreVertices, padding],
  );

  const hitPoints = useMemo(
    () => verticesToPolygonPoints(hitVertices),
    [hitVertices],
  );

  const resolveVisualRect = useCallback((target: Element) => {
    const root = target.closest<HTMLElement>("[data-hero-visual-root]");
    return root?.getBoundingClientRect() ?? null;
  }, []);

  const emitPointer = useCallback(
    (event: PointerEvent<SVGPolygonElement>, active: boolean) => {
      if (reducedMotion) return;

      const visualRect = resolveVisualRect(event.currentTarget);
      if (!visualRect) return;

      const { pointerX, pointerY } = clientToVisualPointer(
        event.clientX,
        event.clientY,
        visualRect,
      );

      setPointerInputs({
        pointerActive: active,
        pointerX: active ? pointerX : 0,
        pointerY: active ? pointerY : 0,
      });
    },
    [reducedMotion, resolveVisualRect, setPointerInputs],
  );

  if (reducedMotion) return null;

  return (
    <polygon
      data-form-hit-surface
      points={hitPoints}
      fill="transparent"
      stroke="none"
      pointerEvents="all"
      onPointerEnter={(event) => emitPointer(event, true)}
      onPointerMove={(event) => emitPointer(event, true)}
      onPointerLeave={(event) => emitPointer(event, false)}
    />
  );
}
