import type { Metadata } from "next";
import MiniHeaderEn from "../../components/blocks/mini/MiniHeaderEn";
import MiniFooterEn from "../../components/blocks/mini/MiniFooterEn";

export const metadata: Metadata = {
  title: "Privacy — Bauma",
  description:
    "Basic information about the processing of personal data on the Bauma website.",
};

export default function PrivacyPage() {
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
              Privacy
            </h1>

            <p className="mt-6 max-w-[62ch] text-base leading-7 text-white/60">
              This page describes which data may be processed when using the
              Bauma website and how we handle it.
            </p>
          </div>

          <div className="mt-14 space-y-10 text-sm leading-7 text-white/60">
            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                1. Data controller
              </h2>

              <div className="mt-3 space-y-4">
                <p>
                  The controller of personal data is Bauma, Gregor Baumgartner
                  s.p.
                </p>

                <div className="space-y-1">
                  <p>Bauma, Gregor Baumgartner s.p.</p>
                  <p>
                    Registered office: Račica 16A, 1434 Loka pri Zidanem Mostu,
                    Slovenia
                  </p>
                </div>

                <p>
                  For questions about privacy, you can contact us at{" "}
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
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                3. Purpose of processing
              </h2>

              <p className="mt-3">
                Data is used for the operation of the website, understanding
                basic website usage, improving content and responding to your
                messages.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                4. Analytics
              </h2>

              <p className="mt-3">
                The website uses Vercel Web Analytics for basic traffic
                measurement. Analytics help us understand which pages are visited
                and how the website is used at a basic level.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                5. Data retention
              </h2>

              <p className="mt-3">
                Data is kept only for as long as necessary for the purpose for
                which it was collected, or as required to meet legal or business
                obligations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                6. Data sharing
              </h2>

              <p className="mt-3">
                We do not sell personal data. Data may be processed by service
                providers that support website operation, hosting, analytics or
                communication.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                7. Your rights
              </h2>

              <p className="mt-3">
                In relation to personal data, you may request access,
                correction, deletion, restriction of processing or other
                information about data processing. For requests, contact us at{" "}
                <a
                  href="mailto:hello@bauma.si?subject=Povpra%C5%A1evanje%20%E2%80%94%20Bauma"
                  className="text-white underline decoration-white/30 underline-offset-4 transition hover:text-white/70"
                >
                  hello@bauma.si
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                8. Changes to this privacy policy
              </h2>

              <p className="mt-3">
                This privacy policy may be updated from time to time. The updated
                version will be published on this page.
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