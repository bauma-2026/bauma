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

import "./ONas.css";

export const metadata: Metadata = {
  title: "O nas — Bauma",
  robots: { index: false, follow: false },
};

const NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

/** Selected Work as on the homepage: the Work surface tone plus the V1.1 type scope, on this wrapper only. */
const SELECTED_WORK_SCOPE = { "--mini-surface-work": "#0f141c" } as CSSProperties;

const CLOSING: MiniFinalCtaCopy = {
  eyebrow: "", // required by the shared type; the empty paragraph is hidden in ONas.css
  line1: "Imate projekt?",
  line2: "Pišite nam.",
  cta: "Pošljite opis",
  mailto: MINI_CONTACT_MAILTO,
};

/**
 * O nas (Slovenian), approved from /lab/o-nas-direction. Bauma speaks as the studio ("mi"); Gregor Baumgartner signs
 * the closing thought. Hero (eyebrow, serif H1, lead), then one reading section on the same surface (two paragraphs,
 * closing thought + signature with Gregor's e-mail), then the shared Selected Work (three projects, "Vsi projekti") and the contact.
 * Layout and type live in ONas.css (`.onas`).
 */
export default function ONasPage() {
  return (
    <div data-home-typography data-o-nas className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader hideApproachNav refined primaryNav={NAV} contactHref="#contact" />

        <main className="onas">
          <section className="onas-hero" aria-labelledby="onas-h1">
            <div className="mini-page-rail">
              <p className="uppercase">O NAS</p>
              <h1 id="onas-h1" className="onas-h1">
                Oblikovanje in razvoj pod eno streho.
              </h1>
              <p className="onas-lead">
                Bauma je neodvisen digitalni studio za spletne strani in digitalne rešitve. Povezujemo načrtovanje,
                oblikovanje in razvoj — od prvih izhodišč do izvedbe.
              </p>
            </div>
          </section>

          <section className="onas-text">
            <div className="mini-page-rail">
              <div className="onas-col">
                <p className="onas-body">
                  Vsak projekt ima svoje izhodišče. Nekje je treba urediti obsežno ponudbo, drugje predstaviti reference
                  ali poenostaviti pot do povpraševanja in nakupa. Najprej razjasnimo, kaj mora rešitev omogočati in katere
                  informacije potrebuje njen uporabnik. Iz tega gradimo strukturo, vsebino in obliko.
                </p>
                <p className="onas-body">
                  Pogosto izhajamo iz nečesa, kar že obstaja. Ohranimo uporabne dele, odpravimo ovire in nadgradimo, kar
                  potrebuje spremembo. Pomembno nam je, da je rešitev pregledna za uporabo in smiselno zasnovana tudi za
                  nadaljnji razvoj.
                </p>
                <div className="onas-closing">
                  <p className="onas-thought">
                    Z naročniki gradimo sodelovanja, v katerih delo poznamo in ga lahko razvijamo naprej.
                  </p>
                  <p className="onas-signature">Gregor Baumgartner</p>
                  {/* Gregor's personal address; the studio's general contact (info@) stays in the contact section below. */}
                  <p className="onas-signature-mail">
                    <a href="mailto:gregor@bauma.si">gregor@bauma.si</a>
                  </p>
                </div>
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
