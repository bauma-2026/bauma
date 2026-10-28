# BAUMA V3 — A11Y-006: krajša samodejna sekvenca kocke

25. 10. 2026. Popravek samo za samodejni prihod kocke ob »Pod površino je sistem.« na `/`. Prvotni audit ni spremenjen.

## 1. Osnova

- Veja `staging/bauma-v3`, HEAD `6b2fa07926df85731122b430f25ae786a97f06a8`.
- Obstoječe necommitane spremembe so ostale. Ni commit, pusha ali deploya.
- V projektu ni `AGENTS.md` ali `CLAUDE.md`. Prebrana sta `.claude/launch.json` (lokalni `npm run dev` na vratih 3000) in `docs/audits/bauma-v3-accessibility-audit.md`.
- Domača stran uporablja `MiniSystemPocket` z `homeMotion`. Besedilo naslova je »Pod površino je sistem.«
- `SystemCubeB51` je skupna komponenta. Istih ur `REVEAL_S` / `HOLD_S` / `RETURN_S` ne uporablja samo dom. Zato krajša časovnica velja samo za nenadzorovan prihod pri `homeMotion`. Kazalec, odhod in scroll nudge ostanejo na skupnih urah. Klici brez `homeMotion` teh ur ne spremenijo.

Drugi klici, nespremenjeni: `MiniSystemHome` (labi), `app/lab/system/connected`, `register-pocket`, `middle-a`, `middle-b`. Projektna kocka je `MiniProjectCube`, ne ta komponenta.

## 2. Časovnica prej

Skupne ure, ki so prej tekle tudi na domu in še vedno tečejo povsod drugje:

| Faza | Ura | Vrata sekvence |
|---|---:|---:|
| Reveal, prosojnost | `REVEAL_S` 2,50 s | da |
| Odprtje poze | `ORIENT_OPEN_S` 1,75 s | ne, konča med reveal |
| Hold | `HOLD_S` 1,25 s | da |
| Return, prosojnost | `RETURN_S` 2,25 s | da |
| Vrnitve poze | `ORIENT_RETURN_S` 1,05 s | ne, konča med return |
| Lovljenje poze | `ORIENT_TAU` 0,38 s, med returnom 0,28 s | rep po tem, ko je cilj že 0 |

Vsota vrat: **6,00 s**. Poza se med daljšim ugašanjem prosojnosti še lovi proti miru. Audit je na domu, relativno na prihod v pogled, zabeležil: 5,2 s še `returning` (`reveal` 0,616), 6,5 s še `returning`, šele vzorec pri 8 s je `rest`.

Ista nespremenjena komponenta, izmerjena zdaj na `/lab/services-grid/home` (`MiniSystemHome`, brez `homeMotion`), 1440 × 900:

- revealing 2,50 s, holding 1,27 s, returning 2,27 s;
- od prvega vidnega premika do zadnje spremembe izrisa **5,93 s**; faza `rest` pri 6,03 s;
- **5 s po prvem vidnem premiku gibanje še traja.**

## 3. Sprememba

Samo nenadzorovan prihod na domu (`homeMotion` in kazalec ni na kocki) pomnoži ure reveal, orient-open, hold, return, orient-return in oba časa lovljenja poze z **0,72**. Deleži ostanejo: odpiranje, kratek zadržek, zapiranje. Število časovnih konstant lovljenja ostane enako, zato je poza ob koncu returna že znotraj obstoječega praga 0,0004 rad. Koda jo v istem okvirju postavi na nič. To ni preskok z odprte poze.

Kazalec med sekvenco izklopi to merilo in nadaljuje na skupnih urah. Zapiranje po odhodu kazalca ostane `LEAVE_DELAY_MS` 200 ms in `LEAVE_RETURN_S` 1,4 s. Scroll nudge ni spremenjen. `sequenceArmed` in pogoj `vis > 0,45` sta ista. Nove zanke ali gumba za ustavitev ni.

Nove ure samo za ta prihod:

| Faza | Ura | Vrata |
|---|---:|---:|
| Reveal | 1,80 s | da |
| Odprtje poze | 1,26 s | ne |
| Hold | 0,90 s | da |
| Return | 1,62 s | da |
| Vrnitve poze | 0,756 s | ne |
| Lovljenje | 0,274 s, med returnom 0,202 s | skupaj z returnom |

Vsota vrat: **4,32 s**.

## 4. Izmerjeno trajanje

Meritev je wall-clock `performance.now` ob vsakem izrisnem okvirju, ne vsota konstant. Brano je stanje, ki ga komponenta zapiše v izris: `data-phase`, `data-reveal`, `data-orient`, `data-yaw`, `data-pitch`, opacity notranjosti in zgoščena vrednost poti `body` ter polnil sprednje in desne ploskve.

- Začetek vidnega gibanja: prvi okvir faze `revealing`, ko se poza od začetnega okvirja premakne za ≥ 0,003 rad ali reveal/orient doseže ≥ 0,01.
- Popolna umiritev: zadnji okvir, v katerem se spremeni faza, reveal, orient, yaw, pitch, opacity ali pot.
- Kazalec je zunaj kocke. Svež dokument, kocka najprej ni v pogledu (`vis` 0, `phase` rest), nato koraki `scrollTo` do sredine sekcije in nič več vnosa.

Šest svežih nalaganj, po tri na 1440 × 900 in 375 × 812:

| Prikaz | Vidno gibanje | Do zadnje spremembe izrisa | Reveal / hold / return |
|---|---:|---:|---|
| 1440, 1 | 4,20 s | 4,32 s | 1,80 / 0,92 / 1,63 s |
| 1440, 2 | 4,17 s | 4,28 s | 1,78 / 0,90 / 1,63 s |
| 1440, 3 | 4,18 s | 4,30 s | 1,78 / 0,92 / 1,63 s |
| 375, 1 | 4,18 s | 4,30 s | 1,80 / 0,90 / 1,63 s |
| 375, 2 | 4,20 s | 4,32 s | 1,80 / 0,92 / 1,63 s |
| 375, 3 | 4,18 s | 4,30 s | 1,78 / 0,92 / 1,63 s |

Vidno gibanje traja **4,17–4,20 s**. Popolna umiritev traja **4,28–4,32 s**. Oboje je znotraj cilja približno 4–4,5 s in pod petimi sekundami. Nekaj stotink nad 0,90 s pri holdu je meja okvirja (~16 ms), ne daljša ura.

Na vseh šestih zagonih je zadnja sprememba izrisa isti okvir, v katerem faza postane `rest`. Za njim ni repa. Končno stanje je vedno `phase=rest`, `reveal=0`, `orient=0`, `yaw=0,5200`, `pitch=0,4000` (`BASE_YAW` / `BASE_PITCH`). Razlika, ki jo koda v tem okvirju izniči, je pod 0,0004 rad, to je manj kot desetinka piksla na kocki te velikosti.

Od prvega vidnega premika + 5 s do konca posnetka (še približno 2 s) so faza, poza, opacity in pot nespremenjeni. Po petih sekundah samodejnega gibanja ni.

Suhi zapisi: [measurements.json](./bauma-v3-a11y-cube-timing-evidence/measurements.json).

## 5. Sprožitev in interakcija

- Svež dom: ena sekvenca, ne več.
- Odhod na vrh (`vis` 0, obstoječe ponovno oboroženje) in ponovni prihod: natanko druga sekvenca, na 1440 in na 375. V 2,5 s po njenem `rest` tretje ni. Krajšanje ni dodalo zanke.
- Kazalec na sredino kocke po končani sekvenci, 1440: v ~0,9 s je `reveal` 0,25. To ustreza nespremenjeni uri 2,5 s (`smootherstep(0,9/2,5) ≈ 0,25`), ne skrajšani 1,80 s (ta bi bila približno 0,5). Yaw se je razširil za 0,031 rad. Po odhodu kazalca na (8, 8) se kocka vrne na `yaw` 0,5200 in `pitch` 0,4000. Samodejna sekvenca se ne ponovi.
- 375 je tekel kot dotik (`hasTouch`, `isMobile`). Ena samodejna sekvenca in mir. Fina kazalčna sled v tem načinu ni vezana; kocka se ni držala odprta.

## 6. Reduced motion

Ob `prefers-reduced-motion: reduce` na svežem domu, 1440 in 375, skozi pomik v pogled in nadaljnjih 2,5 s: `mode=reduced`, `phase=open`, `reveal=0,720`. V repu posnetka je ena sama zgoščena vrednost poti, torej izris stoji. To je prejšnje statično stanje.

Sprememba med odprto stranjo, 1440, kocka že v pogledu: preklop na `reduce` prek `Emulation.setEmulatedMedia`. V naslednjem oknu (~1,1 s, 66 okvirjev) ostane `reduced` / `open` / `reveal` 0,720 in ena pot. Preklop nazaj na `no-preference` obstoječi `matchMedia` poslušalec znova zažene krmilnik. Ker je kocka v pogledu, steče en prihod (vidno 4,15 s, umiritev 4,27 s) in se ustavi. To ni nova zanka zaradi krajše ure; poslušalec je isti kot prej.

## 7. Dokaz

[home-cube-auto-sequence.webm](./bauma-v3-a11y-cube-timing-evidence/home-cube-auto-sequence.webm) — 7,12 s, 1440 × 900, DPR 1, običajno gibanje. Svež dom, kazalec v zgornjem levem kotu, pomik do »Pod površino je sistem.«, nato sekvenca brez nadaljnjega vnosa. Posnetek zajame prihod, odprtje notranjosti, zaprtje in mirna zadnja dva zajeta sekundi.

## 8. Preverjanje izvorne kode

- ESLint, `app/components/blocks/mini/SystemCubeB51.tsx`: brez opozoril.
- `tsc --noEmit`: brez napak. Nepovezanih napak ni bilo.

## 9. Omejitve

- Playwright 1.62.1, headless Chromium 151.0.7922.34, DPR 1, CSS px 375 × 812 in 1440 × 900. Lokalni `next dev` na `http://localhost:3000`, delovno drevo z drugimi necommitanimi spremembami. Staging ni preverjen.
- Reduced motion je emulacija v brskalniku, ne stikalo v sistemskih nastavitvah macOS. Preklop med sejo je CDP `Emulation.setEmulatedMedia`, ki sproži `matchMedia`.
- Ni Safarija, fizičnega telefona, bralnika zaslona ali ročnega merjenja s štoparico. Čas je `performance.now` ob izrisnem okvirju, ločljivost približno 16 ms.
- Vidni prag 0,003 rad oziroma 0,01 reveal je izbira za »vidno«. Popolna umiritev je strožja: zadnja sprememba atributov in poti, vključno s podpikselskim repom.
- Pomik je programski `scrollTo`, ne prst na steklu. Kazalec med samodejno sekvenco ni šel čez kocko.
- Živo je primerjana ena druga instanca (`MiniSystemHome` na `/lab/services-grid/home`). Ostali klici brez `homeMotion` uporabljajo iste nespremenjene konstante; njihovih lab strani nisem vseh štopal.
- Hero, kartice in projektna kocka niso spremenjeni v izvoru. V posnetku so vidne kot okolica, ne kot predmet ločene časovne meritve.

Spremenjene datoteke: `app/components/blocks/mini/SystemCubeB51.tsx`, to poročilo, `docs/audits/bauma-v3-a11y-cube-timing-evidence/home-cube-auto-sequence.webm`, `docs/audits/bauma-v3-a11y-cube-timing-evidence/measurements.json`. Začasne merilne skripte so odstranjene. Nič ni commitano, pushano ali deployano.
