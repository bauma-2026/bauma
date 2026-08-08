"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );

    const initial = focusables()[0];
    initial?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("keydown", onKeyDown);
      const previous = previousFocusRef.current;
      if (!previous) return;
      // Defer one frame so sibling cleanup (e.g. inert removal) can finish first.
      window.requestAnimationFrame(() => {
        if (previous.isConnected) {
          previous.focus({ preventScroll: true });
        }
      });
    };
  }, [active, containerRef]);
}

export function useRestoreFocus(triggerRef: React.RefObject<HTMLElement | null>) {
  return () => {
    triggerRef.current?.focus();
  };
}
