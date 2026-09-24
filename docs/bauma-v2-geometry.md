# BAUMA V2 — Geometric system

Source of truth for the homepage geometric redesign. Consolidates the Pristop / Sistemska plast / Naslednji korak / Vizualna plast concept audits into one implementation-ready spec. Supersedes the individual audit conversations — if this document and an earlier audit disagree, this document wins.

## 1. Why this redesign exists

The homepage's four middle sections — Pristop, Sistemska plast, Naslednji korak, Vizualna plast — currently share no visual system:

- **Pristop** ([components/home/approach/](../components/home/approach/)) renders an 8-point abstract particle field that morphs into an arbitrary closed pentagon with a depth-extrusion outline ([approachStates.ts](../components/home/approach/approachStates.ts)). It requires hover/nav interaction to reach its resolved state and is not a recognizable object.
- **Sistemska plast** ([SystemGraphic.tsx](../app/components/blocks/mini/SystemGraphic.tsx)) renders a square/circle/circle/diamond node-and-edge network diagram with physics-driven jitter. It sits directly after Pristop's own node-graph, so the page shows two unrelated network diagrams back to back.
- **Naslednji korak** ([MiniNextStepCube.tsx](../app/components/blocks/mini/MiniNextStepCube.tsx)) renders a genuine interactive 3D cube with hand-tuned drag physics. It is legible at rest and interaction only deepens it — this is the one section that already meets the bar the rest of the page should meet.
- **Vizualna plast** ([MiniResponsivePlane.tsx](../app/components/blocks/mini/MiniResponsivePlane.tsx)) renders an unrelated notched quadrilateral plane with an amber "front activation" treatment.

None of these four objects share a grammar, a projection style, a stroke/opacity system, or a meaning for their accent color. Two of them are node-network diagrams, which read as generic data-visualization rather than as something a general visitor immediately understands. The homepage needs one coherent, physically-intuitive 3D spatial language that a broad, non-designer audience reads instantly — with the existing cube as the quality bar.

## 2. Core principles (locked)

- No generic node/network diagrams.
- No data-visualization aesthetics (no axes, no chart-like arrangements, no timeline rows).
- No arbitrary polygons — every resolved shape must be a recognizable object.
- No 2D chart-like geometry for Pristop specifically — it must be a 3D spatial object, not a flat diagram.
- Prefer recognisable 3D spatial objects/volumes over 2D symbol systems.
- Every object must be understandable **at rest**, with zero interaction.
- Interaction reveals or refines meaning that is already present at rest — it never explains something that would otherwise be unclear.
- Visual register stays dark, precise, restrained, premium.
- Geometry communicates the section's meaning; it does not decorate copy that already says the same thing.
- Mobile must be fully understandable without hover — nothing may depend on a pointer-only affordance.

## 3. Shared material language

All four sections' geometry should draw from one shared vocabulary:

- **Stroke hierarchy** — three tiers only: resolved/foreground element (~0.85–0.95 white opacity), structural/context element (~0.55–0.8), receding/unresolved element (~0.25–0.45). Never more than three simultaneous stroke weights in one composition.
- **Opacity hierarchy** — opacity, not color, is the primary signal for "how resolved" something is. Low opacity = not yet clear; full opacity = settled.
- **Fill philosophy** — wireframe-first. Faces carry at most a whisper of tone (roughly 3–6% white fill on the most prominent face, less on receding faces) to suggest material without ever becoming a rendered, shaded object. No gradients, no shadows, no ambient occlusion.
- **Perspective / projection restraint** — a fixed, restrained axonometric/isometric-style projection is sufficient for supporting graphics (Pristop, and any shared elements in Sistemska plast). It does not need to match the cube's own rotation-capable perspective math in [MiniNextStepCube.tsx](../app/components/blocks/mini/MiniNextStepCube.tsx) — that richer projection stays reserved for the cube, which is the page's one true hero object. Supporting sections should feel like they're drawn with the same pen, not the same camera.
- **Depth** — minimal. Just enough for an object to read as a volume, never a deep vanishing-point scene. No photorealism.
- **Amber semantic rule** — within this conceptual geometry system, amber means exactly one thing: **resolved / selected / clear**. It marks the single edge, face, or path that has just become legible. Never more than one amber element per composition. This is a separate rule from amber's existing UI/CTA role elsewhere on the site (buttons, active nav ticks, links) — those are unaffected and keep their current meaning.

## 4. Section roles

- **Pristop** — shows that an unclear situation resolves into a clear path. Must not restate Tok odločitve's struktura/jasnost/kaj-sledi triad in different words, and must not pre-empt Sistemska plast's "this is one system" claim.
- **Sistemska plast** — shows that the page is one connected system, not a sequence of independent sections. Must not re-argue "clarity precedes order" from scratch (Pristop already did that), and must not introduce a second unrelated 3D transformation — it continues Pristop's material and logic rather than starting over.
- **Naslednji korak** — turns the resolved system into one concrete, personal offer via the cube. Must not introduce new geometric grammar of its own — it is the reference the rest of the page conforms to, not the other way around.
- **Vizualna plast** — states that visual form/material is the last step, applied after structure. Must not introduce a new unrelated shape; it should read as a material/light treatment of the shared object language, not a fifth independent illustration.

## 5. Pristop — current audit

**Why the current geometry is rejected:** the 8-node particle field and its arbitrary pentagon-with-depth resolved state ([approachStates.ts:33-163](../components/home/approach/approachStates.ts)) is not a recognizable object, requires hover/nav interaction to reach its clearest state, and duplicates the node-and-edge visual language that Sistemska plast also uses one section later.

**Conclusion from the concept passes:** two 2D/3D directions were explored —

- **A (path / obstruction)** has the strongest semantic clarity — it is a direct visualization of the section's own headline ("*od nejasnosti do jasne poti*" — from unclarity to a clear **path**), and reads instantly to a non-designer audience.
- **C (assembly / order)** has the strongest object-language potential — its resolved state is a single coherent volume, which is the most direct precursor to the cube.

Neither A nor C alone is the final implementation. The next exploration must **combine A's immediate clarity with C's coherent 3D object language** — one single object whose own defining feature is a path/opening, rather than a path illustrated by moving separate blocks around. This is the brief for the object-family audit in section 7.

## 6. Pristop — required three-state model

The new geometry must support the three states already defined in copy ([copy.ts](../components/home/approach/copy.ts)):

### 01 — Odstranimo šum
The object becomes simpler and clearer: secondary, unnecessary, or visually conflicting parts are removed. Do not use a scatter plot or random particle field to represent noise — noise is represented by *excess parts on a real object*, not by disconnected points in space.

### 02 — Postavimo pot
A meaningful path, relationship, or functional edge on the object becomes visible. Mark it with restrained amber on exactly one structural element. This state must be legible without interaction.

### 03 — Oblika dobi nalogo
The object becomes a resolved, purposeful 3D form. It must not be the exact cube used in Naslednji korak — it should feel intentional and specific to Pristop, not like a placeholder or a decorative flourish.

## 7. 3D object-family audit

Three candidate families, each evaluated across all three states above.

### Family 1 — Notched / channelled prism
- **Base object**: a simple rectangular prism (block).
- **Noise elements**: small protruding tabs/fragments attached to the block at odd angles.
- **01**: tabs are removed, leaving a clean, unmarked prism.
- **02 (path)**: a groove/channel cut into one face becomes visible, its leading edge amber — a path *through* a solid.
- **03 (resolved form)**: the channel completes into a deliberate cut — a "notched volume," clearly shaped on purpose.
- **Amber location**: leading edge of the cut channel.
- **Non-designer comprehension**: good — a groove/channel reads as "a way through," though slightly less immediate than an open doorway.
- **Decorative/technical risk**: moderate-high — an isolated cut block can read as a CAD/engineering render if the cut is too precise or mechanical-looking.
- **Continuity into Sistem**: a channel implies a connection point other elements could plug into.
- **Continuity into cube**: strong — both are simple rectilinear solids sharing edge language directly.
- **Mobile legibility**: good — single silhouette, scales down cleanly.

### Family 2 — Open / framed volume (shell with one open face)
- **Base object**: a box-like volume defined by a small number of panels, not fully enclosed.
- **Noise elements**: extra, redundant, or misaligned panels floating around the volume's outline.
- **01**: redundant panels are removed/fade out, leaving only the panels needed to read as a simple box form.
- **02 (path)**: with panels reduced, one face is clearly absent — a threshold/opening appears; its edge is amber.
- **03 (resolved form)**: a clean open-faced shell — a volume you can see into, not just at. Materially resolved (subtle face tint on the panels that remain).
- **Amber location**: edge of the open face.
- **Non-designer comprehension**: strongest of the three — "a box with an opening" is immediately legible as *open/accessible*, no decoding required.
- **Decorative/technical risk**: moderate — can read as a generic display case if over-detailed; stays abstract if kept to plain flat panels with no framing details.
- **Continuity into Sistem**: an open container implies other elements can be placed within a structure — pairs naturally with "the page is one system."
- **Continuity into cube**: strongest of the three — this is conceptually "an open cube," directly related to the closed cube reference without duplicating it (per §6, not the exact cube).
- **Mobile legibility**: strong — single clear silhouette, the opening still reads at small sizes.

### Family 3 — Stepped volume
- **Base object**: a block with an uneven stepped edge.
- **Noise elements**: extra, unevenly-sized step fragments/ledges.
- **01**: uneven fragments consolidate into fewer, cleaner steps.
- **02 (path)**: the steps align into one continuous ascending edge, amber on the leading/topmost step edge.
- **03 (resolved form)**: a clean stepped volume — directional, implies progress/ascension.
- **Amber location**: leading edge of the final step.
- **Non-designer comprehension**: very strong — stairs are a near-universal "way forward" metaphor.
- **Decorative/technical risk**: highest of the three — stairs skew toward literal architecture, which §2's "no literal architectural buildings" constraint warns against directly.
- **Continuity into Sistem**: a stepped path can extend into multiple connected steps — a system of related steps.
- **Continuity into cube**: present but weaker — steps are rectilinear but read less directly as "cube-adjacent" than Family 2.
- **Mobile legibility**: acceptable, but thin step edges compress at small sizes more than the other two families.

## 8. Recommended object family

**Family 2 — open/framed volume (shell with one open face).**

It is the only family that fuses A and C in a single object rather than juxtaposing them: the resolved state *is* one coherent volume (satisfying C), and that volume's own defining feature *is* an opening/passage (satisfying A) — nothing needs to be read as two separate ideas layered together. It scores highest on immediate comprehension (an opening in a box reads faster than a channel or a staircase), carries the lowest risk of tipping into a literal-architecture or CAD-render look, differentiates its three states clearly (panel count → opening appears → material shell), and gives the strongest, most natural continuity into the cube without duplicating it. Family 1 (notched prism) is the fallback if the shell proves visually thin in practice; Family 3 (stepped volume) is not recommended — its architectural literalness is a direct conflict with a locked principle in §2.

## 9. Interaction model

- **Rest state**: on load and with zero interaction, render the object in its most informative single state — state 03 (resolved shell) by default. The section must communicate its point from this state alone.
- **Scroll-into-view**: a one-time settle animation may play from 01 → 02 → 03 as the section enters the viewport, and must complete on its own without requiring further input — this is what makes 01 and 02 visible to mobile visitors who never hover.
- **Hover / pointer**: the existing 01/02/03 step nav (already present in [ApproachInteractiveSection.tsx](../components/home/approach/ApproachInteractiveSection.tsx)) keeps its current pattern — hovering or focusing a step previews that state, clicking commits it. Hover may add subtle pointer-follow parallax on the object. Nothing under hover may be the only way to reach information the rest state doesn't already convey.
- **Reduced motion**: skip the settle animation and any ambient motion entirely; render state 03 instantly, matching the existing `reducedMotion` handling already threaded through the current Pristop implementation.

Core rule, restated: every one of the three conceptual states must be understandable without interaction. Interaction may deepen the story; it may never be required to get it.

## 10. Relationship to other sections

### Sistemska plast
Shares material (stroke/opacity hierarchy, fill philosophy, amber rule) and spatial logic (restrained axonometric projection, minimal depth) with the new Pristop object — but must **not** reuse Pristop's exact object or transformation. Its own resolved state should read as an escalation ("this one object turns out to connect to a system") rather than a repeat of "noise becomes an object."

### Naslednji korak
The cube stays exactly as it is — no changes to [MiniNextStepCube.tsx](../app/components/blocks/mini/MiniNextStepCube.tsx) or its interaction. It remains the quality reference for the rest of the page: clear object first, interaction second.

### Vizualna plast
A later V2 pass should express this section through material / surface / light / face treatment applied to the shared object language — not through another unrelated geometric object like the current notched plane in [MiniResponsivePlane.tsx](../app/components/blocks/mini/MiniResponsivePlane.tsx).

**Next checkpoint** (not this pass): the current cassette is not final. Direction is a more physical/material pocket object — possibly eraser-like / rubber-like, with rounded edges, matte character, and denser surface treatment — without skeuomorphic overload. Semantic role: structure becomes material / character after clarity. Full note: [bauma-v2-system.md §11](./bauma-v2-system.md).

## 11. Content implications

From the earlier content audit, still valid and not yet acted on:

- Pristop's support line under the headline ([copy.ts:21-22](../components/home/approach/copy.ts)) is a candidate for removal — it restates the headline rather than adding to it.
- Sistemska plast's four-way interactive concept glossary ([SystemGraphic.tsx:1373-1412](../app/components/blocks/mini/SystemGraphic.tsx)) is a candidate for removal — it re-lists ideas already covered by Tok odločitve and Pristop.
- Vizualna plast's trail line ("Jasnost → Oblika → Občutek", [MiniPerceptionLayer.tsx:17](../app/components/blocks/mini/MiniPerceptionLayer.tsx)) is a candidate for removal — a fourth restatement of the same three-beat sequence.
- In every case, the default vertical read (no interaction, no hover) must be enough on its own. Copy is not being rewritten yet — this section records what to revisit once the new geometry is in place and can be judged against real content.

## 12. Implementation locks for Cursor

**Must not:**
- Redesign unrelated sections (Tok odločitve, final CTA, footer, proof sections).
- Change homepage section order.
- Change the cube's geometry or interaction in any way.
- Deploy.
- Alter copy unless specifically instructed.
- Add new dependencies without approval.
- Replace geometry with canvas/WebGL unless clearly necessary — the cube itself proves plain SVG/DOM projection math is sufficient at this fidelity.
- Touch proof sections (`FlexidoHomeProof`, `FlexidoAreasProof`, and related Flexido preview work).

**Should:**
- Build the smallest possible prototype first — one object, three states, nothing else.
- Preserve the existing section's layout, copy, and nav pattern; only the geometry rendering changes.
- Isolate the new geometry into its own dedicated component, not a rewrite of `ApproachInteractiveGraphic.tsx` in place.
- Verify on both desktop and mobile before calling it done.
- Keep the current implementation live and reachable until V2 is reviewed and approved — do not delete or disable it.

## 13. First implementation task

Implement **only** a Pristop V2 geometry prototype using **Family 2 (open/framed volume)**, isolated from the live homepage:

- Build it under a new lab route, following the project's existing convention (e.g. `app/lab/pristop-v2/`, alongside `app/lab/approach-content-lock/`, `app/lab/visual-layer-dynamics/`, `app/lab/bauma-system/`).
- Reuse the existing 01/02/03 copy and step-nav interaction pattern from [ApproachInteractiveSection.tsx](../components/home/approach/ApproachInteractiveSection.tsx); only swap the object rendering.
- Implement all three states per §6/§7: panel reduction (01), opening + single amber edge (02), resolved open shell (03).
- Follow the material language in §3 and the interaction model in §9, including a reduced-motion fallback and mobile legibility with no hover dependency.
- Do not touch Sistemska plast, Vizualna plast, or the cube.
- Do not replace the production Pristop component — the current implementation stays live until this prototype is reviewed.
- No deploy.
