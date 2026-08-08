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
  tagline: "Structure-first Websites",
  heroTitle: "Jasna struktura.\nVeč odločitev.",
  heroLead:
    "Kompleksne ponudbe spremenim v jasne poti odločanja.",
  ctaPrimary: "Poglej pristop",
  ctaSecondary: "Kontakt",
};

export const services = [
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

export const work: WorkItem[] = [
  {
    slug: "flexido",
    title: "Flexido",
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
/* =========================
   CASE STUDIES
========================= */

export type CaseStudySection = {
  eyebrow: string;
  title: string;
  body: string[];
};

export type CaseStudy = {
  slug: string;
  client: string;
  label: string;
  title: string;
  intro: string;
  meta: string[];
  sections: CaseStudySection[];
  proof: string[];
  closing: {
    title: string;
    text: string;
  };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "flexido",
    client: "Flexido",
    label: "Industrial B2B",
    title: "Kompleksna industrijska ponudba, urejena v jasnejšo pot odločanja.",
    intro:
      "Flexido razvija rešitve za avtomatizacijo proizvodnje: robotske celice, standardne sisteme, namenske rešitve in podporne procese. Pri takšni ponudbi ni dovolj, da stran samo dobro izgleda. Pomembno je, da uporabnik hitro razume, kaj podjetje rešuje, kje se lahko prepozna in kaj je smiseln naslednji korak.",
    meta: ["Structure", "Decision Flow", "Industrial B2B"],
    sections: [
      {
        eyebrow: "Izhodišče",
        title: "Široka ponudba, ki je potrebovala jasnejši red.",
        body: [
          "Flexidova ponudba je široka in tehnično zahtevna.",
          "Vključuje avtomatizacijo proizvodnje, standardne robotske celice, namenske sisteme, reference, servis in način sodelovanja. Če ti elementi niso jasno povezani, stran hitro začne delovati kot katalog.",
          "Uporabnik vidi veliko informacij, ampak težje razume, kje začeti in kaj je zanj pomembno.",
        ],
      },
      {
        eyebrow: "Ključna odločitev",
        title: "Stran ni bila zastavljena kot seznam rešitev.",
        body: [
          "Bolj smiselno je bilo izhajati iz vprašanja: kako uporabnik prepozna svoj problem in pride do pravega tipa rešitve?",
          "Zato je struktura postavljena okoli proizvodnih procesov, tipičnih zastojev, možnih rešitev, dokazov zaupanja in naslednjega koraka.",
        ],
      },
      {
        eyebrow: "Strukturna sprememba",
        title: "Problem → proces → rešitev → dokaz → kontakt.",
        body: [
          "Nova logika strani uporabnika vodi postopno: problem, proces, rešitev, dokaz, način sodelovanja in kontakt.",
          "Najprej dobi osnovni okvir: kaj Flexido rešuje in kje v proizvodnji običajno nastajajo izzivi.",
          "Potem se lahko premakne v konkretnejše sklope: CNC, brizganje plastike, kolaborativni roboti, manipulacija, logistika ali namenski sistemi.",
          "Standardne celice dobijo svoj produktni sloj. Reference, proces sodelovanja in servis pa pomagajo graditi občutek zaupanja.",
        ],
      },
      {
        eyebrow: "Kaj se je izboljšalo",
        title: "Uporabnik ni več prepuščen razpršenim informacijam.",
        body: [
          "Najprej razume širši problem. Nato se lahko prepozna v enem od konkretnih področij. Na koncu ima bolj jasno predstavo, kaj vprašati in kateri naslednji korak ima smisel.",
          "Cilj ni, da uporabnik prebere vse. Cilj je, da se hitro orientira.",
        ],
      },
      {
        eyebrow: "Vrednost za naročnika",
        title: "Flexido je predstavljen bolj jasno, sistemsko in resno.",
        body: [
          "Podjetje ne deluje samo kot ponudnik posameznih robotskih celic, ampak kot partner, ki razume proizvodni proces, zastoje, izvedbo in podporo po projektu.",
          "To pomaga pri prvem vtisu, razumevanju ponudbe in zaupanju.",
        ],
      },
      {
        eyebrow: "Kaj ta primer pokaže",
        title: "Struktura ni samo vizualna ureditev strani.",
        body: [
          "Pri kompleksnih B2B ponudbah struktura pomaga uporabniku razumeti, kaj je pomembno, kako so rešitve povezane in kateri naslednji korak ima smisel.",
          "Bauma pri takšnih projektih najprej ureja pot odločanja. Šele potem ima vizualni sloj pravo nalogo.",
        ],
      },
    ],
    proof: [
      "osnovni home flow",
      "razdelitev rešitev po proizvodnih procesih",
      "standardne celice kot produktni sloj",
      "proces sodelovanja",
      "reference oziroma dokazni sloj",
      "povezava med problemom, rešitvijo in naslednjim korakom",
    ],
    closing: {
      title: "Kompleksna ponudba pogosto najprej potrebuje boljšo strukturo.",
      text:
        "Pri Flexidu je bil cilj, da uporabnik hitreje razume, kaj podjetje rešuje, kje se lahko prepozna in kateri naslednji korak ima smisel.",
    },
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
          Večina strani začne pri vizualnem sloju. Pri tem projektu je bil
          vrstni red drugačen: najprej struktura, potem UI.
        </p>

        <p>
          Cilj ni bil narediti samo lepše strani. Cilj je bil, da uporabnik hitro
          razume, kako postopek deluje, kaj lahko pričakuje in kateri naslednji
          korak je smiseln.
        </p>

        <h3>Kako je bil postavljen flow</h3>

        <ul>
          <li>Hero — kaj je storitev in za koga je primerna</li>
          <li>Postopek — kako odstranjevanje poteka</li>
          <li>Pričakovanja — kaj je realno in kaj ni</li>
          <li>Dokazi — vizualni in vsebinski trust layer</li>
          <li>CTA — jasen naslednji korak brez pritiska</li>
        </ul>

        <p>
          Rezultat je stran, ki ne poskuša samo impresionirati. Uporabnika vodi
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
          Glavni problem stare predstavitve ni bil samo vizualen. Večji problem
          je bil v strukturi: uporabnik ni dovolj hitro razumel, s čim se
          podjetje ukvarja in zakaj mu lahko zaupa.
        </p>

        <p>
          Zato je bila stran zastavljena bolj direktno. Najprej jasna ponudba,
          potem reference, potem razlog za kontakt.
        </p>

        <h3>Kaj smo spremenili</h3>

        <ul>
          <li>Hero — jasnejša predstavitev podjetja</li>
          <li>Reference — večja vloga pri gradnji zaupanja</li>
          <li>Struktura — bolj logičen flow skozi stran</li>
          <li>Navigacija — manj šuma, več jasnosti</li>
        </ul>

        <p>
          Stran zdaj deluje kot bolj resna predstavitev podjetja, ne samo kot
          vizualna prenova.
        </p>
      </>
    ),
  },
];