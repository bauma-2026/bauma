"use client";

import { useEffect, useState } from "react";

import MiniHeader from "@/app/components/blocks/mini/MiniHeader";
import MiniDecisionFlow from "@/app/components/blocks/mini/MiniDecisionFlow";
import {
  HomeHeroCta,
  HomeHeroProvider,
} from "@/components/home/hero-system";

import LabHeroCta from "./LabHeroCta";
import StudyHeroField from "./StudyHeroField";
import {
  PRIMARY_VARIANTS,
  REFINED,
  type PlacementVariant,
  type PrimaryVariant,
  type StudyMode,
} from "./refinedConfig";

export default function HeroFinalQualityStudy() {
  const [mode, setMode] = useState<StudyMode>("refined");
  const [interactionOn, setInteractionOn] = useState(true);
  const [reducedPreview, setReducedPreview] = useState(false);
  const [primaryVariant, setPrimaryVariant] = useState<PrimaryVariant>("P2");
  const [placementVariant, setPlacementVariant] =
    useState<PlacementVariant>("S2");
  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1360px) and (min-width: 1024px)");
    const sync = () => setIsLaptop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const refined = mode === "refined";
  const interactionEnabled = interactionOn && !reducedPreview;
  const desktopOptical = isLaptop ? "laptop" : "desktop";
  const primary = PRIMARY_VARIANTS[primaryVariant];

  return (
    <div
      data-lab-root
      data-hero-final-quality-pass="1"
      data-study-mode={mode}
      data-primary-variant={primaryVariant}
      data-placement-variant={placementVariant}
      className="relative min-h-screen overflow-hidden bg-[#080808] text-white"
    >
      <MiniHeader />

      <div className="fixed bottom-4 left-4 z-50 flex max-w-[min(100vw-2rem,520px)] flex-wrap gap-2 rounded-md border border-white/15 bg-[#0c0c0c]/95 p-2 text-[11px] text-white/70 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setMode("current")}
          className={`rounded px-2.5 py-1.5 transition ${
            mode === "current"
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/50"
          }`}
        >
          Current
        </button>
        <button
          type="button"
          onClick={() => setMode("refined")}
          className={`rounded px-2.5 py-1.5 transition ${
            mode === "refined"
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/50"
          }`}
        >
          Refined
        </button>

        <span className="mx-0.5 self-center text-white/20">|</span>

        <button
          type="button"
          onClick={() => setPrimaryVariant("P1")}
          disabled={!refined}
          className={`rounded px-2.5 py-1.5 transition disabled:opacity-30 ${
            refined && primaryVariant === "P1"
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/50"
          }`}
        >
          P1 0.76
        </button>
        <button
          type="button"
          onClick={() => setPrimaryVariant("P2")}
          disabled={!refined}
          className={`rounded px-2.5 py-1.5 transition disabled:opacity-30 ${
            refined && primaryVariant === "P2"
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/50"
          }`}
        >
          P2 0.78
        </button>

        <button
          type="button"
          onClick={() => setPlacementVariant("S1")}
          disabled={!refined}
          className={`rounded px-2.5 py-1.5 transition disabled:opacity-30 ${
            refined && placementVariant === "S1"
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/50"
          }`}
        >
          S1 shift
        </button>
        <button
          type="button"
          onClick={() => setPlacementVariant("S2")}
          disabled={!refined}
          className={`rounded px-2.5 py-1.5 transition disabled:opacity-30 ${
            refined && placementVariant === "S2"
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/50"
          }`}
        >
          S2 none
        </button>

        <button
          type="button"
          onClick={() => setInteractionOn((v) => !v)}
          disabled={mode === "current" || reducedPreview}
          className={`rounded px-2.5 py-1.5 transition disabled:opacity-30 ${
            interactionOn && refined
              ? "bg-white/10 text-white/80"
              : "bg-white/5 text-white/45"
          }`}
        >
          Interaction {interactionOn ? "On" : "Off"}
        </button>
        <button
          type="button"
          onClick={() => setReducedPreview((v) => !v)}
          disabled={mode === "current"}
          className={`rounded px-2.5 py-1.5 transition disabled:opacity-30 ${
            reducedPreview
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/50"
          }`}
        >
          Reduced {reducedPreview ? "On" : "Off"}
        </button>

        {refined && (
          <span className="self-center px-1 text-white/35">
            rest {primary.rest} · {placementVariant} · {REFINED.ctaLabel}
          </span>
        )}
      </div>

      <HomeHeroProvider>
        <section
          className="relative overflow-hidden border-b border-white/10"
          data-study-hero-section="1"
        >
          <div className="mini-page-rail relative z-10 grid gap-10 pt-20 pb-0 sm:pt-20 sm:pb-0 lg:min-h-[calc(100vh-52px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-24">
            <div className="relative z-10">
              <div className="inline-flex items-center rounded-full border border-[#B68A4C]/25 bg-[#B68A4C]/[0.04] px-3 py-1 text-[11px] font-medium text-white/72 shadow-[0_0_24px_rgba(182,138,76,0.07)]">
                Structure-first websites
              </div>

              <h1 className="mt-8 font-serif font-normal leading-[0.9] tracking-[-0.025em] text-white sm:leading-[0.94]">
                <span className="block max-w-[9ch] text-[3.75rem] sm:hidden">
                  Jasna
                  <br />
                  struktura.
                  <br />
                  Več odločitev.
                </span>
                <span className="hidden max-w-[15ch] text-6xl sm:block lg:max-w-[16ch] lg:text-7xl">
                  Jasna struktura.
                  <br />
                  Več odločitev.
                </span>
              </h1>

              <p className="mt-8 max-w-[52ch] text-base leading-7 text-white/55 sm:text-lg">
                Podjetjem pomagam urediti ponudbo, vsebino in pot skozi
                spletno stran, da vse deluje kot jasna in povezana celota.
              </p>

              <div className="mt-9">
                {refined ? (
                  <LabHeroCta interactionEnabled={interactionEnabled} />
                ) : (
                  <HomeHeroCta />
                )}
              </div>

              <div className="mt-10 border-t border-white/[0.06] py-9 sm:py-10 lg:hidden">
                <div className="relative top-2 h-[232px] w-full sm:h-[240px] md:h-[256px]">
                  <StudyHeroField
                    mode={mode}
                    variant="mobile"
                    optical="mobile"
                    interactionEnabled={interactionEnabled}
                    reducedPreview={reducedPreview}
                    primaryVariant={primaryVariant}
                    placementVariant={placementVariant}
                  />
                </div>
              </div>
            </div>

            <div className="hidden min-w-0 lg:block" data-hero-visual-column>
              <StudyHeroField
                mode={mode}
                variant="desktop"
                optical={desktopOptical}
                interactionEnabled={interactionEnabled}
                reducedPreview={reducedPreview}
                primaryVariant={primaryVariant}
                placementVariant={placementVariant}
              />
            </div>
          </div>
        </section>
      </HomeHeroProvider>

      <MiniDecisionFlow />

      <footer className="mini-page-rail border-t border-white/10 py-6 text-xs text-white/40">
        <p>
          Hero Final Micro-Polish — P1/P2 primary · S1/S2 placement · locked
          depth 0.20 · scale 1.12 · motion ×0.88 · no production edits
        </p>
      </footer>
    </div>
  );
}
