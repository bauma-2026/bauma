import { useId } from "react";
import Image from "next/image";

/**
 * Faithful, non-interactive reconstruction of the "Reference" section on the
 * new Dema Plus site (Next.js, served at demaplus.si since the V1.5 launch
 * commit; checked live on 2026-10-12), limited to the section header and the
 * first three project cards, with an optional strip of the site's real header
 * above it.
 *
 * Source of truth: the local demaplus-next repo at HEAD, whose output matches
 * the live site (it carries the V1.5 intro copy, section padding, one-line
 * excerpts and mobile fade).
 * - Section, header, slider and grid: src/components/home/FeaturedProjects.tsx
 *   (card order follows src/content/projects.generated.ts, not the slug list
 *   in that component's filter).
 * - Titles/excerpts: src/content/projects.generated.ts.
 * - Container: src/components/layout/Container.tsx (max-w-7xl, fixed px-5).
 * - Header strip: src/components/layout/Header.tsx (solid, scrolled state),
 *   brand/DemaPlusLogo.tsx (paths copied unchanged).
 * - Tokens: that site uses Tailwind's default neutral ramp (its remaps in
 *   globals.css are overridden by utilities) and the system font stack, so no
 *   font files are loaded. Values are written as literals so a Bauma theme
 *   change cannot shift them.
 * - Images: public/reference/<slug>/hero.webp, copied byte-identical.
 *
 * Responsive logic is the original's, but breakpoints are container queries
 * (`@min-[640px]` / `@min-[768px]` / `@min-[1024px]` = sm / md / lg) so the
 * layout follows the width this block is given, not the browser viewport.
 * Below 640 the source shows a native scroll-snap slider; that is kept as is.
 *
 * Deliberately different from the source:
 * - Only the first three cards are rendered (the source renders six). In the
 *   two-column range (640-1023) the third is hidden, so it does not sit alone
 *   on a second row; the source's six cards always fill complete rows.
 * - Static: no links, hover states, GSAP scroll-in or hover motion. The slider
 *   is the one interactive element and is native scrolling, made keyboard
 *   focusable. Its focus indicator is an inset 2px outline in the logo's blue
 *   grey (about 3.6:1 on white); the source's pale 4px shadow is too faint here
 *   and would be clipped at the edges of the proof.
 * - The header strip is aria-hidden and inert.
 * - Headings are configurable so the block never adds a document-level h1.
 */

const FONT_STACK =
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const PROJECTS = [
  {
    title: "Vila Rožna dolina",
    excerpt:
      "Nizkoenergijski večstanovanjski objekt v Rožni dolini z devetimi stanovanji, leseno konstrukcijo in urejeno zunanjo ureditvijo.",
    image: "/work/dema-plus/proof/vila-rozna-dolina.webp",
  },
  {
    title: "Hotel Nox Ljubljana",
    excerpt:
      "Sodoben poslovno-hotelski objekt v Ljubljani z razstavnim salonom pohištva v pritličju in hotelskimi sobami v nadstropjih.",
    image: "/work/dema-plus/proof/hotel-nox.webp",
  },
  {
    title: "Hotel Cubo",
    excerpt:
      "Prenova spomeniško zaščitenega objekta v središču Ljubljane v sodoben butični hotel z restavracijo in kavarno.",
    image: "/work/dema-plus/proof/hotel-cubo.webp",
  },
] as const;

const NAV = ["Domov", "Reference", "O nas"];

/**
 * Shared by the slider and grid images on purpose: the hidden variant is still
 * fetched by browsers, and identical `sizes` makes both resolve to the same
 * optimized URL, so each photo downloads once. Covers the widest slide (86% of
 * a sub-640 column) and the widest grid card (about 387px).
 */
const IMAGE_SIZES = "(min-width: 1024px) 400px, (min-width: 640px) 350px, 86vw";

/** Slight darkening and tonal wash the source lays over every card image. */
function CardOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
      <div className="absolute inset-0 bg-[#000000]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/35 via-transparent to-[#ffffff]/10" />
    </div>
  );
}

function DemaPlusLogo({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 294.4 64.4"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      focusable="false"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M10.6,39.4h5.7V22h-5.7c-1.3,0-2.3,1-2.3,2.3v12.9C8.2,38.5,9.2,39.4,10.6,39.4 M24.5,5v38.6
        c0,2.2-2,4.1-4.1,4.1h-9.8C4.2,47.7,0,43.5,0,37.1V24.3c0-6.1,4.4-10.6,10.6-10.6h5.7V5c0-2.3,1.9-4.2,4.1-4.2
        C22.6,0.8,24.5,2.7,24.5,5z"
      />
      <path
        fill="currentColor"
        d="M194.2,38V23.7c0-1.4-0.4-2.4-1.4-3.4c-1-1-1.9-1.3-3.3-1.3h-9.8v23.7h9.8c1.4,0,2.4-0.4,3.3-1.4
        C193.9,40.4,194.2,39.4,194.2,38 M199,38c0,2.9-0.6,4.8-2.7,6.8c-2.1,2-3.9,2.7-6.8,2.7h-9.8v14.4c0,1.3-1.1,2.4-2.4,2.4
        c-1.3,0-2.4-1.1-2.4-2.4V47.4h-14.4c-1.3,0-2.3-1.1-2.3-2.3c0-1.3,1.1-2.4,2.3-2.4H175V16.6c0-0.6,0.3-1.1,0.8-1.6
        c0.5-0.5,0.9-0.8,1.6-0.8h12.1c2.8,0,4.8,0.6,6.8,2.6c2.1,2.1,2.6,4,2.6,6.8V38z"
      />
      <path
        fill="currentColor"
        d="M45.5,26.5l8.9-0.1c0-2.4-2-4.4-4.4-4.4C47.4,22,45.5,24.1,45.5,26.5 M61.4,40.6c0.7,0.7,1.2,1.8,1.2,2.9
        c0,2.3-1.9,4.1-4.1,4.1H47.7c-3,0-5.4-0.8-7.6-3.1c-2.1-2.2-2.9-4.4-2.9-7.4v-8.6l0.1-2.2c0.2-6.8,5.6-12.7,12.7-12.7
        c7.1-0.1,12.7,5.8,12.7,12.7v4.3c0,1-0.3,2-1,2.7c-0.8,0.9-1.9,1.4-3.1,1.4h-13v2.3c0,1.4,0.8,2.2,2.2,2.2h10.7
        C59.6,39.4,60.6,39.8,61.4,40.6z"
      />
      <path
        fill="currentColor"
        d="M109.3,24.3v19.3c0,2.2-1.9,4.1-4.2,4.1c-2.3,0-4.1-1.9-4.1-4.1V24.3c0-1.4-0.9-2.3-2.3-2.3h-2.2v21.6
        c0,2.2-1.9,4.1-4.2,4.1c-2.3,0-4.1-1.9-4.1-4.1V22h-4.6v21.6c0,2.2-1.9,4.1-4.2,4.1c-2.3,0-4.1-1.9-4.1-4.1V17.8
        c0-1.2,0.5-2.4,1.4-3.2c0.7-0.6,1.6-1,2.7-1h19.3c3,0,5.4,0.9,7.6,3.1C108.4,18.9,109.3,21.2,109.3,24.3"
      />
      <path
        fill="currentColor"
        d="M130.9,34.8c-0.2,0.6-0.3,1.4-0.3,2.3c0,0.5,0,1.8,0.3,2.3c-0.1,0-0.2-0.1-0.2-0.1h8.7v-4.6H130.9 M147.8,24.3
        v19.3c0,0.9-0.3,1.8-0.9,2.7c-0.9,1-1.9,1.5-3.2,1.5h-12.9c-5.9,0-8.4-6.1-8.4-10.6c0-4.5,2.5-10.6,8.4-10.6h8.7v-2.2
        c0-1.3-1-2.3-2.3-2.3h-8.6c-2.3,0-4.2-1.9-4.2-4.1c0-2.3,1.9-4.2,4.2-4.2h8.6C143.3,13.6,147.8,18.2,147.8,24.3z"
      />
      <path
        fill="currentColor"
        d="M223.6,45.1c0-0.1,0.2-1.6-1.2-2.1c-0.8-0.4-1.8-1-2.5-2c-0.9-1.1-1-2.1-1-3V2.4c0-1.3-1.1-2.4-2.4-2.4
        s-2.4,1.1-2.4,2.4V38c0,2.1,0.4,4.1,2.1,6.1c0.9,1.1,2,2.3,4.1,3.1C221.2,47.6,223.8,47.5,223.6,45.1"
      />
      <path
        fill="currentColor"
        d="M260.9,45.1V16.6c0-1.3-1.1-2.4-2.4-2.4c-1.3,0-2.4,1.1-2.4,2.4v26.1h-9.5c-1.4,0-2.4-0.3-3.4-1.3
        c-1-1-1.3-2-1.3-3.4V16.6c0-1.3-1.1-2.4-2.4-2.4c-1.3,0-2.4,1.1-2.4,2.4V38c0,2.8,0.6,4.7,2.6,6.7c2.1,2.1,4.1,2.8,6.9,2.8h11.9
        c0.7,0,1.2-0.1,1.7-0.6C260.7,46.3,260.9,45.8,260.9,45.1"
      />
      <path
        fill="currentColor"
        d="M294.4,39.1c-0.1-2.2-0.4-3.3-2.2-5.3l-11.4-9.7c-0.4-0.6-0.6-1-0.6-1.6c0-2.2,2.4-3.6,4.7-3.6
        c1.8,0,3.3,0.5,5.3,1.1c1.9,0.5,3.1-0.7,3.1-2.3c0-1-0.4-1.8-1.6-2.1c-1.9-0.6-4.1-1.4-6.8-1.4c-3.7,0-9.5,1.7-9.5,8.3
        c0,2.4,0.7,3.8,2.4,5.5l11,9.3c1,0.9,0.9,1.1,0.9,1.8c0,2.3-2.4,3.6-4.8,3.6c-3.3,0.1-4.8-0.8-6.5-1.1c-1.4-0.3-3.1,0.9-3,2.4
        c0,1,0.5,1.8,1.4,2.1c3.5,1.1,4.8,1.4,8.1,1.5C289.7,47.5,294.6,44.1,294.4,39.1"
      />
    </svg>
  );
}

function HeaderStrip() {
  return (
    <div
      aria-hidden="true"
      inert
      className="border-b border-[#eceff2] bg-[#ffffff] text-[oklch(0.205_0_0)] shadow-[0_1px_0_rgba(15,23,42,0.03)]"
    >
      <div className="relative mx-auto flex h-[64px] max-w-[80rem] items-center justify-between px-5">
        <span className="inline-flex items-center leading-none text-[#6f8895]">
          <DemaPlusLogo className="h-[24px] w-auto @min-[1024px]:h-[26px]" />
        </span>

        <div className="hidden items-center gap-6 @min-[768px]:flex @min-[1024px]:gap-8">
          <div className="flex items-center gap-7 text-sm">
            {NAV.map((label, i) => (
              <span
                key={label}
                className={[
                  "border-b pb-1",
                  i === 0
                    ? "border-b-[#6f8895] text-[oklch(0.205_0_0)]"
                    : "border-b-transparent text-[oklch(0.371_0_0)]",
                ].join(" ")}
              >
                {label}
              </span>
            ))}
          </div>

          <span className="rounded-full border border-[oklch(0.205_0_0)] bg-[oklch(0.205_0_0)] px-5 py-[7px] text-sm text-[#ffffff]">
            Kontakt
          </span>
        </div>

        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[oklch(0.922_0_0)] bg-[#ffffff] text-[oklch(0.205_0_0)] shadow-[0_2px_10px_rgba(15,23,42,0.08)] @min-[768px]:hidden">
          <span className="absolute block h-[2px] w-[15px] -translate-y-[3px] rounded-full bg-[oklch(0.205_0_0)]" />
          <span className="absolute block h-[2px] w-[15px] translate-y-[3px] rounded-full bg-[oklch(0.205_0_0)]" />
        </span>
      </div>
    </div>
  );
}

export default function DemaPlusReferencesProof({
  showHeader = true,
  headingLevel = 3,
  allowVerticalPan = false,
}: {
  /** Strip of the real site header above the section. */
  showHeader?: boolean;
  /** Level of the section heading; project titles sit one level below. */
  headingLevel?: 2 | 3 | 4;
  /**
   * Mobile slider: `pan-x pan-y` instead of the source's `pan-x`, so a vertical swipe that starts on the cards
   * still scrolls the page. Opt-in; other callers keep the source behaviour.
   */
  allowVerticalPan?: boolean;
}) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const CardHeading = `h${headingLevel + 1}` as "h3" | "h4" | "h5";

  return (
    <div
      className="@container bg-[#ffffff] text-[#111827] antialiased [text-rendering:geometricPrecision]"
      style={{ fontFamily: FONT_STACK }}
    >
      {showHeader ? <HeaderStrip /> : null}

      <section
        aria-labelledby={headingId}
        className="bg-[#ffffff] pb-10 pt-12 @min-[640px]:pb-14 @min-[640px]:pt-16 @min-[1024px]:pb-16 @min-[1024px]:pt-20"
      >
        <div className="mx-auto max-w-[80rem] px-5">
          <div>
            <div className="flex flex-col gap-5 @min-[640px]:flex-row @min-[640px]:items-start @min-[640px]:justify-between @min-[640px]:gap-6">
              <div className="max-w-2xl">
                <p className="text-[11px] font-medium uppercase leading-[1.5] tracking-[0.1em] text-[oklch(0.556_0_0)]">
                  Reference
                </p>

                <Heading
                  id={headingId}
                  className="mt-2 text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[oklch(0.205_0_0)] @min-[640px]:text-[36px] @min-[640px]:leading-[1.05]"
                >
                  Projekti, ki govorijo
                  <br className="@min-[640px]:hidden" /> namesto nas.
                </Heading>

                <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.625] text-[oklch(0.556_0_0)]">
                  Izbor projektov, ki pokažejo širino izvedbe in način dela.
                </p>
              </div>
            </div>

            {/* MOBILE SLIDER — below 640: native scroll snap, keyboard-focusable */}
            <div className="relative -mx-5 mt-8 @min-[640px]:hidden">
              <div
                role="region"
                aria-labelledby={headingId}
                tabIndex={0}
                className={`snap-x snap-mandatory ${allowVerticalPan ? "[touch-action:pan-x_pan-y]" : "touch-pan-x"} overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-pl-5 px-5 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#6f8895] [&::-webkit-scrollbar]:hidden`}
              >
                <div className="flex gap-4 pr-5">
                  {PROJECTS.map((project) => (
                    <div
                      key={project.title}
                      className="w-[86%] min-w-[86%] shrink-0 snap-start"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[oklch(0.97_0_0)]">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes={IMAGE_SIZES}
                          className="object-cover contrast-[1.02] saturate-[0.9]"
                        />
                        <CardOverlay />
                      </div>

                      <div className="mt-2 pr-2">
                        <p className="text-[13px] text-[oklch(0.439_0_0)]">
                          {project.title}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div
                    aria-hidden="true"
                    className="w-[0.5px] min-w-[0.5px] shrink-0 snap-start"
                  />
                </div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-7 right-0 top-0 w-8 bg-gradient-to-l from-[#ffffff]/55 via-[#ffffff]/15 to-transparent"
              />
            </div>

            {/* GRID — 640 and up: two columns, three from 1024 */}
            <div className="mt-10 hidden gap-x-8 gap-y-10 @min-[640px]:grid @min-[640px]:grid-cols-2 @min-[1024px]:grid-cols-3 @min-[1024px]:gap-x-10">
              {PROJECTS.map((project, index) => (
                <div
                  key={project.title}
                  className={index === 2 ? "block @max-[1024px]:hidden" : "block"}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[oklch(0.97_0_0)]">
                    <div className="absolute inset-0">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes={IMAGE_SIZES}
                        className="object-cover contrast-[1.02] saturate-[0.9]"
                      />
                    </div>
                    <CardOverlay />
                  </div>

                  <div className="mt-4 space-y-2">
                    <CardHeading className="text-[15px] font-medium leading-[1.3] tracking-[-0.025em] text-[oklch(0.205_0_0)]">
                      {project.title}
                    </CardHeading>

                    <p className="mt-1.5 line-clamp-1 text-[13px] leading-[1.625] text-[oklch(0.439_0_0)]">
                      {project.excerpt}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-xs leading-4 text-[oklch(0.439_0_0)]">
                      <span>Poglej projekt</span>
                      <span className="translate-y-[0.5px] text-[oklch(0.708_0_0)]">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 @min-[640px]:mt-8">
              <span className="inline-flex items-center gap-2 text-sm text-[oklch(0.556_0_0)]">
                <span>Vse reference</span>
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
