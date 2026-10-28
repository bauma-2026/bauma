# BAUMA V3 — Audit 02: uporabniške poti in CTA-ji

Datum: 25. 10. 2026. Strokovni read-only pregled obstoječih slovenskih poti. Namen strani: relevantno povpraševanje po e-pošti. Brez testiranja z resničnimi uporabniki, merjenja konverzij ali implementacije.

## 1. Osnova, obseg in metoda

- Dejanski projekt: `/Users/bauma/Applications/projects/bauma-portfolio` (macOS pot lahko izpiše `Applications/Projects`). Pripeta `/Users/bauma/bauma-portfolio` ni dejanski repozitorij.
- Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**.
- Pred začetkom pregledana lokalna navodila: v projektu in preverjeni verigi nadrejenih map ni `AGENTS.md`/`CLAUDE.md`; `.claude/launch.json` določa lokalni strežnik na 3000. Prebrani obe zahtevani poročili: `bauma-v3-visual-verification-codex.md` in `bauma-v3-fixes-implementation.md`.
- Lokalno stanje ima **15 spremenjenih tracked datotek** ter številne necommitane/nepovezane datoteke in labe. Vključuje odobrene hoverje ter popravke Flexido odmika, fokusa uvodnih povezav, dviga kartic na Pristop/O nas in puščice »Vsi projekti«. Prejšnjih ugotovitev nisem ponovno prijavljal kot odprtih napak.
- Uporabljen že delujoči **`http://localhost:3000`**, lokalni Next dev. Objavljeni staging ni bil predmet tega audita in rezultat ni potrditev njegovega stanja.
- Brskalnik: lokalni Playwright **Chromium 151.0.7922.34**, headless, macOS, DPR 1. Desktop **1440 × 900**, mobilni pogled **375 × 812** z `isMobile`/`hasTouch`. Pri mobilnem izboru kartic in povezav uporabljeni tudi emulirani tapi. Druge širine niso bile potrebne za potrjeno ugotovitev.
- Glavni obseg: `/`, `/work`, `/pristop`, `/o-nas` in vseh šest `/work/*`. Tri SL pravne strani samo za povezave, vrnitev in kontaktno sidro. EN/IT nista pregledana.
- Prebrana dejansko izrisana besedila, cilji in semantika povezav. Izvedeni kliki, Tab/Enter, Escape, Nazaj in pomiki; privzeta animacija pomika je počakana pred oceno sidra. Meritve fokusa ločujejo vidni pomik od mesta nadaljevanja s Tab.
- `mailto` povezave so prebrane, dekodirane in dosežene s Tab, **niso aktivirane**. Nobena pošta ni poslana, osnutek ni ustvarjen, obrazec ni oddan in nakup ni sprožen. Na zunanjih straneh je preverjeno samo odprtje začetnega cilja.

Dokazi: [bauma-v3-user-flow-cta-evidence](./bauma-v3-user-flow-cta-evidence/). Poročilo in sedem ciljnih slik so edini novi projektni artefakti; začasni skripti in podrobni delovni zapisi so zunaj repozitorija.

## 2. Glavni rezultat

**Glavne vsebinske poti podpirajo email-first sodelovanje.** Ponudba, konkretne izvedbe in začetni korak so razloženi. Med pregledanimi notranjimi povezavami ni bil ugotovljen napačen cilj ali slepa ulica. Statičnih rekonstrukcij ob obstoječih podpisih ne razglašam za nedelujočo navigacijo.

**Ena potrjena ovira: FLOW-001.** Kontakt v glavi pravilno pomakne pogled, vendar pri tipkovnični uporabi ne prenese nadaljevanja fokusa do kontakta. Naslednji Tab lahko obiskovalca vrne v uvod. To je ozka interakcijska napaka, ne razlog za spremembo kompozicije ali kontaktnega modela.

## 3. Scenariji

### 1 — Nov obiskovalec: od ponudbe do relevantnega projekta in kontakta

**Vstop / cilj:** `/`; razumeti ponudbo, videti izvedbo in pripraviti prvo sporočilo. Prehojeno pri 375 in 1440.

**Dejanski koraki:** home → »Kaj delamo ↓« → `/#kaj-delamo` → štiri storitvene vloge → izbor projektov → kartica Odstrani Tattoo → `/work/odstrani-tattoo` → Kontakt v glavi → `/work/odstrani-tattoo#contact` → »Pošljite opis« (preverjen mailto, brez aktivacije).

**Rezultat:** hero poimenuje spletne strani; podporni stavek navede strukturo, vsebino, oblikovanje, razvoj in objavo. »Kaj lahko uredimo za vas« razloži zasnovo, izvedbo, digitalne materiale in vzdrževanje. Kartice imajo imena in opise; odprejo študije, ne naročniških strani. Pod naslovom izbrane študije je pojasnjen Baumin prispevek. Kontakt in končna e-poštna povezava sta dosegljiva. »Za začetek« dodatno pove, naj obiskovalec opiše, kaj želi urediti ali kaj na obstoječi strani ne deluje.

**Ovire:** pri kliku/tapu ni potrjene blokade. Pri tipkovničnem Kontaktu v glavi velja FLOW-001. Sam obstoj dveh korakov Kontakt → Pošljite opis ni napaka: prvi pokaže kontaktno območje, drugi določa e-poštno dejanje.

### 2 — Obiskovalec brez izdelanega načrta

**Vstop / cilj:** `/`; razumeti, kaj zadostuje za začetek, brez popolnega briefa.

**Dejanski koraki:** home → »Za začetek / Ni treba, da imate že vse razdelano.« → »Kako sodelujemo →« → `/pristop` → uvod in faza »Začetek« → Kontakt → lokalni `#contact` → »Pošljite opis«. Posebej preverjena tudi povezava Pristop v glavi oziroma mobilnem meniju.

**Rezultat:** uvod izrecno pravi, da zadostuje nekaj stavkov in da ni treba imeti vsega pripravljenega. Faza Začetek pove, naj obiskovalec pošlje, kar že ima: obstoječo stran, besedila, slike ali primere; Bauma nato po e-pošti razjasni vprašanja. Obseg in ponudba sledita razjasnitvi, ne obratno. Klic oziroma sestanek je omenjen kot možnost po potrebi. Tudi manjši delni poseg je razumljiv iz odseka Obseg.

**Ovire:** vsebinske ovire nisem potrdil. Ne predlagam novega obrazca ali seznama obveznih podatkov. Tipkovnični Kontakt ima FLOW-001. [Dokaz uvoda in začetka](./bauma-v3-user-flow-cta-evidence/02-pristop-first-step-375.png).

### 3 — Dokaz izvedbe: `/work` → študija → nadaljevanje/kontakt

**Vstop / cilj:** `/work`; presoditi konkretno delo in Baumin delež. Pri obeh dimenzijah so bile aktivirane vse šestere kartice, v vsaki študiji pa »Vsi projekti«, prejšnji in naslednji projekt.

**Dejanski koraki za vsako študijo:** `/work` → kartica projekta → uvod in dokazi → prejšnji/naslednji projekt → Nazaj → prvotna študija → »Vsi projekti →« → `/work`; dodatno Kontakt → lokalni `#contact` → pregled končnega e-poštnega CTA.

| Študija | Razumljiv obseg iz vidnega uvoda | Dokazi, meje statičnega prikaza in nadaljevanje |
|---|---|---|
| Flexido | Zasnova in razvoj strani z dvema vstopoma v ponudbo; meta navede strukturo, oblikovanje in razvoj v SL/EN/DE. | Ločena razlaga poti po procesu in po izdelkih. Podpisa izrecno povesta, da statične puščice in kartice niso povezave. Prejšnji Hardshelljacket, naslednji Ulterior. |
| Ulterior | Struktura, oblikovanje in razvoj spletne strani ter namenskega nakupnega sistema. | Uvodna rekonstrukcija, dejansko interaktivne tehnične podrobnosti in ločeno pojasnjen nakupni sistem. Podpis nakupnega prikaza izrecno pove, da plačilo tu ni omogočeno. Prejšnji Flexido, naslednji Odstrani Tattoo. |
| Odstrani Tattoo | Zasnova in razvoj strani, ki najprej pojasni postopek odstranjevanja; meta navede strukturo, oblikovanje in razvoj. | Bauma razloži zaporedje informacije → odločitev; rekonstrukcija postopka in rezultatov ima podpise, rezultatni prikaz je označen kot statičen. Prejšnji Ulterior, naslednji Dema Plus. |
| Dema Plus | Zasnova in razvoj strani, kjer imajo prednost projekti in reference; meta navede strukturo, oblikovanje in razvoj. | Uvod in reference sta podpisana kot rekonstrukciji; Bauma posebej pojasni prednost konkretnih izvedb pred področji dela. Mobilna galerija je ločen vodoravni prikaz, navidezne projektne oznake niso prave povezave. Prejšnji Odstrani Tattoo, naslednji ArtBite. |
| ArtBite | Zasnova in razvoj strani tattoo studia s poudarkom na fotografijah in osebnem pristopu. | Bauma razloži galerijo ter ločeno predstavitev prekrivanja tetovaž. Vsak prikaz ima podpis rekonstrukcije. »Rezerviraj termin« in »Pošlji fotografijo za oceno« sta del naročniškega prikaza, ne Baumina CTA-ja. Prejšnji Dema Plus, naslednji Hardshelljacket. |
| Hardshelljacket | Enostranska predstavitev izdelka; meta natančneje navede **strukturo in razvoj**, brez pripisovanja oblikovanja. | Uvod razloži namen nakupne povezave na Ulterior in B2B kontakta znamke. Trije prikazi so podpisane rekonstrukcije. Prejšnji ArtBite, naslednji Flexido. |

**Rezultat:** cilji vseh pregledanih projektnih povezav ustrezajo oznakam; krožni prejšnji/naslednji vrstni red se ujema z indeksom. Vsaka študija omogoča vrnitev v izbor in lokalni kontakt. Po Nazaj iz študije se indeks vrne na ohranjen položaj v preverjenih primerih; prikazi projektov so ponovno dosegljivi.

**Interaktivni dokaz Ulterior:** vseh pet označenih točk in pet pripadajočih vrstic spremeni izbrano podrobnost pri kliku v obeh dimenzijah. Tab doseže točke, Enter po končanem odzivu izbere podrobnost, naslednji Tab prikaže naslednjo. Neaktivni nakupni prikaz nima pravega gumba ali povezave za plačilo. [Interaktivna točka](./bauma-v3-user-flow-cta-evidence/05-ulterior-interactive-detail-375.png), [statični nakupni prikaz s podpisom](./bauma-v3-user-flow-cta-evidence/04-ulterior-static-payment-and-caption-1440.png).

**Ovire:** konkretnega dokaza, da bi statični prikazi ustvarjali napačno pričakovanje navigacije, nisem potrdil. Vidna naročniška akcijska besedila sama ob podpisanem prikazu niso dovolj za prijavo napake. Rekonstrukcij ne predlagam preoblikovati. [Primer izrecnega statičnega podpisa Flexido](./bauma-v3-user-flow-cta-evidence/06-flexido-static-caption-1440.png). Pri tipkovnični poti prek Kontakta v glavi velja FLOW-001.

### 4 — Neposreden vstop na študijo

**Vstop / cilj:** vsaka od šestih `/work/*` kot prva lokalna stran v novi ločeni brskalniški seji, brez predhodnega obiska home; razumeti kontekst in nadaljevati.

**Dejanski koraki:** neposreden URL → oznaka »Case / ime« in uvod → Bauma glava z Work/Pristop/O nas (na mobilnem prek menija) → Kontakt na isti študiji. Ločeno preverjene povezave do indeksa ter sosednjih projektov iz scenarija 3. Vstop brez referrerja je potrjen za vseh šest študij pri obeh dimenzijah.

**Rezultat:** uvod pove, za koga in kaj je Bauma izdelala; naročniška domena je ločena zunanja povezava. Bauma logo vodi na `/`, Work na `/work`, Pristop na `/pristop`, kjer je pojasnjeno sodelovanje. Ponudba je dosegljiva prek home; dodatna povezava do vsake storitve v vsaki študiji ni potrebna. Kontakt ne pošilja obiskovalca nazaj na home, temveč na zaključek iste študije.

**Ovire:** ni potrjene orientacijske slepe ulice. FLOW-001 se ponovi po tipkovnični izbiri Kontakta. Daljše študije ne potrebujejo novega CTA v vsakem odseku samo zaradi dolžine.

### 5 — Obiskovalec, pripravljen pisati

**Vstop / cilj:** katerakoli od desetih glavnih strani; najti pravilen kontakt in začeti e-pošto.

**Dejanski koraki:** Kontakt v glavi/mobilnem meniju → lokalni kontaktni zaključek → »Pošljite opis«; na home tudi »Opišite projekt« → `#contact`. Dodatni neposredni poti sta `info@bauma.si` v nogi vseh desetih strani in `gregor@bauma.si` v podpisu na `/o-nas`.

**Rezultat:** pri kliku so ciljni naslov in gumb vidna pod 52 px fiksno glavo. Kontaktno sidro je blizu konca dokumenta, zato se zaradi doseženega dna ne poravna nujno na vrh pogleda; to ni rezanje vsebine. »Pošljite opis« je dosegljiv s Tab. Home **primarni hero CTA je navadna sidrna povezava**: po Enter naslednji Tab pravilno doseže »Pošljite opis«; ta uspešna pot ni enaka pokvarjenemu vedenju Kontakta v glavi.

**Ovire:** FLOW-001. Pravilnost mailto je potrjena, dejansko odprtje uporabnikovega poštnega programa in dostava pošte sta **nepreverjena**. Vidni naslov v nogi omogoča tudi prepis oziroma kopiranje v izbrani poštni vmesnik. Odsotnost kontaktnega obrazca ni napaka tega modela.

## 4. Potrjena ugotovitev

### FLOW-001 — Kontakt v glavi pomakne pogled, nadaljevanje fokusa pa ostane zadaj

- **Ocena:** potrjena napaka.
- **Pomembnost:** srednja, **P2**; prednostni manjši popravek pred objavo za tipkovnično pot do glavnega cilja.
- **Pot/širina/element:** neposredno ponovljeno na `/`, `/pristop`, `/work/flexido`, **375 × 812 in 1440 × 900**, Kontakt v glavi oziroma mobilnem meniju. Skupni vzrok velja za same-page fragmentno vejo glave tudi na drugih straneh z lastnim kontaktom; naslednji Tab ni bil ločeno ponovljen na vsaki preostali študiji. Cross-page Kontakt s pravnih strani ni na podlagi te ugotovitve označen kot pokvarjen.
- **Pričakovano:** po tipkovnični izbiri Kontakt je pogled pri kontaktu in zaporedje tipkovnice omogoči smiselno nadaljevanje do »Pošljite opis«, brez vračanja v prejšnjo vsebino.
- **Dejansko:** pogled pravilno doseže zaključek, aktivna povezava ostane Kontakt v glavi. Mobilni meni se zapre in fokus obnovi na sprožilec menija. Naslednji Tab se nadaljuje iz glave namesto iz kontaktnega območja.
- **Konkretna ponovitev na Flexido:**
  1. Neposredno odpri `/work/flexido`.
  2. Desktop: s Tab dosezi Kontakt in pritisni Enter. Mobilno: s Tab/Enter odpri meni, s Tab dosezi Kontakt, Enter.
  3. URL je `/work/flexido#contact`, naslov in gumb sta vidna. Desktop naslov približno y=482, CTA y=599; mobilno naslov y=425, CTA y=511.
  4. Pritisni Tab. Fokus pristane na **`https://flexido.eu/` v uvodu**, dokument skoči na scrollY=0 in kontakt izgine iz pogleda.
- **Dodatni ponovitvi:** na home naslednji Tab doseže hero »Opišite projekt« (namesto končnega mailto); na Pristop doseže prvo projektno kartico pred zaključkom. Ne gre za odsoten fokusni obroč, temveč napačno mesto nadaljevanja.
- **Izvor:** `app/components/blocks/mini/MiniHeader.tsx`, `scrollToFragment` (okoli 75–90) kliče `scrollIntoView` in `history.pushState`, ne prenese fokusa ali začetka tipkovničnega nadaljevanja. `useMobileMenuChrome` ob zaprtju/cleanup (okoli 235–242) obnovi fokus na sprožilec tudi pri izbiri kontaktnega sidra.
- **Najmanjši smiseln popravek:** samo pri aktivaciji kontaktnega sidra smiselno prenesti fokus na kontaktni naslov/območje ali končni CTA po zaprtju menija; ob tej namenski navigaciji preprečiti, da ga obnovitev menija prepiše. Običajno zapiranje menija z Escape ali gumbom naj še naprej vrača fokus na sprožilec. Ne spreminjati postavitve, ciljnega e-poštnega naslova ali dodajati obrazca.
- **Sprejemni kriterij za poznejši popravek:** isti koraki na desktopu in mobilno; po Enter in naslednjem Tab ostane uporabnik pri kontaktu ter lahko doseže mailto. Escape brez navigacije še vedno vrne fokus na meni, drsenje se odklene; home native hero sidro ostane pravilno.
- **Dokaz:** [375 — Enter in naslednji Tab](./bauma-v3-user-flow-cta-evidence/01-flow001-contact-tab-375.png), [1440 — Enter in naslednji Tab](./bauma-v3-user-flow-cta-evidence/01-flow001-contact-tab-1440.png). Leva polovica prikazuje stanje po Enter, desna po enem dodatnem Tab.

Ni dodanih dodatnih FLOW ugotovitev samo zaradi števila. Morebitna učinkovitost besedila, angleške besede »Work« ali vrstnega reda CTA-jev brez uporabniških podatkov ni predstavljena kot dokazana ovira.

## 5. Glavni CTA-ji in dejanski cilji

| Oznaka | Lokacija | Dejanski cilj | Rezultat |
|---|---|---|---|
| Kontakt | Home glava in mobilni meni | `/#contact` | Vidni pomik pravilen; tipkovnično nadaljevanje FLOW-001. |
| Kontakt | `/work`, `/pristop`, `/o-nas`, šest študij | `#contact` na trenutni strani | Sidro obstaja in zaključek je viden; skupna fokusna omejitev zgoraj. |
| Opišite projekt | Home hero | `#contact` | Pomik pravilen; Enter → naslednji Tab doseže Pošljite opis. Ne odpre obrazca ali pošte neposredno. |
| Kaj delamo ↓ | Home hero | `#kaj-delamo` | Odpre storitveni odsek pod glavo; mobilni H2 približno y=145. Nazaj vrne začetni home. |
| Projektne kartice | `/work` (6), home/Pristop/O nas (3) | Ustrezni `/work/{slug}` | Vsi cilji preverjeni pri obeh dimenzijah; aktivacija tudi s Tab/Enter na izbrani kartici in emuliranim tapom. |
| Vsi projekti → | Home, Pristop, O nas; šest študij | `/work` | Pravilna vrnitev v indeks. |
| Kako sodelujemo → | Home, odsek Za začetek | `/pristop` | Pravilna predstavitev začetka sodelovanja. |
| Prejšnji / Naslednji projekt | Šest študij | Ustrezni sosednji `/work/{slug}` | Vseh 12 usmerjenih povezav preverjenih pri obeh dimenzijah; krožna navezava pravilna. |
| Pošljite opis | Zaključek vseh 10 glavnih strani | `mailto:info@bauma.si?subject=Povpra%C5%A1evanje%20za%20projekt` | Naslov in dekodirana zadeva pravilna; telo ni določeno; aktivacija poštnega programa nepreverjena. |
| info@bauma.si | Noga vseh 10 glavnih strani | `mailto:info@bauma.si` | Pravilen naslov, brez zadeve in telesa. |
| gregor@bauma.si | Podpis na `/o-nas` | `mailto:gregor@bauma.si` | Ustreza vidnemu osebnemu naslovu; brez zadeve in telesa. Ni zamenjan z generičnim CTA. |
| Ime naročniške domene ↗ | Uvod vsake študije | Zunanja domena iz tabele spodaj | Ustrezen namen, `_blank`, `rel="noopener noreferrer"`, obvestilo o novem zavihku v dostopnem besedilu. |

**Dekodiranje glavnega mailto:** prejemnik `info@bauma.si`; zadeva **»Povpraševanje za projekt«**; parametra `body`, `cc`, `bcc` niso določeni. Na vseh desetih straneh isti glavni projektni CTA. Prazen vnaprejšnji body ni napaka: navodilo za kratek opis je na strani, obvezni predizpolnjeni brief ni predviden.

| Zunanja povezava | Dejanski odprti cilj | Preverjanje |
|---|---|---|
| flexido.eu | `https://www.flexido.eu/` (preusmeritev iz `https://flexido.eu/`) | Odpre predstavitev Flexido v novem zavihku; Bauma ostane odprta. |
| ulterior.es | `https://ulterior.es/` | Odpre Ulterior; brez izbire izdelka ali nakupa. |
| odstranitattoo.si | `https://odstranitattoo.si/` | Odpre stran laserskega odstranjevanja tetovaž. |
| demaplus.si | `https://demaplus.si/` | Odpre Dema Plus. |
| artbite-tattoo.com | `https://artbite-tattoo.com/` | Odpre ArtBite Tattoo Studio. |
| hardshelljacket.com | `https://hardshelljacket.com/` | Odpre predstavitev Hardshelljacket. |

Vseh šest je dejansko odprtih z Bauminim linkom pri desktop dimenziji; pravilno prebrani cilji/target/rel so enaki tudi v mobilnem prikazu. Odprtje in naslov strani ne potrjujeta celotnega delovanja zunanjega spletnega mesta. Na njem ni bilo nadaljnjih dejanj.

## 6. Meni, sidra, Nazaj in pravne strani

- **Mobilni meni:** pri 375 × 812 odpre pogovorno plast; `aria-expanded=true`, drsenje ozadja se zaklene. Preverjeno na home zunaj prehodne hero faze, `/pristop`, `/work/flexido`, `/piskotki`.
- Escape vrne fokus na sprožilec in obnovi prejšnji položaj; nadaljnji pomik dejansko deluje. Primer: Pristop pred odprtjem scrollY=450, po zaprtju 450, po pomiku 800; home 950 → 950 → 1300. Ponovni pritisk gumba prav tako zapre meni.
- Izbor Pristop zapre meni in odpravi `body overflow:hidden`, tudi ko gre za trenutno stran. Izbira Kontakta zapre meni in pravilno pomakne pogled; naslednji Tab ima FLOW-001.
- Tab cikel odprtega menija ostaja med glavo in menijem: Pristop → Work → O nas → EN → Kontakt → logo → sprožilec → Pristop. EN ni aktiviran ali vsebinsko pregledan. Escape iz cikla vrne fokus na sprožilec. [Dokaz menija](./bauma-v3-user-flow-cta-evidence/03-mobile-menu-375.png).
- **Sidra:** `#kaj-delamo`, `#contact` in pravni `#podatki-podjetja` obstajajo. Preverjeni ciljni naslovi/gumbi niso skriti pod glavo. Pravna povezava Podatki podjetja iz Piškotkov odpre `/pogoji-uporabe#podatki-podjetja`; pri 375 je cilj približno y=80, pod 52 px glavo.
- **Nazaj:** po home storitvenem/hero sidru povrne `/` in začetni položaj. Po vstopu iz indeksa v vsako študijo vrne `/work` in položaj indeksa; po prejšnjem/naslednjem vrne izvorno študijo. To je testirano v lokalni seji z brskalniško zgodovino, ne zagotovilo za vse naprave ali zunanje aplikacije.
- **Pravne strani:** noga odpre `/pogoji-uporabe`, `/zasebnost`, `/piskotki`; vse vrnejo 200. Iz vsake je preverjena vrnitev prek Work ter Kontakt na `/#contact` na home, tudi z mobilnim menijem. Logo ostaja povezava na `/`. Pravna vsebina ni ocenjevana.

## 7. Prednost pred objavo in uspešne poti

**Edina potrjena prednostna ugotovitev je FLOW-001:** urediti fokus po Kontaktu v glavi in namenskem zaprtju mobilnega menija. Ponoviti Enter → Tab pri 375/1440; ob tem ohraniti uspešno obnovitev fokusa z Escape.

Uspešno preverjeno: razumevanje ponudbe → projekt → kontakt; začetek brez pripravljenega briefa; vseh šest vstopov iz indeksa; vseh šest neposrednih vstopov; krožna projektna navigacija in vrnitev v indeks; pravilni mailto naslovi/zadeva; delujoči Ulterior tehnični prikaz; meni in obnovitev drsenja; dosegljivost pravnih strani in vrnitev.

Ni priporočila za nove storitve, cenik, obrazec, rezervacijo termina, popup, prodajni kanal ali novo hero kompozicijo. Nobene domnevne spremembe konverzij ne pripisujem ugotovitvi.

## 8. Omejitve in evidenca ohranitve

- Strokovni pregled ene lokalne različice; ni opazovanja resničnih obiskovalcev ali podatkov o uspešnosti. »Razumljivo« pomeni strokovno presojo konkretnega vidnega besedila, ne dokazan odziv uporabnikov.
- Samo Chromium na macOS pri navedenih dimenzijah. Mobilni tap je emulacija; fizični iPhone/Android, Safari/Firefox, bralnik zaslona, zoom ter sistemske nastavitve dostopnosti niso preverjeni.
- Testiran je dejanski Tab pri ključnih notranjih poteh, Kontaktu, končnem mailto, meniju in tehničnih točkah; to ni popoln audit vseh možnih zaporedij, Shift+Tab kombinacij ali dostopnosti celotnega spletnega mesta.
- Dejanski zagon uporabnikovega poštnega odjemalca, prijava v webmail in dostava sporočila so nepreverjeni. E-poštni CTA ni bil aktiviran niti prestrežen v osnutek.
- Statična nakupna in rezervacijska besedila v rekonstrukcijah niso aktivirana. Pregled semantike in podpisov ni test vseh naročniških funkcij. Vodoravni prikazi niso preizkušeni z vsakim fizičnim swipe vzorcem.
- Staging, EN, IT, kakovost prevodov, pravna pravilnost in sistemi naročnikov so zunaj tega audita. Lokalnih necommitanih sprememb ne enačim z deployem.
- Dokazni posnetki lahko vključujejo razvojni indikator Next »N«; ta ni del ugotovitve. Primerjave FLOW-001 so zaporedni izvirni zajemi istega pogleda z oznakama zunaj vsebine strani.
- Izvorna koda, obstoječe necommitane datoteke, prejšnja poročila, HEAD in Git staging so ohranjeni. Dodana sta samo to poročilo in njegova dokazna podmapa; nič ni commitano, pushano ali deployano.
