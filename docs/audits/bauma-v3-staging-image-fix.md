# BAUMA V3 — staging image optimizer: odprava odgovora 500

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**, Next.js 16.4.1, Node v25.6.1. Sprememba je **lokalna in necommitana**; spremenjena je ena datoteka, `next.config.ts`. Gostovanje je nespremenjeno in nepreverjeno: `work.bauma.si` ostane noindex (staging gradnja še vedno nosi `X-Robots-Tag: noindex, nofollow`), bauma.si ni objavljen, nastavitve Vercela niso bile spremenjene. `package.json` in `package-lock.json` sta nespremenjena. Dev strežnik na 3000 ni bil ustavljen. Dokazi: [bauma-v3-staging-image-evidence](./bauma-v3-staging-image-evidence/).

## 1. Reprodukcija in vzrok

Izolirana kopija, ločena gradnja `SITE_ENV=staging VERCEL_ENV=production`, lasten `.next`, `next start` na prostih vratih. Celoten optimizer URL z dovoljenima `w=640&q=75` (iz [route-exposure poročila](./bauma-v3-route-exposure-fix.md)):

| Zahteva | Status pred popravkom |
|---|---|
| `/_next/image?url=%2Flab%2Fodstrani-results%2F3before.webp&w=640&q=75` | **500**, telo `"url" parameter is valid but internal response is invalid`, `X-Robots-Tag: noindex, nofollow` |
| `/_next/image?url=/lab/odstrani-results/3before.webp&w=640&q=75` | **500**, isto |
| `/lab/odstrani-results/3before.webp` (neposredno) | 307, `location: /` |
| `/lab/hero-monolith` | 307, `location: /` |

Strežniški dnevnik: `⨯ internal image response failed for /lab/odstrani-results/3before.webp 307` ([surovo](./bauma-v3-staging-image-evidence/before-raw-http.txt), [dnevniki](./bauma-v3-staging-image-evidence/logs/)). Vseh 20 preverjenih kombinacij (5 pravih lab slik × kodiran/nekodiran `url` × dva vrstna reda parametrov) vrne 500.

**Vzrok (potrjen v izvorni kodi nameščene različice, `node_modules/next/dist/server/image-optimizer.js`, ~vrstica 771–775):** za lokalni `url` optimizer sam interno zahteva to pot (`handleRequest` z lažnim odgovorom) in sprejme samo statusa 2xx; sicer zapiše `internal image response failed for <href> <status>` in vrže `ImageError`, ki se pokaže kot 500. Staging ima `redirects()` pravilo `/lab/:path*` → `/` (TECH-004: neposredni dostop 307). Optimizer je zato dobil 307 in ne sliko. Pravilo zapore za optimizer (`beforeFiles` rewrite na `/_not-found`) je bilo pogojeno z `developmentRoutesClosed = NODE_ENV === "production" && !isStaging`, torej v stagingu sploh ni obstajalo – in zato se zahteva `/_next/image?...` nikoli ni preusmerila na 404. Razlika od ne-staging gradenj (kjer ista zahteva vrne 404) je torej samo odsotnost tega rewrite pravila; redirect sam ni napaka, izvira pa iz njega neveljaven interni odziv. Vrstni red v Nextu: `redirects` → `beforeFiles` rewrites → datoteke/poti. Redirect `/lab/:path*` ne ujame `/_next/image`, zato je bil dovolj dodati rewrite za optimizer.

## 2. Popravek (`next.config.ts`)

Obstoječe lab pravila za optimizer (dva `has: query url`) so izvlečena v skupen seznam `LAB_IMAGE_RULES`; novo stikalo `labImagesClosed = NODE_ENV === "production"` ta dva pravila doda tudi v stagingu. Preostala zapora (`/lab/:path*`, `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview`) ostane vezana na `developmentRoutesClosed` in je v stagingu še vedno odprta. Zahteva za lab sliko prek optimizerja v stagingu zdaj gre na `/_not-found` in vrne pravi **404**, brez interne zahteve na redirect.

Ni dodan proxy, odvisnost, izklop optimizerja ali odprtje labov; staging redirect ni odstranjen; `isStaging`, `isIndexable`, politika indeksiranja in glave (`X-Robots-Tag`, `noindex, noimageindex` za osebne fotografije) niso spremenjeni. V `next dev` je `NODE_ENV=development`, zato `labImagesClosed` ni aktiven in lab slike delujejo kot prej. Diff: [next.config.diff](./bauma-v3-staging-image-evidence/next.config.diff) (proti stanju na začetku tega posega).

## 3. Preverjanje

Skript [`verify-staging-image.mjs`](./bauma-v3-staging-image-evidence/verify-staging-image.mjs) (40 preverjanj, dejanski HTTP; pet pravih lab datotek se izbere iz `public/lab`), [`verify-policy.mjs`](./bauma-v3-staging-image-evidence/verify-policy.mjs) za indeksiranje, [`fixrun.sh`](./bauma-v3-staging-image-evidence/fixrun.sh) za gradnjo/zagon.

| Okolje | Pred | Po |
|---|---|---|
| **Staging** gradnja, 5 lab slik × 4 oblike URL (kodiran, nekodiran, `q` pred `w`, `url` zadnji) | 500 (20/20) | **404 (20/20)**, v dnevniku ni več `internal image response failed` za lab |
| Staging, neposredna lab datoteka in lab stran | 307 → `/` | 307 → `/` (nespremenjeno) |
| Staging `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview` | 200, noindex | 200, `X-Robots-Tag: noindex` |
| Staging projektna slika `/work/flexido/preview/...` prek optimizerja (kodirana, nekodirana, drug vrstni red, `/lab/` v drugem parametru) | 200 `image/jpeg` | 200 `image/jpeg` |
| Staging `/og/...` prek optimizerja, osebna fotografija (`noimageindex`) | 200 | 200, glava ohranjena |
| Staging: podobna pot `/laboratory/x.png`, pot, ki vsebuje besedo `lab` | 404 (datoteka ne obstaja) | 404 (ni blokirana z lab pravilom; napake v dnevniku so le za neobstoječe datoteke) |
| **Produkcijska** gradnja: lab slike prek optimizerja | 404 | 404 (20/20) |
| Produkcija: lab stran in datoteka, `/mini`, `/about-preview` (+EN) | 404 | 404 |
| Produkcija: javne strani, projektne slike, 11 indeksabilnih URL-jev, sitemap (11 URL), robots | v redu | nespremenjeno; `verify-policy.mjs` 0 napak (117 preverjanj) |
| Staging: politika indeksiranja | noindex povsod | `verify-policy.mjs` 0 napak (101 preverjanj), `optimizer 404 (was 500)` |
| **`next dev`** (lasten `.next`, prosta vrata): lab stran, lab datoteka, lab slike prek optimizerja (20 oblik) | 200 (40/40 ok) | 200 (40/40 ok) |

Drugo: `npx tsc --noEmit` izhod 0; `eslint next.config.ts` 0 napak, 0 opozoril pred in po; `git diff --check -- next.config.ts` izhod 0; obe produkcijski gradnji (staging in production) `next build` izhod 0. Po prenosu je `next.config.ts` v projektu bajtno enak preverjenemu, `package*.json` nespremenjena, `git status` brez novih vnosov, dev strežnik na 3000 vrne 200 za `/` in za lab sliko prek optimizerja. Celotnega lint TECH-001 nisem zaganjal.

## 4. Omejitve

- Preverjanje je lokalno (`next start`, `next dev`); Vercel image optimizer in CDN nista preverjena. Ali ima živi `work.bauma.si` še 500, ni preverjeno in popravek tam še ni objavljen.
- Staging je zaprt le za zahteve, kjer je `url` poizvedba `/lab/…` (kodirana ali nekodirana); drugi načini referenciranja lab datotek (npr. protokolno-relativni URL) optimizer že sam zavrne (400/404) in niso del tega popravka.
- Ostale ugotovitve auditov (TECH-001, `<html lang>` na `/en`, EN neusklajenost) niso spremenjene.
