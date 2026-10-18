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
import FlexidoAreasProof from "../../components/blocks/mini/FlexidoAreasProof";
import FlexidoHomeProof from "../../components/blocks/mini/FlexidoHomeProof";

const TITLE = "Flexido: dve poti v industrijsko ponudbo — Bauma";
const DESCRIPTION =
  "Flexido: ponudba industrijske avtomatizacije ima dva vstopa, po proizvodnem problemu in po standardnem sistemu. Primer iz prakse.";

/** `noindex` stays until the case studies launch. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    ...(isStaging ? {} : { url: "https://bauma.si/work/flexido" }),
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
 * Facts checked against the live flexido.eu and the flexido-next source
 * (src/content/home, solutions, systems; src/components/layout/Header.tsx;
 * src/data/flexido-systems.ts). No metrics, before/after or results are claimed.
 * ------------------------------------------------------------------------- */

const SITE_URL = "https://www.flexido.eu/";

const FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

const FACTS: { label: string; value: ReactNode }[] = [
  { label: "Dejavnost", value: "Avtomatizacija proizvodnje" },
  {
    label: "Obseg dela",
    value: "Struktura, oblikovanje in razvoj spletne strani",
  },
  { label: "Jeziki", value: "Slovenščina, angleščina, nemščina" },
  {
    label: "Spletna stran",
    value: (
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-white/85 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/50 ${FOCUS}`}
      >
        flexido.eu
        <span aria-hidden="true"> ↗</span>
        <span className="sr-only"> (odpre se v novem zavihku)</span>
      </a>
    ),
  },
];

type PathRow = { label: string; value: ReactNode };

/** One example thread (CNC) is followed through both paths, so the rows compare. */
const PATH_A: PathRow[] = [
  { label: "Vstop v glavi", value: "„Rešitve“" },
  {
    label: "Prva stran",
    value: "„Kje se vaš proces ustavlja?“ in sedem področij",
  },
  { label: "Izbira", value: "Področje, na primer „CNC stroji“" },
  {
    label: "Stran znotraj",
    value:
      "Začne z opisom situacije („Avtomatizacija se začne okoli obdelave.“), nadaljuje z izbiro med standardno in namensko rešitvijo",
  },
  {
    label: "Povezave",
    value: "Na izdelek FLEX 7 CNC Slim in na referenco",
  },
  {
    label: "Konec",
    value: "„Poglejmo vaš CNC proces.“ in povezava na e-pošto",
  },
];

const PATH_B: PathRow[] = [
  {
    label: "Vstop v glavi",
    value: "„E-katalog“, v spustnem meniju „Standardne celice“",
  },
  {
    label: "Prva stran",
    value: "„Standardni sistemi za avtomatizacijo“ in pet sistemov",
  },
  { label: "Izbira", value: "Sistem, na primer „FLEX 7 CNC Slim“" },
  {
    label: "Stran znotraj",
    value:
      "Tehnična tabela (dimenzije 1660 × 720 mm, nosilnost 7 / 10 kg, doseg 911 / 1202 mm), dodatne postaje in dokumentirane izvedbe",
  },
  {
    label: "Povezave",
    value: "Nazaj na področje („Ko CNC zahteva več kot eno celico“) in na referenco",
  },
  {
    label: "Konec",
    value:
      "„Je CNC celica prava rešitev za vaš proces?“ in povezava na e-pošto",
  },
];

const IMPLEMENTATION: { title: string; text: string }[] = [
  {
    title: "En seznam področij",
    text: "Sedem področij je zapisanih v vsebini strani Rešitve. Iz istega vira se izpiše tudi vrstica v uvodu domače strani, zato imata enaka imena in enak vrstni red.",
  },
  {
    title: "Stran za vsako področje",
    text: "Vseh sedem področij ima svojo stran z lastno vsebino. Vsaka se začne z opisom proizvodne situacije in konča s korakom za ta proces.",
  },
  {
    title: "Trije jeziki",
    text: "Slovenščina, angleščina in nemščina imajo isto zgradbo, prevedena imena področij in lastne naslove, na primer /resitve, /en/solutions in /de/loesungen.",
  },
];

const closingCopy: MiniFinalCtaCopy = {
  eyebrow: "NASLEDNJI KORAK",
  line1: "Nekdo išče rešitev za problem,",
  line2: "drugi že pozna izdelek.",
  body: "Pri Flexidu stran podpira oba vstopa in ju poveže. Če ima tvoja ponudba več vstopov, jih lahko urediva skupaj.",
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

/** Same rail as the homepage Flexido proof: edge to edge below sm, then 1216px with a small clip radius. */
const PROOF_FRAME =
  "mx-auto w-full isolate overflow-hidden rounded-none sm:w-[calc(100%-3rem)] sm:max-w-[1216px] sm:rounded-[8px] md:w-[calc(100%-4rem)]";

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

const PATH_ROWS: { label: string; a: ReactNode; b: ReactNode }[] = PATH_A.map(
  (row, index) => ({ label: row.label, a: row.value, b: PATH_B[index].value }),
);

const CELL_LABEL =
  "before:mb-2 before:block before:text-[11px] before:font-medium before:uppercase before:tracking-[0.22em] before:text-[color:var(--mini-accent-text,#7c97f0)] before:content-[attr(data-label)] md:before:hidden";

function PathTable() {
  return (
    <table className="mt-12 block w-full border-collapse text-left md:table lg:mt-14">
      <caption className="sr-only">
        Primerjava poti A (po problemu) in poti B (po izdelku), korak za
        korakom, na primeru CNC
      </caption>

      <thead className="hidden md:table-header-group">
        <tr>
          <td className="w-[7.5rem] lg:w-[9rem]" />
          <th scope="col" className="pb-8 pr-8 align-top font-normal lg:pr-14">
            <span
              className={`block text-[11px] font-medium uppercase tracking-[0.22em] ${ACCENT}`}
            >
              Pot A
            </span>
            <span className="mt-3 block text-[1.7rem] font-semibold tracking-[-0.02em] text-white/92">
              Po problemu
            </span>
            <span className="mt-2 block max-w-[34ch] text-base leading-7 text-white/55">
              Rešitve: sedem področij avtomatizacije.
            </span>
          </th>
          <th
            scope="col"
            className={`border-l ${HAIRLINE} pb-8 pl-8 align-top font-normal lg:pl-14`}
          >
            <span
              className={`block text-[11px] font-medium uppercase tracking-[0.22em] ${ACCENT}`}
            >
              Pot B
            </span>
            <span className="mt-3 block text-[1.7rem] font-semibold tracking-[-0.02em] text-white/92">
              Po izdelku
            </span>
            <span className="mt-2 block max-w-[34ch] text-base leading-7 text-white/55">
              Standardne celice: pet standardnih sistemov.
            </span>
          </th>
        </tr>
      </thead>

      <tbody className="block md:table-row-group">
        {PATH_ROWS.map((row) => (
          <tr
            key={row.label}
            className={`block border-t ${HAIRLINE} py-5 last:border-b md:table-row md:py-0`}
          >
            <th
              scope="row"
              className="mb-3 block text-[11px] font-medium uppercase tracking-[0.22em] text-white/40 md:mb-0 md:table-cell md:py-4 md:pr-4 md:align-top md:pt-[1.15rem]"
            >
              {row.label}
            </th>
            <td
              data-label="Pot A · po problemu"
              className={`block text-[15px] leading-6 text-white/78 md:table-cell md:py-4 md:pr-8 md:align-top lg:pr-14 ${CELL_LABEL}`}
            >
              {row.a}
            </td>
            <td
              data-label="Pot B · po izdelku"
              className={`mt-4 block text-[15px] leading-6 text-white/78 md:mt-0 md:table-cell md:border-l ${HAIRLINE} md:py-4 md:pl-8 md:align-top lg:pl-14 ${CELL_LABEL}`}
            >
              {row.b}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function FlexidoCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader hideApproachNav />

        <main>
          {/* 01 — HERO: type only, then the facts of the project */}
          <section
            aria-labelledby="fx-hero"
            className="pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Flexido</p>

              <h1
                id="fx-hero"
                className="home-primary-heading mt-5 max-w-[22ch] text-balance sm:mt-6"
              >
                Kako smo kompleksno industrijsko ponudbo uredili v jasnejšo pot
                odločanja.
              </h1>

              <p className="mt-6 max-w-[58ch] text-base leading-[1.65] text-white/58 sm:text-lg sm:leading-[1.7]">
                Flexido izdeluje standardne robotske celice in sisteme po
                naročilu za CNC stroje, brizganje plastike in povezane
                proizvodne procese. Stran ima zato dva vstopa: po
                proizvodnem problemu in po izdelku.
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

          {/* 02 — FIRST PROOF: homepage (decorative: static copy of the real hero) */}
          <section
            aria-label="Dokaz: uvodni razdelek domače strani flexido.eu"
            className={`border-t ${SECTION_LINE} pt-12 sm:pt-16 lg:pt-20`}
          >
            {/* Nothing inside is interactive and the proof ships its own <h1>,
                so it is exposed to assistive tech as a single labelled image. */}
            <div
              role="img"
              aria-label="Flexido: uvodni razdelek domače strani z naslovom „Povežemo tok med stroji. Ne samo robot ob stroju.“ in vrstico sedmih področij"
              className={PROOF_FRAME}
            >
              <div aria-hidden="true">
                <FlexidoHomeProof closingSeparator={false} />
              </div>
            </div>

            <div className="mini-page-rail pb-12 pt-6 sm:pb-14 lg:pb-16">
              <p className="mx-auto max-w-[760px] text-center text-sm leading-relaxed text-white/40">
                Rekonstrukcija uvodnega razdelka Flexidove spletne strani z
                dejanskim videom in vsebino, prilagojena predstavitvi projekta.
              </p>
            </div>
          </section>

          {/* 03 — STRUCTURAL DECISION: two paths */}
          <section
            aria-labelledby="fx-paths"
            className={`border-t ${SECTION_LINE} py-16 sm:py-20 lg:py-24`}
          >
            <div className="mini-page-rail">
              <SectionHeading eyebrow="Strukturna odločitev" id="fx-paths">
                Dve poti v isto ponudbo.
              </SectionHeading>

              <div className={`mt-8 max-w-[52ch] space-y-5 ${BODY}`}>
                <p>
                  Ponudbo je mogoče iskati na dva načina. Kdor ve, kje
                  proizvodnja zastaja, začne pri področju. Kdor pozna izdelek,
                  začne pri standardnem sistemu. Glava strani ima za vsako pot
                  svojo povezavo.
                </p>
              </div>

              <PathTable />

              <p className="mt-12 max-w-[66ch] text-sm leading-6 text-white/45">
                Poti se povezujeta: stran izdelka ima povezavo nazaj na
                področje, stran področja pa lahko vodi do izdelka. Obe se
                končata pri istem stiku po e-pošti. Tudi domača stran ponuja
                obe poti: vrstico področij v uvodu in razdelek „Sistemi“ z
                dvema izdelkoma.
              </p>
            </div>
          </section>

          {/* 04 — SECOND PROOF: the /resitve hub (real content, static) */}
          <section
            aria-label="Dokaz: razdelek Področja na strani Rešitve"
            className={`border-t ${SECTION_LINE} pt-16 sm:pt-20 lg:pt-24`}
          >
            <div className="mini-page-rail pb-8 sm:pb-10">
              <p className={EYEBROW}>Pot A, na strani Rešitve</p>
              <p className="mt-5 max-w-[58ch] text-base leading-7 text-white/55">
                Isti seznam sedmih področij poganja tudi vrstico v uvodu domače
                strani, zato sta vstopa po imenih in vrstnem redu enaka.
              </p>
            </div>

            <div
              role="group"
              aria-label="Flexido: razdelek „Področja“ na strani Rešitve (rekonstrukcija)"
              className={PROOF_FRAME}
            >
              <FlexidoAreasProof />
            </div>

            <div className="mini-page-rail pb-16 pt-6 sm:pb-20 lg:pb-24">
              <p className="mx-auto max-w-[720px] text-center text-sm leading-relaxed text-white/40">
                Ni posnetek zaslona, temveč rekonstrukcija razdelka „Področja“
                na strani Rešitve. Besedilo in vrstni red sta na živi strani
                enaka, vrstice pa so tu statične, tam so povezave na posamezna
                področja.
              </p>
            </div>
          </section>

          {/* 05 — IMPLEMENTATION AND CONTACT PATH */}
          <section
            aria-labelledby="fx-impl"
            className={`border-t ${SECTION_LINE} py-16 sm:py-20 lg:py-24`}
          >
            <div className="mini-page-rail">
              <SectionHeading eyebrow="Izvedba" id="fx-impl">
                Ista vsebina na več mestih.
              </SectionHeading>

              <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-3">
                {IMPLEMENTATION.map((item) => (
                  <div key={item.title} className={`border-t ${HAIRLINE} pt-5`}>
                    <h3 className="text-lg font-semibold tracking-[-0.01em] text-white/90">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[42ch] text-base leading-7 text-white/55">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className={`mt-14 grid gap-x-12 gap-y-4 border-t ${HAIRLINE} pt-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16`}
              >
                <p className={EYEBROW}>Naslednji korak obiskovalca</p>
                <div>
                  <p className="max-w-[40ch] text-lg font-medium leading-[1.4] tracking-[-0.01em] text-white/85 sm:text-xl">
                    „Pošljite kratek opis procesa, stroja in kosa.“
                  </p>
                  <p className="mt-4 max-w-[58ch] text-[15px] leading-6 text-white/55">
                    Tako se konča domača stran. Strani področij in sistemov
                    se končajo z istim stikom: povpraševanje je e-pošta na
                    naslov podjetja, ne obrazec in ne spletna rezervacija.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <MiniClosingBookend variant="graphite" ctaCopy={closingCopy} />
      </div>
    </MiniPalette>
  );
}
