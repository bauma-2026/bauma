const principles = [
  {
    number: "01",
    label: "Struktura",
    shape: "square",
    title: "Najprej postavimo okvir.",
    text: "Vsebina dobi jasen vrstni red. Uporabnik hitreje razume, kje je, kaj je pomembno in kam naj pogleda naprej.",
  },
  {
    number: "02",
    label: "Jasnost",
    shape: "circle",
    title: "Potem zmanjšamo šum.",
    text: "Ko je struktura jasna, se zmanjša dvom. Stran ne sili uporabnika v razmišljanje, ampak mu pomaga razumeti bistvo.",
  },
  {
    number: "03",
    label: "Naslednji korak",
    shape: "triangle",
    title: "Na koncu mora biti smer očitna.",
    text: "Dobra stran ne razloži samo ponudbe. Uporabnika pripelje do odločitve in mu pokaže, kaj naj naredi naslednje.",
  },
] as const;

const flows = [
  {
    label: "Uporabnik obstane",
    tag: "brez jasne poti",
    steps: ["Storitev", "Tekst", "Dvom", "Exit"],
    description:
      "Uporabnik ne ve, kje začeti. Stran sicer nekaj pove, vendar ne ustvari jasne poti do odločitve.",
    result: "Vsak del obstaja zase.",
    muted: true,
  },
  {
    label: "Uporabnik gre naprej",
    tag: "jasna pot",
    steps: ["Problem", "Pot", "Dokaz", "Korak"],
    description:
      "Uporabnik hitro razume, kaj je zanj pomembno. Stran ga vodi skozi bistvo in mu olajša naslednji korak.",
    result: "Vsak del vodi proti odločitvi.",
    muted: false,
  },
] as const;

type Shape = "square" | "circle" | "triangle";

function ShapeIcon({ shape }: { shape: Shape }) {
  if (shape === "square") {
    return <div className="h-8 w-8 rotate-[8deg] border border-white/24" />;
  }

  if (shape === "circle") {
    return <div className="h-9 w-9 rounded-full border border-white/24" />;
  }

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="h-10 w-10"
      aria-hidden="true"
    >
      <polygon
        points="24,7 42,39 6,39"
        stroke="rgba(255,255,255,0.24)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function MiniDecisionFlow() {
  return (
    <section
      id="flow"
      className="scroll-mt-13 overflow-hidden border-t border-white/10 bg-[#0a0a0a] py-14 text-white sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        {/* Intro */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              Decision flow
            </p>

            <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:max-w-[16ch] sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.045em] lg:text-6xl">
              Od strukture do odločitve.
            </h2>
          </div>

          <p className="max-w-[58ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7 lg:pb-1">
            Uporabnik mora hitro razumeti, kje je, kaj je pomembno in kaj lahko
            naredi naprej. Zato stran potrebuje jasen vrstni red: strukturo,
            jasnost in očiten naslednji korak.
          </p>
        </div>

        {/* Shape principles */}
        <div className="mt-9 grid gap-4 lg:mt-14 lg:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className="rounded-[28px] border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:bg-white/[0.04] sm:p-6 lg:p-7"
            >
              <div className="flex items-start justify-between gap-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
                  {principle.number}
                </p>

                <div className="opacity-80">
                  <ShapeIcon shape={principle.shape} />
                </div>
              </div>

              <h3 className="mt-7 text-lg font-semibold tracking-[-0.02em] text-white">
                {principle.label}
              </h3>

              <p className="mt-7 text-sm font-semibold leading-6 text-white/76">
                {principle.title}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/46">
                {principle.text}
              </p>
            </article>
          ))}
        </div>

        {/* UX comparison */}
        <div className="mt-14 border-t border-white/10 pt-10 lg:mt-16 lg:pt-12">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
            <div className="max-w-[620px]">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
                Kaj se spremeni
              </p>

              <h3 className="mt-4 max-w-[11ch] text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.045em]">
                Vsak del strani vodi naprej.
              </h3>
            </div>

            <p className="max-w-[60ch] pt-1 text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              Ko stran nima jasne poti, uporabnik obstane. Ko ima strukturo,
              vsak del strani zmanjša dvom in uporabnika pripelje bližje
              odločitvi.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-2">
            {flows.map((flow) => (
              <article
                key={flow.label}
                className={[
                  "rounded-[28px] border p-6 sm:p-7",
                  flow.muted
                    ? "border-white/10 bg-[#0a0a0a]"
                    : "border-white/14 bg-[#121212]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
    <h4 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-white/82 sm:text-2xl">
  {flow.label}
</h4>

                <p
  className={[
    "shrink-0 pt-1 text-[10px] font-medium uppercase tracking-[0.14em]",
    flow.muted ? "text-white/38" : "text-[#B68A4C]/80",
  ].join(" ")}
>
  {flow.tag}
</p>
                </div>

                <div className="mt-8">
                  {/* Desktop */}
                  <div className="hidden flex-wrap items-center gap-3 lg:flex">
                    {flow.steps.map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <div
                          className={[
                            "rounded-xl border px-4 py-3 text-sm",
                            flow.muted
                              ? "border-white/10 bg-[#101010] text-white/50"
                              : "border-white/16 bg-[#2a2a2a] text-white/84",
                          ].join(" ")}
                        >
                          {step}
                        </div>

                        {index < flow.steps.length - 1 && (
                          <span
                            className={
                              flow.muted ? "text-white/22" : "text-white/40"
                            }
                          >
                            {flow.muted ? "/" : "→"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Mobile / tablet */}
                  <div className="grid gap-1.5 lg:hidden">
                    {flow.steps.map((step, index) => (
                      <div key={step}>
                        <div
                          className={[
                            "w-full rounded-xl border px-4 py-2.5 text-center text-[13px]",
                            flow.muted
                              ? "border-white/10 bg-[#101010] text-white/50"
                              : "border-white/16 bg-[#2a2a2a] text-white/84",
                          ].join(" ")}
                        >
                          {step}
                        </div>

                        {index < flow.steps.length - 1 && (
                          <div
                            className={[
                              "py-0.5 text-center",
                              flow.muted ? "text-white/22" : "text-white/40",
                            ].join(" ")}
                          >
                            {flow.muted ? "/" : "↓"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="text-base leading-7 text-white/58">
                    {flow.description}
                  </p>

                  <p
                    className={[
                      "mt-4 text-sm font-medium tracking-[-0.01em]",
                      flow.muted ? "text-white/34" : "text-white/72",
                    ].join(" ")}
                  >
                    {flow.result}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}