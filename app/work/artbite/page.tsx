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
import ArtBiteHeroProof from "../../components/blocks/mini/ArtBiteHeroProof";
import ArtBiteGalleryProof from "../../components/blocks/mini/ArtBiteGalleryProof";
import ArtBiteCoverupProof from "../../components/blocks/mini/ArtBiteCoverupProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage and the other case studies.
import "../../components/blocks/mini/MiniSelectedWork.css";

const TITLE = "ArtBite: osebni pristop, jasna predstavitev — Bauma";
const DESCRIPTION =
  "ArtBite: spletna stran tattoo studia, na kateri imajo glavno vlogo fotografije del in osebni pristop. Primer iz prakse.";

/** `noindex` stays until the case studies launch. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    ...(isStaging ? {} : { url: "https://bauma.si/work/artbite" }),
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

/* Facts checked against the live artbite-tattoo.com and the artbite-next source
 * (footer credit: "Struktura in izvedba: Bauma"). No metrics, dates or results
 * are claimed. */

const SITE_URL = "https://artbite-tattoo.com/";

const FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

/** ArtBite's elevated surface (`--color-bg-elevated`) behind the proofs: a gentle step up from Bauma's Base; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#1f1712",
} as CSSProperties;

const closingCopy: MiniFinalCtaCopy = {
  eyebrow: "NASLEDNJI KORAK",
  line1: "Delo naj govori samo,",
  line2: "pristop naj vodi.",
  body: "Pri ArtBite stran najprej pokaže fotografije del in osebni pristop studia. Če imate delo, ki ga želite predstaviti, ga lahko skupaj postavimo v ospredje.",
  cta: "Pogovorimo se o projektu",
  mailto: MINI_CONTACT_MAILTO,
};

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/40";

export default function ArtBiteCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          primaryNav={HOME_NAV}
          contactHref="#contact"
          borderColor="#2b221c"
        />

        <main>
          {/* 01 — INTRODUCTION: type only, on Base */}
          <section
            aria-labelledby="ab-hero"
            className="pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / ArtBite</p>

              <h1 id="ab-hero" className="home-primary-heading mt-5 sm:mt-6">
                <span className="block">Osebni pristop.</span>
                <span className="block">Jasna predstavitev.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                Za ArtBite smo zasnovali in razvili spletno stran tattoo studia,
                na kateri imajo glavno vlogo fotografije del in osebni pristop.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Struktura, oblikovanje in razvoj spletne strani</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  artbite-tattoo.com
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
            {/* 02 — HOMEPAGE: the hero (static) */}
            <section
              aria-label="Dokaz: uvodni razdelek domače strani artbite-tattoo.com"
              className="pt-8 sm:pt-10"
            >
              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="ArtBite: uvodni razdelek domače strani z napisom „Tetovaže z osebnim pristopom.“ in fotografijami tetovaž"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <ArtBiteHeroProof />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-10 pt-5 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Rekonstrukcija uvodnega razdelka domače strani
                  artbite-tattoo.com.
                </p>
              </div>
            </section>

            {/* 03 — GALLERY: a selection from /tatuji, directly on the surface */}
            <section
              aria-label="Dokaz: izbor iz galerije Tatuji na artbite-tattoo.com"
              className="pt-4 lg:pt-2"
            >
              <ArtBiteGalleryProof />

              <div className="mini-page-rail pb-10 pt-8 sm:pb-12 lg:pb-14">
                <p className={CAPTION}>
                  Rekonstrukcija izbora iz galerije Tatuji na
                  artbite-tattoo.com.
                </p>
              </div>
            </section>

            {/* 04 — COVER-UP: the hero of "Prekrivanje starih tetovaž" (static) */}
            <section
              aria-label="Dokaz: uvodni razdelek strani Prekrivanje starih tetovaž na artbite-tattoo.com"
              className="pt-0"
            >
              {/* Nothing inside is interactive, so it is exposed as a single labelled image.
                  Edge to edge below sm (no gutters, no radius): the photographic slices need the full width. */}
              <div>
                <div
                  role="img"
                  aria-label="ArtBite: uvodni razdelek strani „Prekrivanje starih tetovaž“ z naslovom, povabilom k pošiljanju fotografije in fotografijo v ozkih navpičnih odsekih"
                  className="msw-proof msw-proof--bleed"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <ArtBiteCoverupProof />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-page-rail pb-16 pt-5 sm:pb-20 lg:pb-24">
                <p className={CAPTION}>
                  Rekonstrukcija uvodnega razdelka strani „Prekrivanje starih
                  tetovaž“ na artbite-tattoo.com.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /work, on the page's base surface. */}
          <CaseStudyNav current="artbite" />
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
