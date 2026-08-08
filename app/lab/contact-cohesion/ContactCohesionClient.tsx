"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import MiniFooter from "@/app/components/blocks/mini/MiniFooter";
import MiniHeader from "@/app/components/blocks/mini/MiniHeader";
import ContactCohesionSection from "@/components/home/contact/ContactCohesionSection";
import {
  CONTACT_COHESION_VARIANTS,
  type ContactCohesionVariantId,
} from "@/components/home/contact/contactCohesionCopy";
import HomeWorkPreview from "@/components/work-preview/HomeWorkPreview";

const VARIANT_IDS = ["A", "B", "C"] as const;

function resolveVariant(raw: string | null): ContactCohesionVariantId {
  if (raw === "A" || raw === "B" || raw === "C") return raw;
  return "A";
}

function resolveShowEmail(raw: string | null): boolean {
  if (raw === "0" || raw === "hidden" || raw === "off") return false;
  return true;
}

/**
 * Lab review — Contact cohesion variants.
 * Production homepage Contact (MiniFinalCTA) is untouched.
 *
 * /lab/contact-cohesion?variant=A|B|C&email=1|0
 */
export default function ContactCohesionClient() {
  const params = useSearchParams();
  const variantId = resolveVariant(params.get("variant"));
  const showEmail = resolveShowEmail(params.get("email"));
  const variant = CONTACT_COHESION_VARIANTS[variantId];

  return (
    <>
      <MiniHeader />

      <main className="min-h-screen bg-[#080808] text-white">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="mini-page-rail flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] text-white/45">
              Lab — Contact Cohesion · {variantId}: {variant.label}
              {" · "}
              email {showEmail ? "visible" : "hidden"}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <nav
                className="flex flex-wrap items-center gap-2"
                aria-label="Contact variants"
              >
                {VARIANT_IDS.map((id) => {
                  const active = id === variantId;
                  return (
                    <Link
                      key={id}
                      href={`/lab/contact-cohesion?variant=${id}&email=${showEmail ? "1" : "0"}`}
                      className={[
                        "rounded-sm px-2.5 py-1 font-mono text-[11px] transition-colors",
                        active
                          ? "bg-white/12 text-white"
                          : "text-white/45 hover:text-white/70",
                      ].join(" ")}
                    >
                      {id}
                    </Link>
                  );
                })}
              </nav>
              <nav
                className="flex flex-wrap items-center gap-2"
                aria-label="Email visibility"
              >
                {(
                  [
                    { value: true, label: "email on" },
                    { value: false, label: "email off" },
                  ] as const
                ).map((opt) => {
                  const active = showEmail === opt.value;
                  return (
                    <Link
                      key={opt.label}
                      href={`/lab/contact-cohesion?variant=${variantId}&email=${opt.value ? "1" : "0"}`}
                      className={[
                        "rounded-sm px-2.5 py-1 font-mono text-[11px] transition-colors",
                        active
                          ? "bg-white/12 text-white"
                          : "text-white/45 hover:text-white/70",
                      ].join(" ")}
                    >
                      {opt.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Work → Contact → Footer context for crop review */}
        <HomeWorkPreview />
        <ContactCohesionSection variant={variant} showEmail={showEmail} />
      </main>

      <MiniFooter />
    </>
  );
}
