import Button from "./Button";

export default function HeroPanel() {
  return (
    <section className="relative bg-neutral-950 text-white pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        <div className="max-w-[680px]">

          {/* EYEBROW */}
 
<a
  href="/approach"
  className="group inline-flex rounded-full bg-white/10 p-[1px] transition hover:bg-white/20"
>
  <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-medium tracking-[0.02em] text-white/60 transition group-hover:text-white">
    <span>Jasen prodajni potek</span>
    <span className="text-white/30">→</span>
  </span>
</a>
          {/* H1 */}
          <h1 className="mt-6 max-w-[15ch] font-serif text-5xl font-normal leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl lg:text-[64px]">
            Jasna struktura.
            <br />
            Več odločitev.
          </h1>

          {/* SUB */}
          <p className="mt-5 max-w-[48ch] text-lg leading-8 text-white/70">
            Stran, ki vodi uporabnika brez zmede.
          </p>

          {/* CTA */}
          <div className="mt-9 flex items-center gap-5">
       <Button href="/contact" variant="primary-dark">
  Poglej svoj primer
</Button>

            <a
              href="/approach"
              className="inline-flex items-center gap-1 text-sm text-white/50 transition hover:text-white"
            >
              Kako to deluje
              <span className="text-white/40">→</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}