import { useId } from "react";
import Image from "next/image";

/**
 * Faithful, non-interactive reconstruction of the "Kako deluje Pico laser
 * odstranjevanje tattoojev" section on odstranitattoo.si (home page, directly
 * after the hero), with an optional strip of the site's real header above it
 * for brand recognition.
 *
 * Source of truth: the live site, which is built from the uncommitted working
 * tree of odstranitattoo-next (HEAD is older):
 * - Markup, copy and spacing: components/home/HowItWorks.tsx, with the
 *   `section-sm`, `section-gap`, `header-stack`, `eyebrow-muted`,
 *   `heading-section`, `text-body-lg`, `text-body-sm` and `image-block`
 *   helpers from app/globals.css expanded inline.
 * - Container: components/layout/Container.tsx (1280px, 20/24/32/40px gutters).
 * - Header strip: components/layout/Header.tsx in its top-of-page state
 *   (wordmark visible) and ui/Button.tsx `primary-light`.
 * - Tokens: that site re-maps Tailwind's `white` and `neutral-*` ramp to warm
 *   values, so every colour here is a literal hex rather than a Bauma theme
 *   colour. The site renders in Arial/Helvetica (Satoshi is wired but never
 *   applied), so no font files are loaded.
 *
 * Responsive logic is the original's, but breakpoints are container queries
 * (`@min-[640px]` / `@min-[1024px]` / `@min-[1280px]` = sm / lg / xl) so the
 * layout follows the width this block is given, not the browser viewport.
 *
 * Deliberately different from the source:
 * - Static: no links, buttons, hover states or transitions; the header strip
 *   is aria-hidden and inert.
 * - DOM order is heading, paragraphs, image (the source puts the image first
 *   and reorders it with CSS); the visual result is identical.
 * - With the header strip shown, the section's own top hairline is dropped so
 *   it does not double up with the header's bottom border.
 * - Headings are configurable so the block never adds a document-level h1.
 */

const FONT_STACK = "Arial, Helvetica, sans-serif";

const GUTTERS =
  "mx-auto w-full max-w-[1280px] px-5 @min-[640px]:px-6 @min-[1024px]:px-8 @min-[1280px]:px-10";

const NAV = [
  "Odstranjevanje",
  "Pico laser",
  "Rezultati",
  "FAQ",
  "Kontakt",
  "Artbite",
];

/** Desktop columns and the mobile/tablet list carry slightly different copy in the source. */
const STEPS = [
  {
    n: "01",
    title: "Pigment se razbije",
    desktop: "Laser pigment razbije na manjše delce, ki jih telo postopoma odstranjuje.",
    desktopMax: "max-w-[26ch]",
    stacked: "Laser pigment razbije na manjše delce, ki jih telo postopoma odstranjuje.",
  },
  {
    n: "02",
    title: "Koža se med tretmaji zaceli",
    desktop: "Koža se po tretmaju celi 28–60 dni, zato se tretmaji izvajajo na 8 tednov.",
    desktopMax: "max-w-[28ch]",
    stacked: "Koža se po tretmaju celi 28–60 dni, zato se tretmaji izvajajo v razmiku 8 tednov.",
  },
  {
    n: "03",
    title: "Vsak tattoo reagira drugače",
    desktop: "Odziv je odvisen od pigmenta, globine nanosa, starosti tattooja in odziva kože.",
    desktopMax: "max-w-[28ch]",
    stacked: "Odziv pigmenta je odvisen od barve, globine nanosa, starosti tattooja in odziva kože.",
  },
] as const;

function HeaderStrip() {
  return (
    <div
      aria-hidden="true"
      inert
      className="border-b border-[#e7e5e4] bg-[#EFEDE8]/90"
    >
      <div className={GUTTERS}>
        <div className="flex min-h-[76px] items-center justify-between gap-4 @min-[640px]:gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/work/odstrani-tattoo/proof/laser-symbol.svg"
              alt=""
              width={52}
              height={52}
              className="h-[52px] w-[52px] shrink-0 brightness-90"
            />
            <span className="max-w-[180px] overflow-hidden whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.14em] text-[#241F1B]">
              Odstrani Tattoo
            </span>
          </div>

          <div className="hidden items-center gap-7 @min-[1024px]:flex @min-[1024px]:gap-8">
            {NAV.map((label) => (
              <span
                key={label}
                className="whitespace-nowrap pb-1 text-[14px] font-medium tracking-[0.01em] text-[#5C5044]"
              >
                {label}
              </span>
            ))}
          </div>

          <span className="ml-1 hidden @min-[1024px]:block">
            <span className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#BD5138] bg-[#BD5138] px-5 py-3 text-sm font-medium tracking-[0.01em] text-[#ffffff]">
              Posvet
            </span>
          </span>

          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e5e4] text-[#241F1B] @min-[1024px]:hidden">
            <span className="flex flex-col gap-[4px]">
              <span className="block h-[1.5px] w-5 bg-current" />
              <span className="block h-[1.5px] w-5 bg-current" />
              <span className="block h-[1.5px] w-5 bg-current" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OdstraniTattooProcessProof({
  showHeader = true,
  headingLevel = 3,
}: {
  /** Strip of the real site header above the section. */
  showHeader?: boolean;
  /** Level of the section heading; step headings sit one level below. */
  headingLevel?: 2 | 3 | 4;
}) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const StepHeading = `h${headingLevel + 1}` as "h3" | "h4" | "h5";

  return (
    <div
      className="@container bg-[#FAF8F4] text-[#241F1B] antialiased [text-rendering:auto]"
      style={{ fontFamily: FONT_STACK }}
    >
      {showHeader ? <HeaderStrip /> : null}

      <section
        aria-labelledby={headingId}
        className={[
          "py-12 @min-[640px]:py-14 @min-[1024px]:py-16",
          showHeader ? "" : "border-t border-[#e7e5e4]/70",
        ].join(" ")}
      >
        <div className={GUTTERS}>
          <div className="flex flex-col gap-10 @min-[640px]:gap-12">
            <div className="grid gap-8 @min-[1024px]:flex @min-[1024px]:flex-row @min-[1024px]:items-start @min-[1024px]:gap-x-12">
              {/* TEXT: contents below lg so its children interleave with the image via order; a flex column at lg+ */}
              <div className="contents @min-[1024px]:flex @min-[1024px]:max-w-[36rem] @min-[1024px]:flex-1 @min-[1024px]:flex-col @min-[1024px]:gap-5">
                <div className="order-1 flex max-w-[36rem] flex-col gap-4 @min-[640px]:gap-5">
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#78716c]">
                    Kaj se zgodi s tattoojem
                  </p>

                  <Heading
                    id={headingId}
                    className="max-w-[22ch] text-3xl font-semibold leading-[1.1] tracking-tight text-[#0c0a09] @min-[640px]:text-4xl"
                  >
                    Kako deluje Pico laser odstranjevanje tattoojev
                  </Heading>

                  <p className="max-w-[36ch] text-lg leading-[1.6] text-[#44403c]">
                    Pico laser pigment razbije na manjše delce, ki jih telo
                    postopoma odstranjuje.
                  </p>
                </div>

                <p className="order-3 max-w-[38ch] text-lg leading-[1.6] text-[#44403c]">
                  Koža se mora med tretmaji zaceliti, zato odstranjevanje poteka
                  postopno skozi več obiskov.
                </p>
              </div>

              {/* IMAGE */}
              <div className="order-2 overflow-hidden rounded-[14px] border border-[#e7e5e4]/60 bg-[#fdfcfa] @min-[1024px]:order-first @min-[1024px]:flex-1">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/work/odstrani-tattoo/proof/pico-screen-1.webp"
                    alt="Pico laser zaslon in nastavitve"
                    fill
                    sizes="(min-width: 1280px) 600px, (min-width: 768px) 720px, 100vw"
                    className="object-cover object-[58%_50%] @min-[1024px]:object-[56%_48%]"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[#e7e5e4] pt-6 @min-[640px]:pt-8">
              {/* STACKED LIST — below lg */}
              <ol className="grid list-none divide-y divide-[#E3D0BC]/50 overflow-hidden rounded-2xl border border-[#E3D0BC]/60 bg-[#FCFAF7] @min-[1024px]:hidden">
                {STEPS.map((step) => (
                  <li
                    key={step.n}
                    className="grid grid-cols-[44px_1fr] items-start gap-4 px-5 py-5"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFE3D4] text-[13px] font-bold tabular-nums text-[#9D6E49]">
                      {step.n}
                    </span>

                    <div className="flex flex-col gap-1.5">
                      <StepHeading className="text-[1rem] font-semibold leading-tight text-[#0c0a09]">
                        {step.title}
                      </StepHeading>

                      <p className="text-[14px] leading-[1.5] text-[#57534e]">
                        {step.stacked}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* COLUMNS — lg and up */}
              <div className="hidden @min-[1024px]:block">
                <div className="grid grid-cols-3 gap-10">
                  {STEPS.map((step) => (
                    <div key={step.n} className="flex flex-col gap-2.5 pt-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B98962]/70">
                        {step.n}
                      </div>

                      <StepHeading className="text-lg font-semibold text-[#0c0a09]">
                        {step.title}
                      </StepHeading>

                      <p
                        className={`${step.desktopMax} text-sm leading-[1.6] text-[#57534e]`}
                      >
                        {step.desktop}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
