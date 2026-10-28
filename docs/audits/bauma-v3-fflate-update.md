# BAUMA V3 — TECH-003: preostali produkcijski fflate

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**, v delovnem drevesu 121 necommitanih vnosov (ohranjeni, `git status --short` pred in po je identičen). Node **v25.6.1**, npm **11.9.0**. Spremenjen je samo `package-lock.json`, tri vrstice. `package.json` je nespremenjen (sha1 `8a21f4c0…`). Brez override, `npm audit fix` in `--force`. Brez commita, pusha ali deploya. Gostovanje ni preverjeno.

## 0. Popravek razlage semvera

Prejšnje poročilo ([drugi prehod](./bauma-v3-dependency-update-pass2.md), [presoja](./bauma-v3-dependency-risk-review.md)) je trdilo, da `~0.8.2` ne sprejme 0.8.3. To je **napačno**: `~0.8.2` pomeni `>=0.8.2 <0.9.0` in 0.8.3 je znotraj razpona. Prejšnjih poročil nisem prepisal; napačna trditev je popravljena tukaj in z opombo v registru.

## 1. Izhodišče in porabniki

Lock (sha1 `d642b9fa…`) vsebuje dve instanci. Razponi so prebrani iz `packages` v `package-lock.json`, ne povzeti iz prejšnjega poročila:

| Instanca | Porabnik | Zahtevani razpon | Pot |
|---|---|---|---|
| `node_modules/fflate` **0.8.2** | `@types/three@0.184.1` | `~0.8.2` | drei → maath → @types/three |
| `node_modules/three-stdlib/node_modules/fflate` **0.6.11** | `three-stdlib@2.36.1` | `^0.6.9` | drei → three-stdlib |

Drugih porabnikov (dependencies, peer, optional) v locku ni. `npm explain fflate` to potrjuje. Audit pred posegom: celoten graf 6 skupin, 16 GHSA (1 low, 1 moderate, 4 high); `--omit=dev` 1 skupina, 1 GHSA: `fflate` `0.8.0 – 0.8.2`, `fixAvailable: true`.

## 2. Vir popravljene različice

[GHSA-px8p-9vwx-vf98](https://github.com/advisories/GHSA-px8p-9vwx-vf98) (CVE-2026-45820, `unzipSync` neskončna zanka pri okvarjenem ZIP64, CVSS 7.5, CWE-400), prebran prek GitHub advisory API: za vejo 0.8 je `vulnerable_version_range` `>= 0.8.0, < 0.8.3`, `first_patched_version` **0.8.3**. Reference vključujejo [izdajo v0.8.3](https://github.com/101arrowz/fflate/releases/tag/v0.8.3) in [popravek e6d5e6e](https://github.com/101arrowz/fflate/commit/e6d5e6e1076892f72770ac732d83c81da9f3316e). Veja 0.6 je popravljena v 0.6.11 (že v locku). Registrski podatki: `fflate@0.8.3`, objavljena 2026-05-16, integrity `sha512-tbZNuJrL…CsPvgA==` (iz `npm view`, ujema se z vnosom, ki ga je zapisal npm).

## 3. Postopek

Izolirana kopija v scratchpadu (brez `node_modules`, `.next`, `.git`, `.env*`), `npm ci` iz obstoječega locka (lock nespremenjen), nato `npm update fflate --no-save`. Spremenil se je samo vnos `node_modules/fflate`; `fflate@0.6.11` pod `three-stdlib`, `source-map-js@1.2.2` in `baseline-browser-mapping@2.11.0` so ostali.

## 4. Dejanski diff lockfila (proti stanju na začetku posega)

```diff
   "node_modules/fflate": {
-      "version": "0.8.2",
-      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.8.2.tgz",
-      "integrity": "sha512-cPJU47OaAoCbg0pBvzsgpTPhmhqI5eJjh/JIu8tPj5q+T7iLvW/JAYUqmE7KOB4R1ZyEhzBaIQpQpardBF5z8A==",
+      "version": "0.8.3",
+      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.8.3.tgz",
+      "integrity": "sha512-tbZNuJrLwGUp3zshBtdy4W+ORxZuIh8a5ilyIEQDC5rY1f3U20JMry0Ll3WBzU58EZKsEuJFXhb5gwv8CsPvgA==",
```

`diff` začetnega in končnega locka: natanko 3 vrstice (3945–3947). Sha1 locka: `d642b9fa…` → `52465341…`.

## 5. Audit pred / po

| Merilo | Celoten graf pred | po | `--omit=dev` pred | po |
|---|---:|---:|---:|---:|
| Skupine | 6 | **5** | 1 | **0** |
| low / moderate / high / critical | 1 / 1 / 4 / 0 | **1 / 0 / 4 / 0** | 0 / 1 / 0 / 0 | **0 / 0 / 0 / 0** |
| Različni GHSA | 16 | **15** | 1 | **0** |

Odpravljena skupina: `fflate` (GHSA-px8p-9vwx-vf98). Preostalo (vse razvoj): `@babel/core` (GHSA-4x5r-pxfx-6jf8), `brace-expansion` (7 GHSA), `browserslist` (GHSA-c83g-rgw3-j3cx, GHSA-73wf-gq98-2v4g), `js-yaml` (4 GHSA), `zod` (GHSA-mrhx-c7xc-m3w5). **Produkcijski `npm audit --omit=dev` je zdaj čist (0).** Zbirni števec ni trditev, da je projekt varen.

## 6. Preverjanje izolirane kopije

- `npm ci` (dvakrat, drugič z brisanjem `node_modules`): uspe, lock se ne spremeni.
- `npm ls fflate --all`: `@types/three@0.184.1` → `fflate@0.8.3`; `three-stdlib@2.36.1` → `fflate@0.6.11`; ni invalid/extraneous.
- `npx tsc --noEmit`: izhod 0.
- `next build`, `SITE_ENV=production`, `VERCEL_ENV=production`, Next 16.4.1, Turbopack: izhod 0, 208 strani.
- `next start` na prostih vratih (naključno dodeljena, ne 3000), lasten `.next`; zdaj ustavljen.

Runtime (Playwright 1.62.1 Chromium, poslušalci `console`/`pageerror` pripeti pred `goto`, torej od začetka nalaganja):

| Pot | Status |
|---|---|
| `/`, `/en`, `/pristop`, `/work`, `/o-nas` | 200 |
| `/work/artbite`, `dema-plus`, `flexido`, `hardshelljacket`, `odstrani-tattoo`, `ulterior` | 200 |

Brez `pageerror`, brez hydration napak, brez `console.error` razen enega na vsaki poti: 404 za `/_vercel/insights/script.js` (skript Vercel Analytics obstaja samo na Vercel; izven fflate in te spremembe; poti niso primerjane z izhodiščnim lockom, zato je to pripisano gostovanju, ne dokazano). Opozorila `preload not used` so brskalniška opozorila, ne napake.

Domača kocka (`svg[data-reveal]`, vzorčeno 6 × 700 ms po pomiku v pogled):

| Okno | Način | Začetek → konec |
|---|---|---|
| 1440 × 900 | live | `rest`/0.000 → `returning`/0.900, yaw 0.5200 → 0.6135 |
| 375 × 812 | live | `rest`/0.000 → `returning`/0.890, yaw 0.5200 → 0.6113 |
| 1440 × 900 in 375 × 812, reduced motion | reduced | `open`/0.720, nespremenjeno |

Brez novih `pageerror` na kocki.

TECH-004 vzorec: `/lab/hero-monolith` 404, `/lab/home-typography-v1/v1-1440-full.png` 404, `/mini` 404, `/_next/image?url=/lab/odstrani-results/3before.webp` 404, `/_next/image?url=/work/flexido/preview/flexido-home-desktop.webp` 200 `image/jpeg`.

## 7. Prenos in lokalna namestitev

Pred prenosom je bil lock projekta še enak začetnemu (sha1 `d642b9fa…`). Prenesen je samo preverjeni lock; diff proti začetku je tri vrstice (razdelek 4). `npm ci` v projektu: uspe, 425 paketov, lock in `package.json` nespremenjena, `npm ls` kaže 0.8.3 / 0.6.11.

## 8. Dev strežnik

Na vratih 3000 je tekel ta repozitorij (`npm run dev` → `next dev` → `next-server`, cwd v repozitoriju; PID 71199 / 71215 / 71221). Ustavil sem samo to drevo, ker `npm ci` zamenja `node_modules`. Nov `npm run dev` posluša na 3000 (cwd repozitorij), `GET /` = **200**.

## 9. Omejitve

- Ni dokaza, da bi aplikacija klicala `unzipSync`; popravek je vzdrževalna odprava prizadete različice.
- Razvojna opozorila (5 skupin, 15 GHSA) niso naslovljena; TECH-003 ostaja **delno odprt**.
- Runtime je lokalen `next start`, ne Vercel. Gostovanje, glave in Analytics niso preverjeni.
- Konzolni dokaz velja za Chromium in vzorčene poti/zaslone; ostali brskalniki niso preverjeni.
- Surovi izpisi (audit pred/po, build, runtime, preizkusni skripti, diff locka) so prenešeni v [bauma-v3-fflate-evidence](./bauma-v3-fflate-evidence/) naknadno, 26. 10. 2026, iz scratchpada iste seje; so izvirni izpisi tistega posega. `npm ci`, `tsc` in `npm ls` izpisi niso bili shranjeni v datoteke; njihovi rezultati so samo v poročilu.
