"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

import "./SelectedWorkMotion.css";

/**
 * One-shot, viewport-triggered motion for the Selected Work typographic
 * surfaces (`MiniSelectedWorkSurfaces`). The surfaces themselves are not
 * changed: SelectedWorkMotion.css targets their structure from the outside,
 * scoped to the `.swm` wrapper rendered here. Shared by the homepage
 * (`MiniSelectedWorkHome`) and the review lab (`/lab/selected-work-motion`).
 *
 * Initialization strategy (states live in a `data-state` attribute, see the CSS):
 *  - The server renders, and the page shows, the static surface. Nothing is hidden,
 *    and without JS or with reduced motion nothing here ever applies.
 *  - After hydration, a surface that is still entirely below the viewport is
 *    "armed" into a readable first pose (opacity never below .5). A surface
 *    already in view, or above it, is left static, so late JS can never alter
 *    visible text.
 *  - An IntersectionObserver plays an armed surface once, when 30% is visible.
 *    If it is scrolled past without playing it is released back to static.
 *  - It plays once per page view. No React state is touched while animating.
 *
 * The optional props below exist for the lab's review controls only.
 */

export type MotionSurfaceId = "odstrani" | "dema" | "flexido";
export type MotionStatus = "static" | "armed" | "playing" | "played";

/** Slow-motion factor offered by the lab (`--swm-t` in the CSS). */
export const MOTION_SLOW = 4;

/** Live media query: reduced motion is never armed. */
const REDUCED =
  typeof window === "undefined"
    ? ({ matches: false } as MediaQueryList)
    : window.matchMedia("(prefers-reduced-motion: reduce)");

/** Longest sequence (Odstrani, 1000ms) plus a margin; scaled by the slow factor. */
const DONE_AFTER_MS = 1150;
/** Share of the surface that must be visible before it plays. */
const ENTER_RATIO = 0.3;

export default function SelectedWorkMotion({
  id,
  col,
  replay = 0,
  slow = false,
  forceStatic = false,
  onStatus,
  children,
}: {
  id: MotionSurfaceId;
  /** Column (1-3) for the 120ms desktop stagger. */
  col: 1 | 2 | 3;
  replay?: number;
  slow?: boolean;
  forceStatic?: boolean;
  onStatus?: (id: MotionSurfaceId, s: MotionStatus) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const latest = useRef({ slow, forceStatic });

  useEffect(() => {
    latest.current = { slow, forceStatic };
  }, [slow, forceStatic]);

  const finish = useCallback(
    (el: HTMLElement, s: MotionStatus) => {
      window.clearTimeout(timer.current);
      el.setAttribute("data-state", "done");
      onStatus?.(id, s);
    },
    [id, onStatus],
  );

  const play = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    window.clearTimeout(timer.current);
    if (REDUCED.matches || latest.current.forceStatic) {
      finish(el, "static");
      return;
    }
    // armed pose, flush, then start: restarts every animation from the same pose
    el.setAttribute("data-state", "armed");
    void el.offsetWidth;
    el.setAttribute("data-state", "play");
    onStatus?.(id, "playing");
    timer.current = window.setTimeout(() => finish(el, "played"), DONE_AFTER_MS * (latest.current.slow ? MOTION_SLOW : 1));
  }, [id, onStatus, finish]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const state = el.getAttribute("data-state");
    // StrictMode re-run, or already handled: never re-arm a surface that has played.
    if (state === "play" || state === "done") return;
    if (REDUCED.matches || latest.current.forceStatic) return;
    // Only a surface fully below the viewport may change appearance.
    if (state !== "armed") {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        finish(el, "static");
        return;
      }
      el.setAttribute("data-state", "armed");
      onStatus?.(id, "armed");
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= ENTER_RATIO) {
            io.disconnect();
            play();
            return;
          }
          if (!e.isIntersecting && e.boundingClientRect.top < 0) {
            // scrolled past without playing: release to the static design
            io.disconnect();
            finish(el, "static");
            return;
          }
        }
      },
      { threshold: [0, ENTER_RATIO] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [id, onStatus, play, finish]);

  // Lab replay control (never changes on the homepage).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    play();
  }, [replay, play]);

  return (
    <div ref={ref} className="swm" data-surface={id} data-col={col} data-live={forceStatic ? undefined : ""}>
      {children}
    </div>
  );
}
