export type MiniDecisionFlowCopy = {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  body?: string;
  questions: readonly {
    label: string;
    text: string;
  }[];
};

const DEFAULT_COPY: MiniDecisionFlowCopy = {
  eyebrow: "Pogled obiskovalca",
  headlineLine1: "Kaj zanima nekoga,",
  headlineLine2: "ki vas še ne pozna.",
  questions: [
    {
      label: "Je to zame?",
      text: "Odgovor dobi, preden začne brati podrobnosti.",
    },
    {
      label: "Zakaj prav oni?",
      text: "Brez iskanja vidi, kaj jih loči od drugih.",
    },
    {
      label: "Kaj zdaj?",
      text: "Ko se odloči, ve, kako stopiti v stik.",
    },
  ],
};

export default function MiniDecisionFlow({
  copy = DEFAULT_COPY,
}: {
  copy?: MiniDecisionFlowCopy;
}) {
  const lastIndex = copy.questions.length - 1;

  return (
    <section
      id="flow"
      className="scroll-mt-13 overflow-hidden border-t border-white/10 bg-[#0a0a0a] py-14 text-white sm:py-20 lg:py-24"
    >
      <div className="mini-page-rail grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-12 xl:grid-cols-2 xl:gap-16">
        {/* Intro */}
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            {copy.eyebrow}
          </p>

          <h2 className="home-primary-heading mt-4">
            {copy.headlineLine1}
            <br />
            {copy.headlineLine2}
          </h2>

          {copy.body ? (
            <p className="mt-5 max-w-[48ch] text-base leading-7 text-white/55">
              {copy.body}
            </p>
          ) : null}
        </div>

        {/* Three visitor questions — one vertical reading line, hairlines between rows */}
        <ol className="w-full min-w-0 divide-y divide-white/10 lg:max-w-[28rem] lg:justify-self-end lg:pt-9 xl:justify-self-start">
          {copy.questions.map((question, index) => (
            <li
              key={question.label}
              className="relative py-6 first:pt-0 last:pb-0 lg:py-9"
            >
              {/* Final thought: short amber segment on the hairline above it */}
              {index === lastIndex ? (
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-px w-10 bg-[rgba(209,164,95,0.8)]"
                />
              ) : null}

              <h3 className="text-xl font-medium leading-[1.2] tracking-[-0.025em] text-white/85 lg:text-[1.75rem] lg:leading-[1.15] lg:tracking-[-0.03em]">
                {question.label}
              </h3>

              <p className="mt-2 max-w-[44ch] text-balance text-[15px] leading-[1.6] text-white/55 lg:mt-3">
                {question.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
