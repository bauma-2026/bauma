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
import UlteriorHeroProof from "@/app/components/blocks/mini/UlteriorHeroProof";
import UlteriorTechnicalProof from "@/app/components/blocks/mini/UlteriorTechnicalProof";
import UlteriorVisualProof from "@/app/components/blocks/mini/UlteriorVisualProof";
import UlteriorPurchaseProof from "@/app/components/blocks/mini/UlteriorPurchaseProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage and Dema Plus.
import "@/app/components/blocks/mini/MiniSelectedWork.css";

/**
 * Title, description and social metadata (`enPageMetadata`, lib/indexing.ts). In an explicit production build: index,
 * self-canonical and hreflang to the Slovenian page; everywhere else noindex.
 */
export const metadata: Metadata = enPageMetadata("/en/work/ulterior", {
  title: "Ulterior: a product page and a dedicated purchase system — Bauma",
  description:
    "For Ulterior we designed and developed a website with a hardshell jacket presentation, interactive technical details and a dedicated purchase system with PayPal.",
});

/* The English counterpart of /work/ulterior (`app/(sl)/work/ulterior/page.tsx`): same structure, classes and proofs,
 * with Bauma's text in English. The client's site is in English and the proofs already mark it `lang="en"`, so no
 * language wrappers are needed here. The purchase steps are those built in ulterior-next (reservations, checkout,
 * PayPal capture webhook). Testing in the PayPal sandbox and in production is stated on the project owner's
 * confirmation (EN-005f); it describes testing only, not customer sales or transaction volume. No metrics, dates or
 * sales are claimed. Keep the two pages in step. Not linked until `ulterior` is added to `LIVE_CASE_STUDIES` in
 * `lib/i18n/routes.ts`. */

const SITE_URL = "https://ulterior.es/";

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#7c97f0)]";

/** A quiet neutral Work surface, not tied to Ulterior's own palette: the proofs bring their whites and charcoal. */
const SURFACE_WORK = {
  "--mini-surface-work": "#121316",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/50";

/** Closes a proof block under its caption: a 1px rule on the content column, in the case-nav rule tone. The caption sits
 *  nearer its proof (20-24px) than the rule (28-40px), and the next block starts 32-48px below the rule. */
const DIVIDER = "border-b border-white/10 pb-7 sm:pb-8 lg:pb-10";
const AFTER_DIVIDER = "pb-8 sm:pb-10 lg:pb-12";

/** Bauma's own short note above a proof (the Odstrani Tattoo lead, wide enough for one line on desktop). */
const LEAD = "max-w-[62ch] text-base leading-7 text-white/60";

export default function UlteriorCasePageEn() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          locale="en"
          copy={EN_HEADER_COPY}
          primaryNav={EN_PRIMARY_NAV}
          contactHref="#contact"
          borderColor="#212328"
        />

        <main>
          {/* 01 — INTRODUCTION: type only, on Base */}
          <section
            aria-labelledby="ul-hero"
            className="pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Ulterior</p>

              <h1 id="ul-hero" className="home-primary-heading mt-5 sm:mt-6">
                <span className="block">Product presentation.</span>
                <span className="block">Purpose-built.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                For Ulterior we designed and developed a website that brings together product presentation,
                interactive exploration of technical details and a dedicated purchase system.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Concept, design and development of the website and a dedicated purchase system</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  ulterior.es
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
            {/* 02 — PRODUCT PRESENTATION: the homepage hero (static) */}
            <section
              aria-label="Example: the hero section of the ulterior.es home page"
              className="pt-6 sm:pt-8"
            >
              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Ulterior: home page hero section with a photo of a green jacket on a beach and the heading “Technical protection for normal life.”"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <UlteriorHeroProof />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`mini-page-rail ${AFTER_DIVIDER}`}>
                <div className={`${DIVIDER} pt-5`}>
                  <p className={CAPTION}>
                    Reconstruction of the hero section of the ulterior.es home page.
                  </p>
                </div>
              </div>
            </section>

            {/* 03 — TECHNICAL PROOF: interactive */}
            <section aria-label="Example: the Technical Proof section on the ulterior.es product page">
              <div className="mini-page-rail pb-6 sm:pb-8">
                <p className={LEAD}>
                  Click or tap the marked points to explore the product details.
                </p>
              </div>

              <div className="px-5 sm:px-0">
                <div
                  role="group"
                  aria-label="Ulterior: interactive Technical Proof section (reconstruction)"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <UlteriorTechnicalProof />
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-10 pt-5 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Reconstruction of the “Technical Proof” section on the ulterior.es product page.
                </p>
              </div>
            </section>

            {/* 04 — VISUAL PROOF: the hardshell photography, directly on the case-study surface */}
            <section
              aria-label="Example: the Visual Proof section on the Hardshell page of ulterior.es"
              className="pt-4 lg:pt-2"
            >
              <UlteriorVisualProof label="Hardshell: product views" />

              <div className={`mini-page-rail ${AFTER_DIVIDER}`}>
                <div className={`${DIVIDER} pt-6`}>
                  <p className={CAPTION}>
                    The “Visual Proof” section on the Hardshell page of ulterior.es.
                  </p>
                </div>
              </div>
            </section>

            {/* 05 — PURCHASE: the product page's purchase area, as built (static) */}
            <section
              aria-labelledby="ul-purchase"
              className="pt-0"
            >
              {/* Bauma's explanation, on the case-study surface; only the reconstructed product UI sits in the frame.
                  Every step below is in ulterior-next (reservations, checkout, PayPal capture webhook); no live sales
                  are claimed; sandbox and production testing are stated on the owner's confirmation. */}
              <div className="mini-page-rail pb-8 sm:pb-10">
                <h2 id="ul-purchase" className="home-bridge-heading">
                  A dedicated purchase system.
                </h2>
                <div className="mt-5 max-w-[48ch] space-y-4 text-base leading-7 text-white/70 sm:text-lg sm:leading-[1.7]">
                  <p>
                    For Ulterior we developed a dedicated purchase system with color, size and quantity selection and
                    payment via PayPal. During checkout the system reserves the selected quantity and manages the
                    order.
                  </p>
                  <p>
                    Once payment is confirmed, the order is marked as paid and the reserved quantity is deducted from
                    stock. Repeated notifications for the same payment do not trigger a second deduction. If a
                    reservation is canceled or expires, the quantity is released.
                  </p>
                  <p>
                    We tested the purchase flow in both the PayPal sandbox and production environments.
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-0">
                <div
                  role="group"
                  aria-label="Ulterior: dedicated purchase system (reconstruction of the product page’s purchase area)"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <UlteriorPurchaseProof label="Ulterior: demonstration of the purchase area of the product page with the color Deep Olive, size L, quantity 1 and a “Purchase with PayPal” button, which is not connected to payment in this view" />
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-14 pt-5 sm:pb-16 lg:pb-20">
                <p className={CAPTION}>
                  Reconstruction of the purchase area of the ulterior.es product page. Variant selection and payment
                  are not enabled in this view.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /en/work, on the page's base surface. */}
          <CaseStudyNav current="ulterior" locale="en" />
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
