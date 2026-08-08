"use client";

import HomeHeroVisual from "./HomeHeroVisual";
import { useHeroBreakpointRuntime } from "./useHeroBreakpointRuntime";

type HomeHeroFieldProps = {
  variant: "desktop" | "mobile";
};

const FIELD_CLASS = {
  desktop: "relative h-[440px] w-full",
  // Height is the locked V2 object slot (232). Visible mobile field
  // letterboxing is owned by MiniHero (P10 Variant B).
  mobile: "relative h-[232px] w-full",
} as const;

/**
 * Field = interaction surface shell for the active breakpoint.
 * Both desktop/mobile shells may stay mounted (responsive CSS), but only the
 * matching breakpoint enables pose/proximity runtime (H1 runtime gate).
 */
export default function HomeHeroField({ variant }: HomeHeroFieldProps) {
  const runtimeEnabled = useHeroBreakpointRuntime(variant);

  return (
    <HomeHeroVisual
      className={FIELD_CLASS[variant]}
      mobile={variant === "mobile"}
      runtimeEnabled={runtimeEnabled}
      fieldVariant={variant}
    />
  );
}
