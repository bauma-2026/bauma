import Link from "next/link";

const sections = [
  {
    eyebrow: "Problem",
    title: "Uporabnik pride z dvomom.",
    text: "Pri odstranjevanju tattooja uporabnik pogosto ne ve, ali je odstranitev sploh možna, koliko postopkov bo potrebnih in kaj lahko realno pričakuje.",
    points: [
      "ne ve, ali je njegov primer primeren",
      "ne razume razlike med obljubo in realnim rezultatom",
      "hitro lahko izgubi zaupanje, če je komunikacija preveč prodajna",
    ],
  },
  {
    eyebrow: "Struktura",
    title: "Stran najprej razloži, potem vodi.",
    text: "Namesto agresivnega prodajnega pristopa je stran postavljena kot miren decision flow: uporabnik najprej razume postopek, pričakovanja in naslednji korak.",
    points: [
      "kaj odstranjevanje tattooja sploh pomeni",
      "kako poteka postopek",
      "kaj vpliva na število terapij",
      "kdaj je posvet smiseln",
    ],
  },
  {
    eyebrow: "Trust flow",
    title: "Zaupanje nastane pred kontaktom.",
    text: "Pri takšni storitvi uporabnik ne klikne samo zaradi lepega dizajna. Najprej mora dobiti občutek, da so informacije realne, jasne in brez pretiranih obljub.",
    points: [
      "realna pričakovanja",
      "jasna razlaga postopka",
      "miren ton brez hypea",
      "dokazi in rezultati tam, kjer odstranijo dvom",
    ],
  },
  {
    eyebrow: "Rezultat",
    title: "Kontakt postane naraven naslednji korak.",
    text: "Ko uporabnik razume postopek in svoj primer, kontakt ni več pritisk. Postane logičen korak za preverjanje možnosti.",
    points: [
      "uporabnik hitreje razume, ali je to zanj",
      "manj je dvoma okoli postopka",
      "posvet ima jasen razlog",
    ],
  },
];

export default function OdstraniTattooCasePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="max-w-[820px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Case / Odstrani Tattoo
            </p>

            <h1 className="mt-4 max-w-[16ch] text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl">
              Kako smo občutljivo storitev spremenili v jasen decision flow.
            </h1>

            <p className="mt-6 max-w-[56ch] text-base leading-[1.65] text-white/58">
              Odstranjevanje tattooja ni impulzivna odločitev. Uporabnik mora
              najprej razumeti, ali je postopek primeren zanj, kaj lahko
              pričakuje in kateri naslednji korak je smiseln.
            </p>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Problem", "Veliko dvoma"],
              ["Sprememba", "Jasna pričakovanja"],
              ["Rezultat", "Naraven posvet"],
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

      <TrustProofPlaceholder />

      {/* KEY CHANGE */}
      <section className="border-y border-white/10 bg-[#111214]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-[760px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Ključna sprememba
            </p>

            <h2 className="mt-4 max-w-[18ch] text-4xl font-semibold leading-[1.03] tracking-[-0.025em] text-white sm:text-5xl">
              Problem ni bil samo v tem, kaj storitev ponuja. Problem je bil v
              tem, koliko dvoma mora uporabnik premagati.
            </h2>

            <p className="mt-6 max-w-[56ch] text-base leading-[1.65] text-white/56">
              Ko je pot jasna, uporabnik ne rabi ugibati. Razume postopek,
              realna pričakovanja in zakaj je posvet smiseln naslednji korak.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center sm:p-10">
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              Imaš storitev, kjer mora uporabnik najprej zaupati?
            </h2>

            <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-6 text-white/50">
              Poglejva, kje uporabnik izgublja zaupanje in kako lahko stran
              postavimo v jasnejši flow.
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

function TrustProofPlaceholder() {
  return (
    <section className="border-y border-white/10 bg-[#080808]">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-[720px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
            Trust layer
          </p>

          <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold leading-[1.03] tracking-[-0.025em] text-white sm:text-5xl">
            Pri takšni storitvi dokaz odstrani dvom.
          </h2>

          <p className="mt-5 max-w-[56ch] text-base leading-[1.65] text-white/56">
            Pred in po prikazi, realna pričakovanja in jasna razlaga postopka
            bodo kasneje dodatno okrepili zaupanje. Za V1 je pomembno, da je
            struktura pripravljena za ta dokaz.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <ProofPlaceholderCard
            label="Pred"
            title="Uporabnik ima dvom"
            desc="Preden se odloči za posvet, mora razumeti, ali je njegov primer sploh primeren."
          />

          <ProofPlaceholderCard
            label="Po"
            title="Odločitev ima kontekst"
            desc="Ko so postopek, pričakovanja in dokazi jasni, posvet postane naraven naslednji korak."
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