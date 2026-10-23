import type { Metadata } from "next";
import { isStaging } from "@/lib/siteEnv";
import type { CSSProperties } from "react";

import MiniPalette from "../../components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "../../components/blocks/mini/MiniHeader";
import MiniClosingBookend from "../../components/blocks/mini/MiniClosingBookend";
import CaseStudyNav from "../../components/work/CaseStudyNav";
import {
  MINI_CONTACT_MAILTO,
  type MiniFinalCtaCopy,
} from "../../components/blocks/mini/MiniFinalCTA";
import FlexidoAreasProof from "../../components/blocks/mini/FlexidoAreasProof";
import FlexidoHomeProof from "../../components/blocks/mini/FlexidoHomeProof";

const TITLE = "Flexido: dve poti v industrijsko ponudbo — Bauma";
const DESCRIPTION =
  "Flexido: ponudba industrijske avtomatizacije ima dva vstopa, po proizvodnem problemu in po standardnem sistemu. Primer iz prakse.";

/** `noindex` stays until the case studies launch. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    ...(isStaging ? {} : { url: "https://bauma.si/work/flexido" }),
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

/* Facts checked against the live flexido.eu and the flexido-next source.
 * No metrics, before/after or results are claimed. */

const SITE_URL = "https://flexido.eu/";

const FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

const closingCopy: MiniFinalCtaCopy = {
  eyebrow: "NASLEDNJI KORAK",
  line1: "Nekdo išče rešitev za problem,",
  line2: "drugi že pozna izdelek.",
  body: "Pri Flexidu stran podpira oba vstopa in ju poveže. Če ima vaša ponudba več vstopov, jih lahko skupaj uredimo.",
  cta: "Pogovorimo se o projektu",
  mailto: MINI_CONTACT_MAILTO,
};

/* --------------------------------- tokens -------------------------------- */

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

/** The two proofs share the Work surface of `/work` and the homepage Selected Work; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#161a21",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

/** Same framing as Hardshelljacket: 20px gutters and a 6px radius below sm, then the rail (1216px max) with an 8px radius. */
const PROOF_FRAME =
  "mx-auto w-full isolate overflow-hidden rounded-none max-sm:w-[calc(100%-2.5rem)] max-sm:rounded-[6px] sm:w-[calc(100%-3rem)] sm:max-w-[1216px] sm:rounded-[8px] md:w-[calc(100%-4rem)]";

const CAPTION =
  "mx-auto max-w-[760px] text-center text-sm leading-relaxed text-white/40";

/** Trims the Areas proof's own 64/80/96px vertical padding to an even ~36px inside the frame (which clips) below lg and
 *  ~48px from lg, the same as the Ulterior and Dema Plus proofs. Viewport widths, as in the proof. */
const AREAS_TRIM = "[&>div]:-my-7 sm:[&>div]:-my-11 lg:[&>div]:-my-12";

export default function FlexidoCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          primaryNav={HOME_NAV}
          contactHref="#contact"
          borderColor="#1e2530"
        />

        <main>
          {/* 01 — INTRODUCTION: type only, on Base; the proofs below share one elevated graphite surface */}
          <section
            aria-labelledby="fx-hero"
            className="pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-32"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Flexido</p>

              <h1 id="fx-hero" className="home-primary-heading mt-5 sm:mt-6">
                <span className="block">Kompleksna ponudba.</span>
                <span className="block">Jasna struktura.</span>
              </h1>

              <p className="mt-6 max-w-[30rem] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                Spletno stran smo zasnovali tako, da je industrijska ponudba
                pregledna po proizvodnih procesih in izdelkih.
              </p>

              <p className="mt-6 text-sm leading-6 sm:text-[15px]">
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/80 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  flexido.eu
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
            {/* 02 — MAIN PROOF: homepage (decorative: static copy of the real hero) */}
            <section
              aria-label="Dokaz: uvodni razdelek domače strani flexido.eu"
              className="pt-8 sm:pt-10"
            >
              {/* Nothing inside is interactive, so it is exposed to assistive
                  tech as a single labelled image. */}
              <div
                role="img"
                aria-label="Flexido: uvodni razdelek domače strani z naslovom „Povežemo tok med stroji. Ne samo robot ob stroju.“ in vrstico sedmih področij"
                className={PROOF_FRAME}
              >
                <div aria-hidden="true">
                  <FlexidoHomeProof closingSeparator={false} />
                </div>
              </div>

              <div className="mini-page-rail pb-14 pt-6 sm:pb-16 lg:pb-20">
                <p className={CAPTION}>
                  Rekonstrukcija uvodnega razdelka domače strani flexido.eu.
                </p>
              </div>
            </section>

            {/* 03 — SECONDARY PROOF: the /resitve hub (real content, static) */}
            <section
              aria-label="Dokaz: razdelek Področja na strani Rešitve"
              className="pt-14 sm:pt-16 lg:pt-20"
            >
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className="max-w-[40ch] text-xl font-medium leading-[1.4] tracking-[-0.01em] text-white/85 sm:text-2xl">
                  Sedem področij je prvi vstop: obiskovalec začne pri procesu,
                  ne pri izdelku. Kdor izdelek že pozna, gre prek e-kataloga.
                </p>
              </div>

              <div
                role="group"
                aria-label="Flexido: razdelek „Področja“ na strani Rešitve (rekonstrukcija)"
                className={`${PROOF_FRAME} ${AREAS_TRIM}`}
              >
                <FlexidoAreasProof />
              </div>

              <div className="mini-page-rail pb-16 pt-6 sm:pb-20 lg:pb-24">
                <p className={CAPTION}>
                  Rekonstrukcija razdelka „Področja“ na strani Rešitve.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /work, on the page's base surface. */}
          <CaseStudyNav current="flexido" />
        </main>

        <MiniClosingBookend
          variant="graphite"
          photoBackground
          topRule={false}
          tone="natural-midnight"
          ctaCopy={closingCopy}
        />
      </div>
    </MiniPalette>
  );
}
