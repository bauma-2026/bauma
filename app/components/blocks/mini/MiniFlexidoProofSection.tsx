import FlexidoHomeProof from "./FlexidoHomeProof";

const flexidoProofCaption =
  "Ni posnetek zaslona. Gre za natančno rekonstrukcijo hero razdelka domače strani — z enako postavitvijo, tipografijo in besedilom kot na flexido.eu.";

/**
 * "Iz prakse" Flexido proof (SL). Shared by `/mini` and `/`.
 * Shares the System surface and has no top padding of its own: System's bottom
 * padding is the only gap, so System → Iz prakse → Flexido reads as one section.
 */
export default function MiniFlexidoProofSection({
  intro = "Tako ta sistem izgleda v resničnem projektu.",
  divider = false,
  roundedProof = false,
}: {
  /** Supporting line under "Flexido". Default keeps `/mini`; `/` passes its own. */
  intro?: string;
  /** Short rule above the eyebrow, drawn inside System's bottom padding (adds no height). `/` only. */
  divider?: boolean;
  /** Clips the whole reconstruction (video, overlays, rail) to a 6px / 8px (from 640px) radius. `/` only. */
  roundedProof?: boolean;
}) {
  return (
    <section
      data-section="flexido-proof"
      className="scroll-mt-13 bg-[var(--mini-surface-system,#0e0e0f)] text-white"
    >
      <div className="mini-page-rail pb-6">
        <p
          className={`text-[11px] font-medium uppercase tracking-[0.22em] text-white/60${
            divider ? " relative" : ""
          }`}
        >
          {divider ? (
            <span
              aria-hidden="true"
              className="absolute bottom-full left-0 mb-8 block h-px w-[72px] bg-[var(--mini-border-section,#293244)] sm:mb-10 lg:mb-12"
            />
          ) : null}
          Iz prakse
        </p>
        <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-white/90 sm:text-xl">
          Flexido
        </p>
        <p className="mt-2 max-w-[46ch] text-base leading-7 text-white/55">
          {intro}
        </p>
      </div>

      {/* Aligned to the Bauma content rail (80rem max, 1.5rem gutter below md, 2rem from md → 1216px).
          Edge to edge below sm so the proof's text keeps the full column. */}
      <div
        className={`mx-auto w-full sm:w-[calc(100%-3rem)] sm:max-w-[1216px] md:w-[calc(100%-4rem)]${
          roundedProof ? " isolate overflow-hidden rounded-[6px] sm:rounded-[8px]" : ""
        }`}
      >
        <FlexidoHomeProof showLogoStrip={false} closingSeparator={false} />
      </div>

      <div className="mini-page-rail pb-14 pt-6 sm:pb-16 lg:pb-20">
        <p className="mx-auto max-w-[720px] text-center text-sm font-normal leading-relaxed text-white/35">
          {flexidoProofCaption}
        </p>
        <p className="mt-3 text-center text-sm">
          <a
            href="https://www.flexido.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/55 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white/85 hover:decoration-white/50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50"
          >
            Poglejte spletno stran
            <span aria-hidden="true"> ↗</span>
            <span className="sr-only"> (odpre se v novem zavihku)</span>
          </a>
        </p>
      </div>
    </section>
  );
}
