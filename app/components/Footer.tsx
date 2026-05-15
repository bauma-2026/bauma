import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] text-white">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
         {/* Brand */}
<div>
  <Link
    href="/"
    aria-label="Bauma home"
    className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
  >
    <img
      src="/logo/bauma-logo.svg"
      alt="Bauma"
      className="h-auto w-[78px] invert"
    />
  </Link>

  <p className="mt-3 max-w-[34ch] text-sm leading-6 text-white/50">
    Postavim strukturo, ki uporabnika vodi od razumevanja do
    odločitve.
  </p>
</div>

          {/* Pages */}
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              Pages
            </div>

            <nav className="mt-5 flex flex-col gap-2.5 text-sm">
              <Link
                href="/work"
                className="text-white/50 transition duration-200 hover:text-white"
              >
                Work
              </Link>

              <Link
                href="/approach"
                className="text-white/50 transition duration-200 hover:text-white"
              >
                Pristop
              </Link>

              <Link
                href="/novice"
                className="text-white/50 transition duration-200 hover:text-white"
              >
                Notes
              </Link>

              <Link
                href="/contact"
                className="text-white/50 transition duration-200 hover:text-white"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Closing */}
          <div className="md:justify-self-end">
            <p className="max-w-[34ch] text-sm leading-6 text-white/50">
              Če stran izgleda dobro, uporabnik pa ne naredi naslednjega koraka,
              problem pogosto ni v estetiki.
            </p>

            <Link
              href="/contact"
             className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition duration-200 hover:text-white/70"
            >
              Poglejva, kje se flow ustavi
              <span className="transition duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 text-xs text-white/32 sm:flex-row sm:items-center sm:justify-between">
            <div>© 2026 Bauma</div>
            <div>Built with structure in mind</div>
          </div>
        </div>
      </div>
    </footer>
  );
}