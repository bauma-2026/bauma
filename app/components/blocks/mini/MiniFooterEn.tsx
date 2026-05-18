import Link from "next/link";

export default function MiniFooterEn() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] text-white">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-14 sm:py-16 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-8">
        <div>
          <Link
            href="/en"
            aria-label="Bauma home"
            className="inline-flex items-center opacity-70 transition-opacity duration-200 hover:opacity-100"
          >
            <img
              src="/logo/bauma-logo.svg"
              alt="Bauma"
              className="h-auto w-[68px] invert sm:w-[78px]"
            />
          </Link>

          <p className="mt-3 max-w-[38ch] text-sm leading-6 text-white/50 sm:mt-4">
            Structure for websites where users need to understand quickly,
            build trust and take the next step.
          </p>
        </div>

        <div className="lg:justify-self-end">
          <h4 className="text-sm font-semibold tracking-[-0.015em] text-white">
            Let&apos;s start with a clear question
          </h4>

          <p className="mt-3 max-w-[42ch] text-sm leading-6 text-white/50">
            Send a link, an idea or a short description of the problem. We can
            look at where the flow becomes unclear and which step makes the most
            sense to structure first.
          </p>

          <Link
            href="mailto:hello@bauma.si?subject=Povpra%C5%A1evanje%20%E2%80%94%20Bauma"
            className="mt-5 inline-flex text-sm font-medium text-white transition hover:text-white/70 sm:mt-6"
          >
            hello@bauma.si
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-6 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 Bauma</p>

          <nav
            aria-label="Legal links"
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <Link
              href="/en/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/en/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/en/cookies"
              className="transition hover:text-white"
            >
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}