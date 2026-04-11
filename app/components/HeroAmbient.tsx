export default function HeroAmbient() {
  return (
    <>
      {/* GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.24]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "82px 82px",
        }}
      />

      {/* WIDE COLOR WASH */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(255,184,0,0.05) 0%, rgba(255,255,255,0) 34%, rgba(88,155,255,0.04) 52%, rgba(0,255,208,0.06) 100%)",
        }}
      />

      {/* LEFT GLOW */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[42%]"
        style={{
          background:
            "radial-gradient(circle at 35% 55%, rgba(255,184,0,0.34) 0%, rgba(255,184,0,0.18) 28%, rgba(255,132,0,0.10) 46%, transparent 72%)",
          filter: "blur(40px)",
        }}
      />

      {/* RIGHT GLOW */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[46%]"
        style={{
          background:
            "radial-gradient(circle at 62% 54%, rgba(0,255,208,0.28) 0%, rgba(0,255,208,0.16) 30%, rgba(76,189,255,0.10) 48%, transparent 74%)",
          filter: "blur(40px)",
        }}
      />

      {/* CENTRAL SOFT GLOW */}
      <div className="pointer-events-none absolute inset-x-0 top-[24%] flex justify-center">
        <div
          className="h-[240px] w-[240px] sm:h-[280px] sm:w-[280px] lg:h-[340px] lg:w-[340px]"
          style={{
            background: `
              radial-gradient(circle,
                rgba(255,255,255,0.68) 0%,
                rgba(255,255,255,0.44) 18%,
                rgba(88,155,255,0.14) 32%,
                rgba(0,255,208,0.08) 48%,
                transparent 72%
              )
            `,
            filter: "blur(22px)",
            borderRadius: "60% 40% 55% 45% / 60% 45% 55% 40%",
          }}
        />
      </div>

      {/* RING / DIRECTIONAL TEXTURE */}
      <div className="pointer-events-none absolute inset-x-0 top-[18%] flex justify-center">
        <div
          className="h-[520px] w-[520px] opacity-[0.18] sm:h-[620px] sm:w-[620px] lg:h-[760px] lg:w-[760px]"
          style={{
            background: `
              repeating-conic-gradient(
                from 184deg,
                rgba(255,255,255,0) 0deg 4.6deg,
                rgba(88,155,255,0.10) 4.6deg 4.9deg
              )
            `,
            maskImage:
              "radial-gradient(circle, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.78) 20%, rgba(0,0,0,0.38) 44%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(circle, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.78) 20%, rgba(0,0,0,0.38) 44%, transparent 72%)",
          }}
        />
      </div>
    </>
  );
}