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
import DemaPlusHeroProof from "../../components/blocks/mini/DemaPlusHeroProof";
import DemaPlusReferencesProof from "../../components/blocks/mini/DemaPlusReferencesProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage.
import "../../components/blocks/mini/MiniSelectedWork.css";

const TITLE = "Dema Plus: najprej projekti, nato področja dela — Bauma";
const DESCRIPTION =
  "Dema Plus: domača stran se začne z arhitekturnim projektom, reference so pred področji dela. Primer iz prakse.";

/** `noindex` stays until the case studies launch. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    ...(isStaging ? {} : { url: "https://bauma.si/work/dema-plus" }),
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

/* Facts checked against the live demaplus.si and the demaplus-next source.
 * No metrics, dates or results are claimed. */

const SITE_URL = "https://demaplus.si/";

const FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

/** The two proofs share the Work surface of `/work` and the homepage Selected Work; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#0f141c",
} as CSSProperties;

const closingCopy: MiniFinalCtaCopy = {
  eyebrow: "NASLEDNJI KORAK",
  line1: "Najprej delo,",
  line2: "nato razlaga.",
  body: "Pri Dema Plus stran začnejo projekti, področja dela pa sledijo. Če imate izvedene projekte, ki jih je treba pokazati, jih lahko skupaj postavimo na začetek.",
  cta: "Pogovorimo se o projektu",
  mailto: MINI_CONTACT_MAILTO,
};

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/40";

/** Trims the References proof's own 48/40, 64/56 and 80/64px section padding (`.msw-clip > div`) to an even
 *  ~36px around the content below 1024 and ~48px from 1024, the same as the Ulterior proofs. Container widths, as in the proof. */
const REFERENCES_TRIM =
  "[--msw-trim-top:12px] [--msw-trim-bottom:4px] @min-[640px]:[--msw-trim-top:28px] @min-[640px]:[--msw-trim-bottom:20px] @min-[1024px]:[--msw-trim-top:32px] @min-[1024px]:[--msw-trim-bottom:16px]";

export default function DemaPlusCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          primaryNav={HOME_NAV}
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
                Projekti v ospredju.
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                Za Dema Plus smo zasnovali in razvili spletno stran, na kateri
                imajo prednost projekti in reference.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Struktura, oblikovanje in razvoj spletne strani</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  demaplus.si
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
            {/* 02 — MAIN PROOF: the opening screen (static copy of the real hero) */}
            <section
              aria-label="Dokaz: uvodni razdelek domače strani demaplus.si"
              className="pt-8 sm:pt-10"
            >
              {/* Nothing inside is interactive and the proof carries its own
                  title, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Dema Plus: uvodni razdelek domače strani s fotografijo objekta, naslovom „Gradimo. Po načrtu. Do izvedbe.“ in gumbom „Izbrani projekti“"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <DemaPlusHeroProof headingLevel={2} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-10 pt-6 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Rekonstrukcija uvodnega razdelka domače strani demaplus.si.
                </p>
              </div>
            </section>

            {/* 03 — REFERENCES: the Reference section (real content, static) */}
            <section aria-label="Dokaz: razdelek Reference na domači strani demaplus.si">
              {/* Holds a focusable, swipeable slider on mobile, so it is not hidden. */}
              <div className="px-5 sm:px-0">
                <div className="msw-proof">
                  <div
                    role="group"
                    aria-label="Dema Plus: razdelek «Reference» na domači strani"
                    className={`msw-clip ${REFERENCES_TRIM}`}
                  >
                    <div>
                      <DemaPlusReferencesProof showHeader={false} headingLevel={2} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-16 pt-6 sm:pb-20 lg:pb-24">
                <p className={CAPTION}>
                  Rekonstrukcija razdelka „Reference“ domače strani demaplus.si.
                </p>
              </div>
            </section>
          </div>
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
