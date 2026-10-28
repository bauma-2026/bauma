# BAUMA V3 — TECH-005: lokalna ureditev politike indeksiranja

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**, Node v25.6.1, npm 11.9.0. Spremembe so **lokalne in necommitane**; preverjene so bile najprej v izolirani kopiji, nato prenesene. **Gostovanje ostaja nespremenjeno**: nastavitve in okolja Vercela niso bila spremenjena ali brana, bauma.si ni bil objavljen, ni commita, pusha ali deploya. Dev strežnik na 3000 ni bil ustavljen (po prenosu `GET /` = 200). `package.json` in `package-lock.json` sta nespremenjena. Dokazi: [bauma-v3-indexing-policy-evidence](./bauma-v3-indexing-policy-evidence/). Izhodišče: [indeksni pregled](./bauma-v3-indexing-review.md).

## 1. Politika

Indeksiranje je dovoljeno **samo**, ko je `SITE_ENV === "production" && VERCEL_ENV === "production"`. V vseh drugih okoljih (staging z `VERCEL_ENV=production`, preview, lokalni build, manjkajoč ali napačen `SITE_ENV`, tudi `SITE_ENV=production` z drugačnim `VERCEL_ENV`): meta `noindex, nofollow`, `X-Robots-Tag: noindex, nofollow` na vseh odgovorih, `robots.txt` `Disallow: /` brez `Sitemap`, prazen sitemap in brez canonical, hreflang in `og:url`.

Vrednost se prebere ob **gradnji** (modul `lib/siteEnv.ts`, `next.config.ts`, statične strani, `robots.ts`, `sitemap.ts`). To je preverjeno in ne predpostavljeno: razdelek 4, preizkusi neskladja.

## 2. Spremenjene datoteke

| Datoteka | Sprememba |
|---|---|
| `lib/siteEnv.ts` | Nov `isIndexable` (enotna odločitev). `isStaging` ostane **samo** za dostop do poti (TECH-004). |
| `lib/indexing.ts` (**nova**) | `INDEXABLE_PATHS` (11), `canonicalUrl`, `indexing(path, languages?)` (robots + canonical + hreflang), `ogUrl(path)`, `ROOT_OPEN_GRAPH`. Izven `isIndexable` vrne samo `noindex`. |
| `next.config.ts` | `X-Robots-Tag: noindex, nofollow` na `/:path*` ko `!isIndexable` (prej samo `isStaging`). Redirect `/lab/:path*` (samo `isStaging`), `developmentRoutesClosed` in prepisi, pravila za `/images/gregor/**` in njihov optimizer so **nespremenjeni**. |
| `app/robots.ts`, `app/sitemap.ts` | Po `isIndexable`; sitemap iz `INDEXABLE_PATHS`, brez `lastmod`, `changefreq`, `priority`. |
| `app/layout.tsx` | Root `openGraph` iz `ROOT_OPEN_GRAPH` **brez `url`**; privzeti `noindex` ostane. |
| `app/en/layout.tsx` | Odstranjen `og:url` (EN pravne strani so podedovale `https://bauma.si/en`); privzeti `noindex` ostane. |
| `app/page.tsx`, `app/en/page.tsx` | `robots`, canonical in hreflang prek `indexing()`; `og:url` prek `ogUrl()`; odstranjen `isProduction`. |
| `app/pristop`, `app/work`, `app/o-nas`, `app/work/odstrani-tattoo` | `robots` + canonical prek `indexing()`; dodan `openGraph` = `ROOT_OPEN_GRAPH` + `ogUrl()` (isti naslov, opis in slika kot prej podedovani, dodan samo `og:url`). |
| `app/work/{artbite,dema-plus,flexido,hardshelljacket,ulterior}/page.tsx` | `robots` + canonical prek `indexing()`, `og:url` prek `ogUrl()`. |

Podedovanje: root in EN layout ostaneta `noindex` privzeto (zaščita pravnih, starih in neznanih poti); samo 11 strani se v produkciji izrecno vrne `index, follow` s `robots` na ravni strani, ki zamenja privzeto. Pravne strani in stare poti nimajo `robots`/canonical sprememb. Ker `og:url` ni več v layoutih, 404 odgovori in neindeksirane strani nimajo več `og:url` (prej `https://bauma.si`); to je posledica, ne oblikovanje 404. Koda, vsebina, prevodi, poti in preusmeritve pravnih/starih strani niso spremenjeni.

## 3. Seznam 11 indeksabilnih URL-jev (potrjen proti dejanskim potem)

`/`, `/pristop`, `/work`, `/work/flexido`, `/work/odstrani-tattoo`, `/work/dema-plus`, `/work/ulterior`, `/work/artbite`, `/work/hardshelljacket`, `/o-nas`, `/en` (v sitemapu s predpono `https://bauma.si`; domača brez poševnice). Vseh 11 vrne 200 v produkcijski gradnji in je v seznamu poti `next build`. Canonical je samoreferenčen (`https://bauma.si` + pot), `og:url` je enak canonicalu.

**Popravek:** prejšnji indeksni pregled in prva različica registra sta omenjala 13 URL-jev; pravilno je **11**. Pregleda nisem prepisal; popravek je tukaj in v registru.

Ostane `noindex` in zunaj sitemapa (z neizpremenjenimi potmi): `/pogoji-uporabe`, `/zasebnost`, `/piskotki`, `/en/terms`, `/en/privacy`, `/en/cookies`, `/approach`, `/contact`, `/novice`, `/novice/odstrani-tattoo-structure`, `/novice/dema-plus-preview`.

## 4. Preverjanje v izolirani kopiji

Izolirana kopija (brez `node_modules`/`.next` projekta; lasten `.next` v CoW kopiji za vsako gradnjo; naključna prosta vrata; brez `.env*`). Dev cache na 3000 ni bil uporabljen. Skripti [`capture.mjs`](./bauma-v3-indexing-policy-evidence/capture.mjs), [`matrix.sh`](./bauma-v3-indexing-policy-evidence/matrix.sh), [`rerun.sh`](./bauma-v3-indexing-policy-evidence/rerun.sh), [`verify-policy.mjs`](./bauma-v3-indexing-policy-evidence/verify-policy.mjs); izhod [`verify.out`](./bauma-v3-indexing-policy-evidence/verify.out), tabela [`environment-matrix.md`](./bauma-v3-indexing-policy-evidence/environment-matrix.md), surovi odgovori v `builds/`.

Devet ločenih gradenj (`next build` + `next start`) in štirje zagoni istega artefakta z drugim runtime okoljem:

| Gradnja / zagon | Meta `/` | `X-Robots-Tag` | canonical / hreflang / og:url | robots.txt | sitemap |
|---|---|---|---|---|---|
| `SITE_ENV=production` `VERCEL_ENV=production` | index, follow (11 strani) | — | samoreferenčni; hreflang samo `/` in `/en` | Allow + Sitemap | 11 URL |
| `staging` / `production` | noindex | noindex, nofollow | — | Disallow | 0 |
| SITE_ENV neizdan / `preview` | noindex | noindex, nofollow | — | Disallow | 0 |
| SITE_ENV neizdan / `production` | noindex | noindex, nofollow | — | Disallow | 0 |
| `Staging` (napačen) / `production` | noindex | noindex, nofollow | — | Disallow | 0 |
| obe neizdani | noindex | noindex, nofollow | — | Disallow | 0 |
| `production` / `preview` | noindex | noindex, nofollow | — | Disallow | 0 |
| `production` / neizdan | noindex | noindex, nofollow | — | Disallow | 0 |
| `staging` / `preview` | noindex | noindex, nofollow | — | Disallow | 0 |

Preizkusi neskladja (isti artefakt, drugi runtime): produkcijski artefakt, zagnan s `SITE_ENV=staging VERCEL_ENV=preview` in z obema neizdanima, ostane **indeksabilen** (vrednosti so zapečene ob gradnji); staging artefakt, zagnan s `production`/`production`, ostane noindex; preview artefakt, zagnan s `production`/`production`, ostane noindex. Znotraj posameznega artefakta meta, glave, `robots.txt` in sitemap **niso v neskladju**. Posledica: pravo okolje mora biti nastavljeno ob gradnji; zagon ga ne popravi (release pogoj spodaj).

`verify-policy.mjs`: 13 zagonov, **0 napak** (117 preverjanj za indeksabilne, 101 za noindex). Skript je preizkušen tudi negativno (isti odčitki proti napačnemu pričakovanju padejo). Pokriva:

- 11 URL-jev: 200, ena meta `index, follow`, brez `X-Robots-Tag`, canonical in `og:url` enaka URL-ju strani; hreflang `sl`/`en`/`x-default` samo na `/` in `/en`, vzajemno enak niz; 9 podstrani brez hreflang.
- Pravne, stare in `/novice/*`: 200, ena meta `noindex, nofollow`, brez canonical/hreflang/`og:url`.
- 404: status 404, brez `index`, brez `og:url`/canonical.
- `sitemap.xml`: natanko 11 `<loc>`, enak seznam in vrstni red, brez `lastmod`, `changefreq`, `priority`; hreflang alternates samo na paru `/` ↔ `/en`.
- TECH-004: produkcija (in preview/ostalo) lab stran, lab datoteka, `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview`, lab slika skozi optimizer: **404**; staging `/lab/**`: **307 → /**; staging `/mini`, `/about-preview` (zunaj `/lab`): 200 in `noindex`; `/work/flexido/preview/...` skozi optimizer: **200** v vseh gradnjah; `/images/gregor/**`: `X-Robots-Tag: noindex, noimageindex` ohranjen.

Drugo preverjanje v izolirani kopiji: `npx tsc --noEmit` izhod 0 ([tsc.log](./bauma-v3-indexing-policy-evidence/tsc.log)); vseh devet produkcijskih gradenj `next build` izhod 0, 208 strani; ciljni lint (`eslint` na vseh spremenjenih datotekah + `lib/indexing.ts`): 0 napak, 0 opozoril pred in po (enak izhod); `git diff --check` na prenesenih datotekah: izhod 0. Celotnega lint TECH-001 nisem zaganjal in ga ne popravljam. Po prenosu so datoteke v projektu bajtno enake preverjenim (`cmp`), `package*.json` nespremenjena, `git status` se razlikuje samo za navedene datoteke.

## 5. Ohranjene in dokumentirane razlike

- **Staging optimizer 500** (`/_next/image?url=/lab/...` na `SITE_ENV=staging`) je ostal, izven obsega; v matriki ga skript ne šteje kot napako.
- **`<html lang="sl">` na `/en`**: obstoječa napaka, **ni popravljena** (ločen poseg brez odjemalskega JS popravka). Hreflang in canonical za `/en` sta pravilna.
- **EN vsebinska neusklajenost**: `/en` je vzporednica starejše SL sestave; ostane odprta točka EN/IT prenove. `/en` ostane indeksiran v produkciji; hreflang par `/` ↔ `/en` je ohranjen. Podstrani SL niso povezane z `/en`; EN/IT poti niso ustvarjene.
- `metadataBase` ostaja `https://bauma.si`, zato so `og:image` in `twitter:image` absolutni na produkcijski domeni tudi v noindex okoljih (slike, ne URL strani; OG je izven obsega).
- Naslovi in opisi (`/work`: `Work preview for Bauma.` ipd.) so nespremenjeni; izven obsega.
- `work.bauma.si`: staging gradnja ostane noindex tudi po prihodnji objavi produkcije, ker zahteva `SITE_ENV=staging` (ali kateri koli ne-produkcijski nabor) ob svoji gradnji.

## 6. Release pogoji (nastavitve zdaj niso spremenjene)

1. Produkcijski Vercel projekt mora imeti **`SITE_ENV=production`** nastavljen **pred** novo gradnjo; brez tega bo nova politika proizvedla noindex celotno bauma.si.
2. Staging projekt mora imeti **`SITE_ENV=staging`** pred novo gradnjo (ostane noindex; lab redirect).
3. Obstoječe zgrajene deploye je treba ponovno zgraditi (okolje je zapečeno ob gradnji); sprememba okolja brez nove gradnje ne učinkuje.
4. Po prvi produkcijski gradnji: preveriti, da je dejanski deploy res zgrajen z obema vrednostma (log gradnje ali odgovori), nato read-only pregled `bauma.si` (11 URL-jev `index, follow`, `robots.txt`, sitemap z 11 URL-ji, `work.bauma.si` noindex). Vercel nastavitev, deployment in Search Console v tem koraku **niso preverjeni**.
5. Odprto: ali naj preview deploymenti dobijo dodatno zaščito dostopa (odločitev lastnika).

## 7. Omejitve

- Vse je lokalno: Chromium ni bil potreben, preverjanje je HTTP/HTML (`fetch`) na `next start`; Vercel ali CDN obnašanje ni preverjeno.
- Diff v [changed-files.diff](./bauma-v3-indexing-policy-evidence/changed-files.diff) je proti HEAD in vsebuje tudi prejšnje necommitane spremembe v istih datotekah; sam poseg je opisan v razdelku 2.
- Brez zagona celotnega lint (TECH-001) in brez vizualnega preverjanja (spremembe ne vplivajo na prikaz).
