# BAUMA V2 — System Layer (Sistemska plast)

Source of truth for the System Layer V2 direction. Extends [bauma-v2-geometry.md](./bauma-v2-geometry.md). Where the two disagree about Sistemska plast, **this document wins** (see §10).

Status: **locked direction for the next prototype.** This is not an approved production design.

## 1. Current state

- The production System node/network ([SystemGraphic.tsx](../app/components/blocks/mini/SystemGraphic.tsx)) **stays live until a replacement is proven**. Do not remove, disable or swap it.
- The existing spherical prototype at [`/lab/system-v2`](../app/lab/system-v2/) (sphere with interior members, amber joins and hoop segments) is **rejected** as a direction. It still reads as a diagram, molecule or data visualization.

## 2. Abandoned directions

Do not return to any of these:

- sphere / globe
- internal node/network diagrams
- geodesic mesh
- orbit systems
- labelled concept geometry
- `Structure · Clarity · Trust · Decision` (`Struktura · Jasnost · Zaupanje · Odločitev`) as interactive visual states

**Reason:** these read as data visualization or diagrams, and they do not belong to the emerging Bauma pocket-object family.

## 3. Page object language

| Section | Object | Role |
|---|---|---|
| Pristop | open shell | path, clarity, assigned roles |
| **Sistemska plast** | **interlocking three-piece structural object** | **several parts forming one stable whole** |
| Vizualna plast | layered cassette | surface, material, character |
| Naslednji korak | tactile closed cube | action, a concrete next move |

System must add a role distinct from the other three:

- several parts
- one stable whole
- parts depend on each other
- connected, coordinated, holding together

The object carries the section headline, *Pod površino je sistem.* It reads as calm and whole from the outside, and the interlocking logic stays implied rather than explained. The copy does the explaining. The object does not illustrate concepts one by one.

## 4. Object family

**Interlocking three-piece structural object.** There are two prototype directions:

- **A1: slender three-piece burr.** Three slender, notched square-section members cross orthogonally at a shared centre.
- **A2: tighter, more architectural structural joint.** Members are more compact and read as a timber or architectural joint rather than a free-floating cross.

**The goal is NOT a puzzle toy.** The geometry should feel:

- architectural
- precise
- restrained
- pocket-scale
- straight-edged
- axonometric
- part of the same family as Pristop / Cube / Visual Layer (same pen, same stroke/opacity/fill language as in [bauma-v2-geometry.md §3](./bauma-v2-geometry.md))

## 5. Visual rules

- one clear 3D object
- understandable at rest
- no nodes
- no network lines
- no labels
- no multiple semantic states
- no sci-fi
- no gears
- no jigsaw
- no Rubik-style cube
- no dense geometry

## 6. Amber

- One cue at most.
- Optional, and only at the central interlock.
- Do not map amber to concepts.
- Remove amber entirely if the object reads better without it.

## 7. Motion

- Rest state first. The object must be complete and legible with zero motion.
- Optional: a tiny proximity separation, where members ease apart along their own axes by **~2–4%**, then return.
- Same physical language as Pocket Cube and Pristop: quick response, short settle.
- **No** drag.
- **No** idle animation.
- **No** sequence.
- **No** large morph.
- Reduced motion: render the rest state only.
- Mobile: must be fully understood at rest, with no hover dependency.

## 8. Scale

Target rendered bounding box: **~180–220px at a 1440px viewport.** Keep it pocket-scale and supporting. It must not become a second hero object.

## 9. Production copy

Concept UI is removed (`Struktura · Jasnost · Zaupanje · Odločitev` and EN equivalents). Production copy is:

**SL**

- **Eyebrow:** Sistemska plast
- **H2:** Pod površino je sistem.
- **Body:** Vsak del ima svojo vlogo. Povežemo jih v jasno celoto.

**EN**

- **Eyebrow:** System layer
- **H2:** Under the surface is a system.
- **Body:** Each part has a role. We bring them together into one clear whole.

No helper line. No concept glossary.

## 10. Relationship to bauma-v2-geometry.md

This document supersedes the following points in [bauma-v2-geometry.md](./bauma-v2-geometry.md) for Sistemska plast only:

- **§10 "Sistemska plast"** framed the System state as an escalation, where one object turns out to connect to a system. That is replaced by a single, self-contained structural object with no transformation narrative.
- **§3 amber rule** (amber = resolved / selected / clear). For System, amber is at most one optional cue at the central interlock, and it may be dropped entirely (§6).
- **§11** marked the concept glossary as a *candidate* for removal. It is now **decided**: the interactive concept UI is removed in V2 (§9).

Everything else in the geometry doc still applies, including material language, the core principles, and the implementation locks in §12.

## 11. Next: Visual Layer

System’s interlocking object is in production. The next — and last — spatial-object pass is **Vizualna plast**.

Do not implement it from this note. Checkpoint only:

- The current cassette in [MiniResponsivePlane.tsx](../app/components/blocks/mini/MiniResponsivePlane.tsx) is **not final**.
- Direction: a more physical / material object in the same pocket-object family as Pristop, System, and Cube.
- Possibly eraser-like / rubber-like: rounded edges / border radius, matte material character, denser surface treatment.
- No skeuomorphic detail overload. No new motion language. No extra geometric grammar.
- Semantic role: after clarity, structure becomes material / character.

See also [bauma-v2-geometry.md §4 / §10](./bauma-v2-geometry.md) (form after structure).
