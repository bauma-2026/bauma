import MiniResponsivePlane from "./MiniResponsivePlane";

export type MiniPerceptionCopy = {
  eyebrow: string;
  line1: string;
  line2: string;
  body: string;
  trail: readonly [string, string, string];
};

const DEFAULT_COPY: MiniPerceptionCopy = {
  eyebrow: "Vizualna plast",
  line1: "Oblika pride",
  line2: "po jasnosti.",
  body:
    "Ko je pot jasna, oblika, kontrast in gibanje pokažejo, kaj je pomembno — ter sistemu dodajo značaj, ne hrupa.",
  trail: ["Jasnost", "Oblika", "Občutek"],
};

export default function MiniPerceptionLayer({
  copy = DEFAULT_COPY,
}: {
  copy?: MiniPerceptionCopy;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#12100d] py-12 text-white sm:py-14 lg:py-20">
      {/* Desktop proof object */}
      <MiniResponsivePlane
        variant="desktop"
        className="pointer-events-auto absolute top-[54%] z-20 hidden h-[420px] w-[420px] -translate-y-1/2 lg:right-[calc(26.5833vw-218px)] lg:block xl:right-[calc((100vw-1280px)/2+123px)]"
      />

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

          <p className="mt-6 text-sm text-white/[0.48] lg:mt-7">
            {copy.trail[0]} → {copy.trail[1]} → {copy.trail[2]}
          </p>
        </div>

        {/* Mobile proof object */}
        <div className="relative mt-8 flex justify-center lg:hidden">
          <MiniResponsivePlane
            variant="mobile"
            className="pointer-events-auto aspect-[360/320] w-[82%] max-w-[340px]"
          />
        </div>

        {/* Desktop space holder */}
        <div className="hidden min-h-[260px] lg:block" />
      </div>
    </section>
  );
}
