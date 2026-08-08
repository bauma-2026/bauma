"use client";

import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import {
  createProximityRuntime,
  type ProximityRuntime,
  type ProximityRuntimeFrame,
} from "@/components/home/hero-system/v3/createProximityRuntime";
import type { ProximityGates } from "@/components/home/hero-system/v3/proximityModelV3";
import {
  LIVE_SPATIAL_SAMPLE,
  sampleFullSpatialPath,
  V3_REVEAL_PRESSURE_SPLIT,
  type FullPathFrame,
} from "@/components/home/hero-system/v3/spatialPathV3";

import type {
  EdgeVisId,
  StabilityId,
  TrafficId,
} from "./labSearchParams";

/** Lab lock labels — interaction authority lives in production runtime. */
export const EDGE_LOCK = {
  interaction: "I1" as const,
  split: "75/25" as const,
  splitValue: V3_REVEAL_PRESSURE_SPLIT,
  preResponse: "PR1" as const,
  directional: true,
  path: "P1" as const,
} as const;

export const STABILITY_LABELS: Record<StabilityId, string> = {
  E0: "E0 Current control",
  E1: "E1 Minimal deadband",
  E2: "E2 Deadband + hysteresis",
};

type StabilityConfig = {
  id: StabilityId;
  deadband: boolean;
  hysteresis: boolean;
  earlyRelease: boolean;
  sustainGate: boolean;
};

const STABILITY: Record<StabilityId, StabilityConfig> = {
  E0: {
    id: "E0",
    deadband: false,
    hysteresis: false,
    earlyRelease: false,
    sustainGate: false,
  },
  E1: {
    id: "E1",
    deadband: true,
    hysteresis: false,
    earlyRelease: true,
    sustainGate: true,
  },
  E2: {
    id: "E2",
    deadband: true,
    hysteresis: true,
    earlyRelease: true,
    sustainGate: true,
  },
};

/** Static Rest base lift (VB) — presentation only, not motion authority. */
const VB_BOOST = {
  front: 0.04,
  join: 0.02,
  rear: 0.015,
} as const;

export function vbMultipliers(vis: EdgeVisId) {
  if (vis === "V0") return { frontMul: 1, joinMul: 1, rearMul: 1, faceMul: 1 };
  return {
    frontMul: 1 + VB_BOOST.front,
    joinMul: 1 + VB_BOOST.join,
    rearMul: 1 + VB_BOOST.rear,
    faceMul: 1,
  };
}

type TrafficKey = { t: number; x: number; y: number };

const TRAFFIC_TRACES: Record<Exclude<TrafficId, "off">, TrafficKey[]> = {
  T0: [
    { t: 0, x: 780, y: 220 },
    { t: 0.8, x: 780, y: 220 },
    { t: 2.0, x: 520, y: 210 },
    { t: 3.2, x: 360, y: 205 },
    { t: 4.2, x: 250, y: 210 },
    { t: 5.2, x: 220, y: 212 },
    { t: 6.4, x: 400, y: 200 },
    { t: 7.8, x: 780, y: 220 },
    { t: 8.8, x: 780, y: 220 },
  ],
  T1: [
    { t: 0, x: 700, y: 380 },
    { t: 0.5, x: 700, y: 380 },
    { t: 1.4, x: 720, y: 160 },
    { t: 2.2, x: 740, y: -80 },
    { t: 3.2, x: 760, y: -160 },
  ],
  T2: [
    { t: 0, x: 820, y: -40 },
    { t: 0.5, x: 820, y: -40 },
    { t: 1.5, x: 300, y: -180 },
    { t: 2.4, x: -120, y: -40 },
    { t: 3.3, x: -300, y: 300 },
    { t: 4.0, x: -320, y: 320 },
  ],
  T3: [
    { t: 0, x: 560, y: 80 },
    { t: 0.8, x: 500, y: 60 },
    { t: 1.6, x: 470, y: 140 },
    { t: 2.4, x: 520, y: 200 },
    { t: 3.2, x: 480, y: 280 },
    { t: 4.0, x: 540, y: 320 },
    { t: 4.8, x: 500, y: 180 },
    { t: 5.6, x: 560, y: 100 },
    { t: 6.4, x: 600, y: 160 },
    { t: 7.2, x: 560, y: 80 },
  ],
  T4: [
    { t: 0, x: 820, y: 360 },
    { t: 1.0, x: 780, y: 300 },
    { t: 2.0, x: 840, y: 240 },
    { t: 3.0, x: 800, y: 180 },
    { t: 4.0, x: 860, y: 140 },
    { t: 5.0, x: 790, y: 220 },
    { t: 6.0, x: 830, y: 280 },
    { t: 7.0, x: 810, y: 340 },
  ],
  T5: [
    { t: 0, x: 800, y: 200 },
    { t: 0.25, x: 800, y: 200 },
    { t: 0.55, x: 240, y: 210 },
    { t: 0.85, x: -200, y: 230 },
    { t: 1.4, x: -280, y: 240 },
    { t: 2.2, x: -280, y: 240 },
  ],
};

function trafficPointAt(
  id: Exclude<TrafficId, "off">,
  timeSec: number,
): { x: number; y: number } {
  const trace = TRAFFIC_TRACES[id];
  if (timeSec <= trace[0].t) return { x: trace[0].x, y: trace[0].y };
  for (let i = 1; i < trace.length; i++) {
    if (timeSec <= trace[i].t) {
      const a = trace[i - 1];
      const b = trace[i];
      const u = (timeSec - a.t) / Math.max(1e-6, b.t - a.t);
      return {
        x: a.x + (b.x - a.x) * u,
        y: a.y + (b.y - a.y) * u,
      };
    }
  }
  const last = trace[trace.length - 1];
  return { x: last.x, y: last.y };
}

function trafficDuration(id: Exclude<TrafficId, "off">) {
  const t = TRAFFIC_TRACES[id];
  return t[t.length - 1].t;
}

const FALSE_ACTIVATION_THRESHOLD = 0.12 * 0.75;

export type EdgeMetrics = {
  stability: StabilityId;
  traffic: TrafficId;
  maxRaw: number;
  maxTarget: number;
  maxRendered: number;
  pressureEntered: boolean;
  timeAbovePr1Ms: number;
  timeAbove10RevealMs: number;
  timeAbove50RevealMs: number;
  timeInPressureMs: number;
  releaseToS0Ms: number;
  zoneTransitions: number;
  targetSignChanges: number;
  deadbandSuppressions: number;
  hysteresisHolds: number;
  falseActivation: boolean;
};

export function emptyMetrics(
  stability: StabilityId,
  traffic: TrafficId,
): EdgeMetrics {
  return {
    stability,
    traffic,
    maxRaw: 0,
    maxTarget: 0,
    maxRendered: 0,
    pressureEntered: false,
    timeAbovePr1Ms: 0,
    timeAbove10RevealMs: 0,
    timeAbove50RevealMs: 0,
    timeInPressureMs: 0,
    releaseToS0Ms: 0,
    zoneTransitions: 0,
    targetSignChanges: 0,
    deadbandSuppressions: 0,
    hysteresisHolds: 0,
    falseActivation: false,
  };
}

function scoreFalseActivation(m: EdgeMetrics, traffic: TrafficId): boolean {
  if (traffic === "T0" || traffic === "off") return false;
  if (m.pressureEntered) return true;
  if (traffic === "T5") return m.releaseToS0Ms > 400;
  if (traffic === "T3") return m.targetSignChanges > 14;
  if (m.maxRendered > FALSE_ACTIVATION_THRESHOLD) return true;
  return false;
}

export type EdgeDebug = {
  stability: StabilityId;
  vis: EdgeVisId;
  traffic: TrafficId;
  pointer: { x: number; y: number } | null;
  closest: { x: number; y: number } | null;
  dist: number;
  filteredDist: number;
  zone: string;
  rawZone: string;
  rawProximity: number;
  heldRaw: number;
  directionalMul: number;
  targetProgress: number;
  renderedProgress: number;
  revealProgress: number;
  pressureProgress: number;
  segment: string;
  deadbandSuppressed: boolean;
  earlyRelease: boolean;
  inputMode: "fine-pointer" | "coarse-pointer" | "reduced-motion" | "off";
  fps: number;
  metrics: EdgeMetrics;
};

export type EdgeSnapshot = {
  progress: number;
  geom: FullPathFrame;
  debug: EdgeDebug;
  frontTilted: { x: number; y: number }[];
  halfDiag: number;
};

type Options = {
  stability: StabilityId;
  vis: EdgeVisId;
  traffic: TrafficId;
  enabled: boolean;
  reduced: boolean;
  scrubProgress: number | null;
  svgRef: RefObject<SVGSVGElement | null>;
  heroInView: boolean;
  onMetrics?: (m: EdgeMetrics) => void;
};

function emptyDebug(
  stability: StabilityId,
  vis: EdgeVisId,
  traffic: TrafficId,
): EdgeDebug {
  return {
    stability,
    vis,
    traffic,
    pointer: null,
    closest: null,
    dist: 0,
    filteredDist: 0,
    zone: "Z0",
    rawZone: "Z0",
    rawProximity: 0,
    heldRaw: 0,
    directionalMul: 1,
    targetProgress: 0,
    renderedProgress: 0,
    revealProgress: 0,
    pressureProgress: 0,
    segment: "rest",
    deadbandSuppressed: false,
    earlyRelease: false,
    inputMode: "fine-pointer",
    fps: 60,
    metrics: emptyMetrics(stability, traffic),
  };
}

/**
 * Lab edge-context shell — production createProximityRuntime +
 * sampleFullSpatialPath. Lab-only: traffic traces, metrics, stability gates.
 */
export function useEdgeContextInteraction(opts: Options): EdgeSnapshot {
  const {
    stability,
    vis,
    traffic,
    enabled,
    reduced,
    scrubProgress,
    svgRef,
    heroInView,
    onMetrics,
  } = opts;

  const split = EDGE_LOCK.splitValue;
  const cfg = STABILITY[stability];

  const [snap, setSnap] = useState<EdgeSnapshot>(() => ({
    progress: 0,
    geom: sampleFullSpatialPath(0, LIVE_SPATIAL_SAMPLE),
    frontTilted: [],
    halfDiag: 120,
    debug: emptyDebug(stability, vis, traffic),
  }));

  const runtimeRef = useRef<ProximityRuntime | null>(null);
  const trafficStartRef = useRef<number | null>(null);
  const metricsDoneRef = useRef(false);
  const metricsRef = useRef(emptyMetrics(stability, traffic));
  const lastZoneRef = useRef("Z0");
  const lastTargetRef = useRef(0);
  const lastSignRef = useRef(0);
  const midReleaseStartRef = useRef<number | null>(null);
  const lastPublishKeyRef = useRef(Number.NaN);
  const heroInViewRef = useRef(heroInView);
  heroInViewRef.current = heroInView;
  const trafficRef = useRef(traffic);
  trafficRef.current = traffic;
  const stabilityRef = useRef(stability);
  stabilityRef.current = stability;
  const visRef = useRef(vis);
  visRef.current = vis;
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;
  const onMetricsRef = useRef(onMetrics);
  onMetricsRef.current = onMetrics;

  useEffect(() => {
    metricsRef.current = emptyMetrics(stability, traffic);
    metricsDoneRef.current = false;
    midReleaseStartRef.current = null;
    lastZoneRef.current = "Z0";
    lastTargetRef.current = 0;
    lastSignRef.current = 0;
    if (traffic !== "off") trafficStartRef.current = performance.now();
    else trafficStartRef.current = null;
    runtimeRef.current?.hardReset();
    if (traffic !== "off") runtimeRef.current?.ensureRaf();
  }, [stability, traffic]);

  useEffect(() => {
    const runtime = createProximityRuntime({
      source: "lab-edge",
      getSvg: () => svgRef.current,
      getHeroInView: () => heroInViewRef.current,
      useIntersectionObserver: false,
      getGates: (): ProximityGates => ({
        deadband: cfgRef.current.deadband,
        sustainGate: cfgRef.current.sustainGate,
        earlyRelease: cfgRef.current.earlyRelease,
        hysteresis: cfgRef.current.hysteresis,
      }),
      shouldHoldRaf: () => trafficRef.current !== "off",
      getPointerOverride: (now) => {
        const t = trafficRef.current;
        if (t === "off" || trafficStartRef.current == null) return undefined;
        const tSec = (now - trafficStartRef.current) / 1000;
        const dur = trafficDuration(t);
        if (tSec >= dur) return null;
        return trafficPointAt(t, tSec);
      },
      onFrame: (frame: ProximityRuntimeFrame) => {
        const t = trafficRef.current;
        const m = metricsRef.current;
        const progress = frame.progress;
        const target = frame.targetProgress;
        const zone = frame.zone;

        if (t !== "off" && !metricsDoneRef.current) {
          m.maxRaw = Math.max(m.maxRaw, frame.rawProximity);
          m.maxTarget = Math.max(m.maxTarget, target);
          m.maxRendered = Math.max(m.maxRendered, progress);
          if (progress > split) m.pressureEntered = true;
          const revealP = progress <= split ? progress / split : 1;
          if (progress > 0.03) m.timeAbovePr1Ms += frame.dtSec * 1000;
          if (revealP > 0.1) m.timeAbove10RevealMs += frame.dtSec * 1000;
          if (revealP > 0.5) m.timeAbove50RevealMs += frame.dtSec * 1000;
          if (progress > split) m.timeInPressureMs += frame.dtSec * 1000;
          if (frame.deadbandSuppressed) m.deadbandSuppressions += 1;
          if (cfgRef.current.hysteresis && zone !== frame.rawZone) {
            m.hysteresisHolds += 1;
          }

          if (zone !== lastZoneRef.current) {
            m.zoneTransitions += 1;
            lastZoneRef.current = zone;
          }
          const sign = Math.sign(target - lastTargetRef.current);
          if (
            sign !== 0 &&
            sign !== lastSignRef.current &&
            lastSignRef.current !== 0
          ) {
            m.targetSignChanges += 1;
          }
          if (sign !== 0) lastSignRef.current = sign;
          lastTargetRef.current = target;

          if (target < 0.001 && progress > 0.002) {
            if (midReleaseStartRef.current == null) {
              midReleaseStartRef.current = frame.now;
            }
          }
          if (progress < 0.002 && midReleaseStartRef.current != null) {
            m.releaseToS0Ms = frame.now - midReleaseStartRef.current;
            midReleaseStartRef.current = null;
          }

          const tSec =
            trafficStartRef.current != null
              ? (frame.now - trafficStartRef.current) / 1000
              : 0;
          const dur = trafficDuration(t);
          if (
            tSec >= dur &&
            !metricsDoneRef.current &&
            (progress < 0.002 || tSec >= dur + 2.8)
          ) {
            metricsDoneRef.current = true;
            m.falseActivation = scoreFalseActivation(m, t);
            const clone = structuredClone(m);
            try {
              (
                window as unknown as { __EDGE_METRICS__?: EdgeMetrics }
              ).__EDGE_METRICS__ = clone;
            } catch {
              /* ignore */
            }
            onMetricsRef.current?.(clone);
          }
        }

        const publishKey =
          Math.round(progress * 4000) * 1_000_000 +
          zone.charCodeAt(1) * 100 +
          Math.round(Math.min(999, frame.filteredDist));
        if (publishKey === lastPublishKeyRef.current) return;
        lastPublishKeyRef.current = publishKey;

        const geom = sampleFullSpatialPath(progress, LIVE_SPATIAL_SAMPLE);
        const seg =
          progress <= 1e-4
            ? "rest"
            : progress <= split
              ? "reveal"
              : "pressure";

        setSnap({
          progress,
          geom,
          frontTilted: frame.poly,
          halfDiag: frame.halfDiag,
          debug: {
            stability: stabilityRef.current,
            vis: visRef.current,
            traffic: t,
            pointer: frame.pointer,
            closest: frame.closest,
            dist: frame.dist,
            filteredDist: frame.filteredDist,
            zone: frame.zone,
            rawZone: frame.rawZone,
            rawProximity: frame.rawProximity,
            heldRaw: frame.heldRaw,
            directionalMul: frame.directionalMul,
            targetProgress: frame.targetProgress,
            renderedProgress: progress,
            revealProgress:
              progress <= split ? progress / Math.max(1e-6, split) : 1,
            pressureProgress:
              progress <= split
                ? 0
                : (progress - split) / Math.max(1e-6, 1 - split),
            segment: seg,
            deadbandSuppressed: frame.deadbandSuppressed,
            earlyRelease: frame.earlyRelease,
            inputMode: frame.inputMode,
            fps: frame.fps,
            metrics: { ...m },
          },
        });
      },
    });

    runtimeRef.current = runtime;
    runtime.setEnabled(enabled);
    runtime.setReduced(reduced);
    runtime.setScrub(scrubProgress);
    runtime.mount();
    if (traffic !== "off") runtime.ensureRaf();

    return () => {
      runtime.unmount();
      runtimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgRef]);

  useEffect(() => {
    runtimeRef.current?.setEnabled(enabled);
  }, [enabled]);

  useEffect(() => {
    runtimeRef.current?.setReduced(reduced);
  }, [reduced]);

  useEffect(() => {
    runtimeRef.current?.setScrub(scrubProgress);
  }, [scrubProgress]);

  return snap;
}
