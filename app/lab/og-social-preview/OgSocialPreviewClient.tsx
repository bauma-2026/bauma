"use client";

import Image from "next/image";

type OgLang = "sl" | "en";

/**
 * OG cards as a static expression of the live desktop Hero:
 * same road photograph and flat overlay, BAUMA upper left, Hero H1 across
 * the horizon. No support copy, CTAs, navigation or spatial object.
 *
 * Heading mirrors the live Hero H1: DM Serif, normal weight, −0.025em,
 * last word of line 2 in italic; EN keeps the Hero's tighter 0.94 leading.
 */
const OG_COPY: Record<
  OgLang,
  { line1: string; line2Lead: string; line2Emphasis: string }
> = {
  sl: {
    line1: "Jasna struktura.",
    line2Lead: "Več",
    line2Emphasis: "odločitev.",
  },
  en: {
    line1: "Clear structure.",
    line2Lead: "Better",
    line2Emphasis: "decisions.",
  },
};

function OgCard({ lang, domain }: { lang: OgLang; domain: boolean }) {
  const copy = OG_COPY[lang];
  const id = `${lang}-${domain ? "b" : "a"}`;

  return (
    <section className="space-y-3">
      <p className="font-mono text-[11px] text-white/50">
        {lang.toUpperCase()} · {domain ? "B — with bauma.si" : "A — no domain"}
      </p>

      <div
        data-og-card={id}
        lang={lang}
        className="relative h-[630px] w-[1200px] overflow-hidden bg-[#080808] text-white"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        <Image
          src="/images/atmosphere/road-evening-01.jpg"
          alt=""
          fill
          unoptimized
          priority
          sizes="1200px"
          className="pointer-events-none object-cover object-[52%_50%]"
        />
        {/* Same flat overlay as the desktop Hero */}
        <div aria-hidden className="absolute inset-0 bg-black/[0.16]" />

        <img
          src="/logo/bauma-logo.svg"
          alt="Bauma"
          width={84}
          height={16}
          className="absolute left-[80px] top-[56px] h-auto w-[84px] invert"
        />

        <h1
          className={[
            "absolute left-[80px] top-[244px] font-serif text-[64px] font-normal tracking-[-0.025em] text-white",
            lang === "en" ? "leading-[0.94]" : "leading-none",
          ].join(" ")}
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          <span className="block whitespace-nowrap">{copy.line1}</span>
          <span className="block whitespace-nowrap">
            {copy.line2Lead}{" "}
            <span className="italic">{copy.line2Emphasis}</span>
          </span>
        </h1>

        {domain ? (
          <p className="absolute bottom-[48px] left-[80px] text-[15px] font-medium tracking-[0.01em] text-white/60">
            bauma.si
          </p>
        ) : null}
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
            Lab — OG Social Preview · Hero-based study (not yet exported)
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1240px] flex-col gap-14 overflow-x-auto px-5 py-10">
        <OgCard lang="sl" domain={false} />
        <OgCard lang="sl" domain />
        <OgCard lang="en" domain={false} />
        <OgCard lang="en" domain />
      </div>
    </main>
  );
}
