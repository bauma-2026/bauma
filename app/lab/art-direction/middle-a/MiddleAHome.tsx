import type { CSSProperties } from "react";

import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "@/app/components/blocks/mini/MiniHeader";
import MiniHero from "@/app/components/blocks/mini/MiniHero";
import { MINI_HERO } from "@/app/components/blocks/mini/miniHomeCopy";
import MiniMidPageCta, {
  type MiniMidPageCtaCopy,
} from "@/app/components/blocks/mini/MiniMidPageCta";
import MiniSelectedWorkHome from "@/app/components/blocks/mini/MiniSelectedWorkHome";
import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";

import "@/app/homeTypography.css";
import "@/app/homeTypographyV11.css";
import { homeMono } from "@/app/homeMono";

import MiddleA from "./MiddleA";

/**
 * Lab only: the whole current homepage with System + Services replaced by `MiddleA`. Hero, Selected Work, the project CTA
 * and the contact are exactly as on `/` (the hero CTA label stays "Poglejte sistem"). Constants are copied from
 * `app/page.tsx` (not exported there); keep them in step.
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
const SURFACE_WORK = surface("--mini-surface-work", "#0f141c");
const SURFACE_PROJECT = surface("--mini-surface-system", "#0b0e15");
/** One dark surface for the whole middle (System's tone from the homepage). */
const MIDDLE_SURFACE: CSSProperties = { backgroundColor: "#080a0f" };

export default function MiddleAHome() {
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
          <div style={MIDDLE_SURFACE} data-amid-middle>
            <MiddleA />
          </div>
          <div style={SURFACE_WORK}>
            <MiniSelectedWorkHome topRule={false} />
          </div>
          <div style={SURFACE_PROJECT} data-home-section="project">
            <MiniMidPageCta tone="neutral" copy={MID_CTA_COPY} cube="material" topRule={false} surface="system" />
          </div>
        </main>
        <MiniClosingBookend variant="graphite" photoBackground topRule={false} />
      </MiniPalette>
    </div>
  );
}
