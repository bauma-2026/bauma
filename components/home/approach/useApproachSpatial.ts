"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { StructuralState } from "./constants";
import {
  REST_TENSION,
  TENSION,
  ZONE_CONFIG,
  clientToViewBox,
  computeTensionTarget,
  resolveZoneCandidate,
  type TensionSample,
  type ZoneId,
} from "./approachZones";

export type ZoneStateChange = {
  state: StructuralState;
  /** Calmer settle back to B02 */
  release?: boolean;
};

type Options = {
  enabled: boolean;
  reducedMotion: boolean;
  navOwns: boolean;
  onZoneState: (change: ZoneStateChange) => void;
};

type DebugSnapshot = {
  candidate: ZoneId;
  strength: number;
  kind: TensionSample["kind"];
  committed: StructuralState;
  navOwns: boolean;
};

function dampToward(
  current: number,
  target: number,
  dt: number,
  tau: number,
) {
  const k = 1 - Math.exp(-dt / Math.max(tau, 0.001));
  return current + (target - current) * k;
}

function dampSample(
  current: TensionSample,
  target: TensionSample,
  dt: number,
): TensionSample {
  const building = target.strength >= current.strength;
  const tau = building ? TENSION.onsetTau : TENSION.returnTau;
  return {
    strength: dampToward(current.strength, target.strength, dt, tau),
    kind: target.strength > 0.02 ? target.kind : current.kind,
    noiseFlee: {
      x: dampToward(current.noiseFlee.x, target.noiseFlee.x, dt, tau),
      y: dampToward(current.noiseFlee.y, target.noiseFlee.y, dt, tau),
    },
    purposeAttract: {
      x: dampToward(
        current.purposeAttract.x,
        target.purposeAttract.x,
        dt,
        tau,
      ),
      y: dampToward(
        current.purposeAttract.y,
        target.purposeAttract.y,
        dt,
        tau,
      ),
    },
    noiseEdgeMul: dampToward(
      current.noiseEdgeMul,
      target.noiseEdgeMul,
      dt,
      tau,
    ),
    purposeEdgeMul: dampToward(
      current.purposeEdgeMul,
      target.purposeEdgeMul,
      dt,
      tau,
    ),
    peripheralMul: dampToward(
      current.peripheralMul,
      target.peripheralMul,
      dt,
      tau,
    ),
  };
}

/**
 * Graphic-local spatial interaction:
 * proximity → damped local tension → threshold state → calm release.
 */
export function useApproachSpatial({
  enabled,
  reducedMotion,
  navOwns,
  onZoneState,
}: Options) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const currentRef = useRef<StructuralState>("02");
  const pendingRef = useRef<StructuralState | null>(null);
  const timerRef = useRef<number | null>(null);
  const navOwnsRef = useRef(navOwns);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const tensionRef = useRef<TensionSample>({ ...REST_TENSION });
  const targetRef = useRef<TensionSample>({ ...REST_TENSION });
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const [tension, setTension] = useState<TensionSample>(REST_TENSION);
  const [inside, setInside] = useState(false);
  const [debug, setDebug] = useState<DebugSnapshot>({
    candidate: null,
    strength: 0,
    kind: "none",
    committed: "02",
    navOwns: false,
  });

  useEffect(() => {
    navOwnsRef.current = navOwns;
    if (navOwns) {
      targetRef.current = REST_TENSION;
    }
  }, [navOwns]);

  const clearPending = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    pendingRef.current = null;
  }, []);

  const commitZone = useCallback(
    (next: StructuralState, release = false) => {
      if (currentRef.current === next && !release) return;
      currentRef.current = next;
      // Clear temporary tension into the state morph
      targetRef.current = REST_TENSION;
      onZoneState({ state: next, release });
    },
    [onZoneState],
  );

  const tick = useCallback(
    (ts: number) => {
      const last = lastTsRef.current ?? ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      lastTsRef.current = ts;

      const next = dampSample(tensionRef.current, targetRef.current, dt);
      tensionRef.current = next;
      setTension(next);
      setDebug((d) => ({
        ...d,
        strength: next.strength,
        kind: next.kind,
        committed: currentRef.current,
        navOwns: navOwnsRef.current,
      }));

      const stillMoving =
        Math.abs(next.strength - targetRef.current.strength) > 0.004 ||
        Math.hypot(
          next.noiseFlee.x - targetRef.current.noiseFlee.x,
          next.noiseFlee.y - targetRef.current.noiseFlee.y,
        ) > 0.05 ||
        Math.hypot(
          next.purposeAttract.x - targetRef.current.purposeAttract.x,
          next.purposeAttract.y - targetRef.current.purposeAttract.y,
        ) > 0.05;

      if (stillMoving || targetRef.current.strength > 0.01) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        lastTsRef.current = null;
        if (next.strength > 0) {
          tensionRef.current = REST_TENSION;
          setTension(REST_TENSION);
        }
      }
    },
    [],
  );

  const ensureRaf = useCallback(() => {
    if (rafRef.current === null) {
      lastTsRef.current = null;
      rafRef.current = window.requestAnimationFrame(tick);
    }
  }, [tick]);

  const evaluate = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg || !enabled || navOwnsRef.current) return;

      const pt = clientToViewBox(clientX, clientY, svg);
      pointerRef.current = pt;

      const candidate = resolveZoneCandidate(pt.x, pt.y);
      setDebug((d) => ({ ...d, candidate }));

      // Pre-response only while B02 is committed and motion is allowed
      if (!reducedMotion) {
        targetRef.current = computeTensionTarget(
          pt,
          currentRef.current,
          true,
        );
        ensureRaf();
      } else {
        targetRef.current = REST_TENSION;
      }

      if (candidate === null) {
        clearPending();
        if (currentRef.current !== "02") {
          commitZone("02", true);
        }
        return;
      }

      if (candidate === currentRef.current) {
        clearPending();
        return;
      }

      if (pendingRef.current !== candidate) {
        clearPending();
        pendingRef.current = candidate;
        timerRef.current = window.setTimeout(() => {
          if (
            pendingRef.current === candidate &&
            !navOwnsRef.current
          ) {
            // Hand off: clear tension into morph
            targetRef.current = REST_TENSION;
            ensureRaf();
            commitZone(candidate, false);
          }
          pendingRef.current = null;
          timerRef.current = null;
        }, ZONE_CONFIG.hysteresisMs);
      }
    },
    [enabled, reducedMotion, clearPending, commitZone, ensureRaf],
  );

  const onPointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!enabled || event.pointerType !== "mouse") return;
      setInside(true);
      evaluate(event.clientX, event.clientY);
    },
    [enabled, evaluate],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!enabled || event.pointerType !== "mouse") return;
      evaluate(event.clientX, event.clientY);
    },
    [enabled, evaluate],
  );

  const onPointerLeave = useCallback(() => {
    setInside(false);
    pointerRef.current = null;
    targetRef.current = REST_TENSION;
    ensureRaf();
    clearPending();
    setDebug((d) => ({ ...d, candidate: null }));
    if (!navOwnsRef.current) {
      const release = currentRef.current !== "02";
      currentRef.current = "02";
      onZoneState({ state: "02", release });
    }
  }, [clearPending, ensureRaf, onZoneState]);

  const syncExternal = useCallback(
    (state: StructuralState) => {
      currentRef.current = state;
      clearPending();
      targetRef.current = REST_TENSION;
      ensureRaf();
      setDebug((d) => ({
        ...d,
        committed: state,
        strength: 0,
        kind: "none",
      }));
    },
    [clearPending, ensureRaf],
  );

  useEffect(
    () => () => {
      clearPending();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    },
    [clearPending],
  );

  return {
    svgRef,
    tension,
    debug,
    inside,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    syncExternal,
  };
}
