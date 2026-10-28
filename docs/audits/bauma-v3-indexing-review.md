# BAUMA V3 — TECH-005: okoljska ločitev in načrt indeksiranja

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**, Node v25.6.1, npm 11.9.0. **Spremenjena je samo dokumentacija** (to poročilo, [dokazi](./bauma-v3-indexing-evidence/), register). Aplikacijska koda, konfiguracija, odvisnosti, lock, robots, sitemap, metapodatki in nastavitve gostovanja niso spremenjeni. Dev strežnik na 3000 ni ustavljen. Brez commita, pusha ali deploya. Predlogi spodaj **niso izvedeni**.

## 1. Povzetek

Potrjene nepravilnosti (vse izmerjene na ločenih lokalnih produkcijskih gradnjah):

1. **Indeksiranje je privzeto odprto ob napačni ali manjkajoči vrednosti SITE_ENV.** `SITE_ENV=Staging` (velika začetnica) ali manjkajoč `SITE_ENV` skupaj z `VERCEL_ENV=production` da popolnoma produkcijsko obnašanje: `/` in `/en` `index, follow`, `robots.txt` `Allow: /`, sitemap z dvema URL-jema, kanonični `https://bauma.si`, brez `X-Robots-Tag`. Staging je zaščiten samo z natančnim nizom `staging`.
2. **Odločitev o indeksiranju ni na enem mestu.** `robots.txt` in sitemap odločata samo po `SITE_ENV` (`isStaging`), meta robots domače strani in `/en` pa po `VERCEL_ENV === "production" && !isStaging`. Pri `VERCEL_ENV=preview` ali brez obeh spremenljivk: meta `noindex, nofollow`, a `robots.txt` `Allow: /` + `Sitemap:` in sitemap z dvema URL-jema ter kanonični `https://bauma.si` na preview vsebini. Signali si nasprotujejo.
3. **Vse razen `/` in `/en` je `noindex, nofollow`**, tudi `/pristop`, `/work`, šest študij in `/o-nas`. To je varna privzeta nastavitev (root layout), ne napaka, a ni v skladu z namenom, da so glavne SL strani kandidati za indeksiranje. Te strani nimajo kanoničnega URL-ja in niso v sitemapu.
4. **Sitemap ima samo `/` in `/en`; `lastmod` je čas gradnje** (`new Date()`), torej se spremeni ob vsakem deployu.
5. **`/en` ima `<html lang="sl">`** (EN layout dodaja samo `<div lang="en">`), čeprav je v hreflang označen kot `en`.
6. **404 odgovori na produkciji nosijo `og:url https://bauma.si` in podvojen robots meta** (`noindex` + `noindex, nofollow`). Strani 404 sicer vrnejo pravilno 404 in noindex.
7. **Staging: `/_next/image?url=/lab/...` vrne 500** (ne 404); lab pot redirecta na `/`, optimizer pa ne sledi preusmeritvi. Samo staging, noindex velja. **Na stagingu so `/mini`, `/en/mini`, `/about-preview` in `/en/about-preview` 200** (zaprte so samo v ne-staging gradnjah); zaščita je `X-Robots-Tag: noindex, nofollow`.
8. **Naslovi/opisi:** `/work` ima `Work — Bauma` / `Work preview for Bauma.`; `/novice` `Mini — Bauma`; `/approach`, `/contact`, `/novice/<slug>` podedujejo naslov domače strani; `/o-nas` in `/pristop` podedujeta splošni opis; opis `/o-nas` je enak opisu `/pristop`. Samo popis, brez nove vsebine.

Trenutne zaščite staginga (`SITE_ENV=staging`): `X-Robots-Tag: noindex, nofollow` na vseh odgovorih (tudi `robots.txt`, sitemap, 404), meta `noindex, nofollow`, `robots.txt` `Disallow: /`, prazen sitemap, brez kanoničnih/hreflang/`og:url`, `/lab/*` 307 na `/`. Živi `work.bauma.si` to potrjuje (razdelek 5).

## 2. Implementacija

| Datoteka | Kaj dela |
|---|---|
| `lib/siteEnv.ts` | `isStaging = process.env.SITE_ENV === "staging"`. Edino preverjanje staginga. |
| `next.config.ts` | `developmentRoutesClosed = NODE_ENV === "production" && !isStaging` → `beforeFiles` prepisi lab/mini/about-preview/`_next/image` na `/_not-found`. Pri `isStaging` namesto tega redirect `/lab/:path*` → `/` in `X-Robots-Tag: noindex, nofollow` na `/:path*`. Dodatno `noindex, noimageindex` za `/images/gregor/**`. |
| `app/layout.tsx` | `metadataBase https://bauma.si`; privzeto `robots: noindex, nofollow`; `og:url` samo `!isStaging`. |
| `app/en/layout.tsx` | privzeto `noindex`; `og:url https://bauma.si/en` samo `!isStaging`. |
| `app/page.tsx`, `app/en/page.tsx` | `isProduction = VERCEL_ENV === "production" && !isStaging`; `index, follow` samo takrat; canonical + hreflang `sl`/`en`/`x-default` samo `!isStaging`. |
| `app/robots.ts` | `isStaging` → `Disallow: /`, sicer `Allow: /` + `Sitemap: https://bauma.si/sitemap.xml`. |
| `app/sitemap.ts` | `isStaging` → prazen, sicer `/` in `/en`. |
| `app/work/{artbite,dema-plus,flexido,hardshelljacket,ulterior}/page.tsx` | `og:url` samo `!isStaging`; robots vedno `noindex`. |
| ostale strani | statični `robots: noindex, nofollow` ali (npr. `/work`, `/o-nas`, `/pristop`) brez canonical. |

Ni `middleware`/`proxy` ali `vercel.json`. Ločitev časov vrednotenja:

- **`NODE_ENV`**: `next build`/`next start` ga vedno nastavita na `production`, `next dev` na `development`. Rabi ga samo `developmentRoutesClosed`. Ne odloča o indeksiranju.
- **`SITE_ENV`** in **`VERCEL_ENV`**: berejo se ob **nalaganju `next.config.ts` in modulov strani med gradnjo**. `robots.ts`, `sitemap.ts` in strani so statične (prerender), `headers()`/`rewrites()` pa se zapišeta v manifeste. Sprememba okolja ob `next start` ne spremeni ničesar (preizkus neskladja spodaj). Ločena gradnja je torej nujna.
- Lokalni `.env.local` vsebuje samo ime `VERCEL_OIDC_TOKEN` (vrednosti niso izpisane); v izolirane kopije ni kopiran.

## 3. Okoljska matrika (ločene gradnje)

Vsaka vrstica je ločen `next build` v lastni kopiji z lastnim `.next` in `next start` na prostih vratih; gradnje z `env -u SITE_ENV -u VERCEL_ENV`. Surovo: [environment-matrix.md](./bauma-v3-indexing-evidence/environment-matrix.md), `builds/<ime>/`.

| Gradnja | `/` meta | `/en` meta | `/work/ulterior` | X-Robots-Tag | canonical `/` | robots.txt | sitemap URL | `/lab/*` | `/mini` | `_next/image` lab |
|---|---|---|---|---|---|---|---|---|---|---|
| `SITE_ENV=production` `VERCEL_ENV=production` | index, follow | index, follow | noindex | — | https://bauma.si | Allow | 2 | 404 | 404 | 404 |
| `SITE_ENV=staging` `VERCEL_ENV=production` | noindex | noindex | noindex | noindex, nofollow | — | Disallow | 0 | 307 → `/` | 200 | 500 |
| `VERCEL_ENV=preview`, SITE_ENV neizdan | **noindex** | **noindex** | noindex | — | **https://bauma.si** | **Allow** | **2** | 404 | 404 | 404 |
| SITE_ENV neizdan, `VERCEL_ENV=production` | index, follow | index, follow | noindex | — | https://bauma.si | Allow | 2 | 404 | 404 | 404 |
| `SITE_ENV=Staging` (napačna), `VERCEL_ENV=production` | **index, follow** | **index, follow** | noindex | **—** | https://bauma.si | **Allow** | **2** | 404 | 404 | 404 |
| obe neizdani (lokalni build) | noindex | noindex | noindex | — | https://bauma.si | Allow | 2 | 404 | 404 | 404 |

**Preizkus neskladja (isti artefakt, drugo okolje ob zagonu — ni nadomestilo za ločeno gradnjo):**

- Produkcijski artefakt zagnan s `SITE_ENV=staging VERCEL_ENV=preview`: odgovori so enaki produkcijskim (index, Allow, 2 URL-ja, lab 404). Zagon ne odpre staginga.
- Staging artefakt zagnan s `SITE_ENV=production VERCEL_ENV=production`: odgovori ostanejo stagingu enaki (noindex, Disallow, 0 URL, `/mini` 200). Zagon ne odpre produkcije.

Razlika od želene politike: `preview`, neizdan ali napačen `SITE_ENV` bi morali biti noindex povsod; trenutno je tako samo ob `staging` (vse) oziroma ob `VERCEL_ENV` ≠ production (samo meta, ne robots.txt/sitemap/glava). Zapora lab poti (TECH-004) je v vseh ne-staging gradnjah ohranjena.

## 4. Predlagana politika (ni izvedena)

**Indeksiranje je dovoljeno samo, če je produkcijsko okolje nedvoumno pozitivno določeno**, npr. `SITE_ENV === "production" && VERCEL_ENV === "production"` (en izraz, npr. `isIndexable` v `lib/siteEnv.ts`). Vse ostalo (staging, preview, neizdan, napačen, lokalni build) je noindex. Ta izraz bi nadomestil `isStaging` in `isProduction` pri vseh odločitvah:

| Signal | Indexable | Ne-indexable |
|---|---|---|
| meta robots | `index, follow` na izbranih straneh | `noindex, nofollow` povsod |
| `X-Robots-Tag` | — (ali samo ciljne datoteke) | `noindex, nofollow` povsod |
| `robots.txt` | `Allow: /` + `Sitemap` | `Disallow: /`, brez `Sitemap` |
| sitemap | seznam iz razdelka 6 | prazen |
| canonical/hreflang/`og:url` | produkcijski absolutni | izpuščeni |
| zapora labov | rewrite na 404 | staging: redirect; ostalo: rewrite |

Razlika od zdaj: **zahteva spremembo gostovanja** (`SITE_ENV=production` mora biti nastavljen na produkcijskem Vercel projektu, kar danes ni nujno; nastavitev ni preverjena). Brez te nastavitve bi nova politika izklopila indeksiranje bauma.si – zato se mora spremenljivka nastaviti pred deployem.

Razlikovanje: **robots.txt** je navodilo za pregledovanje (crawl), ne za indeks; `Disallow` preprečuje, da bi iskalnik videl `noindex`, zato sam ne odstrani URL-ja iz indeksa. **noindex** (meta/glava) zahteva, da je stran dosegljiva. **Omejitev dostopa** (geslo/zaščita deploymenta) je edina prava zapora za staging. **Canonical** je namig o podvojeni vsebini in ni zamenjava za noindex ali preusmeritev. Za `work.bauma.si` zato priporočam omejitev dostopa v Vercelu (nepreverjeno, odločitev lastnika) poleg obstoječih glav; `Disallow` + `noindex` pustiti kot dodatni sloj.

## 5. Živa domena (read-only, 26. 10. 2026 ~00:45 UTC)

Samo GET; nobenih nastavitev. Deployment/revizija **ni identificirana** (glave `x-vercel-id` niso identiteta deploymenta); dostop do nastavitev Vercela nepreverjen. Glave in meta: [live/](./bauma-v3-indexing-evidence/live/).

| Pot | bauma.si | work.bauma.si |
|---|---|---|
| `/` | 200, 0,27 s, cache HIT (age ≈ 15 dni), `index, follow`, canonical + hreflang `sl/en/x-default`, `og:url https://bauma.si`, naslov `Bauma — Jasna struktura. Več odločitev.` | 200, 1,4 s, `X-Robots-Tag: noindex, nofollow`, meta noindex, brez canonical/`og:url`, naslov `Bauma — Spletne strani, ki pomagajo pridobivati stranke.` |
| `/work` | 200 (`Work — Bauma`, noindex) | 200 |
| `/work/ulterior` | **404** | 200, noindex |
| `/en` | 200, `index, follow`, canonical `https://bauma.si/en` | 200, noindex |
| `/robots.txt` | `Allow: /` + `Sitemap` | `Disallow: /` + `X-Robots-Tag` |
| `/sitemap.xml` | 2 URL-ja (`lastmod 2026-10-10`) | prazen |
| `/audit05-neobstojeca-pot` | 404, `noindex` | 404, noindex |
| `/lab/hero-monolith` | 404 | 307 → `/` |
| `/mini` | **200** (noindex) | 200 |

Brez preusmeritev na apex/www v teh zahtevah. **Živa bauma.si ne vsebuje lokalnih sprememb** (domača stran je starejša kompozicija, študije in zapora `/mini` še niso objavljene); TECH-004 na produkciji torej **ni** v veljavi. `work.bauma.si` kaže noindex, Disallow in prazen sitemap kot pričakovano.

## 6. Popis URL-jev in predlagano indeksiranje

Stanje = `SITE_ENV=production VERCEL_ENV=production` gradnja (razen kjer navedeno). „Kanon." = trenutni canonical v HTML; „Sitemap" = trenutno.

**A. Glavne SL vsebinske strani**

| URL | HTTP | Trenutno | Kanon. | Sitemap | Predlog | Razlog |
|---|---|---|---|---|---|---|
| `/` | 200 | index, follow | `https://bauma.si` | da | **index** | Domača stran; ohraniti. |
| `/pristop` | 200 | noindex | — | ne | **index** | Glavna vsebinska stran. Odločitev: potrditi, da je vsebina končna; ločen opis. |
| `/work` | 200 | noindex | — | ne | **index** | Seznam projektov. Treba nadomestiti naslov/opis (`Work preview for Bauma.`). |
| `/o-nas` | 200 | noindex | — | ne | **index** | Vsebinska stran; opis podvojen z `/pristop`. |

**B. SL študije** (`/work/flexido`, `odstrani-tattoo`, `dema-plus`, `ulterior`, `artbite`, `hardshelljacket`): vse 200, noindex, brez canonical, ne v sitemapu, `og:url` produkcijski. **Predlog: index** s samoreferenčnim canonicalom, sitemap; naslovi/opisi so že edinstveni (`Odstrani Tattoo — Bauma case study` je v drugačnem vzorcu). Odločitev: potrditi, da so vsebine in dovoljenja strank za javno objavo/indeksiranje.

**C. SL pravne strani** (`/pogoji-uporabe`, `/zasebnost`, `/piskotki`): 200, noindex, ne v sitemapu. **Priporočilo: ostanejo noindex, brez sitemapa**, dostopne in povezane iz noge (nimajo iskalne vrednosti, kopiranje standardnega besedila). Alternativa: index brez sitemapa. Odločitev lastnika.

**D. EN**

| URL | HTTP | Trenutno | Kanon. | Sitemap | Predlog |
|---|---|---|---|---|---|
| `/en` | 200 | index, follow, hreflang `sl`,`en`,`x-default`; `<html lang="sl">` | `https://bauma.si/en` | da | **ostane index**; popraviti `lang` |
| `/en/terms`, `/en/privacy`, `/en/cookies` | 200 | noindex | — | ne | ostanejo noindex |

`/en` ostane indeksiran; **ne predlagam začasnega izklopa**. Stanje: EN je strukturna vzporednica starejše SL sestave, prenova EN/IT sledi. Možnosti prehoda: (a) ostane indeksiran s trenutnim parom hreflang `/` ↔ `/en`, dokler ne bo EN prenove (vsebinsko isto sporočilo, razlika v sestavi); (b) ostane indeksiran, hreflang med parom se opusti do usklajene različice; (c) hreflang in sitemap posodobiti ob EN/IT prenovi. Priporočam (a), ker gre za isti par jezikovnih različic domače strani; odločitev naj potrdi lastnik.

**E. Hreflang pravila:** samo pari dejansko ustreznih strani: `/` ↔ `/en` (+ `x-default` → `/`). SL podstrani (`/pristop`, `/work`, `/o-nas`, študije) **nimajo** angleških ustreznic in se **ne** povezujejo z `/en`. EN/IT poti se ne izmišljajo; dodajo se šele, ko obstajajo. Hreflang mora biti vzajemen in samoreferenčen (že izpolnjeno za par).

**F. Stare poti** (`/approach`, `/contact`, `/novice`, `/novice/odstrani-tattoo-structure`, `/novice/dema-plus-preview`): vse 200, noindex, ne v sitemapu, naslov/opis podeduje domačo stran. **Predlog: ostanejo kot so** (noindex, ne v sitemapu); brez odstranitve ali preusmeritve brez ločene odločitve (obstoječi povezave/zaznamki). Odločitev: ali preusmeriti (`/approach` → `/pristop`, `/contact` → `/#kontakt`) ali odstraniti kasneje.

**G. Zaprte poti**

| URL | Produkcija | Staging | Predlog |
|---|---|---|---|
| `/lab/*`, `/lab/**/*.png` | 404 | 307 → `/` | ostane zaprto; noindex |
| `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview` | 404 | **200** noindex | produkcija zaprto; staging naj ostane noindex + dostop omejen |
| `/_next/image?url=/lab/...` | 404 | **500** | ne popravljati zdaj; popisati |
| `/_next/image?url=/work/.../preview/...` | 200 | 200 | odprto (projektno sredstvo) |
| `/images/gregor/**` | 200, `noindex, noimageindex` | enako | ohraniti |

**H. Neobstoječa pot:** 404, `noindex` (podvojen meta), `og:url https://bauma.si`; brez canonical. Predlog: ohraniti 404; odstraniti `og:url` in podvojitev ob 404 oblikovanju (ločen sklop).

**Predlagani sitemap** (samo produkcija): `https://bauma.si/`, `/pristop`, `/work`, `/work/flexido`, `/work/odstrani-tattoo`, `/work/dema-plus`, `/work/ulterior`, `/work/artbite`, `/work/hardshelljacket`, `/o-nas`, `/en` (13 URL, absolutni, brez končne poševnice, domača stran tudi `https://bauma.si` kot zdaj). Hreflang alternates samo na `/` in `/en`. Brez pravnih, starih in lab URL-jev. `lastmod` iz dejanskih datumov vsebine (ali izpustiti), ne iz `new Date()`; `changefreq`/`priority` nista potrebna.

## 7. Najmanjši naslednji izvedbeni poseg

Datoteke:

1. `lib/siteEnv.ts`: dodati `isIndexable = SITE_ENV === "production" && VERCEL_ENV === "production"`; `isStaging` ohraniti za lab redirect, ali ga nadomestiti z `!isIndexable` kjer gre za indeksiranje.
2. `app/robots.ts`, `app/sitemap.ts`: preklop na `isIndexable`; nov seznam URL-jev.
3. `next.config.ts`: `X-Robots-Tag: noindex, nofollow` ko `!isIndexable`; zapora labov ostane.
4. `app/page.tsx`, `app/en/page.tsx`: `isProduction` → `isIndexable`; hreflang samo `/` ↔ `/en`.
5. `app/pristop/page.tsx`, `app/work/page.tsx`, `app/o-nas/page.tsx`, šest `app/work/*/page.tsx`: `robots` index ko `isIndexable`, `alternates.canonical` samoreferenčen (absoluten), obstoječi `og:url`.
6. `app/en/layout.tsx` ali `app/layout.tsx`: popravek `lang` za EN (ločena odločitev, lahko ločen poseg).
7. Gostovanje (ne koda): `SITE_ENV=production` na produkcijskem projektu **pred** deployem; `SITE_ENV=staging` na stagingu; po potrebi zaščita deploymenta za staging.

Preverjanje po izvedbi: ponoviti vseh šest gradenj iz razdelka 3 (isti skript) + oba preizkusa neskladja; pričakovano samo `production/production` indexable, vse ostalo noindex z `Disallow`, prazen sitemap, `X-Robots-Tag`; 13 URL-jev v produkcijskem sitemapu, vsak 200 z `index, follow` in samoreferenčnim canonicalom; `/en` ↔ `/` hreflang vzajemen; TECH-004 (lab/`/mini` 404, preview 200); po deployu read-only pregled žive domene in `site:`/Search Console po objavi.

Odločitve za potrditev:

1. Dodati `SITE_ENV=production` na produkcijski projekt (nujno za fail-closed politiko)?
2. Indeksiranje `/pristop`, `/work`, `/o-nas` in vseh šestih študij: da/ne, vključno s soglasjem strank?
3. Pravne strani: noindex (priporočeno) ali index brez sitemapa?
4. `/en`: ostane indeksiran; hreflang par ohraniti (a) ali začasno opustiti (b)?
5. Stare poti `/approach`, `/contact`, `/novice`: ostanejo noindex, preusmeritev kasneje?
6. Staging: dodati omejitev dostopa v Vercelu?
7. Naslovi/opisi (`/work`, `/o-nas`, `/pristop`, `/novice`, `/approach`, `/contact`): kdo napiše vsebino (ločen sklop).

## 8. Omejitve dokazov

- Matrika je iz lokalnih `next build`/`next start` in ne dokazuje nastavitev na Vercelu; dejanske vrednosti `SITE_ENV`/`VERCEL_ENV` projektov niso preverjene. Vercel lahko preview deploymentom sam doda `X-Robots-Tag: noindex`; nepreverjeno.
- Živi odgovori so en vzorec iz enega trenutka (cache HIT); revizija ni identificirana.
- OG slike, strukturirani podatki, oblikovanje 404 in dejanski Search Console / indeksno stanje niso preverjeni.
- Izolirane kopije temeljijo na izvorni kodi z dne preverjanja (necommitano drevo) brez `.env*`.
- Dokazi: [bauma-v3-indexing-evidence](./bauma-v3-indexing-evidence/) (skripti `capture.mjs`, `matrix.sh`, `rerun.sh`, `environment-matrix.md`, `builds/*`, `live/*`).
