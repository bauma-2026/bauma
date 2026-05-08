import Container from "../components/Container";
import Section from "../components/Section";
import Link from "next/link";
import { news } from "@/lib/content";

export const runtime = "nodejs";

export default function NewsIndexPage() {
  return (
  <div className="min-h-screen bg-[#080808] text-white">
  <Container className="pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
    <Section className="!mt-0" withDivider={false}>
      <div className="max-w-[720px]">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
          Novice
        </p>

        <h1 className="mt-4 max-w-[14ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl">
          Projekti, proces in razmišljanje.
        </h1>

        <p className="mt-5 max-w-[58ch] text-base leading-7 text-white/60">
          Zapisi o projektih, sistemih in odločitvah, ki stojijo za delom v
          studiu.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {news[0] && (
          <Link
            href={`/novice/${news[0].slug}`}
            className="group block rounded-[28px] border border-white/10 bg-white/[0.04] p-7 transition hover:border-white/20 sm:p-10"
          >
            <div className="max-w-[72ch]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                Zadnji zapis
              </div>

              <h2 className="mt-5 max-w-[16ch] text-3xl font-semibold leading-[1] tracking-[-0.04em] text-white sm:text-4xl">
                {news[0].title}
              </h2>

              <p className="mt-5 max-w-[58ch] text-base leading-7 text-white/60">
                {news[0].excerpt}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="text-sm text-white/35">
                Bauma notes
              </div>

              <div className="text-sm text-white/40 transition group-hover:translate-x-1 group-hover:text-white">
                Preberi zapis →
              </div>
            </div>
          </Link>
        )}

        {news.length > 1 && (
          <div className="grid gap-6 md:grid-cols-2">
            {news.slice(1).map((item) => (
              <Link
                key={item.slug}
                href={`/novice/${item.slug}`}
                className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 sm:p-8"
              >
                <h2 className="max-w-[18ch] text-2xl font-semibold leading-[1.08] tracking-[-0.03em] text-white">
                  {item.title}
                </h2>

                <p className="mt-4 text-sm leading-6 text-white/55">
                  {item.excerpt}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm text-white/35">
                    Zapis
                  </span>

                  <span className="text-sm text-white/40 transition group-hover:translate-x-1 group-hover:text-white">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Section>
  </Container>
</div>
  );
}