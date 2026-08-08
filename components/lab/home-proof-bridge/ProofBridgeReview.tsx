import ProofBridgeVariantA from "./ProofBridgeVariantA";
import ProofBridgeVariantB from "./ProofBridgeVariantB";
import ProofBridgeVariantC from "./ProofBridgeVariantC";
import ContactPlaceholder from "./ContactPlaceholder";

function VisualLayerPlaceholder() {
  return (
    <div
      data-study-placeholder="visual-layer"
      className="border-t border-white/10 bg-[#080808] py-10"
    >
      <div className="mini-page-rail">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/28">
          Visual Layer · locked placeholder
        </p>
      </div>
    </div>
  );
}

function VariantFrame({
  id,
  title,
  split,
  children,
}: {
  id: string;
  title: string;
  split: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-14">
      <div className="border-b border-white/10 bg-[#060606] py-3">
        <div className="mini-page-rail flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/50">
            {title}
          </p>
          <p className="text-[11px] text-white/30">{split}</p>
        </div>
      </div>
      {children}
      <ContactPlaceholder />
    </div>
  );
}

export default function ProofBridgeReview() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/10 py-8 sm:py-10">
        <div className="mini-page-rail">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
            Lab · Layout Study 01
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            Home Proof Bridge
          </h1>
          <p className="mt-3 max-w-[60ch] text-sm leading-6 text-white/45">
            Three layout variants — same copy. Flexido lead ~70% visual weight.
            Production Home unchanged.
          </p>
          <nav className="mt-5 flex flex-wrap gap-4 text-sm text-white/50">
            <a href="#variant-a" className="hover:text-white/80">
              A — rows
            </a>
            <a href="#variant-b" className="hover:text-white/80">
              B — previews
            </a>
            <a href="#variant-c" className="hover:text-white/80">
              C — editorial
            </a>
          </nav>
        </div>
      </header>

      <VariantFrame
        id="variant-a"
        title="Variant A"
        split="Large frame · compact supporting rows below · ~72 / 28"
      >
        <VisualLayerPlaceholder />
        <ProofBridgeVariantA />
      </VariantFrame>

      <VariantFrame
        id="variant-b"
        title="Variant B"
        split="Large frame · small previews beside (desktop) · ~68 / 32"
      >
        <VisualLayerPlaceholder />
        <ProofBridgeVariantB />
      </VariantFrame>

      <VariantFrame
        id="variant-c"
        title="Variant C"
        split="Dominant editorial · narrow side fragments · ~74 / 26"
      >
        <VisualLayerPlaceholder />
        <ProofBridgeVariantC />
      </VariantFrame>
    </div>
  );
}
