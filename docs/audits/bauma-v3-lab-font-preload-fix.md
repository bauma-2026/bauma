# BAUMA V3 — Fraunces: omejitev nepotrebnih lab preloadov

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07` (necommitano drevo). **Odločitev: sprememba je prenesena v glavni projekt** (11 vrstic, necommitano). Dokazi: [mapa](./bauma-v3-lab-font-preload-fix-evidence/).

## Sprememba

`preload: false,` (za `display: "swap",`) v vsaki od 11 lab `Fraunces({…})` deklaracij ([diff](./bauma-v3-lab-font-preload-fix-evidence/diff-main-vs-start.diff), [začetno stanje](./bauma-v3-lab-font-preload-fix-evidence/start-copies/), [skript](./bauma-v3-lab-font-preload-fix-evidence/apply-candidate.py)). Spremenjene vrstice v glavnem projektu so enake testiranemu kandidatu (11 dodanih, 0 drugih).

| Datoteka | Slog | Pripadajoči lab prikaz (preverjen) |
|---|---|---|
| `app/lab/_work-grid/WorkGridLab.tsx` | italic | `/lab/work-index-b` |
| `app/lab/work-artbite/WorkGridLab.tsx` | italic | `/lab/work-artbite/d3` |
| `app/lab/work-editorial-a-prime/page.tsx` | italic | `/lab/work-editorial-a-prime` |
| `app/lab/work-editorial-b-tall/page.tsx` | italic | `/lab/work-editorial-b-tall` |
| `app/lab/work-editorial-b/page.tsx` | italic | `/lab/work-editorial-b` |
| `app/lab/work-editorial-c/page.tsx` | italic | `/lab/work-editorial-c` |
| `app/lab/work-two-column/page.tsx` | italic | `/lab/work-two-column` |
| `app/lab/work-artbite-color/ArtBiteColor.tsx` | normal | `/lab/work-artbite-color` |
| `app/lab/work-artbite-terra/ArtBiteTerra.tsx` | normal | `/lab/work-artbite-terra` |
| `app/lab/work-artbite/ArtBiteVariants.tsx` | normal | `/lab/work-artbite` |
| `app/lab/work-posters/WorkGridPosters.tsx` | normal | `/lab/work-motion-trigger/current` |

**Razlika od poročila o pisavah:** poročilo je vseh 11 poimenovalo »Fraunces italic«. Dejansko je **7 italic** (`artbiteAccent`) in **4 normal** (`artbiteLogo`); vse `subsets: ["latin"]`, `axes: ["opsz","WONK"]`, `display: "swap"`. Seznam 11 datotek je enak, zato je sprememba enaka. Italic preload izhaja iz 7 italic deklaracij; 4 normal lab deklaracije na javne preloade ne vplivajo, ker normalni Fraunces ostane preloadan prek javnih deklaracij (`ArtBiteHeroProof.tsx`, `app/work/page.tsx`), ki jih nisem spreminjal. Družin, slogov, tež, podnaborjev, `font-display`, Inter/DM Serif/Plex, CSS in font datotek nisem spreminjal.

## Gradnji in primerjava (produkcija, `SITE_ENV=production`, `VERCEL_ENV=production`)

- **Manifest** ([raw](./bauma-v3-lab-font-preload-fix-evidence/raw/manifest-base-vs-cand.txt)): razlika samo na 102 od 168 poti (15 ne-lab); **edina odstranjena datoteka je Fraunces italic latin (`84585a44…`, 80,2 KiB)**, nič dodanega.
- **Surovi HTML javnih poti** ([tabela](./bauma-v3-lab-font-preload-fix-evidence/raw/html-preloads.md)): `/`, `/pristop`, `/work`, `/o-nas`, vseh 6 študij 10 → 9; `/en` 7 → 6; `/zasebnost` in `/en/privacy` 6 → 6 (nista imeli italic preloada). Vsi drugi preloadi (Inter ×2, DM Serif ×4, Plex ×2, Fraunces normal) ostanejo; Home preloadi: [pred](./bauma-v3-lab-font-preload-fix-evidence/raw/home-preloads-before.txt), [po](./bauma-v3-lab-font-preload-fix-evidence/raw/home-preloads-after.txt).
- **Po hidraciji, drsenju in odjemalski navigaciji** ([runtime](./bauma-v3-lab-font-preload-fix-evidence/raw/runtime-cand.json), 11 poti, Home → /pristop → /work → /work/artbite in /en → /en/privacy): osnova 10 pisav na vsaki poti, kandidat **9, italic Fraunces 0 zahtev v nobeni fazi**; med drsenjem in navigacijo pisave niso bile zahtevane (vse ob nalaganju). Normalni Fraunces se naloži (1 zahteva), wordmark »ArtBite« na `/work` in `/work/artbite` je po CDP izrisan s Fraunces (`isCustomFont: true`, 7 glifov), enako kot v osnovi. `/en` (v prejšnjem pregledu neizmerjen): 10 → 9 pisav, brez napak.

## Meritve Home pred/po (mobile 375 × 812, DPR 2, CPU ×4, 1,6 Mbps, 150 ms RTT; 3 prepleteni pari ABABAB, nov kontekst, hladni zagon vsake različice zavržen; desktop 1440 × 900)

| Profil | Različica | n | FCP ms | LCP ms | LCP element | CLS | pisav (zahtev) | pisav KB | zadnja pisava konec ms | prenos KB | zahtev skupaj |
|---|---|---|---|---|---|---|---|---|---|---|---|
| mobile | osnova | 3 | 1392 (1364–1400) | 3780 (3772–3800) | div.bauma-hero-photo.pointer-events-none | 0 (0) | 10 (10) | 417.4 (417.4) | 4123 (4103–4124) | 796 (796) | 40 (40) |
| mobile | kandidat | 3 | 1184 (1184–1192) | 3416 (3408–3436) | div.bauma-hero-photo.pointer-events-none | 0 (0) | 9 (9) | 337.2 (337.2) | 3723 (3701–3730) | 716 (716) | 39 (39) |
| desktop | osnova | 3 | 112 (100–128) | 112 (100–128) | span.bauma-hero-h1-desktop.bauma-hero-h1-sentence | 0 (0) | 10 (10) | 417.4 (417.4) | 23 (19–26) | 984 (984) | 57 (57) |
| desktop | kandidat | 3 | 120 (116–120) | 120 (116–120) | span.bauma-hero-h1-desktop.bauma-hero-h1-sentence | 0 (0) | 9 (9) | 337.2 (337.2) | 25 (24–26) | 903 (903) | 56 (56) |

Mobile: FCP −208 ms (1392 → 1184), LCP −364 ms (3780 → 3416; element enak `div.bauma-hero-photo`), pisave 10 → 9 zahtev, −80,2 KiB (417,4 → 337,2), skupni prenos −80 KiB (796 → 716), zadnja pisava ~400 ms prej, CLS 0; razponi se ne prekrivajo (3 pari, dodatnih parov ni bilo treba). Namizno: razlika v FCP/LCP je v šumu (112 vs 120 ms, razpona se prekrivata), prenos −81 KiB, CLS 0. Razmerje je skladno z mehanizmom (manj bajtov v skupni pasovni širini), vendar je to lokalna emulacija.

**Videz:** stabilizirana prikaza Home pri 375 × 812 in 1440 × 900 sta piksel za piksel enaka ([pixel-compare-home](./bauma-v3-lab-font-preload-fix-evidence/pixel-compare-home.txt)); prav tako celostranski posnetki `/en`, `/work`, `/work/artbite` pri obeh širinah (6/6 enakih, [pixel-compare-public](./bauma-v3-lab-font-preload-fix-evidence/pixel-compare-public.txt)). Začetni prikaz besedila ni poznejši (FCP zgodnejši; naslov DM Serif nespremenjen).

## Lab prikazi (`next dev` v ločenih kopijah; produkcija jih zapira)

Vseh 11 prikazov odpira 200 brez napak; pri vsakem je Fraunces po CDP izrisan kot lastna pisava (italic: `Fraunces-Italic`, normal: `Fraunces-Regular_opsz…_WONK…`), enaki `FontFace` statusi kot v osnovi, in **posnetki so piksel za piksel enaki** ([lab-pixel-and-timing](./bauma-v3-lab-font-preload-fix-evidence/lab-pixel-and-timing.txt), [lab/](./bauma-v3-lab-font-preload-fix-evidence/lab/)). Število `link rel=preload as=font` v DOM je v dev 9–10 → 8; pisava se naloži ob uporabi. **Zabeleženo tveganje:** brez preloada se datoteka Fraunces v dev zahteva prek CSS, ~22–31 ms po ostalih pisavah (pri `/lab/work-index-b` ~62 ms), medtem ko se je v osnovi začela hkrati z njimi (lokalno, brez omejevanja; to je začetek zahteve, ne izmerjen trenutek izrisa); na počasni povezavi bi lahko bil prehod nadomestna → Fraunces na lab straneh opazen. Labi so v produkciji zaprti, na stagingu preusmerjeni; tveganja FOUT na lab straneh zato ne izključujem.

## Preverjanje kode

ESLint na 11 spremenjenih datotekah: 0 napak in 0 opozoril pred in po (enake diagnostike); `tsc --noEmit` 0; `git diff --check` 0. Nespremenjeno: konfiguracija, odvisnosti, lockfile, metapodatki, OG slike, indeksiranje, zapore razvojnih poti, Git staging.

## Odločitev

Vsi pogoji izpolnjeni: italic prenos izgine na vseh pregledanih javnih poteh tudi po hidraciji, drsenju in navigaciji; potrebne pisave in javni prikazi ostanejo (normalni Fraunces, wordmark, piksel-identični posnetki); FCP/LCP/CLS brez regresije (mobile izboljšanje, desktop v šumu); lab prikazi uporabni in enako izrisani. **Sprememba je v glavnem projektu (necommitana).**

## Omejitve

Lokalne laboratorijske meritve (en računalnik, ena emulacija, 3 pari + hladni par); ne terenski Core Web Vitals; Vercel/CDN in HTTP/2 prioritizacija niso preverjeni (izboljšava LCP je lahko drugačna); Chromium 151; trenutek zamenjave pisave ni izmerjen; lab prikazi preverjeni v `next dev` (ne v produkciji); normalni Fraunces (66,2 KiB) je še vedno preloadan na Home in drugih poteh, kjer ni potreben (naslednja ločena hipoteza z odločitvijo o FOUT wordmarka); `work.bauma.si` ostaja noindex, `bauma.si` nespremenjen.
