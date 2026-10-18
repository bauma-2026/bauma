"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HIT_AREA, HIT_AREA_LOGO, MobileMenuTrigger, useLanguageSwitchHref, useMobileMenuChrome } from "./MiniHeader";

const navItems = [
  { href: "/en/#approach", label: "Approach", id: "approach" },
  { href: "/en/#system", label: "System", id: "system" },
];

const sectionIds = ["flow", "system", "contact"];

function HeaderInner({
  activeId,
  isMenuOpen,
  setIsMenuOpen,
  langSwitchHref,
}: {
  activeId: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  langSwitchHref: string;
}) {
  return (
    <div className="mini-page-rail flex h-[52px] items-center justify-between">
      <Link
        href="/en"
        aria-label="Bauma home"
        data-header-focus
        className={`${HIT_AREA_LOGO} inline-flex items-center transition-opacity duration-200 hover:opacity-80`}
        onClick={() => setIsMenuOpen(false)}
      >
        <img
          src="/logo/bauma-logo.svg"
          alt="Bauma"
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
                aria-current={isActive ? "location" : undefined}
                data-header-focus
                className={`${HIT_AREA} text-[12px] font-medium transition ${
                  isActive ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={langSwitchHref}
          aria-label="Slovenian version"
          data-header-focus
          className={`${HIT_AREA} hidden border-l border-white/10 pl-5 text-[12px] font-medium text-white/45 transition hover:text-white md:inline-flex`}
        >
          SL
        </Link>

        <Link
          href="/en/#contact"
          aria-current={activeId === "contact" ? "location" : undefined}
          data-header-focus
          className={`hidden rounded-full px-3.5 py-1.5 text-[12px] font-medium transition sm:px-4 sm:py-1.5 sm:text-xs md:inline-flex ${
            activeId === "contact"
              ? "bg-white text-black ring-1 ring-white/30"
              : "bg-white text-black hover:bg-white/90"
          }`}
        >
          Contact
        </Link>

        <MobileMenuTrigger
          open={isMenuOpen}
          openLabel="Open menu"
          closeLabel="Close menu"
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>
    </div>
  );
}

function MobileMenu({
  onClose,
  langSwitchHref,
}: {
  onClose: () => void;
  langSwitchHref: string;
}) {
  return (
    <div
      id="bauma-mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[998] overflow-y-auto bg-[#080808] text-white md:hidden"
    >
      <div className="mini-page-rail flex min-h-full flex-col pt-[78px] pb-[max(24px,env(safe-area-inset-bottom))]">
        <nav aria-label="Mobile navigation" className="flex flex-col">
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
            aria-label="Slovenian version"
            onClick={onClose}
            data-header-focus
            className="mt-3 flex min-h-11 w-full items-center text-[13px] font-medium tracking-[0.04em] text-white/70 transition-colors duration-200 hover:text-white"
          >
            SL
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <Link
            href="/en/#contact"
            onClick={onClose}
            data-header-focus
            className="flex h-14 w-full items-center justify-center rounded-full bg-[#FCAC33] text-sm font-medium text-black transition-colors duration-200 hover:bg-[#FCAC33]/90"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MiniHeaderEn() {
  const [activeId, setActiveId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const langSwitchHref = useLanguageSwitchHref("/");
  useMobileMenuChrome(isMenuOpen, setIsMenuOpen);

  useEffect(() => {
    function updateActiveSection() {
      let current = "";

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);

        if (!section) return;

        const rect = section.getBoundingClientRect();

        if (rect.top <= 90) {
          current = id;
        }
      });

      setActiveId(current);
    }

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="h-[52px]" />

      <header className="fixed left-0 top-0 z-[999] w-full border-b border-white/10 bg-[#080808]/95 text-white backdrop-blur">
        <HeaderInner
          activeId={activeId}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          langSwitchHref={langSwitchHref}
        />
      </header>

      {isMenuOpen ? (
        <MobileMenu
          onClose={() => setIsMenuOpen(false)}
          langSwitchHref={langSwitchHref}
        />
      ) : null}
    </>
  );
}
