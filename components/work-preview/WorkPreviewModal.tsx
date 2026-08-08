"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

import WorkPreviewContent, { workPreviewTitleId } from "./WorkPreviewContent";
import {
  ANCHORED_TIMING,
  BASELINE_TIMING,
  MODAL_EASE,
  MODAL_SURFACE,
} from "./modalSurface";
import { getWorkPreviewProject } from "./workPreviewData";
import {
  computeFlipTransform,
  flipTransformString,
  isAnchoredDesktop,
  isRectInViewport,
  rectToFlip,
} from "./useAnchoredFlip";
import { useBackgroundInert } from "./useBackgroundInert";
import { useFocusTrap } from "./useFocusTrap";
import { useModalStudyMode } from "./useModalStudyMode";
import { useScrollLock } from "./useScrollLock";
import { useWorkPreview } from "./WorkPreviewProvider";

export default function WorkPreviewModal() {
  const { activeId, openMeta, closePreview, getTriggerElement } = useWorkPreview();
  const studyMode = useModalStudyMode();
  const project = activeId ? getWorkPreviewProject(activeId) : null;

  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [shellTransform, setShellTransform] = useState<string | null>(null);
  const [anchoredTransition, setAnchoredTransition] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const restoreTriggerIdRef = useRef<string | null>(null);

  const studySurface = studyMode !== null;
  const isOpen = Boolean(project && rendered);
  /**
   * Lift inert as soon as the dialog starts hiding so the trigger can receive focus.
   * Keep the trap mounted through the close animation (until project clears).
   */
  const backgroundInert = Boolean(project && visible);
  const trapActive = Boolean(project && rendered);

  useScrollLock(isOpen);
  useBackgroundInert(backgroundInert);
  useFocusTrap(trapActive, panelRef);

  useEffect(() => {
    if (project) {
      restoreTriggerIdRef.current = project.id;
    }
  }, [project]);

  const shouldUseAnchoredOpen = Boolean(
    project &&
      studyMode === "anchored" &&
      !reducedMotion &&
      openMeta?.fromTrigger &&
      openMeta.triggerRect,
  );

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (project) {
      setRendered(true);
      setIsClosing(false);

      const runAnchored = () => {
        const panel = panelRef.current;
        const fromRect = openMeta?.triggerRect;

        if (!panel || !fromRect || !isAnchoredDesktop()) {
          setAnchoredTransition(false);
          setShellTransform(null);
          setVisible(true);
          setContentVisible(true);
          return;
        }

        setAnchoredTransition(true);
        setVisible(true);
        setContentVisible(false);
        setShellTransform(null);

        window.requestAnimationFrame(() => {
          const toRect = panel.getBoundingClientRect();
          const flip = computeFlipTransform(
            rectToFlip(fromRect),
            rectToFlip(toRect),
          );
          setShellTransform(
            flipTransformString(flip.x, flip.y, flip.scaleX, flip.scaleY),
          );

          window.requestAnimationFrame(() => {
            setShellTransform("translate3d(0, 0, 0) scale(1, 1)");
          });

          window.setTimeout(() => {
            setContentVisible(true);
          }, ANCHORED_TIMING.contentDelay);
        });
      };

      if (shouldUseAnchoredOpen) {
        const t = window.setTimeout(runAnchored, 0);
        return () => window.clearTimeout(t);
      }

      setAnchoredTransition(false);
      setShellTransform(null);
      const raf = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setVisible(true);
          setContentVisible(true);
        });
      });
      return () => window.cancelAnimationFrame(raf);
    }

    if (!rendered) return;

    setVisible(false);
    setContentVisible(false);
    const timeout = window.setTimeout(() => {
      setRendered(false);
      setIsClosing(false);
      setShellTransform(null);
      setAnchoredTransition(false);
    }, reducedMotion ? BASELINE_TIMING.reduced : BASELINE_TIMING.close);

    return () => window.clearTimeout(timeout);
  }, [
    project,
    rendered,
    reducedMotion,
    shouldUseAnchoredOpen,
    openMeta?.triggerRect,
    openMeta?.fromTrigger,
  ]);

  const restoreTriggerFocus = useCallback(() => {
    const id = restoreTriggerIdRef.current;
    if (!id) return;
    const trigger = getTriggerElement(id);
    if (!trigger) return;
    // After inert lifts and URL close settles — never leave focus on body.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (trigger.isConnected) {
          trigger.focus({ preventScroll: true });
        }
      });
    });
  }, [getTriggerElement]);

  const finishClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    closePreview();
    restoreTriggerFocus();
  }, [closePreview, restoreTriggerFocus]);

  const handleClose = useCallback(() => {
    if (isClosing || !project) return;

    setIsClosing(true);
    setContentVisible(false);

    const tryAnchoredClose =
      anchoredTransition &&
      studyMode === "anchored" &&
      !reducedMotion &&
      isAnchoredDesktop() &&
      panelRef.current;

    if (tryAnchoredClose) {
      const triggerEl = getTriggerElement(project.id);
      const triggerRect = triggerEl?.getBoundingClientRect();

      if (triggerRect && isRectInViewport(rectToFlip(triggerRect))) {
        const toRect = panelRef.current!.getBoundingClientRect();
        const flip = computeFlipTransform(
          rectToFlip(triggerRect),
          rectToFlip(toRect),
        );
        setShellTransform(
          flipTransformString(flip.x, flip.y, flip.scaleX, flip.scaleY),
        );
        setVisible(false);
        closeTimerRef.current = window.setTimeout(
          finishClose,
          ANCHORED_TIMING.closeShell,
        );
        return;
      }
    }

    setAnchoredTransition(false);
    setShellTransform(null);
    setVisible(false);
    closeTimerRef.current = window.setTimeout(
      finishClose,
      reducedMotion ? BASELINE_TIMING.reduced : BASELINE_TIMING.close,
    );
  }, [
    anchoredTransition,
    finishClose,
    getTriggerElement,
    isClosing,
    project,
    reducedMotion,
    studyMode,
  ]);

  useEffect(() => {
    if (!project) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [project, handleClose]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  if (!mounted || !rendered || !project) return null;

  const openDuration = reducedMotion
    ? BASELINE_TIMING.reduced
    : anchoredTransition
      ? ANCHORED_TIMING.shellExpand
      : BASELINE_TIMING.open;

  const closeDuration = reducedMotion
    ? BASELINE_TIMING.reduced
    : isClosing && anchoredTransition
      ? ANCHORED_TIMING.closeShell
      : BASELINE_TIMING.close;

  const duration = visible && !isClosing ? openDuration : closeDuration;

  let panelTransform: string | undefined;
  if (reducedMotion) {
    panelTransform = undefined;
  } else if (shellTransform !== null) {
    panelTransform = shellTransform;
  } else if (visible) {
    panelTransform = "translateY(0) scale(1)";
  } else {
    panelTransform = "translateY(14px) scale(0.99)";
  }

  const panelStyle: CSSProperties = {
    background: studySurface ? MODAL_SURFACE.panelGradient : "#0a0a0a",
    borderColor: studySurface ? MODAL_SURFACE.border : undefined,
    boxShadow: studySurface
      ? MODAL_SURFACE.shadow
      : "0 24px 80px rgba(0,0,0,0.55)",
    opacity: visible ? 1 : 0,
    transformOrigin: "center center",
    transform: panelTransform,
    transitionProperty: reducedMotion
      ? "opacity"
      : shellTransform !== null || anchoredTransition
        ? "transform, opacity"
        : "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: MODAL_EASE,
  };

  const backdropColor = studySurface
    ? MODAL_SURFACE.backdrop
    : "rgba(0, 0, 0, 0.72)";

  return createPortal(
    <div className="fixed inset-0 z-[9000] flex items-stretch justify-center p-0 sm:items-center sm:p-8">
      <div
        ref={backdropRef}
        className="absolute inset-0 transition-opacity"
        style={{
          backgroundColor: backdropColor,
          opacity: visible ? 1 : 0,
          transitionDuration: `${
            visible ? ANCHORED_TIMING.backdropIn : ANCHORED_TIMING.closeBackdrop
          }ms`,
          transitionTimingFunction: MODAL_EASE,
        }}
        onClick={(event) => {
          if (event.target === backdropRef.current) handleClose();
        }}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={workPreviewTitleId(project.id)}
        className={[
          "relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden text-white",
          studySurface ? "sm:border" : "border-white/10 sm:border",
          "sm:h-auto sm:max-h-[calc(100dvh-64px)] sm:max-w-[min(1440px,calc(100vw-64px))] sm:rounded-[22px]",
        ].join(" ")}
        style={panelStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={[
            "sticky top-0 z-10 flex items-center justify-end",
            studySurface
              ? "border-b border-white/[0.08] bg-[#131313]/92 px-3 py-0.5 sm:px-4 sm:py-1"
              : "border-b border-white/10 bg-[#0a0a0a]/95 px-3 py-2 sm:px-4",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/55 transition hover:bg-white/[0.05] hover:text-white/88 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            aria-label="Zapri predogled projekta"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: reducedMotion
              ? undefined
              : contentVisible
                ? "translateY(0)"
                : "translateY(6px)",
            transitionProperty: reducedMotion ? "opacity" : "opacity, transform",
            transitionDuration: contentVisible ? "220ms" : "160ms",
            transitionTimingFunction: MODAL_EASE,
          }}
        >
          <WorkPreviewContent project={project} compactIntro={studySurface} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
