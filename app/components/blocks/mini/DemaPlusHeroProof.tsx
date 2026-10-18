import Image from "next/image";

/**
 * Faithful, non-interactive reconstruction of the opening screen (`#hero`) of
 * the new Dema Plus site (Next.js, served at demaplus.si).
 *
 * Source of truth: the local demaplus-next repo at HEAD, which matches the live
 * site (checked 2026-10-12: copy, line breaks, rects and computed styles at
 * 1440, 768 and 390px).
 * - Section: src/components/home/HomeHeroFeatured.tsx
 * - Copy and featured project: src/content/home.ts (`homeHero`)
 * - Header (transparent over the photograph on the home page, "fresh home"
 *   state): src/components/layout/Header.tsx, MobileMenuToggle.tsx (`light`)
 * - Logo: brand/DemaPlusLogo.tsx (paths copied unchanged)
 * - Primary button: src/components/ui/HeroButton.tsx
 * - Image: public/images/hero/svicarija.jpg, copied byte-identical to
 *   public/work/dema-plus/proof/svicarija-hero.jpg
 * - Tokens: the client uses Tailwind's default ramp and the system font stack,
 *   so values are written as literals and no font files are loaded.
 *
 * Responsive logic is the original's, with container queries standing in for
 * its viewport breakpoints (`@min-[640px]` / `@min-[768px]` / `@min-[1024px]`
 * = sm / md / lg). Below 640 the third title line ("Do izvedbe.") is hidden,
 * as on the source.
 *
 * Deliberately different from the source:
 * - Height: the source is viewport-relative (`72svh` / `68svh` with a minimum).
 *   On ordinary viewports the minimum wins, so the minimums are used as fixed
 *   heights: 620 / 560 / 660, and 700 where the container is at least 1200px
 *   (the source's `xl`).
 * - The source slowly zooms the photograph from 1 to 1.05 over 20 seconds
 *   (GSAP). This is the static starting frame.
 * - The source's last overlay, a brand-tinted gradient, computes to fully
 *   transparent on the live site, so it is left out.
 * - The source's 1px hairline under the section (from 640px, a divider to the
 *   next section) is left out: here it would show as a pale line under the photo.
 * - The header strip, nav labels and button are presentation-only: no links,
 *   no buttons, `aria-hidden` and `inert`.
 * - The source's text container is centred at `max-w-7xl` (1280px); here the
 *   proof is at most 1216px wide, so the content sits 20px from the left edge.
 * - The heading level is configurable so the block never adds a page-level h1.
 */

const FONT_STACK =
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const NAV = ["Domov", "Reference", "O nas"];

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
      className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-transparent text-white"
    >
      <div className="mx-auto flex h-[64px] max-w-[80rem] items-center justify-between px-5">
        <span className="inline-flex items-center leading-none text-white">
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
                    ? "border-b-[#ffffff] text-[#ffffff]"
                    : "border-b-transparent text-[#ffffff]/[0.85]",
                ].join(" ")}
              >
                {label}
              </span>
            ))}
          </div>

          <span className="rounded-full border border-[#ffffff]/70 bg-[#ffffff]/10 px-5 py-[7px] text-sm text-[#ffffff] backdrop-blur-sm">
            Kontakt
          </span>
        </div>

        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ffffff]/60 bg-[#ffffff]/[0.18] shadow-[0_4px_18px_rgba(0,0,0,0.18)] backdrop-blur-md @min-[768px]:hidden">
          <span className="absolute block h-[2px] w-[15px] -translate-y-[3px] rounded-full bg-[#ffffff]" />
          <span className="absolute block h-[2px] w-[15px] translate-y-[3px] rounded-full bg-[#ffffff]" />
        </span>
      </div>
    </div>
  );
}

export default function DemaPlusHeroProof({
  headingLevel = 3,
}: {
  /** Level of the title; the section has no h1 of its own. */
  headingLevel?: 2 | 3 | 4;
}) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";

  return (
    <div
      className="@container bg-[#ffffff] text-[#111827] antialiased [text-rendering:geometricPrecision]"
      style={{ fontFamily: FONT_STACK }}
    >
      <section className="relative">
        <div className="relative h-[620px] w-full overflow-hidden @min-[640px]:h-[560px] @min-[1024px]:h-[660px] @min-[1200px]:h-[700px]">
          {/* Image layer */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/work/dema-plus/proof/svicarija-hero.jpg"
              alt=""
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover"
            />

            {/* Base readability */}
            <div className="absolute inset-0 bg-[#000000]/[0.12]" />

            {/* Header readability */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.30)_0%,rgba(0,0,0,0.12)_18%,transparent_38%)]" />

            {/* Text readability / left depth */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.50)_0%,rgba(0,0,0,0.34)_32%,rgba(0,0,0,0.12)_58%,transparent_82%)]" />

            {/* Bottom depth */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.08)_30%,transparent_58%)]" />
          </div>

          <HeaderStrip />

          {/* Content */}
          <div className="relative z-20 mx-auto h-full max-w-[80rem] px-5">
            <div className="flex h-full items-end pb-16 @min-[640px]:pb-20 @min-[1024px]:pb-24">
              <div className="max-w-2xl text-[#ffffff]">
                <p className="text-xs tracking-wide text-[#ffffff]/[0.78]">
                  Inženiring • Izvedba
                </p>

                <Heading className="mt-4 text-[42px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#ffffff] @min-[640px]:text-[48px] @min-[640px]:leading-[1.05] @min-[1024px]:text-[56px]">
                  <span className="block">Gradimo.</span>
                  <span className="block">Po načrtu.</span>
                  <span className="hidden @min-[640px]:block">Do izvedbe.</span>
                </Heading>

                <p className="mt-5 max-w-[34ch] text-base leading-[1.45] text-[#ffffff]/[0.74] @min-[640px]:max-w-[42ch] @min-[640px]:text-lg @min-[640px]:leading-[1.5]">
                  Gradimo po vaših načrtih in željah —
                  <br />
                  z jasnim nadzorom, roki in odgovornostjo.
                </p>

                <div className="mt-7">
                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center gap-2 rounded-full bg-[#F6C24A] px-5 py-2.5 text-sm font-semibold text-[oklch(0.205_0_0)]"
                    >
                      <span>Izbrani projekti</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
