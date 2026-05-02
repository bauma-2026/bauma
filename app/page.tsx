import Link from "next/link";
import { work, news } from "@/lib/content";
import Container from "./components/Container";
import Section from "./components/Section";
import HeroPanel from "./components/HeroPanel";
import StructureSection from "./components/StructureSection";
import DecisionLayer from "./components/blocks/DecisionLayer";
import DecisionLayerCase from "./components/blocks/home/DecisionLayerCase";

const cardBase =
  "group block border border-black/10 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-black/20 hover:shadow-md";

const cardFeatured = `${cardBase} rounded-[32px] p-7 sm:p-10`;
const cardDefault = `${cardBase} rounded-[28px] bg-white/60 p-6 sm:p-8`;

const chip =
  "inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-neutral-700 transition-colors duration-200 hover:border-black/30 hover:bg-white";

export default function Home() {
  const featured = work.slice(0, 2);

  return (
    <>
      <HeroPanel />
           {/* APPROACH */}
        <DecisionLayer />
             <DecisionLayerCase />
 <StructureSection />
 
      <Container className="pb-16 sm:pb-20 lg:pb-24">
        {/* WORK */}
        <Section withDivider={false}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Work</h2>
              <p className="mt-3 max-w-[56ch] text-sm text-neutral-600">
                Izbrani projekti, kjer je bila struktura del rešitve — ne samo vizualni sloj.
              </p>
            </div>

            <Link
              href="/work"
              className="text-sm text-neutral-500 underline transition-colors hover:text-neutral-900"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-6">
            {featured[0] && (
              <Link href={`/work/${featured[0].slug}`} className={cardFeatured}>
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-[72ch]">
                    <div className="text-meta">Featured case</div>

                    <h3 className="mt-5 max-w-[15ch] text-[34px] font-semibold leading-[1.02] tracking-tight text-neutral-950 sm:text-[40px]">
                      {featured[0].title}
                    </h3>

                    <p className="mt-5 max-w-[58ch] text-body">
                      {featured[0].summary}
                    </p>
                  </div>

                  <div className="shrink-0 text-sm text-neutral-400 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                    Case →
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-5 border-t border-black/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {featured[0].tags.map((t) => (
                      <span key={t} className={chip}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="max-w-[28ch] text-sm leading-relaxed text-neutral-500">
                    Jasna predstavitev ponudbe, miren UI in hitra izvedba.
                  </div>
                </div>
              </Link>
            )}

            {featured[1] && (
              <Link href={`/work/${featured[1].slug}`} className={cardDefault}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="max-w-[58ch]">
                    <div className="text-lg font-semibold tracking-tight text-neutral-950">
                      {featured[1].title}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                      {featured[1].summary}
                    </p>
                  </div>

                  <div className="shrink-0 text-sm text-neutral-400 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                    Case →
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {featured[1].tags.map((t) => (
                    <span key={t} className={chip}>
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            )}
          </div>
        </Section>

        {/* NEWS */}
        <Section className="border-t border-neutral-200 py-10 sm:py-12 lg:py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">News</h2>
              <p className="mt-3 max-w-[56ch] text-sm text-neutral-600">
                Kratki zapisi o projektih, strukturi in odločitvah za ekranom.
              </p>
            </div>

            <Link
              href="/novice"
              className="text-sm text-neutral-500 underline transition-colors hover:text-neutral-900"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-6">
            {news[0] && (
              <Link href={`/novice/${news[0].slug}`} className={cardFeatured}>
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-[72ch]">
                    <div className="text-meta">Latest note</div>

                    <h3 className="mt-5 max-w-[16ch] text-[32px] font-semibold leading-[1.04] tracking-tight text-neutral-950 sm:text-[38px]">
                      {news[0].title}
                    </h3>

                    <p className="mt-5 max-w-[58ch] text-body">
                      {news[0].excerpt}
                    </p>
                  </div>

                  <div className="shrink-0 text-sm text-neutral-400 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                    Read →
                  </div>
                </div>
              </Link>
            )}

            {news[1] && (
              <Link href={`/novice/${news[1].slug}`} className={cardDefault}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="max-w-[58ch]">
                    <div className="text-lg font-semibold tracking-tight text-neutral-950">
                      {news[1].title}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                      {news[1].excerpt}
                    </p>
                  </div>

                  <div className="shrink-0 text-sm text-neutral-400 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                    Read →
                  </div>
                </div>
              </Link>
            )}
          </div>
        </Section>

   
      
        {/* STUDIO */}
        <Section className="border-t border-neutral-200 py-10 sm:py-12 lg:py-14">
          <div className="grid gap-6 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-black/10 bg-white/70 p-6 sm:p-8">
              <p className="text-meta">Studio</p>

              <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                Ne delam “še ene strani”.
              </h2>

              <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-neutral-700">
                Postavim strukturo, ki jasno pove, kaj ponudba pomeni in uporabnika vodi
                do naslednjega koraka — brez odvečnega šuma.
              </p>

              <div className="mt-6 text-sm text-neutral-500">
                Gregor Baumgartner — Digital Art Director
              </div>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-white/60 p-6 sm:p-8">
              <p className="text-meta">Principi</p>

              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-neutral-700">
                <li>• Struktura pred estetiko</li>
                <li>• Jasnost pred efekti</li>
                <li>• Manj šuma, več fokusa</li>
                <li>• UI kot orodje, ne dekoracija</li>
                <li>• Performance kot osnova</li>
              </ul>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}