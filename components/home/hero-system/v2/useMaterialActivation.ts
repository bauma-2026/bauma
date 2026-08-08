"use client";

import { useEffect, useRef, useState } from "react";

import {
  ACTIVATION_TIMING,
  easeOutCubic,
  easeOutQuad,
} from "./materialLock";
import type { MotionAuthority } from "./spatialShift";

export type ActivationDebug = {
  activation: number;
  target: number;
  pointerInField: boolean;
};

type Options = {
  pointerInField: boolean;
  poseAuthority: MotionAuthority;
  reduced: boolean;
  mobile: boolean;
  /**
   * Lab hold:
   * null = live
   * 0 = force rest
   * 1 = force active
   */
  forceActivation: number | null;
  /** When false, no material RAF (hidden/inactive branch). */
  runtimeEnabled?: boolean;
};

type LiveOpts = {
  pointerInField: boolean;
  poseAuthority: MotionAuthority;
  reduced: boolean;
  mobile: boolean;
  forceActivation: number | null;
  runtimeEnabled: boolean;
};

/**
 * Separate material authority — opacity scalar only.
 * Field interaction is the only interactive material authority.
 * Does not write pose or geometry.
 */
export function useMaterialActivation(opts: Options): {
  /** Read during pose-driven renders for frame-sync materials. */
  getActivation: () => number;
  debug: ActivationDebug;
} {
  const activationRef = useRef(0);
  const targetRef = useRef(0);
  const fromRef = useRef(0);
  const phaseStartRef = useRef(0);
  const phaseDurRef = useRef<number>(ACTIVATION_TIMING.enterMs);
  const enteringRef = useRef(true);
  const raf = useRef(0);
  const lastPublish = useRef(0);
  const liveRef = useRef<LiveOpts>({
    pointerInField: opts.pointerInField,
    poseAuthority: opts.poseAuthority,
    reduced: opts.reduced,
    mobile: opts.mobile,
    forceActivation: opts.forceActivation,
    runtimeEnabled: opts.runtimeEnabled !== false,
  });

  const [debug, setDebug] = useState<ActivationDebug>({
    activation: 0,
    target: 0,
    pointerInField: false,
  });

  useEffect(() => {
    liveRef.current = {
      pointerInField: opts.pointerInField,
      poseAuthority: opts.poseAuthority,
      reduced: opts.reduced,
      mobile: opts.mobile,
      forceActivation: opts.forceActivation,
      runtimeEnabled: opts.runtimeEnabled !== false,
    };
  }, [
    opts.pointerInField,
    opts.poseAuthority,
    opts.reduced,
    opts.mobile,
    opts.forceActivation,
    opts.runtimeEnabled,
  ]);

  useEffect(() => {
    if (opts.runtimeEnabled === false) {
      activationRef.current = 0;
      targetRef.current = 0;
      setDebug({ activation: 0, target: 0, pointerInField: false });
      return;
    }

    const retarget = (want: number, now: number) => {
      if (want === targetRef.current) return;
      fromRef.current = activationRef.current;
      phaseStartRef.current = now;
      enteringRef.current = want > targetRef.current;
      phaseDurRef.current = enteringRef.current
        ? ACTIVATION_TIMING.enterMs
        : ACTIVATION_TIMING.leaveMs;
      targetRef.current = want;
    };

    const settleToward = (want: number, ts: number) => {
      retarget(want, ts);
      const elapsed = ts - phaseStartRef.current;
      const u = Math.min(1, elapsed / Math.max(1, phaseDurRef.current));
      const e = enteringRef.current ? easeOutCubic(u) : easeOutQuad(u);
      activationRef.current =
        fromRef.current + (targetRef.current - fromRef.current) * e;
      if (u >= 1) activationRef.current = targetRef.current;
    };

    const tick = (ts: number) => {
      const live = liveRef.current;
      const force = live.forceActivation;

      if (live.mobile || live.reduced) {
        activationRef.current = 0;
        targetRef.current = 0;
      } else if (force != null) {
        settleToward(Math.min(1, Math.max(0, force)), ts);
      } else {
        // Ambient: never structural activation
        const want =
          live.pointerInField && live.poseAuthority !== "ambient" ? 1 : 0;
        settleToward(want, ts);
        if (live.poseAuthority === "ambient") {
          activationRef.current = 0;
        }
      }

      if (ts - lastPublish.current > 48) {
        lastPublish.current = ts;
        setDebug({
          activation: activationRef.current,
          target: targetRef.current,
          pointerInField: live.pointerInField,
        });
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [opts.runtimeEnabled]);

  return {
    getActivation: () => {
      if (!liveRef.current.runtimeEnabled) return 0;
      if (liveRef.current.mobile || liveRef.current.reduced) return 0;
      if (
        liveRef.current.poseAuthority === "ambient" &&
        liveRef.current.forceActivation == null
      ) {
        return 0;
      }
      return activationRef.current;
    },
    debug,
  };
}
