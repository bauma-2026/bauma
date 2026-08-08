/** Interaction phase used by envelope and pointer journey. */
export type HeroPhase =
  | "rest"
  | "recognition"
  | "engagement"
  | "resolution"
  | "release";

export type SystemIntensityId = "low" | "medium" | "review-high";

export type HeroPointerInputs = {
  pointerActive: boolean;
  pointerX: number;
  pointerY: number;
  ctaHovered: boolean;
};
