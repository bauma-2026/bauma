# BAUMA V3 — TECH-001: prvi sklop lint popravkov

25. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07926df85731122b430f25ae786a97f06a8`. Pregled in spremembe so lokalni; objavljeni staging ni preverjen. Predhodne necommitane spremembe in Git staging so ohranjeni.

## Rezultat

Od šestih ciljnih diagnostik so odpravljene **štiri**. Dve v V2 animacijskih hookih ostajata odprti, ker bi prestavitev njunih ponastavitev lahko spremenila obnašanje pri izklopu in ponovnem vklopu. Celotni lint zato ostaja neuspešen. Cilj je delno dosežen; uspešna gradnja ne zapre TECH-001.

| Datoteka | Diagnostika in izvedba |
|---|---|
| `components/home/approach/useFinePointer.ts` | `react-hooks/set-state-in-effect`: začetno sinhrono `setState` je zamenjal `useSyncExternalStore`. Snapshot bere isto media query; strežniški/hydration snapshot ostane `false`, poslušalec se odstrani ob odmontiranju. Spremembe pointerja sprožijo osvežitev. |
| `components/home/approach/useReducedMotion.ts` | Ista diagnostika in rešitev za `prefers-reduced-motion: reduce`; začetni SSR snapshot ostane `false`, spremembe in cleanup so preverjeni. |
| `components/home/debug/RightObjectAxisDebug.tsx` | `react-hooks/set-state-in-effect`: stanje `active` je podvajalo pogoj ob meritvi. Pogoj `?axis=1` še vedno varuje merjenje in naročnine; prikaz je odvisen od obstoječe meritve `refX`. Meritev, interval 400 ms in cleanup ostajajo. Modul je pogojno uvožen prek `RightObjectAxisDebugGate` na `/` in `/en`; privzeto ni prikazan. |
| `components/home/hero-system/v3/useHeroProximityV3.ts` | `react-hooks/refs`: zapis aktualnega callbacka v ref se iz renderja prestavi v `useLayoutEffect`, po potrditvi spremembe in pred izrisom. Runtime, sprožilci, matematični model, RAF in cleanup so nespremenjeni. Statični uvoz prek `HomeHeroVisual` sam po sebi ne potrjuje, da je ta pogojna različica vidna na pregledani strani. |

Obe V2 diagnostiki `react-hooks/set-state-in-effect` ostajata: `useMaterialActivation.ts` ob `runtimeEnabled=false` takoj ponastavi refa in objavljeni debug, `usePoseAuthority.ts` pa refa in izrisani snapshot. Če se zgolj vrne izračunana vrednost, lahko ob ponovnem vklopu za kratek čas ponovno nastopi star snapshot; če se ponastavitev zamakne v RAF, se spremeni trenutek mirovanja. Najmanjši naslednji poseg je najprej natančen regresijski preizkus preklopa aktivno → neaktivno → aktivno za obe veji in odločitev o ohranitvi zamrznjenega snapshota; nato ciljni popravek in ponovitev linta. Brez timeoutov, izključevanja pravil ali spremembe časovnic v tem posegu.

## Okolje in diagnostike

Po začetnem preverjanju sta manifest/lock navajala Next in eslint-config-next 16.4.1 ter sharp 0.35.5, nameščena Next in sharp pa 16.1.6 in 0.34.5. Ustavljen je bil samo prepoznani strežnik tega projekta na 3000. `npm ci --no-audit --no-fund --cache /tmp/bauma-security-20261025/npm-cache` je uspel (0), brez spremembe manifestov. `npm run dev` se je ponovno zagnal na 3000, nameščeni Next in eslint-config-next sta 16.4.1, sharp 0.35.5; GET `/` vrne 200. Strežnik ostaja zagnan.

| Preverjanje | Izhod in rezultat |
|---|---|
| `npm run lint -- . --format json --output-file /tmp/bauma-lint-active-20261025/before-eslint.json` | 1; **41 napak, 91 opozoril** pred popravki. |
| `./node_modules/.bin/eslint` na štirih spremenjenih datotekah | 0; brez diagnostik. |
| Enak celotni lint po spremembah | 1; **37 napak, 91 opozoril**. Primerjava po datoteki, vrstici, stolpcu, pravilu in resnosti: štiri odstranjene zgoraj, nič novih. |
| `./node_modules/.bin/tsc --noEmit --incremental false` | 0; celotni TypeScript uspešen. |
| `SITE_ENV=production VERCEL_ENV=production NEXT_TELEMETRY_DISABLED=1 npm run build` v izolirani kopiji | 0; vključeni aktualni izvori in labi, brez prepisovanja `.next` delujočega strežnika. |

Prejšnjih **26/69** je bilo izmerjenih v izolirani kopiji, ki ni vsebovala `.claude`, `.recovery`, `tmp` in `docs/audits`. Dejanski celotni lint jih zajame: 15 dodatnih napak vključuje 7 v obnovitvenih kopijah in 8 v štirih dokaznih `.cjs` skriptih prejšnjega varnostnega zapisa; dodatnih 22 opozoril prihaja iz prej izpuščenih map. To ni dokaz nove regresije aplikacije, vendar so to dejanski rezultati sedanjega celotnega ukaza in jih ni mogoče odšteti brez navedbe drugačnega obsega. Preostale datoteke niso bile popravljene ali izključene.

## Regresijski preizkusi

Chromium 151.0.7922.34, lokalni dev na `localhost:3000`, `/` in `/en`, 375 × 812 (touch/coarse) in 1440 × 900 (fine). Obe začetni nastavitvi gibanja in preklop `reduce` ↔ `no-preference` med sejo, pomik po strani, 200 na obeh poteh, brez zabeleženih pageerror/console napak ali horizontalnega prelivanja; izmerjena višina se pri preklopu ni spremenila. Fine in coarse sta preverjena v ločenih emuliranih kontekstih; fizične menjave pointerja na dejanski napravi niso preverjene. Preizkus sam po sebi ni popolna vizualna primerjava in ne dokazuje odsotnosti vsakega kratkega utripa.

Za oba media hooka je bila v izolirani kopiji uporabljena začasna testna stran s simuliranim `matchMedia`: `false:false` → `true:true` → `false:false`; po odmontiranju sta bila oba poslušalca odstranjena (1 → 0). Test ni dodal ogrodja ali projektne poti. Preveri odziv in cleanup hookov, ne realne spremembe strojne opreme. Pogojni V2/V3 animacijski veji, dejanska časovna enakovrednost in vizualni debug overlay niso bili celovito dinamično preverjeni; izvorna dosegljivost ne potrjuje njune vidnosti. Safari in prava naprava ostajata zunaj tega preverjanja.

Dnevniki, rezultati in natančna razlika diagnostik so v [dokazni mapi](./bauma-v3-lint-active-evidence/). Ni commita, pusha ali deploya.
