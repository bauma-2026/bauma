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
import OdstraniTattooProcessProof from "@/app/components/blocks/mini/OdstraniTattooProcessProof";
import OdstraniTattooResultsProof from "@/app/components/blocks/mini/OdstraniTattooResultsProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage.
import "@/app/components/blocks/mini/MiniSelectedWork.css";

/**
 * Title only. Indexing stays the EN layout default (noindex, no canonical or hreflang) and the page is not in the
 * sitemap; description and social metadata follow in the SEO pass.
 */
export const metadata: Metadata = {
  title: "Odstrani Tattoo: a website that explains the process first — Bauma",
};

/* The English counterpart of /work/odstrani-tattoo (`app/(sl)/work/odstrani-tattoo/page.tsx`): same structure, classes and
 * proofs, with Bauma's text in English. The reconstructions show the client's Slovenian site and carry `lang="sl"`;
 * section names quoted from it keep their Slovenian name with an English gloss. No metrics, research or brief are
 * claimed. Keep the two pages in step. Not linked until `/work/odstrani-tattoo` is activated in `lib/i18n/routes.ts`. */

const SITE_URL = "https://odstranitattoo.si";

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#7c97f0)]";

/** The proofs sit on an elevated neutral graphite surface; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#161a21",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/50";

/** Bauma's short explanation, as on /work/flexido and /work/dema-plus. */
const LEAD = "max-w-[40ch] text-xl font-medium leading-[1.4] tracking-[-0.01em] text-white/85 sm:text-2xl";

/** The one rule: it closes "Kako deluje" before the results (as on /work/flexido). */
const DIVIDER = "border-b border-white/10 pb-7 sm:pb-8 lg:pb-10";
const AFTER_DIVIDER = "pb-8 sm:pb-10 lg:pb-12";

export default function OdstraniTattooCasePageEn() {
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
          {/* 01 — INTRODUCTION: type only, on Base */}
          <section
            aria-labelledby="ot-hero"
            className="pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Odstrani Tattoo</p>

              <h1
                id="ot-hero"
                className="home-primary-heading mt-5 max-w-[20ch] sm:mt-6"
              >
                <span className="block">The answer first.</span>
                <span className="block">Then the decision.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                For Odstrani Tattoo we designed and developed a tattoo removal website. Visitors wondering whether
                their tattoo can be removed get an explanation of the process first.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Structure, design and development of the website</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  odstranitattoo.si
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
            {/* 02 — PROOF: "Kako deluje", the real section, reconstructed */}
            <section
              aria-label="Example: the “Kako deluje” (How it works) section on the odstranitattoo.si home page"
              className="pt-8 sm:pt-10"
            >
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>The process is explained without promising a result.</p>
              </div>

              <div className="px-5 sm:px-0">
                <div className="msw-proof" lang="sl">
                  <div className="msw-clip">
                    <OdstraniTattooProcessProof headingLevel={2} />
                  </div>
                </div>
              </div>

              {/* The one rule: it closes "Kako deluje" before the results (as on /work/flexido). */}
              <div className={`mini-page-rail ${AFTER_DIVIDER}`}>
                <div className={`${DIVIDER} pt-6`}>
                  <p className={CAPTION}>
                    Reconstruction of the “<span lang="sl">Kako deluje</span>” (How it works) section on the
                    odstranitattoo.si home page.
                  </p>
                </div>
              </div>
            </section>

            {/* 03 — PROOF: "Realni primeri odstranjevanja", excerpt (static) */}
            <section aria-label="Example: the “Realni primeri odstranjevanja” (Real removal examples) section on the odstranitattoo.si home page">
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  The examples show the change after a given number of treatments. Alongside them, the site explains
                  that results differ from tattoo to tattoo.
                </p>
              </div>

              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Odstrani Tattoo: the “Realni primeri odstranjevanja” section with one before-and-after pair showing the tattoo gradually fading after 3 treatments, and a note that the examples do not promise the same result for every tattoo"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true" lang="sl">
                      <OdstraniTattooResultsProof />
                    </div>
                  </div>
                </div>
              </div>

              {/* 60/72/88px from the caption to the note on the way to a consultation, as between leads on /work/flexido. */}
              <div className="mini-page-rail pb-15 pt-6 sm:pb-18 lg:pb-22">
                <p className={CAPTION}>
                  Excerpt from the “<span lang="sl">Realni primeri odstranjevanja</span>” (Real removal examples)
                  section on the odstranitattoo.si home page. Static view.
                </p>
              </div>

              {/* 04 — The way to a consultation: Bauma's note only, no contact details or buttons. */}
              <div className="mini-page-rail pb-16 sm:pb-20 lg:pb-24">
                <p className={LEAD}>
                  For a consultation, visitors can call, or email a question with a photo of the tattoo.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /en/work, on the page's base surface. */}
          <CaseStudyNav current="odstrani-tattoo" locale="en" />
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
