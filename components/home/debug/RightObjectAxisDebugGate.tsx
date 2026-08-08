"use client";

/**
 * Production homepage must not download the axis-debug module unless `?axis=1`.
 * Debug capability remains available via that query flag.
 */

import { useEffect, useState, type ComponentType } from "react";

export default function RightObjectAxisDebugGate() {
  const [Debug, setDebug] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("axis") !== "1") {
      return;
    }

    let cancelled = false;
    void import("./RightObjectAxisDebug").then((mod) => {
      if (!cancelled) setDebug(() => mod.default);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!Debug) return null;
  return <Debug />;
}
