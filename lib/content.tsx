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
  { title: "Strategy", desc: "Fokus, prioritete in jasen cilj. Brez šuma." },
  {
    title: "Structure",
    desc: "Struktura, flow in blueprint — preden karkoli poliramo.",
  },
  { title: "Design", desc: "Topel, čist UI. Uporaben in berljiv na telefonu." },
  { title: "Build", desc: "Next.js izvedba: hitrost, SEO in stabilnost." },
] as const;

export const work: WorkItem[] = [
  {
    slug: "bauma-portfolio",
    title: "Bauma Portfolio (Next.js)",
    summary:
      "Portfolio za studio, zgrajen okoli jasne strukture, mirnega UI-ja in hitre izvedbe v Next.js.",
    tags: ["Next.js", "UI", "Systems"],
    challenge: [
      "Placeholder splash zamenjati z resno predstavitvijo studia.",
      "Postaviti jasen flow: hero → dokaz (work) → način dela → kontakt.",
      "Mobile-first hierarhija in miren, arhitekturni ritem.",
    ],
    approach: [
      "Blueprint: sekcije + copy hierarchy.",
      "UI sistem: spacing, radius, kartice, subtilen hover.",
      "Build: Next.js App Router + content-driven struktura.",
    ],
    outcome: [
      "Stran, ki takoj razloži pristop in pokaže delo.",
      "Osnova za iteracije (dodajanje projektov brez kaosa).",
      "Hitro, čisto, SEO-ready.",
    ],
  },
  {
    slug: "focused-kit",
    title: "Focused Kit",
    summary:
      "Produktni koncept, postavljen tako, da hitro razloži idejo, poudari fokus in ohrani miren, berljiv flow.",
    tags: ["Next.js", "Product", "Curation"],
    challenge: [
      "Zgraditi kurirano platformo brez ‘big store’ kaosa.",
      "Jasen segment, jasni kriteriji, jasna navigacija.",
      "Prikazati mnenje in kontekst — ne samo katalog.",
    ],
    approach: [
      "Information architecture: kategorije in filtri brez preobremenitve.",
      "Card sistem + product detail page kot ‘case’ pristop.",
      "Iterativna gradnja: najprej 10 produktov, potem širitev.",
    ],
    outcome: [
      "Mirna, fokusirana izkušnja z jasnim stališčem.",
      "Osnova za rast in dodajanje CMS kasneje (če bo treba).",
      "Sistem, ki ostane clean tudi ob več vsebine.",
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