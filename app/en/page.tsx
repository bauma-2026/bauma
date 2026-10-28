import type { Metadata } from "next";
import type { CSSProperties } from "react";

import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniHeader from "@/app/components/blocks/mini/MiniHeader";
import MiniHero from "@/app/components/blocks/mini/MiniHero";
import MiniServicesList from "@/app/components/blocks/mini/MiniServicesList";
import MiniSystemPocket from "@/app/components/blocks/mini/MiniSystemPocket";
import MiniProjectPocket from "@/app/components/blocks/mini/MiniProjectPocket";
import MiniSelectedWorkHome from "@/app/components/blocks/mini/MiniSelectedWorkHome";
import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";
import { EN_FOOTER_COPY, EN_HEADER_COPY } from "@/app/components/blocks/mini/enChromeCopy";
import {
  EN_HOME_CONTACT,
  EN_HOME_HERO,
  EN_HOME_HERO_SECONDARY,
  EN_HOME_SERVICES,
  EN_HOME_START,
  EN_HOME_SYSTEM,
  EN_HOME_WORK,
  EN_HOME_WORK_HEADING,
} from "@/app/components/blocks/mini/enHomeCopy";
import RightObjectAxisDebugGate from "@/components/home/debug/RightObjectAxisDebugGate";

/** Homepage-only typography foundation (scoped to `[data-home-typography]`, set below). */
import "@/app/homeTypography.css";
/** Typography V1.1 + vertical rhythm, scoped to `[data-home-v11]` (set below). */
import "@/app/homeTypographyV11.css";
import { homeMono } from "@/app/homeMono";
/** Portrait-phone hero and "What we do" start, scoped to this page by `data-home-hero-mobile`. */
import "@/app/homeHeroMobile.css";
import { indexing, ogUrl } from "@/lib/indexing";
import { EN_PRIMARY_NAV } from "@/lib/i18n/routes";

/**
 * EN homepage — structural parity with locked `/`.
 * Route-owned indexing: overrides EN layout default noindex.
 * Only `/` and `/en` are indexable in production.
 */
/** The one hreflang pair: the home pages. SL subpages have no EN counterpart and are not linked to /en. */
const HREFLANG = {
  sl: "https://bauma.si",
  en: "https://bauma.si/en",
  "x-default": "https://bauma.si",
};

export const metadata: Metadata = {
  // Canonical and hreflang only in an explicit production build (`lib/indexing.ts`).
  ...indexing("/en", HREFLANG),
  openGraph: {
    ...ogUrl("/en"),
    siteName: "Bauma",
    images: [
      {
        url: "/og/bauma-og-en-v3.png",
        width: 1200,
        height: 630,
        alt: "Bauma — Clear structure. Better decisions.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

/**
 * Homepage surface tones, the same as `/` (Surface Tone D): see `app/(sl)/page.tsx`. Keep the two pages in step.
 */
const surface = (token: "--mini-surface-system" | "--mini-surface-work", value: string) =>
  ({ [token]: value }) as CSSProperties;
const SURFACE_SERVICES = surface("--mini-surface-work", "#0d1119");
const SURFACE_WORK = surface("--mini-surface-work", "#0f141c");
const SURFACE_PROJECT = surface("--mini-surface-system", "#0b0e15");

/**
 * The V3 home page in English: the composition, wrappers, surfaces and CSS of `/` (`app/(sl)/page.tsx`), with the
 * approved English copy (`enHomeCopy.ts`). Keep both files in step; only the copy and the language props differ.
 * The header lists live English pages only (none yet), so it shows the language switch and Contact. Selected Work and
 * "How we work together" link to the Slovenian pages with `hrefLang="sl"` until their English pages are live
 * (`localizedPath`); the clients' card artwork keeps its Slovenian headlines and says so (`artLang="sl"`).
 */
export default function EnglishHome() {
  return (
    <div data-home-typography data-home-v11 data-home-hero-mobile className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader
          treatAsHomepage
          darkHero
          hideApproachNav
          refined
          locale="en"
          copy={EN_HEADER_COPY}
          primaryNav={EN_PRIMARY_NAV}
        />

        <main>
          <MiniHero
            copy={EN_HOME_HERO}
            secondaryHref={EN_HOME_HERO_SECONDARY.href}
            secondaryLabel={EN_HOME_HERO_SECONDARY.label}
            photoBackground
          />
          {/* One chapter on the Services surface: the services, then "The bigger picture" (#system) as its closing thought. */}
          <div style={SURFACE_SERVICES}>
            <MiniServicesList joined copy={EN_HOME_SERVICES} />
            <MiniSystemPocket copy={EN_HOME_SYSTEM} />
          </div>
          <div style={SURFACE_WORK}>
            <MiniSelectedWorkHome
              topRule={false}
              lift
              heading={EN_HOME_WORK_HEADING}
              copy={EN_HOME_WORK}
              locale="en"
              artLang="sl"
            />
          </div>
          <div style={SURFACE_PROJECT}>
            <MiniProjectPocket copy={EN_HOME_START} locale="en" />
          </div>
        </main>
        <MiniClosingBookend
          variant="graphite"
          photoBackground
          topRule={false}
          ctaCopy={EN_HOME_CONTACT}
          footerCopy={EN_FOOTER_COPY}
        />
        {/* ?axis=1 only — module loads only when that query is present */}
        <RightObjectAxisDebugGate />
      </MiniPalette>
    </div>
  );
}
