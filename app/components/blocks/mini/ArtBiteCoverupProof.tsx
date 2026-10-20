import type { CSSProperties } from "react";

/**
 * Faithful, non-interactive reconstruction of the hero of the ArtBite page
 * "Prekrivanje starih tetovaž" (artbite-tattoo.com/prekrivanje-starih-tetovaz).
 * Only the hero: nothing else from that page.
 *
 * Source of truth (local artbite-next, matches the live site):
 * - src/app/prekrivanje-starih-tetovaz/page.tsx, the HERO section: the near-black
 *   photographic overlay (`from-black/30 via-black/50 to-black/80` over #17110d),
 *   the eyebrow "Prekrivanje", the heading, the intro (with its two emphasised
 *   phrases), the outlined pill "Pošlji fotografijo za oceno", and the "rolete":
 *   ONE photograph (images/prekrivanje/hero-before.webp, 1029 x 556, unedited) shown
 *   through narrow, fully rounded vertical slices, each with its own width, gap,
 *   image offset and shade (`heroStripDesktop`: image 760px wide, scaled 1.04, two
 *   overlay gradients over the cluster). The old tattoo sits on the left of the
 *   photograph and the finished cover-up on the right.
 * - Tokens from src/app/globals.css: #17110d, #f5f0e8, #bdb0a2, accent #bd5138,
 *   eyebrow #c9624a. Font: the system sans stack.
 *
 * Differences from the original, by choice or necessity:
 * - Five slices, not seven: the first two of `heroStripDesktop` (the ones showing
 *   mostly the old, faded tattoo) are left out, the other five keep their widths,
 *   gaps, offsets and shades in the original order. The same five are used at
 *   every width, so the left-out slices do not come back on tablet or mobile
 *   (the site's own four-slice tablet and mobile strips are not used).
 * - The cluster is built for a 1280px container; it is scaled by one factor in
 *   container-width units: above 1000px of frame width beside the text (the
 *   five slices are enlarged a little, 1.15 of the scale the seven had, so the
 *   group still fills its column), below that under the text, sized to the width
 *   and capped, with no overlay gradients (as on the site's strips).
 * - The site header above the hero is omitted, so the top padding is reduced by
 *   its height. The pointer-driven depth and the entrance settle are omitted: the
 *   slices are shown at rest. The pill is a static label (no mailto).
 *
 * The heading is a level-2 heading; the page owns the only H1.
 */

const FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const SRC = "/work/artbite/proof/coverup-hero.webp";

/** The last five of the site's seven slices, original widths (px), gaps, image offsets and shades. */
const SLICES = [
  { w: 82, left: -200, mr: 8, shade: "bg-black/[0.12]" },
  { w: 94, left: -320, mr: 9, shade: "bg-black/[0.14]" },
  { w: 104, left: -440, mr: 10, shade: "bg-black/[0.16]" },
  { w: 112, left: -560, mr: 9, shade: "bg-black/[0.18]" },
  { w: 96, left: -650, mr: 0, shade: "bg-black/20" },
] as const;

/** Size in container-width units. Beside the text (from 1000px of frame width). */
const K_DESKTOP = 0.0805;
const uDesktop = (px: number) => `${(px * K_DESKTOP).toFixed(3)}cqw`;
/** Under the text: follows the frame width, capped at 0.78 of the original size. */
const uCompact = (px: number) => {
  const size = Math.abs(px);
  const value = `min(${(size * 0.1527).toFixed(3)}cqw, ${(size * 0.78).toFixed(2)}px)`;
  return px < 0 ? `calc(-1 * ${value})` : value;
};

type Unit = (px: number) => string;

function Slices({ u, scale }: { u: Unit; scale: number }) {
  return (
    <>
      {SLICES.map((item, i) => (
        <div
          key={i}
          className="relative h-full shrink-0 overflow-hidden rounded-[999px]"
          style={{ width: u(item.w), marginRight: u(item.mr) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SRC}
            alt=""
            className="absolute top-0 h-full max-w-none object-cover"
            style={
              {
                width: u(760),
                left: u(item.left),
                transform: `scale(${scale})`,
              } as CSSProperties
            }
          />
          <div className={`absolute inset-0 ${item.shade}`} />
        </div>
      ))}
    </>
  );
}

const EYEBROW =
  "text-[11px] font-medium uppercase leading-normal tracking-[0.1em] text-[#c9624a]";

const SECONDARY =
  "inline-flex items-center justify-center rounded-full border border-[#bd5138]/40 bg-transparent px-5 py-3 text-sm font-medium tracking-[-0.01em] text-[#f5f0e8]";

const STRONG = "font-medium text-[#f5f0e8]/90";

export default function ArtBiteCoverupProof() {
  return (
    <div
      className="@container relative overflow-hidden bg-[#17110d] text-[#f5f0e8] antialiased [text-rendering:auto]"
      style={{ fontFamily: FONT_STACK }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 @min-[1024px]:px-8">
        {/* MOBILE AND TABLET: text, then the five slices */}
        <div className="pb-8 pt-12 @min-[640px]:pb-10 @min-[640px]:pt-14 @min-[1000px]:hidden">
          <div className="min-w-0 max-w-[760px]">
            <p className={EYEBROW}>Prekrivanje</p>

            <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-[-0.04em] @min-[640px]:text-5xl">
              Prekrivanje starih tetovaž
            </h2>

            <p className="mt-5 max-w-[48ch] text-[17px] leading-7 text-[#bdb0a2]">
              Ni vsake stare tetovaže mogoče prekriti s poljubnim motivom — kaj
              je izvedljivo, je odvisno od velikosti, temnosti, barve pigmenta
              in razpoložljivega prostora na koži. Zato vsak primer najprej
              ocenimo posebej.
            </p>

            <span className={`${SECONDARY} mt-5`}>
              Pošlji fotografijo za oceno
            </span>

            <div
              className="mt-7 flex items-end justify-start overflow-hidden @min-[640px]:mt-9"
              style={{ height: uCompact(450) }}
            >
              <Slices u={uCompact} scale={1.05} />
            </div>
          </div>
        </div>

        {/* DESKTOP: text left, five slices right */}
        <div className="hidden grid-cols-[0.9fr_1.1fr] items-end gap-12 pb-16 pt-12 @min-[1000px]:grid">
          <div className="max-w-[620px]">
            <p className={EYEBROW}>Prekrivanje</p>

            <h2 className="mt-4 max-w-[11ch] text-[64px] font-semibold leading-[0.95] tracking-[-0.04em]">
              Prekrivanje
              <br />
              starih tetovaž
            </h2>

            <p className="mt-5 max-w-[46ch] text-[17px] leading-7 text-[#bdb0a2]">
              Ni vsake stare tetovaže mogoče prekriti s{" "}
              <strong className={STRONG}>poljubnim motivom</strong> — kaj je
              izvedljivo, je odvisno od{" "}
              <strong className={STRONG}>
                velikosti, temnosti, barve pigmenta in razpoložljivega prostora
              </strong>{" "}
              na koži. Zato vsak primer najprej ocenimo posebej.
            </p>

            <span className={`${SECONDARY} mt-6`}>
              Pošlji fotografijo za oceno
            </span>
          </div>

          <div
            className="relative flex items-end justify-self-end overflow-hidden"
            style={{
              height: uDesktop(450),
              transform: `translate(${uDesktop(10)}, ${uDesktop(18)})`,
            }}
          >
            <Slices u={uDesktop} scale={1.04} />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/10 via-black/20 to-black/55" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
