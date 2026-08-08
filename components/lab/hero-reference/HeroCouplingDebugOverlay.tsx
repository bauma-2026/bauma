"use client";

import { useHomeHero } from "@/components/home/hero-system";
import type { Point2D } from "@/components/home/hero-system/heroMath";

function maxOffsetPx(offsets: [Point2D, Point2D, Point2D, Point2D]): number {
  return Math.max(...offsets.map((o) => Math.hypot(o.x, o.y)));
}

export default function HeroCouplingDebugOverlay() {
  const { coupling, oneEnvelope } = useHomeHero();

  const d = coupling.diagnostics;
  const support =
    oneEnvelope.grammarPhase !== "idle"
      ? `${oneEnvelope.supportReaching ?? "—"} → ${oneEnvelope.supportReceiving ?? "—"}`
      : "—";

  return (
    <div
      data-coupling-debug
      className="pointer-events-none fixed bottom-4 right-4 z-[100] min-w-[240px] rounded border border-white/15 bg-black/85 px-3 py-2 font-mono text-[10px] leading-relaxed text-white/75 shadow-lg"
      aria-hidden
    >
      <p className="mb-1 text-[9px] uppercase tracking-[0.14em] text-amber-200/70">
        Coupling debug
      </p>
      <p>phase: {coupling.couplingPhase}</p>
      <p>
        journey:{" "}
        {coupling.journeyActive ? coupling.journeySource ?? "active" : "idle"}
      </p>
      <p>proximity: {coupling.proximity.toFixed(3)}</p>
      <p>regionDepth: {coupling.regionDepth.toFixed(3)}</p>
      <p>dwell: {d.dwellContribution.toFixed(3)}</p>
      <p>velocity×: {d.velocityFactor.toFixed(3)}</p>
      <p>persistence: {coupling.persistence.toFixed(3)}</p>
      <p>targetIntent: {coupling.intent.toFixed(3)}</p>
      <p>targetEnv: {coupling.targetEnvelope.toFixed(3)}</p>
      <p>coupledEnv: {coupling.envelope.toFixed(3)}</p>
      <p>locoEnv: {oneEnvelope.locomotionEnvelope.toFixed(3)}</p>
      <p>resolveBlend: {oneEnvelope.resolveBlend.toFixed(3)}</p>
      <p>maxVertex: {maxOffsetPx(oneEnvelope.vertexOffsets).toFixed(2)} px</p>
      <p>maxDepth: {maxOffsetPx(oneEnvelope.depthOffsets).toFixed(2)} px</p>
      <p>support: {support}</p>
      <p>approach: {coupling.approach}</p>
    </div>
  );
}
