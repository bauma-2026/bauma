import type { Metadata } from "next";
import Image from "next/image";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/** Homepage typography foundation (scoped to `[data-home-typography]`, set below). */
import "../homeTypography.css";
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
 * ArtBite's own accent face (Fraunces italic, opsz + WONK axes as on artbite-tattoo.com), used only for the one
 * accent word on the ArtBite surface. Latin subset is enough ("Osebni" has no diacritics). Scoped to this route.
 */
const artbiteAccent = Fraunces({
  subsets: ["latin"],
  style: "italic",
  axes: ["opsz", "WONK"],
  variable: "--font-artbite-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Work — Bauma",
  description: "Work preview for Bauma.",
  robots: {
    index: false,
    follow: false,
  },
};

/** Same primary navigation as the homepage (`app/page.tsx`). */
const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/approach", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
];

/** Same Work surface as the homepage Selected Work section. */
const SURFACE_WORK = {
  "--mini-surface-work": "#0f141c",
} as CSSProperties;

/**
 * Below `md` the grid is one column of any width (272px to 719px), so the fixed 18rem / 19rem surface height gave cards
 * with aspect ratios from 0.94 to 2.4, which no composition is designed for. There the surface is square instead
 * (`aspect-square`, height auto); from `md` the approved heights apply unchanged. The shared surfaces (Odstrani, Dema,
 * Flexido) carry their fixed heights in `MiniSelectedWorkSurfaces`, used by the homepage and left untouched, so this
 * overrides them from the link (higher specificity than their single height classes); the local Ulterior and ArtBite
 * surfaces apply the same rule themselves.
 */
const MOBILE_SQUARE = "max-md:[&_.swm>div]:aspect-square max-md:[&_.swm>div]:h-auto";

/**
 * Flexido's first paragraph is justified edge to edge, which is right at its design widths (7.5em wide on every grid
 * card) but spreads the words across a 600px line on a wide single-column card, where its type has stopped growing
 * (3.1rem cap). Limiting it to 7.6em changes nothing at 373px and below and keeps the line compact when wider.
 */
const FLEXIDO_LINE = "[&_[data-surface=flexido]>div>div>p:first-child]:max-w-[7.6em]";

const LINK_FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

/** Arrow nudge, as on the homepage cards. */
const ARROW =
  "inline-block transition-transform duration-300 group-hover:translate-x-[3px]";

type Project = {
  slug: string;
  /** Entry motion exists only for the three typographic surfaces; others render static. */
  motion?: MotionSurfaceId;
  name: string;
  descriptor: string;
  Art: () => ReactNode;
};

/**
 * Ulterior: product editorial. The original jacket photograph (unedited) fills the surface; it is cropped just under
 * the truss so the black hanger bar hangs from the top edge of the card, and sized so the jacket is about 70% of the
 * surface height with its right edge near the 7cqw padding the other surfaces use. That leaves the photograph's own
 * pale wall as negative space at the left, where the copy sits, its last line on the jacket's hem line. Copy is
 * Ulterior's own line "Technical protection for normal life": the lead-in is quiet, "Normal life." (the thesis of the
 * brand) carries the weight. Type is Arial bold: ink #33333e for the headline, a restrained #505058 for the lead-in.
 * The headline size is derived from the free column left of the jacket, so it holds from the 293px card (1024px grid)
 * to 373px without touching the sleeve. Below `md` the surface is square, where that formula leaves only a 3% gap to
 * the sleeve, so the headline is a fixed 9.8cqw there (about 5% gap).
 */
function UlteriorSurface() {
  return (
    <div
      className="relative aspect-square overflow-hidden rounded-[3px] md:aspect-auto md:h-[19rem] lg:h-[21.25rem] bg-[#eef2f5] text-[#33333e] [container-type:size]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <Image
        src="/work/ulterior/hardshell-white-hanging.webp"
        alt="Bela hardshell jakna na obešalniku"
        width={1706}
        height={1924}
        sizes="520px"
        quality={85}
        className="absolute max-w-none"
        style={{ height: "172.7cqh", width: "auto", top: "-66.9cqh", left: "min(0px, calc(92cqw - 101.8cqh))" }}
      />
      <div className="absolute left-[7cqw]" style={{ bottom: "11cqh" }}>
        <p
          className="text-balance font-normal leading-[1.25] text-[#505058]"
          style={{ fontSize: "clamp(0.75rem, 3.6cqw, 0.9375rem)", maxWidth: "8em" }}
        >
          Technical protection for
        </p>
        <p className="mt-[0.5em] font-bold leading-[0.95] tracking-[-0.055em] [font-size:min(10.8cqw,calc((min(0px,92cqw-101.8cqh)+53.8cqh-10cqw)/3.1))] max-md:[font-size:9.8cqw]">
          <span className="block">Normal</span>
          <span className="block">life.</span>
        </p>
      </div>
    </div>
  );
}

/**
 * ArtBite: the composition principle of ArtBite's own mobile hero (artbite-tattoo.com), translated to the card.
 * There: a large H1 (48px, leading .96, tracking -.04em), then below it a bottom-aligned row of two 0.74 portrait
 * tiles, hero-2 (40% wide, 18px radius) and hero-3 (27% wide, 16px radius, dropped 8px, dimmed to .85), with the
 * right third left empty. Here: "Osebni pristop." large at the top-left on one line (the line is about 6.3em long, so
 * 12.2cqw fits from the 293px card to 373px without a break), and the same two original photographs (`hero-2/3.webp`,
 * unedited) low on the surface, the horses dominant and the watch at 2/3 of its size, dimmed and shifted as in the hero.
 * Optical refinements: "pristop." is medium (500), not semibold, so it sits beside the lighter Fraunces italic
 * (terracotta, as on artbite-tattoo.com) without outweighing it; the word gap is opened by 0.07em; the headline is
 * pulled left by the italic O's 0.06em side-bearing so its ink lines up with the horses' left edge; the photographs
 * are lifted 12px above the bottom padding; the watch sits a 6cqw gap from the horses (its right edge lands about
 * level with the end of the headline) and is dropped 4.4cqw, which makes the diagonal and leaves 20px+ beneath it.
 * The photographs take the height left under the line, so one arrangement holds at every card width.
 */
function ArtBiteSurface() {
  return (
    <div
      className={`${artbiteAccent.variable} relative aspect-square overflow-hidden rounded-[3px] md:aspect-auto md:h-[19rem] lg:h-[21.25rem] bg-[#291917] text-[#f5f0e8] [container-type:size]`}
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="flex h-full flex-col p-[7cqw] pb-[calc(7cqw+12px)]">
        <p
          className="-ml-[0.06em] mb-[4cqw] whitespace-nowrap font-medium leading-[0.96] tracking-[-0.035em]"
          style={{ fontSize: "12.2cqw" }}
        >
          <span
            className="mr-[0.07em] font-normal italic tracking-[-0.02em] text-[#c9624a]"
            style={{ fontFamily: "var(--font-artbite-accent), Georgia, serif" }}
          >
            Osebni
          </span>{" "}
          pristop.
        </p>
        <div className="flex min-h-0 flex-1 items-end gap-[6cqw]">
          <div className="relative aspect-[0.74/1] h-full max-w-[46cqw] overflow-hidden rounded-[18px] shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
            <Image
              src="/work/artbite/hero-2.webp"
              alt="Tetovaža dveh konj z lovilcem sanj"
              fill
              sizes="160px"
              quality={85}
              className="object-cover object-[50%_24%]"
            />
          </div>
          <div className="relative aspect-[0.74/1] h-[67%] max-w-[30cqw] translate-y-[4.4cqw] overflow-hidden rounded-[16px]">
            <Image
              src="/work/artbite/hero-3.webp"
              alt=""
              fill
              sizes="110px"
              quality={85}
              className="object-cover object-[44%_center]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hardshelljacket: dark, atmospheric editorial. The original photograph of the site's "Everyday use" band
 * (`hardshell-atmosphere-02.webp`, 1967 x 800, unedited, no gradient) covers the surface; `object-position` puts the
 * green hood and upper torso in the right three quarters of the card, with a strip of the rainy street at the left.
 * The line is the site's own, "Made for the way the day moves.", set in three lines ("Made for / the way / the day
 * moves.") in Arial bold, white, at the bottom left over the dark road and the dark shell. The two short upper lines
 * stay left of the face and only the long last line runs under it, so the face and hood stay clear. It is sized in
 * `cqw` (7cqw, 26px on the 373px desktop card), so the desktop and square mobile cards keep the same composition. The
 * photograph's own darkness carries the contrast. A flat `rgba(8, 10, 15, 0.12)` layer (Bauma's Base) sits between the
 * photograph and the type: it takes the lighter blue-grey city background down about 20% in luminance, so it stays
 * quieter than the other cards, without a gradient or a visible tint.
 */
function HardshelljacketSurface() {
  return (
    <div
      className="relative aspect-square overflow-hidden rounded-[3px] md:aspect-auto md:h-[19rem] lg:h-[21.25rem] bg-[#0b0d10] text-white [container-type:size]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <Image
        src="/work/hardshelljacket/hardshell-atmosphere-02.webp"
        alt="Moški v zeleni kapuci hardshell jakne na deževni mestni ulici"
        fill
        sizes="520px"
        quality={85}
        className="object-cover object-[46%_50%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(8,10,15,0.12)]" />
      <p
        className="absolute bottom-[9cqh] left-[7cqw] font-bold leading-[1.04] tracking-[-0.035em]"
        style={{ fontSize: "clamp(1.25rem, 7cqw, 1.95rem)" }}
      >
        <span className="block">Made for</span>
        <span className="block">the way</span>
        <span className="block">the day moves.</span>
      </p>
    </div>
  );
}

/**
 * Homepage order, names and descriptors (`MiniSelectedWorkHome`). The homepage list is not exported
 * and that file is left untouched; keep the two in step until a fourth project makes sharing worthwhile.
 */
const PROJECTS: readonly Project[] = [
  { slug: "odstrani-tattoo", motion: "odstrani", name: "Odstrani Tattoo", descriptor: "Zaupanje in konverzija", Art: OdstraniSurface },
  { slug: "dema-plus", motion: "dema", name: "Dema Plus", descriptor: "Reference in jasnost", Art: DemaSurface },
  { slug: "flexido", motion: "flexido", name: "Flexido", descriptor: "Industrijski B2B", Art: FlexidoSurface },
  { slug: "ulterior", name: "Ulterior", descriptor: "Produktna predstavitev in nakupni sistem", Art: UlteriorSurface },
  { slug: "artbite", name: "ArtBite", descriptor: "Spletna stran tattoo studia", Art: ArtBiteSurface },
  { slug: "hardshelljacket", name: "Hardshelljacket", descriptor: "Izdelek na eni strani", Art: HardshelljacketSurface },
];

/**
 * `/work`: the homepage Selected Work compositions, grid and cards, without the section heading.
 * The `data-home-typography` wrapper (a plain block, no layout effect; never `display: contents`, which Next.js skips as the scroll target) applies the homepage
 * typography foundation and IBM Plex Mono eyebrow, as on `app/page.tsx`. The motion wrapper cycles its
 * column stagger (1-3) so the grid can grow to 6-9 projects with the same three-column rhythm.
 */
export default function WorkPage() {
  return (
    <div data-home-typography className={homeMono.variable}>
      <MiniPalette>
        <MiniHeader hideApproachNav refined primaryNav={HOME_NAV} contactHref="#contact" />

        <main style={SURFACE_WORK}>
          <section
            data-section="selected-work"
            aria-labelledby="work-heading"
            className="bg-[var(--mini-surface-work,#080a0f)] pb-16 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Work</p>
              <h1
                id="work-heading"
                className="home-bridge-heading mt-5 text-balance text-[1.375rem] font-medium [font-optical-sizing:auto] sm:mt-6 sm:text-3xl"
              >
                Izbrani projekti
              </h1>

              <ol className="mt-10 grid list-none gap-x-6 gap-y-10 sm:mt-12 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-x-10 xl:gap-x-12">
                {PROJECTS.map((p, i) => {
                  const id = `work-${p.slug}`;
                  const { Art } = p;
                  const linkProps = {
                    "aria-labelledby": id,
                    "aria-describedby": `${id}-desc`,
                    className: `group block ${MOBILE_SQUARE} ${p.slug === "flexido" ? FLEXIDO_LINE : ""} ${LINK_FOCUS}`,
                  };
                  const card = (
                    <>
                      {p.motion ? (
                        <SelectedWorkMotion id={p.motion} col={((i % 3) + 1) as 1 | 2 | 3}>
                          <Art />
                        </SelectedWorkMotion>
                      ) : (
                        <Art />
                      )}
                      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[minmax(44px,auto)_auto] items-center">
                        <h2
                          id={id}
                          className="col-start-1 row-start-1 text-[1.5rem] font-semibold leading-[1.05] tracking-[var(--ht-tr-h3)] text-white"
                        >
                          {p.name}
                        </h2>
                        <span
                          aria-hidden="true"
                          className="col-start-2 row-start-1 justify-self-end text-sm font-medium text-white/65 transition-colors duration-300 group-hover:text-white/92"
                        >
                          <span className={ARROW}>→</span>
                        </span>
                        <p id={`${id}-desc`} className="col-span-2 row-start-2 -mt-1 text-[13px] leading-5 text-white/60">
                          {p.descriptor}
                        </p>
                      </div>
                    </>
                  );
                  return (
                    <li key={p.slug}>
                      <article>
                        <Link href={`/work/${p.slug}`} {...linkProps}>
                          {card}
                        </Link>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        </main>

        <MiniClosingBookend variant="graphite" photoBackground topRule={false} />
      </MiniPalette>
    </div>
  );
}
