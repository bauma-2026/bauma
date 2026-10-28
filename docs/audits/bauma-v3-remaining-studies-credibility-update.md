# BAUMA V3 — Proof & Credibility: Odstrani Tattoo, ArtBite, Hardshelljacket in obsegi študij

Datum: **27. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Spremembe so lokalne in necommitane. Gostovanje in okolja niso spremenjeni; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen. Brez gradenj, namestitev in celotnega lint pregleda. Metapodatki niso spremenjeni. Dokazi: [bauma-v3-remaining-studies-credibility-evidence](./bauma-v3-remaining-studies-credibility-evidence/).

## Podlaga

Read-only vsebinski pregled treh študij (izrisane strani pri 375 × 812 in 1440 × 900, prikazne komponente, izvorni projekti `odstranitattoo-next`, `artbite-next`, `hardshelljacket-next` samo za branje) je predlagal ozke posege; uredniško so bili potrjeni štirje spodaj. Ugotovitve pregleda: Odstrani Tattoo, ArtBite in Hardshelljacket imajo jasno ločeno naročnikovo dejavnost (podnapisi »Rekonstrukcija … z/na …«) od našega obsega; ključne odločitve so podprte s prikazi; manjkali so: izhodišče pri Odstrani Tattoo, obseg in jeziki pri Hardshelljacket ter oznaka, da gumbi v prikazih ne delujejo.

## Izvedene štiri spremembe

1. **Odstrani Tattoo — lead** (`app/work/odstrani-tattoo/page.tsx`). Prej: »Za Odstrani Tattoo smo zasnovali in razvili spletno stran za odstranjevanje tetovaž, ki obiskovalcu najprej razloži postopek.« Zdaj:
   > Za Odstrani Tattoo smo zasnovali in razvili spletno stran za odstranjevanje tetovaž. Obiskovalec, ki se sprašuje, ali je tetovažo mogoče odstraniti, najprej dobi razlago postopka.
2. **Hardshelljacket — obseg** (`app/work/hardshelljacket/page.tsx`). Prej: »Struktura in razvoj spletne strani«. Zdaj: **»Zasnova, oblikovanje in razvoj spletne strani v angleščini in španščini«** (uredniško potrjeno; povezava `hardshelljacket.com ↗` ostane v isti vrstici).
3. **Ulterior — obseg** (`app/work/ulterior/page.tsx`). Prej: »Struktura, oblikovanje in razvoj spletne strani ter nakupnega sistema«. Zdaj: **»Zasnova, oblikovanje in razvoj spletne strani ter namenskega nakupnega sistema«**.
4. **Podnapisi ob prikazih z neaktivnimi gumbi** dobijo stavek **»Gumbi v tem prikazu niso aktivni.«**:
   - ArtBite: uvodni razdelek domače strani (gumb »Rezerviraj termin«) in uvodni razdelek strani »Prekrivanje starih tetovaž« (gumb »Pošlji fotografijo za oceno«);
   - Hardshelljacket: uvodni razdelek (gumba »Buy on Ulterior« in »B2B enquiries«) in razdelek »Everyday use« (gumb »Explore the Hardshell«).

   Podnapisa prikaza galerije ArtBite in razdelka »Three-layer construction« nista spremenjena (v njih ni gumbov).

**Ni spremenjeno:** ArtBite lead (ostane), H1, ostali odstavki, prikazi, slike, povezave, projektna navigacija, kontakt, metapodatki, oblikovanje. Obseg Odstrani Tattoo (»Struktura, oblikovanje in razvoj spletne strani«) in ArtBite ostaneta v obstoječi formulaciji; po navodilu sta spremenjena samo obsega Hardshelljacket in Ulterior, zato se besedi »Struktura« in »Zasnova« med študijami razlikujeta (uredniška odločitev, ali poenotiti).

Diffi (proti stanju na začetku tega koraka): [odstrani-tattoo.diff](./bauma-v3-remaining-studies-credibility-evidence/odstrani-tattoo.diff), [artbite.diff](./bauma-v3-remaining-studies-credibility-evidence/artbite.diff), [hardshelljacket.diff](./bauma-v3-remaining-studies-credibility-evidence/hardshelljacket.diff), [ulterior.diff](./bauma-v3-remaining-studies-credibility-evidence/ulterior.diff).

## Preverjanje

[verify-remaining-studies.cjs](./bauma-v3-remaining-studies-credibility-evidence/verify-remaining-studies.cjs), rezultat [verify-remaining-studies.json](./bauma-v3-remaining-studies-credibility-evidence/verify-remaining-studies.json); posnetki uvodov pri 375 × 812 in 1440 × 900 (Odstrani Tattoo in Hardshelljacket vizualno pregledana).

| Preverjanje (4 strani × 320 / 375 / 1440 px) | Rezultat |
|---|---|
| Spremenjena besedila najdena, vidna, brez rezanja | da |
| Horizontalni preliv strani | ne |
| Povečani razmiki (vrstica 1,5, črke 0,12 em, besede 0,16 em, odstavek 2 em) na spremenjenih besedilih | brez rezanja |
| Stara besedila (»Struktura in razvoj spletne strani« na Hardshelljacket) | ni več |
| Zunanja povezava v uvodu | v vidnem polju, `href` in `target` nespremenjena |
| Console, `pageerror` | 0 |
| H1 | en na stran; tehnične točke Ulterior: 10 gumbov |
| ESLint (4 datoteke), `tsc`, `git diff --check` | izhod 0 |
| `git status` | enak začetnemu stanju koraka |

**Opomba k povečanim razmikom pri 320 px na ArtBite:** če se razmiki uporabijo na celotni vsebini strani vključno z rekonstruiranim vmesnikom naročnika, se pojavi 17 px preliva zaradi rekonstrukcije (drsna galerija), ne zaradi spremenjenih besedil. Ko se isti razmiki uporabijo samo na uvodu in podnapisih, preliva ni.

## Odprto (ločene točke)

- **Dosegljivost `hardshelljacket.com`:** iz tega okolja se domena ni razrešila (`curl`, `dig`); to ni dokaz, da ne deluje. Ostaja odprta točka za potrditev.
- Tehnična opažanja iz pregleda (ne popravljeno): dostopna imena projektnih kartic, fokusirljiva drsna galerija ArtBite na mobilnem prikazu (kot v originalu), 8 px napis »Tattoo Studio« v logotipu rekonstrukcije, 10 px oznaki »Pred« in »Po« pri Odstrani Tattoo.
- SL metapodatki (po zaključku vidne vsebine), EN prenova, preverjanje gostovanja.

## Status

**Vsebinski Proof & Credibility pass je zaključen v pregledanem lokalnem obsegu**: vseh šest študij (Flexido, Dema Plus, Ulterior, Odstrani Tattoo, ArtBite, Hardshelljacket) ter O nas, Home, Pristop in kontakt. Sledi sklop SL metapodatkov. Metapodatki, EN prenova, tehnična preverjanja, dosegljivost domene Hardshelljacket in preverjanje gostovanja ostajajo ločeni odprti sklopi.
