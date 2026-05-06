import Link from "next/link";
import { work, news } from "@/lib/content";
import Container from "./components/Container";
import Section from "./components/Section";
import HeroPanel from "./components/HeroPanel";
import StructureSection from "./components/StructureSection";
import DecisionLayer from "./components/blocks/DecisionLayer";
import DecisionLayerCase from "./components/blocks/home/DecisionLayerCase";
import NextLayerInPractice from "./components/blocks/home/NextLayerInPractice";
import DecisionLayerSystem from "./components/blocks/home/DecisionLayerSystem";
import HowItWorks from "./components/blocks/home/HowItWorks";
import FinalCTA from "./components/blocks/home/FinalCTA";
import WorkProof from "./components/blocks/home/WorkProof";
import DecisionFlow from "./components/blocks/home/DecisionFlow";


const cardBase =
  "group block border border-black/10 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-black/20 hover:shadow-md";

const cardFeatured = `${cardBase} rounded-[32px] p-7 sm:p-10`;
const cardDefault = `${cardBase} rounded-[6px] bg-white/60 p-6 sm:p-8`;

const chip =
  "inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-neutral-700 transition-colors duration-200 hover:border-black/30 hover:bg-white";

export default function Home() {
  const featured = work.slice(0, 2);

  return (
    <>

     <HeroPanel />
<DecisionFlow />

<WorkProof />
<HowItWorks />

<FinalCTA />
 
     <section className="border-t border-white/10 bg-[#080808] py-20 text-white sm:py-24 lg:py-28">
  <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
          Notes
        </p>

        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          Razmišljanja za bolj jasne strani
        </h2>

        <p className="mt-4 max-w-[56ch] text-sm leading-6 text-white/55">
          Kratki zapisi o strukturi, projektih in odločitvah za ekranom.
        </p>
      </div>

      <Link
        href="/novice"
        className="text-sm text-white/50 transition hover:text-white"
      >
        Vse novice →
      </Link>
    </div>

    <div className="mt-10 grid gap-4">
      {news[0] && (
        <Link
          href={`/novice/${news[0].slug}`}
          className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20 sm:p-8"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-[72ch]">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                Latest note
              </p>

              <h3 className="mt-4 max-w-[18ch] text-2xl font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-3xl">
                {news[0].title}
              </h3>

              <p className="mt-4 max-w-[58ch] text-sm leading-6 text-white/55">
                {news[0].excerpt}
              </p>
            </div>

            <div className="shrink-0 text-sm text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white">
              Read →
            </div>
          </div>
        </Link>
      )}

      {news[1] && (
        <Link
          href={`/novice/${news[1].slug}`}
          className="group block rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-white/20"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div className="max-w-[58ch]">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/30">
                Note
              </p>

              <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-white">
                {news[1].title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                {news[1].excerpt}
              </p>
            </div>

            <div className="shrink-0 text-sm text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white">
              Read →
            </div>
          </div>
        </Link>
      )}
    </div>
  </div>
</section>
    </>
  );
}