# BAUMA V3 — A11Y-008: kontrast nad fotografijami

25. 10. 2026 · ciljni read-only pregled lokalnega stanja · WCAG 2.2 AA kot referenca.

## 1. Rezultat

**Baumino besedilo v vseh pregledanih fotografskih vzorcih dosega ustrezni prag.** To velja tudi za naslov pri 320 × 568, prosojno navigacijo, napis ghost CTA in e-pošto v fotografskem delu noge.

**Potrjeno je eno ozko odstopanje PHC-001:** deli modrega fokusnega obroča »Pošljite opis« na obeh različicah **natural-midnight** pri **1280 × 900 in 1440 × 900** nimajo 3 : 1 proti lokalni fotografski podlagi. Najnižja zanesljivo izmerjena vrednost je **2,78 : 1**. Napis gumba je dovolj kontrasten, gumb je dosegljiv s tipkovnico, del obroča pa ostaja dovolj kontrasten. Ne gre za trditev, da je celoten fokus neviden.

**Dodatnega temnenja fotografij ne priporočam.** Najmanjši predlog je lokalno svetlejši fokusni obroč tega CTA na natural-midnight zaključkih, ob nespremenjenih fotografijah, postavitvi in ostalih fokusnih vzorcih.

## 2. Osnova in okolje

- Prebrano `docs/audits/bauma-v3-accessibility-audit.md`, posebej odprti A11Y-008.
- Dejanski repozitorij `/Users/bauma/Applications/projects/bauma-portfolio`; veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**.
- Pred začetkom **22 spremenjenih tracked datotek**, številne obstoječe untracked datoteke in labi. Nič ni zavrženo, prestavljeno ali dodano v Git staging. Aktualno lokalno stanje vsebuje tudi popravke po prejšnjih auditih.
- V projektu in preverjeni verigi nadrejenih map ni `AGENTS.md`/`CLAUDE.md`; prebrana `.claude/launch.json` določa lokalni strežnik na 3000.
- Že delujoči **`http://localhost:3000`**. **Staging ni preverjen.** Rekonstrukcije naročnikov in EN/IT so izključeni.
- Lokalni macOS, **Playwright 1.62.1**, **Chromium 151.0.7922.34**, headless; osnovna meritev na **DPR 2**, vse navedene dimenzije so **CSS px**. Pragi se določajo po CSS velikosti pisave, ne po dvakrat večji velikosti črk na rasterju.
- Hero: **320×568, 375×812, 390×844, 768×900, 1440×900**. Zaključki: **375×812, 768×900, 1280×900, 1440×900**. Dodatni širini zajameta spremembo cropa pri 768 in fotografskega toniranja pri 1280.
- Mirovanje, hover in dejanski **focus-visible s Tab** pri funkcionalnih elementih. Hover je merjen s finim kazalcem tudi pri ozkem viewportu; to ni trditev o hoverju na telefonu. Meni ni odprt, ker je njegov odprti pogled neprosojen in ne sodi v ta foto obseg. Mailto ni aktiviran.
- **115 stabilnih zajemnih stanj**, 585 rezultatnih vrstic z vmesnimi ponovitvami istega besedila ob drugih fokusih. To niso neodvisni uporabniški testi ali statistični vzorci obiskovalcev.

## 3. Katere strani dejansko delijo zaključek

Primerjani so bili izračunani slogi, pisave, barve, vsebina, relativna geometrija, obe fotografski pseudo plasti, filter, velikost in položaj ozadja na vseh desetih straneh pri štirih širinah. Po izločitvi neizrisanega praznega odstavka z ničelno velikostjo so **tri različice**.

| Različica | Poti | Predstavnik za maske | Dejanska razlika |
|---|---|---|---|
| **Warm** | `/` | `/` | Graphite + fotografija, brez `natural-midnight`, brez `roomy`; home lestvica naslova. |
| **NM roomy** | `/work` ter `/work/flexido`, `/work/ulterior`, `/work/odstrani-tattoo`, `/work/dema-plus`, `/work/artbite`, `/work/hardshelljacket` | `/work` | `tone="natural-midnight"`, `spacing="roomy"`, enako besedilo in geometrija vseh sedmih zaključkov. |
| **NM short** | `/pristop`, `/o-nas` | `/pristop` | `natural-midnight` brez `roomy`; »Imate projekt? Pišite nam.«; brez izrisane Kontakt oznake; naslov 24 px mobilno in 44 px od 640. |

Izvor: klici `MiniClosingBookend` v posameznih `page.tsx`, skupni `MiniClosingBookend.tsx`, `MiniFinalCTA.tsx`, `MiniFooter.tsx`, `MiniContactPhoto.css`, `MiniContactNaturalMidnight.css` in lokalna CSS zaključka Pristop/O nas.

Dokaz: [variant-equivalence.json](./bauma-v3-photo-contrast-evidence/variant-equivalence.json). Maske niso bile po nepotrebnem ponovljene na vseh sedmih enakih NM roomy straneh. Številke spodaj so meritve predstavnikov; enakovrednost različic je preverjena ločeno. Drobne razlike rasterizacije med različnimi dokumentnimi odmiki niso predstavljene kot identičnost vsakega fizičnega piksla na vseh poteh.

### Dejanske fotografske plasti

- **Hero:** `road-evening-01.jpg` prek optimizatorja 2048/3840, pseudo `::before` s filtrom SVG `bauma-hero-bluehour` v sRGB. Višina fotografije je 175 % pod 359 px, sicer 135 % mobilno, 168 % od 768 in 154 % od 1280; ustrezni položaji 36/40/34/38 % vodoravno in 100 % navpično. `::after` sestavi zgornji navy preliv (0,92 → 0,74 → 0) in enakomerno navy plast 0,24. Mobilna glava ima še lastni zgornji črni scrim. Meritev vsebuje vse te plasti, ne samo izvirne fotografije.
- **Warm zaključek:** `atmosphere-dune-01.webp`, `cover`; položaj 72 % 50 % mobilno, 50 % 70 % od 768. Preliv z ink RGB(5,8,15): začetna alpha 0,62 / 0,56 / 0,50 po prelomih, spodnja 0,80 oziroma 0,76 pri širokem pogledu.
- **Natural midnight:** ista fotografija in crop, filter `saturate(.6) brightness(.88) contrast(1.18)`. Dve navy plasti RGB(4,10,28): večstopenjski zgornji preliv in enakomerni korak .24, ki se proti nogi zgosti na .62. Pod 1280 se zgornji preliv razteza do 420 px; od 1280 do 250 px. To je pomemben razlog, da rezultat fokusa ni enak pri 768 in 1280.
- Izvorni CSS in izračunane dejanske vrednosti so ohranjeni v [capture-metadata.json](./bauma-v3-photo-contrast-evidence/capture-metadata.json). V zajetih fotografskih plasteh ni bilo aktivnih animacij; ponovljeni zajem podlage v merjenih jedrih ni pokazal časovne spremembe. Ni bila izbrana ena ugodna faza premikajoče se fotografije.

## 4. Merilna metoda in preverjanje zanesljivosti

1. Po navigaciji počakam `document.fonts.ready`, nalaganje/dekodiranje istih fotografskih URL-jev kot jih uporablja CSS in najmanj 700 ms za končno stanje prehodov. Fokus dosežem z dejansko tipko Tab. Pri glavi mora pogled ostati na `scrollY=0`, pri zaključku na dnu dokumenta. Zajem po kroženju Tab v neprosojno glavo ni uporabljen kot meritev prosojne glave.
2. Za vsako besedilno vozlišče zapišem vidne `Range` pravokotnike, dejansko pisavo, težo, CSS barvo in alpha. Skrite odzivne veje ne prispevajo maske. Ne uporabljam velikosti ovoja H1 namesto notranjih črk.
3. V povsem isti geometriji zajamem izvirnik ter tri barvne variante **samo polnila črk**: transparentno, črno in belo. Uporabim `-webkit-text-fill-color`, brez spremembe pisave, razmikov, višine, vsebine, položaja slike ali gradientov. Potem ponovno zajamem transparentno podlago za časovno kontrolo. Spremembe so samo v brskalniku.
4. Maska dejanskih potez nastane iz razlike belega in črnega zajema. Uporabljena so samo jedra, kjer je razlika v **vseh RGB kanalih vsaj 253/255**. Antialiasing robovi in praznine med črkami niso mesta meritve. Poleg tega masko omejim na dejanske besedilne `Range` pravokotnike, ne na celoten pravokotnik H1 ali fotografije.
5. Barve črk **ne odčitavam iz antialiasiranega piksla**. Vzamem CSS barvo in jo za vsak sprejeti položaj sestavim z lokalnim RGB pod črko: `F = alpha · CSS_RGB + (1−alpha) · lokalna_podlaga`. Iz tega s standardno sRGB relativno luminanco izračunam razmerje. Izvorni zajem mora potrditi model v toleranci največ 3 enot na 8-bitni kanal; ponovljena podlaga mora ostati znotraj 1 enote.
6. Za robove in fokus uporabim ločeno transparentno/črno/belo **masko istega roba ali outline**, z ohranjenimi debelino, radijem in offsetom. Foreground spet izhaja iz CSS barve, ne iz obrobnega antialiasinga. Pri ghost robu dodatno ločim lokalno notranjo podlago od fotografije ob kontrolniku. Za potrjeno odstopanje fokusa je preverjen tudi dejanski sosednji piksel zunaj obroča.
7. V sprejetih **4.583.937 ponovljenih vzorcih jeder črk** so se model in raster ujemali; v teh jedrih ni bilo odstopanja ponovljene podlage. Veliko število vključuje iste črke v več stanjih in ni dokaz vseh možnih naprav. Na reprezentativnih štirih pogledih je dodatno zapisana popolna enakost geometrije, pomika in plasti pred/po transparentnem polnilu: [geometry-check.json](./bauma-v3-photo-contrast-evidence/geometry-check.json).

Položaji v podatkih so viewport CSS koordinate in fizični PNG piksli pri DPR 2; [proof-index.json](./bauma-v3-photo-contrast-evidence/proof-index.json) določa izvorne izreze. V `raw/` so neoznačeni izvirnik, podlaga in uporabljena maska. Oznake na dokaznih montažah so dodane zunaj merjenja.

**Zanesljivost:** razmerja so deterministični izračuni na lokalnem Chromiumovem 8-bitnem rasterju in CSS barvah, ne meritev fizičnega zaslona. V besedilu so zaokrožena; presoja uporablja nezaokrožene rezultate. V tem merjenem obsegu ni ostal vzorec brez uporabnih jeder ali z nezanesljivim barvnim modelom. To ne prenaša potrditve na Safari ali druge neizmerjene crope.

## 5. Kompaktna tabela rezultatov

»Vseh 5« pomeni vseh pet zahtevanih hero viewportov. »Vseh 4« pomeni 375×812, 768×900, 1280×900 in 1440×900 za zaključke. Vrednost je najslabša zanesljiva meritev v navedenem naboru stanj; vsaka posamezna vrstica/stanje je v [measurements.csv](./bauma-v3-photo-contrast-evidence/measurements.csv) in [measurements.json](./bauma-v3-photo-contrast-evidence/measurements.json).

| Pot / različica | Element | Viewport in stanje | Najslabše razmerje | Zahtevani prag | Rezultat |
|---|---|---|---:|---:|---|
| `/`, hero | H1, dejansko 38/44/68/72 px, 400 | Vseh 5, stabilno; min 320×568 | **4,35 : 1** | **3 : 1**, veliko besedilo | Potrjeno zadosten. |
| `/`, hero | Uvod, 16/18 px, 400; bela .86/.75 | Vseh 5; min 1440×900 | **9,52 : 1** | 4,5 : 1 | Potrjeno zadosten. |
| `/`, hero | Napis »Kaj delamo ↓«, 14 px, 500 | Vseh 5, mir/hover/focus; min 1440 hover | **14,17 : 1** | 4,5 : 1 | Potrjeno zadosten. |
| `/`, hero | Ghost okvir | Vseh 5, mir/hover/focus; min 375 v mirovanju | **2,61 : 1** | Ni brezpogojnega praga za neobvezno mejo | Sam po sebi ni prijavljena kršitev; glej spodaj. |
| `/`, hero | Ghost fokusni obroč | Vseh 5, dejanski Tab; min 390×844 | **5,49 : 1** | 3 : 1 | Potrjeno zadosten. |
| `/`, prosojna glava | Pristop / Work / O nas, 12 px, 500 | 768/1440, mir/hover/focus; min Pristop, 1440 mir | **5,67 : 1** | 4,5 : 1 | Potrjeno zadosten. |
| `/`, prosojna glava | EN, bela .48, 12 px, 500 | 768/1440, mir/hover/focus; min 1440 mir | **4,70 : 1** | 4,5 : 1 | Potrjeno zadosten; ni sklepanje iz opacity. |
| `/`, prosojna glava | Kontakt, 12 px, 500 | 768/1440, mir/hover/focus | **14,21 : 1** | 4,5 : 1 | Potrjeno zadosten. |
| `/`, ozka glava | Tri črte hamburgerja | 320/375/390; focus, enaka barva črt v mirovanju | **16,28 : 1** | 3 : 1 | Potrjeno zadosten. |
| `/`, prosojna glava | Fokus kontrolnikov, vključno z logotipom | Vseh 5, kjer so prikazani | **5,13 : 1** | 3 : 1 | Potrjeno zadosten. |
| Warm | Kontakt oznaka / kontaktni naslov | Vseh 4, stabilno | **6,70 / 6,54 : 1** | 4,5 / 3 : 1 | Potrjeno zadosten. |
| NM roomy | Kontakt oznaka / kontaktni naslov | Vseh 4, stabilno | **6,03 / 7,82 : 1** | 4,5 / 3 : 1 | Potrjeno zadosten. |
| NM short | Kontaktni naslov | Vseh 4, stabilno; oznaka ni izrisana | **9,20 : 1** | 3 : 1 | Potrjeno zadosten. |
| Vsi trije zaključki | »Pošljite opis«, 14 px, 500 | Vseh 4, mir/hover/focus | **4,85 : 1** | 4,5 : 1 | Potrjeno zadosten. |
| Vsi trije zaključki | `info@bauma.si`, 14 px, 500, osnovno bela .65 | Vseh 4, mir/hover/focus; min NM roomy, 375 mir | **7,01 : 1** | 4,5 : 1 | Potrjeno zadosten. |
| Vsi trije zaključki | Fokus e-poštne povezave | Vseh 4, dejanski Tab | **5,11 : 1** | 3 : 1 | Potrjeno zadosten. |
| Vsi trije zaključki | Fokus povezave z logotipom v nogi | Vseh 4, dejanski Tab | **3,78 : 1** | 3 : 1 | Potrjeno zadosten. |
| Warm | Fokus »Pošljite opis« | Vseh 4; min 1440 | **3,57 : 1** | 3 : 1 | Potrjeno zadosten. |
| NM roomy | Fokus »Pošljite opis« | 375 / 768 / 1280 / 1440 | **4,31 / 4,03 / 2,78 / 2,78 : 1** | 3 : 1 | Pri 1280/1440 potrjeno prenizek lokalni kontrast. |
| NM short | Fokus »Pošljite opis« | 375 / 768 / 1280 / 1440 | **3,64 / 4,20 / 2,82 / 2,81 : 1** | 3 : 1 | Pri 1280/1440 potrjeno prenizek lokalni kontrast. |

Praga 4,5 za običajno in 3 za veliko besedilo izhajata iz [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

**Logotipa** samega ne presojam kot običajnega besedila; fokus povezave z logotipom pa je funkcionalno stanje in je zato izmerjen. Maskirana puščica primarnega CTA uporablja `currentColor` brez dodatne prosojnosti na istem enobarvnem gumbu; njen barvni par je isti kot dovolj kontrastni napis. Ločnice med odseki niso funkcionalni kontrolniki.

### Hero po posameznih zahtevanih dimenzijah

Najslabše vrednosti iz stabilnih stanj; uvod in napis ghost CTA imata prag 4,5, H1 prag 3.

| Viewport | H1 | Uvod | Napis ghost CTA |
|---|---:|---:|---:|
| 320×568 | 4,35 | 11,35 | 15,61 |
| 375×812 | 15,02 | 11,69 | 15,24 |
| 390×844 | 15,30 | 12,24 | 15,07 |
| 768×900 | 13,39 | 11,88 | 15,37 |
| 1440×900 | 8,06 | 9,52 | 14,17 |

Primeri prosojnega besedila: EN pri 1440 ima pod jedrom dejanske črke podlago **RGB(30,35,48)**; bela .48 se tam sestavi v **RGB(138; 140,6; 147,36)** → 4,700 : 1. E-pošta NM roomy pri 375: podlaga **RGB(54,37,33)**, bela .65 → **RGB(184,65;178,70;177,30)** → 7,008 : 1.

Dokazi: [H1 320](./bauma-v3-photo-contrast-evidence/05-hero-title-annotated.png), [EN v glavi](./bauma-v3-photo-contrast-evidence/06-header-lang-annotated.png), [e-pošta na fotografiji](./bauma-v3-photo-contrast-evidence/07-footer-email-annotated.png).

### Zakaj subtilen ghost rob ni prijavljena napaka

Napis »Kaj delamo ↓« sam jasno identificira povezavo in dejanje; ni prazno polje, ki bi ga bilo mogoče prepoznati samo po meji. Napis in fokusni indikator sta dovolj kontrastna. Zato vrednosti okvirja 2,61 : 1 ne razglašam za kršitev samo zato, ker je pod 3. Enaka razmejitev velja za dodatni inset okvir Kontakt gumba v hero glavi: napis in namenski fokus sta preverjena, okvir ni edini znak prisotnosti kontrolnika.

WCAG 1.4.11 ne zahteva vidne meje zadetnega območja, kadar prisotnost kontrolnika identificira dovolj kontrastna vsebina; namenski fokus pa mora biti ustrezno kontrasten. To je razlog za drugačno presojo spodnjega fokusnega obroča, ne izjema za vsak subtilen element. [W3C, SC 1.4.11 — Boundaries in Focus](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

## 6. PHC-001 — lokalno prešibek fokusni obroč na natural-midnight zaključkih

**Ocena: potrjeno nezadosten lokalni kontrast pomembnega fokusnega indikatorja. WCAG 2.2: 1.4.11 Non-text Contrast, AA. Pomembnost: P2, majhen lokalni popravek.**

### Natančna lokacija in meritev

Fokusni obroč končnega **»Pošljite opis«**, `outline:2px solid #7c97f0; outline-offset:3px`. Vir je skupno pravilo `[data-mini-palette] [data-cta]:focus-visible` v `MiniButtons.css`, uporabljeno nad fotografijo, ki jo na teh zaključkih določa `MiniContactNaturalMidnight.css`.

Prizadeti poti/različici sta:

- **NM roomy:** `/work` in vseh šest študij (enakovrednost prikaza potrjena; maska na `/work`).
- **NM short:** `/pristop` in `/o-nas` (maska na `/pristop`).

| Predstavnik / viewport | Mesto na obroču v viewport CSS px | Dejanska lokalna podlaga RGB | CSS barva obroča | Razmerje na maski | Kontrola z dejansko sosednjo podlago zunaj obroča |
|---|---|---|---|---:|---:|
| `/work`, 1280×900 | (694,5; 594), zgoraj desno | (107;76;54) | (124;151;240) | **2,781** | **2,837** pri (695,5;593,5) |
| `/work`, 1440×900 | (781,5; 594), zgoraj desno | (107;76;54) | (124;151;240) | **2,781** | **2,811** pri (782,5;593,5) |
| `/pristop`, 1280×900 | (571;684,5), spodnji levi lok | (103;76;58) | (124;151;240) | **2,823** | **2,869** pri (568,5;685,5) |
| `/pristop`, 1440×900 | (646,5;682), spodnji levi lok | (104;76;57) | (124;151;240) | **2,813** | **2,854** pri (645,5;682,5) |

Ni uporabljena najsvetlejša točka celotne fotografije ali celotnega gumba. To so jedra **dejansko narisanega obroča**. Sosednja kontrola dodatno pokaže, da rezultat ni posledica vzorčenja hipotetičnega piksla pod odstranjenim obročem.

Od 2.948 sprejetih vzorcev jeder obroča je pod 3 : 1 približno **31–33 % pri NM roomy** in **17–18 % pri NM short**. To niso statistika konverzij ali merilo površine po AAA kriteriju; podatek samo pokaže, da odstopanje ni en osamljen piksel. **Preostali del obroča je dovolj kontrasten.** Gumb in njegov napis ostaneta vidna; tega ne predstavljam kot popolno odsotnost fokusa ali nedelujočo tipkovnico.

### Ponovitev

1. Na lokalnem strežniku odpri `/work`, nastavi **1440×900** ali **1280×900** in počakaj na pisave/fotografijo.
2. S tipko **Tab** dosezi končni »Pošljite opis«; ne pritisni Enter in ne aktiviraj mailto. Ohrani pogled na dnu dokumenta, kot je zabeleženo v metapodatkih.
3. Na zgornjem desnem odseku modrega obroča izmeri podlago na označenem mestu. Ponovi na `/pristop` pri spodnjem levem loku.
4. Primerjaj z istim pogledom brez obroča, ob nespremenjeni fotografiji in geometriji. Tudi neposredno sosednji vidni piksel izkazuje razmerje pod 3.

Označeni izrezi z istim izvirnikom, podlago in masko:

- [NM roomy 1280](./bauma-v3-photo-contrast-evidence/01-roomy-1280-contact-cta-focus-annotated.png)
- [NM roomy 1440](./bauma-v3-photo-contrast-evidence/03-roomy-1440-contact-cta-focus-annotated.png)
- [NM short 1280](./bauma-v3-photo-contrast-evidence/02-short-1280-contact-cta-focus-annotated.png)
- [NM short 1440](./bauma-v3-photo-contrast-evidence/04-short-1440-contact-cta-focus-annotated.png)

### Najmanjši predlagani popravek — brez implementacije

**Lokalno svetlejši oziroma bel fokusni obroč samo primarnega kontaktnega CTA znotraj `data-contact-tone="natural-midnight"`.** Ohraniti 2 px, offset, velikost gumba in celotno kompozicijo; preveriti novo barvo pri istih štirih problematičnih stanjih in mobilnih predstavnikih. Globalnega `--mini-accent-text` ni treba spreminjati, saj glava, ghost fokus in e-poštni fokus v tem pregledu dosegajo prag.

Fotografije, gradientov, toniranja ali cropa ni treba temniti. Barva besedila ni problem; bela oznaka na modrem gumbu tudi v tem stanju dosega najmanj 4,847 : 1. Predlog ni implementiran ali predstavljen kot že preverjen popravek.

## 7. Kaj je mogoče zaključiti in kaj ostaja odprto

1. **Merilno nejasnost A11Y-008 je za navedeni lokalni Chromium obseg mogoče zaključiti:** obstajajo maske dejanskih črk, zanesljive sestavljene barve in ločena presoja robov/fokusa. Besedilo in ostali izmerjeni kontrolniki so v pregledanih stanjih potrjeno zadostni. Ni preostalega vzorca, pri katerem bi natančno razmerje ugibal iz vizualnega vtisa.
2. **A11Y-008 še ne označim kot brezhibno opravljeno**, ker PHC-001 zahteva konkreten lokalni popravek fokusnega obroča in ponovitev ciljnih meritev. Drugih foto popravkov ta pregled ne utemeljuje.
3. **Safari in ročno preverjanje:** ponoviti iste crope v Safari/WebKit, predvsem 320×568, 390×844 ter oba NM zaključka pri 1280/1440. SVG filter, subpikselno pozicioniranje in končna rasterizacija lahko odstopajo. Preveriti vidnost novega fokusa na dejanskem zaslonu ter ob običajni tipkovnični uporabi. Chromium rezultat ni dokaz Safari skladnosti.

Natančne omejitve:

- Izmerjeni so navedeni viewporti, reprezentativne enakovredne različice, DPR 2 in stabilna končna stanja. Vmesne širine/višine, vsi položaji med drsenjem in prehodni fade glave niso v celoti pregledani. Izginjajoča glava ni merjena kot navidezno prosojna kontrola, ki je v resnici skrita.
- V tem obsegu fotografija ni animirana; meritev zato ne pokriva hipotetične prihodnje video/slideshow različice. Preverjeno mirovanje podlage ne pomeni pregleda vseh animacij spletnega mesta.
- Maske so na mestih skoraj povsem pokritih jeder potez. Ne vključujejo praznin ali antialiasing robov. Foreground je iz CSS, zato ne ocenjujem uporabniške nastavitve glajenja pisav ali fizičnega kontrasta zaslona.
- Ponavljanje enakih zaključkov je potrjeno po slogu in relativni geometriji, ne z izvozom maske na vsaki posamezni študiji. Mejni prihodnji drugačen tekst/crop ali drugačen ton mora biti ponovno izmerjen.
- Aktivno/pressed stanje, prisilne sistemske barve, zoom, bralnik zaslona in splošna dostopnost niso ponovno auditirani. Namen tukaj je 1.4.3 in uporabni deli 1.4.11 nad fotografijami.
- To ni preizkus staginga, EN/IT ali naročniških rekonstrukcij. Mailto ni aktiviran; ni sporočil, osnutkov, oddaj ali nakupov.

Ustvarjeni so samo to poročilo in njegova dokazna podmapa. Koda, obstoječe necommitane spremembe, labi, prejšnja poročila, HEAD in Git staging ostanejo nespremenjeni. Nič ni commitano, pushano ali deployano.
