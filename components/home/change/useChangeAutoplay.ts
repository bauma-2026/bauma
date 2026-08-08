"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { PHASE, type StructuralState } from "./constants";

type Options = {
  reducedMotion: boolean;
  /** Lab replay only — production always passes 0 */
  replayToken?: number;
};

/**
 * Locked scroll-triggered autoplay.
 * Exposes autoplayComplete so hover can begin only after A03 holds.
 */
export function useChangeAutoplay(
  sectionRef: RefObject<HTMLElement | null>,
  { reducedMotion, replayToken = 0 }: Options,
) {
  const [state, setState] = useState<StructuralState>(
    reducedMotion ? "03" : "01",
  );
  const [autoplayComplete, setAutoplayComplete] = useState(reducedMotion);
  const playedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const runSequence = useCallback(() => {
    clearTimers();
    setAutoplayComplete(false);

    if (reducedMotion) {
      setState("03");
      setAutoplayComplete(true);
      return;
    }

    setState("01");

    const holdMs = PHASE.fieldHold * 1000;
    const alignMs = PHASE.toAlign * 1000;
    const a02HoldMs = PHASE.a02Hold * 1000;
    const resolveMs = PHASE.toResolve * 1000;

    const t1 = window.setTimeout(() => setState("02"), holdMs);
    const toA03 = holdMs + alignMs + a02HoldMs;
    const t2 = window.setTimeout(() => setState("03"), toA03);
    const t3 = window.setTimeout(
      () => setAutoplayComplete(true),
      toA03 + resolveMs + 80,
    );
    timersRef.current = [t1, t2, t3];
  }, [clearTimers, reducedMotion]);

  useEffect(() => {
    if (replayToken === 0) return;
    playedRef.current = true;
    runSequence();
  }, [replayToken, runSequence]);

  useEffect(() => {
    if (reducedMotion) {
      clearTimers();
      setState("03");
      setAutoplayComplete(true);
    }
  }, [reducedMotion, clearTimers]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.32) {
          if (playedRef.current) return;
          playedRef.current = true;
          runSequence();
        }
      },
      {
        threshold: [0.32, 0.45],
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [sectionRef, runSequence, clearTimers]);

  return { state, autoplayComplete };
}
