# BAUMA V3 — dostopna imena projektnih kartic in preliv ArtBite pri povečanih razmikih

Datum: **27. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Spremembe so lokalne in necommitane. Gostovanje in okolja niso spremenjeni; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen. Vidna vsebina, metapodatki, OG slike, politika indeksiranja, konfiguracija, odvisnosti in lockfile so nespremenjeni. Dokazi: [bauma-v3-card-names-artbite-overflow-evidence](./bauma-v3-card-names-artbite-overflow-evidence/).

## 1. Dostopna imena kartic — napaka NI potrjena (brez posega)

**Metoda:** izračunano dostopno ime iz Chromiumovega dostopnostnega drevesa (CDP `Accessibility.getPartialAXTree` / `queryAXTree`), ne iz `textContent`; kartice na `/`, `/pristop`, `/o-nas` (3 kartice) in `/work` (6 kartic) pri 375 × 812 in 1440 × 900 ([skript](./bauma-v3-card-names-artbite-overflow-evidence/ax-card-names.cjs), [pred](./bauma-v3-card-names-artbite-overflow-evidence/ax-card-names.before.json), [po](./bauma-v3-card-names-artbite-overflow-evidence/ax-card-names.after.json)).

| Vprašanje | Ugotovitev |
|---|---|
| Se besedilo posterja ponavlja v imenu povezave? | **Ne.** Povezava ima `aria-labelledby` na vidni naslov projekta (`msw-home-<slug>` na `/`, `/pristop`, `/o-nas`; `work-<slug>` na `/work`), zato je izračunano ime samo **»Odstrani Tattoo«**, **»Dema Plus«**, **»Flexido«**, **»Ulterior«**, **»ArtBite«**, **»Hardshelljacket«**. |
| Manjkajo presledki v imenu? | **Ne.** Ime je en naslov. Združeno besedilo (»Ali je vaštattoo mogočeodstraniti?Odstrani Tattoo«) obstaja samo v `textContent`, ker so vrstice posterja ločeni bloki; v dostopnem drevesu so ločena statična besedila (»Ali je vaš« / »tattoo mogoče« / »odstraniti« / »?«). |
| Pove ime, kateri projekt se odpre? | **Da.** Poleg `aria-labelledby` imajo kartice `aria-describedby` na vidni podnaslov (npr. »Zaupanje in konverzija«). |
| Dekorativne puščice in slike? | Puščica `→` je v `span aria-hidden="true"`; poster ArtBite in Ulterior imata logotipna besedila v `aria-hidden`. Slike v karticah `/work` imajo opisne `alt` (ArtBite: dve fotografiji tetovaž, Hardshelljacket in Ulterior: fotografija jakne, logotip Ulterior `alt=""`); ne vplivajo na ime. |
| Ena povezava na kartico, URL? | Da, ena povezava, URL-ji nespremenjeni. |
| Tab in Enter | Vse kartice dosegljive s Tab (Home 375: 5., 6., 7. Tab; `/work` 1440: 7.–12.), `:focus-visible` pravilen (obris 2 px `#7c97f0`), Enter odpre `/work/<slug>` ([skript](./bauma-v3-card-names-artbite-overflow-evidence/keyboard-cards.cjs), [rezultat](./bauma-v3-card-names-artbite-overflow-evidence/keyboard-cards.after.json)). |

**Opažanje brez posega:** besedilo posterja na `/`, `/pristop`, `/o-nas` (npr. »Povežemo tok med stroji.«) ni v `aria-hidden`, zato ga bralnik v brskalnem načinu prebere znotraj povezave (kot statično besedilo in nato naslov); gre za vsebinsko besedilo posterja, ne ponovitev imena. Spremembe niso potrebne; `aria-label` ali skrivanje ni dodano. Prejšnje opažanje (»združeno besedilo«) je bilo zaznano iz `textContent`, ne iz dostopnega imena, zato se **ne potrjuje kot napaka**.

## 2. ArtBite — preliv pri 320 px s povečanimi razmiki: POTRJEN, vzrok ni galerija

**Test:** celotna stran `/work/artbite`, line-height 1,5, letter-spacing 0,12 em, word-spacing 0,16 em, razmik po odstavkih 2 em, pri 320, 375 in 1440 px, privzeto in s stresom ([artbite-overflow.cjs](./bauma-v3-card-names-artbite-overflow-evidence/artbite-overflow.cjs), [pred](./bauma-v3-card-names-artbite-overflow-evidence/artbite-overflow.before.json), [po](./bauma-v3-card-names-artbite-overflow-evidence/artbite-overflow.after.json)).

**Meritve pred popravkom (320 px, stres):** `documentElement.scrollWidth` 337 / 320 (**17 px preliva**); privzeto 320 / 320. 375 in 1440 px: brez preliva. Drsna galerija (`role="region"` »Izbor tatujev«, `scrollWidth` 1122 v 320) je **namerno** drsna in ostane znotraj strani; ni vzrok.

**Vzrok (točen element):** besedilo »**Hardshelljacket**« v `span.block.mt-2.text-lg.font-medium` (`TITLE` v `app/components/work/CaseStudyNav.tsx`) v desni polovici vrstice »Naslednji projekt« (`ul.grid-cols-2 > li.text-right > a > span`). Pri 18 px s povečanimi razmiki je beseda široka 165 px, celica pa 124 px (172–296), zato besedilo sega do x = 337. Pravilo: `grid-cols-2` dovoli celici, da se ne razširi (`minmax(0, 1fr)`), beseda pa nima dovoljenega preloma. To je ista komponenta v vseh šestih študijah in ni povezana z ArtBite wordmarkom (»Tattoo Studio« 8 px je v logotipu rekonstrukcije in ne povzroča preliva). `ArtBite` ima prelom zato, ker je njegov naslednik najdaljše ime.

**Dodatno izmerjeno ([casenav-stress.cjs](./bauma-v3-card-names-artbite-overflow-evidence/casenav-stress.cjs), vseh 10 strani × 320, 375):** drugje ni preliva dokumenta (`/work/artbite` pri 320 je edini); besedilo »Hardshelljacket« je izven svoje celice tudi pri `/work/flexido` (prejšnji projekt, levo) in `/work/artbite` pri 375 (ni preliva strani, a besedilo prestopi celico).

**Odrezano besedilo v rekonstrukciji (drugi, ločen vzrok):** v `ArtBiteHeroProof` je `p.mt-4.max-w-[11ch].text-5xl` (»Tetovaže z osebnim pristopom.«) pri 320 px s stresom **odrezan za 29 px** (`div.relative.overflow-hidden`, širina 280 px; beseda »Tetovaže« je širša od okvirja); privzeto in pri 375/1440 px ni rezanja ([artbite-text-cut.cjs](./bauma-v3-card-names-artbite-overflow-evidence/artbite-text-cut.cjs)). To ne povzroča preliva dokumenta, ker okvir reže, vendar je besedilo izgubljeno.

## 3. Izvedena popravka (najmanjša, omejena na povzročitelja)

1. `app/components/work/CaseStudyNav.tsx`: razredu `TITLE` dodan `break-words` (`overflow-wrap: break-word`) + komentar. Beseda se zdaj zlomi znotraj celice namesto da bi segala čez stran; brez učinka, kadar ime stane v celico. Ni globalnega `overflow-x: hidden/clip`, ni fiksnih višin, razmiki in pisave niso zmanjšani.
2. `app/components/blocks/mini/ArtBiteHeroProof.tsx`: odstavku s »Tetovaže z osebnim pristopom.« dodan `break-words`; besedilo ostane celotno vidno (zlom besede samo ob prekoračitvi okvirja). Wordmark, galerija, tipkovnica in dostopno ime regije niso spremenjeni.

Diff (proti začetku koraka): [changes.diff](./bauma-v3-card-names-artbite-overflow-evidence/changes.diff).

## 4. Rezultati po popravku

| Preverjanje | Rezultat |
|---|---|
| `/work/artbite`, celotna stran, stres: preliv dokumenta | 320: **320 / 320** (prej 337), 375: 375 / 375, 1440: 1440 / 1440; privzeto brez preliva |
| Odrezano besedilo (vsi 3 prelomi, privzeto in stres) | 0 (prej 29 px pri 320 s stresom) |
| Vse študije, `casenav-stress` | brez preliva; »Hardshelljacket« v celici (2 vrstici) pri 320 in 375 |
| Galerija »Izbor tatujev« | `role="region"`, `tabindex="0"`, ime ohranjeno, `:focus-visible`, **ArrowRight** premakne `scrollLeft` 0 → 162 (375 px) |
| Dostopna imena kartic | nespremenjena (identična pred/po) |
| Konzola, `pageerror` | 0 |
| `tsc --noEmit`, ESLint (2 datoteki), `git diff --check` | izhod 0 |
| Posnetki | [CaseStudyNav 320 privzeto/stres](./bauma-v3-card-names-artbite-overflow-evidence/), [ArtBite hero 320 stres](./bauma-v3-card-names-artbite-overflow-evidence/artbite-320-stress-hero-proof.png), kartice Home/Work (pregledani vizualno: stres CaseStudyNav in ArtBite hero) |

## 5. Omejitve

- Dostopna imena so iz **Chromiumovega dostopnostnega drevesa (CDP)**; **bralnik zaslona (VoiceOver, NVDA) ni bil uporabljen**, zato to ni preizkus z bralnikom.
- Preizkus razmikov je programski (CSS stres po WCAG 1.4.12 na celotni strani); pri 320 px se v skrajnem primeru dolge besede lomijo sredi besede (»Hardshellja/cket«, »pristopo/m.«); besedilo je v celoti vidno. Pri privzetih razmikih ni sprememb videza.
- Preverjeno samo na `/work/artbite` (preliv), ostalih deset strani samo za preliv dokumenta; drugih študij ni bilo treba spreminjati (preliva ni).
- Preostala dostopnost (kontrasti, drugi vzorci, celotno testiranje z bralniki) ni zaključena; to je ozek pregled dveh točk.

## Povzetek

- **Potrjene napake:** (a) preliv 17 px na `/work/artbite` pri 320 px s povečanimi razmiki (vzrok: ime »Hardshelljacket« v `CaseStudyNav`); (b) odrezano besedilo (29 px) v ArtBite hero rekonstrukciji pri 320 px s stresom.
- **Izvedena popravka:** `break-words` na `CaseStudyNav` `TITLE` in na odstavku v `ArtBiteHeroProof`.
- **Opažanja brez posega:** imena kartic so že pravilna (`aria-labelledby`), združeno besedilo je samo v `textContent`; besedilo posterja je izpostavljeno znotraj povezave.
- **Odprto:** preizkus z bralnikom zaslona; preostali dostopnostni pregledi.
