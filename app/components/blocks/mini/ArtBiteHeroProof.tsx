import Image from "next/image";
import { Fraunces } from "next/font/google";
import type { CSSProperties } from "react";

/**
 * Faithful, non-interactive reconstruction of the ArtBite homepage hero
 * (artbite-tattoo.com), under the same minimal header strip the live site has.
 *
 * Source of truth (local artbite-next, matches the live site):
 * - src/app/page.tsx, the HERO section: the near-black photographic overlay
 *   (`from-black/40 via-black/70 to-black/90` over #17110d), the eyebrow "Z vami
 *   od leta 2016", the H1 "Tetovaže z osebnim pristopom." (plain sans, no
 *   italic), the lead, the two pills ("Rezerviraj termin", then "O studiu" on
 *   desktop / "Tatuji" on mobile), and the two layouts:
 *   - below 1024px: text, then two photographs (hero-2 at 40% wide, hero-3 at
 *     27% wide, dropped 8px, dimmed to 85%), then the pills;
 *   - from 1024px: a two-column grid (0.9fr / 1.1fr) with five photographs on the
 *     right (hero-1, hero-4, hero-2 dominant, hero-3, hero-5) with their offsets,
 *     radii, opacities and the dominant photograph's shadow and ring.
 * - src/components/layout/Header.tsx: the text wordmark "ArtBite" (Fraunces, 560,
 *   WONK .35, 32/34/36px) over "TATTOO STUDIO" (8px, .18em), on the dark strip
 *   with the hairline below (`border-text/[0.06]`). The strip is a solid #0e0a08: the
 *   hero's own base (#17110d, the root of this proof) under the first stop of its
 *   photographic overlay (`black/40`), i.e. exactly the colour the hero has at its
 *   top edge, so the strip continues into the hero with only the hairline between
 *   them. No gradient, opacity, blur or shadow.
 *   Navigation and the Kontakt button are omitted.
 * - Tokens from src/app/globals.css: #17110d, #f5f0e8, #bdb0a2, accent #bd5138,
 *   eyebrow #c9624a, primary pill #b14c35. Font: the system sans stack.
 * - Images, unedited (326 x 700): images/hero/hero-1..5.webp.
 *
 * Differences from the original, by necessity:
 * - The original two-column layout is built for a 1280px container; the proof is
 *   at most 1216px wide, so the five-photograph cluster is scaled by one factor
 *   (every size and offset in container-width units: 0.85 at 1216px) and only
 *   used from 1000px of frame width. Below that the original stacked layout is
 *   used, as it is on the site below 1024px.
 * - The strip is 72px high and the hero padding is reduced by the 94px header
 *   the original has above it, so the content sits where it does on the site.
 * - Hover, press and lazy-loading behaviour, and the links, are omitted; the
 *   pills are static labels.
 *
 * The headline is a paragraph, not a heading: the embedding page owns the H1.
 */

const wordmark = Fraunces({
  subsets: ["latin"],
  style: ["normal"],
  axes: ["opsz", "WONK"],
  variable: "--font-artbite-wordmark",
});

const FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/** One scale for the desktop cluster, in container-width units (0.85 of the original size at a 1216px frame). */
const K = 0.0699;
const u = (px: number) => `${(px * K).toFixed(3)}cqw`;

type Tile = {
  src: string;
  w: number;
  h: number;
  radius: number;
  opacity: number;
  y: number;
  scale?: number;
  hero?: boolean;
};

/** Original order, sizes (px at the 1280px container), offsets and opacities. */
const CLUSTER: Tile[] = [
  { src: "hero-1", w: 100, h: 170, radius: 18, opacity: 0.6, y: 40 },
  { src: "hero-4", w: 140, h: 230, radius: 20, opacity: 0.9, y: 12 },
  {
    src: "hero-2",
    w: 230,
    h: 340,
    radius: 26,
    opacity: 1,
    y: 0,
    scale: 1.02,
    hero: true,
  },
  { src: "hero-3", w: 140, h: 230, radius: 20, opacity: 0.9, y: 16 },
  { src: "hero-5", w: 100, h: 170, radius: 18, opacity: 0.6, y: 40 },
];

const EYEBROW =
  "text-[11px] font-medium uppercase leading-normal tracking-[0.1em] text-[#c9624a]";

const PRIMARY =
  "inline-flex items-center justify-center rounded-full bg-[#b14c35] px-5 py-3 text-sm font-medium tracking-[-0.01em] text-[#f5f0e8]";
const SECONDARY =
  "inline-flex items-center justify-center rounded-full border border-[#bd5138]/40 bg-transparent px-5 py-3 text-sm font-medium tracking-[-0.01em] text-[#f5f0e8]";

export default function ArtBiteHeroProof() {
  return (
    <div
      className={`${wordmark.variable} @container overflow-hidden bg-[#17110d] text-[#f5f0e8] antialiased [text-rendering:auto]`}
      style={{ fontFamily: FONT_STACK }}
    >
      {/* HEADER STRIP: the wordmark only, as on the live site (no navigation, no Kontakt) */}
      <div className="border-b border-[#f5f0e8]/[0.06] bg-[#0e0a08]">
        <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center px-5 @min-[1024px]:px-8">
          <div>
            <span
              style={{
                fontFamily: "var(--font-artbite-wordmark), Georgia, serif",
                fontVariationSettings: "'WONK' 0.35",
              }}
              className="block text-[32px] font-[560] leading-[0.88] tracking-[-0.03em] text-[#f5f0e8] @min-[640px]:text-[34px] @min-[1024px]:text-[36px]"
            >
              ArtBite
            </span>
            <span className="mt-2 block text-[8px] font-normal uppercase leading-none tracking-[0.18em] text-[#bdb0a2]/85">
              Tattoo Studio
            </span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 @min-[1024px]:px-8">
          {/* MOBILE / TABLET: the original stacked composition */}
          <div className="pb-14 pt-10 @min-[640px]:pb-16 @min-[640px]:pt-[4.5rem] @min-[1000px]:hidden">
            <div className="max-w-[620px]">
              <p className={EYEBROW}>Z vami od leta 2016</p>

              <p className="mt-4 max-w-[11ch] text-5xl font-semibold leading-[0.96] tracking-[-0.04em]">
                Tetovaže z osebnim pristopom.
              </p>

              <p className="mt-7 max-w-[34ch] text-[16px] leading-[1.65] text-[#bdb0a2] @min-[640px]:text-[17px] @min-[640px]:leading-[1.7]">
                Studio zaprtega tipa v Domžalah. Obiski potekajo po predhodnem
                dogovoru, v mirnem in zasebnem okolju.
              </p>

              <div className="mt-6 flex items-end gap-3 @min-[640px]:mt-7">
                <div className="aspect-[0.74/1] w-[40%]">
                  <div className="relative h-full w-full overflow-hidden rounded-[18px] shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
                    <Image
                      src="/work/artbite/proof/hero-2.webp"
                      alt=""
                      fill
                      sizes="(min-width: 640px) 250px, 40vw"
                      quality={90}
                      className="object-cover object-[50%_24%]"
                    />
                  </div>
                </div>

                <div className="aspect-[0.74/1] w-[27%] translate-y-2">
                  <div className="relative h-full w-full overflow-hidden rounded-[16px]">
                    <Image
                      src="/work/artbite/proof/hero-3.webp"
                      alt=""
                      fill
                      sizes="(min-width: 640px) 170px, 27vw"
                      quality={90}
                      className="object-cover object-[44%_center] opacity-85"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className={PRIMARY}>Rezerviraj termin</span>
                <span className={SECONDARY}>Tatuji</span>
              </div>
            </div>
          </div>

          {/* DESKTOP: text left, five photographs right */}
          <div className="hidden min-h-[460px] grid-cols-[0.9fr_1.1fr] items-start gap-16 pb-24 pt-[6.6rem] @min-[1000px]:grid">
            <div className="max-w-[620px]">
              <p className={EYEBROW}>Z vami od leta 2016</p>

              <p className="mt-5 max-w-[12ch] text-6xl font-semibold leading-[0.95] tracking-[-0.04em]">
                Tetovaže z osebnim pristopom.
              </p>

              <p className="mt-7 max-w-[46ch] text-[17px] leading-7 text-[#bdb0a2]">
                Studio zaprtega tipa v Domžalah. Obiski potekajo po predhodnem
                dogovoru, v mirnem in zasebnem okolju.
              </p>

              <div className="mt-10 flex gap-3">
                <span className={PRIMARY}>Rezerviraj termin</span>
                <span className={SECONDARY}>O studiu</span>
              </div>
            </div>

            <div className="flex justify-end">
              <div
                className="flex items-center"
                style={{
                  gap: u(20),
                  transform: `translate(${u(-16)}, ${u(-4)})`,
                }}
              >
                {CLUSTER.map((tile) => (
                  <div
                    key={tile.src}
                    className="relative shrink-0"
                    style={{
                      width: u(tile.w),
                      height: u(tile.h),
                      transform: [
                        tile.y ? `translateY(${u(tile.y)})` : "",
                        tile.scale ? `scale(${tile.scale})` : "",
                      ]
                        .filter(Boolean)
                        .join(" "),
                    }}
                  >
                    <div
                      className={
                        tile.hero
                          ? "relative h-full w-full overflow-hidden ring-1 ring-[#f5f0e8]/10"
                          : "relative h-full w-full overflow-hidden"
                      }
                      style={{
                        borderRadius: u(tile.radius),
                        boxShadow: tile.hero
                          ? `0 ${u(30)} ${u(90)} rgba(0,0,0,0.55)`
                          : undefined,
                      }}
                    >
                      <Image
                        src={`/work/artbite/proof/${tile.src}.webp`}
                        alt=""
                        fill
                        sizes="240px"
                        quality={90}
                        className="object-cover"
                        style={{ opacity: tile.opacity } as CSSProperties}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
