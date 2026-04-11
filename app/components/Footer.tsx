import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-white">
      {/* TOP */}
      <div className="mx-auto w-full max-w-[1120px] px-5 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              Bauma
            </div>

            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-white/60">
              Postavim strukturo, ki jasno pove, kaj ponudba pomeni in kam naprej.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              Navigate
            </div>

            <div className="mt-5 flex flex-col gap-2.5 text-sm">
              <Link
                href="/work"
                className="text-white/60 transition-colors hover:text-white"
              >
                Work
              </Link>
              <Link
                href="/approach"
                className="text-white/60 transition-colors hover:text-white"
              >
                Approach
              </Link>
              <Link
                href="/novice"
                className="text-white/60 transition-colors hover:text-white"
              >
                News
              </Link>
              <Link
                href="/contact"
                className="text-white/60 transition-colors hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Quick brief */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="text-sm font-semibold tracking-tight text-white">
              Quick brief
            </div>

            <p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-white/60">
              Pošlji cilj, rok in link do obstoječega — odgovorim hitro.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-white bg-white px-5 text-sm font-medium tracking-tight text-black transition-all duration-200 ease-out hover:-translate-y-[1px] hover:opacity-90 active:translate-y-0"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <div>© 2026 Bauma</div>
            <div>Gregor Baumgartner s.p.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}