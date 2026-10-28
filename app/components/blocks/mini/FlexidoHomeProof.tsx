/**
 * Faithful, non-interactive reconstruction of the essential Flexido
 * homepage hero (flexido.eu) — logo strip, hero (background, eyebrow,
 * heading, subhead, static CTA pills, supporting note) and the bottom
 * "Področja" offer rail. Deliberately excludes header navigation, the
 * language switcher and the Kontakt button: those are non-content chrome
 * with no non-interactive equivalent worth faking. The CTAs, unlike that
 * chrome, are part of the hero's own visual hierarchy (verified against
 * the reference screenshots), so they're reproduced as static, subordinate
 * pills — real buttons only in appearance, never in behavior.
 *
 * Source of truth (verified against the live flexido-next repo):
 * - Copy: src/content/home/sl.ts (homeContent.hero) and
 *   src/content/solutions/familyIndex.ts (the 7 rail titles, same order
 *   used by the real Home offer rail)
 * - Markup/typography/geometry: src/components/blocks/home/Hero.tsx — the
 *   content grid's mobile/tablet steps and the offer-rail `<nav>`'s type
 *   are reused as verified; the desktop (`lg:`) step is a deliberate
 *   third value — taller than the real rail-branch's compact
 *   `lg:pb-6 lg:pt-16` (which read as too compressed once the rail
 *   returned) but well short of the real rail-less branch's
 *   `lg:min-h-[720px] lg:items-center lg:pb-24 lg:pt-36` — calibrated
 *   against the reference screenshots to feel substantial without
 *   ballooning back to the oversized pass. `.text-display` (40/56/68px,
 *   full scale, restored after an earlier pass shrank it to compensate
 *   for height) and `.eyebrow-on-dark` from app/globals.css.
 * - Assets:
 *   - public/work/flexido/proof/flexido-header.svg — the real wordmark, used as-is.
 *   - public/work/flexido/proof/hero-production.mp4 — the real hero clip, desktop/tablet
 *     background (`sm:` and up), matching the live site's own desktop
 *     treatment.
 *   - public/work/flexido/proof/flexido-hero-still.webp (byte-identical copy) — the real,
 *     text-free product-cell still the live site itself swaps in for the
 *     mobile hero (same filename Hero.tsx uses for exactly this purpose),
 *     used below `sm` instead of the video.
 *   `public/raw/mobile—home-flexido.png.png` and the banner screenshots
 *   were used only as pixel references during this pass (to calibrate
 *   header height, logo size, hero height/padding and text position) —
 *   never rendered or embedded; a full-page screenshot is not a
 *   background plate.
 *
 * Full-bleed, edge-to-edge like `FlexidoAreasProof` — no card, no rounded
 * frame, no forced aspect ratio. Non-interactive throughout: no <a>, no
 * href, no onClick, no hover states, no video controls.
 */

const SYSTEM_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/**
 * The hero copy per language, verbatim from flexido-next `src/content/home/{sl,en}.ts` (hero: eyebrow, titleLines,
 * subhead, ctaPrimary, ctaSecondary, slogan) and the offer rail (`solutionFamiliesLabel` and the solutions hub
 * `gridItems` titles, `src/content/solutions/`). Slovenian is the default; the English case study passes `locale="en"`.
 */
const COPY = {
  sl: {
    eyebrow: "Avtomatizacija proizvodnje",
    heading: "Povežemo tok med stroji. Ne samo robot ob stroju.",
    subhead:
      "Izdelujemo standardne robotske celice in celice po naročilu — ter jih povežemo v stabilen tok med stroji, z manj čakanja med posameznimi fazami.",
    ctaPrimary: "Poglejmo vaš proces",
    ctaSecondary: "Kako poteka projekt",
    slogan: "Od pregleda procesa do zagona sistem načrtuje, integrira in zažene ena ekipa.",
    railLabel: "Področja",
    areas: [
      "CNC stroji",
      "Brizganje plastike",
      "Manipulacija materiala",
      "Paletizacija in interna logistika",
      "Avtomatizacija proizvodnje",
      "Namenski sistemi",
      "Kolaborativni roboti",
    ],
  },
  en: {
    eyebrow: "Production automation",
    heading: "We connect the flow between machines. Not just a robot next to a machine.",
    subhead:
      "We build standard robotic cells and custom-built cells — and connect them into a stable flow between machines, with less waiting between stages.",
    ctaPrimary: "Let's look at your process",
    ctaSecondary: "How a project works",
    slogan: "One team reviews the process, designs and integrates the system, and commissions it.",
    railLabel: "Areas",
    areas: [
      "CNC machines",
      "Injection molding",
      "Material handling",
      "Palletizing and internal logistics",
      "Production automation",
      "Custom-built systems",
      "Collaborative robots",
    ],
  },
} as const;

export default function FlexidoHomeProof({
  /** Case study keeps the real white header strip; /mini's own intro block
   * carries the logo instead, so this renders nothing there. */
  showLogoStrip = true,
  /** `/mini` sits the proof on the System surface and frames it itself, so it
   * drops the closing hairline. Default keeps it for `/work/flexido` and `/en/mini`. */
  closingSeparator = true,
  /** Language of the reconstructed copy: the Slovenian site by default, the English site on `/en/work/flexido`. */
  locale = "sl",
}: {
  showLogoStrip?: boolean;
  closingSeparator?: boolean;
  locale?: "sl" | "en";
}) {
  const t = COPY[locale];
  return (
    <div style={{ fontFamily: SYSTEM_FONT_STACK }}>
      {/* LOGO STRIP — white, logo only, no nav, no language switcher, no Kontakt */}
      {showLogoStrip ? (
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex h-16 max-w-[1280px] items-center px-5 sm:px-6 lg:px-8">
            <img
              src="/work/flexido/proof/flexido-header.svg"
              alt="Flexido"
              className="h-8 w-auto"
            />
          </div>
        </div>
      ) : null}

      {/* HERO — real assets as decorative, cropped backgrounds; text, logo
          and rail stay real markup and are never cropped */}
      <div className="relative overflow-hidden bg-neutral-950">
        {/* Mobile — static still (no video decode cost, matches the real
            site's own mobile treatment and the mobile reference exactly) */}
        <img
          src="/work/flexido/proof/flexido-hero-still.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full origin-bottom scale-[1.08] object-cover object-[52%_50%] sm:hidden"
        />

        {/* Tablet/desktop — real hero-production.mp4 */}
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 hidden h-full w-full object-cover object-[30%_center] opacity-80 sm:block"
        >
          <source src="/work/flexido/proof/hero-production.mp4" type="video/mp4" />
        </video>

        {/* Mobile scrim — bottom-weighted, matches the bottom-anchored text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/62 to-black/10 sm:hidden"
        />
        {/* Tablet/desktop scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-b from-black/60 via-black/35 to-black/65 sm:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-black/78 via-black/45 to-black/20 sm:block"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
          <div className="grid min-h-[540px] items-end pb-10 pt-10 sm:min-h-[480px] sm:pb-10 sm:pt-16 lg:min-h-0 lg:pb-14 lg:pt-28">
            <div className="max-w-[920px]">
              <p
                className="text-[11px] uppercase tracking-[0.16em] text-white/80"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}
              >
                {t.eyebrow}
              </p>

              {/* h2, not h1: every page that embeds this proof owns its own h1.
                  Classes are unchanged, so the rendering is identical. */}
              <h2 className="mt-3 max-w-[20ch] text-balance text-[40px] font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:mt-4 sm:text-[56px] lg:text-[68px]">
                {t.heading}
              </h2>

              <p className="mt-4 max-w-[46ch] text-[16px] leading-6 text-white/75 sm:mt-5 sm:text-lg sm:leading-8 sm:text-white/80">
                {t.subhead}
              </p>

              {/* CTA pills — static, subordinate to the heading. Mobile shows
                  the primary only; both appear from `sm:` up, matching the
                  real Hero.tsx's own mobile/desktop CTA split. */}
              <div className="mt-6 sm:mt-7">
                <div className="sm:hidden">
                  <span className="flex h-12 w-full max-w-[300px] items-center justify-center rounded-full bg-white px-6 text-[14px] font-medium text-neutral-950">
                    {`${t.ctaPrimary} `}<span className="ml-2">→</span>
                  </span>
                </div>

                <div className="hidden sm:flex sm:gap-3">
                  <span className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[14px] font-medium text-neutral-950">
                    {`${t.ctaPrimary} `}<span className="ml-2">→</span>
                  </span>
                  <span className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-[14px] font-medium text-white/75">
                    {`${t.ctaSecondary} `}<span className="ml-2">→</span>
                  </span>
                </div>
              </div>

              <p className="mt-6 max-w-[46ch] text-[13px] text-white/45">
                {t.slogan}
              </p>
            </div>
          </div>
        </div>

        {/* OFFER RAIL — complete 7-item "Področja" list, desktop/tablet only,
            matching the real site's own rail-hidden-on-mobile behavior.
            Uses the exact same `mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8`
            recipe as the hero-content wrapper above (padding and max-width
            on the SAME element, not split across nested divs) so the rail's
            left edge and its separator line line up with the paragraph
            column at every viewport width, not just below the 1280 cap. */}
        <div className="relative z-10 hidden sm:block">
          <div className="mx-auto max-w-[1280px] border-t border-white/10 px-5 pb-8 pt-5 sm:px-6 lg:px-8">
            {/* Two-column row: the label is a fixed left column that never
                wraps; the items live in their own flexible column to its
                right and wrap independently, so a wrapped second line
                starts under "01", not under "Področja". */}
            <div className="flex items-start gap-x-4 gap-y-2 text-[11.5px] font-medium leading-[1.4] tracking-[0.01em]">
              <span className="shrink-0 text-white/40">{t.railLabel}</span>
              <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-4 gap-y-2">
                {t.areas.map((area, index) => (
                  <span key={area} className="shrink-0 text-white/[0.72]">
                    <span className="mr-1.5 tabular-nums text-white/[0.52]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing separator — sits after the hero (and, on sm:+, after the
          Področja rail's own border-t above it) and directly before the
          caption in page.tsx, on every breakpoint. Not redundant with the
          rail's separator: that one opens the rail, this one closes the
          whole proof. */}
      {closingSeparator ? <div className="border-b border-white/10" /> : null}
    </div>
  );
}
