"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CHANGE_COPY, type StructuralState } from "./constants";
import ChangeGraphic from "./ChangeGraphic";
import { useChangeAutoplay } from "./useChangeAutoplay";
import { useFinePointer } from "./useFinePointer";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Kaj se spremeni — study / reference section.
 * Locked A01 → A02 → A03 autoplay + shallow desktop reverse after settle.
 * Not mounted on the production homepage.
 */
export default function ChangeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const { state: autoplayState, autoplayComplete } = useChangeAutoplay(
    sectionRef,
    { reducedMotion, replayToken: 0 },
  );

  const [previewing, setPreviewing] = useState(false);
  const [motionKind, setMotionKind] = useState<
    "sequence" | "hover-enter" | "hover-leave"
  >("sequence");

  const canInteract =
    !reducedMotion && finePointer && autoplayComplete && autoplayState === "03";

  const displayState: StructuralState =
    canInteract && previewing ? "02" : autoplayState;

  const enterPreview = useCallback(() => {
    if (!canInteract) return;
    setMotionKind("hover-enter");
    setPreviewing(true);
  }, [canInteract]);

  const leavePreview = useCallback(() => {
    if (!previewing) return;
    setMotionKind("hover-leave");
    setPreviewing(false);
  }, [previewing]);

  useEffect(() => {
    if (reducedMotion) {
      setPreviewing(false);
      setMotionKind("sequence");
    }
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="change"
      data-section="change"
      className="border-t border-white/10 bg-[#0a0a0a] py-14 text-white sm:py-20 lg:py-24"
    >
      <div className="mini-page-rail">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
          <div className="max-w-[540px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
              {CHANGE_COPY.eyebrow}
            </p>

            <h2 className="mt-3 max-w-[12ch] text-2xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-4xl sm:leading-[0.95]">
              {CHANGE_COPY.headline}
            </h2>

            <p className="mt-4 max-w-[48ch] text-sm leading-6 text-white/52 sm:text-base sm:leading-7">
              {CHANGE_COPY.supporting}
            </p>
          </div>

          <div className="min-w-0 lg:flex lg:justify-end lg:pr-5 xl:pr-8">
            <div
              role={canInteract ? "button" : undefined}
              tabIndex={canInteract ? 0 : -1}
              aria-label={canInteract ? "Razrešena struktura" : undefined}
              className={`relative w-full max-w-[510px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/35 md:max-w-[540px] lg:max-w-[560px] ${
                canInteract ? "cursor-default" : ""
              }`}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                enterPreview();
              }}
              onPointerLeave={(e) => {
                if (e.pointerType !== "mouse") return;
                leavePreview();
              }}
              onFocus={enterPreview}
              onBlur={leavePreview}
            >
              <ChangeGraphic
                state={displayState}
                reducedMotion={reducedMotion}
                motionKind={
                  reducedMotion || !autoplayComplete ? "sequence" : motionKind
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
