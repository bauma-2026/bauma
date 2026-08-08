"use client";

import { useEffect, useState } from "react";

export function useHeroVisibility() {
  const [documentVisible, setDocumentVisible] = useState(true);
  const [inViewport, setInViewport] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [heroElement, setHeroElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleVisibility = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!heroElement) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(heroElement);
    return () => observer.disconnect();
  }, [heroElement]);

  return {
    documentVisible,
    inViewport,
    reducedMotion,
    setHeroElement,
  };
}
