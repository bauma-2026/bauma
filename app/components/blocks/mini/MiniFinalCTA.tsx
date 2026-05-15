export default function MiniFinalCTA() {
  return (
    <section className="border-t border-white/10 bg-[#080808] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[720px] px-6 text-center lg:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
          Naslednji korak
        </p>

        <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-4xl">
          Kje se uporabnik ustavi?
        </h2>

        <p className="mx-auto mt-5 max-w-[42ch] text-sm leading-6 text-white/58 sm:text-base sm:leading-[1.65]">
          Če stran izgleda dobro, uporabnik pa ne naredi naslednjega koraka,
          lahko začnemo pri strukturi.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-9">
          <a
            href="mailto:hello@bauma.si"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:-translate-y-[1px] hover:bg-white/90 active:translate-y-0"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Poglejva, kje se flow ustavi
              <span className="transition duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>

            <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="absolute inset-x-6 top-0 h-px bg-black/20" />
            </span>
          </a>

          <p className="text-xs leading-5 text-white/45">
            Brez pritiska · samo jasen prvi korak
          </p>
        </div>
      </div>
    </section>
  );
}