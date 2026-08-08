"use client";

import ApproachInteractiveSection from "./ApproachInteractiveSection";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Approach — production section.
 * Locked B01/B02/B03, spatial interaction, tension/release, B02 ambient cycle.
 */
export default function ApproachSection() {
  const reducedMotion = useReducedMotion();
  return <ApproachInteractiveSection reducedMotion={reducedMotion} />;
}
