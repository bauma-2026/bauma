import Link from "next/link";

import { PROOF_COPY } from "./constants";
import ProofBridgeHeader from "./ProofBridgeHeader";
import ProofScreenshot from "./ProofScreenshot";

/** Variant C — editorial: Flexido dominates; supports as narrow secondary fragments */
export default function ProofBridgeVariantC() {
  const { featured, supports } = PROOF_COPY;

  return (
    <section
      data-variant="C"
      className="border-t border-white/10 bg-[#080808] py-10 text-white sm:py-12 lg:py-14"
    >
      <div className="mini-page-rail space-y-8">
        <ProofBridgeHeader />

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_120px] lg:gap-6 lg:items-start">
          <article className="min-w-0">
            <ProofScreenshot
              src={featured.image}
              alt={`${featured.name} — celotna stran`}
              crop={featured.crop}
              className="h-[240px] sm:h-[300px] lg:h-[400px]"
            />

            <div className="mt-5 max-w-[46ch]">
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

          <div className="flex flex-row gap-3 lg:flex-col lg:gap-3">
            {supports.map((project) => (
              <Link
                key={project.name}
                href={project.href}
                className="group min-w-0 flex-1 lg:flex-none"
              >
                <ProofScreenshot
                  src={project.image}
                  alt={project.name}
                  crop={project.crop}
                  band
                  className="h-[64px] sm:h-[72px] lg:h-[120px]"
                />
                <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-white/28 sm:text-[10px]">
                  {project.name}
                </p>
                <p className="mt-1 hidden text-xs leading-5 text-white/40 lg:block">
                  {project.caption}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-white/10 pt-4 lg:hidden">
          {supports.map((project) => (
            <Link
              key={`${project.name}-mobile-caption`}
              href={project.href}
              className="block text-sm leading-6 text-white/44"
            >
              <span className="text-white/30">{project.name} — </span>
              {project.caption}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
