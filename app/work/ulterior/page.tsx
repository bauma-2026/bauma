import type { Metadata } from "next";
import { isStaging } from "@/lib/siteEnv";
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
import UlteriorHeroProof from "../../components/blocks/mini/UlteriorHeroProof";
import UlteriorTechnicalProof from "../../components/blocks/mini/UlteriorTechnicalProof";
import UlteriorVisualProof from "../../components/blocks/mini/UlteriorVisualProof";
import UlteriorPurchaseProof from "../../components/blocks/mini/UlteriorPurchaseProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage and Dema Plus.
import "../../components/blocks/mini/MiniSelectedWork.css";

const TITLE = "Ulterior: produktna predstavitev, namenska izvedba — Bauma";
const DESCRIPTION =
  "Ulterior: spletna stran s produktno predstavitvijo, interaktivnimi tehničnimi podrobnostmi in namenskim nakupnim sistemom s PayPalom. Primer iz prakse.";

/** `noindex` stays until the case studies launch. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    ...(isStaging ? {} : { url: "https://bauma.si/work/ulterior" }),
    siteName: "Bauma",
    images: [
      {
        url: "/og/bauma-og-v3.png",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
    locale: "sl_SI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og/bauma-og-v3.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

/* Facts checked against the live ulterior.es and the ulterior-next source.
 * No metrics, dates or results are claimed; the payment flow is described as
 * built (verified in the source), not as processing live payments. */

const SITE_URL = "https://ulterior.es/";

const FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

/** A quiet neutral Work surface, not tied to Ulterior's own palette: the proofs bring their whites and charcoal. */
const SURFACE_WORK = {
  "--mini-surface-work": "#121316",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/40";

/** Closes a proof block under its caption: a 1px rule on the content column, in the case-nav rule tone. The caption sits
 *  nearer its proof (20-24px) than the rule (28-40px), and the next block starts 32-48px below the rule. */
const DIVIDER = "border-b border-white/10 pb-7 sm:pb-8 lg:pb-10";
const AFTER_DIVIDER = "pb-8 sm:pb-10 lg:pb-12";

/** Bauma's own short note above a proof (the Odstrani Tattoo lead, wide enough for one line on desktop). */
const LEAD = "max-w-[62ch] text-base leading-7 text-white/60";

export default function UlteriorCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          primaryNav={HOME_NAV}
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
                <span className="block">Produktna predstavitev.</span>
                <span className="block">Namenska izvedba.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                Za Ulterior smo zasnovali in razvili spletno stran s produktno
                predstavitvijo, interaktivnimi tehničnimi podrobnostmi in
                namenskim nakupnim sistemom.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>
                  Struktura, oblikovanje in razvoj spletne strani ter
                  nakupnega sistema
                </span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  ulterior.es
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
            {/* 02 — PRODUCT PRESENTATION: the homepage hero (static) */}
            <section
              aria-label="Dokaz: uvodni razdelek domače strani ulterior.es"
              className="pt-6 sm:pt-8"
            >
              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Ulterior: uvodni razdelek domače strani s fotografijo zelene jakne na plaži in naslovom „Technical protection for normal life.“"
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
                    Rekonstrukcija uvodnega razdelka domače strani ulterior.es.
                  </p>
                </div>
              </div>
            </section>

            {/* 03 — TECHNICAL PROOF: interactive */}
            <section aria-label="Dokaz: razdelek Technical Proof na strani izdelka ulterior.es">
              <div className="mini-page-rail pb-6 sm:pb-8">
                <p className={LEAD}>
                  Podrobnosti izdelka lahko izberete s klikom ali dotikom
                  označenih točk.
                </p>
              </div>

              <div className="px-5 sm:px-0">
                <div
                  role="group"
                  aria-label="Ulterior: interaktivni razdelek Technical Proof (rekonstrukcija)"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <UlteriorTechnicalProof />
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-10 pt-5 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Rekonstrukcija razdelka „Technical Proof“ na strani izdelka
                  ulterior.es.
                </p>
              </div>
            </section>

            {/* 04 — VISUAL PROOF: the hardshell photography, directly on the case-study surface */}
            <section
              aria-label="Dokaz: razdelek Visual Proof na strani Hardshell ulterior.es"
              className="pt-4 lg:pt-2"
            >
              <UlteriorVisualProof />

              <div className={`mini-page-rail ${AFTER_DIVIDER}`}>
                <div className={`${DIVIDER} pt-6`}>
                  <p className={CAPTION}>
                    Razdelek „Visual Proof“ na strani Hardshell na ulterior.es.
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
                  Every step below is in ulterior-next (reservations, checkout, PayPal capture webhook); no live sales are claimed. */}
              <div className="mini-page-rail pb-8 sm:pb-10">
                <h2 id="ul-purchase" className="home-bridge-heading">
                  Namenski nakupni sistem.
                </h2>
                <div className="mt-5 max-w-[48ch] space-y-4 text-base leading-7 text-white/70 sm:text-lg sm:leading-[1.7]">
                  <p>
                    Kupec izbere barvo in velikost, sistem pa izbrano količino
                    za čas nakupa rezervira. Plačilo poteka prek PayPala.
                  </p>
                  <p>
                    Ko PayPal potrdi plačilo, se naročilo označi kot plačano,
                    rezervirani kosi pa se odštejejo od zaloge. Če kupec nakup
                    prekliče, se rezervacija sprosti.
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-0">
                <div
                  role="group"
                  aria-label="Ulterior: namenski nakupni sistem (rekonstrukcija nakupnega dela strani izdelka)"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <UlteriorPurchaseProof />
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-14 pt-5 sm:pb-16 lg:pb-20">
                <p className={CAPTION}>
                  Rekonstrukcija nakupnega dela strani izdelka na ulterior.es.
                  Prikaz nakupnega vmesnika. Plačilo v tem prikazu ni
                  omogočeno.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /work, on the page's base surface. */}
          <CaseStudyNav current="ulterior" />
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
