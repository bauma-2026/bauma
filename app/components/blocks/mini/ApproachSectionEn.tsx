const principles = [
  {
    number: "01",
    title: "What we remove",
    text: "Noise, repetition, unclear CTAs and sections without a clear function.",
  },
  {
    number: "02",
    title: "What we structure",
    text: "A clear hierarchy, a logical sequence of information and a path to the next step.",
  },
  {
    number: "03",
    title: "What changes",
    text: "The page starts working as a path, not as a collection of separate sections.",
  },
];

export default function ApproachSectionEn() {
  return (
    <section
      id="approach"
      className="border-t border-white/10 bg-[#080808] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12 lg:px-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            Approach
          </p>

          <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:max-w-[15ch] sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.04em] lg:text-6xl">
            Structure first. Visuals second.
          </h2>

         <p className="mt-5 max-w-[48ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
  First, I clarify what the user needs to understand. Only then does the
  visual layer, details and feeling of the page get their proper role.
</p>
        </div>

        <div className="border-y border-white/10">
          {principles.map((item) => (
            <div
              key={item.number}
              className="grid gap-3 border-b border-white/10 py-5 last:border-b-0 sm:grid-cols-[64px_1fr] sm:gap-6 sm:py-6"
            >
              <p className="text-[11px] font-medium tracking-[0.18em] text-white/60">
                {item.number}
              </p>

              <div>
                <h3 className="text-base font-semibold tracking-[-0.015em] text-white/90 sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-2 max-w-[52ch] text-sm leading-6 text-white/50">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-start-2">
          <p className="max-w-[56ch] border-l border-white/10 pl-5 text-sm leading-6 text-white/50">
            First, I structure the path. Then the visuals, details and feeling
            of the page have a clear job.
          </p>
        </div>
      </div>
    </section>
  );
}