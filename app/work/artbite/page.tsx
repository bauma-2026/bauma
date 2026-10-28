import type { Metadata } from "next";
import { slPageMetadata } from "@/lib/indexing";
import type { CSSProperties } from "react";

import MiniPalette from "../../components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "../../components/blocks/mini/MiniHeader";
import MiniClosingBookend from "../../components/blocks/mini/MiniClosingBookend";
import CaseStudyNav from "../../components/work/CaseStudyNav";
import { homeMono } from "../../homeMono";
/** Scoped to the closing below only (`[data-home-typography]`), as on /work. */
import "../../homeTypography.css";
import ArtBiteHeroProof from "../../components/blocks/mini/ArtBiteHeroProof";
import ArtBiteGalleryProof from "../../components/blocks/mini/ArtBiteGalleryProof";
import ArtBiteCoverupProof from "../../components/blocks/mini/ArtBiteCoverupProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage and the other case studies.
import "../../components/blocks/mini/MiniSelectedWork.css";

const TITLE = "ArtBite: stran tattoo studia, ki začne pri delih — Bauma";
const DESCRIPTION =
  "Za ArtBite smo zasnovali in razvili spletno stran tattoo studia v Domžalah, kjer imajo glavno vlogo fotografije del. Ločena stran pojasni prekrivanje starih tetovaž.";

export const metadata: Metadata = slPageMetadata(
  "/work/artbite",
  { title: TITLE, description: DESCRIPTION },
);

/* Facts checked against the live artbite-tattoo.com and the artbite-next source
 * (footer credit: "Struktura in izvedba: Bauma"). No metrics, dates or results
 * are claimed. */

const SITE_URL = "https://artbite-tattoo.com/";

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#7c97f0)]";

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

/** ArtBite's elevated surface (`--color-bg-elevated`) behind the proofs: a gentle step up from Bauma's Base; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#1f1712",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/50";

/** Bauma's short explanation above a proof, as on /work/flexido and /work/dema-plus. */
const LEAD = "max-w-[40ch] text-xl font-medium leading-[1.4] tracking-[-0.01em] text-white/85 sm:text-2xl";

/** Closes the gallery under its caption: a 1px rule on the content column, as on /work/ulterior and /work/flexido. */
const DIVIDER = "border-b border-white/10 pb-7 sm:pb-8 lg:pb-10";
const AFTER_DIVIDER = "pb-8 sm:pb-10 lg:pb-12";

export default function ArtBiteCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          primaryNav={HOME_NAV}
          contactHref="#contact"
          borderColor="#2b221c"
        />

        <main>
          {/* 01 — INTRODUCTION: type only, on Base */}
          <section
            aria-labelledby="ab-hero"
            className="pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / ArtBite</p>

              <h1 id="ab-hero" className="home-primary-heading mt-5 sm:mt-6">
                <span className="block">Osebni pristop.</span>
                <span className="block">Jasna predstavitev.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                Za ArtBite smo zasnovali in razvili spletno stran tattoo studia,
                na kateri imajo glavno vlogo fotografije del in osebni pristop.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Struktura, oblikovanje in razvoj spletne strani</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  artbite-tattoo.com
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
            {/* 02 — HOMEPAGE: the hero (static) */}
            <section
              aria-label="Dokaz: uvodni razdelek domače strani artbite-tattoo.com"
              className="pt-8 sm:pt-10"
            >
              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="ArtBite: uvodni razdelek domače strani z napisom „Tetovaže z osebnim pristopom.“ in fotografijami tetovaž"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <ArtBiteHeroProof />
                    </div>
                  </div>
                </div>
              </div>

              {/* 60/72/88px to the next lead, as on /work/flexido and /work/dema-plus. */}
              <div className="mini-page-rail pb-15 pt-5 sm:pb-18 lg:pb-22">
                <p className={CAPTION}>
                  Rekonstrukcija uvodnega razdelka domače strani
                  artbite-tattoo.com. Gumbi v tem prikazu niso aktivni.
                </p>
              </div>
            </section>

            {/* 03 — GALLERY: a selection from /tatuji, directly on the surface */}
            <section aria-label="Dokaz: izbor iz galerije Tatuji na artbite-tattoo.com">
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  Galerija postavi fotografije del v ospredje, da obiskovalec
                  lahko presodi slog studia.
                </p>
              </div>

              <ArtBiteGalleryProof />

              {/* The one rule on the page: it closes the gallery before the cover-up page. */}
              <div className={`mini-page-rail ${AFTER_DIVIDER}`}>
                <div className={`${DIVIDER} pt-8`}>
                  <p className={CAPTION}>
                    Rekonstrukcija izbora iz galerije Tatuji na
                    artbite-tattoo.com.
                  </p>
                </div>
              </div>
            </section>

            {/* 04 — COVER-UP: the hero of "Prekrivanje starih tetovaž" (static) */}
            <section
              aria-label="Dokaz: uvodni razdelek strani Prekrivanje starih tetovaž na artbite-tattoo.com"
              className="pt-0"
            >
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  Prekrivanje starih tetovaž ima svojo predstavitev, ki pojasni
                  omejitve in obiskovalca usmeri k pošiljanju fotografije za
                  oceno.
                </p>
              </div>

              {/* Nothing inside is interactive, so it is exposed as a single labelled image.
                  Edge to edge below sm (no gutters, no radius): the photographic slices need the full width. */}
              <div>
                <div
                  role="img"
                  aria-label="ArtBite: uvodni razdelek strani „Prekrivanje starih tetovaž“ z naslovom, povabilom k pošiljanju fotografije in fotografijo v ozkih navpičnih odsekih"
                  className="msw-proof msw-proof--bleed"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <ArtBiteCoverupProof />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-16 pt-5 sm:pb-20 lg:pb-24">
                <p className={CAPTION}>
                  Rekonstrukcija uvodnega razdelka strani „Prekrivanje starih
                  tetovaž“ na artbite-tattoo.com. Gumbi v tem prikazu niso
                  aktivni.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /work, on the page's base surface. */}
          <CaseStudyNav current="artbite" />
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
