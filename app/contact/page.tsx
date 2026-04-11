import Container from "../components/Container";
import Section from "../components/Section";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <Container className="pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
      <Section className="!mt-0">
    <div className="max-w-[720px]">
      <p className="text-meta">Kontakt</p>

      <h1 className="mt-3 text-h1 text-neutral-950">
        Povej na kratko, kaj potrebuješ.
      </h1>

      <p className="mt-4 max-w-[56ch] text-body text-neutral-600">
        Pošlji kratek opis in odgovorim s predlogom naslednjega koraka.
      </p>
    </div>

    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,560px)_1fr]">
      
      {/* LEFT — FORM */}
      <div>
        <form className="space-y-6">
          
          <div className="grid gap-5 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Ime"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </div>

          <textarea
            rows={7}
            placeholder="Na kratko opiši, kaj ponujate, kaj trenutno ne deluje in kaj želite izboljšati..."
            className="min-h-[180px] w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
          />

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Pošlji povpraševanje
            </button>
          </div>

          <p className="text-xs text-neutral-500">
            Ni treba, da je opis popoln — dovolj je kratek kontekst.
          </p>
        </form>
      </div>

      <div className="flex flex-col gap-4 pt-2">
  <p className="text-sm text-neutral-500">
    Če je lažje, lahko pišeš tudi direktno:
  </p>

  <a
    href="mailto:gregor@bauma.si"
    className="text-sm font-medium text-neutral-900 underline underline-offset-4 decoration-neutral-300 transition hover:decoration-neutral-900"
  >
    gregor@bauma.si
  </a>

  <p className="text-xs text-neutral-500">
    Odgovorim v kratkem z naslednjim korakom.
  </p>
</div>
      
    </div>
  </Section>
</Container>
  );
}