# BAUMA V3 — neodvisno preverjanje vizualnega audita

Datum: 25. 10. 2026. Pregled in priporočila; brez implementacije, commita, pusha ali deploya.

## 1. Osnova in okolje

- Dejanski repozitorij: `/Users/bauma/Applications/projects/bauma-portfolio`. Pripeta mapa `/Users/bauma/bauma-portfolio` vsebuje le `.claude/`, ni Git repozitorij. Pregled je bil zato izveden na najdenem dejanskem projektu, ne na prazni pripeti mapi.
- Veja: `staging/bauma-v3`; HEAD: `6b2fa07926df85731122b430f25ae786a97f06a8`.
- Pred pregledom: šest spremenjenih datotek, diff +67/−26: `MiniSelectedWorkHome.tsx`, `MiniServicesBoxes.css`, `MiniSystemHome.tsx`, `SelectedWorkMotion.css`, `app/page.tsx`, `app/work/page.tsx`. Prisotne številne untracked datoteke, labi, recovery, slike in obstoječi audit. Nič ni zavrženo, prestavljeno ali dodano v Git staging.
- V dejanskem projektu in preverjeni verigi nadrejenih map ni bilo najdenega `AGENTS.md`. Prebrana lokalna konfiguracija `.claude/launch.json` določa razvojni strežnik na portu 3000; ne vsebuje dodatnih navodil za audit.
- Lokalni že delujoči Next dev: `http://localhost:3000`; macOS, lokalni Playwright Chromium **151.0.7922.34**, headless, DPR 1, višina pogleda 900 px.
- **17 poti × 8 širin = 136 meritev:** 320, 375, 640, 768, 900, 1024, 1280, 1440 px. Vse vrnejo HTTP 200. Zajeti full-page posnetki pri vseh teh širinah; vizualno pregledani pregledi strani pri 320, 768 in 1440 ter dodatne primerjave ključnih prelomov home, `/work` in Flexido. Zajemi ostalih vmesnih širin niso enakovredni podrobnemu ročnemu pregledu vsakega elementa.
- Poti: `/`, `/work`, `/pristop`, `/o-nas`; `/work/{flexido,ulterior,odstrani-tattoo,dema-plus,artbite,hardshelljacket}`; `/pogoji-uporabe`, `/zasebnost`, `/piskotki`; `/en`, `/en/terms`, `/en/privacy`, `/en/cookies`.
- Statične meritve z `prefers-reduced-motion: reduce`; kartice in fokus dodatno z `no-preference` in `reduce`. Prvi sklop čaka `document.fonts.ready`; nadaljnji zajemi uporabljajo že lokalno naložene pisave in omejeno čakanje. Posnetki so statični, ne dokaz časov animacije; čase in transformacije dokazujejo ločene meritve interakcij.
- Fokus je dosežen z dejanskimi ponovitvami **Tab**, ne z `element.focus()`. Meritev po 400 ms prepreči branje vmesne barve prehoda.
- Emulacija dotika: 375 × 900, `isMobile`, `hasTouch`, `(hover:hover)=false`, `(pointer:fine)=false`. To ni fizični iPhone.

Dokazi so v [bauma-v3-visual-verification-codex-evidence](./bauma-v3-visual-verification-codex-evidence/). Surove meritve omogočajo ločevanje opažanj od razlage: `measurements.json`, `interactions.json`, `images.json`, `details.json`, `staging.json`.

## 2. Povzetek neodvisne presoje

**Dve ozki nekonsistentnosti sta potrjeni:** desktop odmik Flexido (VIS-003) in fokus uvodnih zunanjih povezav v šestih študijah (VIS-008). Ne gre za dokaz blokirane uporabe strani. Priporočena sta kot majhna popravka pred objavo.

**VIS-004 ni naključna napaka tipografskega obsega:** obe strani imata izrecno napisano lokalno pravilo za 44 px in skrito prazno oznako. **Home H1 16 px je napačna interpretacija meritve ovoja**, ne dejanska velikost vidnih črk.

VIS-005 in VIS-007 opisujeta resnični razliki, vendar njuna razglasitev za napako potrebuje odločitev. Obstoječa odobritev hoverja določa home 150 ms in `/work` 220 ms; sama po sebi ne potrjuje vključitve na vseh drugih straneh.

## 3. Posebej zahtevana preverjanja

### VIS-003 — Flexido: odmik uvoda

**Ocena: potrjena napaka konsistentnosti, manjša.**

- Pot in širine: `/work/flexido`, **1024, 1280, 1440**. Primerjava z ostalimi petimi študijami na istih širinah.
- Dejanska vrednost: zgornji padding **128 px**, oznaka y=128, H1 y=168,5. Primerjalna: **144 px**, oznaka y=144, H1 y=184,5. Razlika **−16 px**.
- Pri 320/375 je skupno 112 px; pri 640/768/900 skupno 128 px. Razlika nastane šele pri `lg`, ne na vseh desktopu podobnih širinah.
- Izvor: `app/work/flexido/page.tsx:112`, `lg:pt-32`; primerjalno `ulterior/page.tsx:108`, `odstrani-tattoo/page.tsx:77`, `dema-plus/page.tsx:105`, `artbite/page.tsx:106`, `hardshelljacket/page.tsx:99`, vsi `lg:pt-36`.
- Enaka vloga uvoda, isti osnovni vzorec; dokumentirane izjeme za ta odmik nisem našel. To je razlog za oceno, ne zgolj dejstvo, da se številki razlikujeta.
- Priporočilo: lokalno poravnati zgornji odmik Flexido z ostalimi uvodi; brez spreminjanja rekonstrukcije.
- Dokaz: [01-case-intro-1440.png](./bauma-v3-visual-verification-codex-evidence/01-case-intro-1440.png).

### VIS-008 — fokus zunanjih povezav v uvodih

**Ocena: potrjena napaka konsistentnosti; fokus ni odsoten.**

- Poti: vseh šest `/work/*`, preverjeno z dejanskim Tab pri **1440 px**, z obema nastavitvama reduced motion. CSS pravilo nima omejitve širine; obroč na vsaki mobilni širini ni bil posebej pretipkan.
- Dejanska vrednost: **1 px solid, offset 4 px, bela pri 50 %**; stabilna barva po 400 ms. Primerjalno kartice in pravna noga: **2 px solid, offset 3 px, rgb(124,151,240)**.
- Izvor: `const FOCUS` v šestih `app/work/*/page.tsx` (Flexido:59); primerjava `LINK_FOCUS` v `MiniSelectedWorkHome.tsx`, `FOCUS` v `CaseStudyNav.tsx` ter header pravilo v `globals.css`.
- Povezave so dosegljive s Tab, fokus je viden. To poročilo ne sklepa, da je razlika sama po sebi neuspeh standarda dostopnosti.
- Priporočilo: poenotiti samo konstanto teh šestih uvodnih povezav.
- Dokaz: [05-focus--work-flexido.png](./bauma-v3-visual-verification-codex-evidence/05-focus--work-flexido.png), primerjalno [05-focus--work.png](./bauma-v3-visual-verification-codex-evidence/05-focus--work.png).

### VIS-005 — iste kartice na drugih straneh

**Ocena: potrebna oblikovalska presoja; opažanje potrjeno, napaka ni samodejno potrjena.**

- Poti: `/`, `/work`, `/pristop`, `/o-nas`; interakcije izmerjene pri **1440**, dotik pri **375** na `/` in `/work`.
- Home: površina `translateY(-3px)`, **0,15 s**. `/work`: ista transformacija, **0,22 s**. Naslov home se med hoverjem ne premakne (y=603,71875 pred/po); ovoj ne vsebuje podpisa niti opisa. Podpisi `/work` so prav tako zunaj `.work-lift`.
- `/pristop` in `/o-nas`: **brez dviga**, transition površine **0 s**; puščica v mirovanju bela .65, pri Tab ostane .65. Home in `/work`: .48 → .92 pri Tab. Obe drugi strani imata kljub temu delujoč **2 px / 3 px modri fokusni obroč**.
- Reduced motion: na home in `/work` površina **none / 0 s** pri hoverju in fokusu. Emulirani dotik: površine **none**, brez hover dviga.
- Izvor: `MiniSelectedWorkHome.tsx` privzeti `lift=false`, ločeni veji puščice; `app/page.tsx` podaja `lift`; `app/pristop/page.tsx:168` in `app/o-nas/page.tsx:96` ga ne. `SelectedWorkMotion.css:191–214` izrecno omejuje nov odziv na `/` in `/work`.
- Priporočilo: odločiti, ali isti izbor projektov dobi dvig tudi na teh dveh straneh. Obstoječe potrjene časovnice ne spreminjati in razlike ne označevati kot nujno blokado objave.
- Dokaz fokusa: [05-focus--pristop.png](./bauma-v3-visual-verification-codex-evidence/05-focus--pristop.png); številčne primerjave v `interactions.json`. Statična slika sama ne dokazuje trajanja.

### VIS-007 — »Vsi projekti«

**Ocena: potrebna oblikovalska presoja; razlika potrjena.**

- Poti: vseh šest `/work/*` pri vseh osmih širinah; primerjava z `/`, `/pristop`, `/o-nas`.
- Dejanska vrednost: povezava na notranji `/work` vsebuje **↗**; primerjalni pregledni link v `MiniSelectedWorkHome` vsebuje **→**. Zunanje povezave uvodov prav tako vsebujejo ↗.
- Izvor: `app/components/work/CaseStudyNav.tsx:51`, `&nbsp;↗`; `TextLink` v `MiniSelectedWorkHome.tsx` uporablja →.
- Priporočilo: po potrditvi pravila notranje → / zunanje ↗ zamenjati samo ta znak. Cilj povezave je pravilen, navigacija ni pokvarjena.
- Dokaz: spodnji navigacijski del na [06-mobile-overview-1.png](./bauma-v3-visual-verification-codex-evidence/06-mobile-overview-1.png).

### VIS-004 — zaključka `/pristop` in `/o-nas`

**Ocena: namerna razlika v implementaciji; razlaga prvega audita je ovržena.**

- Pri **320/375** naslov obeh zaključkov **24 px**; pri **640/768/900/1024/1280/1440** **44 px / 48,4 px**. Home: **28 → 36 px**; `/work` in študije: **24 → 36 px / 40,32 px**.
- Pri 1440 je fotografski zaključek približno **421 px** na obeh straneh, **437 px** home, **509 px** `/work` in študije. Različna višina sledi odsotni oznaki in različnim razmikom, ni izgubljena vsebina.
- Izvor: `PristopPage.css:223–239` izrecno opisuje »heading and button only«, skrije `p.uppercase:empty`, nastavi `margin-top:0` ter **44 px od 640 px**. `ONas.css:166–179` ponovi isti vzorec. `CLOSING.eyebrow` je namenoma prazen v obeh `page.tsx`.
- Skupni `MiniClosingBookend` se uporablja tudi tukaj. Razlika ni posledica tega, da komponenta ne bi bila skupna. Manjkajoči `data-home-v11` ni zadosten vzrok ali razlog za globalni ovoj; velikost je izrecno lokalno prepisana.
- Priporočilo: ohraniti, razen če oblikovalec izrecno spremeni odločitev. Koda dokazuje namen implementacije; ne dokazuje nove zunanje oblikovalske odobritve.
- Dokaz: [02-closing-1440.png](./bauma-v3-visual-verification-codex-evidence/02-closing-1440.png).

### Home H1 »16 px«

**Ocena: ni potrjeno kot napaka; domneva o dejanskih 16 px je ovržena.**

- `/`, vseh osem širin: `h1` ima izračunano velikost **16 px**, vendar nima neposrednega vidnega besedila zunaj notranjih elementov.
- Vidna mobilna veja: **38 px pri 320**, **44 px pri 375 in 640**. Vidna desktop veja: **68 px pri 768/900/1024**, **72 px pri 1280/1440**. Nasprotna veja je `display:none`; ne meri se je kot vidni naslov.
- Izvor: `MiniHero.tsx:193–203` (H1 z mobilnim in desktop spanom), `globals.css` (osnovni lestvici), `MiniHeroSentence.css` in `app/homeHeroMobile.css` (lokalni odzivni popravki).
- Razlog napačnega zaključka: meritev `getComputedStyle(document.querySelector('h1')).fontSize` zajame ovoj, ne elementa, ki riše črke. Ni dodatnega skritega H1, ki bi pojasnjeval selektor; dve odzivni besedilni veji sta v istem H1.
- Dokaz: [04-hero-320-375-768-1440.png](./bauma-v3-visual-verification-codex-evidence/04-hero-320-375-768-1440.png). Brez predloga nove hero kompozicije.

## 4. Preostale ugotovitve prvega audita

| ID / ocena | Pot, širina, dejanska in primerjalna vrednost | Izvor in neodvisna presoja |
|---|---|---|
| VIS-001 — potrebna oblikovalska presoja | Case in šest legal strani: Inter **11 px / 500 / 2,42 px tracking / bela .60**; home, work, pristop, o-nas: IBM Plex Mono **12 px / 500 / 0,96 px / #7c97f0**. Pravilo velja pri vseh osmih širinah. | `EYEBROW` v case straneh in `CaseStudyNav`, legal `page.tsx`; `homeTypography.css:65+` izrecno opisuje homepage scope in zaščito deljenih komponent. Razlika je resnična; tiha oznaka »Pravno« in domača sekcijska oznaka nista nujno ista vloga. Ne priporočam globalnega ovijanja case/legal. Dokaz: 01 in mobilna pregleda 0/1. |
| VIS-002 — namerna razlika vlog; splošna napaka ni potrjena | Pri 1440 `/work` **30/500 Inter**, case in legal **56/600 Inter**, pristop/o-nas **72/400 DM Serif**. Pri 375: **26**, **30**, **36,45 px**. Home glej zgoraj. | `app/work/page.tsx`, `globals.css` utility `home-primary-heading`, `PristopPage.css`, `ONas.css`. Indeks, študija in predstavitveni naslov imajo različne vloge; enaka oznaka H1 ni zahteva za enako vizualno velikost. Dokaz: mobilni pregled 0 in 01. |
| VIS-006 — potrebna oblikovalska presoja, ne prednostni popravek | `/work` **20/500**, opis **15/22/.70**; izbor istega projekta na home/pristop/o-nas **22 mobilno →24/600**, opis **13/20/.60**, pri vseh osmih širinah po svojih prelomih. | `Caption()` v `app/work/page.tsx`, `MiniSelectedWorkHome.tsx`, `homeTypographyV11.css`. Polni indeks in izbor imata različni uredniški vlogi; ni razloga za avtomatično izenačenje. Dokaz: 07 in mobilni pregled 0. |
| VIS-009 — potrebna oblikovalska presoja | `/o-nas` podpisna povezava bela **.60**, legal kontakt **.90**, uvodni case vir **.85**; pravila brez posebnega preloma, vizualna primerjava 320/1440. | `ONas.css` podpis in njegova podedovana barva, legal `page.tsx` link, case `page.tsx` uvodni link. Podpis avtorja, kontakt v pravnem besedilu in zunanji vir imajo različne vloge. Opažanje ne dokazuje napake. Dokaz: mobilni pregledi 0/1/2. |
| VIS-010 — potrebna oblikovalska presoja / dostopnostni nadaljnji pregled | Case caption **14 px, bela .40** na Work **#161a21**; primerjalno tekoče besedilo .70 in uvod .85. Vloge na `/pristop` **11 px mono / bela .45**. Velja skozi preverjene širine. | `CAPTION` v šestih case datotekah, `PristopPage.css`. Potrjena nizka intenzivnost pomožnega besedila; prvotni približni kontrast 3,8:1 ni neodvisno ponovno verificiran kot točen izračun. Celotna skladnost dostopnosti ni predmet tega pregleda. Ne širiti v prenovo tipografije. Dokaz: captions v 06; natančna tipografija v `details.json`. |
| VIS-011 — namerna meja obsega; napaka ni potrjena | Rekonstrukcije imajo lokalne družine, tudi `ui-sans-serif, system-ui`, medtem ko Bauma uporablja Inter/DM Serif; 320–1440. | Lokalne proof komponente v `app/work/*`. Primerjava z živimi naročniškimi stranmi ni izvedena. Različnih pisav naročnikov ne obravnavam kot napake Bauma sistema in ne priporočam njihovega poenotenja. Dokaz: 06. |

## 5. Dodatno: angleška stran in dejansko objavljeno stanje

### EN-001 — starejša različica skupnih komponent

**Ocena: potrebna oblikovalska presoja o obsegu objave; ni novo dokazano nastala regresija.**

- `/en`, preverjene vse širine, primerjalno `/` in `/en/{terms,privacy,cookies}`.
- Pri 1440 primarni hero CTA na `/en`: **#fcac33**, **42 px** visok; home: **#4169e1**, **48 px**. EN zaključni CTA **bel**, **204,125 × 48 px** (besedilo je daljše), home **moder**, **144,234 × 48 px**. Različna širina zaradi vsebine ni napaka. EN header ohranja rumeni CTA; angleške legal strani imajo moder CTA V3.
- EN zaključek ima tudi starejši svetlejši ton fotografije in fokus CTA **1 px / offset 4 / bela .50**, medtem ko nove kartice in pravna noga uporabljajo **2 px / 3 / accent**. Fokus je bil dosežen s Tab.
- Izvor: `app/en/page.tsx` kliče `MiniHeader` brez `refined` in `MiniClosingBookend` brez `variant`; `MiniFinalCTA` zato uporabi privzeti beli gumb. Legal strani uporabljajo `MiniLegalShell` z `refined`. `/en` nima home V1.1 tipografskega obsega.
- Priporočilo: pred objavo izrecno odločiti, ali EN skupna glava, gumbi in noga ostanejo starejša različica ali dobijo ozko poravnavo z V3. Ne kopirati celotne slovenske sestave in ne ocenjevati prevoda. Brez primerjalnega posnetka prejšnje EN izdaje ni mogoče dokazati časovne regresije.
- Dokaz: [03-en-components-1440.png](./bauma-v3-visual-verification-codex-evidence/03-en-components-1440.png), [06-mobile-overview-2.png](./bauma-v3-visual-verification-codex-evidence/06-mobile-overview-2.png).

### Lokalno ni enako stagingu

V brskalniku je bil dodatno preverjen `https://work.bauma.si` na `/`, `/work`, `/work/flexido`, `/en`, `/en/terms` pri 1440; HTTP 200, brez horizontalnega prelivanja. Lokalno imajo home **3**, `/work` **6** elementov `.work-lift`; staging na obeh **0**. Odobrenega necommitanega hoverja zato ne označujem kot že objavljenega. Flexido ima tudi na stagingu oznako y=128. Ti vzorci ne dokazujejo Git commita deploya. Poln 136-kombinacijski pregled staginga ni bil izveden.

## 6. Preverjeno brez nove potrjene napake

- `documentElement.scrollWidth == innerWidth` v **vseh 136 kombinacijah**. Odsotnost prelivanja dokumenta sama ne dokazuje odsotnosti rezanja v notranjem clip kontejnerju; to je bilo dodatno pregledano na posnetkih ključnih prelomov.
- Header je **52 px** na vseh 17 poteh in vseh širinah. V3 glave sledijo isti levi črti vsebine: **24 px pod 640**, **32 px pri 768**, **112 px pri 1440**. Pri 640 je rail **24 px**, pri 900/1024/1280 **32 px**. Širina zunanjega rail elementa vključuje padding; zato x=80 zunanjega ovoja pri 1440 ni napaka glede na x=112 besedila.
- Šest pravnih strani uporablja skupni `MiniLegalShell`; max širina besedil **608 px**, desktop leva črta 112 px. Mobilno se stolpec zoži z railom. Različne dolžine in prelomi pravnih besedil niso vizualna regresija. Dokaz: mobilna pregleda 1/2.
- V šestih case uvodih osnovna tipografska lestvica ostaja skupna, npr. H1 30/48/56 px. Različni prelomi naslovov zaradi vsebine niso sami po sebi napaka.
- Vidne slike v ciljano ponovno pregledanih galerijah Flexido, Ulterior, Dema in ArtBite se po pomiku do posamezne slike naložijo. Začetni zapis `broken` v `measurements.json` pomeni **še nenaloženo ali neuspešno**, ne samodejno pokvarjene slike. `images.json` po ponovnem pregledu pokaže, da so preostale ničelne širine samo pri skritih odzivnih slikah. Ne prijavljam lažne napake nalaganja zaradi lazy galerije.
- Home hero na pregledanih posnetkih nima opažene regresije zaradi 16 px H1; fizična iPhone odobritev iz naloge ostaja nespremenjena.
- Odstrani Tattoo: prazni desni del rezultatov je ohranjen kot izrecno odobrena kompozicija.

## 7. Priporočila pred objavo, po pomembnosti

1. **VIS-008:** ozko poenotiti fokus šestih uvodnih zunanjih povezav. Ohrani dejansko dosegljivost s Tab; brez globalnega tipografskega ovoja.
2. **VIS-003:** poravnati samo Flexido desktop padding 128 → 144 px od 1024 px dalje.
3. **Odločitev EN-001:** potrditi status starejših EN skupnih komponent. Če V3 obseg vključuje EN, izbrati majhen poseg v glavo/gumbe/nogo; to poročilo ne predlaga prenove EN strani.
4. **VIS-007:** po potrditvi semantike puščic zamenjati notranji ↗ z → v `CaseStudyNav`.
5. **VIS-005:** izbrati, ali se odobren dvig razširi na `/pristop` in `/o-nas`. Trenutni pravilni home/work odziv in časovnici ohraniti. To ni nujna poprava nedelujočega fokusa.

Nobene ugotovitve ne označujem kot dokazano kritično blokado objave. VIS-001/006/009 naj ne širijo zaključne faze brez konkretne oblikovalske odločitve. Kontrast captionov naj ostane evidentiran za usmerjen dostopnostni pregled.

## 8. Namerno ohranjene razlike

- Odobrena home hero kompozicija in njena samostojna lestvica.
- Različne vizualne vloge H1 indeksa, predstavitvenih strani in študij.
- Zaključka `/pristop` in `/o-nas`: »Imate projekt?«, brez oznake, 44 px od 640; lokalna eksplicitna različica skupne komponente.
- Home 150 ms in work 220 ms; imena in opisi kartic mirujejo.
- Ožji pravni stolpec in pravna noga brez prodajnega CTA.
- Lokalni sistemi pisav, barv in postavitev rekonstrukcij; ArtBite barvni odziv; notranje vodoravne galerije.
- Odobrena praznina rezultatov Odstrani Tattoo, različne dolžine študij ter `roomy` zaključki.

## 9. Omejitve in nepreverjeno

- Samo Chromium na macOS; Safari, Firefox, fizični iPhone/Android, različne višine ekranov, zoom in nastavitve sistemskih pisav niso preverjeni.
- Vseh 136 kombinacij ima meritve in zajem, vendar ni izveden podroben ročni pregled vsakega besedilnega elementa vsake vmesne širine. Prednost imajo celotni pregledi pri 320/768/1440 in relevantni prelomi ključnih komponent. Matrike ne predstavljam kot 136 popolnih ročnih potrditev.
- Tab testi ciljajo kartico na štirih straneh, vseh šest uvodnih zunanjih povezav, nogo na SL/EN terms in CTA na `/en`; niso popoln audit vseh fokusnih mest ali menija na dotik. Hover vsake posamezne povezave, mobilni meni, vsi gumbi rekonstrukcij in carousel swipe na fizični napravi niso posebej verificirani.
- Reduced motion je neposredno verificiran za odobren dvig kartic in fokusne vzorce, ne za vsako animacijo celotnega spletnega mesta.
- Nalaganje slik je preverjeno s končnim prikazom in ciljnim ponovnim prehodom galerij; ni meritev hitrosti na počasnem omrežju. Zajemi Next dev vsebujejo razvojni indikator »N«, ki ni vizualna napaka produkcije.
- Staging je vzorčno primerjan pri 1440, ne sistematično na vseh poteh/širinah. Lokalni rezultat vključuje namerne necommitane spremembe in ga ni mogoče enačiti s trenutno objavljenim stanjem.
- Ni primerjave rekonstrukcij z živimi naročniškimi spletišči, kakovosti EN prevoda, pravne pravilnosti besedil ali celotne skladnosti dostopnosti.
- Izrecni CSS dokazuje implementacijski namen; kjer ni oblikovalske odobritve v nalogi, je ne izmišljam.

## 10. Evidenca sprememb tega pregleda

Ustvarjena samo ta datoteka in dokazna podmapa. Izvorna koda in prejšnje poročilo ostaneta nespremenjena. Končni pregled mora potrditi enak diff šestih izvornih datotek in enak HEAD; dokazni JSON ne vsebuje okolijskih skrivnosti. Začasni skripti in vsi preostali delovni zajemi ostajajo zunaj repozitorija.
