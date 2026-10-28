# BAUMA V3 — TECH-003: presoja preostalih opozoril odvisnosti

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Node **v25.6.1**, npm **11.9.0**. Nameščeno in v locku: `next@16.4.1`, `eslint-config-next@16.4.1`, `sharp@0.35.5`. Ta korak ne spreminja `package.json`, locka, kode ali konfiguracije. `npm audit` je tekel z medpomnilnikom zunaj repozitorija. Čas spremembe manifestov je ostal 25. 10. 2026 23:30:39. Dev strežnik na vratih 3000 ni bil ustavljen. Ni commita ali deploya.

Uspešen build in odsotnost kritičnih npm oznak ne pomenita, da je projekt varen. Spodaj je samo ujemanje trenutnega locka z advisoryji in presoja, ali ta repozitorij doseže prizadeto funkcijo.

## 1. Štetje

`npm audit --json` in `npm audit --omit=dev --json` sta se končala z izhodom 1, ker npm tako javi najdbe.

| Merilo | Celoten graf | `--omit=dev` |
|---|---:|---:|
| Npm skupine (ena na ime paketa; metadata `total`) | 8 | 3 |
| Od tega low / moderate / high / critical | 1 / 2 / 5 / 0 | 0 / 2 / 1 / 0 |
| Prizadeta imena paketov | 8 | 3 |
| Različni GHSA | 18 | 3 |

Osem skupin ni osemnajst ranljivosti. `brace-expansion` nosi 7 GHSA, `js-yaml` 4, `browserslist` 2. Dva zapisa za isto GHSA pri dveh razponih različice sta en advisory. `fflate` 0.6.10 in 0.8.2 sta ena GHSA in ena npm skupina.

PostCSS in nanoid v tem auditu ni. Next in sharp tudi ne. To je ujemanje tega locka, ne dokaz, da drugih ranljivosti ni.

## 2. Pregledna tabela

| Skupina in nameščeno | GHSA | Graf | Razvrstitev |
|---|---|---|---|
| source-map-js **1.2.1** | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | produkcijski, ker `next` zahteva `postcss@8.5.23` | dokumentirano nizko tveganje pri trenutni uporabi; ozek lock poseg je smiseln |
| fflate **0.6.10** in **0.8.2** | [GHSA-px8p-9vwx-vf98](https://github.com/advisories/GHSA-px8p-9vwx-vf98) | produkcijski prek `drei` | dosegljivost klica ni potrjena; 0.6.11 je znotraj razpona, 0.8.3 ni |
| baseline-browser-mapping **2.10.27** | [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) | produkcijski prek `next` | dokumentirano nizko tveganje pri trenutni uporabi; ozek lock poseg je smiseln |
| @babel/core **7.29.0** | [GHSA-4x5r-pxfx-6jf8](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8) | samo dev | dokumentirano nizko tveganje; ločen dev poseg |
| brace-expansion **1.1.14** in **5.0.5** | sedem GHSA, spodaj | samo dev | dokumentirano nizko tveganje; ločen dev poseg |
| browserslist **4.28.2** | [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx), [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g) | samo dev | dokumentirano nizko tveganje; ločen dev poseg |
| js-yaml **4.1.1** | štiri GHSA, spodaj | samo dev | dokumentirano nizko tveganje; ločen dev poseg |
| zod **4.4.3** | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | samo dev | dokumentirano nizko tveganje; ločen dev poseg |

Nobena skupina ni razvrščena kot potrjen popravek, ki bi blokiral objavo. Ranljive različice vseeno ostajajo v locku. Presoja tveganja ni enaka odpravi različice.

## 3. Produkcijski graf

### source-map-js 1.2.1

[GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q), CVE-2026-93749, high. Razpon `>=1.0.0 <1.2.2`, popravek **1.2.2**. Registrska različica 1.2.2 obstaja. `postcss@8.5.23` zahteva `source-map-js ^1.2.1`, zato 1.2.2 ostane znotraj razpona. `next@16.4.1` v produkcijskih odvisnostih pripne `postcss` na 8.5.23. Projektov `postcss` v `devDependencies` je ista nameščena kopija. Tailwindova pot `@tailwindcss/node` je označena `dev`.

Prizadeta je obdelava indexed source map: `SourceMapConsumer` ne preveri odmika sekcije in lahko dolgo zadrži zanko dogodkov. PostCSS to pokliče v `lib/previous-map.js`, `lib/map-generator.js` in `lib/input.js`. Klici `require("postcss")` v Nextu so v `dist/build/` (webpack/css in pisave). V `dist/server` tega klica ni.

Vhod so source map pri prevajanju CSS projekta, ne telo javnega zahtevka. Obiskovalec spletne strani tega niza ne poda. `next start` prevedenega CSS ne pelje znova skozi PostCSS. Dosegljivost iz javnega zahtevka **ni potrjena**. Manjka sklad produkcijskega strežnika, ki bi `SourceMapConsumer` poklical z bajti iz zahtevka.

TECH-004 zapre lab URL, ne odstrani kode iz gradnje in ne varuje postopka `next build`. Build še vedno bere CSS repozitorija.

### fflate 0.6.10 in 0.8.2

[GHSA-px8p-9vwx-vf98](https://github.com/advisories/GHSA-px8p-9vwx-vf98), CVE-2026-45820, moderate. `unzipSync` pri ZIP64 vnosu z `compressed_size = 0xFFFFFFFF` in brez polja 0x0001 ostane v zanki. Popravka: **0.6.11** in **0.8.3**. Oba sta na registru.

Verigi, obe brez zastavice `dev`:

- `bauma-portfolio → @react-three/drei@10.7.7 → three-stdlib@2.36.1 → fflate@0.6.10` (`^0.6.9`, 0.6.11 je združljiv)
- `bauma-portfolio → drei → maath@0.10.8 → @types/three@0.184.1 → fflate@0.8.2` (`~0.8.2`, 0.8.3 **ni** združljiv)

`unzipSync` v nameščenem `three-stdlib` kličejo `KMZLoader`, `3MFLoader`, `AMFLoader` in `TiltLoader`. Aplikacija teh nalagalnikov ne uvozi. Edini uvoz iz `drei` je v `app/lab/hero-monolith/MonolithStage.tsx`: `Environment`, `Lightformer`, `RoundedBox`. `Environment` uvozi `GroundProjectedEnv` in `useEnvironment` uvozi `RGBELoader`/`EXRLoader`. Ti moduli ne kličejo `unzipSync`. `maath` fflate ne uvaža. `@types/three` je paket tipov; njegova odvisnost 0.8.2 se namesti, klica iz aplikacije pa ni.

Javne strani drei, fiber ali three ne uvažajo. `ExportCubeImage.tsx` uvaža fiber, a ga nihče ne uvozi. Zapora lab poti ne odstrani `hero-monolith` iz gradnje. Ali je `unzipSync` v oddanem odjemalskem kosu, **ni potrjeno**: kosa gradnje nisem odprl. Manjkajoči dokaz je kos, ki vsebuje `unzipSync`, in pot, po kateri obiskovalec poda ZIP. Javnega nalaganja arhiva v izvoru ni.

Override na 0.8.3 ni privzeta rešitev. `~0.8.2` ga zavrača. Združljivost tipov `@types/three` z 0.8.3 ni preverjena. Kopija 0.6.10 se da dvigniti znotraj obstoječega razpona, ne da bi se spremenila neposredna odvisnost.

### baseline-browser-mapping 2.10.27

[GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv), CVE-2026-45819, moderate. Razpon `>=2.0.0 <2.11.0`, popravek **2.11.0**. V 2.10.27 klic `process.exit(1)` sproži neveljavna kombinacija, med drugim `includeKaiOS` brez `includeDownstreamBrowsers`. `browserslist@4.28.2` pokliče `getCompatibleVersions` za poizvedbe z letom ali datumom. Nextov prevedeni browserslist naloži paket z `require("baseline-browser-mapping")`. `getSupportedBrowsers` v `next/dist/build/get-supported-browsers.js` bere lokalno konfiguracijo med gradnjo. Isti modul vleče tudi `server/dev/hot-reloader-turbopack.js`, torej `next dev`, ne pa obdelovalcev zahtevkov v `dist/server`.

V `package.json` ni ključa `browserslist` in datoteke `.browserslistrc` ni. Brez konfiguracije Next uporabi svojo privzeto moderni seznam in `browserslist()` ne pokliče. Javni zahtevek parametrov `includeKaiOS` ne nastavi. Dosegljivost `process.exit` iz obiska strani **ni potrjena**. Paket je vseeno v produkcijski namestitvi, ker je odvisnost Nexta `^2.9.19`; 2.11.0 je znotraj tega razpona in znotraj `browserslist` `^2.10.12`.

## 4. Razvojni graf

Ti paketi so v locku označeni `dev: true` in jih `--omit=dev` ne našteje. ESLint, Babel in Autoprefixer tečejo ob lintu in gradnji CSS, ne ob javnem zahtevku. Obiskovalec ne poda globov, YAML, Zod polj ali Babel izvorne kode. To ni dokaz, da orodje ne more vplivati na razvijalca ali CI, če bi obdelalo nezaupano datoteko v repozitoriju.

| Paket | Veriga do neposredne odvisnosti | Advisory in popravek | Klic in vhod |
|---|---|---|---|
| @babel/core 7.29.0 | `eslint-config-next@16.4.1 → eslint-plugin-react-hooks@7.1.1 → @babel/core` (`^7.24.4`) | [GHSA-4x5r-pxfx-6jf8](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8), low. Branje datoteke prek `sourceMappingURL`, če napadalec nadzira vhod in izhod prevajanja. Popravek **7.29.6**. Uradno: zaupan izvor ni prizadet. | Lint lastnega izvora. Javne poti ni. |
| brace-expansion 1.1.14 | `eslint@9.39.4 → minimatch@3.1.5` (`^1.1.7`) | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp), [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg), [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895), [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p). Vse so DoS v `expand()`. Najvišji popravek veje 1.1 je **1.1.21**. | Vzorec pride iz konfiguracije linta, ne iz HTTP. |
| brace-expansion 5.0.5 | `eslint-config-next → typescript-eslint → @typescript-eslint/typescript-estree → minimatch@10.2.5` (`^5.0.5`) | Isti sklop plus [GHSA-jxxr-4gwj-5jf2](https://github.com/advisories/GHSA-jxxr-4gwj-5jf2) za vejo 5. Najvišji popravek je **5.0.12**, znotraj `^5.0.5`. | Isto, lint. |
| browserslist 4.28.2 | `autoprefixer@10.5.0` (`^4.28.2`) in Babel `helper-compilation-targets` | [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx): predpomnilnik poizvedb brez izteka. [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g): `normalizeStats` ob nezaupanjem `browserslist-stats.json`. Popravek **4.28.7**. | Ni datoteke statistik in ni javnega podajanja poizvedb. |
| js-yaml 4.1.1 | `eslint@9.39.4 → @eslint/eslintrc@3.3.5` (`^4.1.1`) | [GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68), [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m), [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj), [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh). DoS v `load()` ob merge ključih ali `!!omap`. Najvišji popravek **4.3.2**, znotraj `^4.1.1`. | ESLint bere svojo konfiguracijo. YAML končne točke v aplikaciji ni. |
| zod 4.4.3 | `eslint-config-next → eslint-plugin-react-hooks` (`^3.25.0 \|\| ^4.0.0`) | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). `$ZodArray` kopiči napake velike tabele. Popravek **4.6.6**. | `safeParse` teče nad konfiguracijo vtičnika med lintom. Aplikacija zoda ne uvaža. |

## 5. Naslednji ozek poseg

Ni potrjene javne poti, zato to ni pogoj za objavo v smislu znane izrabe. Ranljive različice v produkcijski namestitvi vseeno ostanejo. Najmanjši združljiv korak, brez `npm audit fix`, brez `--force` in brez override:

V locku, znotraj že dovoljenih razponov, dvigniti samo:

- `source-map-js` 1.2.1 → **1.2.2** (preko `next → postcss@8.5.23`)
- `fflate` pod `three-stdlib` 0.6.10 → **0.6.11**
- `baseline-browser-mapping` 2.10.27 → **2.11.0** (preko `next` `^2.9.19`)

Neposredne odvisnosti `next`, `eslint-config-next`, `sharp`, React in drei ostanejo. Glavna različica se ne spremeni. `fflate@0.8.2` ta korak pusti, ker `~0.8.2` ne sprejme 0.8.3 in klica iz aplikacije ni.

Preverjanje po posegu, v izolirani kopiji: `npm ci`, `npm ls` teh treh različic, ponovljen `npm audit --omit=dev`, `tsc`, produkcijska gradnja in vzorec javnih poti 200 ter lab poti 404. Dev strežnika na 3000 se ne ustavlja.

Ločen poznejši korak, ne del prvega: enako ozko dvigniti dev pakete na 7.29.6, 1.1.21, 5.0.12, 4.28.7, 4.3.2 in 4.6.6. Tudi tam razponi neposrednih orodij to dovolijo.

## 6. Omejitve

- Živa domena in gostiteljska namestitev nista preverjeni. Izraba ni bila izvedena.
- Ni pregleda vseh CVE izven vrnjenega npm audita.
- Ni odprtja produkcijskega odjemalskega kosa, zato prisotnost `unzipSync` v oddanem JS ni potrjena niti ovržena.
- Zapora lab URL iz TECH-004 ne pomeni, da gradnja lab datotek ne prevede in ne pomeni zaščite `next build`.
- Ocena nizkega tveganja velja za trenutni izvor in trenutne klicatelje. Nov uvoz nalagalnika ali nezaupan CSS/source map med gradnjo jo spremeni.
