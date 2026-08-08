# Pre–V2 Volume Transfer Backup

| Field | Value |
|-------|--------|
| Date | 2026-08-05 |
| Reason | Freeze production hero before replacing with approved V2 Balanced Volume system |
| Replacement | `components/home/hero-system/v2/*` → `HomeHeroVisual` |
| Production entry (pre-transfer) | `components/home/hero-system/HomeHeroVisual.tsx` |
| Provider (pre-transfer) | `components/home/hero-system/HomeHeroProvider.tsx` |

## Source files backed up

- `HomeHeroVisual.tsx` — rendered component entry
- `HomeHeroProvider.tsx` — interaction / envelope driver
- `HomeHeroField.tsx`, `HomeHeroCta.tsx`, `index.ts`
- `config.ts` — opacity / system tokens
- `heroGeometry.ts`, `heroDepth.ts`, `heroEnvelope.ts`
- `heroInteraction.ts`, `heroHitGeometry.ts`, `heroHitSurface.tsx`
- `heroPointerJourney.ts`, `useHeroPointerJourney.ts`
- `heroMotion.ts`, `heroMotionTiming.ts`, `heroSupportMotion.ts`
- `heroAccent.ts`, `heroContour.ts`, `heroTypes.ts`
- `heroMath.ts`, `heroVertexHelpers.ts`, `svgSerialize.ts`
- `useHeroVisibility.ts`

Earlier V3 baselines under `backups/` (e.g. `HeroObjectBaselineV3.tsx`, `FROZEN-BASELINE-V3.json`) were **not** overwritten.
