# BAUMA V3 — TECH-001: enotna lint osnova in razvrstitev

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07926df85731122b430f25ae786a97f06a8`. **Samo pregled.** Koda, konfiguracija, pravila, odvisnosti in lockfile niso spremenjeni; popravki niso izvedeni. Dokazi: [mapa](./bauma-v3-lint-baseline-review-evidence/).

## 1. Osnova (enoten obseg)

| Postavka | Vrednost |
|---|---|
| Ukaz | `./node_modules/.bin/eslint . --format json --output-file …/eslint-raw.json` (brez `--fix`) |
| Okolje | Node v25.6.1, npm 11.9.0, ESLint v9.39.4 (lokalni) |
| Konfiguracija | `eslint.config.mjs`: next core-web-vitals + typescript; obstoječi ignore (`.next`, `out`, `build`, `next-env.d.ts`, `scripts/archive`); brez novih izključitev |
| Izhodna koda | 1 |
| Obseg | **719 datotek v delovnem drevesu** (ne izolirana kopija), 100 z diagnostiko |
| **Rezultat** | **92 napak, 107 opozoril** |

`npm run lint` je v `package.json` samo `eslint` brez `--fix`; uporabil sem neposredni enakovredni ukaz z izrecnim `.` in JSON izhodom. Lint zajame tudi `.claude/`, `.recovery/`, `tmp/`, `docs/` (dokazni `.cjs` skripti) in `scripts/` — ker jih konfiguracija ne izključuje. Surovi izpis: [eslint-raw.json](./bauma-v3-lint-baseline-review-evidence/eslint-raw.json).

**Zgodovinske meritve (26/69, 37/91, 32/78) so imele drugačen obseg in niso primerjava s to osnovo.** Pojasnilo samo za razumevanje, ne kot napredek: 37/91 je bil isti obseg v drevesu (22 napak v `app/components/lib`, 15 v pomožnih mapah). Izvorna koda (`app/`, `components/`, `lib/`) ima tudi zdaj **22 napak**; porast na 92 je v celoti v pomožnih mapah (`docs/` 63 napak, ker so se medtem dodali dokazni `.cjs` skripti z `no-require-imports`; `.recovery/` 7).

## 2. Razvrstitev napak

Dosegljivost: statični uvozi in `import("…")` z nizom iz vstopnih točk strani ([reachability.cjs](./bauma-v3-lint-baseline-review-evidence/reachability.cjs), [povzetek](./bauma-v3-lint-baseline-review-evidence/reachability-summary.txt), [datoteke](./bauma-v3-lint-baseline-review-evidence/categories.json)). Zaprte poti so tiste v `next.config.ts` (`/lab/*`, `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview`). Neliteralnih dinamičnih uvozov v kodi ni našlo iskanje.

| Kategorija | Napake | Opozorila | Opomba |
|---|---|---|---|
| A. javna SL stran ali komponenta | **0** | 2 (`FlexidoHomeProof`, `no-img-element`) | |
| B. javna EN stran | **0** | 0 | |
| C. skupna koda (javne + zaprte poti) | **2** | 8 | obe napaki: V2 hooka (glej §3) |
| D. samo lab/preview/zaprte poti, ki so v gradnji | **20** | 14 | |
| D. nedosegljiva koda (skripte, nekoriščeno) | 0 | 45 | `scripts/` 33 opozoril |
| E. začasne, obnovitvene, dokazne datoteke | **70** | 38 | `docs/` 63 (`no-require-imports`), `.recovery/` 7 |
| **Skupaj** | **92** | **107** | |

Napake kategorije D (20): `components/home/change/*` (6; ChangeSection, useChangeAutoplay, useFinePointer, useReducedMotion), `components/home/approach/ApproachInteractiveSection.tsx` (2) in `useApproachAmbient.ts` (3), `components/lab/hero-object-reframe/useEdgeContextInteraction.ts` (6), `components/work-preview/WorkPreviewModal.tsx` (2), `app/lab/…` (2). Vse so doseglive samo iz zaprtih poti (lab, `/mini`, `/en/mini`, `/about-preview`). Pravila: `set-state-in-effect` 8, `refs` 8, `purity` 3, `immutability` 1 ([pregled po pravilih](./bauma-v3-lint-baseline-review-evidence/rules-by-category.txt)).

**Tri ločene ravni:** (1) koda, ki je v javni strani vključena v modulni graf; (2) veja, ki se dejansko izvede; (3) zaprta pot, ki je še v gradnji. Pri kategoriji D so koda v gradnji (3) in HTTP dostop je zaprt; nobena izmed 20 napak ni na javni izvršni poti.

Omejitve dosegljivosti: statična analiza uvozov, ne sledenje bundlu; tree-shaking nisem preverjal (gradnje niso dovoljene). Uvoz prek barrel datotek (`index.ts`) šteje kot dosegljiv, četudi se simbol ne izriše. Ni razlikovanja po pogojnih vejah razen ročno v §3. Pri opozorilih je pregled po skupinah.

Opozorila (107): `no-unused-vars` 70, `no-img-element` 17, `no-unused-expressions` 15, `exhaustive-deps` 3, ostalo 2. Javno dosegljiva so predvsem `no-img-element` (Header/Footer/ClosingBookend/FlexidoHomeProof, 5) in 2 `no-unused-vars` v `HomeHeroProvider`, 3 `exhaustive-deps` v `usePoseAuthority`.

## 3. V2 hooka

- **Uporabljena sta samo v `HomeHeroV2Object`** ([poti](./bauma-v3-lint-baseline-review-evidence/v2-hooks-import-paths.txt)). Tega pa uvaža `components/home/hero-system/index.ts` (barrel), ki ga uvažata `/` in `/en` prek `MiniHero.tsx`. `MiniHero` iz barrela porablja le `HomeHeroProvider` in `HomeHeroCta`.
- **JSX uporaba** `HomeHeroV2Object` je samo v `HomeHeroVisual`, tega pa izrisujeta samo `HomeHeroField` (uporablja ga le lab `hero-reference`) in lab `StudyHeroField`. Ob tem `HomeHeroVisual` izbere V2 le pri `mobile` ali če je `HERO_SPATIAL_V3_ENABLED` false (zdaj `true`).
- **Zaključek:** hooka sta v modulnem grafu Home in `/en` (prek barrela), vendar po pregledu JSX nobena javna stran nju ne izriše; izvajata se samo v lab/zaprtih poteh. Ali ju bundler vključi v javni JS, ni preverjeno (tree-shaking, brez gradnje). Trenutni Home in `/en` zato po pregledu nista odvisna od njunega vedenja.
- **Vedenje, ki bi ga popravek lahko spremenil:** ponastavitev refov in objavljenega debug/snapshot stanja ob `runtimeEnabled=false` (ob ponovnem vklopu lahko nastopi star snapshot) ter trenutek mirovanja (RAF), kot že v [lint-v2-fixes](./bauma-v3-lint-v2-fixes.md). Resetov nisem prestavljal, zunanje shrambe nisem uvedel, pravila nisem izklopil.

## 4. Predlog naslednjega paketa (en sam, ozek)

**Paket: `components/home/change/useFinePointer.ts` in `useReducedMotion.ts`** (2 napaki `set-state-in-effect`).
- **Dosegljivost:** samo zaprte poti (ChangeSection v labu); torej brez vpliva na javne strani.
- **Praktični pomen:** diagnostika, ne dokazana runtime napaka; obnašanje je enako že popravljenima različicama v `components/home/approach/`.
- **Najmanjši popravek:** ista rešitev `useSyncExternalStore` (SSR snapshot `false`, isti media query, cleanup ob odmontiranju), že preverjena v `approach/`.
- **Tveganje:** nizko; sprememba je izolirana, brez RAF in refov.
- **Preverjanje:** ciljni ESLint, `tsc --noEmit`, simulirani `matchMedia` test (preklop in odstranitev poslušalcev, kot v [active-fixes](./bauma-v3-lint-active-fixes.md)), celotni lint z razliko diagnostik po datoteki, vrstici, pravilu.

Utemeljitev: nobena od 92 napak ni na javni izvršni poti, zato ni napake s prednostjo zaradi javne uporabe. Ta paket ima jasno vedenje in preverjeno predlogo; V2 hooka, `WorkPreviewModal` in refs vzorci zahtevajo dodatno oceno. Dokazni `.cjs` (63 napak) in `.recovery` (7) sta odločitev o hrambi dokaznih skript, ne popravek kode (brez sprememb pravil/ignore v tem koraku).

## 5. Omejitve

Samo statična analiza; brez gradnje in runtime preverjanja. Dosegljivost iz uvozov, ne iz bundla. Lint zajame pomožne mape, zato skupno število ni merilo kakovosti javne kode. Hosting ni preverjen. Napačen `lang` na `/en` ostaja odprt za EN prenovo; poti in 404 nespremenjeni. Brez commita, pusha, deploya.
