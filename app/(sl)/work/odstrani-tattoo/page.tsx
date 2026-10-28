import type { Metadata } from "next";
import { slPageMetadata } from "@/lib/indexing";
import type { CSSProperties } from "react";

import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "@/app/components/blocks/mini/MiniHeader";
import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";
import CaseStudyNav from "@/app/components/work/CaseStudyNav";
import { homeMono } from "@/app/homeMono";
/** Scoped to the closing below only (`[data-home-typography]`), as on /work. */
import "@/app/homeTypography.css";
import OdstraniTattooProcessProof from "@/app/components/blocks/mini/OdstraniTattooProcessProof";
import OdstraniTattooResultsProof from "@/app/components/blocks/mini/OdstraniTattooResultsProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage.
import "@/app/components/blocks/mini/MiniSelectedWork.css";

const TITLE = "Odstrani Tattoo: stran, ki najprej razloži postopek — Bauma";
const DESCRIPTION =
  "Za Odstrani Tattoo smo zasnovali in razvili spletno stran za odstranjevanje tetovaž. Obiskovalca vodi od razlage postopka prek primerov do posveta.";

export const metadata: Metadata = slPageMetadata(
  "/work/odstrani-tattoo",
  { title: TITLE, description: DESCRIPTION },
);

/* Facts checked against the live odstranitattoo.si and the odstranitattoo-next source.
 * No metrics, research or brief are claimed. */

const SITE_URL = "https://odstranitattoo.si";

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#7c97f0)]";

/** Same primary navigation as `/` and `/work`. */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

/** The proofs sit on an elevated neutral graphite surface; the introduction stays on Base. */
const SURFACE_WORK = {
  "--mini-surface-work": "#161a21",
} as CSSProperties;

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";

const CAPTION =
  "mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/50";

/** Bauma's short explanation, as on /work/flexido and /work/dema-plus. */
const LEAD = "max-w-[40ch] text-xl font-medium leading-[1.4] tracking-[-0.01em] text-white/85 sm:text-2xl";

/** The one rule: it closes "Kako deluje" before the results (as on /work/flexido). */
const DIVIDER = "border-b border-white/10 pb-7 sm:pb-8 lg:pb-10";
const AFTER_DIVIDER = "pb-8 sm:pb-10 lg:pb-12";

export default function OdstraniTattooCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader
          refined
          primaryNav={HOME_NAV}
          contactHref="#contact"
          borderColor="#1e2530"
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
                odstranjevanje tetovaž. Obiskovalec, ki se sprašuje, ali je
                tetovažo mogoče odstraniti, najprej dobi razlago postopka.
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
            {/* 02 — PROOF: "Kako deluje", the real section, reconstructed */}
            <section
              aria-label="Dokaz: razdelek „Kako deluje“ na domači strani odstranitattoo.si"
              className="pt-8 sm:pt-10"
            >
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>Postopek je razložen brez obljube rezultata.</p>
              </div>

              <div className="px-5 sm:px-0">
                <div className="msw-proof">
                  <div className="msw-clip">
                    <OdstraniTattooProcessProof headingLevel={2} />
                  </div>
                </div>
              </div>

              {/* The one rule: it closes "Kako deluje" before the results (as on /work/flexido). */}
              <div className={`mini-page-rail ${AFTER_DIVIDER}`}>
                <div className={`${DIVIDER} pt-6`}>
                  <p className={CAPTION}>
                    Rekonstrukcija razdelka „Kako deluje“ z domače strani
                    odstranitattoo.si.
                  </p>
                </div>
              </div>
            </section>

            {/* 03 — PROOF: "Realni primeri odstranjevanja", excerpt (static) */}
            <section aria-label="Dokaz: razdelek „Realni primeri odstranjevanja“ na domači strani odstranitattoo.si">
              <div className="mini-page-rail pb-10 sm:pb-12">
                <p className={LEAD}>
                  Primeri pokažejo spremembo po določenem številu tretmajev. Ob
                  njih je pojasnjeno, da rezultat ni enak pri vseh tetovažah.
                </p>
              </div>

              {/* Nothing inside is interactive, so it is exposed as a single labelled image. */}
              <div className="px-5 sm:px-0">
                <div
                  role="img"
                  aria-label="Odstrani Tattoo: razdelek „Realni primeri odstranjevanja“ z enim parom fotografij pred in po: postopno bledenje tattooja po 3 tretmajih, ter opombo, da primeri niso obljuba enakega rezultata za vsak tattoo"
                  className="msw-proof"
                >
                  <div className="msw-clip">
                    <div aria-hidden="true">
                      <OdstraniTattooResultsProof />
                    </div>
                  </div>
                </div>
              </div>

              {/* 60/72/88px from the caption to the note on the way to a consultation, as between leads on /work/flexido. */}
              <div className="mini-page-rail pb-15 pt-6 sm:pb-18 lg:pb-22">
                <p className={CAPTION}>
                  Izsek razdelka „Realni primeri odstranjevanja“ z domače strani
                  odstranitattoo.si. Statičen prikaz.
                </p>
              </div>

              {/* 04 — The way to a consultation: Bauma's note only, no contact details or buttons. */}
              <div className="mini-page-rail pb-16 sm:pb-20 lg:pb-24">
                <p className={LEAD}>
                  Za posvet lahko obiskovalec pokliče ali po e-pošti pošlje
                  vprašanje in fotografijo tetovaže.
                </p>
              </div>
            </section>
          </div>

          {/* Previous / next case study and the way back to /work, on the page's base surface. */}
          <CaseStudyNav current="odstrani-tattoo" />
        </main>

        {/* The closing shared with /work: same copy, spacing and the /work type scope (Contact eyebrow, H2 tracking). */}
        <div data-home-typography className={homeMono.variable}>
          <MiniClosingBookend
            variant="graphite"
            photoBackground
            topRule={false}
            tone="natural-midnight"
            spacing="roomy"
          />
        </div>
      </div>
    </MiniPalette>
  );
}
