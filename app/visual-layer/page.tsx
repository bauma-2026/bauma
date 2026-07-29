import {
  VisualProofC1,
  VisualProofC2,
  VisualProofC3,
} from "../components/blocks/visual/VisualProofObjects";

const variations = [
  {
    key: "C1",
    name: "Diagonal Identity",
    identity:
      "One controlled diagonal proportions the entire surface and the internal register terminates parallel to it, so the cut is the structure rather than a mark placed on top of it.",
    hover:
      "The cut slides across, re-proportioning the two resulting regions — nothing else moves.",
    rest: "At rest the diagonal, the weighted region and the stepped register already read as a finished composition.",
    Visual: VisualProofC1,
  },
  {
    key: "C2",
    name: "Folded Surface",
    identity:
      "The plane turns once at a single crease and one secondary plane angles away behind a stepped tonal falloff — structure gaining dimensional character.",
    hover: "The turned plane settles a few pixels back toward the crease.",
    rest: "At rest the crease is the strongest edge in the object and the fold reads instantly as one deliberate spatial decision.",
    Visual: VisualProofC2,
  },
  {
    key: "C3",
    name: "Identity Panel",
    identity:
      "One dominant panel with a subtracted corner sets hierarchy against a deliberately empty supporting area — the subtraction is the visual signature.",
    hover: "The panel refines its alignment and gains one step of focus.",
    rest: "At rest the dominant-to-supporting relationship and the notch are fully legible without any motion.",
    Visual: VisualProofC3,
  },
];

function SectionPreview({
  Visual,
}: {
  Visual: (typeof variations)[number]["Visual"];
}) {
  return (
    <div className="group grid gap-10 border-y border-white/10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
          Visual layer
        </p>
        <h3 className="mt-6 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
          Oblika pride po jasnosti.
        </h3>
        <p className="mt-7 max-w-[52ch] text-[15px] leading-7 text-white/45">
          Ko je pot jasna, lahko vizual, gibanje in mikrointerakcije dodajo
          občutek sistema — brez da prevzamejo pozornost.
        </p>
        <div className="mt-9 flex items-center gap-4 text-sm text-white/35">
          <span>Pot</span>
          <span aria-hidden="true">&rarr;</span>
          <span>Oblika</span>
          <span aria-hidden="true">&rarr;</span>
          <span>Občutek</span>
        </div>
      </div>

      <div className="min-w-0">
        <Visual />
      </div>
    </div>
  );
}

export default function VisualLayerDirectionsPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
          Direction C — spatial identity surface
        </p>
        <h1 className="mt-4 max-w-[24ch] text-3xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl">
          Three variations of one identity logic.
        </h1>
        <p className="mt-5 max-w-[64ch] text-sm leading-6 text-white/50">
          Same front plane, same rear depth plane. One internal identity
          decision each, one amber role each. Hover stays secondary.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {variations.map(({ key, name, identity, hover, rest, Visual }) => (
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

              <p className="mt-6 max-w-[44ch] text-sm leading-6 text-white/55">
                {identity}
              </p>
              <p className="mt-3 max-w-[44ch] border-l border-white/10 pl-4 text-sm leading-6 text-white/35">
                Hover — {hover}
              </p>
              <p className="mt-3 max-w-[44ch] border-l border-white/10 pl-4 text-sm leading-6 text-white/35">
                Rest — {rest}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
            In section context
          </h2>

          <div className="mt-6">
            {variations.map(({ key, name, Visual }) => (
              <div key={key}>
                <p className="pt-12 text-[11px] font-medium tracking-[0.2em] text-white/30">
                  {key} — {name}
                </p>
                <SectionPreview Visual={Visual} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
