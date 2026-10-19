import type { Metadata } from "next";
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
import OdstraniTattooProcessProof from "../../components/blocks/mini/OdstraniTattooProcessProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage.
import "../../components/blocks/mini/MiniSelectedWork.css";

export const metadata: Metadata = {
  title: "Odstrani Tattoo — Bauma case study",
  description:
    "Odstrani Tattoo: stran za odstranjevanje tetovaž, ki se začne z vprašanjem in konča s posvetom.",
  robots: {
    index: false,
    follow: false,
  },
};

/* Facts checked against the live odstranitattoo.si and the odstranitattoo-next source.
 * No metrics, research or brief are claimed. */

const SITE_URL = "https://odstranitattoo.si";

const FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/approach", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
];

/** The proof sits on an elevated neutral graphite surface; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#161a21",
} as CSSProperties;

const closingCopy: MiniFinalCtaCopy = {
  eyebrow: "NASLEDNJI KORAK",
  line1: "Obiskovalec ima vprašanje.",
  line2: "Stran naj začne z njim.",
  body: "Pri Odstrani Tattoo se stran začne z vprašanjem in konča s posvetom. Če ima tvoja storitev podobno pot do odločitve, jo lahko urediva skupaj.",
  cta: "Pogovoriva se o projektu",
  mailto: MINI_CONTACT_MAILTO,
};

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

export default function OdstraniTattooCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          primaryNav={HOME_NAV}
          contactHref="#contact"
          borderColor="#161a21"
        />

        <main>
          {/* 01 — INTRODUCTION: type only, on Base */}
          <section
            aria-labelledby="ot-hero"
            className="pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Odstrani Tattoo</p>

              <h1
                id="ot-hero"
                className="home-primary-heading mt-5 max-w-[20ch] sm:mt-6"
              >
                <span className="block">Najprej odgovor.</span>
                <span className="block">Potem odločitev.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
                Za Odstrani Tattoo smo zasnovali in razvili spletno stran za
                odstranjevanje tetovaž, ki obiskovalcu najprej razloži
                postopek.
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                <span>Struktura, oblikovanje in razvoj spletne strani</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
                >
                  odstranitattoo.si
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
            {/* 02 — PROOF: the real section, reconstructed */}
            <section
              aria-label="Dokaz: razdelek „Kako deluje“ na domači strani odstranitattoo.si"
              className="pt-8 sm:pt-10"
            >
              <div className="mini-page-rail pb-6 sm:pb-8">
                <p className="max-w-[48ch] text-base leading-7 text-white/60">
                  Postopek je razložen brez obljube rezultata, vsi pozivi pa
                  vodijo na posvet.
                </p>
              </div>

              <div className="msw-proof">
                <div className="msw-clip">
                  <OdstraniTattooProcessProof headingLevel={2} />
                </div>
              </div>

              <div className="mini-page-rail pb-16 pt-6 sm:pb-20 lg:pb-24">
                <p className="mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/40">
                  Rekonstrukcija razdelka „Kako deluje“ z domače strani
                  odstranitattoo.si.
                </p>
              </div>
            </section>
          </div>
        </main>

        <MiniClosingBookend
          variant="graphite"
          photoBackground
          topRule={false}
          ctaCopy={closingCopy}
        />
      </div>
    </MiniPalette>
  );
}
