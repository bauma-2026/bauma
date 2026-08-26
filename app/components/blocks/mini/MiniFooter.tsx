import Link from "next/link";

export type MiniFooterCopy = {
  homeHref: string;
  tagline: string;
  email: string;
  legalAria: string;
  legal: readonly { href: string; label: string }[];
};

const DEFAULT_COPY: MiniFooterCopy = {
  homeHref: "/",
  tagline:
    "Struktura za strani, kjer mora uporabnik hitro razumeti, zaupati in narediti naslednji korak.",
  email: "gregor@bauma.si",
  legalAria: "Pravne povezave",
  legal: [
    { href: "/pogoji-uporabe", label: "Pogoji uporabe" },
    { href: "/zasebnost", label: "Zasebnost" },
    { href: "/piskotki", label: "Piškotki" },
  ],
};

export function MiniFooterBrand({
  copy = DEFAULT_COPY,
}: {
  copy?: MiniFooterCopy;
}) {
  return (
    <div className="mini-page-rail grid gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div>
        <Link
          href={copy.homeHref}
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
          {copy.tagline}
        </p>
      </div>

      <div className="lg:justify-self-end">
        <Link
          href={`mailto:${copy.email}`}
          className="inline-flex whitespace-nowrap text-sm font-medium text-white/65 transition hover:text-white"
        >
          {copy.email}
        </Link>
      </div>
    </div>
  );
}

export function MiniFooterLegal({
  copy = DEFAULT_COPY,
}: {
  copy?: MiniFooterCopy;
}) {
  return (
    <div className="border-t border-white/10">
      <div className="mini-page-rail flex flex-col gap-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Bauma</p>

        <nav
          aria-label={copy.legalAria}
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          {copy.legal.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function MiniFooter({
  copy = DEFAULT_COPY,
}: {
  copy?: MiniFooterCopy;
}) {
  return (
    <footer className="border-t border-white/10 bg-[#080808] text-white">
      <MiniFooterBrand copy={copy} />
      <MiniFooterLegal copy={copy} />
    </footer>
  );
}
