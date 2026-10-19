import type { Metadata } from "next";
import type { CSSProperties } from "react";

import MiniPalette from "./components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "./components/blocks/mini/MiniHeader";
import MiniHero from "./components/blocks/mini/MiniHero";
import MiniSystemHome from "./components/blocks/mini/MiniSystemHome";
import { MINI_HERO } from "./components/blocks/mini/miniHomeCopy";
import MiniMidPageCta, {
  type MiniMidPageCtaCopy,
} from "./components/blocks/mini/MiniMidPageCta";
import MiniServicesHome from "./components/blocks/mini/MiniServicesHome";
import MiniSelectedWorkHome from "./components/blocks/mini/MiniSelectedWorkHome";
import MiniClosingBookend from "./components/blocks/mini/MiniClosingBookend";
import RightObjectAxisDebugGate from "@/components/home/debug/RightObjectAxisDebugGate";

/** Homepage-only typography foundation (scoped to `[data-home-typography]`, set below). */
import "./homeTypography.css";
import { homeMono } from "./homeMono";
import { isStaging } from "@/lib/siteEnv";

const isProduction = process.env.VERCEL_ENV === "production" && !isStaging;

/** Primary navigation: standalone pages, not homepage sections. Contact stays the header CTA. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/approach", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
];

/** "\n" in the headline is the component's existing forced break (keeps the two-line height). */
const MID_CTA_COPY: MiniMidPageCtaCopy = {
  eyebrow: "VAŠ PROJEKT",
  headline: "Kaj pa vaša\nspletna stran?",
  support: "Dobra ponudba potrebuje jasno predstavitev.",
  cta: "Pogovorimo se",
};

/**
 * Homepage surface tones (Surface Tone D, approved from /lab/surface-tone/d). Each section is wrapped in a
 * plain block that re-declares the surface custom property its component already reads, so the shared
 * `MiniPalette.css` tokens (still used by /mini, /en/mini, /work/* and legal pages) are not changed.
 * System is the darkest; Services and Selected Work step up gently; Your Project settles slightly below
 * them. The header (`--mini-surface-header`) and the photographic Hero / Contact are not involved.
 */
const surface = (token: "--mini-surface-system" | "--mini-surface-work", value: string) =>
  ({ [token]: value }) as CSSProperties;
const SURFACE_SYSTEM = surface("--mini-surface-system", "#080a0f");
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
    <div data-home-typography className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader treatAsHomepage darkHero hideApproachNav refined primaryNav={HOME_NAV} />

        <main>
          <MiniHero
            copy={MINI_HERO}
            secondaryHref="#system"
            secondaryLabel="Poglejte sistem"
            photoBackground
          />
          <div style={SURFACE_SYSTEM} data-home-section="system">
            <MiniSystemHome />
          </div>
          <div style={SURFACE_SERVICES}>
            <MiniServicesHome />
          </div>
          <div style={SURFACE_WORK}>
            <MiniSelectedWorkHome topRule={false} />
          </div>
          <div style={SURFACE_PROJECT} data-home-section="project">
            <MiniMidPageCta tone="neutral" copy={MID_CTA_COPY} cube="material" topRule={false} surface="system" />
          </div>
        </main>
        <MiniClosingBookend variant="graphite" photoBackground topRule={false} />
        {/* ?axis=1 only — module loads only when that query is present */}
        <RightObjectAxisDebugGate />
      </MiniPalette>
    </div>
  );
}
