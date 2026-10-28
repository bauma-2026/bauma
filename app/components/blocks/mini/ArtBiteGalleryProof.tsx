import Image from "next/image";

/**
 * Compact reconstruction of the featured strip of the ArtBite gallery page
 * (artbite-tattoo.com/tatuji), shown directly on the case-study surface (ArtBite's
 * own #17110d), without a frame.
 *
 * Source of truth (local artbite-next, matches the live site):
 * - src/app/tatuji/page.tsx: the introduction (eyebrow "Galerija", H1 "Tatuji",
 *   the lead) and the `featuredImages` strip: eight tiles cropped to 0.72 / 1,
 *   `rounded-xl`, a hairline border, a black base, in one row with a 16px gap
 *   from 1024px, the third and the sixth raised 8px.
 * - Tokens from src/app/globals.css: #17110d, #f5f0e8, #bdb0a2, eyebrow #c9624a.
 *   Font: the system sans stack.
 * - Images, unedited (768 px wide, the studio's own watermark included), in the
 *   original order: gallery 045, 092, 023, 067, 084, 116, 001, 040.
 *
 * Only the strip, not the masonry below it. Below 1024px the eight photographs are a
 * native scroll-snap row (focusable, swipe or arrow keys, the next photograph
 * peeking in) at the same 0.72 crop, in place of the site's four-column grid.
 * Static: no lightbox, no hover motion.
 *
 * The heading is a level-2 heading; the page owns the only H1.
 */

const FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const ALTS = [
  "Realističen tattoo na koži",
  "Detajlno izdelan tattoo",
  "Tattoo v realističnem slogu",
] as const;

/** The original featured strip, in order. */
const FEATURED = [
  "045",
  "092",
  "023",
  "067",
  "084",
  "116",
  "001",
  "040",
] as const;

/** One `sizes` for the row and the slider, so both resolve to the same file at a given width. */
const SIZES =
  "(min-width: 1280px) 140px, (min-width: 1024px) 12vw, (min-width: 640px) 26vw, 46vw";
const src = (id: string) => `/work/artbite/proof/gallery-${id}.webp`;

const TILE =
  "relative block aspect-[0.72/1] overflow-hidden rounded-xl border border-[#f5f0e8]/10 bg-black";
const SHADE = "pointer-events-none absolute inset-0 bg-black/[0.04]";

function Tile({ id, index }: { id: string; index: number }) {
  return (
    <div className={TILE}>
      <Image
        src={src(id)}
        alt={ALTS[index % ALTS.length]}
        fill
        sizes={SIZES}
        quality={85}
        className="object-cover"
      />
      <div className={SHADE} />
    </div>
  );
}

/** Bauma's label for the scrollable row (Slovenian by default; the English case study passes its own). */
const DEFAULT_LABEL = "Izbor tatujev";

/**
 * `contentLang` / `labelLang` (unset on the Slovenian page, so nothing is rendered there): on a page in another
 * language they mark the client's Slovenian copy and alt texts, and the row's label in the page's language.
 */
export default function ArtBiteGalleryProof({
  label = DEFAULT_LABEL,
  contentLang,
  labelLang,
}: {
  label?: string;
  contentLang?: string;
  labelLang?: string;
}) {
  return (
    <div
      className="mini-page-rail text-[#f5f0e8] antialiased [text-rendering:auto]"
      style={{ fontFamily: FONT_STACK }}
      lang={contentLang}
    >
      <div className="max-w-[52ch]">
        <p className="text-[11px] font-medium uppercase leading-normal tracking-[0.1em] text-[#d4705a]">
          Galerija
        </p>

        <h2 className="mt-5 max-w-[10ch] text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-[56px]">
          Tatuji
        </h2>

        <p className="mt-5 max-w-[48ch] text-[17px] leading-7 text-[#bdb0a2]">
          Izbor del iz studia Artbite — različni motivi, stili in pristopi,
          ustvarjeni v sodelovanju s strankami.
        </p>
      </div>

      {/* BELOW 1024: native scroll-snap row of the eight photographs */}
      <div
        role="region"
        aria-label={label}
        lang={labelLang}
        tabIndex={0}
        className="-mx-6 mt-8 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-pl-6 px-6 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x_pan-y] focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-[#f5f0e8]/50 lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex list-none gap-3" lang={contentLang}>
          {FEATURED.map((id, i) => (
            <li
              key={id}
              className="w-[46%] min-w-[46%] shrink-0 snap-start sm:w-[26%] sm:min-w-[26%]"
            >
              <Tile id={id} index={i} />
            </li>
          ))}
          <li
            aria-hidden="true"
            className="w-px min-w-px shrink-0 snap-start"
          />
        </ul>
      </div>

      {/* FROM 1024: the strip, one row of eight */}
      <ul className="mt-10 hidden list-none grid-cols-8 gap-4 lg:grid">
        {FEATURED.map((id, i) => (
          <li key={id} className={i === 2 || i === 5 ? "-translate-y-2" : ""}>
            <Tile id={id} index={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
