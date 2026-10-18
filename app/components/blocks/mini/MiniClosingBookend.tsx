import MiniFinalCTA, {
  type MiniFinalCtaCopy,
} from "./MiniFinalCTA";
import "./MiniContactPhoto.css";
import {
  MiniFooterBrand,
  MiniFooterLegal,
  type MiniFooterCopy,
} from "./MiniFooter";

/**
 * One photographic crop spanning the final CTA and the main footer
 * information area. The legal strip stays outside this box as solid black.
 *
 * `variant="royal"` is the `/mini` closing surface: it swaps the photograph for
 * a CSS-only Royal Blue Moment surface (styled in MiniContact.css, scoped to the
 * `/mini` palette) and uses the approved primary button. Without it the markup
 * is unchanged, so every other route keeps the photograph.
 *
 * `variant="graphite"` is the same structure on a restrained Midnight Graphite
 * surface (no blue glow). Used by `/` only; `/mini` keeps `royal`.
 */
export default function MiniClosingBookend({
  ctaCopy,
  footerCopy,
  variant,
  photoBackground = false,
  topRule = true,
}: {
  ctaCopy?: MiniFinalCtaCopy;
  footerCopy?: MiniFooterCopy;
  variant?: "royal" | "graphite";
  /**
   * Selective dune photograph behind the CTA and footer row (graphite variant
   * only; styled in MiniContactPhoto.css). `/` only.
   */
  photoBackground?: boolean;
  /**
   * The 1px rule above the closing surface (`variant` branch only; default `true`).
   * `false` removes it where the photograph's own edge already separates the section
   * from the one above (`/`). The border is removed, not made transparent: the photo
   * layers sit inside the border box, so a transparent border would show a stripe.
   */
  topRule?: boolean;
}) {
  if (variant) {
    return (
      <footer className="text-white">
        <div
          data-closing-bookend
          data-contact-variant={variant}
          {...(variant === "graphite" && photoBackground
            ? { "data-contact-photo": "" }
            : {})}
          className={`relative overflow-hidden${topRule ? " border-t border-white/10" : ""}`}
        >
          <div
            aria-hidden="true"
            data-contact-bg
            className="pointer-events-none absolute inset-0"
          />

          <MiniFinalCTA copy={ctaCopy} embedded buttonStyle="primary" />

          <div
            data-contact-footer
            className="relative z-10 border-t border-white/10"
          >
            <MiniFooterBrand copy={footerCopy} />
          </div>
        </div>

        <div
          data-contact-legal
          {...(variant === "graphite" ? { "data-legal-quiet": "" } : {})}
          className="bg-[#080a0f]"
        >
          <MiniFooterLegal copy={footerCopy} />
        </div>
      </footer>
    );
  }

  return (
    <footer className="text-white">
      <div
        data-closing-bookend
        className="relative overflow-hidden border-t border-white/10"
      >
        <img
          src="/images/atmosphere/atmosphere-dune-01.webp"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_40%] lg:object-[58%_44%]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-black/45"
        />

        <MiniFinalCTA copy={ctaCopy} embedded />

        <div className="relative z-10 border-t border-white/10">
          <MiniFooterBrand copy={footerCopy} />
        </div>
      </div>

      <div className="bg-[#080808]">
        <MiniFooterLegal copy={footerCopy} />
      </div>
    </footer>
  );
}
