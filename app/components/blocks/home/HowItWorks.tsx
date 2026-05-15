const steps = [
  {
    number: "01",
    title: "Najdeva, kje se odločitev izgubi",
    text: "Kje uporabnik zastane, dvomi ali ne ve, kaj narediti naprej.",
  },
  {
    number: "02",
    title: "Postavim jasen flow",
    text: "Problem, pot, dokaz in naslednji korak uredim v jasno zaporedje.",
  },
  {
    number: "03",
    title: "Zgradim stran kot sistem",
    text: "Struktura postane hitra, jasna in uporabna spletna stran.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="process"
      className="scroll-mt-24 border-t border-white/10 bg-[#111214] py-20 text-white sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Proces
            </p>

            <h2 className="mt-4 max-w-[13ch] text-[42px] font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl">
              Kako zgradim pot do odločitve
            </h2>

            <p className="mt-5 max-w-[46ch] text-base leading-[1.65] text-white/58">
            Najprej poiščem mesto, kjer uporabnik obstane. Potem zgradim flow, ki razjasni problem, pokaže dokaz in pripelje do naslednjega koraka.
            </p>

            <div className="mt-11 space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[11px] font-medium text-white/45">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold leading-[1.2] tracking-[-0.01em] text-white">
                      {step.title}
                    </h3>

                    <p className="mt-1 max-w-[42ch] text-sm leading-6 text-white/55">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-8 lg:p-10">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                {["Problem", "Flow", "Odločitev"].map((item, index) => (
                  <div key={item} className="contents">
                    <div
                      className={[
                        "flex min-h-20 min-w-0 items-center justify-center rounded-xl border px-4 text-center text-sm font-medium sm:min-h-24 sm:text-base",
                        item === "Flow"
                          ? "border-white/25 bg-white/[0.08] text-white"
                          : "border-white/10 bg-black/20 text-white/75",
                      ].join(" ")}
                    >
                      {item}
                    </div>

                    {index < 2 && (
                      <div
                        className="flex justify-center py-1 text-white/35 max-sm:rotate-90"
                        aria-hidden="true"
                      >
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-6 text-white/50 sm:mt-8 sm:pt-6">
                Flow odstrani dvom. Uporabnik razume, zakaj je naslednji korak
                smiseln.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}