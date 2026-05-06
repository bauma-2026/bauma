import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] text-white">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
          {/* Brand */}
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              Bauma
            </div>

            <p className="mt-4 max-w-[34ch] text-sm leading-6 text-white/55">
              Postavim strukturo, ki uporabnika vodi od razumevanja do
              odločitve.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              Navigate
            </div>

            <nav className="mt-5 flex flex-col gap-2.5 text-sm">
              <Link href="/work" className="text-white/55 transition hover:text-white">
                Work
              </Link>
              <Link href="/approach" className="text-white/55 transition hover:text-white">
                Approach
              </Link>
              <Link href="/novice" className="text-white/55 transition hover:text-white">
                News
              </Link>
              <Link href="/contact" className="text-white/55 transition hover:text-white">
                Contact
              </Link>
            </nav>
          </div>

          {/* Closing */}
          <div className="md:justify-self-end">
            <p className="max-w-[32ch] text-sm leading-6 text-white/55">
              Če stran izgleda dobro, ampak uporabnik ne naredi naslednjega
              koraka, problem ni v estetiki.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-white/70"
            >
              Poglej, kje izgubljaš odločitev
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-5 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between text-xs text-white/35">
  <div>© 2026 Bauma</div>
  <div>Built with structure in mind</div>
</div>
        </div>
      </div>
    </footer>
  );
}