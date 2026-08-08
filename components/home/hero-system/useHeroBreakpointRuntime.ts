"use client";

import { useEffect, useState } from "react";

/**
 * After-mount lg breakpoint (Tailwind `lg` = 1024px).
 * Initial null → runtime stays off until known (no dual RAF on first paint).
 * Does not affect SSR HTML tree — only effect-driven runtime enablement.
 */
export function useHeroBreakpointRuntime(variant: "desktop" | "mobile") {
  const [lg, setLg] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setLg(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (lg === null) return false;
  return variant === "desktop" ? lg : !lg;
}
