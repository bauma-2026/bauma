import Image from "next/image";

type Case = {
  title: string;
  problem: string;
  approach: string;
  result: string;
  href: string;
};

const featured: Case = {
  title: "Kompleksno ponudbo smo spremenili v jasne poti odločanja",
  problem:
    "Ponudba je bila razpršena. Uporabnik ni hitro razumel, katera rešitev je prava zanj.",
  approach:
    "Ponudbo smo razdelili v jasne use-case poti. Odstranili smo odvečne informacije.",
  result:
    "Stran hitreje pokaže pravo rešitev in jasen naslednji korak.",
  href: "/work/flexido",
};

const cases: Case[] = [
  {
    title: "Odstrani Tattoo",
    problem:
      "Uporabnik ni vedel, ali je odstranitev sploh možna in koliko časa traja.",
    approach:
      "Flow vodi od vprašanja do razlage postopka in realnih pričakovanj.",
    result: "Uporabnik v nekaj minutah razume, ali je to zanj.",
    href: "/work/odstrani-tattoo",
  },
  {
    title: "Dema Plus",
    problem:
      "Projekti niso bili jasno predstavljeni, uporabnik je izgubil kontekst.",
    approach:
      "Struktura projektov z jasnim poudarkom na vrednosti in rezultatu.",
    result: "Uporabnik hitreje razume reference in pridobi zaupanje.",
    href: "/work/dema-plus",
  },
];

export default function WorkProof() {
  return (
   <section className="border-t border-[#1d1d1e] bg-[#080808] py-20 text-white sm:py-24 lg:py-28">
  <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      {/* INTRO */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
          Work
        </p>

        <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl">
          Primeri, kjer struktura vodi do odločitve
        </h2>

        <p className="mt-5 max-w-[42ch] text-base leading-7 text-white/60">
          Ne gre za lepši izgled. Gre za to, da uporabnik hitreje razume, kaj je
          zanj relevantno in kaj je naslednji korak.
        </p>
      </div>

      {/* PROOF LIST */}
      <div className="space-y-4">
        <a
          href={featured.href}
          className="group block rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-white/20 hover:bg-white/[0.05] sm:p-7"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                Featured case
              </p>

              <h3 className="mt-3 max-w-[20ch] text-2xl font-semibold leading-[1.08] tracking-[-0.03em] text-white">
                {featured.title}
              </h3>
            </div>

            <span className="hidden text-sm text-white/35 transition group-hover:translate-x-1 group-hover:text-white sm:block">
              →
            </span>
          </div>

          <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/30">
                Pred tem
              </p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Razpršena ponudba.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/30">
                Sprememba
              </p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Jasne poti odločanja.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/30">
                Po tem
              </p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Jasen naslednji korak.
              </p>
            </div>
          </div>

          <div className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white">
            Kako smo poenostavili ponudbo
            <span className="transition group-hover:translate-x-1">→</span>
          </div>
        </a>

        {cases.map((c) => (
          <a
            key={c.title}
            href={c.href}
            className="group block rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/30">
                  Case
                </p>

                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                  {c.title}
                </h3>

                <p className="mt-3 max-w-[52ch] text-sm leading-6 text-white/55">
                  {c.result}
                </p>
              </div>

              <span className="text-white/35 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </div>
          </a>
        ))}

        <div className="pt-4">
          <a
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            Poglej vse projekte
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}

function ProofLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-l border-white/10 pl-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <p className="mt-1 max-w-[42ch] text-sm leading-6 text-white/65">
        {text}
      </p>
    </div>
  );
}