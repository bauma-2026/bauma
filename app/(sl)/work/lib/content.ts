/* =========================
   SITE
========================= */

export const site = {
  name: "BAUMA",
  tagline: "Structure-first Websites",
  heroTitle: "Jasna struktura.\nVeč odločitev.",
  heroLead: "Kompleksne ponudbe spremenim v jasne poti odločanja.",
  ctaPrimary: "Poglej pristop",
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
    title: "Najprej odstraniva šum",
    desc: "Poiščeva, kje uporabnik izgubi fokus, dvomi ali ne razume naslednjega koraka.",
  },
  {
    title: "Pot postane jasna",
    desc: "Vsebino, hierarchy in flow uredim tako, da uporabnik hitreje razume, kaj je pomembno.",
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
      "Postopek je lahko hitro deloval nejasno ali preveč obljubljajoče.",
      "Naslednji korak ni smel biti agresiven, ampak razumljiv.",
    ],
    approach: [
      "Flow vodi od vprašanja do realnih pričakovanj.",
      "Vsebina najprej razloži postopek, šele nato vodi v kontakt.",
      "Trust layer temelji na jasnosti, dokazih in mirnem tonu.",
    ],
    outcome: [
      "Uporabnik v nekaj minutah razume, ali je to zanj.",
      "Manj je dvoma okoli postopka in pričakovanj.",
      "Kontakt postane naraven naslednji korak.",
    ],
  },
  {
    slug: "dema-plus",
    title: "Dema Plus",
    summary:
      "Reference in ponudba so postale bolj jasne, direktne in lažje razumljive.",
    tags: ["Structure", "References", "Presentation"],
    challenge: [
      "Podjetje ni bilo dovolj jasno predstavljeno.",
      "Reference niso dovolj hitro gradile zaupanja.",
      "Uporabnik je moral sam sestavljati kontekst.",
    ],
    approach: [
      "Struktura strani jasneje predstavi podjetje, ponudbo in reference.",
      "Vsaka sekcija dobi jasno vlogo v razumevanju podjetja.",
      "Vizualni sloj ostane miren in podpira zaupanje.",
    ],
    outcome: [
      "Uporabnik hitreje razume, s čim se podjetje ukvarja.",
      "Reference dobijo večjo težo.",
      "Stran deluje bolj resno, jasno in uporabno.",
    ],
  },
];