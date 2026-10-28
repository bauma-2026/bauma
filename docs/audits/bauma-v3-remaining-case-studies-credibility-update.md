# BAUMA V3 — Proof & Credibility: zaključek vsebinskih dopolnitev študij (Odstrani Tattoo, ArtBite, Hardshelljacket, obseg Ulterior)

Datum: **27. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Spremembe so lokalne in necommitane. Gostovanje in okolja niso spremenjeni; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen. Brez namestitev, gradenj in celotnega lint pregleda. Metapodatki, OG/Twitter in predlog metapodatkov niso spremenjeni; izvorni projekti naročnikov niso dotaknjeni. Dokazi: [bauma-v3-remaining-case-studies-credibility-evidence](./bauma-v3-remaining-case-studies-credibility-evidence/).

**Razmerje do prejšnjega zapisa:** besedila 1–3 in podnapisi ArtBite so bili v delovnem drevesu že izvedeni v prejšnjem koraku ([bauma-v3-remaining-studies-credibility-update.md](./bauma-v3-remaining-studies-credibility-update.md), ki ostane kot zgodovinski zapis). Ta korak jih je ponovno preveril proti zahtevanim besedilom in **popravil en odmik**: prejšnji korak je stavek »Gumbi v tem prikazu niso aktivni.« dodal tudi podnapisu Hardshelljacket »Everyday use«, ki ni na seznamu potrjenih mest; ta dodatek je odstranjen. Diff samo tega koraka je zato majhen (en podnapis); celoten diff od začetka prejšnjega koraka je v dokazih kot `*.cumulative.diff`.

## Končna besedila

1. **Odstrani Tattoo — lead** (`app/work/odstrani-tattoo/page.tsx`): »Za Odstrani Tattoo smo zasnovali in razvili spletno stran za odstranjevanje tetovaž. Obiskovalec, ki se sprašuje, ali je tetovažo mogoče odstraniti, najprej dobi razlago postopka.« H1, obseg (»Struktura, oblikovanje in razvoj spletne strani«) in preostala vsebina nespremenjeni; brez medicinskih trditev in obljub rezultatov.
2. **Hardshelljacket — obseg** (`app/work/hardshelljacket/page.tsx`): »Zasnova, oblikovanje in razvoj spletne strani v angleščini in španščini« (uredniško potrjeno; Grega je neposredno potrdil tudi oblikovanje in razvoj koncepta). Navedba jezikov opisuje izvedeno stran in ne pripisuje avtorstva prevodov. Končna pika ni dodana, ker druge vrstice obsega nimajo pik. Zunanja povezava `hardshelljacket.com ↗` nespremenjena.
3. **Ulterior — obseg** (`app/work/ulterior/page.tsx`): »Zasnova, oblikovanje in razvoj spletne strani ter namenskega nakupnega sistema«. Potrjeni uvod, nakupno besedilo in navedba preverjanja v testnem okolju in produkciji ter prikazi in interakcije (10 tehničnih točk) so nespremenjeni.
4. **Podnapisi** (obstoječi del ohranjen, dodano »Gumbi v tem prikazu niso aktivni.«), samo na potrjenih mestih:
   - ArtBite, uvodni prikaz (`app/work/artbite/page.tsx`);
   - ArtBite, prikaz prekrivanja tetovaž (`app/work/artbite/page.tsx`);
   - Hardshelljacket, uvodni prikaz (`app/work/hardshelljacket/page.tsx`).

   Drugi podnapisi (galerija ArtBite, »Three-layer construction«, »Everyday use«) niso poenoteni.

ArtBite lead je nespremenjen. Besedila ne opisujejo projektov kot novih strani (»zasnovali in razvili spletno stran« ne izključuje prenove), ne pripisujejo avtorstva fotografij, prevodov ali naročnikovih besedil.

## Potrditev, da so gumbi neaktivni

Pred dodajanjem besedila preverjeno ([verify-buttons-inert.cjs](./bauma-v3-remaining-case-studies-credibility-evidence/verify-buttons-inert.cjs), [rezultat](./bauma-v3-remaining-case-studies-credibility-evidence/verify-buttons-inert.json)) pri 375 in 1440 px:
- ArtBite »Rezerviraj termin« (uvodni prikaz) in »Pošlji fotografijo za oceno« (prikaz prekrivanja): `span` elementi v `aria-hidden` ovoju z `role=img`, brez `a`/`button` prednika, brez `tabindex`, brez `onclick`.
- Hardshelljacket »Buy on Ulterior« in »B2B enquiries« (uvodni prikaz): `span` elementi brez interaktivnega prednika.
- V razdelkih prikazov ni nobenega `a` ali `button`; klik na vsak od teh elementov ni spremenil naslova strani, ni odprl novega zavihka in ni sprožil zunanjih zahtev (nakup in pošta nista bila aktivirana, ker elementi niso povezave).

Ugotovitev prejšnjega pregleda se potrjuje; neskladja ni, zato so besedila dodana. Nobena interakcija ni bila izklopljena ali spremenjena.

## Preverjanje

[verify-case-studies.cjs](./bauma-v3-remaining-case-studies-credibility-evidence/verify-case-studies.cjs), [rezultati](./bauma-v3-remaining-case-studies-credibility-evidence/verify-case-studies.json), posnetki uvodov pri 375 × 812 in 1440 × 900 (`<slug>-<w>x<h>-intro.png`; Odstrani Tattoo in Hardshelljacket vizualno pregledana):

| Preverjanje (4 strani × 320 / 375 / 1440 px) | Rezultat |
|---|---|
| Spremenjena besedila (lead Odstrani Tattoo, obsegi, podnapisi) najdena in vidna, brez rezanja | da |
| Horizontalni preliv strani pri 320 px (in 375, 1440) | ne |
| Povečani razmiki (vrstica 1,5, črke 0,12 em, besede 0,16 em, odstavek 2 em) na uvodu in podnapisih | brez rezanja in preliva |
| Stara besedila (»Struktura in razvoj spletne strani«) | ni več |
| Zunanja povezava v uvodu | v vidnem polju, `href` in `target` nespremenjena |
| Console, `pageerror` ob nalaganju | 0 (vse strani, vse širine) |
| H1, tehnične točke Ulterior, navigacija, mailto | 1 H1, 10 gumbov točk, povezave nespremenjene; mailto (CTA, noga) ni aktiviran |
| ESLint (štiri datoteke), `tsc`, `git diff --check` | izhod 0 |
| `git status` | enak začetnemu stanju koraka |

Opomba: če se povečani razmiki uporabijo tudi na rekonstruiranem vmesniku naročnika ArtBite pri 320 px, se pojavi 17 px preliva zaradi drsne galerije (ne zaradi spremenjenih besedil); skript razmike zato uporablja samo na uvodu in podnapisih.

## Odprte točke (ločene)

- **Dosegljivost `hardshelljacket.com`:** ostaja ločeno odprto preverjanje; iz tega okolja se domena ni razrešila, kar ni dokaz o nedelovanju. Zunanja povezava in domena v tem koraku nista spremenjeni.
- SL metapodatki (sledijo po zaključku vidne vsebine), EN prenova, tehnični in dostopnostni pregledi (med njimi dostopna imena projektnih kartic, fokusirljiva drsna galerija ArtBite, majhni napisi v rekonstrukcijah), preverjanje gostovanja.
- Uredniška odločitev: besedi »Struktura« (Odstrani Tattoo, ArtBite) in »Zasnova« (Ulterior, Hardshelljacket) v vrsticah obsega se med študijami razlikujeta.

## Status

**Vsebinski Proof & Credibility pass je zaključen v pregledanem lokalnem obsegu** (šest študij, O nas, Home, Pristop, kontakt). To ni potrditev pripravljenosti celotnega projekta za objavo; gostovanje ni preverjeno.
