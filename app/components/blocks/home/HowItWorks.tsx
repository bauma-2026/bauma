const steps = [
  {
    number: "01",
    title: "Najdeva, kje uporabnik izgubi odločitev",
    text: "Kje zastane, dvomi ali ne ve, kaj narediti naprej.",
  },
  {
    number: "02",
    title: "Postavim flow",
    text: "Problem, pot, dokaz in naslednji korak uredim v jasen sistem.",
  },
  {
    number: "03",
    title: "Zgradim stran",
    text: "Struktura postane hitra, jasna in uporabna stran.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="process"
      className="border-t border-white/10 bg-[#111214] py-20 text-white sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Proces
            </p>

            <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl">
              Kako uporabnik pride do odločitve
            </h2>

            <p className="mt-5 max-w-[46ch] text-base leading-7 text-white/60">
              Ne začnem z dizajnom. Najprej poiščem mesto, kjer uporabnik
              izgubi odločitev — potem zgradim flow, ki ga premakne naprej.
            </p>

            <div className="mt-12 space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[11px] font-medium text-white/45">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 max-w-[40ch] text-sm leading-6 text-white/55">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10">
              <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">
                {["Problem", "Flow", "Odločitev"].map((item, index) => (
                  <div key={item} className="contents">
                    <div
                      className={[
                        "flex min-h-24 items-center justify-center rounded-xl border px-4 text-center text-base font-medium",
                        item === "Flow"
                          ? "border-white/25 bg-white/[0.08] text-white"
                          : "border-white/10 bg-black/20 text-white/75",
                      ].join(" ")}
                    >
                      {item}
                    </div>

                    {index < 2 && (
                      <div className="text-white/35" aria-hidden="true">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-6 text-white/50">
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