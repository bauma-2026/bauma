import type { Metadata } from "next";
import { isStaging } from "@/lib/siteEnv";
import type { CSSProperties } from "react";

import MiniPalette from "../../components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "../../components/blocks/mini/MiniHeader";
import MiniClosingBookend from "../../components/blocks/mini/MiniClosingBookend";
import {
  MINI_CONTACT_MAILTO,
  type MiniFinalCtaCopy,
} from "../../components/blocks/mini/MiniFinalCTA";
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
 * built and sandbox-tested, not as processing live payments. */

const SITE_URL = "https://ulterior.es/";

const FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/approach", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
];

/** A quiet neutral Work surface, not tied to Ulterior's own palette: the proofs bring their whites and charcoal. */
const SURFACE_WORK = {
  "--mini-surface-work": "#121316",
} as CSSProperties;

const closingCopy: MiniFinalCtaCopy = {
  eyebrow: "NASLEDNJI KORAK",
  line1: "Izdelek naj vodi,",
  line2: "nakup naj sledi.",
  body: "Pri Ulterior stran najprej pokaže izdelek, nato njegove podrobnosti, nakupni sistem pa deluje za njima. Če imaš izdelek, ki ga je treba predstaviti in prodati, ga lahko postaviva skupaj.",
  cta: "Pogovoriva se o projektu",
  mailto: MINI_CONTACT_MAILTO,
};

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/40";

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

              <p className="mt-6 text-sm leading-6 sm:text-[15px]">
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/80 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
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

              <div className="mini-page-rail pb-10 pt-5 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Rekonstrukcija uvodnega razdelka domače strani ulterior.es.
                </p>
              </div>
            </section>

            {/* 03 — TECHNICAL PROOF: interactive */}
            <section aria-label="Dokaz: razdelek Technical Proof na strani izdelka ulterior.es">
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
                  ulterior.es. Podrobnosti se izbirajo s klikom ali dotikom.
                </p>
              </div>
            </section>

            {/* 04 — VISUAL PROOF: the hardshell photography, directly on the case-study surface */}
            <section
              aria-label="Dokaz: razdelek Visual Proof na strani Hardshell ulterior.es"
              className="pt-4 lg:pt-2"
            >
              <UlteriorVisualProof />

              <div className="mini-page-rail pb-12 pt-6 sm:pb-14 lg:pb-16">
                <p className={CAPTION}>
                  Razdelek „Visual Proof“ na strani Hardshell na ulterior.es.
                </p>
              </div>
            </section>

            {/* 05 — PURCHASE: the product page's purchase area, as built (static) */}
            <section
              aria-label="Dokaz: nakupni del strani izdelka ulterior.es"
              className="pt-0"
            >
              {/* The heading and description belong to the proof; the product UI inside it is exposed as one labelled image. */}
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
                  Rekonstrukcija nakupnega dela strani izdelka na ulterior.es,
                  v stanju z onemogočenim nakupom. Potek odobritve in zajema
                  plačila je bil uspešno preizkušen v PayPal sandboxu.
                </p>
              </div>
            </section>
          </div>
        </main>

        <MiniClosingBookend
          variant="graphite"
          photoBackground
          topRule={false}
          ctaCopy={closingCopy}
        />
      </div>
    </MiniPalette>
  );
}
