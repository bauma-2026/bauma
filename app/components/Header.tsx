"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Container from "./Container";
import MobileMenuToggle from "./nav/MobileMenuToggle";
import MobileMenuOverlay from "./nav/MobileMenuOverlay";

const nav = [
  { href: "/work", label: "Work" },
  { href: "/approach", label: "Pristop" },
  { href: "/novice", label: "Novice" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 👉 scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
<header className="fixed left-0 top-0 z-50 w-full border-b border-[#1e1e1e] bg-[#080808]/80 backdrop-blur-md transition-all duration-300">
      <Container className="relative z-10 py-3 sm:py-3.5">
        <div className="flex items-center justify-between">

          {/* Desktop */}
          <div className="hidden w-full items-center md:flex">

            {/* LEFT — LOGO */}
            <div className="flex-1">
              <Link href="/" className="inline-flex items-center">
                <img
                  src="/logo/bauma-logo.svg"
                  alt="Bauma"
                  className="h-auto w-[72px] invert"
                />
              </Link>
            </div>

            {/* CENTER — NAV */}
            <nav className="flex items-center gap-4 text-sm">
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
    "group relative py-1 transition duration-200",
    active
      ? "text-white opacity-100"
      : "text-white opacity-60 hover:opacity-100",
  ].join(" ")}
>
  {item.label}

  <span
  className={[
    "absolute left-0 -bottom-1 h-px w-full bg-white/80 transition duration-300",
    active ? "opacity-100" : "opacity-0 group-hover:opacity-50",
  ].join(" ")}
/>
</Link>
                  );
                })}
            </nav>

            {/* RIGHT — CTA */}
            <div className="flex flex-1 justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white bg-white px-5 py-2 text-sm font-medium text-black transition-all duration-200 hover:-translate-y-[1px] hover:bg-white/90 active:translate-y-0"
              >
                Contact
              </Link>
            </div>

          </div>

          {/* Mobile */}
          <div className="flex w-full items-center justify-between md:hidden">
            <Link href="/" className="inline-flex items-center">
              <img
                src="/logo/bauma-logo.svg"
                alt="Bauma"
                className="h-auto w-[91px] invert"
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