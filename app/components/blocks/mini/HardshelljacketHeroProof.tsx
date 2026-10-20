import Image from "next/image";

/**
 * Faithful, non-interactive reconstruction of the opening of hardshelljacket.com:
 * the white header and the hero.
 *
 * Source of truth (local hardshelljacket-next, matches the live site):
 * - src/components/hardshell/HardshellPage.tsx, the `#top` section: on desktop a
 *   block, 680px high at the site's 1440px reference width (here the same 1440:680
 *   ratio, so the crop of the photograph does not change with the width the proof is
 *   given), with the campaign photograph (images/hero/ulterior-hardshell-
 *   hero-05.webp, 1815 x 866, unedited) as a cover background, `object-right`, scaled
 *   1.035 from the right, and a 38rem text column, vertically centred (here
 *   without the original 48px offset, as the closing line is left out); below the
 *   desktop breakpoint the text comes first on #f7f7f6 and
 *   the separate mobile photograph (ulterior-hardshell-hero-05-mobile.webp, 1122 x
 *   1402) follows at 4:3, `object-position: 72% 100%`.
 *   Copy: the eyebrow "Ulterior product", the H1, the lead, the price note, the CTA
 *   pair ("Buy on Ulterior", "B2B enquiries"). The relationship line below the CTAs is left
 *   out, and the lead, eyebrow and secondary link are a little darker, for contrast.
 * - src/components/layout/Header.tsx: the white header (64px, 72px on desktop, the
 *   1px hairline `0 1px 0 rgba(0,0,0,.075)`), the Ulterior logo at 132px, the four
 *   one-page labels with "Product" active, the divider and "ES" on desktop, the
 *   menu icon below it.
 * - Tokens from src/app/globals.css (`--color-ulterior-*`, `.eyebrow`, `.body-lead`,
 *   `.btn-primary`, `.text-link`) and the Container (max 1240px, 20 / 24 / 32px
 *   side padding). Font: Arial, as on the site.
 *
 * Differences from the original, by necessity: the breakpoints follow the width the
 * proof is given (container queries at 700 / 1100px instead of the viewport's 768 /
 * 1024); the navigation and both CTAs are static labels, not links; the page's menu
 * panel and scroll behaviour are omitted.
 *
 * The title is a paragraph, not a heading: the page that embeds this proof owns the
 * only H1.
 */

const FONT_STACK = "Arial, Helvetica, sans-serif";

const NAV = ["Product", "Construction", "Details", "B2B"] as const;

export default function HardshelljacketHeroProof() {
  return (
    <div
      className="@container bg-white text-[#33333e] antialiased [text-rendering:auto]"
      style={{ fontFamily: FONT_STACK }}
    >
      {/* HEADER */}
      <div className="relative z-10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.075)]">
        <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-5 @min-[640px]:px-6 @min-[1100px]:h-[72px] @min-[1100px]:px-8">
          <Image
            src="/work/hardshelljacket/proof/ulterior-logo.svg"
            alt=""
            width={132}
            height={18}
            unoptimized
            className="h-auto w-[132px]"
          />

          <div className="hidden items-center @min-[1100px]:flex">
            <div className="flex items-center gap-8">
              {NAV.map((label, i) => (
                <span
                  key={label}
                  className={
                    i === 0
                      ? "text-[13px] font-medium tracking-[-0.01em] text-[#33333e] underline decoration-1 underline-offset-4"
                      : "text-[13px] font-medium tracking-[-0.01em] text-[#33333e] opacity-85"
                  }
                >
                  {label}
                </span>
              ))}
            </div>
            <span aria-hidden="true" className="mx-5 h-3 w-px bg-[#e6e6e6]" />
            <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#33333e]/55">
              ES
            </span>
          </div>

          <span
            aria-hidden="true"
            className="-mr-2 flex h-11 w-11 items-center justify-center @min-[1100px]:hidden"
          >
            <span className="relative block h-[13px] w-[18px]">
              <span className="absolute left-0 top-0 block h-[1.5px] w-full bg-current" />
              <span className="absolute left-0 top-[5.75px] block h-[1.5px] w-full bg-current" />
              <span className="absolute left-0 top-[11.5px] block h-[1.5px] w-full bg-current" />
            </span>
          </span>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-col bg-[#f7f7f6] @min-[1100px]:relative @min-[1100px]:isolate @min-[1100px]:block @min-[1100px]:aspect-[1440/680] @min-[1100px]:overflow-hidden @min-[1100px]:bg-[#b7bcc8]">
        {/* below 1100: the mobile photograph at 4:3 */}
        <div className="relative order-2 aspect-[4/3] w-full overflow-hidden @min-[1100px]:hidden">
          <Image
            src="/work/hardshelljacket/proof/ulterior-hardshell-hero-05-mobile.webp"
            alt=""
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            quality={85}
            className="object-cover object-[72%_100%]"
          />
        </div>

        {/* from 1100: the campaign photograph behind the text */}
        <div className="absolute inset-0 hidden overflow-hidden @min-[1100px]:block">
          <Image
            src="/work/hardshelljacket/proof/ulterior-hardshell-hero-05.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            quality={85}
            className="origin-right scale-[1.035] object-cover object-right"
          />
        </div>

        <div className="relative z-10 order-1 mx-auto w-full max-w-[1240px] px-5 @min-[640px]:px-6 @min-[1100px]:px-8 @min-[1100px]:absolute @min-[1100px]:inset-x-0 @min-[1100px]:inset-y-0">
          <div className="flex items-start @min-[1100px]:h-full">
            <div className="flex h-auto w-full flex-col justify-start py-9 @min-[700px]:px-2 @min-[700px]:py-14 @min-[1100px]:h-full @min-[1100px]:max-w-[38rem] @min-[1100px]:justify-center @min-[1100px]:px-0 @min-[1100px]:py-0">
              <p className="mb-3 text-[0.75rem] uppercase leading-4 tracking-[0.14em] text-[#33333e]/90 @min-[700px]:mb-5 @min-[1100px]:mb-6">
                Ulterior product
              </p>

              <p className="max-w-[14ch] text-[2.35rem] font-semibold leading-[1.01] tracking-[-0.045em] text-[#33333e] @min-[700px]:text-[3.15rem] @min-[1100px]:text-[clamp(3.25rem,5cqw,4rem)]">
                Waterproof Hardshell Jacket
              </p>

              <p className="mt-4 max-w-[35rem] text-base leading-[1.6] text-[#33333e]/90 @min-[700px]:mt-7 @min-[1100px]:mt-6 @min-[1100px]:text-[1.125rem]">
                Technical protection for changing everyday weather.
              </p>

              <p className="mt-4 text-[0.9rem] font-medium tracking-[-0.01em] text-[#33333e] @min-[700px]:mt-6 @min-[1100px]:mt-8">
                295.00 € · Colour and size selected on Ulterior.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 @min-[700px]:mt-5 @min-[1100px]:mt-4">
                <span className="inline-flex items-center border border-[#33333e] bg-[#33333e] px-5 py-3 text-sm font-medium text-white">
                  Buy on Ulterior
                </span>
                <span className="inline-flex text-sm font-medium text-[#33333e]/85 underline decoration-[#33333e]/50 decoration-1 underline-offset-[5px]">
                  B2B enquiries
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
