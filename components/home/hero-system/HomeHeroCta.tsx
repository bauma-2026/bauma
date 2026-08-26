"use client";

import type { PointerEvent } from "react";

import { useHomeHero } from "./HomeHeroProvider";

export default function HomeHeroCta({
  label = "Kako stran vodi do odločitve",
  href = "#flow",
  variant = "neutral",
  arrow = true,
}: {
  label?: string;
  href?: string;
  /**
   * One Bauma primary accent, one treatment: "amber" is the single source
   * of truth (originally the mid-page CTA) and is reused as-is everywhere
   * a primary action is needed — hero, header and mid-page alike.
   * "ghost" is the hero secondary: same size, outline-led, visually
   * subordinate to amber.
   */
  variant?: "neutral" | "amber" | "ghost";
  /** Hero CTAs disable the trailing arrow for a calmer, more restrained mark. */
  arrow?: boolean;
}) {
  const { setCtaHovered, reducedMotion } = useHomeHero();

  function handlePointerEnter(event: PointerEvent<HTMLAnchorElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    setCtaHovered(true);
  }

  function handlePointerLeave(event: PointerEvent<HTMLAnchorElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    setCtaHovered(false);
  }

  return (
    <a
      href={href}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`bauma-focus-pill group inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-[transform,background-color,color,border-color] duration-300 hover:-translate-y-[1px] active:translate-y-0 ${
        variant === "amber"
          ? "border border-transparent bg-[#FCAC33] text-black hover:bg-[#FCAC33]/90"
          : variant === "ghost"
            ? "border border-white/45 bg-white/[0.06] text-white hover:border-white/60 hover:bg-white/[0.12] max-lg:border-white/[0.65] max-lg:bg-white/[0.12]"
            : "bg-white text-black hover:bg-white/90"
      }`}
    >
      {arrow ? (
        <span className="inline-flex items-center gap-2">
          {label}
          <span className="transition duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      ) : (
        label
      )}
    </a>
  );
}
