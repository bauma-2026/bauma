# BAUMA V3 — Flexido: izhodišče in obseg prenove

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Sprememba je lokalna in necommitana. Gostovanje ni spremenjeno ali preverjeno; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen. Odvisnosti, konfiguracija in lock niso spremenjeni.

## Kaj je zamenjano ali dopolnjeno

Datoteka `app/work/flexido/page.tsx`, uvodni del (`aria-labelledby="fx-hero"`), v obstoječi tipografiji:

1. **Lead zamenjan** (prejšnji: »Za Flexido smo zasnovali in razvili spletno stran z dvema vstopoma v ponudbo: po proizvodnih procesih in po izdelkih.«) z uredniško potrjenim besedilom:

   > Prejšnja spletna predstavitev je bila osredotočena na e-katalog. Ob prenovi smo dodali Rešitve — novo vsebinsko pot za obiskovalca, ki izhaja iz proizvodnega procesa ali naloge, ne iz določenega izdelka. E-katalog smo ohranili kot neposreden vstop do konkretnih sistemov.

2. **Obseg ohranjen** (»Struktura, oblikovanje in razvoj spletne strani v slovenščini, angleščini in nemščini«) skupaj z zunanjo povezavo `flexido.eu ↗` (`target="_blank"`, `rel="noopener noreferrer"`, sr-only »odpre se v novem zavihku«) v isti vrstici.
3. **Dodan ločen odstavek** neposredno pod vrstico z obsegom (isti slog `text-sm … text-white/72`, razmik `mt-2`, ni sekcije, kartice, ikone ali oznake):

   > Iz obstoječih fotografij robotskih celic v proizvodnem okolju smo pripravili prenovljene produktne prikaze za spletno stran.

   *(27. 10. 2026: formulacija zamenjana po uredniški potrditvi; prvotna je bila »Prenova je zajela tudi pripravo obstoječega fotografskega gradiva za novo spletno predstavitev.« Umestitev, razred, razmik in preostalo stran niso spremenjeni.)*

**H1 ohranjen:** »Dve poti skozi industrijsko ponudbo.«

**Tehnična podrobnost:** besedi »e-katalog« in »E-katalog« sta v lead odstavku v `<span className="whitespace-nowrap">`, da pri 1440 px vrstica ne prelomi »e-« in »katalog« na dva dela; besedilo je nespremenjeno.

Ni dodano: avtorstva fotografiranja (stavek govori o pripravi prikazov iz obstoječih fotografij), konverzijskih metrik, rezultatov, uporabniških raziskav, avtorstva fotografiranja ali prevajanja, konfiguratorja ali novih funkcionalnosti. Konfigurator ni omenjen nikjer na strani (beseda »konfigurabilna« opisuje izdelek FLEX 25 / 50 v prikazu e-kataloga).

**Ohranjeno:** vse rekonstrukcije in podnapisi, fotografije, izrezi, projektna navigacija (prejšnji Hardshelljacket, naslednji Ulterior), kontaktni zaključek, širina (`max-w-[44ch]`), tipografija in odzivna postavitev.

## Pozornost: delno podvajanje obstoječih pojasnil

Pojasnili pred prikazoma sem pustil nespremenjeni, a se vsebinsko delno prekrivata z novim leadom:

- Pred prikazom Rešitev: »Obiskovalec lahko začne pri delu proizvodnje, ki ga želi urediti. Področja ga usmerijo do ustreznih rešitev.«
- Pred prikazom e-kataloga: »Kdor že išče določen sistem, lahko začne v e-katalogu in od tam odpre podrobnosti izdelka.«

Lead zdaj pove isto na ravni študije; ta dva stavka še vedno delujeta kot podnapisa posameznih prikazov. Uredniška odločitev, ali ju skrajšati.

Tudi predlog metapodatkov za `/work/flexido` (title »… z dvema vstopoma v ponudbo …«, opis »po proizvodnih procesih in po izdelkih«) še ni usklajen z novim leadom (»iz proizvodnega procesa ali naloge, ne iz določenega izdelka«). Uskladitev sledi po zaključku vidne vsebine; metapodatki niso spremenjeni.

## Spremenjene datoteke

- `app/work/flexido/page.tsx` (diff samo tega posega: [page.diff](./bauma-v3-flexido-credibility-evidence/page.diff)); metapodatki v isti datoteki niso dotaknjeni.
- Dokumentacija: ta zapis, [dokazi](./bauma-v3-flexido-credibility-evidence/), register.

## Preverjanje

[verify-flexido.cjs](./bauma-v3-flexido-credibility-evidence/verify-flexido.cjs), rezultat [verify-flexido.json](./bauma-v3-flexido-credibility-evidence/verify-flexido.json), posnetki uvoda in cele strani pri obeh širinah v isti mapi (uvod pregledan vizualno).

| Preverjanje | 375 × 812 | 1440 × 900 |
|---|---|---|
| Besedilo vidno in berljivo | da (lead 16 px, obseg in odstavek 14 px, 327 px širine) | da (lead 18 px, 500 px; obseg in odstavek 15 px) |
| Horizontalni preliv, prekrivanje | ne | ne |
| Zunanja povezava | v vidnem polju, `href`, `target`, `rel` kot prej | enako |
| Obseg in povezava pregledna | obseg (2 vrstici), povezava na svoji vrstici, nov odstavek (3 vrstice) | obseg + povezava v isti vrstici, odstavek pod njima |
| Prikazi (2 `role=img`), 4 sekcije | enako kot v kodi | enako |
| Projektna navigacija | prejšnji → `/work/hardshelljacket`, naslednji → `/work/ulterior` | enako |
| Kontakt | `mailto:info@bauma.si` (CTA, noga); mailto ni aktiviran | enako |
| Console in `pageerror` od začetka nalaganja | 0 | 0 |
| Višina strani | 4925 px | 4524 px (naravna rast zaradi besedila) |

ESLint na `app/work/flexido/page.tsx`: izhod 0, brez opozoril. `git diff --check`: izhod 0. `git status` je enak začetnemu stanju posega (datoteka je že bila spremenjena). Diff posega vsebuje samo uvodni del, brez metapodatkov.

## Omejitve

- Preverjeno na dev strežniku v Chromiumu; Safari, VoiceOver in dejanska naprava niso preverjeni; produkcijska gradnja ni bila zagnana (spremenjeno je samo besedilo).
- Dejstva (prejšnja predstavitev, dodane Rešitve, obseg, priprava produktnih prikazov iz obstoječih fotografij) so uredniško potrjena, v repozitoriju niso preverljiva. Avtorstvo fotografiranja in prevodov ostaja nedoločeno in na strani ni navedeno.
- Proof & Credibility pass **ni zaključen**: ostale študije ter pregled Home, Pristopa in kontakta še sledijo.

## Dopolnitev 27. 10. 2026 — nova formulacija odstavka o fotografijah

Zamenjan je samo stavek v ločenem odstavku pod obsegom (`app/work/flexido/page.tsx`, vrstici 145–146). Preverjeno ponovno z istim skriptom pri 375 × 812 in 1440 × 900: besedilo vidno (375: 3 vrstice, 72 px, 14 px; 1440: ena vrstica, 15 px), brez horizontalnega preliva in prekrivanja, zunanja povezava, projektna navigacija in kontakt nespremenjeni (mailto ni aktiviran), 0 napak `console`/`pageerror`; višina strani 375: 4925 px, 1440: 4524 px (enaka kot prej). ESLint na datoteki izhod 0, `git diff --check` izhod 0, `git status` enak pred in po. Posnetki v dokazni mapi so osveženi, [page.diff](./bauma-v3-flexido-credibility-evidence/page.diff) kaže celoten diff od začetka prvega Flexido posega. Metapodatki, slike in druge strani niso spremenjeni; gostovanje ni spremenjeno ali preverjeno.

## Dopolnitev 27. 10. 2026 — vsebinski zaključek študije

**Dodan stavek** (uredniško potrjen), po zadnjem prikazu e-kataloga in njegovem podnapisu, pred `CaseStudyNav`:

> Tako lahko obiskovalec išče rešitev glede na svojo proizvodno nalogo ali neposredno med sistemi v e-katalogu.

**Umestitev** (`app/work/flexido/page.tsx`, takoj po zaključku zadnje `<section>` in znotraj grafitne površine `SURFACE_WORK`, pred `CaseStudyNav`): `<p className={LEAD}>` v `mini-page-rail` ovoju, torej obstoječi slog razlagalnih odstavkov (isti kot pojasnili pred prikazoma Rešitev in e-kataloga; 20 px / 24 px, teža 500, `max-w-[40ch]`). Brez naslova, sekcije, okvirja ali vizualnega elementa. »e-katalogu« je v `whitespace-nowrap`, da pri 1440 px vrstica ne prelomi »e-« in »katalogu«. Razmik: da je ritem med podnapisom in novim odstavkom enak kot pred drugima dvema pojasniloma (60 / 72 / 88 px), je spodnji padding ovoja zadnjega podnapisa spremenjen iz `pb-16 sm:pb-20 lg:pb-24` v `pb-15 sm:pb-18 lg:pb-22` (to je edina sprememba obstoječega razreda); spodnji padding novega odstavka je prejšnji `pb-16 sm:pb-20 lg:pb-24` (razmik do navigacije ohranjen). Diff: [page-closing-sentence.diff](./bauma-v3-flexido-credibility-evidence/page-closing-sentence.diff).

**Preverjanje** (`verify-flexido.cjs`, `verify-flexido-proofs.cjs`, rezultati `verify-flexido*.json`, posnetki v dokazni mapi, osveženi `*-intro.png`, `*-full.png`, `*-ending.png` in posnetki posameznih rekonstrukcij pri 375 px):

| | 375 × 812 | 1440 × 900 |
|---|---|---|
| Novi odstavek | 327 px, 20 px / 28 px, 3 + 1 vrstice (112 px), razmik od podnapisa 60 px, do navigacije 149 px | 619 px, 24 px, 3 vrstice (101 px), razmik 88 / 197 px |
| Preliv, prekrivanje | ne | ne |
| Višina strani | 5097 px (prej 4925, +172) | 4712 px (prej 4524, +188) |
| Projektna navigacija | prejšnji `/work/hardshelljacket`, naslednji `/work/ulterior` | enako |
| Kontakt, zunanja povezava | `mailto:info@bauma.si` (CTA, noga) ohranjen, ne aktiviran; `flexido.eu` `_blank` | enako |
| Console, `pageerror` | 0 | 0 |

ESLint na `app/work/flexido/page.tsx`: izhod 0. `git diff --check`: izhod 0. `git status` enak pred in po posegu (datoteka je že bila spremenjena).

**Vizualni pregled treh rekonstrukcij pri 375 px** (ne samo preliv; vsak prikaz posnet in pregledan; oblikovanja nisem spreminjal):

1. *Uvodni razdelek domače strani* (335 × 605): eyebrow, naslov v 4 vrsticah, odstavek, gumb »Poglejmo vaš proces →« in sekundarna vrstica so berljivi in znotraj okvirja; kontrast na fotografiji zadosten. Opomba: avtomatski zaznavek »odrezano« za naslov je lažno pozitiven (naslov je viden v celoti). Spodnja vrstica (»Od pregleda procesa do zagona …«) je v razvojnem načinu delno pod Next.js razvojnim gumbom »N«; to ni del strani.
2. *Področja* (335 × 1116): naslov »Kje se vaš proces ustavlja?«, uvodni stavek in sedem postavk so berljivi, brez odrezanega besedila; postavke imajo opise v 1–3 vrsticah. **Težava (obstoječa):** pri postavki 04 »Paletizacija in interna logistika« puščica prelomi v lastno vrstico pod naslovom, drugje stoji ob naslovu. Kozmetično, ne vpliva na berljivost.
3. *Vrste sistemov* (335 × 1063): naslov, dve kartici z velikima fotografijama, opisi in »Poglej sistem →« so berljivi. **Po zasnovi** se pod 1024 px prikažeta samo prvi dve kartici (FLEX 25 / 50 je skrita, komentar v `FlexidoCatalogProof.tsx`); pri 1440 px so vidne tri. Lenobno naložena slika skrite tretje kartice se ne naloži (ne gre za napako).

Najmanjša pisava v prikazih je 11 px (eyebrowi z velikimi črkami in oznake kartic), ostalo ≥ 13 px; brez besedila zunaj okvirja. Posnetki posameznih okvirjev vsebujejo lepljivo glavo strani kot artefakt zajema elementa (ni del strani).

## Status

Vsebinska dopolnitev Flexida (lead, obseg, odstavek o produktnih prikazih, zaključni stavek) je **zaključena v lokalno preverjenem obsegu**. Odprto: SL metapodatki Flexida (uskladitev po zaključku vidne vsebine), preverjanje gostovanja, celoten Proof & Credibility pass (ostale študije, Home, Pristop, kontakt).

