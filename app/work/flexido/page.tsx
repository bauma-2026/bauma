import Link from "next/link";

const sections = [
  {
    eyebrow: "Problem",
    title: "Ponudba je bila razpršena.",
    text: "Flexido ponuja več različnih rešitev v proizvodnji. Problem ni bil v tehnologiji — ampak v tem, da uporabnik ni hitro razumel, katera rešitev je prava zanj.",
    points: [
      "uporabnik ni vedel, kje začeti",
      "ni razumel razlike med rešitvami",
      "ni bilo jasnega naslednjega koraka",
    ],
  },
  {
    eyebrow: "Struktura",
    title: "Ponudbo smo razdelili po realnih proizvodnih procesih.",
    text: "Namesto interne logike podjetja smo postavili poti, ki izhajajo iz uporabnikovega problema.",
    points: [
      "CNC avtomatizacija",
      "brizganje plastike",
      "manipulacija materiala",
      "interna logistika",
      "kolaborativni roboti",
    ],
  },
  {
    eyebrow: "Decision flow",
    title: "Uporabnik ne bere več strani — sledi poti.",
    text: "Vsaka rešitev vodi uporabnika skozi isti princip: problem, pristop, primeri uporabe in naslednji korak.",
    points: [
      "kje nastane izguba v procesu",
      "kako se to reši",
      "konkretni primeri uporabe",
      "za koga je rešitev primerna",
    ],
  },
  {
    eyebrow: "Rezultat",
    title: "Flexido ne izgleda več kot seznam storitev.",
    text: "Stran zdaj hitreje pokaže, katera rešitev je primerna, zakaj je pomembna in kaj je naslednji korak.",
    points: [
      "uporabnik hitreje razume ponudbo",
      "lažje prepozna svojo situacijo",
      "jasno vidi naslednji korak",
    ],
  },
];

export default function FlexidoCasePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="max-w-[820px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
              Case / Flexido
            </p>

            <h1 className="mt-4 max-w-[16ch] text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl">
              Kako smo kompleksno industrijsko ponudbo spremenili v jasne poti
              odločanja.
            </h1>

            <p className="mt-6 max-w-[56ch] text-base leading-[1.65] text-white/58">
              Flexido ponuja več rešitev za avtomatizacijo proizvodnje. Naloga
              ni bila samo predstaviti ponudbo, ampak jo strukturirati tako, da
              uporabnik hitro razume, katera pot je prava zanj.
            </p>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Problem", "Razpršena ponudba"],
  ["Sprememba", "Jasne poti odločanja"],
  ["Rezultat", "Jasen naslednji korak"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
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
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
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

      <ScreenshotProof />

      {/* KEY CHANGE */}
      <section className="border-y border-white/10 bg-[#111214]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-[760px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
              Ključna sprememba
            </p>

            <h2 className="mt-4 max-w-[18ch] text-4xl font-semibold leading-[1.03] tracking-[-0.025em] text-white sm:text-5xl">
              Problem ni bil v tem, kaj Flexido ponuja. Problem je bil v tem,
              kako je bilo to predstavljeno.
            </h2>

            <p className="mt-6 max-w-[56ch] text-base leading-[1.65] text-white/56">
              Ko je struktura jasna, uporabnik ne rabi ugibati. Razume problem,
              prepozna pravo rešitev in ve, kaj narediti naprej.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center sm:p-10">
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              Imaš podobno razpršeno ponudbo?
            </h2>

            <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-6 text-white/50">
              Poglejva, kje uporabnik izgublja odločitev in kako lahko ponudbo
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

function ScreenshotProof() {
  return (
    <section className="border-y border-white/10 bg-[#080808]">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-[720px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            Vizualni dokaz
          </p>

          <h2 className="mt-4 max-w-[16ch] text-4xl font-semibold leading-[1.03] tracking-[-0.025em] text-white sm:text-5xl">
            Iz seznama storitev v jasne poti odločanja.
          </h2>

          <p className="mt-5 max-w-[56ch] text-base leading-[1.65] text-white/56">
            Screenshot ni namenjen estetiki. Namenjen je temu, da se vidi
            razlika med razpršeno ponudbo in jasnim sistemom odločanja.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[5fr_7fr]">
          <ScreenshotCard
            label="Pred"
            title="Razpršena ponudba"
            desc="Uporabnik vidi veliko informacij, ampak ne ve hitro, katera pot je prava zanj."
            src="/images/work/flexido-before-3.webp"
            variant="before"
          />

          <ScreenshotCard
            label="Po"
            title="Jasne use-case poti"
            desc="Ponudba je razdeljena po realnih proizvodnih procesih in vodi do naslednjega koraka."
            src="/images/work/flexido-after-3.webp"
            variant="after"
          />
        </div>
      </div>
    </section>
  );
}

function ScreenshotCard({
  label,
  title,
  desc,
  src,
  variant,
}: {
  label: string;
  title: string;
  desc: string;
  src: string;
  variant: "before" | "after";
}) {
  const isAfter = variant === "after";

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div
        className={[
          "relative overflow-hidden border-b border-white/10 bg-black",
          isAfter ? "aspect-[16/9]" : "aspect-[4/3]",
        ].join(" ")}
      >
        <img
          src={src}
          alt={title}
          className={[
            "h-full w-full object-cover opacity-90 transition duration-[3500ms] ease-out group-hover:scale-[1.02] group-hover:opacity-100",
            isAfter ? "object-center" : "object-top",
          ].join(" ")}
        />

        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/65 backdrop-blur">
          {label}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold leading-[1.15] tracking-[-0.01em] text-white">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-white/50">
          {desc}
        </p>
      </div>
    </div>
  );
}