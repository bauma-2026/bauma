"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { HeroPointerInputs } from "./heroTypes";
import {
  emptyPointerCouplingRefs,
  emptyPointerCouplingState,
  POINTER_COUPLING_TUNING,
  stepPointerCoupling,
  type PointerCouplingState,
} from "./heroPointerJourney";

export function useHeroPointerJourney(enabled: boolean, paused = false) {
  const [coupling, setCoupling] = useState<PointerCouplingState>(
    emptyPointerCouplingState,
  );

  const stateRef = useRef(emptyPointerCouplingState());
  const inputsRef = useRef<HeroPointerInputs>({
    pointerActive: false,
    pointerX: 0,
    pointerY: 0,
    ctaHovered: false,
  });
  const lastFrameRef = useRef<number | null>(null);
  const refsRef = useRef(emptyPointerCouplingRefs());

  const setInputs = useCallback(
    (
      next:
        | HeroPointerInputs
        | ((previous: HeroPointerInputs) => HeroPointerInputs),
    ) => {
      inputsRef.current =
        typeof next === "function" ? next(inputsRef.current) : next;
    },
    [],
  );

  useEffect(() => {
    if (!enabled || paused) return;

    let frame = 0;

    const tick = (now: number) => {
      const last = lastFrameRef.current ?? now;
      const delta = Math.min((now - last) / 1000, 1 / 30);
      lastFrameRef.current = now;

      const result = stepPointerCoupling(
        stateRef.current,
        inputsRef.current,
        delta,
        now,
        refsRef.current,
        POINTER_COUPLING_TUNING,
      );

      stateRef.current = result.state;
      refsRef.current = result.refs;
      setCoupling(result.state);

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [enabled, paused]);

  return { coupling, setInputs };
}
