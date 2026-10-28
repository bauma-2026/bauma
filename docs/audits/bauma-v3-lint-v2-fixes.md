# BAUMA V3 — TECH-001: nadaljevanje V2

26. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07926df85731122b430f25ae786a97f06a8`. **Popravek ni izveden.** Dve V2 diagnostiki ostajata odprti. Predhodne spremembe in staging so ohranjeni; preizkus ni potrditev staginga.

## Ugotovitve preizkusa

V izolirani začasni testni strani sta bila dejansko uporabljena `useMaterialActivation` in `usePoseAuthority` v React StrictMode. Preizkus je simuliral RAF po hidrataciji, prisilil materialno aktivacijo in `scrub=1`, zajemal objave v `useLayoutEffect` ter v začasni kopiji dodal bralnika izbranih internih refov. Začetni mount je bil neaktiven. Sledilo je active → animacija → inactive → active pred naslednjim RAF, prvi RAF po vklopu, reduced motion in unmount. Surovi [rezultati izhodišča](./bauma-v2-lint-evidence/before-runtime.json) in [preizkusni skript](./bauma-v2-lint-evidence/test.cjs.txt) so shranjeni.

| Trenutek | Opazovanje |
|---|---|
| Začetno neaktivno | izpisana blend in material 0; noben RAF v kontrolirani vrsti. |
| Med animacijo | blend 0,9787, material 1; dva RAF v vrsti. |
| Izklop | najprej commit s starima vrednostma, nato commit z blend/material 0; preverjene reference blend, target, activation in material target se ponastavijo, kontrolirana vrsta RAF je prazna. |
| Ponovni vklop pred naslednjim RAF | prvi zajeti commit objavi blend 0 in material 0; dva nova RAF. Prvi RAF začne iz ničelnega izhodišča. |
| Reduced motion | zajeti refi/objavljeni vrednosti so 0. |
| Unmount | kontrolirana RAF vrsta je prazna. |

To je pomembna razlika med trenutnim obnašanjem ob **izklopu**, ko se v prvem commitu še pojavi stara vrednost, in ob **ponovnem vklopu po flushu efektov**, ko je v prvem zajetem commitu ničelna. Preizkus ne dokazuje obnašanja vseh možnih prepletanj renderjev. `scrub` v tem vzorcu izklopi pointer poslušalce, zato njihovo odstranjevanje ni bilo dinamično potrjeno; druge reference, fizični pointer, prava naprava in prikaz V2 pri 375 × 812 in 1440 × 900 ostajajo nepreverjeni. Preizkus ne dokazuje vizualne enakovrednosti.

## Diagnostiki in razlog za nedokončan popravek

- `useMaterialActivation.ts:98`: `react-hooks/set-state-in-effect` opozarja na `setDebug` v neaktivni veji; ista veja ponastavi `activationRef` in `targetRef`.
- `usePoseAuthority.ts:468`: isto pravilo opozarja na `setSnap` v neaktivni veji; ista veja ponastavi blend, target, authority in pointer ref ter prekine ambient.

V začasni kopiji je bil preizkušen kandidat z interno naročniško shrambo. V enem nadzorovanem zaporedju so se njegove številčne objave in merjeni refi ujemali z izhodiščem ([kandidat](./bauma-v2-lint-evidence/candidate-runtime.json)); to **ni** dokaz popolne enakovrednosti ali končni popravek. Kandidat dodaja naročniški mehanizem in spreminja način razpošiljanja stanja. Niso dokazani vrstni redi pri vseh prepletih, cleanup pointer/visibility/media poslušalcev in odziv dejanskega prikaza. Ni bilo dovolj podlage, da bi takšno strukturno spremembo vnesli v projekt zgolj za odpravo diagnostike. Pravila niso bila izklopljena in noben timeout ni bil dodan.

Naslednji korak: razširiti preizkus na dejanski pointer brez `scrub`, slediti prijavam/odjavam vseh poslušalcev in `IntersectionObserver`, izrecno preveriti različne vrstne rede hitrih commitov ter vizualni V2 prikaz pri obeh širinah. Nato izbrati strukturno rešitev in ponoviti isti preizkus pred in po dejanskem popravku.

## Preverjanja in obseg linta

| Ukaz | Rezultat |
|---|---|
| `npm run lint -- . --format json --output-file /tmp/bauma-v2-lint/before-eslint.json` | 1; 37 napak, 91 opozoril. |
| Enak ukaz z `after-eslint.json` po preizkusu | 1; 37 napak, 91 opozoril; po datoteki, mestu in pravilu nič dodanih ali odstranjenih diagnostik. Projektna koda ni bila spremenjena. |
| `./node_modules/.bin/eslint components/home/hero-system/v2/useMaterialActivation.ts components/home/hero-system/v2/usePoseAuthority.ts` | 1; obe ciljni napaki in tri predhodna opozorila v pose hooku ostajajo. |
| `./node_modules/.bin/tsc --noEmit --incremental false` | 0. |
| `SITE_ENV=production VERCEL_ENV=production NEXT_TELEMETRY_DISABLED=1 npm run build` v izolirani kopiji | 0 po odstranitvi začasne testne poti in njenega izoliranega dev cachea. Pred tem je poskus po odstranitvi poti naletel na zastarele generirane dev tipe; ti niso bili v uporabnikovem drevesu. |

Celotni lint obakrat zajema enak dejanski obseg. Za poročanje so `app/`, `components/` in `lib/` (vključno z labi/preview v njih) združeni kot izvor: **22 napak, 36 opozoril**. Pomožne/recovery/proof poti `.claude/`, `.recovery/`, `tmp/`, `docs/`, `scripts/`, `test-results/` in `lab-screenshots/`: **15 napak, 55 opozoril**. Ostale poti: 0/0. Te kategorije niso sprememba lint konfiguracije in niso razvrstitev vseh labov kot aktivnega produkcijskega UI. Prejšnjega rezultata 26/69 iz ožje kopije ne primerjamo neposredno.

Obstoječi strežnik na 3000 ni bil ustavljen; po preizkusu `/` vrača 200. Začasni izolirani strežnik je ustavljen. Ni commita, pusha ali deploya. Dokazi so v [mapi](./bauma-v2-lint-evidence/).
