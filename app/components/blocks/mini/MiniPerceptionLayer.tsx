import MiniSpatialSystemObject from "./MiniSpatialSystemObject";

export default function MiniPerceptionLayer() {
  return (
    <section className="relative hidden overflow-hidden border-t border-white/10 bg-[#080808] py-20 text-white sm:py-24 lg:block lg:py-28">
      <MiniSpatialSystemObject className="pointer-events-none absolute right-[60px] top-[54%] hidden h-[400px] w-[400px] -translate-y-1/2 opacity-85 lg:block xl:right-[110px]" />

      <div className="relative z-10 mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:px-8">
        <div className="max-w-[560px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            Visual Layer
          </p>

          <h2 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Oblika pride
            <br />
            po jasnosti.
          </h2>

          <p className="mt-6 max-w-[52ch] text-base leading-7 text-white/55">
            Ko je pot jasna, lahko vizual, gibanje in mikrointerakcije dodajo
            občutek sistema — brez da prevzamejo pozornost.
          </p>

          <div className="mt-10 flex items-center gap-4 text-sm text-white/42">
            <span>Pot</span>
            <span>→</span>
            <span>Oblika</span>
            <span>→</span>
            <span>Občutek</span>
          </div>
        </div>

        <div className="hidden min-h-[320px] lg:block" />
      </div>
    </section>
  );
}