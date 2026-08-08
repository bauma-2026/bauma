"use client";

import { useEffect } from "react";

/**
 * Isolates background app content while modal portal (on body) stays interactive.
 * Targets <main> only — never an ancestor of the portal.
 */
export function useBackgroundInert(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const main = document.querySelector("main");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    const targets = [main, header, footer].filter(Boolean) as HTMLElement[];

    targets.forEach((el) => {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    });

    return () => {
      targets.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
    };
  }, [active]);
}
