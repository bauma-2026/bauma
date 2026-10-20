import Image from "next/image";

/**
 * Faithful, non-interactive reconstruction of the "Everyday use" band of
 * hardshelljacket.com.
 *
 * Source of truth (local hardshelljacket-next, matches the live site):
 * - src/components/hardshell/HardshellPage.tsx, the `everydayUse` section: the
 *   photograph (images/hardshell/hardshell-atmosphere-02.webp, 1967 x 800, unedited)
 *   as a cover background (`object-[48%_center]` on mobile, centred from md), a flat
 *   `bg-black/10` layer, then the text block: the eyebrow "Everyday use", the heading,
 *   the body and the white button "Explore the Hardshell". Heights: 480 / 540 / 600px
 *   by breakpoint. Mobile copy ("Made for everyday." / "Technical protection for
 *   daily movement.") is set at the bottom; from md the two-line copy ("Made for the
 *   way / the day moves." / "Technical protection with an / everyday point of view.")
 *   is vertically centred in a 24rem column on the left.
 * - Tokens from src/app/globals.css (`.eyebrow`, `.heading-section`, `.body-copy`,
 *   `.btn-primary` with its white override) and the Container (max 1240px, 20 / 24 /
 *   32px side padding). Font: Arial, as on the site.
 *
 * Differences from the original, by necessity: the breakpoints follow the width the
 * proof is given (container queries at 700 / 1000px instead of 768 / 1024); the button
 * is a static label, not a link.
 *
 * The heading is a level-2 heading; the page owns the only H1.
 */

const FONT_STACK = "Arial, Helvetica, sans-serif";

export default function HardshelljacketEverydayProof() {
  return (
    <div
      className="@container relative isolate min-h-[480px] overflow-hidden bg-black text-white antialiased [text-rendering:auto] @min-[700px]:min-h-[540px] @min-[1000px]:min-h-[600px]"
      style={{ fontFamily: FONT_STACK }}
    >
      <Image
        src="/work/hardshelljacket/proof/hardshell-atmosphere-02.webp"
        alt="Moški v zeleni kapuci hardshell jakne na deževnem križišču evropskega mesta"
        fill
        sizes="(min-width: 1280px) 1216px, 100vw"
        quality={85}
        className="-z-10 object-cover object-[48%_center] @min-[700px]:object-center"
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 mx-auto flex min-h-[480px] w-full max-w-[1240px] items-end px-5 pb-5 @min-[640px]:px-6 @min-[700px]:min-h-[540px] @min-[700px]:items-center @min-[700px]:pb-0 @min-[1000px]:min-h-[600px] @min-[1000px]:px-8">
        <div className="max-w-xl text-white @min-[1000px]:max-w-[24rem]">
          <p className="mb-3 text-[0.75rem] uppercase leading-4 tracking-[0.14em] text-white/75 @min-[700px]:mb-4">
            Everyday use
          </p>

          <h2 className="text-[1.875rem] font-semibold leading-[1.12] tracking-[-0.03em] text-white">
            <span className="@min-[700px]:hidden">Made for everyday.</span>
            <span className="hidden @min-[700px]:inline">
              Made for the way
              <br />
              the day moves.
            </span>
          </h2>

          <p className="mt-3 text-base leading-[1.625rem] text-white/90 @min-[700px]:mt-5">
            <span className="@min-[700px]:hidden">
              Technical protection for daily movement.
            </span>
            <span className="hidden @min-[700px]:inline">
              Technical protection with an
              <br />
              everyday point of view.
            </span>
          </p>

          <div className="mt-5 @min-[700px]:mt-8">
            <span className="inline-flex items-center border border-white/90 bg-white px-5 py-3 text-sm font-medium text-[#33333e]">
              Explore the Hardshell
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
