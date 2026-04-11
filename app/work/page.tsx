import Link from "next/link";
import { work } from "../../lib/content";
import Container from "../components/Container";
import Section from "../components/Section";

const cardBase =
  "group block border border-black/10 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-black/20 hover:shadow-md";

const cardFeatured = `${cardBase} rounded-[32px] p-7 sm:p-10`;
const cardDefault = `${cardBase} rounded-[28px] bg-white/70 p-6 sm:p-8`;

const chip =
  "inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-neutral-700 transition-colors duration-200 hover:border-black/30 hover:bg-white";

export default function WorkPage() {
  return (
    <Container className="pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
      <Section className="!mt-0">
        <div className="max-w-[720px]">
          <p className="text-meta">Work</p>

          <h1 className="mt-3 text-h1 text-neutral-950">
            Izbrani primeri.
          </h1>

          <p className="mt-4 max-w-[58ch] text-body">
            Projekti, kjer je bila struktura del rešitve — od problema do jasne
            izvedbe.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          {work.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className={i === 0 ? cardFeatured : cardDefault}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <div className={i === 0 ? "max-w-[68ch]" : "max-w-[64ch]"}>
                  {i === 0 && <div className="text-meta">Featured case</div>}

                  <div
                    className={[
                      "font-semibold tracking-tight text-neutral-950",
                      i === 0
                        ? "mt-4 text-[30px] leading-tight sm:text-[36px]"
                        : "text-lg",
                    ].join(" ")}
                  >
                    {p.title}
                  </div>

                  <p
                    className={[
                      "text-neutral-600",
                      i === 0
                        ? "mt-4 text-body"
                        : "mt-3 text-sm leading-relaxed",
                    ].join(" ")}
                  >
                    {p.summary}
                  </p>
                </div>

                <div className="shrink-0 text-sm text-neutral-400 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                  Case →
                </div>
              </div>

              <div
                className={[
                  "flex flex-wrap gap-2",
                  i === 0 ? "mt-8 border-t border-black/10 pt-6" : "mt-6",
                ].join(" ")}
              >
                {p.tags.map((t) => (
                  <span key={t} className={chip}>
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </Container>
  );
}
