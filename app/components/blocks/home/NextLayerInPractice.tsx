import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Razume problem",
    text: "Kaj je to in zakaj je pomembno.",
  },
  {
    number: "02",
    title: "Preveri, ali je zanj",
    text: "Hitro prepozna, ali rešuje njegov primer.",
  },
  {
    number: "03",
    title: "Razume, kako deluje",
    text: "Koraki brez preskokov in zmede.",
  },
  {
    number: "04",
    title: "Odloči se",
    text: "Naslednji korak je jasen.",
  },
];

export default function NextLayerInPractice() {
  return (
    <section
      id="practice"
      className="border-t border-white/10 bg-neutral-900 py-20 text-white sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* LEFT */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              Next Layer v praksi
            </p>

            <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Kako stran vodi do odločitve
            </h2>

            <p className="mt-5 max-w-[44ch] text-base leading-7 text-white/70">
              Uporabnik ne išče informacij. Stran ga vodi — layer za layerjem,
              brez preskokov in nepotrebne zmede.
            </p>

            <div className="mt-10 space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-[11px] font-medium text-white/50">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-base font-medium tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 max-w-[38ch] text-sm leading-6 text-white/60">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 max-w-[44ch] border-t border-white/10 pt-6 text-sm leading-6 text-white/50">
              Namesto da uporabnik razmišlja, mu stran pove, kaj mora vedeti —
              v pravem vrstnem redu.
            </p>
          </div>

       {/* RIGHT */}
<div className="lg:pt-10">
  <a
    href="/work/odstrani-tattoo"
    className="group block overflow-hidden rounded-[6px] border border-white/10 bg-white/[0.04] transition hover:border-white/20 hover:bg-white/[0.06]"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-800">
      <Image
        src="/images/work/odstrani-tattoo-hero-1.webp"
        alt="Odstrani Tattoo primer strani"
        fill
        className="object-cover object-[20%_center]"
        sizes="(min-width: 1024px) 520px, 100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

      
    </div>

    <div className="p-6 sm:p-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
        Primer
      </p>

      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
        Odstrani Tattoo
      </h3>

      <p className="mt-3 max-w-[46ch] text-sm leading-6 text-white/60">
        Uporabnik v 60 sekundah razume, ali je to zanj.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white">
        Poglej primer
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </div>
  </a>
</div>
        </div>
      </div>
    </section>
  );
}