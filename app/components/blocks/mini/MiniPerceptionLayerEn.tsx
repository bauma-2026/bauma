import MiniSpatialObject from "./MiniSpatialObject";

export default function MiniPerceptionLayerEn() {
  return (
    <section className="relative hidden overflow-hidden border-t border-white/10 bg-[#080808] py-20 text-white sm:py-24 lg:block lg:py-28">
      {/* Desktop spatial layer */}
      <MiniSpatialObject
        shape="cube"
        interactive
        className="pointer-events-none absolute right-[40px] top-[55%] hidden h-[400px] w-[400px] -translate-y-1/2 opacity-70 lg:block xl:right-[120px]"
      />

      <div className="relative z-10 mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:px-8">
        <div className="max-w-[560px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            Visual layer
          </p>

          <h2 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Structure needs
            <br />
            to take shape.
          </h2>

          <p className="mt-6 max-w-[52ch] text-base leading-7 text-white/55">
            Once the path is clear, motion, depth and micro-interactions can add
            a sense of system — without taking over the attention.
          </p>
        </div>

        {/* Desktop space holder */}
        <div className="hidden min-h-[320px] lg:block" />
      </div>
    </section>
  );
}