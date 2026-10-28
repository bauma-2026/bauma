import Image from "next/image";

/**
 * "Visual Proof" of the Ulterior hardshell page (ulterior.es/hardshell), shown
 * directly on the case-study surface: the photography carries the section, so
 * there is no light card around it.
 *
 * Source of truth (local ulterior-next, matches the live page):
 * - src/app/hardshell/page.tsx, the `PRODUCT VIEWS` section: eyebrow "Visual
 *   proof", heading "The shell is quiet, but not generic.", the lead, and the
 *   three views `productViews` with their labels (Profile view, Rear hood
 *   detail, Back view). Copy is kept in English, as on the site.
 * - Images, unedited (680 x 680), each on the original warm off-white plate
 *   #f5f4f1:
 *   - Profile view: images/product/hardshell/hardshell-green-front.webp
 *     (identical to hardshell-green-side-01.webp, already used by the purchase
 *     proof)
 *   - Rear hood detail: ...680x680-2-2.webp
 *   - Back view: ...680x680-3-3.webp
 *
 * The original is a white section with the heading above a three-column grid.
 * Here the type is set in the case-study's own light-on-dark styling, the tiles
 * keep the original square plates and uppercase labels. From 640px the three
 * views sit in a grid; below that they are a native scroll-snap slider (the
 * Dema Plus references pattern): focusable region, swipe or arrow keys, the
 * next photograph peeking in, no controls. The heading is a level-2 heading;
 * the page owns the only H1.
 */

const VIEWS = [
  {
    src: "/work/ulterior/proof/hardshell-green-side-01.webp",
    alt: "Ulterior green hardshell jacket profile view",
    label: "Profile view",
  },
  {
    src: "/work/ulterior/proof/ulterior-green-hardshell-jacket-680x680-2-2.webp",
    alt: "Ulterior green hardshell jacket rear hood detail",
    label: "Rear hood detail",
  },
  {
    src: "/work/ulterior/proof/ulterior-green-hardshell-jacket-680x680-3-3.webp",
    alt: "Ulterior green hardshell jacket back view",
    label: "Back view",
  },
] as const;

type View = (typeof VIEWS)[number];

/** One photograph on its plate with its label; the same markup is used by the slider and the grid, with one `sizes` so both resolve to the same file. */
function ViewTile({ view }: { view: View }) {
  return (
    <figure lang="en">
      <div className="overflow-hidden rounded-[6px] bg-[#f5f4f1] sm:rounded-[8px]">
        <Image
          src={view.src}
          alt={view.alt}
          width={680}
          height={680}
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 31vw, 82vw"
          quality={90}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em] text-white/60">
        {view.label}
      </figcaption>
    </figure>
  );
}

/** Bauma's label for the scrollable row (Slovenian by default; the English case study passes its own). */
const DEFAULT_LABEL = "Hardshell: pogledi izdelka";

export default function UlteriorVisualProof({ label = DEFAULT_LABEL }: { label?: string }) {
  return (
    <div className="mini-page-rail">
      <div lang="en" className="max-w-[40rem]">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
          Visual Proof
        </p>

        <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.25rem]">
          The shell is quiet, but not generic.
        </h2>

        <p className="mt-4 max-w-[36rem] text-base leading-[1.65] text-white/70">
          The hardshell is the clearest product expression of Ulterior: simple
          in silhouette, technical in purpose, and restrained in how it presents
          itself.
        </p>
      </div>

      {/* MOBILE: native scroll-snap slider (below 640), as in the Dema Plus references: focusable, arrow keys and swipe, the next photograph peeks in */}
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-6 mt-8 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-pl-6 px-6 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x_pan-y] focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-white/50 sm:hidden [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex list-none gap-3">
          {VIEWS.map((view) => (
            <li
              key={view.label}
              className="w-[82%] min-w-[82%] shrink-0 snap-start"
            >
              <ViewTile view={view} />
            </li>
          ))}
          <li
            aria-hidden="true"
            className="w-px min-w-px shrink-0 snap-start"
          />
        </ul>
      </div>

      {/* TABLET AND DESKTOP: three columns */}
      <ul className="mt-10 hidden list-none gap-5 sm:grid sm:grid-cols-3 lg:gap-6">
        {VIEWS.map((view) => (
          <li key={view.label}>
            <ViewTile view={view} />
          </li>
        ))}
      </ul>
    </div>
  );
}
