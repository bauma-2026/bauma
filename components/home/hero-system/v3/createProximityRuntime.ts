/**
 * Shared production-safe proximity runtime core.
 *
 * One RAF lifecycle, one pointer enter/leave model, one tickProximity step.
 * Home and lab edge-context both mount this — lab adds only traffic/metrics/UI.
 */

import { V3_CANVAS, type Point } from "./geometryV3";
import {
  buildStaticS0FrontTilted,
  clientToViewBox,
  halfDiagFromPoly,
  tickProximity,
  V3_SPLIT,
  type ProximityGates,
  type ZoneId,
} from "./proximityModelV3";

export const PROXIMITY_FIELD_SELECTOR =
  "[data-hero-edge-field], [data-edge-field]";

export const REST_EPS = 0.0015;

export type ProximityRuntimeFrame = {
  progress: number;
  targetProgress: number;
  zone: ZoneId;
  rawZone: ZoneId;
  rawProximity: number;
  weightedProximity: number;
  heldRaw: number;
  directionalMul: number;
  sustainSec: number;
  deadbandSuppressed: boolean;
  pressureGateClamped: boolean;
  sustainGateClamped: boolean;
  earlyRelease: boolean;
  releaseMode: "approach" | "release" | "early-release" | "idle";
  pointer: Point | null;
  closest: Point | null;
  dist: number;
  filteredDist: number;
  halfDiag: number;
  poly: Point[];
  inputMode: "fine-pointer" | "coarse-pointer" | "reduced-motion" | "off";
  rafActive: boolean;
  fps: number;
  dtSec: number;
  now: number;
};

export type ProximityRuntimeOptions = {
  /** Source label (lab vs home shell). */
  source: "home-v3" | "lab-edge";
  getSvg: () => SVGSVGElement | null;
  /** Optional host fallback if field selector misses */
  getHost?: () => HTMLElement | null;
  fieldSelector?: string;
  onFrame: (frame: ProximityRuntimeFrame) => void;
  /** Default E1 locked gates. Lab may override per stability. */
  getGates?: () => ProximityGates;
  /**
   * undefined → use live field pointer;
   * null → force no pointer;
   * Point → override (traffic).
   */
  getPointerOverride?: (now: number) => Point | null | undefined;
  /** Keep RAF alive (traffic / lab hold). */
  shouldHoldRaf?: () => boolean;
  /** External in-view signal; if omitted, IntersectionObserver on field. */
  getHeroInView?: () => boolean;
  useIntersectionObserver?: boolean;
  vbW?: number;
  vbH?: number;
};

export type ProximityRuntime = {
  mount: () => void;
  unmount: () => void;
  setEnabled: (v: boolean) => void;
  setReduced: (v: boolean) => void;
  setScrub: (v: number | null) => void;
  setPointerViewBox: (x: number, y: number) => void;
  clearPointer: () => void;
  hardReset: () => void;
  ensureRaf: () => void;
  stopRaf: () => void;
  getFrame: () => ProximityRuntimeFrame;
  getProgress: () => number;
};

function resolveField(
  svg: SVGSVGElement | null,
  selector: string,
  host: HTMLElement | null,
) {
  return (
    (svg?.closest(selector) as HTMLElement | null) ??
    (typeof document !== "undefined"
      ? (document.querySelector(selector) as HTMLElement | null)
      : null) ??
    host
  );
}

export function createProximityRuntime(
  options: ProximityRuntimeOptions,
): ProximityRuntime {
  const vbW = options.vbW ?? V3_CANVAS.width;
  const vbH = options.vbH ?? V3_CANVAS.height;
  const fieldSelector = options.fieldSelector ?? PROXIMITY_FIELD_SELECTOR;
  const useIO = options.useIntersectionObserver !== false;

  let enabled = true;
  let reduced = false;
  let scrub: number | null = null;

  let poly = buildStaticS0FrontTilted();
  let halfDiag = halfDiagFromPoly(poly);
  let livePointer: Point | null = null;
  let target = 0;
  let rendered = 0;
  let heldRaw = 0;
  let filteredDist = Infinity;
  let sustainSec = 0;
  let peak = 0;
  let elevatedMs = 0;
  let earlyRelease = false;
  let stickyZone: ZoneId = "Z0";

  let lastZone: ZoneId = "Z0";
  let lastRawZone: ZoneId = "Z0";
  let lastRaw = 0;
  let lastWeighted = 0;
  let lastDirMul = 1;
  let lastDeadband = false;
  let lastPressureGate = false;
  let lastSustainGate = false;
  let lastClosest: Point | null = null;
  let lastDist = 0;
  let lastReleaseMode: ProximityRuntimeFrame["releaseMode"] = "idle";
  let lastDt = 1 / 60;

  let inputMode: ProximityRuntimeFrame["inputMode"] = "off";
  let heroInView = true;
  let rafId = 0;
  let rafRunning = false;
  let lastTs = 0;
  let fpsN = 0;
  let fpsSum = 0;

  let fieldEl: HTMLElement | null = null;
  let detachPointer: (() => void) | null = null;
  let detachCapability: (() => void) | null = null;
  let io: IntersectionObserver | null = null;
  let scrollRaf = 0;
  let mounted = false;
  let pointerAttached = false;

  const fps = () => (fpsN ? fpsSum / fpsN : 60);

  const buildFrame = (now = performance.now()): ProximityRuntimeFrame => ({
    progress: rendered,
    targetProgress: target,
    zone: lastZone,
    rawZone: lastRawZone,
    rawProximity: lastRaw,
    weightedProximity: lastWeighted,
    heldRaw,
    directionalMul: lastDirMul,
    sustainSec,
    deadbandSuppressed: lastDeadband,
    pressureGateClamped: lastPressureGate,
    sustainGateClamped: lastSustainGate,
    earlyRelease,
    releaseMode: lastReleaseMode,
    pointer: livePointer,
    closest: lastClosest,
    dist: lastDist,
    filteredDist: Number.isFinite(filteredDist) ? filteredDist : 0,
    halfDiag,
    poly: poly.map((p) => ({ x: p.x, y: p.y })),
    inputMode,
    rafActive: rafRunning,
    fps: fps(),
    dtSec: lastDt,
    now,
  });

  const publish = (now: number) => {
    options.onFrame(buildFrame(now));
  };

  const refreshBounds = () => {
    poly = buildStaticS0FrontTilted();
    halfDiag = halfDiagFromPoly(poly);
  };

  const stopRaf = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    rafRunning = false;
  };

  const hardReset = () => {
    livePointer = null;
    target = 0;
    rendered = 0;
    heldRaw = 0;
    filteredDist = Infinity;
    sustainSec = 0;
    peak = 0;
    elevatedMs = 0;
    earlyRelease = false;
    stickyZone = "Z0";
    lastZone = "Z0";
    lastRawZone = "Z0";
    lastRaw = 0;
    lastWeighted = 0;
    lastDirMul = 1;
    lastDeadband = false;
    lastPressureGate = false;
    lastSustainGate = false;
    lastClosest = null;
    lastDist = 0;
    lastReleaseMode = "idle";
    publish(performance.now());
  };

  const tick = (now: number) => {
    rafId = 0;
    const rawDt = (now - lastTs) / 1000;
    const dt = Math.min(0.05, rawDt > 0 ? rawDt : 1 / 60);
    lastTs = now;
    lastDt = dt;
    if (dt > 0) {
      fpsN += 1;
      fpsSum += Math.min(120, 1 / dt);
    }

    const gates = options.getGates?.() ?? {};
    const heroOk = options.getHeroInView
      ? options.getHeroInView()
      : heroInView;
    const blocked =
      reduced ||
      !enabled ||
      inputMode !== "fine-pointer" ||
      !heroOk;

    const override = options.getPointerOverride?.(now);
    let pointer: Point | null = null;
    if (scrub == null && !blocked) {
      pointer = override !== undefined ? override : livePointer;
    }

    if (scrub != null) {
      const p = Math.min(1, Math.max(0, scrub));
      target = p;
      rendered = p;
      heldRaw = p;
      lastRaw = p;
      lastWeighted = p;
      lastZone =
        p <= 1e-4 ? "Z0" : p < 0.08 ? "Z1" : p <= V3_SPLIT ? "Z2" : "Z3";
      lastRawZone = lastZone;
      stickyZone = lastZone;
      earlyRelease = false;
      lastReleaseMode = "idle";
      lastPressureGate = false;
      lastSustainGate = false;
      lastDirMul = 1;
      lastDeadband = false;
      lastClosest = poly[0] ?? null;
      lastDist = 0;
    } else {
      const step = tickProximity({
        pointer,
        filteredDist,
        heldRaw,
        sustainSec,
        renderedProgress: rendered,
        peakRendered: peak,
        elevatedMs,
        earlyReleaseActive: earlyRelease,
        dtSec: dt,
        halfDiag,
        poly,
        blocked: false,
        stickyZone,
        gates,
      });

      filteredDist = step.filteredDist;
      heldRaw = step.heldRaw;
      sustainSec = step.sustainSec;
      rendered = step.renderedProgress;
      target = step.targetProgress;
      peak = step.peakRendered;
      elevatedMs = step.elevatedMs;
      earlyRelease = step.earlyReleaseActive;
      stickyZone = step.stickyZone;
      lastZone = step.zone;
      lastRawZone = step.rawZone;
      lastRaw = step.rawProximity;
      lastWeighted = step.weightedProximity;
      lastDirMul = step.directionalMul;
      lastDeadband = step.deadbandSuppressed;
      lastPressureGate = step.pressureGateClamped;
      lastSustainGate = step.sustainGateClamped;
      lastClosest = step.closest;
      lastDist = step.dist;
      lastReleaseMode = step.earlyReleaseActive
        ? "early-release"
        : step.targetProgress < step.renderedProgress - 0.001
          ? "release"
          : step.targetProgress > 0.001 || step.renderedProgress > 0.001
            ? "approach"
            : "idle";

      if (
        !Number.isFinite(step.renderedProgress) ||
        !Number.isFinite(step.targetProgress)
      ) {
        rendered = 0;
        target = 0;
      }
    }

    if (target < REST_EPS && rendered < REST_EPS) {
      rendered = 0;
      target = 0;
      heldRaw = 0;
    }

    publish(now);

    const hold = options.shouldHoldRaf?.() === true;
    const activePointer =
      scrub != null
        ? false
        : override !== undefined
          ? override != null
          : livePointer != null;
    const needRaf =
      scrub != null ||
      hold ||
      activePointer ||
      target > REST_EPS ||
      rendered > REST_EPS;

    if (
      needRaf &&
      enabled &&
      !reduced &&
      (inputMode === "fine-pointer" || scrub != null || hold)
    ) {
      rafId = requestAnimationFrame(tick);
      rafRunning = true;
    } else {
      rafRunning = false;
      if (blocked || (target < REST_EPS && rendered < REST_EPS)) {
        rendered = 0;
        target = 0;
        heldRaw = 0;
        lastZone = "Z0";
        lastRaw = 0;
        lastWeighted = 0;
        publish(now);
      }
    }
  };

  const ensureRaf = () => {
    if (rafRunning || rafId) return;
    if (!enabled || reduced) return;
    if (
      inputMode !== "fine-pointer" &&
      scrub == null &&
      options.shouldHoldRaf?.() !== true
    ) {
      return;
    }
    lastTs = performance.now();
    rafRunning = true;
    rafId = requestAnimationFrame(tick);
  };

  const setPointerViewBox = (x: number, y: number) => {
    livePointer = { x, y };
    ensureRaf();
  };

  const clearPointer = () => {
    livePointer = null;
    target = 0;
    ensureRaf();
  };

  const syncCapability = () => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced || motion.matches) inputMode = "reduced-motion";
    else if (coarse.matches && !fine.matches) inputMode = "coarse-pointer";
    else if (fine.matches) inputMode = "fine-pointer";
    else inputMode = "off";
  };

  const mount = () => {
    if (mounted) return;
    mounted = true;
    refreshBounds();

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onCap = () => {
      syncCapability();
      if (inputMode !== "fine-pointer" && scrub == null) {
        hardReset();
        stopRaf();
      } else if (scrub != null || options.shouldHoldRaf?.()) {
        ensureRaf();
      }
    };
    syncCapability();
    fine.addEventListener("change", onCap);
    coarse.addEventListener("change", onCap);
    motion.addEventListener("change", onCap);
    detachCapability = () => {
      fine.removeEventListener("change", onCap);
      coarse.removeEventListener("change", onCap);
      motion.removeEventListener("change", onCap);
    };

    const svg = options.getSvg();
    fieldEl = resolveField(svg, fieldSelector, options.getHost?.() ?? null);
    const svgVisible = !!(
      svg &&
      svg.getClientRects().length > 0 &&
      svg.getBoundingClientRect().width > 1
    );
    // Only the visible object mount owns field pointer listeners (lab dual-mount).
    pointerAttached = !!fieldEl && svgVisible;

    if (
      useIO &&
      pointerAttached &&
      fieldEl &&
      typeof IntersectionObserver !== "undefined"
    ) {
      io = new IntersectionObserver(
        (entries) => {
          const ratio = entries[0]?.intersectionRatio ?? 0;
          const was = heroInView;
          heroInView = ratio >= 0.35;
          if (was && !heroInView) {
            livePointer = null;
            target = 0;
            ensureRaf();
          }
        },
        { threshold: [0, 0.35, 0.6, 1] },
      );
      io.observe(fieldEl);
    }

    const onLayout = () => {
      refreshBounds();
      livePointer = null;
      target = 0;
      ensureRaf();
    };
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        refreshBounds();
      });
    };
    window.addEventListener("resize", onLayout);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (pointerAttached && fieldEl) {
      const onMove = (e: PointerEvent) => {
        if (!enabled || reduced) return;
        if (inputMode !== "fine-pointer") return;
        if (scrub != null) return;
        if (options.getPointerOverride?.(performance.now()) !== undefined)
          return;
        const svgEl = options.getSvg();
        if (!svgEl) return;
        livePointer = clientToViewBox(e.clientX, e.clientY, svgEl, vbW, vbH);
        ensureRaf();
      };
      const clear = () => {
        livePointer = null;
        target = 0;
        ensureRaf();
      };
      const onVis = () => {
        if (document.visibilityState !== "visible") {
          hardReset();
          stopRaf();
        }
      };
      fieldEl.addEventListener("pointermove", onMove, { passive: true });
      fieldEl.addEventListener("pointerleave", clear);
      fieldEl.addEventListener("pointercancel", clear);
      window.addEventListener("blur", clear);
      document.addEventListener("visibilitychange", onVis);
      detachPointer = () => {
        fieldEl?.removeEventListener("pointermove", onMove);
        fieldEl?.removeEventListener("pointerleave", clear);
        fieldEl?.removeEventListener("pointercancel", clear);
        window.removeEventListener("blur", clear);
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("resize", onLayout);
        window.removeEventListener("scroll", onScroll);
      };
    } else {
      detachPointer = () => {
        window.removeEventListener("resize", onLayout);
        window.removeEventListener("scroll", onScroll);
      };
    }

    if (scrub != null || options.shouldHoldRaf?.()) ensureRaf();
    publish(performance.now());
  };

  const unmount = () => {
    if (!mounted) return;
    mounted = false;
    detachCapability?.();
    detachCapability = null;
    detachPointer?.();
    detachPointer = null;
    io?.disconnect();
    io = null;
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = 0;
    stopRaf();
    hardReset();
    fieldEl = null;
    pointerAttached = false;
  };

  return {
    mount,
    unmount,
    setEnabled: (v) => {
      enabled = v;
      if (!v) {
        hardReset();
        stopRaf();
      }
    },
    setReduced: (v) => {
      reduced = v;
      syncCapability();
      if (v) {
        hardReset();
        stopRaf();
      }
    },
    setScrub: (v) => {
      scrub = v;
      if (v != null) ensureRaf();
    },
    setPointerViewBox,
    clearPointer,
    hardReset,
    ensureRaf,
    stopRaf,
    getFrame: () => buildFrame(),
    getProgress: () => rendered,
  };
}
