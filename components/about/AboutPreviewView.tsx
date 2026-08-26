import Image from "next/image";

import MiniClosingBookend from "@/app/components/blocks/mini/MiniClosingBookend";
import MiniHeader, {
  type MiniHeaderCopy,
} from "@/app/components/blocks/mini/MiniHeader";
import type { MiniFooterCopy } from "@/app/components/blocks/mini/MiniFooter";

import {
  ABOUT_FOOTER_SL,
  ABOUT_HEADER_SL,
  ABOUT_PREVIEW_COPY_SL,
  type AboutPreviewCopy,
  type HowShape,
} from "./aboutPreviewCopy";

function HowFlowShape({ shape }: { shape: HowShape }) {
  if (shape === "square") {
    return (
      <div className="about-how-shape h-[25px] w-[25px] rotate-[8deg] border border-current text-white/[0.19]" />
    );
  }

  if (shape === "circle") {
    return (
      <div className="about-how-shape h-[28px] w-[28px] rounded-full border border-current text-white/[0.16]" />
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="about-how-shape h-[35px] w-[35px] translate-y-px text-white/20"
      aria-hidden="true"
    >
      <polygon
        points="24,7 42,39 6,39"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function AboutPreviewView({
  copy = ABOUT_PREVIEW_COPY_SL,
  headerCopy = ABOUT_HEADER_SL,
  footerCopy = ABOUT_FOOTER_SL,
}: {
  copy?: AboutPreviewCopy;
  headerCopy?: MiniHeaderCopy;
  footerCopy?: MiniFooterCopy;
}) {
  return (
    <>
      <MiniHeader copy={headerCopy} />

      <main className="bg-[#080808] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10 pb-20 pt-14 sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(182,138,76,0.055),transparent_32%)]" />
          <div className="bauma-page-rail relative">
            <div className="grid w-full gap-12 lg:grid-cols-[1fr_300px] lg:items-end lg:gap-24">
              <div className="max-w-[720px]">
                <h1 className="text-white">
                  <span className="block font-serif text-[3rem] font-normal leading-[0.94] tracking-[-0.025em] sm:hidden">
                    {copy.hero.mobileLines[0]}
                    <br />
                    {copy.hero.mobileLines[1]}
                    <br />
                    {copy.hero.mobileLines[2]}
                  </span>
                  <span className="hidden max-w-[16ch] font-serif text-6xl font-normal leading-[0.96] tracking-[-0.025em] sm:block lg:text-7xl">
                    {copy.hero.desktopLines[0]}
                    <br />
                    {copy.hero.desktopLines[1]}
                  </span>
                </h1>

                <div className="mt-8 max-w-[58ch]">
                  <p className="text-base leading-7 text-white/62 sm:text-lg sm:leading-7">
                    {copy.hero.support1}
                  </p>

                  <p className="mt-5 text-base leading-7 text-white/50 sm:text-lg sm:leading-7">
                    {copy.hero.support2}
                  </p>
                </div>

                {/* Mobile portrait */}
                <div className="relative mr-auto mt-7 max-w-[170px] lg:hidden">
                  <div className="pointer-events-none absolute -inset-8 rounded-full bg-white/[0.03] blur-3xl" />

                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.015] shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
                    <Image
                      src="/images/gregor/gb-bauma-portrait-v2.webp"
                      alt={copy.portraitAlt}
                      width={900}
                      height={1125}
                      priority
                      className="aspect-[4/5] w-full object-cover object-center opacity-95 contrast-[0.96] saturate-[0.85]"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop portrait */}
              <div className="relative hidden lg:block lg:w-[240px] lg:justify-self-end xl:w-[260px]">
                <div className="pointer-events-none absolute -inset-10 rounded-full bg-white/[0.03] blur-3xl" />

                <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.015] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                  <Image
                    src="/images/gregor/gb-bauma-portrait-v2.webp"
                    alt={copy.portraitAlt}
                    width={900}
                    height={1125}
                    priority
                    className="aspect-[4/5] w-full object-cover object-center opacity-95 contrast-[0.96] saturate-[0.9]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Origin */}
        <section className="border-b border-white/10 py-16 sm:py-20 lg:py-24">
          <div className="bauma-page-rail">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.76fr)_1.24fr] lg:items-start lg:gap-10">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                  {copy.origin.eyebrow}
                </p>

                <h2 className="mt-4 max-w-[15ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                  {copy.origin.headline}
                </h2>
              </div>

              <div className="border-y border-white/10">
                {copy.origin.timeline.map((item) => (
                  <div
                    key={item.title}
                    className="grid gap-3 border-b border-white/10 py-6 last:border-b-0 sm:grid-cols-[120px_1fr] sm:items-baseline sm:gap-8"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.11em] text-[#D1A45F]/75">
                      {item.eyebrow}
                    </p>

                    <div>
                      <h3 className="text-base font-semibold leading-[1.3] tracking-[-0.015em] text-white/90 sm:text-lg">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-[58ch] text-sm leading-6 text-white/52">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What changed */}
        <section className="border-b border-white/10 py-16 sm:py-20 lg:py-24">
          <div className="bauma-page-rail">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                  {copy.whatChanged.eyebrow}
                </p>

                <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                  {copy.whatChanged.headline}
                </h2>
              </div>

              <div className="max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-7">
                <p>{copy.whatChanged.paragraphs[0]}</p>
                <p className="mt-5">{copy.whatChanged.paragraphs[1]}</p>
                <p className="mt-5">{copy.whatChanged.paragraphs[2]}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How I work */}
        <section className="border-b border-white/10 py-16 sm:py-20 lg:py-24">
          <div className="bauma-page-rail">
            <style>{`
      .about-how-card {
        transition: border-color 240ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .about-how-number,
      .about-how-shape {
        transition: color 240ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      @media (hover: hover) {
        .about-how-card:hover {
          border-color: rgba(209, 164, 95, 0.2);
        }

        .about-how-card:hover .about-how-number {
          color: rgba(209, 164, 95, 0.8);
        }

        .about-how-card:hover .about-how-shape {
          color: rgba(209, 164, 95, 0.76);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .about-how-card,
        .about-how-number,
        .about-how-shape {
          transition-duration: 0ms;
        }
      }
    `}</style>

            <div className="max-w-[720px]">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                {copy.howIWork.eyebrow}
              </p>

              <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                {copy.howIWork.headline}
              </h2>

              <p className="mt-5 max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-7">
                {copy.howIWork.supportLine1} <br /> {copy.howIWork.supportLine2}
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-3">
              {copy.howIWork.steps.map((step) => (
                <article
                  key={step.number}
                  className="about-how-card flex h-full flex-col rounded-[10px] border border-white/10 bg-white/[0.01] p-6 sm:p-7 lg:p-8"
                >
                  <div className="flex items-center justify-between gap-6">
                    <p className="about-how-number text-[12px] font-medium uppercase tracking-[0.18em] text-white/[0.48]">
                      {step.number}
                    </p>

                    <div aria-hidden="true">
                      <HowFlowShape shape={step.shape} />
                    </div>
                  </div>

                  <h3 className="mt-7 text-lg font-semibold leading-tight tracking-[-0.02em] text-white/88">
                    {step.label}
                  </h3>

                  <p className="mt-3 text-sm leading-[1.55] text-white/46">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Current work */}
        <section className="border-b border-white/10 py-16 sm:py-20 lg:py-24">
          <div className="bauma-page-rail">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                  {copy.currentWork.eyebrow}
                </p>

                <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                  {copy.currentWork.headlineLine1}
                  <br />
                  {copy.currentWork.headlineLine2}
                </h2>
              </div>

              <div className="max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-7">
                <p>{copy.currentWork.paragraphs[0]}</p>
                <p className="mt-5">{copy.currentWork.paragraphs[1]}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing */}
      </main>

      <MiniClosingBookend ctaCopy={copy.contact} footerCopy={footerCopy} />
    </>
  );
}
