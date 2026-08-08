"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useHeroVisibility } from "./useHeroVisibility";
import { HOME_HERO_CONFIG } from "./config";
import {
  computeOneEnvelopeFrame,
  usePointerCoupling,
  type OneEnvelopeFrame,
  type PointerCouplingState,
} from "./heroMotion";

type HomeHeroContextValue = {
  oneEnvelope: OneEnvelopeFrame;
  coupling: PointerCouplingState;
  reducedMotion: boolean;
  setPointerInputs: (inputs: {
    pointerActive: boolean;
    pointerX: number;
    pointerY: number;
  }) => void;
  setCtaHovered: (hovered: boolean) => void;
  setHeroElement: (element: HTMLElement | null) => void;
};

const HomeHeroContext = createContext<HomeHeroContextValue | null>(null);

export function HomeHeroProvider({ children }: { children: ReactNode }) {
  const { reducedMotion, setHeroElement } = useHeroVisibility();
  const interactionLive = !reducedMotion;

  const { coupling, setInputs } = usePointerCoupling(interactionLive, reducedMotion);

  const pointerActiveRef = useRef(false);
  const ctaHoveredRef = useRef(false);
  const [, setInputsActive] = useState(false);

  const setPointerInputs = useCallback(
    (inputs: { pointerActive: boolean; pointerX: number; pointerY: number }) => {
      if (!interactionLive) return;
      pointerActiveRef.current = inputs.pointerActive;
      setInputsActive(inputs.pointerActive || ctaHoveredRef.current);
      setInputs((previous) => ({
        ...inputs,
        ctaHovered: previous.ctaHovered,
      }));
    },
    [interactionLive, setInputs],
  );

  const setCtaHovered = useCallback(
    (hovered: boolean) => {
      if (!interactionLive) return;
      ctaHoveredRef.current = hovered;
      setInputsActive(pointerActiveRef.current || hovered);
      setInputs((previous) => ({
        ...previous,
        ctaHovered: hovered,
      }));
    },
    [interactionLive, setInputs],
  );

  const oneEnvelope = useMemo(
    () =>
      computeOneEnvelopeFrame({
        phase: coupling.legacyPhase,
        engagement: coupling.envelope,
        fadeProgress: 0,
        intensity: HOME_HERO_CONFIG.systemIntensity,
        timing: HOME_HERO_CONFIG.locomotionTiming,
        coupledEnvelope: interactionLive ? coupling.envelope : 0,
        approach: coupling.approach,
        proximityResponse: coupling.proximityResponse,
        proximityOnly: coupling.proximityOnly,
      }),
    [coupling, interactionLive],
  );

  const value = useMemo(
    () => ({
      oneEnvelope,
      coupling,
      reducedMotion,
      setPointerInputs,
      setCtaHovered,
      setHeroElement,
    }),
    [
      oneEnvelope,
      coupling,
      reducedMotion,
      setPointerInputs,
      setCtaHovered,
      setHeroElement,
    ],
  );

  return (
    <HomeHeroContext.Provider value={value}>{children}</HomeHeroContext.Provider>
  );
}

export function useHomeHero() {
  const context = useContext(HomeHeroContext);
  if (!context) {
    throw new Error("HomeHeroProvider is required.");
  }
  return context;
}
