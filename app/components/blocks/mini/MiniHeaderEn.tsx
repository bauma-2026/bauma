"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/en#approach", label: "Approach", id: "approach" },
  { href: "/en#system", label: "System", id: "system" },
];

const sectionIds = ["flow", "system", "contact"];

function HeaderInner({
  activeId,
  isMenuOpen,
  setIsMenuOpen,
}: {
  activeId: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}) {
  return (
    <div className="mx-auto flex h-[52px] max-w-[1100px] items-center justify-between px-5 sm:px-6 lg:px-8">
      <Link
        href="/en"
        aria-label="Bauma English home"
        className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
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
                aria-current={isActive ? "page" : undefined}
                className={`text-[12px] font-medium transition ${
                  isActive ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          aria-label="Slovenian version"
          className="hidden border-l border-white/10 pl-5 text-[12px] font-medium text-white/45 transition hover:text-white md:inline-flex"
        >
          SL
        </Link>

        <Link
          href="/en#contact"
          aria-current={activeId === "contact" ? "page" : undefined}
          className={`hidden rounded-full px-3.5 py-1.5 text-[12px] font-medium transition sm:px-4 sm:py-1.5 sm:text-xs md:inline-flex ${
            activeId === "contact"
              ? "bg-white text-black ring-1 ring-white/30"
              : "bg-white text-black hover:bg-white/90"
          }`}
        >
          Contact
        </Link>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#080808] text-white transition hover:border-white/25 hover:bg-white/[0.04] md:hidden"
        >
          <span className="relative h-4 w-4">
            <span
              className={`absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rounded-full bg-white transition ${
                isMenuOpen ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rounded-full bg-white transition ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rounded-full bg-white transition ${
                isMenuOpen ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[998] bg-[#080808] text-white md:hidden">
      <div className="mx-auto flex min-h-screen max-w-[1100px] flex-col px-5 pt-[78px] pb-8 sm:px-6">
        <nav aria-label="Mobile navigation" className="space-y-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex border-b border-white/10 py-4 text-[18px] font-normal tracking-[-0.01em] text-white transition hover:text-white/70"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/en#contact"
            onClick={onClose}
            className="flex border-b border-white/10 py-4 text-[18px] font-normal tracking-[-0.01em] text-white transition hover:text-white/70"
          >
            Contact
          </Link>

          <Link
            href="/"
            onClick={onClose}
            className="flex border-b border-white/10 py-4 text-[14px] font-medium tracking-[0.04em] text-white/45 transition hover:text-white"
          >
            Slovenščina
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <p className="max-w-[30ch] text-sm leading-6 text-white/45">
            Structure that guides users from understanding to decision.
          </p>

          <Link
            href="/en#contact"
            onClick={onClose}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
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
        />
      </header>

      {isMenuOpen ? <MobileMenu onClose={() => setIsMenuOpen(false)} /> : null}
    </>
  );
}