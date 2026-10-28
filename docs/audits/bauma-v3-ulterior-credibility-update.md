# BAUMA V3 — Ulterior: predstavitev razvoja in nakupnega sistema

Datum: **27. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Sprememba je lokalna in necommitana. Gostovanje in okolja niso spremenjeni; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen. `ulterior-next` je ostal nedotaknjen (samo branje, brez zagona skriptov, brez dostopa do `.env*`, baze ali PayPala). Brez nakupa, rezervacije, plačila ali drugih zapisovalnih zahtev. Dokazi: [bauma-v3-ulterior-credibility-evidence](./bauma-v3-ulterior-credibility-evidence/).

## 1. Izvedeno: uvodni lead (`app/work/ulterior/page.tsx`)

Zamenjano (prej: »Za Ulterior smo zasnovali in razvili spletno stran s produktno predstavitvijo, interaktivnimi tehničnimi podrobnostmi in namenskim nakupnim sistemom.«):

> Za Ulterior smo zasnovali in razvili spletno stran, ki povezuje predstavitev izdelka, interaktivno raziskovanje tehničnih podrobnosti in namenski nakupni sistem.

Ohranjeno: H1 »Produktna predstavitev. Namenska izvedba.«, obseg »Struktura, oblikovanje in razvoj spletne strani ter nakupnega sistema«, povezava `ulterior.es ↗`, vsi prikazi, tehnične interakcije (10 gumbov točk), projektna navigacija (prejšnji Flexido, naslednji Odstrani Tattoo), kontakt, metapodatki. Nakupni razdelek in podnapis **nista spremenjena**. Diff samo tega posega: [page.diff](./bauma-v3-ulterior-credibility-evidence/page.diff).

**Preverjanje uvoda:** 375 × 812 in 1440 × 900, vizualno pregledano ([posnetka](./bauma-v3-ulterior-credibility-evidence/)); lead 16 px (327 px, 106 px visok) oziroma 18 px (500 px, 92 px), brez preliva, prekrivanja ali rezanja; povezava v vidnem polju; en H1; 0 napak v konzoli in `pageerror`; `mailto:info@bauma.si` ohranjen (ni aktiviran); `tsc` izhod 0, ESLint izhod 0, `git diff --check` izhod 0; `git status` enak začetnemu stanju.

## 2. Preverjene ugotovitve o nakupnem sistemu

Podrobno in z viri: [commerce-findings-readonly.md](./bauma-v3-ulterior-credibility-evidence/commerce-findings-readonly.md).

| Stanje | Kaj vemo | Status |
|---|---|---|
| **Implementacija** | V izvorni kodi `ulterior-next` (zdaj preverjeno): izbira različice in količine, rezervacija zaloge za čas nakupa (privzeto 15 min, sprostitev ob preklicu ali poteku), notranje naročilo PENDING, vezano na PayPal naročilo, cena in zaloga iz baze, ne iz brskalnika; PayPal webhook s preverjanjem podpisa; plačilo potrjeno samo prek podpisanega obvestila o zajemu; ponovljeno obvestilo prepoznano (enoličen ID dogodka), že plačano naročilo prepoznano; rezervacija se porabi in zaloga odpiše v isti transakciji; stran stanja naročila, zasebni pregled za upravljavca, outbox za transakcijska sporočila. | **Preverjeno v kodi** |
| **Sandbox preverjanje** | Skripti `commerce:verify-*` obstajajo (18. 8.–20. 8. 2026), niso bili zagnani (pišejo v bazo). **Nobenega ohranjenega izpisa, dnevnika ali posnetka uspešnega sandbox nakupa ni.** Edini zapis je izjava naročnika v seji 19. 10. 2026 (»PayPal sandbox approval/capture flow was tested successfully«). | **Podatek iz prejšnje seje; dokaz manjka** |
| **Dejanska uporaba** | Način PayPala (sandbox/live) in morebitna dejanska plačila niso znani. Streženi HTML javne strani izdelka vsebuje interaktiven gumb brez sporočila »Purchasing is temporarily unavailable.«, kar ustreza kodni poti, kadar preverjanje pripravljenosti uspe; to ni dokaz o živih plačilih in iz tega nisem sklepal. `docs/commerce-database.md` (19. 8. 2026) trdi, da je master stikalo »currently false«; to nasprotuje opaženemu in je zastarelo ali se je okolje spremenilo. | **Nepotrjeno; potrdi Grega** |
| Hramba dokazov | Koda nakupnega sistema (`commerce/`, `src/lib/`, `src/app/api/`, `scripts/`, `docs/`) je v `ulterior-next` **neverzionirana** (untracked, skupaj 68 neshranjenih vnosov). | Tveganje; omenjeno za odločitev |

Opaženo v obstoječem prikazu na naši strani (ni spremenjeno): v rekonstrukciji je vidno »12 available now.« in cena; prvi je podatek o zalogi iz izdelka; uredniška odločitev, ali ga obdržati (predlog besedila ga ne vsebuje).

## 3. Prvi predlog za nakupni razdelek (zgodovinski zapis; nadomeščen z razdelkom 5)

Razdelek »Namenski nakupni sistem.« (H2 ostane). Nadomestno besedilo, v jeziku naročnika:

> **Namenski nakupni sistem.**
>
> Za Ulterior smo razvili nakupni sistem, ki deluje v sami strani izdelka. Kupec izbere barvo, velikost in količino, sistem pa izbrano količino za čas nakupa rezervira. Plačilo poteka prek PayPala.
>
> Naročilo se označi kot plačano šele, ko PayPal plačilo potrdi; rezervirana količina se nato odpiše iz zaloge enkrat, tudi če obvestilo o plačilu prispe večkrat. Če kupec nakup prekliče, se rezervacija sprosti.
>
> Postopek smo preizkusili v PayPalovem testnem okolju (sandbox). Ta študija ne navaja prodaje ali poslovnih rezultatov in ne pove, ali je nakup na ulterior.es trenutno omogočen.

Podnapis:

> Rekonstrukcija nakupnega dela strani izdelka na ulterior.es. Neaktiven prikaz na tej strani: izbira in gumb ne delujeta, plačilo ni mogoče. Delujoč sistem je del projekta Ulterior.

Razločevanje: odstavek 1–2 = kaj je razvito (izvedba); odstavek 3 = preverjanje v sandboxu (ločeno) in izrecno brez trditve o dejanski uporabi; podnapis loči neaktivno rekonstrukcijo od sistema v projektu Ulterior. Brez tehničnih identifikatorjev, brez testnih količin zaloge, brez rezultatov.

**Pogoj za objavo stavka o sandboxu:** Grega potrdi izjavo (ali priloži dokaz); brez potrditve se tretji odstavek skrajša na zadnji stavek, na primer: »Ta študija ne navaja prodaje ali poslovnih rezultatov in ne pove, ali je nakup na ulterior.es trenutno omogočen.«

Odločitve za potrditev: (1) stavek o sandboxu (potrditev ali dokaz); (2) »enkrat, tudi če obvestilo prispe večkrat« je v kodi preverjeno, a ni preverjeno v sandboxu; (3) ali se v rekonstrukciji obdrži »12 available now.«; (4) ali besedilo omenja, da gumb v rekonstrukciji ne deluje (v podnapisu je); (5) ali Grega želi dokumentirati stanje živega nakupa na strani (predlog tega ne počne).

## 4. Status (po prvem koraku, 27. 10. 2026)

Uvod: **izveden in lokalno preverjen.** Nakupno besedilo in podnapis: **čakata uredniško potrditev**, nista implementirana. Odprto: potrditev sandbox preizkusa, stanje živega nakupa, SL metapodatki Ulterior, ostale študije, Home, Pristop, kontakt, preverjanje gostovanja. Proof & Credibility pass **ni zaključen**.

## 5. Zaključek besedila nakupnega sistema (27. 10. 2026)

**Uredniško potrjeno in izvedeno** (`app/work/ulterior/page.tsx`, razdelek »Namenski nakupni sistem.«; H2 ohranjen). Obstoječe razlagalno besedilo (dva odstavka) je zamenjano s tremi odstavki v obstoječem ovoju in slogu:

> Za Ulterior smo razvili namenski nakupni sistem z izbiro barve, velikosti in količine ter plačilom prek PayPala. Sistem med nakupom rezervira izbrano količino in vodi naročilo.
>
> Po potrditvi plačila se naročilo označi kot plačano, rezervirana količina pa se odpiše iz zaloge. Ponovljena obvestila o istem plačilu ne povzročijo dodatnega odpisa. Ob preklicu ali poteku rezervacije se količina sprosti.
>
> Nakupni postopek smo preverili v PayPalovem testnem okolju.

**Podnapis:** »Rekonstrukcija nakupnega dela strani izdelka na ulterior.es. Izbira različic in plačilo v tem prikazu nista omogočena.« (prej: »… Prikaz nakupnega vmesnika. Plačilo v tem prikazu ni omogočeno.«). **Ujemanje z vedenjem prikaza:** preverjeno; v okvirju so izbira barve, velikosti, količine in gumb »Purchase with PayPal« navadni `span` elementi (v okvirju 0 `a`, `button`, `input`, `tabindex`), torej izbira in plačilo res ne delujeta. Nasprotja ni. Delujoči nakupni sistem ni bil dotaknjen.

**Prikaz zaloge:** vrstica »12 available now.« je odstranjena iz `app/components/blocks/mini/UlteriorPurchaseProof.tsx` (komponenta je uporabljena samo na `/work/ulterior`); ni nadomeščena z drugo količino ali oznako. Pripadajoči odstavek z razmikom (`mt-1`) je odstranjen skupaj z vrstico; v vrstici »Quantity« ostaneta oznaka in števec, ki se poravnata po središču (razlika 0 px), brez praznega prostora. Komentar v komponenti je posodobljen. Cena, barvne in velikostne izbire, števec in gumb so nespremenjeni.

**Status sandbox preizkusa (razlikovanje ohranjeno):**
- *implementacija:* pregledana v kodi `ulterior-next` (razdelek 2);
- *uspešen sandbox preizkus:* podatek iz predhodne seje (izjava 19. 10. 2026) in Gregovo poročilo; uredniško potrjen za to besedilo, ponovno potrjevanje ni zahtevano in preizkus ni bil ponovljen;
- *ohranjen izpis ali dnevnik preizkusa:* **ni najden**;
- *dejanska uporaba:* ni trditve; besedilo ne navaja prodaj ali trenutne omogočenosti nakupa (nepotrjeno, razdelek 2).

### Preverjanje

[verify-ulterior-purchase.cjs](./bauma-v3-ulterior-credibility-evidence/verify-ulterior-purchase.cjs), [verify-ulterior-purchase.json](./bauma-v3-ulterior-credibility-evidence/verify-ulterior-purchase.json), posnetki razdelka pri 320, 375 in 1440 px (`ulterior-<w>-purchase-section.png`; 375 in 1440 vizualno pregledana; lepljiva glava skrita pri zajemu). Uvod ponovno preverjen ([posnetki](./bauma-v3-ulterior-credibility-evidence/)).

| | 320 | 375 × 812 | 1440 × 900 |
|---|---|---|---|
| Horizontalni preliv strani | ne | ne | ne |
| Trije odstavki (16 / 16 / 18 px) | vidni, 272 px, brez preliva | 327 px | 545 px (`max-w-[48ch]`) |
| Rekonstrukcija (širina × višina) | 280 × 809 | 335 × 840 | 1216 × 525 |
| Rezanje, besedilo zunaj okvirja | 0 / 0 | 0 / 0 | 0 / 0 |
| »available now« kjerkoli na strani | ne | ne | ne |
| Vrstica Quantity (oznaka : števec) | poravnana, razlika 0 px | 0 px | 0 px |
| Interaktivni elementi v rekonstrukciji | 0 | 0 | 0 |
| Text-spacing stres (vrstica 1,5, črke 0,12 em, besede 0,16 em, odstavek 2 em) v razdelku | višina okvirja 809 → 1021, brez rezanja/preliva | 840 → 993 | 525 → 681 |
| Console, `pageerror` od začetka nalaganja | 0 | 0 | 0 |
| Gumbi tehničnih točk, H1, navigacija, kontakt | 10, 1 H1, prejšnji `/work/flexido` / naslednji `/work/odstrani-tattoo`, `mailto:info@bauma.si` (ni aktiviran), `ulterior.es` ohranjena (ni odprta) | enako | enako |

`npx tsc --noEmit` izhod 0; ESLint na obeh datotekah izhod 0; `git diff --check` izhod 0. Diff tega posega proti začetku tega koraka: [page-purchase.diff](./bauma-v3-ulterior-credibility-evidence/page-purchase.diff) in [UlteriorPurchaseProof.diff](./bauma-v3-ulterior-credibility-evidence/UlteriorPurchaseProof.diff); diff uvoda iz prejšnjega koraka: [page.diff](./bauma-v3-ulterior-credibility-evidence/page.diff). `git status` se razlikuje samo za `UlteriorPurchaseProof.tsx` (nov vnos spremembe); `ulterior-next` nedotaknjen (68 vnosov kot prej). Brez posegov v bazo, PayPal, nastavitve nakupa ali plačila; brez zagona skriptov.

### Omejitve in opombe
- Preverjeno na dev strežniku v Chromiumu; Safari, VoiceOver in dejanska naprava niso.
- Besedilo trdi preverjanje v testnem okolju na podlagi poročila, ne ohranjenega izpisa; če izpis najde, ga je treba dodati.
- Verzionarjenje kode v `ulterior-next` ni del tega posega (ostaja tveganje za dokaze).
- Stanje živega nakupa in način PayPala ostajata nepotrjena; besedilo o tem ne govori.
- Metapodatki (title, description, OG) in njihov predlog so nespremenjeni; opis v predlogu omenja »namenski nakupni sistem« in ostaja skladen.

## 6. Status (po zaključku besedila)

**Vsebinska dopolnitev Ulterior je zaključena v lokalno preverjenem obsegu**: uvodni lead, nakupno besedilo, podnapis in odstranitev prikaza zaloge. Odprto: SL metapodatki, preverjanje gostovanja, ostale študije, Home, Pristop, kontakt. Proof & Credibility pass **ni zaključen**.

## 7. Popravek 27. 10. 2026 — preverjanje tudi v produkciji

Zadnji stavek nakupnega razdelka je zamenjan (prej: »Nakupni postopek smo preverili v PayPalovem testnem okolju.«):

> Nakupni postopek smo preverili v PayPalovem testnem okolju in v produkciji.

Preostanek besedila in podnapis sta nespremenjena. Diff tega koraka: [page-production-wording.diff](./bauma-v3-ulterior-credibility-evidence/page-production-wording.diff).

**Beleženje dejstev (ločeno):**
- **Gregova potrditev:** Grega potrjuje tudi opravljen produkcijski preizkus nakupa. To je zabeleženo kot njegova potrditev, ločeno od dokazov, pregledanih v tej seji. Zanj ni ohranjenega izpisa, dnevnika ali posnetka; ni bil ponovljen niti ponovno preverjen.
- **Dokazi, pregledani v tej seji:** samo implementacija v kodi `ulterior-next` (razdelek 2). Sandbox in produkcijski preizkus sta v obeh primerih podatka iz poročila, ne preverjena dokaza.
- **Kaj preizkus ne pomeni:** preizkus ne pomeni trditve o rednih prodajah ali o trenutni razpoložljivosti nakupa. Besedilo na strani teh trditev ne vsebuje. Stanje živega nakupa in način PayPala ostajata nepotrjena (razdelek 2).

**Preverjanje po spremembi** (isti skript [verify-ulterior-purchase.cjs](./bauma-v3-ulterior-credibility-evidence/verify-ulterior-purchase.cjs)): 320 / 375 / 1440 px brez preliva strani, brez rezanja in besedila zunaj okvirja, 0 napak v konzoli in `pageerror`; zadnji odstavek 16 / 16 / 18 px (272 / 327 / 545 px široko, višina 84 / 56 / 61 px) brez preliva, pri povečanih razmikih brez rezanja; okvir rekonstrukcije nespremenjen (280 × 809, 335 × 840, 1216 × 525), 0 interaktivnih elementov, brez »available now«. `tsc` izhod 0, ESLint izhod 0, `git diff --check` izhod 0, `git status` enak pred in po koraku.

Prejšnje trditve v tem zapisu, ki govorijo o »sandbox« preizkusu kot edinem preizkusu (razdelka 3 in 5), so zgodovinski zapis do tega popravka.

## 8. Status (po popravku)

Vsebinska dopolnitev Ulterior je **zaključena v lokalno preverjenem obsegu** (uvod, nakupno besedilo z navedbo testnega okolja in produkcije, podnapis, brez prikaza zaloge). Odprto: SL metapodatki, preverjanje gostovanja, ostale študije, Home, Pristop, kontakt. Proof & Credibility pass **ni zaključen**.

## 9. Popravek obsega (27. 10. 2026)

Vrstica obsega v uvodu je zamenjana (prej: »Struktura, oblikovanje in razvoj spletne strani ter nakupnega sistema«): **»Zasnova, oblikovanje in razvoj spletne strani ter namenskega nakupnega sistema«**. Podrobnosti, diff in preverjanje: [bauma-v3-remaining-studies-credibility-update.md](./bauma-v3-remaining-studies-credibility-update.md). Preostali del študije je nespremenjen.

## 10. Dopolnitev 27. 10. 2026 — ponovna potrditev obsega

Obseg »Zasnova, oblikovanje in razvoj spletne strani ter namenskega nakupnega sistema« je ponovno preverjen skupaj z uvodom, nakupnim besedilom in navedbo preverjanja v testnem okolju in produkciji; prikazi in interakcije (10 tehničnih točk) so nespremenjeni, 0 napak, brez preliva pri 320 / 375 / 1440 px. Podrobnosti: [bauma-v3-remaining-case-studies-credibility-update.md](./bauma-v3-remaining-case-studies-credibility-update.md).

