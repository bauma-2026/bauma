export default function StructureSection() {
  return (
    <section className="border-t border-neutral-200/70 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-16 lg:items-start">
          
          {/* LEFT — HEADER */}
          <div className="max-w-[520px]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
              Pristop
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-[0.96] tracking-[-0.02em] text-neutral-950 sm:text-4xl lg:text-[44px]">
              Kako to deluje
            </h2>

            <p className="mt-4 text-neutral-700">
              Uporabnika vodimo od vprašanja do jasnega naslednjega koraka — brez zmede in brez odvečnega šuma.
            </p>
          </div>

          {/* RIGHT — CARD */}
          <div className="w-full max-w-[420px]">
            <div className="rounded-[6px] border border-neutral-200/70 bg-neutral-50 p-6">

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