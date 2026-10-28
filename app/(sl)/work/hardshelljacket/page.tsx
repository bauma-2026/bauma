import type { Metadata } from "next";
import { slPageMetadata } from "@/lib/indexing";
import type { CSSProperties } from "react";

import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "@/app/components/blocks/mini/MiniHeader";
import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";
import CaseStudyNav from "@/app/components/work/CaseStudyNav";
import { homeMono } from "@/app/homeMono";
/** Scoped to the closing below only (`[data-home-typography]`), as on /work. */
import "@/app/homeTypography.css";
import HardshelljacketHeroProof from "@/app/components/blocks/mini/HardshelljacketHeroProof";
import HardshelljacketConstructionProof from "@/app/components/blocks/mini/HardshelljacketConstructionProof";
import HardshelljacketEverydayProof from "@/app/components/blocks/mini/HardshelljacketEverydayProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage and the other case studies.
import "@/app/components/blocks/mini/MiniSelectedWork.css";

const TITLE = "Hardshelljacket: spletna stran za en izdelek — Bauma";
const DESCRIPTION =
  "Za Hardshelljacket smo zasnovali, oblikovali in razvili stran za jakno Ulterior. Nakup vodi na Ulterior, poslovna povpraševanja so ločena.";

export const metadata: Metadata = slPageMetadata(
  "/work/hardshelljacket",
  { title: TITLE, description: DESCRIPTION },
);

/* Facts checked against the live hardshelljacket.com and the hardshelljacket-next source
 * (footer credit: "Structure & development: Bauma"). The purchase flow belongs to Ulterior
 * (ulterior.es); no sales results or commerce work are claimed. */

const SITE_URL = "https://hardshelljacket.com/";

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#7c97f0)]";

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

/** Neutral graphite behind the proofs; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#16181c",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/50";

export default function HardshelljacketCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          primaryNav={HOME_NAV}
          contactHref="#contact"
          borderColor="#202428"
        />

        <main>
          {/* 01 — INTRODUCTION: type only, on Base */}
          <section
            aria-labelledby="hj-hero"
            className="pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Hardshelljacket</p>

              <h1 id="hj-hero" className="home-primary-heading mt-5 sm:mt-6">
                <span className="block">En izdelek.</span>
                <span className="block">Ena stran.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                Za Hardshelljacket smo razvili enostransko spletno stran za
                predstavitev Ulteriorjeve jakne. Fotografije in tehnični
                podatki predstavijo izdelek, povezava za nakup vodi na
                Ulterior, poslovna povpraševanja pa na ločen e-poštni kontakt
                znamke.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Zasnova, oblikovanje in razvoj spletne strani v angleščini in španščini</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  hardshelljacket.com
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only"> (odpre se v novem zavihku)</span>
                </a>
              </p>
            </div>
          </section>

          <div
            style={SURFACE_WORK}
            className="bg-[var(--mini-surface-work,#080a0f)]"
          >
            {/* 02 — HERO: the opening of the one-page site (static) */}
            <section
              aria-label="Dokaz: uvodni razdelek spletne strani hardshelljacket.com"
              className="pt-8 sm:pt-10"
            >
              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Hardshelljacket: glava in uvodni razdelek z naslovom „Waterproof Hardshell Jacket“, ceno, gumbom „Buy on Ulterior“ in fotografijo modela v beli jakni pred betonsko arhitekturo"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true" lang="en">
                      <HardshelljacketHeroProof />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-10 pt-5 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Rekonstrukcija uvodnega razdelka spletne strani
                  hardshelljacket.com. Gumbi v tem prikazu niso aktivni.
                </p>
              </div>
            </section>

            {/* 03 — THREE-LAYER CONSTRUCTION: the quiet product-detail spread (static) */}
            <section
              aria-label="Dokaz: razdelek Three-layer construction na spletni strani hardshelljacket.com"
              className="pt-0"
            >
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Hardshelljacket: razdelek „Three-layer construction“ s hrbtno stranjo off-white jakne in besedilom „A protective shell with a distinctive signature.“"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true" lang="en">
                      <HardshelljacketConstructionProof />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-10 pt-5 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Rekonstrukcija razdelka „Three-layer construction“ spletne
                  strani hardshelljacket.com.
                </p>
              </div>
            </section>

            {/* 04 — EVERYDAY USE: the atmospheric band (static) */}
            <section
              aria-label="Dokaz: razdelek Everyday use na spletni strani hardshelljacket.com"
              className="pt-0"
            >
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Hardshelljacket: fotografski razdelek „Made for the way the day moves.“ z moškim v zeleni kapuci na deževnem križišču in gumbom „Explore the Hardshell“"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true" lang="en">
                      <HardshelljacketEverydayProof />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-16 pt-5 sm:pb-20 lg:pb-24">
                <p className={CAPTION}>
                  Rekonstrukcija razdelka „Everyday use“ spletne strani
                  hardshelljacket.com.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /work, on the page's base surface. */}
          <CaseStudyNav current="hardshelljacket" />
        </main>

        {/* The closing shared with /work: same copy, spacing and the /work type scope (Contact eyebrow, H2 tracking). */}
        <div data-home-typography className={homeMono.variable}>
          <MiniClosingBookend
            variant="graphite"
            photoBackground
            topRule={false}
            tone="natural-midnight"
            spacing="roomy"
          />
        </div>
      </div>
    </MiniPalette>
  );
}
