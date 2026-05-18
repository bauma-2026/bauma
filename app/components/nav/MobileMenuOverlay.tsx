/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import MobileMenuToggle from "./MobileMenuToggle";

type NavItem = {
  href: string;
  label: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
};

export default function MobileMenuOverlay({ open, onClose, nav }: Props) {
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [navEntered, setNavEntered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setRendered(true);
      setClosing(false);
      setNavEntered(false);

      const raf = window.requestAnimationFrame(() => {
        const raf2 = window.requestAnimationFrame(() => {
          setNavEntered(true);
        });

        return () => window.cancelAnimationFrame(raf2);
      });

      return () => window.cancelAnimationFrame(raf);
    }

    if (!rendered) return;

    setClosing(true);
    setNavEntered(false);

    const timeout = window.setTimeout(() => {
      setRendered(false);
      setClosing(false);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [open, rendered]);

  const portalTarget = useMemo(() => {
    if (typeof document === "undefined") return null;
    return document.body;
  }, []);

  const isOpenVisual = open && !closing;

  if (!mounted || !portalTarget || !rendered) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] md:hidden">
      <div
        role="dialog"
        aria-modal="true"
        className={[
          "fixed inset-0 pointer-events-auto bg-[#080808] pt-[env(safe-area-inset-top)] text-white",
          "transition-opacity duration-[220ms] ease-[cubic-bezier(.16,1,.3,1)]",
          isOpenVisual ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div className="flex min-h-screen flex-col bg-[#080808]">
          {/* Header row */}
          <div className="border-b border-white/10 bg-[#080808]/90 backdrop-blur">
            <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6 lg:px-8">
              <div className="flex h-[72px] items-center justify-between">
                <Link
                  href="/"
                  onClick={onClose}
                  className="inline-flex items-center transition-opacity hover:opacity-80"
                  aria-label="Bauma"
                >
                  <img
                    src="/logo/bauma-logo.svg"
                    alt="Bauma"
                    className="h-auto w-[68px] invert sm:w-[78px]"
                  />
                </Link>

                <div className="relative z-[10001] flex items-center">
                  <MobileMenuToggle open={open} onToggle={onClose} />
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="flex min-h-0 flex-1 flex-col bg-[#080808]">
            <div className="mx-auto w-full max-w-[1120px] px-5 pt-6 pb-6 sm:px-6 lg:px-8">
              <div className="flex flex-col">
                {Array.isArray(nav) && nav.length > 0 ? (
                  nav.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={[
                       "border-b border-white/10 py-4 text-[18px] font-normal leading-none tracking-[-0.01em]",
                        "text-white transition-[opacity,transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                        "hover:text-white/70 active:text-white/80",
                        navEntered
                          ? "translate-y-0 opacity-100"
                          : "translate-y-2 opacity-0",
                      ].join(" ")}
                      style={{
                        transitionDelay: navEntered
                          ? `${80 + index * 45}ms`
                          : "0ms",
                      }}
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[6px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/60">
                    Ni linkov v meniju.
                  </div>
                )}
              </div>
            </div>

            {/* Simple CTA */}
            <div
              className={[
                "mt-auto transition-[opacity,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                navEntered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0",
              ].join(" ")}
              style={{
                transitionDelay: navEntered ? "220ms" : "0ms",
              }}
            >
              <div className="mx-auto w-full max-w-[1120px] px-5 pt-6 pb-8 sm:px-6 lg:px-8">
                <div className="border-t border-white/10 pt-6">
                  <p className="max-w-[30ch] text-sm leading-6 text-white/45">
                    Struktura, ki uporabnika vodi od razumevanja do odločitve.
                  </p>

                  <Link
                    href="/#contact"
                    onClick={onClose}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-medium tracking-tight text-black transition hover:bg-white/90"
                  >
                    Kontakt
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  );
}