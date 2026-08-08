"use client";

import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { StructuralState } from "./constants";
import {
  AMBIENT_CYCLE_TIMING,
  AMBIENT_CYCLE_TIMING_FAST,
  VARIANT_LEAD,
  ambientReturnEase,
  ambientShiftEase,
  ambientStrengthFromPose,
  getB02APose,
  getVariantPose,
  interpolatePose,
  randIn,
  type AmbientDebug,
  type AmbientPhase,
  type AmbientPose,
  type AmbientVariant,
  type AuthorityMode,
} from "./approachAmbient";
import type { PoseDriver } from "./approachPoseDriver";

type Options = {
  sectionRef: RefObject<HTMLElement | null>;
  driver: PoseDriver;
  reducedMotion: boolean;
  enabled: boolean;
  committed: StructuralState;
  objectInside: boolean;
  navOwns: boolean;
  morphBusy: boolean;
  tensionStrength: number;
  zoneCandidate: "01" | "02" | "03" | null;
  /** True while section is driving a Framer state morph */
  stateMorphActive: boolean;
  fast?: boolean;
  forceHold?: "B" | "C" | null;
};

function suppressReason(opts: {
  enabled: boolean;
  reducedMotion: boolean;
  committed: StructuralState;
  objectInside: boolean;
  navOwns: boolean;
  morphBusy: boolean;
  tensionStrength: number;
  zoneCandidate: "01" | "02" | "03" | null;
  stateMorphActive: boolean;
  inView: boolean;
  visible: boolean;
  settled: boolean;
}): string | null {
  if (!opts.enabled) return "mobile";
  if (opts.reducedMotion) return "reduced-motion";
  if (opts.committed !== "02") return "state";
  if (opts.navOwns) return "nav";
  if (opts.objectInside) return "pointer";
  if (opts.zoneCandidate === "01" || opts.zoneCandidate === "03") return "zone";
  if (opts.morphBusy || opts.stateMorphActive) return "morph";
  if (opts.tensionStrength > 0.02) return "tension";
  if (!opts.inView) return "offscreen";
  if (!opts.visible) return "hidden-tab";
  if (!opts.settled) return "settle";
  return null;
}

/**
 * Single-clock B02 ambient: one progress p drives the full pose.
 * Applies via PoseDriver.applyInstant — never through Framer.
 */
export function useApproachAmbient({
  sectionRef,
  driver,
  reducedMotion,
  enabled,
  committed,
  objectInside,
  navOwns,
  morphBusy,
  tensionStrength,
  zoneCandidate,
  stateMorphActive,
  fast = false,
  forceHold = null,
}: Options) {
  const timing = fast ? AMBIENT_CYCLE_TIMING_FAST : AMBIENT_CYCLE_TIMING;

  const [debug, setDebug] = useState<AmbientDebug>({
    authority: "rest",
    phase: "off",
    variant: "A",
    rawProgress: 0,
    easedProgress: 0,
    framerActive: false,
    ambientStrength: 0,
    suppressReason: null,
    leadNode: null,
  });

  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const nextVariantRef = useRef<"B" | "C">("B");
  const inViewRef = useRef(false);
  const visibleRef = useRef(
    typeof document === "undefined" || document.visibilityState === "visible",
  );
  const settledRef = useRef(false);
  const interactedRef = useRef(false);
  const scheduleGenRef = useRef(0);

  /** Authoritative ambient progress 0 = A, 1 = full variant */
  const progressRef = useRef(0);
  const variantRef = useRef<"B" | "C">("B");
  const phaseRef = useRef<AmbientPhase>("off");
  const authorityRef = useRef<AuthorityMode>("rest");
  const fromPoseRef = useRef<AmbientPose>(getB02APose());
  const toPoseRef = useRef<AmbientPose>(getVariantPose("B"));

  const optsRef = useRef({
    enabled,
    reducedMotion,
    committed,
    objectInside,
    navOwns,
    morphBusy,
    tensionStrength,
    zoneCandidate,
    stateMorphActive,
  });
  optsRef.current = {
    enabled,
    reducedMotion,
    committed,
    objectInside,
    navOwns,
    morphBusy,
    tensionStrength,
    zoneCandidate,
    stateMorphActive,
  };

  const getReason = () =>
    suppressReason({
      ...optsRef.current,
      inView: inViewRef.current,
      visible: visibleRef.current,
      settled: settledRef.current,
    });

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearRaf = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const debugFrameRef = useRef(0);
  const lastDebugPhaseRef = useRef<AmbientPhase>("off");
  const publishDebug = (
    partial: Partial<AmbientDebug> & {
      phase: AmbientPhase;
      authority: AuthorityMode;
    },
    force = false,
  ) => {
    const phaseChanged = partial.phase !== lastDebugPhaseRef.current;
    phaseRef.current = partial.phase;
    authorityRef.current = partial.authority;
    lastDebugPhaseRef.current = partial.phase;
    debugFrameRef.current += 1;
    // Geometry rides MotionValues — throttle React debug updates
    if (!force && !phaseChanged && debugFrameRef.current % 3 !== 0) return;
    setDebug((d) => ({
      ...d,
      framerActive: driver.isFramerAnimating(),
      ...partial,
    }));
  };

  const applyProgress = (
    raw: number,
    ease: (t: number) => number,
    from: AmbientPose,
    to: AmbientPose,
  ) => {
    const p = Math.min(1, Math.max(0, raw));
    progressRef.current = p;
    const eased = ease(p);
    const pose = interpolatePose(from, to, eased);
    driver.applyInstant(pose);
    return { p, eased, pose };
  };

  const freezeAt = (
    pose: AmbientPose,
    phase: AmbientPhase,
    authority: AuthorityMode,
    variant: AmbientVariant,
    raw: number,
    eased: number,
    reason: string | null,
  ) => {
    clearRaf();
    driver.applyInstant(pose);
    progressRef.current = raw;
    publishDebug({
      authority,
      phase,
      variant,
      rawProgress: raw,
      easedProgress: eased,
      ambientStrength:
        variant === "A"
          ? 0
          : ambientStrengthFromPose(pose, variant === "B" ? "B" : "C"),
      suppressReason: reason,
      leadNode: variant === "A" ? null : VARIANT_LEAD[variant],
      framerActive: false,
    });
  };

  const cancelAmbient = (handoffToMorph: boolean) => {
    clearTimer();
    clearRaf();
    scheduleGenRef.current += 1;
    activeRef.current = false;
    const reason = getReason();
    const current = driver.readPose();
    const variant = variantRef.current;
    const pNow = progressRef.current;

    if (handoffToMorph) {
      // Leave geometry exactly where it is — Framer state morph takes over
      authorityRef.current = "handoff";
      phaseRef.current = "suppressed";
      publishDebug({
        authority: "handoff",
        phase: "suppressed",
        variant: pNow > 0.02 ? variant : "A",
        rawProgress: pNow,
        easedProgress: pNow,
        ambientStrength: ambientStrengthFromPose(current, variant),
        suppressReason: reason,
        leadNode: VARIANT_LEAD[variant],
        framerActive: false,
      });
      progressRef.current = 0;
      return;
    }

    // Stay on B02 — single-clock return from current pose to A
    if (pNow < 0.01) {
      freezeAt(getB02APose(), reason ? "suppressed" : "idle", "rest", "A", 0, 0, reason);
      return;
    }

    activeRef.current = true;
    const from = current;
    const to = getB02APose();
    fromPoseRef.current = from;
    toPoseRef.current = to;
    const start = performance.now();
    const dur = timing.cancelMs;
    // Map cancel as return segment: interpolate(from, A, returnEase(t))
    // Use raw t 0→1 with from=current, to=A
    publishDebug({
      authority: "ambient",
      phase: "cancel",
      variant,
      rawProgress: pNow,
      easedProgress: pNow,
      ambientStrength: ambientStrengthFromPose(from, variant),
      suppressReason: reason,
      leadNode: VARIANT_LEAD[variant],
      framerActive: false,
    });

    const tick = (now: number) => {
      if (optsRef.current.stateMorphActive || optsRef.current.navOwns) {
        // Morph took over mid-cancel
        clearRaf();
        activeRef.current = false;
        authorityRef.current = "handoff";
        return;
      }
      const t = Math.min(1, (now - start) / dur);
      const { p, eased, pose } = applyProgress(
        t,
        ambientReturnEase,
        from,
        to,
      );
      publishDebug({
        authority: "ambient",
        phase: "cancel",
        variant,
        rawProgress: p,
        easedProgress: eased,
        ambientStrength: ambientStrengthFromPose(pose, variant) * (1 - eased),
        suppressReason: getReason(),
        leadNode: VARIANT_LEAD[variant],
        framerActive: false,
      });
      if (t < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        activeRef.current = false;
        progressRef.current = 0;
        freezeAt(
          getB02APose(),
          getReason() ? "suppressed" : "idle",
          "rest",
          "A",
          0,
          0,
          getReason(),
        );
      }
    };
    rafRef.current = window.requestAnimationFrame(tick);
  };

  const runCycle = (variant: "B" | "C") => {
    if (activeRef.current || getReason()) return;
    clearTimer();
    clearRaf();
    driver.stopAnimations();
    activeRef.current = true;
    variantRef.current = variant;

    const shiftMs = randIn(timing.shiftMs);
    const holdMs = randIn(timing.holdMs);
    const returnMs = randIn(timing.returnMs);

    const fromA = getB02APose();
    const toV = getVariantPose(variant);
    fromPoseRef.current = fromA;
    toPoseRef.current = toV;
    progressRef.current = 0;
    driver.applyInstant(fromA);

    const shiftStart = performance.now();
    publishDebug({
      authority: "ambient",
      phase: "shift",
      variant,
      rawProgress: 0,
      easedProgress: 0,
      ambientStrength: 0,
      suppressReason: null,
      leadNode: VARIANT_LEAD[variant],
      framerActive: false,
    });

    const shiftTick = (now: number) => {
      if (getReason()) {
        cancelAmbient(optsRef.current.navOwns || optsRef.current.committed !== "02");
        return;
      }
      const t = (now - shiftStart) / shiftMs;
      if (t >= 1) {
        progressRef.current = 1;
        freezeAt(toV, "hold", "ambient", variant, 1, 1, null);
        activeRef.current = true; // hold is active cycle, but no rAF
        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;
          if (getReason()) {
            cancelAmbient(
              optsRef.current.navOwns || optsRef.current.committed !== "02",
            );
            return;
          }
          startReturn(variant, returnMs);
        }, holdMs);
        return;
      }
      const { p, eased, pose } = applyProgress(
        t,
        ambientShiftEase,
        fromA,
        toV,
      );
      publishDebug({
        authority: "ambient",
        phase: "shift",
        variant,
        rawProgress: p,
        easedProgress: eased,
        ambientStrength: ambientStrengthFromPose(pose, variant),
        suppressReason: null,
        leadNode: VARIANT_LEAD[variant],
        framerActive: false,
      });
      rafRef.current = window.requestAnimationFrame(shiftTick);
    };

    rafRef.current = window.requestAnimationFrame(shiftTick);
  };

  const startReturn = (variant: "B" | "C", returnMs: number) => {
    clearRaf();
    activeRef.current = true;
    // Begin from exact currently rendered pose (should be full variant)
    const from = driver.readPose();
    const to = getB02APose();
    fromPoseRef.current = from;
    toPoseRef.current = to;
    const returnStart = performance.now();

    publishDebug({
      authority: "ambient",
      phase: "return",
      variant,
      rawProgress: 0,
      easedProgress: 0,
      ambientStrength: ambientStrengthFromPose(from, variant),
      suppressReason: null,
      leadNode: VARIANT_LEAD[variant],
      framerActive: false,
    });

    const returnTick = (now: number) => {
      if (getReason()) {
        cancelAmbient(optsRef.current.navOwns || optsRef.current.committed !== "02");
        return;
      }
      const t = (now - returnStart) / returnMs;
      if (t >= 1) {
        activeRef.current = false;
        progressRef.current = 0;
        freezeAt(getB02APose(), "idle", "rest", "A", 0, 0, null);
        nextVariantRef.current = variant === "B" ? "C" : "B";
        scheduleNext("idle");
        return;
      }
      // return: interpolate(variantPose, A, returnEase(t))
      const { p, eased, pose } = applyProgress(
        t,
        ambientReturnEase,
        from,
        to,
      );
      publishDebug({
        authority: "ambient",
        phase: "return",
        variant,
        rawProgress: p,
        easedProgress: eased,
        ambientStrength: ambientStrengthFromPose(pose, variant),
        suppressReason: null,
        leadNode: VARIANT_LEAD[variant],
        framerActive: false,
      });
      rafRef.current = window.requestAnimationFrame(returnTick);
    };
    rafRef.current = window.requestAnimationFrame(returnTick);
  };

  const scheduleNext = (kind: "initial" | "idle" | "calm") => {
    clearTimer();
    scheduleGenRef.current += 1;
    const gen = scheduleGenRef.current;
    const reason = getReason();
    if (reason) {
      publishDebug({
        authority: "rest",
        phase: "suppressed",
        variant: "A",
        rawProgress: 0,
        easedProgress: 0,
        ambientStrength: 0,
        suppressReason: reason,
        leadNode: null,
        framerActive: driver.isFramerAnimating(),
      });
      return;
    }

    const delay =
      kind === "calm"
        ? randIn(timing.postInteractionCalmMs) + randIn(timing.idleMs) * 0.15
        : randIn(timing.idleMs);

    publishDebug({
      authority: "rest",
      phase: "idle",
      variant: "A",
      rawProgress: 0,
      easedProgress: 0,
      ambientStrength: 0,
      suppressReason: null,
      leadNode: null,
      framerActive: false,
    });

    timerRef.current = window.setTimeout(() => {
      if (gen !== scheduleGenRef.current) return;
      timerRef.current = null;
      if (getReason()) {
        publishDebug({
          authority: "rest",
          phase: "suppressed",
          variant: "A",
          rawProgress: 0,
          easedProgress: 0,
          ambientStrength: 0,
          suppressReason: getReason(),
          leadNode: null,
          framerActive: false,
        });
        return;
      }
      runCycle(nextVariantRef.current);
    }, delay);
  };

  // Force-hold screenshots
  useEffect(() => {
    if (!forceHold) return;
    clearTimer();
    clearRaf();
    activeRef.current = false;
    variantRef.current = forceHold;
    progressRef.current = 1;
    const pose = getVariantPose(forceHold);
    freezeAt(pose, "hold", "ambient", forceHold, 1, 1, null);
    return () => {
      freezeAt(getB02APose(), "off", "rest", "A", 0, 0, null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceHold]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current =
          !!entry?.isIntersecting && (entry.intersectionRatio ?? 0) > 0.2;
        window.dispatchEvent(new Event("approach-ambient-tick"));
      },
      { threshold: [0, 0.2, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef]);

  const [envTick, setEnvTick] = useState(0);
  useEffect(() => {
    const bump = () => setEnvTick((n) => n + 1);
    const onVis = () => {
      visibleRef.current = document.visibilityState === "visible";
      bump();
    };
    onVis();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("approach-ambient-tick", bump);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("approach-ambient-tick", bump);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !enabled || forceHold) {
      settledRef.current = false;
      return;
    }
    settledRef.current = false;
    const id = window.setTimeout(() => {
      settledRef.current = true;
      setEnvTick((n) => n + 1);
    }, timing.settleMs);
    return () => window.clearTimeout(id);
  }, [reducedMotion, enabled, timing.settleMs, fast, forceHold]);

  useEffect(() => {
    if (forceHold) return;

    if (!enabled || reducedMotion) {
      clearTimer();
      scheduleGenRef.current += 1;
      clearRaf();
      activeRef.current = false;
      progressRef.current = 0;
      freezeAt(
        getB02APose(),
        "off",
        "rest",
        "A",
        0,
        0,
        !enabled ? "mobile" : "reduced-motion",
      );
      return;
    }

    const reason = getReason();
    if (reason) {
      interactedRef.current = true;
      const handoff =
        optsRef.current.navOwns ||
        optsRef.current.committed !== "02" ||
        optsRef.current.stateMorphActive;
      if (activeRef.current || progressRef.current > 0.01 || phaseRef.current === "hold") {
        cancelAmbient(handoff);
      } else {
        publishDebug({
          authority: optsRef.current.stateMorphActive ? "stateMorph" : "rest",
          phase: "suppressed",
          variant: "A",
          rawProgress: 0,
          easedProgress: 0,
          ambientStrength: 0,
          suppressReason: reason,
          leadNode: null,
          framerActive: driver.isFramerAnimating(),
        });
      }
      return;
    }

    if (!activeRef.current && timerRef.current === null) {
      // Ensure exact A before scheduling
      if (progressRef.current !== 0) {
        freezeAt(getB02APose(), "idle", "rest", "A", 0, 0, null);
      }
      scheduleNext(interactedRef.current ? "calm" : "initial");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    reducedMotion,
    committed,
    objectInside,
    navOwns,
    morphBusy,
    tensionStrength,
    zoneCandidate,
    stateMorphActive,
    envTick,
    forceHold,
  ]);

  useEffect(
    () => () => {
      clearTimer();
      clearRaf();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const displayVariant: AmbientVariant =
    debug.phase === "shift" ||
    debug.phase === "hold" ||
    debug.phase === "return" ||
    debug.phase === "cancel"
      ? debug.variant
      : "A";

  return {
    debug,
    phase: debug.phase,
    variant: displayVariant,
    authority: debug.authority,
  };
}
