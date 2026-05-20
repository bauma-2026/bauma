type MiniSpatialSystemObjectProps = {
  className?: string;
};

export default function MiniSpatialSystemObject({
  className = "",
}: MiniSpatialSystemObjectProps) {
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Spatial field */}
      <circle
        cx="250"
        cy="205"
        r="128"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      <ellipse
        cx="250"
        cy="205"
        rx="126"
        ry="54"
        stroke="rgba(255,255,255,0.045)"
        strokeWidth="1"
        transform="rotate(-12 250 205)"
      />

      {/* Structure / square frame */}
      <g transform="rotate(8 160 145)">
        <rect
          x="95"
          y="80"
          width="130"
          height="130"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.2"
        />

        <rect
          x="125"
          y="110"
          width="82"
          height="82"
          stroke="rgba(255,255,255,0.075)"
          strokeWidth="1"
        />

        <path
          d="M95 80L125 110M225 80L207 110M225 210L207 192M95 210L125 192"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      </g>

      {/* Direction / triangle volume */}
      <g transform="translate(130 228)">
        <polygon
          points="70,0 132,112 8,112"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.2"
        />

        <polygon
          points="70,28 108,96 32,96"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        <path
          d="M70 0V96M8 112L70 28M132 112L70 28"
          stroke="rgba(255,255,255,0.055)"
          strokeWidth="1"
        />
      </g>

      {/* Clarity / circle focus */}
      <g>
        <circle
          cx="300"
          cy="178"
          r="2"
          fill="rgba(255,255,255,0.12)"
        />

        <circle
          cx="300"
          cy="178"
          r="42"
          stroke="rgba(255,255,255,0.045)"
          strokeWidth="1"
        />
      </g>

      {/* System relations */}
      <path
        d="M150 145 C205 160 240 175 300 178"
        stroke="rgba(255,255,255,0.055)"
        strokeWidth="1"
      />

      <path
        d="M300 178 C255 215 230 250 200 286"
        stroke="rgba(255,255,255,0.045)"
        strokeWidth="1"
      />

      <path
        d="M160 145 C178 208 188 250 200 286"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1"
      />
    </svg>
  );
}