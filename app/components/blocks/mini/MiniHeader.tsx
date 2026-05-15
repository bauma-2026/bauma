import Link from "next/link";

export default function MiniHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808] text-white">
      <div className="mx-auto flex h-[52px] max-w-[1100px] items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Bauma home"
          className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
        >
          <img
            src="/logo/bauma-logo.svg"
            alt="Bauma"
            className="h-auto w-[68px] invert sm:w-[78px]"
          />
        </Link>

        <Link
          href="mailto:hello@bauma.si"
          className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-medium text-black transition hover:bg-white/90 sm:px-4 sm:py-1.5 sm:text-xs"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}