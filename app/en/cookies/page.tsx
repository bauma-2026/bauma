import type { Metadata } from "next";
import MiniHeaderEn from "../../components/blocks/mini/MiniHeaderEn";
import MiniFooterEn from "../../components/blocks/mini/MiniFooterEn";

export const metadata: Metadata = {
  title: "Cookies — Bauma",
  description:
    "Information about the use of cookies and similar technologies on the Bauma website.",
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return (
    <>
      <MiniHeaderEn />

      <main className="bg-[#080808] text-white">
        <section className="mx-auto max-w-[860px] px-6 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:px-8 lg:pt-24 lg:pb-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
              Legal
            </p>

            <h1 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Cookies
            </h1>

            <p className="mt-6 max-w-[62ch] text-base leading-7 text-white/60">
              This page describes the basic use of cookies and similar
              technologies on the Bauma website.
            </p>
          </div>

          <div className="mt-14 space-y-10 text-sm leading-7 text-white/60">
            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                1. Website operator
              </h2>

              <div className="mt-3 space-y-4">
                <p>
                  The website is operated by Bauma, Gregor Baumgartner s.p.
                </p>

                <div className="space-y-1">
                  <p>Bauma, Gregor Baumgartner s.p.</p>
                  <p>
                    Registered office: Račica 16A, 1434 Loka pri Zidanem Mostu,
                    Slovenia
                  </p>
                </div>

                <p>
                  For questions about cookies, you can contact us at{" "}
                  <a
                    href="mailto:hello@bauma.si?subject=Povpra%C5%A1evanje%20%E2%80%94%20Bauma"
                    className="text-white underline decoration-white/30 underline-offset-4 transition hover:text-white/70"
                  >
                    hello@bauma.si
                  </a>
                  .
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                2. What cookies are
              </h2>

              <p className="mt-3">
                Cookies are small files that websites can store in a user&apos;s
                browser. They may be used for technical operation, settings,
                analytics or other website functions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
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
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                4. Analytics
              </h2>

              <p className="mt-3">
                Analytics are used to understand basic website traffic, such as
                the number of page views, visited pages, devices and approximate
                location at country level.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                5. Managing cookies
              </h2>

              <p className="mt-3">
                You can manage or delete cookies in your browser settings. Most
                browsers allow blocking or deleting cookies, but this may affect
                how individual websites function.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                6. Changes to cookie use
              </h2>

              <p className="mt-3">
                If the way cookies or similar technologies are used changes,
                this page will be updated accordingly.
              </p>
            </section>
          </div>

          <p className="mt-14 border-t border-white/10 pt-6 text-xs leading-6 text-white/35">
            Last updated: May 2026
          </p>
        </section>
      </main>

      <MiniFooterEn />
    </>
  );
}