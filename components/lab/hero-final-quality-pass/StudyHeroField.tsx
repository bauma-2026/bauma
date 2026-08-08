"use client";

import HomeHeroVisual from "@/components/home/hero-system/HomeHeroVisual";

import LabHeroVisual from "./LabHeroVisual";
import {
  PLACEMENT_VARIANTS,
  PRIMARY_VARIANTS,
  type PlacementVariant,
  type PrimaryVariant,
  type StudyMode,
} from "./refinedConfig";

type OpticalBreakpoint = "desktop" | "laptop" | "mobile";

type Props = {
  mode: StudyMode;
  variant: "desktop" | "mobile";
  optical: OpticalBreakpoint;
  interactionEnabled: boolean;
  reducedPreview: boolean;
  primaryVariant?: PrimaryVariant;
  placementVariant?: PlacementVariant;
};

const FIELD_CLASS = {
  desktop: "relative h-[440px] w-full",
  mobile: "relative h-[232px] w-full sm:h-[240px] md:h-[256px]",
} as const;

export default function StudyHeroField({
  mode,
  variant,
  optical,
  interactionEnabled,
  reducedPreview,
  primaryVariant = "P2",
  placementVariant = "S2",
}: Props) {
  if (mode === "current") {
    return (
      <div className={FIELD_CLASS[variant]} data-study-hero-field="current">
        <HomeHeroVisual className="relative h-full w-full" />
      </div>
    );
  }

  const primary = PRIMARY_VARIANTS[primaryVariant];
  const shift = PLACEMENT_VARIANTS[placementVariant][optical];
  const style =
    shift.x === 0 && shift.y === 0
      ? undefined
      : { transform: `translate(${shift.x}px, ${shift.y}px)` };

  return (
    <div
      className={FIELD_CLASS[variant]}
      data-study-hero-field="refined"
      data-primary-variant={primaryVariant}
      data-placement-variant={placementVariant}
      style={style}
    >
      <LabHeroVisual
        className="relative h-full w-full"
        interactionEnabled={interactionEnabled}
        reducedPreview={reducedPreview}
        primaryOpacityRest={primary.rest}
        primaryOpacityActive={primary.active}
      />
    </div>
  );
}
