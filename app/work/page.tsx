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
 * `/work`: three rows of two 4:3 surfaces, in the reading order Flexido, Ulterior / Odstrani Tattoo, Dema Plus /
 * ArtBite, Hardshelljacket. At 1440px the rail is 1216px: two 584px columns, a 48px gap, 438px surfaces, 60px between rows.
 * 4:3 holds from an 898px viewport (a card width of 405px); from 640 to there the surfaces are 19rem (304px) high; below 640
 * one column of squares. The shared surfaces (Flexido, Odstrani, Dema Plus) are also used by the homepage and are not
 * modified: their fixed heights, Flexido's line width and size are overridden from the link, here only.
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

const HOME_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

const SURFACE_WORK = {
  "--mini-surface-work": "#0f141c",
} as CSSProperties;

/** Square below `sm`. The shared surfaces carry fixed heights, so they are overridden from the link. */
const MOBILE_SQUARE = "max-sm:[&_.swm>div]:aspect-square max-sm:[&_.swm>div]:h-auto";

/**
 * 4:3 from a 898px viewport (a card width of 405px); from `sm` (640px) to there the surfaces keep the approved 19rem
 * (304px) height, as on `/work`. Below 405px wide 4:3 is shorter than that: Flexido's two statements end up 12px apart at
 * 340 x 255 and the Hardshelljacket headline reaches the hood, where 304px keeps 61px between the statements and clears
 * it. (A `min-height` of 19rem does not work: with an aspect ratio it widens the card instead.) The shared surfaces
 * (Flexido, Odstrani, Dema Plus) take the ratio from the link, overriding their fixed heights.
 */
const SHARED_43 = "min-[898px]:[&_.swm>div]:h-auto min-[898px]:[&_.swm>div]:aspect-[4/3]";

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

const LINK_FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50";

const ARROW =
  "inline-block transition-transform duration-300 group-hover:translate-x-[3px]";

const ARIAL = "Arial, Helvetica, sans-serif";

/* --------------------------------------------- local surfaces --------------------------------------------- */

/**
 * Ulterior below 898px (and the base of the surface above it): the photograph's `left` puts the jacket's right edge at 92cqw
 * (the 7cqw margin the other surfaces use) and its left edge fades in over 14%. Scale, crop and the headline's size formula
 * are the originals. From 640 to 719px the jacket moves further right by up to 0.35 x (324px - card width), 14px at 640, so
 * "Normal" keeps about 18px from the sleeve cuff (6px without it); the shift is zero from 720px. Below 640px the card is a
 * square, where the headline is a fixed 9.8cqw.
 */
function UlteriorSurface() {
  return (
    <div
      className="relative aspect-square overflow-hidden rounded-[3px] sm:max-[898px]:aspect-auto sm:max-[898px]:h-[19rem] bg-[#eef2f5] text-[#33333e] [container-type:size]"
      style={{ fontFamily: ARIAL }}
    >
      <Image
        src="/work/ulterior/hardshell-white-hanging.webp"
        alt="Bela hardshell jakna na obešalniku"
        width={1706}
        height={1924}
        sizes="520px"
        quality={85}
        className="absolute max-w-none sm:max-[720px]:left-[calc(92cqw_-_101.8cqh_+_max(0px,(324px_-_100cqw)_*_0.35))]!"
        style={{
          height: "172.7cqh",
          width: "auto",
          top: "-66.9cqh",
          left: "calc(92cqw - 101.8cqh)",
          maskImage: "linear-gradient(to right, transparent, #000 14%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 14%)",
        }}
      />
      <div className="absolute left-[7cqw]" style={{ bottom: "11cqh" }}>
        <p
          className="text-balance font-normal leading-[1.25] text-[#505058]"
          style={{ fontSize: "clamp(0.75rem, 3.6cqw, 0.9375rem)", maxWidth: "8em" }}
        >
          Technical protection for
        </p>
        <p className="mt-[0.5em] font-bold leading-[0.95] tracking-[-0.055em] [font-size:min(10.8cqw,calc((min(0px,92cqw-101.8cqh)+53.8cqh-10cqw)/3.1))] max-sm:[font-size:9.8cqw]">
          <span className="block">Normal</span>
          <span className="block">life.</span>
        </p>
      </div>
    </div>
  );
}

/** Below 898px the surface above, from 898px the selected composition below (the hidden one does not load its image). */
function UlteriorApproved() {
  return (
    <>
      <div className="min-[898px]:hidden">
        <UlteriorSurface />
      </div>
      <div className="hidden min-[898px]:block">
        <UlteriorDesktop />
      </div>
    </>
  );
}

/**
 * Ulterior from 898px: the selected "B refined" composition, text group lowered by 6% of the card height. The headline is
 * pinned (12.2cqw, two lines): its top is `69cqh - 10.736cqw + 0.6 * eyebrow`, i.e. 63cqh as first set plus the 6cqh lowering,
 * so it sits against the jacket's lower mass (hem at 88.5cqh). The eyebrow hangs above the pinned headline instead of taking
 * part in that calculation: 2.65cqw (13px floor), graphite, 1.2cqw above the headline's box. Jacket centre 73cqw, photograph
 * unchanged, left edge faded over 14%.
 */
function UlteriorDesktop() {
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-[#eef2f5] text-[#33333e] [container-type:size]"
      style={{ fontFamily: ARIAL }}
    >
      <Image
        src="/work/ulterior/hardshell-white-hanging.webp"
        alt="Bela hardshell jakna na obešalniku"
        width={1706}
        height={1924}
        sizes="520px"
        quality={85}
        className="absolute max-w-none"
        style={{
          height: "172.7cqh",
          width: "auto",
          top: "-66.9cqh",
          left: "calc(73cqw - 78.1cqh)",
          maskImage: "linear-gradient(to right, transparent, #000 14%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 14%)",
        }}
      />
      <div
        className="absolute"
        style={{ left: "8cqw", top: `calc(69cqh - 10.736cqw + 0.6 * clamp(0.8125rem, 3.1cqw, 1.125rem))` }}
      >
        <p
          className="absolute bottom-full left-0 whitespace-nowrap font-normal tracking-[-0.005em] text-[#35363c]"
          style={{ fontSize: "clamp(0.8125rem, 2.65cqw, 0.97rem)", lineHeight: 1.2, marginBottom: "1.2cqw" }}
        >
          Technical protection for
        </p>
        <p className="-ml-[0.04em] font-bold tracking-[-0.055em]" style={{ fontSize: "12.2cqw", lineHeight: 0.94 }}>
          <span className="block">Normal</span>
          <span className="block">life.</span>
        </p>
      </div>
    </div>
  );
}

/**
 * ArtBite below 898px: a one-line headline over the pair of photographs, the composition of ArtBite's own mobile hero
 * (artbite-tattoo.com): large "Osebni pristop." top left in Fraunces italic and medium sans, the original photographs
 * (`hero-2/3.webp`, unedited) low on the surface, the horses dominant, the watch smaller and dropped 4.4cqw. The headline is
 * pulled left by the italic O's side-bearing so its ink lines up with the horses. From `md` the pair is centred, because
 * at these ratios the photographs are limited by height and would leave the right third empty.
 */
function ArtBiteSurface() {
  return (
    <div
      className={`${artbiteAccent.variable} relative aspect-square overflow-hidden rounded-[3px] sm:max-[898px]:aspect-auto sm:max-[898px]:h-[19rem] min-[898px]:aspect-[4/3] text-[#f5f0e8] [container-type:size]`}
      style={{ backgroundColor: "#291917", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
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
        <div className="flex min-h-0 flex-1 items-end gap-[6cqw] md:justify-center">
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
 * ArtBite, composed for the 4:3 surface (from 898px; below it the approved surface above is shown). The approved
 * arrangement is a one-line headline over a small pair of photographs, which at 4:3 reads as a big headline and a
 * disconnected little group. Same wording, Fraunces italic and photographs, three decisions:
 *  - the headline breaks after "Osebni" (two lines, same size), a compact block top left;
 *  - the horses photograph (31cqw wide: 181px at 1440, within its 326px source as before) takes the headline's top line
 *    at the right margin, so the two heaviest things share a line and balance each other across the card;
 *  - the watch photograph (24cqw) steps down and left of it, as the approved watch is dropped, on the bottom margin, 4cqw
 *    from the horses and 31px under the headline's last line, so the pair reads as one stepped group tied to the headline.
 * Everything is in cqw / cqh, so it holds from 898px up (the 4:3 ratio is constant). Margins are the approved 7cqw
 * (9.4cqh vertically, the same 41px at 1440).
 */
function ArtBiteComposed() {
  return (
    <div
      className={`${artbiteAccent.variable} relative aspect-[4/3] overflow-hidden rounded-[3px] text-[#f5f0e8] [container-type:size]`}
      style={{ backgroundColor: "#291917", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      <p
        className="absolute -ml-[0.06em] font-medium leading-[0.96] tracking-[-0.035em]"
        style={{ left: "7cqw", top: "9.4cqh", fontSize: "12.2cqw" }}
      >
        <span
          className="block font-normal italic tracking-[-0.02em] text-[#c9624a]"
          style={{ fontFamily: "var(--font-artbite-accent), Georgia, serif" }}
        >
          Osebni
        </span>
        <span className="block">pristop.</span>
      </p>
      <div
        className="absolute overflow-hidden rounded-[18px] shadow-[0_14px_40px_rgba(0,0,0,0.28)]"
        style={{ width: "31cqw", aspectRatio: "0.74 / 1", top: "9.4cqh", right: "7cqw" }}
      >
        <Image
          src="/work/artbite/hero-2.webp"
          alt="Tetovaža dveh konj z lovilcem sanj"
          fill
          sizes="190px"
          quality={85}
          className="object-cover object-[50%_24%]"
        />
      </div>
      <div
        className="absolute overflow-hidden rounded-[16px]"
        style={{ width: "24cqw", aspectRatio: "0.74 / 1", bottom: "9.4cqh", right: "calc(7cqw + 31cqw + 4cqw)" }}
      >
        <Image
          src="/work/artbite/hero-3.webp"
          alt=""
          fill
          sizes="150px"
          quality={85}
          className="object-cover object-[44%_center]"
        />
      </div>
    </div>
  );
}

/**
 * Hardshelljacket: the original photograph (`hardshell-atmosphere-02.webp`, unedited) covers the surface, `object-position`
 * putting the hood in the right three quarters. The line is the site's own: two lines from 898px ("Made for the way" /
 * "the day moves."), three below ("Made for / the way / the day moves."), where the long line would reach the hood. Arial
 * bold, white, bottom left; 7cqw capped at 2.25rem (36px at 1440; cards narrower than 514px are limited by 7cqw). A flat
 * `rgba(8, 10, 15, 0.12)` layer takes the city background down without a visible tint.
 */
function HardshelljacketSurface() {
  return (
    <div
      className="relative aspect-square overflow-hidden rounded-[3px] sm:max-[898px]:aspect-auto sm:max-[898px]:h-[19rem] min-[898px]:aspect-[4/3] bg-[#0b0d10] text-white [container-type:size]"
      style={{ fontFamily: ARIAL }}
    >
      <Image
        src="/work/hardshelljacket/hardshell-atmosphere-02.webp"
        alt="Moški v zeleni kapuci hardshell jakne na deževni mestni ulici"
        fill
        sizes="640px"
        quality={85}
        className="object-cover object-[46%_50%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(8,10,15,0.12)]" />
      <p
        className="absolute bottom-[9cqh] left-[7cqw] font-bold leading-[1.04] tracking-[-0.035em]"
        style={{ fontSize: "clamp(1.25rem, 7cqw, 2.25rem)" }}
      >
        <span className="block whitespace-nowrap">
          Made for<span className="max-[898px]:block"> the way</span>
        </span>
        <span className="block whitespace-nowrap">the day moves.</span>
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
  { slug: "ulterior", name: "Ulterior", descriptor: "Produktna predstavitev in nakupni sistem", Art: UlteriorApproved },
  { slug: "odstrani-tattoo", motion: "odstrani", name: "Odstrani Tattoo", descriptor: "Zaupanje in konverzija", shared: true, Art: OdstraniSurface },
  { slug: "dema-plus", motion: "dema", name: "Dema Plus", descriptor: "Reference in jasnost", shared: true, Art: DemaSurface },
  { slug: "artbite", name: "ArtBite", descriptor: "Spletna stran tattoo studia", Art: ArtBiteSurface, Wide: ArtBiteComposed },
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
          className="text-sm font-medium text-white/48 transition-colors duration-300 group-hover:text-white/92"
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
            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-28 text-white sm:pb-12 sm:pt-32 lg:pb-[3.25rem] lg:pt-36"
          >
            <div className="mini-page-rail">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Work</p>
              <h1
                id="work-heading"
                className="home-bridge-heading mt-5 text-balance text-[1.375rem] font-medium [font-optical-sizing:auto] sm:mt-6 sm:text-3xl"
              >
                Izbrani projekti
              </h1>

              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-14 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
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
