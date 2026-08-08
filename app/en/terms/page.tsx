import type { Metadata } from "next";
import MiniHeaderEn from "../../components/blocks/mini/MiniHeaderEn";
import MiniFooterEn from "../../components/blocks/mini/MiniFooterEn";

export const metadata: Metadata = {
  title: "Terms of Use — Bauma",
  description: "Basic terms of use for the Bauma website.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
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
              Terms of Use
            </h1>

            <p className="mt-6 max-w-[62ch] text-base leading-7 text-white/60">
              These terms describe the basic rules for using the Bauma website.
              By using this website, you agree to use it in a way that is
              consistent with its purpose, content and applicable law.
            </p>
          </div>

          <div className="mt-14 space-y-10 text-sm leading-7 text-white/60">
            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                1. Website operator
              </h2>

              <div className="mt-3 space-y-4">
                <p>The website is operated by Bauma, Gregor Baumgartner s.p.</p>

                <div className="space-y-1">
                  <p>Bauma, Gregor Baumgartner s.p.</p>
                  <p>
                    Registered office: Račica 16A, 1434 Loka pri Zidanem Mostu,
                    Slovenia
                  </p>
                </div>

                <div className="space-y-1">
                  <p>Tax number: 29320348</p>
                  <p>Registration number: 8207283000</p>
                  <p>VAT liable: No</p>
                </div>

                <p>
                  The purpose of the website is to present Bauma&apos;s
                  approach, services and way of working in the field of digital
                  structure, websites and digital systems.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                2. Use of content
              </h2>

              <p className="mt-3">
                The content on this website is intended to inform and present
                the work of Bauma. Texts, visual elements, page structure and
                other parts of the content are protected and may not be copied,
                distributed or used without prior permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                3. Accuracy of information
              </h2>

              <p className="mt-3">
                Bauma strives to keep the information on this website clear,
                up to date and correct. However, we do not guarantee that all
                information is always complete, free of errors or suitable for
                every individual use case.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                4. External links
              </h2>

              <p className="mt-3">
                This website may contain links to external websites. We are not
                responsible for the content, operation or privacy policies of
                external websites.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                5. Limitation of liability
              </h2>

              <p className="mt-3">
                Use of this website is at your own risk. Bauma is not liable for
                any damage that may arise from the use of the website, website
                unavailability or reliance on information published on the
                website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                6. Changes to the terms
              </h2>

              <p className="mt-3">
                These terms of use may be updated from time to time. The updated
                version will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                7. Contact
              </h2>

              <p className="mt-3">
                For questions regarding these terms of use, you can contact us
                at{" "}
                <a
                  href="mailto:hello@bauma.si?subject=Povpra%C5%A1evanje%20%E2%80%94%20Bauma"
                  className="text-white underline decoration-white/30 underline-offset-4 transition hover:text-white/70"
                >
                  hello@bauma.si
                </a>
                .
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