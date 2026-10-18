export type WorkPreviewLocale = "sl" | "en";

export type WorkPreviewImage = {
  desktop: string;
  mobile: string;
  alt: string;
  caption: string;
};

export type WorkPreviewProof = {
  label: string;
  text: string;
};

export type WorkPreviewProject = {
  id: string;
  projectName: string;
  eyebrow: string;
  title: string;
  summary: string;
  proof: WorkPreviewProof[];
  caseHref: string;
  ctaLabel: string;
  images: WorkPreviewImage[];
};

const workPreviewProjectsSl: Record<string, WorkPreviewProject> = {
  flexido: {
    id: "flexido",
    projectName: "Flexido",
    eyebrow: "Industrijski B2B",
    title: "Kompleksna industrijska ponudba,\nurejena v jasnejšo pot odločanja.",
    summary:
      "Flexidovo ponudbo smo strukturirali po realnih proizvodnih procesih, da uporabnik hitreje razume pravo rešitev in naslednji korak.",
    proof: [
      {
        label: "Izhodišče",
        text: "Široka, tehnično zahtevna ponudba, ki je brez povezave med deli delovala kot katalog.",
      },
      {
        label: "Odločitev",
        text: "Stran ni zasnovana kot seznam rešitev, ampak okoli tega, kako uporabnik prepozna svoj problem.",
      },
      {
        label: "Sprememba",
        text: "Zdaj vodi postopno: problem, proces, rešitev, dokaz, kontakt.",
      },
    ],
    caseHref: "/work/flexido",
    ctaLabel: "Odpri celoten primer →",
    images: [
      {
        desktop: "/work/flexido/preview/flexido-hero-desktop.webp",
        mobile: "/work/flexido/preview/flexido-hero-mobile.webp",
        alt: "Flexido — uvodna sekcija strani",
        caption: "Uvod in konkretne točke, kjer proces izgublja ritem.",
      },
      {
        desktop: "/work/flexido/preview/flexido-solutions-desktop.webp",
        mobile: "/work/flexido/preview/flexido-solutions-mobile.webp",
        alt: "Flexido — rešitve in struktura ponudbe",
        caption:
          "Rešitve, razvrščene po procesu — najprej proces, potem rešitev.",
      },
    ],
  },
};

/**
 * English translation of existing SL copy only — same project, same images,
 * same case-study link. No new claims or metrics.
 */
const workPreviewProjectsEn: Record<string, WorkPreviewProject> = {
  flexido: {
    id: "flexido",
    projectName: "Flexido",
    eyebrow: "Industrial B2B",
    title: "A complex industrial offer,\nrestructured into a clearer path to decision.",
    summary:
      "We structured Flexido's offer around real production processes, so users understand the right solution and next step faster.",
    proof: [
      {
        label: "Starting point",
        text: "A wide, technical offer that, without connection between its parts, read like a catalogue.",
      },
      {
        label: "Structural decision",
        text: "Not built as a list of solutions, but around how the user recognizes their own problem.",
      },
      {
        label: "What changed",
        text: "It now leads step by step: problem, process, solution, proof, contact.",
      },
    ],
    caseHref: "/work/flexido",
    ctaLabel: "Open full case study →",
    images: [
      {
        desktop: "/work/flexido/preview/flexido-hero-desktop.webp",
        mobile: "/work/flexido/preview/flexido-hero-mobile.webp",
        alt: "Flexido — homepage intro section",
        caption: "Intro, followed by the concrete points where the process loses rhythm.",
      },
      {
        desktop: "/work/flexido/preview/flexido-solutions-desktop.webp",
        mobile: "/work/flexido/preview/flexido-solutions-mobile.webp",
        alt: "Flexido — solutions and offer structure",
        caption: "Solutions ordered by process — process first, then solution.",
      },
    ],
  },
};

const workPreviewProjectsByLocale: Record<
  WorkPreviewLocale,
  Record<string, WorkPreviewProject>
> = {
  sl: workPreviewProjectsSl,
  en: workPreviewProjectsEn,
};

export function getWorkPreviewProject(
  id: string,
  locale: WorkPreviewLocale = "sl",
): WorkPreviewProject | null {
  return workPreviewProjectsByLocale[locale][id] ?? null;
}
