import Container from "../components/Container";
import Section from "../components/Section";
import Link from "next/link";
import { news } from "@/lib/content";

export const runtime = "nodejs";

export default function NewsIndexPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Container className="pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <Section className="!mt-0" withDivider={false}>
          <div className="max-w-[720px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Notes
            </p>

            <h1 className="mt-4 max-w-[14ch] text-[48px] font-semibold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl">
              Razmišljanja za bolj jasne strani.
            </h1>

            <p className="mt-5 max-w-[52ch] text-base leading-[1.65] text-white/58">
              Kratki zapisi o strukturi, projektih in odločitvah za ekranom.
            </p>
          </div>

          <div className="mt-12 space-y-6 lg:mt-14">
            {news[0] && (
              <Link
                href={`/novice/${news[0].slug}`}
                className="group block rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition-all duration-200 hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.055] sm:p-8 lg:p-10"
              >
                <div className="max-w-[72ch]">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                  Structure note
                  </div>

                  <h2 className="mt-5 max-w-[18ch] text-3xl font-semibold leading-[1.04] tracking-[-0.02em] text-white sm:text-4xl">
                    {news[0].title.split(" — ")[0]}
                  </h2>

                  <p className="mt-5 max-w-[44ch] text-[13px] leading-6 text-white/34 sm:text-sm">
                    {news[0].excerpt}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between gap-6 border-t border-white/10 pt-6">
                  <div className="text-sm text-white/35">
                    Bauma notes
                  </div>

                  <div className="text-sm text-white/40 transition duration-200 group-hover:translate-x-1 group-hover:text-white">
                    Preberi zapis →
                  </div>
                </div>
              </Link>
            )}

            {news.length > 1 && (
              <div className="grid gap-6 md:grid-cols-2">
                {news.slice(1).map((item) => {
                  const [title] = item.title.split(" — ");

                  return (
                    <Link
                      key={item.slug}
                      href={`/novice/${item.slug}`}
                      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-200 hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.045] sm:p-8"
                    >
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/30">
                     Reference note
                      </p>

                      <h2 className="mt-3 max-w-[18ch] text-2xl font-semibold leading-[1.12] tracking-[-0.01em] text-white">
                        {title}
                      </h2>

                      <p className="mt-4 max-w-[42ch] text-[13px] leading-6 text-white/34 sm:text-sm">
                        {item.excerpt}
                      </p>

                      <div className="mt-8 flex items-center justify-between gap-6 border-t border-white/10 pt-5">
                        <span className="text-sm text-white/35">
                          Note
                        </span>

                        <span className="text-sm text-white/40 transition duration-200 group-hover:translate-x-1 group-hover:text-white">
                          Preberi →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </Section>
      </Container>
    </div>
  );
}