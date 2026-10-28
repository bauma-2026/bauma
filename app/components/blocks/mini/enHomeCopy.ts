import type { MiniHeroCopy } from "./MiniHero";
import type { MiniServicesListCopy } from "./MiniServicesList";
import type { MiniSystemPocketCopy } from "./MiniSystemPocket";
import type { MiniSelectedWorkHomeCopy } from "./MiniSelectedWorkHome";
import type { MiniProjectPocketCopy } from "./MiniProjectPocket";
import type { MiniFinalCtaCopy } from "./MiniFinalCTA";

/**
 * Approved English copy of the V3 home page (`app/en/page.tsx`), section by section in the order of the Slovenian `/`
 * (`app/(sl)/page.tsx`). US English. Client names and the clients' card artwork are not translated.
 */

export const EN_HOME_HERO: MiniHeroCopy = {
  headline: "Websites that help you win new clients.",
  support: "From clear structure and content to design, development and launch.",
  secondaryCta: "What we do ↓",
  primaryCta: "Describe your project",
};

/** Hero secondary button: target and label, as on `/` (`#kaj-delamo` keeps its id in both languages). */
export const EN_HOME_HERO_SECONDARY = { href: "#kaj-delamo", label: "What we do ↓" };

export const EN_HOME_SERVICES: MiniServicesListCopy = {
  eyebrow: "WHAT WE DO",
  heading: "How we can help.",
  services: [
    {
      n: "01",
      title: "Structure and planning",
      body: "We define the site’s structure, the layout of its content and the visual direction. We prepare a plan that another developer can also work from.",
    },
    {
      n: "02",
      title: "Design and build",
      body: "We design, develop and launch the website. From the first concept to a working site.",
    },
    {
      n: "03",
      title: "Digital materials",
      body: "We design static and animated web banners and HTML newsletters. The files are delivered ready to publish.",
    },
    {
      n: "04",
      title: "Maintenance and development",
      body: "We update existing websites, fix bugs and make improvements, including on sites built by other developers.",
    },
  ],
  noBreak: "HTML newsletters",
};

export const EN_HOME_SYSTEM: MiniSystemPocketCopy = {
  eyebrow: "THE BIGGER PICTURE",
  heading: "Beneath the surface is a system.",
  body: "Content, structure, design and the technical build have to work together. That makes it easier for visitors to understand what you offer, find the information that matters and take the next step.",
  objectDescription: "A compact cube made of connected parts that together form one system.",
};

export const EN_HOME_WORK_HEADING = "Each project, its own challenge.";

export const EN_HOME_WORK: MiniSelectedWorkHomeCopy = {
  eyebrow: "Selected work",
  descriptors: {
    "odstrani-tattoo": "Trust and conversion",
    "dema-plus": "Track record and clarity",
    flexido: "Industrial B2B",
  },
  allProjects: "All projects",
};

export const EN_HOME_START: MiniProjectPocketCopy = {
  eyebrow: "GETTING STARTED",
  heading: "You don’t need to have it all worked out.",
  body: "Tell us what you want to change, or what isn’t working on your current site. From there, we clarify what’s needed and propose a scope and a quote.",
  link: "How we work together",
};

export const EN_HOME_CONTACT: MiniFinalCtaCopy = {
  eyebrow: "Contact",
  line1: "Every project starts",
  line2: "with a short description.",
  cta: "Tell us about your project",
  mailto: "mailto:info@bauma.si?subject=Project%20inquiry",
};
