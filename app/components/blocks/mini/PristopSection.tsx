const principles = [
  {
    number: "01",
    title: "Odstranimo šum",
    text: "Ponavljanje, nejasne CTA-je in sekcije, ki nimajo jasne naloge.",
    result: "Manj trenja.",
  },
  {
    number: "02",
    title: "Postavimo pot",
    text: "Hierarhijo, zaporedje informacij in jasen prehod do naslednjega koraka.",
    result: "Več orientacije.",
  },
  {
    number: "03",
    title: "Oblika dobi nalogo",
    text: "Vizual, detajli in občutek strani podprejo razumevanje, zaupanje in odločitev.",
    result: "Več zaupanja.",
  },
];

export default function PristopSection() {
  return (
    <section
      id="approach"
      className="border-t border-white/10 bg-[#080808] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12 lg:px-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            Approach
          </p>

          <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:max-w-[14ch] sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.045em] lg:text-6xl">
            Najprej jasna pot. Potem oblika.
          </h2>

          <p className="mt-5 max-w-[48ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            Najprej uredim, kaj mora uporabnik razumeti. Šele potem pridejo
            vizual, detajli in občutek strani.
          </p>
        </div>

        <div className="border-y border-white/10">
          {principles.map((item) => (
            <article
              key={item.number}
              className="grid gap-4 border-b border-white/10 py-6 last:border-b-0 sm:grid-cols-[64px_1fr] sm:gap-6 lg:py-7"
            >
              <p className="text-[11px] font-medium tracking-[0.18em] text-white/45">
                {item.number}
              </p>

              <div>
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-white/92">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-[52ch] text-sm leading-6 text-white/50">
                  {item.text}
                </p>

                <p className="mt-4 text-sm font-medium tracking-[-0.01em] text-white/72">
                  {item.result}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="lg:col-start-2">
          <p className="max-w-[56ch] border-l border-white/10 pl-5 text-sm leading-6 text-white/50">
            Najprej uredim pot. Šele potem imajo vizual, detajli in občutek
            strani pravo nalogo.
          </p>
        </div>
      </div>
    </section>
  );
}