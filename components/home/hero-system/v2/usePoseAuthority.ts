"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import {
  AMBIENT_FAST_IDLE,
  AMBIENT_PATH_AMPLITUDE,
  AMBIENT_TIMING,
  dampToward,
  easeInOutCubic,
  FIELD_FORCE_DAMPING,
  joinLengthsFromSample,
  LOCKED_SHIFT_MODE,
  normalizeFieldPointer,
  poseParamsFromBlend,
  randInRange,
  targetBlendFromPointer,
  type AmbientPhase,
  type MotionAuthority,
  type ShiftMode,
} from "./spatialShift";
import {
  sampleFromPoseParams,
  type PoseParams,
  type PoseSample,
} from "./spatialPose";

export type SpatialShiftSnapshot = {
  blend: number;
  targetBlend: number;
  params: PoseParams;
  sample: PoseSample;
  active: boolean;
  nx: number;
  ny: number;
  authority: MotionAuthority;
  ambientPhase: AmbientPhase;
  timerMs: number | null;
  inViewport: boolean;
  tabVisible: boolean;
  finePointer: boolean;
  reduced: boolean;
  joinLengths: ReturnType<typeof joinLengthsFromSample>;
  faceAreas: { id: string; signedArea: number; render: boolean }[];
};

type Options = {
  mode?: ShiftMode;
  /** When true, ignore pointer/ambient and hold exact S1 (or scrub) */
  reduced: boolean;
  /** External hold 0..1 — null = live authority */
  scrub: number | null;
  /** Desktop only; mobile stays at S1 rest */
  enablePointer: boolean;
  /** Rare autonomous pose event */
  enableAmbient: boolean;
  /** Shorten idle/calm only — motion durations unchanged */
  ambientFast?: boolean;
  /** Increment to force one ambient event (lab) */
  ambientTrigger?: number;
  /**
   * When false, no RAF / pointer / ambient (CSS-hidden sibling branch).
   * Default true for backward compatibility.
   */
  runtimeEnabled?: boolean;
};

type AmbientPlan = {
  phase: Exclude<AmbientPhase, "idle" | "suppressed">;
  startedAt: number;
  duration: number;
  from: number;
  to: number;
};

/**
 * Single pose writer:
 * pointer / ambient / scrub → target blend → damped blend → yaw/pitch/roll → project.
 * Never tweens 2D vertex coordinates. Never a second rAF motion layer.
 */
export function usePoseAuthority(
  fieldRef: RefObject<HTMLElement | null>,
  opts: Options,
): SpatialShiftSnapshot {
  const {
    mode = LOCKED_SHIFT_MODE,
    reduced,
    scrub,
    enablePointer,
    enableAmbient,
    ambientFast = false,
    ambientTrigger = 0,
    runtimeEnabled = true,
  } = opts;

  const [snap, setSnap] = useState<SpatialShiftSnapshot>(() => {
    const params = poseParamsFromBlend(0);
    const sample = sampleFromPoseParams(params, "S1");
    return {
      blend: 0,
      targetBlend: 0,
      params,
      sample,
      active: false,
      nx: 0,
      ny: 0,
      authority: "rest",
      ambientPhase: "idle",
      timerMs: null,
      inViewport: true,
      tabVisible: true,
      finePointer: true,
      reduced,
      joinLengths: joinLengthsFromSample(sample.joins),
      faceAreas: sample.faces.map((f) => ({
        id: f.id,
        signedArea: f.signedArea,
        render: f.render,
      })),
    };
  });

  const blendRef = useRef(0);
  const targetRef = useRef(0);
  const nxRef = useRef(0);
  const nyRef = useRef(0);
  const pointerActiveRef = useRef(false);
  const authorityRef = useRef<MotionAuthority>("rest");
  const ambientPhaseRef = useRef<AmbientPhase>("idle");
  const ambientPlanRef = useRef<AmbientPlan | null>(null);
  const idleUntilRef = useRef(0);
  const lastInteractionAtRef = useRef(0);
  const timerMsRef = useRef<number | null>(null);
  const inViewportRef = useRef(true);
  const tabVisibleRef = useRef(true);
  const finePointerRef = useRef(true);
  const lastTs = useRef<number | null>(null);
  const raf = useRef(0);
  const bootstrappedIdle = useRef(false);
  const lastAmbientTrigger = useRef(ambientTrigger);

  const idleRange = () =>
    ambientFast ? AMBIENT_FAST_IDLE.initialIdle : AMBIENT_TIMING.initialIdle;
  const nextIdleRange = () =>
    ambientFast ? AMBIENT_FAST_IDLE.nextIdle : AMBIENT_TIMING.nextIdle;
  const calmRange = () =>
    ambientFast
      ? AMBIENT_FAST_IDLE.postInteractionCalm
      : AMBIENT_TIMING.postInteractionCalm;

  const cancelAmbient = () => {
    ambientPlanRef.current = null;
    if (ambientPhaseRef.current !== "suppressed") {
      ambientPhaseRef.current = "idle";
    }
  };

  const scheduleIdle = (range: readonly [number, number]) => {
    const wait = randInRange(range[0], range[1]) * 1000;
    idleUntilRef.current = performance.now() + wait;
    timerMsRef.current = wait;
  };

  const suppressAmbient = (reason: "hidden" | "viewport" | "reduced" | "pointer") => {
    cancelAmbient();
    ambientPhaseRef.current = "suppressed";
    idleUntilRef.current = 0;
    timerMsRef.current = null;
    if (reason === "pointer") {
      // pointer takes over; don't accumulate
    }
  };

  const canRunAmbient = () => {
    if (!enableAmbient) return false;
    if (reduced) return false;
    if (scrub != null) return false;
    if (!enablePointer) return false;
    if (!finePointerRef.current) return false;
    if (!tabVisibleRef.current) return false;
    if (!inViewportRef.current) return false;
    if (pointerActiveRef.current) return false;
    if (authorityRef.current === "interaction") return false;
    if (authorityRef.current === "return") return false;
    if (ambientPlanRef.current) return false;
    return true;
  };

  const beginAmbient = (now: number) => {
    const shiftDur = randInRange(
      AMBIENT_TIMING.shift[0],
      AMBIENT_TIMING.shift[1],
    );
    ambientPlanRef.current = {
      phase: "shift",
      startedAt: now,
      duration: shiftDur,
      from: blendRef.current,
      to: AMBIENT_PATH_AMPLITUDE,
    };
    ambientPhaseRef.current = "shift";
    authorityRef.current = "ambient";
    timerMsRef.current = shiftDur * 1000;
  };

  const advanceAmbient = (now: number) => {
    const plan = ambientPlanRef.current;
    if (!plan) return;

    // plan.duration is seconds; startedAt is performance.now() ms
    const elapsedSec = (now - plan.startedAt) / 1000;
    const u = clamp01Local(elapsedSec / plan.duration);
    const eased = easeInOutCubic(u);
    targetRef.current = plan.from + (plan.to - plan.from) * eased;
    timerMsRef.current = Math.max(0, (plan.duration - elapsedSec) * 1000);

    if (elapsedSec < plan.duration) return;

    if (plan.phase === "shift") {
      const holdDur = randInRange(
        AMBIENT_TIMING.hold[0],
        AMBIENT_TIMING.hold[1],
      );
      ambientPlanRef.current = {
        phase: "hold",
        startedAt: now,
        duration: holdDur,
        from: AMBIENT_PATH_AMPLITUDE,
        to: AMBIENT_PATH_AMPLITUDE,
      };
      ambientPhaseRef.current = "hold";
      targetRef.current = AMBIENT_PATH_AMPLITUDE;
      timerMsRef.current = holdDur * 1000;
      return;
    }

    if (plan.phase === "hold") {
      const retDur = randInRange(
        AMBIENT_TIMING.return[0],
        AMBIENT_TIMING.return[1],
      );
      ambientPlanRef.current = {
        phase: "return",
        startedAt: now,
        duration: retDur,
        from: blendRef.current,
        to: 0,
      };
      ambientPhaseRef.current = "return";
      timerMsRef.current = retDur * 1000;
      return;
    }

    // return complete → rest + long silence
    ambientPlanRef.current = null;
    ambientPhaseRef.current = "idle";
    authorityRef.current = "rest";
    targetRef.current = 0;
    blendRef.current = 0;
    scheduleIdle(nextIdleRange());
  };

  // Viewport / tab / fine-pointer observers
  useEffect(() => {
    if (!runtimeEnabled) return;
    const el = fieldRef.current;
    const onVis = () => {
      const visible = document.visibilityState === "visible";
      tabVisibleRef.current = visible;
      if (!visible) {
        suppressAmbient("hidden");
        // no accumulated events — fresh schedule only when eligible again
      } else if (
        enableAmbient &&
        !reduced &&
        scrub == null &&
        enablePointer &&
        !pointerActiveRef.current
      ) {
        ambientPhaseRef.current = "idle";
        scheduleIdle(idleRange());
      }
    };
    document.addEventListener("visibilitychange", onVis);
    tabVisibleRef.current = document.visibilityState === "visible";

    let io: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          const ok = !!entry && entry.isIntersecting && entry.intersectionRatio >= 0.4;
          inViewportRef.current = ok;
          if (!ok) {
            suppressAmbient("viewport");
          } else if (
            enableAmbient &&
            !reduced &&
            scrub == null &&
            enablePointer &&
            tabVisibleRef.current &&
            !pointerActiveRef.current &&
            !ambientPlanRef.current
          ) {
            ambientPhaseRef.current = "idle";
            scheduleIdle(idleRange());
          }
        },
        { threshold: [0, 0.4, 0.6, 1] },
      );
      io.observe(el);
    }

    const mq =
      typeof window !== "undefined"
        ? window.matchMedia("(pointer: fine)")
        : null;
    const onMq = () => {
      finePointerRef.current = mq ? mq.matches : true;
      if (!finePointerRef.current) suppressAmbient("reduced");
    };
    onMq();
    mq?.addEventListener("change", onMq);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
      mq?.removeEventListener("change", onMq);
    };
  }, [
    fieldRef,
    enableAmbient,
    enablePointer,
    reduced,
    scrub,
    ambientFast,
    runtimeEnabled,
  ]);

  // Bootstrap / reschedule idle when live ambient enabled
  useEffect(() => {
    if (
      !runtimeEnabled ||
      scrub != null ||
      reduced ||
      !enableAmbient ||
      !enablePointer
    ) {
      cancelAmbient();
      if (reduced || scrub != null) {
        ambientPhaseRef.current = "suppressed";
        idleUntilRef.current = 0;
        timerMsRef.current = null;
      }
      return;
    }
    if (!bootstrappedIdle.current) {
      bootstrappedIdle.current = true;
      ambientPhaseRef.current = "idle";
      scheduleIdle(idleRange());
    } else if (!ambientPlanRef.current && ambientPhaseRef.current === "idle") {
      scheduleIdle(idleRange());
    }
  }, [
    enableAmbient,
    enablePointer,
    reduced,
    scrub,
    ambientFast,
    runtimeEnabled,
  ]);

  // Lab force ambient
  useEffect(() => {
    if (ambientTrigger === lastAmbientTrigger.current) return;
    lastAmbientTrigger.current = ambientTrigger;
    if (ambientTrigger <= 0) return;
    if (reduced || scrub != null || !enablePointer) return;
    // Lab may force even if calm period incomplete
    cancelAmbient();
    pointerActiveRef.current = false;
    beginAmbient(performance.now());
  }, [ambientTrigger, reduced, scrub, enablePointer]);

  useEffect(() => {
    if (scrub != null) {
      targetRef.current = Math.min(1, Math.max(0, scrub));
      pointerActiveRef.current = false;
      cancelAmbient();
      ambientPhaseRef.current = "suppressed";
      authorityRef.current = "rest";
    }
  }, [scrub]);

  useEffect(() => {
    if (reduced || !enablePointer) {
      targetRef.current = scrub ?? 0;
      pointerActiveRef.current = false;
      nxRef.current = 0;
      nyRef.current = 0;
      cancelAmbient();
      ambientPhaseRef.current = "suppressed";
      if (scrub == null) {
        blendRef.current = 0;
        targetRef.current = 0;
        authorityRef.current = "rest";
      }
    }
  }, [reduced, enablePointer, scrub]);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el || !runtimeEnabled || reduced || !enablePointer || scrub != null)
      return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const { nx, ny } = normalizeFieldPointer(e.clientX, e.clientY, rect);
      nxRef.current = nx;
      nyRef.current = ny;

      // Interrupt ambient from current pose — no forced S1 return
      if (ambientPlanRef.current || authorityRef.current === "ambient") {
        cancelAmbient();
        ambientPhaseRef.current = "idle";
      }

      pointerActiveRef.current = true;
      authorityRef.current = "interaction";
      targetRef.current = targetBlendFromPointer(nx, ny, mode);
      lastInteractionAtRef.current = performance.now();
    };

    const onLeave = () => {
      pointerActiveRef.current = false;
      nxRef.current = 0;
      nyRef.current = 0;
      targetRef.current = 0;
      authorityRef.current = "return";
      lastInteractionAtRef.current = performance.now();
      // schedule ambient only after post-interaction calm (once return settles)
      idleUntilRef.current = 0;
      timerMsRef.current = null;
      ambientPhaseRef.current = "idle";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
    };
  }, [fieldRef, mode, reduced, enablePointer, scrub, runtimeEnabled]);

  useEffect(() => {
    if (!runtimeEnabled) {
      // Frozen rest snapshot — no RAF while CSS-hidden / inactive branch.
      blendRef.current = 0;
      targetRef.current = 0;
      authorityRef.current = "rest";
      pointerActiveRef.current = false;
      cancelAmbient();
      const params = poseParamsFromBlend(0);
      const sample = sampleFromPoseParams(params, "S1");
      setSnap((prev) => ({
        ...prev,
        blend: 0,
        targetBlend: 0,
        params,
        sample,
        active: false,
        authority: "rest",
        ambientPhase: "suppressed",
        joinLengths: joinLengthsFromSample(sample.joins),
        faceAreas: sample.faces.map((f) => ({
          id: f.id,
          signedArea: f.signedArea,
          render: f.render,
        })),
      }));
      return;
    }

    const { approachLambda, releaseLambda } = FIELD_FORCE_DAMPING;
    // Ambient envelope is already timed — follow with approach λ (no second writer)
    const ambientFollowLambda = approachLambda;

    const tick = (ts: number) => {
      const prev = lastTs.current ?? ts;
      lastTs.current = ts;
      const dt = Math.min(0.05, (ts - prev) / 1000);
      const now = ts;

      if (scrub != null) {
        targetRef.current = Math.min(1, Math.max(0, scrub));
        authorityRef.current = "rest";
        ambientPhaseRef.current = "suppressed";
      } else if (reduced || !enablePointer) {
        targetRef.current = 0;
        authorityRef.current = "rest";
      } else if (pointerActiveRef.current) {
        authorityRef.current = "interaction";
      } else if (ambientPlanRef.current) {
        advanceAmbient(now);
        authorityRef.current = "ambient";
      } else {
        // return → rest
        if (
          authorityRef.current === "return" ||
          authorityRef.current === "interaction"
        ) {
          targetRef.current = 0;
          if (Math.abs(blendRef.current) < 0.0015) {
            blendRef.current = 0;
            authorityRef.current = "rest";
            // post-interaction calm before next ambient
            if (
              enableAmbient &&
              tabVisibleRef.current &&
              inViewportRef.current &&
              finePointerRef.current
            ) {
              const calm = randInRange(calmRange()[0], calmRange()[1]) * 1000;
              idleUntilRef.current = now + calm;
              timerMsRef.current = calm;
              ambientPhaseRef.current = "idle";
            }
          } else {
            authorityRef.current = "return";
          }
        }

        // idle ambient schedule
        if (
          canRunAmbient() &&
          ambientPhaseRef.current === "idle" &&
          idleUntilRef.current > 0 &&
          now >= idleUntilRef.current &&
          Math.abs(blendRef.current) < 0.002
        ) {
          beginAmbient(now);
        } else if (
          ambientPhaseRef.current === "idle" &&
          idleUntilRef.current > now
        ) {
          timerMsRef.current = idleUntilRef.current - now;
        }
      }

      const returning =
        !pointerActiveRef.current && targetRef.current < blendRef.current - 0.0005;
      const lambda =
        authorityRef.current === "ambient"
          ? ambientFollowLambda
          : returning
            ? releaseLambda
            : approachLambda;

      blendRef.current = dampToward(
        blendRef.current,
        targetRef.current,
        dt,
        lambda,
      );

      if (Math.abs(blendRef.current - targetRef.current) < 0.0008) {
        blendRef.current = targetRef.current;
      }

      const params = poseParamsFromBlend(blendRef.current);
      const label =
        blendRef.current < 0.5 ? ("S1" as const) : ("S2" as const);
      const sample = sampleFromPoseParams(params, label);

      setSnap({
        blend: blendRef.current,
        targetBlend: targetRef.current,
        params,
        sample,
        active: pointerActiveRef.current,
        nx: nxRef.current,
        ny: nyRef.current,
        authority: authorityRef.current,
        ambientPhase: ambientPhaseRef.current,
        timerMs: timerMsRef.current,
        inViewport: inViewportRef.current,
        tabVisible: tabVisibleRef.current,
        finePointer: finePointerRef.current,
        reduced,
        joinLengths: joinLengthsFromSample(sample.joins),
        faceAreas: sample.faces.map((f) => ({
          id: f.id,
          signedArea: f.signedArea,
          render: f.render,
        })),
      });

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      lastTs.current = null;
    };
  }, [
    mode,
    scrub,
    reduced,
    enablePointer,
    enableAmbient,
    ambientFast,
    runtimeEnabled,
  ]);

  return snap;
}

function clamp01Local(v: number) {
  return Math.min(1, Math.max(0, v));
}
