/**
 * Frozen production Hero system config — matches lab reference:
 * /lab/hero-real-context?behaviorReconnect=1&oneEnvelope=1&pointerCoupling=1
 */

/**
 * Parallel V3 spatial renderer (pose proximity + static V0/F2; Field = surface).
 * Module const — identical on server and first client render.
 * Default false = legacy HomeHeroV2Object. Rollback = keep false.
 */
export const HERO_SPATIAL_V3_ENABLED = true as const;

export const HOME_HERO_REFERENCE_QUERY =
  "behaviorReconnect=1&oneEnvelope=1&pointerCoupling=1";

export const HOME_HERO_CONFIG = {
  identityId: "four-edge-narrow",
  geometryFamily: "four-edge-containment",
  scalePreset: "M+",
  contourMode: "depth",
  depthRelationId: "corner-biased",
  locomotionTiming: "clear-contact-lead",
  systemIntensity: "medium",
  formHitPadding: 32,
  objectRecognitionMs: 50,
  heroScale: 0.65,
} as const;

export const HOME_HERO_REFERENCE_URL = `/lab/hero-real-context?${HOME_HERO_REFERENCE_QUERY}&geometryFamily=four-edge-containment&geometry=four-edge-narrow&scale=M%2B&contour=depth&depth=corner-biased&systemBehavior=active-system&systemIntensity=medium&requestSignal=current-distributed&traceMode=off&freeStateMode=off&traceAccent=off&contactAccentSync=0&locomotionTiming=clear-contact-lead&cleanReview=1`;

