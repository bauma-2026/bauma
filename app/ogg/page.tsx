export default function OgPreviewPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
      <section className="relative h-[630px] w-[1200px] overflow-hidden bg-[#080808] text-white">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(255,255,255,0.075),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_46%,rgba(125,211,252,0.045),transparent_30%)]" />

        {/* Subtle wireframe system object */}
        <div className="pointer-events-none absolute right-[98px] top-[132px] h-[360px] w-[360px] opacity-55">
          <div className="absolute inset-[18px] rotate-6 border border-white/[0.05]" />
          <div className="absolute inset-[56px] -rotate-6 border border-white/[0.075]" />
          <div className="absolute inset-[98px] rotate-12 border border-sky-300/[0.09]" />

          <div className="absolute left-[44px] top-[72px] h-px w-[272px] rotate-[24deg] bg-white/[0.045]" />
          <div className="absolute left-[54px] top-[276px] h-px w-[260px] -rotate-[24deg] bg-white/[0.045]" />
          <div className="absolute left-[80px] top-[48px] h-px w-[236px] rotate-[57deg] bg-white/[0.04]" />
          <div className="absolute left-[64px] top-[304px] h-px w-[250px] -rotate-[57deg] bg-white/[0.04]" />

          <div className="absolute left-[165px] top-[165px] h-7 w-7 rounded-full border border-sky-300/[0.16] bg-sky-300/[0.025]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between px-[86px] py-[64px]">
          <header className="flex items-center justify-between">
           <div className="text-[34px] font-semibold tracking-[-0.04em] text-white">
  BAUMA
</div>
          </header>

          <div>
            <div className="inline-flex items-center rounded-full border border-sky-300/20 bg-white/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-white/72 shadow-[0_0_24px_rgba(125,211,252,0.05)]">
              Structure-first websites
            </div>

            <h1 className="mt-9 max-w-[790px] font-serif text-[88px] font-semibold leading-[0.94] tracking-[-0.045em] text-white">
              Jasna struktura.
              <br />
              Več odločitev.
            </h1>

            <p className="mt-8 max-w-[620px] text-[25px] leading-[1.45] tracking-[-0.02em] text-white/58">
              Spletne strani postavim tako, da uporabnik hitreje razume, zaupa
              in naredi naslednji korak.
            </p>
          </div>

          <footer className="border-t border-white/10 pt-6">
            <p className="text-[16px] font-medium text-white/55">bauma.si</p>
          </footer>
        </div>
      </section>
    </main>
  );
}