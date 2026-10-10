import type { ApproachCopy } from "@/components/home/approach/copy";

/**
 * EN homepage copy for structural parity with locked `/`.
 * Dedicated EN copy pass comes later — strings here are provisional
 * (approved Hero draft + compatible leftovers from old `/en`).
 */

export const EN_HERO = {
  line1: "Clear structure.",
  line2: "Better decisions.",
  support:
    "I work with companies that have a good offer,\nbut their website doesn’t show it.",
  supportBreakFrom: 400,
  secondaryCta: "Explore the approach",
  primaryCta: "Let’s talk",
} as const;

export const EN_HEADER = {
  navApproach: "Approach",
  navSystem: "System",
  navContact: "Contact",
  headerCta: "Contact",
  langSwitch: "SL",
  langSwitchAria: "Slovenian version",
  langSwitchMobile: "Slovenian",
  menuOpen: "Open menu",
  menuClose: "Close menu",
} as const;

export const EN_DECISION_FLOW = {
  eyebrow: "The visitor’s view",
  headlineLine1: "What a first-time",
  headlineLine2: "visitor wants to know.",
  questions: [
    {
      label: "Is this for me?",
      text: "They can tell before reading the details.",
    },
    {
      label: "Why them?",
      text: "They can see what sets them apart without looking for it.",
    },
    {
      label: "What now?",
      text: "Once they’ve decided, they know how to get in touch.",
    },
  ],
} as const;

export const EN_APPROACH: ApproachCopy = {
  eyebrow: "Approach",
  headline: "Every part needs a",
  headlineSecondary: "reason to be there.",
  steps: [
    {
      number: "01",
      title: "What matters gets room.",
      text: "Repetition, unclear CTAs, and sections without a clear purpose.",
    },
    {
      number: "02",
      title: "What doesn’t help gets cut.",
      text: "Hierarchy, information order, and a clear transition to the next step.",
    },
    {
      number: "03",
      title: "The order isn’t accidental.",
      text: "Visuals, details, and the feel of the page support understanding — not noise.",
    },
  ],
};
export const EN_SYSTEM = {
  eyebrow: "System layer",
  headline: "Beneath it all\nis a system.",
  body: "It is not enough for things to be in the right place.\nThey also need to work together.",
} as const;

export const EN_VISUAL = {
  eyebrow: "Visual layer",
  line1: "Form comes",
  line2: "after clarity.",
  body: "Good form does not cover the structure.\nIt gives it character.",
} as const;

export const EN_CONTACT = {
  eyebrow: "Contact",
  line1: "Every project starts",
  line2: "with a short description.",
  cta: "Send a description",
  mailto: "mailto:gregor@bauma.si?subject=Project%20inquiry",
} as const;

export const EN_FOOTER = {
  email: "gregor@bauma.si",
  legalAria: "Legal links",
  legal: [
    { href: "/en/terms", label: "Terms" },
    { href: "/en/privacy", label: "Privacy" },
    { href: "/en/cookies", label: "Cookies" },
  ] as const,
} as const;
