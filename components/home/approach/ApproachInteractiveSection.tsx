"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
} from "react";

import {
  APPROACH_COPY,
  APPROACH_MORPH,
  EASE,
  RELEASE_EASE,
  type StructuralState,
} from "./constants";
import type { ApproachCopy } from "./copy";
import ApproachInteractiveGraphic from "./ApproachInteractiveGraphic";
import {
  getB02APose,
  type AmbientPose,
} from "./approachAmbient";
import { createPoseDriver } from "./approachPoseDriver";
import {
  useApproachSpatial,
  type ZoneStateChange,
} from "./useApproachSpatial";
import { useApproachAmbient } from "./useApproachAmbient";
import { useFinePointer } from "./useFinePointer";
import type { TensionSample } from "./approachZones";

type ApproachInteractiveSectionProps = {
  reducedMotion: boolean;
  /** Lab/review override — production omits this and uses APPROACH_COPY. */
  copy?: ApproachCopy;
};

function poseWithTension(base: AmbientPose, tension: TensionSample): AmbientPose {
  const nodes = { ...base.nodes };
  for (const id of Object.keys(nodes)) {
    nodes[id] = { ...nodes[id] };
  }
  if (nodes.n0) {
    nodes.n0 = {
      x: nodes.n0.x + tension.noiseFlee.x,
      y: nodes.n0.y + tension.noiseFlee.y,
    };
  }
  if (nodes.n1) {
    nodes.n1 = {
      x: nodes.n1.x + tension.purposeAttract.x,
      y: nodes.n1.y + tension.purposeAttract.y,
    };
  }
  return { nodes, amber: base.amber };
}

export default function ApproachInteractiveSection({
  reducedMotion,
  copy = APPROACH_COPY,
}: ApproachInteractiveSectionProps) {
  const finePointer = useFinePointer();
  const sectionRef = useRef<HTMLElement | null>(null);
  const driver = useMemo(() => createPoseDriver("02"), []);
  const [debugZones, setDebugZones] = useState(false);
  const [debugHud, setDebugHud] = useState(false);
  const [ambientFast, setAmbientFast] = useState(false);
  const [ambientHold, setAmbientHold] = useState<"B" | "C" | null>(null);
  const [display, setDisplay] = useState<StructuralState>("02");
  const [morphMode, setMorphMode] = useState<"active" | "release">("active");
  const [navOwns, setNavOwns] = useState(false);
  const [morphBusy, setMorphBusy] = useState(false);
  const morphTimerRef = useRef<number | null>(null);
  const displayRef = useRef<StructuralState>(display);
  displayRef.current = display;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugZones(params.get("debugZones") === "1");
    setDebugHud(params.get("debugHud") === "1");
    setAmbientFast(
      params.get("ambientCycleFast") === "1" ||
        params.get("ambientFast") === "1",
    );
    const hold = params.get("ambientHold");
    setAmbientHold(hold === "B" || hold === "C" ? hold : null);
  }, []);

  const markMorphBusy = useCallback((mode: "active" | "release") => {
    setMorphBusy(true);
    if (morphTimerRef.current !== null) {
      window.clearTimeout(morphTimerRef.current);
    }
    const ms =
      (mode === "release" ? APPROACH_MORPH.release : APPROACH_MORPH.between) *
        1000 +
      40;
    morphTimerRef.current = window.setTimeout(() => {
      morphTimerRef.current = null;
      setMorphBusy(false);
    }, ms);
  }, []);

  useEffect(
    () => () => {
      if (morphTimerRef.current !== null) {
        window.clearTimeout(morphTimerRef.current);
      }
    },
    [],
  );

  const onZoneState = useCallback(
    (change: ZoneStateChange) => {
      const mode = change.release ? "release" : "active";
      setMorphMode(mode);
      setDisplay(change.state);
      markMorphBusy(mode);
    },
    [markMorphBusy],
  );

  const {
    svgRef,
    tension,
    debug,
    inside: objectInside,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    syncExternal,
  } = useApproachSpatial({
    enabled: finePointer,
    reducedMotion,
    navOwns,
    onZoneState,
  });

  const {
    debug: ambientDebug,
    phase: ambientPhase,
    variant: ambientVariant,
    authority,
  } = useApproachAmbient({
    sectionRef,
    driver,
    reducedMotion,
    enabled: finePointer,
    committed: display,
    objectInside,
    navOwns,
    morphBusy,
    tensionStrength: tension.strength,
    zoneCandidate: debug.candidate,
    stateMorphActive: morphBusy,
    fast: ambientFast,
    forceHold: ambientHold,
  });

  const ambientOwnsGeometry =
    authority === "ambient" &&
    (ambientPhase === "shift" ||
      ambientPhase === "hold" ||
      ambientPhase === "return" ||
      ambientPhase === "cancel");

  // State morph via PoseDriver Framer animate() — never overlaps ambient rAF
  useEffect(() => {
    if (ambientOwnsGeometry) return;
    if (ambientHold) return;

    const dur =
      reducedMotion
        ? APPROACH_MORPH.reduced
        : morphMode === "release"
          ? APPROACH_MORPH.release
          : APPROACH_MORPH.between;
    const ease = morphMode === "release" ? RELEASE_EASE : EASE;

    if (authority === "handoff" || morphBusy) {
      void driver.animateToScene(display, dur, ease);
      return;
    }

    // Resting state changes (e.g. mobile tap hold)
    if (!morphBusy && display !== "02") {
      void driver.animateToScene(display, dur, ease);
    } else if (!morphBusy && display === "02" && tension.strength < 0.02) {
      driver.applyInstant(getB02APose());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, morphMode, morphBusy, ambientOwnsGeometry, ambientHold]);

  // Tension overlay — only when ambient is not owning geometry
  useEffect(() => {
    if (ambientOwnsGeometry || ambientHold) return;
    if (display !== "02") return;
    if (navOwns || reducedMotion) return;
    if (morphBusy) return;

    if (tension.strength < 0.01) {
      driver.applyInstant(getB02APose());
      return;
    }
    driver.applyInstant(poseWithTension(getB02APose(), tension));
  }, [
    tension,
    ambientOwnsGeometry,
    ambientHold,
    display,
    navOwns,
    reducedMotion,
    morphBusy,
    driver,
  ]);

  const setFromNav = useCallback(
    (state: StructuralState) => {
      setMorphMode("active");
      setDisplay(state);
      syncExternal(state);
      markMorphBusy("active");
    },
    [syncExternal, markMorphBusy],
  );

  const enterNav = useCallback(
    (state: StructuralState) => {
      setNavOwns(true);
      setFromNav(state);
    },
    [setFromNav],
  );

  const releaseNavOwnership = useCallback(() => {
    setNavOwns(false);
    if (!objectInside) {
      setMorphMode("release");
      setDisplay("02");
      syncExternal("02");
      markMorphBusy("release");
    }
  }, [objectInside, syncExternal, markMorphBusy]);

  const onNavBlur = useCallback(
    (event: FocusEvent<HTMLButtonElement>) => {
      const next = event.relatedTarget as Node | null;
      if (
        next instanceof HTMLElement &&
        next.closest('[data-approach-nav="1"]')
      ) {
        return;
      }
      releaseNavOwnership();
    },
    [releaseNavOwnership],
  );

  const leaveWholeField = useCallback(() => {
    setNavOwns(false);
    const mode = display === "02" ? "active" : "release";
    setMorphMode(mode);
    setDisplay("02");
    syncExternal("02");
    if (mode === "release") markMorphBusy("release");
  }, [display, syncExternal, markMorphBusy]);

  return (
    <section
      ref={sectionRef}
      data-section="approach-interactive"
      data-ambient-phase={ambientPhase}
      data-ambient-variant={ambientVariant}
      data-authority={authority}
      className="border-t border-white/10 bg-[#080808] py-10 text-white sm:py-12 lg:py-16"
    >
      <div className="mini-page-rail">
        <div
          data-approach-field
          className="grid gap-10 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:items-center lg:gap-12 xl:gap-16"
          onMouseLeave={leaveWholeField}
        >
          <div className="min-w-0 max-w-[420px]">
            <span id="approach" data-anchor-marker aria-hidden="true" />
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              {copy.eyebrow}
            </p>

            <h2 className="mt-3 max-w-[20ch] text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:max-w-[24ch] sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.045em] lg:max-w-[22ch] lg:text-[3.5rem]">
              {copy.headline}
              <br />
              <span className="text-white/88">
                {copy.headlineSecondary}
              </span>
            </h2>

            {copy.support ? (
              <p className="mt-5 max-w-[320px] text-sm leading-6 text-white/55 sm:max-w-[400px] sm:text-[15px] sm:leading-7">
                {copy.support}
              </p>
            ) : null}

            <nav
              aria-label="Approach steps"
              data-approach-nav="1"
              className="mt-7 sm:mt-8"
              onMouseLeave={() => {
                if (!finePointer) return;
                releaseNavOwnership();
              }}
            >
              <ol className="space-y-1.5">
                {copy.steps.map((step) => {
                  const isActive = display === step.number;

                  return (
                    <li key={step.number}>
                      <button
                        type="button"
                        onClick={() => {
                          if (finePointer) {
                            enterNav(step.number);
                          } else {
                            setFromNav(step.number);
                          }
                        }}
                        onMouseEnter={() => {
                          if (!finePointer) return;
                          enterNav(step.number);
                        }}
                        onFocus={() => enterNav(step.number)}
                        onBlur={onNavBlur}
                        aria-pressed={isActive}
                        className="group flex w-full items-baseline gap-3 rounded-sm py-1.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                      >
                        <span
                          className={`w-6 shrink-0 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                            isActive
                              ? "text-[#d1a45f]/85"
                              : "text-white/[0.48] group-hover:text-white/[0.58]"
                          }`}
                        >
                          {step.number}
                        </span>
                        <span
                          className={`min-w-0 border-l pl-3 text-sm font-semibold tracking-[-0.02em] transition-colors ${
                            isActive
                              ? "border-white/22 text-white/92"
                              : "border-transparent text-white/55 group-hover:border-white/10 group-hover:text-white/72"
                          }`}
                        >
                          {step.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          {/*
            Desktop: optical-axis lock vs System/Visual (ASK right-object axis).
            Shift full motion field (hit + graphic + ambient) — not SVG alone.
            Prior +64 sat ~40px right of System optical; +24 aligns the broken object.
            Mobile: keep field size; only soft end-align.
          */}
          <div className="relative flex min-w-0 items-center justify-end lg:pl-4 lg:pr-0">
            <div
              data-approach-object-hit
              data-approach-field-shift="desktop-right"
              className="relative w-full max-w-[480px] md:max-w-[520px] lg:max-w-[560px] lg:translate-x-[24px] xl:max-w-[600px]"
              onPointerEnter={(e) => {
                setNavOwns(false);
                onPointerEnter(e);
              }}
              onPointerMove={onPointerMove}
              onPointerLeave={() => {
                onPointerLeave();
              }}
            >
              <ApproachInteractiveGraphic
                state={display}
                reducedMotion={reducedMotion}
                svgRef={svgRef}
                driver={driver}
                authority={authority}
                tension={navOwns || reducedMotion ? undefined : tension}
                debugZones={debugZones}
              />
            </div>

            {debugHud ? (
              <div className="pointer-events-none absolute bottom-0 left-0 rounded border border-white/15 bg-black/70 px-2 py-1 font-mono text-[10px] leading-relaxed text-white/70">
                <div>authority: {ambientDebug.authority}</div>
                <div>
                  ambient: {ambientVariant} / {ambientPhase}
                </div>
                <div>
                  p: {ambientDebug.rawProgress.toFixed(3)} eased:{" "}
                  {ambientDebug.easedProgress.toFixed(3)}
                </div>
                <div>
                  strength: {ambientDebug.ambientStrength.toFixed(2)}
                </div>
                <div>
                  framer: {ambientDebug.framerActive ? "yes" : "no"}
                </div>
                <div>candidate: {debug.candidate ?? "—"}</div>
                <div>
                  pre: {debug.kind} {debug.strength.toFixed(2)}
                </div>
                <div>state: B{display}</div>
                <div>nav: {navOwns ? "yes" : "no"}</div>
                <div>suppress: {ambientDebug.suppressReason ?? "—"}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
