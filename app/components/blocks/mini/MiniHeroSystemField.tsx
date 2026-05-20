type SystemNode = {
  id: "structure" | "clarity" | "direction";
  label: string;
  meaning: string;
  className: string;
  motionClass: string;
  svg: React.ReactNode;
};

const systemNodes: SystemNode[] = [
  {
    id: "structure",
    label: "Structure",
    meaning: "Postavi red, okvir in logiko strani.",
    className: "absolute left-[49.5%] top-[22.5%] h-[182px] w-[182px]",
    motionClass: "bauma-structure-motion",
    svg: (
      <svg
        viewBox="0 0 182 182"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <g transform="rotate(8 91 91)">
          <rect
            x="20"
            y="20"
            width="142"
            height="142"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />

          {/* Internal construction line */}
          <path
            d="M52 92H130"
            stroke="rgba(255,255,255,0.075)"
            strokeWidth="1"
          />
        </g>
      </svg>
    ),
  },
  {
    id: "clarity",
    label: "Clarity",
    meaning: "Ustvari prostor za razumevanje in orientacijo.",
    className: "absolute left-[72.5%] top-[27%] h-[240px] w-[240px]",
    motionClass: "bauma-clarity-motion",
    svg: (
      <svg
        viewBox="0 0 240 240"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <circle
          cx="120"
          cy="120"
          r="98"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.5"
        />

        {/* Subtle focus point */}
        <circle
          cx="120"
          cy="120"
          r="2"
          fill="rgba(255,255,255,0.12)"
        />
      </svg>
    ),
  },
  {
    id: "direction",
    label: "Direction",
    meaning: "Signalizira smer, fokus in naslednji korak.",
    className: "absolute left-[59%] top-[59.5%] h-[118px] w-[118px]",
    motionClass: "bauma-direction-motion",
    svg: (
      <svg
        viewBox="0 0 118 118"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <polygon
          points="59,14 104,97 14,97"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeLinejoin="miter"
        />

        {/* Direction axis */}
        <path
          d="M59 30V82"
          stroke="rgba(255,255,255,0.065)"
          strokeWidth="1"
        />
      </svg>
    ),
  },
];

export default function MiniHeroSystemField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      {/* Subtle relation layer */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1100 620"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M540 225 C650 245 720 300 792 330"
          stroke="rgba(255,255,255,0.055)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d="M700 390 C650 430 620 455 585 505"
          stroke="rgba(255,255,255,0.045)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* System nodes */}
      {systemNodes.map((node) => (
        <div
          key={node.id}
          data-node={node.id}
          data-label={node.label}
          className={`${node.className} ${node.motionClass}`}
          title={`${node.label} — ${node.meaning}`}
        >
          {node.svg}
        </div>
      ))}
    </div>
  );
}