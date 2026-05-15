const heroItems = [
  {
    number: "01",
    title: "Kaj je to",
    text: "Jasno, brez tehničnega šuma.",
  },
  {
    number: "02",
    title: "Ali je zame",
    text: "Uporabnik hitro razume relevantnost.",
  },
  {
    number: "03",
    title: "Kako deluje",
    text: "Flow odstrani nepotrebno razmišljanje.",
  },
  {
    number: "04",
    title: "Zakaj verjeti",
    text: "Struktura zmanjša dvom pred odločitvijo.",
  },
  {
    number: "05",
    title: "Kaj naredim zdaj",
    text: "Naslednji korak postane očiten.",
  },
];

export default function MiniHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#080808] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.07),transparent_34%)]" />

      <div className="relative mx-auto grid max-w-[1100px] gap-10 px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:min-h-[calc(100vh-52px)] lg:grid-cols-[1fr_0.78fr] lg:items-center lg:gap-14 lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-white/45">
            Structure-first websites
            <span className="text-white/25">→</span>
          </div>

        <h1 className="mt-8 max-w-[14ch] font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-white sm:max-w-[15ch] sm:text-6xl lg:max-w-[14ch] lg:text-7xl">
  Jasna struktura.
  <br />
  Več odločitev.
</h1>

         <p className="mt-8 max-w-[52ch] text-base leading-7 text-white/58 sm:text-lg">
  Spletne strani postavim tako, da uporabnik hitreje razume, zaupa in naredi
  naslednji korak.
</p>

          <div className="mt-9">
            <a
              href="#flow"
              className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:-translate-y-[1px] hover:bg-white/90 active:translate-y-0"
            >
              <span className="inline-flex items-center gap-2">
                Kako nastane jasna pot
                <span className="transition duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Desktop-only checklist */}
        <div className="relative hidden lg:block lg:pl-8">
          <div className="absolute -inset-10 rounded-full bg-white/[0.03] blur-3xl" />

          <div className="relative">
            <div className="space-y-5">
              {heroItems.map((item) => (
                <div
                  key={item.number}
                  className="grid grid-cols-[34px_1fr] gap-4"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-[11px] text-white/32">
                    {item.number}
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white/72">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-white/42">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm leading-6 text-white/45">
               Vsak del strani ima svojo nalogo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}