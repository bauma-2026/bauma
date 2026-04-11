import Button from "./Button";
import HeroAmbient from "./HeroAmbient";
import { site } from "../../lib/content";

export default function HeroPanel() {
  return (
<section className="relative bg-white pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16">
  <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,620px)_1fr] lg:gap-16">
      
      {/* LEFT CONTENT */}
      <div className="max-w-[620px]">
        <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          Za podjetja, ki želijo več povpraševanj
        </p>

        <h1 className="mt-6 max-w-[14ch] text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-950 sm:text-6xl lg:text-[64px]">
          Postavim strukturo,
          <br />
          ki uporabnika vodi
          <br />
          do odločitve.
        </h1>

        <p className="mt-6 max-w-[52ch] text-lg leading-8 text-neutral-600">
          Jasna struktura strani, ki odstrani dvome, poveča zaupanje
          in vodi do povpraševanja.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="/contact">
            Stopi v stik
          </Button>

          <Button href="/work" variant="secondary">
            Poglej kako to deluje
          </Button>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="hidden lg:flex justify-end">
        <div className="w-full max-w-[360px] rounded-[24px] border border-neutral-200/70 bg-neutral-50 p-6">
          
          <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
            Struktura
          </div>

          <div className="mt-5 space-y-4 text-sm text-neutral-700">
            
            <div className="border-t border-neutral-200 pt-4">
              <div className="font-medium text-neutral-900">
                01 — Kontekst
              </div>
              <div className="mt-1.5 text-neutral-600">
                Kaj uporabnik išče in kje nastane dvom.
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="font-medium text-neutral-900">
                02 — Potek
              </div>
              <div className="mt-1.5 text-neutral-600">
                Kako pride do odgovora — brez zmede.
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="font-medium text-neutral-900">
                03 — Naslednji korak
              </div>
              <div className="mt-1.5 text-neutral-600">
                Kaj naredi naprej in zakaj.
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</section>
  );
}