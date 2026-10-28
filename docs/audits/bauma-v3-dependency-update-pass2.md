# BAUMA V3 — TECH-003: drugi prehod odvisnosti

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Node **v25.6.1**, npm **11.9.0**. Spremenjen je samo `package-lock.json` tega prehoda. `package.json` je nespremenjen. Ni override, `npm audit fix` ali `--force`. Next ostaja **16.4.1**, React **19.2.3**, sharp **0.35.5**. Koda, `next.config.ts`, SEO in oblikovanje niso spremenjeni. Ni commita, pusha ali deploya. Gostovanje ni preverjeno.

## 1. Izhodišče

Delovno drevo je že vsebovalo necommitano nadgradnjo Next, eslint-config-next in sharp. Lock ni bil vrnjen na HEAD.

Pred posegom, isti števec kot v presoji:

| Merilo | Celoten graf | `--omit=dev` |
|---|---:|---:|
| Npm skupine | 8 | 3 |
| low / moderate / high / critical | 1 / 2 / 5 / 0 | 0 / 2 / 1 / 0 |
| Različni GHSA | 18 | 3 |

Nameščeno: `source-map-js@1.2.1`, `fflate@0.8.2` in pod `three-stdlib` `fflate@0.6.10`, `baseline-browser-mapping@2.10.27`.

Registrski popravki, ponovno prebrani, ne prevzeti iz prejšnjega zapisa:

- [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q): `source-map-js` `<1.2.2`, popravek **1.2.2**. To je tudi zadnja 1.2.x. `postcss@8.5.23` in `@tailwindcss/node@4.2.4` zahtevata `^1.2.1`.
- [GHSA-px8p-9vwx-vf98](https://github.com/advisories/GHSA-px8p-9vwx-vf98): `fflate` `<0.6.11` in `<0.8.3`. **0.6.11** je zadnja 0.6.x in ustreza `three-stdlib@2.36.1` `^0.6.9`. **0.8.3** ne ustreza `@types/three@0.184.1` `~0.8.2`. V tem razponu obstaja samo 0.8.2.
- [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv): `baseline-browser-mapping` `<2.11.0`, popravek **2.11.0**. `next@16.4.1` zahteva `^2.9.19`, `browserslist@4.28.2` `^2.10.12`. Oba razpona 2.11.0 sprejmeta. Zadnja v 2.x je 2.11.33; ta poseg je ustavil pri 2.11.0, objavljenem 21. 7. 2026, pred 2.11.1.

## 2. Kako je nastal lock

V izolirani kopiji, brez `.env.local` in brez projektnega `.next`:

1. `npm ci` iz obstoječega locka.
2. `npm update source-map-js fflate --no-save`. To je dvignilo `source-map-js` na 1.2.2 in ugnezdeni `fflate` na 0.6.11, a tudi dvignjeni `fflate` na 0.8.3. Ta korak je preširok, ker `~0.8.2` 0.8.3 ne dovoljuje.
3. `npm update baseline-browser-mapping --before 2026-07-22T00:00:00.000Z --no-save`. Izbrana je 2.11.0, ne 2.11.33.
4. Vnos `node_modules/fflate` je vrnjen na prejšnji npm-ov blok 0.8.2, z isto integrity. Vrednost ni ročno sestavljena. Drugih paketov ni.

`npm ci` tega locka ga ni prepisal. `package.json` in `lockfileVersion` 3 sta enaka. Razlika proti locku pred tem prehodom je 18 vrstic, trije paketi:

| Paket | Pred | Po |
|---|---|---|
| `node_modules/source-map-js` | 1.2.1 | **1.2.2** |
| `node_modules/three-stdlib/node_modules/fflate` | 0.6.10 | **0.6.11** |
| `node_modules/baseline-browser-mapping` | 2.10.27 | **2.11.0** |
| `node_modules/fflate` | 0.8.2 | **0.8.2** |

`npm ls` po čisti namestitvi: `postcss@8.5.23` in `@tailwindcss/node@4.2.4` → `source-map-js@1.2.2`; `three-stdlib@2.36.1` → `fflate@0.6.11`; `@types/three@0.184.1` → `fflate@0.8.2`; `next@16.4.1` in `browserslist@4.28.2` → `baseline-browser-mapping@2.11.0`.

## 3. Preverjanje izolirane kopije

- `npm ci`: uspe, lock se ne spremeni.
- `npx tsc --noEmit`: izhod 0. Isti TypeScript ponovi še `next build`.
- Produkcijska gradnja: `SITE_ENV=production`, `VERCEL_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`. Next 16.4.1, Turbopack, 208 strani, lastni `.next`.

`next start` na vratih **3317**, ne na 3000:

| Zahteva | Status |
|---|---|
| `/`, `/en`, `/pristop`, `/work`, `/o-nas` | 200, HTML |
| `/work/artbite`, `/work/dema-plus`, `/work/flexido`, `/work/hardshelljacket`, `/work/odstrani-tattoo`, `/work/ulterior` | 200, HTML |
| `/lab/hero-monolith`, `/mini`, `/lab/home-typography-v1/v1-1440-full.png` | 404, HTML |
| `/_next/image?url=%2Flab%2Fodstrani-results%2F3before.webp&w=640&q=75` | 404, HTML |
| `/_next/image?url=%2Fwork%2Fflexido%2Fpreview%2Fflexido-home-desktop.webp&w=640&q=75` | 200, `image/jpeg` |

Domača kocka v produkcijskem dokumentu, brez Nextovega sloja napake:

- 1440 × 900: `data-mode=live`, iz `phase=rest` / `reveal=0` v `phase=revealing` / `reveal=0.776`, `yaw` 0.5039 → 0.6087.
- 375 × 812: po prihodu sekcije v pogled `phase=revealing`, `reveal=0.982`, `yaw=0.6456`.
- `prefers-reduced-motion: reduce`: `data-mode=reduced`, `phase=open`, `reveal=0.720`.

Vbrizgani lovilec `console.error` se v tem brskalniku ni prijel, zato surovi konzolni izpis ni shranjen. Vidnega sloja napake in preloma strani ni.

## 4. Audit po posegu

Ista metodologija: npm skupina je eno ime paketa. Več GHSA na enem imenu ni več ranljivosti. Dva razpona istega GHSA sta en advisory.

| Merilo | Celoten graf pred | Celoten graf po | `--omit=dev` pred | `--omit=dev` po |
|---|---:|---:|---:|---:|
| Skupine | 8 | **6** | 3 | **1** |
| low / moderate / high / critical | 1 / 2 / 5 / 0 | **1 / 1 / 4 / 0** | 0 / 2 / 1 / 0 | **0 / 1 / 0 / 0** |
| Različni GHSA | 18 | **16** | 3 | **1** |

Odpravljena v nameščenem grafu:

- `source-map-js` — [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q), high. Nameščeno 1.2.2.
- `baseline-browser-mapping` — [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv), moderate. Nameščeno 2.11.0.
- `fflate@0.6.10` — del [GHSA-px8p-9vwx-vf98](https://github.com/advisories/GHSA-px8p-9vwx-vf98). Veja 0.6.11 je zunaj prizadetega razpona. Advisory ostane zaradi 0.8.2.

Preostali celoten graf, 6 skupin in 16 GHSA:

| Skupina | Kje | GHSA |
|---|---|---|
| fflate **0.8.2** | produkcijski graf, `@types/three` `~0.8.2` | [GHSA-px8p-9vwx-vf98](https://github.com/advisories/GHSA-px8p-9vwx-vf98). Audit zdaj navaja samo razpon `0.8.0–0.8.2` in samo `node_modules/fflate`. |
| @babel/core 7.29.0 | dev | [GHSA-4x5r-pxfx-6jf8](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8) |
| brace-expansion 1.1.14 in 5.0.5 | dev | sedem GHSA iz presoje |
| browserslist 4.28.2 | dev | [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx), [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g) |
| js-yaml 4.1.1 | dev | štiri GHSA iz presoje |
| zod 4.4.3 | dev | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) |

`--omit=dev` ima eno skupino in en GHSA: `fflate@0.8.2`. Produkcijski graf ni čist.

## 5. Lokalna namestitev

Dev proces na vratih 3000 je bil ta repozitorij: `npm run dev` → `next dev` → `next-server (v16.4.1)`, cwd `/Users/bauma/Applications/Projects/bauma-portfolio`, PID 44986. Ustavil sem samo to drevo, ker `npm ci` zamenja `node_modules`. Drugih projektov nisem ustavljal.

`npm ci` v projektu je uspel in locka ni spremenil. Nameščeno se ujema s tabelo zgoraj. Novi `npm run dev` posluša na 3000, cwd je spet ta repozitorij. `GET /` vrne **200** in HTML. Dev lab poti ostanejo odprte, kar je pričakovano za `next dev`.

## 6. Status in naslednji korak

TECH-003 je **delno odpravljen**. Tri ciljne različice so zunaj svojih prizadetih razponov. Ranljiva `fflate@0.8.2` in pet razvojnih skupin ostajajo. To ni trditev, da je projekt varen.

Naslednji ozek korak je ločen dev lock, znotraj obstoječih razponov: `@babel/core@7.29.6`, `brace-expansion@1.1.21` in `@5.0.12`, `browserslist@4.28.7`, `js-yaml@4.3.2`, `zod@4.6.6`. `fflate@0.8.3` ta korak ne vključuje, dokler nadrejeni razpon `~0.8.2` ne popusti. Override ni privzeta pot.
