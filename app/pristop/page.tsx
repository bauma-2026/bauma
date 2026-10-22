import type { Metadata } from "next";

import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";
import {
  MINI_CONTACT_MAILTO,
  type MiniFinalCtaCopy,
} from "@/app/components/blocks/mini/MiniFinalCTA";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "@/app/components/blocks/mini/MiniHeader";
import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import { homeMono } from "@/app/homeMono";
import "@/app/homeTypography.css";

import "./PristopPage.css";

export const metadata: Metadata = {
  title: "Pristop — Bauma",
  robots: { index: false, follow: false },
};

/** Primary nav: Pristop is this page, Work is /work. */
const NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

const STEPS = [
  {
    n: "01",
    title: "Opišite projekt",
    body: "Pošljite nam e-pošto z nekaj stavki o projektu: za kaj gre, kaj potrebujete in kaj želite doseči. Dovolj je izhodišče, podrobnosti razjasnimo kasneje. Če imate obstoječo stran ali primere, ki vam ustrezajo, jih priložite.",
  },
  {
    n: "02",
    title: "Pregled in predlog",
    body: "Povpraševanje pregledamo in razjasnimo vprašanja, ki so za projekt pomembna. Nato pripravimo predlog obsega dela in ponudbo. Usklajujemo se po e-pošti.",
  },
  {
    n: "03",
    title: "Zasnova in izvedba",
    body: "Ko sta obseg in ponudba dogovorjena, začnemo z delom. Najprej preverimo vsebino in strukturo strani, nato nadaljujemo z oblikovanjem in tehnično izvedbo. Obseg prilagodimo projektu; ni nujno, da vključuje vse naštete dele.",
  },
  {
    n: "04",
    title: "Preverjanje in objava",
    body: "Delo pregledamo skupaj z vami, uskladimo potrebne popravke in stran pripravimo za objavo. Kjer je objava del dogovorjenega obsega, jo tudi izvedemo.",
  },
] as const;

const SCOPE = [
  {
    term: "Zasnova in načrtovanje",
    body: "Pripravimo strukturo, vsebinski načrt in smer razvoja.",
  },
  {
    term: "Oblikovanje in razvoj",
    body: "Oblikujemo in razvijamo spletne strani ter namenske digitalne rešitve.",
  },
  {
    term: "Popravki in izboljšave",
    body: "Odpravljamo napake in nadgrajujemo obstoječe digitalne rešitve.",
  },
] as const;

const CLOSING: MiniFinalCtaCopy = {
  eyebrow: "", // required by the shared type; the empty paragraph is hidden in PristopPage.css
  line1: "Imate projekt?",
  line2: "Pišite nam.", // the shared component puts line2 on its own line
  cta: "Pošljite opis",
  mailto: MINI_CONTACT_MAILTO,
};

/**
 * Pristop (Slovenian), composition V2. One left-anchored reading column.
 * Hero: H1 and lead are one group. Process: serif number and title share a baseline, the description sits directly
 * under the title. Written-first: a large serif statement on the Raised surface, on the process text edge.
 * Scope: three ruled text columns. Layout and type live in PristopPage.css (everything under `.apw`).
 */
export default function PristopPage() {
  return (
    <div data-home-typography data-pristop-v2 className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader hideApproachNav refined primaryNav={NAV} contactHref="#contact" />

        <main className="apw">
          <section className="apw-hero" aria-labelledby="apw-h1">
            <div className="mini-page-rail">
              <p className="uppercase">PRISTOP</p>
              <h1 id="apw-h1" className="apw-h1">
                Vsak projekt se začne s kratkim opisom.
              </h1>
              <p className="apw-lead">
                Pošljite nam kratek opis projekta. Pregledamo vaše potrebe in predlagamo smiseln naslednji korak. Za
                začetek ne potrebujemo sestanka.
              </p>
            </div>
          </section>

          <section className="apw-process" aria-labelledby="apw-process-h">
            <div className="mini-page-rail">
              <h2 id="apw-process-h" className="apw-label">
                Potek sodelovanja
              </h2>
              <ol className="apw-steps">
                {STEPS.map((s) => (
                  <li key={s.n} className="apw-step">
                    <p className="apw-num" aria-hidden="true">
                      {s.n}
                    </p>
                    <h3 className="apw-step-title">{s.title}</h3>
                    <p className="apw-desc">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="apw-note" aria-labelledby="apw-note-h">
            <div className="mini-page-rail">
              <div className="apw-note-text">
                <span className="apw-note-rule" aria-hidden="true" />
                <h2 id="apw-note-h" className="apw-note-h">
                  Dogovori ostanejo zapisani.
                </h2>
                <p className="apw-note-body">
                  Večino komunikacije in usklajevanj uredimo po e-pošti. Tako je lažje preveriti, kaj je bilo
                  dogovorjeno, delo pa ostane urejeno. Kadar je pogovor koristen, ga dogovorimo.
                </p>
              </div>
            </div>
          </section>

          <section className="apw-scope" aria-labelledby="apw-scope-h">
            <div className="mini-page-rail">
              <div className="apw-scope-in">
                <h2 id="apw-scope-h" className="apw-scope-h">
                  Obseg sodelovanja prilagodimo projektu.
                </h2>
                <p className="apw-scope-intro">
                  Vsak projekt ima drugačne potrebe. Lahko&nbsp;gre za celovito izvedbo, nadgradnjo obstoječe rešitve ali
                  posamezen tehnični poseg.
                </p>
                <dl className="apw-scope-list">
                  {SCOPE.map((s) => (
                    <div key={s.term}>
                      <dt>{s.term}</dt>
                      <dd>{s.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        </main>

        <MiniClosingBookend
          variant="graphite"
          photoBackground
          topRule={false}
          tone="natural-midnight"
          ctaCopy={CLOSING}
        />
      </MiniPalette>
    </div>
  );
}
