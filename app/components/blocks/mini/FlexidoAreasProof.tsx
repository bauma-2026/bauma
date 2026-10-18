/**
 * Faithful, non-interactive reconstruction of the real Flexido "Rešitve"
 * hub page's "Področja" section (flexido.eu/resitve, id="resitve-grid").
 *
 * Source of truth (verified against the live flexido-next repo):
 * - Copy: src/content/solutions/hub/sl.ts (gridEyebrow, gridHeading, gridBody, gridItems)
 * - Markup/typography: src/components/solutions/SolutionsHubTemplate.tsx (resitve-grid section)
 *   + src/components/ui/RuledRowList.tsx ("nav" variant) + src/components/ui/SectionHeader.tsx
 * - Tokens ported 1:1 from app/globals.css (.eyebrow, .text-section-title, .text-body,
 *   .measure-prose, .surface-muted) rather than importing that stylesheet, since it
 *   defines the same class names as this site's own globals with different values.
 *
 * Deliberately not the real component: rows render as static markup (no <Link>, no
 * href, no hover state, no cursor change) — this is a visual proof, not a working
 * nav — and the block is scoped to the system font stack so it doesn't inherit this
 * site's Inter/font-sans, matching the real page's untouched browser default.
 */

const SYSTEM_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

type Area = {
  title: string;
  desc: string;
};

const AREAS: Area[] = [
  { title: "CNC stroji", desc: "Nalaganje, odvzem in boljši izkoristek stroja." },
  { title: "Brizganje plastike", desc: "Stabilen cikel, odvzem kosov in manj ročnega dela." },
  { title: "Manipulacija materiala", desc: "Premikanje, obračanje in prenos kosov med fazami." },
  { title: "Paletizacija in interna logistika", desc: "Ko material ne teče gladko skozi proizvodnjo." },
  { title: "Avtomatizacija proizvodnje", desc: "Ko želite povezati več korakov procesa v stabilen tok." },
  { title: "Namenski sistemi", desc: "Ko standardna rešitev ne pokrije prostora, kosov in realnega poteka dela." },
  { title: "Kolaborativni roboti", desc: "Pomoč pri ponavljajočih se nalogah in delu z operaterjem." },
];

export default function FlexidoAreasProof() {
  return (
    <div
      className="bg-[#f2f2f2] text-neutral-950"
      style={{ fontFamily: SYSTEM_FONT_STACK }}
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-[760px]">
          <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-600">
            Področja
          </p>
          <h2 className="mt-3 text-balance text-[30px] font-semibold leading-[1.06] tracking-[-0.04em] text-neutral-950 sm:text-[36px] lg:text-[44px]">
            Kje se vaš proces ustavlja?
          </h2>
          <p className="mt-5 max-w-[58ch] text-balance text-[15px] leading-6 text-neutral-600 sm:text-base sm:leading-[26px]">
            Začnite pri delu proizvodnje, kjer nastajajo zastoji, ročni koraki ali čakanje med fazami.
          </p>
        </div>

        <ol className="mt-8 list-none border-b border-neutral-200 lg:mt-10">
          {AREAS.map((area, index) => (
            <li key={area.title} className="border-t border-neutral-200 py-5">
              <div className="grid max-w-[42rem] grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-3 sm:gap-x-4">
                <span className="text-[12px] font-medium tabular-nums tracking-[0.14em] text-neutral-600">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span className="text-[18px] font-semibold leading-[1.2] tracking-[-0.02em] text-neutral-950 sm:text-[19px]">
                    {area.title}
                    <span aria-hidden="true" className="ml-2.5 inline-block text-[14px] font-normal text-neutral-300">
                      →
                    </span>
                  </span>

                  <span className="mt-1.5 block max-w-[48ch] text-[14px] leading-[22px] text-neutral-600">
                    {area.desc}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
