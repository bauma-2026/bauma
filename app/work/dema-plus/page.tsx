import type { Metadata } from "next";
import { isStaging } from "@/lib/siteEnv";
import type { ReactNode } from "react";

import MiniPalette from "../../components/blocks/mini/MiniPalette";
import MiniHeader from "../../components/blocks/mini/MiniHeader";
import MiniClosingBookend from "../../components/blocks/mini/MiniClosingBookend";
import {
  MINI_CONTACT_MAILTO,
  type MiniFinalCtaCopy,
} from "../../components/blocks/mini/MiniFinalCTA";
import DemaPlusHeroProof from "../../components/blocks/mini/DemaPlusHeroProof";
import DemaPlusReferencesProof from "../../components/blocks/mini/DemaPlusReferencesProof";

// Proof width and clip (`.msw-proof` / `.msw-clip`): same rail logic as the homepage.
import "../../components/blocks/mini/MiniSelectedWork.css";

const TITLE = "Dema Plus: najprej projekti, nato področja dela — Bauma";
const DESCRIPTION =
  "Dema Plus: domača stran se začne z arhitekturnim projektom, reference so pred področji dela. Primer iz prakse.";

/** `noindex` stays until the case studies launch. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    ...(isStaging ? {} : { url: "https://bauma.si/work/dema-plus" }),
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

/* ---------------------------------------------------------------------------
 * Every fact below was checked against the live demaplus.si (which serves the
 * new Next.js site) and the local demaplus-next source (src/app/page.tsx,
 * src/components/home/*, src/content/home.ts, src/content/projects.generated.ts,
 * next.config.ts). No brief, metrics, dates or results are claimed, and the
 * reason for the order of the sections is not documented, so none is given.
 * Counts: 6 homepage projects, 46 in the reference index (= 46 detail routes),
 * 19 legacy redirect rules.
 * ------------------------------------------------------------------------- */

const SITE_URL = "https://demaplus.si/";

const FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

const FACTS: { label: string; value: ReactNode }[] = [
  {
    label: "Dejavnost",
    value: "Rekonstrukcije, novogradnje in inženiring",
  },
  {
    label: "Obseg dela",
    value: "Struktura, oblikovanje in razvoj spletne strani",
  },
  {
    label: "Reference",
    value: "46 projektov, vsak s svojo stranjo",
  },
  {
    label: "Spletna stran",
    value: (
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
      >
        demaplus.si
        <span aria-hidden="true"> ↗</span>
        <span className="sr-only"> (odpre se v novem zavihku)</span>
      </a>
    ),
  },
];

/** The 6 sections of the client homepage, in their real order. */
const PAGE_ORDER: { title: string; note: string; shown?: string }[] = [
  {
    title: "Gradimo. Po načrtu. Do izvedbe.",
    note: "Uvod: fotografija objekta in gumb „Izbrani projekti“",
    shown: "Prikazano zgoraj",
  },
  {
    title: "Projekti, ki govorijo namesto nas.",
    note: "Reference: šest izbranih projektov",
    shown: "Prikazano spodaj",
  },
  {
    title: "Rekonstrukcije, novogradnje in inženiring.",
    note: "Področja delovanja: tri področja",
  },
  {
    title: "Jasna struktura. Nadzor kakovosti. Predvidljiv potek.",
    note: "Fotografija in povezava na postopek",
  },
  {
    title: "Jasen potek od ogleda do predaje.",
    note: "Postopek: pet korakov",
  },
  {
    title: "Načrtujete projekt?",
    note: "Povezava na kontakt",
  },
];

const HOME_PROJECTS = [
  "Vila Rožna dolina",
  "Hotel Nox Ljubljana",
  "Hotel Cubo",
  "Vila Madeleine",
  "Vila Zlatica",
  "Švicarija",
];

const PORTFOLIO: { label: string; value: ReactNode }[] = [
  {
    label: "Domača stran",
    value: `Šest projektov, po vrsti: ${HOME_PROJECTS.join(", ")}.`,
  },
  {
    label: "Vse reference",
    value: "Stran Reference ima 46 projektov.",
  },
  {
    label: "Posamezen projekt",
    value: "Vsak ima svojo stran, na primer /reference/hotel-cubo.",
  },
  {
    label: "Namizje",
    value: "Kartice so v dveh stolpcih, od 1024 px v treh.",
  },
  {
    label: "Telefon",
    value:
      "Kartice se pomikajo vodoravno. Vsaka zavzame 86 % širine, zato je naslednja že delno vidna.",
  },
];

const IMPLEMENTATION: { title: string; text: string }[] = [
  {
    title: "Področja so kratka in brez podstrani",
    text: "Rekonstrukcije, novogradnje in inženiring so trije stolpci z enim stavkom. Področja nimajo lastnih strani: razdelek se konča z gumbom „Povpraševanje“, ki vodi na kontakt.",
  },
  {
    title: "Postopek ima dve postavitvi",
    text: "Pet korakov je na telefonu seznam, od 640 px v dveh stolpcih, od 1024 px v petih. Imena in besedila so v obeh enaka.",
  },
  {
    title: "Vsak projekt ima svojo stran",
    text: "Vseh 46 referenc ima naslov /reference/ime-projekta in svojo naslovno sliko, shranjeno skupaj s stranjo.",
  },
  {
    title: "Stari naslovi delujejo naprej",
    text: "Za stare naslove je 19 trajnih preusmeritev, na primer /pokopalisce-vic na stran projekta. Naslov z www vodi na demaplus.si.",
  },
];

const closingCopy: MiniFinalCtaCopy = {
  eyebrow: "NASLEDNJI KORAK",
  line1: "Najprej delo,",
  line2: "nato razlaga.",
  body: "Pri Dema Plus stran začnejo projekti, področja dela pa sledijo. Če imaš izvedene projekte, ki jih je treba pokazati, jih lahko postaviva na začetek.",
  cta: "Pogovoriva se o projektu",
  mailto: MINI_CONTACT_MAILTO,
};

/* --------------------------------- tokens -------------------------------- */

const HAIRLINE =
  "border-[color:var(--mini-border-subtle,color-mix(in_oklab,#fff_10%,transparent))]";
const SECTION_LINE =
  "border-[color:var(--mini-border-section,color-mix(in_oklab,#fff_10%,transparent))]";

const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-white/60";
const BODY = "text-base leading-[1.7] text-white/56 sm:text-lg sm:leading-[1.7]";
const ACCENT = "text-[color:var(--mini-accent-text,#7c97f0)]";

function SectionHeading({
  eyebrow,
  children,
  id,
}: {
  eyebrow: string;
  children: ReactNode;
  id: string;
}) {
  return (
    <>
      <p className={EYEBROW}>{eyebrow}</p>
      <h2
        id={id}
        className="home-bridge-heading mt-5 max-w-[22ch] text-balance sm:mt-6"
      >
        {children}
      </h2>
    </>
  );
}

export default function DemaPlusCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader hideApproachNav />

        <main>
          {/* 01 — INTRODUCTION: type only, then the facts of the project */}
          <section
            aria-labelledby="dp-hero"
            className="pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Dema Plus</p>

              <h1
                id="dp-hero"
                className="home-primary-heading mt-5 max-w-[20ch] text-balance sm:mt-6"
              >
                Kako smo domačo stran začeli s projekti, ne z obljubo.
              </h1>

              <p className="mt-6 max-w-[58ch] text-base leading-[1.65] text-white/58 sm:text-lg sm:leading-[1.7]">
                Dema Plus izvaja rekonstrukcije, novogradnje in inženiring.
                Domača stran se začne s fotografijo objekta. Prvi gumb vodi k
                izbranim referencam, tri področja dela pa sledijo šele za
                njimi.
              </p>

              <dl
                className={`mt-12 grid border-t ${HAIRLINE} sm:mt-14 sm:grid-cols-2 lg:grid-cols-4`}
              >
                {FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className={`border-b ${HAIRLINE} py-4 sm:pr-8 lg:border-b-0 lg:py-5`}
                  >
                    <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-white/75 sm:text-[15px]">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* 02 — FIRST PROOF: the opening screen (static copy of the real hero) */}
          <section
            aria-label="Dokaz: uvodni razdelek domače strani demaplus.si"
            className={`border-t ${SECTION_LINE} pt-12 sm:pt-16 lg:pt-20`}
          >
            {/* Nothing inside is interactive and the proof carries its own
                title, so it is exposed as a single labelled image. */}
            <div
              role="img"
              aria-label="Dema Plus: uvodni razdelek domače strani s fotografijo objekta, naslovom „Gradimo. Po načrtu. Do izvedbe.“ in gumbom „Izbrani projekti“"
              className="msw-proof"
            >
              <div className="msw-clip">
                <div aria-hidden="true">
                  <DemaPlusHeroProof headingLevel={3} />
                </div>
              </div>
            </div>

            <div className="mini-page-rail pb-12 pt-6 sm:pb-14 lg:pb-16">
              <p className="mx-auto max-w-[760px] text-balance text-center text-sm leading-relaxed text-white/40">
                Rekonstrukcija uvodnega razdelka Dema Plus z dejansko
                fotografijo Švicarije, tipografijo in pozivom do izbranih
                projektov.
              </p>
            </div>
          </section>

          {/* 03 — STRUCTURAL DECISION: the order of the page */}
          <section
            aria-labelledby="dp-order"
            className={`border-t ${SECTION_LINE} py-16 sm:py-20 lg:py-24`}
          >
            <div className="mini-page-rail grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <SectionHeading eyebrow="Strukturna odločitev" id="dp-order">
                  Najprej projekti. Nato področja dela.
                </SectionHeading>

                <div className={`mt-8 max-w-[46ch] space-y-5 ${BODY}`}>
                  <p>
                    Gumb v uvodu, „Izbrani projekti“, ne vodi na kontakt ali
                    storitve, ampak na razdelek Reference.
                  </p>
                  <p>
                    Reference so drugi razdelek strani, tri področja dela
                    tretji, postopek peti.
                  </p>
                </div>
              </div>

              <ol aria-label="Razdelki domače strani po vrstnem redu">
                {PAGE_ORDER.map((item, index) => (
                  <li
                    key={item.title}
                    className={`grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-t ${HAIRLINE} py-4 last:border-b sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:items-baseline`}
                  >
                    <span
                      className={`text-[13px] font-medium tabular-nums ${
                        item.shown ? ACCENT : "text-white/35"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] font-medium leading-6 text-white/88 sm:text-base">
                      {item.title}
                    </span>
                    <span
                      className={`col-start-2 text-sm leading-6 sm:col-start-3 sm:text-right ${
                        item.shown ? ACCENT : "text-white/45"
                      }`}
                    >
                      {item.shown ? `${item.shown}. ` : ""}
                      <span className={item.shown ? "text-white/45" : ""}>
                        {item.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 04 — SECOND PROOF: the Reference section */}
          <section
            aria-labelledby="dp-refs"
            className={`border-t ${SECTION_LINE} pt-16 sm:pt-20 lg:pt-24`}
          >
            <div className="mini-page-rail pb-8 sm:pb-10">
              <p id="dp-refs" className={EYEBROW}>
                Iz strani
              </p>
              <p className="mt-5 max-w-[58ch] text-base leading-7 text-white/55">
                Takoj za uvodom so reference. Prikazani so prvi projekti od
                šestih, v vrstnem redu z domače strani.
              </p>
            </div>

            {/* Holds a focusable, swipeable slider on mobile, so it is not hidden. */}
            <div className="msw-proof">
              <div
                role="group"
                aria-label="Dema Plus: razdelek «Reference» na domači strani"
                className="msw-clip"
              >
                <div>
                  <DemaPlusReferencesProof showHeader={false} headingLevel={3} />
                </div>
              </div>
            </div>

            <div className="mini-page-rail pb-16 pt-6 sm:pb-20 lg:pb-24">
              <p className="mx-auto max-w-[720px] text-center text-sm leading-relaxed text-white/40">
                Rekonstrukcija razdelka „Reference“ z domače strani demaplus.si:
                isti naslov, vrstni red, kartice in drsnik na telefonu. Slika
                Vile Rožna dolina je 3D vizualizacija, drugi dve sta
                fotografiji. Vrstice „Poglej projekt“ in „Vse reference“ so tu
                besedilo, tam so povezave.
              </p>
            </div>
          </section>

          {/* 05 — FROM SELECTED WORK TO THE FULL PORTFOLIO */}
          <section
            aria-labelledby="dp-portfolio"
            className={`border-t ${SECTION_LINE} py-16 sm:py-20 lg:py-24`}
          >
            <div className="mini-page-rail grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div>
                <SectionHeading eyebrow="Izbor in celota" id="dp-portfolio">
                  Šest izbranih projektov. Šestinštirideset referenc.
                </SectionHeading>
              </div>

              <dl>
                {PORTFOLIO.map((row) => (
                  <div
                    key={row.label}
                    className={`grid gap-1 border-t ${HAIRLINE} py-4 last:border-b sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6`}
                  >
                    <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40 sm:pt-1">
                      {row.label}
                    </dt>
                    <dd className="max-w-[52ch] text-[15px] leading-6 text-white/75">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* 06 — DELIVERY AND IMPLEMENTATION */}
          <section
            aria-labelledby="dp-impl"
            className={`border-t ${SECTION_LINE} py-16 sm:py-20 lg:py-24`}
          >
            <div className="mini-page-rail">
              <SectionHeading eyebrow="Izvedba" id="dp-impl">
                Štiri odločitve v kodi.
              </SectionHeading>

              <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
                {IMPLEMENTATION.map((item) => (
                  <div key={item.title} className={`border-t ${HAIRLINE} pt-5`}>
                    <h3 className="text-lg font-semibold tracking-[-0.01em] text-white/90">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[46ch] text-base leading-7 text-white/55">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* 07 — GRAPHITE CLOSING */}
        <MiniClosingBookend variant="graphite" ctaCopy={closingCopy} />
      </div>
    </MiniPalette>
  );
}
