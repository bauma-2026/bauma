import VisualLayerCube from "./VisualLayerCube";

export type MiniPerceptionCopy = {
  eyebrow: string;
  line1: string;
  line2: string;
  body: string;
};

const DEFAULT_COPY: MiniPerceptionCopy = {
  eyebrow: "Vizualna plast",
  line1: "Oblika pride",
  line2: "po jasnosti.",
  body: "Dobra oblika ne prekriva strukture. Daje ji značaj.",
};

export default function MiniPerceptionLayer({
  copy = DEFAULT_COPY,
}: {
  copy?: MiniPerceptionCopy;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#12100d] py-12 text-white sm:py-14 lg:py-20">
      {/* Desktop proof object. Stage stays put; the cube is family pocket size inside it. */}
      <div className="pointer-events-none absolute top-[54%] z-20 hidden h-[420px] w-[420px] -translate-y-1/2 items-center justify-center lg:right-[calc(26.5833vw-218px)] lg:flex xl:right-[calc((100vw-1280px)/2+123px)]">
        <VisualLayerCube className="pointer-events-auto aspect-square w-[216px]" />
      </div>

      <div className="mini-page-rail relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
        <div className="max-w-[500px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/[0.48]">
            {copy.eyebrow}
          </p>

          <h2 className="home-primary-heading mt-4 max-w-[12ch]">
            {copy.line1}
            <br />
            {copy.line2}
          </h2>

          <p className="mt-5 max-w-[52ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            {copy.body}
          </p>
        </div>

        {/* Mobile proof object */}
        <div className="relative mt-8 flex justify-center lg:hidden">
          <VisualLayerCube className="pointer-events-auto aspect-square w-[min(124px,36%)] sm:w-[min(216px,48.5%)]" />
        </div>

        {/* Desktop space holder */}
        <div className="hidden min-h-[260px] lg:block" />
      </div>
    </section>
  );
}
