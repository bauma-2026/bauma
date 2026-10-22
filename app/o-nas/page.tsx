import type { Metadata } from "next";
import Link from "next/link";

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

import "./ONas.css";

export const metadata: Metadata = {
  title: "O nas — Bauma",
  robots: { index: false, follow: false },
};

/** Same primary nav as `/`, `/pristop` and `/work`. */
const NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

const CLOSING: MiniFinalCtaCopy = {
  eyebrow: "", // required by the shared type; the empty paragraph is hidden in ONas.css
  line1: "Imate projekt?",
  line2: "Pišite nam.",
  cta: "Pošljite opis",
  mailto: MINI_CONTACT_MAILTO,
};

/**
 * O nas (Slovenian), promoted from /lab/about-v2 V2.7. Text only: Hero > Origin (with the Work link) > Ljubljana (with
 * the signature) > Natural Midnight closing. Copy is provisional. Layout and type live in ONas.css (`.onas`).
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
                Kar zasnujemo, tudi izdelamo.
              </h1>
              <p className="onas-lead">
                Bauma je neodvisen digitalni studio, kjer povezujemo načrtovanje, oblikovanje in razvoj spletnih strani
                ter digitalnih rešitev.
              </p>
            </div>
          </section>

          <section className="onas-origin" aria-labelledby="onas-origin-h">
            <div className="mini-page-rail">
              <p className="uppercase">OZADJE</p>
              <h2 id="onas-origin-h" className="onas-origin-h">
                Oblikovanje in tehnologija.
              </h2>
              <p className="onas-body">
                Prve izkušnje z digitalnimi sistemi segajo v čas zgodnjega spletnega bančništva in dela pri podpori NLB
                Klik.
              </p>
              <p className="onas-body">
                Sledila sta študij vizualne komunikacije v Torinu in delo v oglaševalskih agencijah. Danes se to ozadje
                odraža v delu Baume, kjer se oblikovanje povezuje s tehničnim razvojem.
              </p>
              <Link href="/work" className="onas-link">
                Izbrani projekti <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>

          <section className="onas-city onas-city--text" aria-labelledby="onas-city-h">
            <div className="mini-page-rail">
              <div className="onas-city-flow">
                <h2 id="onas-city-h" className="onas-h3">
                  <span className="onas-nb">Iz Ljubljane.</span> <span className="onas-nb">Z mirnejše baze.</span>
                </h2>
                <div className="onas-city-copy">
                  <p className="onas-body">
                    Bauma ima korenine v Ljubljani. Danes delo poteka iz mirnejšega okolja, z več prostora za
                    osredotočeno delo.
                  </p>
                  {/* Signature row: flex, so a "LinkedIn ↗" link can sit beside the name later without restructuring. */}
                  <div className="onas-signature">
                    <p className="onas-signature-name">Gregor Baumgartner</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <MiniClosingBookend
          variant="graphite"
          photoBackground
          topRule={false}
          tone="natural-midnight"
          spacing="roomy"
          ctaCopy={CLOSING}
        />
      </MiniPalette>
    </div>
  );
}
