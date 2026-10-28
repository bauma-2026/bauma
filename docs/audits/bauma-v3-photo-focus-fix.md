# BAUMA V3 — PHC-001: fokus kontaktnega CTA nad fotografijo (2026-10-25)

Veja `staging/bauma-v3`, HEAD `6b2fa07`. Obstoječe necommitane spremembe ohranjene; nič ni commitano, pushano ali deployano. Prvotna poročila niso prepisana.

## Sprememba

Samo CSS, ena datoteka: `app/components/blocks/mini/MiniContactNaturalMidnight.css` (nov blok na koncu):

```css
[data-mini-palette] [data-contact-tone="natural-midnight"] [data-cta="primary"]:focus-visible {
  outline-color: #fff;
}
```

Selektor sledi dejanski strukturi: `data-contact-tone` je na `[data-closing-bookend]`, CTA `a[data-cta="primary"]` (MiniFinalCTA) je njegov potomec. Specifičnost je višja od skupnega `[data-mini-palette] [data-cta]:focus-visible` v `MiniButtons.css`, ki ostane nespremenjen; spreminja se samo barva obroča. Debelina 2 px, offset 3 px, sprožilec `:focus-visible`, gumb, napis, puščica, mailto in fokus iz FLOW-001 niso spremenjeni. `--mini-accent-text` ni spremenjen.

## Kontrast obroča prej/potem

Metoda: Chromium 151, DPR 2, viewport 1280/1440 × 900; fokus z dejanskim Tab na »Pošljite opis«; obroč začasno prosojen (`outline-color: transparent`), nato posnetek in vzorčenje 900 točk na središčnici obroča (4 px zunaj roba gumba, zaobljen pravokotnik) proti dejanski podlagi (fotografija z natural-midnight toniranjem). Meritev “prej” je ponovila vrednosti iz verifikacijskega poročila (min 2,78).

| Pot / širina | prej `#7c97f0`: min / p5 / <3:1 | potem `#fff`: min / p5 / <3:1 |
|---|---|---|
| `/work` 1280 | 2,78 / 2,83 / 31 % | **7,74** / 7,89 / 0 % |
| `/work` 1440 | 2,78 / 2,81 / 33 % | **7,74** / 7,83 / 0 % |
| `/pristop` 1280 | 2,83 / 2,91 / 18 % | **7,87** / 8,11 / 0 % |
| `/pristop` 1440 | 2,81 / 2,90 / 19 % | **7,84** / 8,08 / 0 % |

Bel obroč proti sosednjemu ozadju gumba (`#4169e1`) 4,85 : 1 (izračun). Točke z mediano kot v poročilu niso “najsvetlejše točke”, ampak celotna središčnica; obroč ob robu nima 100 % pokritosti zaradi antialiasinga, zato so min/p5 vzorčne vrednosti, ne dokaz za vsak piksel.

## Rezultati preverjanja (Chromium, dejanski Tab)

- `/work` (NM roomy) in `/pristop` (NM short) pri 375, 768, 1280, 1440: obroč `2px solid rgb(255,255,255)`, offset 3 px, gumb `#4169e1`, napis »Pošljite opis→«.
- Doseg novega pravila (1440, Tab): `/work`, `/pristop`, `/o-nas`, `/work/{flexido,ulterior,odstrani-tattoo,dema-plus,artbite,hardshelljacket}` → vse `NM=true`, bel obroč.
- Nespremenjeno: home zaključek (brez natural-midnight) ostane `rgb(124,151,240)`; hero CTA »Opišite projekt« modro; obroči glave, kartic, »Vsi projekti«, noge (`info@`, pravne povezave) in `Kontakt` nespremenjeni; sekundarni obroči niso spreminjani.
- Mirovanje in hover: brez obroča, ozadje `#4169e1` → hover `rgb(59,96,210)` kot prej; barva napisa bela.
- Kontakt → Enter → Tab: `/work` 1440 in `/pristop` 375 (prek menija): fokus po Enter na `#contact-heading`, po Tab na »Pošljite opis« z belim obročem. Pošta ni bila aktivirana.
- `git diff --check` na spremenjeni datoteki: čist. Ker gre samo za CSS, TypeScript/ESLint nista relevantna (ne preverjata CSS); vizualno in računsko preverjanje je v brskalniku zgoraj.

## Dokazni posnetki

`bauma-v3-photo-focus-fix-evidence/focus-work-1440.png`, `focus-pristop-1440.png`.

## Status

**PHC-001 je odpravljen za pregledani lokalni Chromium obseg** (navedene poti/širine, mirovanje + Tab). **Safari/WebKit ostaja odprt**, prav tako vmesne širine, staging in ročni pregled na dejanskem zaslonu; to ni trditev o popolni skladnosti strani.
