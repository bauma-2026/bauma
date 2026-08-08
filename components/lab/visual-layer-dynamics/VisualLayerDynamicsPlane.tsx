"use client";

/**
 * Lab-only Visual Layer interaction physics.
 * Production MiniResponsivePlane untouched.
 *
 * Impulse → fast open (~85–90%) → damped settle → asymmetric release.
 * Front B opacities locked. Layer lag via inertia on one event, not staged UI delays.
 */

import { useEffect, useRef, useState } from "react";

import { isFiniteNumber } from "@/lib/svgFinite";

function finiteCoord(value: string | number): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return isFiniteNumber(n) ? n : null;
}

/** Locked front activation (Variant B). */
export const FRONT_B = { rest: 0.35, peak: 0.6, hold: 0.55 } as const;
const AMBER = { rest: 0.62, peak: 0.78, hold: 0.72 } as const;
const REAR_STROKE = { rest: 0.085, active: 0.12 } as const;

export type PhysicsId = "P1" | "P2" | "P3";

/**
 * Physics presets — same coupling architecture, different attack/damping.
 * Layer lagMs: subtle inertia offsets on the shared event (not long sequences).
 */
export const PHYSICS = {
  /** Crisp impulse, firm damp — recommended candidate. */
  P1: {
    label: "P1 — crisp damp",
    openImpulseMs: 190,
    openSettleMs: 340,
    openImpulseTarget: 0.88,
    releaseKick: 0.18,
    releaseDampMs: 380,
    lagMs: { amber: 22, rear: 40, connectors: 58 },
    /** easeOutQuint-ish attack, then soft cubic settle */
    attackPow: 4.2,
    settlePow: 1.55,
    releasePow: 2.4,
  },
  /** Slightly heavier mass — longer settle, still fast attack. */
  P2: {
    label: "P2 — heavier mass",
    openImpulseMs: 220,
    openSettleMs: 420,
    openImpulseTarget: 0.86,
    releaseKick: 0.14,
    releaseDampMs: 420,
    lagMs: { amber: 28, rear: 48, connectors: 68 },
    attackPow: 3.8,
    settlePow: 1.45,
    releasePow: 2.2,
  },
  /** Snappiest attack, shortest residual. */
  P3: {
    label: "P3 — snap damp",
    openImpulseMs: 170,
    openSettleMs: 300,
    openImpulseTarget: 0.9,
    releaseKick: 0.22,
    releaseDampMs: 320,
    lagMs: { amber: 20, rear: 36, connectors: 55 },
    attackPow: 4.6,
    settlePow: 1.65,
    releasePow: 2.6,
  },
} as const;

type Mode = "rest" | "open" | "release";

type VisualLayerDynamicsPlaneProps = {
  className?: string;
  physics?: PhysicsId;
  clipId?: string;
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/** Fast attack to target, then slow remainder — no overshoot. */
function openProgress(
  elapsed: number,
  impulseMs: number,
  settleMs: number,
  impulseTarget: number,
  attackPow: number,
  settlePow: number,
) {
  if (elapsed <= 0) return 0;
  if (elapsed < impulseMs) {
    const t = elapsed / impulseMs;
    return impulseTarget * (1 - (1 - t) ** attackPow);
  }
  const t = clamp01((elapsed - impulseMs) / settleMs);
  const settled = 1 - (1 - t) ** settlePow;
  return impulseTarget + (1 - impulseTarget) * settled;
}

/** Immediate disengage kick, then damped return — not entry rewind. */
function releaseProgress(
  from: number,
  elapsed: number,
  kick: number,
  dampMs: number,
  releasePow: number,
) {
  if (elapsed <= 0) return from;
  const kicked = Math.max(0, from - kick);
  const t = clamp01(elapsed / dampMs);
  const ease = 1 - (1 - t) ** releasePow;
  return kicked * (1 - ease);
}

function layerU(master: number, lagMs: number, elapsed: number) {
  if (lagMs <= 0) return master;
  // Inertia: layer samples master as if event started slightly later.
  const localElapsed = Math.max(0, elapsed - lagMs);
  if (elapsed <= 0) return 0;
  // Scale so lag doesn't change total duration character — sample ratio of master curve time.
  return master; // replaced by caller with time-shifted evaluation
}

export default function VisualLayerDynamicsPlane({
  className = "",
  physics = "P1",
  clipId = "vld-front-clip",
}: VisualLayerDynamicsPlaneProps) {
  const cfg = PHYSICS[physics];
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>("rest");
  const modeStartedRef = useRef(0);
  const releaseFromRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const frontRef = useRef<SVGPolygonElement>(null);
  const amberRef = useRef<SVGPathElement>(null);
  const rearGroupRef = useRef<SVGGElement>(null);
  const rearPolyRef = useRef<SVGPolygonElement>(null);
  const mainGroupRef = useRef<SVGGElement>(null);
  const fillPolyRef = useRef<SVGPolygonElement>(null);
  const fillInnerRef = useRef<SVGPathElement>(null);
  const connTopRef = useRef<SVGLineElement>(null);
  const connBotRef = useRef<SVGLineElement>(null);
  const extraRefs = useRef<(SVGLineElement | null)[]>([]);
  const [, bump] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setPrefersReducedMotion(mq.matches);
      if (mq.matches) {
        modeRef.current = "rest";
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const apply = (uFront: number, uAmber: number, uRear: number, uConn: number) => {
      const frontOp =
        FRONT_B.rest + (FRONT_B.peak - FRONT_B.rest) * uFront;
      // Hold softens peak slightly when fully open
      const frontSoft =
        uFront > 0.92
          ? FRONT_B.hold + (FRONT_B.peak - FRONT_B.hold) * (1 - (uFront - 0.92) / 0.08)
          : frontOp;
      const amberOp = AMBER.rest + (AMBER.peak - AMBER.rest) * uAmber;
      const amberSoft =
        uAmber > 0.92
          ? AMBER.hold + (AMBER.peak - AMBER.hold) * (1 - (uAmber - 0.92) / 0.08)
          : amberOp;

      if (frontRef.current) {
        frontRef.current.setAttribute(
          "stroke",
          `rgba(255,255,255,${frontSoft.toFixed(3)})`,
        );
      }
      if (amberRef.current) {
        amberRef.current.style.opacity = String(amberSoft);
      }

      const mainX = 1 + 1 * uFront;
      const mainY = 0 + -1 * uFront;
      const mainR = -1 + 0.65 * uFront;
      if (mainGroupRef.current) {
        mainGroupRef.current.style.transform = `translate(${mainX}px, ${mainY}px) rotate(${mainR}deg)`;
      }

      const rearX = 7 * uRear;
      const rearY = 6 * uRear;
      if (rearGroupRef.current) {
        rearGroupRef.current.style.transform = `translate(${rearX}px, ${rearY}px)`;
      }
      if (rearPolyRef.current) {
        const rs = REAR_STROKE.rest + (REAR_STROKE.active - REAR_STROKE.rest) * uRear;
        rearPolyRef.current.setAttribute("stroke", `rgba(255,255,255,${rs.toFixed(3)})`);
        rearPolyRef.current.setAttribute(
          "fill",
          `rgba(255,255,255,${(0.018 + 0.008 * uRear).toFixed(3)})`,
        );
      }
      if (fillPolyRef.current) {
        fillPolyRef.current.setAttribute(
          "fill",
          `rgba(255,255,255,${(0.026 + 0.006 * uFront).toFixed(3)})`,
        );
      }
      if (fillInnerRef.current) {
        fillInnerRef.current.style.fillOpacity = String(0.035 + 0.004 * uFront);
      }

      const topX = 344 + (352 - 344) * uConn;
      const topY = 117 + (124 - 117) * uConn;
      const botX = 109 + (117 - 109) * uConn;
      const botY = 261 + (268 - 261) * uConn;
      if (connTopRef.current) {
        connTopRef.current.setAttribute("x2", String(topX));
        connTopRef.current.setAttribute("y2", String(topY));
      }
      if (connBotRef.current) {
        connBotRef.current.setAttribute("x2", String(botX));
        connBotRef.current.setAttribute("y2", String(botY));
      }
      for (const line of extraRefs.current) {
        if (line) line.style.opacity = String(0.11 * uConn);
      }

      rootRef.current?.setAttribute("data-vld-u", uFront.toFixed(3));
      rootRef.current?.setAttribute("data-vld-mode", modeRef.current);
    };

    const evalOpenAt = (elapsed: number) =>
      openProgress(
        elapsed,
        cfg.openImpulseMs,
        cfg.openSettleMs,
        cfg.openImpulseTarget,
        cfg.attackPow,
        cfg.settlePow,
      );

    const tick = (now: number) => {
      const mode = modeRef.current;
      const elapsed = now - modeStartedRef.current;

      let uFront = 0;
      let uAmber = 0;
      let uRear = 0;
      let uConn = 0;

      if (mode === "rest") {
        uFront = uAmber = uRear = uConn = 0;
      } else if (mode === "open") {
        uFront = evalOpenAt(elapsed);
        uAmber = evalOpenAt(Math.max(0, elapsed - cfg.lagMs.amber));
        uRear = evalOpenAt(Math.max(0, elapsed - cfg.lagMs.rear));
        uConn = evalOpenAt(Math.max(0, elapsed - cfg.lagMs.connectors));
      } else {
        // release: each layer damps from shared kick-from, slight lag so mass trails
        const base = releaseProgress(
          releaseFromRef.current,
          elapsed,
          cfg.releaseKick,
          cfg.releaseDampMs,
          cfg.releasePow,
        );
        uFront = base;
        uAmber = releaseProgress(
          releaseFromRef.current,
          Math.max(0, elapsed - 12),
          cfg.releaseKick * 1.05,
          cfg.releaseDampMs * 0.92,
          cfg.releasePow,
        );
        uRear = releaseProgress(
          releaseFromRef.current,
          Math.max(0, elapsed - 28),
          cfg.releaseKick * 0.85,
          cfg.releaseDampMs * 1.08,
          cfg.releasePow * 0.95,
        );
        uConn = releaseProgress(
          releaseFromRef.current,
          Math.max(0, elapsed - 40),
          cfg.releaseKick * 0.9,
          cfg.releaseDampMs,
          cfg.releasePow,
        );
        if (base < 0.004 && uRear < 0.004) {
          modeRef.current = "rest";
          uFront = uAmber = uRear = uConn = 0;
        }
      }

      // Hold life: tiny residual ambient when fully open
      if (mode === "open" && uFront > 0.97) {
        const breath = Math.sin(now / 2400) * 0.012;
        uFront = clamp01(uFront + breath * 0.15);
        uRear = clamp01(uRear + breath * 0.35);
      }

      apply(uFront, uAmber, uRear, uConn);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [cfg, physics]);

  const onActivate = () => {
    if (prefersReducedMotion) return;
    modeRef.current = "open";
    modeStartedRef.current = performance.now();
    bump((n) => n + 1);
  };

  const onDeactivate = () => {
    if (prefersReducedMotion) return;
    const elapsed = performance.now() - modeStartedRef.current;
    const current =
      modeRef.current === "open"
        ? openProgress(
            elapsed,
            cfg.openImpulseMs,
            cfg.openSettleMs,
            cfg.openImpulseTarget,
            cfg.attackPow,
            cfg.settlePow,
          )
        : modeRef.current === "release"
          ? releaseFromRef.current
          : 0;
    releaseFromRef.current = Math.max(current, 0.2);
    modeRef.current = "release";
    modeStartedRef.current = performance.now();
    bump((n) => n + 1);
  };

  // silence unused helper warning
  void layerU;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className}
      data-vld-physics={physics}
      data-vld-mode="rest"
      data-vld-u="0"
    >
      <svg
        viewBox="0 0 460 380"
        fill="none"
        shapeRendering="geometricPrecision"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        className="pointer-events-auto h-full w-full overflow-visible"
      >
        <defs>
          <clipPath id={clipId}>
            <polygon points="118,88 326,106 298,286 92,248" />
          </clipPath>
        </defs>
        <g
          ref={mainGroupRef}
          pointerEvents="none"
          style={{
            transform: "translate(1px, 0) rotate(-1deg)",
            transformBox: "view-box",
            transformOrigin: "230px 190px",
            willChange: "transform",
          }}
        >
          <g
            style={{
              transform: "scale(1.05)",
              transformBox: "view-box",
              transformOrigin: "218px 192.5px",
            }}
          >
            <g
              ref={rearGroupRef}
              style={{
                transform: "translate(0, 0)",
                transformBox: "view-box",
                transformOrigin: "230px 190px",
                willChange: "transform",
              }}
            >
              <polygon
                ref={rearPolyRef}
                points="136,102 344,117 310,297 109,261"
                fill="rgba(255,255,255,0.018)"
                stroke={`rgba(255,255,255,${REAR_STROKE.rest})`}
              />
            </g>
            <polygon
              ref={fillPolyRef}
              points="118,88 326,106 298,286 92,248"
              fill="rgba(255,255,255,0.026)"
            />
            <g clipPath={`url(#${clipId})`}>
              <path
                ref={fillInnerRef}
                d="M113.9286 113.0547 L234.8 125.4 L228.8 163.1 L271.4 168.3 L254.2201 277.9241 L92 248 Z"
                fill="rgb(255,255,255)"
                style={{ fillOpacity: 0.035 }}
              />
              <path
                d="M113.9286 113.0547 L234.8 125.4"
                fill="none"
                stroke="rgba(255,255,255,0.21)"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
              <line
                x1="271.4"
                y1="168.3"
                x2="254.2201"
                y2="277.9241"
                stroke="rgba(255,255,255,0.11)"
                strokeLinecap="butt"
              />
              <path
                ref={amberRef}
                d="M234.8 125.4 L228.8 163.1 L271.4 168.3"
                fill="none"
                stroke="#D1A45F"
                strokeWidth="1.25"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                style={{ opacity: AMBER.rest }}
              />
            </g>
            <polygon
              ref={frontRef}
              points="118,88 326,106 298,286 92,248"
              fill="none"
              stroke={`rgba(255,255,255,${FRONT_B.rest})`}
            />
            <line
              ref={connTopRef}
              x1="326"
              y1="106"
              x2="344"
              y2="117"
              stroke="rgba(255,255,255,0.08)"
            />
            <line
              ref={connBotRef}
              x1="92"
              y1="248"
              x2="109"
              y2="261"
              stroke="rgba(255,255,255,0.06)"
            />
            {(
              [
                ["118", "88", "144", "109"],
                ["298", "286", "322", "307"],
              ] as const
            ).map(([x1, y1, x2, y2], i) => {
              const a = finiteCoord(x1);
              const b = finiteCoord(y1);
              const c = finiteCoord(x2);
              const d = finiteCoord(y2);
              if (a == null || b == null || c == null || d == null) return null;
              return (
                <line
                  key={`${a}-${b}-${c}-${d}`}
                  ref={(el) => {
                    extraRefs.current[i] = el;
                  }}
                  x1={a}
                  y1={b}
                  x2={c}
                  y2={d}
                  stroke="rgba(255,255,255,0.06)"
                  style={{ opacity: 0 }}
                />
              );
            })}
          </g>
        </g>
        <polygon
          points="94,68 346,90 362,118 338,318 96,286 72,260"
          fill="rgba(0,0,0,0.001)"
          stroke="none"
          pointerEvents="all"
          onPointerEnter={onActivate}
          onPointerLeave={onDeactivate}
        />
      </svg>
    </div>
  );
}
