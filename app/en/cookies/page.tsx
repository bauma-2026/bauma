import type { Metadata } from "next";
import Link from "next/link";
import MiniLegalShell from "../../components/blocks/mini/MiniLegalShell";

export const metadata: Metadata = {
  title: "Cookies — Bauma",
  description:
    "Information about the use of cookies and similar technologies on the Bauma website.",
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return (
    <MiniLegalShell lang="en">
        <section className="mini-page-rail pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36 [&>*]:max-w-[38rem]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              Legal
            </p>

            <h1 className="home-primary-heading mt-5 sm:mt-6">
              Cookies
            </h1>

            <p className="mt-6 text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
              This page describes the basic use of cookies and similar
              technologies on the Bauma website.
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-[1.7] text-white/70 [overflow-wrap:anywhere] sm:mt-14">
            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                1. Website operator
              </h2>

              <div className="mt-3 space-y-4">
                <p>
                  The website is operated by Bauma, Gregor Baumgartner s.p.
                </p>

                <p>
                  For questions about cookies, you can contact us at{" "}
                  <a
                    href="mailto:info@bauma.si?subject=Cookie%20enquiry"
                    className="rounded-[2px] text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]"
                  >
                    info@bauma.si
                  </a>
                  .
                </p>

                <p>
                  <Link href="/en/terms#company-details" className="rounded-[2px] text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]">
                    Company details
                  </Link>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                2. What cookies are
              </h2>

              <p className="mt-3">
                Cookies are small files that websites can store in a user&apos;s
                browser. They may be used for technical operation, settings,
                analytics or other website functions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                3. Which cookies this website uses
              </h2>

              <p className="mt-3">
                The Bauma website currently uses basic technologies required for
                the website to function, and Vercel Web Analytics for basic
                traffic measurement.
              </p>

              <p className="mt-3">
                We do not use advertising cookies or complex marketing tracking.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                4. Analytics
              </h2>

              <p className="mt-3">
                Analytics are used to understand basic website traffic, such as
                the number of page views, visited pages, devices and approximate
                location at country level.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                5. Managing cookies
              </h2>

              <p className="mt-3">
                You can manage or delete cookies in your browser settings. Most
                browsers allow blocking or deleting cookies, but this may affect
                how individual websites function.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                6. Changes to cookie use
              </h2>

              <p className="mt-3">
                If the way cookies or similar technologies are used changes,
                this page will be updated accordingly.
              </p>
            </section>
          </div>

          <p className="mt-14 border-t border-white/10 pt-6 text-sm leading-6 text-white/50">
            Last updated: May 2026
          </p>
        </section>
      </MiniLegalShell>
  );
}