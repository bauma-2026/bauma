"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import "./MiniHeaderRefined.css";

export type MiniHeaderCopy = {
  homeHref: string;
  langHref: string;
  langLabel: string;
  langAria: string;
  langMobileLabel: string;
  navApproach: string;
  navSystem: string;
  navContact: string;
  headerCta: string;
  menuOpen: string;
  menuClose: string;
};

/** One primary navigation link. `id` is only used for the scroll-spy active state. */
export type MiniHeaderNavItem = { href: string; label: string; id: string };

const DEFAULT_COPY: MiniHeaderCopy = {
  homeHref: "/",
  langHref: "/en",
  langLabel: "EN",
  langAria: "English version",
  langMobileLabel: "English",
  navApproach: "Pristop",
  navSystem: "Sistem",
  navContact: "Kontakt",
  headerCta: "Kontakt",
  menuOpen: "Odpri meni",
  menuClose: "Zapri meni",
};

/** Must match nav targets (Approach / System / Contact). */
const sectionIds = ["approach", "system", "contact"] as const;
const PRESERVED_HOME_HASHES = new Set(["#approach", "#system", "#contact"]);
const LANGUAGE_ROUTE_MAP: Record<string, string> = {
  "/pogoji-uporabe": "/en/terms",
  "/zasebnost": "/en/privacy",
  "/piskotki": "/en/cookies",
  "/en/terms": "/pogoji-uporabe",
  "/en/privacy": "/zasebnost",
  "/en/cookies": "/piskotki",
};

/**
 * Legal routes use explicit equivalents. Homepage switching keeps
 * #approach|#system|#contact; all other routes keep langHref unchanged.
 */
function languageSwitchHref(langHref: string): string {
  if (typeof window === "undefined") return langHref;

  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const mappedRoute = LANGUAGE_ROUTE_MAP[path];
  if (mappedRoute) return mappedRoute;

  if (path !== "/" && path !== "/en") return langHref;

  const hash = window.location.hash;
  if (!PRESERVED_HOME_HASHES.has(hash)) return langHref;

  if (langHref === "/" || langHref === "") return `/${hash}`;
  return `${langHref.replace(/\/$/, "")}${hash}`;
}

export function useLanguageSwitchHref(langHref: string) {
  const [href, setHref] = useState(langHref);

  useEffect(() => {
    const sync = () => setHref(languageSwitchHref(langHref));
    sync();

    // Native hash jumps.
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);

    // Next.js <Link href="/#section"> uses history.pushState and does not
    // fire hashchange — keep the lang href attribute in sync for new-tab too.
    const { pushState, replaceState } = history;
    history.pushState = (...args: Parameters<History["pushState"]>) => {
      const result = pushState.apply(history, args);
      queueMicrotask(sync);
      return result;
    };
    history.replaceState = (...args: Parameters<History["replaceState"]>) => {
      const result = replaceState.apply(history, args);
      queueMicrotask(sync);
      return result;
    };

    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      history.pushState = pushState;
      history.replaceState = replaceState;
    };
  }, [langHref]);

  return href;
}

const MOBILE_MENU_ID = "bauma-mobile-menu";
const MOBILE_MENU_TRIGGER_ID = "bauma-mobile-menu-trigger";
/** Tailwind `md` — where the mobile menu and its trigger are hidden. */
const MENU_DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Invisible 44px tall hit area for small text links, via a pseudo-element, so
 * the visible size, layout and focus ring stay unchanged. Needs `relative`.
 */
export const HIT_AREA =
  "relative before:absolute before:-inset-x-2 before:-inset-y-[13px] before:content-['']";
export const HIT_AREA_LOGO =
  "relative before:absolute before:-inset-x-1 before:-inset-y-[15px] before:content-['']";

export function useMobileMenuChrome(
  isMenuOpen: boolean,
  setIsMenuOpen: (open: boolean) => void,
) {
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // The menu is `md:hidden`; if the viewport grows past that breakpoint while it
  // is open, close it so scroll lock, trap and the solid header don't outlive it.
  useEffect(() => {
    if (!isMenuOpen) return;
    const query = window.matchMedia(MENU_DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [isMenuOpen, setIsMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    function focusables() {
      const header = document.querySelector("header");
      const menu = document.getElementById(MOBILE_MENU_ID);
      return [header, menu]
        .filter((root): root is HTMLElement => root instanceof HTMLElement)
        .flatMap((root) =>
          [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")],
        )
        .filter((el) => el.getClientRects().length > 0);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.getElementById(MOBILE_MENU_TRIGGER_ID)?.focus();
    };
  }, [isMenuOpen, setIsMenuOpen]);
}

export function MobileMenuTrigger({
  open,
  openLabel,
  closeLabel,
  onToggle,
}: {
  open: boolean;
  openLabel: string;
  closeLabel: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      id={MOBILE_MENU_TRIGGER_ID}
      aria-controls={MOBILE_MENU_ID}
      aria-label={open ? closeLabel : openLabel}
      aria-expanded={open}
      onClick={onToggle}
      data-header-focus
      className="inline-flex h-11 w-11 items-center justify-end bg-transparent text-white md:hidden"
    >
      {open ? (
        <span aria-hidden="true" className="relative block h-[18px] w-[18px] overflow-visible">
          <span className="absolute left-1/2 top-1/2 h-[1.5px] w-[24px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
          <span className="absolute left-1/2 top-1/2 h-[1.5px] w-[24px] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="flex w-[18px] flex-col items-end justify-center gap-[5px]"
        >
          <span className="h-[1.5px] w-[18px] rounded-full bg-white" />
          <span className="h-[1.5px] w-[14px] rounded-full bg-white" />
          <span className="h-[1.5px] w-[10px] rounded-full bg-white" />
        </span>
      )}
    </button>
  );
}

function HeaderInner({
  copy,
  langSwitchHref,
  activeId,
  isMenuOpen,
  setIsMenuOpen,
  overPhotoHero,
  hideApproachNav,
  refined,
  primaryNav,
  contactHref: contactHrefOverride,
}: {
  copy: MiniHeaderCopy;
  langSwitchHref: string;
  activeId: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  /** True only pre-scroll on the homepage, while the header sits over the light hero photo. */
  overPhotoHero: boolean;
  hideApproachNav: boolean;
  refined: boolean;
  primaryNav?: MiniHeaderNavItem[];
  contactHref?: string;
}) {
  const base = copy.homeHref === "/" ? "" : copy.homeHref.replace(/\/$/, "");
  const navItems =
    primaryNav ??
    [
      { href: `${base}/#approach`, label: copy.navApproach, id: "approach" },
      { href: `${base}/#system`, label: copy.navSystem, id: "system" },
    ].filter((item) => !(hideApproachNav && item.id === "approach"));
  const contactHref = contactHrefOverride ?? `${base}/#contact`;

  return (
    <div className="mini-page-rail flex h-[52px] items-center justify-between">
      <Link
        href={copy.homeHref}
        aria-label={copy.homeHref === "/en" ? "Bauma home" : "Bauma — domov"}
        data-header-focus
        className={`${HIT_AREA_LOGO} inline-flex items-center transition-opacity duration-200 hover:opacity-80`}
        onClick={() => setIsMenuOpen(false)}
      >
        <img
          src="/logo/bauma-logo.svg"
          alt="Bauma"
          width={68}
          height={13}
          className={`h-auto invert ${refined ? "w-[76px] md:w-[90px]" : "w-[76px] sm:w-[78px]"}`}
        />
      </Link>

      <div className="flex items-center gap-6">
        <nav
          aria-label={
            primaryNav
              ? "Glavna navigacija"
              : copy.homeHref === "/en"
                ? "Page sections"
                : "Razdelki strani"
          }
          className="hidden items-center gap-6 md:flex"
        >
          {navItems.map((item) => {
            const isActive = activeId === item.id;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                data-header-focus
                data-header-label={refined ? "" : undefined}
                className={`${HIT_AREA} text-[12px] font-medium transition-colors duration-300 ${
                  overPhotoHero
                    ? isActive
                      ? "text-black/85"
                      : "text-black/55 hover:text-black/85"
                    : isActive
                      ? "text-white"
                      : "text-white/55 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={langSwitchHref}
          aria-label={copy.langAria}
          data-header-focus
          data-header-label={refined ? "" : undefined}
          data-header-divider={refined ? "" : undefined}
          className={`${HIT_AREA} hidden border-l pl-5 text-[12px] font-medium transition-colors duration-300 md:inline-flex ${
            overPhotoHero
              ? "border-black/15 text-black/50 hover:text-black/85"
              : "border-[color:var(--mini-border-header,color-mix(in_oklab,#fff_10%,transparent))] text-white/[0.48] hover:text-white"
          }`}
        >
          {copy.langLabel}
        </Link>

        <Link
          href={contactHref}
          aria-current={activeId === "contact" ? "location" : undefined}
          data-header-focus
          data-cta="primary"
          data-cta-size="compact"
          className="hidden rounded-full bg-[var(--mini-accent,#FCAC33)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--mini-accent-fg,#000)] transition hover:bg-[var(--mini-accent,#FCAC33)]/90 sm:px-4 sm:py-1.5 sm:text-xs md:inline-flex"
        >
          {copy.headerCta}
        </Link>

        <MobileMenuTrigger
          open={isMenuOpen}
          openLabel={copy.menuOpen}
          closeLabel={copy.menuClose}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>
    </div>
  );
}

function MobileMenu({
  copy,
  langSwitchHref,
  onClose,
  hideApproachNav,
  refined,
  primaryNav,
  contactHref: contactHrefOverride,
}: {
  copy: MiniHeaderCopy;
  langSwitchHref: string;
  onClose: () => void;
  hideApproachNav: boolean;
  refined: boolean;
  primaryNav?: MiniHeaderNavItem[];
  contactHref?: string;
}) {
  const base = copy.homeHref === "/" ? "" : copy.homeHref.replace(/\/$/, "");
  const navItems =
    primaryNav ??
    [
      { href: `${base}/#approach`, label: copy.navApproach, id: "approach" },
      { href: `${base}/#system`, label: copy.navSystem, id: "system" },
    ].filter((item) => !(hideApproachNav && item.id === "approach"));
  const contactHref = contactHrefOverride ?? `${base}/#contact`;

  return (
    <div
      id={MOBILE_MENU_ID}
      data-header-refined={refined ? "" : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={copy.homeHref === "/en" ? "Menu" : "Meni"}
      className="fixed inset-0 z-[998] overflow-y-auto bg-[var(--mini-surface-header,#080808)] text-white md:hidden"
    >
      <div className="mini-page-rail flex min-h-full flex-col pt-[78px] pb-[max(24px,env(safe-area-inset-bottom))]">
        <nav
          aria-label={copy.homeHref === "/en" ? "Mobile navigation" : "Navigacija"}
          className="flex flex-col"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              data-header-focus
              className="flex min-h-[52px] w-full items-center border-b border-white/10 text-[20px] font-normal tracking-[-0.02em] text-white transition-colors duration-200 hover:text-white/70"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href={langSwitchHref}
            aria-label={copy.langAria}
            onClick={onClose}
            data-header-focus
            className="mt-3 flex min-h-11 w-full items-center text-[13px] font-medium tracking-[0.04em] text-white/70 transition-colors duration-200 hover:text-white"
          >
            {copy.langLabel}
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <Link
            href={contactHref}
            onClick={onClose}
            data-header-focus
            data-cta="primary"
            data-cta-size="menu"
            className="flex h-14 w-full items-center justify-center rounded-full bg-[var(--mini-accent,#FCAC33)] text-sm font-medium text-[var(--mini-accent-fg,#000)] transition-colors duration-200 hover:bg-[var(--mini-accent,#FCAC33)]/90"
          >
            {copy.headerCta}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MiniHeader({
  copy = DEFAULT_COPY,
  treatAsHomepage = false,
  darkHero = false,
  hideApproachNav = false,
  refined = false,
  primaryNav,
  contactHref,
  transparentAtTop = false,
  borderColor,
}: {
  copy?: MiniHeaderCopy;
  /**
   * Forces homepage hero header treatment on routes that render the exact
   * homepage hero but whose pathname isn't `/` or `/en` (e.g. the noindex
   * `/mini` preview). Production routes never pass this — default keeps
   * their pathname-based behavior unchanged.
   */
  treatAsHomepage?: boolean;
  /** Hero is dark (no pale photograph): keep light header text over it. `/mini` glow test only. */
  darkHero?: boolean;
  /** Page has no Approach section (the Royal Blue `/`): drop the Approach nav item. Default keeps every other route. */
  hideApproachNav?: boolean;
  /**
   * Homepage art direction (Direction A). Scopes the graphite surface, 90px desktop wordmark and
   * mono nav labels in `MiniHeaderRefined.css`; the hero-to-sticky lifecycle is the shared one.
   * Only `/` passes it; every other route keeps its current header.
   */
  refined?: boolean;
  /**
   * Replaces the default Approach / System section anchors with explicit page links (desktop nav
   * and mobile menu). Omit to keep each route's current navigation. Only the Slovenian `/` passes it.
   */
  primaryNav?: MiniHeaderNavItem[];
  /**
   * Overrides the Contact target (desktop CTA and mobile menu). Omit to keep `<home>/#contact`.
   * Pages that render their own `#contact` section pass `"#contact"` so the link scrolls in place.
   */
  contactHref?: string;
  /**
   * Transparent over the page's own dark hero while the page is at scroll 0, then the usual solid
   * surface as soon as it scrolls. Light text, the solid Kontakt button and no hero lifecycle (no
   * hidden gap). Default `false` keeps every other route unchanged.
   */
  transparentAtTop?: boolean;
  /**
   * Overrides the colour of the header's 1px bottom border (the solid surface only). Default
   * `undefined` keeps the shared `--mini-border-header` colour on every other route.
   */
  borderColor?: string;
}) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHomepage =
    treatAsHomepage || pathname === "/" || pathname === "/en";
  const [isHeroVisible, setIsHeroVisible] = useState(isHomepage);
  const [hideHeroChrome, setHideHeroChrome] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const langSwitchHref = useLanguageSwitchHref(copy.langHref);
  const overPhotoHero = transparentAtTop
    ? atTop && !isMenuOpen
    : isHomepage && isHeroVisible && !isMenuOpen;
  const darkText = overPhotoHero && !darkHero && !transparentAtTop;
  useMobileMenuChrome(isMenuOpen, setIsMenuOpen);

  useEffect(() => {
    function updateActiveSection() {
      let current = "";
      const marker = 120;
      const hero = document.querySelector<HTMLElement>("[data-hero-edge-hero]");
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      const heroInView = heroBottom > 0;

      setIsHeroVisible(hero ? heroInView : false);

      const copyBlock = document.querySelector<HTMLElement>("[data-hero-copy]");
      const colliding = copyBlock
        ? copyBlock.getBoundingClientRect().top < 64
        : false;
      const scrolledPast = window.scrollY >= 100;
      setHideHeroChrome(heroInView && (scrolledPast || colliding));
      setAtTop(window.scrollY < 8);

      sectionIds.forEach((id) => {
        // Nav ids may sit on a zero-height anchor marker; track its section.
        const section = document.getElementById(id)?.closest("section");

        if (!section) return;

        const rect = section.getBoundingClientRect();

        // Active while the section crosses the header marker line.
        if (rect.top <= marker && rect.bottom > marker) {
          current = id;
        }
      });

      // Near page end: prefer the last nav target (Contact).
      const doc = document.documentElement;
      const atBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 12;
      if (atBottom) {
        current = "contact";
      }

      setActiveId(current);
    }

    updateActiveSection();
    // Deep-link / hash landing can settle after the first paint.
    const raf = window.requestAnimationFrame(updateActiveSection);

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [isHomepage]);

  return (
    <>
      <header
        data-header-ink={darkText ? "dark" : undefined}
        data-header-refined={refined ? "" : undefined}
        data-header-cta={
          refined
            ? isHomepage && isHeroVisible && !transparentAtTop
              ? "ghost"
              : "solid"
            : undefined
        }
        data-header-phase={
          hideHeroChrome && !isMenuOpen
            ? "gap"
            : overPhotoHero
              ? "hero"
              : "content"
        }
        className={`fixed left-0 top-0 z-[999] w-full transition-[opacity,transform] duration-[180ms] ease-out${
          transparentAtTop && overPhotoHero
            ? " shadow-[inset_0_-1px_0_rgba(255,255,255,0.10)]"
            : ""
        }`}
      >
        <div
          aria-hidden="true"
          data-header-scrim
          className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-[88px] bg-gradient-to-b from-black/[0.28] via-black/10 to-transparent sm:hidden ${
            overPhotoHero && !transparentAtTop ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden="true"
          style={borderColor ? { borderBottomColor: borderColor } : undefined}
          className={`pointer-events-none absolute inset-0 border-b border-[color:var(--mini-border-header,color-mix(in_oklab,#fff_10%,transparent))] bg-[var(--mini-surface-header,#080808)] transition-opacity duration-[180ms] ease-out ${
            overPhotoHero ? "opacity-0" : "opacity-100"
          }`}
        />
        <div className={`relative z-10 ${darkText ? "text-black" : "text-white"}`}>
          <HeaderInner
            copy={copy}
            langSwitchHref={langSwitchHref}
            activeId={activeId}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            overPhotoHero={darkText}
            hideApproachNav={hideApproachNav}
            refined={refined}
            primaryNav={primaryNav}
            contactHref={contactHref}
          />
        </div>
      </header>

      {isMenuOpen ? (
        <MobileMenu
          copy={copy}
          langSwitchHref={langSwitchHref}
          onClose={() => setIsMenuOpen(false)}
          hideApproachNav={hideApproachNav}
          refined={refined}
          primaryNav={primaryNav}
          contactHref={contactHref}
        />
      ) : null}
    </>
  );
}
