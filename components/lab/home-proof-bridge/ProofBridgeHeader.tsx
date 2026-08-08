import { PROOF_COPY } from "./constants";

export default function ProofBridgeHeader() {
  return (
    <header className="max-w-[540px]">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
        {PROOF_COPY.label}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-4xl sm:leading-[0.95]">
        {PROOF_COPY.headline}
      </h2>
    </header>
  );
}
