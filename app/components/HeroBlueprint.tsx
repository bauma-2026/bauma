export default function HeroBlueprint() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* HORIZONTAL LINE */}
      <div
        className="absolute"
        style={{
          top: "31%",
          left: "60%",
          width: "200px",
          height: "1px",
          background:
            "linear-gradient(to right, rgba(88,155,255,0.18), rgba(88,155,255,0.06), transparent)",
        }}
      />

      {/* VERTICAL LINE */}
      <div
        className="absolute"
        style={{
          top: "31%",
          left: "60%",
          width: "1px",
          height: "120px",
          background:
            "linear-gradient(to bottom, rgba(88,155,255,0.18), rgba(88,155,255,0.05), transparent)",
        }}
      />

      {/* NODE 1 */}
      <div
        className="absolute rounded-full"
        style={{
          top: "calc(31% - 3px)",
          left: "calc(60% - 3px)",
          width: "6px",
          height: "6px",
          background: "rgba(88,155,255,0.32)",
          boxShadow: "0 0 0 4px rgba(88,155,255,0.05)",
        }}
      />

      {/* NODE 2 */}
      <div
        className="absolute rounded-full"
        style={{
          top: "calc(31% - 3px)",
          left: "calc(76% - 3px)",
          width: "6px",
          height: "6px",
          background: "rgba(88,155,255,0.22)",
        }}
      />

      {/* NODE 3 */}
      <div
        className="absolute rounded-full"
        style={{
          top: "calc(45% - 3px)",
          left: "calc(60% - 3px)",
          width: "6px",
          height: "6px",
          background: "rgba(88,155,255,0.22)",
        }}
      />

      {/* OUTLINE FRAME */}
      <div
        className="absolute"
        style={{
          top: "38%",
          left: "70%",
          width: "16px",
          height: "16px",
          border: "1px solid rgba(88,155,255,0.14)",
        }}
      />

      {/* SOFT GLOW */}
      <div
        className="absolute rounded-full"
        style={{
          top: "28%",
          left: "72%",
          width: "140px",
          height: "140px",
          background:
            "radial-gradient(circle, rgba(88,155,255,0.08), transparent 72%)",
          filter: "blur(28px)",
        }}
      />
    </div>
  );
}