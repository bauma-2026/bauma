"use client";

import { useSearchParams } from "next/navigation";

import MiniHeader from "@/app/components/blocks/mini/MiniHeader";
import {
  HomeHeroCta,
  HomeHeroField,
  HomeHeroProvider,
} from "@/components/home/hero-system";

import HeroCouplingDebugOverlay from "./HeroCouplingDebugOverlay";

/**
 * Clean historical reference for the accepted production Hero.
 * Optional debug: /lab/hero-real-context?debug=1
 */
export default function HeroReferencePageClient() {
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") === "1";

  return (
    <HomeHeroProvider>
      <div
        data-lab-root
        data-hero-reference="1"
        className="relative overflow-hidden bg-[#080808] text-white"
      >
        <MiniHeader />

        {debug && <HeroCouplingDebugOverlay />}

        <section className="relative overflow-hidden border-b border-white/10">
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
                Ponudba, vsebina in pot skozi stran so urejene tako, da obiskovalec hitro
                dojame bistvo in lažje pride do naslednjega koraka.
              </p>

              <div className="mt-9">
                <HomeHeroCta />
              </div>

              <div className="mt-10 border-t border-white/[0.06] py-9 sm:py-10 lg:hidden">
                <div className="relative top-2 h-[232px] w-full sm:h-[240px] md:h-[256px]">
                  <HomeHeroField variant="mobile" />
                </div>
              </div>
            </div>

            <div className="hidden min-w-0 lg:block" data-hero-visual-column>
              <HomeHeroField variant="desktop" />
            </div>
          </div>
        </section>

        <footer className="mini-page-rail border-t border-white/10 py-6 text-xs text-white/40">
          <p>
            Hero reference — production core via{" "}
            <code className="text-white/55">components/home/hero-system</code>
            {debug ? " · debug on" : " · add ?debug=1 for coupling overlay"}
          </p>
        </footer>
      </div>
    </HomeHeroProvider>
  );
}
