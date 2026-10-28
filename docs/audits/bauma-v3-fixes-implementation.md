# BAUMA V3 — izvedba štirih manjših popravkov (2026-10-25)

Osnova: veja `staging/bauma-v3`, HEAD `6b2fa07`. Obstoječe necommitane spremembe (hover `lift` na `/` in `/work`, `MiniServicesBoxes.css`, `MiniSystemHome.tsx`) so ohranjene. Nič ni commitano, pushano ali deployano. Prvotna poročila niso prepisana.

## Spremembe (9 datotek, +10/−10)

| Popravek | Datoteke | Sprememba |
|---|---|---|
| VIS-003 | `app/work/flexido/page.tsx` | uvod `lg:pt-32` → `lg:pt-36` |
| VIS-008 | `app/work/{flexido,ulterior,odstrani-tattoo,dema-plus,artbite,hardshelljacket}/page.tsx` | `FOCUS` = `focus-visible:outline-solid outline-2 outline-offset-3 outline-[color:var(--mini-accent-text,#7c97f0)]` (isti zapis kot `LINK_FOCUS`); podčrtaji, hover, `target`/`rel` nespremenjeni |
| VIS-005 | `app/pristop/page.tsx`, `app/o-nas/page.tsx` | `<MiniSelectedWorkHome … lift />`; privzeta vrednost propa in CSS nespremenjena |
| VIS-007 | `app/components/work/CaseStudyNav.tsx` | “Vsi projekti” `↗` → `→` |

## Preverjanje (Chromium 151, lokalni dev, localhost:3000)

- **Flexido vs Ulterior** (oznaka y / H1 y): 375: 112/149 = 112/149; 900: 128/169 = 128/169; 1024: 144/185 = 144/185; 1440: 144/185 = 144/185. Pod 1024 nespremenjeno.
- **Tab na zunanjih povezavah** (vseh 6, dejanski Tab, po 450 ms): `2px solid rgb(124,151,240)`, offset 3 px, podčrtaj ohranjen, `rel=noopener noreferrer`.
- **Kartice** (hover, umik, Tab; naslov y se ne premakne, puščica .48 → .92):
  - `/` 0.15 s, `/work` 0.22 s (nespremenjeno), `/pristop` 0.15 s, `/o-nas` 0.15 s; dvig `translateY(-3px)`, obroč fokusa 2 px / 3 px `#7c97f0`.
  - Reduced motion: `transform: none`, trajanje 0 s na vseh štirih.
  - Emulirani dotik (375, `hover:hover` in `pointer:fine` = false): prvi tap na `/pristop` in `/o-nas` odpre `/work/flexido`.
- **Prelivanje** `scrollWidth − clientWidth` = 0 na `/pristop`, `/o-nas` in vseh šestih študijah pri 320, 375, 768, 1440.
- **TypeScript** `tsc --noEmit`: 0 napak (celoten projekt). **ESLint** na 9 spremenjenih TSX: 0 opozoril/napak.

## Omejitve

- Samo Chromium, lokalni dev; staging ni preverjen. Dotik je emulacija, ne naprava.
- Prvi tap je preverjen kot navigacija; nisem merjil dviga med dejanskim dotikom (medija sta false, pravilo je zato neaktivno).
- Hover na `/work` ni bil primerjan piksel-za-piksel; potrjeno je samo trajanje in transformacija.

## Dokazni posnetki

`docs/audits/bauma-v3-fixes-evidence/`: `01-flexido-intro-1440.png`, `01-ulterior-intro-1440.png`, `02-focus-flexido.png`, `02-focus-hardshelljacket.png`, `03-hover-pristop.png`, `03-hover-o-nas.png`, `03-focus-pristop.png`, `03-focus-o-nas.png`.
