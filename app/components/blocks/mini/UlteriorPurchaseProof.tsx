import Image from "next/image";

/**
 * Faithful, non-interactive reconstruction of the purchase area of the Ulterior
 * hardshell product page (ulterior.es/shop/waterproof-hardshell-jacket): the
 * product, its colour and size choice, the quantity stepper and the PayPal call
 * to action. The live page's "12 available now." line is deliberately not
 * reproduced, so no stock figure appears on Bauma's page.
 *
 * Source of truth (local ulterior-next):
 * - src/components/shop/ProductHeroClient.tsx (layout, eyebrow, name, price,
 *   description) and src/components/shop/ProductPurchasePanel.tsx (colour and
 *   size chips, quantity stepper, support message).
 * - src/components/shop/ProductPurchaseCTA.tsx + purchase-cta.css for the CTA,
 *   shown as the enabled button looks on ulterior.es (`.btn-primary
 *   .purchase-cta`: #33333e fill, white 14px/500, min 184 x 40px, 10 x 18.4px
 *   padding), without its hover. It is a static label: no link, no button, no
 *   request. The page caption under the frame says payment is not enabled here.
 * - src/app/shop/lib/products.ts for the product data: Deep Olive (default)
 *   and Off White, sizes S (not available) M L XL, Deep Olive profile image
 *   `hardshell-green-side-01.webp` (unedited, 680 x 680). The L variant and the
 *   quantity are the ones the live page opens with.
 *
 * Not shown: the site header, the "Back to collection" link, any order,
 * customer, reservation or operator data. Tokens ported 1:1 from
 * src/app/globals.css (ulterior-dark #33333e, line #e6e6e6, soft #f7f7f6).
 * Breakpoints follow the width the proof is given (container queries). The
 * name is a paragraph, not a heading: the embedding page owns the only H1.
 * The block is a little more compact than the original (narrower content
 * column, smaller vertical padding, a 460px photograph (the width of the Technical Proof photograph, so the two proofs share one grid), the product name at its
 * 1.7rem size) so it reads as one proof. Bauma's explanation of the purchase
 * system sits above the frame, on the case-study page, not in here.
 */

const FONT_STACK = "Arial, Helvetica, sans-serif";

const LABEL =
  "text-[0.68rem] uppercase tracking-[0.18em] text-[#33333e]/70";

const CHIP_SELECTED =
  "inline-flex h-8 items-center justify-center rounded-full border border-[#33333e] bg-[#33333e] text-sm text-white";
const CHIP =
  "inline-flex h-8 items-center justify-center rounded-full border border-[#33333e] text-sm text-[#33333e]";

export default function UlteriorPurchaseProof() {
  return (
    <div
      className="@container bg-[#f7f8fa] text-[#33333e] antialiased [text-rendering:auto]"
      style={{ fontFamily: FONT_STACK }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 py-9 @min-[640px]:px-6 @min-[768px]:py-10 @min-[1024px]:px-8 @min-[1024px]:py-12">
        <div
          role="img"
          aria-label="Ulterior: demonstracija nakupnega dela strani izdelka z izbrano barvo Deep Olive, velikostjo L, količino 1 in gumbom „Purchase with PayPal“, ki v tem prikazu ni povezan s plačilom"
          className="grid gap-6 @min-[640px]:grid-cols-2 @min-[640px]:items-start @min-[640px]:gap-8 @min-[1024px]:grid-cols-[minmax(0,460px)_minmax(0,1fr)] @min-[1024px]:gap-14"
        >
          <div className="max-w-[420px] overflow-hidden bg-[#f5f4f1] @min-[640px]:relative @min-[640px]:max-w-none @min-[640px]:self-stretch">
            <Image
              src="/work/ulterior/proof/hardshell-green-side-01.webp"
              alt=""
              width={680}
              height={680}
              sizes="(min-width: 1024px) 460px, (min-width: 640px) 330px, 100vw"
              quality={90}
              className="h-auto w-full object-cover @min-[640px]:absolute @min-[640px]:inset-0 @min-[640px]:h-full"
            />
          </div>

          <div className="max-w-[540px] @min-[640px]:pt-1">
            <p className="mb-3 text-[0.75rem] uppercase leading-4 tracking-[0.14em] text-[#6f6f76]">
              Jackets
            </p>

            <p className="max-w-[19ch] text-[1.7rem] font-semibold leading-[1.04] tracking-[-0.035em] text-[#33333e]">
              Waterproof Hardshell Jacket
            </p>

            <p className="mt-3.5 text-[0.95rem] font-medium leading-none text-[#33333e]">
              295.00 €
            </p>

            <p className="mt-4 max-w-[30rem] text-sm leading-6 text-[#33333e]/75">
              The clearest Ulterior product: a technical shell made for
              everyday weather.
            </p>

            <div className="mt-6">
              <div className="space-y-3.5">
                <div className="space-y-2">
                  <p className={LABEL}>Colour</p>
                  <div className="flex flex-wrap gap-2.5">
                    <span className={`${CHIP_SELECTED} px-3`}>
                      <span
                        aria-hidden="true"
                        className="mr-2 h-3 w-3 shrink-0 rounded-full border border-white/25"
                        style={{ backgroundColor: "#567c78" }}
                      />
                      Deep Olive
                    </span>
                    <span className={`${CHIP} px-3`}>
                      <span
                        aria-hidden="true"
                        className="mr-2 h-3 w-3 shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: "#ede7e0" }}
                      />
                      Off White
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={LABEL}>Size</p>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[#e6e6e6] px-2.5 text-sm text-[#33333e]/60">
                      S
                    </span>
                    <span className={`${CHIP} min-w-8 px-2.5`}>M</span>
                    <span className={`${CHIP_SELECTED} min-w-8 px-2.5`}>L</span>
                    <span className={`${CHIP} min-w-8 px-2.5`}>XL</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-[#e6e6e6] pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className={LABEL}>Quantity</p>
                  </div>

                  <div className="flex items-center overflow-hidden rounded-full border border-[#e6e6e6]">
                    <span className="flex h-8 w-8 items-center justify-center text-base text-[#33333e]/80 opacity-35">
                      −
                    </span>
                    <span className="flex h-8 w-9 items-center justify-center border-x border-[#e6e6e6] text-center text-sm font-medium text-[#33333e]">
                      1
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center text-base text-[#33333e]/80">
                      +
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="inline-flex min-h-10 min-w-[11.5rem] items-center justify-center border border-[#33333e] bg-[#33333e] px-[1.15rem] py-2.5 text-sm font-medium text-white">
                    Purchase with PayPal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
