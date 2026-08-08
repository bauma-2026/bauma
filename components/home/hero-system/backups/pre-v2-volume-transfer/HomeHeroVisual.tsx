"use client";

import { useMemo } from "react";

import { BAUMA_ACCENT } from "./heroAccent";
import {
  depthOffsetVertices,
  getDepthRelation,
  interpolateCornerOffsets,
} from "./heroDepth";
import type { Point2D } from "./heroMath";
import { applyOffsets } from "./heroVertexHelpers";
import { polylinePointsString } from "./heroContour";

import { HOME_HERO_CONFIG } from "./config";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COMPOSITION,
  getIdentityVariant,
  getScaleAnchor,
  getScaledVertices,
  verticesToPolygonPoints,
} from "./heroGeometry";
import HeroHitSurface from "./heroHitSurface";
import { serializeSvgTransform } from "./svgSerialize";
import { useHomeHero } from "./HomeHeroProvider";

function ContactAccentSignal({
  vertices,
  corner,
  opacity,
}: {
  vertices: Point2D[];
  corner: number;
  opacity: number;
}) {
  const edgePairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];

  const [a, b] = edgePairs[corner] ?? [1, 2];
  const segment = [
    vertices[a],
    {
      x: (vertices[a].x + vertices[b].x) / 2,
      y: (vertices[a].y + vertices[b].y) / 2,
    },
    vertices[b],
  ];

  return (
    <polyline
      points={polylinePointsString(segment)}
      fill="none"
      stroke={BAUMA_ACCENT}
      strokeWidth={1.3}
      strokeLinejoin="miter"
      strokeLinecap="butt"
      opacity={opacity}
      vectorEffect="non-scaling-stroke"
    />
  );
}

function HomeHeroForm() {
  const { oneEnvelope, reducedMotion } = useHomeHero();

  const anchor = useMemo(
    () => getScaleAnchor(HOME_HERO_CONFIG.scalePreset),
    [],
  );

  const variant = useMemo(() => getIdentityVariant(), []);

  const depthRelation = useMemo(
    () => getDepthRelation(HOME_HERO_CONFIG.depthRelationId),
    [],
  );

  const vertices = useMemo(() => {
    const restBase = getScaledVertices(variant, 0, HOME_HERO_CONFIG.scalePreset);
    const resolveBase = getScaledVertices(variant, 1, HOME_HERO_CONFIG.scalePreset);
    const posed = applyOffsets(restBase, oneEnvelope.vertexOffsets, 1);
    if (oneEnvelope.resolveBlend <= 0.001) return posed;
    return posed.map((v, i) => ({
      x: v.x + (resolveBase[i].x - v.x) * oneEnvelope.resolveBlend,
      y: v.y + (resolveBase[i].y - v.y) * oneEnvelope.resolveBlend,
    }));
  }, [oneEnvelope, variant]);

  const ambientVertices = vertices;

  const points = useMemo(
    () => verticesToPolygonPoints(ambientVertices),
    [ambientVertices],
  );

  const depthProgress = oneEnvelope.resolveBlend;

  const depthVertices = useMemo(() => {
    const offsets = interpolateCornerOffsets(
      depthRelation.rest,
      depthRelation.resolved,
      depthProgress,
    );
    const ambientDepthOffsets = offsets.map((offset, index) => ({
      x: offset.x + oneEnvelope.depthOffsets[index].x,
      y: offset.y + oneEnvelope.depthOffsets[index].y,
    })) as typeof offsets;
    return depthOffsetVertices(ambientVertices, ambientDepthOffsets);
  }, [ambientVertices, depthRelation, depthProgress, oneEnvelope.depthOffsets]);

  const depthPoints = useMemo(
    () => verticesToPolygonPoints(depthVertices),
    [depthVertices],
  );

  const useEnvelopeSpatial = oneEnvelope.envelope > 0.001;

  const tx = useEnvelopeSpatial ? oneEnvelope.spatial.translateX : 0;
  const ty = useEnvelopeSpatial ? oneEnvelope.spatial.translateY : 0;
  const rot = useEnvelopeSpatial
    ? COMPOSITION.restTiltDeg + oneEnvelope.spatial.rotateDeg
    : COMPOSITION.restTiltDeg;

  return (
    <g transform={serializeSvgTransform(tx, ty, rot, anchor.x, anchor.y)}>
      <polygon
        points={depthPoints}
        fill="rgba(244,241,234,0.008)"
        stroke={`rgba(244,241,234,${oneEnvelope.depthOpacity.toFixed(3)})`}
        strokeWidth={0.75}
        strokeLinejoin="miter"
      />
      <polygon
        points={points}
        fill="rgba(244,241,234,0.016)"
        stroke={`rgba(244,241,234,${oneEnvelope.primaryOpacity.toFixed(3)})`}
        strokeWidth={1}
        strokeLinejoin="miter"
      />
      {oneEnvelope.amber.visible && oneEnvelope.amber.corner !== null && (
        <ContactAccentSignal
          vertices={ambientVertices}
          corner={oneEnvelope.amber.corner}
          opacity={oneEnvelope.amber.opacity}
        />
      )}
      {!reducedMotion && (
        <HeroHitSurface coreVertices={ambientVertices} />
      )}
    </g>
  );
}

export default function HomeHeroVisual({
  className = "relative h-[440px] w-full",
}: {
  className?: string;
}) {
  return (
    <div className={className} data-hero-visual-root>
      <svg
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="h-full w-full overflow-visible"
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        <HomeHeroForm />
      </svg>
    </div>
  );
}
