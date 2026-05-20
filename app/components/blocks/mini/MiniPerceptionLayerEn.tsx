import MiniSpatialSystemObject from "./MiniSpatialSystemObject";

export default function MiniPerceptionLayerEn() {
  return (
    <section className="relative hidden overflow-hidden border-t border-white/10 bg-[#080808] py-20 text-white sm:py-24 lg:block lg:py-28">
      <MiniSpatialSystemObject className="pointer-events-none absolute right-[70px] top-[54%] hidden h-[380px] w-[380px] -translate-y-1/2 opacity-80 lg:block xl:right-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:px-8">
        <div className="max-w-[560px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            Visual Layer
          </p>

          <h2 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Form comes
            <br />
            after clarity.
          </h2>

          <p className="mt-6 max-w-[52ch] text-base leading-7 text-white/55">
            When the path is clear, visual detail, motion and microinteractions
            can add a sense of system — without taking over attention.
          </p>

          <div className="mt-10 flex items-center gap-4 text-sm text-white/42">
            <span>Path</span>
            <span>→</span>
            <span>Form</span>
            <span>→</span>
            <span>Feeling</span>
          </div>
        </div>

        <div className="hidden min-h-[320px] lg:block" />
      </div>
    </section>
  );
}