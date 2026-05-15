import Button from "./Button";
import NextLayerHeroVisual from "./blocks/hero/NextLayerHeroVisual";

export default function HeroPanel() {
  return (
    <section className="relative bg-neutral-950 pb-14 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-28 lg:pt-40">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20">
          {/* LEFT */}
          <div className="max-w-none">
            {/* EYEBROW */}
            <a
              href="/approach"
              className="group inline-flex rounded-full bg-white/10 p-[1px] transition duration-200 hover:bg-white/20"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-medium tracking-[0.02em] text-white/60 transition duration-200 group-hover:text-white">
                <span>Structure-first approach</span>
                <span className="text-white/30 transition duration-200 group-hover:text-white/60">
                  →
                </span>
              </span>
            </a>

            {/* HEADING */}
            <h1 className="mt-6 max-w-[18ch] font-serif text-[54px] font-normal leading-[0.95] tracking-[-0.035em] text-white sm:text-6xl lg:text-[72px]">
              Jasna struktura.
              <span className="block">Več odločitev.</span>
            </h1>

            {/* SUB */}
            <p className="mt-6 max-w-[46ch] text-lg leading-8 text-white/68 sm:text-xl sm:leading-8 lg:text-lg">
              Kompleksne ponudbe spremenim v jasne poti odločanja.
            </p>

            {/* CTA */}
            <div className="mt-9">
              <Button href="#flow" variant="primary-dark">
                Kako nastane jasna pot
              </Button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:block lg:translate-x-[-12px] lg:pt-8">
            <div className="opacity-80 transition duration-300 hover:opacity-95">
              <NextLayerHeroVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}