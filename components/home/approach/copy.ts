export type ApproachStepNumber = "01" | "02" | "03";

export type ApproachCopy = {
  eyebrow: string;
  headline: string;
  headlineSecondary: string;
  /** Optional supporting line under the heading (review variants A–C). */
  support?: string;
  steps: readonly {
    number: ApproachStepNumber;
    title: string;
    text: string;
  }[];
};

/** Production Approach copy — aligned to locked V2 sequence. No support line. */
export const APPROACH_COPY: ApproachCopy = {
  eyebrow: "Pristop",
  headline: "Od nejasnosti",
  headlineSecondary: "do jasne poti.",
  steps: [
    {
      number: "01",
      title: "Odstranimo šum",
      text: "Ponavljanje, nejasne CTA-je in sekcije brez naloge.",
    },
    {
      number: "02",
      title: "Postavimo pot",
      text: "Hierarhijo, vrstni red informacij in jasen naslednji korak.",
    },
    {
      number: "03",
      title: "Vsak del dobi svojo vlogo",
      text: "Vizual in detajli podprejo razumevanje — ne hrup.",
    },
  ],
};

/** Lab-only copy variants for /lab/approach-content-lock — not wired to production. */
export const APPROACH_CONTENT_LOCK_VARIANTS = {
  A: {
    id: "A",
    label: "Minimalni popravek",
    eyebrow: "Pristop",
    headline: "Najprej pomen.",
    headlineSecondary: "Potem oblika.",
    support:
      "Najprej odstranimo odvečno, določimo glavno pot in šele nato oblikujemo rešitev.",
    steps: [
      {
        number: "01" as const,
        title: "Odstranimo šum",
        text: APPROACH_COPY.steps[0].text,
      },
      {
        number: "02" as const,
        title: "Postavimo pot",
        text: APPROACH_COPY.steps[1].text,
      },
      {
        number: "03" as const,
        title: "Oblika dobi nalogo",
        text: APPROACH_COPY.steps[2].text,
      },
    ],
  },
  B: {
    id: "B",
    label: "Bolj procesni heading",
    eyebrow: "Pristop",
    headline: "Od nejasnosti",
    headlineSecondary: "do jasne poti.",
    support:
      "Najprej odstranimo odvečno, določimo prioritete in obliki damo jasno nalogo.",
    steps: [
      {
        number: "01" as const,
        title: "Odstranimo šum",
        text: APPROACH_COPY.steps[0].text,
      },
      {
        number: "02" as const,
        title: "Določimo pot",
        text: APPROACH_COPY.steps[1].text,
      },
      {
        number: "03" as const,
        title: "Oblika dobi nalogo",
        text: APPROACH_COPY.steps[2].text,
      },
    ],
  },
  C: {
    id: "C",
    label: "Najbolj konkretna smer",
    eyebrow: "Pristop",
    headline: "Najprej določimo,",
    headlineSecondary: "kaj mora stran doseči.",
    support:
      "Nato uredimo vsebino, pot in obliko tako, da vsak del podpira naslednji korak.",
    steps: [
      {
        number: "01" as const,
        title: "Določimo bistvo",
        text: APPROACH_COPY.steps[0].text,
      },
      {
        number: "02" as const,
        title: "Postavimo pot",
        text: APPROACH_COPY.steps[1].text,
      },
      {
        number: "03" as const,
        title: "Oblikujemo rešitev",
        text: APPROACH_COPY.steps[2].text,
      },
    ],
  },
} as const;

export type ApproachContentLockVariantId = keyof typeof APPROACH_CONTENT_LOCK_VARIANTS;
