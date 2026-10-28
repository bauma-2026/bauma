# BAUMA V3 — Audit 04: tehnično stanje pred objavo

25. 10. 2026, meritve od 22:08 UTC (23:08 CET) · read-only audit trenutnega lokalnega delovnega drevesa. Brez sprememb izvorne kode, odvisnosti, lockfila, pravil ali nastavitev; brez commita, pusha in deploya.

## 1. Rezultat

**Celoten TypeScript in produkcijska gradnja uspeta. Celoten ESLint ne uspe: 26 napak v 16 datotekah in 69 opozoril.** Gradnja ni lint potrditev. V 36 brskalniških prehodih produkcijske gradnje (17 zahtevanih strani + namenska 404, dve dimenziji) ni `pageerror` ali hydration opozoril, vidne slike in zahtevane pisave se naložijo. Lokalna Vercel analitika vrne pričakovani platformski 404; to je ločeno od aplikacijskih sredstev.

**Pred objavo je treba obravnavati varnostno zaostalo različico Next.js/sharp, neuspešen celoten lint in obseg javnih lab/preview poti.** Pri varnosti je potrjeno ujemanje nameščenih različic s prizadetimi razponi; izkoristljivost posamezne ranljivosti na tem spletišču ni dokazana. Napadov ni bilo. Indeksiranje je odvisno od izrecnih build/deploy spremenljivk; živi domeni in njuna dejanska konfiguracija nista preverjeni.

## 2. Izhodišče, orodja in izolacija

- Dejanski projekt: `/Users/bauma/Applications/projects/bauma-portfolio` (macOS izpiše tudi `Applications/Projects`). Pripeta `/Users/bauma/bauma-portfolio` ni Git repozitorij.
- Veja `staging/bauma-v3`, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Začetno stanje: 23 spremenjenih tracked datotek, številne untracked datoteke/labi in obstoječi auditi; Git staging prazen. Pregled **necommitanega delovnega drevesa**, ne samo HEAD in ne objavljenega staginga.
- Prebran [register](./bauma-v3-audit-register.md). Po uporabnikovi novi odločitvi so VIS-001/006/009 ohranjene namerne razlike glede na vlogo; sprememba je zapisana samo v registru, brez oblikovalskega posega. Drugi prejšnji statusi niso spremenjeni.
- V projektu in preverjeni verigi nadrejenih map ni `AGENTS.md`/`CLAUDE.md`. `.claude/launch.json` določa `npm run dev`, port 3000. Obstoječi dev strežnik in njegov `.next` nista uporabljena za to gradnjo ali ustavljena.
- Prebrani `package.json`, celoten `package-lock.json` v3, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs` prek kopije/konfiguracije gradnje, okoljska logika in izvor javnih poti. Skripti: dev=`next dev`, build=`next build`, start=`next start`, lint=`eslint`.

| Orodje/paket | Dejanska različica |
|---|---|
| Node / npm | **25.6.1 / 11.9.0**, macOS arm64 |
| Next.js / React / React DOM | **16.1.6 / 19.2.3 / 19.2.3** |
| TypeScript / ESLint / eslint-config-next | **5.9.3 / 9.39.4 / 16.1.6** |
| Playwright / Chromium | **1.62.1 / 151.0.7922.34**, headless |

Lock in nameščene različice teh paketov se ujemajo: [versions.json](./bauma-v3-technical-evidence/versions.json). Next zahteva Node ≥20.9.0; ta zahteva je izpolnjena. Gostiteljeva Node različica ni potrjena. Novih paketov nisem namestil; `npm ci`, `npm update`, `audit fix`, `--fix` ali novih izključitev nisem uporabil.

### Kako je nastala kopija

Začasna kopija **`/tmp/bauma-tech-20261025/workspace`** (realpath `/private/tmp/...`). Seznam je unija `git ls-files -z` in `git ls-files --others --exclude-standard -z`; kopirana je **dejanska vsebina datotek**, ne Git objekti HEAD. Vključenih **2695 datotek / 378.666.632 bajtov**, vključno z vsemi tracked/untracked app, components, lib, scripts in public datotekami po spodnjih izločitvah. `public/lab`, app labi, previewi in arhivske izvorne mape niso odstranjeni zaradi uspeha preverjanja.

Izločeni: `.git`, `node_modules`, `.next`, `.recovery`, `.playwright-browsers`, `.claude`, `tmp`, `test-results`, `lab-screenshots`, `docs`, `BAUMA — Content Review`, datoteke `.tsbuildinfo` in `.save` (rezultati, dokumentacija, konfiguracijske kopije). Nameščeni `node_modules` je nato fizično kloniran z macOS `cp -cR` v kopijo, brez symlinka in brez spremembe paketov. Natančen seznam, SHA-256 vsake vključene datoteke in izločitve: [copy-manifest.json](./bauma-v3-technical-evidence/copy-manifest.json).

Ignorirana `.env.local` **ni kopirana**. Vsebuje ime spremenljivke `VERCEL_OIDC_TOKEN`; vrednost ni uporabljena ali shranjena v dokazih. Gradnja ne potrebuje te poverilnice. Za pregled produkcijskega načina so izrecno nastavljene samo nenevarne vrednosti `SITE_ENV=production`, `VERCEL_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`, `NO_COLOR=1`. Omogočen je bralni dostop do Google Fonts/npm/GitHub; skrivnosti iz okolja se ne izpisujejo.

Obstoječi TS scope je `**/*.ts`, `**/*.tsx` in Next generated types; lastni izključitvi ostaneta `components/lab/hero-object-reframe/archive` in `scripts/archive`. ESLint obdrži konfigurirane Next privzete izključitve ter `scripts/archive/**`; labs/previewi niso dodatno izključeni.

## 3. Izvedeni ukazi in dnevniki

Vsi spodnji ukazi preverjanj imajo delovni imenik **`/tmp/bauma-tech-20261025/workspace`**, isto zgoraj opisano kopijo in eksplicitne okoljske vrednosti. JSON `*-command.json` hrani točen argv, cwd, začetek/konec UTC in **izhodno kodo notranjega ukaza**. Ovojni zapisovalnik sam vrne 0 tudi ob neuspehu preverjanja; za presojo se uporablja notranja koda.

| Preverjanje | Točen ukaz | Izhodna koda in rezultat | Dnevnik |
|---|---|---|---|
| TypeScript | `node node_modules/typescript/bin/tsc --noEmit` | **0**, brez diagnostike. Celoten izvor po konfiguraciji; na začetku sveža kopija brez dev generated types. Tudi build pozneje opravi svoj TS korak. | [typescript.log](./bauma-v3-technical-evidence/typescript.log) |
| Celoten lint | `npm run lint -- . --format json --output-file /tmp/bauma-tech-20261025/evidence/eslint-results.json` | **1**, 602 pregledani vnosi, 26 napak, 69 opozoril; TECH-001. | [eslint.log](./bauma-v3-technical-evidence/eslint.log); [eslint-results.json](./bauma-v3-technical-evidence/eslint-results.json) |
| Prvi build, omejeno okolje | `npm run build` | **143**, namensko ustavljen po ~90 s brez napredka; ni aplikacijska build napaka. Isti skript ponovljen z dovoljenim omrežjem. | [build.log](./bauma-v3-technical-evidence/build.log) |
| Produkcijski build, omrežje dovoljeno | `npm run build` | **0**, Turbopack; compile 5,1 s, TypeScript, zbiranje podatkov, 208/208 generiranih strani uspešno. Nobenega laba nisem odstranil. | [build-network.log](./bauma-v3-technical-evidence/build-network.log) |
| Prva npm audita, omejeno okolje | `npm audit --json`; `npm audit --omit=dev --json` | Oba **1**, `ENOTFOUND registry.npmjs.org`; okoljska ovira, brez varnostnega rezultata. | [npm-audit.log](./bauma-v3-technical-evidence/npm-audit.log); [npm-audit-production.log](./bauma-v3-technical-evidence/npm-audit-production.log) |
| Npm audit, omrežje dovoljeno | `npm audit --json --cache /tmp/bauma-tech-20261025/npm-cache` | **1**, uspešno prejet audit z najdbami: 12 paketnih skupin (1 critical / 8 high / 2 moderate / 1 low). | [npm-audit-network.log](./bauma-v3-technical-evidence/npm-audit-network.log) |
| Produkcijske odvisnosti | `npm audit --omit=dev --json --cache /tmp/bauma-tech-20261025/npm-cache-production` | **1**, 7 skupin (1 critical / 4 high / 2 moderate). Ni napaka dostopa do registra. | [npm-audit-production-network.log](./bauma-v3-technical-evidence/npm-audit-production-network.log) |
| Odvisnostne poti | `npm ls next react react-dom sharp postcss nanoid source-map-js fflate brace-expansion browserslist js-yaml zod baseline-browser-mapping --all --json` | **0**, dejanske poti in verzije; brez sprememb lockfila. | [dependency-tree.log](./bauma-v3-technical-evidence/dependency-tree.log) |

Prvi build ni izpisal dokončne razlage zastoja, zato ga ne pripisujem dokazano samo pisavam. Ponovitev iste gradnje z omrežjem uspe. Next 16 build v tem projektu **ne izvaja celotnega ESLinta**: oba rezultata sta zato namenoma ločena.

Produkcijski strežnik: `SITE_ENV=production VERCEL_ENV=production NEXT_TELEMETRY_DISABLED=1 npm run start -- --hostname 127.0.0.1 --port 3104`, cwd kopije. Uspešen zagon (Ready 451 ms), [server.log](./bauma-v3-technical-evidence/server.log). Port 3000 ni uporabljen. Končna namenska ustavitev strežnika ni napaka aplikacije.

Brskalniška ukaza: `node /tmp/bauma-tech-20261025/runtime.cjs` in `node /tmp/bauma-tech-20261025/interactions.cjs`, oba izhod **0**; absolutne poti v skriptah ciljajo samo izolirano gradnjo. Zagnana iz pripete mape `/Users/bauma/bauma-portfolio`, brez pisanja vanjo. Metodi sta ohranjeni kot dokazni besedili [runtime-method.txt](./bauma-v3-technical-evidence/runtime-method.txt) in [interaction-method.txt](./bauma-v3-technical-evidence/interaction-method.txt).

## 4. Runtime produkcijske gradnje

**375×812 in 1440×900 CSS px, DPR 1**; 375 z emuliranim mobilnim dotikom, ne fizični telefon. Sveže strani; `load`, `document.fonts.ready`, pomik skozi cel dokument v korakih 75 % višine in končno čakanje. Poslušalci zajamejo `pageerror`, console error/warning, requestfailed, HTTP ≥400, font responses ter končno stanje vseh `<img>`. Pošte nisem aktiviral, naročniških strani/sistemov nisem odprl, ni obrazcev ali nakupov.

| Poti | Rezultat pri obeh dimenzijah |
|---|---|
| `/`, `/work`, `/pristop`, `/o-nas` | HTTP 200; 0 pageerror, 0 hydration opozoril, brez neuspešne vsebinske slike/pisave. |
| `/work/{flexido,ulterior,odstrani-tattoo,dema-plus,artbite,hardshelljacket}` | Enak uspešen tehnični rezultat za vseh šest. |
| `/pogoji-uporabe`, `/zasebnost`, `/piskotki` | HTTP 200, brez runtime/hydration napak. |
| `/en`, `/en/{terms,privacy,cookies}` | HTTP 200, brez runtime/hydration napak; samo tehnično delovanje, brez ocene prevoda/sestave. |
| `/audit04-neobstojeca-pot-20261025` | Dejanski HTTP **404**, vidna 404 stran in noindex; pričakovani console network 404 dokumenta ni nova napaka. |

- **165 pojavitev izrisanih img elementov**, vse `complete` in `naturalWidth>0` po pomiku. Pet ničelnih `naturalWidth` je v skritih odzivnih vejah, ne izrisanih slikah. Začetnih lazy stanj ne štejem za pokvarjene slike.
- **319 font odgovorov, vsi HTTP 200**, dokumenti dosežejo `document.fonts.status=loaded`. Posamezni neuporabljeni font-face/unicode ali fallback zapisi ostanejo `unloaded`; to samo po sebi ni neuspeh nalaganja uporabljene pisave. Za CSS fotografije ni neuspešnih zahtev; posameznih pikslov ali decode vsake skrite CSS različice nisem preverjal.
- Vsak dokument lokalno zahteva `/_vercel/insights/script.js`: **404 + net::ERR_ABORTED**, ker običajni `next start` nima Vercelove analytics poti. To ni hydration napaka ali dokaz pokvarjene analitike na Vercelu; njeno dejansko delovanje na platformi ostaja nepreverjeno. Drugih neuspešnih zahtev ni bilo, poleg namenske 404 dokumenta.
- Pri obeh dimenzijah: `/work` kartica Flexido → študija → Naslednji Ulterior → Nazaj Flexido → Vsi projekti → indeks. Kontakt na Pristopu z dejanskim Tab/Enter prenese fokus na `contact-heading`, naslednji Tab na pravilen mailto brez aktivacije. Na 375 meni odpre plast, Escape vrne hamburger in odklene drsenje; izbor Work zapre meni in navigira. Ulterior klik 03 označi obe pripadajoči tipki, naslednji dejanski Tab/Enter aktivira 04. Brez pageerror.

Dokazi: [runtime-results.json](./bauma-v3-technical-evidence/runtime-results.json), [runtime.log](./bauma-v3-technical-evidence/runtime.log), [production-interactions.json](./bauma-v3-technical-evidence/production-interactions.json). To je ciljni funkcionalni pregled, ne ponovitev celotnega vizualnega ali dostopnostnega audita.

## 5. Ugotovitve

### TECH-001 — celoten ESLint ne uspe

**Ocena: potrjena napaka preverjanja · P2 · pred zaključkom tehničnega sklopa.**

Dokaz in ponovitev: lint ukaz iz tabele, izhod 1, [klasifikacija](./bauma-v3-technical-evidence/lint-classification.json). Vseh 26 napak z lokacijo/pravili ter opozorila so v JSON; primeri so `react-hooks/set-state-in-effect`, `react-hooks/refs`, `react-hooks/purity`, `react-hooks/immutability`. Ne trdim, da vsaka diagnostika povzroča trenutno vidno napako.

| Obseg | Napake / opozorila | Lokacije in vpliv |
|---|---:|---|
| Neposredna koda zahtevanih javnih strani | **0 / 0** | Njihovi page entrypointi nimajo lint diagnostik. |
| Skupne komponente, dosegljive iz zahtevanih strani | **6 / 10** | `components/home/approach/useFinePointer.ts:11` (EN), `useReducedMotion.ts:10` (SL/EN), `debug/RightObjectAxisDebug.tsx:187`, `hero-system/v2/useMaterialActivation.ts:98`, `usePoseAuthority.ts:468`, `v3/useHeroProximityV3.ts:73` (uvozna pot iz SL/EN). Statična dosegljivost ni dokaz, da je vsaka pogojna debug veja dejansko prikazana. |
| Labs/preview uvozne poti in komponente | **20 / 14** | Dva `app/lab` fajla (MonolithStage:78, VisualLayerBlockObject:62), starejši Approach/Change hooki, `components/lab/hero-object-reframe/useEdgeContextInteraction.ts:349–359`, WorkPreviewModal:90/101. |
| Pomožne, po analiziranih uvozih nedosegljive datoteke | **0 / 45** | Podrobno v JSON; niso na podlagi imena proglašene za aktivno produkcijsko kodo. |

Klasifikacija uporablja TypeScriptovo razreševanje statičnih uvozov iz 17 javnih strani + root layout, ločeno vseh route entrypointov in labov. Računsko sestavljenih dinamičnih uvozov ne dokazuje; JSON navede metodo in poti. Varnostnih/skupnih komponent ni pravilno skriti s splošno izključitvijo labov.

**Starost preverjena:** 24 napak je v 14 datotekah, katerih vsebina je bajtno identična HEAD; enaka HEAD so tudi lint/TS konfiguracija, package.json in lock. Dve napaki sta v dveh untracked lab datotekah, zato njune starosti iz HEAD ne potrjujem. [head-provenance.json](./bauma-v3-technical-evidence/head-provenance.json) in identiteta po datotekah sta dokaz pregleda vira, ne ločen lint celotne zgodovinske kopije.

Najmanjši predlagani poseg: ločen ozek popravek šestih aktivno dosegljivih diagnostik z ohranjenim obnašanjem; nato preostale konkretne lab/preview diagnostike. Opozorila razvrstiti po vlogi (npr. namerne navadne slike niso samodejno funkcionalna napaka). Ne uporabljati množičnega `--fix`, novih izključitev ali spremembe pravil za dosego zelene številke. Uspeh builda ne zapre TECH-001.

### TECH-002 — Next.js in sharp sta v prizadetih varnostnih razponih

**Ocena: tveganje, potrjena prisotnost prizadetih različic · P1 pred objavo.**

Lokacija: `package.json` (`next:16.1.6`), lock `node_modules/next` in `node_modules/sharp` **0.34.5**. Pot `projekt → next → sharp`; Next se uporablja kot App Router strežnik in image optimizer. Ponovitev: npm produkcijski audit in `npm ls` zgoraj. Primarni uradni GitHub advisories preverjeni spletno in prek javnega REST API na datum audita, brez napadov.

| Advisory / funkcija | Prizadeta veja, nameščeno → popravljeno | Uporaba v projektu in omejitev |
|---|---|---|
| [GHSA-2464-fhr4-w9xw](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), SVG image optimization RCE | Next 16 veja `>=16.0.0 <=16.4.0`; **16.1.6 → 16.4.1**. Proizvajalec navede tudi sharp ≥0.35.5. | Optimizator obstaja, vendar je `dangerouslyAllowSVG=false`, remotePatterns prazni in ni uporabniškega nalaganja slik. Advisory posebej pogojuje glibc Linux in druge runtime pogoje; macOS ni dokaz produkcijskega gostitelja. **Dosegljivost ni potrjena.** |
| [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4), AVIF/libheif RCE | Next 16 `<16.3.3`; **16.1.6 → 16.3.3** za ta advisory. | V kopiranih public assetih ni `.avif`; izhodni image formats so webp. To ne dokazuje splošne odsotnosti AVIF decoderja. Pogoji izkoriščanja niso testirani. |
| [GHSA-673q-mjm6-r5xr](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr), `use cache`/typed arrays RCE | `>=16.0.0 <=16.4.0`; **16.1.6 → 16.4.1** | `cacheComponents=false`, v pregledanem izvoru ni `use cache`; opisana funkcija ni ugotovljena. Proizvajalec kljub temu priporoča nadgradnjo. |
| [GHSA-q4gf-8mx6-v5v3](https://github.com/vercel/next.js/security/advisories/GHSA-q4gf-8mx6-v5v3), RSC DoS; ter [GHSA-p3m5-59mp-jv5r](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r), Server Actions DoS | Prvi `>=16.0.0 <16.2.3` → **16.2.3**; drugi `>=16.0.0 <=16.4.0` → **16.4.1**; nameščeno **16.1.6**. | App Router/RSC uporabljen. V izvoru ni `use server`, generirani seznam registriranih Node/Edge Server Functions je prazen. To omejuje dokaz uporabe Actions; **dosegljivost ni potrjena**, ne sklepam, da zgolj statični izris odpravi vsa framework tveganja. |
| [GHSA-wq5f-xc86-pv6w](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w), sharp/librsvg | sharp `<0.35.5`; **0.34.5 → 0.35.5** | Isti image pipeline, SVG privzeto onemogočen, glibc pogoji gostitelja nepreverjeni. Druga sharp/libvips/libheif opozorila so v polni matriki. |

To niso edini advisoryji Next/sharp. Celoten [advisory-matrix.csv](./bauma-v3-technical-evidence/advisory-matrix.csv) zapiše **vse** zaznane ID-je, prizadete razpone, dejansko ujemajočo se nameščeno različico/pot ter prvo znano popravljeno različico iz primarnega vira. [github-advisories.json](./bauma-v3-technical-evidence/github-advisories.json) vsebuje 65 različnih preverjenih advisory zapisov; 72 paket/advisory vnosov oziroma 74 vrstic po različicah/poteh **ni število izkoristljivih napak Baume**. Next ima tudi več pogojnih opozoril za rewrites, Proxy/Middleware, CSP nonce, Windows, cache in razvojni strežnik; projekt nima lastnega middleware/proxy/API ali rewrites konfiguracije. Posamezne dosegljivosti niso dokazane.

Najmanjši predlagani poseg: ločen nadzorovan varnostni update Next na popravljeno podprto 16.x izdajo, ki pokrije **vsa navedena ujemanja** (v preverjenih novih advisories najmanj 16.4.1), uskladitev eslint-config-next ter potrditev sharp ≥0.35.5 v dejanskem novem locku. Nato ponoviti TS/lint/build in ciljni produkcijski runtime. V tem auditu ni nadgradnje, `override` ali spremembe zaklepa; API popravljena različica za posamezen advisory ni avtomatična izbira končne kombinacije paketov.

### TECH-003 — dodatna tranzitivna opozorila potrebujejo razvrstitev in ciljni update

**Ocena: tveganje · P2 za produkcijske poti / P3 za dokazano razvojno orodje brez nezaupanega vhoda.**

Dokazi in ponovitev: oba uspešno prejeta npm audita, [dependency-tree.log](./bauma-v3-technical-evidence/dependency-tree.log) ter celotna advisory matrika. Npm oznaka production pomeni namestitev v produkcijskem grafu, ne nujno izvajanje v obdelavi javnega zahtevka. Izbor spodaj ne nadomesti vseh vrstic matrike.

| Paket, nameščeno, pot | Advisory in razpon → popravljeno | Presoja dosegljivosti |
|---|---|---|
| PostCSS **8.4.31** pod Next (prod) in **8.5.14** prek Tailwind/PostCSS (dev) | [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), `<=8.5.22` → **8.5.23**; ostali v CSV | Obdelava CSS/source map. Ni ugotovljene aplikacijske poti za nezaupan CSS; runtime izkoristljivost ni potrjena. |
| nanoid **3.3.12**, prek PostCSS (prod in deljeni graf) | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8), `<3.3.18` → **3.3.18**; še negativna velikost v CSV | Ni neposrednega aplikacijskega klica custom generatorja z uporabniško velikostjo; dosegljivost ni potrjena. |
| source-map-js **1.2.1**, prek PostCSS (prod/dev) | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q), `>=1.0.0 <1.2.2` → **1.2.2** | Potreben nezaupan indexed source map; taka javna pot ni ugotovljena. |
| fflate **0.8.2 / 0.6.10**, prek drei/three-stdlib (prod) | [GHSA-px8p-9vwx-vf98](https://github.com/advisories/GHSA-px8p-9vwx-vf98), `>=.8.0 <.8.3` / `>=.6.0 <.6.11` → **.8.3 / .6.11** | Malformed ZIP64; ni ugotovljenega javnega nalaganja arhivov. Dosegljivost ni potrjena. |
| baseline-browser-mapping **2.10.27**, prek Next (prod) | [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv), `>=2.0.0 <2.11.0` → **2.11.0** | Predvsem orodje za podatke o brskalnikih, ni ugotovljenega uporabniškega vhoda. |
| brace-expansion **1.1.14 / 5.0.5**, ESLint/minimatch/typescript-eslint (dev) | [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), `<1.1.21` / `>=4 <5.0.12` → **1.1.21 / 5.0.12**; drugi razponi v CSV | Zlonameren glob; javni obiskovalec po pregledanem viru ne podaja lint globov. Ne predstavljam kot javni runtime DoS. |
| browserslist **4.28.2**, Autoprefixer/Babel (dev) | [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g), `<=4.28.6` → **4.28.7** | Nezaupan stats JSON; tak vhod ni ugotovljen. |
| js-yaml **4.1.1**, ESLint/eslintrc (dev) | [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh), `>=4 <4.3.2` → **4.3.2** | Nezaupan YAML; projekt ne izpostavlja YAML endpointa. |
| zod **4.4.3**, eslint-plugin-react-hooks (dev) | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), `<4.6.6` → **4.6.6** | Velike nezaupane kolekcije; javna aplikacijska validacijska pot ni ugotovljena. |
| @babel/core **7.29.0** (dev; točna pot v CSV) | [GHSA-4x5r-pxfx-6jf8](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8), `<=7.29.0`; popravljena verzija v CSV | Low, sourceMappingURL pri obdelavi nezaupanega vira; spletna dosegljivost ni potrjena. |

Najmanjši poseg: po framework update ponovno izmeriti preostanek ter posodobiti ustrezne nadrejene pakete/zaklep v ločenem koraku. Brez slepega `audit fix --force` in brez sklepanja, da razvojna odvisnost nikoli ne more vplivati na CI. Nič opozoril v prihodnjem auditu ne bi dokazovalo odsotnosti vseh ranljivosti.

### TECH-004 — lab/preview poti se vključijo v javno produkcijsko gradnjo

**Ocena: tveganje javne objave razvojne vsebine, dosegljivost lokalno potrjena · P1 pred produkcijsko objavo.**

Lokacija: `next.config.ts:5–9` preusmeri `/lab/:path*` **samo** pri `SITE_ENV=staging`; `app/lab/layout.tsx:7` nastavi noindex, ne omejitve dostopa. Build manifest vsebuje **125 statičnih + 17 dinamičnih lab route vzorcev** (ne število ročno preiskanih lab strani). `/about-preview`, `/en/about-preview`, `/en/mini`, `/approach` in `/contact` so dodatne starejše/preview poti zunaj tega redirecta.

Ponovitev: produkcijska kopija, `GET /lab/hero-monolith`, `/lab/typography-foundation/opsz`, `/lab/hero-object-reframe`, `/about-preview`, `/en/about-preview`, `/en/mini`, `/approach`, `/contact` → **200**, robots meta noindex/nofollow. [production-route-probes.json](./bauma-v3-technical-evidence/production-route-probes.json), build route seznam in konfiguracija. Ne trdim, da so vse te poti zasebne ali vsebujejo skrivnosti; potrjena je možnost nenamerne javne objave stare/razvojne vsebine.

Najmanjši poseg: izrecno izbrati javni route obseg produkcije in lokalno omejiti razvojne/preview poti tudi v produkcijskem načinu (ali jih izločiti iz deploy artefakta v ločenem odobrenem koraku). Če je potrebna zasebnost, uporabiti nadzor dostopa; noindex/robots nista zaščita. Ne brisati labov ali izključevati jih iz tega audita. Pri staging načinu po izvoru `/lab/*` preusmeritev obstaja, previewi zunaj prefiksa pa z njo niso zajeti. Živa domena ni testirana.

### TECH-005 — indeksirna ločitev je odvisna od pravilne nastavitve ob gradnji

**Ocena: konfiguracijsko tveganje · P2 za checklist objave, brez potrjene napačne žive nastavitve.**

Lokacija: `lib/siteEnv.ts:8`, `app/page.tsx:26,97`, `app/en/page.tsx:23,58`, `next.config.ts:13–20`, `app/robots.ts`, `app/sitemap.ts`. Preverjeno neposredno iz vira ter z začasno transpilacijo konfiguracijskih funkcij (brez spreminjanja datotek); [environment-matrix.json](./bauma-v3-technical-evidence/environment-matrix.json). Spodnja matrika opisuje konfiguracijo; ni štirih ločenih deploy preverjanj.

| SITE_ENV / VERCEL_ENV | Izvorno obnašanje |
|---|---|
| `staging` / `production` | Noindex X-Robots-Tag povsod, home/en noindex, robots Disallow `/`, prazen sitemap, `/lab/*` redirect. To je nameren ločen staging Vercel projekt. |
| unset ali `production` ali tipkarska napaka `stagng` / `production` | Produkcijska veja: home/en index/follow, robots Allow `/`, sitemap dve domači URL, brez lab redirecta. V lokalno zgrajenem production načinu je to tudi dejansko izmerjeno. |
| Produkcijska domena s pomotoma ohranjenim `SITE_ENV=staging` | Po viru ostane prepoved indeksiranja. Dejanska nastavitev produkcijske domene ni potrjena. |

Konkreten pogoj tveganja: staging projekt ima tudi `VERCEL_ENV=production`; če eksplicitni SITE_ENV manjka ali je napačen, host sam ne sproži staging zaščite. Obratno se staging prepoved lahko prenese v produkcijski build z napačno spremenljivko. To je preverljiva odvisnost, ne dokaz, da se je že zgodila.

Root metadata namenoma privzeto pusti druge strani noindex; samo `/` in `/en` v produkciji opt-in. Zato /work noindex tukaj ni prijavljen kot nova napaka. Odločitev o indeksabilnosti drugih SL strani sodi v naslednji SEO pregled. Produkcijski robots dovoljuje crawling, čeprav meta večine poti prepoveduje indeksiranje; noindex ne prepreči neposrednega dostopa.

Najmanjši poseg: pred deployem zabeležiti projekt/okoljske **ključe in namen**, potrditi pravilno vrednost ob **gradnji**, nato preveriti robots meta, header, robots.txt in sitemap na točnem deployu. Sam `next start` z drugo spremenljivko ne dokazuje spremembe že predizrisanih metapodatkov. Host-guard ali deployment assertion je možen ločen izboljševalni poseg, ni implementiran.

### TECH-006 — odzivne varnostne glave ostajajo izbirna utrditev

**Ocena: priporočilo · P3, ni samostojna blokada objave.**

Lokacija: `next.config.ts:11–49`, [lokalni HTTP probe](./bauma-v3-technical-evidence/production-route-probes.json). Lokalni `next start` nima splošnega CSP/frame omejitve, X-Content-Type-Options, Referrer-Policy ali Permissions-Policy; ima `X-Powered-By: Next.js`. HSTS na lokalnem HTTP ni relevanten dokaz stanja HTTPS gostitelja. Image optimizer ima svoj restriktivni CSP, kar ni CSP celotnega HTML dokumenta.

Za predstavitveno stran brez prijave/form občutljive seje teh odsotnosti ne razglašam za potrjeno izkoristljivo napako. Najmanjši predlog: na dejanskem HTTPS deployu preveriti platformne glave in po potrebi ozko dodati smiselno osnovo (`nosniff`, frame politika, referrer politika); CSP naj upošteva obstoječi inline hash script, pisave in analitiko ter se najprej preveri. Ne predlagam slepega izklopa funkcij ali celovite nove konfiguracije.

## 6. Ciljni pregled varnostnega izvora

- V 950 besedilnih datotekah app/components/lib/public ni zadetkov uporabljenih vzorcev zasebnih ključev, pogostih API/token oblik in JWT literalov. To je **omejen vzorčni pregled, ne dokaz odsotnosti vsake skrivnosti**. Vrednosti env, piškotki in žetoni niso del dokaznih datotek. [security-source-review.json](./bauma-v3-technical-evidence/security-source-review.json).
- `dangerouslySetInnerHTML` v rootu uporablja konstantni `HASH_LANDING_SCRIPT`; hash se dekodira v ID in uporabi z `getElementById`, ne vstavi kot HTML. `SystemGraphicEn` formatira lokalno konstantno `codeString`, ne prejetega zunanjega HTML. Ciljni pregled ni našel nezaupanega zunanjega HTML toka, eval ali `new Function` v pregledanem aplikacijskem izvoru.
- Case zunanje domene so lokalne konstante; pregledani URL-ji/query vrednosti niso prepoznani kot javni server fetch proxy. Ni lastnih API route handlerjev, Server Actions ali middleware/proxy v izvoru. Vgrajeni Next endpointi, predvsem image optimizer, ostajajo del površine frameworka.
- Dejanske build image nastavitve: brez remotePatterns/domains, `dangerouslyAllowLocalIP=false`, `dangerouslyAllowSVG=false`, localPatterns `**` s praznim search, kvaliteta 75, webp format. Browser source maps so izklopljeni, Cache Components izklopljeni. To omejuje del poti, ne odpravlja potrebe po varnostnem update.
- `lib/heroParityProbe.ts` ima v viru možnost query `parity=1` tudi v produkciji, vendar ni najdenega uvoza te pomožne datoteke v aktivni javni graf. Zato je ne prijavljam kot potrjeno javno diagnostično uhajanje. Javne lab/preview poti imajo konkreten dokaz TECH-004.

## 7. Zaključek in naslednji ozek poseg

**Uspešno preverjeno:** TypeScript, obstoječi produkcijski build z vsemi konfigurirano vključenimi labi, zahtevanih 17 strani in prava 404 pri obeh dimenzijah, brez zaznanih runtime/hydration napak, nalaganje izrisanih slik/pisav ter vzorčne ključne interakcije. Različice in odvisnostne poti so dokumentirane; primarni advisory podatki pridobljeni za vseh 65 različnih opozoril.

**Pred objavo:** obravnavati TECH-002 framework/sharp update; zapreti TECH-001 celoten lint z razločeno aktivno/lab kodo; odločiti in omejiti javni razvojni route obseg TECH-004; izpolniti okoljsko preverjanje TECH-005 in ponovno auditirati produkcijski preostanek TECH-003. To niso že izvedeni popravki.

**Backlog:** dokazano razvojna tranzitivna tveganja brez nezaupanega vhoda po prioriteti; nezaviralna lint opozorila po vsebinski razvrstitvi; sorazmerne glave TECH-006. Ni razloga za prenovo odobrenih kompozicij.

**Nepreverjeno:** živi staging/produkcija in točen deploy commit, produkcijski OS/Node/platformne zaščite in analytics, izkoristljivost posameznih advisoryjev, popoln ročni pregled vseh labov, Safari/VoiceOver, fizični dotik, naknadna vizualna potrditev kartic in EN/IT sestava. Ti dostopnostni sklopi ostajajo odprti po registru. Zmogljivost/Lighthouse, celoten SEO in indeksiranje sledijo posebej. Pošta ni aktivirana.

**Predlagani naslednji ozek poseg:** najprej ločen varnostni update Next/eslint-config-next in potrjene sharp poti z novim lockom, nato TS + celoten lint + build + isti ciljni runtime. Ta poseg ne sme samodejno odpreti oblikovalskih sprememb ali brisanja labov. Lint in route obseg naj ostaneta jasno ločena nadaljnja popravka.

## 8. Ohranjeno stanje in dokazi

Dokazi so v [bauma-v3-technical-evidence](./bauma-v3-technical-evidence/). Dnevniki ne vsebujejo env datotek ali poverilnic; generirani Server Reference manifest z notranjim ključem ni izvožen, shranjeni sta samo števili Node/Edge registracij. Datoteke `*-command.json` dopolnjujejo točne ukaze iz tabele; manifest omogoča identifikacijo preizkušenega necommitanega paketa.

Po pregledu je namenski strežnik na 3104 ustavljen in začasna kopija, ki jo je ustvarila ta naloga, odstranjena. Obstoječi dev strežnik na 3000 ni ustavljen. Končna primerjava potrdi isti izvorni Git diff, Git staging, vejo, HEAD in vse vključene izvorne/asset hashe. Edine spremembe v projektu so **to poročilo, dokazna podmapa in dovoljena dopolnitev registra**. Prejšnja poročila ostanejo nespremenjena. Nič ni commitano, pushano ali deployano.
