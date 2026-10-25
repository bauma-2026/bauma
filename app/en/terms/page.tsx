import type { Metadata } from "next";
import MiniLegalShell from "../../components/blocks/mini/MiniLegalShell";

export const metadata: Metadata = {
  title: "Terms of Use — Bauma",
  description: "Basic terms of use for the Bauma website.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <MiniLegalShell lang="en">
        <section className="mini-page-rail pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36 [&>*]:max-w-[38rem]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              Legal
            </p>

            <h1 className="home-primary-heading mt-5 sm:mt-6">
              Terms of Use
            </h1>

            <p className="mt-6 text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
              These terms describe the basic rules for using the Bauma website.
              By using this website, you agree to use it in a way that is
              consistent with its purpose, content and applicable law.
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-[1.7] text-white/70 [overflow-wrap:anywhere] sm:mt-14">
            <section id="company-details" className="scroll-mt-20">
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                1. Website operator
              </h2>

              <div className="mt-3 space-y-4">
                <p>The website is operated by Bauma, Gregor Baumgartner s.p.</p>

                <div className="space-y-1">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                4. External links
              </h2>

              <p className="mt-3">
                This website may contain links to external websites. We are not
                responsible for the content, operation or privacy policies of
                external websites.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                6. Changes to the terms
              </h2>

              <p className="mt-3">
                These terms of use may be updated from time to time. The updated
                version will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                7. Contact
              </h2>

              <p className="mt-3">
                For questions regarding these terms of use, you can contact us
                at{" "}
                <a
                  href="mailto:info@bauma.si?subject=Question%20about%20terms%20of%20use"
                  className="rounded-[2px] text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]"
                >
                  info@bauma.si
                </a>
                .
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