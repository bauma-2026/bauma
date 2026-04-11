import Container from "../components/Container";
import Section from "../components/Section";
import Link from "next/link";
import { news } from "@/lib/content";

export const runtime = "nodejs";

export default function NewsIndexPage() {
  return (
<Container className="pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
  <Section className="!mt-0">
    <div className="max-w-[720px]">
      <p className="text-meta">
        Novice
      </p>

      <h1 className="mt-3 text-h1 text-neutral-950">
        Projekti, proces in razmišljanje.
      </h1>

      <p className="mt-4 max-w-[58ch] text-body">
        Zapisi o projektih, sistemih in odločitvah, ki stojijo za delom v
        studiu.
      </p>
    </div>

    <div className="mt-8 grid gap-6">
      {news[0] && (
        <Link
          href={`/novice/${news[0].slug}`}
          className="group block rounded-[32px] border border-black/10 bg-white p-7 shadow-sm transition-all duration-200 hover:border-black/20 hover:shadow-md sm:p-10"
        >
          <div className="max-w-[72ch]">
            <div className="text-meta">
              Latest
            </div>

            <h2 className="mt-5 max-w-[18ch] text-h2 text-neutral-950">
              {news[0].title}
            </h2>

            <p className="mt-5 max-w-[60ch] text-body">
              {news[0].excerpt}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-6">
            <div className="text-sm text-neutral-500">
              Zadnji zapis
            </div>

            <div className="text-sm text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5">
              Read →
            </div>
          </div>
        </Link>
      )}

      {news.length > 1 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.slice(1).map((item) => (
            <Link
              key={item.slug}
              href={`/novice/${item.slug}`}
              className="group block rounded-[28px] border border-black/10 bg-white/70 p-6 shadow-sm transition-all duration-200 hover:border-black/20 hover:shadow-md sm:p-8"
            >
              <h2 className="text-h2 text-neutral-950">
                {item.title}
              </h2>

              <p className="mt-3 text-body">
                {item.excerpt}
              </p>

              <div className="mt-6 text-sm text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5">
                Read →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  </Section>
</Container>
  );
}