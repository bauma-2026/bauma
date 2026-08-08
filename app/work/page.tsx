import type { Metadata } from "next";
import Link from "next/link";
import { work } from "../../lib/content";
import MiniHeader from "../components/blocks/mini/MiniHeader";
import MiniFooter from "../components/blocks/mini/MiniFooter";

export const metadata: Metadata = {
  title: "Work — Bauma",
  description: "Work preview for Bauma.",
  robots: {
    index: false,
    follow: false,
  },
};

const caseMeta: Record<
  string,
  {
    name: string;
    eyebrow: string;
  }
> = {
  flexido: {
    name: "Flexido",
    eyebrow: "Industrial B2B",
  },
  "odstrani-tattoo": {
    name: "Odstrani Tattoo",
    eyebrow: "Trust & conversion",
  },
  "dema-plus": {
    name: "Dema Plus",
    eyebrow: "References & clarity",
  },
};

function getCaseMeta(slug: string) {
  return (
    caseMeta[slug] ?? {
      name: slug,
      eyebrow: "Case",
    }
  );
}

function SystemShape({
  type,
  className = "",
}: {
  type: "square" | "circle" | "triangle";
  className?: string;
}) {
  if (type === "square") {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="24"
          y="24"
          width="52"
          height="52"
          transform="rotate(8 50 50)"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  if (type === "circle") {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="34"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M50 16 L84 78 H16 Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M50 30V70"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}

function CasePoint({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="border-t border-white/10 pt-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#D1A45F]/75">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-white/52">{text}</p>
    </div>
  );
}
function FeaturedCasePoint({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#D1A45F]/75">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-white/52 sm:text-base sm:leading-7">
        {text}
      </p>
    </div>
  );
}
export default function WorkPage() {
  const featured = work[0];
  const supporting = work.slice(1);
  const featuredMeta = getCaseMeta(featured.slug);

  return (
    <>
      <MiniHeader />

      <main className="bg-[#080808] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10 px-6 pb-16 pt-24 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(182,138,76,0.035),transparent_32%)]" />

          <div className="relative mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-14">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                Work
              </p>

              <h1 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl sm:leading-[0.95] lg:text-6xl">
                Primeri, kjer struktura vodi do odločitve.
              </h1>
            </div>

            <p className="max-w-[56ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              To niso še dolgi case studies. To je prvi proof layer: primeri,
              kjer je bila struktura del rešitve — od razpršene ponudbe do
              jasnega naslednjega koraka.
            </p>
          </div>
        </section>

        {/* Featured */}
        <section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1100px]">
            <Link
              href={`/work/${featured.slug}`}
              className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-[1px] hover:border-white/18 hover:bg-white/[0.04] sm:p-8 lg:p-10"
            >
              <SystemShape
                type="square"
                className="pointer-events-none absolute right-8 top-8 h-16 w-16 text-white/12"
              />

              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#D1A45F]/75">
                    Featured case · {featuredMeta.eyebrow}
                  </p>

                  <h2 className="mt-5 max-w-[16ch] text-3xl font-semibold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl sm:leading-[0.98]">
                    {featured.title}
                  </h2>

                  <p className="mt-5 max-w-[52ch] text-sm leading-6 text-white/52 sm:text-base sm:leading-7">
                    {featured.summary}
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition duration-300 group-hover:translate-x-1 group-hover:text-white">
                    <span>{featuredMeta.name}</span>
                    <span>→</span>
                  </div>
                </div>

                <div className="grid gap-7 lg:pt-8">
  <FeaturedCasePoint label="Problem" text={featured.challenge[0]} />
  <FeaturedCasePoint label="Pristop" text={featured.approach[0]} />
  <FeaturedCasePoint label="Rezultat" text={featured.outcome[0]} />
</div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        </section>

        {/* Supporting cases */}
        <section className="px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1100px]">
            <div className="mb-10 max-w-[680px]">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                More examples
              </p>

              <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl">
                Isti princip. Različni konteksti.
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {supporting.map((item, index) => {
                const meta = getCaseMeta(item.slug);
                const shape = index === 0 ? "circle" : "triangle";

                return (
                  <Link
                    key={item.slug}
                    href={`/work/${item.slug}`}
                    className="group relative block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-[1px] hover:border-white/18 hover:bg-white/[0.04] sm:p-7"
                  >
   <SystemShape
  type={shape}
  className="pointer-events-none absolute right-5 top-5 hidden h-12 w-12 text-white/14 lg:block"
/>

                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#D1A45F]/75">
                      {meta.eyebrow}
                    </p>

                    <div className="mt-5 flex items-start justify-between gap-6">
                      <div>
                        <h3 className="max-w-[18ch] text-2xl font-semibold leading-[1.08] tracking-[-0.025em] text-white sm:text-3xl">
                          {meta.name}
                        </h3>

                        <p className="mt-4 max-w-[48ch] text-sm leading-6 text-white/52">
                          {item.summary}
                        </p>
                      </div>

                    
                    </div>

                    <div className="mt-7 grid gap-4">
                      <CasePoint label="Problem" text={item.challenge[0]} />
                      <CasePoint label="Pristop" text={item.approach[0]} />
                      <CasePoint label="Rezultat" text={item.outcome[0]} />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <MiniFooter />
    </>
  );
}