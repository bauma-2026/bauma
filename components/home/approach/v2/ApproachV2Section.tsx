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
  applyScrollImpulse,
  createScrollNudge,
  followToward,
  pocketFollowTarget,
  pocketHoverDt,
  pocketHoverFollowK,
  pointerNormFromRect,
  POCKET_FAMILY_WAKE_HOLD_MS,
  POCKET_HOVER_REST_EPS,
  resetScrollNudge,
  scrollNudgeQuiet,
  subscribePocketFamilyMotion,
  tickScrollNudge,
} from "@/lib/pocketSpatialMotion";

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

/** Lighter than Pocket (0.08 / 0.048); uses existing PARALLAX amps. */
const WAKE_YAW = PARALLAX_YAW * 0.45;
const WAKE_PITCH = -PARALLAX_PITCH * 0.42;
const SCROLL_YAW_MAX = PARALLAX_YAW * 0.38;
const SCROLL_PITCH_MAX = PARALLAX_PITCH * 0.36;
const SCROLL_IMPULSE_PER_PX = 0.00007;
const SCROLL_VEL_CLAMP_YAW = 0.008;
const SCROLL_VEL_CLAMP_PITCH = 0.0046;

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
  const pointerFollowRef = useRef(false);
  const wakeHoldUntilRef = useRef(0);
  const scrollRef = useRef(createScrollNudge());

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
      const target = targetOffsetRef.current;
      const opening = !hovering && wakeHoldUntilRef.current > 0;
      const k = pocketHoverFollowK(dt, hovering || opening);
      const offset = offsetRef.current;
      offset.yaw = followToward(offset.yaw, target.yaw, k);
      offset.pitch = followToward(offset.pitch, target.pitch, k);

      if (!hovering && wakeHoldUntilRef.current > 0 && now >= wakeHoldUntilRef.current) {
        wakeHoldUntilRef.current = 0;
        target.yaw = 0;
        target.pitch = 0;
      }

      const scroll = scrollRef.current;
      tickScrollNudge(scroll, dt, hovering, SCROLL_YAW_MAX, SCROLL_PITCH_MAX);

      poseRef.current = {
        yaw: BASE_YAW + offset.yaw + scroll.yaw,
        pitch: BASE_PITCH + offset.pitch + scroll.pitch,
      };

      const atRest =
        !hovering &&
        wakeHoldUntilRef.current === 0 &&
        Math.abs(offset.yaw) < POCKET_HOVER_REST_EPS &&
        Math.abs(offset.pitch) < POCKET_HOVER_REST_EPS &&
        scrollNudgeQuiet(scroll);

      if (atRest) {
        offset.yaw = 0;
        offset.pitch = 0;
        resetScrollNudge(scroll);
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

  const startPoseWake = useCallback(() => {
    if (hoveringRef.current) return;
    targetOffsetRef.current = { yaw: WAKE_YAW, pitch: WAKE_PITCH };
    wakeHoldUntilRef.current = performance.now() + POCKET_FAMILY_WAKE_HOLD_MS;
    ensurePoseLoop();
  }, [ensurePoseLoop]);

  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;

    return subscribePocketFamilyMotion({
      root: el,
      getHovering: () => hoveringRef.current,
      onPointerFollowChange: (enabled) => {
        pointerFollowRef.current = enabled;
      },
      onWake: startPoseWake,
      onLeaveView: () => {
        wakeHoldUntilRef.current = 0;
        if (!hoveringRef.current) {
          targetOffsetRef.current = { yaw: 0, pitch: 0 };
          ensurePoseLoop();
        }
      },
      onScrollImpulse: (dy) => {
        applyScrollImpulse(
          scrollRef.current,
          dy,
          SCROLL_IMPULSE_PER_PX,
          SCROLL_VEL_CLAMP_YAW,
          SCROLL_VEL_CLAMP_PITCH,
        );
        ensurePoseLoop();
      },
    });
  }, [ensurePoseLoop, reducedMotion, startPoseWake]);

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
      const { nx, ny } = pointerNormFromRect(
        event.clientX,
        event.clientY,
        el.getBoundingClientRect(),
      );
      wakeHoldUntilRef.current = 0;
      targetOffsetRef.current = pocketFollowTarget(
        nx,
        ny,
        PARALLAX_YAW,
        PARALLAX_PITCH,
      );
    },
    [],
  );

  const leaveWholeField = useCallback(() => {
    setUserOwns(false);
    setDisplay("03");
    hoveringRef.current = false;
    if (wakeHoldUntilRef.current === 0) {
      targetOffsetRef.current = { yaw: 0, pitch: 0 };
    }
    ensurePoseLoop();
  }, [ensurePoseLoop]);

  const onObjectPointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!finePointer || reducedMotion || !pointerFollowRef.current) return;
      if (event.pointerType === "touch") return;
      hoveringRef.current = true;
      writePointerTarget(event);
      ensurePoseLoop();
    },
    [ensurePoseLoop, finePointer, reducedMotion, writePointerTarget],
  );

  const onObjectPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!finePointer || reducedMotion || !pointerFollowRef.current) return;
      if (event.pointerType === "touch") return;
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
      data-pristop-live={
        Math.abs(shownYaw - BASE_YAW) > 0.002 || Math.abs(shownPitch - BASE_PITCH) > 0.002
          ? "1"
          : "0"
      }
      /* Narrow phones: the object eases down (see object field), so the base 2.5rem
         bottom pad grows by up to 32px below 390px to keep it off the divider.
         The recentring shift (< lg) and the fixed lg+ drawing box push empty SVG area
         past the rail — clip x. */
      className="relative border-t border-white/10 bg-[#080808] py-10 text-white overflow-x-clip max-sm:pb-[calc(2.5rem+clamp(0px,calc((390px_-_100vw)*0.4),32px))] sm:py-12 lg:py-16"
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
              className="relative w-full max-w-[480px] max-lg:mx-auto max-lg:aspect-[400/260] max-sm:w-[86%] max-lg:overflow-visible sm:max-w-[600px] lg:max-w-[560px] lg:translate-x-[24px] xl:max-w-[600px]"
              onPointerEnter={onObjectPointerEnter}
              onPointerMove={onObjectPointerMove}
              onPointerLeave={onObjectPointerLeave}
            >
              {/*
                Mobile pocket size: fluid with the column, capped at the 390px target.
                The transform is the containing block for the SVG, so the width cap
                sizes the drawing without touching layout height.
                x: the drawing sits 30/400 of the box left of centre (ORIGIN.x 170).
                Scale × recentre: max-sm 1.411 → 10.582%; sm–lg 1.045 → 7.837%.
                y: nothing from 430px; below, eases down to keep the text gap in the
                System / Pocket rhythm (~88–94px), capped at 24px.
                lg+: the box keeps the column-driven 400:260 layout, but the drawing is a
                fixed 600×390 anchored on ORIGIN (42.5% / 50% of the box), scaled 1.045
                about that origin so size grows without a position shift.
              */}
              <div className="h-full w-full max-sm:mx-auto max-sm:max-w-[294px] max-sm:origin-center max-sm:translate-x-[10.582%] max-sm:translate-y-[clamp(0px,calc((430px_-_100vw)*0.25),24px)] max-sm:scale-[1.411] sm:max-lg:origin-center sm:max-lg:translate-x-[7.837%] sm:max-lg:scale-[1.045] lg:relative lg:h-auto lg:aspect-[400/260]">
                <ApproachOpenShellGraphic
                  state={shownState}
                  reducedMotion={reducedMotion}
                  yaw={shownYaw}
                  pitch={shownPitch}
                  noiseVariant={noiseVariant}
                  className="absolute inset-0 h-full w-full lg:inset-auto lg:left-[calc(42.5%-255px)] lg:top-[calc(50%-195px)] lg:h-[390px] lg:w-[600px] lg:origin-[42.5%_50%] lg:scale-[1.045]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
