import type { MiniFinalCtaCopy } from "@/app/components/blocks/mini/MiniFinalCTA";
import type { MiniFooterCopy } from "@/app/components/blocks/mini/MiniFooter";
import type { MiniHeaderCopy } from "@/app/components/blocks/mini/MiniHeader";
import {
  EN_CONTACT,
  EN_FOOTER,
  EN_HEADER,
} from "@/components/home/copy/enHomepage";

export type { MiniFooterCopy, MiniHeaderCopy };

export type HowShape = "square" | "circle" | "triangle";

export type AboutPreviewCopy = {
  portraitAlt: string;
  hero: {
    /** Mobile intentional 3-line composition */
    mobileLines: readonly [string, string, string];
    /** Desktop/tablet intentional 2-line composition */
    desktopLines: readonly [string, string];
    support1: string;
    support2: string;
  };
  origin: {
    eyebrow: string;
    headline: string;
    timeline: readonly {
      eyebrow: string;
      title: string;
      text: string;
    }[];
  };
  whatChanged: {
    eyebrow: string;
    headline: string;
    paragraphs: readonly [string, string, string];
  };
  howIWork: {
    eyebrow: string;
    headline: string;
    supportLine1: string;
    supportLine2: string;
    steps: readonly {
      number: string;
      label: string;
      shape: HowShape;
      text: string;
    }[];
  };
  currentWork: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    paragraphs: readonly [string, string];
  };
  contact: MiniFinalCtaCopy;
};

export const ABOUT_PREVIEW_COPY_SL: AboutPreviewCopy = {
  portraitAlt: "Gregor Baumgartner",
  hero: {
    mobileLines: ["Struktura", "naredi celoto", "jasnejšo."],
    desktopLines: ["Struktura naredi", "celoto jasnejšo."],
    support1:
      "Bauma je moj način dela s spletnimi stranmi in digitalnimi sistemi. Vsebino, oblikovanje in tehnologijo povežem v smiselno celoto.",
    support2:
      "Ko ti deli delujejo skupaj, uporabnik hitreje razume, kaj je pomembno.",
  },
  origin: {
    eyebrow: "Origin",
    headline: "Zgodnji stik z digitalnimi sistemi.",
    timeline: [
      {
        eyebrow: "1999–2002",
        title: "Zgodnji digitalni sistemi",
        text: "Moja digitalna pot se je začela v Ljubljanski banki / NLB, v Sektorju za sodobne tržne poti, kjer sem bil del zgodnje podpore za NLB Klik in NLB Proklik.",
      },
      {
        eyebrow: "Digitalno zaupanje",
        title: "Uporabniki, brskalniki in certifikati",
        text: "Tam sem zelo zgodaj videl, kako hitro se uporabnik izgubi v digitalnem sistemu — pri certifikatih, brskalnikih in varnosti je bila jasna razlaga pogosto ključna za zaupanje.",
      },
      {
        eyebrow: "Vizualna komunikacija",
        title: "Od sistemov do vizualne strukture",
        text: "To obdobje me je usmerilo v vizualne komunikacije, interaktivno oblikovanje in kasnejše delo na stičišču oblikovanja, tehnologije in razumevanja uporabnika.",
      },
    ],
  },
  whatChanged: {
    eyebrow: "What changed",
    headline: "Lep videz ni več dovolj.",
    paragraphs: [
      "Danes je stran, ki izgleda dobro, lažje in hitreje ustvariti. Zato dober videz sam po sebi ne pove več dovolj o kakovosti rešitve.",
      "Razlika je v tem, kako je stran urejena: kaj uporabnik najprej razume, kaj je pomembno in kako pride do odločitve.",
      "Bauma zato ne začne pri videzu, ampak pri tem, kaj mora stran uporabniku omogočiti.",
    ],
  },
  howIWork: {
    eyebrow: "Approach",
    headline: "Kako delam danes.",
    supportLine1: "Najprej določim, kaj je pomembno.",
    supportLine2: "Nato okoli tega gradim vsebino, oblikovanje in izvedbo.",
    steps: [
      {
        number: "01",
        label: "Uredim vsebino",
        shape: "square",
        text: "Določim pomen, hierarhijo in vrstni red vsebine.",
      },
      {
        number: "02",
        label: "Oblikujem stran",
        shape: "circle",
        text: "Tipografija, kontrast in razmerja pokažejo, kaj je pomembno.",
      },
      {
        number: "03",
        label: "Raziskujem in preverjam",
        shape: "triangle",
        text: "AI uporabljam za raziskovanje, primerjavo in preverjanje več možnosti.",
      },
    ],
  },
  currentWork: {
    eyebrow: "Today",
    headlineLine1: "Iz Ljubljane.",
    headlineLine2: "Z mirnejše baze.",
    paragraphs: [
      "Rojen sem v Ljubljani, kjer sem odraščal in večino poti gradil v vizualnih komunikacijah, oglaševanju in digitalnem delu.",
      "Danes delam z mirnejše baze: več fokusa, manj hrupa in bolj strukturirano delo — brez izgube urbanega komunikacijskega ozadja.",
    ],
  },
  contact: {
    eyebrow: "ZAČNIMO POGOVOR",
    line1: "Za prvi stik je",
    line2: "dovolj kratek opis.",
    bodyLine1: "Na kratko opišite trenutno stanje in kaj želite spremeniti.",
    bodyLine2: "Nato vam povem, kako je smiselno nadaljevati.",
    cta: "Pošljite opis projekta",
    mailto: "mailto:gregor@bauma.si?subject=Povpra%C5%A1evanje%20za%20projekt",
  },
};

/**
 * Temporary EN placeholders for structural parity only.
 * Dedicated EN About copy pass comes later.
 */
export const ABOUT_PREVIEW_COPY_EN: AboutPreviewCopy = {
  portraitAlt: "Gregor Baumgartner",
  hero: {
    mobileLines: ["Structure", "makes the whole", "clearer."],
    desktopLines: ["Structure makes", "the whole clearer."],
    support1:
      "Bauma is my way of working with websites and digital systems: bringing content, design and technology together into a meaningful whole.",
    support2:
      "When those parts work together, the user understands what matters faster.",
  },
  origin: {
  eyebrow: "Origin",
  headline: "Early contact with digital systems.",
  timeline: [
    {
      eyebrow: "1999–2002",
      title: "Early digital systems",
      text: "My digital path started at Ljubljanska banka / NLB, in its Modern Channels team, where I worked on early support for NLB Klik and NLB Proklik.",
    },
    {
      eyebrow: "Digital trust",
      title: "Users, browsers and certificates",
      text: "That is where I first saw how quickly a user can get lost inside a digital system: certificates, browsers, security, trust and the need for a clear next step.",
    },
    {
      eyebrow: "Visual communication",
      title: "From systems to visual structure",
      text: "That period later led me into visual communication, interactive design and work where design, technology and user understanding meet.",
    },
  ],
},
  whatChanged: {
  eyebrow: "What changed",
  headline: "Looking good is no longer enough.",
  paragraphs: [
    "Today, almost anyone can quickly create a website that looks good enough. That means appearance alone is no longer a strong enough signal.",
    "The difference is in the structure: what comes first, what needs to be clear, where trust is built and which next step needs to be obvious.",
    "That is why Bauma does not start with appearance, but with what the page needs to help the user understand and do.",
  ],
},
  howIWork: {
  eyebrow: "Approach",
  headline: "How I work today.",
  supportLine1: "First I decide what matters.",
  supportLine2: "Then I build content, design and implementation around it.",
  steps: [
    {
      number: "01",
      label: "I organise the content",
      shape: "square",
      text: "I define meaning, hierarchy and the order of content.",
    },
    {
      number: "02",
      label: "I shape the page",
      shape: "circle",
      text: "Typography, contrast and proportion show what matters.",
    },
    {
      number: "03",
      label: "I explore and verify",
      shape: "triangle",
      text: "I use AI to explore, compare and check multiple options.",
    },
  ],
},
currentWork: {
  eyebrow: "Today",
  headlineLine1: "Ljubljana-born.",
  headlineLine2: "Based in a quieter place.",
  paragraphs: [
    "I was born in Ljubljana, where I grew up and built most of my professional path through visual communication, advertising and digital work.",
    "Today, I work from a quieter base: more focus, less noise and a more structured way of working — without losing the urban visual and communication background that shaped me.",
  ],
},
contact: EN_CONTACT,
};

export const ABOUT_HEADER_SL: MiniHeaderCopy = {
  homeHref: "/",
  langHref: "/en",
  langLabel: "EN",
  langAria: "English version",
  langMobileLabel: "English",
  navApproach: "Pristop",
  navSystem: "Sistem",
  navContact: "Kontakt",
  headerCta: "Pogovorimo se",
  menuOpen: "Odpri meni",
  menuClose: "Zapri meni",
  mobileBlurb: "Struktura, ki uporabnika vodi od razumevanja do odločitve.",
};

export const ABOUT_HEADER_EN: MiniHeaderCopy = {
  homeHref: "/en",
  langHref: "/about-preview",
  langLabel: EN_HEADER.langSwitch,
  langAria: EN_HEADER.langSwitchAria,
  langMobileLabel: EN_HEADER.langSwitchMobile,
  navApproach: EN_HEADER.navApproach,
  navSystem: EN_HEADER.navSystem,
  navContact: EN_HEADER.navContact,
  headerCta: EN_HEADER.headerCta,
  menuOpen: EN_HEADER.menuOpen,
  menuClose: EN_HEADER.menuClose,
  mobileBlurb: EN_HEADER.mobileBlurb,
};

export const ABOUT_FOOTER_SL: MiniFooterCopy = {
  homeHref: "/",
  tagline:
    "Struktura za strani, kjer mora uporabnik hitro razumeti, zaupati in narediti naslednji korak.",
  email: "gregor@bauma.si",
  legalAria: "Pravne povezave",
  legal: [
    { href: "/pogoji-uporabe", label: "Pogoji uporabe" },
    { href: "/zasebnost", label: "Zasebnost" },
    { href: "/piskotki", label: "Piškotki" },
  ],
};

export const ABOUT_FOOTER_EN: MiniFooterCopy = {
  homeHref: "/en",
  tagline: EN_FOOTER.tagline,
  email: EN_FOOTER.email,
  legalAria: EN_FOOTER.legalAria,
  legal: [...EN_FOOTER.legal],
};
