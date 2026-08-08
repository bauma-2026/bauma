"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";

import {
  AMBER_POSES,
  ENDPOINT_POSES,
  FIELD_VIEWBOX,
  STRUCTURAL_EDGES,
  strokeForRole,
} from "@/components/home/change/structuralEdges";
import {
  isFiniteCircle,
  isFiniteLine,
  isFiniteNumber,
} from "@/lib/svgFinite";

import {
  A03_SETTLE,
  C,
  CHANGE_HOVER,
  EASE,
  PHASE,
  type StructuralState,
} from "./constants";

type MotionKind = "sequence" | "hover-enter" | "hover-leave";

type ChangeInteractiveGraphicProps = {
  /** Displayed structural pose — locked A01/A02/A03 only */
  state: StructuralState;
  reducedMotion: boolean;
  motionKind: MotionKind;
};

type LineTarget = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
};

function FiniteMotionLine({
  target,
  duration,
  delay,
  stroke,
}: {
  target: LineTarget;
  duration: number;
  delay: number;
  stroke: string;
}) {
  const x1 = useMotionValue(target.x1);
  const y1 = useMotionValue(target.y1);
  const x2 = useMotionValue(target.x2);
  const y2 = useMotionValue(target.y2);
  const opacity = useMotionValue(target.opacity);

  useEffect(() => {
    if (!isFiniteLine(target) || !isFiniteNumber(target.opacity)) return;
    const ease = [...EASE] as [number, number, number, number];
    const controls = [
      animate(x1, target.x1, { duration, ease, delay }),
      animate(y1, target.y1, { duration, ease, delay }),
      animate(x2, target.x2, { duration, ease, delay }),
      animate(y2, target.y2, { duration, ease, delay }),
      animate(opacity, target.opacity, { duration, ease, delay }),
    ];
    return () => {
      for (const c of controls) c.stop();
    };
    // target fields listed explicitly — stable MotionValues must not retrigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate on pose fields only
  }, [
    target.x1,
    target.y1,
    target.x2,
    target.y2,
    target.opacity,
    duration,
    delay,
    x1,
    y1,
    x2,
    y2,
    opacity,
  ]);

  if (!isFiniteLine(target)) return null;

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
      style={{ opacity }}
    />
  );
}

function FiniteMotionCircle({
  cx: cxTarget,
  cy: cyTarget,
  r: rTarget,
  opacity: opacityTarget,
  duration,
  delay,
  stroke,
}: {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  duration: number;
  delay: number;
  stroke: string;
}) {
  const cx = useMotionValue(cxTarget);
  const cy = useMotionValue(cyTarget);
  const r = useMotionValue(rTarget);
  const opacity = useMotionValue(opacityTarget);

  useEffect(() => {
    if (
      !isFiniteCircle({ cx: cxTarget, cy: cyTarget, r: rTarget }) ||
      !isFiniteNumber(opacityTarget)
    ) {
      return;
    }
    const ease = [...EASE] as [number, number, number, number];
    const controls = [
      animate(cx, cxTarget, { duration, ease, delay }),
      animate(cy, cyTarget, { duration, ease, delay }),
      animate(r, rTarget, { duration, ease, delay }),
      animate(opacity, opacityTarget, { duration, ease, delay }),
    ];
    return () => {
      for (const c of controls) c.stop();
    };
  }, [
    cxTarget,
    cyTarget,
    rTarget,
    opacityTarget,
    duration,
    delay,
    cx,
    cy,
    r,
    opacity,
  ]);

  if (!isFiniteCircle({ cx: cxTarget, cy: cyTarget, r: rTarget })) return null;

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={stroke}
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
      style={{ opacity }}
    />
  );
}

function Scene({
  state,
  reducedMotion,
  motionKind,
}: ChangeInteractiveGraphicProps) {
  const dur = reducedMotion
    ? PHASE.reduced
    : motionKind === "hover-enter"
      ? CHANGE_HOVER.enter
      : motionKind === "hover-leave"
        ? CHANGE_HOVER.leave
        : state === "02"
          ? PHASE.toAlign
          : state === "03"
            ? PHASE.toResolve
            : PHASE.toAlign;

  const useSequenceDelays = motionKind === "sequence" && !reducedMotion;
  const amber = AMBER_POSES[state];
  const endpoint = ENDPOINT_POSES[state];

  const amberDelay =
    useSequenceDelays && state === "03" ? A03_SETTLE.amber : 0;
  const endpointDelay =
    useSequenceDelays && state === "03" ? A03_SETTLE.endpoint : 0;

  return (
    <svg
      viewBox={FIELD_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[510px] md:max-w-[540px] lg:max-w-[560px]"
      aria-hidden
    >
      {STRUCTURAL_EDGES.map((edge) => {
        const pose = edge.poses[state];
        if (!isFiniteLine(pose)) return null;

        const delay = !useSequenceDelays
          ? 0
          : state === "02"
            ? edge.alignDelay
            : state === "03"
              ? edge.resolveDelay
              : 0;

        return (
          <FiniteMotionLine
            key={edge.id}
            target={pose}
            duration={dur}
            delay={delay}
            stroke={strokeForRole(edge.role)}
          />
        );
      })}

      {isFiniteLine(amber) ? (
        <FiniteMotionLine
          target={amber}
          duration={dur}
          delay={amberDelay}
          stroke={C.amber}
        />
      ) : null}

      {isFiniteCircle({
        cx: endpoint.x,
        cy: endpoint.y,
        r: endpoint.r,
      }) ? (
        <FiniteMotionCircle
          cx={endpoint.x}
          cy={endpoint.y}
          r={endpoint.r}
          opacity={endpoint.opacity}
          duration={dur}
          delay={endpointDelay}
          stroke={C.primary}
        />
      ) : null}
    </svg>
  );
}

export default function ChangeInteractiveGraphic(
  props: ChangeInteractiveGraphicProps,
) {
  return <Scene {...props} />;
}
