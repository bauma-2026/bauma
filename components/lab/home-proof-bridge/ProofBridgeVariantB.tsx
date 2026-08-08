import Link from "next/link";

import { PROOF_COPY } from "./constants";
import ProofBridgeHeader from "./ProofBridgeHeader";
import ProofScreenshot from "./ProofScreenshot";

/** Variant B — large Flexido + small supporting previews beside (desktop) or beneath (mobile) */
export default function ProofBridgeVariantB() {
  const { featured, supports } = PROOF_COPY;

  return (
    <section
      data-variant="B"
      className="border-t border-white/10 bg-[#080808] py-10 text-white sm:py-12 lg:py-14"
    >
      <div className="mini-page-rail space-y-8 lg:space-y-10">
        <ProofBridgeHeader />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.34fr)] lg:gap-10 lg:items-start">
          <article className="min-w-0">
            <ProofScreenshot
              src={featured.image}
              alt={`${featured.name} — celotna stran`}
              crop={featured.crop}
              className="h-[220px] sm:h-[280px] lg:h-[340px]"
            />

            <div className="mt-5 max-w-[48ch]">
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5 lg:pt-1">
            {supports.map((project) => (
              <Link
                key={project.name}
                href={project.href}
                className="group min-w-0"
              >
                <ProofScreenshot
                  src={project.image}
                  alt={project.name}
                  crop={project.crop}
                  className="h-[88px] sm:h-[96px] lg:h-[100px]"
                />
                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/32">
                  {project.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-white/44 group-hover:text-white/56">
                  {project.caption}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
