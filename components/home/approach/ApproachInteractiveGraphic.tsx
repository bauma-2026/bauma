"use client";

import { motion } from "framer-motion";
import type { Ref } from "react";

import {
  SELECTION_STATES,
  SELECTION_VIEWBOX,
  type SelectionScene,
} from "@/components/home/approach/approachStates";

import {
  isFiniteCircle,
  isFiniteLine,
  isFiniteNumber,
  readFiniteMotion,
} from "@/lib/svgFinite";

import type { AuthorityMode } from "./approachAmbient";
import type { PoseDriver } from "./approachPoseDriver";
import { C, type StructuralState } from "./constants";
import { ZONE_ANCHORS, ZONE_CONFIG, type TensionSample } from "./approachZones";

type ApproachInteractiveGraphicProps = {
  state: StructuralState;
  reducedMotion: boolean;
  svgRef?: Ref<SVGSVGElement>;
  driver: PoseDriver;
  authority: AuthorityMode;
  tension?: TensionSample;
  debugZones?: boolean;
};

function edgeStroke(kind: SelectionScene["edges"][number]["kind"]) {
  if (kind === "amber") return C.amber;
  if (kind === "edge") return C.primary;
  if (kind === "support") return C.secondary;
  return C.history;
}

function edgeOpacityMul(edgeId: string, tension: TensionSample): number {
  if (edgeId === "p0") return tension.noiseEdgeMul;
  if (edgeId === "p7" || edgeId === "e2") return tension.purposeEdgeMul;
  return 1;
}

/**
 * Geometry positions are owned by PoseDriver MotionValues.
 * Ambient authority writes via .set(); state morph via animate().
 * No Framer `animate` props on coordinates — prevents dual interpolation.
 */
export default function ApproachInteractiveGraphic({
  state,
  reducedMotion,
  svgRef,
  driver,
  authority,
  tension,
  debugZones = false,
}: ApproachInteractiveGraphicProps) {
  const scene = SELECTION_STATES[state];
  const t = tension ?? {
    strength: 0,
    kind: "none" as const,
    noiseFlee: { x: 0, y: 0 },
    purposeAttract: { x: 0, y: 0 },
    noiseEdgeMul: 1,
    purposeEdgeMul: 1,
    peripheralMul: 1,
  };

  void authority;
  void reducedMotion;

  return (
    <svg
      ref={svgRef}
      viewBox={SELECTION_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[480px] md:max-w-[520px] lg:max-w-[560px] xl:max-w-[600px]"
      aria-hidden
      data-authority={authority}
    >
      {debugZones ? (
        <g opacity={0.35} strokeWidth={1} fill="none">
          <circle
            cx={ZONE_ANCHORS.noise.x}
            cy={ZONE_ANCHORS.noise.y}
            r={ZONE_CONFIG.noiseRadius}
            stroke="#f87171"
          />
          <circle
            cx={ZONE_ANCHORS.core.x}
            cy={ZONE_ANCHORS.core.y}
            r={ZONE_CONFIG.coreRadius}
            stroke="#60a5fa"
          />
          <circle
            cx={ZONE_ANCHORS.purpose.x}
            cy={ZONE_ANCHORS.purpose.y}
            r={ZONE_CONFIG.purposeRadius}
            stroke="#4ade80"
          />
          <line
            x1={ZONE_ANCHORS.core.x}
            y1={ZONE_ANCHORS.core.y}
            x2={ZONE_ANCHORS.purpose.x}
            y2={ZONE_ANCHORS.purpose.y}
            stroke="#4ade80"
            strokeDasharray="4 4"
          />
        </g>
      ) : null}

      {scene.depth.d ? (
        <path
          d={scene.depth.d}
          stroke={C.quiet}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          fill="none"
          opacity={scene.depth.opacity}
          style={{
            transform: `translate(${scene.depth.ox}px, ${scene.depth.oy}px)`,
          }}
        />
      ) : null}

      {scene.edges.map((edge) => {
        const ch = driver.edges[edge.id];
        const mul = edgeOpacityMul(edge.id, t);
        // Open stubs (fail0/fail1): opacity MotionValue morphs with pose driver.
        // All other edges keep React scene opacity (existing snap-on-state behavior).
        const drivenOp = ch?.opacity;
        const opacity = drivenOp
          ? drivenOp
          : Math.min(1, Math.max(0, edge.opacity * mul));
        const strokeDasharray =
          edge.kind === "possible" && edge.opacity > 0 && edge.opacity < 0.35
            ? "2 5"
            : undefined;

        // Prefer live MotionValue channels when all current values are finite.
        if (
          ch &&
          isFiniteNumber(readFiniteMotion(ch.x1)) &&
          isFiniteNumber(readFiniteMotion(ch.y1)) &&
          isFiniteNumber(readFiniteMotion(ch.x2)) &&
          isFiniteNumber(readFiniteMotion(ch.y2))
        ) {
          return (
            <motion.line
              key={edge.id}
              x1={ch.x1}
              y1={ch.y1}
              x2={ch.x2}
              y2={ch.y2}
              stroke={edgeStroke(edge.kind)}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              opacity={opacity}
              strokeDasharray={strokeDasharray}
            />
          );
        }

        if (!isFiniteLine(edge)) return null;

        return (
          <line
            key={edge.id}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke={edgeStroke(edge.kind)}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            opacity={
              typeof opacity === "number"
                ? opacity
                : Math.min(1, Math.max(0, edge.opacity * mul))
            }
            strokeDasharray={strokeDasharray}
          />
        );
      })}

      {scene.outline.d ? (
        <path
          d={scene.outline.d}
          stroke={C.primary}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          fill="none"
          opacity={scene.outline.opacity}
        />
      ) : null}

      {scene.nodes.map((node) => {
        const cxMv = driver.nodeX[node.id];
        const cyMv = driver.nodeY[node.id];
        const cxLive = readFiniteMotion(cxMv);
        const cyLive = readFiniteMotion(cyMv);
        const r = node.emphasis ? 2.8 : 2.3;
        const isFloating =
          !node.emphasis && node.id !== "n0" && node.id !== "n1";
        const opacity = isFloating
          ? node.opacity * t.peripheralMul
          : node.opacity;
        // Ambient stroke only when a formed structure exists (emphasis set).
        // In B01 (noise field) every node stays structural so the mesh holds.
        const hasStructure = scene.nodes.some((n) => n.emphasis);
        const nodeStroke =
          isFloating && hasStructure ? C.ambientNode : C.node;

        if (
          cxMv &&
          cyMv &&
          isFiniteNumber(cxLive) &&
          isFiniteNumber(cyLive)
        ) {
          return (
            <motion.circle
              key={node.id}
              cx={cxMv}
              cy={cyMv}
              r={r}
              fill="none"
              stroke={nodeStroke}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity={opacity}
            />
          );
        }

        if (!isFiniteCircle({ cx: node.x, cy: node.y, r })) return null;

        return (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={r}
            fill="none"
            stroke={nodeStroke}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}
