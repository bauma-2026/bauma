/**
 * Production motion surface — One Envelope + Clear Contact Lead @ 0.65 scale.
 */

export {
  computeOneEnvelopeFrame,
  ONE_ENVELOPE_HERO_SCALE,
  ONE_ENVELOPE_RESOLVE_START,
  type OneEnvelopeFrame,
} from "./heroEnvelope";

export {
  stepPointerCoupling,
  emptyPointerCouplingState,
  emptyPointerCouplingRefs,
  POINTER_COUPLING_TUNING,
  OBJECT_JOURNEY_ACTIVATION_MS,
  triggerActiveJourney,
  type PointerCouplingState,
  type PointerCouplingInputs,
} from "./heroPointerJourney";

export { useHeroPointerJourney as usePointerCoupling } from "./useHeroPointerJourney";
