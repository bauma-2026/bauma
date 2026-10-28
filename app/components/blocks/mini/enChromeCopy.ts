import type { MiniHeaderCopy } from "./MiniHeader";
import type { MiniFooterCopy } from "./MiniFooter";
import type { MiniFinalCtaCopy } from "./MiniFinalCTA";
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
  // "Terms of use" (the page's own title is "Terms of Use"); the legacy EN_FOOTER keeps "Terms" for the old /en/mini.
  legal: EN_FOOTER.legal.map((item) =>
    item.href === "/en/terms" ? { href: item.href, label: "Terms of use" } : { ...item },
  ),
};

/**
 * Closing section of the English content pages (`/en/approach`, later `/en/about`), the counterpart of the Slovenian
 * "Imate projekt? / Pišite nam." closing on /pristop and /o-nas. The eyebrow stays empty, as there: the page CSS hides it.
 */
export const EN_PAGE_CLOSING: MiniFinalCtaCopy = {
  eyebrow: "",
  line1: "Have a project?",
  line2: "Write to us.",
  cta: "Tell us about your project",
  mailto: "mailto:info@bauma.si?subject=Project%20inquiry",
};
