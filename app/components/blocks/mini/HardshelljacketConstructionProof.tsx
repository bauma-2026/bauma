import Image from "next/image";

/**
 * Compact reconstruction of the "Three-layer construction" section of
 * hardshelljacket.com.
 *
 * Source of truth (local hardshelljacket-next, matches the live site):
 * - src/components/hardshell/HardshellPage.tsx, the `#construction` section: a
 *   two-column grid (.95fr / 1.05fr, vertically centred) with the rear-view photograph
 *   (images/materials/hardshell-beige-back.webp, 680 x 680, unedited) on the left and,
 *   on the right, the accent eyebrow, the section heading and one paragraph of body
 *   copy. Copy from src/data/hardshell.ts.
 * - Tokens from src/app/globals.css (`.eyebrow`, `.eyebrow-accent` #355cad,
 *   `.heading-section`, `.body-copy`) and the Container (max 1240px, 20 / 24 / 32px
 *   side padding). Font: Arial, as on the site.
 *
 * Differences from the original, by necessity or to keep the proof compact: the
 * breakpoint follows the width the proof is given (container query at 700px instead
 * of the viewport's 1024px); stacked, the text comes first and the photograph follows
 * as an uncropped square at the full content width; from 700px the photograph column
 * is at most 24rem wide and the text follows it at a 40-56px gap. The section padding
 * is reduced.
 *
 * The heading is a level-2 heading; the page owns the only H1.
 */

const FONT_STACK = "Arial, Helvetica, sans-serif";

export default function HardshelljacketConstructionProof() {
  return (
    <div
      className="@container bg-white text-[#33333e] antialiased [text-rendering:auto]"
      style={{ fontFamily: FONT_STACK }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 py-8 @min-[640px]:px-6 @min-[700px]:p-8">
        <div className="grid items-center gap-6 @min-[700px]:grid-cols-[minmax(0,min(24rem,45%))_minmax(0,1fr)] @min-[700px]:gap-10 @min-[1100px]:gap-14">
          <div className="relative order-2 aspect-square w-full overflow-hidden @min-[700px]:order-1">
            <Image
              src="/work/hardshelljacket/proof/hardshell-beige-back.webp"
              alt="Zadnja stran off-white hardshell jakne z irizirajočo aplikacijo na sredini hrbta"
              fill
              sizes="(min-width: 748px) 384px, 100vw"
              quality={85}
              className="object-cover"
            />
          </div>

          <div className="order-1 max-w-xl @min-[700px]:order-2">
            <p className="mb-4 text-[0.75rem] uppercase leading-4 tracking-[0.14em] text-[#355cad]">
              Three-layer construction
            </p>
            <h2 className="text-[1.875rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#33333e]">
              A protective shell with a distinctive signature.
            </h2>
            <p className="mt-5 text-base leading-[1.625rem] text-[rgb(64,64,64)]">
              The three-layer shell combines protective construction with an
              iridescent kiss-cut application at the centre back.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
