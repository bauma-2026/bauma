import Link from "next/link";

import { PROOF_COPY } from "./constants";
import ProofBridgeHeader from "./ProofBridgeHeader";
import ProofScreenshot from "./ProofScreenshot";

/** Variant A — large Flexido frame + two compact supporting rows below */
export default function ProofBridgeVariantA() {
  const { featured, supports } = PROOF_COPY;

  return (
    <section
      data-variant="A"
      className="border-t border-white/10 bg-[#080808] py-10 text-white sm:py-12 lg:py-14"
    >
      <div className="mini-page-rail space-y-8 lg:space-y-10">
        <ProofBridgeHeader />

        <article className="min-w-0">
          <ProofScreenshot
            src={featured.image}
            alt={`${featured.name} — celotna stran`}
            crop={featured.crop}
            className="h-[220px] sm:h-[280px] lg:h-[360px]"
          />

          <div className="mt-5 max-w-[52ch] lg:mt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#d1a45f]/75">
              {featured.name}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/52 sm:text-base sm:leading-7">
              {featured.caption}
            </p>
            <Link
              href={featured.href}
              className="mt-4 inline-flex text-sm font-medium text-white/82 transition hover:text-white"
            >
              {featured.cta}
            </Link>
          </div>
        </article>

        <div className="space-y-0 border-t border-white/10">
          {supports.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="group grid grid-cols-[88px_1fr] gap-4 border-b border-white/10 py-4 transition hover:bg-white/[0.015] sm:grid-cols-[120px_1fr] sm:gap-5 sm:py-5 lg:grid-cols-[140px_1fr]"
            >
              <ProofScreenshot
                src={project.image}
                alt={project.name}
                crop={project.crop}
                band
                className="h-[56px] sm:h-[64px]"
              />
              <div className="min-w-0 self-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/32">
                  {project.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-white/46 group-hover:text-white/58">
                  {project.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
