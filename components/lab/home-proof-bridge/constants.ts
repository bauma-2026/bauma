export const PROOF_COPY = {
  label: "Iz prakse",
  headline: "Kompleksna ponudba. Jasna pot. Zgrajena stran.",
  featured: {
    name: "Flexido",
    caption:
      "Tehnično zahtevna ponudba, urejena tako, da obiskovalec hitreje najde pravo rešitev in ve, kam naprej.",
    cta: "Poglej Flexido →",
    href: "/work/flexido",
    image: "/lab/home-proof-bridge/flexido.png",
    crop: "top" as const,
  },
  supports: [
    {
      name: "Odstrani Tattoo",
      caption: "Pot skozi dvom — od prvega vprašanja do stika.",
      href: "/work/odstrani-tattoo",
      image: "/lab/home-proof-bridge/odstrani-tattoo.png",
      crop: "mid" as const,
    },
    {
      name: "Dema Plus",
      caption: "Jasna predstavitev podjetja skozi reference in proces.",
      href: "/work/dema-plus",
      image: "/lab/home-proof-bridge/dema-plus.png",
      crop: "upper-mid" as const,
    },
  ],
} as const;

export type CropKey = "top" | "mid" | "upper-mid";

export const CROP_OBJECT_POSITION: Record<CropKey, string> = {
  top: "center 8%",
  mid: "center 42%",
  "upper-mid": "center 22%",
};
