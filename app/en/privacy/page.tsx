import type { Metadata } from "next";
import MiniLegalShell from "../../components/blocks/mini/MiniLegalShell";

export const metadata: Metadata = {
  title: "Privacy — Bauma",
  description:
    "Basic information about the processing of personal data on the Bauma website.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <MiniLegalShell lang="en">
        <section className="mini-page-rail pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36 [&>*]:max-w-[38rem]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              Legal
            </p>

            <h1 className="home-primary-heading mt-5 sm:mt-6">
              Privacy
            </h1>

            <p className="mt-6 text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
              This page describes which data may be processed when using the
              Bauma website and how we handle it.
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-[1.7] text-white/70 [overflow-wrap:anywhere] sm:mt-14">
            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                1. Data controller
              </h2>

              <div className="mt-3 space-y-4">
                <p>
                  The controller of personal data is Bauma, Gregor Baumgartner
                  s.p.
                </p>

                <div className="space-y-1">
                  <p>
                    Registered office: Račica 16A, 1434 Loka pri Zidanem Mostu,
                    Slovenia
                  </p>
                </div>

                <p>
                  For questions about privacy, you can contact us at{" "}
                  <a
                    href="mailto:info@bauma.si?subject=Privacy%20enquiry"
                    className="rounded-[2px] text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]"
                  >
                    info@bauma.si
                  </a>
                  .
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                2. What data may be processed
              </h2>

              <p className="mt-3">
                When visiting the website, basic technical data may be processed,
                such as information about the device, browser, visited pages,
                approximate location at country level and time of visit.
              </p>

              <p className="mt-3">
                If you contact us by email, we may process your name, email
                address and the content of your message.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                3. Purpose of processing
              </h2>

              <p className="mt-3">
                Data is used for the operation of the website, understanding
                basic website usage, improving content and responding to your
                messages.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                4. Analytics
              </h2>

              <p className="mt-3">
                The website uses Vercel Web Analytics for basic traffic
                measurement. Analytics help us understand which pages are visited
                and how the website is used at a basic level.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                5. Data retention
              </h2>

              <p className="mt-3">
                Data is kept only for as long as necessary for the purpose for
                which it was collected, or as required to meet legal or business
                obligations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                6. Data sharing
              </h2>

              <p className="mt-3">
                We do not sell personal data. Data may be processed by service
                providers that support website operation, hosting, analytics or
                communication.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                7. Your rights
              </h2>

              <p className="mt-3">
                In relation to personal data, you may request access,
                correction, deletion, restriction of processing or other
                information about data processing. For requests, contact us at{" "}
                <a
                  href="mailto:info@bauma.si?subject=Privacy%20enquiry"
                  className="rounded-[2px] text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]"
                >
                  info@bauma.si
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                8. Changes to this privacy policy
              </h2>

              <p className="mt-3">
                This privacy policy may be updated from time to time. The updated
                version will be published on this page.
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