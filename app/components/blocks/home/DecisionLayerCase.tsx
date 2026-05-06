import Image from "next/image";

export default function DecisionLayerCase() {
  return (
    <section className="border-t border-neutral-200 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* HEADER */}
        <div className="max-w-[620px]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            Primer
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
            Decision Layer v praksi
          </h2>

          <p className="mt-5 max-w-[52ch] text-sm leading-6 text-neutral-600">
            Odstrani Tattoo — kako struktura vodi uporabnika od prvega
            vprašanja do odločitve.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {/* CONTEXT */}
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                01 — Context
              </p>

              <h3 className="mt-4 text-lg font-semibold text-neutral-950">
                Kaj uporabnik razume takoj
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Uporabnik pride z vprašanjem: “Ali lahko odstranim tattoo?”
                Hero takoj postavi realna pričakovanja in jasno pokaže, kaj je
                možno — brez napačnih obljub.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-neutral-200">
              <Image
                src="/case/odstrani/context-800x600-1.jpg"
                alt="Odstrani Tattoo — hero"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-3 left-3 rounded bg-black/85 px-2 py-1 text-[11px] text-white">
                Hero — prvi stik
              </div>
            </div>
          </div>

          {/* FLOW */}
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 relative aspect-[4/3] overflow-hidden rounded-[6px] border border-neutral-200">
              <Image
                src="/case/odstrani/flow-800x600-2.jpg"
                alt="Odstrani Tattoo — proces"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-3 left-3 rounded bg-black/85 px-2 py-1 text-[11px] text-white">
                Proces — razlaga
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                02 — Flow
              </p>

              <h3 className="mt-4 text-lg font-semibold text-neutral-950">
                Kako ga stran vodi
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Stran vodi uporabnika skozi proces: kako deluje, koliko časa
                traja in kaj lahko pričakuje. Vsak korak odstrani en dvom.
              </p>
            </div>
          </div>

          {/* ACTION */}
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                03 — Action
              </p>

              <h3 className="mt-4 text-lg font-semibold text-neutral-950">
                Kje se zgodi odločitev
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Ko uporabnik razume proces in pričakovanja, je naslednji korak
                jasen: preveri svoj primer in pošlje povpraševanje.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-neutral-200">
              <Image
                src="/case/odstrani/action-800x600-1.jpg"
                alt="Odstrani Tattoo — CTA"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-3 left-3 rounded bg-black/85 px-2 py-1 text-[11px] text-white">
                CTA — odločitev
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 max-w-[620px]">
          <p className="text-lg font-medium leading-7 tracking-[-0.02em] text-neutral-950">
            Stran ne prodaja storitve. Stran vodi uporabnika do odločitve.
          </p>
        </div>
      </div>
    </section>
  );
}