import Link from "next/link";

export default function MiniFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] text-white">
      <div className="mini-page-rail grid gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div>
          <Link
            href="/"
            aria-label="Bauma home"
            className="inline-flex items-center opacity-70 transition-opacity duration-200 hover:opacity-100"
          >
            <img
              src="/logo/bauma-logo.svg"
              alt="Bauma"
              width={68}
              height={13}
              className="h-auto w-[68px] invert sm:w-[78px]"
            />
          </Link>

          <p className="mt-3 max-w-[38ch] text-sm leading-6 text-white/55 sm:mt-4">
           Struktura za strani, kjer mora uporabnik hitro razumeti, zaupati in narediti naslednji korak.
          </p>
        </div>

        <div className="lg:justify-self-end">
          <Link
            href="mailto:gregor@bauma.si"
            className="inline-flex whitespace-nowrap text-sm font-medium text-white/65 transition hover:text-white"
          >
            gregor@bauma.si
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mini-page-rail flex flex-col gap-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Bauma</p>

          <nav
            aria-label="Pravne povezave"
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <Link href="/pogoji-uporabe" className="transition hover:text-white">
              Pogoji uporabe
            </Link>

            <Link href="/zasebnost" className="transition hover:text-white">
              Zasebnost
            </Link>

            <Link href="/piskotki" className="transition hover:text-white">
              Piškotki
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
