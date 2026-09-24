import type { ApproachCopy } from "@/components/home/approach/copy";

/**
 * EN homepage copy for structural parity with locked `/`.
 * Dedicated EN copy pass comes later — strings here are provisional
 * (approved Hero draft + compatible leftovers from old `/en`).
 */

export const EN_HERO = {
  eyebrow: "Structure before form",
  line1: "Clear structure.",
  line2: "Better decisions.",
  support:
    "I help companies organise their offer, content and path through the website so everything works as one clear, connected whole.",
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
  mobileBlurb:
    "Structure that guides the user from understanding to a decision.",
} as const;

export const EN_DECISION_FLOW = {
  eyebrow: "Decision flow",
  headlineLine1: "From structure to",
  headlineLine2: "decision.",
  body: "First, we define what the visitor needs to understand and where the page should lead them.",
  principles: [
    {
      number: "01",
      label: "Structure",
      shape: "square" as const,
      text: "The user quickly understands what the company offers, who it is for, and where to start.",
    },
    {
      number: "02",
      label: "Clarity",
      shape: "circle" as const,
      text: "Key information is easier to notice, so decisions take less effort.",
    },
    {
      number: "03",
      label: "Next step",
      shape: "triangle" as const,
      text: "The user always knows what to look at, check, or do next.",
    },
  ],
} as const;

export const EN_APPROACH: ApproachCopy = {
  eyebrow: "Approach",
  headline: "From uncertainty",
  headlineSecondary: "to a clear path.",
  steps: [
    {
      number: "01",
      title: "Remove the noise",
      text: "Repetition, unclear CTAs, and sections without a clear purpose.",
    },
    {
      number: "02",
      title: "Set the path",
      text: "Hierarchy, information order, and a clear transition to the next step.",
    },
    {
      number: "03",
      title: "Each part gets its role",
      text: "Visuals, details, and the feel of the page support understanding — not noise.",
    },
  ],
};
export const EN_SYSTEM = {
  eyebrow: "System layer",
  headline: "Under the surface is a system.",
  body: "Each part has a role. We bring them together into one clear whole.",
} as const;

export const EN_VISUAL = {
  eyebrow: "Visual layer",
  line1: "Form comes",
  line2: "after clarity.",
  body: "When the path is clear, form, contrast, and motion show what matters — and add character without adding noise.",
  trail: ["Clarity", "Form", "Feeling"] as const,
} as const;

export const EN_CONTACT = {
  eyebrow: "START A CONVERSATION",
  line1: "A short description",
  line2: "is enough to get started.",
  bodyLine1: "Briefly describe the current situation and what you want to change.",
  bodyLine2: "Then I’ll tell you what makes sense as the next step.",
  cta: "Send a project description",
  mailto: "mailto:gregor@bauma.si?subject=Project%20inquiry",
} as const;

export const EN_FOOTER = {
  tagline:
    "Structure for pages where users need to understand quickly, trust what they see and take the next step.",
  email: "gregor@bauma.si",
  legalAria: "Legal links",
  legal: [
    { href: "/en/terms", label: "Terms" },
    { href: "/en/privacy", label: "Privacy" },
    { href: "/en/cookies", label: "Cookies" },
  ] as const,
} as const;
