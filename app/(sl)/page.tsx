import type { Metadata } from "next";
import type { CSSProperties } from "react";

import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "@/app/components/blocks/mini/MiniHeader";
import MiniHero from "@/app/components/blocks/mini/MiniHero";
import { MINI_HERO } from "@/app/components/blocks/mini/miniHomeCopy";
import MiniServicesList from "@/app/components/blocks/mini/MiniServicesList";
import MiniSystemPocket from "@/app/components/blocks/mini/MiniSystemPocket";
import MiniProjectPocket from "@/app/components/blocks/mini/MiniProjectPocket";
import MiniSelectedWorkHome from "@/app/components/blocks/mini/MiniSelectedWorkHome";
import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";
import RightObjectAxisDebugGate from "@/components/home/debug/RightObjectAxisDebugGate";

/** Homepage-only typography foundation (scoped to `[data-home-typography]`, set below). */
import "@/app/homeTypography.css";
/** Typography V1.1 + vertical rhythm, scoped to `[data-home-v11]` (set below). */
import "@/app/homeTypographyV11.css";
import { homeMono } from "@/app/homeMono";
/** Portrait-phone hero and "Kaj delamo" start, scoped to this page by `data-home-hero-mobile`. */
import "@/app/homeHeroMobile.css";
import { slPageMetadata } from "@/lib/indexing";

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

const TITLE = "Bauma — načrtovanje, oblikovanje in razvoj spletnih strani";
const DESCRIPTION =
  "Načrtovanje, oblikovanje in razvoj spletnih strani za podjetja. Od strukture in vsebine do izvedbe in objave — z jasnim namenom vsakega dela.";

/**
 * Metadata comes from `slPageMetadata` (lib/indexing.ts): indexing, canonical and hreflang follow `isIndexable`;
 * Open Graph and Twitter reuse this title and description and the Slovenian social image.
 */
/** The one hreflang pair: the home pages. SL subpages have no EN counterpart and are not linked to /en. */
const HREFLANG = {
  sl: "https://bauma.si",
  en: "https://bauma.si/en",
  "x-default": "https://bauma.si",
};

export const metadata: Metadata = slPageMetadata(
  "/",
  { title: TITLE, description: DESCRIPTION },
  HREFLANG,
);

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
            <MiniSelectedWorkHome topRule={false} lift />
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
