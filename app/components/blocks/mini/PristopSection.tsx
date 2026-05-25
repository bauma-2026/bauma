const principles = [
  {
    number: "01",
    title: "Odstranimo šum",
    text: "Ponavljanje, nejasne CTA-je in sekcije brez jasne naloge.",
  },
  {
    number: "02",
    title: "Postavimo pot",
    text: "Hierarhijo, vrstni red informacij in jasen prehod do naslednjega koraka.",
  },
  {
    number: "03",
    title: "Oblika dobi nalogo",
    text: "Vizual, detajli in občutek strani podprejo razumevanje in zaupanje.",
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

          <p className="mt-5 max-w-[52ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            Najprej uredim, kaj mora uporabnik razumeti: odstranimo šum,
            postavimo pot in šele nato dodamo obliko, ki ima jasno nalogo.
          </p>
        </div>

        <div className="border-y border-white/10">
          {principles.map((item) => (
          <article
  key={item.number}
  className="grid gap-3 border-b border-white/10 py-5 last:border-b-0 sm:grid-cols-[64px_1fr] sm:gap-6 sm:py-6 lg:py-7"
>
  <p className="text-[11px] font-medium tracking-[0.18em] text-white/42">
    {item.number}
  </p>

  <div>
    <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white/90 sm:text-lg">
      {item.title}
    </h3>

    <p className="mt-2 max-w-[52ch] text-sm leading-6 text-white/50">
      {item.text}
    </p>
  </div>
</article>
          ))}
        </div>
      </div>
    </section>
  );
}