"use client";

import { useId, useRef } from "react";

import { isFiniteLine, isFinitePoint } from "@/lib/svgFinite";

import {
  FRONT_STROKE_WIDTH,
  materialsFromLock,
  sampleT1Trace,
} from "./materialLock";
import { pointsAttr } from "./spatialPose";
import { LOCKED_SHIFT_MODE } from "./spatialShift";
import { useMaterialActivation } from "./useMaterialActivation";
import { usePoseAuthority } from "./usePoseAuthority";
import { V3_S0_MATERIAL } from "../v3/geometryV3";
import { rgba, V2_MATERIAL_BASE, V2_VOLUME_SCENE } from "./volumeScene";

type Props = {
  className?: string;
  reduced?: boolean;
  mobile?: boolean;
  /** When false, pose/material RAF and listeners stay off (hidden branch). */
  runtimeEnabled?: boolean;
};

/**
 * Production V2 hero object — approved Field Force + material lock.
 * Pose writer and material activation are separate authorities.
 */
export default function HomeHeroV2Object({
  className = "relative h-[440px] w-full",
  reduced = false,
  mobile = false,
  runtimeEnabled = true,
}: Props) {
  const { width, height, anchor } = V2_VOLUME_SCENE.canvas;
  const reactId = useId().replace(/:/g, "");
  const clipId = `home-v2-occlude-${reactId}`;
  const fieldRef = useRef<HTMLDivElement>(null);

  const live = runtimeEnabled && !mobile && !reduced;
  const snap = usePoseAuthority(fieldRef, {
    mode: LOCKED_SHIFT_MODE,
    reduced: reduced || mobile || !runtimeEnabled,
    scrub: null,
    enablePointer: live,
    enableAmbient: live,
    ambientFast: false,
    ambientTrigger: 0,
    runtimeEnabled,
  });

  const { getActivation } = useMaterialActivation({
    pointerInField: snap.active,
    poseAuthority: snap.authority,
    reduced: reduced || !runtimeEnabled,
    mobile,
    forceActivation: null,
    runtimeEnabled,
  });

  const activation = getActivation();
  const matActivation = mobile || reduced ? 0 : activation;
  const mats = materialsFromLock(matActivation, snap.blend, {
    amberOff: mobile || reduced,
  });
  const trace = sampleT1Trace(
    snap.sample.front,
    mobile || reduced ? 0 : activation,
  );

  const { front, rear, params, depthVectorScreen } = snap.sample;
  const poseTransform = `rotate(${params.globalTiltDeg} ${anchor.x} ${anchor.y})`;

  const rearSegs = [
    { id: "rear-upper", a: rear[0], b: rear[1], opacity: 1, w: 0.75 },
    { id: "rear-right", a: rear[1], b: rear[2], opacity: 1, w: 0.75 },
    { id: "rear-lower", a: rear[2], b: rear[3], opacity: 0.92, w: 0.8 },
    { id: "rear-left", a: rear[3], b: rear[0], opacity: 0.7, w: 0.75 },
  ].filter((seg) => isFinitePoint(seg.a) && isFinitePoint(seg.b));

  const dx = depthVectorScreen.x;
  const dy = depthVectorScreen.y;
  const joinList = [
    {
      id: "join-upperRight",
      a: front[1],
      b: rear[1],
      proof: dx > 2 || dy < -2,
    },
    {
      id: "join-lowerRight",
      a: front[2],
      b: rear[2],
      proof: dx > 2,
    },
    {
      id: "join-lowerLeft",
      a: front[3],
      b: rear[3],
      proof: dx < -2 || dy > 2,
    },
    {
      id: "join-upperLeft",
      a: front[0],
      b: rear[0],
      proof: dx < -2 || dy < -2,
    },
  ].filter((j) => isFinitePoint(j.a) && isFinitePoint(j.b));

  const frontReady = front.every(isFinitePoint);
  const maskD = frontReady
    ? `M0,0 H${width} V${height} H0 Z M${front
        .map((p) => `${p.x},${p.y}`)
        .join(" L")} Z`
    : `M0,0 H${width} V${height} H0 Z`;

  const amberLine =
    mats.amber > 0.004 &&
    isFiniteLine({
      x1: trace.a.x,
      y1: trace.a.y,
      x2: trace.b.x,
      y2: trace.b.y,
    })
      ? trace
      : null;

  return (
    <div
      ref={fieldRef}
      className={className}
      data-hero-system="v2-volume"
      data-authority={snap.authority}
      data-activation={activation.toFixed(3)}
      data-shift-blend={snap.blend.toFixed(3)}
      style={{
        touchAction: "none",
        cursor: mobile || reduced ? "default" : "crosshair",
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full overflow-visible"
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={maskD} clipRule="evenodd" />
          </clipPath>
        </defs>

        <g transform={poseTransform} data-layer="volume">
          <g data-layer="rearEdges" clipPath={`url(#${clipId})`}>
            {rearSegs.map((seg) => (
              <line
                key={seg.id}
                x1={seg.a.x}
                y1={seg.a.y}
                x2={seg.b.x}
                y2={seg.b.y}
                fill="none"
                stroke={rgba(244, 241, 234, mats.rearBase * seg.opacity)}
                strokeWidth={seg.w}
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          <g data-layer="joins">
            {joinList.map((j) => (
              <line
                key={j.id}
                x1={j.a.x}
                y1={j.a.y}
                x2={j.b.x}
                y2={j.b.y}
                fill="none"
                stroke={rgba(
                  244,
                  241,
                  234,
                  mats.joinBase * (j.proof ? 1 : 0.55),
                )}
                strokeWidth={0.65}
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
            ))}
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
                stroke={mats.frontStrokeCss}
                strokeWidth={V2_MATERIAL_BASE.primary.strokeWidth}
                strokeLinejoin="miter"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ) : null}

          {amberLine ? (
            <g data-layer="amberTrace">
              <line
                x1={amberLine.a.x}
                y1={amberLine.a.y}
                x2={amberLine.b.x}
                y2={amberLine.b.y}
                fill="none"
                stroke={mats.amberCss}
                strokeWidth={FRONT_STROKE_WIDTH}
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
