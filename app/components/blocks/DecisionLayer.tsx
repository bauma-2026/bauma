import Container from "../Container";

export default function DecisionLayer() {
  return (
    <section
      id="decision-layer"
      className="border-t border-neutral-200 py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* HEADER */}
        <div className="max-w-[620px]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            Sistem
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
            Bauma Decision Layer
          </h2>

          <p className="mt-5 max-w-[52ch] text-sm leading-6 text-neutral-600">
            Sistem, ki strukturira pot od prvega obiska do jasne odločitve.
          </p>

          <p className="mt-4 text-sm leading-6 text-neutral-500">
            AI pospeši izvedbo. Struktura določi, ali uporabnik sploh pride do odločitve.
          </p>
        </div>

        {/* LAYERS */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              number: "01",
              label: "Razumevanje",
              title: "Context",
              text: "Kaj uporabnik išče, v kakšni situaciji je in kje nastane dvom.",
            },
            {
              number: "02",
              label: "Usmerjanje",
              title: "Flow",
              text: "Informacije razporedimo tako, da ponudbo razume brez zmede.",
            },
            {
              number: "03",
              label: "Odločitev",
              title: "Action",
              text: "Naslednji korak mora biti jasen — kaj narediti in zakaj.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[6px] border border-neutral-200 bg-white p-6"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                {item.number}
              </p>

              <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                {item.label}
              </p>

              <h3 className="mt-2 text-base font-semibold text-neutral-950">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* BOTTOM LINE */}
        <div className="mt-12 max-w-[620px]">
          <p className="text-lg font-medium leading-7 tracking-[-0.02em] text-neutral-950">
            Brez strukture je spletna stran samo vsebina.  
            Z Decision Layerjem postane sistem za odločitve.
          </p>
        </div>
      </div>
    </section>
  );
}