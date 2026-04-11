"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "./Container";
import MobileMenuToggle from "./nav/MobileMenuToggle";
import MobileMenuOverlay from "./nav/MobileMenuOverlay";

const nav = [
  { href: "/work", label: "Work" },
  { href: "/approach", label: "Approach" },
  { href: "/novice", label: "Novice" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <Container className="relative z-10 py-3 sm:py-3.5">
        <div className="flex items-center justify-between">
          {/* Desktop */}
          <div className="hidden w-full items-center justify-between md:flex">
            <div className="flex items-center gap-8">
              <Link href="/" className="inline-flex items-center" aria-label="Bauma">
                <img
                  src="/logo/bauma-logo.svg"
                  alt="Bauma"
                  className="h-auto w-[91px]"
                />
              </Link>

              <nav className="flex items-center gap-6 text-sm text-neutral-700">
                {nav
                  .filter((item) => item.href !== "/contact")
                  .map((item) => {
                    const active =
                      pathname === item.href ||
                      pathname?.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={[
                          "group relative py-1 transition-colors duration-200",
                          active
                            ? "text-black"
                            : "text-neutral-700 hover:text-black",
                        ].join(" ")}
                      >
                        {item.label}

                        <span
                          className={[
                            "absolute left-0 -bottom-1 h-[2px] w-full origin-left rounded-full bg-black transition-all duration-200",
                            active
                              ? "scale-x-100 opacity-100"
                              : "scale-x-90 opacity-0 group-hover:scale-x-100 group-hover:opacity-100",
                          ].join(" ")}
                        />
                      </Link>
                    );
                  })}
              </nav>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-2 text-sm font-medium tracking-tight text-white transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-white hover:text-black active:translate-y-0"
            >
              Contact
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex w-full items-center justify-between md:hidden">
            <Link href="/" className="inline-flex items-center" aria-label="Bauma">
              <img
                src="/logo/bauma-logo.svg"
                alt="Bauma"
                className="h-auto w-[91px]"
              />
            </Link>

            <div className="relative z-[10001] flex items-center">
              <MobileMenuToggle
                open={menuOpen}
                onToggle={() => setMenuOpen((v) => !v)}
              />
            </div>
          </div>
        </div>
      </Container>

      <MobileMenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        nav={nav}
      />
    </header>
  );
}