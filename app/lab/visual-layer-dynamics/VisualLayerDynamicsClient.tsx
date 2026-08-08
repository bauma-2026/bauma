"use client";

import VisualLayerDynamicsPlane, {
  FRONT_B,
  PHYSICS,
  type PhysicsId,
} from "@/components/lab/visual-layer-dynamics/VisualLayerDynamicsPlane";

const VARIANTS: { id: PhysicsId; note: string }[] = [
  {
    id: "P1",
    note: `${PHYSICS.P1.openImpulseMs}ms→${PHYSICS.P1.openImpulseTarget} · settle ${PHYSICS.P1.openSettleMs}ms · release ${PHYSICS.P1.releaseDampMs}ms`,
  },
  {
    id: "P2",
    note: `${PHYSICS.P2.openImpulseMs}ms→${PHYSICS.P2.openImpulseTarget} · settle ${PHYSICS.P2.openSettleMs}ms · release ${PHYSICS.P2.releaseDampMs}ms`,
  },
  {
    id: "P3",
    note: `${PHYSICS.P3.openImpulseMs}ms→${PHYSICS.P3.openImpulseTarget} · settle ${PHYSICS.P3.openSettleMs}ms · release ${PHYSICS.P3.releaseDampMs}ms`,
  },
];

/**
 * Physics compare — front B locked, pointer remap off.
 */
export default function VisualLayerDynamicsClient() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-mono text-[11px] text-white/45">
            Lab — Visual Layer Interaction Physics · production unchanged
          </p>
          <p className="mt-2 max-w-[68ch] text-sm leading-6 text-white/55">
            Front B locked (rest {FRONT_B.rest} → peak {FRONT_B.peak} → hold{" "}
            {FRONT_B.hold}). RAF impulse→settle, not CSS staggered transitions.
            Hover each: fast attack, damped settle, asymmetric release. Watch{" "}
            <code className="text-white/65">data-vld-u</code> /{" "}
            <code className="text-white/65">data-vld-mode</code>.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 md:grid-cols-3 md:gap-6">
        {VARIANTS.map((v) => (
          <section key={v.id}>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              {v.id}
            </p>
            <h1 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
              {PHYSICS[v.id].label}
            </h1>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-white/50">
              {v.note}
            </p>
            <p className="mt-1 font-mono text-[10px] text-white/40">
              lag amber {PHYSICS[v.id].lagMs.amber}ms · rear{" "}
              {PHYSICS[v.id].lagMs.rear}ms · conn {PHYSICS[v.id].lagMs.connectors}
              ms
            </p>
            <div className="relative mt-6 h-[300px] w-full">
              <VisualLayerDynamicsPlane
                physics={v.id}
                clipId={`vld-phys-${v.id}`}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </section>
        ))}
      </div>

      <div className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto max-w-[1200px] space-y-2 font-mono text-[11px] leading-relaxed text-white/45">
          <p>
            Model: impulse (easeOut^n → 85–90%) → settle remainder → release kick
            then damp (≠ rewind).
          </p>
          <p>No bounce / overshoot. Geometry amplitude unchanged. Pointer remap off.</p>
        </div>
      </div>
    </main>
  );
}
