"use client";

import { useEffect, useRef } from "react";

/**
 * Warm light embedded along the road's right-hand asphalt/gravel edge.
 *
 * GEOMETRY IS LOCKED. `ROAD_PATH_D` below is the single, approved master
 * curve and must never be edited, retraced, simplified or reinterpreted.
 * Everything in this file renders that exact same `d` string one or more
 * times — never a modified copy of it — so the visible geometry is always
 * pixel-identical to this one curve.
 *
 * RESPONSIVE COORDINATE FIX: this SVG uses the hero photo's own source
 * pixel space (4368x2912, the production road image dimensions)
 * as its viewBox, with `preserveAspectRatio="xMidYMid slice"` — the SVG
 * equivalent of the image's `object-fit: cover` / `object-position: center`.
 * Both the <img> and this <svg> fill the same absolutely-positioned box, so
 * with matching cover/slice behavior against the same source coordinate
 * space, the path stays pixel-locked to the same physical road edge at any
 * desktop viewport size — the browser recomputes the crop for both the
 * image and the SVG identically on every resize, instead of only being
 * correct at one specific container aspect ratio.
 *
 * The path geometry itself is unchanged from the older Illustrator master
 * path (`M1400 755 C1400 755 286 496 768 473 S1400 450 1400 450`, its `S`
 * expanded to an exact cubic), converted from the 1400x900 reference crop
 * it was authored against into this 4368x2912 source-image space via
 * `x = rx / scale`, `y = (ry + offsetY) / scale`, where `scale = 1400/4368`
 * and `offsetY = (2912 * scale - 900) / 2`. No re-tracing, no coordinate
 * reinterpretation.
 *
 * VISUAL TREATMENT PASS (this pass): perspective taper, refined glow and a
 * single continuous reveal — all layered purely as *rendering* on top of
 * the locked curve above, never by touching `ROAD_PATH_D`.
 *
 * - Taper: a plain SVG stroke can't vary width along its own length, so the
 *   taper is built from thin, non-overlapping "bands" that each render the
 *   exact same `ROAD_PATH_D`, using `pathLength` + `stroke-dasharray` /
 *   `stroke-dashoffset` to reveal only their own slice of that curve, each
 *   at a fixed stroke-width/opacity. Because every band shares the same `d`
 *   and `pathLength`, the visible line traces one continuous, pixel-exact
 *   copy of the master curve — only its thickness/opacity varies band to
 *   band, easing from stronger (foreground, path start) to finer (distance,
 *   path end) with a perspective-style curve (slow change near the viewer,
 *   faster falloff toward the vanishing point).
 * - Draw animation: instead of animating each band separately (which would
 *   risk visible per-band starts/stops), a single dedicated `<path>` with
 *   the same `d`/`pathLength` drives one continuous stroke-dashoffset sweep
 *   and is used as an SVG `<mask>` over the whole tapered stack. There is
 *   exactly one moving reveal front, regardless of how many bands make up
 *   the taper underneath it.
 *
 * SIGNAL-MOTION PASS: one small warm light point travels the locked curve,
 * reading position from the mask-reveal `<path>` via `getPointAtLength()`.
 *
 * MOTION-CHOREOGRAPHY PASS: the path draw is slower and more spatial; the
 * signal enters while the path is still being established, decelerates
 * into the main bend, then continues and fades. Repeats are signal-only.
 *
 * MOTION SYSTEM: deterministic intro (path draw → pause → scenario A
 * cascade), then weighted A/B/C signal scenarios on the already-drawn
 * path. Scenario definitions, weights, draw timing and reduced-motion
 * behavior are locked.
 *
 * LIFECYCLE PASS: the path is a finite signature event, not a permanent
 * overlay. First mount waits on a clean hero, draws, plays intro A plus
 * two additional signal scenarios, holds, retracts, and rests. Scroll-away
 * cancels to a clean hidden state. Return re-arms a shorter one-scenario
 * cycle. Reduced motion is unchanged (full static path, no timers).
 *
 * MOBILE: same geometry, cover/slice mapping and champagne family, with a
 * quieter band/signal treatment and a shorter first cycle (A plus one
 * extra B or C). Desktop constants, timing and band opacities stay locked.
 *
 * PRODUCTION LOCK: champagne / desaturated-gold path (`#C8B48C`) with a
 * slightly hotter signal (`#E0CC96`). CTA `#FCAC33` remains the only
 * strong orange accent.
 */
const ROAD_PATH_D =
  "M4368,2407.6 C4368,2407.6 892.32,1599.52 2396.16,1527.76 C3900,1456 4368,1456 4368,1456";

/** Normalized path length via the SVG `pathLength` attribute — every path
 * element below reports this same length regardless of its true geometric
 * length, so dash math is simple round numbers independent of the curve's
 * actual size. */
const PATH_LENGTH = 1000;

/** Extra dash offset beyond `PATH_LENGTH` so the reveal-mask stroke is
 * fully off the curve at rest. A dashoffset of exactly `PATH_LENGTH` with
 * `stroke-linecap: round` still painted a cap blob at the foreground
 * endpoint (half of the mask's 90px stroke) — the visible fragment before
 * the draw started. The mask now uses `butt` and this extra offset. */
const DASH_HIDDEN = PATH_LENGTH + 24;

const BAND_COUNT = 14;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type Band = {
  start: number;
  length: number;
  coreWidth: number;
  coreOpacity: number;
  glowWidth: number;
  glowOpacity: number;
};

const BANDS: Band[] = Array.from({ length: BAND_COUNT }, (_, i) => {
  const t0 = i / BAND_COUNT;
  const t1 = (i + 1) / BAND_COUNT;
  const tMid = (t0 + t1) / 2;

  // Perspective easing: a constant-width edge narrows slowly close to the
  // viewer and increasingly fast as it recedes, so width/opacity change
  // with tMid raised to a power > 1 rather than linearly.
  const widthT = Math.pow(tMid, 1.3);
  const glowFadeT = Math.pow(tMid, 1.7);

  return {
    start: t0 * PATH_LENGTH,
    length: (t1 - t0) * PATH_LENGTH,
    coreWidth: lerp(7.2, 2.0, widthT),
    coreOpacity: lerp(0.78, 0.5, Math.pow(tMid, 1.1)),
    glowWidth: lerp(30, 7, widthT),
    glowOpacity: lerp(0.24, 0.035, glowFadeT),
  };
});

/** Small warm light points. Sizes are in the same 4368x2912 source-image
 * space as everything else in this file, using the same ~3.12x scale
 * factor already established for the static line's stroke widths, so a
 * "3-5px apparent" primary core at typical desktop widths becomes a
 * user-space radius here. */
const SIGNAL_CORE_RADIUS = 6.2;
const SIGNAL_GLOW_RADIUS = 20;
const SIGNAL_GLOW_OPACITY = 0.32;
const SIGNAL_CORE_OPACITY = 0.92;
const PATH_COLOR = "#C8B48C";
const SIGNAL_CORE_COLOR = "#E0CC96";
const SIGNAL_GLOW_COLOR = "#E0CC96";

const SECONDARY_1 = {
  coreRadius: SIGNAL_CORE_RADIUS * 0.7,
  glowRadius: SIGNAL_GLOW_RADIUS * 0.7,
  glowOpacity: SIGNAL_GLOW_OPACITY * 0.65,
  coreOpacity: 0.74,
  gap: 0.015,
};

const SECONDARY_2 = {
  coreRadius: SIGNAL_CORE_RADIUS * 0.55,
  glowRadius: SIGNAL_GLOW_RADIUS * 0.55,
  glowOpacity: SIGNAL_GLOW_OPACITY * 0.5,
  coreOpacity: 0.62,
  gap: 0.029,
};

/** Tightest curvature of the locked curve sits at ~0.514 along its arc;
 * the pause is a few points *after* that apex so the signal has visibly
 * taken the turn before it thinks. */
const FRAC_SLOWDOWN_START = 0.4;
const FRAC_PAUSE = 0.555;
const FRAC_NUDGE_END = 0.578;
const FRAC_FADE_OUT_START = 0.86;

const DRAW_MS = 2300;
const POST_DRAW_PAUSE_MS = 300;
const APPROACH_MS = 750;
const SLOWDOWN_MS = 350;
const PAUSE_MS = 560;
const PAUSE_C_MS = 280;
const NUDGE_MS = 160;
const EXIT_MS = 780;
const SOLO_SLOWDOWN_MS = 470;

const HOLD_MS = 180;
const SEC_FADE_MS = 120;
const SEC2_IN_STAGGER_MS = 100;
const FOLLOW_STAGGER_MS = 100;
const FOLLOW_CATCHUP_MS = 80;
const PRIMARY_GLOW_LIFT = 0.05;
const SIGNAL_FADE_IN_MS = 220;
const LEAVE_FADE_MS = 260;
const IDLE_MIN_MS = 8000;
const IDLE_MAX_MS = 11000;

const INITIAL_CLEAN_DELAY_MS = 2000;
const RETURN_CLEAN_DELAY_MS = 850;
const PRE_RETRACT_HOLD_MS = 850;
const RETRACT_MS = 1400;
const RETRACT_EASING = "cubic-bezier(0.37, 0, 0.63, 1)";
const DRAW_EASING = "cubic-bezier(0.37, 0, 0.63, 1)";
const FIRST_EXTRA_SCENARIOS = 2;
const MOBILE_EXTRA_SCENARIOS = 1;
const MOBILE_IDLE_MIN_MS = 5500;
const MOBILE_IDLE_MAX_MS = 7500;
const MOBILE_CORE_PRESENCE = 0.85;
const MOBILE_GLOW_PRESENCE = 0.68;
const MOBILE_SIGNAL_CORE_PRESENCE = 0.86;
const MOBILE_SIGNAL_GLOW_PRESENCE = 0.68;
const MOBILE_MQ = "(max-width: 1023px)";

const MOBILE_BANDS: Band[] = BANDS.map((band) => ({
  ...band,
  coreOpacity: band.coreOpacity * MOBILE_CORE_PRESENCE,
  glowOpacity: band.glowOpacity * MOBILE_GLOW_PRESENCE,
}));

type Phase =
  | "clean"
  | "initialDelay"
  | "drawing"
  | "signalActive"
  | "idleBetweenScenarios"
  | "preRetractHold"
  | "retracting"
  | "resting"
  | "inactive";

type Scenario = "A" | "B" | "C";

const SCENARIO_WEIGHTS: { id: Scenario; w: number }[] = [
  { id: "A", w: 45 },
  { id: "B", w: 35 },
  { id: "C", w: 20 },
];

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

function easeInCubic(t: number) {
  return t * t * t;
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function appearEase(elapsed: number, start: number) {
  return easeOutCubic(clamp01((elapsed - start) / SEC_FADE_MS));
}

function fadeOutForFrac(frac: number) {
  if (frac <= FRAC_FADE_OUT_START) return 1;
  return clamp01((1 - frac) / (1 - FRAC_FADE_OUT_START));
}

function exitBlend(t: number) {
  return mix(FRAC_NUDGE_END, 1, easeInCubic(t) * 0.35 + easeInOutCubic(t) * 0.65);
}

/** Scenario A / intro — existing pickup cascade path. */
function fractionA(elapsed: number) {
  if (elapsed <= APPROACH_MS) {
    return mix(0, FRAC_SLOWDOWN_START, easeOutCubic(elapsed / APPROACH_MS));
  }
  if (elapsed <= APPROACH_MS + SLOWDOWN_MS) {
    return mix(FRAC_SLOWDOWN_START, FRAC_PAUSE, easeInOutCubic((elapsed - APPROACH_MS) / SLOWDOWN_MS));
  }
  if (elapsed <= APPROACH_MS + SLOWDOWN_MS + PAUSE_MS) {
    return FRAC_PAUSE;
  }
  if (elapsed <= APPROACH_MS + SLOWDOWN_MS + PAUSE_MS + NUDGE_MS) {
    const t = (elapsed - APPROACH_MS - SLOWDOWN_MS - PAUSE_MS) / NUDGE_MS;
    return mix(FRAC_PAUSE, FRAC_NUDGE_END, easeOutQuad(t));
  }
  const t = clamp01((elapsed - APPROACH_MS - SLOWDOWN_MS - PAUSE_MS - NUDGE_MS) / EXIT_MS);
  return exitBlend(t);
}

/** Scenario B — no hold, gentler slow through the bend, then out. */
function fractionB(elapsed: number) {
  if (elapsed <= APPROACH_MS) {
    return mix(0, FRAC_SLOWDOWN_START, easeOutCubic(elapsed / APPROACH_MS));
  }
  if (elapsed <= APPROACH_MS + SOLO_SLOWDOWN_MS) {
    return mix(
      FRAC_SLOWDOWN_START,
      FRAC_NUDGE_END,
      easeInOutCubic((elapsed - APPROACH_MS) / SOLO_SLOWDOWN_MS),
    );
  }
  const t = clamp01((elapsed - APPROACH_MS - SOLO_SLOWDOWN_MS) / EXIT_MS);
  return exitBlend(t);
}

/** Scenario C — group travels to a shorter decision hold, then primary exits. */
function fractionC(elapsed: number) {
  if (elapsed <= APPROACH_MS) {
    return mix(0, FRAC_SLOWDOWN_START, easeOutCubic(elapsed / APPROACH_MS));
  }
  if (elapsed <= APPROACH_MS + SLOWDOWN_MS) {
    return mix(FRAC_SLOWDOWN_START, FRAC_PAUSE, easeInOutCubic((elapsed - APPROACH_MS) / SLOWDOWN_MS));
  }
  if (elapsed <= APPROACH_MS + SLOWDOWN_MS + PAUSE_C_MS) {
    return FRAC_PAUSE;
  }
  if (elapsed <= APPROACH_MS + SLOWDOWN_MS + PAUSE_C_MS + NUDGE_MS) {
    const t = (elapsed - APPROACH_MS - SLOWDOWN_MS - PAUSE_C_MS) / NUDGE_MS;
    return mix(FRAC_PAUSE, FRAC_NUDGE_END, easeOutQuad(t));
  }
  const t = clamp01((elapsed - APPROACH_MS - SLOWDOWN_MS - PAUSE_C_MS - NUDGE_MS) / EXIT_MS);
  return exitBlend(t);
}

function scenarioDuration(kind: Scenario) {
  if (kind === "B") return APPROACH_MS + SOLO_SLOWDOWN_MS + EXIT_MS + 80;
  if (kind === "C") return APPROACH_MS + SLOWDOWN_MS + PAUSE_C_MS + NUDGE_MS + EXIT_MS + 80;
  return APPROACH_MS + SLOWDOWN_MS + PAUSE_MS + NUDGE_MS + EXIT_MS + FOLLOW_STAGGER_MS * 2 + 80;
}

function pickScenario(previous: Scenario | null): Scenario {
  const options = SCENARIO_WEIGHTS.filter((o) => o.id !== previous);
  const total = options.reduce((s, o) => s + o.w, 0);
  let r = Math.random() * total;
  for (const o of options) {
    r -= o.w;
    if (r <= 0) return o.id;
  }
  return options[0].id;
}

function idleWait(mobile: boolean) {
  if (mobile) return MOBILE_IDLE_MIN_MS + Math.random() * (MOBILE_IDLE_MAX_MS - MOBILE_IDLE_MIN_MS);
  return IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS);
}

type SignalEls = {
  group: SVGGElement;
  core: SVGCircleElement;
  glow: SVGCircleElement;
};

export default function HeroRoadPath() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const revealPathRef = useRef<SVGPathElement | null>(null);
  const primaryGroupRef = useRef<SVGGElement | null>(null);
  const primaryCoreRef = useRef<SVGCircleElement | null>(null);
  const primaryGlowRef = useRef<SVGCircleElement | null>(null);
  const sec1GroupRef = useRef<SVGGElement | null>(null);
  const sec1CoreRef = useRef<SVGCircleElement | null>(null);
  const sec1GlowRef = useRef<SVGCircleElement | null>(null);
  const sec2GroupRef = useRef<SVGGElement | null>(null);
  const sec2CoreRef = useRef<SVGCircleElement | null>(null);
  const sec2GlowRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const revealPathEl = revealPathRef.current;
    const svg = svgRef.current;
    if (!revealPathEl || !svg) return;

    revealPathEl.style.animation = "none";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealPathEl.style.strokeDashoffset = "0";
      return;
    }

    const primaryGroup = primaryGroupRef.current;
    const primaryCore = primaryCoreRef.current;
    const primaryGlow = primaryGlowRef.current;
    const sec1Group = sec1GroupRef.current;
    const sec1Core = sec1CoreRef.current;
    const sec1Glow = sec1GlowRef.current;
    const sec2Group = sec2GroupRef.current;
    const sec2Core = sec2CoreRef.current;
    const sec2Glow = sec2GlowRef.current;
    if (
      !primaryGroup ||
      !primaryCore ||
      !primaryGlow ||
      !sec1Group ||
      !sec1Core ||
      !sec1Glow ||
      !sec2Group ||
      !sec2Core ||
      !sec2Glow
    ) {
      return;
    }

    const revealPath = revealPathEl;
    const primary: SignalEls = { group: primaryGroup, core: primaryCore, glow: primaryGlow };
    const sec1: SignalEls = { group: sec1Group, core: sec1Core, glow: sec1Glow };
    const sec2: SignalEls = { group: sec2Group, core: sec2Core, glow: sec2Glow };

    let cancelled = false;
    let rafId: number | null = null;
    const timeouts = new Set<ReturnType<typeof setTimeout>>();
    let drawAnim: Animation | null = null;
    let retractAnim: Animation | null = null;
    let phase: Phase = "clean";
    svg.setAttribute("data-hero-path-phase", "clean");
    let hasPlayedCycle = false;
    let visible = true;
    let lastScenario: Scenario | null = null;
    let activeKind: Scenario | null = null;
    let scenariosRemaining = 0;
    let scenarioStart = 0;
    let fading = false;
    let fadeStart = 0;
    const fadeFrom = [0, 0, 0];
    const isMobile = window.matchMedia(MOBILE_MQ).matches;
    const extraScenarios = isMobile ? MOBILE_EXTRA_SCENARIOS : FIRST_EXTRA_SCENARIOS;
    const glowOp = isMobile ? SIGNAL_GLOW_OPACITY * MOBILE_SIGNAL_GLOW_PRESENCE : SIGNAL_GLOW_OPACITY;
    const glowLift = isMobile ? PRIMARY_GLOW_LIFT * MOBILE_SIGNAL_GLOW_PRESENCE : PRIMARY_GLOW_LIFT;
    const sec1GlowOp = isMobile
      ? SECONDARY_1.glowOpacity * MOBILE_SIGNAL_GLOW_PRESENCE
      : SECONDARY_1.glowOpacity;
    const sec2GlowOp = isMobile
      ? SECONDARY_2.glowOpacity * MOBILE_SIGNAL_GLOW_PRESENCE
      : SECONDARY_2.glowOpacity;
    const coreOp = isMobile ? SIGNAL_CORE_OPACITY * MOBILE_SIGNAL_CORE_PRESENCE : SIGNAL_CORE_OPACITY;

    primary.core.setAttribute("opacity", String(coreOp));
    sec1.core.setAttribute("opacity", String(SECONDARY_1.coreOpacity * (isMobile ? MOBILE_SIGNAL_CORE_PRESENCE : 1)));
    sec2.core.setAttribute("opacity", String(SECONDARY_2.coreOpacity * (isMobile ? MOBILE_SIGNAL_CORE_PRESENCE : 1)));
    primary.glow.setAttribute("opacity", String(glowOp));
    sec1.glow.setAttribute("opacity", String(sec1GlowOp));
    sec2.glow.setAttribute("opacity", String(sec2GlowOp));

    const totalLength = revealPath.getTotalLength();
    const pauseEndA = APPROACH_MS + SLOWDOWN_MS + PAUSE_MS;
    const pauseEndC = APPROACH_MS + SLOWDOWN_MS + PAUSE_C_MS;

    function setPhase(next: Phase) {
      phase = next;
      svg?.setAttribute("data-hero-path-phase", next);
    }

    function later(fn: () => void, ms: number) {
      const id = setTimeout(() => {
        timeouts.delete(id);
        fn();
      }, ms);
      timeouts.add(id);
    }

    function clearTimers() {
      for (const id of timeouts) clearTimeout(id);
      timeouts.clear();
    }

    function stopRaf() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function setDash(offset: number) {
      revealPath.style.strokeDashoffset = String(offset);
    }

    function cancelPathAnims() {
      drawAnim = null;
      retractAnim = null;
      for (const anim of revealPath.getAnimations()) {
        anim.cancel();
      }
    }

    function hidePathImmediate() {
      cancelPathAnims();
      setDash(DASH_HIDDEN);
    }

    function revealedFraction() {
      const offset = parseFloat(getComputedStyle(revealPath).strokeDashoffset);
      if (!Number.isFinite(offset)) return 1;
      return clamp01(1 - offset / PATH_LENGTH);
    }

    function place(signal: SignalEls, frac: number) {
      const point = revealPath.getPointAtLength(clamp01(frac) * totalLength);
      signal.core.setAttribute("cx", String(point.x));
      signal.core.setAttribute("cy", String(point.y));
      signal.glow.setAttribute("cx", String(point.x));
      signal.glow.setAttribute("cy", String(point.y));
    }

    function hideAll() {
      primary.group.setAttribute("opacity", "0");
      sec1.group.setAttribute("opacity", "0");
      sec2.group.setAttribute("opacity", "0");
      primary.glow.setAttribute("opacity", String(glowOp));
      primary.core.setAttribute("r", String(SIGNAL_CORE_RADIUS));
      sec1.core.setAttribute("r", String(SECONDARY_1.coreRadius));
      sec2.core.setAttribute("r", String(SECONDARY_2.coreRadius));
    }

    function readOpacity(signal: SignalEls) {
      return parseFloat(signal.group.getAttribute("opacity") || "0") || 0;
    }

    function followerA(elapsed: number, primaryFrac: number, gap: number, delay: number) {
      const rest = FRAC_PAUSE - gap;
      if (elapsed < pauseEndA + delay) return rest;
      const follow = Math.max(0, primaryFrac - gap);
      const u = easeOutCubic(clamp01((elapsed - pauseEndA - delay) / FOLLOW_CATCHUP_MS));
      return mix(rest, follow, u);
    }

    function renderScenario(kind: Scenario, elapsed: number) {
      let primaryFrac: number;
      let sec1Frac: number;
      let sec2Frac: number;
      let pOp: number;
      let s1Op: number;
      let s2Op: number;

      if (kind === "B") {
        primaryFrac = Math.min(fractionB(elapsed), Math.max(0, revealedFraction() - 0.012));
        place(primary, primaryFrac);
        pOp = elapsed < SIGNAL_FADE_IN_MS ? elapsed / SIGNAL_FADE_IN_MS : fadeOutForFrac(primaryFrac);
        primary.group.setAttribute("opacity", String(pOp));
        primary.glow.setAttribute("opacity", String(glowOp));
        sec1.group.setAttribute("opacity", "0");
        sec2.group.setAttribute("opacity", "0");
        return;
      }

      if (kind === "C") {
        primaryFrac = Math.min(fractionC(elapsed), Math.max(0, revealedFraction() - 0.012));
        sec1Frac = Math.max(0, primaryFrac - SECONDARY_1.gap);
        sec2Frac = Math.max(0, primaryFrac - SECONDARY_2.gap);
        if (elapsed >= pauseEndC) {
          sec1Frac = FRAC_PAUSE - SECONDARY_1.gap;
          sec2Frac = FRAC_PAUSE - SECONDARY_2.gap;
        }
        place(primary, primaryFrac);
        place(sec1, sec1Frac);
        place(sec2, sec2Frac);
        pOp = elapsed < SIGNAL_FADE_IN_MS ? elapsed / SIGNAL_FADE_IN_MS : fadeOutForFrac(primaryFrac);
        primary.group.setAttribute("opacity", String(pOp));
        const groupIn = clamp01(elapsed / SIGNAL_FADE_IN_MS);
        const drop = elapsed < pauseEndC - 40 ? 1 : 1 - clamp01((elapsed - (pauseEndC - 40)) / 220);
        s1Op = groupIn * drop;
        s2Op = groupIn * drop;
        sec1.group.setAttribute("opacity", String(s1Op));
        sec2.group.setAttribute("opacity", String(s2Op));
        primary.glow.setAttribute("opacity", String(glowOp));
        return;
      }

      primaryFrac = Math.min(fractionA(elapsed), Math.max(0, revealedFraction() - 0.012));
      sec1Frac = followerA(elapsed, primaryFrac, SECONDARY_1.gap, FOLLOW_STAGGER_MS);
      sec2Frac = followerA(elapsed, primaryFrac, SECONDARY_2.gap, FOLLOW_STAGGER_MS * 2);
      place(primary, primaryFrac);
      place(sec1, sec1Frac);
      place(sec2, sec2Frac);
      pOp = elapsed < SIGNAL_FADE_IN_MS ? elapsed / SIGNAL_FADE_IN_MS : fadeOutForFrac(primaryFrac);
      primary.group.setAttribute("opacity", String(pOp));
      const pauseStart = APPROACH_MS + SLOWDOWN_MS;
      const activating = elapsed >= pauseStart + HOLD_MS && elapsed < pauseEndA;
      primary.glow.setAttribute(
        "opacity",
        String(glowOp + (activating ? glowLift : 0)),
      );
      const sec1Appear = appearEase(elapsed, pauseStart + HOLD_MS);
      const sec2Appear = appearEase(elapsed, pauseStart + HOLD_MS + SEC2_IN_STAGGER_MS);
      sec1.core.setAttribute("r", String(SECONDARY_1.coreRadius * mix(0.7, 1, sec1Appear)));
      sec2.core.setAttribute("r", String(SECONDARY_2.coreRadius * mix(0.7, 1, sec2Appear)));
      sec1.group.setAttribute("opacity", String(sec1Appear * fadeOutForFrac(sec1Frac)));
      sec2.group.setAttribute("opacity", String(sec2Appear * fadeOutForFrac(sec2Frac)));
    }

    function frame(now: number) {
      if (cancelled) return;

      if (fading) {
        const u = clamp01((now - fadeStart) / LEAVE_FADE_MS);
        const k = 1 - easeOutCubic(u);
        primary.group.setAttribute("opacity", String(fadeFrom[0] * k));
        sec1.group.setAttribute("opacity", String(fadeFrom[1] * k));
        sec2.group.setAttribute("opacity", String(fadeFrom[2] * k));
        if (u >= 1) {
          hideAll();
          fading = false;
          activeKind = null;
          stopRaf();
          return;
        }
        rafId = requestAnimationFrame(frame);
        return;
      }

      if (!activeKind) {
        stopRaf();
        return;
      }

      const elapsed = now - scenarioStart;
      renderScenario(activeKind, elapsed);
      if (elapsed >= scenarioDuration(activeKind)) {
        hideAll();
        place(primary, 0);
        place(sec1, 0);
        place(sec2, 0);
        activeKind = null;
        stopRaf();
        onScenarioComplete();
        return;
      }
      rafId = requestAnimationFrame(frame);
    }

    function beginFadeOut() {
      fading = true;
      fadeStart = performance.now();
      fadeFrom[0] = readOpacity(primary);
      fadeFrom[1] = readOpacity(sec1);
      fadeFrom[2] = readOpacity(sec2);
      activeKind = null;
      if (rafId === null) rafId = requestAnimationFrame(frame);
    }

    function startScenario(kind: Scenario) {
      if (cancelled || !visible) return;
      hideAll();
      place(primary, 0);
      place(sec1, 0);
      place(sec2, 0);
      lastScenario = kind;
      activeKind = kind;
      fading = false;
      setPhase("signalActive");
      scenarioStart = performance.now();
      if (rafId === null) rafId = requestAnimationFrame(frame);
    }

    function onScenarioComplete() {
      if (cancelled || !visible) return;
      if (scenariosRemaining > 0) {
        scenariosRemaining -= 1;
        setPhase("idleBetweenScenarios");
        later(() => {
          if (cancelled || !visible) return;
          startScenario(pickScenario(lastScenario));
        }, idleWait(isMobile));
        return;
      }
      setPhase("preRetractHold");
      later(() => {
        if (cancelled || !visible) return;
        beginRetract();
      }, PRE_RETRACT_HOLD_MS);
    }

    function playDraw(onDone: () => void) {
      if (cancelled || !visible) return;
      cancelPathAnims();
      setDash(DASH_HIDDEN);
      setPhase("drawing");
      hasPlayedCycle = true;
      drawAnim = revealPath.animate(
        [{ strokeDashoffset: `${DASH_HIDDEN}px` }, { strokeDashoffset: "0px" }],
        {
          duration: DRAW_MS,
          easing: DRAW_EASING,
          fill: "forwards",
        },
      );
      drawAnim.addEventListener("finish", () => {
        if (cancelled) return;
        const anim = drawAnim;
        try {
          anim?.commitStyles();
        } catch {
          setDash(0);
        }
        anim?.cancel();
        drawAnim = null;
        setDash(0);
        if (!visible) return;
        onDone();
      });
    }

    function beginRetract() {
      if (cancelled || !visible) return;
      hideAll();
      activeKind = null;
      fading = false;
      stopRaf();
      setPhase("retracting");
      const current = parseFloat(getComputedStyle(revealPath).strokeDashoffset);
      const from = Number.isFinite(current) ? current : 0;
      setDash(from);
      cancelPathAnims();
      setDash(from);
      retractAnim = revealPath.animate(
        [{ strokeDashoffset: `${from}px` }, { strokeDashoffset: `${DASH_HIDDEN}px` }],
        {
          duration: RETRACT_MS,
          easing: RETRACT_EASING,
          fill: "forwards",
        },
      );
      retractAnim.addEventListener("finish", () => {
        if (cancelled) return;
        const anim = retractAnim;
        try {
          anim?.commitStyles();
        } catch {
          setDash(DASH_HIDDEN);
        }
        anim?.cancel();
        retractAnim = null;
        setDash(DASH_HIDDEN);
        hideAll();
        setPhase(visible ? "resting" : "inactive");
      });
    }

    function afterDrawPause(startKind: Scenario, extrasAfter: number) {
      later(() => {
        if (cancelled || !visible) return;
        scenariosRemaining = extrasAfter;
        startScenario(startKind);
      }, POST_DRAW_PAUSE_MS);
    }

    function startFirstLifecycle() {
      if (cancelled || !visible) return;
      if (phase !== "clean" && phase !== "inactive") return;
      hidePathImmediate();
      hideAll();
      setPhase("initialDelay");
      later(() => {
        if (cancelled || !visible) return;
        playDraw(() => afterDrawPause("A", extraScenarios));
      }, INITIAL_CLEAN_DELAY_MS);
    }

    function startReturnLifecycle() {
      if (cancelled || !visible) return;
      if (phase !== "inactive") return;
      fading = false;
      hidePathImmediate();
      hideAll();
      stopRaf();
      setPhase("initialDelay");
      later(() => {
        if (cancelled || !visible) return;
        playDraw(() => afterDrawPause(pickScenario(lastScenario), 0));
      }, RETURN_CLEAN_DELAY_MS);
    }

    function onLeave() {
      visible = false;
      clearTimers();
      if (phase !== "clean" && phase !== "initialDelay") {
        hasPlayedCycle = true;
      }
      const shouldFade = Boolean(activeKind || fading || readOpacity(primary) > 0.01);
      activeKind = null;
      hidePathImmediate();
      setPhase("inactive");
      if (shouldFade) {
        beginFadeOut();
      } else {
        fading = false;
        hideAll();
        stopRaf();
      }
    }

    function onEnter() {
      if (cancelled) return;
      visible = true;
      if (phase === "resting") return;
      if (phase !== "clean" && phase !== "inactive") return;
      if (hasPlayedCycle) startReturnLifecycle();
      else startFirstLifecycle();
    }

    const host = svg.closest("[data-hero-edge-hero]") ?? svg;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) onEnter();
        else onLeave();
      },
      { threshold: 0.28 },
    );
    io.observe(host);
    const hostRect = host.getBoundingClientRect();
    if (hostRect.bottom > 80 && hostRect.top < window.innerHeight - 80) {
      onEnter();
    }

    return () => {
      cancelled = true;
      io.disconnect();
      clearTimers();
      stopRaf();
      cancelPathAnims();
    };
  }, []);


  return (
    <>
      <style>{`
        .bauma-hero-road-reveal {
          animation: none !important;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1024;
        }
        @media (prefers-reduced-motion: reduce) {
          .bauma-hero-road-reveal {
            stroke-dashoffset: 0;
          }
        }
        .hero-road-bands-desktop {
          display: none;
        }
        @media (min-width: 1024px) {
          .hero-road-bands-mobile {
            display: none;
          }
          .hero-road-bands-desktop {
            display: inline;
          }
        }
      `}</style>
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      data-hero-path-phase="clean"
      viewBox="0 0 4368 2912"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="hero-road-path-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5.5" />
        </filter>

        <filter id="hero-road-signal-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>

        {/* Single continuous reveal front — drives visibility for the whole
            tapered stack below via luminance masking, so the draw always
            reads as one sweep no matter how many bands render the taper.
            Its exact `d` also doubles as the motion source for the
            traveling signals below (via ref + getPointAtLength), so they
            stay position-locked to the approved curve. */}
        <mask
          id="hero-road-reveal-mask"
          maskUnits="objectBoundingBox"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <path
            ref={revealPathRef}
            className="bauma-hero-road-reveal"
            d={ROAD_PATH_D}
            pathLength={PATH_LENGTH}
            fill="none"
            stroke="#fff"
            strokeLinecap="butt"
            strokeWidth={90}
            strokeDasharray={PATH_LENGTH}
            strokeDashoffset={DASH_HIDDEN}
            style={{ animation: "none" }}
          />
        </mask>
      </defs>

      <g className="hero-road-bands-mobile" mask="url(#hero-road-reveal-mask)">
        {MOBILE_BANDS.map((band, i) => (
          <path
            key={`glow-m-${i}`}
            d={ROAD_PATH_D}
            pathLength={PATH_LENGTH}
            fill="none"
            stroke={PATH_COLOR}
            strokeLinecap="round"
            strokeWidth={band.glowWidth}
            opacity={band.glowOpacity}
            strokeDasharray={`${band.length} ${PATH_LENGTH - band.length}`}
            strokeDashoffset={-band.start}
            filter="url(#hero-road-path-glow)"
          />
        ))}

        {MOBILE_BANDS.map((band, i) => (
          <path
            key={`core-m-${i}`}
            d={ROAD_PATH_D}
            pathLength={PATH_LENGTH}
            fill="none"
            stroke={PATH_COLOR}
            strokeLinecap="round"
            strokeWidth={band.coreWidth}
            opacity={band.coreOpacity}
            strokeDasharray={`${band.length} ${PATH_LENGTH - band.length}`}
            strokeDashoffset={-band.start}
          />
        ))}
      </g>

      <g className="hero-road-bands-desktop" mask="url(#hero-road-reveal-mask)">
        {BANDS.map((band, i) => (
          <path
            key={`glow-${i}`}
            d={ROAD_PATH_D}
            pathLength={PATH_LENGTH}
            fill="none"
            stroke={PATH_COLOR}
            strokeLinecap="round"
            strokeWidth={band.glowWidth}
            opacity={band.glowOpacity}
            strokeDasharray={`${band.length} ${PATH_LENGTH - band.length}`}
            strokeDashoffset={-band.start}
            filter="url(#hero-road-path-glow)"
          />
        ))}

        {BANDS.map((band, i) => (
          <path
            key={`core-${i}`}
            d={ROAD_PATH_D}
            pathLength={PATH_LENGTH}
            fill="none"
            stroke={PATH_COLOR}
            strokeLinecap="round"
            strokeWidth={band.coreWidth}
            opacity={band.coreOpacity}
            strokeDasharray={`${band.length} ${PATH_LENGTH - band.length}`}
            strokeDashoffset={-band.start}
          />
        ))}
      </g>

      {/* Primary + two secondary lights. Outside the reveal mask so glow
          is not clipped. Positions are read from ROAD_PATH_D; secondaries
          stay a fixed arc-gap behind the primary after they are released. */}
      <g ref={primaryGroupRef} opacity={0}>
        <circle
          ref={primaryGlowRef}
          r={SIGNAL_GLOW_RADIUS}
          fill={SIGNAL_GLOW_COLOR}
          opacity={SIGNAL_GLOW_OPACITY}
          filter="url(#hero-road-signal-glow)"
        />
        <circle
          ref={primaryCoreRef}
          r={SIGNAL_CORE_RADIUS}
          fill={SIGNAL_CORE_COLOR}
          opacity={SIGNAL_CORE_OPACITY}
        />
      </g>
      <g ref={sec1GroupRef} opacity={0}>
        <circle
          ref={sec1GlowRef}
          r={SECONDARY_1.glowRadius}
          fill={SIGNAL_GLOW_COLOR}
          opacity={SECONDARY_1.glowOpacity}
          filter="url(#hero-road-signal-glow)"
        />
        <circle
          ref={sec1CoreRef}
          r={SECONDARY_1.coreRadius}
          fill={SIGNAL_CORE_COLOR}
          opacity={SECONDARY_1.coreOpacity}
        />
      </g>
      <g ref={sec2GroupRef} opacity={0}>
        <circle
          ref={sec2GlowRef}
          r={SECONDARY_2.glowRadius}
          fill={SIGNAL_GLOW_COLOR}
          opacity={SECONDARY_2.glowOpacity}
          filter="url(#hero-road-signal-glow)"
        />
        <circle
          ref={sec2CoreRef}
          r={SECONDARY_2.coreRadius}
          fill={SIGNAL_CORE_COLOR}
          opacity={SECONDARY_2.coreOpacity}
        />
      </g>
    </svg>
    </>
  );
}
