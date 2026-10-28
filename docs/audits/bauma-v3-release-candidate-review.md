# BAUMA V3 — izolirani kandidat izdaje: sestava in preverjanje

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07926df85731122b430f25ae786a97f06a8` · zajem 2026-10-27T21:29:18Z. **To ni commit, staging objava ali ocena pripravljenosti za produkcijo.** Glavni projekt, Git index (staged: 0), `.gitignore` in necommitane spremembe so nespremenjeni. Dokazi: [mapa](./bauma-v3-release-candidate-review-evidence/).

**Lokacija kandidata** (ohranjen, ni izbrisan): `/private/tmp/claude-501/-Users-bauma-Applications-Projects-bauma-portfolio/086dd670-68a7-4770-9789-50650ab09784/scratchpad/candidate` (870 MB z `node_modules` in produkcijskim `.next`); sosednji CoW kopiji `candidate-stg` (staging gradnja) in `candidate-dev` (ločen `next dev` za labe). Mapa je v začasnem območju seje in jo lahko sistem počisti; stanje je **ponovljivo** iz `build-candidate.sh` + manifestov in preverljivo s [candidate-sha256.txt](./bauma-v3-release-candidate-review-evidence/candidate-sha256.txt).

## 1. Kaj kandidat vključuje

Sestava: `git archive HEAD` (439 sledenih datotek) + prepis **41** spremenjenih sledenih datotek iz delovnega drevesa + **13** dodanih datotek + `docs/audits` (1007 datotek; brez map tega koraka). Skupaj 1459 datotek. Vsaka datoteka kandidata je bajtno enaka datoteki v glavnem projektu (preverjeno s SHA-256: **0 razlik**). Brez commita, veje in spremembe indexa.

- **A1/A2** (41): vsi sledeni `M`, vključno z `next.config.ts`, `lib/siteEnv.ts`, `app/robots.ts`, `app/sitemap.ts`, `package.json`, `package-lock.json` ([manifest-modified](./bauma-v3-release-candidate-review-evidence/manifest-modified.txt)).
- **A3** (3): `lib/indexing.ts`, `app/not-found.tsx`, `app/components/blocks/mini/DemaPlusProjectProof.tsx`.
- **B** (4): `public/og/bauma-og-main-v3.png`, `public/work/dema-plus/proof/related-{debeli-rtic,golovec,hisa-soncek}.webp`.
- **C**: `docs/audits/**` (1007 datotek, brez čiščenja in stiskanja) in `docs/bauma-v2-visual-layer.md`.
- Sledeni labi (13 map, 16 poti) ostanejo; nesledeni lab eksperimenti (E) niso dodani.

### Dodatno vključeno po pregledu (utemeljene odvisnosti)

| Pot | Skupina | Porabnik | Razlog |
|---|---|---|---|
| `public/lab/home-proof-bridge/{dema-plus,flexido,odstrani-tattoo}.png` (176 KB) | E | sledena `components/lab/home-proof-bridge/constants.ts` (lab `/lab/home-proof-bridge`) | Sled. lab bi sicer prikazoval pokvarjene slike (v HEAD teh datotek ni). `.vercelignore` `public/lab` izključuje iz Vercel objave, zato na gostovanju ne vplivajo; v lokalni gradnji/dev da. |
| `app/en/mini/page.tsx` | G | `next.config.ts` (zapora `/en/mini`), komentarji v sledeni kodi, TECH-004 preverjanja | Brez nje `/en/mini` v stagingu ni 200 (pričakovan predogled). Uvaža samo sledene komponente. **Odprta odločitev**, ker v HEAD ni bila sledena. |
| `AGENTS.md` | G | – (navodila za agente) | Vsebina je Next-ovo upravljano navodilo (`<!-- BEGIN:nextjs-agent-rules -->`, zapisuje ga `next dev`, glej `node_modules/next/dist/server/lib/generate-agent-files.js`). Ni nujna za gradnjo; vključena, ker veljavna navodila veljajo tudi v kandidatu. **Odprta odločitev.** |

**Pregled »nereferenciranih« sredstev (G):** poleg uvozov sem iskal po nizih, CSS `url()`, predlogah in kodi s tipi `ts/tsx/css/mjs/json` ([asset-refs](./bauma-v3-release-candidate-review-evidence/asset-refs.cjs), [G-public-refcheck](./bauma-v3-release-candidate-review-evidence/G-public-refcheck.tsv)). 9 od 92 datotek ima ujemanje imena, a vsako je lažno (iste datoteke so že sledene na drugi poti: `public/favicon.ico`, `site.webmanifest` ikone, `work/flexido/proof/*`, `images/atmosphere/atmosphere-dune-01.webp`). Ostalih 83 ni v nobeni kodi → **izključene**. `.vercelignore` (sledeno) sam izključuje `public/raw`, `public/production-transfer`, `public/lab` in `*.mp4/*.webm`. Edini manjkajoči vir javne kode, `public/case/odstrani/flow-800x600-2.jpg` v `DecisionLayerCase.tsx`, manjka že v HEAD in komponento nihče ne uporablja.

Izključeno: F (`.claude/`, `lab-screenshots/`, `tmp/`, `.recovery/`, `test-results/`, `.playwright-browsers/`, `scripts/`), nesledeni labi in `public/lab` (razen 3 PNG), `MiniSelectedWork.tsx`, `components/home/approach/v2/copy.ts`, `MobileHeroObjectMotion.tsx`, `lib/heroParityProbe.ts`, `BAUMA — Content Review/`, preostala sredstva G. Dodatnih odvisnosti v `package.json`: **nobenih**.

## 2. Namestitev in gradnje

| Korak | Rezultat |
|---|---|
| `npm ci` (v kandidatu) | exit 0, 425 paketov; `package-lock.json` in `package.json` po namestitvi **nespremenjena** (SHA-256 pred/po enak). Next 16.4.1, React 19.2.3, ESLint 9.39.4, TypeScript 5.9.3 |
| `tsc --noEmit` | exit 0 (pred in po gradnji) |
| Gradnja A: `SITE_ENV=production VERCEL_ENV=production` | exit 0, 47 statičnih strani |
| Gradnja B (ločena): `SITE_ENV=staging VERCEL_ENV=production` | exit 0 |

## 3. Runtime preverjanje

**Produkcija (A)** ([http](./bauma-v3-release-candidate-review-evidence/http-production-summary.txt), [ovrednotenje](./bauma-v3-release-candidate-review-evidence/http-evaluation.txt)):
- 10 SL strani in `/en`: 200, `index, follow`, canonical = `og:url` = pričakovan URL, brez `X-Robots-Tag`; en `html` in `body`. OG slika `og:image` = `bauma-og-main-v3.png` (SL) / `bauma-og-en-v3.png` (EN). `/en` ima `lang="sl"` (odprto, EN prenova).
- Pravne strani (6) in novice (`/novice`, oba zapisa): 200, noindex. Neznana pot, neznan `/work/…`, `/en/…`, `/novice/…`: 404, noindex, brez canonical/hreflang/og:url, nova 404 z glavo.
- `/lab/hero-real-context`, `/lab/system`, lab datoteka, `/lab/home-proof-bridge`, `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview`: **404**. Lab slika prek optimizerja: **404**; projektne slike (Dema Plus nova `related-*`, Flexido): **200**.
- Nova OG slika: 200, `image/png`, veljaven PNG, **1200 × 630**, 59 333 B.
- `sitemap.xml`: **11 URL-jev, enak seznam**; `robots.txt`: `Allow: /` in sitemap.
- Brskalnik (Chromium 151, 19 strani pri 1440 × 900, 6 pri 375 × 812, z drsenjem do konca): **0** odgovorov ≥ 400, **0** pokvarjenih slik, **0** napak pisav, **0** `pageerror`/hydration, brez vodoravnega preliva. Edina zahteva, ki ne uspe: lokalni `/_vercel/insights/script.js` (ločeno). Flexido ima 8 že znanih opozoril o `preload` CSS kosih.
- Posnetki Home, `/work`, `/o-nas`, Dema Plus, Ulterior in 404 (obe širini) so **piksel za piksel enaki** posnetkom trenutnega celotnega drevesa (13/13; [primerjava](./bauma-v3-release-candidate-review-evidence/pixel-compare-candidate-vs-fulltree.txt)). Dopolnjena prikaza Dema Plus in Ulterior se izrišeta.
- Navigacija: logotip `/`, Pristop, Work, O nas na pravilne poti; na 404 nobena povezava ni označena kot aktivna; mobilni meni se odpre, Escape vrne fokus na »Odpri meni«; Kontakt (namizje in meni) vodi na `/#contact`; zahtev `mailto` ni bilo; nakup ni bil aktiviran.
- **Pisave:** italic Fraunces v manifestu **0 poti** (kandidat in celotno drevo), v surovem HTML ga ni, zahtev po hidraciji/drsenju/navigaciji 0 (11 poti, [runtime](./bauma-v3-release-candidate-review-evidence/font-runtime-candidate.txt)); normalni Fraunces ostane preloadan in se izriše (wordmark »ArtBite«). Home: 9 preloadov kot v celotnem drevesu; v CSS 22 @font-face / 19 unikatnih datotek proti 34 / 23 (odsotnost lab italic deklaracij). Pet poti ima drugačen nabor preloadov kot celotno drevo: `/en`, `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview` imajo v kandidatu +2 preloada IBM Plex Mono (8 proti 6, ~19 KiB; [primerjava](./bauma-v3-release-candidate-review-evidence/font-manifest-compare.txt)); zahteve pisav v brskalniku so enake (9 = 9), zato razlike ne štejem za regresijo, a jo zapisujem. Imen/hashev kosov nisem primerjal kot napak.
- **Sledeni labi** (`next dev` v `candidate-dev`): 16 poti, vse 200, 0 odgovorov ≥ 400, 0 pokvarjenih slik, 0 napak ([lab-dev](./bauma-v3-release-candidate-review-evidence/lab-dev-summary.txt)).

**Staging (B)** ([http](./bauma-v3-release-candidate-review-evidence/http-staging-summary.txt)): vse strani noindex meta in `X-Robots-Tag: noindex, nofollow`; brez canonical/hreflang/og:url (0 izjem); `robots.txt` `Disallow: /`; sitemap prazen (0 URL-jev); `/lab/**` **307 → `/`**; `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview` **200** noindex; lab slika prek optimizerja 404 (brez 500); projektne slike 200.

## 4. Lint kandidatovega obsega (nova, ločena osnova)

Ukaz kot pri zadnji osnovi: `./node_modules/.bin/eslint . --format json --output-file …` v kandidatu; exit 1; **373 datotek, 96 napak, 56 opozoril**. Napake: `docs/` 76 (dokazni `.cjs`, `no-require-imports`), `components/` 14 (`set-state-in-effect`, `refs`, `purity`), sledeni labi 6, `app/` 0. Opozorila: `components` 16, `docs` 25, `app` 11, labi 4 ([povzetek](./bauma-v3-release-candidate-review-evidence/eslint-summary.txt)). **To je nova osnova za drug obseg** (kandidat nima `.recovery`, `.claude`, `tmp`, `scripts`, nesledenih labov; `docs/` ima novejše dokazne skripte). **Števil 92/107 in 96/56 ne primerjam kot napredek ali nazadovanje**; diagnostike nisem popravljal. Celoten lint ne uspe tudi v kandidatu.

## 5. Odprti pogoji in omejitve

- **Projekt ni označen kot pripravljen za produkcijsko objavo; to ni odločitev tega koraka.** nobena gostovalna preverjanja (Vercel, CDN, HTTP/2, dejanske glave), pravilni `SITE_ENV`/`VERCEL_ENV` na projektih, absolutni OG URL, doseg `hardshelljacket.com`, terenski CWV/INP in zmogljivost na gostovanju niso preverjeni.
- **Odprte odločitve:** `app/en/mini/page.tsx` in `AGENTS.md` v kandidatu (G, odločitev Grega); usoda ostalih G; hramba dokazov in morebitni `.gitignore`; `/approach`, `/contact`, `/novice`; ArtBite wordmark; `/en` `lang="sl"` (EN prenova, ni uredniško sprejeta izjema); funkcionalni Safari in VoiceOver; A11Y-008.
- **TECH-001:** lint ne uspe (zgoraj).
- **Meje metode:** Chromium 151; `npm ci` je uporabil lokalni npm predpomnilnik (4 s); sledeni labi preverjeni v `next dev`, ne v produkciji; `candidate-dev`/`-stg` sta kopiji; pot v začasnem območju lahko sistem počisti; nova poročila tega koraka niso v kandidatu (manifest je zajet pred njihovo sestavo).
- Predlog novega uvoda `/work` ni izveden in ni del kandidata; po poznejši spremembi je treba manifest in preverjanje osvežiti.

## 6. Ali je obseg dovolj določen

Da za nadaljnjo sestavo in selektivni commit, **pod pogojem** odločitev o `app/en/mini/page.tsx`, `AGENTS.md`, hrambi dokazov in `.gitignore`. Manifest 41 + 13 + docs je zamrznjen in preverljiv; preostanek niso uvozne odvisnosti, temveč uredniške odločitve.
