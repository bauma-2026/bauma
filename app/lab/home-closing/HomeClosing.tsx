import type { CSSProperties } from "react";

import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "@/app/components/blocks/mini/MiniHeader";
import MiniHero from "@/app/components/blocks/mini/MiniHero";
import MiniSystemHome from "@/app/components/blocks/mini/MiniSystemHome";
import { MINI_HERO } from "@/app/components/blocks/mini/miniHomeCopy";
import MiniMidPageCta, {
  type MiniMidPageCtaCopy,
} from "@/app/components/blocks/mini/MiniMidPageCta";
import MiniServicesGrid from "@/app/components/blocks/mini/MiniServicesGrid";
import MiniSelectedWorkHome from "@/app/components/blocks/mini/MiniSelectedWorkHome";
import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";

import "@/app/homeTypography.css";
import "@/app/homeTypographyV11.css";
import { homeMono } from "@/app/homeMono";

/**
 * Lab only: the whole homepage as `app/page.tsx` renders it (same components, wrappers and surface tokens), so
 * the two closing sequences can be judged in the full rhythm. `withProjectCta` is the only difference:
 *   true  — Selected Work -> project CTA cube -> photographic contact (current homepage)
 *   false — Selected Work -> photographic contact (the CTA block is not rendered, nothing replaces it)
 * Keep the constants below in step with `app/page.tsx`; they are copied, not imported, because that file does not export them.
 */

const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

const MID_CTA_COPY: MiniMidPageCtaCopy = {
  eyebrow: "VAŠ PROJEKT",
  headline: "Kaj pa vaša\nspletna stran?",
  support: "Dobra ponudba potrebuje jasno predstavitev.",
  cta: "Pogovorimo se",
};

const surface = (token: "--mini-surface-system" | "--mini-surface-work", value: string) =>
  ({ [token]: value }) as CSSProperties;
const SURFACE_SYSTEM = surface("--mini-surface-system", "#080a0f");
const SURFACE_SERVICES = surface("--mini-surface-work", "#0d1119");
const SURFACE_WORK = surface("--mini-surface-work", "#0f141c");
const SURFACE_PROJECT = surface("--mini-surface-system", "#0b0e15");

export default function HomeClosing({ withProjectCta }: { withProjectCta: boolean }) {
  return (
    <div data-home-typography data-home-v11 className={homeMono.variable}>
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
            <MiniServicesGrid />
          </div>
          <div style={SURFACE_WORK}>
            <MiniSelectedWorkHome topRule={false} />
          </div>
          {withProjectCta ? (
            <div style={SURFACE_PROJECT} data-home-section="project">
              <MiniMidPageCta tone="neutral" copy={MID_CTA_COPY} cube="material" topRule={false} surface="system" />
            </div>
          ) : null}
        </main>
        <MiniClosingBookend variant="graphite" photoBackground topRule={false} />
      </MiniPalette>
    </div>
  );
}
