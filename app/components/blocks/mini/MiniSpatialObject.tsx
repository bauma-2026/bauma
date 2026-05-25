type MiniSpatialSystemObjectProps = {
  className?: string;
};

export default function MiniSpatialSystemObject({
  className = "",
}: MiniSpatialSystemObjectProps) {
  return (
    <svg
      viewBox="0 0 360 360"
      fill="none"
      className={className}
      aria-hidden="true"
    >
{/* Circle / clarity field */}
<circle
  cx="244"
  cy="176"
  r="84"
  stroke="rgba(255,255,255,0.27)"
  strokeWidth="1.2"
/>

<ellipse
  cx="226"
  cy="176"
  rx="106"
  ry="66"
  transform="rotate(-12 226 176)"
  stroke="rgba(255,255,255,0.12)"
  strokeWidth="1"
/>

<circle
  cx="266"
  cy="164"
  r="26"
  stroke="rgba(255,255,255,0.15)"
  strokeWidth="1"
/>

<circle cx="266" cy="164" r="2.2" fill="rgba(255,255,255,0.4)" />

      {/* Square / structure */}
      <g transform="rotate(8 150 126)">
        <rect
          x="116"
          y="92"
          width="82"
          height="82"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.2"
        />
        <path
          d="M132 108 L182 108 L182 158 L132 158 Z"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      </g>

      {/* Triangle / direction */}
      <g transform="translate(128 206)">
        <polygon
          points="36,0 72,68 0,68"
          stroke="rgba(255,255,255,0.17)"
          strokeWidth="1.2"
        />
        <polygon
          points="36,18 55,54 17,54"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      </g>

      {/* System relations */}
      <path
        d="M168 132 C205 138 232 146 266 164"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1"
      />
      <path
        d="M266 164 C232 188 210 208 164 240"
        stroke="rgba(255,255,255,0.075)"
        strokeWidth="1"
      />
      <path
        d="M150 128 C156 168 160 196 164 240"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />
    </svg>
  );
}