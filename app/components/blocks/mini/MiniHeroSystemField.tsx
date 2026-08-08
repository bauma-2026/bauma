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
    className: "absolute left-[54%] top-[23%] h-[178px] w-[178px]",
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
    className: "absolute left-[76%] top-[28%] h-[238px] w-[238px]",
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
    className: "absolute left-[63%] top-[60%] h-[116px] w-[116px]",
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
          d="M560 225 C670 245 740 300 812 330"
          stroke="rgba(255,255,255,0.055)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d="M720 390 C670 430 640 455 605 505"
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