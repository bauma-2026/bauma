# BAUMA V3 — Dema Plus: vsebinska dopolnitev in prikaz reference

Datum: **27. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Spremembe so lokalne in necommitane. Gostovanje ni spremenjeno ali preverjeno; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen. Konfiguracija, odvisnosti, lock in metapodatki niso spremenjeni. Dokazi: [bauma-v3-dema-credibility-evidence](./bauma-v3-dema-credibility-evidence/).

## Kaj je zamenjano ali dodano (`app/work/dema-plus/page.tsx`)

1. **Lead zamenjan** (prej: »Za Dema Plus smo zasnovali in razvili spletno stran, na kateri imajo prednost projekti in reference.«) z uredniško potrjenim besedilom:
   > Pri prenovi spletne predstavitve Dema Plus smo v ospredje postavili izvedene projekte. Ti pokažejo obseg in raznolikost dela podjetja ter predstavljajo izhodišče za pregled njegovih storitev in načina izvedbe.

   H1 »Projekti v ospredju.«, obseg »Struktura, oblikovanje in razvoj spletne strani« in povezava `demaplus.si ↗` so ohranjeni. Obstoječa razlaga pred prikazom referenc (»Za uvodnim razdelkom sledijo izbrani projekti …«) je ohranjena.
2. **Dodan razlagalni odstavek** po prikazu izbora referenc in njegovem podnapisu, v slogu in širini obstoječih razlagalnih odstavkov (`LEAD`):
   > Prenova je zajela tudi posamezne reference. Obstoječa projektna besedila smo uredili v kratke povzetke, pregledne opise in ločene osnovne podatke. Predstavitve smo povezali z navigacijo med projekti ter izborom sorodnih referenc.
3. **Nov prikaz** pod odstavkom: rekonstrukcija projektne podstrani **Vila Rožna dolina**, v istem ovoju (`msw-proof` / `msw-clip`, širina in rob) kot prva dva prikaza. Podnapis: »Rekonstrukcija projektne podstrani Vila Rožna dolina na demaplus.si. Statičen prikaz: navigacijske oznake, povezave in kartice sorodnih referenc v tem prikazu niso interaktivne.«
4. **Ritem:** spodnji padding ovoja podnapisa prejšnjega prikaza je zaradi enakega ritma kot pred drugimi pojasnili (60 / 72 / 88 px) spremenjen iz `pb-16 sm:pb-20 lg:pb-24` v `pb-15 sm:pb-18 lg:pb-22`; nov podnapis ima prejšnji padding do navigacije.

## Sestava rekonstrukcije (`app/components/blocks/mini/DemaPlusProjectProof.tsx`, nova)

Odzivni HTML/CSS (container queries `@min-[640px]` / `@min-[1024px]`, kot `DemaPlusReferencesProof`), živo besedilo, brez iframe, odvisnosti, novih CSS datotek in kopiranja Dema aplikacije. Vsebina, kot je objavljena:

- vrstica »← Nazaj« in (od 1024) bledi oznaki »Prejšnji projekt • Naslednji projekt«;
- vizualizacija objekta (4:3, `object-cover`), naslov »Vila Rožna dolina«, podnaslov »Novogradnja večstanovanjskega objekta«, povzetek;
- »O projektu« (štirje odstavki, prvi večji) in ločeni osnovni podatki: Kategorije (Javni objekti, Stanovanjski objekti), Naročnik (ASSETCO d.o.o.), Lokacija izvedbe (Večna pot 81, Ljubljana);
- spodnja navigacija (»Prejšnji«, »Naslednji → Hotel Nox Ljubljana«) in »Sorodne reference« s tremi kartami (Center Obala Debeli rtič, Center Četrtne skupnosti Golovec, Hiša Sonček) in »Vse reference«.

Razporeditev: od 1024 slika levo, besedilo desno, tri stolpci sorodnih referenc; pod 1024 se zloži (slika, naslov, opis, podatki, vrstice sorodnih z mini sliko). Tipografija, bela podlaga, razmerja, tanke ločilnice in oblike kartic so prepisani iz izvorne kode Dema (tokeni kot literali, sistemski nabor pisav). Sorodnih je prikazanih prvih 3 od 4 (da vrstica ostane polna); glava, noga in obvestilo o piškotkih niso reproducirani. Vse kontrole so navaden tekst: brez `a`, `button`, `tabindex` (preverjeno: 0 interaktivnih elementov v okvirju). Naslovi: H2 projekta, H3 »O projektu« in »Sorodne reference«, H4 kartice; brez dodatnega H1.

## Viri

| Kaj | Vir |
|---|---|
| Besedilo, podatki | živa stran https://demaplus.si/reference/novogradnja-objekta-vila-rozna-dolina-condominium (prebrana 27. 10. 2026) in lokalni `demaplus-next` (samo branje): `src/content/projects.generated.ts`, `projects.meta.ts`, `src/app/reference/[slug]/page.tsx`, `ProjectBody.tsx`, `ProjectMeta.tsx`, `RelatedProjectsEditorial.tsx`. URL je iz projektnih podatkov (`slug` v `projects.meta.ts` in `FeaturedProjects.tsx`), ne ugibanje. |
| Slika objekta | `public/work/dema-plus/proof/vila-rozna-dolina.webp` (obstoječe sredstvo, ni prepisano), byte-identično `demaplus-next/public/reference/<slug>/hero.webp` (1200 × 800). To je vizualizacija objekta; ni označena kot fotografija izvedenega objekta, avtorstvo ni pripisano Bauma. |
| Slike sorodnih | nove kopije `hero.webp` iz `demaplus-next` v `public/work/dema-plus/proof/related-*.webp` (3 datoteke, [checksums](./bauma-v3-dema-credibility-evidence/asset-checksums.txt)). Obstoječa skupna sredstva niso prepisana; nobena slika ni spremenjena ali ustvarjena. |
| Oblika | živa stran (računane vrednosti: velikosti pisave, barve, razmerja) in izvorna koda Dema. |

**Omejitev vira:** omenjeni »priloženi posnetek nove strani« mi v tej seji ni bil na voljo; namesto njega sem uporabil živo stran in lokalni izvorni projekt. Rekonstrukcija odraža živo stran na dan branja.

Brez primerjave s staro stranjo, brez novih trditev o gradbenem projektu, brez letnic ali rezultatov, ki jih vir nima (Dema vira za to referenco ne navaja leta izvedbe in zato tega polja ni).

## Preverjanje

Skript [verify-dema.cjs](./bauma-v3-dema-credibility-evidence/verify-dema.cjs), rezultati [verify-dema.json](./bauma-v3-dema-credibility-evidence/verify-dema.json); posnetki: cela stran (`dema-*-full.png`), uvod, celoten prikaz (`dema-<w>-vila-proof.png`) ter trije izseki (`-top`, `-facts`, `-related`) pri 375 × 812 in 1440 × 900 (in 320 px), z skrito lepljivo glavo Bauma pri zajemu (preprečen prekrivajoči se zajem). Vsi posnetki so bili vizualno pregledani.

| | 320 | 375 × 812 | 1440 × 900 |
|---|---|---|---|
| Horizontalni preliv strani | ne | ne | ne |
| Novo besedilo vidno (lead 20 / 20 / 24 px) | da | da | da |
| Rekonstrukcija (širina × višina) | 280 × 3336 | 335 × 3209 | 1216 × 1957 |
| Odrezano besedilo, besedilo zunaj okvirja | 0 / 0 | 0 / 0 | 0 / 0 |
| Slike (4 vidne) | 4:3, `object-cover`, napolnijo okvir, naložene | enako | enako |
| Interaktivni elementi v prikazu | 0 | 0 | 0 |
| Najmanjša pisava | 11 px (oznake z velikimi črkami) | 11 px | 11 px |
| Console, `pageerror` (od začetka nalaganja) | 0 | 0 | 0 |
| Text-spacing stres (vrstica 1,5, črke 0,12 em, besede 0,16 em, odstavek 2 em) | višina okvirja 3336 → 3886, brez rezanja in preliva | 3209 → 3696, brez rezanja | 1957 → 2139, brez rezanja |
| Bauma navigacija | prejšnji `/work/odstrani-tattoo`, naslednji `/work/artbite` | enako | enako |
| Kontakt, zunanja povezava | `mailto:info@bauma.si` ohranjen (ni aktiviran); `demaplus.si` `_blank` | enako | enako |

Okvir nima fiksnih višin; raste z vsebino (potrjeno s text-spacing testom). `npx tsc --noEmit` izhod 0; ESLint na `page.tsx` in novi komponenti izhod 0; `git diff --check` izhod 0 (nova datoteka tudi brez presledkovnih napak). `git status` se razlikuje samo za štiri nove datoteke (komponenta in tri slike).

**Konkretne opombe pri pregledu mobilnega prikaza:**
- Pri 320 px se v vrstici oznake sorodne reference (»Stanovanjski objekt • Ljubljana – Golovec«) ločilna pika lahko znajde na koncu prve vrstice. Enako obnašanje ima izvor (flex-wrap); ni popravljeno.
- Prvi odstavek »O projektu« je pri 375 px v 18 px (kot izvor); spodnji presledek pred zadnjim odstavkom (`mt-12`) je prepisan iz izvora in je opazen, a namenski.
- Razvojni gumb »N« Next.js zakriva del posnetkov v razvojnem načinu; ni del strani.

## Opozorila

- **Delno podvajanje:** nov lead (»… v ospredje postavili izvedene projekte …«) in ohranjena razlaga pred prikazom referenc (»Za uvodnim razdelkom sledijo izbrani projekti, šele nato področja dela …«) se vsebinsko delno prekrivata. Obstoječega besedila nisem spreminjal.
- **Metapodatki:** title in opis `/work/dema-plus` (predlog: »Dema Plus: spletna predstavitev projektov in storitev — Bauma«) še niso implementirani; SL predlog sledi po zaključku vidne vsebine. Lead omenja »storitev«, prikazi pa jih ne kažejo; predlog uporablja isti izraz.
- **Zunanji vir:** besedilo in število podatkov temelji na živi strani Dema na dan branja; če se spremeni, je treba rekonstrukcijo posodobiti.

## Spremenjene datoteke

`app/work/dema-plus/page.tsx` ([page.diff](./bauma-v3-dema-credibility-evidence/page.diff)); nove: `app/components/blocks/mini/DemaPlusProjectProof.tsx` ([diff nove datoteke](./bauma-v3-dema-credibility-evidence/DemaPlusProjectProof.new-file.diff)), `public/work/dema-plus/proof/related-debeli-rtic.webp`, `related-golovec.webp`, `related-hisa-soncek.webp`. Metapodatki v `page.tsx` niso dotaknjeni.

## Status

Dema Plus: vsebinska dopolnitev in prikaz reference sta narejena in lokalno preverjena. Proof & Credibility pass **ni zaključen**: ostale študije (Odstrani Tattoo, Ulterior, ArtBite, Hardshelljacket), pregled Home, Pristopa in kontakta, SL metapodatki in preverjanje gostovanja so odprti.
