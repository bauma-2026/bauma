const handoffItems = [
  {
    number: "01",
    title: "Structure",
    strong: "First, we set the frame.",
    text: "Content gets a clear order. The user understands where they are, what matters and where to go next.",
    shape: "square",
  },
  {
    number: "02",
    title: "Clarity",
    strong: "Then we reduce the noise.",
    text: "When the structure is clear, doubt gets smaller. The page does not force the user to think too much — it helps them understand the point.",
    shape: "circle",
  },
  {
    number: "03",
    title: "Next step",
    strong: "In the end, the direction has to be obvious.",
    text: "A good page does not only explain the offer. It brings the user closer to a decision and shows what to do next.",
    shape: "triangle",
  },
];

function ShapeMark({ shape }: { shape: string }) {
  if (shape === "square") {
    return (
      <svg
        className="h-12 w-12 opacity-55"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="24"
          y="24"
          width="52"
          height="52"
          transform="rotate(8 50 50)"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (shape === "circle") {
    return (
      <svg
        className="h-12 w-12 opacity-55"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="32"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-12 w-12 opacity-55"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M50 18 L82 76 H18 Z"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function MiniSystemHandoffEn() {
  return (
    <section className="overflow-hidden border-t border-white/10 bg-[#0a0a0a] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Decision flow
            </p>

            <h2 className="mt-4 max-w-[13ch] text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.045em] lg:text-6xl">
              From structure to decision.
            </h2>
          </div>

          <p className="max-w-[58ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7 lg:pt-12">
            The user has to quickly understand where they are, what matters and
            what they can do next. That is why a page needs a clear order:
            structure, clarity and an obvious next step.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-3">
          {handoffItems.map((item) => (
            <article
              key={item.number}
              className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#101010] p-6 transition duration-300 hover:border-white/16 hover:bg-[#121212]"
            >
              <div className="absolute right-5 top-5">
                <ShapeMark shape={item.shape} />
              </div>

              <p className="text-[11px] font-medium tracking-[0.18em] text-white/40">
                {item.number}
              </p>

              <h3 className="mt-10 text-base font-semibold tracking-[-0.02em] text-white/90">
                {item.title}
              </h3>

              <p className="mt-6 text-sm font-semibold leading-6 text-white/78">
                {item.strong}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/50">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}