export default function MiniFinalCTAEn() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] px-6 py-20 text-white shadow-[0_24px_80px_rgba(182,138,76,0.035)] sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-[720px] rounded-[32px] border border-white/10 bg-white/[0.025] px-6 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#B68A4C]/75">
            Next step
          </p>

          <h2 className="mt-5 text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.045em]">
            Contact
          </h2>

          <p className="mx-auto mt-6 max-w-[56ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            Send a link, an idea or a short description of the problem. We can
            look at where the biggest uncertainty is and which step makes the
            most sense to fix first.
          </p>

          <div className="mt-8">
            <a
              href="mailto:hello@bauma.si"
              className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:-translate-y-[1px] hover:bg-white/90 active:translate-y-0"
            >
              <span className="inline-flex items-center gap-2">
                Let’s look together
                <span className="transition duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </a>
          </div>

          <p className="mt-5 text-sm leading-6 text-white/38">
            No pressure · just one clear first step
          </p>
        </div>
      </div>
    </section>
  );
}