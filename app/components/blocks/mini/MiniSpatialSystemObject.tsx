type MiniSpatialSystemObjectProps = {
  className?: string;
  variant?: "desktop" | "mobile";
};

const strokes = {
  circle: "rgba(255,255,255,0.16)",
  square: "rgba(255,255,255,0.22)",
  triangle: "rgba(255,255,255,0.18)",
  depth: "rgba(255,255,255,0.10)",
  secondary: "rgba(255,255,255,0.08)",
  amber: "rgba(182,138,76,0.74)",
};

function DesktopComposition() {
  return (
    <>
      <circle cx="250" cy="205" r="128" stroke={strokes.circle} />

      <path
        d="M128 235 A126 54 0 0 1 300 145"
        transform="rotate(-12 250 205)"
        stroke={strokes.secondary}
      />

      <g transform="rotate(8 160 145)">
        <rect
          x="95"
          y="80"
          width="130"
          height="130"
          stroke={strokes.square}
        />
        <path d="M125 110 L207 110 L207 192" stroke={strokes.depth} />
        <path d="M95 80 L125 110 M225 210 L207 192" stroke={strokes.secondary} />
        <line x1="225" y1="145" x2="225" y2="171" stroke={strokes.amber} />
      </g>

      <g transform="translate(130 228)">
        <polygon points="70,0 132,112 8,112" stroke={strokes.triangle} />
        <path d="M8 112 L70 30" stroke={strokes.secondary} />
      </g>
    </>
  );
}

function MobileComposition() {
  return (
    <>
      <circle cx="212" cy="178" r="106" stroke={strokes.circle} />

      <path
        d="M110 204 A104 45 0 0 1 254 128"
        transform="rotate(-12 212 178)"
        stroke={strokes.secondary}
      />

      <g transform="rotate(8 129 114)">
        <rect
          x="70"
          y="55"
          width="118"
          height="118"
          stroke={strokes.square}
        />
        <path d="M96 80 L171 80 L171 155" stroke={strokes.depth} />
        <path d="M70 55 L96 80" stroke={strokes.secondary} />
        <line x1="188" y1="112" x2="188" y2="134" stroke={strokes.amber} />
      </g>

      <g transform="translate(98 198)">
        <polygon points="60,0 114,96 6,96" stroke={strokes.triangle} />
      </g>
    </>
  );
}

export default function MiniSpatialSystemObject({
  className = "",
  variant = "desktop",
}: MiniSpatialSystemObjectProps) {
  const mobile = variant === "mobile";

  return (
    <svg
      viewBox={mobile ? "0 0 360 360" : "0 0 420 420"}
      fill="none"
      className={className}
      aria-hidden="true"
      shapeRendering="geometricPrecision"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    >
      {mobile ? <MobileComposition /> : <DesktopComposition />}
    </svg>
  );
}
