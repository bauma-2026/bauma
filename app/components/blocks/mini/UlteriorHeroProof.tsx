import Image from "next/image";

/**
 * Faithful, non-interactive reconstruction of the hero of the Ulterior
 * homepage (ulterior.es).
 *
 * Source of truth (local ulterior-next, matches the live page):
 * - Markup, copy and classes: src/components/home/HomeHero.tsx: the photograph
 *   `images/lifestyle/home-hero-hardshell-beach.webp` (unedited, 2087 x 1091)
 *   as a cover background at object-position 58% 18% (58% 16% from md, 58% 11%
 *   from lg), a flat `rgba(20,20,24,.46)` overlay (`.43` from md), then the
 *   eyebrow "Ulterior Apparel", the H1 "Technical protection for normal life."
 *   (bold, leading .96, tracking -.055em, white, 13.5ch) and the lead
 *   "Weather protection without the outdoor identity." in a 600px column,
 *   vertically centred.
 * - Tokens ported 1:1 from src/app/globals.css and the Container (max 1240px,
 *   20/24/32px side padding). Font: Arial/Helvetica, as on ulterior.es.
 *
 * Above the photograph sits a white logo strip, as in the Flexido proof (64px
 * high, the same side padding, logo only, no navigation). The logo is
 * images/logo/ulterior-logo.svg from ulterior-next, shown at the 132px width it
 * has in the original site header.
 *
 * Differences from the original, by necessity:
 * - The original hero is as tall as the viewport (82svh / 88svh minus a 88px
 *   header). A proof cannot follow the viewport, so the height is fixed per
 *   width instead (560 / 620 / 700px), close to what the original is at 375x812
 *   and 1440x900.
 * - Breakpoints follow the width the proof is given (container queries at
 *   768 / 1024); the title size uses the same clamp, in container width.
 * - The two shop links ("Shop the hardshell" button, "Explore the collection"
 *   underlined link) are reproduced as static labels (no link, nothing happens);
 *   the site header is omitted.
 * - `sizes` asks for a wider file below 1024px: the cover crop of a tall box
 *   needs about 1100px of the photograph, not the width of the screen.
 *
 * The title is a paragraph, not a heading: the page that embeds this proof owns
 * the only H1.
 */

const FONT_STACK = "Arial, Helvetica, sans-serif";

export default function UlteriorHeroProof() {
  return (
    <div
      className="@container overflow-hidden bg-[#33333e] text-white antialiased [text-rendering:auto]"
      style={{ fontFamily: FONT_STACK }}
    >
      {/* LOGO STRIP: white, logo only (no navigation), as in the Flexido proof; same height and side padding */}
      <div className="bg-white">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center px-5 @min-[640px]:px-6 @min-[1024px]:px-8">
          <Image
            src="/work/ulterior/proof/ulterior-logo.svg"
            alt=""
            width={132}
            height={18}
            unoptimized
            className="h-auto w-[132px]"
          />
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src="/work/ulterior/proof/home-hero-hardshell-beach.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 1216px, (min-width: 1024px) 100vw, 1200px"
            quality={85}
            className="object-cover object-[58%_18%] @min-[768px]:object-[58%_16%] @min-[1024px]:object-[58%_11%]"
          />
          <div className="absolute inset-0 bg-[rgba(20,20,24,0.46)] @min-[768px]:bg-[rgba(20,20,24,0.43)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 @min-[640px]:px-6 @min-[1024px]:px-8">
          <div className="flex min-h-[560px] items-center py-16 @min-[768px]:min-h-[620px] @min-[1024px]:min-h-[700px]">
            <div className="max-w-[600px]">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/72 @min-[768px]:mb-5 @min-[768px]:text-[12px]">
                Ulterior Apparel
              </p>

              <p className="max-w-[13.5ch] text-[clamp(2.65rem,5cqw,4.65rem)] font-bold leading-[0.96] tracking-[-0.055em] text-white">
                Technical protection for normal life.
              </p>

              <p className="mt-5 max-w-[28rem] text-[15px] leading-6 text-white/88 @min-[768px]:mt-6 @min-[768px]:max-w-[31rem] @min-[768px]:text-[1.125rem] @min-[768px]:leading-[1.5] @min-[768px]:text-white/84">
                Weather protection without the outdoor identity.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 @min-[768px]:mt-9 @min-[768px]:gap-x-7 @min-[768px]:gap-y-4">
                <span className="inline-flex min-h-10 items-center border border-white bg-white px-5 text-[13px] font-medium text-[#33333e] @min-[768px]:min-h-11 @min-[768px]:px-6 @min-[768px]:text-sm">
                  Shop the hardshell
                </span>
                <span className="inline-flex min-h-10 items-center justify-center text-[13px] font-medium text-white underline underline-offset-4 @min-[768px]:min-h-11 @min-[768px]:text-sm">
                  Explore the collection
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
