export type ContactCohesionVariantId = "A" | "B" | "C";

export type ContactActionsLayout = "stack" | "row-desktop";

export type ContactCohesionVariant = {
  id: ContactCohesionVariantId;
  label: string;
  /** Heading lines joined with intentional <br /> between entries. */
  headingLines: string[];
  support: string;
  cta: string;
  /** Outer text column max width (px). */
  columnMaxPx: number;
  /** Support paragraph max width (px). */
  supportMaxPx: number;
  actionsLayout: ContactActionsLayout;
};

/**
 * Lab-only Contact cohesion study.
 * Production MiniFinalCTA copy is untouched.
 */
export const CONTACT_COHESION_VARIANTS: Record<
  ContactCohesionVariantId,
  ContactCohesionVariant
> = {
  A: {
    id: "A",
    label: "Intent first",
    headingLines: ["Povejte mi,", "kaj želite doseči."],
    support:
      "Pošljite mi kratek opis projekta in cilja. Nato ocenim, kako se ga je smiselno lotiti.",
    cta: "Pošljite kratek opis",
    columnMaxPx: 620,
    supportMaxPx: 520,
    actionsLayout: "stack",
  },
  B: {
    id: "B",
    label: "Project first",
    headingLines: ["Opišite projekt", "in njegov cilj."],
    support:
      "Dovolj je kontekst projekta in cilj. Nato ocenim, kako se ga je smiselno lotiti.",
    cta: "Pošljite kratek opis",
    columnMaxPx: 520,
    supportMaxPx: 460,
    actionsLayout: "stack",
  },
  C: {
    id: "C",
    label: "Collaboration threshold",
    headingLines: ["Najprej ocenim,", "ali ima smisel."],
    support:
      "Pošljite kratek opis projekta in cilja. Nato ocenim, ali in kako se ga je smiselno lotiti.",
    cta: "Pošljite kratek opis",
    columnMaxPx: 560,
    supportMaxPx: 500,
    actionsLayout: "row-desktop",
  },
};
