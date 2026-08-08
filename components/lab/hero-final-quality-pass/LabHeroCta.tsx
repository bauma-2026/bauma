"use client";

import type { PointerEvent } from "react";

import { useHomeHero } from "@/components/home/hero-system/HomeHeroProvider";

import { REFINED } from "./refinedConfig";

export default function LabHeroCta({
  interactionEnabled = true,
}: {
  interactionEnabled?: boolean;
}) {
  const { setCtaHovered, reducedMotion } = useHomeHero();

  function handlePointerEnter(event: PointerEvent<HTMLAnchorElement>) {
    if (!interactionEnabled || reducedMotion || event.pointerType !== "mouse") {
      return;
    }
    setCtaHovered(true);
  }

  function handlePointerLeave(event: PointerEvent<HTMLAnchorElement>) {
    if (!interactionEnabled || reducedMotion || event.pointerType !== "mouse") {
      return;
    }
    setCtaHovered(false);
  }

  return (
    <a
      href={REFINED.ctaHref}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:-translate-y-[1px] hover:bg-white/90 active:translate-y-0"
    >
      <span className="inline-flex items-center gap-2">
        {REFINED.ctaLabel}
        <span className="transition duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </a>
  );
}
