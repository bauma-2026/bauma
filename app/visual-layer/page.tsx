import {
  VisualProofA,
  VisualProofB,
  VisualProofC,
} from "../components/blocks/visual/VisualProofObjects";

const directions = [
  {
    key: "A",
    name: "Editorial Composition",
    idea: "Asymmetric masthead hierarchy: one long rule, one heavy focal rule, one column of rhythm.",
    hover: "The crop shifts left and the amber mark settles onto the focal rule.",
    Visual: VisualProofA,
  },
  {
    key: "B",
    name: "Structured Visual Field",
    idea: "Composition derived from a module grid — occupied modules, one proportion span, one amber module.",
    hover: "Modules snap into alignment while the grid recedes.",
    Visual: VisualProofB,
  },
  {
    key: "C",
    name: "Spatial Identity Surface",
    idea: "One diagonal cut plus an offset internal plane gives the surface a recognizable character.",
    hover: "The cut sweeps, re-proportioning the two halves; the fold lifts.",
    Visual: VisualProofC,
  },
];

export default function VisualLayerDirectionsPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
          Visual layer — proof object
        </p>
        <h1 className="mt-4 max-w-[22ch] text-3xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl">
          Three directions, same geometry.
        </h1>
        <p className="mt-5 max-w-[62ch] text-sm leading-6 text-white/50">
          Hover each object to see its interaction concept. Section copy,
          typography and layout stay untouched.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {directions.map(({ key, name, idea, hover, Visual }) => (
            <div key={key} className="min-w-0">
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] font-medium tracking-[0.2em] text-white/30">
                  {key}
                </span>
                <h2 className="text-base font-medium tracking-[-0.015em] text-white/85">
                  {name}
                </h2>
              </div>

              <div className="group mt-6 border-y border-white/10 py-6">
                <Visual />
              </div>

              <p className="mt-5 max-w-[42ch] text-sm leading-6 text-white/50">
                {idea}
              </p>
              <p className="mt-3 max-w-[42ch] border-l border-white/10 pl-4 text-sm leading-6 text-white/35">
                Hover — {hover}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-white/10 pt-10">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
            In section context
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
                Visual layer
              </p>
              <h3 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Oblika pride po jasnosti.
              </h3>
              <p className="mt-6 max-w-[48ch] text-base leading-7 text-white/55">
                Ko je pot jasna, lahko vizual, gibanje in mikrointerakcije
                dodajo občutek sistema — brez da prevzamejo pozornost.
              </p>
              <div className="mt-8 flex items-center gap-4 text-sm text-white/40">
                <span>Pot</span>
                <span aria-hidden="true">&rarr;</span>
                <span>Oblika</span>
                <span aria-hidden="true">&rarr;</span>
                <span>Občutek</span>
              </div>
            </div>

            <div className="group min-w-0">
              <VisualProofA />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
