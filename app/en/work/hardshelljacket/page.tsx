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
import HardshelljacketHeroProof from "@/app/components/blocks/mini/HardshelljacketHeroProof";
import HardshelljacketConstructionProof from "@/app/components/blocks/mini/HardshelljacketConstructionProof";
import HardshelljacketEverydayProof from "@/app/components/blocks/mini/HardshelljacketEverydayProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage and the other case studies.
import "@/app/components/blocks/mini/MiniSelectedWork.css";

/**
 * Title, description and social metadata (`enPageMetadata`, lib/indexing.ts). In an explicit production build: index,
 * self-canonical and hreflang to the Slovenian page; everywhere else noindex.
 */
export const metadata: Metadata = enPageMetadata("/en/work/hardshelljacket", {
  title: "Hardshelljacket: a website for a single product — Bauma",
  description:
    "For Hardshelljacket we designed and developed a single-product website for Ulterior’s jacket. The purchase link leads to Ulterior; business inquiries are kept separate.",
});

/* The English counterpart of /work/hardshelljacket (`app/(sl)/work/hardshelljacket/page.tsx`): same structure, classes
 * and proofs, with Bauma's text in English. The client's site is in English, so the reconstructions need no language
 * mark here. The purchase flow belongs to Ulterior (ulterior.es); business inquiries go to a separate brand contact; no
 * sales results or commerce work are claimed. Keep the two pages in step. Not linked until `hardshelljacket` is added
 * to `LIVE_CASE_STUDIES` in `lib/i18n/routes.ts`. */

const SITE_URL = "https://hardshelljacket.com/";

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#7c97f0)]";

/** Neutral graphite behind the proofs; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#16181c",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/50";

export default function HardshelljacketCasePageEn() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          locale="en"
          copy={EN_HEADER_COPY}
          primaryNav={EN_PRIMARY_NAV}
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
                <span className="block">One product.</span>
                <span className="block">One page.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                For Hardshelljacket we built a single-page website for Ulterior’s jacket. Photography and technical
                details present the product, the purchase link leads to Ulterior, and business inquiries go to a
                separate brand email address.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Concept, design and development of the website in English and Spanish</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  hardshelljacket.com
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
            {/* 02 — HERO: the opening of the one-page site (static) */}
            <section
              aria-label="Example: the hero section of hardshelljacket.com"
              className="pt-8 sm:pt-10"
            >
              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Hardshelljacket: header and hero section with the heading “Waterproof Hardshell Jacket”, the price, a “Buy on Ulterior” button and a photo of a model in a white jacket against concrete architecture"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <HardshelljacketHeroProof />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-10 pt-5 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Reconstruction of the hero section of hardshelljacket.com. The buttons in this view are not active.
                </p>
              </div>
            </section>

            {/* 03 — THREE-LAYER CONSTRUCTION: the quiet product-detail spread (static) */}
            <section
              aria-label="Example: the Three-layer construction section of hardshelljacket.com"
              className="pt-0"
            >
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Hardshelljacket: the “Three-layer construction” section with the back of an off-white jacket and the text “A protective shell with a distinctive signature.”"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <HardshelljacketConstructionProof alt="Back of an off-white hardshell jacket with an iridescent appliqué at the center of the back" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-10 pt-5 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Reconstruction of the “Three-layer construction” section of hardshelljacket.com.
                </p>
              </div>
            </section>

            {/* 04 — EVERYDAY USE: the atmospheric band (static) */}
            <section
              aria-label="Example: the Everyday use section of hardshelljacket.com"
              className="pt-0"
            >
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Hardshelljacket: the photo section “Made for the way the day moves.” with a man in a green hood at a rainy intersection and an “Explore the Hardshell” button"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <HardshelljacketEverydayProof alt="Man wearing the green hood of a hardshell jacket at a rainy intersection in a European city" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-16 pt-5 sm:pb-20 lg:pb-24">
                <p className={CAPTION}>
                  Reconstruction of the “Everyday use” section of hardshelljacket.com.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /en/work, on the page's base surface. */}
          <CaseStudyNav current="hardshelljacket" locale="en" />
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
