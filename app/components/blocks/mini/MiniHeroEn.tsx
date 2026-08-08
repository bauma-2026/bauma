import MiniHeroSystemField from "./MiniHeroSystemField";

export default function MiniHeroEn() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#080808] text-white">
      <MiniHeroSystemField />

      {/* Mobile system layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden"
      >
        {/* Square */}
        <svg
          className="absolute right-[7%] top-[24%] h-[68px] w-[68px]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            transform="rotate(8 50 50)"
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="1.2"
          />
        </svg>

        {/* Circle */}
        <svg
          className="absolute right-[-18%] top-[34%] h-[142px] w-[142px]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="36"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.2"
          />
        </svg>

        {/* Triangle */}
        <svg
          className="absolute right-[9%] bottom-[12%] h-[82px] w-[82px]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M50 14 L84 78 H16 Z"
            stroke="rgba(255,255,255,0.105)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-[1100px] gap-10 px-6 pt-20 pb-20 sm:pt-20 sm:pb-24 lg:min-h-[calc(100vh-52px)] lg:grid-cols-[1fr_0.78fr] lg:items-center lg:gap-14 lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex items-center rounded-full border border-[#B68A4C]/25 bg-[#B68A4C]/[0.04] px-3 py-1 text-[11px] font-medium text-white/72 shadow-[0_0_24px_rgba(182,138,76,0.07)]">
            Structure-first websites
          </div>

       <h1 className="mt-8 font-serif font-semibold leading-[0.9] tracking-[-0.035em] text-white sm:leading-[0.94] sm:tracking-[-0.025em]">
  {/* Mobile */}
  <span className="block max-w-[9ch] text-[3.75rem] sm:hidden">
    Clear
    <br />
    structure.
    <br />
    Better
    <br />
    decisions.
  </span>

  {/* Tablet / desktop */}
  <span className="hidden text-6xl sm:block lg:text-7xl">
    <span className="block whitespace-nowrap">Clear structure.</span>
    <span className="block whitespace-nowrap">Better decisions.</span>
  </span>
</h1>

          <p className="mt-8 max-w-[52ch] text-base leading-7 text-white/55 sm:text-lg">
            I structure websites so users understand faster, trust more easily,
            and take the next step with less friction.
          </p>

          <div className="mt-9">
            <a
              href="#flow"
              className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:-translate-y-[1px] hover:bg-white/90 active:translate-y-0"
            >
              <span className="inline-flex items-center gap-2">
                How a clear path is built
                <span className="transition duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}