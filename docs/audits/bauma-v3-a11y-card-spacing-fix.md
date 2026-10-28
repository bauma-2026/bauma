# BAUMA V3 — A11Y-005: besedilo projektnih kartic pri uporabniških razmikih (2026-10-25)

Veja `staging/bauma-v3`, HEAD `6b2fa07`. Obstoječe necommitane spremembe (hover/lift ipd.) ohranjene. Nič ni commitano, pushano ali deployano. Prvotni audit ni prepisan.

## Vzrok

Tri tipografske površine (Odstrani, Dema Plus, Flexido) v `MiniSelectedWorkSurfaces.tsx` imajo fiksno višino (`h-[18rem] sm:h-[19rem] lg:h-[21.25rem]`), `overflow-hidden` in notranji `h-full`. Ko uporabnik poveča razmik med vrsticami/črkami/besedami in odstavki, živo HTML besedilo potrebuje več prostora in se odreže. Na `/work` površine dobijo višino iz razmerja (`aspect-square`, `aspect-[4/3]` prek povezave); tam `overflow-hidden` dodatno izniči samodejni minimum višine (`min-height:auto` velja samo za škatle, ki niso drsni kontejnerji).

## Rešitev (samo CSS, brez JS merjenja)

- `MiniSelectedWorkSurfaces.tsx`, `SURFACE`: dodan `min-h-min` (višina je še vedno privzeta, a se površina razširi, če vsebina potrebuje več) in `overflow-hidden` → `overflow-clip` (enako zaobljeno obrezovanje, vendar ne drsni kontejner). Notranja škatla `h-full` → `min-h-full`, da raste skupaj s površino.
- `app/work/page.tsx`: `MOBILE_SQUARE` in `SHARED_43` (preglasitve višine samo na `/work`) dobita `min-h-auto`, da razmerje (kvadrat, 4:3) ostane privzeta oblika, višina pa lahko poraste ob večji vsebini. Za razmik 640–898 px `/work` uporablja fiksno višino `19rem`, kjer že deluje `min-h-min`.
- Ni zmanjšanja pisave, ni preglasitve uporabniških razmikov, ni posebnega “audit načina”; `overflow-hidden` ni odstranjen globalno (fotografske površine Ulterior/ArtBite/Hardshelljacket nespremenjene).

Spremenjeni datoteki: `app/components/blocks/mini/MiniSelectedWorkSurfaces.tsx`, `app/work/page.tsx` (2 niza).

## Privzeto stanje pred/po

Zajeta geometrija vseh kartic (višina/širina, položaj podpisa, okvirji vsakega besedilnega bloka relativno na kartico) na `/`, `/work`, `/pristop`, `/o-nas` pri 320, 375, 768, 1440 px: **60 kartic, 0 razlik** (viri: izhodišče in stanje po popravku; ista metoda). Višine privzetih površin: 320 → 288 (`/work` 272), 375 → 288 (`/work` 327), 768 → 304, 1440 → 340 (`/work` 438), kot prej. Pozicije besedila, izrezi in razmiki neodstopajo.

## Uporabniški razmiki

Metoda (enaka kot audit; začasno pravilo, vstavljeno v stran po nalaganju):

```css
* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important }
p { margin-bottom: 2em !important }
```

Za vsak blok besedila v kartici sem primerjal okvir besedila z okvirjem najbližjega prednika z izrezom (ne samo `scrollWidth`) in preveril prekrivanje podpisa/sosednjih kartic.

| Stran | Pred popravkom (odrezano) | Po popravku |
|---|---|---|
| `/`, `/pristop`, `/o-nas` | Odstrani do −42 px, Dema −32 px, Flexido −152 px (320: Dema, Flexido) | nič odrezano pri 320/375/768/1440 |
| `/work` | Flexido −39…−141 px, Dema −17…−32, Odstrani −3, | nič odrezano pri vseh širinah za tipografske površine |

Površine zrastejo (npr. 1440: Odstrani 340 → 385, Flexido 340 → 610, Dema 340 → 731 px na domu; `/work` 438 → 726 px za Flexido) — Dema je visoka tudi zaradi 2em razmika odstavkov po vsaki vrstici testnega pravila. Podpis kartice sledi površini (ni prekrivanja), karte v vrstici so poravnane zgoraj. **Po odstranitvi pravila se višine vrnejo točno na privzete** (preverjeno za dom in `/work`, 1440 in 375).

**200 %:** pravo brskalniško povečavo okolje ne omogoča; približek (viewport 720×450 oziroma 640×450 pri DPR 2) ni odrezal besedila na nobeni od štirih strani. Označeno kot približek.

## Hover, fokus, reduced motion, dotik

Po spremembi: dvig `translateY(-3px)`; `/` in `/pristop`, `/o-nas` 0,15 s, `/work` 0,22 s; podpis se ne premakne; fokusni obroč 2 px / offset 3 px; reduced motion brez premika in prehoda (`none`, 0 s); klik na `/work` in emuliran tap na `/pristop` odpreta `/work/flexido`.

## Opomba in omejitve

- **Ni popravljeno: ArtBite wordmark na `/work`** (≤898 px, ob uporabniških razmikih besedna znamka “ArtBite” sega ~70–85 px čez rob kartice). To je `aria-hidden` logotip v logo pisavi (`white-space: nowrap`, fotografska površina), del fiksne plakatne kompozicije; ime projekta je v dostopnem imenu povezave. Ni v obsegu (kompozicija fotografskih površin), zato ga puščam odprtega za presojo.
- Samo Chromium, lokalni dev. Ni preverjeno z dejanskim brskalniškim zoomom ali v Safariju (`overflow: clip` je podprt od Safari 16).
- Fotografske površine (Ulterior, Hardshelljacket) pri razmikih niso izgubile besedila.
- **TypeScript** `tsc --noEmit`: 0 napak. **ESLint** (obe datoteki): 0 napak/opozoril.

## Posnetki (`bauma-v3-a11y-card-spacing-evidence/`)

`{home,work}-{1440,375}-default.png` in `-spaced.png` (izbor projektov pred in med uporabniškimi razmiki).
