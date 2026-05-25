import MiniSpatialSystemObject from "./MiniSpatialSystemObject";

export default function MiniPerceptionLayerEn() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#080808] py-16 text-white sm:py-20 lg:py-28">
      {/* Desktop spatial system layer */}
     <MiniSpatialSystemObject className="pointer-events-none absolute right-[56px] top-[54%] hidden h-[420px] w-[420px] -translate-y-1/2 opacity-82 lg:block xl:right-[100px]" />

      <div className="relative z-10 mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:px-8">
        <div className="max-w-[560px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
            Visual Layer
          </p>

          <h2 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Form comes
            <br />
            after clarity.
          </h2>

          <p className="mt-6 max-w-[52ch] text-base leading-7 text-white/55">
            When the path is clear, visual rhythm, motion and microinteractions
            can add a sense of system — without taking over the focus.
          </p>

          <div className="mt-8 flex items-center gap-4 text-sm text-white/42 lg:mt-10">
            <span>Path</span>
            <span>→</span>
            <span>Form</span>
            <span>→</span>
            <span>Feeling</span>
          </div>
        </div>

        {/* Mobile / tablet spatial system layer */}
        <div className="relative mt-10 h-[300px] overflow-hidden lg:hidden">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-3xl" />

          <MiniSpatialSystemObject className="pointer-events-none absolute left-1/2 top-[46%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 opacity-95 sm:h-[360px] sm:w-[360px]" />
        </div>

        {/* Desktop space holder */}
        <div className="hidden min-h-[320px] lg:block" />
      </div>
    </section>
  );
}