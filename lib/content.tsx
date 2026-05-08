import type { ReactNode } from "react";

export type WorkItem = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  challenge: string[];
  approach: string[];
  outcome: string[];
};

export const site = {
  name: "BAUMA",
  tagline: "Digital Studio + Product Architecture",
  heroTitle: "Product systems.\nDesigned to\nscale.",
  heroLead:
    "Strukturiramo kompleksne digitalne produkte v jasne, stabilne in skalabilne sisteme — od prvega blueprinta do izvedbe.",
  ctaPrimary: "Poglej projekte",
  ctaSecondary: "Kontakt",
};

export const services = [
  {
    title: "Najprej odstranimo šum",
    desc: "Poiščemo, kje uporabnik izgubi fokus, dvomi ali ne razume naslednjega koraka.",
  },
  {
    title: "Pot postane jasna",
    desc: "Vsebino, hierarchy in flow uredimo tako, da uporabnik hitreje razume, kaj je pomembno.",
  },
  {
    title: "Stran začne voditi",
    desc: "Vsak layer dobi svojo vlogo. Uporabnik se premika brez občutka zmede.",
  },
  {
    title: "Šele potem poliramo",
    desc: "Vizualni sloj okrepi jasno strukturo — ne skriva problemov pod efekti.",
  },
];

export const work: WorkItem[] = [
  {
    slug: "flexido",
    title: "Kompleksno ponudbo smo spremenili v jasne poti odločanja.",
    summary:
      "Industrijsko ponudbo smo strukturirali po realnih proizvodnih procesih, da uporabnik hitreje razume pravo rešitev in naslednji korak.",
    tags: ["Structure", "Decision Flow", "Industrial"],
    challenge: [
      "Ponudba je bila razpršena.",
      "Uporabnik ni hitro razumel, katera rešitev je prava zanj.",
      "Ni bilo jasnega naslednjega koraka.",
    ],
    approach: [
      "Ponudbo smo razdelili po realnih use-case procesih.",
      "Odstranili smo odvečne informacije.",
      "Vsaka rešitev vodi skozi isti decision flow.",
    ],
    outcome: [
      "Uporabnik hitreje razume ponudbo.",
      "Lažje prepozna svojo situacijo.",
      "Naslednji korak postane očiten.",
    ],
  },

  {
    slug: "odstrani-tattoo",
    title: "Odstrani Tattoo",
    summary:
      "Stran vodi uporabnika od vprašanj in dvomov do jasnega razumevanja postopka.",
    tags: ["Flow", "Trust", "Clarity"],
    challenge: [
      "Uporabnik ni vedel, ali je odstranitev sploh možna.",
    ],
    approach: [
      "Flow vodi od problema do realnih pričakovanj.",
    ],
    outcome: [
      "Uporabnik v nekaj minutah razume, ali je to zanj.",
    ],
  },

  {
    slug: "dema-plus",
    title: "Dema Plus",
    summary:
      "Reference in ponudba so postale bolj jasne, direktne in lažje razumljive.",
    tags: ["Structure", "References", "Presentation"],
    challenge: [
      "Podjetje ni bilo jasno predstavljeno.",
    ],
    approach: [
      "Struktura z jasnim poudarkom na projektih in vrednosti.",
    ],
    outcome: [
      "Uporabnik hitreje razume reference in pridobi zaupanje.",
    ],
  },
];

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  content: ReactNode;
};

export const news: NewsItem[] = [
  {
    slug: "odstrani-tattoo-structure",
    title: "Odstrani Tattoo — struktura pred estetiko",
    excerpt:
      "Kako je bila stran postavljena tako, da uporabnika pelje od vprašanj do odločitve — brez hypea in brez zmede.",
    content: (
      <>
        <p>
          Večina strani začne pri vizualnem sloju. Tukaj smo šli obratno —
          najprej struktura, potem UI.
        </p>

        <p>
          Cilj je bil jasen: uporabnik mora razumeti, kako postopek deluje, kaj
          lahko pričakuje in kaj je naslednji korak.
        </p>

        <h3>Kako je bil postavljen flow</h3>

        <ul>
          <li>Hero — kaj je to in za koga je</li>
          <li>Process — kako deluje</li>
          <li>Objections — kaj lahko pričakuješ</li>
          <li>Results — dokaz</li>
          <li>CTA — jasen naslednji korak</li>
        </ul>

        <p>
          Rezultat je stran, ki ne poskuša impresionirati, ampak vodi uporabnika
          skozi odločitev.
        </p>
      </>
    ),
  },
  {
    slug: "dema-plus-preview",
    title: "Dema Plus — bolj direktna predstavitev podjetja",
    excerpt:
      "Preview strani, kjer je fokus na jasni ponudbi, projektih in preglednem flowu brez odvečnega šuma.",
    content: (
      <>
        <p>
          Glavni problem stare strani ni bil vizualen — bil je v strukturi.
        </p>

        <p>
          Ni bilo jasno, s čim se podjetje ukvarja in kako naprej.
        </p>

        <h3>Kaj smo spremenili</h3>

        <ul>
          <li>Hero — jasna ponudba</li>
          <li>Reference — v ospredju</li>
          <li>Struktura — logičen flow</li>
          <li>Navigacija — brez zmede</li>
        </ul>

        <p>
          Stran zdaj deluje kot resna predstavitev podjetja, ne samo kot “lep
          dizajn”.
        </p>
      </>
    ),
  },
];