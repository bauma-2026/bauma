"use client";

import Image from "next/image";

import {
  HomeHeroCta,
  HomeHeroProvider,
} from "@/components/home/hero-system";

export type MiniHeroCopy = {
  eyebrow: string;
  line1: string;
  line2: string;
  support: string;
  secondaryCta: string;
  primaryCta: string;
};

const DEFAULT_COPY: MiniHeroCopy = {
  eyebrow: "Struktura pred obliko",
  line1: "Jasna struktura.",
  line2: "Več odločitev.",
  support:
    "Podjetjem pomagam urediti ponudbo, vsebino in pot skozi spletno stran, da vse deluje kot jasna in povezana celota.",
  secondaryCta: "Poglej pristop",
  primaryCta: "Opišite projekt",
};

function splitLastWord(line: string): [string, string] {
  const lastSpace = line.lastIndexOf(" ");
  if (lastSpace === -1) return ["", line];
  return [line.slice(0, lastSpace), line.slice(lastSpace + 1)];
}

export default function MiniHero({ copy = DEFAULT_COPY }: { copy?: MiniHeroCopy }) {
  const [line2Lead, line2Emphasis] = splitLastWord(copy.line2);

  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-[#080808] text-white max-lg:h-[91svh] max-lg:min-h-[91svh] max-lg:landscape:h-[100svh] max-lg:landscape:min-h-[100svh]"
      data-hero-edge-hero
    >
      {/*
        Mobile only: 1.12 scale, origin nudged down and a small upward shift
        so the horizon sits higher and pale sky is reduced.
      */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 max-lg:origin-[50%_76%] max-lg:scale-[1.12] max-lg:-translate-y-[3%]">
          <Image
            src="/images/atmosphere/road-evening-01.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none object-cover object-center lg:object-[52%_center]"
          />
        </div>
      </div>
      {/*
        Shared flat overlay — desktop lock. Mobile overlay is a light
        final correction after composition, not the primary contrast tool.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-black/[0.16]"
      />
      <div
        aria-hidden="true"
        className="bauma-hero-mobile-readability pointer-events-none absolute inset-0 z-[1] lg:hidden"
      />
      <HomeHeroProvider>
        <div className="mini-page-rail bauma-hero-rail relative z-10">
          <div className="relative z-10" data-hero-copy>
            <div className="bauma-hero-eyebrow text-[11px] font-medium uppercase tracking-[0.105em]">
              {copy.eyebrow}
            </div>
            <h1 className="mt-[11px] font-serif font-normal tracking-[-0.025em] text-white">
              <span className="bauma-hero-h1-mobile font-normal tracking-[-0.025em]">
                {copy.line1}
                <br />
                {line2Lead ? `${line2Lead} ` : null}
                <span className="italic">{line2Emphasis}</span>
              </span>

              <span className="bauma-hero-h1-desktop">
                {copy.line1}
                <br />
                {line2Lead ? `${line2Lead} ` : null}
                <span className="italic">{line2Emphasis}</span>
              </span>
            </h1>

            <p className="mt-6 max-w-[47ch] text-white/75 max-lg:text-white/[0.86]">
              {copy.support}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3" data-hero-mobile-cta>
              <HomeHeroCta
                label={copy.primaryCta}
                href="#contact"
                variant="amber"
                arrow={false}
              />
              <HomeHeroCta
                label={copy.secondaryCta}
                href="#approach"
                variant="ghost"
                arrow={false}
              />
            </div>
          </div>
        </div>
      </HomeHeroProvider>
    </section>
  );
}
