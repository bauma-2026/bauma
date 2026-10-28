# BAUMA V3 — TECH-004: pregled izpostavljenosti razvojnih poti

Datum: **26. 10. 2026**. Veja: **`staging/bauma-v3`**. Ta korak je pregled in predlog. Aplikacijska koda, konfiguracija, odvisnosti, lockfile, SEO, `robots.txt`, sitemap, OG in oblikovanje 404 niso spremenjeni. Labi in sredstva niso zbrisani ali premaknjeni. Ni commita, pusha ali deploya.

To ni dovoljenje za izvedbo. TECH-004 ostaja odprt, dokler ni odločitve in ločenega posega.

## 1. Kaj je bilo preverjeno

Vir vedenja je trenutno delovno drevo, ne samo imena map.

- `AGENTS.md` v delovnem drevesu samo opozarja, da ima ta Next.js drugačne dogovore, in napoti na `node_modules/next/dist/docs/`.
- [Tehnični audit](./bauma-v3-technical-audit.md) in [register](./bauma-v3-audit-register.md).
- `next.config.ts`, `lib/siteEnv.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/lab/layout.tsx` in strani, ki niso pod `/lab`.
- Iskanje povezav in uvozov v `app/`.
- Izolirana produkcijska gradnja trenutnega drevesa, zunaj repozitorija. Ni uporabljala dev `.next` in ni ustavila procesa na vratih 3000. Kopija je po meritvah odstranjena. Okolje gradnje in prvega zagona: `SITE_ENV=production`, `VERCEL_ENV=production`. Next.js **16.4.1**, Turbopack, 208 strani. Lokalne okoljske datoteke niso bile kopirane; njihove vrednosti niso izpisane. V `.env.local` je samo ključ `VERCEL_OIDC_TOKEN`. `SITE_ENV` tam ni nastavljen. `.env`, `.env.production` in `.env.development` ni.

V `routes-manifest.json` te gradnje je ena preusmeritev: `/:path+/` → `/:path+` s statusom 308. To je običajna odstranitev končne poševnice, ne lab pravilo. Glavi sta samo `X-Robots-Tag: noindex, noimageindex` za `/images/gregor/:path*` in za `/_next/image`, ko poizvedba `url` ustreza `/images/gregor/.*`. Staging pravila v manifestu ni.

Isti build je bil nato zagnan znova, samo z `SITE_ENV=staging` in še vedno `VERCEL_ENV=production`. Manifest se ni spremenil. `/lab/hero-monolith` je ostal 200, brez `Location` in brez `X-Robots-Tag`.

Živa `bauma.si` in `work.bauma.si` v tem koraku nista klicani. Staging gradnja s `SITE_ENV=staging` ni bila ponovljena; staging vrstica spodaj je zato označena kot izvor, ne kot nova meritev.

## 2. Okolje

`lib/siteEnv.ts` ima eno preverjanje: `SITE_ENV === "staging"`. Komentar v datoteki pove, da staging projekt na Vercelu teče z `VERCEL_ENV=production`, zato samo izrecni `SITE_ENV=staging` pomeni staging. Vsaka druga vrednost, vključno z manjkajočo, obdrži produkcijsko vejo.

| Nastavitev | Kaj koda naredi | Dokaz |
|---|---|---|
| `SITE_ENV=production` ob `next build` | Ni preusmeritve `/lab`. Ni staging glave na vseh poteh. `/` in `/en` imata `index, follow`. | Izmerjeno na tej gradnji. |
| Isti build, `SITE_ENV=staging` šele ob `next start` | Preusmeritev in staging glava se ne pojavita. `/lab/hero-monolith` ostane 200. | Izmerjeno. Sprememba ob zagonu ni dokaz obeh načinov. |
| `SITE_ENV` manjka, je `production` ali je napačno zapisan, npr. `stagng` | `isStaging` je false. Velja produkcijska veja: labi ostanejo dosegljivi, home/en sta indeksabilna, če je hkrati `VERCEL_ENV=production`. | Izvor. Napačen niz ni bil posebej zagnan; primerjava je stroga enakost z `staging`. |
| `SITE_ENV=staging` ob nalaganju `next.config.ts` | `redirects()` doda `/lab/:path*` → `/`, `permanent: false` (307). `headers()` doda `X-Robots-Tag: noindex, nofollow` na `/:path*`. `robots.ts` vrne `Disallow: /`. | Izvor. Ta pregled te gradnje ni ponovil. |
| `NODE_ENV` ali `VERCEL_ENV` sama | Ne ločita javne produkcije od staginga. Produkcijska gradnja in Vercel produkcijski runtime imata `NODE_ENV=production`. Staging gostovanje lahko hkrati ima `VERCEL_ENV=production`. | Izvor in komentar v `lib/siteEnv.ts`. |

`next.config.ts` prebere `isStaging` ob nalaganju konfiguracije. Next preusmeritve zapiše v manifest med gradnjo. Zato je odločitev o okolju build-time, ne samo runtime.

Manjkajoč `SITE_ENV` na staging gostovanju, ki uporablja produkcijsko gradnjo, danes ne vklopi staging zaščite. To je fail-open za izpostavljenost labov in, ločeno, za indeksiranje iz TECH-005. Ta predlog tega indeksiranja ne spreminja.

## 3. Javne poti, ki niso razvojne

Teh poti predlog ne zapira. V produkcijski gradnji so bile izmerjene z GET 200:

`/`, `/pristop`, `/work`, `/work/flexido`, `/o-nas`, `/pogoji-uporabe`, `/zasebnost`, `/piskotki`, `/en`, `/en/terms`, `/en/privacy`, `/en/cookies`.

Gradbeni seznam poleg tega vključuje še `/work/ulterior`, `/work/odstrani-tattoo`, `/work/dema-plus`, `/work/artbite`, `/work/hardshelljacket`, `/robots.txt`, `/sitemap.xml` in `/icon.svg`. Tega drugega niza nisem klical posamično.

`/en` je javna domača stran. V tej gradnji ima `index, follow` in canonical `https://bauma.si/en`. Angleške pravne strani so javna vsebina; privzeti `noindex` v `app/en/layout.tsx` je indeksna nastavitev, ne razlog, da bi bile razvojne. EN-001 ostaja ločen backlog.

Trenutna javna navigacija na `/` je `/pristop`, `/work`, `/o-nas`. Kontakt v `MiniHeader` je fragment `#contact`, ne `/contact`. `MiniFooter` povezuje `/pogoji-uporabe`, `/zasebnost` in `/piskotki`. Iskanje `href` v `app/` ne najde povezave s trenutnih javnih strani na `/lab`, `/mini`, `/about-preview`, `/approach`, `/contact` ali `/novice`.

Sredstvo `/work/flexido/preview/flexido-home-desktop.webp` je v isti gradnji vrnilo 200. Ime `preview` v projektnem sredstvu ne pomeni razvojne poti. Predlog ga ne zajame.

Javne strani ne uvažajo `app/lab`. Povezave in `src` na `/lab/...` so znotraj `app/lab`. Skupne komponente v `app/components` in `components/` ostanejo, ker jih javni portfelj uporablja.

## 4. Razvojne in stare poti

`/lab` nima `app/lab/page.tsx`. GET `/lab` v produkcijski gradnji vrne **404** in obstoječi dokument z naslovom `Bauma — Jasna struktura. Več odločitev.` Isti dokument vrne neobstoječa pot `/audit04-neobstojeca-pot-20261026`. `app/not-found.tsx` ne obstaja. `middleware.ts` in `proxy.ts` ne obstajata. Rewrite pravil v `next.config.ts` ni.

`app/lab/_work-grid` ni URL: mapa s predpono `_` ni pot. Skupine v oklepajih v URL-ju niso.

### Potrjeno dosegljivo v tej produkcijski gradnji

Vzorec GET, vsi **200**, `meta robots` `noindex, nofollow`, brez preusmeritve:

- `/lab/hero-monolith`
- `/lab/typography-foundation/opsz`
- `/lab/hero-object-reframe`
- `/lab/system-cube/b51`
- `/lab/services-direction-c/a`
- `/lab/surface-tone/d`
- `/about-preview`
- `/en/about-preview`
- `/mini`
- `/en/mini`
- `/approach`
- `/contact`
- `/novice`
- `/novice/odstrani-tattoo-structure`
- `/novice/dema-plus-preview`

Zahteva z glavo `RSC: 1` na `/lab/hero-monolith` je prav tako **200**. Neposreden HTTP in podatkovna zahteva App Routerja danes nista blokirana. Javne strani na te poti ne povezujejo, zato klik iz javnega menija ni bil mogoč.

Datoteka `public/lab/home-typography-v1/v1-1440-full.png` je **200**. V `public/lab` je **1814** datotek. Te URL-je streže datotečni sloj, ne `app/lab/layout.tsx`. `noindex` v lab postavitvi zanje ne velja. Pod `public/` ni datotek, ki bi prekrile `/mini`, `/about-preview`, `/approach`, `/contact` ali `/novice`.

Gradnja vključi preostale `/lab` strani kot statične, vnaprej zgenerirane ali dinamične. Posamično nisem zahteval vseh. V tej gradnji ni plasti, ki bi eno izmed njih zadržala, druge pa ne. Prejšnji audit je naštel 125 statičnih vzorcev in 17 vzorcev z dinamičnimi segmenti. Ta gradnja jih še vedno vključuje; nekatere strani brez oklepajev so označene kot dinamične, ker se izrišejo ob zahtevi, npr. `/lab/hero-monolith`.

Dinamični segmenti pod `/lab`, kot jih navede gradnja:

- `/lab/hero-contact-art-direction/frame/[concept]/[part]`
- `/lab/hero-contact-photographic/frame/[concept]/[part]`
- `/lab/services-art/[variant]` in `/lab/services-art/embed/[variant]`
- `/lab/services-direction-c/[variant]` in `/lab/services-direction-c/embed/[variant]`
- `/lab/services-editorial/[variant]` in `/lab/services-editorial/embed/[variant]`
- `/lab/services-hierarchy/[variant]` in `/lab/services-hierarchy/embed/[variant]`
- `/lab/services-section/[concept]`
- `/lab/services-section/refine/[variant]`
- `/lab/services-width/[variant]` in `/lab/services-width/embed/[variant]`
- `/lab/surface-tone/[variant]`
- `/lab/system-cube/[variant]` in `/lab/system-cube/embed/[variant]`

`/lab/services-direction-c/[variant]` nima `generateStaticParams`; `/a` je vseeno 200. Neznan id na straneh, ki same kličejo `notFound()`, je že 404, veljavni id-ji pa ostanejo dosegljivi. Postavitev `/lab` bi zajela oboje.

Jezikovnih lab različic ni. Ni `/en/lab`, `/en/approach`, `/en/contact` ali `/en/novice`. Angleški razvojni par sta samo `/en/mini` in `/en/about-preview`.

### Namen in povezave

| Pot ali vzorec | Namen | Development | Staging | Production, ta gradnja | Povezave iz javnega UI | Priporočeno v javni produkciji | Odločitev |
|---|---|---|---|---|---|---|---|
| `/lab` in `/lab/...`, vključno z dinamičnimi segmenti | Lokalni razvojni in primerjalni prikazi. `app/lab/layout.tsx` nastavi samo `noindex`, ne dostopa. | Izvor: odprto, če ob nalaganju konfiguracije ni `SITE_ENV=staging`. Ni izmerjeno na procesu vrat 3000. | Izvor: 307 na `/` za `/lab/:path*`, tudi ko pot nima strani. Ta pregled staging gradnje ni ponovil. | Vzorci 200. `/lab` sam je 404, ker strani ni. | Ni jih. Povezave so med labi. | Pravi HTTP 404 na zahtevanem URL-ju. | Ni je za app strani. |
| Datoteke `/lab/...` iz `public/lab` (1814) | Sredstva lab strani, npr. tipografski in poster prikazi. | Isto kot zgoraj: preusmeritev samo, če je staging že ob zagonu dev strežnika. | Izvor: ista 307, ker preusmeritev teče pred `public/`. | Izmerjeni PNG je 200. | Javne strani teh `src` ne uporabljajo. | 404, sicer datoteke obidejo postavitev. | Način zapore je del predloga spodaj; cilj ni odprt. |
| `/about-preview`, `/en/about-preview` | Lokalni predogled identitete, `AboutPreviewView`. Oba `noindex`. EN komentar pravi, da je to strukturna vzporednica zaklenjenega SL predogleda. | Odprto po izvoru. | Izvor: 200 in noindex. Nista pod `/lab`, zato ju staging preusmeritev ne zajame. | 200, noindex. | Ni jih. Javna stran je `/o-nas`. | 404. | Ni je. |
| `/mini`, `/en/mini` | Referenčni predogled domače strani. Komentar na `/` pravi, da `/mini` ostane referenca; produkcijska `/` vanj ne prenaša samo-mini lastnosti. Oba `noindex`. | Odprto po izvoru. | Izvor: 200 in noindex. | 200, noindex. | Ni jih. Javni strani sta `/` in `/en`. | 404. | Ni je. |
| `/approach` | Starejša samostojna stran Pristop, `noindex`, `MiniHeader`. Javni Pristop je `/pristop`. | Odprto po izvoru. | Izvor: 200 in noindex. | 200, noindex. | Ni v trenutni navigaciji. Povezujejo lab strani in neuporabljeni `app/components/Header.tsx`. Uvoza tega Headerja ni. | 404, če potrdite, da stara stran ni več javna vsebina. | **Da.** |
| `/contact` | Starejša samostojna stran Kontakt, `noindex`. Javni kontakt je `#contact` na javnih straneh. | Odprto po izvoru. | Izvor: 200 in noindex. | 200, noindex. | Isto: ni v trenutnem UI; stari Header, ki ni uvožen. | 404 ob isti potrditvi. | **Da.** |
| `/novice`, `/novice/odstrani-tattoo-structure`, `/novice/dema-plus-preview` | Stari zapisi iz `lib/content.tsx`. Indeks ima naslov `Mini — Bauma` in `noindex`. `generateStaticParams` pozna samo ta dva slug. | Odprto po izvoru. | Izvor: 200 in noindex. | 200, noindex. | Ni v `MiniHeader` ali `MiniFooter`. Navezava je znotraj `/novice` in v neuporabljenem Headerju. | 404 ob potrditvi, da zapisi niso več javna vsebina. | **Da.** |
| `/`, `/en`, `/pristop`, `/work`, `/work/<projekt>`, `/o-nas`, SL in EN pravne poti, `/work/**/preview` sredstva | Javni portfelj. | Ostanejo. | Ostanejo, z obstoječim noindex staginga. | Izmerjene javne strani 200; projektno sredstvo 200. | So javni UI. | Brez nove zapore. | Ni je. |

`?axis=1` na `/`, `/en`, `/mini` in `/en/mini` naloži razhroščevalni prikaz prek `RightObjectAxisDebugGate`. To je poizvedba na strani, ne lab pot. TECH-004 je ne zapira. TECH-001 in oba V2 animacijska hooka ostaneta zunaj.

### Kaj ni sklep iz imena

Angleške javne strani niso razvojne. Starejši `/approach`, `/contact` in `/novice` so dosegljive vsebinske strani z `noindex`, ne lab mape. Zato so v tabeli ločene in čakajo odločitev. `public/work/.../preview` ni razvojna pot.

## 5. Staging in noindex

Staging namen `work.bauma.si` je pregled javnega portfelja, z noindex. Obstoječa konfiguracija lab poti preusmeri na `/`. Predogledi zunaj `/lab` po izvoru ostanejo 200.

**Noindex ni zasebnost.** `robots`, `X-Robots-Tag` in `Disallow: /` ne zahtevajo prijave in ne preprečijo neposrednega odpiranja URL-ja. Če staging gostovanje ostane javno dosegljivo, lahko vsak z naslovom odpre stran, ki vrne 200. Ta predlog ne dodaja avtentikacije.

Če želimo, da tudi staging predogledi niso javno berljivi, je to posebna odločitev. Najmanjši predlog spodaj staging vedenja ne spreminja: `/lab` ostane 307, predogledi ostanejo 200 in noindex.

## 6. Primerjava možnosti

Primerjane so samo možnosti, ki sedejo na trenutni App Router, brez brisanja labov in brez novih odvisnosti.

| Možnost | Zakaj ni izbrana oziroma je |
|---|---|
| Produkcijska preusmeritev `/lab` na `/`, enako kot staging | To je 307, ne 404 na zahtevanem URL-ju. Cilj `/` je v javni produkciji indeksabilen. Predogledi zunaj `/lab` ostanejo nezajeti. |
| Brisanje, premik ali izključitev labov iz gradnje | Lokalni razvoj jih potrebuje. Javne strani lab modulov ne uvažajo, skupne komponente pa morajo ostati. |
| `noindex` ali `robots.txt` | Že obstajata za lab postavitev in ne omejita dostopa. Izmerjene strani so 200 z noindex. |
| Nova prijava ali osnovna avtentikacija | Ni potrebna za lokalno zaporo in doda površino, ki je projekt nima. |
| `notFound()` v `app/lab/layout.tsx` in na štirih predoglednih straneh, samo ko je produkcijski runtime in ni staging | Izbrano za HTML. Uporabi obstoječi 404 dokument. V `next dev` je `NODE_ENV` development, zato lokalne poti ostanejo. |
| Ozek `proxy.ts` samo za `/lab/:path*` | Potreben za 1814 datotek v `public/lab`, ker postavitev zanje ne teče. Ne sme biti matcher `/:path*`, `/en/:path*` ali `/work/:path*`. |

## 7. Predlagani poseg

Predlog, ne izvedba.

Odločitev o okolju dodati poleg `isStaging` v `lib/siteEnv.ts`:

```ts
export function developmentRoutesClosed() {
  return process.env.NODE_ENV === "production" && process.env.SITE_ENV !== "staging";
}
```

Pomen:

- `next dev`: odprto, tudi če `SITE_ENV` manjka. Lokalni labi ostanejo.
- Javna produkcijska gradnja in `next start`: zaprto. Manjkajoč ali napačen `SITE_ENV` labov ne pusti odprtih. To je ožje od današnjega fail-open in ne popravi TECH-005: manjkajoč `SITE_ENV` ob `VERCEL_ENV=production` še vedno dovoli indeksiranje `/` in `/en`.
- `SITE_ENV=staging` ob gradnji: funkcija je false. Obstoječa 307 za `/lab` in noindex ostaneta. Predogledi ostanejo 200, dokler ni posebne odločitve.
- `next start` z drugim `SITE_ENV`, kot je bil ob gradnji, ne zamenja že zapečenih preusmeritev. `notFound()` na statični strani se prav tako ovrednoti ob gradnji. Preverjanje zato potrebuje ločeni gradnji, ne samo drugi zagon.

Klic `notFound()` iz `next/navigation`, ko je funkcija true:

- `app/lab/layout.tsx` za vse app poti pod `/lab`, vključno z dinamičnimi segmenti;
- `app/about-preview/page.tsx`;
- `app/en/about-preview/page.tsx`;
- `app/mini/page.tsx`;
- `app/en/mini/page.tsx`.

To vrne isti HTTP 404 kot današnja neobstoječa pot. Oblikovanja 404 se ne spreminja. Ker javni UI na te strani ne kaže, zapora ne pretrga javne navigacije.

`notFound()` ne teče za `public/lab`. Za te datoteke je v predlogu nov `proxy.ts` z matcherjem, ki je dobesedna konstanta `/lab/:path*`:

- če `developmentRoutesClosed()` ni true, `NextResponse.next()`;
- če je true, odgovor 404, ne preusmeritev.

Vrstni red Nexta je: glave, preusmeritve, nato proxy, nato `public/` in app poti. Staging 307 zato še vedno prevlada nad proxyjem, če je bila preusmeritev zapečena ob staging gradnji. Proxy ne zajame `/work/**/preview`.

Tveganje, ki ga mora preveriti izvedba: surov `NextResponse` s statusom 404 ima lahko prazno telo. Za HTML naj ostane `notFound()` v postavitvi, da dokument ostane današnji. Če proxy ujame tudi HTML in zamenja telo, HTML ne sme iti čez to vejo. Datoteke lahko vrnejo 404 s praznim telesom; to ni sprememba oblikovanja 404 strani. Preverjanje mora primerjati status in naslov HTML odgovora z neobstoječo potjo.

Če je prazno telo za datoteke nesprejemljivo, izvedba ustavi samo to vejo in pusti datoteke kot znan ostanek. Ne širi matcherja.

### Datoteke, ki bi jih izvedba spremenila

- `lib/siteEnv.ts` — samo nova funkcija; pomen `isStaging` ostane.
- `app/lab/layout.tsx`
- `app/about-preview/page.tsx`
- `app/en/about-preview/page.tsx`
- `app/mini/page.tsx`
- `app/en/mini/page.tsx`
- `proxy.ts` — samo če gresta v isto izvedbo tudi `public/lab` datoteke.

Ne spreminjati: `next.config.ts` produkcijskih preusmeritev, `app/robots.ts`, `app/sitemap.ts`, OG, `app/not-found.tsx` (ne obstaja), javnih strani, skupnih komponent in sredstev.

Šele po odločitvi, in ne v privzetem sklopu: `app/approach/page.tsx`, `app/contact/page.tsx`, `app/novice/page.tsx`, `app/novice/[slug]/page.tsx`.

### Kako javne strani ostanejo odprte

Zapora je opt-in na naštetih mestih. Ni zavrnitve celotnega `/en` ali `/work`. Preizkus po izvedbi mora na isti gradnji dobiti 200 za seznam iz razdelka 3 in 200 za projektno `preview` sredstvo.

## 8. Preverjanje po izvedbi

Še ni izvedeno. Dev strežnika na vratih 3000 se ne ustavlja in njegov `.next` se ne uporablja.

1. Izolirana kopija. Gradnja A: `SITE_ENV=production`, `VERCEL_ENV=production`. V manifestu ne sme biti `/lab` preusmeritve.
2. `curl` brez sledenja preusmeritvam in zahteva z `RSC: 1`:
   - vzorci `/lab/...`, oba about-preview in oba mini: **404**;
   - javni seznam iz razdelka 3: **200**;
   - `/work/flexido/preview/flexido-home-desktop.webp`: **200**;
   - datoteka iz `public/lab`: **404**, če je proxy vključen, sicer zabeležen ostanek 200;
   - neobstoječa pot: **404**, naslov HTML lab strani enak temu dokumentu.
3. Isti build A zagnati z `SITE_ENV=staging`. Statusi se ne smejo spremeniti. To dokaže, da zagon ne popravi zapečene gradnje.
4. Ločena gradnja B: `SITE_ENV=staging`, `VERCEL_ENV=production`. `/lab/...` naj bo **307** na `/`. `/` naj ima staging `X-Robots-Tag`. `/about-preview` in `/mini` ostaneta **200**, dokler ta odločitev ni spremenjena. `robots.txt` in sitemap ostaneta, kot sta; ta poseg ju ne spreminja.
5. `next dev` na prostih vratih, ne na 3000: lab stran **200**, javna stran **200**.
6. Z javne strani, ki sama nima povezave, ponoviti RSC zahtevo na lab URL in pričakovati 404. To pokrije odjemalsko navigacijo App Routerja.

## 9. Omejitve

- Izmerjen je lokalni produkcijski runtime te gradnje, ne živa domena in ne ponovljena staging gradnja.
- Proces na vratih 3000 je med pregledom za `/` in za lab pot vrnil 500. Ni bil ustavljen in ni uporabljen kot dokaz development vedenja.
- Vseh lab URL-jev nisem klical. Dokaz za nepoklicane je vključenost v gradnjo in odsotnost vmesne zapore, plus izmerjeni vzorec.
- Povezave javnega UI so preverjene z iskanjem po `app/`. Neuporabljeni `app/components/Header.tsx` vsebuje `/approach`, `/novice` in `/contact`, vendar ga nihče ne uvaža.
- Predlog proxyja za datoteke ni bil preizkušen, ker koda v tem koraku ni spremenjena. Prazno 404 telo ostaja tveganje izvedbe, ne izmerjeno dejstvo.
