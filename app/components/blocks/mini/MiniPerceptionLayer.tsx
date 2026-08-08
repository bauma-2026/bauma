import MiniResponsivePlane from "./MiniResponsivePlane";

export default function MiniPerceptionLayer() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#080808] py-12 text-white sm:py-14 lg:py-16">
      {/* Desktop proof object */}
      <MiniResponsivePlane
        variant="desktop"
        className="pointer-events-auto absolute top-[54%] z-20 hidden h-[420px] w-[420px] -translate-y-1/2 lg:right-[calc(26.5833vw-218px)] lg:block xl:right-[calc((100vw-1280px)/2+123px)]"
      />

     <div className="mini-page-rail relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
  <div className="max-w-[500px]">
    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/[0.48]">
      Vizualna plast
    </p>

    <h2 className="home-primary-heading mt-4 max-w-[12ch]">
      Oblika pride
      <br />
      po jasnosti.
    </h2>

    <p className="mt-5 max-w-[52ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
      Ko je pot jasna, oblika, kontrast in gibanje pokažejo, kaj je pomembno —
      ter sistemu dodajo značaj, ne hrupa.
    </p>

    <div className="mt-6 flex items-center gap-4 text-sm text-white/[0.48] lg:mt-7">
      <span>Jasnost</span>
      <span>→</span>
      <span>Oblika</span>
      <span>→</span>
      <span>Občutek</span>
    </div>
  </div>


        {/* Mobile proof object */}
        <div className="relative mt-6 h-[300px] overflow-hidden lg:hidden">
          <MiniResponsivePlane
            variant="mobile"
            className="pointer-events-none absolute left-1/2 top-[46%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 sm:h-[360px] sm:w-[360px]"
          />
        </div>

        {/* Desktop space holder */}
        <div className="hidden min-h-[260px] lg:block" />
      </div>
    </section>
  );
}
