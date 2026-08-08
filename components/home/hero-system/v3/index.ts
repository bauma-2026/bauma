export { default as HomeHeroSpatialV3Object } from "./HomeHeroSpatialV3Object";
export {
  V3_CANVAS,
  V3_S0_FRONT,
  V3_S0_REAR,
  V3_S0_MATERIAL,
} from "./geometryV3";
export {
  analyzeFullSpatialPath,
  analyzeS0toS1Path,
  FITTED_S0_POSE,
  LIVE_SPATIAL_SAMPLE,
  PATH_DEMO_SPATIAL_SAMPLE,
  P1_BRIDGE,
  sampleFullSpatialPath,
  sampleS0toS1Path,
  sampleS1toS2Path,
  S1_POSE,
  S2_POSE,
  V3_FULL_PATH_PROGRESS,
  V3_PATH_PROGRESS,
  V3_REVEAL_PRESSURE_SPLIT,
} from "./spatialPathV3";
export type { SpatialEasing, SpatialSampleOptions } from "./spatialPathV3";
export {
  PR1_MAX_PROGRESS,
  TEMPORAL_I1,
  V3_SPLIT,
  ZONE_RADII,
  mapCurveI1,
  tickProximity,
} from "./proximityModelV3";
export { useHeroProximityV3 } from "./useHeroProximityV3";
export {
  createProximityRuntime,
  PROXIMITY_FIELD_SELECTOR,
  REST_EPS,
} from "./createProximityRuntime";
