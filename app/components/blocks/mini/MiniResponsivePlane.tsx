"use client";

import { useEffect, useRef, useState } from "react";

import { isFiniteNumber } from "@/lib/svgFinite";
import {
  MINI_OBJECT_FILL,
  MINI_OBJECT_FILL_PEAK,
  MINI_OBJECT_STROKE,
  mixHex,
} from "./miniObjectMaterial";

function finiteCoord(value: string | number): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return isFiniteNumber(n) ? n : null;
}

type MiniResponsivePlaneProps = {
  className?: string;
  variant?: "desktop" | "mobile";
};

/**
 * Approved P1 interaction physics (Visual Layer lab → production).
 * Impulse → settle open; asymmetric release. Geometry amplitude unchanged.
 */
const P1 = {
  openImpulseMs: 190,
  openSettleMs: 340,
  openImpulseTarget: 0.88,
  attackPow: 4.2,
  settlePow: 1.55,
  releaseKick: 0.18,
  releaseDampMs: 380,
  releasePow: 2.4,
  lagMs: { amber: 22, rear: 40, connectors: 58 },
} as const;

/** Front activation Variant B — locked. */
const FRONT_B = { rest: 0.35, peak: 0.6, hold: 0.55 } as const;

/** Production amber range — secondary to front activation. */
const AMBER = { rest: 0.62, peak: 0.84 } as const;

const VIEWBOX_WIDTH_DESKTOP = 460;
const VIEWBOX_WIDTH_MOBILE = 360;

/**
 * Ambient presence envelope (idle life only — P1 interaction locked separately).
 * Before → after (~1.6× translation, ~1.45× rotation; durations/phases unchanged):
 *   tx primary/secondary: 0.44/0.20 → 0.70/0.32
 *   ty primary/secondary: 0.34/0.15 → 0.54/0.24
 *   rot primary/secondary: 0.16/0.08 → 0.23/0.12
 * Mobile applies MOBILE_AMBIENT_GAIN on top (quieter than desktop).
 */
const AMBIENT_PRESENCE = {
  translationX: {
    primaryAmplitude: 0.7,
    primaryDuration: 11_300,
    secondaryAmplitude: 0.32,
    secondaryDuration: 8_700,
    secondaryPhase: 1.17,
  },
  translationY: {
    primaryAmplitude: 0.54,
    primaryDuration: 9_400,
    primaryPhase: 0.63,
    secondaryAmplitude: 0.24,
    secondaryDuration: 11_700,
    secondaryPhase: 2.1,
  },
  rotation: {
    primaryAmplitude: 0.23,
    primaryDuration: 10_800,
    primaryPhase: 0.4,
    secondaryAmplitude: 0.12,
    secondaryDuration: 8_900,
    secondaryPhase: 2.4,
  },

  rearFollow: {
    xGain: 0.12,
    yGain: 0.1,
  },

  hoverStrength: 0.1,
  hoverTakeoverDuration: 220,
  leaveReturnDuration: 780,
} as const;

/** Mobile ambient-only — same material character, quieter than desktop idle. */
const MOBILE_AMBIENT_GAIN = 0.72;

/** Mobile direct drag cap — does not exceed desktop P1 max geometry. */
const MOBILE_DIRECT_OPEN_MAX = 0.92;

/** Transient scroll-only open nudge (mobile); never persists, never negative. */
const MOBILE_SCROLL_OPEN_MAX = 0.09;

const MOBILE_GESTURE_DECISION_PX = 12;
const MOBILE_HORIZONTAL_DOMINANCE = 1.35;
const MOBILE_VERTICAL_DOMINANCE = 1.35;

const MOBILE_SCROLL_IMPULSE_PER_PX = 0.000042;
const MOBILE_SCROLL_VEL_CLAMP = 0.011;
const MOBILE_SCROLL_VEL_DAMP = 0.93;
const MOBILE_SCROLL_RETURN_K = 0.11;

/** Damped spring after drag release — u returns to 0 (slightly under-critical). */
const MOBILE_RELEASE_SPRING_STIFFNESS = 30;
const MOBILE_RELEASE_SPRING_DAMPING = 8.6;
const MOBILE_RELEASE_SPRING_SETTLE_EPSILON = 0.0035;
const MOBILE_RELEASE_SPRING_VEL_EPSILON = 0.0008;

/** ~half hit width for 0 → MOBILE_DIRECT_OPEN_MAX travel. */
const MOBILE_DRAG_WIDTH_FRACTION = 0.48;

const MOBILE_SCROLL_MQ = "(max-width: 1023px)";

/** One restrained open→close breath when the object crosses the viewport mid-band. */
const MOBILE_PASS_BY_PEAK = 0.2;

/** Object center enters band at 45–65% viewport height; re-arm outside 40–70%. */
const MOBILE_PASS_BY_ENTER_TOP_RATIO = 0.45;
const MOBILE_PASS_BY_ENTER_BOTTOM_RATIO = 0.65;
const MOBILE_PASS_BY_EXIT_TOP_RATIO = 0.4;
const MOBILE_PASS_BY_EXIT_BOTTOM_RATIO = 0.7;

/**
 * Continuous scroll-velocity nudge (keep true for A/B vs pass-by-only).
 * Toggle to false locally to compare pass-by pulse without velocity nudge.
 */
const MOBILE_SCROLL_VELOCITY_NUDGE_ENABLED = false;

type MobilePassByZone = "above" | "in" | "below";

const DESKTOP_P1_CONNECTORS = {
  topX2: 344,
  topY2: 117,
  topX2Open: 352,
  topY2Open: 124,
  botX2: 109,
  botY2: 261,
  botX2Open: 117,
  botY2Open: 268,
} as const;

const MOBILE_P1_CONNECTORS = {
  topX2: 306,
  topY2: 106,
  topX2Open: 314,
  topY2Open: 113,
  botX2: 62,
  botY2: 230,
  botX2Open: 70,
  botY2Open: 237,
} as const;

type P1ApplyTargets = {
  mainGroup: SVGGElement | null;
  rearPose: SVGGElement | null;
  rearPoly: SVGPolygonElement | null;
  front: SVGPolygonElement | null;
  amber: SVGPathElement | null;
  fillPoly: SVGPolygonElement | null;
  fillInner: SVGPathElement | null;
  edgeStroke: SVGPathElement | null;
  connTop: SVGLineElement | null;
  connBot: SVGLineElement | null;
  extraLines: readonly (SVGLineElement | null)[];
};

type P1ConnectorEndpoints = {
  topX2: number;
  topY2: number;
  topX2Open: number;
  topY2Open: number;
  botX2: number;
  botY2: number;
  botX2Open: number;
  botY2Open: number;
};

function applyP1Open(
  targets: P1ApplyTargets,
  connectors: P1ConnectorEndpoints,
  edgeOpacityBase: number,
  rearStroke: string,
  uFront: number,
  uAmber: number,
  uRear: number,
  uConn: number,
) {
  if (targets.front) {
    targets.front.setAttribute(
      "stroke",
      `rgba(255,255,255,${softFrontOpacity(uFront).toFixed(3)})`,
    );
  }
  if (targets.amber) {
    targets.amber.style.opacity = String(
      AMBER.rest + (AMBER.peak - AMBER.rest) * uAmber,
    );
  }

  const mainX = 1 + 1 * uFront;
  const mainY = 0 + -1 * uFront;
  const mainR = -1 + 0.65 * uFront;
  if (targets.mainGroup) {
    targets.mainGroup.style.transform = `translate(${mainX}px, ${mainY}px) rotate(${mainR}deg)`;
  }

  if (targets.rearPose) {
    targets.rearPose.style.transform = `translate(${8 * uRear}px, ${7 * uRear}px)`;
  }
  if (targets.rearPoly) {
    targets.rearPoly.setAttribute(
      "fill",
      mixHex(MINI_OBJECT_FILL.rear, MINI_OBJECT_FILL_PEAK.rear, uRear),
    );
    targets.rearPoly.setAttribute("stroke", rearStroke);
  }
  if (targets.fillPoly) {
    targets.fillPoly.setAttribute(
      "fill",
      mixHex(MINI_OBJECT_FILL.side, MINI_OBJECT_FILL_PEAK.side, uFront),
    );
  }
  if (targets.fillInner) {
    targets.fillInner.setAttribute(
      "fill",
      mixHex(MINI_OBJECT_FILL.inset, MINI_OBJECT_FILL_PEAK.inset, uFront),
    );
  }
  if (targets.edgeStroke) {
    targets.edgeStroke.style.strokeOpacity = String(
      edgeOpacityBase + 0.02 * uFront,
    );
  }

  if (targets.connTop) {
    targets.connTop.setAttribute(
      "x2",
      String(connectors.topX2 + (connectors.topX2Open - connectors.topX2) * uConn),
    );
    targets.connTop.setAttribute(
      "y2",
      String(connectors.topY2 + (connectors.topY2Open - connectors.topY2) * uConn),
    );
  }
  if (targets.connBot) {
    targets.connBot.setAttribute(
      "x2",
      String(connectors.botX2 + (connectors.botX2Open - connectors.botX2) * uConn),
    );
    targets.connBot.setAttribute(
      "y2",
      String(connectors.botY2 + (connectors.botY2Open - connectors.botY2) * uConn),
    );
  }
  for (const line of targets.extraLines) {
    if (line) line.style.opacity = String(0.11 * uConn);
  }
}

function resetP1ClosedPose(
  targets: P1ApplyTargets,
  connectors: P1ConnectorEndpoints,
  edgeOpacityBase: number,
  rearStroke: string,
  frontStrokeRest: string,
) {
  if (targets.mainGroup) {
    targets.mainGroup.style.transform = "translate(1px, 0) rotate(-1deg)";
  }
  if (targets.rearPose) {
    targets.rearPose.style.transform = "translate(0, 0)";
  }
  if (targets.front) {
    targets.front.setAttribute("stroke", frontStrokeRest);
  }
  if (targets.amber) {
    targets.amber.style.opacity = String(AMBER.rest);
  }
  if (targets.rearPoly) {
    targets.rearPoly.setAttribute("fill", MINI_OBJECT_FILL.rear);
    targets.rearPoly.setAttribute("stroke", rearStroke);
  }
  if (targets.fillPoly) {
    targets.fillPoly.setAttribute("fill", MINI_OBJECT_FILL.side);
  }
  if (targets.fillInner) {
    targets.fillInner.setAttribute("fill", MINI_OBJECT_FILL.inset);
    if (targets.fillInner.style) {
      targets.fillInner.style.fillOpacity = "1";
    }
  }
  if (targets.edgeStroke) {
    targets.edgeStroke.style.strokeOpacity = String(edgeOpacityBase);
  }
  if (targets.connTop) {
    targets.connTop.setAttribute("x2", String(connectors.topX2));
    targets.connTop.setAttribute("y2", String(connectors.topY2));
  }
  if (targets.connBot) {
    targets.connBot.setAttribute("x2", String(connectors.botX2));
    targets.connBot.setAttribute("y2", String(connectors.botY2));
  }
  for (const line of targets.extraLines) {
    if (line) line.style.opacity = "0";
  }
}

function channelsFromOpenProgress(openProgress: number) {
  const u = clamp01(openProgress);
  return { uFront: u, uAmber: u, uRear: u, uConn: u };
}

// Clamp bounds for the render-scale compensation multiplier, so a very
// large or very small render size can't blow up the ambient amplitude.
const MIN_TRANSLATION_SCALE = 0.6;
const MAX_TRANSLATION_SCALE = 3;

type AmbientBlendTransition = {
  from: number;
  to: number;
  startedAt: number;
  duration: number;
};

type InteractionMode = "rest" | "open" | "release";

const TWO_PI = Math.PI * 2;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function ambientWave(time: number, duration: number, phase = 0) {
  return Math.sin((time / duration) * TWO_PI + phase);
}

function sampleAmbientBlend(
  transition: AmbientBlendTransition,
  time: number,
) {
  if (transition.duration === 0) {
    return transition.to;
  }

  const progress = Math.min(
    1,
    Math.max(0, (time - transition.startedAt) / transition.duration),
  );
  const eased = progress * progress * (3 - 2 * progress);

  return transition.from + (transition.to - transition.from) * eased;
}

function openProgress(elapsed: number) {
  if (elapsed <= 0) return 0;
  if (elapsed < P1.openImpulseMs) {
    const t = elapsed / P1.openImpulseMs;
    return P1.openImpulseTarget * (1 - (1 - t) ** P1.attackPow);
  }
  const t = clamp01((elapsed - P1.openImpulseMs) / P1.openSettleMs);
  const settled = 1 - (1 - t) ** P1.settlePow;
  return P1.openImpulseTarget + (1 - P1.openImpulseTarget) * settled;
}

/** Immediate disengage kick, then damped return — not entry rewind. */
function releaseProgress(from: number, elapsed: number) {
  if (elapsed <= 0) return from;
  const kicked = Math.max(0, from - P1.releaseKick);
  const t = clamp01(elapsed / P1.releaseDampMs);
  const ease = 1 - (1 - t) ** P1.releasePow;
  return kicked * (1 - ease);
}

/** Map a current u onto the open curve so re-entry continues without snap. */
function openElapsedForU(targetU: number) {
  if (targetU <= 0) return 0;
  const span = P1.openImpulseMs + P1.openSettleMs;
  if (targetU >= 1) return span;
  let lo = 0;
  let hi = span;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (openProgress(mid) < targetU) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function softFrontOpacity(u: number) {
  const rising = FRONT_B.rest + (FRONT_B.peak - FRONT_B.rest) * u;
  if (u <= 0.92) return rising;
  const t = (u - 0.92) / 0.08;
  return FRONT_B.hold + (FRONT_B.peak - FRONT_B.hold) * (1 - t);
}

// CSS transforms on SVG elements are expressed in the coordinate system's
// user units (the viewBox), not screen pixels. When the SVG is rendered
// smaller than its viewBox, a "0.5px" translate ends up smaller than
// 0.5 real screen pixels and can disappear entirely. This measures the
// element's actual rendered width and returns a multiplier that keeps the
// ambient translation visually consistent regardless of display size.
function useTranslationScale(
  svgRef: React.RefObject<SVGSVGElement | null>,
  viewBoxWidth: number,
) {
  const [translationScale, setTranslationScale] = useState(1);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const renderedWidth = entry?.contentRect.width;
      if (!renderedWidth) return;

      const rawScale = viewBoxWidth / renderedWidth;
      setTranslationScale(
        Math.min(
          MAX_TRANSLATION_SCALE,
          Math.max(MIN_TRANSLATION_SCALE, rawScale),
        ),
      );
    });

    observer.observe(svg);
    return () => observer.disconnect();
  }, [svgRef, viewBoxWidth]);

  return translationScale;
}

function useAmbientPresence({
  enabled,
  running,
  resolved,
  translationScale,
  amplitudeGain = 1,
}: {
  /** Motion preference allowed (not reduced-motion). */
  enabled: boolean;
  /** Section + document visible — pauses RAF without resetting pose. */
  running: boolean;
  resolved: boolean;
  translationScale: number;
  /** 1 = desktop idle envelope; <1 = quieter mobile presence. */
  amplitudeGain?: number;
}) {
  const objectRef = useRef<SVGGElement>(null);
  const rearRef = useRef<SVGGElement>(null);
  const frameRef = useRef<number | null>(null);
  const blendRef = useRef(1);
  const translationScaleRef = useRef(translationScale);
  const amplitudeGainRef = useRef(amplitudeGain);
  const blendTransitionRef = useRef<AmbientBlendTransition>({
    from: 1,
    to: 1,
    startedAt: 0,
    duration: 0,
  });

  useEffect(() => {
    translationScaleRef.current = translationScale;
  }, [translationScale]);

  useEffect(() => {
    amplitudeGainRef.current = amplitudeGain;
  }, [amplitudeGain]);

  useEffect(() => {
    if (!enabled) return;

    const now = performance.now();
    const currentBlend = sampleAmbientBlend(
      blendTransitionRef.current,
      now,
    );

    blendRef.current = currentBlend;
    blendTransitionRef.current = {
      from: currentBlend,
      to: resolved ? AMBIENT_PRESENCE.hoverStrength : 1,
      startedAt: now,
      duration: resolved
        ? AMBIENT_PRESENCE.hoverTakeoverDuration
        : AMBIENT_PRESENCE.leaveReturnDuration,
    };
  }, [enabled, resolved]);

  useEffect(() => {
    const object = objectRef.current;
    const rear = rearRef.current;

    if (!enabled) {
      if (object) object.style.transform = "";
      if (rear) rear.style.transform = "";
      blendRef.current = 1;
      blendTransitionRef.current = {
        from: 1,
        to: 1,
        startedAt: 0,
        duration: 0,
      };
      return;
    }

    let timeSkew = 0;
    let pausedAt: number | null = null;
    let playing = false;

    const renderFrame = (time: number) => {
      const t = time - timeSkew;
      const blend = sampleAmbientBlend(
        blendTransitionRef.current,
        time,
      );
      blendRef.current = blend;
      const tScale = translationScaleRef.current;
      const gain = amplitudeGainRef.current;

      const x =
        (ambientWave(
          t,
          AMBIENT_PRESENCE.translationX.primaryDuration,
        ) *
          AMBIENT_PRESENCE.translationX.primaryAmplitude +
          ambientWave(
            t,
            AMBIENT_PRESENCE.translationX.secondaryDuration,
            AMBIENT_PRESENCE.translationX.secondaryPhase,
          ) *
            AMBIENT_PRESENCE.translationX.secondaryAmplitude) *
        tScale *
        gain;
      const y =
        (ambientWave(
          t,
          AMBIENT_PRESENCE.translationY.primaryDuration,
          AMBIENT_PRESENCE.translationY.primaryPhase,
        ) *
          AMBIENT_PRESENCE.translationY.primaryAmplitude +
          ambientWave(
            t,
            AMBIENT_PRESENCE.translationY.secondaryDuration,
            AMBIENT_PRESENCE.translationY.secondaryPhase,
          ) *
            AMBIENT_PRESENCE.translationY.secondaryAmplitude) *
        tScale *
        gain;
      // Rotation is a pure angle and is unaffected by render scale, so it
      // is not multiplied by tScale — only by ambient gain.
      const rotation =
        (ambientWave(
          t,
          AMBIENT_PRESENCE.rotation.primaryDuration,
          AMBIENT_PRESENCE.rotation.primaryPhase,
        ) *
          AMBIENT_PRESENCE.rotation.primaryAmplitude +
          ambientWave(
            t,
            AMBIENT_PRESENCE.rotation.secondaryDuration,
            AMBIENT_PRESENCE.rotation.secondaryPhase,
          ) *
            AMBIENT_PRESENCE.rotation.secondaryAmplitude) *
        gain;
      const rearX = x * AMBIENT_PRESENCE.rearFollow.xGain;
      const rearY = y * AMBIENT_PRESENCE.rearFollow.yGain;

      if (object) {
        object.style.transform = `translate3d(${x * blend}px, ${
          y * blend
        }px, 0) rotate(${rotation * blend}deg)`;
      }

      if (rear) {
        rear.style.transform = `translate3d(${rearX * blend}px, ${
          rearY * blend
        }px, 0)`;
      }

      if (playing) {
        frameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    const play = () => {
      if (playing) return;
      if (pausedAt != null) {
        timeSkew += performance.now() - pausedAt;
        pausedAt = null;
      }
      playing = true;
      frameRef.current = requestAnimationFrame(renderFrame);
    };

    const pause = () => {
      if (!playing) return;
      playing = false;
      pausedAt = performance.now();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    if (running) play();
    else pause();

    return () => {
      playing = false;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [enabled, running]);

  return { objectRef, rearRef };
}

const desktopStrokes = {
  front: MINI_OBJECT_STROKE.primary,
  rear: MINI_OBJECT_STROKE.rear,
  upperConnector: "rgba(255,255,255,0.08)",
  lowerConnector: MINI_OBJECT_STROKE.ghost,
  amber: "rgba(209,164,95,1)",
};

const mobileStrokes = {
  rear: "rgba(255,255,255,0.14)",
  amber: "rgba(209,164,95,1)",
};

function DesktopPlane({
  ambientEnabled,
  ambientRunning,
  interactive,
}: {
  ambientEnabled: boolean;
  ambientRunning: boolean;
  interactive: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const translationScale = useTranslationScale(svgRef, VIEWBOX_WIDTH_DESKTOP);
  const [resolved, setResolved] = useState(false);
  const { objectRef, rearRef } = useAmbientPresence({
    enabled: ambientEnabled,
    running: ambientRunning,
    resolved: interactive ? resolved : false,
    translationScale,
    amplitudeGain: 1,
  });

  const modeRef = useRef<InteractionMode>("rest");
  const modeStartedRef = useRef(0);
  const releaseFromRef = useRef(1);
  const physicsRafRef = useRef<number | null>(null);

  const mainGroupRef = useRef<SVGGElement>(null);
  const rearPoseRef = useRef<SVGGElement>(null);
  const rearPolyRef = useRef<SVGPolygonElement>(null);
  const frontRef = useRef<SVGPolygonElement>(null);
  const amberRef = useRef<SVGPathElement>(null);
  const fillPolyRef = useRef<SVGPolygonElement>(null);
  const fillInnerRef = useRef<SVGPathElement>(null);
  const edgeStrokeRef = useRef<SVGPathElement>(null);
  const connTopRef = useRef<SVGLineElement>(null);
  const connBotRef = useRef<SVGLineElement>(null);
  const extraRefs = useRef<(SVGLineElement | null)[]>([]);

  const p1Targets = (): P1ApplyTargets => ({
    mainGroup: mainGroupRef.current,
    rearPose: rearPoseRef.current,
    rearPoly: rearPolyRef.current,
    front: frontRef.current,
    amber: amberRef.current,
    fillPoly: fillPolyRef.current,
    fillInner: fillInnerRef.current,
    edgeStroke: edgeStrokeRef.current,
    connTop: connTopRef.current,
    connBot: connBotRef.current,
    extraLines: extraRefs.current,
  });

  useEffect(() => {
    if (!interactive) {
      modeRef.current = "rest";
      resetP1ClosedPose(
        p1Targets(),
        DESKTOP_P1_CONNECTORS,
        0.21,
        desktopStrokes.rear,
        desktopStrokes.front,
      );
      return;
    }

    const apply = (
      uFront: number,
      uAmber: number,
      uRear: number,
      uConn: number,
    ) => {
      applyP1Open(
        p1Targets(),
        DESKTOP_P1_CONNECTORS,
        0.21,
        desktopStrokes.rear,
        uFront,
        uAmber,
        uRear,
        uConn,
      );
    };

    const tick = (now: number) => {
      const mode = modeRef.current;
      const elapsed = now - modeStartedRef.current;

      let uFront = 0;
      let uAmber = 0;
      let uRear = 0;
      let uConn = 0;

      if (mode === "rest") {
        uFront = uAmber = uRear = uConn = 0;
      } else if (mode === "open") {
        uFront = openProgress(elapsed);
        uAmber = openProgress(Math.max(0, elapsed - P1.lagMs.amber));
        uRear = openProgress(Math.max(0, elapsed - P1.lagMs.rear));
        uConn = openProgress(Math.max(0, elapsed - P1.lagMs.connectors));
      } else {
        const base = releaseProgress(releaseFromRef.current, elapsed);
        uFront = base;
        uAmber = releaseProgress(
          releaseFromRef.current,
          Math.max(0, elapsed - 12),
        );
        uRear = releaseProgress(
          releaseFromRef.current,
          Math.max(0, elapsed - 28),
        );
        uConn = releaseProgress(
          releaseFromRef.current,
          Math.max(0, elapsed - 40),
        );
        if (base < 0.004 && uRear < 0.004) {
          modeRef.current = "rest";
          uFront = uAmber = uRear = uConn = 0;
          setResolved(false);
        }
      }

      apply(uFront, uAmber, uRear, uConn);
      if (svgRef.current) {
        svgRef.current.setAttribute("data-vl-u", uFront.toFixed(3));
        svgRef.current.setAttribute("data-vl-mode", modeRef.current);
      }
      physicsRafRef.current = requestAnimationFrame(tick);
    };

    physicsRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (physicsRafRef.current !== null) {
        cancelAnimationFrame(physicsRafRef.current);
        physicsRafRef.current = null;
      }
    };
  }, [interactive]);

  const handleActivate = () => {
    if (!interactive) return;
    const now = performance.now();
    let current = 0;
    if (modeRef.current === "open") {
      current = openProgress(now - modeStartedRef.current);
    } else if (modeRef.current === "release") {
      current = releaseProgress(
        releaseFromRef.current,
        now - modeStartedRef.current,
      );
    }
    modeRef.current = "open";
    modeStartedRef.current = now - openElapsedForU(current);
    setResolved(true);
  };

  const handleDeactivate = () => {
    if (!interactive) return;
    const now = performance.now();
    let current = 0;
    if (modeRef.current === "open") {
      current = openProgress(now - modeStartedRef.current);
    } else if (modeRef.current === "release") {
      current = releaseProgress(
        releaseFromRef.current,
        now - modeStartedRef.current,
      );
    }
    releaseFromRef.current = Math.max(current, 0.2);
    modeRef.current = "release";
    modeStartedRef.current = now;
    // Ambient return begins on pointer leave; pose damps via release curve.
    setResolved(false);
  };

  const extraEdges = [
    ["118", "88", "144", "109"],
    ["298", "286", "322", "307"],
  ];

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 460 380"
      fill="none"
      aria-hidden="true"
      shapeRendering="geometricPrecision"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
      className="pointer-events-auto h-full w-full overflow-visible"
    >
      <defs>
        <clipPath id="mini-responsive-plane-desktop-front-clip">
          <polygon points="118,88 326,106 298,286 92,248" />
        </clipPath>
      </defs>
      <g
        ref={objectRef}
        pointerEvents="none"
        style={{
          transformBox: "view-box",
          transformOrigin: "230px 190px",
          willChange: "transform",
        }}
      >
        <g
          ref={mainGroupRef}
          style={{
            transform: "translate(1px, 0) rotate(-1deg)",
            transformBox: "view-box",
            transformOrigin: "230px 190px",
            willChange: "transform",
          }}
        >
          <g
            style={{
              transform: "scale(1.05)",
              transformBox: "view-box",
              transformOrigin: "218px 192.5px",
            }}
          >
            <g
              ref={rearRef}
              style={{
                transformBox: "view-box",
                transformOrigin: "230px 190px",
                willChange: "transform",
              }}
            >
              <g
                ref={rearPoseRef}
                style={{
                  transform: "translate(0, 0)",
                  transformBox: "view-box",
                  transformOrigin: "230px 190px",
                  willChange: "transform",
                }}
              >
                <polygon
                  ref={rearPolyRef}
                  points="136,102 344,117 310,297 109,261"
                  fill={MINI_OBJECT_FILL.rear}
                  stroke={desktopStrokes.rear}
                />
              </g>
            </g>
            <polygon
              ref={fillPolyRef}
              points="118,88 326,106 298,286 92,248"
              fill={MINI_OBJECT_FILL.side}
            />
            <g clipPath="url(#mini-responsive-plane-desktop-front-clip)">
              <path
                ref={fillInnerRef}
                d="M113.9286 113.0547 L234.8 125.4 L228.8 163.1 L271.4 168.3 L254.2201 277.9241 L92 248 Z"
                fill={MINI_OBJECT_FILL.inset}
                style={{ fillOpacity: 1 }}
              />
              <path
                ref={edgeStrokeRef}
                d="M113.9286 113.0547 L234.8 125.4"
                fill="none"
                stroke="rgba(255,255,255,0.21)"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                style={{ strokeOpacity: 0.21 }}
              />
              <line
                x1="271.4"
                y1="168.3"
                x2="254.2201"
                y2="277.9241"
                stroke="rgba(255,255,255,0.11)"
                strokeLinecap="butt"
              />
              <path
                ref={amberRef}
                d="M234.8 125.4 L228.8 163.1 L271.4 168.3"
                fill="none"
                stroke={desktopStrokes.amber}
                strokeWidth="1.25"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                style={{ opacity: AMBER.rest }}
              />
            </g>
            <polygon
              ref={frontRef}
              points="118,88 326,106 298,286 92,248"
              fill="none"
              stroke={desktopStrokes.front}
            />

            <line
              ref={connTopRef}
              x1="326"
              y1="106"
              x2="344"
              y2="117"
              stroke={desktopStrokes.upperConnector}
            />
            <line
              ref={connBotRef}
              x1="92"
              y1="248"
              x2="109"
              y2="261"
              stroke={desktopStrokes.lowerConnector}
            />
            {extraEdges.map(([x1, y1, x2, y2], i) => {
              const a = finiteCoord(x1);
              const b = finiteCoord(y1);
              const c = finiteCoord(x2);
              const d = finiteCoord(y2);
              if (a == null || b == null || c == null || d == null) return null;
              return (
                <line
                  key={`${a}-${b}-${c}-${d}`}
                  ref={(el) => {
                    extraRefs.current[i] = el;
                  }}
                  x1={a}
                  y1={b}
                  x2={c}
                  y2={d}
                  stroke={desktopStrokes.lowerConnector}
                  style={{ opacity: 0 }}
                />
              );
            })}
          </g>
        </g>
      </g>
      <polygon
        points="94,68 346,90 362,118 338,318 96,286 72,260"
        fill="rgba(0,0,0,0.001)"
        stroke="none"
        pointerEvents="all"
        onPointerEnter={handleActivate}
        onPointerLeave={handleDeactivate}
      />
    </svg>
  );
}

function MobilePlane({
  ambientEnabled,
  ambientRunning,
  sectionVisible,
  prefersReducedMotion,
  breakpointActive,
}: {
  ambientEnabled: boolean;
  ambientRunning: boolean;
  sectionVisible: boolean;
  prefersReducedMotion: boolean;
  breakpointActive: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hitRef = useRef<SVGPolygonElement>(null);
  const translationScale = useTranslationScale(svgRef, VIEWBOX_WIDTH_MOBILE);
  const { objectRef, rearRef } = useAmbientPresence({
    enabled: ambientEnabled,
    running: ambientRunning,
    resolved: false,
    translationScale,
    amplitudeGain: MOBILE_AMBIENT_GAIN,
  });

  const mainGroupRef = useRef<SVGGElement>(null);
  const rearPoseRef = useRef<SVGGElement>(null);
  const rearPolyRef = useRef<SVGPolygonElement>(null);
  const frontRef = useRef<SVGPolygonElement>(null);
  const amberRef = useRef<SVGPathElement>(null);
  const fillPolyRef = useRef<SVGPolygonElement>(null);
  const fillInnerRef = useRef<SVGPathElement>(null);
  const edgeStrokeRef = useRef<SVGPathElement>(null);
  const connTopRef = useRef<SVGLineElement>(null);
  const connBotRef = useRef<SVGLineElement>(null);

  const [debugOpenProgress, setDebugOpenProgress] = useState<number | null>(
    null,
  );
  const debugOpenProgressRef = useRef<number | null>(null);
  const sectionVisibleRef = useRef(sectionVisible);
  const breakpointActiveRef = useRef(breakpointActive);
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  const ambientEnabledRef = useRef(ambientEnabled);

  const showVlDebug =
    process.env.NODE_ENV === "development" &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("vlDebug");

  useEffect(() => {
    debugOpenProgressRef.current = debugOpenProgress;
  }, [debugOpenProgress]);

  useEffect(() => {
    sectionVisibleRef.current = sectionVisible;
  }, [sectionVisible]);

  useEffect(() => {
    breakpointActiveRef.current = breakpointActive;
  }, [breakpointActive]);

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  useEffect(() => {
    ambientEnabledRef.current = ambientEnabled;
  }, [ambientEnabled]);

  const p1Targets = (): P1ApplyTargets => ({
    mainGroup: mainGroupRef.current,
    rearPose: rearPoseRef.current,
    rearPoly: rearPolyRef.current,
    front: frontRef.current,
    amber: amberRef.current,
    fillPoly: fillPolyRef.current,
    fillInner: fillInnerRef.current,
    edgeStroke: edgeStrokeRef.current,
    connTop: connTopRef.current,
    connBot: connBotRef.current,
    extraLines: [],
  });

  const mobileFrontRest = "rgba(255,255,255,0.35)";

  useEffect(() => {
    const scrollOffsetURef = { current: 0 };
    const scrollVelURef = { current: 0 };
    const releaseURef = { current: 0 };
    const releaseVelURef = { current: 0 };
    let lastScrollY = window.scrollY;
    let lastTickTime = performance.now();

    type PendingGesture = {
      pointerId: number;
      startX: number;
      startY: number;
      totalDx: number;
      totalDy: number;
      abandoned: boolean;
    };
    type ActiveDrag = {
      pointerId: number;
      startX: number;
      originX: number;
      startU: number;
    };

    let pending: PendingGesture | null = null;
    let drag: ActiveDrag | null = null;
    let raf: number | null = null;

    let passByZone: MobilePassByZone | null = null;
    let passByCanTrigger = true;
    let passBySuppressAfterDrag = false;

    const passByEnterZone = (centerY: number, vh: number): MobilePassByZone => {
      const top = vh * MOBILE_PASS_BY_ENTER_TOP_RATIO;
      const bottom = vh * MOBILE_PASS_BY_ENTER_BOTTOM_RATIO;
      if (centerY < top) return "above";
      if (centerY > bottom) return "below";
      return "in";
    };

    const passByOutsideExitBand = (centerY: number, vh: number) => {
      const top = vh * MOBILE_PASS_BY_EXIT_TOP_RATIO;
      const bottom = vh * MOBILE_PASS_BY_EXIT_BOTTOM_RATIO;
      return centerY < top || centerY > bottom;
    };

    const resetPassByState = () => {
      passByZone = null;
      passByCanTrigger = true;
      passBySuppressAfterDrag = false;
      svgRef.current?.removeAttribute("data-vl-passby");
    };

    const updatePassBy = () => {
      if (
        !breakpointActiveRef.current ||
        !sectionVisibleRef.current ||
        prefersReducedMotionRef.current ||
        drag != null ||
        debugOpenProgressRef.current != null
      ) {
        return;
      }

      const el = hitRef.current ?? svgRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if (rect.height <= 0) return;

      const centerY = rect.top + rect.height / 2;
      const vh = window.innerHeight;
      const zone = passByEnterZone(centerY, vh);

      if (passByZone === null) {
        passByZone = zone;
        if (zone === "in") {
          passByCanTrigger = false;
        }
        return;
      }

      if (passByOutsideExitBand(centerY, vh)) {
        passByCanTrigger = true;
        passBySuppressAfterDrag = false;
        svgRef.current?.removeAttribute("data-vl-passby");
      }

      if (
        passByCanTrigger &&
        !passBySuppressAfterDrag &&
        passByZone !== "in" &&
        zone === "in"
      ) {
        resetScrollOpenNudge();
        releaseURef.current = clampMobileOpen(
          Math.max(releaseURef.current, MOBILE_PASS_BY_PEAK),
        );
        releaseVelURef.current = 0;
        passByCanTrigger = false;
        svgRef.current?.setAttribute("data-vl-passby", "1");
      }

      passByZone = zone;
    };

    const resetScrollOpenNudge = () => {
      scrollOffsetURef.current = 0;
      scrollVelURef.current = 0;
      lastScrollY = window.scrollY;
    };

    const resetReleaseSpring = () => {
      releaseURef.current = 0;
      releaseVelURef.current = 0;
    };

    const releaseSpringActive = () =>
      releaseURef.current > MOBILE_RELEASE_SPRING_SETTLE_EPSILON ||
      Math.abs(releaseVelURef.current) > MOBILE_RELEASE_SPRING_VEL_EPSILON;

    const clampMobileOpen = (u: number) =>
      Math.min(MOBILE_DIRECT_OPEN_MAX, Math.max(0, u));

    const currentOpenProgress = () =>
      clampMobileOpen(releaseURef.current + scrollOffsetURef.current);

    const applyOpenProgress = (openProgress: number) => {
      const { uFront, uAmber, uRear, uConn } =
        channelsFromOpenProgress(openProgress);
      applyP1Open(
        p1Targets(),
        MOBILE_P1_CONNECTORS,
        0.26,
        mobileStrokes.rear,
        uFront,
        uAmber,
        uRear,
        uConn,
      );
      if (svgRef.current) {
        svgRef.current.setAttribute("data-vl-u", openProgress.toFixed(3));
      }
    };

    const displayOpenProgress = () => {
      if (drag) {
        const hit = hitRef.current;
        const width = hit?.getBoundingClientRect().width ?? 280;
        const travel = Math.max(48, width * MOBILE_DRAG_WIDTH_FRACTION);
        const deltaU = (drag.originX - drag.startX) / travel;
        return clampMobileOpen(drag.startU + deltaU);
      }
      return currentOpenProgress();
    };

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.034, Math.max(0.001, (now - lastTickTime) / 1000));
      lastTickTime = now;

      if (!sectionVisibleRef.current) {
        resetScrollOpenNudge();
        resetReleaseSpring();
        resetPassByState();
      } else {
        updatePassBy();
      }

      if (drag == null && debugOpenProgressRef.current == null) {
        if (prefersReducedMotionRef.current) {
          if (releaseURef.current > 0) {
            releaseURef.current = 0;
            releaseVelURef.current = 0;
          }
        } else if (releaseSpringActive()) {
          const u = releaseURef.current;
          const vel = releaseVelURef.current;
          const accel =
            -MOBILE_RELEASE_SPRING_STIFFNESS * u -
            MOBILE_RELEASE_SPRING_DAMPING * vel;
          releaseVelURef.current = vel + accel * dt;
          releaseURef.current = clampMobileOpen(u + releaseVelURef.current * dt);
          if (releaseURef.current <= 0) {
            releaseURef.current = 0;
            releaseVelURef.current = 0;
          } else if (
            releaseURef.current < MOBILE_RELEASE_SPRING_SETTLE_EPSILON &&
            Math.abs(releaseVelURef.current) < MOBILE_RELEASE_SPRING_VEL_EPSILON
          ) {
            releaseURef.current = 0;
            releaseVelURef.current = 0;
          }
        }
      }

      const scrollAmbientActive =
        MOBILE_SCROLL_VELOCITY_NUDGE_ENABLED &&
        breakpointActiveRef.current &&
        sectionVisibleRef.current &&
        !prefersReducedMotionRef.current &&
        ambientEnabledRef.current &&
        drag == null &&
        !releaseSpringActive() &&
        debugOpenProgressRef.current == null;

      if (scrollAmbientActive) {
        scrollVelURef.current *= MOBILE_SCROLL_VEL_DAMP;
        scrollOffsetURef.current += scrollVelURef.current;
        scrollOffsetURef.current +=
          (0 - scrollOffsetURef.current) * MOBILE_SCROLL_RETURN_K;
        scrollOffsetURef.current = Math.min(
          MOBILE_SCROLL_OPEN_MAX,
          Math.max(0, scrollOffsetURef.current),
        );
        scrollVelURef.current = Math.min(
          MOBILE_SCROLL_VEL_CLAMP,
          Math.max(-MOBILE_SCROLL_VEL_CLAMP, scrollVelURef.current),
        );
      }

      const debugU = debugOpenProgressRef.current;
      const openProgress =
        debugU != null ? clampMobileOpen(debugU) : displayOpenProgress();

      applyOpenProgress(openProgress);
      raf = requestAnimationFrame(tick);
    };

    const onWindowScroll = () => {
      if (
        !breakpointActiveRef.current ||
        !sectionVisibleRef.current ||
        prefersReducedMotionRef.current ||
        drag != null ||
        releaseSpringActive() ||
        debugOpenProgressRef.current != null
      ) {
        lastScrollY = window.scrollY;
        return;
      }
      const y = window.scrollY;
      const dy = y - lastScrollY;
      lastScrollY = y;
      if (dy === 0) return;
      scrollVelURef.current += dy * MOBILE_SCROLL_IMPULSE_PER_PX;
      scrollVelURef.current = Math.min(
        MOBILE_SCROLL_VEL_CLAMP,
        Math.max(-MOBILE_SCROLL_VEL_CLAMP, scrollVelURef.current),
      );
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!breakpointActiveRef.current) return;
      if (debugOpenProgressRef.current != null) return;
      if (event.pointerType === "mouse") return;
      pending = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        totalDx: 0,
        totalDy: 0,
        abandoned: false,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (drag && drag.pointerId === event.pointerId) {
        event.preventDefault();
        drag.originX = event.clientX;
        return;
      }
      if (!pending || pending.abandoned || pending.pointerId !== event.pointerId) {
        return;
      }

      const dx = event.clientX - pending.startX;
      const dy = event.clientY - pending.startY;
      pending.totalDx = dx;
      pending.totalDy = dy;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx < MOBILE_GESTURE_DECISION_PX && absDy < MOBILE_GESTURE_DECISION_PX) {
        return;
      }

      if (absDy > absDx * MOBILE_VERTICAL_DOMINANCE) {
        pending.abandoned = true;
        pending = null;
        return;
      }

      if (absDx <= absDy * MOBILE_HORIZONTAL_DOMINANCE) {
        return;
      }

      const hit = hitRef.current;
      if (!hit) return;

      const startU = currentOpenProgress();
      resetScrollOpenNudge();
      resetReleaseSpring();
      passBySuppressAfterDrag = true;
      passByCanTrigger = false;

      drag = {
        pointerId: event.pointerId,
        originX: event.clientX,
        startX: event.clientX,
        startU,
      };
      pending = null;

      try {
        hit.setPointerCapture(event.pointerId);
      } catch {
        /* unsupported */
      }
      event.preventDefault();
    };

    const endDrag = (event: PointerEvent) => {
      if (pending && pending.pointerId === event.pointerId) {
        pending = null;
      }
      if (!drag || drag.pointerId !== event.pointerId) return;

      const hit = hitRef.current;
      const width = hit?.getBoundingClientRect().width ?? 280;
      const travel = Math.max(48, width * MOBILE_DRAG_WIDTH_FRACTION);
      const deltaU = (event.clientX - drag.startX) / travel;
      const releasedU = clampMobileOpen(drag.startU + deltaU);
      drag = null;
      resetScrollOpenNudge();
      passBySuppressAfterDrag = true;
      passByCanTrigger = false;

      if (prefersReducedMotionRef.current) {
        resetReleaseSpring();
      } else if (releasedU > MOBILE_RELEASE_SPRING_SETTLE_EPSILON) {
        releaseURef.current = releasedU;
        releaseVelURef.current = 0;
      } else {
        resetReleaseSpring();
      }

      try {
        hit?.releasePointerCapture(event.pointerId);
      } catch {
        /* unsupported */
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      endDrag(event);
    };

    const onPointerCancel = (event: PointerEvent) => {
      endDrag(event);
    };

    resetP1ClosedPose(
      p1Targets(),
      MOBILE_P1_CONNECTORS,
      0.26,
      mobileStrokes.rear,
      mobileFrontRest,
    );

    raf = requestAnimationFrame(tick);

    const mq = window.matchMedia(MOBILE_SCROLL_MQ);
    const syncMobileMq = () => {
      if (!mq.matches) {
        resetScrollOpenNudge();
        resetReleaseSpring();
        resetPassByState();
      }
    };
    syncMobileMq();
    mq.addEventListener("change", syncMobileMq);

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    const hit = hitRef.current;
    hit?.addEventListener("pointerdown", onPointerDown);
    hit?.addEventListener("pointermove", onPointerMove);
    hit?.addEventListener("pointerup", onPointerUp);
    hit?.addEventListener("pointercancel", onPointerCancel);

    return () => {
      if (raf != null) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onWindowScroll);
      mq.removeEventListener("change", syncMobileMq);
      hit?.removeEventListener("pointerdown", onPointerDown);
      hit?.removeEventListener("pointermove", onPointerMove);
      hit?.removeEventListener("pointerup", onPointerUp);
      hit?.removeEventListener("pointercancel", onPointerCancel);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {showVlDebug && process.env.NODE_ENV === "development" && (
        <div
          className="absolute bottom-0 left-0 z-30 flex gap-1 rounded bg-black/70 p-1 text-[10px] text-white"
          aria-hidden="true"
        >
          {([0, 0.5, 0.92] as const).map((u) => (
            <button
              key={u}
              type="button"
              className="rounded px-2 py-0.5 hover:bg-white/20"
              onClick={() => setDebugOpenProgress(u)}
            >
              u={u}
            </button>
          ))}
          <button
            type="button"
            className="rounded px-2 py-0.5 hover:bg-white/20"
            onClick={() => setDebugOpenProgress(null)}
          >
            live
          </button>
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox="0 0 360 320"
        fill="none"
        aria-hidden="true"
        shapeRendering="geometricPrecision"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        className="pointer-events-auto h-full w-full overflow-visible"
        data-vl-ambient={ambientEnabled ? "mobile" : "static"}
      >
        <defs>
          <clipPath id="mini-responsive-plane-mobile-front-clip">
            <polygon points="62,72 284,89 260,247 48,218" />
          </clipPath>
        </defs>
        <g
          ref={objectRef}
          pointerEvents="none"
          style={{
            transformBox: "view-box",
            transformOrigin: "180px 160px",
            willChange: ambientEnabled ? "transform" : undefined,
          }}
        >
          <g
            ref={mainGroupRef}
            style={{
              transform: "translate(1px, 0) rotate(-1deg)",
              transformBox: "view-box",
              transformOrigin: "180px 160px",
              willChange: "transform",
            }}
          >
            <g
              ref={rearRef}
              style={{
                transformBox: "view-box",
                transformOrigin: "180px 160px",
                willChange: ambientEnabled ? "transform" : undefined,
              }}
            >
              <g
                ref={rearPoseRef}
                style={{
                  transform: "translate(0, 0)",
                  transformBox: "view-box",
                  transformOrigin: "180px 160px",
                  willChange: "transform",
                }}
              >
                <polygon
                  ref={rearPolyRef}
                  points="76,84 306,106 280,256 62,230"
                  fill={MINI_OBJECT_FILL.rear}
                  stroke={mobileStrokes.rear}
                />
              </g>
            </g>
            <polygon
              ref={fillPolyRef}
              points="62,72 284,89 260,247 48,218"
              fill={MINI_OBJECT_FILL.side}
            />
            <g clipPath="url(#mini-responsive-plane-mobile-front-clip)">
              <path
                ref={fillInnerRef}
                d="M59.8041 94.9 L188.1 105.9 L183.7 139.5 L228.5 143.9 L214.936 240.8356 L48 218 Z"
                fill={MINI_OBJECT_FILL.inset}
                style={{ fillOpacity: 1 }}
              />
              <path
                ref={edgeStrokeRef}
                d="M59.8041 94.9 L188.1 105.9"
                fill="none"
                stroke="rgba(255,255,255,0.26)"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                style={{ strokeOpacity: 0.26 }}
              />
              <line
                x1="228.5"
                y1="143.9"
                x2="214.936"
                y2="240.8356"
                stroke="rgba(255,255,255,0.13)"
                strokeLinecap="butt"
              />
              <path
                ref={amberRef}
                d="M59.8041 94.9 L188.1 105.9 L183.7 139.5 L228.5 143.9"
                fill="none"
                stroke={mobileStrokes.amber}
                strokeWidth="1.45"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                style={{ opacity: AMBER.rest }}
              />
            </g>
            <polygon
              ref={frontRef}
              points="62,72 284,89 260,247 48,218"
              fill="none"
              stroke={mobileFrontRest}
            />
            <line
              x1="206.3"
              y1="83.1"
              x2="254.3"
              y2="86.8"
              stroke={mobileStrokes.amber}
              opacity="0.02"
            />
            <line
              ref={connTopRef}
              x1="284"
              y1="89"
              x2="306"
              y2="106"
              stroke="rgba(255,255,255,0.13)"
            />
            <line
              ref={connBotRef}
              x1="48"
              y1="218"
              x2="62"
              y2="230"
              stroke="rgba(255,255,255,0.13)"
            />
          </g>
        </g>
        <polygon
          ref={hitRef}
          points="36,52 312,72 330,102 310,272 34,242 18,214"
          fill="rgba(0,0,0,0.001)"
          stroke="none"
          pointerEvents="all"
          style={{ touchAction: "pan-y" }}
        />
      </svg>
    </div>
  );
}

export default function MiniResponsivePlane({
  className = "",
  variant = "desktop",
}: MiniResponsivePlaneProps) {
  const mobile = variant === "mobile";
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [motionPreferenceReady, setMotionPreferenceReady] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const [pageVisible, setPageVisible] = useState(true);
  const [breakpointActive, setBreakpointActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
      setMotionPreferenceReady(true);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    // Match Tailwind lg: — only the visible variant should run ambient RAF.
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setBreakpointActive(mobile ? !mq.matches : mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mobile]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Observe the section, not the absolute plane root — the graphic can
    // still intersect the viewport after the section content has scrolled away.
    const target =
      (el.closest("section") as HTMLElement | null) ?? el;

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setSectionVisible(
            !!entry?.isIntersecting && (entry.intersectionRatio ?? 0) > 0.15,
          );
        },
        { threshold: [0, 0.15, 0.35, 0.6, 1] },
      );
      io.observe(target);
    }

    const onVisibility = () => {
      setPageVisible(document.visibilityState === "visible");
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const ambientEnabled = motionPreferenceReady && !prefersReducedMotion;
  const ambientRunning =
    ambientEnabled && sectionVisible && pageVisible && breakpointActive;
  const interactive = !mobile && ambientEnabled;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className}
      data-vl-raf={ambientRunning ? "running" : "paused"}
    >
      {mobile ? (
        <MobilePlane
          ambientEnabled={ambientEnabled}
          ambientRunning={ambientRunning}
          sectionVisible={sectionVisible}
          prefersReducedMotion={prefersReducedMotion}
          breakpointActive={breakpointActive}
        />
      ) : (
        <DesktopPlane
          ambientEnabled={ambientEnabled}
          ambientRunning={ambientRunning}
          interactive={interactive}
        />
      )}
    </div>
  );
}
