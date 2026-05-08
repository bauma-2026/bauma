import Container from "../components/Container";
import Section from "../components/Section";
import { services } from "../../lib/content";

export default function ApproachPage() {
  return (
   <div className="min-h-screen bg-[#080808] text-white">
  <Container className="pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
    <Section className="!mt-0" withDivider={false}>
      <div className="max-w-[760px]">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
          Pristop
        </p>

        <h1 className="mt-4 max-w-[13ch] text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">
         Vsaka odločitev na strani
vpliva na naslednji korak.
        </h1>

        <p className="mt-5 max-w-[60ch] text-base leading-7 text-white/60">
         Začnem pri tem, kje uporabnik izgubi fokus, kaj mora razumeti in kateri naslednji korak mora postati očiten.
        </p>
      </div>

      <div className="mt-16 grid gap-5 lg:grid-cols-2">
  {services.map((s, i) => (
    <div
      key={s.title}
      className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <div className="max-w-[60ch]">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/20">
          {String(i + 1).padStart(2, "0")}
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
          {s.title}
        </h2>

        <p className="mt-4 text-sm leading-6 text-white/55">
          {s.desc}
        </p>
      </div>
    </div>
  ))}
</div>
      
    </Section>
  </Container>
</div>
  );
}