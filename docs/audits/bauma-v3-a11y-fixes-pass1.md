# BAUMA V3 — dostopnost: prvi sklop popravkov (2026-10-25)

Veja `staging/bauma-v3`, HEAD `6b2fa07`; lokalnih navodil (CLAUDE.md/AGENTS.md) ni. Obstoječe necommitane spremembe ohranjene. Nič ni commitano, pushano ali deployano. Audit `bauma-v3-accessibility-audit.md` ni prepisan.

## Spremembe

| ID | Datoteka | Sprememba |
|---|---|---|
| A11Y-001 | `app/work/{flexido,ulterior,odstrani-tattoo,dema-plus,artbite,hardshelljacket}/page.tsx` | `CAPTION`: `text-white/40` → `text-white/50` (pisava, velikost, razmiki nespremenjeni) |
| A11Y-002 | `app/pristop/PristopPage.css` | `.apw .apw-written .apw-role` (samo “Usklajevanje”): bela .45 → .50 |
| A11Y-002 | `app/components/blocks/mini/ArtBiteGalleryProof.tsx` | “Galerija”: `#c9624a` → `#d4705a` (ista rjava-rdeča družina) |
| A11Y-003 | `UlteriorTechnicalProof.tsx` | številke seznama v mirovanju `#33333e/60` → `/75`; hover `/75` → `/90` (izbrana modra, fokus, način izbire nespremenjeni) |
| A11Y-004 | `UlteriorTechnicalProof.tsx` | `aria-label` obeh nizov gumbov: `Select detail: {title}` → `{number} — {title}`; `aria-pressed`, povezava točka↔podrobnost, miška/tipkovnica nespremenjeni |
| A11Y-007 | `UlteriorTechnicalProof.tsx` | `lang="en"` na korenski `div` angleškega prikaza |

## Kontrasti prej → potem

| Element | Podlaga | Prej | Potem |
|---|---|---|---|
| Podpisi (bela) | Flexido/Odstrani `rgb(22,26,33)` | 3,81 | 5,21 |
| | Ulterior `rgb(18,19,22)` | 3,83 | 5,31 |
| | Dema Plus `rgb(15,20,28)` | 3,82 | 5,30 |
| | ArtBite `rgb(31,23,18)` | 3,81 | 5,23 |
| | Hardshelljacket `rgb(22,24,28)` | 3,82 | 5,25 |
| “Usklajevanje” (/pristop) | Base `#080a0f` | 4,50 (4,498) | 5,33 |
| “Galerija” (ArtBite) | `#1f1712` | 4,48 | 5,27 |
| Ulterior številke 01–05 v seznamu | `#f3f6fa` | 3,58 | 5,43 (hover 8,54) |

“Potem” za podpise je izmerjeno na živi strani (sestavljena barva na dejanskem prvem neprosojnem ozadju), ostalo izračunano po WCAG formuli iz izmerjenih računskih barv; živi računski barvi “Usklajevanje” `rgba(255,255,255,.5)` in “Galerija” `rgb(212,112,90)` potrjeni. Oznaki “Vi”/“Bauma” nista spremenjeni.

## Preverjanje (Chromium 151, lokalni dev)

- **axe** (WCAG 2.0–2.2 A/AA), `/pristop` + 6 `/work/*`, 1440 in 375: **ni več** napak za podpise, “Usklajevanje”, “Galerija”, Ulterior številke, niti za imena/jezik. Preostanek (ni v tem sklopu): `/pristop` 7× `.apw-num` (dekorativne številke 01–04, `aria-hidden`, 3,81); `/work/ulterior` 1× “12 available now.” 4,11 (naročniški nakupni prikaz); `/work/odstrani-tattoo` 3× (2,03/3,48) in `/work/hardshelljacket` 1× (3,21) v rekonstrukcijah naročnikov. Vse ostaja za presojo/naslednji sklop.
- **Ulterior (dejanski Tab/Enter, 1440 in 375):** privzeto vseh 10 gumbov `aria-pressed=false`; imena npr. `01 — Detachable hood` (marker) in `01 — Detachable hood` (vrstica), ariaSnapshot: `button "01 — Detachable hood": "01"` / `…: 01 Detachable hood`. Enter na 3. točki izbere 03 (točka in vrstica), Enter na 2. vrstici izbere 02. Pri fokusu (Tab) se `aria-pressed` pokaže kot true zaradi obstoječega “fokus = predogled” (`onFocus`); to ni spremenjeno.
- **Jezik:** `div[lang=en]` je koren; angleški odstavek in gumbi podedujejo `en`; zunanji `role=group` “Ulterior: interaktivni razdelek …” in podpis pod prikazom ostaneta `sl`; `html lang=sl`. To je preverjeno v DOM; izgovorjava v dejanskem bralniku zaslona ni preverjena.
- **Prelivanje:** 0 px na `/pristop` in vseh šestih študijah pri 320, 375, 768, 1440.
- **TypeScript** `tsc --noEmit`: 0 napak. **ESLint** na spremenjenih TSX: 0 napak, 0 opozoril.
- Posnetki Ulterior zajeti po dokazano naloženi fotografiji (`hardshell-green-front` `complete && naturalWidth>0`).

## Omejitve

- Samo Chromium, lokalni dev; brez bralnika zaslona in brez Voice Control.
- Barve markerjev na fotografiji (`#33333e/70` na polprosojni beli) niso del tega sklopa; axe jih ne označi.
- Vizualna ocena le na posnetkih; spremembe so barvne, brez sprememb postavitve (prelivanja 0).

## Dokazni posnetki (`bauma-v3-a11y-fixes-pass1-evidence/`)

`flexido-caption-1440.png`, `pristop-usklajevanje-1440.png`, `artbite-galerija-1440.png`, `ulterior-default-1440.png`, `ulterior-default-375.png`, `ulterior-selected-1440.png`.
