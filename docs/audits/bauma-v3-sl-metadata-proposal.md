# BAUMA V3 — predlog naslovov in meta opisov za SL strani

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. **Status: predlog, čaka uredniško potrditev. Ni implementirano.** **Aktualen je razdelek 2c (27. 10. 2026): besedila potrjena in lokalno implementirana**; razdelki 2, 2a in 2b so zgodovinski. V tem koraku je spremenjena samo dokumentacija (ta datoteka in register): koda, konfiguracija, odvisnosti, vidna besedila, H1, navigacija, URL-ji, robots, canonical, hreflang in sitemap so nedotaknjeni. Dev strežnik na 3000 ni bil ustavljen (uporabljen le za branje izrisanih strani, GET). Gostovanje ni spremenjeno; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Brez commita, pusha ali deploya.

Izhodišče: [indeksni pregled](./bauma-v3-indexing-review.md), [politika indeksiranja](./bauma-v3-indexing-policy-fix.md). Vseh 10 strani je v politiki med 11 indeksabilnimi URL-ji (poleg `/en`, ki ni del tega sklopa).

## 1. Trenutno stanje

**Title template ne obstaja.** `app/layout.tsx` nastavi samo privzeti `title: "Bauma — Jasna struktura. Več odločitev."` (niz, brez `template`/`default`). Vsaka od 10 strani ima lasten niz `title`, ki ga Next.js uporabi nespremenjenega, zato je končni title enak nastavljeni vrednosti; znamko »Bauma« dodaja samo literal v nizu (pripona `— Bauma`). Podedovani privzeti title se v teh 10 straneh ne pojavi. Opis (`description`) pa **podedujejo** `/pristop` in `/o-nas` (nimata lastnega). Končne vrednosti so bile prebrane iz izrisane strani (`<title>`, `<meta name=description>`), H1 iz izrisanega HTML.

| Stran | Vir v kodi | Končni title | Meta description | H1 | Namen |
|---|---|---|---|---|---|
| `/` | `app/page.tsx:46–47` (`TITLE`, `DESCRIPTION`; metadata 64) | Bauma — Spletne strani, ki pomagajo pridobivati stranke. (56) | Od jasne strukture in vsebine do oblikovanja, razvoja in objave. (64) | Spletne strani, ki pomagajo pridobivati stranke. | Predstavitev dejavnosti, vstop v storitve, izbrano delo in povpraševanje. |
| `/pristop` | `app/pristop/page.tsx:21` (samo title; opis podeduje `app/layout.tsx`) | Pristop — Bauma (15) | Spletne strani za podjetja, ki imajo dobro ponudbo, a se to na njihovi strani ne vidi. (podedovano) (86) | Vsak projekt se začne s kratkim opisom. | Kako poteka sodelovanje. |
| `/work` | `app/work/page.tsx:48` | Work — Bauma (12) | Work preview for Bauma. (23) | Izbrani projekti | Indeks izbranih projektov. |
| `/o-nas` | `app/o-nas/page.tsx:21` (samo title; opis podeduje `app/layout.tsx`) | O nas — Bauma (13) | Spletne strani za podjetja, ki imajo dobro ponudbo, a se to na njihovi strani ne vidi. (podedovano) (86) | Oblikovanje in razvoj pod eno streho. | Kdo je Bauma in kako dela. |
| `/work/flexido` | `app/work/flexido/page.tsx:18–19`, metadata 22 | Flexido: dve poti v industrijsko ponudbo — Bauma (48) | Flexido: ponudba industrijske avtomatizacije ima dva vstopa, po proizvodnem problemu in po standardnem sistemu. Primer iz prakse. (129) | Dve poti skozi industrijsko ponudbo. | Študija: industrijska ponudba. |
| `/work/odstrani-tattoo` | `app/work/odstrani-tattoo/page.tsx:20` | Odstrani Tattoo — Bauma case study (34) | Odstrani Tattoo: stran za odstranjevanje tetovaž, ki se začne z vprašanjem in konča s posvetom. (95) | Najprej odgovor. Potem odločitev. | Študija: stran za odstranjevanje tetovaž. |
| `/work/dema-plus` | `app/work/dema-plus/page.tsx:20`, metadata 24 | Dema Plus: najprej projekti, nato področja dela — Bauma (55) | Dema Plus: domača stran se začne z arhitekturnim projektom, reference so pred področji dela. Primer iz prakse. (110) | Projekti v ospredju. | Študija: podjetje za inženiring in izvedbo. |
| `/work/ulterior` | `app/work/ulterior/page.tsx:22`, metadata 26 | Ulterior: produktna predstavitev, namenska izvedba — Bauma (58) | Ulterior: spletna stran s produktno predstavitvijo, interaktivnimi tehničnimi podrobnostmi in namenskim nakupnim sistemom s PayPalom. Primer iz prakse. (151) | Produktna predstavitev. Namenska izvedba. | Študija: produktna stran in nakupni sistem. |
| `/work/artbite` | `app/work/artbite/page.tsx:21`, metadata 25 | ArtBite: osebni pristop, jasna predstavitev — Bauma (51) | ArtBite: spletna stran tattoo studia, na kateri imajo glavno vlogo fotografije del in osebni pristop. Primer iz prakse. (119) | Osebni pristop. Jasna predstavitev. | Študija: stran tattoo studia. |
| `/work/hardshelljacket` | `app/work/hardshelljacket/page.tsx:21`, metadata 25 | Hardshelljacket: en izdelek, ena stran — Bauma (46) | Hardshelljacket: enostranska spletna stran, ki izdelek predstavi s fotografijo, tehničnimi podatki in jasno potjo do nakupa pri Ulterior. Primer iz prakse. (155) | En izdelek. Ena stran. | Študija: stran enega izdelka. |

Ugotovitve o trenutnem stanju:

- `/work` vsebuje predogledno izrazje (`Work — Bauma`, `Work preview for Bauma.`); naslov je angleški, stran slovenska.
- `/work/odstrani-tattoo` ima angleški ostanek `case study`; ostale študije imajo vzorec `Ime: sporočilo — Bauma` in zaključek `Primer iz prakse.`.
- `/pristop` in `/o-nas` imata isti podedovani opis kot nekdanja domača stran, ki ni več vsebinsko točen; opis ne loči strani.
- Domači title ponavlja H1 in nosi obljubo učinka (»pomagajo pridobivati stranke«); ponavljanje samo po sebi ni napaka (glej opombo v razdelku 2).
- H1 domače strani v izrisanem HTML vsebuje besedilo dvakrat (vizualna razdelitev v dve vrstici); `h1` je en sam element (en H1). Ni predmet tega koraka.
- `/work/hardshelljacket`: vidno besedilo ima `enostransko`, meta opis `enostranska`; vidno besedilo ni spremenjeno (opozorilo za uredniški pregled).
- **OG/Twitter**: `/pristop`, `/o-nas`, `/work`, `/work/odstrani-tattoo` podedujejo OG/Twitter naslov »Bauma — Jasna struktura. Več odločitev.« in splošni opis; domača in štiri študije imajo `og:title`/`og:description` enaka `title`/`description`. Če se title/description spremenita, se OG/Twitter ne posodobita sama.

## 2. Prvi predlog (zgodovinski; nadomeščen z 2a, nato z aktualnim razdelkom 2b)

> **Zgodovinski zapis.** Razdelki 2–4 spodaj opisujejo prvi predlog; veljaven je aktualni razdelek 2c (27. 10. 2026). Posebej: prvi predlog je navajal ponavljanje H1 v titleu domače strani kot pomanjkljivost – to ni tehnična ali SEO napaka. Title in H1 smeta nositi isto sporočilo; razlog za spremembo je uredniški (title mora delovati samostojno in opisati delo), ne odpravljanje napake.

Slog: slovenščina, konkretno, brez superlativov, obljub prodaje/uvrstitev/rezultatov in brez storitev, ki jih strani ne ponujata. Pripona `— Bauma` ostane enkrat (v obstoječem vzorcu); pri domači je znamka na začetku. Dolžine so uredniško vodilo (title ≈ 60, description ≈ 160), ne zagotovilo prikaza.

| Stran | Title (znaki) | Meta description (znaki) |
|---|---|---|
| `/` | Bauma — načrtovanje, oblikovanje in razvoj spletnih strani (58) | Bauma zasnuje, oblikuje in razvije spletne strani za podjetja ter jih objavi. Pripravimo tudi spletne bannerje in e-novice, obstoječe strani pa vzdržujemo. (155) |
| `/pristop` | Pristop: od kratkega opisa do zaključka — Bauma (47) | Začnete s kratkim opisom po e-pošti, tudi brez pripravljenega gradiva. Sledijo predlog obsega, ponudba, izvedba in pregled; večino dogovora uredimo po e-pošti. (159) |
| `/work` | Izbrani projekti: šest spletnih strani — Bauma (46) | Flexido, Ulterior, Odstrani Tattoo, Dema Plus, ArtBite in Hardshelljacket: šest projektov z različnimi izhodišči. Pri vsakem je opisano, kaj smo naredili. (154) |
| `/o-nas` (**presežen**, glej 2a) | O nas: neodvisen digitalni studio — Bauma (41) | Bauma je neodvisen digitalni studio za spletne strani in digitalne rešitve. Povezuje načrtovanje, oblikovanje in razvoj, pogosto na podlagi že obstoječega. (155) |
| `/work/flexido` | Flexido: spletna stran z dvema vstopoma v ponudbo — Bauma (57) | Flexido, robotske celice in avtomatizacija: obiskovalec začne pri proizvodnem procesu ali pri izdelku. Stran v treh jezikih. Baumin prikaz projekta. (148) |
| `/work/odstrani-tattoo` | Odstrani Tattoo: stran, ki najprej razloži postopek — Bauma (59) | Odstranjevanje tetovaž s Pico laserjem: stran najprej razloži postopek, nato pokaže primere in vodi do posveta, brez obljube rezultata. Baumin prikaz projekta. (159) |
| `/work/dema-plus` | Dema Plus: izbrani projekti pred področji dela — Bauma (54) | Stran podjetja za inženiring in izvedbo: najprej izbrane izvedbe, med njimi hotela, nato področja dela. Baumin prikaz projekta. (127) |
| `/work/ulterior` | Ulterior: produktna stran in namenski nakupni sistem — Bauma (60) | Stran znamke Ulterior: hardshell jakna, interaktivne tehnične podrobnosti in namenski nakupni sistem s plačilom prek PayPala. Baumin prikaz projekta. (149) |
| `/work/artbite` | ArtBite: stran tattoo studia, ki začne pri delih — Bauma (56) | Tattoo studio v Domžalah: galerija del je v ospredju, ločena stran pa pojasni prekrivanje starih tetovaž. Baumin prikaz projekta. (129) |
| `/work/hardshelljacket` | Hardshelljacket: spletna stran za en izdelek — Bauma (52) | Enostranska stran za eno jakno znamke Ulterior: fotografije in tehnični podatki, nakup pri Ulterior, poslovna povpraševanja ločeno. Baumin prikaz projekta. (155) |

### Utemeljitve in opora v vsebini

**`/`** — Pove, kaj Bauma dela (struktura, oblikovanje, razvoj, objava, digitalni materiali, vzdrževanje) in za koga (podjetja), brez obljube o strankah, ki jo nosi H1. Trenutni title nosi obljubo učinka; ponavljanje H1 samo po sebi ni napaka.
*Opora:* H1 »Spletne strani, ki pomagajo pridobivati stranke.«; razdelek »Kaj lahko uredimo za vas« našteva strukturo in zasnovo, oblikovanje in izvedbo (»oblikujemo, razvijemo in objavimo«), digitalne materiale (»spletne bannerje, HTML e-novice«, animirane in video različice) ter vzdrževanje (»tudi na straneh drugih izvajalcev«).

**`/pristop`** — Opiše pot od kratkega opisa do zaključka, ohrani e-pošto kot privzeti način in ne obljubi klica. »Brez pripravljenega gradiva« povzema vsebino strani (ne uporablja besede »brief«, ki je stran ne uporablja). Trenutni opis je splošni opis domače strani.
*Opora:* H1 »Vsak projekt se začne s kratkim opisom.«; »Za začetek zadostuje nekaj stavkov … Ni treba, da imate vse pripravljeno«; »Večino usklajevanja opravimo po e-pošti. Pogovor ali sestanek dogovorimo, kadar je potreben«; štiri faze Začetek, Dogovor, Izvedba, Pregled in zaključek.

**`/work`** — Predstavi izbor in Baumin prispevek; odstrani »Work«/»preview«. Našteta imena dajo opisu konkretnost in se ne ponavljajo z drugimi opisi.
*Opora:* H1 »Izbrani projekti«, šest kartic (Flexido, Ulterior, Odstrani Tattoo, Dema Plus, ArtBite, Hardshelljacket); odstavek »Pri Baumi načrtujemo, oblikujemo in razvijamo spletne strani za podjetja, izdelke in storitve«. Vsak projekt ima poleg tega svojo stran, ki opisuje delo.

**`/o-nas`** — Predstavi izvajalca in način dela samo z dejansko vsebino. Opis se razlikuje od domače in pristopa, kjer je zdaj enak.
*Opora (prvi predlog, presežno):* »Bauma je neodvisen digitalni studio za spletne strani in digitalne rešitve. Povezujemo načrtovanje, oblikovanje in razvoj«; »Pogosto izhajamo iz nečesa, kar že obstaja«. Podpis Gregor Baumgartner. Strani ne omenjata ekipe, velikosti, nagrad ali let izkušenj, zato jih ni v predlogu.

**`/work/flexido`** — Konkreten problem: ponudba z dvema poti vstopa. Delo: struktura, oblikovanje, razvoj v treh jezikih. Prikaz je Baumin.
*Opora:* Lead »zasnovali in razvili spletno stran z dvema vstopoma v ponudbo: po proizvodnih procesih in po izdelkih«; »Struktura, oblikovanje in razvoj spletne strani v slovenščini, angleščini in nemščini«; razdelki »Kje se vaš proces ustavlja?« (področja) in »Vrste sistemov« (e-katalog). Rekonstrukcije razdelkov flexido.eu.

**`/work/odstrani-tattoo`** — Konkreten problem: obiskovalec najprej potrebuje razlago postopka. Ohrani »brez obljube rezultata« iz strani. Odstrani angleški ostanek »case study«.
*Opora:* Lead »spletno stran za odstranjevanje tetovaž, ki obiskovalcu najprej razloži postopek«; »Postopek je razložen brez obljube rezultata«; razdelek Pico laser, »Realni primeri odstranjevanja« s pojasnilom, da primeri niso obljuba enakega rezultata; posvet po telefonu ali e-pošti s fotografijo.

**`/work/dema-plus`** — Konkreten problem: reference so pred področji dela. Ne trdi nič o rezultatih naročnika. Stari opis »arhitekturni projekt« nadomesti oznaka s strani (»Inženiring • Izvedba«).
*Opora:* Lead »spletno stran, na kateri imajo prednost projekti in reference«; »Inženiring • Izvedba«; po uvodu »izbrani projekti, šele nato področja dela«; Vila Rožna dolina, Hotel Nox Ljubljana, Hotel Cubo.

**`/work/ulterior`** — Razlikovanje: znamka s polnim nakupnim sistemom (rezervacija zaloge, PayPal). Brez cen in količin.
*Opora:* Lead »spletno stran s produktno predstavitvijo, interaktivnimi tehničnimi podrobnostmi in namenskim nakupnim sistemom«; razdelek Technical Proof (označene točke na jakni); »Namenski nakupni sistem … Plačilo poteka prek PayPala«; v prikazu plačilo ni omogočeno.

**`/work/artbite`** — Razlikovanje: storitvena stran studia, kjer so v ospredju dela, z ločeno stranjo za prekrivanje. Lokacija (Domžale) je na strani. »Od leta 2016« ni uporabljeno (trditev naročnika, ne Baumina).
*Opora:* Lead »spletno stran tattoo studia, na kateri imajo glavno vlogo fotografije del in osebni pristop«; »Studio zaprtega tipa v Domžalah«; galerija Tatuji; stran »Prekrivanje starih tetovaž« (»vsak primer najprej ocenimo posebej«, pošiljanje fotografije za oceno).

**`/work/hardshelljacket`** — Razlikovanje od Ulterior: ena stran za en izdelek, nakup drugje (Ulterior), poslovna povpraševanja ločeno; Bauma tu ni opravila oblikovanja (»Struktura in razvoj«).
*Opora:* Lead »enostransko spletno stran za predstavitev Ulteriorjeve jakne … povezava za nakup vodi na Ulterior, poslovna povpraševanja pa na ločen e-poštni kontakt znamke«; »Struktura in razvoj spletne strani« (brez oblikovanja); gumba »Buy on Ulterior« in »B2B enquiries«.

## 2c. IMPLEMENTIRANO LOKALNO — potrjena končna besedila (27. 10. 2026)

**Status: besedila so uredniško potrjena in lokalno implementirana ter preverjena; gostovanje ni preverjeno in SEO kot celota ni zaključen.** To je zdaj **aktualen** razdelek; razdelki 2b, 2a in 2 so zgodovinski. Besedila iz navodila za implementacijo imajo prednost pred starejšimi predlogi. Podrobnosti, diff in rezultati: [bauma-v3-sl-metadata-implementation.md](./bauma-v3-sl-metadata-implementation.md).

| Pot | Title (znaki) | Meta description (znaki) | Status |
|---|---|---|---|
| `/` | Bauma — načrtovanje, oblikovanje in razvoj spletnih strani (58) | Načrtovanje, oblikovanje in razvoj spletnih strani za podjetja. Od strukture in vsebine do izvedbe in objave — z jasnim namenom vsakega dela. (141) | ohranjeno iz 2b (potrjeno) |
| `/pristop` | Pristop: od kratkega opisa do zaključka — Bauma (47) | Začnete s kratkim opisom po e-pošti, tudi brez pripravljenega gradiva. Sledijo predlog obsega, ponudba, izvedba in pregled; večino usklajevanja opravimo po e-pošti. (164) | ohranjeno iz 2b |
| `/work` | Izbrani spletni projekti — Bauma (32) | Izbor spletnih strani in digitalnih rešitev. Izhodišča projektov, odločitve pri zasnovi ter povezava med vsebino, oblikovanjem in razvojem. (139) | ohranjeno iz 2b (potrjeno) |
| `/o-nas` | O nas: digitalni studio — Bauma (31) | Bauma vodi Gregor Baumgartner. Pri spletnih straneh in digitalnih rešitvah povezuje načrtovanje, oblikovanje in razvoj — od zasnove do objave. (142) | ohranjeno iz 2b (potrjeno) |
| `/work/flexido` | Flexido: spletna stran z dvema vstopoma v ponudbo — Bauma (57) | Za Flexido smo prenovili spletno predstavitev: e-katalog smo dopolnili s potjo Rešitve, kjer obiskovalec izhaja iz proizvodnega procesa ali naloge. (147) | skrajšan opis (nadomešča 2b) |
| `/work/odstrani-tattoo` | Odstrani Tattoo: stran, ki najprej razloži postopek — Bauma (59) | Za Odstrani Tattoo smo zasnovali in razvili spletno stran za odstranjevanje tetovaž. Obiskovalca vodi od razlage postopka prek primerov do posveta. (147) | ohranjeno iz 2b |
| `/work/dema-plus` | Dema Plus: spletna predstavitev projektov in storitev — Bauma (61) | Za Dema Plus smo prenovili spletno predstavitev s projekti v ospredju ter uredili posamezne reference z opisi, osnovnimi podatki in sorodnimi projekti. (151) | skrajšan opis (nadomešča 2b) |
| `/work/ulterior` | Ulterior: produktna stran in namenski nakupni sistem — Bauma (60) | Za Ulterior smo zasnovali in razvili spletno stran s predstavitvijo hardshell jakne, interaktivnimi tehničnimi podrobnostmi in namenskim nakupnim sistemom s PayPalom. (166) | ohranjeno iz 2b |
| `/work/artbite` | ArtBite: stran tattoo studia, ki začne pri delih — Bauma (56) | Za ArtBite smo zasnovali in razvili spletno stran tattoo studia v Domžalah, kjer imajo glavno vlogo fotografije del. Ločena stran pojasni prekrivanje starih tetovaž. (165) | ohranjeno iz 2b |
| `/work/hardshelljacket` | Hardshelljacket: spletna stran za en izdelek — Bauma (52) | Za Hardshelljacket smo zasnovali, oblikovali in razvili stran za jakno Ulterior. Nakup vodi na Ulterior, poslovna povpraševanja so ločena. (138) | skrajšan opis (nadomešča 2b) |

**Tri skrajšane opise (Flexido, Dema Plus, Hardshelljacket) velja kot aktualne; različice iz 2b ostajajo kot zgodovinske** (Flexido 183 znakov, Dema Plus 166, Hardshelljacket 186).

**Popravek utemeljitve za Flexido (2b):** prejšnji opis (»dvema vstopoma … po proizvodnih procesih in po izdelkih«) **ni bil v nasprotju z leadom**; spremenjen je bil zato, da bolje poudari prispevek prenove: e-katalog je dopolnjen s potjo Rešitve, ki izhaja iz proizvodnega procesa ali naloge. Title (»z dvema vstopoma«) ostaja skladen s H1 »Dve poti skozi industrijsko ponudbo«.

**OG in Twitter (implementirano):** za vseh deset strani enaki `og:title`/`og:description` in `twitter:title`/`twitter:description` ter `summary_large_image`; slika `/og/bauma-og-main-v3.png` (1200 × 630, alt »Bauma — Spletne strani, ki pomagajo pridobivati stranke.«). EN, pravne strani, stare poti in 404 ostanejo na prejšnjem OG besedilu in sliki.

## 2b. Predlog, usklajen s končno vidno vsebino (27. 10. 2026) — ZGODOVINSKO (tri opisa nadomeščena z 2c)

**Zgodovinski zapis (nadomeščen z 2c; prejšnji status: predlog, čaka uredniško potrditev).** Razdelki 2 (prvi predlog) in 2a (uredniško dopolnjen predlog) so zgodovinski zapis in ne veljata več; razlike so v spodnji tabeli. Predlog je pregledan proti dejanski vsebini desetih strani po zaključku vsebinskega Proof & Credibility (lead Odstrani Tattoo, obsega Hardshelljacket in Ulterior, zaključni stavek Flexida, uvod in razlaga Dema Plus, osebna predstavitev O nas, tri besedila Home/Pristop, podnapisi). Popravljeno je samo, kar je vsebina presegla; ostalo je ohranjeno brez slogovnih prepisov.

Potrjena besedila (uredniško): Home title in opis, Work title, O nas title in opis. Ohranjena, ker nasprotja z vsebino ni (preverjeno): O nas ne vsebuje »neodvisen«; ni »Baumin prikaz projekta«, števila projektov ali predogledne besede; brez avtorstva fotografij, prevodov in naročnikovih izdelkov. Pripona `— Bauma` je enkrat; opisi opisujejo Baumino delo in ne ponavljajo dobesedno leadov.

| Pot | Title (znaki) | Meta description (znaki) | Status |
|---|---|---|---|
| `/` | Bauma — načrtovanje, oblikovanje in razvoj spletnih strani (58) | Načrtovanje, oblikovanje in razvoj spletnih strani za podjetja. Od strukture in vsebine do izvedbe in objave — z jasnim namenom vsakega dela. (141) | ohranjeno |
| `/pristop` | Pristop: od kratkega opisa do zaključka — Bauma (47) | Začnete s kratkim opisom po e-pošti, tudi brez pripravljenega gradiva. Sledijo predlog obsega, ponudba, izvedba in pregled; večino usklajevanja opravimo po e-pošti. (164) | ohranjeno |
| `/work` | Izbrani spletni projekti — Bauma (32) | Izbor spletnih strani in digitalnih rešitev. Izhodišča projektov, odločitve pri zasnovi ter povezava med vsebino, oblikovanjem in razvojem. (139) | ohranjeno |
| `/o-nas` | O nas: digitalni studio — Bauma (31) | Bauma vodi Gregor Baumgartner. Pri spletnih straneh in digitalnih rešitvah povezuje načrtovanje, oblikovanje in razvoj — od zasnove do objave. (142) | ohranjeno |
| `/work/flexido` | Flexido: spletna stran z dvema vstopoma v ponudbo — Bauma (57) | Prenova predstavitve Flexido: poleg e-kataloga nova pot Rešitve po proizvodnem procesu ali nalogi. Zasnova, oblikovanje in razvoj spletne strani v slovenščini, angleščini in nemščini. (183) | opis spremenjen, title ohranjen |
| `/work/odstrani-tattoo` | Odstrani Tattoo: stran, ki najprej razloži postopek — Bauma (59) | Za Odstrani Tattoo smo zasnovali in razvili spletno stran za odstranjevanje tetovaž. Obiskovalca vodi od razlage postopka prek primerov do posveta. (147) | ohranjeno |
| `/work/dema-plus` | Dema Plus: spletna predstavitev projektov in storitev — Bauma (61) | Prenova spletne predstavitve Dema Plus: v ospredju so izvedeni projekti, urejene pa so tudi posamezne reference z opisi, osnovnimi podatki in povezavami med projekti. (166) | opis spremenjen, title ohranjen |
| `/work/ulterior` | Ulterior: produktna stran in namenski nakupni sistem — Bauma (60) | Za Ulterior smo zasnovali in razvili spletno stran s predstavitvijo hardshell jakne, interaktivnimi tehničnimi podrobnostmi in namenskim nakupnim sistemom s PayPalom. (166) | ohranjeno |
| `/work/artbite` | ArtBite: stran tattoo studia, ki začne pri delih — Bauma (56) | Za ArtBite smo zasnovali in razvili spletno stran tattoo studia v Domžalah, kjer imajo glavno vlogo fotografije del. Ločena stran pojasni prekrivanje starih tetovaž. (165) | ohranjeno |
| `/work/hardshelljacket` | Hardshelljacket: spletna stran za en izdelek — Bauma (52) | Za Hardshelljacket smo zasnovali, oblikovali in razvili spletno stran za eno jakno znamke Ulterior v angleščini in španščini. Nakup poteka pri Ulterior, poslovna povpraševanja pa ločeno. (186) | opis spremenjen, title ohranjen |

### Spremembe glede na prejšnji veljavni predlog (2a)

Spremenjeni so **trije opisi** (titli vseh desetih strani so ohranjeni):

| Pot | Prejšnji veljavni opis (2a) | Aktualni opis (2b) |
|---|---|---|
| `/work/flexido` | Za Flexido smo zasnovali in razvili spletno stran v slovenščini, angleščini in nemščini z dvema vstopoma v ponudbo: po proizvodnih procesih in po izdelkih. (155) | Prenova predstavitve Flexido: poleg e-kataloga nova pot Rešitve po proizvodnem procesu ali nalogi. Zasnova, oblikovanje in razvoj spletne strani v slovenščini, angleščini in nemščini. (183) |
| `/work/dema-plus` | Za Dema Plus smo zasnovali in razvili spletno stran, ki podjetje predstavi z izbranimi projekti, referencami in področji dela. (126) | Prenova spletne predstavitve Dema Plus: v ospredju so izvedeni projekti, urejene pa so tudi posamezne reference z opisi, osnovnimi podatki in povezavami med projekti. (166) |
| `/work/hardshelljacket` | Za Hardshelljacket smo razvili spletno stran, ki jakno znamke Ulterior predstavi s fotografijami in podatki. Nakup poteka pri Ulterior, poslovna povpraševanja pa ločeno. (169) | Za Hardshelljacket smo zasnovali, oblikovali in razvili spletno stran za eno jakno znamke Ulterior v angleščini in španščini. Nakup poteka pri Ulterior, poslovna povpraševanja pa ločeno. (186) |

### Razlogi in opora v vsebini

- **`/`** — *ohranjeno.* Potrjeno uredniško; vsebina Home (hero, Kaj delamo, Celota, Izbrano delo, Za začetek) ga podpira. Po spremembi »Digitalni materiali« opis še vedno ne omenja bannerjev, e-novic ali vzdrževanja.
- **`/pristop`** — *ohranjeno.* Opis ostaja točen po zadnjih besedilih: začetek s kratkim opisom po e-pošti, »Če že imate … jih priložite« (gradivo ni pogoj), predlog obsega, ponudba, izvedba, pregled. Vodenje projekta (Gregor Baumgartner) je na strani, a ni nujno v metapodatkih.
- **`/work`** — *ohranjeno.* Potrjeno uredniško. Brez števila in predogledne besede. Opora: kartice z izhodišči in odstavek »Od zasnove do izvedbe«.
- **`/o-nas`** — *ohranjeno.* Potrjeno uredniško; ujemata se z vidnim besedilom (»Bauma vodi …«/»Za Baumo stojim Gregor Baumgartner«, »od zasnove do objave«, brez »neodvisen«). Biografski podatki (NLB, IED, agencije) niso v metapodatkih.
- **`/work/flexido`** — *opis spremenjen, title ohranjen.* Prejšnji opis (»dvema vstopoma … po proizvodnih procesih in po izdelkih«) ne ustreza več leadu: stran zdaj pove, da je prejšnja predstavitev temeljila na e-katalogu, da je ob prenovi dodana pot Rešitve (iz proizvodnega procesa ali naloge, ne iz izdelka) in da e-katalog ostaja neposreden vstop. Title (»z dvema vstopoma«) še velja (H1 »Dve poti skozi industrijsko ponudbo«). Jeziki so le opis strani (obseg »v slovenščini, angleščini in nemščini«), ne avtorstvo prevodov.
- **`/work/odstrani-tattoo`** — *ohranjeno.* Title in opis ustrezata novemu leadu (razlaga postopka → primeri → posvet); brez medicinskih trditev in obljub rezultatov.
- **`/work/dema-plus`** — *opis spremenjen, title ohranjen.* Prejšnji opis je omenjal samo projekte, reference in področja dela; vsebina zdaj pove tudi, da je ob prenovi v ospredju izvedene projekte in da so urejene posamezne reference (povzetki, opisi, osnovni podatki, povezovanje, sorodne reference). Title (»projektov in storitev«) ima oporo v leadu (»pregled njegovih storitev«). Brez panoge.
- **`/work/ulterior`** — *ohranjeno.* Opis ustreza leadu in obsegu (predstavitev izdelka, interaktivne tehnične podrobnosti, namenski nakupni sistem s PayPalom). Ne trdi prodaj ali trenutne omogočenosti nakupa; preverjanje v testnem okolju in produkciji je v vidnem besedilu, ni nujno v metapodatkih.
- **`/work/artbite`** — *ohranjeno.* Opis ustreza leadu (fotografije del) in ločeni predstavitvi prekrivanja. »Osebni pristop« je naročnikovo pozicioniranje (H1 ga povzema); v opisu ni, kar ni konflikt. ArtBite lead ostaja nespremenjen.
- **`/work/hardshelljacket`** — *opis spremenjen, title ohranjen.* Obseg je zdaj »Zasnova, oblikovanje in razvoj … v angleščini in španščini« (Grega je potrdil oblikovanje in razvoj koncepta); prejšnji opis je govoril samo o »razvili« in ni omenjal jezikov. Nakup pri Ulterior in ločena poslovna povpraševanja ostajajo. Ne pripisuje avtorstva prevodov ali fotografij. Ločen od Ulterior (en izdelek proti produktni strani z nakupnim sistemom).

### OG in Twitter (predlog, ni implementirano)

Predlog: `og:title`, `og:description`, `twitter:title` in `twitter:description` naj bodo **enaki** zgornjim naslovom in opisom za vseh deset strani (`og:url` ostane po obstoječem pravilu `ogUrl()`, `og:locale` `sl_SI`, `og:type` `website`).

Izjeme in opozorila:
- **Štiri strani** (`/pristop`, `/work`, `/o-nas`, `/work/odstrani-tattoo`) trenutno nimajo lastnega OG/Twitter in dedujejo splošni naslov »Bauma — Jasna struktura. Več odločitev.«; pri njih je treba dodati lasten `openGraph` in `twitter` (Next.js layoutov objekt zamenja, ne združi). `/pristop` in `/o-nas` nimata niti `description`.
- **OG slika** ostane `/og/bauma-og-v3.png` do ločenega sklopa OG slik; slik, alt besedil in strukturiranih podatkov ta predlog ne spreminja.
- Noindex strani (pravne, stare poti, EN) niso del predloga.
- Izven obsega: `canonical`, `hreflang`, `robots`, `sitemap`, `lang`, konfiguracija (nespremenjeni).

### Preostale uredniške odločitve

1. Potrditev treh spremenjenih opisov (Flexido, Dema Plus, Hardshelljacket); title ostanejo.
2. Ali naj Pristop v opisu omeni vodenje projekta (trenutno ne; je na strani).
3. Ali naj Ulterior opis omeni preverjanje v testnem okolju in produkciji (trenutno ne, ker ni nujno za metapodatke in bi bila dolga; nobena trditev o prodajah ali omogočenosti nakupa).
4. Dolžine so orientacija; trije spremenjeni opisi so nad ≈160 znaki in jih iskalnik lahko skrajša; pomen ni žrtvovan.
5. Ločene odprte točke: EN prenova, dostopnost, dosegljivost domene hardshelljacket.com, preverjanje gostovanja.

**Datoteke za poznejšo implementacijo** (razdelek 5 spodaj ostaja veljaven po obsegu): `app/page.tsx`, `app/pristop/page.tsx`, `app/work/page.tsx`, `app/o-nas/page.tsx`, šest `app/work/*/page.tsx` ter pomožnik `lib/indexing.ts` (`ROOT_OPEN_GRAPH`, ki ga štiri strani zdaj uporabljajo za OG).

## 2a. Uredniško dopolnjen predlog (26. 10. 2026) — ZGODOVINSKO, nadomeščen z razdelkom 2b

**Zgodovinski zapis (nadomeščen z 2b).** Prejšnji status: predlog, čaka uredniško potrditev. Vrstica `/o-nas` je usklajena z vidnim besedilom strani (brez »neodvisen«, z imenom izvajalca). Nadomešča prvi predlog v razdelku 2 (ta ostaja nespremenjen kot zgodovinski zapis). Spremembe po uredniških pripombah: domači opis in `/work` po navodilu; zaključek »Baumin prikaz projekta.« odstranjen iz vseh šestih študij; Odstrani Tattoo brez »brez obljube rezultata«; Dema Plus z novim titleom in opisom brez razlage »projekti pred področji dela«; Hardshelljacket brez »enostranska«; Pristop, O nas, Flexido, Ulterior in ArtBite ohranjajo jedro, besedilo je preurejeno. Pripona `— Bauma` je v vsakem titleu enkrat.

| Stran | Title (znaki) | Meta description (znaki) |
|---|---|---|
| `/` | Bauma — načrtovanje, oblikovanje in razvoj spletnih strani (58) | Načrtovanje, oblikovanje in razvoj spletnih strani za podjetja. Od strukture in vsebine do izvedbe in objave — z jasnim namenom vsakega dela. (141) |
| `/pristop` | Pristop: od kratkega opisa do zaključka — Bauma (47) | Začnete s kratkim opisom po e-pošti, tudi brez pripravljenega gradiva. Sledijo predlog obsega, ponudba, izvedba in pregled; večino usklajevanja opravimo po e-pošti. (164) |
| `/work` | Izbrani spletni projekti — Bauma (32) | Izbor spletnih strani in digitalnih rešitev. Izhodišča projektov, odločitve pri zasnovi ter povezava med vsebino, oblikovanjem in razvojem. (139) |
| `/o-nas` | O nas: digitalni studio — Bauma (31) | Bauma vodi Gregor Baumgartner. Pri spletnih straneh in digitalnih rešitvah povezuje načrtovanje, oblikovanje in razvoj — od zasnove do objave. (142) |
| `/work/flexido` | Flexido: spletna stran z dvema vstopoma v ponudbo — Bauma (57) | Za Flexido smo zasnovali in razvili spletno stran v slovenščini, angleščini in nemščini z dvema vstopoma v ponudbo: po proizvodnih procesih in po izdelkih. (155) |
| `/work/odstrani-tattoo` | Odstrani Tattoo: stran, ki najprej razloži postopek — Bauma (59) | Za Odstrani Tattoo smo zasnovali in razvili spletno stran za odstranjevanje tetovaž. Obiskovalca vodi od razlage postopka prek primerov do posveta. (147) |
| `/work/dema-plus` | Dema Plus: spletna predstavitev projektov in storitev — Bauma (61) | Za Dema Plus smo zasnovali in razvili spletno stran, ki podjetje predstavi z izbranimi projekti, referencami in področji dela. (126) |
| `/work/ulterior` | Ulterior: produktna stran in namenski nakupni sistem — Bauma (60) | Za Ulterior smo zasnovali in razvili spletno stran s predstavitvijo hardshell jakne, interaktivnimi tehničnimi podrobnostmi in namenskim nakupnim sistemom s PayPalom. (166) |
| `/work/artbite` | ArtBite: stran tattoo studia, ki začne pri delih — Bauma (56) | Za ArtBite smo zasnovali in razvili spletno stran tattoo studia v Domžalah, kjer imajo glavno vlogo fotografije del. Ločena stran pojasni prekrivanje starih tetovaž. (165) |
| `/work/hardshelljacket` | Hardshelljacket: spletna stran za en izdelek — Bauma (52) | Za Hardshelljacket smo razvili spletno stran, ki jakno znamke Ulterior predstavi s fotografijami in podatki. Nakup poteka pri Ulterior, poslovna povpraševanja pa ločeno. (169) |

### Opora v vsebini in opozorila

**`/`** — Opis ujema vsebino hero besedila »Od jasne strukture in vsebine do oblikovanja, razvoja in objave« in razdelka »Vsebina, struktura, oblikovanje in tehnična izvedba morajo delovati skupaj«. Banner, e-novice in vzdrževanje so izpuščeni (razdelek »Kaj lahko uredimo za vas« jih sicer navaja). **Delna opora:** »za podjetja« na domači strani ni dobesedno (je na `/work` in v prejšnjih metapodatkih); »z jasnim namenom vsakega dela« je splošen povzetek, ne citat. Ni v nasprotju z vsebino; najmanjši popravek, če želite dobesedno oporo: »… do izvedbe in objave — tako da deli delujejo skupaj.«

**`/pristop`** — H1 »Vsak projekt se začne s kratkim opisom«; »Za začetek zadostuje nekaj stavkov … Ni treba, da imate vse pripravljeno«; »Večino usklajevanja opravimo po e-pošti. Pogovor ali sestanek dogovorimo, kadar je potreben«; faze Začetek, Dogovor, Izvedba, Pregled in zaključek. Klic ni naveden kot obvezen.

**`/work`** — Šest kartic z izhodišči (npr. »Zaupanje in konverzija«, »Industrijski B2B«); odstavek »Od zasnove do izvedbe … razumevanje vsebine, potreb naročnika in poti obiskovalca«; vsak projekt ima svojo stran z razlago odločitev. **Opozorilo:** sama stran `/work` kaže samo kartice in kratek odstavek, »odločitve pri zasnovi« pojasnijo šele podstrani; ni v nasprotju, najmanjši popravek je »… odločitve pri zasnovi na straneh projektov …«.

**`/o-nas`** (posodobljeno 26. 10. 2026) — Opora na strani: lead »Bauma je digitalni studio za spletne strani in digitalne rešitve. Povezujemo načrtovanje, oblikovanje in razvoj — od prvih izhodišč do izvedbe« (beseda »neodvisen« je odstranjena iz vidnega besedila, zato je tudi iz predloga); prvi osebni odstavek »Za Baumo stojim Gregor Baumgartner. Projekte vodim od zasnove do objave ter povezujem vsebino, oblikovanje in razvoj«. Title poda samo vlogo strani in vrsto podjetja (»digitalni studio«). Opis poimenuje, kdo vodi Baumo (»Bauma vodi Gregor Baumgartner«, enako kot »stojim … vodim«), in ponovi vsebinsko jedro (»povezuje načrtovanje, oblikovanje in razvoj — od zasnove do objave«, enako kot »od zasnove do objave«). Ne navaja NLB, izobrazbe, let, agencij ali številk, ki so v osebnem delu strani, in ne trdi nič, česar stran ne pove. Opis se vsebinsko razlikuje od domačega in od Pristopa. **Opomba:** opis je v 3. osebi (»vodi«, »povezuje«), osebni del strani pa v 1. osebi ednine; metapodatki običajno govorijo o podjetju, zato to ni neskladje, a je uredniška izbira.

**`/work/flexido`** — Lead »Za Flexido smo zasnovali in razvili spletno stran z dvema vstopoma v ponudbo: po proizvodnih procesih in po izdelkih«; »Struktura, oblikovanje in razvoj spletne strani v slovenščini, angleščini in nemščini«. Robotske celice so Flexidova ponudba in v opisu niso naštete.

**`/work/odstrani-tattoo`** — Lead »spletno stran za odstranjevanje tetovaž, ki obiskovalcu najprej razloži postopek«; razdelek »Kako deluje Pico laser …«; »Realni primeri odstranjevanja«; »Za posvet lahko obiskovalec pokliče ali po e-pošti pošlje vprašanje in fotografijo«. Izraz »posvet« je dobeseden. Ni medicinskih trditev ali obljub; »brez obljube rezultata« je odstranjeno.

**`/work/dema-plus`** — Lead »spletno stran, na kateri imajo prednost projekti in reference«; razdelka »Projekti, ki govorijo namesto nas« (Vila Rožna dolina, Hotel Nox Ljubljana, Hotel Cubo) in »področja dela«. **Opozorilo za title:** beseda »storitev« na strani ni; stran uporablja »področja dela«. Ni v nasprotju (širši izraz za isto), najmanjši popravek: »spletna predstavitev projektov in področij dela«. Panoga ni navedena.

**`/work/ulterior`** — Lead »spletno stran s produktno predstavitvijo, interaktivnimi tehničnimi podrobnostmi in namenskim nakupnim sistemom«; »Namenski nakupni sistem … Plačilo poteka prek PayPala«; »Struktura, oblikovanje in razvoj spletne strani ter nakupnega sistema«. Poudarek: produktna stran in nakupni sistem.

**`/work/artbite`** — Lead »spletno stran tattoo studia, na kateri imajo glavno vlogo fotografije del in osebni pristop«; »Studio zaprtega tipa v Domžalah«; stran »Prekrivanje starih tetovaž«. Ne navaja »od leta 2016« ali rezultatov.

**`/work/hardshelljacket`** — Lead »Za Hardshelljacket smo razvili … Fotografije in tehnični podatki predstavijo izdelek, povezava za nakup vodi na Ulterior, poslovna povpraševanja pa na ločen e-poštni kontakt znamke«; »Struktura in razvoj spletne strani« (brez oblikovanja, zato »razvili«). »Enostranska« je odstranjeno. Poudarek: pot do nakupa in B2B ločeno; Ulterior je poudarek na produktni strani in lastnem nakupnem sistemu.

### Razlikovanje in ton

- Študije se začnejo z »Za <ime> smo …«, kar jasno kaže portfolio (Baumino delo), ne ponudbe naročnika; naročnikove storitve (robotske celice, odstranjevanje tetovaž, inženiring, nakup jakne) so omenjene samo kot predmet spletne strani. Ni poslovnih rezultatov, številk, cen ali medicinskih trditev.
- Ulterior (produktna stran + namenski nakupni sistem s PayPalom) in Hardshelljacket (ena jakna, nakup pri Ulterior, poslovna povpraševanja ločeno) se razlikujeta po poudarku.
- Skupen vzorec »Za … smo zasnovali in razvili« sledi obstoječim lead stavkom na straneh; pri Hardshelljacket je »razvili«, ker stran navaja »Struktura in razvoj«.
- Dolžine so uredniško vodilo, ne zagotovilo prikaza.

### Odprte odločitve po dopolnitvi

1. Domači opis: sprejeti kot je ali z najmanjšim popravkom iz opore (dobesedna opora za »z jasnim namenom vsakega dela«).
2. `/work`: opis omenja »odločitve pri zasnovi«, ki jih razlaga šele posamezen projekt; potrditi ali dodati »na straneh projektov«.
3. Dema Plus: »storitev« v titleu (stran uporablja »področja dela«) ali »področij dela«.
4. O nas: **rešeno** — opis zdaj poimenuje Gregorja Baumgartnerja (vidna vsebina strani ga povezuje z Baumo); alternativa iz razdelka 4 je presežena.
5. Hardshelljacket: stran sama uporablja »enostransko«; vidno besedilo ni spremenjeno.
6. OG/Twitter: besedila in slike sledijo po potrditvi teh besedil; `openGraph`/`twitter` na štirih straneh trenutno podedujeta splošni naslov.

## 3. Razlikovanje (prvi predlog)

- **Študije** imajo različen problem v title (dva vstopa; razlaga pred odločitvijo; reference pred področji; produktna stran + nakupni sistem; dela v ospredju; en izdelek) in različno delo v opisu. Skupen je samo zaključek »Baumin prikaz projekta.«, ki je namenoma ponovljen: strani vsebujejo **rekonstrukcije razdelkov** (podnapisi »Rekonstrukcija …«) in niso uradna stran naročnika.
- **Ulterior** (znamka, namenski nakupni sistem s PayPalom, rezervacija zaloge) in **Hardshelljacket** (ena stran za en izdelek, nakup in B2B drugje, brez oblikovanja) sta razločena po dejanski vsebini.
- Ni poslovnih rezultatov, številk ali zagotovil (npr. brez navedb ArtBite »od leta 2016«, cene jakne, rokov tretmajev).
- Ne uporabljam besed »brief« (Pristop: »tudi brez pripravljenega gradiva«), »najboljši«, »profesionalni«, ključnih besed v nizu.

## 4. Nejasnosti in odločitve (prvi predlog)

1. **O nas: ime (presežno, rešeno v 2a).** Predlog ne omenja imena. Strani ne navajata ekipe ali let; podpisan je Gregor Baumgartner. Možna alternativa opisa (samo če želite izvajalca poimenovati): »Bauma je neodvisen digitalni studio za spletne strani in digitalne rešitve. Besedilo podpisuje Gregor Baumgartner, projekte začnemo pri tem, kar že obstaja.« — potrdite, ali želite ime v opisu.
2. **»Baumin prikaz projekta«** kot enoten zaključek vseh šestih študij (in zamenjava »Primer iz prakse.«). Potrdite formulacijo; alternativa je daljša »Rekonstrukcija razdelkov, ne uradna stran naročnika.«, ki zahteva krajši preostali opis.
3. **Delež dela:** `Hardshelljacket` na strani navaja samo »Struktura in razvoj«; ostale študije »Struktura, oblikovanje in razvoj«. Opisi tega ne razširjajo.
4. **Dema Plus:** »podjetje za inženiring in izvedbo« je povzeto po oznaki »Inženiring • Izvedba«; ime panoge (npr. gradbeništvo) na strani ni, zato ni uporabljeno. Potrdite poimenovanje.
5. **Home:** predlog nadomesti obljubo H1 z opisom dela. Če želite v titleu obdržati H1 kot sporočilo, je to ločena (blagovna) odločitev. Prav tako ni imen strank v opisu domače strani.
6. **Naslovi z dvopičjem** (`Ime: sporočilo — Bauma`) ohranjajo obstoječi vzorec; alternativni vzorec brez dvopičja ni pripravljen.
7. **Znaki in prikaz**: Google pogosto sam prikroji title in snippet; dolžine niso zagotovilo.
8. **Poznejša uskladitev (ne izvedeno):** OG/Twitter naslovi in opisi, slike in strukturirani podatki (npr. `Organization`, `CreativeWork`) sledijo posebej; pri implementaciji je treba `openGraph`/`twitter` na štirih straneh (`/pristop`, `/o-nas`, `/work`, `/work/odstrani-tattoo`) dodati ali podedovati usklajeno.

## 5. Predvidene datoteke za poznejšo implementacijo

Samo vrednosti `title`/`description` v obstoječih `metadata`:

- `app/page.tsx` (`TITLE`, `DESCRIPTION`, vrstici 46–47; OG/Twitter istočasno zaradi istih konstant)
- `app/pristop/page.tsx` (dodati `description`)
- `app/work/page.tsx`
- `app/o-nas/page.tsx` (dodati `description`)
- `app/work/flexido/page.tsx`, `app/work/odstrani-tattoo/page.tsx`, `app/work/dema-plus/page.tsx`, `app/work/ulterior/page.tsx`, `app/work/artbite/page.tsx`, `app/work/hardshelljacket/page.tsx` (`TITLE`, `DESCRIPTION`; OG/Twitter stranske študije kopirajo iste konstante)

Po implementaciji: ponovitev lokalne gradnje in odčitka `<title>`/`<meta description>` desetih strani, preverba, da se robots/canonical/sitemap niso spremenili, ter dolžin. Gostovanje ostane nepreverjeno do objave.
