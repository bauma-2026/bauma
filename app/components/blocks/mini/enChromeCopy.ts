import type { MiniHeaderCopy } from "./MiniHeader";
import type { MiniFooterCopy } from "./MiniFooter";
import { EN_FOOTER, EN_HEADER } from "@/components/home/copy/enHomepage";

/**
 * Header and footer copy of the English V3 shells (`MiniLegalShell` for /en/terms, /en/privacy, /en/cookies and the
 * English 404). The navigation itself is `EN_PRIMARY_NAV` (`lib/i18n/routes.ts`), which lists only live English pages.
 */
export const EN_HEADER_COPY: MiniHeaderCopy = {
  homeHref: "/en",
  langHref: "/",
  langLabel: EN_HEADER.langSwitch,
  langAria: EN_HEADER.langSwitchAria,
  langMobileLabel: EN_HEADER.langSwitchMobile,
  navApproach: EN_HEADER.navApproach,
  navSystem: EN_HEADER.navSystem,
  navContact: EN_HEADER.navContact,
  headerCta: EN_HEADER.headerCta,
  menuOpen: EN_HEADER.menuOpen,
  menuClose: EN_HEADER.menuClose,
};

export const EN_FOOTER_COPY: MiniFooterCopy = {
  homeHref: "/en",
  email: EN_FOOTER.email,
  legalAria: EN_FOOTER.legalAria,
  legal: [...EN_FOOTER.legal],
};
