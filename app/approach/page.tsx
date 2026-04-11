import Container from "../components/Container";
import Section from "../components/Section";
import { services } from "../../lib/content";

const cardBase =
  "group block border border-black/10 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-black/20 hover:shadow-md";

const cardDefault = `${cardBase} rounded-[28px] bg-white/70 p-6 sm:p-8`;

export default function ApproachPage() {
  return (
    <Container className="pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
      <Section className="!mt-0">
        <div className="max-w-[720px]">
          <p className="text-meta">Approach</p>

          <h1 className="mt-3 text-h1 text-neutral-950">
            Najprej struktura.
            <br />
            Potem estetika.
            <br />
            Potem izvedba.
          </h1>

          <p className="mt-4 max-w-[58ch] text-body">
            Večina strani začne pri vizualnem sloju. Jaz začnem prej — pri tem, kaj
            mora uporabnik razumeti, čemu verjeti in kaj narediti naprej.
          </p>
        </div>

        <div className="mt-8 grid gap-5">
          {services.map((s, i) => (
            <div key={s.title} className={cardDefault}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <div className="max-w-[64ch]">
                  <div className="text-meta">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
                    {s.title}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                    {s.desc}
                  </p>
                </div>

                <div className="shrink-0 text-sm text-neutral-400">
                  Step
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
}