import Image from "next/image";

type Case = {
  title: string;
  problem: string;
  approach: string;
  result: string;
  href: string;
};

const featured: Case = {
  title: "Flexido",
  problem:
    "Ponudba je bila razpršena in uporabnik ni hitro razumel, katera rešitev je prava zanj.",
  approach:
    "Ponudbo smo razdelili v jasne use-case poti in odstranili odvečne informacije.",
  result:
    "Stran hitreje pokaže, za koga je rešitev primerna in kaj je naslednji korak.",
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
        <div className="max-w-[680px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
            Work
          </p>

          <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl">
            Primeri, kjer struktura vodi do odločitve
          </h2>

          <p className="mt-5 max-w-[54ch] text-base leading-7 text-white/60">
            Vsak projekt ima isti cilj: odstraniti zmedo, urediti pot in
            uporabnika pripeljati do naslednjega koraka.
          </p>
        </div>

        <a
          href={featured.href}
          className="group mt-14 block rounded-2xl border border-white/10 bg-[#111214] p-6 transition hover:border-white/20 sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                Featured proof
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                {featured.title}
              </h3>

              <div className="mt-7 space-y-5">
                <ProofLine label="Problem" text={featured.problem} />
                <ProofLine label="Struktura" text={featured.approach} />
                <ProofLine label="Rezultat" text={featured.result} />
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white">
                Poglej primer
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-[#141414]">
              <Image
                src="/images/work/flexido-preview-1.webp"
                alt="Flexido primer"
                fill
                className="object-cover object-[30%_center] transition duration-500 group-hover:scale-[1.02]"
                sizes="(min-width: 1024px) 560px, 100vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-90" />
            </div>
          </div>
        </a>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {cases.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group block rounded-2xl border border-white/10 bg-[#111214] p-6 transition hover:border-white/20"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                Case proof
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                {c.title}
              </h3>

              <div className="mt-5 space-y-3 text-sm leading-6 text-white/55">
                <p>
                  <span className="font-medium text-white/85">Problem — </span>
                  {c.problem}
                </p>
                <p>
                  <span className="font-medium text-white/85">Rezultat — </span>
                  {c.result}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm font-medium text-white">
                  Poglej primer
                </span>
                <span className="text-white/40 transition group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            Poglej vse projekte
            <span>→</span>
          </a>
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
      <p className="mt-1 text-sm leading-6 text-white/65">{text}</p>
    </div>
  );
}