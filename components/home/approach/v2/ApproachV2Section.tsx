"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  APPROACH_COPY,
  type StructuralState,
} from "@/components/home/approach/constants";
import type { ApproachCopy } from "@/components/home/approach/copy";
import { useFinePointer } from "@/components/home/approach/useFinePointer";
import {
  followToward,
  hoverFollowCurve,
  pocketHoverDt,
  pocketHoverFollowK,
  POCKET_HOVER_PITCH_CURVE,
  POCKET_HOVER_REST_EPS,
  POCKET_HOVER_YAW_CURVE,
} from "@/lib/pocketHoverFollow";

import ApproachOpenShellGraphic from "./ApproachOpenShellGraphic";
import {
  BASE_PITCH,
  BASE_YAW,
  DEFAULT_NOISE_VARIANT,
  PARALLAX_PITCH,
  PARALLAX_YAW,
  type NoiseVariant,
} from "./openShell";

type ApproachV2SectionProps = {
  reducedMotion: boolean;
  copy?: ApproachCopy;
  noiseVariant?: NoiseVariant;
  /** Lab comparison keeps `approach-v2`. Production passes `approach`. */
  anchorId?: string;
};

const SETTLE_HOLD_MS = 720;
const SETTLE_GAP_MS = 80;

type Pose = { yaw: number; pitch: number };

export default function ApproachV2Section({
  reducedMotion,
  copy = APPROACH_COPY,
  noiseVariant = DEFAULT_NOISE_VARIANT,
  anchorId = "approach-v2",
}: ApproachV2SectionProps) {
  const finePointer = useFinePointer();
  const sectionRef = useRef<HTMLElement | null>(null);
  const objectRef = useRef<HTMLDivElement | null>(null);
  const settleTimers = useRef<number[]>([]);
  const settlePlayed = useRef(false);

  const poseRef = useRef<Pose>({ yaw: BASE_YAW, pitch: BASE_PITCH });
  const offsetRef = useRef<Pose>({ yaw: 0, pitch: 0 });
  const targetOffsetRef = useRef<Pose>({ yaw: 0, pitch: 0 });
  const hoveringRef = useRef(false);
  const rafRef = useRef(0);
  const lastTickRef = useRef(0);

  const [display, setDisplay] = useState<StructuralState>(
    reducedMotion ? "03" : "01",
  );
  const [userOwns, setUserOwns] = useState(false);
  const [pose, setPose] = useState<Pose>({ yaw: BASE_YAW, pitch: BASE_PITCH });

  const clearSettle = useCallback(() => {
    for (const id of settleTimers.current) window.clearTimeout(id);
    settleTimers.current = [];
  }, []);

  const playSettle = useCallback(() => {
    if (reducedMotion || settlePlayed.current) return;
    settlePlayed.current = true;
    setDisplay("01");
    const t1 = window.setTimeout(() => setDisplay("02"), SETTLE_HOLD_MS);
    const t2 = window.setTimeout(
      () => setDisplay("03"),
      SETTLE_HOLD_MS * 2 + SETTLE_GAP_MS,
    );
    settleTimers.current = [t1, t2];
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        playSettle();
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [playSettle, reducedMotion]);

  const tickPoseRef = useRef<() => void>(() => {});

  useEffect(() => {
    const tick = (now: number) => {
      const dt = pocketHoverDt(now, lastTickRef.current || now);
      lastTickRef.current = now;

      const hovering = hoveringRef.current;
      const k = pocketHoverFollowK(dt, hovering);
      const offset = offsetRef.current;
      const target = targetOffsetRef.current;
      offset.yaw = followToward(offset.yaw, target.yaw, k);
      offset.pitch = followToward(offset.pitch, target.pitch, k);

      poseRef.current = {
        yaw: BASE_YAW + offset.yaw,
        pitch: BASE_PITCH + offset.pitch,
      };

      const atRest =
        !hovering &&
        Math.abs(offset.yaw) < POCKET_HOVER_REST_EPS &&
        Math.abs(offset.pitch) < POCKET_HOVER_REST_EPS;

      if (atRest) {
        offset.yaw = 0;
        offset.pitch = 0;
        poseRef.current = { yaw: BASE_YAW, pitch: BASE_PITCH };
        setPose({ yaw: BASE_YAW, pitch: BASE_PITCH });
        rafRef.current = 0;
        lastTickRef.current = 0;
        return;
      }

      setPose({
        yaw: poseRef.current.yaw,
        pitch: poseRef.current.pitch,
      });
      rafRef.current = window.requestAnimationFrame(tick);
    };

    tickPoseRef.current = () => {
      tick(performance.now());
    };
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, []);

  const ensurePoseLoop = useCallback(() => {
    if (rafRef.current) return;
    lastTickRef.current = performance.now();
    rafRef.current = window.requestAnimationFrame(() => {
      tickPoseRef.current();
    });
  }, []);

  useEffect(() => () => clearSettle(), [clearSettle]);

  const setFromNav = useCallback(
    (state: StructuralState) => {
      setUserOwns(true);
      settlePlayed.current = true;
      clearSettle();
      setDisplay(state);
    },
    [clearSettle],
  );

  const enterNav = useCallback(
    (state: StructuralState) => {
      setFromNav(state);
    },
    [setFromNav],
  );

  const releaseNavOwnership = useCallback(() => {
    setUserOwns(false);
    setDisplay("03");
  }, []);

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

  const writePointerTarget = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const el = objectRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = Math.min(
        1,
        Math.max(-1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
      );
      const ny = Math.min(
        1,
        Math.max(-1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
      targetOffsetRef.current = {
        yaw:
          hoverFollowCurve(
            nx,
            POCKET_HOVER_YAW_CURVE.ease,
            POCKET_HOVER_YAW_CURVE.calm,
          ) * PARALLAX_YAW,
        pitch:
          -hoverFollowCurve(
            ny,
            POCKET_HOVER_PITCH_CURVE.ease,
            POCKET_HOVER_PITCH_CURVE.calm,
          ) * PARALLAX_PITCH,
      };
    },
    [],
  );

  const leaveWholeField = useCallback(() => {
    setUserOwns(false);
    setDisplay("03");
    hoveringRef.current = false;
    targetOffsetRef.current = { yaw: 0, pitch: 0 };
    ensurePoseLoop();
  }, [ensurePoseLoop]);

  const onObjectPointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!finePointer || reducedMotion) return;
      hoveringRef.current = true;
      writePointerTarget(event);
      ensurePoseLoop();
    },
    [ensurePoseLoop, finePointer, reducedMotion, writePointerTarget],
  );

  const onObjectPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!finePointer || reducedMotion) return;
      hoveringRef.current = true;
      writePointerTarget(event);
      ensurePoseLoop();
    },
    [ensurePoseLoop, finePointer, reducedMotion, writePointerTarget],
  );

  const onObjectPointerLeave = useCallback(() => {
    hoveringRef.current = false;
    targetOffsetRef.current = { yaw: 0, pitch: 0 };
    ensurePoseLoop();
  }, [ensurePoseLoop]);

  const shownState: StructuralState =
    reducedMotion && !userOwns ? "03" : display;
  const shownYaw = reducedMotion ? BASE_YAW : pose.yaw;
  const shownPitch = reducedMotion ? BASE_PITCH : pose.pitch;

  return (
    <section
      ref={sectionRef}
      data-section="approach-interactive"
      data-pristop-v2="1"
      className="relative border-t border-white/10 bg-[#080808] py-10 text-white sm:py-12 lg:py-16"
    >
      <span id={anchorId} data-anchor-marker aria-hidden="true" />
      <div className="mini-page-rail">
        <div
          data-approach-field
          className="grid gap-10 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:items-center lg:gap-12 xl:gap-16"
          onMouseLeave={leaveWholeField}
        >
          <div className="min-w-0 max-w-[420px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              {copy.eyebrow}
            </p>

            <h2 className="mt-3 max-w-[20ch] text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:max-w-[24ch] sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.045em] lg:max-w-[22ch] lg:text-[3.5rem]">
              {copy.headline}
              <br />
              <span className="text-white/88">{copy.headlineSecondary}</span>
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
                  const isActive = shownState === step.number;

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

          <div className="relative flex min-w-0 items-center justify-end max-lg:justify-center lg:pl-4 lg:pr-0">
            <div
              ref={objectRef}
              data-approach-object-hit
              data-approach-field-shift="desktop-right"
              className="relative w-full max-w-[480px] max-lg:mx-auto max-lg:aspect-[400/260] max-lg:w-[86%] max-lg:overflow-visible md:max-w-[520px] lg:max-w-[560px] lg:translate-x-[24px] xl:max-w-[600px]"
              onPointerEnter={onObjectPointerEnter}
              onPointerMove={onObjectPointerMove}
              onPointerLeave={onObjectPointerLeave}
            >
              <ApproachOpenShellGraphic
                state={shownState}
                reducedMotion={reducedMotion}
                yaw={shownYaw}
                pitch={shownPitch}
                noiseVariant={noiseVariant}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
