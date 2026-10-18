import type { Metadata } from "next";
import type { ReactNode } from "react";

import MiniPalette from "../../components/blocks/mini/MiniPalette";
import MiniHeader from "../../components/blocks/mini/MiniHeader";
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

/* ---------------------------------------------------------------------------
 * Every fact below was checked against the live odstranitattoo.si and the
 * odstranitattoo-next source. No metrics, research or brief are claimed.
 * ------------------------------------------------------------------------- */

const SITE_URL = "https://odstranitattoo.si";

const FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

const FACTS: { label: string; value: ReactNode }[] = [
  {
    label: "Storitev",
    value: "Lasersko odstranjevanje tetovaž in permanentnih obrvi",
  },
  { label: "Obseg dela", value: "Struktura, oblikovanje in razvoj spletne strani" },
  { label: "Obseg strani", value: "Domača stran in 8 podstrani" },
  {
    label: "Spletna stran",
    value: (
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
    ),
  },
];

/** The 11 sections of the client homepage, in their real order. */
const PAGE_ORDER: { title: string; note: string }[] = [
  { title: "Ali je vaš tattoo mogoče odstraniti?", note: "Uvod: vprašanje namesto ponudbe" },
  { title: "Kako deluje Pico laser odstranjevanje tattoojev", note: "Postopek v treh korakih" },
  { title: "Ali se tattoo lahko popolnoma odstrani?", note: "Omejitve in odvisnosti" },
  { title: "Zakaj tehnologija vpliva na rezultat", note: "Naprava in nadzor postopka" },
  { title: "Odstranjujemo tudi permanentne obrvi", note: "Sorodna storitev" },
  { title: "Vsak tattoo se odziva drugače", note: "Prvi poziv k posvetu" },
  { title: "Realni primeri odstranjevanja", note: "Pred in po, s številom tretmajev" },
  { title: "Odgovori na pogosta vprašanja", note: "11 vprašanj" },
  { title: "Odstranjevanje tetovaž v Domžalah", note: "Studio in lokacija" },
  { title: "Cenik odstranjevanja tattoojev", note: "Cene in okvir cene" },
  { title: "Imate vprašanje o odstranjevanju?", note: "Kontakt" },
];

/** Index (0-based) of the section reconstructed above. */
const PROOF_INDEX = 1;

const LIMITS: { where: string; quote: string }[] = [
  {
    where: "Uvod, namizje",
    quote: "Tattoo ne izgine čez noč.",
  },
  {
    where: "Razdelek 03",
    quote:
      "…vendar je potek odvisen od pigmenta, barve, globine, starosti tattooja in odziva kože.",
  },
  {
    where: "Rezultati",
    quote:
      "Primeri niso obljuba enakega rezultata za vsak tattoo, ampak realen prikaz napredka glede na pigment, globino nanosa in odziv kože.",
  },
  {
    where: "Cenik",
    quote:
      "Končna cena je odvisna od velikosti, pigmenta in zahtevnosti odstranjevanja.",
  },
];

const CONSULTATION: { label: string; value: string }[] = [
  {
    label: "Cilj",
    value:
      "Stran /posvet. Pozivi so v glavi, v razdelkih in na koncu domače strani.",
  },
  {
    label: "Kontakt",
    value: "Telefon in e-pošta; naslov studia. Brez obrazca in rezervacijskega sistema.",
  },
  {
    label: "Fotografija",
    value: "Tetovažo ali predel, ki obiskovalca zanima, lahko pošlje po e-pošti.",
  },
  {
    label: "Prvi stik",
    value:
      "Osnovne informacije, potek odstranjevanja, celjenje med tretmaji, naslednji korak.",
  },
  {
    label: "Posvet",
    value:
      "30 €, ob zakupu storitve brezplačen. Ista vrstica je na sedmih straneh.",
  },
  {
    label: "Mobilno",
    value:
      "V glavi je le gumb menija. Gumb „Posvet“ čez celo širino je v predalu pod povezavami.",
  },
];

const IMPLEMENTATION: { title: string; text: string }[] = [
  {
    title: "Eno besedilo, trije izpisi",
    text: "Pogosta vprašanja so v eni datoteki. Iz nje se izpišejo razdelek na domači strani, strukturirani podatki FAQPage in štirje odgovori pred prvim obiskom na /posvet.",
  },
  {
    title: "Postopek ima dve postavitvi",
    text: "Pod 1024 px so koraki oštevilčen seznam, nad tem trije stolpci. Besedilo se v obeh rahlo razlikuje.",
  },
  {
    title: "Mobilni uvod ni pomanjšan namizni",
    text: "Na telefonu sta nepremična fotografija naprave in krajše besedilo. Video, cena posveta in povezava na rezultate so le na namizju.",
  },
  {
    title: "Cene so na enem mestu",
    text: "Naslov /cenik preusmeri na razdelek Cenik na domači strani, zato cene ne obstajajo v dveh različicah.",
  },
];

const closingCopy: MiniFinalCtaCopy = {
  eyebrow: "NASLEDNJI KORAK",
  line1: "Obiskovalec ima vprašanje.",
  line2: "Stran naj začne z njim.",
  body: "Pri Odstrani Tattoo se stran začne z vprašanjem in konča s posvetom. Če ima tvoja storitev podobno pot do odločitve, jo lahko urediva skupaj.",
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

export default function OdstraniTattooCasePage() {
  return (
    <MiniPalette>
      <div className="bg-[var(--mini-surface-work,#080a0f)] text-white">
        <MiniHeader hideApproachNav />

        <main>
          {/* HERO — type only, then the facts of the project */}
          <section aria-labelledby="ot-hero" className="pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
            <div className="mini-page-rail">
              <p className={EYEBROW}>Case / Odstrani Tattoo</p>

              <h1
                id="ot-hero"
                className="home-primary-heading mt-5 max-w-[20ch] text-balance sm:mt-6"
              >
                Kako smo stran za odstranjevanje tetovaž začeli z vprašanjem, ne s ponudbo.
              </h1>

              <p className="mt-6 max-w-[58ch] text-base leading-[1.65] text-white/58 sm:text-lg sm:leading-[1.7]">
                Odstrani Tattoo, del studia Artbite Tattoo, v Domžalah s Pico
                laserjem odstranjuje tetovaže in permanentne obrvi. Rezultat ni
                takojšen in je odvisen od vsakega primera, zato stran ne more
                začeti s ponudbo. Najprej odgovori, ali je odstranitev mogoča,
                nato pove, kako poteka, koliko stane in kam poslati
                povpraševanje.
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

          {/* PROOF — the real section, reconstructed in full */}
          <section
            aria-labelledby="ot-proof"
            className={`border-t ${SECTION_LINE} pt-16 sm:pt-20 lg:pt-24`}
          >
            <div className="mini-page-rail pb-8 sm:pb-10">
              <SectionHeading eyebrow="Iz strani" id="ot-proof">
                Razlaga postopka je takoj za uvodom.
              </SectionHeading>
              <p className="mt-5 max-w-[56ch] text-base leading-7 text-white/55">
                Prvi odgovor po vprašanju iz uvoda: kaj se zgodi s tattoojem in
                zakaj je potrebnih več obiskov.
              </p>
            </div>

            <div className="msw-proof">
              <div className="msw-clip">
                <OdstraniTattooProcessProof headingLevel={3} />
              </div>
            </div>

            <div className="mini-page-rail pb-16 pt-6 sm:pb-20 lg:pb-24">
              <p className="mx-auto max-w-[720px] text-center text-sm leading-relaxed text-white/40">
                Ni posnetek zaslona, temveč rekonstrukcija razdelka „Kako
                deluje“ z domače strani odstranitattoo.si: ista postavitev,
                besedilo, tipografija in fotografija.
              </p>
            </div>
          </section>

          {/* STRUCTURAL DECISION — the order of the page */}
          <section
            aria-labelledby="ot-order"
            className={`border-t ${SECTION_LINE} py-16 sm:py-20 lg:py-24`}
          >
            <div className="mini-page-rail grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <SectionHeading eyebrow="Strukturna odločitev" id="ot-order">
                  Postopek je na drugem mestu, cenik na desetem.
                </SectionHeading>

                <div className={`mt-8 max-w-[46ch] space-y-5 ${BODY}`}>
                  <p>
                    Stran se začne z vprašanjem, takoj zatem razloži postopek.
                    Omejitve in rezultati pridejo pred cenikom, kontakt je
                    zadnji.
                  </p>
                  <p>
                    Na namizju uvod vsebuje samo ceno posveta. Cene storitev so
                    v desetem razdelku od enajstih, ko je postopek že razložen.
                  </p>
                </div>
              </div>

              <ol aria-label="Razdelki domače strani po vrstnem redu">
                {PAGE_ORDER.map((item, index) => {
                  const isProof = index === PROOF_INDEX;
                  return (
                    <li
                      key={item.title}
                      className={`grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-t ${HAIRLINE} py-4 last:border-b sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:items-baseline`}
                    >
                      <span
                        className={`text-[13px] font-medium tabular-nums ${
                          isProof
                            ? "text-[color:var(--mini-accent-text,#7c97f0)]"
                            : "text-white/35"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] font-medium leading-6 text-white/88 sm:text-base">
                        {item.title}
                      </span>
                      <span
                        className={`col-start-2 text-sm leading-6 sm:col-start-3 sm:text-right ${
                          isProof
                            ? "text-[color:var(--mini-accent-text,#7c97f0)]"
                            : "text-white/45"
                        }`}
                      >
                        {isProof ? "Prikazano zgoraj" : item.note}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          {/* LIMITS — the wording */}
          <section
            aria-labelledby="ot-limits"
            className={`border-t ${SECTION_LINE} py-16 sm:py-20 lg:py-24`}
          >
            <div className="mini-page-rail">
              <SectionHeading eyebrow="Besedilo" id="ot-limits">
                Štiri mesta, kjer stran omeji obljubo z besedami.
              </SectionHeading>

              <p className="mt-6 max-w-[56ch] text-base leading-7 text-white/55">
                Pri storitvi, kjer rezultat ni enak za vsak primer, je
                besedilo del zasnove. Navedki so dobesedni.
              </p>

              <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
                {LIMITS.map((item) => (
                  <figure
                    key={item.where}
                    className={`border-t ${HAIRLINE} pt-5`}
                  >
                    <figcaption className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
                      {item.where}
                    </figcaption>
                    <blockquote className="mt-4 max-w-[40ch] text-lg font-medium leading-[1.4] tracking-[-0.01em] text-white/85 sm:text-xl">
                      „{item.quote}“
                    </blockquote>
                  </figure>
                ))}
              </div>

              <p className="mt-12 max-w-[62ch] text-sm leading-6 text-white/45">
                Ob vsakem primeru pred in po je zapisano število tretmajev (po
                1, 3 in 5). Vprašanja o popolni odstranitvi stran v pogostih
                vprašanjih ne ponavlja, ker nanj že odgovarja razdelek 03.
              </p>
            </div>
          </section>

          {/* PATH TO CONSULTATION */}
          <section
            aria-labelledby="ot-consult"
            className={`border-t ${SECTION_LINE} py-16 sm:py-20 lg:py-24`}
          >
            <div className="mini-page-rail grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div>
                <SectionHeading eyebrow="Pot do posveta" id="ot-consult">
                  Vsi pozivi vodijo na eno stran.
                </SectionHeading>

                <div className={`mt-8 max-w-[46ch] space-y-5 ${BODY}`}>
                  <p>
                    Povpraševanje je stik po telefonu ali e-pošti, ne obrazec.
                    Stran /posvet ne zbira podatkov, ampak pove, kaj
                    obiskovalec dobi pri prvem stiku.
                  </p>
                </div>
              </div>

              <dl>
                {CONSULTATION.map((row) => (
                  <div
                    key={row.label}
                    className={`grid gap-1 border-t ${HAIRLINE} py-4 last:border-b sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-6`}
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

          {/* IMPLEMENTATION */}
          <section
            aria-labelledby="ot-impl"
            className={`border-t ${SECTION_LINE} py-16 sm:py-20 lg:py-24`}
          >
            <div className="mini-page-rail">
              <SectionHeading eyebrow="Izvedba" id="ot-impl">
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

        <MiniClosingBookend variant="graphite" ctaCopy={closingCopy} />
      </div>
    </MiniPalette>
  );
}
