"use client";

/**
 * Visual proof object — three directions.
 *
 * Shared rules:
 * - outer tilted layered polygon silhouette is kept identical across A / B / C
 * - one quiet rear depth plane, one authored front plane
 * - restrained white/grey hairline system + a single warm amber accent
 * - no text, no icons, no gradients, no shadows, no rounded cards
 */

const FRONT = "M62 66 L470 100 L452 358 L48 322 Z";
const REAR = "M104 38 L510 72 L492 330 L88 296 Z";

/** maps local content space (0..409 x 0..255) onto the tilted front plane */
const PLANE = "translate(62 66) rotate(4.76) skewX(-3.4)";

const AMBER = "#C79A5B";

function Silhouette({ id }: { id: string }) {
  return (
    <>
      {/* rear depth plane — quieter, slightly further back on hover */}
      <path
        d={REAR}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
        className="transition-all duration-700 ease-out group-hover:stroke-[rgba(255,255,255,0.16)]"
      />
      {/* front plane */}
      <path
        d={FRONT}
        fill="rgba(255,255,255,0.012)"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
        className="transition-all duration-700 ease-out group-hover:stroke-[rgba(255,255,255,0.32)]"
      />
      <clipPath id={id}>
        <path d={FRONT} />
      </clipPath>
    </>
  );
}

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

/* ------------------------------------------------------------------ */
/* A — Editorial Composition                                          */
/* ------------------------------------------------------------------ */

export function VisualProofA() {
  return (
    <Shell>
      <Silhouette id="clip-a" />

      <g clipPath="url(#clip-a)">
        <g transform={PLANE}>
          {/* the whole composition re-crops slightly on hover */}
          <g className="transition-transform duration-[900ms] ease-out group-hover:-translate-x-[14px]">
            {/* masthead rule — the one long horizontal that sets the hierarchy */}
            <line
              x1="18"
              y1="58"
              x2="391"
              y2="58"
              stroke="rgba(255,255,255,0.20)"
              strokeWidth="1"
            />

            {/* column division, asymmetric (not centred) */}
            <line
              x1="248"
              y1="58"
              x2="248"
              y2="237"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
            />

            {/* focal weight: one heavy short rule in the wide column */}
            <rect
              x="18"
              y="104"
              width="150"
              height="3"
              fill="rgba(255,255,255,0.72)"
              className="transition-all duration-700 ease-out group-hover:w-[196px]"
            />

            {/* quiet tonal field anchoring the lower-left mass */}
            <rect
              x="18"
              y="140"
              width="196"
              height="97"
              fill="rgba(255,255,255,0.035)"
              className="transition-opacity duration-700 ease-out group-hover:opacity-[0.6]"
            />

            {/* rhythm in the narrow column */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line
                key={i}
                x1="272"
                y1={86 + i * 22}
                x2={i % 3 === 0 ? 372 : 340}
                y2={86 + i * 22}
                stroke="rgba(255,255,255,0.13)"
                strokeWidth="1"
                className="transition-all duration-700 ease-out group-hover:stroke-[rgba(255,255,255,0.22)]"
              />
            ))}

            {/* single amber focal mark — snaps onto the heavy rule on hover */}
            <rect
              x="232"
              y="46"
              width="24"
              height="24"
              fill={AMBER}
              opacity="0.9"
              className="transition-transform duration-[900ms] ease-out group-hover:translate-x-[-64px] group-hover:translate-y-[46px]"
            />
          </g>
        </g>
      </g>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* B — Structured Visual Field                                        */
/* ------------------------------------------------------------------ */

const COLS = [18, 92, 166, 240, 314, 388];
const ROWS = [22, 75, 128, 181, 234];

export function VisualProofB() {
  return (
    <Shell>
      <Silhouette id="clip-b" />

      <g clipPath="url(#clip-b)">
        <g transform={PLANE}>
          {/* the underlying module system — recedes on hover */}
          <g className="transition-opacity duration-700 ease-out group-hover:opacity-40">
            {COLS.map((x) => (
              <line
                key={`c${x}`}
                x1={x}
                y1={ROWS[0]}
                x2={x}
                y2={ROWS[ROWS.length - 1]}
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="1"
              />
            ))}
            {ROWS.map((y) => (
              <line
                key={`r${y}`}
                x1={COLS[0]}
                y1={y}
                x2={COLS[COLS.length - 1]}
                y2={y}
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* occupied modules — proportional, asymmetric, aligned to the field */}
          <rect
            x={COLS[0]}
            y={ROWS[0]}
            width={COLS[2] - COLS[0]}
            height={ROWS[1] - ROWS[0]}
            fill="rgba(255,255,255,0.085)"
            className="transition-transform duration-[900ms] ease-out group-hover:translate-y-[53px]"
          />
          <rect
            x={COLS[1]}
            y={ROWS[1]}
            width={COLS[3] - COLS[1]}
            height={ROWS[2] - ROWS[1]}
            fill="rgba(255,255,255,0.05)"
            className="transition-transform duration-[900ms] ease-out group-hover:-translate-x-[74px]"
          />
          <rect
            x={COLS[3]}
            y={ROWS[2]}
            width={COLS[5] - COLS[3]}
            height={ROWS[3] - ROWS[2]}
            fill="rgba(255,255,255,0.035)"
            className="transition-transform duration-[900ms] ease-out group-hover:-translate-y-[53px]"
          />

          {/* proportion measure — the one long span that explains the system */}
          <line
            x1={COLS[0]}
            y1={ROWS[4]}
            x2={COLS[3]}
            y2={ROWS[4]}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2"
            className="transition-all duration-[900ms] ease-out group-hover:stroke-[rgba(255,255,255,0.8)]"
          />

          {/* single amber module, outlined — the focal alignment point */}
          <rect
            x={COLS[2]}
            y={ROWS[3]}
            width={COLS[3] - COLS[2]}
            height={ROWS[4] - ROWS[3]}
            fill="none"
            stroke={AMBER}
            strokeWidth="1.25"
            opacity="0.85"
            className="transition-transform duration-[900ms] ease-out group-hover:-translate-x-[74px]"
          />
        </g>
      </g>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* C — Spatial Identity Surface                                       */
/* ------------------------------------------------------------------ */

export function VisualProofC() {
  return (
    <Shell>
      <Silhouette id="clip-c" />

      <g clipPath="url(#clip-c)">
        <g transform={PLANE}>
          {/* the cut: one diagonal that gives the surface its character.
              on hover the cut sweeps, changing the proportion of the halves */}
          <g className="transition-transform duration-[1000ms] ease-out group-hover:translate-x-[26px]">
            <path d="M-40 262 L196 -20 L-40 -20 Z" fill="rgba(255,255,255,0.055)" />
            <path
              d="M196 -20 L-40 262"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1"
              fill="none"
            />
            {/* amber follows the cut, but only part of its length */}
            <path d="M150 33 L34 172" stroke={AMBER} strokeWidth="1.25" opacity="0.9" />
          </g>

          {/* internal plane, offset from the outer geometry — reads as a fold */}
          <path
            d="M92 74 L330 94 L318 208 L80 188 Z"
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1"
            className="transition-transform duration-[1000ms] ease-out group-hover:translate-x-[10px] group-hover:-translate-y-[6px]"
          />

          {/* single depth register at the far edge */}
          <line
            x1="364"
            y1="46"
            x2="364"
            y2="228"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            className="transition-all duration-[1000ms] ease-out group-hover:stroke-[rgba(255,255,255,0.2)]"
          />
        </g>
      </g>
    </Shell>
  );
}
