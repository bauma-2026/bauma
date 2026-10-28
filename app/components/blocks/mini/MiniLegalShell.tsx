import type { ReactNode } from "react";

import MiniPalette from "./MiniPalette";
import MiniHeader, { type MiniHeaderNavItem } from "./MiniHeader";
import { MiniFooterBrand, MiniFooterLegal } from "./MiniFooter";
import { EN_FOOTER_COPY, EN_HEADER_COPY } from "./enChromeCopy";
import { EN_PRIMARY_NAV } from "@/lib/i18n/routes";

/**
 * Page frame for the six legal pages (/pogoji-uporabe, /zasebnost, /piskotki and /en/terms, /en/privacy, /en/cookies):
 * the V3 surface (Base #080a0f), the refined header with the blue Kontakt, and the plain footer row of the V3 closing
 * (logo + info@bauma.si, then the quiet legal strip) without its CTA or photograph. Kontakt goes to the home page's
 * #contact, which exists; the language switch maps each legal page to its counterpart (`lib/i18n/routes.ts`).
 * The page's own content sits in `children`; nothing here changes MiniHeader or MiniFooter for other routes.
 */

/** Same primary navigation as `/`, `/work` and the case studies. */
const SL_NAV: MiniHeaderNavItem[] = [
  { href: "/pristop", label: "Pristop", id: "pristop" },
  { href: "/work", label: "Work", id: "work" },
  { href: "/o-nas", label: "O nas", id: "o-nas" },
];

export default function MiniLegalShell({
  lang,
  children,
}: {
  lang: "sl" | "en";
  children: ReactNode;
}) {
  const en = lang === "en";

  return (
    <MiniPalette>
      <div className="min-h-screen bg-[#080a0f] text-white">
        {en ? (
          // V3 page navigation, limited to live English pages (none yet: logo, language switch and Contact).
          <MiniHeader refined locale="en" copy={EN_HEADER_COPY} primaryNav={EN_PRIMARY_NAV} />
        ) : (
          <MiniHeader refined hideApproachNav primaryNav={SL_NAV} />
        )}

        <main>{children}</main>

        {/* The V3 closing's footer row and legal strip (MiniClosingBookend, graphite), without the CTA above them. */}
        <footer className="text-white">
          <div data-contact-variant="graphite" className="border-t border-white/10">
            <div data-contact-footer className="relative z-10 border-t border-white/10">
              <MiniFooterBrand copy={en ? EN_FOOTER_COPY : undefined} />
            </div>
          </div>
          <div data-contact-legal data-legal-quiet className="bg-[#080a0f]">
            <MiniFooterLegal copy={en ? EN_FOOTER_COPY : undefined} />
          </div>
        </footer>
      </div>
    </MiniPalette>
  );
}
