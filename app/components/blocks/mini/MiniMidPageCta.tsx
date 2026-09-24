"use client";

import {
  HomeHeroCta,
  HomeHeroProvider,
} from "@/components/home/hero-system";

import MiniNextStepCube from "./MiniNextStepCube";

export type MiniMidPageCtaCopy = {
  eyebrow: string;
  headline: string;
  support: string;
  cta: string;
};

const DEFAULT_COPY: MiniMidPageCtaCopy = {
  eyebrow: "NASLEDNJI KORAK",
  headline: "Ko je sistem jasen, je naslednji korak lažji.",
  support:
    "Če želite preveriti, kje se vaša stran zatika, lahko začneva pri enem konkretnem primeru.",
  cta: "Pogovorimo se",
};

export default function MiniMidPageCta({
  copy = DEFAULT_COPY,
}: {
  copy?: MiniMidPageCtaCopy;
}) {
  return (
    <section className="overflow-hidden border-t border-white/10 bg-[#0f0e0c] py-16 text-white sm:py-20 lg:py-20">
      <HomeHeroProvider>
        <div className="mini-page-rail grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
          <div className="max-w-[34rem]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#D1A45F]">
              {copy.eyebrow}
            </p>
            <h2 className="home-bridge-heading mt-5 max-w-[18ch]">
              {copy.headline}
            </h2>
            <p className="mt-5 max-w-[48ch] text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
              {copy.support}
            </p>
            <div className="mt-7">
              <HomeHeroCta label={copy.cta} href="#contact" variant="amber" />
            </div>
          </div>

          <div className="relative h-[260px] max-sm:-translate-y-6 sm:h-[320px] lg:h-[400px]">
            <MiniNextStepCube className="relative h-full w-full" />
          </div>
        </div>
      </HomeHeroProvider>
    </section>
  );
}
