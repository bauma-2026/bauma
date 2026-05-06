"use client";

import { useState } from "react";

const intents = [
  {
    id: "unknown",
    label: "Ne vem kaj rabim",
    bad: ["Storitve", "Tekst", "Dvom", "Exit"],
    good: ["Problem", "Pot", "Dokaz", "Korak"],
    badNote: "Uporabnik ne ve, kje začeti.",
    goodNote: "Uporabnik se prepozna in gre naprej.",
  },
  {
    id: "compare",
    label: "Primerjam opcije",
    bad: ["Opcije", "Podobno", "Dvom", "Exit"],
    good: ["Razlika", "Kontekst", "Primerjava", "Odločitev"],
    badNote: "Vse izgleda enako pomembno.",
    goodNote: "Razlika med možnostmi postane jasna.",
  },
  {
    id: "contact",
    label: "Hočem kontakt",
    bad: ["CTA", "Obrazec", "Brez razloga", "Exit"],
    good: ["Problem", "Razlog", "CTA", "Kontakt"],
    badNote: "CTA nima dovolj konteksta.",
goodNote: "Uporabnik razume, zakaj je kontakt smiseln.",
  },
];

export default function DecisionFlow() {
  const [active, setActive] = useState(intents[0]);

  return (
    <section
      id="flow"
      className="relative overflow-hidden border-y border-white/10 bg-[#080808] py-24 text-white sm:py-28 lg:py-32"
    >
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_40%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* HEADER */}
        <div className="max-w-1xl">
  <h2 className="mt-4 max-w-[18ch] text-4xl font-medium leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl lg:max-w-[20ch] lg:text-6xl">
    Vsak layer uporabnika
    <span className="block">
      premakne bližje odločitvi.
    </span>
  </h2>

  <p className="mt-5 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
    Izberi situacijo. Razlika ni v dizajnu — ampak v tem, ali uporabnik
    ve, kaj narediti naprej.
  </p>
</div>

        {/* INTENTS */}
        <div className="mt-10 flex flex-wrap gap-3">
          {intents.map((intent) => {
            const isActive = active.id === intent.id;

            return (
              <button
                key={intent.id}
                onClick={() => setActive(intent)}
                className={[
                  "rounded-full border px-5 py-3 text-sm transition-all duration-200",
                  isActive
                    ? "border-white bg-white text-black"
                    : "border-white/15 bg-white/[0.03] text-white/55 hover:border-white/40 hover:text-white",
                ].join(" ")}
              >
                {intent.label}
              </button>
            );
          })}
        </div>

        {/* FLOW */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <FlowCard
            key={active.id + "-bad"}
            tone="bad"
            title="Uporabnik se izgubi"
            steps={active.bad}
            note={active.badNote}
          />

          <FlowCard
            key={active.id + "-good"}
            tone="good"
            title="Uporabnik se odloči"
            steps={active.good}
            note={active.goodNote}
          />
        </div>
      </div>
    </section>
  );
}

function FlowCard({
  tone,
  title,
  steps,
  note,
}: {
  tone: "bad" | "good";
  title: string;
  steps: string[];
  note: string;
}) {
  const isGood = tone === "good";

  return (
    <div
      className={[
        "rounded-2xl border p-6 sm:p-7 transition-all duration-500",
        isGood
          ? "border-white/20 bg-white/[0.08]"
          : "border-white/10 bg-white/[0.035]",
      ].join(" ")}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-medium tracking-[-0.02em] text-white">
          {title}
        </h3>

        <span className="text-xs uppercase tracking-[0.18em] text-white/35">
          {isGood ? "Bauma" : "Običajno"}
        </span>
      </div>

      {/* FLOW STEPS */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {steps.map((step, index) => (
          <Step
            key={`${step}-${index}`}
            step={step}
            index={index}
            isGood={isGood}
          />
        ))}
      </div>

      {/* NOTE + PUNCH */}
      <div className="mt-8 border-t border-white/10 pt-5 space-y-2">
        <p className="text-sm text-white/55">{note}</p>

      {isGood && (
  <p className="text-sm text-white/80">
    → odločitev postane lažja
  </p>
)}
      </div>
    </div>
  );
}

function Step({
  step,
  index,
  isGood,
}: {
  step: string;
  index: number;
  isGood: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "flex min-h-16 items-center justify-center rounded-xl border px-4 text-sm transition-all duration-500",
          isGood
            ? "border-white/25 bg-white/[0.10] text-white"
            : "border-white/10 bg-black/30 text-white/45",
          // CHAOS EFFECT (only bad side)
          !isGood && index % 2 === 0 ? "translate-y-1" : "",
          !isGood && index % 3 === 0 ? "opacity-70" : "",
        ].join(" ")}
      >
        {step}
      </div>

      {index < 3 && (
        <span
          className={[
            "text-lg transition-all duration-500",
            isGood ? "text-white/70" : "text-white/25",
          ].join(" ")}
        >
          →
        </span>
      )}
    </div>
  );
}