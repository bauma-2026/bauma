"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  mobileBlurb: string;
};

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
  mobileBlurb: "Struktura, ki uporabnika vodi od razumevanja do odločitve.",
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
      className="inline-flex h-11 w-11 items-center justify-end bg-transparent text-white focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/50 md:hidden"
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
}: {
  copy: MiniHeaderCopy;
  langSwitchHref: string;
  activeId: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  /** True only pre-scroll on the homepage, while the header sits over the light hero photo. */
  overPhotoHero: boolean;
}) {
  const base = copy.homeHref === "/" ? "" : copy.homeHref.replace(/\/$/, "");
  const navItems = [
    { href: `${base}/#approach`, label: copy.navApproach, id: "approach" },
    { href: `${base}/#system`, label: copy.navSystem, id: "system" },
  ];
  const contactHref = `${base}/#contact`;

  return (
    <div className="mini-page-rail flex h-[52px] items-center justify-between">
      <Link
        href={copy.homeHref}
        aria-label="Bauma home"
        className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
        onClick={() => setIsMenuOpen(false)}
      >
        <img
          src="/logo/bauma-logo.svg"
          alt="Bauma"
          width={68}
          height={13}
          className="h-auto w-[68px] invert sm:w-[78px]"
        />
      </Link>

      <div className="flex items-center gap-6">
        <nav
          aria-label="Page sections"
          className="hidden items-center gap-6 md:flex"
        >
          {navItems.map((item) => {
            const isActive = activeId === item.id;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-[12px] font-medium transition-colors duration-300 ${
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
          className={`hidden border-l pl-5 text-[12px] font-medium transition-colors duration-300 md:inline-flex ${
            overPhotoHero
              ? "border-black/15 text-black/50 hover:text-black/85"
              : "border-white/10 text-white/[0.48] hover:text-white"
          }`}
        >
          {copy.langLabel}
        </Link>

        <Link
          href={contactHref}
          aria-current={activeId === "contact" ? "page" : undefined}
          className="hidden rounded-full bg-[#FCAC33] px-3.5 py-1.5 text-[12px] font-medium text-black transition hover:bg-[#FCAC33]/90 sm:px-4 sm:py-1.5 sm:text-xs md:inline-flex"
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

const menuFocusClass =
  "focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/50";

function MobileMenu({
  copy,
  langSwitchHref,
  onClose,
}: {
  copy: MiniHeaderCopy;
  langSwitchHref: string;
  onClose: () => void;
}) {
  const base = copy.homeHref === "/" ? "" : copy.homeHref.replace(/\/$/, "");
  const navItems = [
    { href: `${base}/#approach`, label: copy.navApproach },
    { href: `${base}/#system`, label: copy.navSystem },
  ];
  const contactHref = `${base}/#contact`;

  return (
    <div
      id={MOBILE_MENU_ID}
      role="dialog"
      aria-modal="true"
      aria-label={copy.homeHref === "/en" ? "Menu" : "Meni"}
      className="fixed inset-0 z-[998] overflow-y-auto bg-[#080808] text-white md:hidden"
    >
      <div className="mini-page-rail flex min-h-full flex-col pt-[78px] pb-[max(24px,env(safe-area-inset-bottom))]">
        <nav aria-label="Mobile navigation" className="flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex min-h-[52px] w-full items-center border-b border-white/10 text-[20px] font-normal tracking-[-0.02em] text-white transition-colors duration-200 hover:text-white/70 ${menuFocusClass}`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href={langSwitchHref}
            aria-label={copy.langAria}
            onClick={onClose}
            className={`mt-3 flex min-h-11 w-full items-center text-[13px] font-medium tracking-[0.04em] text-white/70 transition-colors duration-200 hover:text-white ${menuFocusClass}`}
          >
            {copy.langLabel}
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <Link
            href={contactHref}
            onClick={onClose}
            className={`flex h-14 w-full items-center justify-center rounded-full bg-[#FCAC33] text-sm font-medium text-black transition-colors duration-200 hover:bg-[#FCAC33]/90 ${menuFocusClass}`}
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
}: {
  copy?: MiniHeaderCopy;
}) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHomepage = pathname === "/" || pathname === "/en";
  const [isHeroVisible, setIsHeroVisible] = useState(isHomepage);
  const [hideHeroChrome, setHideHeroChrome] = useState(false);
  const langSwitchHref = useLanguageSwitchHref(copy.langHref);
  const overPhotoHero = isHomepage && isHeroVisible && !isMenuOpen;
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

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);

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
        data-header-phase={
          hideHeroChrome && !isMenuOpen
            ? "gap"
            : overPhotoHero
              ? "hero"
              : "content"
        }
        className="fixed left-0 top-0 z-[999] w-full transition-[opacity,transform] duration-[180ms] ease-out"
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 border-b border-white/10 bg-[#080808] transition-opacity duration-[180ms] ease-out ${
            overPhotoHero ? "opacity-0" : "opacity-100"
          }`}
        />
        <div className={`relative ${overPhotoHero ? "text-black" : "text-white"}`}>
          <HeaderInner
            copy={copy}
            langSwitchHref={langSwitchHref}
            activeId={activeId}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            overPhotoHero={overPhotoHero}
          />
        </div>
      </header>

      {isMenuOpen ? (
        <MobileMenu
          copy={copy}
          langSwitchHref={langSwitchHref}
          onClose={() => setIsMenuOpen(false)}
        />
      ) : null}
    </>
  );
}
