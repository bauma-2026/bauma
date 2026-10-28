# BAUMA V3 — Home in Pristop: zaključek vsebinskega pregleda

Datum: **27. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Spremembe so lokalne in necommitane. Gostovanje in okolja niso spremenjeni; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen. Brez namestitev, gradenj, celotnega lint pregleda in produkcijske gradnje. Dokazi: [bauma-v3-home-approach-credibility-evidence](./bauma-v3-home-approach-credibility-evidence/).

## Tri potrjene besedilne spremembe

1. **Pristop, blok »Usklajevanje«** (`app/pristop/page.tsx`): obstoječe besedilo ohranjeno, v istem odstavku in slogu dodano:
   > Večino usklajevanja opravimo po e-pošti. Pogovor ali sestanek dogovorimo, kadar je potreben. **Projekt od začetka do objave vodi Gregor Baumgartner.**
2. **Home, »Digitalni materiali«** (`app/components/blocks/mini/MiniServicesList.tsx`, uporablja ga samo `app/page.tsx`), opis zamenjan (prej: »Oblikujemo spletne bannerje, HTML e-novice ter animirane in video različice. Datoteke pripravimo za objavo.«):
   > Oblikujemo statične in animirane spletne bannerje ter HTML e-novice. Datoteke pripravimo za objavo.
3. **Pristop, faza 01 »Začetek«** (`app/pristop/page.tsx`), stavek zamenjan (prej: »Pošljete, kar že imate: obstoječo stran, besedila, slike ali primere, ki so vam všeč.«):
   > Po e-pošti opišete, kaj želite urediti in komu je stran namenjena. **Če že imate obstoječo stran, besedila, slike ali primere, ki so vam všeč, jih priložite.** (Preostanek faze 01 je nespremenjen.)

Ni dodano: odzivnih rokov, trditve o brezplačni ponudbi, video produkcije, upravljanja kampanj, tiska ali novih storitev. Struktura, tipografija, razmiki, izbrani projekti, CTA-ji, povezave in kontaktni naslovi so nespremenjeni; metapodatki in njihov predlog tudi.

## Spremenjene datoteke in diff

`app/pristop/page.tsx` ([pristop.diff](./bauma-v3-home-approach-credibility-evidence/pristop.diff)) in `app/components/blocks/mini/MiniServicesList.tsx` ([MiniServicesList.diff](./bauma-v3-home-approach-credibility-evidence/MiniServicesList.diff)); diffa sta proti stanju na začetku tega posega, ne proti HEAD. `git status` se razlikuje samo za `MiniServicesList.tsx` (nov vnos spremembe); `app/pristop/page.tsx` je bil že spremenjen.

**Opomba:** isto prejšnje besedilo (»… animirane in video različice …«) je še v `app/components/blocks/mini/MiniServicesGrid.tsx`, ki ga uporabljajo samo lab strani in ne Home. Ni spremenjeno, ker ni del Home; ob morebitni ponovni uporabi mreže je treba besedilo uskladiti.

## Preverjanje

[verify-home-approach.cjs](./bauma-v3-home-approach-credibility-evidence/verify-home-approach.cjs), rezultat [verify-home-approach.json](./bauma-v3-home-approach-credibility-evidence/verify-home-approach.json); posnetki spremenjenih mest (`home-<w>-services03.png`, `pristop-<w>-usklajevanje.png`, `pristop-<w>-faza01.png`) pri 320, 375 in 1440 px, pri 375 in 1440 vizualno pregledana (lepljiva glava skrita pri zajemu).

| | 320 | 375 × 812 | 1440 × 900 |
|---|---|---|---|
| Nova besedila vidna, brez rezanja | da | da | da |
| Horizontalni preliv (Home, Pristop) | ne | ne | ne |
| Stara besedila (»animirane in video«, »Pošljete, kar že imate«) na straneh | ni | ni | ni |
| Povečani razmiki (vrstica 1,5, črke 0,12 em, besede 0,16 em, odstavek 2 em) | brez rezanja in preliva | enako | enako |
| Console, `pageerror` ob nalaganju `/` in `/pristop` | 0 | 0 | 0 |
| Povezave glede na prejšnji pregled | enake | enake | enake |
| Mailto | `info@bauma.si` (CTA z zadevo »Povpraševanje za projekt«, noga); ni aktiviran | enako | enako |

ESLint na obeh spremenjenih datotekah izhod 0; `git diff --check` izhod 0.

## Odprto (ločeni sklopi, ni del tega posega)

- **Dostopna imena projektnih kartic** (Home, Pristop, O nas): v DOM so imena združena iz naslova in oznake (npr. »Ali je vaštattoo mogočeodstraniti?Odstrani Tattoo«). **Zabeleženo kot opažanje za ločen tehnični pregled; ni potrjeno z bralnikom zaslona in ni trditev, da gre za napako.** Ni spremenjeno.
- Hero H1 na Home ima v DOM mobilno in namizno različico; preklaplja jih CSS. Brez ugotovljene težave, samo za tehnični pregled.
- Povezava »EN« vodi na `/en`, ki še ni usklajen z novo SL sestavo (EN prenova).
- SL metapodatki (opis Pristopa in O nas, Home), preverjanja gostovanja, ostale študije.

## Status

**Vsebinski pregled Home, Pristopa in kontakta je zaključen v navedenem lokalnem obsegu** (izvedena tri potrjena besedila, preverjeno). Celoten Proof & Credibility pass ostaja **odprt** zaradi preostalih študij (Odstrani Tattoo, ArtBite, Hardshelljacket); metapodatki, EN prenova, tehnična preverjanja in gostovanje ostajajo ločeni odprti sklopi.
