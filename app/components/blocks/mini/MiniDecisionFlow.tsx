type Shape = "square" | "circle" | "triangle";

export type MiniDecisionFlowCopy = {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  body: string;
  principles: readonly {
    number: string;
    label: string;
    shape: Shape;
    text: string;
    active?: boolean;
  }[];
};

const DEFAULT_COPY: MiniDecisionFlowCopy = {
  eyebrow: "Tok odločitve",
  headlineLine1: "Od strukture",
  headlineLine2: "do odločitve.",
  body: "Najprej postavimo smer.",
  principles: [
    {
      number: "01",
      label: "Struktura",
      shape: "square",
      text: "Vsebino uredimo tako, da je takoj jasno, kaj podjetje ponuja in komu.",
    },
    {
      number: "02",
      label: "Jasnost",
      shape: "circle",
      text: "Poudarimo bistveno in odstranimo vse, kar odvrača pozornost.",
    },
    {
      number: "03",
      label: "Kaj sledi",
      shape: "triangle",
      text: "Uporabnika vodimo naprej, da je vedno jasno, kaj sledi.",
      active: true,
    },
  ],
};

export default function MiniDecisionFlow({
  copy = DEFAULT_COPY,
}: {
  copy?: MiniDecisionFlowCopy;
}) {
  return (
    <section
      id="flow"
      className="scroll-mt-13 overflow-hidden border-t border-white/10 bg-[#0a0a0a] py-14 text-white sm:py-20 lg:py-24"
    >
      <div className="mini-page-rail">
        {/* Intro */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            {copy.eyebrow}
          </p>

          <h2 className="home-primary-heading mt-4 max-w-[12ch] sm:max-w-[16ch]">
            {copy.headlineLine1}
            <br />
            {copy.headlineLine2}
          </h2>

          <p className="mt-5 max-w-[48ch] text-base leading-7 text-white/55">
            {copy.body}
          </p>
        </div>

        {/* Open three-part sequence — ruled rows on mobile, hairline columns on desktop */}
        <ol className="mt-10 grid lg:mt-12 lg:grid-cols-3 lg:gap-10">
          {copy.principles.map((principle) => {
            const isActive = principle.active === true || principle.number === "03";

            return (
              <li
                key={principle.number}
                aria-current={isActive ? "step" : undefined}
                className="relative grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 py-6 last:pb-0 sm:grid-cols-[3.5rem_1fr] lg:block lg:py-0 lg:pt-7"
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-1 left-0 h-px w-[1.1rem] ${
                    isActive ? "bg-[rgba(209,164,95,0.7)]" : "bg-white/30"
                  }`}
                />

                <p
                  className={`text-[12px] font-medium uppercase tabular-nums tracking-[0.18em] ${
                    isActive ? "text-[rgba(209,164,95,0.85)]" : "text-white/[0.52]"
                  }`}
                >
                  {principle.number}
                </p>

                <div className="lg:mt-6">
                  <h3 className="text-base font-medium leading-snug tracking-[-0.015em] text-white/92">
                    {principle.label}
                  </h3>

                  <p className="mt-2 max-w-[34ch] text-pretty text-sm leading-[1.6] text-white/55">
                    {principle.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
