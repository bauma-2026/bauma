# BAUMA V3 — implementacija SL metapodatkov in glavne SL OG slike

Datum: **27. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Spremembe so **lokalne in necommitane**. Gostovanje in okolja niso spremenjeni; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen. Brez namestitev v glavnem projektu, odvisnosti in lockfile nespremenjena. Dokazi: [bauma-v3-sl-metadata-implementation-evidence](./bauma-v3-sl-metadata-implementation-evidence/).

## Kaj je izvedeno

1. **Nova OG slika** `public/og/bauma-og-main-v3.png`: bajtno enaka potrjeni `docs/audits/bauma-v3-og-proposal/bauma-og-main-candidate.png` (SHA-256 `8c3a936e…`), 1200 × 630 (`file`, `cmp`). Stare OG slike niso spremenjene ([kontrolne vsote](./bauma-v3-sl-metadata-implementation-evidence/og-image-checksums.txt)).
2. **`lib/indexing.ts`:** dodana `SL_SOCIAL_IMAGE` (url, 1200 × 630, alt »Bauma — Spletne strani, ki pomagajo pridobivati stranke.«) in `slPageMetadata(path, {title, description}, languages?)`, ki sestavi `title`, `description`, `indexing(path, languages)` (robots, canonical, hreflang) ter OG (`title`, `description`, `ogUrl(path)`, `siteName`, `images`, `locale` `sl_SI`, `type` `website`) in Twitter (`summary_large_image`, `title`, `description`, slika z alt). `ROOT_OPEN_GRAPH` je **nespremenjen**, zato layout in strani, ki ne preidejo na novo funkcijo (EN, pravne, stare poti, 404), dobijo enake vrednosti kot prej. Brez title templata, pripona »— Bauma« je del niza (enkrat).
3. **Deset SL strani** (`app/page.tsx`, `app/pristop/page.tsx`, `app/work/page.tsx`, `app/o-nas/page.tsx` in šest `app/work/*/page.tsx`): `metadata` = `slPageMetadata(...)` z natančnimi potrjenimi besedili (spodaj). `/pristop` in `/o-nas` sta dobila lasten opis, `/pristop`, `/work`, `/o-nas` in `/work/odstrani-tattoo` lasten OG in Twitter (prej podedovan splošni). Domača stran ohrani hreflang par prek istega `HREFLANG`.

Ni spremenjeno: `isIndexable` in `lib/siteEnv.ts`, robots, sitemap, canonical in hreflang pravila, pogojni `og:url`, `X-Robots-Tag` v `next.config.ts`, zapore razvojnih poti, pravila za osebne fotografije, `lang`, `metadataBase`, EN vsebina in metapodatki, vidna vsebina, oblikovanje, odvisnosti, lockfile, konfiguracija.

## Potrjena besedila (kot implementirano)

| Pot | Title | Description |
|---|---|---|
| `/` | Bauma — načrtovanje, oblikovanje in razvoj spletnih strani | Načrtovanje, oblikovanje in razvoj spletnih strani za podjetja. Od strukture in vsebine do izvedbe in objave — z jasnim namenom vsakega dela. |
| `/pristop` | Pristop: od kratkega opisa do zaključka — Bauma | Začnete s kratkim opisom po e-pošti, tudi brez pripravljenega gradiva. Sledijo predlog obsega, ponudba, izvedba in pregled; večino usklajevanja opravimo po e-pošti. |
| `/work` | Izbrani spletni projekti — Bauma | Izbor spletnih strani in digitalnih rešitev. Izhodišča projektov, odločitve pri zasnovi ter povezava med vsebino, oblikovanjem in razvojem. |
| `/o-nas` | O nas: digitalni studio — Bauma | Bauma vodi Gregor Baumgartner. Pri spletnih straneh in digitalnih rešitvah povezuje načrtovanje, oblikovanje in razvoj — od zasnove do objave. |
| `/work/flexido` | Flexido: spletna stran z dvema vstopoma v ponudbo — Bauma | Za Flexido smo prenovili spletno predstavitev: e-katalog smo dopolnili s potjo Rešitve, kjer obiskovalec izhaja iz proizvodnega procesa ali naloge. |
| `/work/odstrani-tattoo` | Odstrani Tattoo: stran, ki najprej razloži postopek — Bauma | Za Odstrani Tattoo smo zasnovali in razvili spletno stran za odstranjevanje tetovaž. Obiskovalca vodi od razlage postopka prek primerov do posveta. |
| `/work/dema-plus` | Dema Plus: spletna predstavitev projektov in storitev — Bauma | Za Dema Plus smo prenovili spletno predstavitev s projekti v ospredju ter uredili posamezne reference z opisi, osnovnimi podatki in sorodnimi projekti. |
| `/work/ulterior` | Ulterior: produktna stran in namenski nakupni sistem — Bauma | Za Ulterior smo zasnovali in razvili spletno stran s predstavitvijo hardshell jakne, interaktivnimi tehničnimi podrobnostmi in namenskim nakupnim sistemom s PayPalom. |
| `/work/artbite` | ArtBite: stran tattoo studia, ki začne pri delih — Bauma | Za ArtBite smo zasnovali in razvili spletno stran tattoo studia v Domžalah, kjer imajo glavno vlogo fotografije del. Ločena stran pojasni prekrivanje starih tetovaž. |
| `/work/hardshelljacket` | Hardshelljacket: spletna stran za en izdelek — Bauma | Za Hardshelljacket smo zasnovali, oblikovali in razvili stran za jakno Ulterior. Nakup vodi na Ulterior, poslovna povpraševanja so ločena. |

Stari besedili title in description (»Pristop — Bauma«, »Work — Bauma«, »Work preview for Bauma.«, »… Primer iz prakse.« idr.) so zamenjani in ostanejo samo v zgodovini ([capture-before-A.json](./bauma-v3-sl-metadata-implementation-evidence/capture-before-A.json)).

## Preverjanje

Izolirana kopija trenutnega delovnega drevesa; vsaka gradnja v svoji kopiji z lastnim `.next` (brez dev cachea), strežnik na prostih vratih, po zajemu ustavljen samo ta proces. Gradnje **pred** in **po** posegu: A (`SITE_ENV=production`, `VERCEL_ENV=production`) in B (`SITE_ENV=staging`, `VERCEL_ENV=production`); vse štiri `next build` izhod 0. Zajem: [capture-meta.mjs](./bauma-v3-sl-metadata-implementation-evidence/capture-meta.mjs) (GET, končni streženi HTML), preverjanje: [verify-metadata.mjs](./bauma-v3-sl-metadata-implementation-evidence/verify-metadata.mjs), izhod [verify.out](./bauma-v3-sl-metadata-implementation-evidence/verify.out): **535 preverjanj, 0 napak**. Skript je preizkušen tudi negativno (prejšnje stanje kot »po« → 200 napak).

**Gradnja A (produkcija), vseh 10 SL strani:** točen title; ena `meta description` z natančnim besedilom; `og:title`/`og:description`/`twitter:title`/`twitter:description` enaki; `twitter:card` `summary_large_image`; `og:image` in `twitter:image` = `https://bauma.si/og/bauma-og-main-v3.png` (absolutni), `og:image:width/height` 1200/630, `og:image:alt` in `twitter:image:alt` = potrjeni alt; `og:site_name` Bauma, `og:locale` `sl_SI`, `og:type` `website`; brez podvojene pripone; canonical, hreflang (samo `/` z `sl`/`en`/`x-default`), robots (`index, follow`), brez `X-Robots-Tag` in `og:url` = canonical so **enaki kot prej**. `/en` ohrani prejšnja besedila, EN sliko in hreflang par. Sitemap enak, **11 URL-jev**; `robots.txt` enak (`Allow: /`). Pravne strani (`/pogoji-uporabe`, `/zasebnost`, `/piskotki`, `/en/terms`, `/en/privacy`, `/en/cookies`), `/approach`, `/contact`, `/novice` in neznana pot: celoten zajem (title, meta, glave) **identičen** prejšnjemu in noindex; razvojne poti (`/lab/…`, `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview`, lab slika prek optimizerja) 404 kot prej; projektna slika prek optimizerja 200; osebna fotografija z `noindex, noimageindex` enako.

**Gradnja B (staging):** na desetih straneh nova besedila in nova slika; `noindex, nofollow` meta in `X-Robots-Tag`, brez canonical, hreflang in `og:url`; `robots.txt` `Disallow: /`, prazen sitemap; `/lab/**` 307 na `/`, `/mini` in `/about-preview` 200 kot prej; vse ostale poti identične prejšnjemu zajemu.

**Slika:** v obeh gradnjah `/og/bauma-og-main-v3.png` vrne 200 `image/png`, 1200 × 630 (PNG glava); pred posegom je bila 404. `bauma-og-v3.png` in `bauma-og-en-v3.png` imata enako vsebino (SHA-1) pred in po.

`npx tsc --noEmit` izhod 0, ESLint na enajstih spremenjenih datotekah izhod 0, `git diff --check` izhod 0 ([logi](./bauma-v3-sl-metadata-implementation-evidence/)). Celotne devetdelne matrike okolij nisem ponavljal: logika indeksiranja (`isIndexable`, `indexing()`, `ogUrl()`, `next.config.ts`) je nespremenjena in ni bilo regresije. Diff tega posega proti začetku koraka: [changes.diff](./bauma-v3-sl-metadata-implementation-evidence/changes.diff). `git status` se razlikuje samo za novo datoteko `public/og/bauma-og-main-v3.png` (in že obstoječe spremembe v spremenjenih datotekah).

## Omejitve

- **Pot slike lokalno preverjena; prihodnja dosegljivost absolutnega produkcijskega URL-ja ni preverjena.** Absolutni URL `https://bauma.si/og/bauma-og-main-v3.png` bo deloval šele po objavi te različice; na živem bauma.si slike še ni in je nisem zahteval. Predogledi na družbenih omrežjih niso preverjeni (predpomnilniki, validatorji).
- Gostovanje, okolja Vercela in živi odgovori niso preverjeni; ta poseg ni potrditev SEO.
- `ROOT_OPEN_GRAPH` ostaja na stari sliki za EN, pravne in druge strani; EN prenova je ločena odprta točka. Obstoječi `<html lang>` na `/en` je ločena odprta točka (nespremenjen).
- Projektne OG slike ostajajo na skupni novi SL sliki (ločeni sklop projektnih slik ni del tega koraka).
- Dostopnost, dosegljivost `hardshelljacket.com` in preverjanje gostovanja ostajajo ločeno odprti.

## Status

**SL besedilni metapodatki in glavna SL OG slika so lokalno implementirani in preverjeni.** Gostovanje ostaja odprto; SEO kot celota ni zaključen.
