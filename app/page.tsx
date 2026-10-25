import type { Metadata } from "next";
import type { CSSProperties } from "react";

import MiniPalette from "./components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "./components/blocks/mini/MiniHeader";
import MiniHero from "./components/blocks/mini/MiniHero";
import { MINI_HERO } from "./components/blocks/mini/miniHomeCopy";
import MiniServicesList from "./components/blocks/mini/MiniServicesList";
import MiniSystemPocket from "./components/blocks/mini/MiniSystemPocket";
import MiniProjectPocket from "./components/blocks/mini/MiniProjectPocket";
import MiniSelectedWorkHome from "./components/blocks/mini/MiniSelectedWorkHome";
import MiniClosingBookend from "./components/blocks/mini/MiniClosingBookend";
import RightObjectAxisDebugGate from "@/components/home/debug/RightObjectAxisDebugGate";

/** Homepage-only typography foundation (scoped to `[data-home-typography]`, set below). */
import "./homeTypography.css";
/** Typography V1.1 + vertical rhythm, scoped to `[data-home-v11]` (set below). */
import "./homeTypographyV11.css";
import { homeMono } from "./homeMono";
/** Portrait-phone hero and "Kaj delamo" start, scoped to this page by `data-home-hero-mobile`. */
import "./homeHeroMobile.css";
import { isStaging } from "@/lib/siteEnv";

const isProduction = process.env.VERCEL_ENV === "production" && !isStaging;

/** Primary navigation: standalone pages, not homepage sections. Contact stays the header CTA. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

/**
 * Homepage surface tones (Surface Tone D, approved from /lab/surface-tone/d). Each section is wrapped in a
 * plain block that re-declares the surface custom property its component already reads, so the shared
 * `MiniPalette.css` tokens (still used by /mini, /en/mini, /work/* and legal pages) are not changed.
 * Services (with the "Celota" block) and Selected Work step up gently from the hero; Your Project settles
 * slightly below them. The header (`--mini-surface-header`) and the photographic Hero / Contact are not involved.
 */
const surface = (token: "--mini-surface-system" | "--mini-surface-work", value: string) =>
  ({ [token]: value }) as CSSProperties;
const SURFACE_SERVICES = surface("--mini-surface-work", "#0d1119");
const SURFACE_WORK = surface("--mini-surface-work", "#0f141c");
const SURFACE_PROJECT = surface("--mini-surface-system", "#0b0e15");

const TITLE = "Bauma — Spletne strani, ki pomagajo pridobivati stranke.";
const DESCRIPTION =
  "Od jasne strukture in vsebine do oblikovanja, razvoja in objave.";

/**
 * Launch indexing: `/` and `/en` only, and only on Vercel production.
 * Env gate: VERCEL_ENV === "production"
 *
 * `openGraph` and `twitter` replace the root layout's objects entirely, so the
 * unchanged fields (image, locale, site name) are repeated here.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Staging omits canonical/hreflang so it never advertises production URLs.
  ...(isStaging
    ? {}
    : {
        alternates: {
          canonical: "https://bauma.si",
          languages: {
            sl: "https://bauma.si",
            en: "https://bauma.si/en",
            "x-default": "https://bauma.si",
          },
        },
      }),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    ...(isStaging ? {} : { url: "https://bauma.si" }),
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
  robots: isProduction
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

/**
 * Royal Blue homepage: the approved `/mini` composition, SL only.
 * `/mini` stays as the reference. DecisionFlow and Approach are not part of this
 * flow, so the header drops its Approach item (`hideApproachNav`).
 *
 * The `data-home-typography` wrapper (a plain block, no layout effect; never `display: contents`, which Next.js skips as the scroll target) scopes the typography foundation in
 * `homeTypography.css` to this page, because the heading utilities and several components are shared with other routes.
 * The same wrapper carries the IBM Plex Mono font variable (`homeMono.ts`) used by the eyebrows.
 */
export default function Home() {
  return (
    <div data-home-typography data-home-v11 data-home-hero-mobile className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader treatAsHomepage darkHero hideApproachNav refined primaryNav={HOME_NAV} />

        <main>
          <MiniHero
            copy={MINI_HERO}
            secondaryHref="#kaj-delamo"
            secondaryLabel="Kaj delamo ↓"
            photoBackground
          />
          {/* One chapter on the Services surface: the services, then "Celota" (#system) as its closing thought. */}
          <div style={SURFACE_SERVICES}>
            <MiniServicesList joined />
            <MiniSystemPocket />
          </div>
          <div style={SURFACE_WORK}>
            <MiniSelectedWorkHome topRule={false} />
          </div>
          <div style={SURFACE_PROJECT}>
            <MiniProjectPocket />
          </div>
        </main>
        <MiniClosingBookend variant="graphite" photoBackground topRule={false} />
        {/* ?axis=1 only — module loads only when that query is present */}
        <RightObjectAxisDebugGate />
      </MiniPalette>
    </div>
  );
}
