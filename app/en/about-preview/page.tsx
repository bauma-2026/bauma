import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MiniHeaderEn from "../../components/blocks/mini/MiniHeaderEn";
import MiniFooterEn from "../../components/blocks/mini/MiniFooterEn";
import Container from "../../components/layout/Container";

export const metadata: Metadata = {
  title: "About Preview — Bauma",
  description: "About preview for Bauma.",
  robots: {
    index: false,
    follow: false,
  },
};

const timeline = [
  {
    eyebrow: "1999–2002",
    title: "Early digital systems",
    text: "My digital path started at Ljubljanska banka / NLB, in the then modern channels team, where I worked on early support for NLB Klik and NLB Proklik.",
  },
  {
    eyebrow: "Digital trust",
    title: "Users, browsers and certificates",
    text: "That is where I saw early on how quickly a user can get lost inside a digital system: certificates, browsers, security, trust and a clear next step.",
  },
  {
    eyebrow: "Visual communication",
    title: "From systems to visual structure",
    text: "That period later led me into visual communication, interactive design and work where design, technology and user understanding meet.",
  },
];

const principles = [
  {
    title: "Structure before surface",
    text: "First, it has to be clear what the user understands, what they trust and which step they need to take.",
  },
  {
    title: "Clarity before decoration",
    text: "The visual layer has the most value when it supports the structure, not when it competes with the content.",
  },
  {
    title: "AI as multiplier",
    text: "I use AI as a multiplier for thinking, development and iteration — not as a replacement for judgment, tone and direction.",
  },
];

function AboutSystemShape({
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

export default function AboutPreviewPage() {
  return (
    <>
      <MiniHeaderEn />

      <main className="bg-[#080808] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10 pb-20 pt-14 sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(182,138,76,0.055),transparent_32%)]" />

          <Container className="relative">
            <div className="inline-flex items-center rounded-full border border-[#B68A4C]/25 bg-[#B68A4C]/[0.04] px-3 py-1 text-[11px] font-medium text-white/72 shadow-[0_0_24px_rgba(182,138,76,0.07)]">
              About preview
            </div>

            <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_300px] lg:items-end lg:gap-24">
              <div className="max-w-[720px]">
                <h1 className="max-w-[10ch] font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.025em] text-white sm:max-w-[16ch] sm:text-6xl lg:text-7xl">
                  <span className="block sm:hidden">
                    Structure
                    <br />
                    brings
                    <br />
                    clarity
                    <br />
                    to the whole.
                  </span>

                  <span className="hidden sm:block">
                    Structure brings
                    <br />
                    clarity to the whole.
                  </span>
                </h1>

                <div className="mt-8 max-w-[58ch]">
                  <p className="text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
                    Bauma is my way of working with websites and digital
                    systems: connecting scattered parts into a meaningful
                    whole.
                  </p>

                  <p className="mt-5 text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
                    When content, the visual layer and technology move in the
                    same direction, a website becomes clearer, calmer and
                    easier to decide from.
                  </p>
                </div>

                {/* Mobile portrait */}
                <div className="relative mr-auto mt-7 max-w-[190px] lg:hidden">
                  <div className="pointer-events-none absolute -inset-8 rounded-full bg-white/[0.03] blur-3xl" />

                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.015] shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
                    <Image
                      src="/images/gregor/gb-bauma-portrait-v2.webp"
                      alt="Gregor Baumgartner"
                      width={900}
                      height={1125}
                      priority
                      className="aspect-[4/5] w-full object-cover object-center opacity-95 contrast-[0.96] saturate-[0.85]"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop portrait */}
              <div className="relative hidden lg:block lg:w-[240px] lg:justify-self-end xl:w-[260px]">
                <div className="pointer-events-none absolute -inset-10 rounded-full bg-white/[0.03] blur-3xl" />

                <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.015] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                  <Image
                    src="/images/gregor/gb-bauma-portrait-v2.webp"
                    alt="Gregor Baumgartner"
                    width={900}
                    height={1125}
                    priority
                    className="aspect-[4/5] w-full object-cover object-center opacity-95 contrast-[0.96] saturate-[0.9]"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Origin */}
        <section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                Origin
              </p>

              <h2 className="mt-4 max-w-[15ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                Early contact with digital friction.
              </h2>
            </div>

            <div className="border-y border-white/10 lg:mt-6">
              {timeline.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-3 border-b border-white/10 py-6 last:border-b-0 sm:grid-cols-[120px_1fr] sm:gap-8"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.11em] text-[#D1A45F]/75">
                    {item.eyebrow}
                  </p>

                  <div>
                    <h3 className="text-base font-semibold tracking-[-0.015em] text-white/90 sm:text-lg">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-[58ch] text-sm leading-6 text-white/52">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shift */}
        <section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                What changed
              </p>

              <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                Good looking is no longer enough.
              </h2>
            </div>

            <div className="max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              <p>
                Today, almost anyone can quickly create a website that looks
                good enough. That means appearance alone is no longer a strong
                enough signal.
              </p>

              <p className="mt-5">
                The difference appears in the structure: what comes first, what
                needs to be clear, where trust is created and which next step
                has to be obvious.
              </p>

              <p className="mt-5">
                That is why Bauma does not start with decoration, but with the
                user’s path.
              </p>
            </div>
          </div>
        </section>

        {/* How I work */}
        <section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-[720px]">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                How I work
              </p>

              <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                First the path. Then the layer.
              </h2>

              <p className="mt-6 max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                First, I look at where the user gets lost: in the offer,
                content, sequence of information, proof or CTAs. Then I
                organize the page as a system.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {principles.map((item, index) => {
                const shape =
                  index === 0
                    ? "square"
                    : index === 1
                      ? "circle"
                      : "triangle";

                return (
                  <div
                    key={item.title}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:border-white/16 hover:bg-white/[0.04] sm:p-6"
                  >
                    <AboutSystemShape
                      type={shape}
                      className="pointer-events-none absolute right-4 top-4 h-10 w-10 text-white/20"
                    />

                    <h3 className="relative max-w-[20ch] text-base font-semibold tracking-[-0.015em] text-white/90">
                      {item.title}
                    </h3>

                    <p className="relative mt-3 text-sm leading-6 text-white/50">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 sm:p-6 lg:max-w-[720px]">
              <p className="text-sm leading-6 text-white/52">Core flow:</p>

              <p className="mt-2 text-base font-medium leading-7 tracking-[-0.02em] text-white">
                problem{" "}
                <span className="text-[#B68A4C]/70">→</span>{" "}
                <span className="text-white">clear path</span>{" "}
                <span className="text-[#B68A4C]/70">→</span>{" "}
                proof <span className="text-[#B68A4C]/70">→</span> next step
              </p>
            </div>
          </div>
        </section>

        {/* Current working model */}
        <section className="border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                Current model
              </p>

              <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                Ljubljana-born.
                <br />
                Based in a quieter place.
              </h2>
            </div>

            <div className="max-w-[58ch] text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              <p>
                I was born in Ljubljana, where I grew up and built most of my
                professional path through visual communication, advertising and
                digital work.
              </p>

              <p className="mt-5">
                Today, I work from a quieter base. That shift gives me more
                focus, less noise and a more structured way of working —
                without losing the urban communication background I come from.
              </p>

              <p className="mt-5">
                I use AI as a multiplier of ability: it helps me think faster,
                develop components, test structures and iterate. The value still
                remains in selection, judgment, tone, hierarchy and decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="px-6 py-16 text-center sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[720px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
              Next step
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-4xl">
              Let’s start with one clear question.
            </h2>

            <p className="mx-auto mt-5 max-w-[46ch] text-sm leading-6 text-white/58 sm:text-base sm:leading-7">
              Send a link, an idea or a short description of the problem. We
              can look at where the biggest uncertainty is and which step makes
              the most sense to fix first.
            </p>

            <div className="mt-8">
              <Link
                href="mailto:hello@bauma.si?subject=Inquiry%20%E2%80%94%20Bauma"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                hello@bauma.si
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MiniFooterEn />
    </>
  );
}