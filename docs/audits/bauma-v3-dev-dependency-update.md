# BAUMA V3 — TECH-003: preostale razvojne odvisnosti

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**, 121 necommitanih vnosov (ohranjeni; `git status --short` pred in po je identičen). Node **v25.6.1**, npm **11.9.0**. Spremenjen je samo `package-lock.json`; `package.json` je nespremenjen (sha1 `8a21f4c0…`). Brez `npm audit fix`, `--force` in overrides. Brez sprememb kode, konfiguracije, vsebine, SEO ali oblikovanja. Brez commita, pusha ali deploya. Gostovanje ni preverjeno. Surovi dokazi: [bauma-v3-dev-dependency-evidence](./bauma-v3-dev-dependency-evidence/).

## 1. Izhodišče (trenutno stanje, ponovno izmerjeno)

Audit na začetku tega posega: `--omit=dev` 0; celoten graf **5 skupin, 15 različnih GHSA** (1 low, 4 high). Sovpada z zadnjim poročilom. Vse instance so označene kot dev.

| Paket | Nameščeno | Porabniki in razponi (iz locka) | Advisory → popravljena različica (GitHub advisory API) |
|---|---|---|---|
| `@babel/core` | 7.29.0 | `eslint-plugin-react-hooks` `^7.24.4`; peer `@babel/helper-module-transforms ^7.0.0` | GHSA-4x5r-pxfx-6jf8 (`<=7.29.0`) → **7.29.6** |
| `brace-expansion` (koren) | 1.1.14 | `minimatch@3.1.5` `^1.1.7` | 6 GHSA (jxxr…, 3jxr…, mh99…, rgw5…, q2hr…, qhr7…, 6j4f…): `<1.1.21` → **1.1.21** |
| `brace-expansion` (pod `@typescript-eslint/typescript-estree`) | 5.0.5 | `minimatch@10.2.5` `^5.0.5` | isti GHSA: `>=4.0.0 <5.0.12` → **5.0.12** |
| `browserslist` | 4.28.2 | `autoprefixer` `^4.28.2`; peer `update-browserslist-db >= 4.21.0`; `@babel/helper-compilation-targets` `^4.24.0` | GHSA-c83g-rgw3-j3cx, GHSA-73wf-gq98-2v4g (`<=4.28.6`) → **4.28.7** |
| `js-yaml` | 4.1.1 | `@eslint/eslintrc` `^4.1.1` | GHSA-h67p-54hq-rp68, 52cp-r559-cp3m, 5p4m-2wfm-xmqj, 2883-xcg3-v3hh (`<4.3.2`) → **4.3.2** |
| `zod` | 4.4.3 | `eslint-plugin-react-hooks` `^3.25.0 \|\| ^4.0.0`; peer `zod-validation-error` isto | GHSA-mrhx-c7xc-m3w5 (`<4.6.6`) → **4.6.6** |

Vseh pet kandidatov iz navodila je potrjenih z advisory API in `npm view`; vsi ležijo znotraj obstoječih razponov, nobena neposredna odvisnost ni prizadeta. Višje različice obstajajo (`@babel/core` 8.x, `js-yaml` 5.x) in so izven razponov; niso uporabljene.

## 2. Postopek

Izolirana kopija (brez `node_modules`, `.next`, `.git`, `.env*`), `npm ci`, nato `npm update <paket> --no-save`, po paketih. Ker je npm privzeto izbral najvišjo različico v razponu, sem uporabil `--before`, da ostanem pri najmanjši popravljeni: `@babel/core` (pred 2026-05-25T11:00Z → 7.29.6, ne 7.29.7), `browserslist` (pred 2026-07-22 → 4.28.7, ne 4.29.4), `zod` (pred 2026-10-12 → 4.6.6, ne 4.6.7). `brace-expansion` 1.1.21 in 5.0.12 sta najvišji v svojih vejah, `js-yaml` 4.3.2 je najvišja 4.x. Integrity vrednosti zapiše npm.

## 3. Diff locka (proti začetku posega)

93 spremenjenih vrstic (`diff`). Ciljni vnosi: `@babel/core` 7.29.0 → 7.29.6, `brace-expansion` 1.1.14 → 1.1.21 in 5.0.5 → 5.0.12, `browserslist` 4.28.2 → 4.28.7, `js-yaml` 4.1.1 → 4.3.2, `zod` 4.4.3 → 4.6.6. Dodatni povezani vnosi:

| Vnos | Sprememba | Razlog |
|---|---|---|
| `@babel/generator` | 7.29.1 → 7.29.6 | `@babel/core@7.29.6` zahteva `^7.29.6`; zahtevane minimalne različice `@babel/parser ^7.29.3` in `@babel/helpers ^7.29.2` so že izpolnjene |
| `caniuse-lite` | 1.0.30001791 → 1.0.30001806 | `browserslist@4.28.7` zahteva `^1.0.30001806` |
| `electron-to-chromium` | 1.5.350 → 1.5.395 | zahteva `^1.5.393` |
| `node-releases` | 2.0.38 → 2.0.51 | zahteva `^2.0.51` |
| `engines`/`funding` metapodatki | `brace-expansion@5.0.12` `node: 20 \|\| >=22`; `js-yaml` funding; `node-releases` `engines >=18` | metapodatki novih različic |

Brez drugih sprememb: `fflate` 0.8.3 / 0.6.11, `source-map-js` 1.2.2, `baseline-browser-mapping` 2.11.0 in vse prejšnje nadgradnje so ohranjene (`npm ls`).

## 4. Audit pred / po

| Merilo | Celoten graf pred | po | `--omit=dev` pred | po |
|---|---:|---:|---:|---:|
| Skupine | 5 | **0** | 0 | **0** |
| low / moderate / high / critical | 1 / 0 / 4 / 0 | **0 / 0 / 0 / 0** | 0 | **0** |
| Različni GHSA | 15 | **0** | 0 | **0** |

Odpravljene skupine: `@babel/core`, `brace-expansion`, `browserslist`, `js-yaml`, `zod`. Čist audit ni trditev o popolni varnosti.

## 5. Preverjanje izolirane kopije

- `npm ci` (z izbrisanim `node_modules`): uspe, lock se ne spremeni (`cmp`).
- `npm ls --all`: izhod 0. Šest `extraneous` vnosov (`@emnapi/*`, `@img/sharp-wasm32`, `@napi-rs/wasm-runtime`, `@tybys/wasm-util`) je **enakih** pred in po (`diff`); niso nova težava. Brez `invalid`/`missing`.
- `npx tsc --noEmit`: izhod 0.
- **Lint** `npx eslint .` (isti ukaz, nastavitve in obseg v kopiji pred in po): izhod 1 pred in po. **32 napak, 78 opozoril, 60 datotek** pred in po; normalizirani seznami diagnostik (datoteka|vrstica|stolpec|resnost|pravilo|sporočilo) so **identični** (`diff` prazen). Nove diagnostike ni, regresije ni. Obseg lintanja vključuje `.claude/` in druge necommitane mape, zato število ni enako številu iz TECH-001; primerjava je pred/po v istem obsegu. Lint ni popravljen.
- `next build`, `SITE_ENV=production`, `VERCEL_ENV=production`: izhod 0, 208 strani.
- `npm audit` in `--omit=dev`: 0 / 0.

Runtime (`next start`, prosta vrata, lasten `.next`; Playwright Chromium, poslušalci `console`/`pageerror` pripeti pred navigacijo):

- `/`, `/en`, `/pristop`, `/work`, `/o-nas`, `/work/ulterior` ter ostalih pet študij: 200. Brez `pageerror` in hydration napak.
- Edini `console.error` na vsaki poti: 404 za `/_vercel/insights/script.js` (Vercel Analytics, obstaja samo na Vercelu). Zabeleženo ločeno, konzolni zajem ni utišan. Opozorila `preload not used` so brskalniška opozorila.
- Domača kocka: 1440 × 900 in 375 × 812, live `rest`/0.000 → `returning`/0.900 (yaw ≈ 0.52 → 0.613); reduced motion `open`/0.720, nespremenjeno.
- TECH-004: `/lab/hero-monolith`, `/lab/home-typography-v1/v1-1440-full.png`, `/mini` 404; lab slika skozi `/_next/image` 404; `/work/flexido/preview/flexido-home-desktop.webp` skozi optimizer 200 `image/jpeg`.

## 6. Lokalna namestitev in dev strežnik

Lock je prenesen šele po uspešnem preverjanju; začetni lock (sha1 `52465341…`) je bil nespremenjen. `npm ci` v projektu uspe, lock je enak kandidatu, `package.json` nespremenjen. Dev drevo tega repozitorija na 3000 (`npm run dev` → `next dev` → `next-server`, cwd repozitorij) sem ustavil in zagnal znova.

Prvi ponovni zagon je vrnil **500** na `/`: `.next/dev/prerender-manifest.json` je bil pokvarjen (`Unexpected non-whitespace character after JSON`), verjetno zaradi sočasnih zahtev iz odprtih lab zavihkov med zagonom. To je regenerabilen dev predpomnilnik, ne povezan z odvisnostmi (gitignored). Ustavil sem le ta dev proces, izbrisal samo `.next/dev` in znova zagnal: `GET /` = **200** (dvakrat), brez `SyntaxError` v dnevniku, cwd je repozitorij. Produkcijski `.next` ni bil spremenjen. `git status --short` je enak začetnemu.

## 7. Omejitve

- Lokalno odpravljeno za preverjeni graf odvisnosti; audit je odvisen od trenutne baze advisoryjev in lahko kasneje pokaže nove.
- Lint ostaja neuspešen zaradi obstoječih diagnostik (TECH-001); ta poseg jih ne spreminja.
- Runtime je lokalen `next start` v Chromiumu na vzorčenih poteh; gostovanje, Vercel glave in Analytics niso preverjeni.
- Dev orodja (eslint, babel, browserslist) se izvajajo ob gradnji/lintu; razvojni runtime ni testiran širše kot z lintom in buildom.
- `.next` iz izolirane kopije ni shranjen; dokazi so izpisi, ne kopije projekta.
