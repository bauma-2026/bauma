import type { Metadata } from "next";
import MiniLegalShell from "@/app/components/blocks/mini/MiniLegalShell";

export const metadata: Metadata = {
  title: "Zasebnost — Bauma",
  description:
    "Osnovne informacije o obdelavi osebnih podatkov na spletnem mestu Bauma.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <MiniLegalShell lang="sl">
<section className="mini-page-rail pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36 [&>*]:max-w-[38rem]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              Pravno
            </p>

            <h1 className="home-primary-heading mt-5 sm:mt-6">
              Zasebnost
            </h1>

            <p className="mt-6 text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
              Ta stran opisuje, katere podatke lahko obdelujemo ob uporabi
              spletnega mesta Bauma in kako z njimi ravnamo.
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-[1.7] text-white/70 [overflow-wrap:anywhere] sm:mt-14">
            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                1. Upravljavec podatkov
              </h2>

              <div className="mt-3 space-y-4">
                <p>
                  Upravljavec osebnih podatkov je Bauma, Gregor Baumgartner s.p.
                </p>

                <div className="space-y-1">
                  <p>
                    Sedež: Račica 16A, 1434 Loka pri Zidanem Mostu, Slovenija
                  </p>
                </div>

                <p>
                  Za vprašanja glede zasebnosti lahko pišete na{" "}
                  <a
                    href="mailto:info@bauma.si?subject=Vpra%C5%A1anje%20glede%20zasebnosti"
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                3. Namen obdelave
              </h2>
              <p className="mt-3">
                Podatke uporabljamo za delovanje spletnega mesta, razumevanje
                osnovne uporabe strani, izboljševanje vsebine in odziv na vaša
                sporočila.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                4. Analitika
              </h2>
              <p className="mt-3">
                Spletno mesto uporablja Vercel Web Analytics za osnovno merjenje
                obiska strani. Analitika pomaga razumeti, katere strani so
                obiskane in kako se spletno mesto uporablja na osnovni ravni.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                5. Hramba podatkov
              </h2>
              <p className="mt-3">
                Podatke hranimo le toliko časa, kot je potrebno za namen, zaradi
                katerega so bili zbrani, oziroma kolikor je potrebno za
                izpolnitev zakonskih ali poslovnih obveznosti.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                6. Posredovanje podatkov
              </h2>
              <p className="mt-3">
                Osebnih podatkov ne prodajamo. Podatki se lahko obdelujejo pri
                ponudnikih storitev, ki omogočajo delovanje spletnega mesta,
                gostovanje, analitiko ali komunikacijo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                7. Vaše pravice
              </h2>
              <p className="mt-3">
                V zvezi z osebnimi podatki lahko zahtevate dostop, popravek,
                izbris, omejitev obdelave ali druge informacije glede obdelave
                podatkov. Za zahteve pišite na{" "}
                <a
                  href="mailto:info@bauma.si?subject=Vpra%C5%A1anje%20glede%20zasebnosti"
                  className="rounded-[2px] text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]"
                >
                  info@bauma.si
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                8. Spremembe politike zasebnosti
              </h2>
              <p className="mt-3">
                Politika zasebnosti se lahko občasno posodobi. Posodobljena
                različica bo objavljena na tej strani.
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