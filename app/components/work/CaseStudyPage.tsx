import Link from "next/link";
import MiniHeader from "../blocks/mini/MiniHeader";
import MiniFooter from "../blocks/mini/MiniFooter";
import type { CaseStudy } from "../../../lib/content";

export default function CaseStudyPage({
  caseStudy,
}: {
  caseStudy: CaseStudy;
}) {
  return (
    <>
      <MiniHeader />

      <main className="bg-[#080808] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10 px-6 pb-16 pt-24 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(182,138,76,0.035),transparent_32%)]" />

          <div className="relative mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-14">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#D1A45F]/75">
                {caseStudy.label}
              </p>

              <h1 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl sm:leading-[0.95] lg:text-6xl">
                {caseStudy.client}
              </h1>
            </div>

            <div className="max-w-[62ch]">
              <h2 className="text-2xl font-semibold leading-[1.08] tracking-[-0.025em] text-white sm:text-3xl">
                {caseStudy.title}
              </h2>

              <p className="mt-5 text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                {caseStudy.intro}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {caseStudy.meta.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1100px] gap-8">
            {caseStudy.sections.map((section) => (
              <article
                key={section.eyebrow}
                className="grid gap-8 border-b border-white/10 pb-10 last:border-b-0 last:pb-0 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14"
              >
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#D1A45F]/75">
                    {section.eyebrow}
                  </p>

                  <h2 className="mt-4 max-w-[14ch] text-3xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">
                    {section.title}
                  </h2>
                </div>

                <div className="max-w-[64ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="mb-5 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Proof */}
        <section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                Proof material
              </p>

              <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl">
                Kaj lahko pokažem.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {caseStudy.proof.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm leading-6 text-white/55"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#D1A45F]/75">
              Next step
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl">
              {caseStudy.closing.title}
            </h2>

            <p className="mx-auto mt-5 max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              {caseStudy.closing.text}
            </p>

            <div className="mt-8">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
              >
                Nazaj na work
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MiniFooter />
    </>
  );
}