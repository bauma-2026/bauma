import Container from "../components/Container";
import Section from "../components/Section";
import { services } from "../../lib/content";

export default function ApproachPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Container className="pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <Section className="!mt-0" withDivider={false}>
          <div className="max-w-[760px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Pristop
            </p>

            <h1 className="mt-4 max-w-[13ch] text-[48px] font-semibold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl">
              Vsaka odločitev na strani vpliva na naslednji korak.
            </h1>

            <p className="mt-5 max-w-[52ch] text-base leading-[1.65] text-white/58">
              Začnem pri tem, kje uporabnik izgubi fokus, kaj mora razumeti in
              kateri naslednji korak mora postati očiten.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-2">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-200 hover:border-white/18 hover:bg-white/[0.045] sm:p-7"
              >
                <div className="max-w-[60ch]">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/22">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <h2 className="mt-4 text-xl font-semibold leading-[1.15] tracking-[-0.01em] text-white">
                    {s.title}
                  </h2>

                  <p className="mt-3 max-w-[52ch] text-sm leading-6 text-white/52">
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