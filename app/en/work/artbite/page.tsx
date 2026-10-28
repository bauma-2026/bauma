import type { Metadata } from "next";
import { enPageMetadata } from "@/lib/indexing";
import type { CSSProperties } from "react";

import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniHeader from "@/app/components/blocks/mini/MiniHeader";
import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";
import CaseStudyNav from "@/app/components/work/CaseStudyNav";
import { EN_FOOTER_COPY, EN_HEADER_COPY } from "@/app/components/blocks/mini/enChromeCopy";
import { EN_HOME_CONTACT } from "@/app/components/blocks/mini/enHomeCopy";
import { homeMono } from "@/app/homeMono";
import { EN_PRIMARY_NAV } from "@/lib/i18n/routes";
/** Scoped to the closing below only (`[data-home-typography]`), as on /work. */
import "@/app/homeTypography.css";
import ArtBiteHeroProof from "@/app/components/blocks/mini/ArtBiteHeroProof";
import ArtBiteGalleryProof from "@/app/components/blocks/mini/ArtBiteGalleryProof";
import ArtBiteCoverupProof from "@/app/components/blocks/mini/ArtBiteCoverupProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage and the other case studies.
import "@/app/components/blocks/mini/MiniSelectedWork.css";

/**
 * Title, description and social metadata (`enPageMetadata`, lib/indexing.ts). In an explicit production build: index,
 * self-canonical and hreflang to the Slovenian page; everywhere else noindex.
 */
export const metadata: Metadata = enPageMetadata("/en/work/artbite", {
  title: "ArtBite: a tattoo studio website that starts with the work — Bauma",
  description:
    "For ArtBite we designed and developed a website for a tattoo studio in Domžale, led by photographs of the work. A separate page explains cover-ups of old tattoos.",
});

/* The English counterpart of /work/artbite (`app/(sl)/work/artbite/page.tsx`): same structure, classes and proofs, with
 * Bauma's text in English. The reconstructions show the client's Slovenian site and carry `lang="sl"`; section and page
 * names quoted from it keep their Slovenian name with an English gloss. No metrics, dates or results are claimed. Keep
 * the two pages in step. Not linked until `artbite` is added to `LIVE_CASE_STUDIES` in `lib/i18n/routes.ts`. */

const SITE_URL = "https://artbite-tattoo.com/";

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#7c97f0)]";

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

export default function ArtBiteCasePageEn() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          locale="en"
          copy={EN_HEADER_COPY}
          primaryNav={EN_PRIMARY_NAV}
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
                <span className="block">A personal approach.</span>
                <span className="block">A clear presentation.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                For ArtBite we designed and developed a tattoo studio website led by photographs of the work and the
                studio’s personal approach.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Structure, design and development of the website</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  artbite-tattoo.com
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
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
              aria-label="Example: the hero section of the artbite-tattoo.com home page"
              className="pt-8 sm:pt-10"
            >
              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="ArtBite: home page hero section with the line “Tetovaže z osebnim pristopom.” and tattoo photographs"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true" lang="sl">
                      <ArtBiteHeroProof />
                    </div>
                  </div>
                </div>
              </div>

              {/* 60/72/88px to the next lead, as on /work/flexido and /work/dema-plus. */}
              <div className="mini-page-rail pb-15 pt-5 sm:pb-18 lg:pb-22">
                <p className={CAPTION}>
                  Reconstruction of the hero section of the artbite-tattoo.com home page. The buttons in this view are
                  not active.
                </p>
              </div>
            </section>

            {/* 03 — GALLERY: a selection from /tatuji, directly on the surface */}
            <section aria-label="Example: a selection from the “Tatuji” (Tattoos) gallery on artbite-tattoo.com">
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  The gallery puts photographs of the work first, so visitors can judge the studio’s style.
                </p>
              </div>

              {/* The client's copy and alt texts stay Slovenian; the scrollable row's label is Bauma's, in English. */}
              <ArtBiteGalleryProof label="Tattoo selection" contentLang="sl" labelLang="en" />

              {/* The one rule on the page: it closes the gallery before the cover-up page. */}
              <div className={`mini-page-rail ${AFTER_DIVIDER}`}>
                <div className={`${DIVIDER} pt-8`}>
                  <p className={CAPTION}>
                    Reconstruction of a selection from the “<span lang="sl">Tatuji</span>” (Tattoos) gallery on
                    artbite-tattoo.com.
                  </p>
                </div>
              </div>
            </section>

            {/* 04 — COVER-UP: the hero of "Prekrivanje starih tetovaž" (static) */}
            <section
              aria-label="Example: the hero section of the “Prekrivanje starih tetovaž” (Covering old tattoos) page on artbite-tattoo.com"
              className="pt-0"
            >
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  Cover-ups of old tattoos have their own page, which explains the limitations and asks visitors to
                  send a photo for assessment.
                </p>
              </div>

              {/* Nothing inside is interactive, so it is exposed as a single labelled image.
                  Edge to edge below sm (no gutters, no radius): the photographic slices need the full width. */}
              <div>
                <div
                  role="img"
                  aria-label="ArtBite: hero section of the “Prekrivanje starih tetovaž” page with a heading, an invitation to send a photo and a photograph in narrow vertical strips"
                  className="msw-proof msw-proof--bleed"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true" lang="sl">
                      <ArtBiteCoverupProof />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-16 pt-5 sm:pb-20 lg:pb-24">
                <p className={CAPTION}>
                  Reconstruction of the hero section of the “<span lang="sl">Prekrivanje starih tetovaž</span>”
                  (Covering old tattoos) page on artbite-tattoo.com. The buttons in this view are not active.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /en/work, on the page's base surface. */}
          <CaseStudyNav current="artbite" locale="en" />
        </main>

        {/* The closing shared with /en/work: the English home page's copy and the /work type scope. */}
        <div data-home-typography className={homeMono.variable}>
          <MiniClosingBookend
            variant="graphite"
            photoBackground
            topRule={false}
            tone="natural-midnight"
            spacing="roomy"
            ctaCopy={EN_HOME_CONTACT}
            footerCopy={EN_FOOTER_COPY}
          />
        </div>
      </div>
    </MiniPalette>
  );
}
