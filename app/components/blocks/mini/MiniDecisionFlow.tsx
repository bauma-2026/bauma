const flows = [
  {
    label: "Uporabnik se izgubi",
    tag: "običajno",
    steps: ["Storitev", "Tekst", "Dvom", "Exit"],
    note: "Uporabnik ne ve, kje začeti.",
    muted: true,
  },
  {
    label: "Uporabnik se odloči",
    tag: "jasna pot",
    steps: ["Problem", "Pot", "Dokaz", "Korak"],
    note: "Uporabnik se prepozna in gre naprej.",
    emphasis: "→ odločitev postane lažja",
    muted: false,
  },
];

export default function MiniDecisionFlow() {
  return (
    <section
      id="flow"
      className="scroll-mt-13 overflow-hidden border-t border-white/10 bg-[#080808] py-14 text-white sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        <div className="max-w-[680px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            Decision flow
          </p>

          <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:max-w-[18ch] sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.045em] lg:text-6xl">
            Vsak del strani vodi naprej.
          </h2>

          <p className="mt-5 max-w-[48ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            Uporabnik mora hitro razumeti, kje je, kaj je pomembno in kaj lahko
            naredi naprej.
          </p>
        </div>

        <div className="mt-9 grid gap-4 lg:mt-14 lg:grid-cols-2">
          {flows.map((flow) => (
            <div
              key={flow.label}
              className={[
                "min-w-0 rounded-2xl border p-5 sm:p-6 lg:p-7",
                flow.muted
                  ? "border-white/10 bg-[#0b0b0b]"
                  : "border-white/20 bg-[#171717]",
              ].join(" ")}
            >
              <div className="flex min-w-0 items-start justify-between gap-4">
                <h3 className="min-w-0 text-base font-semibold tracking-[-0.015em] text-white">
                  {flow.label}
                </h3>

  <p
  className={[
    "shrink-0 text-[10px] font-medium uppercase tracking-[0.22em]",
    flow.muted ? "text-white/42" : "text-sky-300/75",
  ].join(" ")}
>
  {flow.tag}
</p>
              </div>

              {/* Desktop / large screens */}
              <div className="mt-6 hidden items-center gap-3 lg:flex">
                {flow.steps.map((step, index) => (
                  <div key={step} className="flex min-w-0 items-center gap-3">
                    <div
                      className={[
                        "rounded-xl border px-4 py-3 text-sm",
                        flow.muted
                          ? "border-white/10 bg-[#101010] text-white/50"
                          : "border-white/20 bg-[#2b2b2b] text-white/85",
                      ].join(" ")}
                    >
                      {step}
                    </div>

                    {index < flow.steps.length - 1 && (
                      <span className="text-white/50">→</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile / tablet */}
              <div className="mt-5 grid gap-1.5 lg:hidden">
                {flow.steps.map((step, index) => (
                  <div key={step}>
                    <div
                      className={[
                        "w-full rounded-xl border px-4 py-2.5 text-center text-[13px]",
                        flow.muted
                          ? "border-white/10 bg-[#101010] text-white/50"
                          : "border-white/20 bg-[#2b2b2b] text-white/85",
                      ].join(" ")}
                    >
                      {step}
                    </div>

                    {index < flow.steps.length - 1 && (
                      <div className="py-0.5 text-center text-white/50">↓</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-white/10 pt-4 sm:mt-6 sm:pt-5">
                <p className="text-sm leading-6 text-white/50">{flow.note}</p>

                {flow.emphasis && (
                  <p className="mt-2 text-sm font-medium text-sky-300/80">
                    {flow.emphasis}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}