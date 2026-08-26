"use client";

import type { ApproachCopy } from "./copy";
import ApproachInteractiveSection from "./ApproachInteractiveSection";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Approach — production section.
 * Locked B01/B02/B03, spatial interaction, tension/release, B02 ambient cycle.
 */
export default function ApproachSection({ copy }: { copy?: ApproachCopy }) {
  const reducedMotion = useReducedMotion();
  return (
    <ApproachInteractiveSection reducedMotion={reducedMotion} copy={copy} />
  );
}
