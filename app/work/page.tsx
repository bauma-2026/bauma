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

          <div className="mt-12 grid gap-6">
            {work.map((p, i) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className={[
                  "group block border border-white/10 bg-white/[0.04] transition hover:border-white/20",
                  i === 0
                    ? "rounded-2xl p-7 sm:p-10"
                    : "rounded-xl p-6 sm:p-8",
                ].join(" ")}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className={i === 0 ? "max-w-[68ch]" : "max-w-[64ch]"}>
                    {i === 0 && (
                      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                        Featured case
                      </div>
                    )}

                    <h2
                      className={[
                        "font-semibold tracking-[-0.03em] text-white",
                        i === 0
                          ? "mt-4 text-3xl leading-tight sm:text-4xl"
                          : "text-xl",
                      ].join(" ")}
                    >
                      {p.title}
                    </h2>

                    <p
                      className={[
                        "text-white/60",
                        i === 0
                          ? "mt-4 text-base leading-7"
                          : "mt-3 text-sm leading-6",
                      ].join(" ")}
                    >
                      {p.summary}
                    </p>
                  </div>

                  <div className="shrink-0 text-sm text-white/40 transition group-hover:translate-x-1 group-hover:text-white">
                    Case →
                  </div>
                </div>

                <div
                  className={[
                    "flex flex-wrap gap-2",
                    i === 0 ? "mt-8 border-t border-white/10 pt-6" : "mt-6",
                  ].join(" ")}
                >
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55 transition group-hover:border-white/20 group-hover:text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </Section>
      </Container>
    </div>
  );
}