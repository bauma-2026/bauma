"use client";

import {
  useCallback,
  useId,
  useRef,
  type RefObject,
} from "react";

import { isFiniteLine, isFinitePoint } from "@/lib/svgFinite";

import {
  pointsAttr,
  rgba,
  V3_CANVAS,
  V3_S0_MATERIAL,
} from "./geometryV3";
import {
  LIVE_SPATIAL_SAMPLE,
  pathJoinSegments,
  pathRearSegments,
  sampleFullSpatialPath,
  V3_F2_FACE,
  V3_FULL_PATH_PROGRESS,
  type FullPathFrame,
} from "./spatialPathV3";
import {
  useHeroProximityV3,
  type HeroProximityV3Frame,
} from "./useHeroProximityV3";

type Props = {
  className?: string;
  /** Shell parity only — does not alter initial HTML tree. */
  reduced?: boolean;
  /**
   * Optional static scrub for capture/dev. When omitted (production),
   * live proximity drives progress after mount (fine pointer only).
   * Module `V3_FULL_PATH_PROGRESS` non-zero also acts as scrub.
   */
  progress?: number;
  /** Pointer host (visual root). Defaults to self. */
  hostRef?: RefObject<HTMLElement | null>;
  /** When false, proximity RAF/listeners stay off (hidden breakpoint). */
  runtimeEnabled?: boolean;
};

function poseLabel(stage: string): string {
  if (stage === "rest") return "S0";
  if (stage === "s1") return "S1";
  if (stage === "s2") return "S2";
  return "path";
}

function applyFrameToDom(
  root: HTMLElement,
  svg: SVGSVGElement,
  clipPath: SVGPathElement | null,
  frame: FullPathFrame,
  liveProgress: number,
) {
  const { width, height } = V3_CANVAS;
  const { front, faces, revealMix, stage, finite, segment } = frame;
  const frontReady = front.every(isFinitePoint) && finite;

  root.setAttribute(
    "data-hero-pose",
    poseLabel(stage),
  );
  root.setAttribute("data-hero-segment", segment);
  root.setAttribute("data-hero-progress", liveProgress.toFixed(3));
  root.setAttribute("data-hero-stage", stage);
  root.setAttribute("data-hero-finite", finite ? "1" : "0");

  if (clipPath && frontReady) {
    clipPath.setAttribute(
      "d",
      `M0,0 H${width} V${height} H0 Z M${front
        .map((p) => `${p.x},${p.y}`)
        .join(" L")} Z`,
    );
  }

  const frontFill = svg.querySelector(
    '[data-layer="frontPlate"] polygon[data-role="fill"]',
  );
  const frontStroke = svg.querySelector(
    '[data-layer="frontPlate"] polygon[data-role="stroke"]',
  );
  const pts = pointsAttr(front);
  if (frontFill) frontFill.setAttribute("points", pts);
  if (frontStroke) frontStroke.setAttribute("points", pts);

  const rearSegs = pathRearSegments(frame).filter(
    (seg) => isFinitePoint(seg.a) && isFinitePoint(seg.b),
  );
  const rearGroup = svg.querySelector('[data-layer="rearEdges"]');
  if (rearGroup) {
    const lines = rearGroup.querySelectorAll("line");
    rearSegs.forEach((seg, i) => {
      const line = lines[i];
      if (!line) return;
      line.setAttribute("x1", String(seg.a.x));
      line.setAttribute("y1", String(seg.a.y));
      line.setAttribute("x2", String(seg.b.x));
      line.setAttribute("y2", String(seg.b.y));
      line.setAttribute(
        "stroke",
        rgba(244, 241, 234, V3_S0_MATERIAL.rearBase * seg.opacity),
      );
      line.setAttribute("stroke-width", String(seg.strokeWidth));
      line.style.display = "";
    });
    for (let i = rearSegs.length; i < lines.length; i++) {
      (lines[i] as SVGLineElement).style.display = "none";
    }
  }

  const joins = pathJoinSegments(frame).filter(
    (seg) =>
      isFinitePoint(seg.a) &&
      isFinitePoint(seg.b) &&
      isFiniteLine({
        x1: seg.a.x,
        y1: seg.a.y,
        x2: seg.b.x,
        y2: seg.b.y,
      }),
  );
  const joinGroup = svg.querySelector('[data-layer="joins"]');
  if (joinGroup) {
    const lines = joinGroup.querySelectorAll("line");
    joins.forEach((j, i) => {
      const line = lines[i];
      if (!line) return;
      line.setAttribute("x1", String(j.a.x));
      line.setAttribute("y1", String(j.a.y));
      line.setAttribute("x2", String(j.b.x));
      line.setAttribute("y2", String(j.b.y));
      line.setAttribute(
        "stroke",
        rgba(244, 241, 234, V3_S0_MATERIAL.joinBase * j.opacity),
      );
      line.style.display = "";
    });
    for (let i = joins.length; i < lines.length; i++) {
      (lines[i] as SVGLineElement).style.display = "none";
    }
  }

  const faceGroup = svg.querySelector('[data-layer="sideFaces"]');
  if (faceGroup) {
    const drawFaces =
      revealMix > 0.02 ? faces.filter((f) => f.render) : [];
    // Ensure enough polygons
    while (faceGroup.childElementCount < drawFaces.length) {
      const poly = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      poly.setAttribute("stroke-linejoin", "miter");
      poly.setAttribute("vector-effect", "non-scaling-stroke");
      faceGroup.appendChild(poly);
    }
    const polys = faceGroup.querySelectorAll("polygon");
    drawFaces.forEach((f, i) => {
      const poly = polys[i];
      if (!poly) return;
      const mat =
        f.role === "primary" ? V3_F2_FACE.primary : V3_F2_FACE.secondary;
      poly.setAttribute("points", pointsAttr(f.points));
      poly.setAttribute(
        "fill",
        rgba(244, 241, 234, mat.fillAlpha * revealMix),
      );
      poly.setAttribute(
        "stroke",
        rgba(244, 241, 234, mat.strokeAlpha * revealMix),
      );
      poly.setAttribute("stroke-width", String(mat.strokeWidth));
      (poly as SVGElement).style.display = "";
    });
    for (let i = drawFaces.length; i < polys.length; i++) {
      (polys[i] as SVGElement).style.display = "none";
    }
  }
}

/**
 * Production V3 — full path + live proximity (I1/PR1/E1).
 * Initial HTML = exact S0. RAF updates SVG imperatively.
 * No material activation, amber, or CTA coupling.
 */
export default function HomeHeroSpatialV3Object({
  className = "relative h-[440px] w-full",
  reduced = false,
  progress: progressProp,
  hostRef: hostRefProp,
  runtimeEnabled = true,
}: Props) {
  const { width, height, anchor, tiltDeg } = V3_CANVAS;
  const reactId = useId().replace(/:/g, "");
  const clipId = `home-v3-s0-occlude-${reactId}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const clipPathRef = useRef<SVGPathElement>(null);
  const selfHostRef = useRef<HTMLDivElement | null>(null);
  const hostRef = hostRefProp ?? selfHostRef;

  // Initial SSR/hydration frame — exact S0 (progress 0)
  const initial = sampleFullSpatialPath(0, LIVE_SPATIAL_SAMPLE);
  const { front, stage, finite, segment } = initial;
  const frontReady = front.every(isFinitePoint) && finite;
  const rearSegs = pathRearSegments(initial).filter(
    (seg) => isFinitePoint(seg.a) && isFinitePoint(seg.b),
  );
  const initialJoins = pathJoinSegments(initial).filter(
    (seg) =>
      isFinitePoint(seg.a) &&
      isFinitePoint(seg.b) &&
      isFiniteLine({
        x1: seg.a.x,
        y1: seg.a.y,
        x2: seg.b.x,
        y2: seg.b.y,
      }),
  );
  // Reserve 4 join slots + 4 rear slots for imperative updates
  const joinSlots = 4;
  const rearSlots = 4;

  const maskD = frontReady
    ? `M0,0 H${width} V${height} H0 Z M${front
        .map((p) => `${p.x},${p.y}`)
        .join(" L")} Z`
    : `M0,0 H${width} V${height} H0 Z`;

  const poseTransform = `rotate(${tiltDeg} ${anchor.x} ${anchor.y})`;
  const depthBase = V3_S0_MATERIAL.rearBase;

  const scrub =
    progressProp != null
      ? progressProp
      : V3_FULL_PATH_PROGRESS !== 0
        ? V3_FULL_PATH_PROGRESS
        : null;

  const onFrame = useCallback((frame: HeroProximityV3Frame) => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;
    const geom = sampleFullSpatialPath(frame.progress, LIVE_SPATIAL_SAMPLE);
    applyFrameToDom(root, svg, clipPathRef.current, geom, frame.progress);
  }, []);

  useHeroProximityV3({
    enabled: runtimeEnabled && !reduced,
    reduced: reduced || !runtimeEnabled,
    hostRef: hostRef as RefObject<HTMLElement | null>,
    svgRef,
    onFrame,
    scrubProgress: scrub,
  });

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (!hostRefProp) selfHostRef.current = el;
      }}
      className={className}
      data-hero-system="v3-spatial"
      data-hero-pose={poseLabel(stage)}
      data-hero-segment={segment}
      data-hero-progress="0.000"
      data-hero-stage={stage}
      data-hero-finite={finite ? "1" : "0"}
      data-hero-proximity-field={!hostRefProp ? "1" : undefined}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full overflow-visible"
        style={{ pointerEvents: "none" }}
        aria-hidden
        focusable="false"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path ref={clipPathRef} d={maskD} clipRule="evenodd" />
          </clipPath>
        </defs>

        <g transform={poseTransform} data-layer="volume">
          <g data-layer="rearEdges" clipPath={`url(#${clipId})`}>
            {Array.from({ length: rearSlots }, (_, i) => {
              const seg = rearSegs[i];
              return (
                <line
                  key={`rear-${i}`}
                  x1={seg?.a.x ?? 0}
                  y1={seg?.a.y ?? 0}
                  x2={seg?.b.x ?? 0}
                  y2={seg?.b.y ?? 0}
                  fill="none"
                  stroke={rgba(
                    244,
                    241,
                    234,
                    depthBase * (seg?.opacity ?? 0),
                  )}
                  strokeWidth={seg?.strokeWidth ?? 0.75}
                  strokeLinecap="butt"
                  vectorEffect="non-scaling-stroke"
                  style={{ display: seg ? undefined : "none" }}
                />
              );
            })}
          </g>

          <g data-layer="sideFaces" />

          <g data-layer="joins">
            {Array.from({ length: joinSlots }, (_, i) => {
              const j = initialJoins[i];
              return (
                <line
                  key={`join-${i}`}
                  x1={j?.a.x ?? 0}
                  y1={j?.a.y ?? 0}
                  x2={j?.b.x ?? 0}
                  y2={j?.b.y ?? 0}
                  fill="none"
                  stroke={rgba(
                    244,
                    241,
                    234,
                    j ? V3_S0_MATERIAL.joinBase * j.opacity : 0,
                  )}
                  strokeWidth={V3_S0_MATERIAL.joinStrokeWidth}
                  strokeLinecap="butt"
                  vectorEffect="non-scaling-stroke"
                  style={{ display: j ? undefined : "none" }}
                />
              );
            })}
          </g>

          {frontReady ? (
            <g data-layer="frontPlate">
              <polygon
                data-role="fill"
                points={pointsAttr(front)}
                fill={V3_S0_MATERIAL.frontFill}
                fillOpacity={V3_S0_MATERIAL.frontFillOpacity}
                stroke="none"
              />
              <polygon
                data-role="stroke"
                points={pointsAttr(front)}
                fill="none"
                stroke={V3_S0_MATERIAL.frontStroke}
                strokeWidth={V3_S0_MATERIAL.frontStrokeWidth}
                strokeLinejoin="miter"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ) : null}
        </g>
      </svg>
    </div>
  );
}
