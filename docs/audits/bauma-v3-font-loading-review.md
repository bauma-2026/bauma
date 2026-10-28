# BAUMA V3 — pregled začetnega nalaganja pisav

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07` (necommitano drevo). **Samo pregled in meritev**; koda, konfiguracija in pisave so nespremenjene. Dokazi: [mapa](./bauma-v3-font-loading-review-evidence/).

## Povzetek

Home ob začetku prenese **10 datotek pisav, 427 446 B (417,4 KiB)** (v baseline zapisano kot »427 KB«). Vse so `<link rel="preload" as="font">` v surovem HTML in se začnejo ob ~175 ms (prioriteta High, iniciator: razčlenjevalnik). Potrebne za izris Home je **6** (257 KiB); **dve datoteki Fraunces (146,4 KiB, 35 % pisav, ~18 % prenosa Home mobilno) Home ne uporablja nikjer** — nista bili izrisani, `FontFace.status` je ostal `unloaded`, kljub prenosu. Italic Fraunces (80,2 KiB) ni uporabljen na nobeni preverjeni javni strani; izvira iz lab kode.

## 1. Inventura desetih datotek ([inventory.md](./bauma-v3-font-loading-review-evidence/inventory.md))

| # | Datoteka | Družina · slog · teža | Podnabor | KB | Konec prenosa ms (mobile, 2. zagon) | Home: uporaba (nad/pod pregibom, znakov) | Druge strani | Definicija |
|---|---|---|---|---|---|---|---|---|
| 1 | `0c8f209abc35ee02` | DM Serif Display · normal · 400 | latin | 17.7 | 734 | da (26/0, 20 znakov) | /work: ne; /work/artbite: ne; /o-nas: da (20/0); /pristop: da (16/0); /work/ulterior: ne | app/layout.tsx (400, normal + italic, latin + latin-ext, preload) |
| 2 | `234d9015b631dab9` | Inter · normal · 100 900 | latin | 71.6 | 1679 | da (40/547, 52 znakov) | /work: da (70/272); /work/artbite: da (109/275); /o-nas: da (79/354); /pristop: da (70/472); /work/ulterior: da (114/424) | app/layout.tsx (Inter, osi opsz, latin + latin-ext, preload) |
| 3 | `26a0a19eb96a029d` | DM Serif Display · italic · 400 | latin-ext | 7.4 | 527 | **ne** (brez izrisanih znakov) | /work: ne; /work/artbite: ne; /o-nas: ne; /pristop: ne; /work/ulterior: ne | app/layout.tsx (400, normal + italic, latin + latin-ext, preload) |
| 4 | `68757d6cddeff913` | IBM Plex Mono · normal · 500 | latin-ext | 8.9 | 569 | da (0/1, 1 znakov) | /work: ne; /work/artbite: ne; /o-nas: ne; /pristop: ne; /work/ulterior: ne | app/homeMono.ts (500, latin + latin-ext; uvoz v Home, /work, /pristop, /o-nas, študijah) |
| 5 | `84585a440835450c` | Fraunces · italic · 100 900 | latin | 80.2 | 1886 | **ne** (brez izrisanih znakov) | /work: ne; /work/artbite: ne; /o-nas: ne; /pristop: ne; /work/ulterior: ne | samo lab (11 datotek v app/lab z Fraunces italic) |
| 6 | `8dd8a3188b79fd8f` | DM Serif Display · normal · 400 | latin-ext | 6.9 | 1392 | **ne** (brez izrisanih znakov) | /work: ne; /work/artbite: ne; /o-nas: ne; /pristop: da (1/0); /work/ulterior: ne | app/layout.tsx (400, normal + italic, latin + latin-ext, preload) |
| 7 | `c88e89b5552bf96c` | Inter · normal · 100 900 | latin-ext | 130.9 | 4117 | da (1/19, 3 znakov) | /work: da (1/7); /work/artbite: da (0/8); /o-nas: da (8/9); /pristop: da (6/20); /work/ulterior: da (1/10) | app/layout.tsx (Inter, osi opsz, latin + latin-ext, preload) |
| 8 | `effe91970fc4db64` | IBM Plex Mono · normal · 500 | latin | 10.1 | 1636 | da (0/45, 21 znakov) | /work: da (4/16); /work/artbite: da (0/5); /o-nas: da (5/0); /pristop: da (28/37); /work/ulterior: da (0/5) | app/homeMono.ts (500, latin + latin-ext; uvoz v Home, /work, /pristop, /o-nas, študijah) |
| 9 | `f09f1e5369ac4c93` | Fraunces · normal · 100 900 | latin | 66.2 | 3051 | **ne** (brez izrisanih znakov) | /work: da (0/6); /work/artbite: da (6/0); /o-nas: ne; /pristop: ne; /work/ulterior: ne | app/components/blocks/mini/ArtBiteHeroProof.tsx in app/work/page.tsx (latin, normal, opsz+WONK) + lab |
| 10 | `fad69795a077455b` | DM Serif Display · italic · 400 | latin | 17.5 | 1963 | da (8/0, 8 znakov) | /work: ne; /work/artbite: ne; /o-nas: ne; /pristop: ne; /work/ulterior: ne | app/layout.tsx (400, normal + italic, latin + latin-ext, preload) |

Pisave so v `app/layout.tsx` (Inter, DM Serif Display), `app/homeMono.ts` (IBM Plex Mono) in Fraunces v `ArtBiteHeroProof.tsx`, `app/work/page.tsx` ter 11 lab datotekah ([seznam](./bauma-v3-font-loading-review-evidence/raw/lab-fraunces-files.txt)). Vse deklaracije so `font-display: swap`. 34 @font-face deklaracij v CSS kazalo na 22 unikatnih datotek (Fraunces je deklariran večkrat z isto datoteko; prenesena je enkrat, podvojenega prenosa ni). »Uporaba« = znaki vidnega besedila, preslikani na datoteko prek `unicode-range`, družine, sloga in teže; ne zajema pseudo-elementov in morebitnega besedila v SVG. DM Serif latin-ext (št. 3 in 6) je na Home po `FontFace.status` »loaded«, čeprav moja preslikava ne najde znaka — vzrok ni pojasnjen (zato ju ne štejem med potrjeno nepotrebni).

**Šumniki:** č, š, ž spadajo v latin-ext. Inter latin-ext (130,9 KiB) je dejansko potreben (na Home 3 različni znaki, 1 nad pregibom v »Opišite projekt«); Plex latin-ext (»ZA ZAČETEK«). Podnaborja latin-ext zato ne predlagam za odstranitev.

## 2. Surovi HTML in omrežje

- Surovi HTML Home: 10 preload povezav (`as="font" crossorigin type="font/woff2"`), brez `media`. Preload izhaja iz `next-font-manifest.json`: Home, /work, /o-nas, /pristop, vse študije in druge strani s skupnim blokom (102 od 168 poti vključno z lab) imajo obe datoteki Fraunces; /novice, /zasebnost in podobne ju nimajo.
- **Vzrok (deloma potrjen):** Fraunces italic je deklariran samo v lab datotekah, pa je v CSS in manifestu javnih strani (skupni CSS kosi `0li7bl7…`, `1o4y1ys6…`). Diagnostična kopija z `preload: false` **samo** na 11 lab Fraunces deklaracijah odstrani italic preload z vseh 15 poti z drugačnim številom preloadov (`raw/manifest-base-vs-variantL.txt`; Home 10 → 9). Normal-latin (66,2 KiB) ostane — izvira iz javnih deklaracij (`ArtBiteHeroProof`, `/work`) in je potreben samo na /work (pod pregibom) in /work/artbite (nad pregibom).
- Prenos po nalaganju: **0** novih pisav med drsenjem (mobile in desktop) ali navigacijskim prefetchingom.
- Podvajanje: brez podvojenih prenosov.

## 3. Vpliv na prikaz (mobile 375 × 812, DPR 2, CPU ×4, 1,6 Mbps/150 ms; 3 zaporedni zagoni, nov kontekst; 1. zagon je hladni optimizer)

| Zagon | FCP ms | LCP ms (element) | CLS | zadnja pisava konča ms |
|---|---|---|---|---|
| 1 (hladni) | 1496 | 4116 (`div.bauma-hero-photo`) | 0 | 4015 |
| 2 | 1384 | 3772 (isti) | 0 | 4117 |
| 3 | 1400 | 3780 (isti) | 0 | 4116 |

Namizno (1440 × 900, brez omejevanja): FCP 56 ms, LCP naslov `span.bauma-hero-h1-desktop`, vse pisave končane v ~66 ms, CLS 0. Druge strani (mobile, 1 zagon): /work FCP 1296, /o-nas 1272, /work/ulterior 1236 ms — vsaka z enakimi 10 datotekami.

**Naslov in zamenjava pisave:** DM Serif latin (17,7 KiB) konča ob 734 ms, pred FCP (≈1,4 s), zato se naslov izriše že z DM Serif. Inter latin konča ob ~1680 ms (po FCP): besedilo se najprej izriše z nadomestno pisavo (`Inter Fallback`, prilagojena metrika) in se zamenja ob ~1,7 s; Inter latin-ext (130,9 KiB) konča šele ob ~4,1 s, torej znaki č/š/ž v besedilu ostanejo v nadomestni pisavi do takrat. CLS 0 kaže, da zamenjava ne premakne postavitve. **Dejanskega trenutka izrisa zamenjave nisem mogel zanesljivo izmeriti** (dogodek `loadingdone` je en sam, ob koncu; konec prenosa je le približek).

**Diagnostika (ne predlog):** HTML brez preload povezav (Playwright route; kode nisem spreminjal) da FCP 584–612 ms namesto 1384–1400 ms, LCP 3524–3544 ms, a React/Next po hidraciji ~2,4 s znova vstavi preload povezave (10 v DOM), zato je meritev uporabna samo za prvih ~2,4 s. V tem oknu brskalnik sam zahteva **6 datotek** (Inter latin + latin-ext, DM Serif latin normal + italic, Plex latin + latin-ext, ob ~555–590 ms); preostale 4 (DM Serif latin-ext ×2, Fraunces ×2) šele po ~2,4 s ([raw](./bauma-v3-font-loading-review-evidence/raw/fonts-no-preload.json)). To podpira, da preloadanih deset datotek tekmuje s CSS in hero fotografijo; **vpliva na LCP ne trdim** in globalnega izklopa preloadov ne predlagam.

## 4. Presoja

| Možnost | Korist (pričakovana, ne izmerjena) | Tveganje FOUT/premiki | Poti |
|---|---|---|---|
| **A. `preload: false` na 11 lab Fraunces deklaracijah** (italic) | −80,2 KiB zgodnjega prenosa (19 % pisav, ~10 % prenosa Home mobilno) na ~15 javnih poteh; mehanizem: manj bajtov, ki tekmujejo s CSS/hero slikama | Za javne strani nobeno: italic Fraunces ne izriše nikjer; labi so zaprti v produkciji (fonti na zahtevo v dev) | Home, /work, /o-nas, /pristop, študije |
| B. `preload: false` na javnih Fraunces deklaracijah | −66,2 KiB na Home, /o-nas, /pristop, /work/ulterior … | **FOUT** wordmarka »ArtBite« na /work/artbite (nad pregibom) in /work; Next uporablja prilagojeno nadomestno pisavo (CLS ≈ 0), a videz se zamenja | Kot A + /work, /work/artbite izgubita preload |
| C. Preload samo za Inter/DM Serif latin | −(Plex, ext, Fraunces) | Č/š/ž in Plex eyebrows FOUT; nerazčlenjen vpliv | vse |

Dokazano ne-nepotrebno: Inter (obe), DM Serif latin (obe), Plex (obe). Ni podvojenih definicij z različnimi datotekami. Pisave ostajajo kot so (družine, teže, znaki); ne predlagam zamenjave, podnaborjenja, CDN ali globalnega izklopa preloadov.

## 5. Predlagani en kandidat za poznejši preizkus pred/po

**A**: v 11 datotekah iz `raw/lab-fraunces-files.txt` (vse `app/lab/**`) dodati `preload: false` v `Fraunces({...})` deklaracije. Prizadete poti: lab (zaprte) ter manifest ~15 javnih poti. Preverjanje: `next-font-manifest.json` (odstranjen 84585…), surovi HTML (9 namesto 10 preloadov), isti mobilni profil kot v baseline (3–5 prepletenih parov FCP/LCP/CLS, prenos ≈ −80 KiB), vizualno enako (pixel-compare, reduced motion), ESLint/tsc. Verjeten učinek je majhen (~80 KiB); če LCP ne reagira (kot pri `fetchPriority`), B pred posegom zahteva svojo odločitev o FOUT wordmarka.

## 6. Omejitve

Lokalne laboratorijske meritve (en računalnik, ena emulacija, 3 zagoni, 1. zagon hladni optimizer); ne terenske CWV; hosting, CDN in HTTP/2 prioritizacija niso preverjeni; izris pisav brez GPU/pravih naprav; trenutek zamenjave pisave ni izmerjen; uporaba je določena iz vidnega besedila (brez pseudo-elementov/SVG); samo Chromium 151; `/en` ni merjen; vzrok manifesta za javne poti je potrjen z eno diagnostično variant (kopija).
