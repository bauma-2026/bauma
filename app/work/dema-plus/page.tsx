import Link from "next/link";

const sections = [
  {
    eyebrow: "Problem",
    title: "Predstavitev ni dovolj hitro zgradila zaupanja.",
    text: "Dema Plus je imel reference in realne projekte, ampak stran uporabniku ni dovolj hitro pokazala, kaj podjetje dela, zakaj mu lahko zaupa in kateri projekti so pomembni.",
    points: [
      "uporabnik je moral sam sestavljati kontekst",
      "reference niso imele dovolj jasne vloge",
      "ponudba ni bila predstavljena dovolj direktno",
    ],
  },
  {
    eyebrow: "Struktura",
    title: "Najprej jasna ponudba, potem dokaz.",
    text: "Stran je bila postavljena tako, da uporabnik najprej razume podjetje, nato vidi projekte in šele potem dobi jasen razlog za kontakt.",
    points: [
      "jasnejši hero z direktno predstavitvijo",
      "reference kot dokaz zaupanja",
      "bolj pregleden flow skozi stran",
      "manj šuma med pomembnimi informacijami",
    ],
  },
  {
    eyebrow: "Reference flow",
    title: "Projekti niso samo galerija.",
    text: "Reference morajo uporabniku pomagati razumeti izkušnje, področje dela in resnost podjetja. Zato niso samo vizualni dodatek, ampak del zaupanja.",
    points: [
      "projekti dobijo bolj jasno hierarhijo",
      "uporabnik hitreje razume obseg dela",
      "reference podpirajo odločitev",
      "stran deluje bolj kredibilno",
    ],
  },
  {
    eyebrow: "Rezultat",
    title: "Podjetje je predstavljeno bolj jasno in direktno.",
    text: "Uporabnik hitreje razume, s čim se podjetje ukvarja, zakaj so reference pomembne in kaj je naslednji korak.",
    points: [
      "hitrejše razumevanje ponudbe",
      "več zaupanja skozi reference",
      "jasnejša pot do kontakta",
    ],
  },
];

export default function DemaPlusCasePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="max-w-[820px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Case / Dema Plus
            </p>

            <h1 className="mt-4 max-w-[16ch] text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl">
              Kako smo predstavitev podjetja naredili bolj jasno in direktno.
            </h1>

            <p className="mt-6 max-w-[56ch] text-base leading-[1.65] text-white/58">
              Dema Plus je imel realne projekte in reference. Naloga ni bila
              samo polepšati strani, ampak jo strukturirati tako, da uporabnik
              hitreje razume podjetje, ponudbo in razlog za zaupanje.
            </p>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Problem", "Nejasen kontekst"],
              ["Sprememba", "Jasnejša predstavitev"],
              ["Rezultat", "Več zaupanja"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                  {label}
                </p>

                <p className="mt-3 text-lg font-semibold leading-[1.15] tracking-[-0.01em] text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-6">
            {sections.map((section) => (
              <article
                key={section.eyebrow}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:p-10"
              >
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                      {section.eyebrow}
                    </p>

                    <h2 className="mt-4 max-w-[15ch] text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl">
                      {section.title}
                    </h2>
                  </div>

                  <div>
                    <p className="max-w-[58ch] text-base leading-[1.65] text-white/56">
                      {section.text}
                    </p>

                    <ul className="mt-6 grid gap-3">
                      {section.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm leading-6 text-white/52"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ReferenceProofPlaceholder />

      {/* KEY CHANGE */}
      <section className="border-y border-white/10 bg-[#111214]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-[760px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Ključna sprememba
            </p>

            <h2 className="mt-4 max-w-[18ch] text-4xl font-semibold leading-[1.03] tracking-[-0.025em] text-white sm:text-5xl">
              Problem ni bil v tem, da podjetje nima dokazov. Problem je bil v
              tem, da dokazi niso dovolj hitro ustvarili konteksta.
            </h2>

            <p className="mt-6 max-w-[56ch] text-base leading-[1.65] text-white/56">
              Ko so ponudba, projekti in reference postavljeni v jasen flow,
              uporabnik hitreje razume podjetje in lažje zaupa naslednjemu
              koraku.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center sm:p-10">
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              Imaš reference, ki še ne gradijo dovolj zaupanja?
            </h2>

            <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-6 text-white/50">
              Poglejva, kje uporabnik izgubi kontekst in kako lahko predstavitev
              podjetja postavimo bolj jasno.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-white bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Poglejva primer →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReferenceProofPlaceholder() {
  return (
    <section className="border-y border-white/10 bg-[#080808]">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-[720px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
            Reference layer
          </p>

          <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold leading-[1.03] tracking-[-0.025em] text-white sm:text-5xl">
            Reference morajo pomagati uporabniku razumeti podjetje.
          </h2>

          <p className="mt-5 max-w-[56ch] text-base leading-[1.65] text-white/56">
            Pri predstavitveni strani reference niso samo seznam projektov.
            Njihova naloga je, da uporabniku hitro pokažejo izkušnje, resnost in
            širino dela.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <ProofPlaceholderCard
            label="Pred"
            title="Uporabnik vidi projekte"
            desc="Projekti obstajajo, ampak uporabnik mora sam razumeti, kaj pomenijo in zakaj so pomembni."
          />

          <ProofPlaceholderCard
            label="Po"
            title="Reference gradijo zaupanje"
            desc="Ko imajo reference jasno vlogo v flowu, pomagajo uporabniku hitreje razumeti podjetje."
          />
        </div>
      </div>
    </section>
  );
}

function ProofPlaceholderCard({
  label,
  title,
  desc,
}: {
  label: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <h3 className="mt-4 text-xl font-semibold leading-[1.15] tracking-[-0.01em] text-white">
        {title}
      </h3>

      <p className="mt-3 max-w-[46ch] text-sm leading-6 text-white/50">
        {desc}
      </p>
    </div>
  );
}