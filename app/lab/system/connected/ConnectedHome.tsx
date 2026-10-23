import type { CSSProperties } from "react";

import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "@/app/components/blocks/mini/MiniHeader";
import MiniHero from "@/app/components/blocks/mini/MiniHero";
import { MINI_HERO } from "@/app/components/blocks/mini/miniHomeCopy";
import MiniServicesGrid from "@/app/components/blocks/mini/MiniServicesGrid";
import MiniSelectedWorkHome from "@/app/components/blocks/mini/MiniSelectedWorkHome";
import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";

import "@/app/homeTypography.css";
import "@/app/homeTypographyV11.css";
import { homeMono } from "@/app/homeMono";

import SystemConnected from "./SystemConnected";

/**
 * Lab only: the whole homepage as `app/page.tsx` renders it, ending in the reviewed "direct" closing (no project CTA
 * block, photographic contact straight after Selected Work). Differences from the homepage: the System section
 * (`SystemConnected`) and the hero's secondary CTA label, which targets the same `#system`.
 * Constants are copied from `app/page.tsx` (not exported there); keep them in step.
 */

const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

const surface = (token: "--mini-surface-system" | "--mini-surface-work", value: string) =>
  ({ [token]: value }) as CSSProperties;
const SURFACE_SYSTEM = surface("--mini-surface-system", "#080a0f");
const SURFACE_SERVICES = surface("--mini-surface-work", "#0d1119");
const SURFACE_WORK = surface("--mini-surface-work", "#0f141c");

export default function ConnectedHome() {
  return (
    <div data-home-typography data-home-v11 className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader treatAsHomepage darkHero hideApproachNav refined primaryNav={HOME_NAV} />

        <main>
          <MiniHero
            copy={MINI_HERO}
            secondaryHref="#system"
            secondaryLabel="Kako razmišljamo"
            photoBackground
          />
          <div style={SURFACE_SYSTEM} data-home-section="system">
            <SystemConnected />
          </div>
          <div style={SURFACE_SERVICES}>
            <MiniServicesGrid />
          </div>
          <div style={SURFACE_WORK}>
            <MiniSelectedWorkHome topRule={false} />
          </div>
        </main>
        <MiniClosingBookend variant="graphite" photoBackground topRule={false} />
      </MiniPalette>
    </div>
  );
}
