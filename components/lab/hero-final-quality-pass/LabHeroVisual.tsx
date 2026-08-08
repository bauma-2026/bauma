"use client";

import { useMemo } from "react";

import { BAUMA_ACCENT } from "@/components/home/hero-system/heroAccent";
import {
  depthOffsetVertices,
  getDepthRelation,
  interpolateCornerOffsets,
} from "@/components/home/hero-system/heroDepth";
import type { Point2D } from "@/components/home/hero-system/heroMath";
import { applyOffsets } from "@/components/home/hero-system/heroVertexHelpers";
import { polylinePointsString } from "@/components/home/hero-system/heroContour";
import { HOME_HERO_CONFIG } from "@/components/home/hero-system/config";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COMPOSITION,
  getIdentityVariant,
  getScaleAnchor,
  getScaledVertices,
  scaleVerticesAroundAnchor,
  verticesToPolygonPoints,
} from "@/components/home/hero-system/heroGeometry";
import HeroHitSurface from "@/components/home/hero-system/heroHitSurface";
import { serializeSvgTransform } from "@/components/home/hero-system/svgSerialize";
import { useHomeHero } from "@/components/home/hero-system/HomeHeroProvider";

import { PRODUCTION_REFERENCE, REFINED } from "./refinedConfig";

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

function scaleOffsetTuple(
  offsets: [Point2D, Point2D, Point2D, Point2D],
  factor: number,
): [Point2D, Point2D, Point2D, Point2D] {
  return offsets.map((o) => ({
    x: o.x * factor,
    y: o.y * factor,
  })) as [Point2D, Point2D, Point2D, Point2D];
}

type LabHeroVisualProps = {
  className?: string;
  interactionEnabled?: boolean;
  reducedPreview?: boolean;
  /** Micro-polish primary rest opacity (0.76 | 0.78). */
  primaryOpacityRest?: number;
  /** Matching active opacity (rest − 0.04). */
  primaryOpacityActive?: number;
};

/**
 * Lab-only refined visual. Mirrors production HomeHeroVisual with reversible
 * hierarchy / scale / tilt / amplitude overrides. Does not modify production.
 */
export default function LabHeroVisual({
  className = "relative h-[440px] w-full",
  interactionEnabled = true,
  reducedPreview = false,
  primaryOpacityRest = REFINED.primaryOpacityRest,
  primaryOpacityActive = REFINED.primaryOpacityActive,
}: LabHeroVisualProps) {
  const { oneEnvelope, reducedMotion } = useHomeHero();
  const quiet = reducedMotion || reducedPreview;

  const anchor = useMemo(
    () => getScaleAnchor(HOME_HERO_CONFIG.scalePreset),
    [],
  );
  const variant = useMemo(() => getIdentityVariant(), []);
  const depthRelation = useMemo(
    () => getDepthRelation(HOME_HERO_CONFIG.depthRelationId),
    [],
  );

  const relativeScale =
    REFINED.scaleFactor / PRODUCTION_REFERENCE.scaleFactor;
  const motionFactor = quiet ? 0 : REFINED.motionAmplitude;

  const vertices = useMemo(() => {
    const restBase = getScaledVertices(variant, 0, HOME_HERO_CONFIG.scalePreset);
    const resolveBase = getScaledVertices(
      variant,
      1,
      HOME_HERO_CONFIG.scalePreset,
    );

    const vertexOffsets = quiet
      ? ([
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ] as [Point2D, Point2D, Point2D, Point2D])
      : scaleOffsetTuple(oneEnvelope.vertexOffsets, motionFactor);

    const posed = applyOffsets(restBase, vertexOffsets, 1);
    const blended =
      quiet || oneEnvelope.resolveBlend <= 0.001
        ? posed
        : posed.map((v, i) => ({
            x: v.x + (resolveBase[i].x - v.x) * oneEnvelope.resolveBlend,
            y: v.y + (resolveBase[i].y - v.y) * oneEnvelope.resolveBlend,
          }));

    if (Math.abs(relativeScale - 1) < 0.001) return blended;
    return scaleVerticesAroundAnchor(blended, relativeScale, anchor);
  }, [oneEnvelope, variant, quiet, motionFactor, relativeScale, anchor]);

  const points = useMemo(() => verticesToPolygonPoints(vertices), [vertices]);

  const depthProgress = quiet ? 0 : oneEnvelope.resolveBlend;

  const depthVertices = useMemo(() => {
    const offsets = interpolateCornerOffsets(
      depthRelation.rest,
      depthRelation.resolved,
      depthProgress,
    );
    const depthOffsets = quiet
      ? ([
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ] as [Point2D, Point2D, Point2D, Point2D])
      : scaleOffsetTuple(oneEnvelope.depthOffsets, motionFactor);

    const ambientDepthOffsets = offsets.map((offset, index) => ({
      x: offset.x + depthOffsets[index].x,
      y: offset.y + depthOffsets[index].y,
    })) as typeof offsets;

    return depthOffsetVertices(vertices, ambientDepthOffsets);
  }, [
    vertices,
    depthRelation,
    depthProgress,
    oneEnvelope.depthOffsets,
    quiet,
    motionFactor,
  ]);

  const depthPoints = useMemo(
    () => verticesToPolygonPoints(depthVertices),
    [depthVertices],
  );

  const useEnvelopeSpatial = !quiet && oneEnvelope.envelope > 0.001;
  const tx = useEnvelopeSpatial
    ? oneEnvelope.spatial.translateX * motionFactor
    : 0;
  const ty = useEnvelopeSpatial
    ? oneEnvelope.spatial.translateY * motionFactor
    : 0;
  const rot = useEnvelopeSpatial
    ? REFINED.restTiltDeg + oneEnvelope.spatial.rotateDeg * motionFactor
    : REFINED.restTiltDeg;

  const active =
    !quiet && oneEnvelope.envelope > 0.001 && !oneEnvelope.proximityOnly;
  const primaryOpacity = active ? primaryOpacityActive : primaryOpacityRest;
  const depthOpacity = REFINED.depthOpacity;

  return (
    <div className={className} data-hero-visual-root data-lab-refined-visual="1">
      <svg
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="h-full w-full overflow-visible"
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        <g transform={serializeSvgTransform(tx, ty, rot, anchor.x, anchor.y)}>
          <polygon
            data-stroke-role={REFINED.roles.depth}
            points={depthPoints}
            fill="rgba(244,241,234,0.006)"
            stroke={`rgba(244,241,234,${depthOpacity.toFixed(3)})`}
            strokeWidth={REFINED.depthStroke}
            strokeLinejoin="miter"
          />
          <polygon
            data-stroke-role={REFINED.roles.primary}
            points={points}
            fill="rgba(244,241,234,0.014)"
            stroke={`rgba(244,241,234,${primaryOpacity.toFixed(3)})`}
            strokeWidth={REFINED.primaryStroke}
            strokeLinejoin="miter"
          />
          {!quiet &&
            oneEnvelope.amber.visible &&
            oneEnvelope.amber.corner !== null && (
              <ContactAccentSignal
                vertices={vertices}
                corner={oneEnvelope.amber.corner}
                opacity={oneEnvelope.amber.opacity}
              />
            )}
          {!quiet && interactionEnabled && (
            <HeroHitSurface coreVertices={vertices} />
          )}
        </g>
      </svg>
    </div>
  );
}
