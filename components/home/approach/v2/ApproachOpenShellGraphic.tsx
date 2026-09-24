"use client";

import { useMemo } from "react";

import { BAUMA_AMBER } from "@/components/home/approach/constants";

import {
  averageZ,
  DEFAULT_HIERARCHY03,
  DEFAULT_NOISE_VARIANT,
  NOISE_EDGES,
  NOISE_GHOST_EDGES,
  NOISE_GHOST_PANELS,
  NOISE_PLANES,
  pointsToPath,
  project,
  projectQuad,
  SHELL_VIEWBOX,
  STATE_LOOK,
  HIERARCHY03,
  shellForState,
  type Form03Variant,
  type Hierarchy03Variant,
  type NoiseVariant,
  type StructuralState,
} from "./openShell";

type ApproachOpenShellGraphicProps = {
  state: StructuralState;
  reducedMotion: boolean;
  yaw: number;
  pitch: number;
  noiseVariant?: NoiseVariant;
  /** Lab-only morph explorations (previous PASS). Prototype omits this. */
  form03?: Form03Variant;
  /** 03 hierarchy. Prototype defaults to primary + support. Lab can override. */
  hierarchy03?: Hierarchy03Variant;
  className?: string;
};

const STROKE = "rgba(255,255,255,1)";
const FILL = "rgba(255,255,255,1)";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Screen px after pocket scale. Slightly under 1 so edges stay sharp, not heavy. */
const STROKE_W = 0.78;
const STROKE_AMBER = 0.92;

export default function ApproachOpenShellGraphic({
  state,
  reducedMotion,
  yaw,
  pitch,
  noiseVariant = DEFAULT_NOISE_VARIANT,
  form03,
  hierarchy03 = DEFAULT_HIERARCHY03,
  className,
}: ApproachOpenShellGraphicProps) {
  const look = STATE_LOOK[state];
  const duration = reducedMotion ? "0ms" : "480ms";
  const hierarchy =
    state === "03" && !form03 ? HIERARCHY03[hierarchy03] : null;
  const noiseOn = look.noise > 0 && !form03 && !hierarchy;

  const projected = useMemo(() => {
    const { panels, edges } = shellForState(
      state,
      hierarchy ? undefined : form03,
    );
    const shells = panels.map((panel) => {
      const pts = projectQuad(panel.points, yaw, pitch);
      return {
        ...panel,
        d: pointsToPath(pts),
        z: averageZ(pts),
      };
    }).sort((a, b) => a.z - b.z);

    const planes = (
      noiseVariant === "planes"
        ? NOISE_PLANES
        : noiseVariant === "ghost"
          ? NOISE_GHOST_PANELS
          : []
    ).map((panel) => {
      const pts = projectQuad(panel.points, yaw, pitch);
      return {
        ...panel,
        d: pointsToPath(pts),
        z: averageZ(pts),
      };
    });

    const extraEdges = (
      noiseVariant === "edges"
        ? NOISE_EDGES
        : noiseVariant === "ghost"
          ? NOISE_GHOST_EDGES
          : []
    ).map((edge) => ({
      ...edge,
      a: project(edge.a, yaw, pitch),
      b: project(edge.b, yaw, pitch),
    }));

    const opening = edges.map((edge) => {
      const a = project(edge.a, yaw, pitch);
      const b = project(edge.b, yaw, pitch);
      return { ...edge, a, b };
    });

    return { shells, planes, extraEdges, opening };
  }, [yaw, pitch, noiseVariant, state, form03, hierarchy]);

  const fillFor = (
    id: string,
    role: "back" | "side" | "lid",
  ) => {
    if (hierarchy?.[id]) return hierarchy[id].fill;
    if (role === "back") return look.fillBack;
    if (role === "side") return look.fillSide;
    return look.fillLid;
  };

  const strokeFor = (
    id: string,
    role: "back" | "side" | "lid",
  ) => {
    if (hierarchy?.[id]) return hierarchy[id].stroke;
    if (role === "back") return look.strokeBack;
    if (role === "side") return look.strokeSide;
    return look.strokeLid;
  };

  const planeFill = noiseVariant === "planes" && noiseOn ? 0.028 : 0;
  const planeStroke = noiseOn ? look.noise : 0;

  return (
    <svg
      viewBox={SHELL_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={
        className ??
        "h-auto w-full max-w-[480px] max-lg:absolute max-lg:inset-0 max-lg:h-full max-lg:max-w-none md:max-w-[520px] lg:max-w-[560px] xl:max-w-[600px]"
      }
      aria-hidden
      data-pristop-v2-graphic=""
      data-state={state}
      data-noise-variant={noiseVariant}
      data-form03={form03 ?? ""}
      data-hierarchy03={hierarchy03 ?? ""}
    >
      <g data-layer="noise-planes">
        {projected.planes.map((panel) => (
          <path
            key={panel.id}
            d={panel.d}
            stroke={STROKE}
            strokeWidth={STROKE_W}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill={FILL}
            style={{
              fillOpacity: planeFill,
              strokeOpacity: planeStroke,
              transition: `stroke-opacity ${duration} ${EASE}, fill-opacity ${duration} ${EASE}`,
            }}
          />
        ))}
      </g>

      <g data-layer="noise-edges">
        {projected.extraEdges.map((edge) => (
          <line
            key={edge.id}
            x1={edge.a.x}
            y1={edge.a.y}
            x2={edge.b.x}
            y2={edge.b.y}
            stroke={STROKE}
            strokeWidth={STROKE_W}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            style={{
              strokeOpacity: planeStroke,
              transition: `stroke-opacity ${duration} ${EASE}`,
            }}
          />
        ))}
      </g>

      <g data-layer="shell-fill">
        {projected.shells.map((panel) => (
          <path
            key={`fill-${panel.id}`}
            d={panel.d}
            fill={FILL}
            stroke="none"
            style={{
              fillOpacity: fillFor(panel.id, panel.role),
              transition: `fill-opacity ${duration} ${EASE}`,
            }}
          />
        ))}
      </g>

      <g data-layer="shell-stroke">
        {projected.shells.map((panel) => (
          <path
            key={`stroke-${panel.id}`}
            d={panel.d}
            fill="none"
            stroke={STROKE}
            strokeWidth={STROKE_W}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            style={{
              strokeOpacity: strokeFor(panel.id, panel.role),
              transition: `stroke-opacity ${duration} ${EASE}`,
            }}
          />
        ))}
      </g>

      <g data-layer="opening">
        {projected.opening.map((edge) =>
          edge.amber ? (
            <line
              key={edge.id}
              x1={edge.a.x}
              y1={edge.a.y}
              x2={edge.b.x}
              y2={edge.b.y}
              stroke={BAUMA_AMBER}
              strokeWidth={STROKE_AMBER}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              style={{
                strokeOpacity: hierarchy ? 0.7 : look.amber,
                transition: `stroke-opacity ${duration} ${EASE}`,
              }}
            />
          ) : (
            <line
              key={edge.id}
              x1={edge.a.x}
              y1={edge.a.y}
              x2={edge.b.x}
              y2={edge.b.y}
              stroke={STROKE}
              strokeWidth={STROKE_W}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              style={{
                strokeOpacity: hierarchy
                  ? hierarchy03 === "path"
                    ? 0.22
                    : 0.3
                  : look.opening,
                transition: `stroke-opacity ${duration} ${EASE}`,
              }}
            />
          ),
        )}
      </g>
    </svg>
  );
}
