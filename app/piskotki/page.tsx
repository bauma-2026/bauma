import type { Metadata } from "next";
import MiniHeader from "../components/blocks/mini/MiniHeader";
import MiniFooter from "../components/blocks/mini/MiniFooter";

export const metadata: Metadata = {
  title: "Piškotki — Bauma",
  description:
    "Informacije o uporabi piškotkov in podobnih tehnologij na spletnem mestu Bauma.",
};

export default function CookiesPage() {
  return (
    <>
  <MiniHeader />

<main className="bg-[#080808] text-white">
<section className="mx-auto max-w-[860px] px-6 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:px-8 lg:pt-24 lg:pb-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
              Legal
            </p>

            <h1 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Piškotki
            </h1>

            <p className="mt-6 max-w-[62ch] text-base leading-7 text-white/60">
              Ta stran opisuje osnovno uporabo piškotkov in podobnih tehnologij
              na spletnem mestu Bauma.
            </p>
          </div>

          <div className="mt-14 space-y-10 text-sm leading-7 text-white/60">
            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                1. Upravljavec spletnega mesta
              </h2>

              <div className="mt-3 space-y-4">
                <p>
                  Spletno mesto upravlja Bauma, Gregor Baumgartner s.p.
                </p>

                <div className="space-y-1">
                  <p>Bauma, Gregor Baumgartner s.p.</p>
                  <p>
                    Sedež: Račica 16A, 1434 Loka pri Zidanem Mostu, Slovenija
                  </p>
                </div>

                <p>
                  Za vprašanja glede piškotkov lahko pišete na{" "}
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
                2. Kaj so piškotki
              </h2>
              <p className="mt-3">
                Piškotki so majhne datoteke, ki jih spletna mesta lahko shranijo
                v brskalnik uporabnika. Uporabljajo se lahko za tehnično
                delovanje strani, nastavitve, analitiko ali druge funkcije.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                3. Katere piškotke uporablja spletno mesto
              </h2>
              <p className="mt-3">
                Spletno mesto Bauma trenutno uporablja osnovne tehnologije,
                potrebne za delovanje strani, in Vercel Web Analytics za osnovno
                merjenje obiska.
              </p>
              <p className="mt-3">
                Ne uporabljamo oglaševalskih piškotkov ali kompleksnega
                marketinškega sledenja.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                4. Analitika
              </h2>
              <p className="mt-3">
                Analitika se uporablja za razumevanje osnovnega obiska spletnega
                mesta, kot so število ogledov strani, obiskane strani, naprave
                in približna lokacija na ravni države.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                5. Upravljanje piškotkov
              </h2>
              <p className="mt-3">
                Piškotke lahko upravljate ali izbrišete v nastavitvah svojega
                brskalnika. Večina brskalnikov omogoča blokiranje ali izbris
                piškotkov, vendar lahko to vpliva na delovanje posameznih
                spletnih mest.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                6. Spremembe uporabe piškotkov
              </h2>
              <p className="mt-3">
                Če se način uporabe piškotkov ali podobnih tehnologij spremeni,
                bo ta stran ustrezno posodobljena.
              </p>
            </section>
          </div>

          <p className="mt-14 border-t border-white/10 pt-6 text-xs leading-6 text-white/35">
            Zadnja posodobitev: maj 2026
          </p>
        </section>
      </main>

      <MiniFooter />
    </>
  );
}