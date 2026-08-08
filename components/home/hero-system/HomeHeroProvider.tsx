"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useHeroVisibility } from "./useHeroVisibility";
import type { OneEnvelopeFrame } from "./heroEnvelope";
import {
  emptyPointerCouplingState,
  type PointerCouplingState,
} from "./heroPointerJourney";

/**
 * Slim production provider after V2 transfer.
 * Pose / material authorities live inside HomeHeroV2Object.
 * Context kept for CTA + reduced-motion + lab debug compatibility.
 */

const ZERO = { x: 0, y: 0 } as const;

const REST_ENVELOPE: OneEnvelopeFrame = {
  envelope: 0,
  locomotionEnvelope: 0,
  resolveBlend: 0,
  vertexOffsets: [ZERO, ZERO, ZERO, ZERO],
  depthOffsets: [ZERO, ZERO, ZERO, ZERO],
  spatial: { translateX: 0, translateY: 0, rotateDeg: 0 },
  grammarPhase: "idle",
  amber: { visible: false, corner: null, opacity: 0 },
  primaryOpacity: 0.8,
  depthOpacity: 0.2,
  resolveProgress: 0,
  proximityOnly: false,
  supportReaching: null,
  supportReceiving: null,
};

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

  const setPointerInputs = useCallback(
    (_inputs: {
      pointerActive: boolean;
      pointerX: number;
      pointerY: number;
    }) => {
      // V2 object owns pointer → pose. Kept for API compatibility.
    },
    [],
  );

  const setCtaHovered = useCallback((_hovered: boolean) => {
    // CTA does not drive hero material or pose (Field Force is field-local).
  }, []);

  const value = useMemo(
    () => ({
      oneEnvelope: REST_ENVELOPE,
      coupling: emptyPointerCouplingState(),
      reducedMotion,
      setPointerInputs,
      setCtaHovered,
      setHeroElement,
    }),
    [reducedMotion, setPointerInputs, setCtaHovered, setHeroElement],
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
