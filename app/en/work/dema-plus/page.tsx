import type { Metadata } from "next";
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
import DemaPlusHeroProof from "@/app/components/blocks/mini/DemaPlusHeroProof";
import DemaPlusReferencesProof from "@/app/components/blocks/mini/DemaPlusReferencesProof";
import DemaPlusProjectProof from "@/app/components/blocks/mini/DemaPlusProjectProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage.
import "@/app/components/blocks/mini/MiniSelectedWork.css";

/**
 * Title only. Indexing stays the EN layout default (noindex, no canonical or hreflang) and the page is not in the
 * sitemap; description and social metadata follow in the SEO pass.
 */
export const metadata: Metadata = {
  title: "Dema Plus: a website that presents projects and services — Bauma",
};

/* The English counterpart of /work/dema-plus (`app/(sl)/work/dema-plus/page.tsx`): same structure, classes and proofs,
 * with Bauma's text in English. The reconstructions show the client's Slovenian site and carry `lang="sl"` inside
 * Bauma's English labels; section names quoted from it keep their Slovenian name with an English gloss. No metrics,
 * dates or results are claimed. Keep the two pages in step. Not linked until `dema-plus` is added to
 * `LIVE_CASE_STUDIES` in `lib/i18n/routes.ts`. */

const SITE_URL = "https://demaplus.si/";

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#7c97f0)]";

/** The two proofs share the Work surface of `/work` and the homepage Selected Work; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#0f141c",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/50";

/** Bauma's short explanation above a proof (the /work/flexido lead). */
const LEAD = "max-w-[40ch] text-xl font-medium leading-[1.4] tracking-[-0.01em] text-white/85 sm:text-2xl";

/** Trims the References proof's own 48/40, 64/56 and 80/64px section padding (`.msw-clip > div`) to an even
 *  ~36px around the content below 1024 and ~48px from 1024, the same as the Ulterior proofs. Container widths, as in the proof. */
const REFERENCES_TRIM =
  "[--msw-trim-top:12px] [--msw-trim-bottom:4px] @min-[640px]:[--msw-trim-top:28px] @min-[640px]:[--msw-trim-bottom:20px] @min-[1024px]:[--msw-trim-top:32px] @min-[1024px]:[--msw-trim-bottom:16px]";

export default function DemaPlusCasePageEn() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          locale="en"
          copy={EN_HEADER_COPY}
          primaryNav={EN_PRIMARY_NAV}
          contactHref="#contact"
          borderColor="#1c2431"
        />

        <main>
          {/* 01 — INTRODUCTION: type only, on Base */}
          <section
            aria-labelledby="dp-hero"
            className="pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Dema Plus</p>

              <h1
                id="dp-hero"
                className="home-primary-heading mt-5 max-w-[20ch] text-balance sm:mt-6"
              >
                Projects first.
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                In redesigning the Dema Plus website, we put completed projects first. They show the scope and range
                of the company’s work and are the starting point for its services and how it delivers them.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Structure, design and development of the website</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  demaplus.si
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
            {/* 02 — MAIN PROOF: the opening screen (static copy of the real hero) */}
            <section
              aria-label="Example: the hero section of the demaplus.si home page"
              className="pt-8 sm:pt-10"
            >
              {/* Nothing inside is interactive and the proof carries its own
                  title, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Dema Plus: home page hero section with a photo of a building, the heading “Gradimo. Po načrtu. Do izvedbe.” and an “Izbrani projekti” button"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true" lang="sl">
                      <DemaPlusHeroProof headingLevel={2} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 60/72/88px to the next lead, as on /work/flexido. */}
              <div className="mini-page-rail pb-15 pt-6 sm:pb-18 lg:pb-22">
                <p className={CAPTION}>
                  Reconstruction of the hero section of the demaplus.si home page.
                </p>
              </div>
            </section>

            {/* 03 — REFERENCES: the Reference section (real content, static) */}
            <section aria-label="Example: the “Reference” (References) section on the demaplus.si home page">
              {/* The order is the demaplus-next homepage's: hero → FeaturedProjects → HomeServices. */}
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  The hero section is followed by selected projects, and only then by the areas of work, so visitors
                  see concrete completed work first.
                </p>
              </div>

              {/* Holds a focusable, swipeable slider on mobile, so it is not hidden. */}
              <div className="px-5 sm:px-0">
                <div className="msw-proof">
                  <div
                    role="group"
                    aria-label="Dema Plus: the “Reference” section on the home page"
                    className={`msw-clip ${REFERENCES_TRIM}`}
                  >
                    <div lang="sl">
                      <DemaPlusReferencesProof showHeader={false} headingLevel={2} allowVerticalPan />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-15 pt-6 sm:pb-18 lg:pb-22">
                <p className={CAPTION}>
                  Reconstruction of the “<span lang="sl">Reference</span>” (References) section of the demaplus.si
                  home page.
                </p>
              </div>
            </section>

            {/* 04 — PROJECT PAGE: one reference as edited text, facts and related projects (static) */}
            <section aria-label="Example: the Vila Rožna dolina project page on demaplus.si">
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  The redesign also covered the individual project pages. We edited the existing project texts into
                  short summaries, clear descriptions and separate key facts, and linked the pages through
                  project-to-project navigation and a selection of related projects.
                </p>
              </div>

              <div className="px-5 sm:px-0">
                <div className="msw-proof">
                  <div
                    role="group"
                    aria-label="Dema Plus: the Vila Rožna dolina project page (reconstruction)"
                    className="msw-clip"
                  >
                    <div lang="sl">
                      <DemaPlusProjectProof headingLevel={2} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-16 pt-6 sm:pb-20 lg:pb-24">
                <p className={CAPTION}>
                  Reconstruction of the Vila Rožna dolina project page on demaplus.si. Static view: the navigation
                  labels, links and related-project cards in this view are not interactive.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /en/work, on the page's base surface. */}
          <CaseStudyNav current="dema-plus" locale="en" />
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
