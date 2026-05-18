import type { Metadata } from "next";
import MiniHeader from "../components/blocks/mini/MiniHeader";
import MiniFooter from "../components/blocks/mini/MiniFooter";

export const metadata: Metadata = {
  title: "Pogoji uporabe — Bauma",
  description: "Osnovni pogoji uporabe spletnega mesta Bauma.",
};

export default function TermsPage() {
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
              Pogoji uporabe
            </h1>

            <p className="mt-6 max-w-[62ch] text-base leading-7 text-white/60">
              Ti pogoji opisujejo osnovna pravila uporabe spletnega mesta Bauma.
              Z uporabo spletnega mesta se strinjate z uporabo strani na način,
              ki je skladen z njenim namenom, vsebino in veljavno zakonodajo.
            </p>
          </div>

          <div className="mt-14 space-y-10 text-sm leading-7 text-white/60">
            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                1. Upravljavec spletnega mesta
              </h2>

              <div className="mt-3 space-y-4">
                <p>Spletno mesto upravlja Bauma, Gregor Baumgartner s.p.</p>

                <div className="space-y-1">
                  <p>Bauma, Gregor Baumgartner s.p.</p>
                  <p>
                    Sedež: Račica 16A, 1434 Loka pri Zidanem Mostu, Slovenija
                  </p>
                </div>

                <div className="space-y-1">
                  <p>Davčna številka: 29320348</p>
                  <p>Matična številka: 8207283000</p>
                  <p>Zavezanec za DDV: Ne</p>
                </div>

                <p>
                  Namen spletnega mesta je predstavitev pristopa, storitev in
                  načina dela na področju digitalne strukture, spletnih strani in
                  digitalnih sistemov.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                2. Uporaba vsebine
              </h2>
              <p className="mt-3">
                Vsebina na spletni strani je namenjena informiranju in
                predstavitvi dela Bauma. Besedila, vizualni elementi, struktura
                strani in drugi deli vsebine so zaščiteni in jih ni dovoljeno
                kopirati, razširjati ali uporabljati brez predhodnega dovoljenja.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                3. Točnost informacij
              </h2>
              <p className="mt-3">
                Bauma si prizadeva, da so informacije na spletni strani jasne,
                aktualne in pravilne. Kljub temu ne jamčimo, da so vse
                informacije vedno popolne, brez napak ali primerne za vsak
                posamezen primer uporabe.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                4. Zunanje povezave
              </h2>
              <p className="mt-3">
                Spletna stran lahko vsebuje povezave do zunanjih spletnih mest.
                Za vsebino, delovanje ali politike zasebnosti zunanjih strani ne
                odgovarjamo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                5. Omejitev odgovornosti
              </h2>
              <p className="mt-3">
                Uporaba spletnega mesta je na lastno odgovornost. Bauma ne
                odgovarja za morebitno škodo, ki bi nastala zaradi uporabe
                strani, nedostopnosti strani ali zanašanja na informacije,
                objavljene na strani.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                6. Spremembe pogojev
              </h2>
              <p className="mt-3">
                Pogoji uporabe se lahko občasno posodobijo. Posodobljena
                različica bo objavljena na tej strani.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                7. Kontakt
              </h2>
              <p className="mt-3">
                Za vprašanja v zvezi s pogoji uporabe lahko pišete na{" "}
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
            Zadnja posodobitev: maj 2026
          </p>
        </section>
      </main>

      <MiniFooter />
    </>
  );
}