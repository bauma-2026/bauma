export default function FinalCTA() {
  return (
    <section className="border-t border-white/10 bg-[#080808] py-20 text-white sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[720px] px-6 text-center lg:px-8">
        <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl">
          Kje izgubljaš odločitev?
        </h2>

        <p className="mt-4 text-base leading-7 text-white/60">
          V nekaj minutah vidiš, kje uporabnik zastane — in kaj ga ustavi.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href="/contact"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:-translate-y-[1px] hover:bg-white/90"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Poglej svoj primer
              <span className="transition duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>

            <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="absolute inset-x-6 top-0 h-px bg-black/20" />
            </span>
          </a>

          <p className="text-xs text-white/40">
            Brez obveznosti · hiter pregled
          </p>
        </div>
      </div>
    </section>
  );
}