export type WorkPreviewImage = {
  desktop: string;
  mobile: string;
  alt: string;
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

export const workPreviewProjects: Record<string, WorkPreviewProject> = {
  flexido: {
    id: "flexido",
    projectName: "Flexido",
    eyebrow: "Industrijski B2B",
    title: "Kompleksna industrijska ponudba,\nurejena v jasnejšo pot odločanja.",
    summary:
      "Flexidovo ponudbo smo strukturirali po realnih proizvodnih procesih, da uporabnik hitreje razume pravo rešitev in naslednji korak.",
    proof: [
      { label: "Problem", text: "Ponudba je bila razpršena." },
      { label: "Pristop", text: "Struktura po realnih proizvodnih procesih." },
      {
        label: "Rezultat",
        text: "Uporabnik hitreje razume ponudbo in naslednji korak.",
      },
    ],
    caseHref: "/work/flexido",
    ctaLabel: "Odpri celoten primer →",
    images: [
      {
        desktop: "/work/flexido/preview/flexido-hero-desktop.webp",
        mobile: "/work/flexido/preview/flexido-hero-mobile.webp",
        alt: "Flexido — uvodna sekcija strani",
      },
      {
        desktop: "/work/flexido/preview/flexido-solutions-desktop.webp",
        mobile: "/work/flexido/preview/flexido-solutions-mobile.webp",
        alt: "Flexido — rešitve in struktura ponudbe",
      },
    ],
  },
};

export function getWorkPreviewProject(id: string): WorkPreviewProject | null {
  return workPreviewProjects[id] ?? null;
}
