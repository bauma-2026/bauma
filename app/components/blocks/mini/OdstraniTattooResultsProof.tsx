import Image from "next/image";

/**
 * Faithful, non-interactive excerpt of the "Realni primeri odstranjevanja"
 * section on the odstranitattoo.si home page. Used by /work/odstrani-tattoo (approved in /lab/odstrani-results).
 *
 * Source of truth (local odstranitattoo-next, matches the live site):
 * - Copy and card markup: components/home/ResultsSection.tsx (the first entry of
 *   `resultsPreview`: the astronaut, before and after 3 treatments), with the
 *   `section-sm`, `header-stack`, `eyebrow-muted`, `heading-section`,
 *   `text-body-lg`, `text-body-sm` and `image-block` helpers from app/globals.css
 *   expanded inline.
 * - Tokens: that site re-maps `white` (#fdfcfa) and the `neutral-*` ramp to warm
 *   values and sets the page canvas to #FAF8F4, so every colour is a literal hex.
 *   Arial, as on the site (Satoshi is wired but never applied).
 * - Photographs: public/images/results/3before.webp (553 x 780) and
 *   3after3tretma.webp (527 x 780), copied unchanged to public/work/odstrani-tattoo/proof/.
 *   Both use the source's own 4:5 object-cover crop, so the pair stays comparable.
 *
 * Deliberately different from the source:
 * - An excerpt: one of the three cards and no closing "Pošlji povpraševanje →" link.
 * - Layout: two columns from 640px instead of three from 1024px, with only the
 *   left card; the right column stays empty. Each before/after half stays near the
 *   photographs' own resolution (about 150-280 CSS px).
 * - Static: no hover border, no links. The embedding page exposes the block as
 *   one labelled image.
 * - The section's top hairline is dropped: the proof frame is its edge.
 */

const FONT_STACK = "Arial, Helvetica, sans-serif";

const GUTTERS =
  "mx-auto w-full max-w-[1280px] px-5 @min-[640px]:px-6 @min-[1024px]:px-8 @min-[1280px]:px-10";

const SIZES = "(min-width: 1280px) 280px, (min-width: 640px) 22vw, 45vw";

export default function OdstraniTattooResultsProof() {
  return (
    <div
      className="@container bg-[#FAF8F4] text-[#241F1B] antialiased [text-rendering:auto]"
      style={{ fontFamily: FONT_STACK }}
    >
      <div className="py-12 @min-[640px]:py-14 @min-[1024px]:py-16">
        <div className={GUTTERS}>
          <div className="flex flex-col gap-10 @min-[640px]:gap-12">
            {/* HEADER */}
            <div className="flex max-w-3xl flex-col gap-4 @min-[640px]:gap-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#78716c]">
                Rezultati
              </p>

              <p className="text-3xl font-semibold leading-[1.1] tracking-tight text-[#0c0a09] @min-[640px]:text-4xl">
                Realni primeri odstranjevanja
              </p>

              <p className="max-w-[56ch] text-lg leading-[1.6] text-[#44403c]">
                Spodaj so primeri, kako tattoo skozi več tretmajev postopoma
                bledi in kako se rezultat razvija skozi čas.
              </p>

              <p className="max-w-[52ch] text-sm leading-[1.6] text-[#57534e]">
                Primeri niso obljuba enakega rezultata za vsak tattoo, ampak
                realen prikaz napredka glede na pigment, globino nanosa in odziv
                kože.
              </p>
            </div>

            {/* GRID: two columns from 640px with only the left card; the right column stays empty */}
            <div className="grid gap-6 pt-2 @min-[640px]:grid-cols-2">
              <div className="overflow-hidden rounded-[14px] border border-[#e7e5e4]/60 bg-[#fdfcfa]">
                <div className="grid grid-cols-2 gap-[2px] overflow-hidden bg-[#f5f5f4]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/work/odstrani-tattoo/proof/3before.webp"
                      alt=""
                      fill
                      sizes={SIZES}
                      className="object-cover"
                    />

                    <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur">
                      Pred
                    </span>
                  </div>

                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/work/odstrani-tattoo/proof/3after3tretma.webp"
                      alt=""
                      fill
                      sizes={SIZES}
                      className="object-cover"
                    />

                    <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#fdfcfa]/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#1c1917] backdrop-blur">
                      Po
                    </span>
                  </div>
                </div>

                <div className="p-5 @min-[640px]:p-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#78716c]">
                      po 3 tretmajih
                    </p>

                    <p className="text-[1.02rem] leading-7 tracking-[-0.02em] text-[#1c1917]">
                      Postopno bledenje tattooja
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
