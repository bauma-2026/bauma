import type { Metadata } from "next";
import type { CSSProperties } from "react";

import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";
import {
  MINI_CONTACT_MAILTO,
  type MiniFinalCtaCopy,
} from "@/app/components/blocks/mini/MiniFinalCTA";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "@/app/components/blocks/mini/MiniHeader";
import MiniPalette from "@/app/components/blocks/mini/MiniPalette";
import MiniSelectedWorkHome from "@/app/components/blocks/mini/MiniSelectedWorkHome";
import { homeMono } from "@/app/homeMono";
import "@/app/homeTypography.css";
import "@/app/homeTypographyV11.css";

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

type Role = "vi" | "bauma";

const ROLE_LABEL: Record<Role, string> = { vi: "Vi", bauma: "Bauma" };

/** Each phase lists its roles in the real order of actions. */
const PHASES: { n: string; name: string; roles: { role: Role; text: string }[] }[] = [
  {
    n: "01",
    name: "Začetek",
    roles: [
      {
        role: "vi",
        text: "Po e-pošti opišete, kaj želite urediti in komu je stran namenjena. Pošljete, kar že imate: obstoječo stran, besedila, slike ali primere, ki so vam všeč.",
      },
      { role: "bauma", text: "Pregledamo opis in po e-pošti razjasnimo odprta vprašanja." },
    ],
  },
  {
    n: "02",
    name: "Dogovor",
    roles: [
      { role: "bauma", text: "Pripravimo predlog obsega in ponudbo." },
      { role: "vi", text: "Pregledate in potrdite obseg ter ponudbo." },
    ],
  },
  {
    n: "03",
    name: "Izvedba",
    roles: [
      {
        role: "bauma",
        text: "Zasnujemo in izdelamo dogovorjeno rešitev. Kadar potrebujemo vaše gradivo ali mnenje, vam pišemo.",
      },
      { role: "vi", text: "Posredujete dogovorjene materiale in povratne informacije." },
    ],
  },
  {
    n: "04",
    name: "Pregled in zaključek",
    roles: [
      { role: "vi", text: "Pripravljeno delo pregledate in nam pošljete pripombe." },
      { role: "bauma", text: "Uredimo dogovorjene popravke. Če je objava vključena, stran tudi objavimo." },
    ],
  },
];

/**
 * Selected Work exactly as on the homepage: the homepage's Work surface tone and its V1.1 type and spacing, which
 * `homeTypographyV11.css` keys to `[data-home-typography][data-home-v11]`. Both attributes sit on this wrapper only, so
 * the rest of /pristop (and its contact heading) keeps its own scale.
 */
const SELECTED_WORK_SCOPE = { "--mini-surface-work": "#0f141c" } as CSSProperties;

const CLOSING: MiniFinalCtaCopy = {
  eyebrow: "", // required by the shared type; the empty paragraph is hidden in PristopPage.css
  line1: "Imate projekt?",
  line2: "Pišite nam.", // the shared component puts line2 on its own line
  cta: "Pošljite opis",
  mailto: MINI_CONTACT_MAILTO,
};

/**
 * Pristop (Slovenian), promoted from /lab/pristop-directions/a. One linear reading column: hero (the only serif heading)
 * with a short note on written coordination, four phases with the client's and Bauma's part in the order they happen,
 * then one closing note on scope, followed by the homepage's three selected projects. Inside a phase there are two axes: a secondary number gutter from 640px, and one
 * content axis for the title, the role labels and the paragraphs. Layout and type live in PristopPage.css (under `.apw`).
 */
export default function PristopPage() {
  return (
    <div data-home-typography data-pristop-page className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader hideApproachNav refined primaryNav={NAV} contactHref="#contact" />

        <main className="apw">
          <section className="apw-hero" aria-labelledby="apw-h1">
            <div className="mini-page-rail">
              <p className="uppercase">PRISTOP</p>
              <h1 id="apw-h1" className="apw-h1">
                Vsak projekt se začne s&nbsp;kratkim opisom.
              </h1>
              <p className="apw-lead">
                Za začetek zadostuje nekaj stavkov o tem, kaj želite urediti. Ni treba, da imate vse pripravljeno:
                vprašanja razjasnimo skupaj, nato predlagamo obseg in ponudbo.
              </p>
              <p className="apw-written">
                <span className="apw-role">Usklajevanje</span>
                Večino usklajevanja opravimo po e-pošti. Pogovor ali sestanek dogovorimo, kadar je potreben.
              </p>
            </div>
          </section>

          <section className="apw-process" aria-labelledby="apw-process-h">
            <div className="mini-page-rail">
              <div className="apw-col">
                <p className="uppercase">POTEK SODELOVANJA</p>
                <h2 id="apw-process-h" className="apw-h2">
                  Od prvega opisa do zaključka.
                </h2>
                <ol className="apw-steps">
                  {PHASES.map((p) => (
                    <li key={p.n} className="apw-step">
                      <p className="apw-num" aria-hidden="true">
                        {p.n}
                      </p>
                      <h3 className="apw-step-title">{p.name}</h3>
                      <dl className="apw-roles">
                        {p.roles.map((r) => (
                          <div key={r.role} data-role={r.role}>
                            <dt className="apw-role">{ROLE_LABEL[r.role]}</dt>
                            <dd>{r.text}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="apw-scope" aria-labelledby="apw-scope-h">
            <div className="mini-page-rail">
              <div className="apw-col">
                <p className="uppercase">OBSEG</p>
                <h2 id="apw-scope-h" className="apw-h2">
                  Dogovorimo se, kaj projekt vključuje.
                </h2>
                <p className="apw-body">
                  Nekateri projekti zajemajo vse od strukture do objave, drugi le en del. Če že imate vsebino, oblikovanje
                  ali delujočo stran, izhajamo iz tega. Kaj je vključeno, je zapisano v predlogu.
                </p>
              </div>
            </div>
          </section>

          <div data-home-typography data-home-v11 style={SELECTED_WORK_SCOPE}>
            <MiniSelectedWorkHome topRule={false} heading="Izbrano delo." eyebrow={false} />
          </div>
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
