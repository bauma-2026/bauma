"use client";

import type { ApproachCopy } from "./copy";
import { useReducedMotion } from "./useReducedMotion";
import ApproachV2Section from "./v2/ApproachV2Section";

/**
 * Approach — production section.
 * Graphic: Family 2 pocket open-shell (approved V2). Copy unchanged.
 */
export default function ApproachSection({ copy }: { copy?: ApproachCopy }) {
  const reducedMotion = useReducedMotion();
  return (
    <ApproachV2Section
      reducedMotion={reducedMotion}
      copy={copy}
      anchorId="approach"
    />
  );
}
