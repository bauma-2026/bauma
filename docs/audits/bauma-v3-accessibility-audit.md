# BAUMA V3 — Audit 03: dostopnost

25. 10. 2026 · read-only · WCAG 2.2 A/AA kot referenčni okvir. Omejen tehnični in ročni pregled, **ne potrdilo popolne skladnosti**.

## 1. Osnova in dejanski obseg

- Dejanski repozitorij: `/Users/bauma/Applications/projects/bauma-portfolio` (na macOS se pot lahko izpiše z `Projects`). Pripeta mapa `/Users/bauma/bauma-portfolio` ni dejanski repozitorij.
- Veja `staging/bauma-v3`; HEAD `6b2fa07926df85731122b430f25ae786a97f06a8`.
- Pred začetkom: **17 spremenjenih tracked datotek**, obstoječe necommitane datoteke in labi. Ohranjeni so hoverji, štirje vizualni popravki ter popravek FLOW-001 v `MiniHeader.tsx`/`MiniFinalCTA.tsx`.
- V projektu in preverjeni verigi nadrejenih map ni bilo najdenega `AGENTS.md` ali `CLAUDE.md`. Prebrana `.claude/launch.json` in zahtevana poročila `bauma-v3-visual-verification-codex.md`, `bauma-v3-user-flow-cta-audit.md`, `bauma-v3-flow001-fix.md`.
- Že delujoči lokalni Next dev, `http://localhost:3000`. **Staging ni preverjen**; rezultat vključuje lokalne necommitane spremembe.
- Obseg: `/`, `/work`, `/pristop`, `/o-nas`; šest `/work/{flexido,ulterior,odstrani-tattoo,dema-plus,artbite,hardshelljacket}`; `/pogoji-uporabe`, `/zasebnost`, `/piskotki`. EN/IT nista predmet pregleda.
- Orodja: **Playwright 1.62.1**, že nameščeni **axe-core 4.11.4**, lokalni **Chromium 151.0.7922.34** na macOS, headless. Brez sprememb odvisnosti, `package.json` ali lockfila.
- Osnovna pogleda: **375 × 812** in **1440 × 900 CSS px**, DPR 1. Axe na vseh 13 poteh pri obeh širinah; ponovitev v stabilnem `prefers-reduced-motion: reduce` za izločitev prehodnih stanj. Dodatno odprti mobilni meni. Izločen razvojni `nextjs-portal`.
- Dejanski Tab skozi 13 strani pri obeh širinah, ciljni Shift+Tab/Enter/Escape, mobilni meni, tri vodoravne galerije in tehnične točke Ulterior. Dostopnostno drevo prek Chromium CDP na home/Ulterior ter Playwrightov dostopni posnetek tehničnega prikaza. **To ni preizkus z bralnikom zaslona.**
- Reflow vseh 13 strani pri **320 × 900 CSS px**. Predpisani razmiki na vzorcu sedmih strani (`/`, `/work`, `/pristop`, `/o-nas`, Flexido, Ulterior, Pogoji uporabe) pri 320 in 1440.
- **Prava povečava strani 200 %** je bila izvedena s Chromiumovim `chrome.tabs.setZoom(2)` v ločenem začasnem profilu: začetni pogled **1440 × 913 / DPR 1** → **720 × 456 / DPR 2**, preverjen vrnjeni zoom faktor **2**. Meritve na vseh 13 poteh, neposredni viewport posnetki na sedmih. To ni samo zmanjšanje viewporta ali pinch zoom.
- Dodatni CSS stresni test podvojitve izračunanih velikosti pisav na vseh 13 poteh je obravnavan samo kot približek text-only povečave, ne kot dokaz dejanske brskalniške text-only povečave.

## 2. Povzetek presoje

Potrjene so ozke težave kontrasta, prilagoditve razmikov, poimenovanja/jezika funkcionalnega prikaza in trajanja ene samodejne animacije. **FLOW-001 je uspešno odpravljen.** Pri pregledanem Tab zaporedju ni bila zaznana popolna zakritost fokusiranih kontrolnikov s fiksno glavo, galerije pa je mogoče upravljati s tipkovnico.

Prednost imajo podpisi rekonstrukcij, odrezano besedilo kartic pri uporabniških razmikih ter trije manjši posegi v funkcionalni prikaz Ulterior. Mejne kontrastne razlike so zapisane ločeno, da niso predstavljene kot enako velika ovira.

Dokazi: [bauma-v3-accessibility-evidence](./bauma-v3-accessibility-evidence/). Statični posnetki dokazujejo prikaz; izračune, fokus, povečavo in časovna stanja dokazujejo spremljajoči CSV/JSON/TXT ter ciljni video.

## 3. Kontrast: metoda in izračuni

Prebrani so izračunani CSS, dejanske plasti ozadij in opacity prednikov. Za enobarvne primere je uporabljeno sestavljanje kanalov sRGB `C = α·F + (1−α)·B`, nato relativna luminanca in razmerje `(Lsvetlejša+0,05)/(Ltemnejša+0,05)`. Kanali pred izračunom niso zaokroženi. Axe barve pretvori v 8-bitni hex, zato se zadnje decimalke njegovih razmerij razlikujejo. Dokaz: [contrast-calculations.csv](./bauma-v3-accessibility-evidence/contrast-calculations.csv).

Običajno besedilo potrebuje najmanj 4,5 : 1; veliko besedilo 3 : 1. Podpisi 14 px in oznake 11–12 px niso veliko besedilo. Dekoracija, logotipi in neaktivni kontrolniki imajo drugačno obravnavo; samo `aria-hidden` še ne dokazuje, da je vsebina dekorativna. [W3C, SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

| Vzorec | Dejanska podlaga | Sestavljena barva besedila RGB | Razmerje brez zaokroževanja kanalov | Presoja |
|---|---|---|---:|---|
| Flexido / Odstrani, caption bela .40 | `#161a21` | 115,20 / 117,60 / 121,80 | **3,808 : 1** | Ne doseže 4,5. |
| Ulterior, caption bela .40 | `#121316` | 112,80 / 113,40 / 115,20 | **3,828 : 1** | Ne doseže 4,5. |
| Dema, caption bela .40 | `#0f141c` | 111,00 / 114,00 / 118,80 | **3,824 : 1** | Ne doseže 4,5. |
| ArtBite, caption bela .40 | `#1f1712` | 120,60 / 115,80 / 112,80 | **3,811 : 1** | Ne doseže 4,5. |
| Hardshelljacket, caption bela .40 | `#16181c` | 115,20 / 116,40 / 118,80 | **3,820 : 1** | Ne doseže 4,5. |
| Pristop »Usklajevanje«, bela .45 | `#080a0f` | 119,15 / 120,25 / 123,00 | **4,49838 : 1** | Tik pod pragom; ne zaokrožiti v uspeh 4,50. |
| Pristop »Bauma«, bela .45 | `#0d1119` | 121,90 / 124,10 / 128,50 | **4,52474 : 1** | Doseže prag. |
| Pristop »Vi«, `#7c97f0` | `#0d1119` | 124 / 151 / 240 | Glej CSV | Doseže 4,5. |
| Pravne povezave v nogi, bela .60 | `#080a0f` | 156,20 / 157,00 / 159,00 | **7,298 : 1** | Doseže prag. |
| Opis izbranega projekta, bela .60 | `#0f141c` | 159,00 / 161,00 / 164,20 | **7,132 : 1** | Doseže prag. |
| Beli napis glavnega modrega CTA | `#4169e1` | 255 / 255 / 255 | **4,847 : 1** | Doseže prag za običajno besedilo. |
| Ulterior, neizbrana številka v seznamu, `#33333e/.60` | `#f3f6fa` | 127,80 / 129,00 / 137,20 | **3,576 : 1** | Ne doseže 4,5. |
| ArtBite oznaka »Galerija«, `#c9624a` | `#1f1712` | 201 / 98 / 74 | **4,480 : 1** | Mejno, a pod pragom. |

Pomembna korekcija VIS-010: **ne uporabljajo vsi captioni ozadja `#161a21`**, in **ne odpovejo vse oznake vlog na Pristopu**. Bela .45 se na dveh različnih ozadjih znajde na različnih straneh praga.

## 4. Ugotovitve

### A11Y-001 — informacijski podpisi rekonstrukcij imajo prenizek kontrast

- **Ocena:** potrjena napaka. **Pomembnost P2**, skupni vzorec, lokalno podvojen v šestih case datotekah.
- **Pot/element/stanje:** vseh šest `/work/*`, običajni `CAPTION`, 14 px / 400 / bela .40; preverjeno 375/1440, statično stanje. Podpisi niso dekoracija: pojasnjujejo izvor in neinteraktivnost prikaza.
- **WCAG:** **1.4.3 Contrast (Minimum), AA**. Dejanska razmerja 3,808–3,828 : 1 namesto najmanj 4,5 : 1; glej tabelo in CSV.
- **Ponovitev:** odpri npr. `/work/flexido`, pomakni se pod prvi proof, preberi caption in njegove CSS/ozadje; izračunaj sestavljeno belo .40 na `rgb(22,26,33)`. Enako preveri druga lokalna ozadja.
- **Izvor:** `const CAPTION` v šestih `app/work/*/page.tsx`; to je Baumina razlaga ob rekonstrukciji, ne naročniški vizualni sistem.
- **Najmanjši popravek:** povečati kontrast samo caption tokenov na njihovih dejanskih podlagah z nekaj rezerve nad 4,5; brez spremembe pisave, globalnega ovoja ali prenove dokazov.
- **Dokaz:** [01-case-caption-contrast.png](./bauma-v3-accessibility-evidence/01-case-caption-contrast.png), CSV in ročno preverjeni axe rezultati.

### A11Y-002 — dve drobni informacijski oznaki sta tik pod pragom

- **Ocena:** potrjena napaka. **Pomembnost P3**, dve lokalni izjemi, ne splošna napaka vseh oznak.
- **Pot/element/stanje:** `/pristop`, »Usklajevanje« (11 px / 500 / bela .45 na Base); `/work/artbite`, »Galerija« (11 px / 500 / `#c9624a` na `#1f1712`), 375/1440, mirovanje.
- **WCAG:** **1.4.3, AA**. Usklajevanje **4,49838 : 1** (axe po kvantizaciji 4,48); Galerija **4,48021 : 1**. To sta majhni mejni odstopanji, ne dokaz, da je vse besedilo neberljivo.
- **Ponovitev/dokaz:** preberi `.apw-written .apw-role` in Galerija eyebrow, primerjaj sestavljeno barvo z dejanskim ozadjem. [02-pristop-labels.png](./bauma-v3-accessibility-evidence/02-pristop-labels.png), CSV; ArtBite vozlišče je v axe rezultatih.
- **Izvor:** `app/pristop/PristopPage.css`, `.apw-role`; `app/components/blocks/mini/ArtBiteGalleryProof.tsx`.
- **Najmanjši popravek:** lokalna majhna sprememba svetlosti/alpha z rezervo nad pragom. Oznak »Bauma« (4,525) in »Vi« ne prijavljam kot kršitve; kontrastnega praga ni treba doseči s spreminjanjem celotnega sistema naročnika.

### A11Y-003 — neizbrane številke funkcionalnih tehničnih točk Ulterior

- **Ocena:** potrjena napaka. **Pomembnost P2**, lokalni funkcionalni prikaz.
- **Pot/element/stanje:** `/work/ulterior`, številke 01–05 v seznamu Product details, **11,52 px**, privzeto neizbrano stanje, 375/1440. Ti gumbi so omogočeni; »neizbrano« ne pomeni »neaktivno/disabled«.
- **WCAG:** **1.4.3, AA**. `#33333e/.60` na `#f3f6fa` → **3,576 : 1**, zahtevano 4,5 : 1. Besedni naslovi in modra izbrana številka niso ista težava. Številke povezujejo seznam z označenimi mesti na fotografiji.
- **Ponovitev:** odpri študijo brez izbire tehnične podrobnosti, pomakni do Product details; preberi barvo neizbranega številčnega spana. Fokus/hover lahko spremeni stanje, zato ne meriti samo izbranega gumba.
- **Izvor:** `UlteriorTechnicalProof.tsx`, neaktivna veja številčnega spana `text-[#33333e]/60`; obstoječa izbrana veja ostaja ločena.
- **Najmanjši popravek:** dovolj temna osnovna barva številk. Ohraniti Ulteriorjevo lokalno paleto in način izbire.
- **Dokaz:** [03-ulterior-controls.png](./bauma-v3-accessibility-evidence/03-ulterior-controls.png), CSV in axe node podatki.

### A11Y-004 — vidne številke označenih točk niso vključene v dostopno ime

- **Ocena:** potrjena napaka. **Pomembnost P2**, isti lokalni funkcionalni prikaz.
- **Pot/element/stanje:** `/work/ulterior`, pet gumbov na fotografiji; vidni napis **»01«** itd., dostopno ime **»Select detail: Detachable hood«** itd., brez številke. Pri 375/1440, privzeto in izbrano stanje.
- **WCAG:** **2.5.3 Label in Name, A**. Številka je vidni identifikator posamezne točke, ne puščica ali abstraktna ikona. Besedni naslov v drugem seznamu ne nadomesti oznake neposredno na fotografskem gumbu. [W3C, SC 2.5.3](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html).
- **Ponovitev:** Tab do prve označene točke, primerjaj »01« na sliki z imenom v Chromiumovem dostopnostnem drevesu. Dostopni posnetek pokaže `button "Select detail: Detachable hood": "01"`.
- **Izvor:** `aria-label={Select detail: ${point.title}}` v `UlteriorTechnicalProof.tsx`. Podvojeni kontrolniki točka/seznam za isto podrobnost sami po sebi niso napaka.
- **Najmanjši popravek:** vključiti vidno številko v ime, npr. »01 — Detachable hood«, skladno tudi na pripadajoči vrstici. Nobenega vizualnega preoblikovanja.
- **Dokaz:** slika 03 in [ulterior-accessible-names.txt](./bauma-v3-accessibility-evidence/ulterior-accessible-names.txt). Dejanski glasovni ukaz v Voice Control ni bil preizkušen; neskladje imena je neposredno izmerjeno, uporabniškega odziva ne izmišljam.

### A11Y-005 — uporabniški razmiki odrežejo besedilo projektnih površin

- **Ocena:** potrjena napaka. **Pomembnost P2**, skupni projektni artwork na `/`, `/work`, `/pristop`, `/o-nas`.
- **Element/stanje:** posebej Flexido tekstovna površina; po začasni hkratni nastavitvi `line-height:1.5`, `letter-spacing:.12em`, `word-spacing:.16em`, razmik po odstavku `2em`. Preverjeno pri 320 in 1440. Privzeti prikaz ni označen kot napaka.
- **WCAG:** **1.4.12 Text Spacing, AA**. Del »Ne samo robot ob stroju.« izgine pod spodnjim robom; na drugih skupnih tekstovnih površinah pride tudi do rezanja zgornje vrstice. Živo HTML besedilo v kartici ni izvzeto samo zato, ker ima umetniško postavitev. Naslov projekta in klikljivost kartice ostaneta, vendar to ne vrne izgubljenega teksta.
- **Ponovitev:** `/work` pri 1440 → začasno uporabniško CSS pravilo z navedenimi štirimi vrednostmi → primerjaj prvo kartico. Meritev Flexido tekstovnega razpona po spremembi sega približno do y=866, spodnji clip rob površine pa do y=725.
- **Izvor:** `MiniSelectedWorkSurfaces.tsx`, `SURFACE`: fiksne višine `h-[18rem] / sm:h-[19rem] / lg:h-[21.25rem]` in `overflow-hidden`, notranji odstavki/flex porazdelitev. Uporablja se prek `MiniSelectedWorkHome.tsx` in `/work/page.tsx`.
- **Najmanjši popravek:** omogočiti, da se vsebina ob večjih razmikih razširi oziroma ostane v celoti vidna; ohraniti odobreno privzeto kompozicijo. Ne zmanjševati uporabniško zahtevanih razmikov in ne ovijati strani z globalnim tipografskim popravkom.
- **Dokaz:** [04-card-text-spacing.png](./bauma-v3-accessibility-evidence/04-card-text-spacing.png), privzeto levo in predpisani razmiki desno. [W3C, SC 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).

### A11Y-006 — samodejna sekvenca sistemske kocke preseže pet sekund

- **Ocena:** potrjena napaka glede omejitve samodejnega gibanja. **Pomembnost P2**, home instanca skupne komponente `SystemCubeB51`.
- **Pot/element/stanje:** `/`, kocka pri »Pod površino je sistem«, 1440 × 900, `prefers-reduced-motion:no-preference`. Po pomiku odseka v pogled brez nadaljnjega gibanja miške ali tipk se sekvenca samodejno sproži, medtem ko je vzporedno vidno besedilo. Ni vidnega uporabniškega kontrolnika za ustavitev te sekvence.
- **WCAG:** **2.2.2 Pause, Stop, Hide, A**: samodejen, ne bistven prikaz, daljši od petih sekund, ob drugi vsebini. Scroll v pogled ni namenska aktivacija gumba za predvajanje. Ne trdim, da mora biti izključena vsaka kratka ali neposredno sprožena animacija. [W3C, SC 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- **Ponovitev:** svež home, kazalec zunaj kocke → pomik odseka v pogled → brez nadaljnjega vnosa opazuj vsaj osem sekund. V meritvi: po 1 s `revealing`, 3 s `holding`, **5,2 s `returning`, reveal=.616**, 6,5 s še `returning`, 8 s `rest`.
- **Izvor:** `SystemCubeB51.tsx`: auto-entry pri `sequenceArmed && vis > .45`; `REVEAL_S=2.5`, `HOLD_S=1.25`, `RETURN_S=2.25` (osnovna časovnica 6 s, z umirjanjem dodatno). To ni neskončna animacija.
- **Najmanjši popravek:** avtomatsko sekvenco s celotnim vidnim zaključkom omejiti na največ pet sekund ali omogočiti uporabniško ustavitev. Ni predloga nove hero kompozicije ali odstranitve vseh kock.
- **Reduced motion:** deluje pravilno, ves osemsekundni vzorec ostane `mode=reduced`, `phase=open`, `reveal=.720`. To je uspešen vzorec, vendar ni dokaz, da običajni samodejni način izpolni časovno omejitev brez dodatne presoje mehanizma za ustavitev.
- **Dokaz:** [05-system-cube-autoplay.webm](./bauma-v3-accessibility-evidence/05-system-cube-autoplay.webm), [motion-evidence.json](./bauma-v3-accessibility-evidence/motion-evidence.json). Video vključuje začetni prihod na stran in pomik, JSON časi pa so relativni glede na prihod kocke v pogled.

### A11Y-007 — angleški funkcionalni prikaz podeduje slovenski jezik

- **Ocena:** potrjena napaka. **Pomembnost P2**, lokalni `UlteriorTechnicalProof`, možni širši vpliv pri njegovi ponovni uporabi v neangleškem dokumentu.
- **Pot/element/stanje:** `/work/ulterior`, angleški odstavki, imena kontrolnikov in dinamična tehnična razlaga. Najbližji `lang` je `html lang="sl"`; notranji prikaz nima `lang="en"`. Ne gre za pregled prevoda EN strani.
- **WCAG:** **3.1.2 Language of Parts, AA**. Celotni angleški stavki niso le lastno ime ali posamezen strokovni izraz. [W3C, SC 3.1.2](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html).
- **Ponovitev/dokaz:** pri odstavku »The hardshell brings together …« preveri najbližji `[lang]`; rezultat je `sl`. [language-evidence.json](./bauma-v3-accessibility-evidence/language-evidence.json), dostopni posnetek v TXT.
- **Izvor:** korenski element `UlteriorTechnicalProof.tsx` deklarira pisavo, ne jezika. Zunanja Baumina navodila in oznaka skupine so slovenska.
- **Najmanjši popravek:** `lang="en"` na notranji angleški koren prikaza; slovensko razlago in zunanjo skupino pustiti slovensko. Izgovorjava v dejanskem bralniku zaslona še ni testirana, manjkajoča oznaka v DOM pa je potrjena.

### A11Y-008 — kontrast nad fotografijami ni v celoti numerično potrjen

- **Ocena:** potrebno ročno preverjanje, **P2 za zaključek preverjanja**, ne potrjena kršitev. Skupni hero/closing vzorci.
- **Pot/element/stanje:** home hero, sekundarni ghost CTA in fotografski zaključki glavnih strani; 375/1440 in vzorčno pravi zoom. `background-color:transparent` ne predstavlja dejanske podlage: vplivajo fotografija, crop in več gradientnih plasti.
- **Kriterij:** **1.4.3 AA** za napise; po potrebi **1.4.11 AA** za pomembne meje/stanja. Na fotografskih primerih axe vrača tudi `incomplete`.
- **Ponovitev/dokaz:** primerjaj isti napis na relevantnih cropih, zajemi dejansko podlago pod potezami črk in upoštevaj prosojnost; ne meriti poljubnega pikslа drugje na fotografiji. [06-native-zoom200-home.png](./bauma-v3-accessibility-evidence/06-native-zoom200-home.png) je kontekstni dokaz, **ne numerični dokaz uspeha ali neuspeha**.
- **Izvor:** `MiniHeroPhotoBackground`, hero overlay plasti, `MiniContactPhoto.css`/`MiniContactNaturalMidnight.css`.
- **Najmanjši naslednji korak:** lokalna maskirana meritev najšibkejše podlage oziroma ročna Color Contrast Analyser presoja relevantnih cropov; le če odklon potrdi, najmanjši poseg v lokalni overlay/barvo. Odobrena kompozicija ni predlog za prenovo.

### A11Y-009 — povezava za preskok na glavno vsebino manjka

- **Ocena:** priporočilo, **P3**, skupna glava/okvir.
- **Pot/stanje:** 13 SL strani, začetek Tab zaporedja. Ni skip povezave; uporabnik gre skozi ponovljeno glavo. Obstajata semantični `main` in smiselni naslovi, zato same odsotnosti skip linka **ne razglašam za avtomatično kršitev**.
- **Referenca:** **2.4.1 Bypass Blocks, A**, kjer je treba presoditi razpoložljive mehanizme preskoka. [W3C, SC 2.4.1](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html).
- **Ponovitev/dokaz:** nov dokument → prvi Tab je logo, nato povezave glave; v DOM ni skip linka. Evidenca Tab in landmarkov.
- **Najmanjši smiseln dodatek:** ena ob fokusu vidna povezava na glavno vsebino z ustreznim ciljem. Potrjevanje popolne skladnosti kriterija zahteva še preizkus načina navigacije z dejanskim AT.

### A11Y-010 — dvojno ime landmarka v mobilnem prikazu Dema referenc

- **Ocena:** priporočilo, **P3**, lokalna komponenta; **axe best-practice opozorilo, ne samostojno potrjena WCAG kršitev**.
- **Pot/stanje:** `/work/dema-plus`, 375. Zunanja sekcija in notranji `role="region"` drsnik uporabljata isti `aria-labelledby` za Reference. ID sam ni podvojen; podvojeno je poimenovanje landmarkov.
- **Ponovitev/dokaz:** poglej `landmark-unique` v axe rezultatih in oba korena v `DemaPlusReferencesProof.tsx`. Pri desktopu notranja mobilna veja ni vidna.
- **Najmanjši popravek:** drsnik poimenovati natančneje, npr. »Drsni izbor referenc«, ob ohranitvi naslova sekcije; najprej potrditi uporabnost v seznamu landmarkov z bralnikom zaslona. Ne spreminjati postavitve.

## 5. Ročno preverjeni uspešni vzorci

### Fokus, tipkovnica in FLOW-001

- Na home in Flexido pri **375/1440**: Kontakt → Enter → aktivni **`h2#contact-heading`** → naslednji Tab **»Pošljite opis«**. Pogled ostane pri kontaktu. Naslov je programski cilj `tabIndex=-1`, ne nova stalna Tab postaja.
- Odsotnost obroča na programskem naslovu ni prijavljena kot napaka: položaj je namenoma prenesen, naslednji kontrolnik ima vidni fokus. Shift+Tab se vrne na predhodno povezavo, ne ustvari pasti. [07-flow001-fixed-flexido-375.png](./bauma-v3-accessibility-evidence/07-flow001-fixed-flexido-375.png) je pogled; [keyboard-evidence.json](./bauma-v3-accessibility-evidence/keyboard-evidence.json) dokazuje aktivni element.
- Escape v mobilnem meniju vrne fokus na hamburger in odklene drsenje. Tab in Shift+Tab ostaneta v območju glave/menija do zaprtja. `aria-expanded` in `aria-controls` kažeta na dejansko odprto/zaprto plast; dialog ima ime in `aria-modal=true`.
- Tab skozi vseh 13 strani pri obeh osnovnih dimenzijah ni zaznal kontrolnika, ki bi bil **v celoti** skrit pod 52 px glavo. To je preverjeni obseg **2.4.11 AA**, ne potrdilo, da noben piksel obroča nikoli ni prekrit pri vseh možnih pomikih. [W3C, SC 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
- Ulterior točke in vrstice imajo fokus, Enter izbere podrobnost, `aria-pressed` se posodobi. Točka in pripadajoča vrstica lahko obe kažeta isto izbrano podrobnost; to ni samo po sebi napaka. Govorna napoved spremenjenega opisa še ni testirana.
- Mobilne galerije so dosegljivi poimenovani regioni; ArrowRight spremeni `scrollLeft`: Ulterior **0→280**, Dema **0→253**, ArtBite **0→162 px** pri 375. Podatki se ne izgubijo samo zato, ker so izven začetnega vodoravnega pogleda. Fizični swipe ni preizkušen.

### Struktura in alternative

- Vseh 13 dokumentov: `lang=sl`, naslov dokumenta, en `main`, po en viden H1, brez zaznanih podvojenih ID-jev. Hierarhija Bauminih H2/H3 je razumljiva. Home H1 v dostopnostnem drevesu ni podvojen zaradi skrite mobilne/desktop veje.
- Glavna navigacija in pravne povezave imajo imena; logo, meni, projektne povezave in glavni CTA imajo dostopna imena. Ikon ne ocenjujem samo po vizualnem znaku brez konteksta imena.
- Na pregledanih izrisanih slikah ni manjkajočega atributa `alt`. Prazne alternative se pojavljajo tudi ob dekoraciji in vizualnih prikazih z opisnim zunanjim `role=img`; zato niso avtomatične napake. Smiselnost vsakega opisa po sliki in način branja kompleksnih rekonstrukcij ostajata del pregleda z bralnikom zaslona.
- Statične rekonstrukcije s prikazanimi nakupnimi/rezervacijskimi napisi niso obravnavane kot nedelujoči kontrolniki. Ulterior nakupni del ima izrecno pojasnilo, da plačilo ni omogočeno; ne ustvarja funkcionalne Tab poti do nakupa. Dejanski funkcionalni Technical Proof je presojan strožje in ločeno.

### Povečava, reflow in cilji

- Pri **320 CSS px** na vseh 13 straneh: širina dokumenta je 320; v pregledanih celotnih prikazih Baumina razlaga, noga in navigacija ostanejo dosegljive. Dema vmesni »Hotel …« elementi so v namerni pomični galeriji, ne dokaz izgube vsebine.
- Pri pravi **200 % povečavi** je na vseh 13 poteh `scrollWidth=innerWidth=720`. Neposredni Chromiumovi viewport zajemi kažejo dejansko povečano vsebino. Full-page izvoz prek Playwrighta je pri browser zoomu ustvarjal rezan raster; tega izvoza **nisem razglasil za napako strani**. Uporabljen je neposredni CDP zajem, DOM geometrija in potrjeni zoom faktor. [zoom-evidence.json](./bauma-v3-accessibility-evidence/zoom-evidence.json).
- Začasni text-only CSS stresni test povzroči rezanje predvsem v istih fiksnih artwork okvirjih. Ker to ni brskalniški text-only zoom, z njim ne prijavljam dodatne samostojne kršitve 1.4.4. Potrjeno rezanje pri standardiziranih razmikih je A11Y-005.
- Primarni cilji: hamburger **44×44**, mobilni zaključni CTA približno **144×52**, tehnične točke **44×44**, tehnične vrstice pri 375 približno **295×47,4 px**, pregledna povezava »Vsi projekti« visoka 44 px. Majhne pravne povezave so nižje, vendar dovolj ločene; logo/glava imata tudi razširjeno pseudo-elementno zadetno območje.
- **2.5.8 AA uporablja 24×24 CSS px oziroma navedene izjeme/razmake, ne univerzalnih 44 px.** Axe `target-size` je v osnovnih pregledih uspešen; vzorčna ročna presoja razmikov ni našla dodatne potrjene napake. To ni meritev vsakega možnega zadetnega položaja na telefonu. [W3C, SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### Reduced motion

- Sistemska kocka ostane pri `reduced` skozi osem sekund; ni neskončnega samodejnega gibanja v tem načinu. Projektna kocka in hero povezane dekorativne komponente imajo namensko reduced-motion vejo tudi v izvoru.
- Home kartica: običajno `translateY(-3px) / .15 s`; reduce **none / 0 s**. Razkrivanje površin v reduced načinu nima aktivnih animacij. Za puščico je izključena transformacija; kratka sprememba barve ni enaka gibanju in ni prijavljena kot napaka.
- Kontakt pri običajni nastavitvi po 50 ms še pomika, po 1000 ms je na cilju. Pri reduce je že po 50 ms na končnem `scrollY=2937`, fokus v obeh primerih na kontaktnem naslovu.
- A11Y-006 se nanaša samo na daljšo avtomatsko običajno sekvenco, ne na vse hoverje, kratke reveale ali uporabniško sprožene premike. Hero kompozicija ostaja zunaj vizualnega ponovnega oblikovanja.

## 6. Razlaga avtomatskih rezultatov

[axe-results.json](./bauma-v3-accessibility-evidence/axe-results.json) vsebuje stabilno ponovitev 26 pregledov (13×2) z A/AA WCAG 2/2.1/2.2 oznakami in best-practice pravili. Posamezen pregled ima 37–44 uspešnih in 46–53 neuporabljivih pravil; uspeh pravila ni potrdilo vseh ročnih kriterijev.

- Skupaj je v stabilnih ponovitvah **97 pojavitev vozlišč v violations**, večinoma ponovljeni kontrasti, in **272 pojavitev v incomplete**. To **ni 97 dejanskih različnih napak** niti 272 potrjenih kršitev. Isti caption, številka ali komponenta se ponovi pri obeh širinah.
- Ročno potrjeni kontrastni vzorci so A11Y-001/002/003. Axe ne odkrije vseh ročno najdenih težav z jezikom, imeni, časovnico ali uporabniškimi razmiki.
- Številke storitvenega in procesnega seznama ter Dema thumbnaila so v kontekstu redundantno dekorativno oštevilčenje; pomen ohranijo strukturirani seznam, naslovi in vidni podatki. Njihove kontrastne zaznave niso štete kot dodatne vsebinske kršitve samo zaradi številke. Odločitev temelji na vlogi, ne zgolj `aria-hidden`.
- Začasna manjša opacity med razkrivanjem Flexido površine je v prvem avtomatskem prehodu dala kontrastni alarm; v stabilnem stanju ni potrjen. Ta prehodni izpis ni predstavljen kot trajni kontrast kartice.
- Statični prikazi vsebujejo tudi nizek kontrast drobnih navideznih oznak, npr. ES v nefunkcionalnem naročniškem headerju in podatek o zalogi v prikazu plačila. Zajem pomembnih podatkov v okviru celotne statične slike, izjeme za neaktivni UI/dekoracijo in alternativni opis zahtevajo kontekstno presojo; **ne deklariram, da ima vsak HTML znak v rekonstrukciji avtomatično izjemo**. Neštevilčeni statični deli niso bili predmet popolnega ločenega WCAG audita naročniških spletišč.
- `landmark-unique` je A11Y-010 best-practice priporočilo. Kontrastno opozorilo pri odprtem meniju je zadevalo osnovni Pristop tekst v DOM, ne napačno barvo menijskega CTA; ne štejem ga drugič.
- `incomplete` vključuje fotografske podlage, prekrivanje in druge primere, kjer algoritem ni mogel zaključiti. Za fotografije velja A11Y-008; druga incomplete vozlišča niso v celoti individualno zaključena. `inapplicable` pomeni, da pravilo v pregledanem stanju ni imelo ustreznega kandidata, ne da je bilo vizualno potrjeno.
- Next razvojni indikator in njegova orodja so izločeni iz presoje strani. Posnetki ga lahko vsebujejo; njihovega tipkovničnega ali kontrastnega vedenja ne pripisujem Baumi.

## 7. Prednostni popravki pred objavo

1. **A11Y-001:** dovolj kontrastni podpisi na vseh dejanskih case ozadjih; pomembni so tudi za razlikovanje rekonstrukcije od funkcionalnega prikaza.
2. **A11Y-005:** preprečiti izgubo besedila skupnih kartic pri predpisanih uporabniških razmikih, brez spremembe privzete kompozicije.
3. **A11Y-003/004/007:** trije lokalni popravki istega funkcionalnega prikaza Ulterior — številčni kontrast, številka v dostopnem imenu in jezik angleškega notranjega korena.
4. **A11Y-006:** omejiti daljšo samodejno sekvenco kocke ali dodati smiseln mehanizem za ustavitev; ohraniti uspešen reduced motion.
5. **A11Y-002:** majhna lokalna kontrastna rezerva za dve mejni oznaki. A11Y-008 pred objavo numerično/ročno dokončati, ne izvajati hipotetičnega posega v odobrene fotografije.

A11Y-009/010 sta priporočili za lažjo navigacijo, ne razlog za večjo prenovo. Popravljenega FLOW-001 ne odpirati ponovno kot napako.

## 8. Safari, dejanski bralnik zaslona in omejitve

Za ločen pregled Safari/VoiceOver in po možnosti NVDA/Firefox ostane:

- ali je prenos fokusa na `h2#contact-heading` pravilno napovedan, naslednji Tab smiseln in Escape še vedno obnovi hamburger;
- izolacija modalnega menija v virtualnem kazalcu, navigacija po landmarkih in prehod med ponovljenimi območji;
- branje `aria-pressed`, predogleda ob fokusu in dinamičnega opisa tehnične točke ter jezikovni preklop;
- razumevanje kompleksnih `role=img` rekonstrukcij, kakovost izbranih alt opisov in skritih odzivnih vej;
- povečava/text-only povečava, predpisani razmiki, vodoravne galerije in zadetna območja na fizičnem iPhonu.

Natančne omejitve:

- Ni preizkusa dejanskega bralnika zaslona, glasovnega upravljanja, brajice, fizičnega dotika, Safari/Firefox, sistemskih visokokontrastnih nastavitev ali vseh povečav. Drevo je dokaz izpostavljene semantike, ne dokaz izgovorjave.
- Prava browser povečava je testirana pri 200 %, **320 CSS px pa je približek reflowa pri 400 % iz začetnih 1280 px**, ne izvedena 400 % povečava. Različni višini pogleda in vsi kratki landscape telefoni niso testirani.
- Numerični kontrasti so zanesljivi za navedene enobarvne podlage. Fotografske maske in vseh 272 ponovljenih incomplete pojavitev niso v celoti ročno zaključene. Nobene fotografije ne označujem kot skladne samo po občutku ali odsotnosti axe alarma.
- Test razmikov je začasna sprememba samo v brskalniškem DOM na navedenem vzorcu, brez spremembe virov. Hkratno preizkušanje vseh kombinacij povečave, razmikov, različnih pisav in sistemskih nastavitev ni izvedeno.
- Pri časovnici je podrobno izmerjena home sistemska kocka in vzorčno kartice/pomik; ni popolne časovne analize vsake dekorativne animacije vseh labov. Odsotnost zaznanega neskončnega gibanja ni pregled vseh možnih interakcij.
- EN/IT, objavljeni staging, pravna pravilnost ter celotna skladnost naročniških spletišč niso pregledani. Statičnih prikazov ne enačim z živimi naročniškimi aplikacijami; lokalne dejanske ovire v funkcionalnem prikazu pa so zapisane.
- Mailto ni aktiviran; ni poslanega sporočila, osnutka, oddanega obrazca, rezervacije ali nakupa.

Ustvarjeni so samo to poročilo in ciljna dokazna podmapa. Izvorna koda, obstoječe necommitane spremembe in labi, prejšnja poročila, HEAD in Git staging ostanejo nespremenjeni. Nič ni commitano, pushano ali deployano.
