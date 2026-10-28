# BAUMA V3 — TECH-004: omejitev razvojnih poti

Datum: **26. 10. 2026**. Veja: **`staging/bauma-v3`**. Next.js **16.4.1**. Izvedba je lokalna. Gostovanje, `bauma.si` in `work.bauma.si` niso klicani. Ni commita, pusha ali deploya.

Lab strani in datoteke v `public/lab` ostanejo v repozitoriju in v produkcijskem artefaktu. Zapora je prepis poti na obstoječi 404, ne brisanje. Staging noindex ni zasebnost.

## 1. Dev strežnik na vratih 3000

Proces je bil ta repozitorij: `npm run dev` → `next dev` → `next-server (v16.4.1)`, delovni imenik `/Users/bauma/Applications/Projects/bauma-portfolio`.

`GET /` je vrnil **500** in telo `Internal Server Error`. Dnevnik `.next/dev/logs/next-development.log` je ponavljal:

`SyntaxError: Unexpected non-whitespace character after JSON at position 476 (line 1 column 477)`

Datoteka `.next/dev/prerender-manifest.json` je imela 538 bajtov in dva zlepka JSON. `json.loads` je javil `Extra data` na položaju 476. To je generirani manifest, ne izvorna stran. Izvorne kode zaradi tega nisem spreminjal.

Ustavil sem samo to drevo procesov, manifest premaknil v `/tmp/bauma-dev-500/prerender-manifest.json` in znova zagnal `npm run dev` na vratih 3000. Novi manifest je veljaven JSON. Po zagonu so `/`, `/lab/hero-monolith` in `/about-preview` vrnili **200**. Po prenosu `next.config.ts` isti strežnik še vedno vrne **200** za `/`, `/lab/hero-monolith`, `/about-preview` in PNG iz `public/lab`.

## 2. Zakaj ne kombinacija proxy in notFound()

V izolirani kopiji sem najprej preizkusil stran, ki takoj pokliče `notFound()`, in `beforeFiles` prepis nanjo. HTTP status je bil 404, vendar je bilo telo dokument `__next_error__` brez naslova `404` in brez besedila `This page could not be found.` Neznana pot je v istem strežniku vrnila obstoječi 404 z `next-error-h1`. Dokumentacija te različice pove, da `notFound()` pred začetkom streamanja vrne 404, klic znotraj `Suspense` pa lahko obdrži 200. Takojšen klic je dal status 404, ne pa obstoječega prikaza.

Zato cilj prepisa ni lastna stran, temveč vgrajena pot `/_not-found`. Na tej različici `GET /_not-found` vrne 404 in isto telo kot neznana pot. Proxy ni potreben: `beforeFiles` teče pred `public/` in pred app potmi, zato isto pravilo zajame strani in datoteke. Pravila ne gledajo končnice, `Accept` ali `RSC`.

## 3. Rešitev

Spremenjena je samo `next.config.ts`. `lib/siteEnv.ts` in pomen `isStaging` sta nespremenjena. SEO, `robots.ts`, sitemap in glave niso spremenjeni.

```ts
const developmentRoutesClosed =
  process.env.NODE_ENV === "production" && !isStaging;
```

Ko je to true, `rewrites().beforeFiles` prepiše na `/_not-found`:

- `/lab/:path*` (vključno z `/lab`, ugnezdenimi potmi in datotekami)
- `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview`
- `/_next/image`, če je poizvedba `url` `/lab/.*` ali kodirana `%2Flab...`

`next dev` naloži konfiguracijo z `NODE_ENV=development`, zato je seznam prazen. Staging gradnja z `SITE_ENV=staging` prav tako ne doda teh prepisov in obdrži obstoječo preusmeritev `/lab/:path*` → `/` s statusom 307.

Vrednost se prebere, ko Next naloži `next.config.ts`, in se zapiše v `routes-manifest.json`. `next start` manifesta ne zgradi znova. To je preverjeno: isti produkcijski artefakt, zagnan s `SITE_ENV=staging`, `SITE_ENV=stagng` ali brez `SITE_ENV`, ostane zaprt. Poljuben `process.env` v strani ni uporabljen kot stikalo.

`/approach`, `/contact` in `/novice` niso na seznamu.

## 4. Kje je bila preverjena

Izolirana kopija zunaj repozitorija, lasten `.next`, brez dev predpomnilnika projekta in brez lokalnih okoljskih datotek. Začasna stran za odjemalsko navigacijo je ostala samo v kopiji. V projekt je prenesena samo `next.config.ts`, ki se ujema s preverjeno.

Vse gradnje: Next 16.4.1, Turbopack, `VERCEL_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`. `NODE_ENV` nastavi `next build` sam na `production`.

| Gradnja | Zagon | Rezultat |
|---|---|---|
| `SITE_ENV=production` | `SITE_ENV=production` | Zaprto, glej tabelo. Manifest: prepisov `beforeFiles` je sedem, preusmeritve `/lab` ni. |
| Isti artefakt | `SITE_ENV=staging` | `/lab/hero-monolith`, lab datoteka, `/mini`, `/about-preview` ostanejo **404**. `/` in `/work/flexido` ostaneta **200**. Staging glava se ne pojavi. |
| Isti artefakt | `SITE_ENV=stagng` in zagon brez `SITE_ENV` | Isto zaprto. |
| Brez `SITE_ENV` | brez `SITE_ENV` | Manifest ima iste prepise. Vzorci lab, embed, datoteka, `/mini`, `/en/about-preview` so **404**. `/`, `/work/flexido`, `/approach`, `/novice/dema-plus-preview` so **200**. |
| `SITE_ENV=stagng` | `SITE_ENV=stagng` | Enako zaprto kot manjkajoči `SITE_ENV`. |
| `SITE_ENV=staging` | privzeti zagon tega artefakta | Manifest: `/lab/:path*` → `/` **307**, `beforeFiles` prazen. Brez sledenja preusmeritvi so `/lab`, `/lab/hero-monolith`, embed in lab datoteka **307** na `/`. `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview` so **200** z `X-Robots-Tag: noindex, nofollow`. `/`, `/en`, `/work/flexido`, `/approach`, `/contact`, `/novice` in projektno sredstvo so **200** z isto glavo. `robots.txt` je `Disallow: /`. |
| `next dev` na vratih 3217, brez `SITE_ENV` | isti proces | `/lab/hero-monolith`, `/about-preview`, `/mini` in `/` so **200**. PNG iz `public/lab` je **200** in `image/png`. Dev manifest nima prepisov zapore. |

## 5. Produkcijska gradnja `SITE_ENV=production`

Brez `Location`. Telo zaprtih HTML odgovorov je bajtno enako neznani poti `/audit04-missing-tech004`: naslov `Bauma — Jasna struktura. Več odločitev.`, `next-error-h1`, besedilo `This page could not be found.` To je obstoječi 404, ne nov dizajn.

| Zahteva | Status |
|---|---|
| GET in HEAD `/lab`, `/lab/hero-monolith` | 404 |
| GET `/lab/typography-foundation/opsz`, `/lab/hero-object-reframe`, `/lab/system-cube/b51`, `/lab/system-cube/b51?reveal=1`, `/lab/services-direction-c/a`, `/lab/surface-tone/d` | 404 |
| GET `/lab/system-cube/embed/b51`, `/lab/services-art/embed/a`, `/lab/hero-contact-photographic/frame/current/hero` | 404 |
| GET `/lab/does-not-exist-tech004` | 404, isto telo |
| GET in HEAD `/lab/home-typography-v1/v1-1440-full.png`, GET `/lab/odstrani-results/3before.webp`, `/lab/work-posters/ulterior-logo.svg` | 404, HTML, ne slika |
| GET in HEAD `/mini`; GET `/en/mini`, `/about-preview`, `/en/about-preview` | 404 |
| RSC `RSC: 1` na lab, embed, `/mini`, `/about-preview` | 404, `text/x-component`, v telesu ni besedila monolith |
| Odjemalski `Link` in `router.push` na lab, embed, `/mini`, `/about-preview`, `/en/about-preview` | URL ostane zahtevana pot, naslov in `h1` sta 404, dokument **404**. Javni `Link` na `/work/flexido` in `router.push` na `/pristop` ostaneta **200** z naslovoma Flexido in Pristop. |
| `/`, `/en` | 200, `index, follow` |
| `/pristop`, `/work`, `/o-nas`, vseh šest študij | 200 |
| `/pogoji-uporabe`, `/zasebnost`, `/piskotki`, `/en/terms`, `/en/privacy`, `/en/cookies` | 200 |
| `/approach`, `/contact`, `/novice`, oba zapisa | 200 |
| `/work/flexido/preview/flexido-home-desktop.webp` | 200, `image/webp` |
| `/robots.txt`, `/sitemap.xml` | 200, `Allow: /` in sitemap `https://bauma.si` |

Segmentni prefetch z glavo `Next-Router-Segment-Prefetch: /_tree` na zaprto pot vrne **200**. Telo poimenuje segment `/_not-found` in ne vsebuje lab strani. To ni vsebina laboratorija. Navigacijski dokument in običajna RSC zahteva ostaneta 404.

## 6. Image optimizer

Na produkcijski gradnji:

- `/_next/image?url=%2Flab%2Fodstrani-results%2F3before.webp&w=640&q=75` → **404**, isto HTML telo kot neznana pot
- isto z nekodiranim `url=/lab/...` → **404**
- `/_next/image?url=%2Flab%2Fhome-typography-v1%2Fv1-1440-full.png&w=640&q=75` → **404**
- `/_next/image?url=%2Fwork%2Fflexido%2Fpreview%2Fflexido-home-desktop.webp&w=640&q=75` in nekodirana oblika → **200**, `image/jpeg`
- absolutni `http://127.0.0.1/.../lab/...` in `url` brez začetne poševnice → **400** z besedilom, da parameter `url` ni veljaven; slike ni v telesu

Lokalni lab URL, ki bi ga optimizer sicer vrnil, je zaprt. Javno projektno sredstvo ostane odprto.

## 7. Prenos in preverjanje v projektu

`npx eslint next.config.ts` in `npx tsc --noEmit` sta uspela. `git diff --check -- next.config.ts` je čist. Git staging je ostal prazen. Dev strežnik na vratih 3000 pripada temu repozitoriju in po prenosu še vedno servira lab stran, predogled in lab PNG z **200**.

## 8. Omejitve

- Objavljeni staging in produkcija nista preverjena. Lokalni `next start` ni dokaz gostovanja.
- Poti ostanejo v seznamu gradnje. Omejen je odgovor na navedenih URL-jih.
- Staging `/lab/**` je 307 na javno `/`, ne 404. Kdor sledi preusmeritvi, dobi domačo stran. Predogledi zunaj `/lab` so na staging gradnji še 200. Noindex tega ne skrije.
- Odgovor 307 sam ni imel `X-Robots-Tag`. Strani s statusom 200 na staging gradnji so imele `noindex, nofollow`. Pravila glav niso bila spremenjena.
- Manjkajoč `SITE_ENV` zapre razvojne poti, indeksiranje `/` in `/en` pa še vedno sledi obstoječemu `isStaging`. To je TECH-005 in ta poseg tega ne spreminja.
- `/approach`, `/contact` in `/novice` ostajajo dosegljivi v produkcijski gradnji.
