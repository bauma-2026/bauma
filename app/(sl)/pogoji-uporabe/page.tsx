import type { Metadata } from "next";
import MiniLegalShell from "@/app/components/blocks/mini/MiniLegalShell";

export const metadata: Metadata = {
  title: "Pogoji uporabe — Bauma",
  description: "Osnovni pogoji uporabe spletnega mesta Bauma.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <MiniLegalShell lang="sl">
<section className="mini-page-rail pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36 [&>*]:max-w-[38rem]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              Pravno
            </p>

            <h1 className="home-primary-heading mt-5 sm:mt-6">
              Pogoji uporabe
            </h1>

            <p className="mt-6 text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
              Ti pogoji opisujejo osnovna pravila uporabe spletnega mesta Bauma.
              Z uporabo spletnega mesta se strinjate z uporabo strani na način,
              ki je skladen z njenim namenom, vsebino in veljavno zakonodajo.
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-[1.7] text-white/70 [overflow-wrap:anywhere] sm:mt-14">
            <section id="podatki-podjetja" className="scroll-mt-20">
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                1. Upravljavec spletnega mesta
              </h2>

              <div className="mt-3 space-y-4">
                <p>Spletno mesto upravlja Bauma, Gregor Baumgartner s.p.</p>

                <div className="space-y-1">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                4. Zunanje povezave
              </h2>
              <p className="mt-3">
                Spletna stran lahko vsebuje povezave do zunanjih spletnih mest.
                Za vsebino, delovanje ali politike zasebnosti zunanjih strani ne
                odgovarjamo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                6. Spremembe pogojev
              </h2>
              <p className="mt-3">
                Pogoji uporabe se lahko občasno posodobijo. Posodobljena
                različica bo objavljena na tej strani.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                7. Kontakt
              </h2>
              <p className="mt-3">
                Za vprašanja v zvezi s pogoji uporabe lahko pišete na{" "}
                <a
                  href="mailto:info@bauma.si?subject=Vpra%C5%A1anje%20glede%20pogojev%20uporabe"
                  className="rounded-[2px] text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]"
                >
                  info@bauma.si
                </a>
                .
              </p>
            </section>
          </div>

          <p className="mt-14 border-t border-white/10 pt-6 text-sm leading-6 text-white/50">
            Zadnja posodobitev: maj 2026
          </p>
        </section>
      </MiniLegalShell>
  );
}