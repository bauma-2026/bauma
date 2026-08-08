"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import MiniDecisionFlow from "@/app/components/blocks/mini/MiniDecisionFlow";
import SystemGraphic from "@/app/components/blocks/mini/SystemGraphic";
import ApproachInteractiveSection from "@/components/home/approach/ApproachInteractiveSection";
import {
  APPROACH_CONTENT_LOCK_VARIANTS,
  type ApproachContentLockVariantId,
} from "@/components/home/approach/copy";
import { useReducedMotion } from "@/components/home/approach/useReducedMotion";

const VARIANT_IDS = ["A", "B", "C"] as const;

function resolveVariant(raw: string | null): ApproachContentLockVariantId {
  if (raw === "A" || raw === "B" || raw === "C") return raw;
  return "A";
}

/**
 * Lab review — Approach content lock variants.
 * Production homepage copy is untouched; only this route swaps copy.
 */
export default function ApproachContentLockClient() {
  const params = useSearchParams();
  const variantId = resolveVariant(params.get("variant"));
  const variant = APPROACH_CONTENT_LOCK_VARIANTS[variantId];
  const reducedMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="mini-page-rail flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-white/45">
            Lab — Approach Content Lock · variant {variantId}: {variant.label}
          </p>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Copy variants">
            {VARIANT_IDS.map((id) => {
              const active = id === variantId;
              return (
                <Link
                  key={id}
                  href={`/lab/approach-content-lock?variant=${id}`}
                  className={[
                    "rounded-sm px-2.5 py-1 font-mono text-[11px] transition-colors",
                    active
                      ? "bg-white/12 text-white"
                      : "text-white/45 hover:text-white/70",
                  ].join(" ")}
                >
                  {id}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Full-flow context for review crop */}
      <MiniDecisionFlow />
      <ApproachInteractiveSection
        reducedMotion={reducedMotion}
        copy={variant}
      />
      <SystemGraphic />
    </main>
  );
}
