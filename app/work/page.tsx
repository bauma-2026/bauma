import Link from "next/link";
import { work } from "../../lib/content";
import Container from "../components/Container";
import Section from "../components/Section";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Container className="pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <Section className="!mt-0" withDivider={false}>
          <div className="max-w-[720px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Work
            </p>

            <h1 className="mt-4 max-w-[14ch] text-[48px] font-semibold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl">
              Primeri, kjer struktura vodi do odločitve.
            </h1>

            <p className="mt-5 max-w-[52ch] text-base leading-[1.65] text-white/58">
              Projekti, kjer je bila struktura del rešitve — od razpršene
              ponudbe do jasnega naslednjega koraka.
            </p>
          </div>

          <div className="mt-12 space-y-6 lg:mt-14">
            {/* FEATURED */}
            <Link
              href={`/work/${work[0].slug}`}
              className="group block rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition-all duration-200 hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.055] sm:p-8 lg:p-10"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-[72ch]">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                    Featured case
                  </div>

                  <h2 className="mt-5 max-w-[20ch] text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl">
                    {work[0].title}
                  </h2>

                  <p className="mt-5 max-w-[56ch] text-sm leading-6 text-white/46 sm:text-base sm:leading-[1.65]">
                    {work[0].summary}
                  </p>
                </div>

                <div className="shrink-0 text-sm text-white/35 transition duration-200 group-hover:translate-x-1 group-hover:text-white">
                  Case →
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                {work[0].tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>

            {/* SUPPORTING CASES */}
            <div className="grid gap-6 md:grid-cols-2">
              {work.slice(1).map((p) => (
                <Link
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-200 hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.045]"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-2xl font-semibold leading-[1.15] tracking-[-0.01em] text-white">
                        {p.title}
                      </h3>

                      <p className="mt-4 max-w-[48ch] text-sm leading-6 text-white/46">
                        {p.summary}
                      </p>
                    </div>

                    <span className="text-white/30 transition duration-200 group-hover:translate-x-1 group-hover:text-white">
                      →
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}