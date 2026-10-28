import type { Metadata } from "next";
import { slPageMetadata } from "@/lib/indexing";
import Image from "next/image";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/** Homepage typography foundation (scoped to `[data-home-typography]`, set below). */
import "../homeTypography.css";
import "./ArtBiteSurface.css";
import "./WorkPosters.css";
import { homeMono } from "../homeMono";
import MiniClosingBookend from "../components/blocks/mini/MiniClosingBookend";
import MiniHeader, {
  type MiniHeaderNavItem,
} from "../components/blocks/mini/MiniHeader";
import MiniPalette from "../components/blocks/mini/MiniPalette";
import SelectedWorkMotion, {
  type MotionSurfaceId,
} from "../components/blocks/mini/SelectedWorkMotion";
import {
  DemaSurface,
  FlexidoSurface,
  OdstraniSurface,
} from "../components/blocks/mini/MiniSelectedWorkSurfaces";

/**
 * `/work`: three rows of two 4:3 surfaces, in the reading order Flexido, Ulterior / Odstrani Tattoo, Dema Plus /
 * ArtBite, Hardshelljacket. At 1440px the rail is 1216px: two 584px columns, a 48px gap, 438px surfaces, 60px between rows.
 * 4:3 holds from an 898px viewport (a card width of 405px); from 640 to there the surfaces are 19rem (304px) high; below 640
 * one column of squares. The shared surfaces (Flexido, Odstrani, Dema Plus) are also used by the homepage and are not
 * modified: their fixed heights, Flexido's line width and size are overridden from the link, here only.
 */

/**
 * The ArtBite logo face for the ArtBite surface, as on artbite-tattoo.com (artbite-next `src/app/layout.tsx` and
 * `src/components/layout/Header.tsx`): Fraunces, upright, variable (weight 560 and the WONK / opsz axes are set in
 * ArtBiteSurface.css). Scoped to this route.
 */
const artbiteLogo = Fraunces({
  subsets: ["latin"],
  style: "normal",
  axes: ["opsz", "WONK"],
  variable: "--font-artbite-logo",
  display: "swap",
});

const TITLE = "Izbrani spletni projekti — Bauma";
const DESCRIPTION =
  "Izbor spletnih strani in digitalnih rešitev. Izhodišča projektov, odločitve pri zasnovi ter povezava med vsebino, oblikovanjem in razvojem.";

export const metadata: Metadata = slPageMetadata(
  "/work",
  { title: TITLE, description: DESCRIPTION },
);

const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

const SURFACE_WORK = {
  "--mini-surface-work": "#0f141c",
} as CSSProperties;

/** Square below `sm`. The shared surfaces carry fixed heights, so they are overridden from the link. */
const MOBILE_SQUARE = "max-sm:[&_.swm>div]:aspect-square max-sm:[&_.swm>div]:h-auto max-sm:[&_.swm>div]:min-h-auto";

/**
 * 4:3 from a 898px viewport (a card width of 405px); from `sm` (640px) to there the surfaces keep the approved 19rem
 * (304px) height, as on `/work`. Below 405px wide 4:3 is shorter than that: Flexido's two statements end up 12px apart at
 * 340 x 255 and the Hardshelljacket headline reaches the hood, where 304px keeps 61px between the statements and clears
 * it. (A `min-height` of 19rem does not work: with an aspect ratio it widens the card instead.) The shared surfaces
 * (Flexido, Odstrani, Dema Plus) take the ratio from the link, overriding their fixed heights.
 */
const SHARED_43 = "min-[898px]:[&_.swm>div]:h-auto min-[898px]:[&_.swm>div]:min-h-auto min-[898px]:[&_.swm>div]:aspect-[4/3]";

/**
 * Responsive size caps for Flexido's two statements (the `!` beats the surface's inline font-size): they keep about 1.4em
 * between the statements at intermediate widths. The caps do not bind at 1440px, and nothing applies below 640px.
 */
const FLEXIDO_SIZE =
  "min-[898px]:[&_[data-surface=flexido]_p]:[font-size:min(3.1rem,9.5cqw)]! sm:max-[898px]:[&_[data-surface=flexido]_p]:[font-size:min(11.5cqw,2.45rem)]!";
/**
 * Flexido's first paragraph is justified edge to edge. Limited to 6.85em, its two word gaps are about 2.2 times a normal
 * space (the homepage's 7.5em gives about 3.7 times).
 */
const FLEXIDO_LINE = "[&_[data-surface=flexido]>div>div>p:first-child]:max-w-[6.85em]";

/** Same ring as the header controls (`[data-header-focus]` in globals.css). */
const LINK_FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]";

/**
 * The one response every card link shares: its caption arrow brightens from 48% to 92% and moves 3px right, on hover
 * (devices that hover; Tailwind's `hover` variants are `@media (hover: hover)`) and on keyboard focus alike. In 200ms,
 * out 300ms, cubic-bezier(.25,.8,.25,1). With reduced motion the brightening is immediate and the arrow does not move.
 * Surfaces, photographs, names and descriptors do not respond.
 */
const ARROW_EASE = "ease-[cubic-bezier(.25,.8,.25,1)]";
const ARROW_TINT = `text-white/48 transition-colors duration-300 ${ARROW_EASE} group-hover:text-white/92 group-hover:duration-200 group-focus-visible:text-white/92 group-focus-visible:duration-200 motion-reduce:transition-none`;
const ARROW = `inline-block transition-transform duration-300 ${ARROW_EASE} group-hover:translate-x-[3px] group-hover:duration-200 group-focus-visible:translate-x-[3px] group-focus-visible:duration-200 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0`;

/* --------------------------------------------- local surfaces --------------------------------------------- */

/**
 * Ulterior: the white hardshell hanging from its strap (ulterior-next `lifestyle/hardshell-white-hanging-01.jpg`,
 * unedited), cut just below the truss so the strap comes in from the card's top edge, and Ulterior's original logo with
 * its brand line as one block, the line starting on the wordmark's "u". Beside the jacket on wider cards (the line's last
 * baseline on the hem line), under it on narrower ones. Layout in WorkPosters.css (`.wul`); approved from
 * /lab/work-posters (v3).
 */
function UlteriorSurface() {
  return (
    <div className="wul relative aspect-square overflow-hidden rounded-[3px] sm:max-[898px]:aspect-auto sm:max-[898px]:h-[19rem] min-[898px]:aspect-[4/3] [container-type:size]">
      <Image
        src="/work/ulterior/hardshell-white-hanging.webp"
        alt="Bela hardshell jakna na obešalniku"
        width={1706}
        height={1924}
        sizes="(min-width: 640px) 560px, 92vw"
        quality={85}
        className="wul-photo"
      />
      {/* Part of the artwork: the caption below already names the project for the link. */}
      <div className="wul-group" aria-hidden="true">
        <Image
          src="/work/ulterior/ulterior-logo.svg"
          alt=""
          width={966}
          height={135}
          unoptimized
          className="wul-logo"
        />
        <p className="wul-line">
          <span>Technical protection</span>
          <span>for normal life.</span>
        </p>
      </div>
    </div>
  );
}

/**
 * ArtBite: a poster from ArtBite's own hero, on a solid terracotta ground (#cd664e): the two hero photographs (horses
 * dominant, the watch beside them on one bottom axis; their portrait crops and soft radii) in black and white, and the
 * name "ArtBite" once, in the studio's logo face, in cream. On hover and keyboard focus of the card link both photographs
 * turn to their original colour (ArtBiteSurface.css). The card is a size container and the composition follows its own
 * proportions (ArtBiteSurface.css): narrower than 6:5 (phones, the narrow 19rem cards of the two-column grid) the name
 * runs horizontally above the pair; from 6:5 (4:3 and the wider 19rem cards) it stands vertically, reading upwards,
 * beside the watch. The group is centred in the card. Composition approved from /lab/work-artbite (D6), treatment from
 * /lab/work-artbite-terra (B2), colour response from /lab/work-artbite-color.
 */
function ArtBiteSurface() {
  return (
    <div
      className={`${artbiteLogo.variable} wab wab-terra relative aspect-square overflow-hidden rounded-[3px] sm:max-[898px]:aspect-auto sm:max-[898px]:h-[19rem] min-[898px]:aspect-[4/3] bg-[#cd664e] [container-type:size]`}
    >
      <ArtBiteFilters />
      <div className="wab-group">
        {/* Part of the artwork: the caption below already names the project for the link. */}
        <p className="wab-name" aria-hidden="true">
          ArtBite
        </p>
        <div className="wab-pair">
          <div className="wab-horses">
            <ArtBitePhoto
              src="/work/artbite/hero-2.webp"
              alt="Tetovaža dveh konj z lovilcem sanj"
              sizes="(min-width: 640px) 260px, 45vw"
              position="object-[50%_24%]"
            />
          </div>
          <div className="wab-watch">
            <ArtBitePhoto
              src="/work/artbite/hero-3.webp"
              alt="Tetovaža žepne ure s peresom"
              sizes="(min-width: 640px) 160px, 32vw"
              position="object-[44%_center]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * One ArtBite photograph as two exactly aligned layers from the same source, sizes and crop (one download, identical
 * object-fit and position): the original in colour underneath, which carries the description, and a decorative copy on
 * top that the B2 filter turns black and white (`alt=""`, so the photograph is described once).
 */
function ArtBitePhoto({ src, alt, sizes, position }: { src: string; alt: string; sizes: string; position: string }) {
  return (
    <>
      <Image src={src} alt={alt} fill sizes={sizes} quality={90} className={`wab-colour object-cover ${position}`} />
      <Image src={src} alt="" aria-hidden="true" fill sizes={sizes} quality={90} className={`wab-bw object-cover ${position}`} />
    </>
  );
}

/**
 * The ArtBite photographs' black-and-white filters, in sRGB so the values act on the files as stored. Both: a channel mix of
 * R 0.36 / G 0.50 / B 0.14 (more red than luminance: skin a little lighter, ink stays dark), then a gamma. Horses (the
 * darker photograph): gamma 0.86 to open the mid-tones. Watch: gamma 0.92, then a highlight roll-off (identity up to
 * 0.5, then 0.60 / 0.68 / 0.75 / 0.81 at 0.625 / 0.75 / 0.875 / 1), so its bright dial does not draw the eye from the
 * larger horses while the ink and mid-tones keep their separation.
 */
const BW_MIX = "0.36 0.50 0.14 0 0  0.36 0.50 0.14 0 0  0.36 0.50 0.14 0 0  0 0 0 1 0";
const WATCH_ROLLOFF = "0 0.125 0.25 0.375 0.5 0.6 0.68 0.75 0.81";

function ArtBiteFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="wab-filters">
      <defs>
        <filter id="work-artbite-horses-bw" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={BW_MIX} />
          <feComponentTransfer>
            <feFuncR type="gamma" amplitude="1" exponent="0.86" offset="0" />
            <feFuncG type="gamma" amplitude="1" exponent="0.86" offset="0" />
            <feFuncB type="gamma" amplitude="1" exponent="0.86" offset="0" />
          </feComponentTransfer>
        </filter>
        <filter id="work-artbite-watch-bw" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={BW_MIX} />
          <feComponentTransfer>
            <feFuncR type="gamma" amplitude="1" exponent="0.92" offset="0" />
            <feFuncG type="gamma" amplitude="1" exponent="0.92" offset="0" />
            <feFuncB type="gamma" amplitude="1" exponent="0.92" offset="0" />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="table" tableValues={WATCH_ROLLOFF} />
            <feFuncG type="table" tableValues={WATCH_ROLLOFF} />
            <feFuncB type="table" tableValues={WATCH_ROLLOFF} />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Hardshelljacket: the deep olive jacket on concrete from the site's technical details section (hardshelljacket-next
 * `hardshell/proof/hardshell-green-front-02.webp`, unedited), the whole jacket in frame, the photograph starting at the
 * card's top edge; the page's own H1, "Waterproof Hardshell Jacket", set like the site, with its eyebrow "Ulterior
 * product". Layout in WorkPosters.css (`.whj`); approved from /lab/work-posters (B).
 */
function HardshelljacketSurface() {
  return (
    <div className="whj relative aspect-square overflow-hidden rounded-[3px] sm:max-[898px]:aspect-auto sm:max-[898px]:h-[19rem] min-[898px]:aspect-[4/3] [container-type:size]">
      <Image
        src="/work/hardshelljacket/hardshell-green-front-02.webp"
        alt="Moški v temno olivni hardshell jakni pred betonsko steno"
        width={1254}
        height={1254}
        sizes="(min-width: 640px) 620px, 92vw"
        quality={85}
        className="whj-photo"
      />
      {/* Part of the artwork: the caption below already names the project for the link. */}
      <p className="whj-name" aria-hidden="true">
        <span>Waterproof</span>
        <span>Hardshell</span>
        <span>Jacket</span>
      </p>
      <p className="whj-eyebrow" aria-hidden="true">
        Ulterior product
      </p>
    </div>
  );
}

/* ---------------------------------------------------- page ---------------------------------------------------- */

type Project = {
  slug: string;
  motion?: MotionSurfaceId;
  name: string;
  descriptor: string;
  /** Shared surfaces take the common ratio from the link. */
  shared?: boolean;
  Art: () => ReactNode;
  /** Composition shown from 898px instead of `Art`. */
  Wide?: () => ReactNode;
};

/** DOM order is the reading order: rows of two. Names, descriptors and destinations as on the homepage's Selected Work. */
const PROJECTS: readonly Project[] = [
  { slug: "flexido", motion: "flexido", name: "Flexido", descriptor: "Industrijski B2B", shared: true, Art: FlexidoSurface },
  { slug: "ulterior", name: "Ulterior", descriptor: "Produktna predstavitev in nakupni sistem", Art: UlteriorSurface },
  { slug: "odstrani-tattoo", motion: "odstrani", name: "Odstrani Tattoo", descriptor: "Zaupanje in konverzija", shared: true, Art: OdstraniSurface },
  { slug: "dema-plus", motion: "dema", name: "Dema Plus", descriptor: "Reference in jasnost", shared: true, Art: DemaSurface },
  { slug: "artbite", name: "ArtBite", descriptor: "Spletna stran tattoo studia", Art: ArtBiteSurface },
  { slug: "hardshelljacket", name: "Hardshelljacket", descriptor: "Izdelek na eni strani", Art: HardshelljacketSurface },
];

/** Wraps a typographic surface in the shared entry motion; photographic ones render static. */
function Motion({ p, col, children }: { p: Project; col: 1 | 2; children: ReactNode }) {
  return p.motion ? (
    <SelectedWorkMotion id={p.motion} col={col}>
      {children}
    </SelectedWorkMotion>
  ) : (
    children
  );
}

/** Quiet Editorial caption: name 20px / 500, descriptor 15px / 22px at 70%, no numbering. */
function Caption({ id, name, descriptor }: { id: string; name: string; descriptor: string }) {
  return (
    <div className="mt-2">
      <div className="flex min-h-[44px] items-center justify-between gap-4">
        <h2 id={id} className="text-[1.25rem] font-medium leading-[1.1] tracking-[var(--ht-tr-h3)] text-white">
          {name}
        </h2>
        <span
          aria-hidden="true"
          className={`text-sm font-medium ${ARROW_TINT}`}
        >
          <span className={ARROW}>→</span>
        </span>
      </div>
      <p id={`${id}-desc`} className="-mt-1 text-pretty text-[15px] font-normal leading-[22px] text-white/70">
        {descriptor}
      </p>
    </div>
  );
}

export default function WorkPage() {
  return (
    <div data-home-typography className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader hideApproachNav refined primaryNav={HOME_NAV} contactHref="#contact" />

        <main style={SURFACE_WORK}>
          <section
            data-section="selected-work"
            aria-labelledby="work-heading"
            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-24 text-white sm:pb-12 sm:pt-28 lg:pb-[3.25rem] lg:pt-32"
          >
            <div className="mini-page-rail">
              {/*
               * Intro: the serif H1 on the /o-nas and /pristop scale, then the lead. From `lg` two columns on the grid's own
               * columns and gaps, the lead in the second, its last line level with the foot of the H1.
               */}
              <div data-work-intro className="lg:grid lg:grid-cols-2 lg:items-end lg:gap-x-10 xl:gap-x-12">
                <h1
                  id="work-heading"
                  className="font-serif text-[clamp(2.25rem,1.2rem+4.6vw,4.5rem)] lg:text-[min(5rem,6.4vw)] font-normal leading-none tracking-[-0.025em] text-balance break-words"
                >
                  Izbrani projekti.
                </h1>
                <p
                  data-work-lead
                  className="mt-4 max-w-[34rem] text-pretty text-[1.0625rem] leading-[1.55] text-white/74 sm:mt-5 lg:mt-0 lg:max-w-[31rem] lg:pb-1 lg:text-[1.125rem]"
                >
                  Spletne strani in digitalne rešitve. Od izhodišča in ključnih odločitev do oblikovanja in delujoče
                  izvedbe.
                </p>
              </div>

              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-16 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
                {PROJECTS.map((p, i) => {
                  const id = `work-${p.slug}`;
                  const { Art } = p;
                  const col = (i % 2 === 0 ? 1 : 2) as 1 | 2;
                  return (
                    <li key={p.slug}>
                      <article>
                        <Link
                          href={`/work/${p.slug}`}
                          aria-labelledby={id}
                          aria-describedby={`${id}-desc`}
                          className={`group block ${MOBILE_SQUARE} ${p.shared ? SHARED_43 : ""} ${FLEXIDO_LINE} ${FLEXIDO_SIZE} ${LINK_FOCUS}`}
                        >
                          <div className="work-lift">
                            {p.Wide ? (
                              <>
                                <div className="min-[898px]:hidden">
                                  <Motion p={p} col={col}>
                                    <Art />
                                  </Motion>
                                </div>
                                <div className="hidden min-[898px]:block">
                                  <Motion p={p} col={col}>
                                    <p.Wide />
                                  </Motion>
                                </div>
                              </>
                            ) : (
                              <Motion p={p} col={col}>
                                <Art />
                              </Motion>
                            )}
                          </div>
                          <Caption id={id} name={p.name} descriptor={p.descriptor} />
                        </Link>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          {/* Editorial conclusion. The grid section's bottom padding is the only gap above the hairline, so this one has no top padding. */}
          <section
            aria-labelledby="work-approach-heading"
            className="bg-[var(--mini-surface-work,#080a0f)] pb-16 text-white sm:pb-20 lg:pb-24"
          >
            <div className="mini-page-rail">
              <div className="grid border-t border-[color:var(--mini-border-subtle,rgb(255_255_255/0.08))] pt-7 sm:pt-8 lg:grid-cols-2 lg:gap-x-10 lg:pt-11 xl:gap-x-12">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--mini-accent-text,#7c97f0)] lg:col-span-2">
                  Od zasnove do izvedbe
                </p>
                <h2
                  id="work-approach-heading"
                  className="home-bridge-heading mt-5 max-w-[16ch] text-balance text-[1.25rem] font-medium [font-optical-sizing:auto] sm:text-[1.5rem] lg:self-start"
                >
                  Različni projekti. Skupen pristop.
                </h2>
                <p className="mt-4 max-w-[56ch] text-pretty text-[15px] leading-[1.7] text-white/70 sm:text-base lg:mt-5 lg:self-start">
                  Pri Baumi načrtujemo, oblikujemo in razvijamo spletne strani za
                  podjetja, izdelke in storitve. Vsak projekt začnemo z
                  razumevanjem vsebine, potreb naročnika in poti obiskovalca. Tako
                  nastajajo jasne, pregledne in premišljeno zasnovane digitalne
                  predstavitve.
                </p>
              </div>
            </div>
          </section>
        </main>

        <MiniClosingBookend variant="graphite" photoBackground topRule={false} tone="natural-midnight" spacing="roomy" />
      </MiniPalette>
    </div>
  );
}
