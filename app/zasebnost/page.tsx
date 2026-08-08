import type { Metadata } from "next";
import MiniHeader from "../components/blocks/mini/MiniHeader";
import MiniFooter from "../components/blocks/mini/MiniFooter";

export const metadata: Metadata = {
  title: "Zasebnost — Bauma",
  description:
    "Osnovne informacije o obdelavi osebnih podatkov na spletnem mestu Bauma.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <>
<MiniHeader />

  <main className="bg-[#080808] text-white">
<section className="mx-auto max-w-[860px] px-6 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:px-8 lg:pt-24 lg:pb-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
              Pravno
            </p>

            <h1 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Zasebnost
            </h1>

            <p className="mt-6 max-w-[62ch] text-base leading-7 text-white/60">
              Ta stran opisuje, katere podatke lahko obdelujemo ob uporabi
              spletnega mesta Bauma in kako z njimi ravnamo.
            </p>
          </div>

          <div className="mt-14 space-y-10 text-sm leading-7 text-white/60">
            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                1. Upravljavec podatkov
              </h2>

              <div className="mt-3 space-y-4">
                <p>
                  Upravljavec osebnih podatkov je Bauma, Gregor Baumgartner s.p.
                </p>

                <div className="space-y-1">
                  <p>Bauma, Gregor Baumgartner s.p.</p>
                  <p>
                    Sedež: Račica 16A, 1434 Loka pri Zidanem Mostu, Slovenija
                  </p>
                </div>

                <p>
                  Za vprašanja glede zasebnosti lahko pišete na{" "}
                  <a
                    href="mailto:gregor@bauma.si?subject=Povpra%C5%A1evanje%20za%20projekt"
                    className="text-white underline decoration-white/30 underline-offset-4 transition hover:text-white/70"
                  >
                    gregor@bauma.si
                  </a>
                  .
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                2. Katere podatke lahko obdelujemo
              </h2>

              <p className="mt-3">
                Ob obisku spletnega mesta se lahko obdelujejo osnovni tehnični
                podatki, kot so podatki o napravi, brskalniku, obiskanih
                straneh, približni lokaciji na ravni države in času obiska.
              </p>

              <p className="mt-3">
                Če nas kontaktirate po elektronski pošti, lahko obdelujemo vaše
                ime, e-poštni naslov in vsebino sporočila.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                3. Namen obdelave
              </h2>
              <p className="mt-3">
                Podatke uporabljamo za delovanje spletnega mesta, razumevanje
                osnovne uporabe strani, izboljševanje vsebine in odziv na vaša
                sporočila.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                4. Analitika
              </h2>
              <p className="mt-3">
                Spletno mesto uporablja Vercel Web Analytics za osnovno merjenje
                obiska strani. Analitika pomaga razumeti, katere strani so
                obiskane in kako se spletno mesto uporablja na osnovni ravni.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                5. Hramba podatkov
              </h2>
              <p className="mt-3">
                Podatke hranimo le toliko časa, kot je potrebno za namen, zaradi
                katerega so bili zbrani, oziroma kolikor je potrebno za
                izpolnitev zakonskih ali poslovnih obveznosti.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                6. Posredovanje podatkov
              </h2>
              <p className="mt-3">
                Osebnih podatkov ne prodajamo. Podatki se lahko obdelujejo pri
                ponudnikih storitev, ki omogočajo delovanje spletnega mesta,
                gostovanje, analitiko ali komunikacijo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                7. Vaše pravice
              </h2>
              <p className="mt-3">
                V zvezi z osebnimi podatki lahko zahtevate dostop, popravek,
                izbris, omejitev obdelave ali druge informacije glede obdelave
                podatkov. Za zahteve pišite na{" "}
                <a
                  href="mailto:gregor@bauma.si?subject=Povpra%C5%A1evanje%20za%20projekt"
                  className="text-white underline decoration-white/30 underline-offset-4 transition hover:text-white/70"
                >
                  gregor@bauma.si
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                8. Spremembe politike zasebnosti
              </h2>
              <p className="mt-3">
                Politika zasebnosti se lahko občasno posodobi. Posodobljena
                različica bo objavljena na tej strani.
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