export default function MiniFinalCTAEn() {
  return (
    <section
      id="contact"
      className="scroll-mt-13 border-t border-white/10 bg-[#080808] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[720px] px-6 text-center lg:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
          Next step
        </p>

        <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-4xl">
          Where does the user stop?
        </h2>

        <p className="mx-auto mt-5 max-w-[42ch] text-sm leading-6 text-white/58 sm:text-base sm:leading-[1.65]">
          If the page looks good but the user does not take the next step, we
          can start with the structure.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-9">
          <a
            href="mailto:hello@bauma.si?subject=Povpra%C5%A1evanje%20%E2%80%94%20Bauma"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:-translate-y-[1px] hover:bg-white/90 active:translate-y-0"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Let&apos;s find where the flow stops
              <span className="transition duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>

            <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="absolute inset-x-6 top-0 h-px bg-black/20" />
            </span>
          </a>

          <p className="text-xs leading-5 text-white/60">
            No pressure · just a clear first step
          </p>
        </div>
      </div>
    </section>
  );
}