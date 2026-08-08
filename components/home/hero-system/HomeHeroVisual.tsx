"use client";

import { useEffect, useRef } from "react";

import { HERO_SPATIAL_V3_ENABLED } from "./config";
import { useHomeHero } from "./HomeHeroProvider";
import { HomeHeroV2Object } from "./v2";
import { HomeHeroSpatialV3Object } from "./v3";

/**
 * Production hero visual — V2 Balanced Volume (legacy) or V3 spatial (flag).
 * Mobile always stays on legacy V2 path.
 * `runtimeEnabled` gates RAF/listeners on the CSS-hidden breakpoint sibling.
 */
export default function HomeHeroVisual({
  className = "relative h-[440px] w-full",
  mobile = false,
  runtimeEnabled = true,
  fieldVariant,
}: {
  className?: string;
  mobile?: boolean;
  runtimeEnabled?: boolean;
  fieldVariant?: "desktop" | "mobile";
}) {
  const { reducedMotion, setHeroElement } = useHomeHero();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!runtimeEnabled) {
      setHeroElement(null);
      return;
    }
    setHeroElement(rootRef.current);
    return () => setHeroElement(null);
  }, [setHeroElement, runtimeEnabled]);

  // Cast keeps the module flag as `false as const` without dead-branching the V3 tree away.
  const useV3 = (HERO_SPATIAL_V3_ENABLED as boolean) && !mobile;
  const activeRenderer = !runtimeEnabled
    ? "dormant"
    : useV3
      ? "v3"
      : "v2";

  return (
    <div
      ref={rootRef}
      className={className}
      data-hero-visual-root
      data-hero-proximity-field={useV3 && runtimeEnabled ? "1" : undefined}
      data-active-renderer={activeRenderer}
      data-field-variant={fieldVariant}
      data-runtime-enabled={runtimeEnabled ? "1" : "0"}
      data-v3-material={useV3 ? "V0" : undefined}
      data-legacy-runtime={
        useV3 ? "off" : runtimeEnabled ? "on" : "off"
      }
    >
      {useV3 ? (
        <HomeHeroSpatialV3Object
          className="relative h-full w-full"
          reduced={reducedMotion || !runtimeEnabled}
          hostRef={rootRef}
          runtimeEnabled={runtimeEnabled}
        />
      ) : (
        <HomeHeroV2Object
          className="relative h-full w-full"
          reduced={reducedMotion}
          mobile={mobile}
          runtimeEnabled={runtimeEnabled}
        />
      )}
    </div>
  );
}
