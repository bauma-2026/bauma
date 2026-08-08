const principles = [
  {
    number: "01",
    label: "Struktura",
    shape: "square",
    text: "Uporabnik hitro razume, kaj podjetje ponuja, komu je namenjeno in kje začeti.",
  },
  {
    number: "02",
    label: "Jasnost",
    shape: "circle",
    text: "Ključne informacije postanejo bolj opazne, odločitev pa zahteva manj napora.",
  },
  {
    number: "03",
    label: "Naslednji korak",
    shape: "triangle",
    text: "Uporabnik ves čas ve, kaj naj pogleda, preveri ali naredi naslednje.",
  },
] as const;

type Shape = "square" | "circle" | "triangle";

function ShapeIcon({ shape }: { shape: Shape }) {
  if (shape === "square") {
    return (
      <div className="decision-flow-shape h-[25px] w-[25px] rotate-[8deg] border border-current text-white/[0.19]" />
    );
  }

  if (shape === "circle") {
    return (
      <div className="decision-flow-shape h-[28px] w-[28px] rounded-full border border-current text-white/[0.16]" />
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="decision-flow-shape h-[35px] w-[35px] translate-y-px text-white/20"
      aria-hidden="true"
    >
      <polygon
        points="24,7 42,39 6,39"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function MiniDecisionFlow() {
  return (
    <section
      id="flow"
      className="scroll-mt-13 overflow-hidden border-t border-white/10 bg-[#0a0a0a] py-14 text-white sm:py-20 lg:py-24"
    >
      <div className="mini-page-rail">
        <style>{`
          .decision-flow-card {
            transition: border-color 240ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .decision-flow-number,
          .decision-flow-shape {
            transition: color 240ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          @media (hover: hover) {
            .decision-flow-card:hover {
              border-color: rgba(209, 164, 95, 0.2);
            }

            .decision-flow-card:hover .decision-flow-number {
              color: rgba(209, 164, 95, 0.8);
            }

            .decision-flow-card:hover .decision-flow-shape {
              color: rgba(209, 164, 95, 0.76);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .decision-flow-card,
            .decision-flow-number,
            .decision-flow-shape {
              transition-duration: 0ms;
            }
          }
        `}</style>
        {/* Intro */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end lg:gap-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              Tok odločitve
            </p>

            <h2 className="home-primary-heading mt-4 max-w-[12ch] sm:max-w-[16ch]">
              Od strukture do
              <br />
              odločitve.
            </h2>

            <p className="mt-5 max-w-[48ch] text-base leading-7 text-white/55">
              Najprej določimo, kaj mora obiskovalec razumeti in kam ga mora
              stran voditi.
            </p>
          </div>
        </div>

        {/* Editorial three-part sequence */}
        <div className="mt-10 grid gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className="decision-flow-card flex h-full flex-col rounded-[10px] border border-white/10 bg-white/[0.01] p-6 sm:p-7 lg:p-8"
            >
              <div className="flex items-center justify-between gap-6">
                <p className="decision-flow-number text-[12px] font-medium uppercase tracking-[0.18em] text-white/[0.48]">
                  {principle.number}
                </p>

                <div aria-hidden="true">
                  <ShapeIcon shape={principle.shape} />
                </div>
              </div>

              <h3 className="mt-7 text-lg font-semibold leading-tight tracking-[-0.02em] text-white/88">
                {principle.label}
              </h3>

              <p className="mt-3 text-sm leading-[1.55] text-white/46">
                {principle.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
