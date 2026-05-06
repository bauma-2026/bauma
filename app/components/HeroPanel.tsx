import Button from "./Button";
import NextLayerHeroVisual from "./blocks/hero/NextLayerHeroVisual";

export default function HeroPanel() {
  return (
    <section className="relative bg-neutral-950 text-white pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
<div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-28">
          
          {/* LEFT */}
          <div className="max-w-none">
            {/* EYEBROW */}
            <a
              href="/approach"
              className="group inline-flex rounded-full bg-white/10 p-[1px] transition hover:bg-white/20"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-medium tracking-[0.02em] text-white/60 transition group-hover:text-white">
                <span>Next Layer</span>
                <span className="text-white/30">→</span>
              </span>
            </a>
<h1 className="mt-6 max-w-[18ch] font-serif text-5xl font-normal leading-[0.96] tracking-[-0.03em] text-white sm:text-6xl lg:text-[64px]">
  Če uporabnik razmišlja,
  <span className="block">ne odloči.</span>
</h1>

            {/* SUB */}
            <p className="mt-6 max-w-[48ch] text-lg leading-8 text-white/70">
            Večina strani izgleda dobro.
Redke vodijo do naslednjega koraka.
            </p>

            {/* CTA */}
            <div className="mt-10 flex items-center gap-5">
              <Button href="#flow" variant="primary-dark">
                Poglej Decision Flow
              </Button>

              <a
                href="/work"
                className="inline-flex items-center gap-1 text-sm text-white/50 transition hover:text-white"
              >
                Poglej primere
                <span className="text-white/40">→</span>
              </a>
            </div>
          </div>

          {/* RIGHT */}
 <div className="hidden justify-self-end lg:block lg:mt-8 opacity-70 hover:opacity-90 transition">
  <NextLayerHeroVisual />
</div>

        </div>
      </div>
    </section>
  );
}