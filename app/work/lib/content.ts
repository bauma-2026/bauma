import type { ReactNode } from "react";

/* =========================
   SITE
========================= */

export const site = {
  name: "BAUMA",
  tagline: "Digital Studio + Product Architecture",
  heroTitle: "Product systems.\nDesigned to\nscale.",
  heroLead:
    "Strukturiramo kompleksne digitalne produkte v jasne, stabilne in skalabilne sisteme — od prvega blueprinta do izvedbe.",
  ctaPrimary: "Poglej projekte",
  ctaSecondary: "Kontakt",
} as const;

/* =========================
   SERVICES
========================= */

export type ServiceItem = {
  title: string;
  desc: string;
};

export const services: ServiceItem[] = [
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

/* =========================
   WORK
========================= */

export type WorkItem = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  challenge: string[];
  approach: string[];
  outcome: string[];
};

export const work: WorkItem[] = [
  {
    slug: "bauma-portfolio",
    title: "Bauma Portfolio (Next.js)",
    summary:
      "Mobile-first studio site. Clear structure → clean UI → fast build.",
    tags: ["Next.js", "UI", "Architecture"],
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
      "Curated tech products with opinionated structure and calm UX.",
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