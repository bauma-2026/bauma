import type { ContactCohesionVariant } from "./contactCohesionCopy";

export const CONTACT_COHESION_MAILTO =
  "mailto:gregor@bauma.si?subject=Povpra%C5%A1evanje%20za%20projekt";

type ContactCohesionSectionProps = {
  variant: ContactCohesionVariant;
  /** When false, gregor@ is omitted from Contact (footer remains separately). */
  showEmail: boolean;
};

/**
 * Lab Contact block — mirrors production MiniFinalCTA structure/styling
 * with variant copy + layout knobs. Not used on production homepage.
 */
export default function ContactCohesionSection({
  variant,
  showEmail,
}: ContactCohesionSectionProps) {
  const actionsRow =
    showEmail && variant.actionsLayout === "row-desktop"
      ? "mt-8 flex flex-col items-center gap-2 sm:mt-9 lg:flex-row lg:justify-center lg:gap-5"
      : "mt-8 flex flex-col items-center gap-2 sm:mt-9";

  return (
    <section
      id="contact"
      data-contact-cohesion={variant.id}
      data-contact-email={showEmail ? "visible" : "hidden"}
      className="border-t border-white/10 bg-[#0a0a0a] py-14 text-white sm:py-16 lg:py-20"
    >
      <div className="mini-page-rail">
        <div
          className="mx-auto text-center"
          style={{ maxWidth: variant.columnMaxPx }}
        >
          <h2 className="home-bridge-heading">
            {variant.headingLines.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h2>

          <p
            className="mx-auto mt-5 text-sm leading-6 text-white/60 sm:text-base sm:leading-7"
            style={{ maxWidth: variant.supportMaxPx }}
          >
            {variant.support}
          </p>

          <div className={actionsRow}>
            <a
              href={CONTACT_COHESION_MAILTO}
              className="bauma-focus-pill group inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-[background-color,color] duration-300 hover:bg-white/90"
            >
              <span className="inline-flex items-center gap-2">
                {variant.cta}
                <span
                  aria-hidden
                  className="transition duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </a>

            {showEmail ? (
              <a
                href={CONTACT_COHESION_MAILTO}
                className="rounded-sm px-2 py-2 text-sm font-medium text-white/50 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:text-white/75 hover:decoration-white/40 focus:outline-none focus-visible:text-white/75 focus-visible:decoration-white/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/50"
              >
                gregor@bauma.si
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
