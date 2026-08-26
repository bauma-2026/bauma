import MiniFinalCTA, {
  type MiniFinalCtaCopy,
} from "./MiniFinalCTA";
import {
  MiniFooterBrand,
  MiniFooterLegal,
  type MiniFooterCopy,
} from "./MiniFooter";

/**
 * One photographic crop spanning the final CTA and the main footer
 * information area. The legal strip stays outside this box as solid black.
 */
export default function MiniClosingBookend({
  ctaCopy,
  footerCopy,
}: {
  ctaCopy?: MiniFinalCtaCopy;
  footerCopy?: MiniFooterCopy;
}) {
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
