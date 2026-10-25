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
import FlexidoAreasProof from "../../components/blocks/mini/FlexidoAreasProof";
import FlexidoHomeProof from "../../components/blocks/mini/FlexidoHomeProof";
import FlexidoCatalogProof from "../../components/blocks/mini/FlexidoCatalogProof";

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

/* --------------------------------- tokens -------------------------------- */

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

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
  "mx-auto max-w-[760px] text-center text-sm leading-relaxed text-white/40";

/** Trims the Areas proof's own 64/80/96px vertical padding to an even ~36px inside the frame (which clips) below lg and
 *  ~48px from lg, the same as the Ulterior and Dema Plus proofs. Viewport widths, as in the proof. */
const AREAS_TRIM = "[&>div]:-my-7 sm:[&>div]:-my-11 lg:[&>div]:-my-12";

/** Bauma's short explanation above a proof (the existing Flexido lead). */
const LEAD = "max-w-[40ch] text-xl font-medium leading-[1.4] tracking-[-0.01em] text-white/85 sm:text-2xl";

/** Closes the first path under its caption: a 1px rule on the content column, as on /work/ulterior. */
const DIVIDER = "border-b border-white/10 pb-7 sm:pb-8 lg:pb-10";
const AFTER_DIVIDER = "pb-8 sm:pb-10 lg:pb-12";

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
                <span className="block">Dve poti skozi</span>
                <span className="block">industrijsko ponudbo.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-pretty text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                Za Flexido smo zasnovali in razvili spletno stran z dvema
                vstopoma v ponudbo: po proizvodnih procesih in po izdelkih.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>
                  Struktura, oblikovanje in razvoj spletne strani v
                  slovenščini, angleščini in nemščini
                </span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
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

              {/* 60/72/88px to the next lead, the same rhythm as the caption → rule → lead before the e-katalog. */}
              <div className="mini-page-rail pb-15 pt-6 sm:pb-18 lg:pb-22">
                <p className={CAPTION}>
                  Rekonstrukcija uvodnega razdelka domače strani flexido.eu.
                </p>
              </div>
            </section>

            {/* 03 — FIRST PATH, by process: the /resitve hub (real content, static) */}
            <section aria-label="Dokaz: razdelek Področja na strani Rešitve">
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  Obiskovalec lahko začne pri delu proizvodnje, ki ga želi
                  urediti. Področja ga usmerijo do ustreznih rešitev.
                </p>
              </div>

              <div
                role="group"
                aria-label="Flexido: razdelek „Področja“ na strani Rešitve (rekonstrukcija)"
                className={`${PROOF_FRAME} ${AREAS_TRIM}`}
              >
                <FlexidoAreasProof />
              </div>

              {/* The one rule on the page: it separates the two paths. */}
              <div className={`mini-page-rail ${AFTER_DIVIDER}`}>
                <div className={`${DIVIDER} pt-6`}>
                  <p className={CAPTION}>
                    Rekonstrukcija razdelka „Področja“ na strani Rešitve.
                    Statičen prikaz: puščice v tem prikazu niso povezave.
                  </p>
                </div>
              </div>
            </section>

            {/* 04 — SECOND PATH, by product: the e-katalog hub /standardne-celice (excerpt, static) */}
            <section aria-label="Dokaz: razdelek Vrste sistemov v e-katalogu flexido.eu">
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  Kdor že išče določen sistem, lahko začne v e-katalogu in od
                  tam odpre podrobnosti izdelka.
                </p>
              </div>

              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div
                role="img"
                aria-label="Flexido: razdelek „Vrste sistemov“ v e-katalogu z naslovom „Izberite sistem glede na nalogo.“ in karticami sistemov FLEX 7 CNC Slim, FLEX 7 IMM Slim in FLEX 25 / 50, vsaka s fotografijo, opisom in napisom „Poglej sistem“"
                className={`${PROOF_FRAME} ${AREAS_TRIM}`}
              >
                <div aria-hidden="true">
                  <FlexidoCatalogProof />
                </div>
              </div>

              <div className="mini-page-rail pb-16 pt-6 sm:pb-20 lg:pb-24">
                <p className={CAPTION}>
                  Izsek razdelka „Vrste sistemov“ v e-katalogu flexido.eu.
                  Statičen prikaz: kartice v tem prikazu niso povezave.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /work, on the page's base surface. */}
          <CaseStudyNav current="flexido" />
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
