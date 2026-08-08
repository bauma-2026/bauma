"use client";

import EdgeContextStudy from "./EdgeContextStudy";
import type { LabSearchParams } from "./labSearchParams";

type Props = {
  initialSearchParams?: LabSearchParams;
};

/**
 * Final lab shell for `/lab/hero-object-reframe`.
 * Always mounts the edge-context reference — no multi-study dispatcher.
 */
export default function HeroObjectReframeReference({
  initialSearchParams = {},
}: Props) {
  return <EdgeContextStudy initialSearchParams={initialSearchParams} />;
}
