/** Shared modal surface tokens — Modal Surface & Transition Study 01 */
export const MODAL_SURFACE = {
  backdrop: "rgba(0, 0, 0, 0.68)",
  panelBase: "#121212",
  panelTop: "#141414",
  panelBottom: "#111111",
  border: "rgba(255, 255, 255, 0.15)",
  shadow: "0 24px 80px rgba(0, 0, 0, 0.58)",
  panelGradient:
    "linear-gradient(180deg, #141414 0%, #121212 42%, #111111 100%)",
} as const;

export const MODAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Study timing — Variant B anchored (desktop) */
export const ANCHORED_TIMING = {
  backdropIn: 160,
  shellExpand: 380,
  contentIn: 440,
  contentDelay: 220,
  closeShell: 260,
  closeBackdrop: 220,
} as const;

/** Baseline timing — Variant A / fallback */
export const BASELINE_TIMING = {
  open: 360,
  close: 240,
  reduced: 80,
} as const;

export type ModalStudyMode = "surface" | "anchored" | null;

export function resolveStudyMode(param: string | null): ModalStudyMode {
  if (param === "surface" || param === "anchored") return param;
  return null;
}

export function useStudySurfaces(studyMode: ModalStudyMode) {
  const active = studyMode !== null;
  return {
    active,
    backdrop: active ? MODAL_SURFACE.backdrop : undefined,
    panelBackground: active ? MODAL_SURFACE.panelGradient : undefined,
    borderColor: active ? MODAL_SURFACE.border : undefined,
  };
}
