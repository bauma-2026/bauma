const layers = [
  {
    number: "01",
    title: "Kaj je to",
    text: "Jasna razlaga brez tehničnega šuma.",
  },
  {
    number: "02",
    title: "Ali je to zame",
    text: "V nekaj sekundah ve, ali rešuje njegov problem.",
  },
  {
    number: "03",
    title: "Kako deluje",
    text: "Razume brez razmišljanja.",
  },
  {
    number: "04",
    title: "Zakaj verjeti",
    text: "Dokazi odstranijo dvom.",
  },
  {
    number: "05",
    title: "Kaj naredim zdaj",
    text: "Naslednji korak je jasen.",
  },
];

export default function DecisionLayerSystem() {
  return (
    <section
      id="system"
      className="border-t border-white/10 bg-neutral-950 py-20 text-white sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        <div className="max-w-[680px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
            Next Layer sistem
          </p>

          <h2 className="mt-4 max-w-[14ch] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Kako uporabnik pride do odločitve
          </h2>

          <p className="mt-5 max-w-[54ch] text-base leading-7 text-white/70">
            Stran ne sme samo pokazati informacij. Mora jih postaviti v vrstni
            red, ki uporabniku pomaga razumeti, zaupati in narediti naslednji
            korak.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {layers.map((layer) => (
            <div
              key={layer.number}
              className="rounded-[6px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[11px] font-medium text-white/50">
                {layer.number}
              </div>

              <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-white">
                {layer.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/60">
                {layer.text}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-[52ch] text-sm leading-6 text-white/50">
          Če manjka en layer, uporabnik ne naredi odločitve.
        </p>
      </div>
    </section>
  );
}