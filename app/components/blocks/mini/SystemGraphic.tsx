"use client";

import { useEffect, useRef, useState } from "react";

const systemSteps = [
  {
    label: "Problem",
    value: "Uporabnik ne razume, kaj je pomembno.",
  },
  {
    label: "Structure",
    value: "Vsebina dobi jasen vrstni red.",
  },
  {
    label: "Trust",
    value: "Dvom se zmanjša, naslednji korak postane lažji.",
  },
  {
    label: "Decision",
    value: "Stran uporabnika vodi do akcije.",
  },
];

const codeString = `const decisionSystem = {
  problem: "unclear path",
  structure: "clear hierarchy",
  trust: "reduced doubt",
  action: "next step",
}`;

function highlightCode(code: string) {
  return code.split("\n").map((line, index) => {
    const formatted = line
      .replace(
        "const",
        '<span class="text-white/25">const</span>'
      )
      .replace(
        "decisionSystem",
        '<span class="text-white/70">decisionSystem</span>'
      )
      .replace(
        "problem:",
        '<span class="text-white/35">problem:</span>'
      )
      .replace(
        "structure:",
        '<span class="text-white/35">structure:</span>'
      )
      .replace(
        "trust:",
        '<span class="text-white/35">trust:</span>'
      )
      .replace(
        "action:",
        '<span class="text-white/35">action:</span>'
      )
      .replaceAll(
        '"unclear path"',
        '<span class="text-white/70">"unclear path"</span>'
      )
      .replaceAll(
        '"clear hierarchy"',
        '<span class="text-white/70">"clear hierarchy"</span>'
      )
      .replaceAll(
        '"reduced doubt"',
        '<span class="text-white/70">"reduced doubt"</span>'
      )
      .replaceAll(
        '"next step"',
        '<span class="text-white/70">"next step"</span>'
      );

    return (
      <p
        key={index}
        className={line.startsWith("  ") ? "pl-4" : ""}
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

export default function SystemGraphic() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [typedCode, setTypedCode] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let index = 0;

    const interval = window.setInterval(() => {
      setTypedCode(codeString.slice(0, index));

      index += 1;

      if (index > codeString.length) {
        window.clearInterval(interval);
      }
    }, 18);

    return () => window.clearInterval(interval);
  }, [hasStarted]);

  return (
    <section
      ref={sectionRef}
      className="border-t border-white/10 bg-[#080808] py-20 text-white sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1100px] gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
            System layer
          </p>

          <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Pod površino je sistem.
          </h2>

          <p className="mt-6 max-w-[48ch] text-base leading-7 text-white/55">
            Stran ni samo zaporedje sekcij. Vsak del mora imeti vlogo:
            odstraniti nejasnost, zgraditi zaupanje ali uporabnika premakniti
            bližje naslednjemu koraku.
          </p>
        </div>

        <div className="group relative">
          <div className="pointer-events-none absolute -inset-8 rounded-[36px] bg-white/[0.03] opacity-0 blur-3xl transition duration-700 group-hover:opacity-100" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/30 transition duration-500 group-hover:border-white/18 group-hover:bg-[#101010]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70" />

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20 transition duration-500 group-hover:bg-white/35" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/12 transition duration-500 group-hover:bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/8 transition duration-500 group-hover:bg-white/14" />
              </div>

              <p className="text-[12px] font-medium tracking-[-0.01em] text-white/32 transition duration-500 group-hover:text-white/45">
  Decision logic
</p>
            </div>

            <div className="p-5 sm:p-7">
              <div className="relative min-h-[174px] overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-5 font-mono text-[12px] leading-6 text-white/45 transition duration-500 group-hover:border-white/15 group-hover:bg-black/25 sm:text-[13px]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {highlightCode(typedCode)}

                {hasStarted && typedCode.length < codeString.length && (
                  <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-white/60" />
                )}
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 transition duration-500 group-hover:border-white/15">
                {systemSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className="grid gap-3 border-b border-white/10 px-4 py-4 transition duration-300 last:border-b-0 hover:bg-white/[0.035] sm:grid-cols-[120px_1fr] sm:items-center sm:px-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-[11px] text-white/35 transition duration-300 group-hover:border-white/15">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p className="text-sm font-medium text-white/80">
                        {step.label}
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-white/45">
                      {step.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm leading-6 text-white/45">
                  Output:{" "}
                  <span className="text-white/75 transition duration-500 group-hover:text-white/90">
                    jasnejša pot od prvega pogleda do kontakta.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}