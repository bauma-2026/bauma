/**
 * Hero Final Quality Pass — refined proposal (lab only).
 *
 * Static diagnosis (pre-implementation):
 * - Primary 0.84 + depth 0.36 in the same warm-white reads as bright wireframe,
 *   not spatial hierarchy. Visual Layer front/rear (~0.35 / 0.085) shows quieter
 *   material presence with a clearer gap.
 * - Depth is strongest at TR; competing depth stroke near the climax corner.
 * - Rest geometry identity is sound — prefer no vertex rebuild.
 * - Object needs slightly more static presence vs the large serif, not more motion.
 * - CTA “Kako nastane jasna pot” is abstract; keep #flow, concrete the label.
 */

export const PRODUCTION_REFERENCE = {
  primaryOpacityRest: 0.84,
  primaryOpacityActive: 0.8,
  depthOpacity: 0.36,
  primaryStroke: 1,
  depthStroke: 0.75,
  scaleFactor: 1.08,
  restTiltDeg: -1.0,
  heroMotionScale: 0.65,
  ctaLabel: "Kako nastane jasna pot",
  ctaHref: "#flow",
} as const;

/** One coherent refined proposal — hierarchy, presence, quieter motion. */
export const REFINED = {
  /** Semantic line roles (for later global token mapping) */
  roles: {
    primary: "hero-primary-stroke",
    secondary: "hero-secondary-stroke",
    depth: "hero-depth-stroke",
  },

  /** Primary contour — micro-polish winner P2 */
  primaryOpacityRest: 0.78,
  primaryOpacityActive: 0.74,
  primaryStroke: 1,

  /**
   * Depth traces — significantly quieter (Visual Layer lesson, not copy).
   * Secondary structure stays implicit in the primary silhouette;
   * this hero has no separate secondary polyline — depth polygon only.
   */
  depthOpacity: 0.2,
  depthStroke: 0.7,

  /** Optical scale: +3.7% within ±6% of production M+ */
  scaleFactor: 1.12,

  /** Tiny extra rest tilt for spatial tension — not a new pose */
  restTiltDeg: -1.15,

  /** Placement — micro-polish winner S2 (scale only, no positional nudge) */
  opticalShift: {
    desktop: { x: 0, y: 0 },
    laptop: { x: 0, y: 0 },
    mobile: { x: 0, y: 0 },
  },

  /**
   * Multiply production envelope offsets / spatial by this factor.
   * Same journey shape; quieter amplitude (~12% less).
   */
  motionAmplitude: 0.88,

  ctaLabel: "Kako stran vodi do odločitve",
  ctaHref: "#flow",
} as const;

/** Final micro-polish — primary opacity only (active keeps −0.04 delta). */
export const PRIMARY_VARIANTS = {
  P1: { rest: 0.76, active: 0.72 },
  P2: { rest: 0.78, active: 0.74 },
} as const;

export type PrimaryVariant = keyof typeof PRIMARY_VARIANTS;

/** Final micro-polish — placement only. */
export const PLACEMENT_VARIANTS = {
  /** S1 — current refined optical shift */
  S1: {
    desktop: { x: 8, y: -6 },
    laptop: { x: 6, y: -4 },
    mobile: { x: 0, y: 0 },
  },
  /** S2 — scale only, no positional shift */
  S2: {
    desktop: { x: 0, y: 0 },
    laptop: { x: 0, y: 0 },
    mobile: { x: 0, y: 0 },
  },
} as const;

export type PlacementVariant = keyof typeof PLACEMENT_VARIANTS;

export type StudyMode = "current" | "refined";
