import Image from "next/image";

/**
 * Faithful, non-interactive reconstruction of an excerpt of the Flexido
 * e-katalog hub (flexido.eu/standardne-celice, "E-katalog" in the site menu):
 * the "Vrste sistemov" section, its header and the first row of system cards.
 *
 * Source of truth (local flexido-next):
 * - Copy: src/content/systems/hub/sl.ts (cardsHeading, cardLinkLabel, cards[0..2])
 * - Markup/typography: src/components/systems/SystemsHubTemplate.tsx (HubSystemCard and the
 *   "Vrste sistemov" Section) + src/components/ui/SectionHeader.tsx + Section/Container.
 * - Card photographs: the hub's own overrides (HUB_CARD_IMAGE_OVERRIDES), copied from
 *   public/images/systems/raw/*.png to public/work/flexido/proof/*.webp at full size.
 * - Tokens ported 1:1 from app/globals.css (.eyebrow, .text-section-title, .text-card-title,
 *   .surface-muted #f2f2f2, --radius-panel 16px), as in FlexidoAreasProof.
 *
 * An excerpt, not the full grid: the hub has five cards; this shows the first row on
 * desktop (CNC, IMM, FLEX 25 / 50) and the first two below 1024px, so the proof stays
 * one row long. Deliberately not the real component: cards are static markup (no <Link>,
 * no hover zoom or border change, no cursor change), and the block uses the system font
 * stack, matching the real page's browser default. The heading is a paragraph: the page
 * exposes this proof as one labelled image.
 */

const SYSTEM_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

type SystemCard = {
  title: string;
  eyebrow: string;
  desc: string;
  image: string;
};

/** The card photographs are the same in every language (the hub's HUB_CARD_IMAGE_OVERRIDES). */
const IMAGES = [
  "/work/flexido/proof/flexido-cnc-machine-studio.webp",
  "/work/flexido/proof/flexido-imm-machine-studio.webp",
  "/work/flexido/proof/flex-25-50-studio-wide-v3.webp",
] as const;

/** Per language, verbatim from flexido-next `src/content/systems/hub/{sl,en}.ts` (cardsHeading, cardLinkLabel,
 *  cards[0..2]). Slovenian is the default; the English case study passes `locale="en"`. */
const COPY: Record<"sl" | "en", { eyebrow: string; heading: string; linkLabel: string; cards: SystemCard[] }> = {
  sl: {
    eyebrow: "Vrste sistemov",
    heading: "Izberite sistem glede na nalogo.",
    linkLabel: "Poglej sistem",
    cards: [
      {
        title: "FLEX 7 CNC Slim",
        eyebrow: "CNC stroji",
        desc: "Kompaktna robotska celica za strego CNC strojev, nalaganje, odvzem in stabilnejši tok kosov.",
        image: IMAGES[0],
      },
      {
        title: "FLEX 7 IMM Slim",
        eyebrow: "Brizganje plastike",
        desc: "Robotska celica za strego strojev za brizganje plastike, odvzem kosov, insert moulding in kontrolo.",
        image: IMAGES[1],
      },
      {
        title: "FLEX 25 / 50",
        eyebrow: "25 / 50 kg nosilnosti",
        desc: "Konfigurabilna robotska celica z robotom nosilnosti 25 ali 50 kg, kadar FLEX 7 ne pokrije potrebne nosilnosti, dosega ali opcij.",
        image: IMAGES[2],
      },
    ],
  },
  en: {
    eyebrow: "System types",
    heading: "Choose a system based on the task.",
    linkLabel: "View system",
    cards: [
      {
        title: "FLEX 7 CNC Slim",
        eyebrow: "CNC machines",
        desc: "A compact robot cell for tending CNC machines — loading, unloading, and a more stable part flow.",
        image: IMAGES[0],
      },
      {
        title: "FLEX 7 IMM Slim",
        eyebrow: "Injection molding",
        desc: "A robot cell for tending injection molding machines — part removal, insert moulding, and inspection.",
        image: IMAGES[1],
      },
      {
        title: "FLEX 25 / 50",
        eyebrow: "25 / 50 kg payload",
        desc: "A configurable robot cell with a 25 or 50 kg payload robot when FLEX 7 does not cover the required payload, reach, or options.",
        image: IMAGES[2],
      },
    ],
  },
};

/** `locale`: language of the reconstructed copy (the Slovenian site by default, the English one on `/en/work/flexido`). */
export default function FlexidoCatalogProof({ locale = "sl" }: { locale?: "sl" | "en" }) {
  const t = COPY[locale];
  return (
    <div
      className="bg-[#f2f2f2] text-neutral-950"
      style={{ fontFamily: SYSTEM_FONT_STACK }}
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-6 max-w-[620px] lg:mb-7">
          <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-600">
            {t.eyebrow}
          </p>
          <p className="mt-3 text-balance text-[30px] font-semibold leading-[1.06] tracking-[-0.04em] text-neutral-950 sm:text-[36px] lg:text-[44px]">
            {t.heading}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.cards.map((card, index) => (
            <div
              key={card.title}
              className={`flex h-full flex-col overflow-hidden rounded-[16px] border border-neutral-200 bg-white ${
                index === 2 ? "hidden lg:flex" : ""
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-600">
                  {card.eyebrow}
                </p>
                <p className="mt-2.5 text-[20px] font-semibold leading-[1.3] tracking-[-0.03em] text-neutral-950">
                  {card.title}
                </p>
                <p className="mt-2 text-[14px] leading-[22px] text-neutral-600">
                  {card.desc}
                </p>
                <p className="mt-auto inline-flex items-center pt-4 text-[14px] font-medium text-neutral-500">
                  {t.linkLabel}
                  <span aria-hidden="true" className="ml-2 inline-block">
                    →
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
