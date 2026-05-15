import Container from "../components/Container";
import Section from "../components/Section";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-[#080808] text-white">
      <Container className="pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <Section className="!mt-0" withDivider={false}>
          <div className="max-w-[720px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Kontakt
            </p>

  <h1 className="mt-4 max-w-[13ch] text-[48px] font-semibold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl">
  Poglejva, kje se flow ustavi.
</h1>

<p className="mt-5 max-w-[48ch] text-base leading-[1.65] text-white/58">
  Pošlji kratek kontekst. Odgovorim z jasnim naslednjim korakom.
</p>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,620px)_1fr] lg:gap-16">
            {/* LEFT — FORM */}
            <form className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Ime"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-white/35 focus:border-white/30 focus:bg-white/[0.06]"
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-white/35 focus:border-white/30 focus:bg-white/[0.06]"
                />
              </div>

              <textarea
                rows={7}
                placeholder="Na kratko opiši projekt, težavo ali naslednji korak..."
                className="min-h-[190px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-white/35 focus:border-white/30 focus:bg-white/[0.06]"
              />

              <div className="pt-2">
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center rounded-full border border-white bg-white px-6 py-3.5 text-sm font-medium text-black transition duration-300 hover:-translate-y-[1px] hover:bg-white/90 active:translate-y-0"
                >
                  <span className="inline-flex items-center gap-2">
                    Pošlji kratek opis
                    <span className="transition duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </button>
              </div>

              <p className="text-xs leading-5 text-white/38">
                Ni treba, da je opis popoln — dovolj je kratek kontekst.
              </p>
            </form>

            {/* RIGHT */}
            <div className="lg:pt-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <p className="text-sm leading-6 text-white/52">
                  Če je lažje, lahko pišeš tudi direktno:
                </p>

                <a
                  href="mailto:gregor@bauma.si"
                  className="mt-4 inline-flex text-sm font-medium text-white underline decoration-white/25 underline-offset-4 transition duration-200 hover:decoration-white"
                >
                  gregor@bauma.si
                </a>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="text-sm leading-6 text-white/48">
                    Odgovorim hitro — z jasnim naslednjim korakom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </Container>
    </section>
  );
}