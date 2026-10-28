# Visual Layer V2

Status: **current approved state (2026-09-26).** Documentation only. No production code was changed.

## Role

Visual Layer represents:
- surface
- finish
- tactility
- character

It comes after the structural/system logic. It should feel like the same system gaining material character.

## Current approved foundation

Object:
- VL Base
- Pocket-derived unit mass
- same projection / pose / camera family
- rounded-corner concept
- matte material
- calm silhouette stroke
- no cavity
- no cut
- no press
- no band
- no embossed mark
- no tonal patch
- no ghost
- no amber at rest

Current geometry values:
- radius `0.28`
- preserve the current projection, camera, apparent size and centering

Source: [visualLayerGeometry.ts](../app/components/blocks/mini/visualLayerGeometry.ts), [VisualLayerCube.tsx](../app/components/blocks/mini/VisualLayerCube.tsx).

## Audit conclusion

VL Base is strong enough as a foundation.

The main remaining issue is not geometry. It is **insufficient face-value separation**.

Current problem:
- face tones are too close together (`NEAR #262421`, `TOP #22201d`, `SIDE #1d1b18`)
- on mobile, the object collapses into a dark rounded silhouette
- surface and tactility are not legible enough
- the filled mass is visually heavy next to the line-based objects

Family observation:
- Pristop, System and Pocket Cube are **edge-led**
- VL Base is **mass-led**
- this difference is acceptable, but the surface must read clearly enough to justify it

## Next locked experiment

Refine the material only.

Do not change:
- geometry
- radius
- camera
- pose
- size
- layout
- features

Test only:
- front face value
- top face value
- side face value
- overall face-value separation

Goal: at mobile size (~90–115px apparent width), the three planes stay clearly readable while the object still feels:
- matte
- dark
- tactile
- restrained
- calm

Avoid:
- gradients
- glossy highlights
- dramatic lighting
- neon
- a product-render look
- overly light faces

## Decision rule

- If clearer flat face values make the object readable on mobile: **lock VL Base and move forward.**
- If not: geometry / radius / segment count may be revisited in a later pass, but not before this material test.
