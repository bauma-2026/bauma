"use client";

import {
  HomeHeroField,
  HomeHeroProvider,
} from "@/components/home/hero-system";

type VariantId = "A" | "B";

const SUPPORT =
  "Podjetjem pomagam urediti ponudbo, vsebino in pot skozi spletno stran, da vse deluje kot jasna in povezana celota.";

/**
 * 1200×630 OG study cards — V3 Hero object, locked colors.
 * No production metadata / live OG swap.
 */
function OgCard({
  variant,
  label,
}: {
  variant: VariantId;
  label: string;
}) {
  const compressed = variant === "B";

  return (
    <section className="space-y-3">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
          Variant {variant}
        </p>
        <p className="mt-1 font-mono text-[11px] text-white/50">{label}</p>
      </div>

      <div
        data-og-variant={variant}
        className="relative h-[630px] w-[1200px] overflow-hidden bg-[#080808] text-white"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {/* Right: V3 Hero object — secondary to headline */}
        <div
          className={[
            "pointer-events-none absolute inset-y-0 right-0",
            compressed
              ? "w-[46%] translate-x-[18px] scale-[0.92]"
              : "w-[48%] translate-x-[8px]",
          ].join(" ")}
          aria-hidden
        >
          <div
            className={[
              "absolute inset-0 flex items-center justify-center",
              compressed ? "pr-10 pl-2" : "pr-12 pl-4",
            ].join(" ")}
          >
            <div
              className={
                compressed
                  ? "h-[420px] w-full max-w-[460px]"
                  : "h-[460px] w-full max-w-[500px]"
              }
              data-hero-desktop-object-shift
              style={{
                transform: compressed
                  ? "translateX(12px)"
                  : "translateX(24px)",
              }}
            >
              <HomeHeroProvider>
                <HomeHeroField variant="desktop" />
              </HomeHeroProvider>
            </div>
          </div>
        </div>

        {/* Left: logo + heading + support */}
        <div
          className={[
            "relative z-10 flex h-full flex-col justify-between",
            compressed ? "px-[72px] py-[52px]" : "px-[80px] py-[56px]",
          ].join(" ")}
        >
          <header>
            <div
              className={[
                "font-semibold tracking-[-0.04em] text-white",
                compressed ? "text-[30px]" : "text-[32px]",
              ].join(" ")}
            >
              BAUMA
            </div>
          </header>

          <div className="max-w-[640px]">
            <h1
              className={[
                "font-serif font-normal tracking-[-0.03em] text-white",
                compressed
                  ? "text-[64px] leading-[0.94]"
                  : "text-[70px] leading-[0.92]",
              ].join(" ")}
              style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
            >
              <span className="block whitespace-nowrap">Jasna struktura.</span>
              <span className="block whitespace-nowrap">Več odločitev.</span>
            </h1>

            <p
              className={[
                "text-white/55",
                compressed
                  ? "mt-6 max-w-[34ch] text-[20px] leading-[1.4]"
                  : "mt-7 max-w-[36ch] text-[22px] leading-[1.42]",
              ].join(" ")}
            >
              {SUPPORT}
            </p>
          </div>

          <footer className="border-t border-white/10 pt-5">
            <p className="text-[15px] font-medium text-white/50">bauma.si</p>
          </footer>
        </div>
      </div>
    </section>
  );
}

export default function OgSocialPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto max-w-[1240px]">
          <p className="font-mono text-[11px] text-white/45">
            Lab — OG Social Preview Study · production OG unchanged
          </p>
          <p className="mt-2 max-w-[64ch] text-sm leading-6 text-white/55">
            1200×630 cards using the live V3 Hero object. No badge, no old
            geometry. Live OG locked to{" "}
            <code className="text-white/65">public/og/bauma-og.png</code>{" "}
            (Variant A).
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1240px] flex-col gap-14 overflow-x-auto px-5 py-10">
        <OgCard
          variant="A"
          label="Closer to live Hero composition — open type + fuller object field"
        />
        <OgCard
          variant="B"
          label="Social-card compressed — tighter type/margins, object slightly quieter"
        />
      </div>
    </main>
  );
}
