# BAUMA V3 — predlog nove glavne OG slike

Datum: **27. 10. 2026**. **Status: vizualno potrjen in lokalno integriran (27. 10. 2026).** Slika ni povezana z metapodatki, stare OG slike (`public/og/*`) niso spremenjene, ni javne preview ali lab poti. Title, description, OG/Twitter metapodatki in njihov predlog, politika indeksiranja, canonical, hreflang, robots, sitemap, lang in konfiguracija so nespremenjeni. Brez namestitev, gradenj, commita, pusha ali deploya. Dev strežnik na 3000 ni bil ustavljen; začasnega strežnika ni bilo (izvoz teče prek `file://`). `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Projektne OG slike in EN različica niso del tega koraka.

## Datoteke

| Datoteka | Vsebina |
|---|---|
| `bauma-og-main-candidate.png` | **novi predlog**, 1200 × 630 px |
| `og-main-candidate.html` | izvor (HTML/CSS) |
| `export.cjs` | ponovljiv izvoz: `node docs/audits/bauma-v3-og-proposal/export.cjs` |
| `export-check.json` | izhod preverjanja pri izvozu |
| `preview-600x315.png`, `preview-300x158.png` | zmanjšana predogleda (Lanczos) |
| `fonts/` | štiri datoteke DM Serif Display (normal + italic, latin + latin-ext), nespremenjene kopije tistih, ki jih Home streže prek `next/font` |
| `assets/bauma-logo.svg` | nespremenjena kopija `public/logo/bauma-logo.svg` |

## Odločitve

- **Besedilo:** »Spletne strani, ki pomagajo pridobivati stranke.«, v treh vrsticah »Spletne strani,« / »ki pomagajo« / »pridobivati *stranke.*« (prelomi sledijo Homeovemu `bauma-hero-keep` za »ki pomagajo« in zadnjo besedo v ležeči pisavi, kot na Home).
- **Pisava (izmerjeno na Home heroju):** DM Serif Display, teža 400, razmik črk −0,025 em (−1,8 px pri 72 px), višina vrstice 1,0, brez optičnega prilagajanja; zadnja beseda v pravi ležeči različici (ne poševnem rimu). Na OG sliki 112 px (Home hero: 72 px).
- **Znamka:** `public/logo/bauma-logo.svg`, nespremenjen, v belo obrnjen z istim filtrom `invert` kot v glavi Home. Širina 132 px (v glavi 90 px), zgoraj levo.
- **Barve:** ozadje `#080808` (osnova Home heroja in telesa); besedilo `#ffffff`; poudarek `#7c97f0` (modri odtenek, ki ga Home uporablja za oznake odsekov, izmerjen `rgb(124,151,240)`), uporabljen samo za besedo »stranke.«. Homeov royal blue `#4169e1` je polnilo CTA gumba in na `#080808` doseže samo 4,13 : 1; `#7c97f0` doseže 7,19 : 1 in ostane viden tudi v zmanjšanem predogledu. Bela na ozadju 20,03 : 1.
- **Razporeditev:** levi in desni rob 80 px, znamka 72 px od vrha, naslov 72 px od spodnjega roba; med znamko in naslovom je prazen prostor. Brez fotografije, drugega besedila, gumbov, ikon in dekoracije.

## Preverjanje

- PNG je natanko **1200 × 630** (`sharp` metadata, `export-check.json`).
- Pisave so pred zajemom naložene (`document.fonts.ready` in izrecen `load`; `check` za normalno in ležečo različico, tudi za č, š, ž, je pozitiven); znamka naložena.
- Besedilo (`innerText`): »Spletne strani, / ki pomagajo / pridobivati stranke.«; izvorno besedilo ne vsebuje šumnikov, test znakov č š ž ima pisavo naloženo.
- Ni rezanja ali elementov zunaj platna: vrstice naslova ležijo med x 80 in 990 (od 1200) ter y 201–579 (od 630); znamka x 80–212, y 72–98; brez prelivanja strani.
- Vizualni pregled polne velikosti, 600 × 315 in 300 × 158: znamka in naslov berljiva, dovolj odmika od robov, modra beseda ostane vidna.

## Omejitve in odprto

- Vizualno potrjeno s strani naročnika (27. 10. 2026). Integracija je lokalno izvedena (razdelek »Integracija« spodaj).
- Pisave so Google Fonts (SIL OFL) in so v mapi samo za ponovljiv izvoz predloga.
- `bauma-logo.svg` iz glave je črn; v belo ga obrne CSS filter (kot v glavi). Bela različica `bauma-logo--white.svg` ima nekoliko drugačne poti, zato ni uporabljena.
- Ob potrditvi: kopija v `public/og/`, povezava v metapodatke (skupaj z uskladitvijo OG/Twitter naslovov in opisov) in preverjanje v produkcijski gradnji so ločen korak.

## Integracija (27. 10. 2026)

- **Kopija:** `public/og/bauma-og-main-v3.png` je bajtno enaka `bauma-og-main-candidate.png` (SHA-256 `8c3a936e…abc3`), 1200 × 630. Stare slike (`bauma-og-v3.png`, `bauma-og-en-v3.png` in druge) niso spremenjene ali odstranjene (kontrolne vsote ujemajo pred in po).
- **Povezava:** `lib/indexing.ts` (`SL_SOCIAL_IMAGE`, `slPageMetadata`) uporablja novo sliko za `og:image` in `twitter:image` (absolutni URL prek `metadataBase`, `https://bauma.si/og/bauma-og-main-v3.png`), z `og:image:width/height` 1200/630 in alt »Bauma — Spletne strani, ki pomagajo pridobivati stranke.«, samo na desetih glavnih SL straneh. `ROOT_OPEN_GRAPH` ter EN, pravne in druge strani ostanejo na prejšnji sliki.
- **Lokalno preverjeno:** slika se streže z 200 `image/png` 1200 × 630 v obeh lokalnih produkcijskih gradnjah. **Dosegljivost absolutnega URL-ja `https://bauma.si/og/bauma-og-main-v3.png` bo mogoče preveriti šele po objavi**; na živem bauma.si slike še ni in je nisem zahteval.
- Podrobnosti: [bauma-v3-sl-metadata-implementation.md](../bauma-v3-sl-metadata-implementation.md).

## Angleška različica (28. 10. 2026)

- **Predlogi (izvor):** `og-main-candidate.html` (SL, »Spletne strani, / ki pomagajo / pridobivati *stranke.*«) in `og-main-en-candidate.html` (EN, »Websites that / help you win / new *clients.*«). EN predloga se od SL razlikuje samo po `lang="en"`, `<title>` in treh vrsticah besedila; pisave, velikosti, barve, postavitev in znamka so iste.
- **Izvoz SL (privzeto, nespremenjeno):** `node docs/audits/bauma-v3-og-proposal/export.cjs` → `bauma-og-main-candidate.png`, `preview-600x315.png`, `preview-300x158.png`, `export-check.json` v tej mapi. Ponovni izvoz je bajtno enak `public/og/bauma-og-main-v3.png` (SHA-256 `8c3a936e…abc3`).
- **Izvoz EN (izrecen vhod in izhod):** `node docs/audits/bauma-v3-og-proposal/export.cjs docs/audits/bauma-v3-og-proposal/og-main-en-candidate.html docs/audits/bauma-v3-og-proposal/bauma-og-main-en-candidate.png` → ob izhodu še `<ime>-preview-600x315.png`, `<ime>-preview-300x158.png` in `<ime>-export-check.json`. Objavljena slika `public/og/bauma-og-main-en-v3.png` je bajtno enaka kopija izvoza (SHA-256 `6341a370…`); uporablja jo `EN_SOCIAL_IMAGE` v `lib/indexing.ts` na desetih glavnih EN straneh.
- **Izvor in ustvarjene datoteke:** v git so samo izvorne datoteke (obe predlogi HTML, `export.cjs`, `fonts/`, `assets/bauma-logo.svg`, ta README). Kandidatni PNG-ji, predogledi in `*export-check.json` so ustvarjeni z izvozom in niso v gitu; objavljeni sliki sta v `public/og/`.
