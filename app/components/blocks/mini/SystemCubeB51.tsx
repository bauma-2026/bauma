"use client";

import { useEffect, useId, useRef } from "react";

import { BASE_PITCH, BASE_YAW, VIEWBOX } from "./systemCubeGeometry";
import {
  applyScrollImpulse,
  createScrollNudge,
  followToward,
  pocketFollowTarget,
  pocketHoverFollowK,
  pointerNormFromRect,
  resetScrollNudge,
  scrollNudgeQuiet,
  tickScrollNudge,
} from "@/lib/pocketSpatialMotion";

import {
  buildScene,
  FULL_INTERIOR_FILL_KEYS,
  FULL_INTERIOR_PRIM_KEYS,
  FULL_INTERIOR_SEC_KEYS,
  SPARSE_INTERIOR_KEYS,
} from "./systemCubeB51Scene";

/**
 * Homepage System cube (B5.1 natural reveal & return), used by `MiniSystemHome` and, with `homeMotion`, by
 * `MiniSystemPocket` on `/`.
 * Verbatim from the approved lab (`app/lab/system-cube/NaturalMotionCube.tsx`); motion constants and
 * logic are unchanged. The lab inspection props (`forcedReveal`, `progress`, `interior`) are kept
 * so the homepage can be compared against the lab frame for frame; the homepage passes none.
 *
 * Geometry: B2 exterior + full A-derived interior (unchanged this pass).
 *
 * Live motion is a phased controller — not angular-velocity → opacity:
 *   rest → revealing → open while engaged → holding → returning → rest
 *
 * Opacity and orientation are timed independently:
 *   fade-in slower than pose open; pose returns faster on leave; fade-out keeps RETURN_S.
 * Re-entry resumes from the current fade / orient amounts (no restart from zero).
 *
 * Pointer follow reuses the Pocket / Project cube model: pointer writes a target via
 * `pocketFollowTarget` (calm center curves); current offset eases with `followToward`
 * + `pocketHoverFollowK`. Amplitudes stay B5.1; reveal timing is untouched.
 *
 * Lab inspection: `forcedReveal={1}` freezes the fully open state. `interior="sparse"`
 * restores the previous 5-path baseline.
 */

/** Resting-to-open pose arc, radians from B2. Pitch is intentional, not a token. */
export const GESTURE = { yaw: 0.11, pitch: 0.055 };
/** Scroll adds a spatial arc once the cube has risen through the reading band. */
export const SCROLL_MAX = { yaw: 0.045, pitch: 0.045 };
/** Pointer follow amplitude (Pocket-style curves; edge of interaction area ≈ ±1). */
export const POINTER_MAX = { yaw: 0.065, pitch: 0.08 };
export const ORIENT_CAP = { yaw: 0.18, pitch: 0.145 };
export const ORIENT_FLOOR = { yaw: -0.06, pitch: -0.11 };

const SCROLL_T0 = 0.55;
const SCROLL_T1 = 0.08;
const ORIENT_TAU = 0.38;
/** Slightly tighter chase while orientation returns home (still no snap). */
const ORIENT_RETURN_TAU = 0.28;

/** Interior opacity fade-in (slower / more gradual than pose open). */
const REVEAL_S = 2.5;
/** Pose arc open duration — preserves the approved movement rate. */
const ORIENT_OPEN_S = 1.75;
const HOLD_S = 1.25;
/** Interior opacity fade-out — keep as approved. */
const RETURN_S = 2.25;
/** Orientation return after leave — faster than fade-out, still eased. */
const ORIENT_RETURN_S = 1.05;
/** Scroll must move this far (leaky) before it counts as engagement / activation. */
const SCROLL_ENGAGE = 28;
const SCROLL_QUIET = 10;
const FLING_PX_S = 900;

/**
 * Homepage opt-in (`homeMotion`, set by `MiniSystemPocket`). Scroll no longer engages the reveal; it nudges the
 * orientation with the shared Pocket-family velocity nudge (the model `MiniProjectCube` uses), at most ±2.6° yaw /
 * ±1.7° pitch, settling within about a second once the page stops. The pointer area is the cube's own box (normalised against a field
 * HOME_FIELD box-widths across), not the whole figure. After a real pointer leave the cube waits LEAVE_DELAY_MS and then
 * closes from its current state over LEAVE_RETURN_S, instead of finishing the reveal and the auto hold first.
 * That close uses `leaveFade`, so the interior starts moving when the delay ends; ease-in-out stayed near fully open.
 * The auto reveal on arrival, its hold and its RETURN_S are unchanged.
 */
const HOME_SCROLL = { yaw: 0.045, pitch: 0.03, impulsePerPx: 0.00011, velYaw: 0.012, velPitch: 0.008 };
const HOME_FIELD = 2.3;
const LEAVE_DELAY_MS = 200;
const LEAVE_RETURN_S = 1.4;

const SKIN_MIN = { front: 0.36, right: 0.5 };

const INK = "184,196,218";
const FILL = { top: "#1a1f2a", front: "#161a23", right: "#11141b", body: "#151921" } as const;
const BLUE_FILL = "rgba(84,116,230,0.28)";
const SEAM = `rgba(${INK},0.38)`;
const BLUE_LINE = "124,151,240";
const MOD_FILL = {
  farR: "rgba(17, 21, 29, 0.72)",
  farL: "rgba(22, 27, 36, 0.62)",
  near: "rgba(15, 19, 26, 0.58)",
  floor: "rgba(28, 34, 44, 0.5)",
  plane: "rgba(184, 196, 218, 0.09)",
  blueVol: "rgba(84, 116, 230, 0.32)",
  blueTop: "rgba(84, 116, 230, 0.42)",
} as const;

export type InteriorMode = "full" | "sparse";
type Phase = "rest" | "revealing" | "open" | "holding" | "returning";

const BASE_SCENE = buildScene(BASE_YAW, BASE_PITCH);

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** Ease-in-out, no overshoot. */
export function easeInOut(t: number) {
  const u = clamp01(t);
  return u * u * (3 - 2 * u);
}

export function smootherstep(x: number) {
  const u = clamp01(x);
  return u * u * u * (u * (u * 6 - 15) + 10);
}

/**
 * Homepage leave close. Monotonic on 0–1, slope at 1, flat at 0, so the interior
 * starts closing when the delay ends and settles instead of snapping shut.
 */
function leaveFade(u: number) {
  const t = clamp01(u);
  return t * t * (1.5 - 0.5 * t);
}

/** The u at which `curve(u)` equals `value` (both fade curves rise monotonically on 0–1): keeps the drawn opacity across a phase switch. */
function matchCurve(curve: (u: number) => number, value: number) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (curve(mid) < value) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function clampOffsets(yaw: number, pitch: number) {
  return {
    yaw: Math.min(ORIENT_CAP.yaw, Math.max(ORIENT_FLOOR.yaw, yaw)),
    pitch: Math.min(ORIENT_CAP.pitch, Math.max(ORIENT_FLOOR.pitch, pitch)),
  };
}

export function scrollRise(viewportT: number) {
  return smooth(SCROLL_T0, SCROLL_T1, viewportT);
}

/**
 * Static board samples. Pose arc only; reveal is separate (`forcedReveal`).
 */
export function offsetsForProgress(progress: number) {
  const g = smootherstep(Math.min(1, progress / 0.55));
  const s = smooth(0.55, 1, progress);
  return clampOffsets(GESTURE.yaw * g + SCROLL_MAX.yaw * s, GESTURE.pitch * g + SCROLL_MAX.pitch * s);
}

const REDUCED = clampOffsets(GESTURE.yaw * 0.85, GESTURE.pitch * 0.7);

export default function SystemCubeB51({
  className,
  progress,
  forcedReveal,
  interior = "full",
  homeMotion = false,
}: {
  className: string;
  progress?: number;
  forcedReveal?: number;
  interior?: InteriorMode;
  /** Homepage pocket behaviour (see HOME_SCROLL above). Off by default, so every other caller is unchanged. */
  homeMotion?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const clipBody = `b51-body-${uid}`;
  const clipSkin = `b51-skin-${uid}`;
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const s0 = BASE_SCENE;
  const full = interior === "full";

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    if (!host || !svg) return;
    const e: Record<string, SVGElement | undefined> = {};
    svg.querySelectorAll<SVGElement>("[data-k]").forEach((el) => {
      e[el.dataset.k as string] = el;
    });

    const setD = (k: string, d: string) => e[k]?.setAttribute("d", d);
    const setLine = (k: string, d: string, alpha: number) => {
      const el = e[k];
      if (!el) return;
      el.setAttribute("d", d);
      el.setAttribute("stroke", `rgba(${INK},${alpha})`);
    };
    const show = (k: string, v: number) => {
      const el = e[k];
      if (!el) return;
      el.style.opacity = String(v);
      el.style.display = v > 0.001 ? "" : "none";
    };
    const showMany = (keys: readonly string[], v: number) => keys.forEach((k) => show(k, v));

    const apply = (yawOff: number, pitchOff: number, reveal: number, phase: Phase) => {
      const yaw = BASE_YAW + yawOff;
      const pitch = BASE_PITCH + pitchOff;
      const sc = buildScene(yaw, pitch) as Record<string, unknown>;
      setD("body", sc.body as string);
      setD("clipBody", sc.body as string);
      setD("top", sc.top as string);
      setD("front", sc.front as string);
      setD("right", sc.right as string);
      setD("blue", sc.blue as string);
      setD("clipFront", sc.front as string);
      setD("clipRight", sc.right as string);
      setD("belt", sc.belt as string);
      setD("depth", sc.depth as string);
      setD("post", sc.post as string);
      setD("step", sc.step as string);
      setD("nearEdges", sc.nearEdges as string);
      setD("nearCaps", sc.nearCaps as string);
      (sc.hexEdge as { d: string; alpha: number }[]).forEach((h, i) => setLine(`he${i}`, h.d, h.alpha));
      (sc.hexCorner as { d: string; alpha: number }[]).forEach((h, i) => setLine(`hc${i}`, h.d, h.alpha));

      for (const k of SPARSE_INTERIOR_KEYS) setD(k, sc[k] as string);
      if (full) {
        for (const k of FULL_INTERIOR_FILL_KEYS) if (k in sc) setD(k, sc[k] as string);
        for (const k of FULL_INTERIOR_PRIM_KEYS) setD(k, sc[k] as string);
        for (const k of FULL_INTERIOR_SEC_KEYS) setD(k, sc[k] as string);
      }

      const skin = smooth(0, 0.9, reveal);
      if (e.front) e.front.style.fillOpacity = String(1 - (1 - SKIN_MIN.front) * skin);
      if (e.right) e.right.style.fillOpacity = String(1 - (1 - SKIN_MIN.right) * skin);

      if (full) {
        const fills = smooth(0.05, 0.9, reveal);
        const prim = smooth(0.1, 0.95, reveal);
        const sec = smooth(0.25, 1, reveal);
        const blueV = smooth(0.22, 1, reveal);
        show("interior", Math.max(fills, prim));
        showMany(["fillFarR", "fillFarLTop", "fillFarLBot", "fillNearL", "fillBlueBack", "fillNearFloor", "plane"], fills);
        showMany([...FULL_INTERIOR_PRIM_KEYS], prim);
        showMany([...FULL_INTERIOR_SEC_KEYS], sec);
        showMany(["blueFrontInner", "blueLeft", "blueTop"], blueV);
        showMany([...SPARSE_INTERIOR_KEYS].filter((k) => k !== "plane" && k !== "blueTop"), 0);
      } else {
        const edges = smooth(0.08, 0.95, reveal);
        const planeV = smooth(0.18, 1, reveal);
        const blueV = smooth(0.28, 1, reveal);
        show("interior", edges);
        show("plane", planeV);
        show("e1", edges);
        show("e2", edges);
        show("e3", blueV);
        show("blueTop", blueV);
        showMany([...FULL_INTERIOR_FILL_KEYS, ...FULL_INTERIOR_PRIM_KEYS, ...FULL_INTERIOR_SEC_KEYS], 0);
      }

      svg.dataset.reveal = reveal.toFixed(3);
      svg.dataset.phase = phase;
      svg.dataset.yaw = yaw.toFixed(4);
      svg.dataset.pitch = pitch.toFixed(4);
      svg.dataset.interior = interior;
    };

    if (forcedReveal !== undefined || progress !== undefined) {
      svg.dataset.mode = forcedReveal !== undefined ? "inspect" : "static";
      const o = offsetsForProgress(progress ?? (forcedReveal !== undefined ? 0.7 : 0));
      const reveal = forcedReveal !== undefined ? clamp01(forcedReveal) : 0;
      apply(o.yaw, o.pitch, reveal, reveal > 0.5 ? "open" : "rest");
      return;
    }

    const cleanups: (() => void)[] = [];
    let teardown: (() => void) | null = null;

    const start = () => {
      teardown?.();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      svg.dataset.mode = reduced ? "reduced" : "live";
      svg.dataset.pointer = !reduced && finePointer ? "fine" : "off";

      if (reduced) {
        apply(REDUCED.yaw, REDUCED.pitch, 0.72, "open");
        teardown = () => undefined;
        return;
      }

      let raf = 0;
      let yaw = 0;
      let pitch = 0;
      /** Opacity timeline (0–1 linear clock, eased for apply). */
      let revealU = 0;
      /** Pose-arc timeline — independent of fade so return can close faster. */
      let orientU = 0;
      let phase: Phase = "rest";
      let holdLeft = 0;
      /** Pocket-family pointer: target written by pointer; offset eases toward it. */
      let ptrTargetYaw = 0;
      let ptrTargetPitch = 0;
      let ptrYaw = 0;
      let ptrPitch = 0;
      let last = 0;
      let lastScroll = window.scrollY;
      let travel = 0;
      let pointerOn = false;
      let scrollEngaged = false;
      let sequenceArmed = true;
      /** homeMotion: scroll orientation nudge, and the pending close after a pointer leave (0 = none). */
      const nudge = createScrollNudge();
      let pointerLeftAt = 0;
      let leaveReturn = false;
      apply(0, 0, 0, "rest");

      const undo: (() => void)[] = [];

      const visibleFraction = () => {
        const r = host.getBoundingClientRect();
        const vh = document.documentElement.clientHeight || window.innerHeight;
        if (r.height <= 0 || vh <= 0) return { vis: 0, t: 1 };
        const shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        return { vis: Math.max(0, shown / r.height), t: (r.top + r.height / 2) / vh };
      };

      const engaged = () => pointerOn || scrollEngaged;

      const beginReveal = () => {
        if (phase === "revealing" || phase === "open") return;
        if (phase === "holding") {
          phase = revealU >= 0.999 && orientU >= 0.999 ? "open" : "revealing";
          holdLeft = 0;
          return;
        }
        if (phase === "returning" || phase === "rest") {
          /* homeMotion: the fade-in curve differs from the fade-out one; restart where the drawn opacity is. */
          if (homeMotion && phase === "returning") {
            const drawn = leaveReturn ? leaveFade(revealU) : easeInOut(revealU);
            revealU = matchCurve(smootherstep, drawn);
          }
          leaveReturn = false;
          phase = "revealing";
          holdLeft = 0;
        }
      };

      /** Gesture + scroll only — pointer is eased separately (Pocket model). */
      const baseTargetOf = (t: number, arcAmt: number) => {
        const rise = scrollRise(t);
        const arc = arcAmt;
        return clampOffsets(
          GESTURE.yaw * arc + SCROLL_MAX.yaw * rise * arc,
          GESTURE.pitch * arc + SCROLL_MAX.pitch * rise * arc * 0.85,
        );
      };

      const tick = (now: number) => {
        const dt = Math.min(0.05, Math.max(0.001, last ? (now - last) / 1000 : 0.016));
        last = now;

        const y = window.scrollY;
        const rawDy = y - lastScroll;
        const dy = Math.abs(rawDy);
        lastScroll = y;
        travel = travel * Math.exp(-dt / 0.22) + dy;
        const speed = travel / 0.22;

        const { vis, t } = visibleFraction();

        if (vis <= 0) {
          yaw = 0;
          pitch = 0;
          revealU = 0;
          orientU = 0;
          ptrTargetYaw = 0;
          ptrTargetPitch = 0;
          ptrYaw = 0;
          ptrPitch = 0;
          phase = "rest";
          holdLeft = 0;
          scrollEngaged = false;
          sequenceArmed = true;
          resetScrollNudge(nudge);
          pointerLeftAt = 0;
          leaveReturn = false;
          apply(0, 0, 0, "rest");
          raf = 0;
          last = 0;
          return;
        }

        /* homeMotion: scroll drives orientation only (the nudge below), never the reveal. */
        if (!homeMotion) {
          if (travel > SCROLL_ENGAGE && speed < FLING_PX_S) scrollEngaged = true;
          if (travel < SCROLL_QUIET && !pointerOn) scrollEngaged = false;
        }

        /* Viewport arrival: one autonomous sequence when armed. */
        if (sequenceArmed && phase === "rest" && vis > 0.45 && speed < FLING_PX_S) {
          sequenceArmed = false;
          beginReveal();
        }
        if (engaged() && (phase === "rest" || phase === "returning" || phase === "holding")) {
          beginReveal();
        }
        /* homeMotion: a real pointer leave closes from the current state after a short delay, without the auto hold. */
        if (homeMotion && pointerLeftAt && !pointerOn && now - pointerLeftAt >= LEAVE_DELAY_MS) {
          pointerLeftAt = 0;
          if (phase === "revealing" || phase === "open" || phase === "holding") {
            if (phase === "revealing") revealU = matchCurve(leaveFade, smootherstep(revealU));
            phase = "returning";
            leaveReturn = true;
            holdLeft = 0;
          }
        }

        if (phase === "revealing") {
          revealU = Math.min(1, revealU + dt / REVEAL_S);
          orientU = Math.min(1, orientU + dt / ORIENT_OPEN_S);
          if (revealU >= 1 && orientU >= 1) {
            revealU = 1;
            orientU = 1;
            phase = engaged() ? "open" : "holding";
            holdLeft = HOLD_S;
          }
        } else if (phase === "open") {
          revealU = 1;
          orientU = 1;
          if (!engaged()) {
            phase = "holding";
            holdLeft = HOLD_S;
          }
        } else if (phase === "holding") {
          revealU = 1;
          orientU = 1;
          holdLeft -= dt;
          if (engaged()) {
            phase = "open";
            holdLeft = 0;
          } else if (holdLeft <= 0) {
            phase = "returning";
          }
        } else if (phase === "returning") {
          revealU = Math.max(0, revealU - dt / (leaveReturn ? LEAVE_RETURN_S : RETURN_S));
          orientU = Math.max(0, orientU - dt / ORIENT_RETURN_S);
          /* Pocket leave: ease pointer offsets home; hold kept the last aim frozen. */
          if (!pointerOn) {
            ptrTargetYaw = 0;
            ptrTargetPitch = 0;
          }
          if (engaged()) {
            beginReveal();
          } else if (revealU <= 0 && orientU <= 0) {
            revealU = 0;
            orientU = 0;
            phase = "rest";
            leaveReturn = false;
            sequenceArmed = vis < 0.2;
          }
        }

        /* Fade-in: softer ease so opacity rises more gradually at the start. */
        const fade =
          leaveReturn && phase === "returning"
            ? leaveFade(revealU)
            : phase === "revealing" || (phase === "open" && revealU >= 1)
              ? smootherstep(revealU)
              : easeInOut(revealU);
        const arc = phase === "rest" ? 0 : easeInOut(orientU);

        /* Hold freezes pointer aim (target stays); return eases target to 0 above. */
        const ptrHovering = pointerOn || phase === "holding";
        const ptrK = pocketHoverFollowK(dt, ptrHovering);
        ptrYaw = followToward(ptrYaw, ptrTargetYaw, ptrK);
        ptrPitch = followToward(ptrPitch, ptrTargetPitch, ptrK);

        /* Gesture/scroll chase (approved timing). Pointer is already Pocket-eased — add after. */
        const base = baseTargetOf(t, arc);
        const tau = phase === "returning" ? ORIENT_RETURN_TAU : ORIENT_TAU;
        const k = 1 - Math.exp(-dt / tau);
        yaw += (base.yaw - yaw) * k;
        pitch += (base.pitch - pitch) * k;
        /* homeMotion: scroll nudge (all devices); the pointer, while on the cube, takes over and the nudge eases home. */
        if (homeMotion) {
          if (rawDy !== 0 && !pointerOn) {
            applyScrollImpulse(nudge, rawDy, HOME_SCROLL.impulsePerPx, HOME_SCROLL.velYaw, HOME_SCROLL.velPitch);
          }
          tickScrollNudge(nudge, dt, pointerOn, HOME_SCROLL.yaw, HOME_SCROLL.pitch);
        }
        const posed = clampOffsets(yaw + ptrYaw * arc + nudge.yaw, pitch + ptrPitch * arc + nudge.pitch);

        /* Stay alive while an armed viewport entry is waiting for scroll speed to settle. */
        const waitingAuto = sequenceArmed && vis > 0.45;
        const settled =
          phase === "rest" &&
          revealU <= 0 &&
          orientU <= 0 &&
          Math.abs(posed.yaw) < 0.0004 &&
          Math.abs(posed.pitch) < 0.0004 &&
          Math.abs(ptrYaw) < 0.0004 &&
          Math.abs(ptrPitch) < 0.0004 &&
          scrollNudgeQuiet(nudge) &&
          pointerLeftAt === 0 &&
          !engaged() &&
          !waitingAuto;
        if (settled) {
          yaw = 0;
          pitch = 0;
          ptrYaw = 0;
          ptrPitch = 0;
          resetScrollNudge(nudge);
          apply(0, 0, 0, "rest");
          raf = 0;
          last = 0;
          return;
        }

        apply(posed.yaw, posed.pitch, fade, phase);
        svg.dataset.orient = easeInOut(orientU).toFixed(3);
        raf = requestAnimationFrame(tick);
      };

      const ensure = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };

      if (finePointer) {
        /* homeMotion: only the cube's own box counts as "on the cube", so a leave is a real leave. */
        const area = homeMotion ? host : (host.closest("figure") ?? host);
        const fieldRect = () => {
          const r = area.getBoundingClientRect();
          if (!homeMotion) return r;
          const half = (r.width * HOME_FIELD) / 2;
          return new DOMRect(r.left + r.width / 2 - half, r.top + r.height / 2 - half, half * 2, half * 2);
        };
        const aim = (ev: PointerEvent) => {
          if (ev.pointerType === "touch") return;
          pointerOn = true;
          pointerLeftAt = 0;
          const { nx, ny } = pointerNormFromRect(ev.clientX, ev.clientY, fieldRect());
          const follow = pocketFollowTarget(nx, ny, POINTER_MAX.yaw, POINTER_MAX.pitch);
          ptrTargetYaw = follow.yaw;
          ptrTargetPitch = follow.pitch;
          beginReveal();
          ensure();
        };
        const leave = () => {
          pointerOn = false;
          if (homeMotion && phase !== "rest") pointerLeftAt = performance.now();
          /* Hold keeps last ptrTarget; returning zeros it in tick. */
          ensure();
        };
        area.addEventListener("pointerenter", aim);
        area.addEventListener("pointermove", aim);
        area.addEventListener("pointerleave", leave);
        undo.push(() => {
          area.removeEventListener("pointerenter", aim);
          area.removeEventListener("pointermove", aim);
          area.removeEventListener("pointerleave", leave);
        });
      }

      let listening = false;
      const onScroll = () => ensure();
      const listen = (on: boolean) => {
        if (on === listening) return;
        listening = on;
        if (on) {
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll, { passive: true });
          ensure();
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        }
      };
      const io = new IntersectionObserver((entries) => listen(entries.some((en) => en.isIntersecting)), {
        rootMargin: "100% 0px 100% 0px",
      });
      io.observe(host);
      undo.push(() => {
        io.disconnect();
        listen(false);
      });
      ensure();

      teardown = () => {
        if (raf) cancelAnimationFrame(raf);
        undo.forEach((fn) => fn());
      };
    };

    start();
    for (const q of ["(prefers-reduced-motion: reduce)", "(hover: hover) and (pointer: fine)"]) {
      const mq = window.matchMedia(q);
      mq.addEventListener("change", start);
      cleanups.push(() => mq.removeEventListener("change", start));
    }
    return () => {
      teardown?.();
      cleanups.forEach((fn) => fn());
    };
  }, [progress, forcedReveal, interior, full, homeMotion]);

  const stroke = (alpha: number, w: number) => ({ stroke: `rgba(${INK},${alpha})`, strokeWidth: w, vectorEffect: "non-scaling-stroke" as const });
  const hidden = { opacity: 0, display: "none" } as const;
  return (
    <div ref={hostRef} className={className}>
      <svg
        ref={svgRef}
        viewBox={VIEWBOX}
        fill="none"
        aria-hidden="true"
        data-natural-motion-cube=""
        shapeRendering="geometricPrecision"
        strokeLinecap="butt"
        strokeLinejoin="round"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <clipPath id={clipBody}>
            <path data-k="clipBody" d={s0.body} />
          </clipPath>
          <clipPath id={clipSkin}>
            <path data-k="clipFront" d={s0.front} />
            <path data-k="clipRight" d={s0.right} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipBody})`}>
          <path data-k="body" d={s0.body} fill={FILL.body} />
          <path data-k="top" d={s0.top} fill={FILL.top} />
          <g data-k="interior" clipPath={`url(#${clipSkin})`} style={hidden}>
            <path data-k="fillFarR" d={s0.fillFarR} fill={MOD_FILL.farR} style={hidden} />
            <path data-k="fillFarLTop" d={s0.fillFarLTop} fill={MOD_FILL.farL} style={hidden} />
            <path data-k="fillFarLBot" d={s0.fillFarLBot} fill={MOD_FILL.farL} style={hidden} />
            <path data-k="fillNearL" d={s0.fillNearL} fill={MOD_FILL.near} style={hidden} />
            <path data-k="fillBlueBack" d={s0.fillBlueBack} fill={MOD_FILL.blueVol} style={hidden} />
            <path data-k="fillNearFloor" d={s0.fillNearFloor} fill={MOD_FILL.floor} style={hidden} />
            <path data-k="plane" d={s0.plane} fill={MOD_FILL.plane} style={hidden} />
            <path data-k="primZ" d={s0.primZ} fill="none" {...stroke(0.62, 1.05)} style={hidden} />
            <path data-k="primXF" d={s0.primXF} fill="none" {...stroke(0.82, 1.15)} style={hidden} />
            <path data-k="primYF" d={s0.primYF} fill="none" {...stroke(0.82, 1.15)} style={hidden} />
            <path data-k="primYB" d={s0.primYB} fill="none" {...stroke(0.82, 1.15)} style={hidden} />
            <path data-k="primXB" d={s0.primXB} fill="none" {...stroke(0.82, 1.15)} style={hidden} />
            <path data-k="primFarLCage" d={s0.primFarLCage} fill="none" {...stroke(0.7, 1.05)} style={hidden} />
            <path data-k="primFarLSplit" d={s0.primFarLSplit} fill="none" {...stroke(0.68, 1)} style={hidden} />
            <path data-k="primNearLCage" d={s0.primNearLCage} fill="none" {...stroke(0.74, 1.05)} style={hidden} />
            <path data-k="secFarXFBot" d={s0.secFarXFBot} fill="none" {...stroke(0.48, 0.85)} style={hidden} />
            <path data-k="secFarXFTop" d={s0.secFarXFTop} fill="none" {...stroke(0.42, 0.85)} style={hidden} />
            <path data-k="secFarYFLeft" d={s0.secFarYFLeft} fill="none" {...stroke(0.45, 0.85)} style={hidden} />
            <path data-k="secFarYFXF" d={s0.secFarYFXF} fill="none" {...stroke(0.48, 0.85)} style={hidden} />
            <path data-k="secFarRBack" d={s0.secFarRBack} fill="none" {...stroke(0.4, 0.8)} style={hidden} />
            <path data-k="secNearYBLeft" d={s0.secNearYBLeft} fill="none" {...stroke(0.48, 0.85)} style={hidden} />
            <path data-k="secNearYBRight" d={s0.secNearYBRight} fill="none" {...stroke(0.48, 0.85)} style={hidden} />
            <path data-k="secNearLFloor" d={s0.secNearLFloor} fill="none" {...stroke(0.5, 0.85)} style={hidden} />
            <path data-k="secNearLTop" d={s0.secNearLTop} fill="none" {...stroke(0.5, 0.85)} style={hidden} />
            <path data-k="secBlueFloor" d={s0.secBlueFloor} fill="none" {...stroke(0.52, 0.85)} style={hidden} />
            <path data-k="secBlueTopFront" d={s0.secBlueTopFront} fill="none" {...stroke(0.52, 0.85)} style={hidden} />
            <path data-k="secBlueTopRight" d={s0.secBlueTopRight} fill="none" {...stroke(0.52, 0.85)} style={hidden} />
            <path data-k="primBlueCage" d={s0.primBlueCage} fill="none" stroke={`rgba(${BLUE_LINE},0.95)`} strokeWidth={1.05} vectorEffect="non-scaling-stroke" style={hidden} />
            <path data-k="primNearPost" d={s0.primNearPost} fill="none" stroke={`rgba(${BLUE_LINE},0.9)`} strokeWidth={1} vectorEffect="non-scaling-stroke" style={hidden} />
            <path data-k="blueFrontInner" d={s0.blueFrontInner} fill={MOD_FILL.blueVol} style={hidden} />
            <path data-k="blueLeft" d={s0.blueLeft} fill={MOD_FILL.blueVol} style={hidden} />
            <path data-k="blueTop" d={s0.blueTop} fill={MOD_FILL.blueTop} style={hidden} />
            <path data-k="e1" d={s0.e1} {...stroke(0.7, 0.85)} style={hidden} />
            <path data-k="e2" d={s0.e2} {...stroke(0.7, 0.85)} style={hidden} />
            <path data-k="e3" d={s0.e3} stroke={`rgba(${BLUE_LINE},0.95)`} strokeWidth={0.9} vectorEffect="non-scaling-stroke" style={hidden} />
          </g>
          <path data-k="front" d={s0.front} fill={FILL.front} />
          <path data-k="right" d={s0.right} fill={FILL.right} />
          <path data-k="blue" d={s0.blue} fill={BLUE_FILL} />
        </g>
        <path data-k="belt" d={s0.belt} stroke={SEAM} strokeWidth={0.85} vectorEffect="non-scaling-stroke" />
        <path data-k="depth" d={s0.depth} stroke={SEAM} strokeWidth={0.85} vectorEffect="non-scaling-stroke" />
        <path data-k="post" d={s0.post} stroke={SEAM} strokeWidth={0.85} vectorEffect="non-scaling-stroke" />
        <path data-k="step" d={s0.step} stroke={`rgba(${INK},0.28)`} strokeWidth={0.85} vectorEffect="non-scaling-stroke" />
        {s0.hexEdge.map((h, i) => (
          <path key={`he${i}`} data-k={`he${i}`} d={h.d} {...stroke(h.alpha, 1.05)} />
        ))}
        {s0.hexCorner.map((h, i) => (
          <path key={`hc${i}`} data-k={`hc${i}`} d={h.d} {...stroke(h.alpha, 1.05)} />
        ))}
        <path data-k="nearEdges" d={s0.nearEdges} {...stroke(0.74, 1.15)} />
        <path data-k="nearCaps" d={s0.nearCaps} {...stroke(0.74, 1.15)} />
      </svg>
    </div>
  );
}
