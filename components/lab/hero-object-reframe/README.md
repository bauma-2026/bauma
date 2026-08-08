# Hero Object Reframe — Final Lab Reference

Production hero spatial system is locked. This lab is a single edge-context reference surface, not a development archive.

## Primary route

```
/lab/hero-object-reframe?study=edge-context&stability=E1&visibility=V0
```

Any `study` value other than documentation defaults is ignored; the page always renders the edge-context reference.

## Supported query params

| Param | Values | Default | Notes |
|-------|--------|---------|-------|
| `study` | `edge-context` | (always) | Documented only; no other studies |
| `stability` / `e` | `E0` `E1` `E2` | `E1` | Gate presets on shared runtime |
| `visibility` / `v` | `V0` `VB` | `V0` | Rest brightness presentation |
| `traffic` / `t` | `off` `T0`…`T5` | `off` | Synthetic pointer traces |
| `debug` | `1` | off | Overlay metrics |
| `zones` | `1` | off | Proximity zone rings |
| `chrome` | `0` | on | Hide header / lab chrome |
| `dim` | `1` | off | Lower page brightness |
| `reduced` | `1` | off | Reduced-motion path |
| `interaction` | `0` | on | Disable proximity |
| `drawer` | `1` | off | Open lab controls |
| `ip` | `0`…`1` | live | Scrub spatial progress |

## Active files

```
components/lab/hero-object-reframe/
  EdgeContextStudy.tsx          # reference UI + object view
  HeroObjectReframeReference.tsx # lab shell (no study dispatcher)
  labSearchParams.ts            # documented query parser
  useEdgeContextInteraction.ts  # lab shell around production runtime
  README.md
```

## Production authorities (do not duplicate)

Import from `components/home/hero-system/v3/`:

| Concern | Authority |
|---------|-----------|
| Geometry / canvas / S0 materials | `geometryV3.ts` |
| S0→S2 path sampling | `spatialPathV3.ts` → `sampleFullSpatialPath` + `LIVE_SPATIAL_SAMPLE` |
| Proximity math / zones | `proximityModelV3.ts` |
| Interaction runtime | `createProximityRuntime.ts` |

Lab-only: traffic traces, edge metrics, stability gate presets, UI chrome.

## Proof archive

Images and JSON under `public/lab/hero-object-reframe/` remain the historical proof store. Git history is the code archive — obsolete study modules are not retained in-tree.
