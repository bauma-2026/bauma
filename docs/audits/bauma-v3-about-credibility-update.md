# BAUMA V3 — O nas: osebna predstavitev in odgovornost

Datum: **26. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Sprememba je lokalna in necommitana. Gostovanje ni spremenjeno ali preverjeno; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen (uporabljen le za ogled). Odvisnosti in lock niso spremenjeni.

## Kaj je zamenjano ali dopolnjeno

`app/o-nas/page.tsx`, bralni del (`.onas-closing`): **zamenjan** je en odstavek »Z naročniki gradimo sodelovanja, v katerih delo poznamo in ga lahko razvijamo naprej.« (`onas-thought`), ker novi tretji odstavek (»Z naročnikom sodelujem neposredno skozi celoten projekt …«) pove isto in bolj konkretno. Na njegovem mestu so **trije povezani odstavki** potrjenega besedila, v prvi osebi ednine, v obstoječem razredu `onas-body` (obstoječa tipografija, širina in razmik; brez novih sekcij, razredov, časovnice, kartic ali poudarkov):

1. Za Baumo stojim Gregor Baumgartner. Projekte vodim od zasnove do objave ter povezujem vsebino, oblikovanje in razvoj.
2. Moja digitalna pot se je začela konec devetdesetih v podpori zgodnjim storitvam elektronskega bančništva NLB Klik in Proklik. Leta 2005 sem diplomiral na IED v Torinu, na smeri Visual Communication — Digital & Virtual Design. Sledilo je delo v oglaševalskih agencijah, pozneje pa samostojna pot z Baumo.
3. Danes te izkušnje povezujem pri spletnih straneh in digitalnih rešitvah. Z naročnikom sodelujem neposredno skozi celoten projekt, od prvih vprašanj do končne izvedbe.

Besedilo je dobesedno potrjeno. Dodan je samo nelomljivi presledek za enočrkovnimi besedami (`v`, `z`, `Z`) v odstavkih 2 in 3, da ne ostanejo na koncu vrstice; vidno besedilo je enako. Posodobljen je tudi komentar nad komponento (opis strukture).

**Ohranjeno:** H1 »Oblikovanje in razvoj pod eno streho.«, lead, oba odstavka »Vsak projekt ima svoje izhodišče …« in »Pogosto izhajamo iz nečesa, kar že obstaja …« (različna sporočila), podpis »Gregor Baumgartner«, `gregor@bauma.si` (osebni naslov; `mailto:gregor@bauma.si`), Izbrano delo, kontakt (`info@bauma.si`), navigacija, noga. Pravni podatki niso podvojeni.

## Neskladja s strukturo strani (pojasnilo)

- **Množina in ednina:** lead in odstavka pred osebnim delom govorita v »mi« (»Povezujemo …«, »Ohranimo …«); osebni del je v »jaz«. Kot je bilo zahtevano, tega nisem poenotil. Vizualno je prehod označen z obstoječim razmikom `.onas-closing`.
- **Delno podvajanje sporočila:** lead (»Povezujemo načrtovanje, oblikovanje in razvoj«) in prvi osebni odstavek (»povezujem vsebino, oblikovanje in razvoj«) sta si sorodna. Lead je zunaj dela, ki ga je bilo dovoljeno zamenjati, zato je ostal; uredniška odločitev, ali ga skrajšati.
- **Podpis:** ime »Gregor Baumgartner« je zdaj v prvem odstavku in v podpisu pod njim. Podpis ostaja kot zaključek in nosilec osebnega naslova (kontaktni cilj ni spremenjen).

## Spremenjene datoteke

- `app/o-nas/page.tsx` (diff samo tega posega: [page.diff](./bauma-v3-about-credibility-evidence/page.diff)). `app/o-nas/ONas.css` ni spremenjen. Metapodatki v isti datoteki (title, OG, robots, canonical) niso dotaknjeni: njihove vrstice v `git diff` izvirajo iz prejšnjih posegov (TECH-005), ne iz tega.
- Dokumentacija: ta zapis, [dokazi](./bauma-v3-about-credibility-evidence/), register.

## Preverjanje

[verify-onas.cjs](./bauma-v3-about-credibility-evidence/verify-onas.cjs), rezultat [verify-onas.json](./bauma-v3-about-credibility-evidence/verify-onas.json), posnetki (viewport in cela stran) pri 375 × 812 in 1440 × 900 v isti mapi, pregledani vizualno:

| Preverjanje | 375 × 812 | 1440 × 900 |
|---|---|---|
| Horizontalni preliv strani | ne | ne |
| Prekrivanje elementov v bralnem delu | ne | ne |
| Vsi trije odstavki vidni, berljivi | da (327 px širine, 15 px, višine 77 / 204 / 102 px) | da (576 px, 16 px, 54 / 136 / 82 px) |
| Tipografija in širina enaki obstoječim odstavkom | da (`onas-body`) | da |
| Napake v konzoli, `pageerror` | 0 | 0 |

Povezave: `mailto:gregor@bauma.si`, `mailto:info@bauma.si` (noga in CTA), `/work/*`, `/work`, `/pogoji-uporabe`, `/zasebnost`, `/piskotki` so nespremenjene in jih skript samo prebere iz DOM (mailto ni aktiviran). ESLint na `app/o-nas/page.tsx`: izhod 0, brez opozoril. `git diff --check`: izhod 0. `git status` se razlikuje od začetka posega samo po tem, da je `app/o-nas/page.tsx` že bil spremenjen (isti vnos); ostali vnosi so enaki.

## Omejitve

- Preverjeno na dev strežniku (Chromium, Playwright); brez Safari, VoiceOver in dejanske naprave. Produkcijska gradnja ni bila zagnana (sprememba je samo besedilo v obstoječih elementih).
- Biografska dejstva (NLB Klik in Proklik, IED Torino 2005, agencije) so uredniško potrjena, v repozitoriju niso preverljiva; besedilo ne trdi razvoja bančnih sistemov, varnostne odgovornosti, »uvajanja« ali številk, NLB ni predstavljena kot naročnik in nima logotipa.
- SL predlog metapodatkov ostaja ločen sklop. Opis `/o-nas` v njem je bil pripravljen pred to dopolnitvijo; po zaključku vidne vsebine ga je treba pregledati (izvajalec je zdaj poimenovan na strani).
- Proof & Credibility pass **ni zaključen**: projekti ter pregled Home, Pristopa in kontakta še sledijo.

## Dopolnitev 27. 10. 2026 — agencijske izkušnje

**Zamenjan je samo stavek** v drugem osebnem odstavku (`app/o-nas/page.tsx`, `.onas-closing`). Prej: »Sledilo je delo v oglaševalskih agencijah, pozneje pa samostojna pot z Baumo.« Zdaj (uredniško potrjeno neposredno od Grege; zunanje preverjanje biografije ni potrebno):

> Sledilo je delo v oglaševalskih agencijah, kjer sem kot interaktivni oblikovalec oblikoval in izdeloval spletne strani ter pripravljal digitalne materiale za kampanje — od bannerjev in e-novic do video animacij. Pozneje sem nadaljeval samostojno pot z Baumo.

Celoten posodobljeni odstavek: »Moja digitalna pot se je začela konec devetdesetih v podpori zgodnjim storitvam elektronskega bančništva NLB Klik in Proklik. Leta 2005 sem diplomiral na IED v Torinu, na smeri Visual Communication — Digital & Virtual Design. Sledilo je delo v oglaševalskih agencijah, kjer sem kot interaktivni oblikovalec oblikoval in izdeloval spletne strani ter pripravljal digitalne materiale za kampanje — od bannerjev in e-novic do video animacij. Pozneje sem nadaljeval samostojno pot z Baumo.«

Besedilo ostaja v obstoječem odstavku in slogu (`onas-body`); imen agencij, povezav, pristajalnih strani, mini spletnih mest ali drugih izkušenj ni. Nelomljivi presledek pred »Baumo« je ohranjen. Preostala biografija, letnica 2005, podpis, kontakti, metapodatki in oblikovanje so nespremenjeni. Diff samo tega koraka: [page-agency.diff](./bauma-v3-about-credibility-evidence/page-agency.diff).

**Preverjanje** ([verify-onas-agency.cjs](./bauma-v3-about-credibility-evidence/verify-onas-agency.cjs), [verify-onas-agency.json](./bauma-v3-about-credibility-evidence/verify-onas-agency.json), posnetka [375 × 812](./bauma-v3-about-credibility-evidence/onas-agency-375x812.png) in [1440 × 900](./bauma-v3-about-credibility-evidence/onas-agency-1440x900.png), vizualno pregledana):

| | 320 | 375 × 812 | 1440 × 900 |
|---|---|---|---|
| Odstavek (širina × višina, pisava) | 272 × 357, 15 px | 327 × 306, 15 px | 576 × 190, 16 px |
| Horizontalni preliv, rezanje | ne / ne | ne / ne | ne / ne |
| Povečani razmiki (vrstica 1,5, črke 0,12 em, besede 0,16 em, odstavek 2 em) | višina 357 → 405, brez rezanja | 306 → 360 | 190 → 216 |
| Console, `pageerror` | 0 | 0 | 0 |
| Podpis, kontakti | podpis ohranjen; `mailto:gregor@bauma.si` in `info@bauma.si` nespremenjena, ni aktiviran | enako | enako |

ESLint na `app/o-nas/page.tsx` izhod 0; `git diff --check` izhod 0; `git status` enak začetnemu stanju koraka.

**Opomba:** biografija omenja »video animacije« kot pretekle izkušnje; ponudba na Home ostaja bannerji (statični in animirani) in HTML e-novice, brez video produkcije. To sta različni stvari (izkušnje proti sedanji ponudbi) in ni spremenjeno. Metapodatki `/o-nas` in njihov predlog so nespremenjeni.

