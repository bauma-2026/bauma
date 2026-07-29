"use client";

/**
 * VISUAL LAYER — proof object
 * Direction C: Spatial Identity Surface. Three variations.
 *
 * Shared, non-negotiable logic across all three:
 * - one front spatial plane (identical silhouette)
 * - one quieter rear depth plane
 * - one strong internal identity decision (and only one)
 * - one restrained amber role
 * - one meaningful, secondary hover behaviour
 *
 * No text, icons, cards, browser chrome, gradients, glow, blur, shadows,
 * rounded rectangles or images. White/grey hairlines + tonal fills only.
 */

const FRONT = "M62 66 L470 100 L452 358 L48 322 Z";
const REAR = "M104 38 L510 72 L492 330 L88 296 Z";

/** maps local content space (~0..409 x 0..255) onto the tilted front plane */
const PLANE = "translate(62 66) rotate(4.76) skewX(-3.4)";

const AMBER = "#C79A5B";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 560 400"
      className="h-auto w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function Silhouette({ clipId }: { clipId: string }) {
  return (
    <>
      <path
        d={REAR}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
        className="transition-[stroke] duration-700 ease-out group-hover:stroke-[rgba(255,255,255,0.15)]"
      />
      <path
        d={FRONT}
        fill="rgba(255,255,255,0.012)"
        stroke="rgba(255,255,255,0.24)"
        strokeWidth="1"
        className="transition-[stroke] duration-700 ease-out group-hover:stroke-[rgba(255,255,255,0.34)]"
      />
      <clipPath id={clipId}>
        <path d={FRONT} />
      </clipPath>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* C1 — DIAGONAL IDENTITY                                             */
/* one controlled diagonal cut; the internal register aligns to it     */
/* ------------------------------------------------------------------ */

/**
 * The cut: a 1:2 proportion, deliberately NOT corner-to-corner. It enters the
 * top edge at 1/3 and exits the left edge at 2/3, so the surface is divided
 * into a small upper-left wedge and a large dominant lower-right region.
 * Register lines below it step in parallel to the cut.
 */
const C1_REGISTER: Array<[number, number, number]> = [
  // [y, x1, x2] — left ends step in along the cut's angle, keeping a
  // constant inset from it so the register belongs to the cut
  [150, 92, 268],
  [186, 137, 322],
  [222, 182, 376],
];

export function VisualProofC1() {
  return (
    <Shell>
      <Silhouette clipId="clip-c1" />

      <g clipPath="url(#clip-c1)">
        <g transform={PLANE}>
          {/* single identity move: one diagonal proportioning the plane.
              hover slides the cut, re-proportioning the two regions only. */}
          <g className="transition-transform duration-[1100ms] ease-out group-hover:translate-x-[22px]">
            {/* upper-left region — the lighter of the two, roughly one third */}
            <path
              d="M-60 -60 L286 -60 L-60 384 Z"
              fill="rgba(255,255,255,0.075)"
              className="transition-opacity duration-[1100ms] ease-out group-hover:opacity-70"
            />
            <path
              d="M286 -60 L-60 384"
              fill="none"
              stroke="rgba(255,255,255,0.36)"
              strokeWidth="1.25"
            />

            {/* the dominant region carries a quiet register parallel to the cut */}
            {C1_REGISTER.map(([y, x1, x2]) => (
              <line
                key={y}
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke="rgba(255,255,255,0.19)"
                strokeWidth="1"
                className="transition-[stroke] duration-700 ease-out group-hover:stroke-[rgba(255,255,255,0.28)]"
              />
            ))}

            {/* amber: one short active segment of the cut — the focal joint */}
            <path
              d="M182 74 L136 133"
              fill="none"
              stroke={AMBER}
              strokeWidth="1.75"
              opacity="0.95"
            />
          </g>
        </g>
      </g>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* C2 — FOLDED SURFACE                                                */
/* the plane turns once; one secondary plane gains dimension           */
/* ------------------------------------------------------------------ */

export function VisualProofC2() {
  return (
    <Shell>
      <Silhouette clipId="clip-c2" />

      <g clipPath="url(#clip-c2)">
        <g transform={PLANE}>
          {/* the larger flat portion of the surface, held at one value */}
          <path
            d="M-60 -60 L286 -60 L286 320 L-60 320 Z"
            fill="rgba(255,255,255,0.028)"
          />

          {/* the turned portion — one secondary plane at a foreshortened
              value, narrower than the flat side because it angles away.
              hover lets it settle slightly toward the crease. */}
          <g className="transition-transform duration-[1100ms] ease-out group-hover:-translate-x-[8px]">
            <path
              d="M286 -60 L474 -60 L474 320 L286 320 Z"
              fill="rgba(255,255,255,0.085)"
            />
            {/* one narrow step at the far edge marks where the plane turns back */}
            <path
              d="M446 -60 L474 -60 L474 320 L446 320 Z"
              fill="rgba(255,255,255,0.045)"
            />
            <line
              x1="446"
              y1="-60"
              x2="446"
              y2="320"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1"
            />
          </g>

          {/* the crease — the strongest edge in the object, off-centre */}
          <line
            x1="286"
            y1="-60"
            x2="286"
            y2="320"
            stroke="rgba(255,255,255,0.44)"
            strokeWidth="1.25"
            className="transition-[stroke] duration-700 ease-out group-hover:stroke-[rgba(255,255,255,0.6)]"
          />

          {/* the flat side stays quiet: one long proportion register */}
          <line
            x1="18"
            y1="206"
            x2="254"
            y2="206"
            stroke="rgba(255,255,255,0.17)"
            strokeWidth="1"
          />

          {/* amber: the hinge segment where the surface turns */}
          <line
            x1="286"
            y1="152"
            x2="286"
            y2="206"
            stroke={AMBER}
            strokeWidth="2"
            opacity="0.95"
          />
        </g>
      </g>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* C3 — IDENTITY PANEL                                                */
/* one dominant internal panel with a subtracted corner (signature)    */
/* ------------------------------------------------------------------ */

/**
 * Proportions, decided against the homepage rather than in isolation.
 *
 * The Visual Layer sits directly after the System Layer, whose right column is
 * a literal UI window: rounded corners, traffic lights, typing code, table
 * rows. That is the densest, most representational artifact on the page, so
 * this object is deliberately the lightest and most abstract one — it reads as
 * the resolution of the argument, not as a second mockup.
 *
 * Panel: inset on all four sides so it reads as a contained mark rather than a
 * cropped background shape. Occupies ~72% of the plane's width and ~68% of its
 * height, which keeps it dominant while leaving the supporting area empty.
 * Notch: a single subtraction of ~28% width by ~26% height off the top-right —
 * large enough to survive being scaled down to a nav glyph, small enough that
 * the panel still reads as one body rather than two.
 */
const C3_PANEL = {
  left: 26,
  top: 40,
  right: 322,
  bottom: 232,
  notchX: 238,
  notchY: 96,
} as const;

const C3_PATH = [
  `M${C3_PANEL.left} ${C3_PANEL.top}`,
  `L${C3_PANEL.notchX} ${C3_PANEL.top}`,
  `L${C3_PANEL.notchX} ${C3_PANEL.notchY}`,
  `L${C3_PANEL.right} ${C3_PANEL.notchY}`,
  `L${C3_PANEL.right} ${C3_PANEL.bottom}`,
  `L${C3_PANEL.left} ${C3_PANEL.bottom}`,
  "Z",
].join(" ");

/** the subtraction edge only — never the full panel outline */
const C3_NOTCH = [
  `M${C3_PANEL.notchX} ${C3_PANEL.top}`,
  `L${C3_PANEL.notchX} ${C3_PANEL.notchY}`,
  `L${C3_PANEL.right} ${C3_PANEL.notchY}`,
].join(" ");

export function VisualProofC3() {
  return (
    <Shell>
      <Silhouette clipId="clip-c3" />

      <g clipPath="url(#clip-c3)">
        <g transform={PLANE}>
          {/* two hairline registers tie the subtraction back to the outer
              geometry, so the notch reads as measured rather than arbitrary */}
          <line
            x1={C3_PANEL.notchX}
            y1="-60"
            x2={C3_PANEL.notchX}
            y2={C3_PANEL.top}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <line
            x1={C3_PANEL.right}
            y1={C3_PANEL.notchY}
            x2="452"
            y2={C3_PANEL.notchY}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
          />

          {/* the dominant panel: one subtracted corner is the whole signature.
              hover refines alignment and focus only — it adds nothing new. */}
          <g className="transition-transform duration-[1000ms] ease-out group-hover:translate-x-[7px] group-hover:-translate-y-[5px]">
            <path
              d={C3_PATH}
              fill="rgba(255,255,255,0.07)"
              stroke="rgba(255,255,255,0.26)"
              strokeWidth="1"
              className="transition-[fill] duration-700 ease-out group-hover:fill-[rgba(255,255,255,0.095)]"
            />
            <path
              d={C3_NOTCH}
              fill="none"
              stroke={AMBER}
              strokeWidth="1.75"
              opacity="0.95"
            />
          </g>
        </g>
      </g>
    </Shell>
  );
}
