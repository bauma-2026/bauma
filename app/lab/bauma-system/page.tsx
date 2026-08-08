import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bauma System Field",
  robots: {
    index: false,
    follow: false,
  },
};

const systemSteps = [
  {
    label: "Signal",
    title: "Find what matters.",
    body:
      "Before structure or design, the core signal has to be separated from noise: the real offer, the main user question, the strongest proof, and the reason the page should exist.",
  },
  {
    label: "Structure",
    title: "Organize the information.",
    body:
      "The content is arranged into a hierarchy: what belongs on the main page, what needs its own page, what should be removed, and what the user must understand first.",
  },
  {
    label: "Flow",
    title: "Shape the path.",
    body:
      "The website becomes a guided journey, not a collection of sections. The user moves from recognition to understanding, from understanding to trust, and from trust to action.",
  },
  {
    label: "Interface",
    title: "Build the experience.",
    body:
      "The structure becomes a usable interface through layout, components, rhythm, responsive behavior, interaction, and visual hierarchy.",
  },
  {
    label: "Proof",
    title: "Make it believable.",
    body:
      "Proof is built into the system through results, references, process, product details, before-and-after material, technical evidence, or case studies.",
  },
  {
    label: "Action",
    title: "Lead to the next step.",
    body:
      "The final action is not just a button. It is the point where the user has enough clarity and trust to make a meaningful next move.",
  },
];

const applications = [
  {
    title: "Websites",
    body: "Clear structure, stronger hierarchy, better conversion paths.",
  },
  {
    title: "Product explanation",
    body: "Interactive layers for complex products, services, or technical systems.",
  },
  {
    title: "Proof systems",
    body: "Case studies, results, references, before-and-after material, and trust layers.",
  },
  {
    title: "Spatial prototypes",
    body: "3D or interactive models that help users understand something faster.",
  },
];

export default function BaumaSystemPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-6 py-24">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
            Bauma Lab
          </p>

          <h1 className="max-w-4xl text-5xl font-medium tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            Bauma System Field
          </h1>

          <p className="mt-7 max-w-2xl text-xl leading-8 text-white/72 sm:text-2xl sm:leading-9">
            A structure-first model for turning unclear information into clear
            digital systems.
          </p>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/56">
            Most websites do not need more decoration. They need a clearer
            signal, a stronger structure, better proof, and a more meaningful
            next step.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#system-field"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-950 transition hover:bg-white/90"
            >
              Explore the model
            </a>

            <Link
              href="/work"
              className="rounded-full border border-white/16 px-5 py-3 text-sm font-medium text-white/72 transition hover:border-white/28 hover:text-white"
            >
              View work
            </Link>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:py-32">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-white/40">
              The problem
            </p>

            <h2 className="text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">
              The problem is rarely the surface.
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-lg leading-8 text-white/64">
              Many websites look acceptable at first glance, but still fail to
              explain the offer clearly enough. The user has to work too hard to
              understand what the company does, why it matters, what proves it,
              and what to do next.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                "The offer is unclear.",
                "The hierarchy is weak.",
                "The proof is too hidden.",
                "The next step feels generic.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/64"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM FIELD */}
      <section id="system-field" className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-white/40">
              System field
            </p>

            <h2 className="text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">
              A working model for turning scattered information into a clear
              digital path.
            </h2>
          </div>

          {/* Spline reference: https://my.spline.design/baumasystemfieldv01-lELMvle5Z6f5wDwDxFPt50CQ/ */}
          <div className="mt-16 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),rgba(255,255,255,0.018)] bg-[size:28px_28px] px-5 py-7 sm:px-7 sm:py-8 lg:px-9 lg:py-10">
            <div className="grid gap-7 lg:grid-cols-[8.5rem_1fr_9.5rem] lg:items-start lg:gap-6">
              <div className="relative min-h-24 rounded-xl border border-white/8 bg-neutral-950/45 p-4">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/32">
                  Input noise
                </p>

                <div className="mt-5 grid h-12 grid-cols-5 gap-2">
                  <span className="mt-4 h-1.5 w-1.5 rounded-full bg-white/18" />
                  <span className="h-2 w-2 rounded-full bg-white/28" />
                  <span className="mt-7 h-1 w-1 rounded-full bg-white/14" />
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/22" />
                  <span className="mt-6 h-2.5 w-2.5 rounded-full border border-white/18" />
                  <span className="ml-3 mt-1 h-1 w-1 rounded-full bg-white/16" />
                  <span className="mt-5 h-2 w-2 rounded-full border border-white/14" />
                  <span className="mt-3 h-1.5 w-1.5 rounded-full bg-white/24" />
                  <span className="ml-1 h-1 w-1 rounded-full bg-white/12" />
                  <span className="mt-4 h-1.5 w-1.5 rounded-full bg-white/20" />
                </div>
              </div>

              <div className="relative">
                {/* Desktop path line */}
                <div className="absolute left-[8.333%] right-[8.333%] top-6 hidden h-px bg-white/18 lg:block" />

                {/* Mobile path line */}
                <div className="absolute bottom-6 left-5 top-6 w-px bg-white/16 lg:hidden" />

                <div className="relative grid gap-5 lg:grid-cols-6 lg:gap-0">
                  {systemSteps.map((step, index) => (
                    <div
                      key={step.label}
                      className="relative pl-14 lg:flex lg:flex-col lg:items-center lg:px-1.5 lg:pl-1.5 lg:pt-14"
                    >
                      <div className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-neutral-950 text-[0.68rem] font-medium text-white/58 shadow-[0_0_0_6px_rgba(10,10,10,0.9)] lg:left-1/2 lg:-translate-x-1/2">
                        {index + 1}
                      </div>

                      <div className="absolute left-5 top-10 hidden h-4 w-px bg-white/14 lg:left-1/2 lg:block lg:-translate-x-px" />

                      <div className="w-full rounded-lg border border-white/8 bg-neutral-950/60 p-4 lg:min-h-[9.75rem]">
                        <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/30">
                          0{index + 1}
                        </p>

                        <h3 className="mt-4 text-sm font-medium tracking-[-0.01em] text-white">
                          {step.label}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-white/46">
                          {step.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/12 bg-white/[0.045] p-4 lg:mt-14">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/36">
                  Output
                </p>

                <div className="mt-5 h-20 rounded-lg border border-white/12 bg-neutral-950/60 p-3">
                  <div className="h-2 w-2/3 rounded-full bg-white/24" />
                  <div className="mt-3 h-px w-full bg-white/12" />
                  <div className="mt-3 h-px w-5/6 bg-white/10" />
                  <div className="mt-4 h-7 rounded-md border border-white/12 bg-white/[0.035]" />
                </div>
              </div>
            </div>

            <div className="mt-9 border-t border-white/10 pt-6 lg:mt-10 lg:pt-7">
              <p className="max-w-3xl text-base leading-7 text-white/56">
                Each project starts by finding the signal. From there, the
                information is structured, shaped into a user flow, translated
                into an interface, supported with proof, and directed toward a
                meaningful action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIX STEPS */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-white/40">
              Method
            </p>

            <h2 className="text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">
              Six steps, one clear path.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {systemSteps.map((step, index) => (
              <article
                key={step.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/36">
                  0{index + 1} / {step.label}
                </p>

                <h3 className="mt-6 text-xl font-medium tracking-[-0.02em] text-white">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/56">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-white/40">
              Applications
            </p>

            <h2 className="text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">
              One model, multiple digital formats.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/60">
              The same structure-first method can stay flat as a website, become
              a product explanation layer, or expand into an interactive spatial
              experience.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {applications.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-lg font-medium tracking-[-0.02em] text-white">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/52">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-white/40">
              Next step
            </p>

            <h2 className="text-4xl font-medium tracking-[-0.045em] text-white sm:text-5xl">
              Start with the signal.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
              If the structure is unclear, the design can only hide the problem
              for a while. A clearer digital system starts by understanding what
              needs to be explained.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-950 transition hover:bg-white/90"
              >
                Discuss a project
              </Link>

              <Link
                href="/work"
                className="rounded-full border border-white/16 px-5 py-3 text-sm font-medium text-white/72 transition hover:border-white/28 hover:text-white"
              >
                View selected work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
