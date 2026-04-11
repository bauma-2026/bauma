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

export default function MobileMenuOverlay({
  open,
  onClose,
  nav,
}: Props) {
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
          "fixed inset-0 pointer-events-auto bg-white pt-[env(safe-area-inset-top)]",
          "transition-opacity duration-[220ms] ease-[cubic-bezier(.16,1,.3,1)]",
          isOpenVisual ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div className="flex min-h-screen flex-col bg-white">
          {/* Header row */}
          <div className="border-b border-black/10 bg-white/70 backdrop-blur">
            <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-3 sm:py-3.5">
                <Link
                  href="/"
                  onClick={onClose}
                  className="inline-flex items-center"
                  aria-label="Bauma"
                >
                  <img
                    src="/logo/bauma-logo.svg"
                    alt="Bauma"
                    className="h-auto w-[91px]"
                  />
                </Link>

                <div className="relative z-[10001] flex items-center">
                  <MobileMenuToggle open={open} onToggle={onClose} />
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="flex min-h-0 flex-1 flex-col bg-white">
            <div className="mx-auto w-full max-w-[1120px] px-5 pt-6 pb-6 sm:px-6 lg:px-8">
              <div className="flex flex-col">
                {Array.isArray(nav) && nav.length > 0 ? (
                  nav.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={[
                        "border-b border-neutral-200 py-4 text-[16px] leading-none tracking-[-0.01em]",
                        "text-neutral-700 transition-[opacity,transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                        "active:text-neutral-900",
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
                  <div className="rounded-xl bg-neutral-50 px-4 py-4 text-sm text-neutral-700">
                    Ni linkov v meniju.
                  </div>
                )}
              </div>
            </div>

            {/* Quick brief */}
            <div
              className={[
                "mt-auto transition-[opacity,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                navEntered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              ].join(" ")}
              style={{
                transitionDelay: navEntered ? "220ms" : "0ms",
              }}
            >
              <div className="mx-auto w-full max-w-[1120px] px-5 pt-6 pb-6 sm:px-6 lg:px-8">
                <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-sm font-medium text-black">Quick brief</p>

                  <p className="mt-2 max-w-[24ch] text-sm leading-6 text-neutral-600">
                    Pošlji 3 stvari: cilj, rok in link do obstoječega projekta.
                  </p>

                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-black bg-black px-5 text-sm font-medium tracking-tight text-white transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-white hover:text-black active:translate-y-0"
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