import Link from "next/link";
import { work } from "../../lib/content";
import Container from "../components/Container";
import Section from "../components/Section";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Container className="pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <Section className="!mt-0" withDivider={false}>
          <div className="max-w-[720px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Work
            </p>

            <h1 className="mt-4 max-w-[14ch] text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">
              Primeri, kjer struktura vodi do odločitve.
            </h1>

            <p className="mt-5 max-w-[58ch] text-base leading-7 text-white/60">
              Projekti, kjer je bila struktura del rešitve — od razpršene
              ponudbe do jasnega naslednjega koraka.
            </p>
          </div>

         <div className="mt-12 space-y-6">
  {/* FEATURED */}
  <Link
    href={`/work/${work[0].slug}`}
    className="group block rounded-[28px] border border-white/10 bg-white/[0.04] p-7 transition hover:border-white/20 sm:p-10"
  >
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-[72ch]">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
          Featured case
        </div>

        <h2 className="mt-5 max-w-[18ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl">
          {work[0].title}
        </h2>

        <p className="mt-6 max-w-[58ch] text-base leading-7 text-white/60">
          {work[0].summary}
        </p>
      </div>

      <div className="shrink-0 text-sm text-white/35 transition group-hover:translate-x-1 group-hover:text-white">
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
        className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
              {p.title}
            </h3>

            <p className="mt-4 text-sm leading-6 text-white/55">
              {p.summary}
            </p>
          </div>

          <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
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