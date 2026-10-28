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
import FlexidoAreasProof from "@/app/components/blocks/mini/FlexidoAreasProof";
import FlexidoHomeProof from "@/app/components/blocks/mini/FlexidoHomeProof";
import FlexidoCatalogProof from "@/app/components/blocks/mini/FlexidoCatalogProof";

/**
 * Title only. Indexing stays the EN layout default (noindex, no canonical or hreflang) and the page is not in the
 * sitemap; description and social metadata follow in the SEO pass.
 */
export const metadata: Metadata = {
  title: "Flexido: a website with two ways into the offering — Bauma",
};

/* The English counterpart of /work/flexido (`app/(sl)/work/flexido/page.tsx`): same structure, classes and proofs, with
 * Bauma's text in English. The reconstructions show Flexido's own English site (`locale="en"` on each proof: the copy of
 * www.flexido.eu/en, /en/solutions and /en/standard-cells, verbatim from flexido-next), so the page needs no language
 * marks. The terms are Flexido's own: Solutions, e-catalog, Areas, System types. No metrics, before/after or results
 * are claimed. Keep the two pages in step. */

/** Flexido's English home page (its canonical URL; the SL case study links the Slovenian site). */
const SITE_URL = "https://www.flexido.eu/en";

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#7c97f0)]";

/* --------------------------------- tokens -------------------------------- */

/** The proofs share the Work surface of `/work` and the homepage Selected Work; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#161a21",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

/** Same framing as Hardshelljacket: 20px gutters and a 6px radius below sm, then the rail (1216px max) with an 8px radius. */
const PROOF_FRAME =
  "mx-auto w-full isolate overflow-hidden rounded-none max-sm:w-[calc(100%-2.5rem)] max-sm:rounded-[6px] sm:w-[calc(100%-3rem)] sm:max-w-[1216px] sm:rounded-[8px] md:w-[calc(100%-4rem)]";

const CAPTION =
  "mx-auto max-w-[760px] text-center text-sm leading-relaxed text-white/50";

/** Trims the Areas proof's own 64/80/96px vertical padding to an even ~36px inside the frame (which clips) below lg and
 *  ~48px from lg, the same as the Ulterior and Dema Plus proofs. Viewport widths, as in the proof. */
const AREAS_TRIM = "[&>div]:-my-7 sm:[&>div]:-my-11 lg:[&>div]:-my-12";

/** Bauma's short explanation above a proof (the existing Flexido lead). */
const LEAD = "max-w-[40ch] text-xl font-medium leading-[1.4] tracking-[-0.01em] text-white/85 sm:text-2xl";

/** Closes the first path under its caption: a 1px rule on the content column, as on /work/ulterior. */
const DIVIDER = "border-b border-white/10 pb-7 sm:pb-8 lg:pb-10";
const AFTER_DIVIDER = "pb-8 sm:pb-10 lg:pb-12";

export default function FlexidoCasePageEn() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          locale="en"
          copy={EN_HEADER_COPY}
          primaryNav={EN_PRIMARY_NAV}
          contactHref="#contact"
          borderColor="#1e2530"
        />

        <main>
          {/* 01 — INTRODUCTION: type only, on Base; the proofs below share one elevated graphite surface */}
          <section
            aria-labelledby="fx-hero"
            className="pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Flexido</p>

              <h1 id="fx-hero" className="home-primary-heading mt-5 sm:mt-6">
                <span className="block">Two paths through</span>
                <span className="block">an industrial offering.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-pretty text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                The previous website focused on the{" "}
                <span className="whitespace-nowrap">e-catalog</span>. In the redesign we added Solutions — a new
                content path for visitors who start from a production process or task rather than a specific product.
                We kept the <span className="whitespace-nowrap">e-catalog</span> as a direct way in to specific
                systems.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Structure, design and development of the website in Slovenian, English and German</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  flexido.eu
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>

              <p className="mt-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                From existing photographs of robotic cells in a production environment, we created updated product
                visuals for the website.
              </p>
            </div>
          </section>

          <div
            style={SURFACE_WORK}
            className="bg-[var(--mini-surface-work,#080a0f)]"
          >
            {/* 02 — MAIN PROOF: homepage (decorative: static copy of the real hero) */}
            <section
              aria-label="Example: the hero section of the flexido.eu home page"
              className="pt-8 sm:pt-10"
            >
              {/* Nothing inside is interactive, so it is exposed to assistive
                  tech as a single labelled image. */}
              <div
                role="img"
                aria-label="Flexido: home page hero section with the heading “We connect the flow between machines. Not just a robot next to a machine.” and a row of seven areas"
                className={PROOF_FRAME}
              >
                <div aria-hidden="true">
                  <FlexidoHomeProof closingSeparator={false} locale="en" />
                </div>
              </div>

              {/* 60/72/88px to the next lead, the same rhythm as the caption → rule → lead before the e-catalog. */}
              <div className="mini-page-rail pb-15 pt-6 sm:pb-18 lg:pb-22">
                <p className={CAPTION}>
                  Reconstruction of the hero section of the flexido.eu home page.
                </p>
              </div>
            </section>

            {/* 03 — FIRST PATH, by process: the /resitve hub (real content, static) */}
            <section aria-label="Example: the Areas section on the Solutions page">
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  Visitors can start from the part of production they want to improve. The areas then point them to
                  the right solutions.
                </p>
              </div>

              <div
                role="group"
                aria-label="Flexido: the “Areas” section on the Solutions page (reconstruction)"
                className={`${PROOF_FRAME} ${AREAS_TRIM}`}
              >
                <FlexidoAreasProof locale="en" />
              </div>

              {/* The one rule on the page: it separates the two paths. */}
              <div className={`mini-page-rail ${AFTER_DIVIDER}`}>
                <div className={`${DIVIDER} pt-6`}>
                  <p className={CAPTION}>
                    Reconstruction of the “Areas” section on the Solutions page. Static view: the arrows in this view
                    are not links.
                  </p>
                </div>
              </div>
            </section>

            {/* 04 — SECOND PATH, by product: the e-catalog hub /standardne-celice (excerpt, static) */}
            <section aria-label="Example: the System types section of the flexido.eu e-catalog">
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  Visitors already looking for a specific system can start in the e-catalog and open the product
                  details from there.
                </p>
              </div>

              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div
                role="img"
                aria-label="Flexido: the “System types” section of the e-catalog with the heading “Choose a system based on the task.” and cards for the FLEX 7 CNC Slim, FLEX 7 IMM Slim and FLEX 25 / 50 systems, each with a photo, a description and the label “View system”"
                className={`${PROOF_FRAME} ${AREAS_TRIM}`}
              >
                <div aria-hidden="true">
                  <FlexidoCatalogProof locale="en" />
                </div>
              </div>

              <div className="mini-page-rail pb-15 pt-6 sm:pb-18 lg:pb-22">
                <p className={CAPTION}>
                  Excerpt from the “System types” section of the flexido.eu e-catalog. Static view: the cards in this
                  view are not links.
                </p>
              </div>
            </section>

            {/* Closing line of the study, in the explanatory-paragraph style; same 60/72/88px lead-in as the other leads. */}
            <div className="mini-page-rail pb-16 sm:pb-20 lg:pb-24">
              <p className={LEAD}>
                Visitors can look for a solution based on their production task, or go straight to the systems in the{" "}
                <span className="whitespace-nowrap">e-catalog</span>.
              </p>
            </div>
          </div>

          {/* Previous / next case study and the way back to /en/work, on the page's base surface. */}
          <CaseStudyNav current="flexido" locale="en" />
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
