import Link from "next/link";

export default function MiniFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] text-white">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-14 sm:py-16 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-8">
        <div>
          <Link
            href="/mini"
            aria-label="Bauma home"
            className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            <img
              src="/logo/bauma-logo.svg"
              alt="Bauma"
              className="h-auto w-[68px] invert sm:w-[78px]"
            />
          </Link>

          <p className="mt-5 max-w-[34ch] text-sm leading-6 text-white/45 sm:mt-6">
            Postavim strukturo, ki uporabnika vodi od razumevanja do odločitve.
          </p>
        </div>

        <div className="lg:justify-self-end">
          <p className="max-w-[40ch] text-sm leading-6 text-white/45">
            Bauma začne pri strukturi: kaj mora uporabnik razumeti, čemu mora
            zaupati in kateri korak mora biti očiten.
          </p>

          <Link
            href="mailto:hello@bauma.si"
            className="mt-5 inline-flex text-sm font-medium text-white transition hover:text-white/70 sm:mt-6"
          >
            Poglejva, kje se flow ustavi →
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-6 py-5 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 Bauma</p>
          <p>Built with structure in mind</p>
        </div>
      </div>
    </footer>
  );
}