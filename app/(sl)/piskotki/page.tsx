import type { Metadata } from "next";
import Link from "next/link";
import MiniLegalShell from "@/app/components/blocks/mini/MiniLegalShell";

export const metadata: Metadata = {
  title: "Piškotki — Bauma",
  description:
    "Informacije o uporabi piškotkov in podobnih tehnologij na spletnem mestu Bauma.",
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return (
    <MiniLegalShell lang="sl">
<section className="mini-page-rail pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36 [&>*]:max-w-[38rem]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              Pravno
            </p>

            <h1 className="home-primary-heading mt-5 sm:mt-6">
              Piškotki
            </h1>

            <p className="mt-6 text-base leading-[1.65] text-white/70 sm:text-lg sm:leading-[1.7]">
              Ta stran opisuje osnovno uporabo piškotkov in podobnih tehnologij
              na spletnem mestu Bauma.
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-[1.7] text-white/70 [overflow-wrap:anywhere] sm:mt-14">
            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                1. Upravljavec spletnega mesta
              </h2>

              <div className="mt-3 space-y-4">
                <p>
                  Spletno mesto upravlja Bauma, Gregor Baumgartner s.p.
                </p>

                <p>
                  Za vprašanja glede piškotkov lahko pišete na{" "}
                  <a
                    href="mailto:info@bauma.si?subject=Vpra%C5%A1anje%20glede%20pi%C5%A1kotkov"
                    className="rounded-[2px] text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]"
                  >
                    info@bauma.si
                  </a>
                  .
                </p>

                <p>
                  <Link href="/pogoji-uporabe#podatki-podjetja" className="rounded-[2px] text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--mini-accent-text,#fff)]">
                    Podatki podjetja
                  </Link>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                2. Kaj so piškotki
              </h2>
              <p className="mt-3">
                Piškotki so majhne datoteke, ki jih spletna mesta lahko shranijo
                v brskalnik uporabnika. Uporabljajo se lahko za tehnično
                delovanje strani, nastavitve, analitiko ali druge funkcije.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                4. Analitika
              </h2>
              <p className="mt-3">
                Analitika se uporablja za razumevanje osnovnega obiska spletnega
                mesta, kot so število ogledov strani, obiskane strani, naprave
                in približna lokacija na ravni države.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
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
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">
                6. Spremembe uporabe piškotkov
              </h2>
              <p className="mt-3">
                Če se način uporabe piškotkov ali podobnih tehnologij spremeni,
                bo ta stran ustrezno posodobljena.
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