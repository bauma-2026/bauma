"use client";

import { useEffect, useRef, type RefObject } from "react";

import {
  createProximityRuntime,
  type ProximityRuntime,
  type ProximityRuntimeFrame,
} from "./createProximityRuntime";
import type { ProximityDebugSnapshot } from "./proximityModelV3";
import { V3_SPLIT } from "./proximityModelV3";

export type HeroProximityV3Metrics = {
  maxRaw: number;
  maxTarget: number;
  maxRendered: number;
  pressureEntered: boolean;
  sustainGatePassCount: number;
  deadbandSuppressionCount: number;
  earlyReleaseActivationCount: number;
  releaseToS0Ms: number;
  timeInMidpointBandMs: number;
  timeNearS1BoundaryMs: number;
  rafActiveDurationMs: number;
  idleRaf: boolean;
  listenerMountCount: number;
  finiteOk: boolean;
  fpsAvg: number;
};

export type HeroProximityV3Frame = {
  progress: number;
  debug: ProximityDebugSnapshot;
};

type Options = {
  enabled: boolean;
  reduced: boolean;
  hostRef: RefObject<HTMLElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  onFrame: (frame: HeroProximityV3Frame) => void;
  scrubProgress?: number | null;
};

function emptyMetrics(): HeroProximityV3Metrics {
  return {
    maxRaw: 0,
    maxTarget: 0,
    maxRendered: 0,
    pressureEntered: false,
    sustainGatePassCount: 0,
    deadbandSuppressionCount: 0,
    earlyReleaseActivationCount: 0,
    releaseToS0Ms: 0,
    timeInMidpointBandMs: 0,
    timeNearS1BoundaryMs: 0,
    rafActiveDurationMs: 0,
    idleRaf: false,
    listenerMountCount: 0,
    finiteOk: true,
    fpsAvg: 60,
  };
}

/**
 * Production V3 proximity — thin shell over shared createProximityRuntime.
 */
export function useHeroProximityV3(opts: Options) {
  const { enabled, reduced, hostRef, svgRef, onFrame, scrubProgress = null } =
    opts;

  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;
  const metricsRef = useRef(emptyMetrics());
  const runtimeRef = useRef<ProximityRuntime | null>(null);
  const wasEarlyRef = useRef(false);
  const sustainArmedRef = useRef(false);
  const releaseStartRef = useRef<number | null>(null);
  const rafStartedAtRef = useRef(0);

  useEffect(() => {
    metricsRef.current = emptyMetrics();
    metricsRef.current.listenerMountCount += 1;

    const runtime = createProximityRuntime({
      source: "home-v3",
      getSvg: () => svgRef.current,
      getHost: () => hostRef.current,
      onFrame: (frame: ProximityRuntimeFrame) => {
        const m = metricsRef.current;
        m.maxRaw = Math.max(m.maxRaw, frame.rawProximity);
        m.maxTarget = Math.max(m.maxTarget, frame.targetProgress);
        m.maxRendered = Math.max(m.maxRendered, frame.progress);
        m.fpsAvg = frame.fps;
        if (frame.progress > V3_SPLIT) m.pressureEntered = true;
        if (frame.deadbandSuppressed) m.deadbandSuppressionCount += 1;
        if (frame.earlyRelease && !wasEarlyRef.current) {
          m.earlyReleaseActivationCount += 1;
        }
        wasEarlyRef.current = frame.earlyRelease;
        if (
          !sustainArmedRef.current &&
          frame.sustainSec >= 0.18 &&
          !frame.sustainGateClamped
        ) {
          sustainArmedRef.current = true;
          m.sustainGatePassCount += 1;
        }
        if (frame.sustainSec < 0.01) sustainArmedRef.current = false;

        const mid = V3_SPLIT * 0.5;
        if (Math.abs(frame.progress - mid) < 0.06) {
          m.timeInMidpointBandMs += frame.dtSec * 1000;
        }
        if (Math.abs(frame.progress - V3_SPLIT) < 0.035) {
          m.timeNearS1BoundaryMs += frame.dtSec * 1000;
        }
        if (frame.targetProgress < 0.001 && frame.progress > 0.002) {
          if (releaseStartRef.current == null)
            releaseStartRef.current = frame.now;
        }
        if (frame.progress < 0.002 && releaseStartRef.current != null) {
          m.releaseToS0Ms = frame.now - releaseStartRef.current;
          releaseStartRef.current = null;
        }
        if (frame.rafActive && rafStartedAtRef.current === 0) {
          rafStartedAtRef.current = frame.now;
        }
        if (!frame.rafActive && rafStartedAtRef.current !== 0) {
          m.rafActiveDurationMs += frame.now - rafStartedAtRef.current;
          rafStartedAtRef.current = 0;
          m.idleRaf = false;
        }

        onFrameRef.current({
          progress: frame.progress,
          debug: {
            zone: frame.zone,
            rawProximity: frame.rawProximity,
            weightedProximity: frame.weightedProximity,
            heldRaw: frame.heldRaw,
            targetProgress: frame.targetProgress,
            renderedProgress: frame.progress,
            revealProgress:
              frame.progress <= V3_SPLIT ? frame.progress / V3_SPLIT : 1,
            pressureProgress:
              frame.progress <= V3_SPLIT
                ? 0
                : (frame.progress - V3_SPLIT) / (1 - V3_SPLIT),
            directionalMul: frame.directionalMul,
            earlyRelease: frame.earlyRelease,
            sustainSec: frame.sustainSec,
            deadbandSuppressed: frame.deadbandSuppressed,
            pressureGateClamped: frame.pressureGateClamped,
            sustainGateClamped: frame.sustainGateClamped,
            inputMode: frame.inputMode,
            rafActive: frame.rafActive,
            fps: frame.fps,
          },
        });

        try {
          (
            window as unknown as {
              __V3_P4_DEBUG__?: ProximityDebugSnapshot & {
                metrics: HeroProximityV3Metrics;
              };
            }
          ).__V3_P4_DEBUG__ = {
            zone: frame.zone,
            rawProximity: frame.rawProximity,
            weightedProximity: frame.weightedProximity,
            heldRaw: frame.heldRaw,
            targetProgress: frame.targetProgress,
            renderedProgress: frame.progress,
            revealProgress:
              frame.progress <= V3_SPLIT ? frame.progress / V3_SPLIT : 1,
            pressureProgress:
              frame.progress <= V3_SPLIT
                ? 0
                : (frame.progress - V3_SPLIT) / (1 - V3_SPLIT),
            directionalMul: frame.directionalMul,
            earlyRelease: frame.earlyRelease,
            sustainSec: frame.sustainSec,
            deadbandSuppressed: frame.deadbandSuppressed,
            pressureGateClamped: frame.pressureGateClamped,
            sustainGateClamped: frame.sustainGateClamped,
            inputMode: frame.inputMode,
            rafActive: frame.rafActive,
            fps: frame.fps,
            metrics: { ...m },
          };
        } catch {
          /* ignore */
        }
      },
    });

    runtimeRef.current = runtime;
    runtime.setEnabled(enabled);
    runtime.setReduced(reduced);
    runtime.setScrub(scrubProgress);
    runtime.mount();

    return () => {
      runtime.unmount();
      runtimeRef.current = null;
    };
    // Mount once per svg/host identity; enabled/reduced/scrub synced below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostRef, svgRef]);

  useEffect(() => {
    runtimeRef.current?.setEnabled(enabled);
  }, [enabled]);

  useEffect(() => {
    runtimeRef.current?.setReduced(reduced);
  }, [reduced]);

  useEffect(() => {
    runtimeRef.current?.setScrub(scrubProgress);
  }, [scrubProgress]);

  return {
    getMetrics: () => ({ ...metricsRef.current }),
    getProgress: () => runtimeRef.current?.getProgress() ?? 0,
  };
}
