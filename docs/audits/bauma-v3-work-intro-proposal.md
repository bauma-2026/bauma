# BAUMA V3 — /work: predlog močnejšega uvoda (lokalni predogled)

27. 10. 2026 · **Status: varianta A (»Izbrani projekti.«) je potrjena in lokalno integrirana v `app/work/page.tsx`; lokalni izdajni kandidat je osvežen in preverjen. B, C (tudi C2 z naslovom »Zasnovano. Oblikovano. Izvedeno.«) in D so odloženi.** Ni commita, pusha ali objave. Podrobnosti: [Integracija A in osvežitev kandidata](#integracija-a-in-osvežitev-kandidata-27-10-2026) na koncu.

Zgodovina: prejšnji status »Varianta C z novim naslovom pripravljena za vizualno potrditev« je nadomeščen z zgornjim.

Dopolnitev: na Gregovo željo sta pripravljena še **predloga B in C** — glej [Predloga B in C](#predloga-b-in-c-dopolnitev-27-10-2026) na koncu. Spodnji opis do tam velja za predlog **A** (dva stolpca, `localhost:3101`).

Dokazi: [bauma-v3-work-intro-proposal-evidence/](./bauma-v3-work-intro-proposal-evidence/)

## Predogled

- **Izolirana kopija** delovnega drevesa (vključno z vsemi necommitanimi spremembami, brez `.git`, `.next`, `docs`, `.recovery`), `node_modules` kot APFS klon:
  `/private/tmp/claude-501/-Users-bauma--claude-spares-spare-QTbzxL/1f7a36a7-3b5e-4156-a4fd-855426e751e7/scratchpad/work-intro`
- **Naslov:** <http://localhost:3101/work> (`next dev -p 3101`, zagnan iz kopije). Primerjava: sedanje stanje na <http://localhost:3000/work> (obstoječi dev strežnik, ni bil ustavljen ali spremenjen).
- Ponoven zagon, če se strežnik ustavi (mapa je v začasnem območju seje; če jo sistem počisti, jo poustvari kopija delovnega drevesa + [candidate.diff](./bauma-v3-work-intro-proposal-evidence/candidate.diff)):

```bash
cd /private/tmp/claude-501/-Users-bauma--claude-spares-spare-QTbzxL/1f7a36a7-3b5e-4156-a4fd-855426e751e7/scratchpad/work-intro && npx next dev -p 3101
```

- V glavnem projektu ni nove poti (ne javne ne lab); `app/work/page.tsx` v glavnem projektu je bajtno enak izhodišču kopije.

## Kaj predlog spremeni

Samo uvod sekcije `selected-work` in razmik do mreže:

| | Sedanje | Predlog |
|---|---|---|
| Oznaka »WORK« | 11 px mono, nad naslovom | odstranjena |
| H1 | »Izbrani projekti«, Inter 500 (`home-bridge-heading`), 26 px / 30 px od `sm` | »Izbrani projekti.«, **DM Serif Display 400** (`font-serif`, obstoječi `--font-serif` iz korenskega layouta), `leading-none`, `tracking -0.025em`, `text-balance`, `break-words` |
| Velikost H1 | 26 / 30 / 30 px | `clamp(2.25rem, 1.2rem + 4.6vw, 4.5rem)` (isti izraz kot `.onas-h1` in `.apw-h1`) → 36,5 px @375, 54,5 px @768; od `lg` `min(5rem, 6.4vw)` → 65,5 px @1024, **80 px od 1250 px** |
| Odstavek | — | »Spletne strani in digitalne rešitve. Od izhodišča in ključnih odločitev do oblikovanja in delujoče izvedbe.« 17 px / 1,55, `max-w 34rem`; od `lg` 18 px / 1,55, `max-w 31rem` (496 px), bel 74 % (kot lead na /o-nas) |
| Postavitev | en stolpec | do 1023 px drug pod drugim; **od `lg` (1024 px) dva stolpca** z istimi stolpci in razmiki kot mreža kartic (`gap-x-10`, `xl:gap-x-12`), odstavek v drugem stolpcu (levi rob = levi rob desne kartice), `items-end` + `pb-1` |
| Zgornji odmik | 112 / 128 / 144 px | **96 / 112 / 128 px** (osnova / `sm` / `lg`) |
| Uvod → mreža | 40 / 48 / 56 px | 40 / 48 / **64 px** |

Kartice, vrstni red, velikosti, razmiki v mreži, hover, fokus, cilji, glava, zaključni razdelki, metapodatki in indeksiranje so nespremenjeni (preverjeno: širina, višina in levi rob prve in druge kartice enaki pri vseh 10 merjenih stanjih).

## Meritve (Chromium, `measure.cjs`)

| Viewport | H1 pred → po | H1 / ime kartice (20 px) | Odstavek | Začetek prve vrste (y) | Vidno od prve vrste |
|---|---|---|---|---|---|
| 320 × 640 | 26 → 36 px | 1,3 → 1,8 | 272 px, 4 vrstice | 215 → 293 | 425 → 347 px |
| 375 × 812 | 26 → 36,5 px | 1,3 → 1,8 | 327 px, 3 vrstice | 215 → 267 | 597 → 545 px |
| 768 × 1024 | 30 → 54,5 px | 1,5 → 2,7 | 544 px, 2 vrstici | 246 → 287 | 778 → 737 px |
| 1024 × 768 | 30 → 65,5 px | 1,5 → 3,3 | 460 px, 2 vrstici | 270 → 258 | 498 → 510 px |
| 1440 × 900 | 30 → 80 px | 1,5 → 4,0 | 496 px, 2 vrstici | 270 → 272 | 630 → 628 px |
| 1920 × 1080 | 30 → 80 px | 1,5 → 4,0 | 496 px, 2 vrstici | 270 → 272 | 810 → 808 px |

- **Poravnava od `lg`:** osnovnica zadnje vrstice odstavka je na osnovnici H1 (196 = 196 px @1280–1920; 182 vs 183 @1024). H1 zaseda 542 od 584 px stolpca @1440.
- **Bralna širina:** 18 px pri 496 px ≈ 55–60 znakov v vrstici; na mobilnem 17 px pri 327 px ≈ 38 znakov.
- **Prazen prostor:** @1440 je od spodnjega roba glave (52 px) do vrha H1 76 px (prej 92 px do oznake »WORK« in 133 px do H1); prva vrsta ostane na istem mestu (+2 px). Na mobilnem se prva vrsta spusti za 52 px (375) oz. 78 px (320) — to je cena odstavka; zgornji odmik je za to zmanjšan s 112 na 96 px.

## Razlogi za razmerja

- **Ista lestvica kot /o-nas in /pristop** do `lg`: H1 /work se bere kot glavni naslov iste družine strani, ne kot naslov razdelka. Od `lg` je izraz prilagojen kompoziciji: 72 px kape /o-nas bi v 584-px stolpcu pustilo 96 px praznega desno; 80 px zapolni ~93 % stolpca in ostane v eni vrstici. `6.4vw` zadrži eno vrstico tudi pri 1024 px (444 / 460 px).
- **Razmerje do kartic:** pri 1440 je H1 4 × ime kartice (prej 1,5 ×) in je po teži nad tipografijo posterjev (Flexido 49,6 px), kar je bil glavni problem. **Na mobilnem je H1 (36,5 px) celo malenkost manjši od izjav na Flexido posterju (37,6 px @375)**; razliko nosita serifna pisava in položaj na vrhu. Če bi na mobilnem želeli jasnejšo prevlado, je naslednji korak 2.5rem (40 px) — pri 320 px bi se H1 prelomil v dve vrstici; v tem predlogu tega ni, ker bi odstopil od lestvice /o-nas.
- **Dva stolpca na mreži kartic** naredita uvod del iste kompozicije: levi rob H1 = leva kartica, levi rob odstavka = desna kartica.
- **Odmiki:** predlog ne povečuje višine uvoda. Na namizju se uvod z enakim začetkom mreže spremeni iz »oznaka + majhen naslov + prazno« v »velik naslov + odstavek«; zgornji odmik je za 16 px manjši, ker večji H1 sam nosi težo, razmik do mreže je za 8 px večji, ker 80-px naslov potrebuje nekaj več zraka do kartic kot 30-px.
- **768 px ostane v enem stolpcu:** H1 54,5 px ne bi šel v eno vrstico 340-px stolpca; sklad je mirnejši.

## Odpornost (320 px, povečani razmiki)

Stresni slog WCAG 1.4.12 (`line-height 1.5`, `letter-spacing 0.12em`, `word-spacing 0.16em`, `p { margin-bottom: 2em }`) pri 320, 375 in 1440: brez vodoravnega preliva dokumenta (`scrollWidth = clientWidth`), brez rezanja; H1 se naravno prelomi v dve vrstici, odstavek raste, mreža se spusti. Uvod nima fiksne višine. (Oznaka `scrollHeight > clientHeight` na H1 pri `leading-none` je prisotna tudi v sedanjem stanju — vzpon pisave nad vrstico, `overflow: visible`, nič ni odrezano.)

## Konzola, lint, pisave

- Konzola: v kopiji enaka množica sporočil kot na :3000 v vseh 10 stanjih, **0 novih**. Obstoječa so dev opozorila `next/image` (`quality` 85/90 ni v `images.qualities`, LCP `loading="eager"`) — nespremenjena, niso del tega predloga.
- `npx eslint app/work/page.tsx` v kopiji: 0 napak, 0 opozoril. `tsc --noEmit`: 0 diagnostik za `app/work/page.tsx`.
- Pisave: /work @1440 zahteva istih 9 datotek pred in po (DM Serif Display je že naložen v korenskem layoutu); nova definicija pisave ni dodana.

## Opozorilo o vsebinskem ponavljanju (ni spremenjeno)

- Zaključni razdelek /work ima nadnaslov »Od zasnove do izvedbe« — odstavek uvoda uporabi isto zgradbo »Od … do … izvedbe«.
- Odstavek zaključka (»Pri Baumi načrtujemo, oblikujemo in razvijamo spletne strani …«) in uvod oba opisujeta obseg (spletne strani, zasnova → izvedba).
- Meta opis /work (»Izbor spletnih strani in digitalnih rešitev. Izhodišča projektov, odločitve …«) je skoraj parafraza uvoda. To ni napaka, a ob potrditvi je vredno odločiti, ali naj zaključni nadnaslov ostane.

## Integracija (po potrditvi)

Spremenila bi se **ena datoteka:** `app/work/page.tsx` (brez CSS datotek, brez novih odvisnosti). `data-work-intro` in `data-work-lead` sta merilna kljuka; lahko ostaneta ali se odstranita.

### Točen diff kandidata

```diff
--- a/app/work/page.tsx
+++ b/app/work/page.tsx
@@ -338,18 +338,30 @@
           <section
             data-section="selected-work"
             aria-labelledby="work-heading"
-            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-28 text-white sm:pb-12 sm:pt-32 lg:pb-[3.25rem] lg:pt-36"
+            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-24 text-white sm:pb-12 sm:pt-28 lg:pb-[3.25rem] lg:pt-32"
           >
             <div className="mini-page-rail">
-              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Work</p>
-              <h1
-                id="work-heading"
-                className="home-bridge-heading mt-5 text-balance text-[1.625rem] font-medium [font-optical-sizing:auto] sm:mt-6 sm:text-3xl"
-              >
-                Izbrani projekti
-              </h1>
+              {/*
+               * Intro: the serif H1 on the /o-nas and /pristop scale, then the lead. From `lg` two columns on the grid's own
+               * columns and gaps, the lead in the second, its last line level with the foot of the H1.
+               */}
+              <div data-work-intro className="lg:grid lg:grid-cols-2 lg:items-end lg:gap-x-10 xl:gap-x-12">
+                <h1
+                  id="work-heading"
+                  className="font-serif text-[clamp(2.25rem,1.2rem+4.6vw,4.5rem)] lg:text-[min(5rem,6.4vw)] font-normal leading-none tracking-[-0.025em] text-balance break-words"
+                >
+                  Izbrani projekti.
+                </h1>
+                <p
+                  data-work-lead
+                  className="mt-4 max-w-[34rem] text-pretty text-[1.0625rem] leading-[1.55] text-white/74 sm:mt-5 lg:mt-0 lg:max-w-[31rem] lg:pb-1 lg:text-[1.125rem]"
+                >
+                  Spletne strani in digitalne rešitve. Od izhodišča in ključnih odločitev do oblikovanja in delujoče
+                  izvedbe.
+                </p>
+              </div>
 
-              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-14 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
+              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-16 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
                 {PROJECTS.map((p, i) => {
                   const id = `work-${p.slug}`;
                   const { Art } = p;
```

Ob integraciji velja tudi komentar na vrhu datoteke (»At 1440px the rail is 1216px …«) — ostane točen, saj se mreža ne spremeni.

## Dokazi

- `compare-375.png`, `compare-1440.png` — sedanje / predlog drug ob drugem.
- `after-768.png`, `after-1920.png` (+ `before-*` za iste širine), `after-320.png`, `after-320-stress.png`, `before-320*.png`.
- `before-measure.json`, `after-measure.json` — geometrija, pisave, konzola, preliv za 7 širin + 3 stresna stanja.
- `measure.cjs`, `baseline.cjs`, `compare.cjs`, `fonts.cjs` — skripte; `candidate.diff`.

## Meje

Samo Chromium (Playwright) v `next dev`; ni produkcijske gradnje, ni Safarija, ni bralnika zaslona. Posnetki so vidno polje, ne cela stran. Nič ni commitano, pushano ali objavljeno; work.bauma.si ostane noindex, bauma.si nespremenjen.

## Predloga B in C (dopolnitev 27. 10. 2026)

Iste omejitve kot A: ločeni izolirani kopiji (`work-intro-b`, `work-intro-c` v istem začasnem območju), spremenjen samo uvod in razmik do mreže v `app/work/page.tsx`, brez nove poti in brez CSS datotek.

| | A · dva stolpca | B · kot /o-nas | C · širok naslov |
|---|---|---|---|
| Predogled | <http://localhost:3101/work> | <http://localhost:3102/work> | <http://localhost:3103/work> |
| Zamisel | naslov levo, odstavek v desnem stolpcu mreže na osnovnici H1 | uvod enak hero /o-nas in /pristop: naslov, pod njim odstavek, vse levo | en velik serifni naslov čez širino, odstavek zaključi vrsto ob desnem robu (desni rob desne kartice), na osnovnici H1 |
| H1 @375 / 768 / 1440 | 36,5 / 54,5 / 80 px | 36,5 / 54,5 / 72 px (natanko lestvica /o-nas) | **44 / 62,4 / 112 px** (`clamp(2.75rem,1.5rem+5vw,4.5rem)`, od `lg` `min(7rem,7.8vw)`, `tracking -0.03em`) |
| Odstavek od `lg` | 18 px, 496 px, 2 vrstici | 20 px (lead /o-nas), 544 px, 2 vrstici, `mt-6` | 18 px, 352 px (`22rem`), 3 vrstice |
| Zgornji odmik (osnova/`sm`/`lg`) | 96 / 112 / 128 | 96 / 112 / 112 | 96 / 112 / 112 |
| Uvod → mreža `lg` | 64 px | 56 px | 64 px |
| H1 / ime kartice @1440 | 4,0 | 3,6 | **5,6** |
| Začetek prve vrste @1440 (sedaj 270) | 272 | **326 (+56)** | 288 (+18) |
| Začetek prve vrste @375 (sedaj 215) | 267 | 267 | 275 |
| Začetek prve vrste @320 | 293 | 293 | 345 (H1 v dveh vrsticah) |
| Mobilno | — | **enako A** (ista lestvica) | H1 44 px, nad izjavami posterja Flexido (37,6 px) |

**Ocena.**
- **A** je najbolj uravnotežen: največ teže brez spremembe položaja kartic, uvod je del mreže. Na mobilnem je H1 malenkost manjši od posterja.
- **B** je najbolj skladen s sistemom (/o-nas, /pristop), a je najvišji: kartice @1440 se spustijo za 56 px, odstavek in naslov pustita desno polovico prazno. Ker je B na mobilnem enak A, se od A razlikuje samo na namizju.
- **C** je najbolj avtorski in edini reši tudi mobilno prevlado naslova (44 px). Odstavek ni na stolpcu mreže (desni rob da, levi ne) in ima 3 kratke vrstice; @320 se H1 prelomi v »Izbrani / projekti.«, kar spusti kartice za dodatnih 52 px glede na A. Pri 1024 px je odstavek višji od H1 (3 vrstice ob 80 px), zato je osnovnica 2 px nižja.
- Možna kombinacija po izbiri: namizje A ali C, mobilni H1 iz C (44 px).

**Preverjanje B in C** (enaka metoda kot A, `measure.cjs` pri 320/375/768/1024/1280/1440/1920 + stres pri 320/375/1440): brez preliva in rezanja, brez fiksnih višin; kartice (širina, višina, levi rob) enake v vseh stanjih; 0 novih konzolnih sporočil; ESLint 0/0 in `tsc` 0 diagnostik za `app/work/page.tsx`; istih 9 datotek pisav. Osnovnica odstavka C = osnovnica H1 (207 = 207 @1440–1920, 195/196 @1280, 188/186 @1024).

Dokazi: `compare-abc-375.png`, `compare-abc-1440.png` (sedanji / A / B / C), `b-*.png`, `c-*.png` (375, 768, 1440, 1920, 320, 320-stress), `b-measure.json`, `c-measure.json`, `candidate-b.diff`, `candidate-c.diff`, `apply.py` (zapiše B ali C na izhodiščno datoteko), `compare-abc.cjs`.

Zagon, če se strežnik ustavi:

```bash
cd /private/tmp/claude-501/-Users-bauma--claude-spares-spare-QTbzxL/1f7a36a7-3b5e-4156-a4fd-855426e751e7/scratchpad/work-intro-b && npx next dev -p 3102
```

```bash
cd /private/tmp/claude-501/-Users-bauma--claude-spares-spare-QTbzxL/1f7a36a7-3b5e-4156-a4fd-855426e751e7/scratchpad/work-intro-c && npx next dev -p 3103
```

### Točen diff kandidata B

```diff
--- a/app/work/page.tsx
+++ b/app/work/page.tsx
@@ -338,16 +338,25 @@
           <section
             data-section="selected-work"
             aria-labelledby="work-heading"
-            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-28 text-white sm:pb-12 sm:pt-32 lg:pb-[3.25rem] lg:pt-36"
+            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-24 text-white sm:pb-12 sm:pt-28 lg:pb-[3.25rem] lg:pt-28"
           >
             <div className="mini-page-rail">
-              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Work</p>
-              <h1
-                id="work-heading"
-                className="home-bridge-heading mt-5 text-balance text-[1.625rem] font-medium [font-optical-sizing:auto] sm:mt-6 sm:text-3xl"
-              >
-                Izbrani projekti
-              </h1>
+              {/* Intro as on /o-nas and /pristop: the serif H1 on their scale, the lead under it on their measure. */}
+              <div data-work-intro>
+                <h1
+                  id="work-heading"
+                  className="font-serif text-[clamp(2.25rem,1.2rem+4.6vw,4.5rem)] font-normal leading-none tracking-[-0.025em] text-balance break-words"
+                >
+                  Izbrani projekti.
+                </h1>
+                <p
+                  data-work-lead
+                  className="mt-4 max-w-[34rem] text-pretty text-[1.0625rem] leading-[1.55] text-white/74 sm:mt-5 lg:mt-6 lg:text-[1.25rem]"
+                >
+                  Spletne strani in digitalne rešitve. Od izhodišča in ključnih odločitev do oblikovanja in delujoče
+                  izvedbe.
+                </p>
+              </div>
 
               <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-14 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
                 {PROJECTS.map((p, i) => {
```

### Točen diff kandidata C

```diff
--- a/app/work/page.tsx
+++ b/app/work/page.tsx
@@ -338,18 +338,30 @@
           <section
             data-section="selected-work"
             aria-labelledby="work-heading"
-            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-28 text-white sm:pb-12 sm:pt-32 lg:pb-[3.25rem] lg:pt-36"
+            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-24 text-white sm:pb-12 sm:pt-28 lg:pb-[3.25rem] lg:pt-28"
           >
             <div className="mini-page-rail">
-              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Work</p>
-              <h1
-                id="work-heading"
-                className="home-bridge-heading mt-5 text-balance text-[1.625rem] font-medium [font-optical-sizing:auto] sm:mt-6 sm:text-3xl"
-              >
-                Izbrani projekti
-              </h1>
+              {/*
+               * Intro: one large serif line across the rail, the lead closing the row at the rail's right edge (the right
+               * card's edge), its last line on the H1's baseline.
+               */}
+              <div data-work-intro className="lg:flex lg:items-end lg:justify-between lg:gap-x-12">
+                <h1
+                  id="work-heading"
+                  className="font-serif text-[clamp(2.75rem,1.5rem+5vw,4.5rem)] lg:text-[min(7rem,7.8vw)] font-normal leading-none tracking-[-0.03em] text-balance break-words"
+                >
+                  Izbrani projekti.
+                </h1>
+                <p
+                  data-work-lead
+                  className="mt-4 max-w-[34rem] text-pretty text-[1.0625rem] leading-[1.55] text-white/74 sm:mt-5 lg:mt-0 lg:max-w-[22rem] lg:shrink-0 lg:pb-[3px] xl:pb-[9px] lg:text-[1.125rem]"
+                >
+                  Spletne strani in digitalne rešitve. Od izhodišča in ključnih odločitev do oblikovanja in delujoče
+                  izvedbe.
+                </p>
+              </div>
 
-              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-14 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
+              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-16 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
                 {PROJECTS.map((p, i) => {
                   const id = `work-${p.slug}`;
                   const { Art } = p;
```

## Varianta C z novim naslovom (C2) in predlog D (27. 10. 2026)

**Potrjeni H1:** »Zasnovano. Oblikovano. Izvedeno.« — en semantični `h1` (`id="work-heading"`, preverjeno: 1 `h1` na strani, dostopno besedilo »Zasnovano. Oblikovano. Izvedeno.«), DM Serif Display 400, bel, pokončen, brez dodatnih poudarkov. Besedilo odstavka nespremenjeno. Širine vrstic pri `tracking -0.03em`: »Zasnovano. Oblikovano.« 9,95 em, »Izvedeno.« 4,00 em, celoten naslov 14,13 em.

C2 nadomešča prejšnjo C v isti kopiji (`work-intro-c`, `:3103`); prejšnji diff C ostaja v dokazih kot zgodovina (`candidate-c.diff`, posnetki `c-*`). A (`:3101`) in B (`:3102`) sta nespremenjeni (diff preverjen proti shranjenim). **D** je moj dodatni predlog v novi kopiji (`work-intro-d`, `:3104`).

### C2 — postavitev (<http://localhost:3103/work>)

- **Od 1280 px** (letev je fiksnih 1216 px): naslov v dveh vrsticah »Zasnovano. Oblikovano.« / »Izvedeno.« pri **76 px** (`xl:text-[4.75rem]`; prva vrstica 756 px), odstavek desno, **`24rem` (384 px)**, 18 px / 1,55, 3 vrstice, desni rob = desni rob desne kartice, zadnja osnovnica odstavka na zadnji osnovnici H1 (252 / 253 px) prek `items-end` + `pb-1` — brez prekrivanja (odstavek se začne 76 px desno od konca prve vrstice). Razmik med naslovom in odstavkom 48 px.
- **1024–1279 px:** ista dva prelomna niza pri `min(5rem, 7.6vw)` (77,8 px @1024), odstavek **pod** naslovom v stolpcu desne kartice (460 px, 2 vrstice, `mt-6`) — z odstavkom 24rem ob strani bi moral biti naslov ~53 px, kar je premalo. Cena: pri 1024 px se prva vrsta kartic začne pri 411 px (najnižje od vseh variant).
- **Pod 1024 px:** besede se lomijo naravno (`span` sta inline): 768 px → »Zasnovano. Oblikovano.« / »Izvedeno.« (62,4 px); 375 in 320 px → vsaka beseda v svoji vrstici (44 px). Odstavek pod naslovom, levo.
- Prelom med vrsticama na namizju nosita dva `span` z `lg:block` (ni `<br>`); ob povečanih razmikih se prva vrstica sama prelomi (3 vrstice), brez preliva.
- Odmiki: zgoraj 96 / 112 / 112 px; uvod → mreža 40 / 48 / 64 px.

### D — moj predlog (<http://localhost:3104/work>)

Naslov kot **ena vrstica čez celo letev** od 1024 px, odstavek pod njim v stolpcu desne kartice (levi rob = levi rob desne kartice, 496 px, 2 vrstici). Velikost naslova izhaja iz širine letve: uvod je `inline-size` container, `min(5.25rem, 100cqi / 14.6)` → 83,3 px @1280–1920 (vrstica 1177 od 1216 px), 65,8 px @1024. Pod 640 px vsaka beseda v svoji vrstici (`max-sm:block`) pri `clamp(3rem, 2rem + 4.4vw, 4.5rem)` → 48 px @320/375; 640–1023 naravno (768 → dve vrstici, 65,8 px).

Zakaj: trije glagoli se berejo kot en stavek in en ritem, odstavek je na mreži kartic (brez ločene osi ob desnem robu kot pri C2), ni poravnave osnovnic in odstavek ni nikoli stisnjen ob naslov. Slabost: na namizju je za ~11 px višji od C2, desna polovica pod naslovom levo ostane prazna, naslov je pri 1024 px manjši (65,8 px) kot pri C2.

### Meritve (Chromium, `measure2.cjs`; slike vseh kartic naložene pred zajemom)

| Širina | C2: H1 / prelomi | C2: odstavek | C2: 1. vrsta | D: H1 / prelomi | D: odstavek | D: 1. vrsta |
|---|---|---|---|---|---|---|
| 320 | 44 px · 3 vrstice (beseda/vrstica) | 272 px, pod | 389 | 48 px · 3 vrstice | 272 px, pod | 405 |
| 375 | 44 px · 3 vrstice | 327 px, pod | 363 | 48,5 px · 3 vrstice | 327 px, pod | 381 |
| 768 | 62,4 px · »Zasnovano. Oblikovano.« / »Izvedeno.« | 544 px, pod | 358 | 65,8 px · enako | 544 px, pod | 364 |
| 1024 | 77,8 px · 2 vrstici | 460 px, pod, desni stolpec | 411 | 65,8 px · 1 vrstica | 460 px, pod, desni stolpec | 322 |
| 1440 | 76 px · 2 vrstici | 384 px, ob desni | 328 | 83,3 px · 1 vrstica | 496 px, pod, desni stolpec | 339 |
| 1920 | 76 px · 2 vrstici | 384 px, ob desni | 328 | 83,3 px · 1 vrstica | 496 px, pod, desni stolpec | 339 |

Za primerjavo, začetek prve vrste: sedanja /work 215 (375) / 270 (1440); A 267 / 272; prejšnja C 275 / 288. H1 / ime kartice @1440: C2 3,8, D 4,2 (prejšnja C 5,6).

**Ocena razmerij.** Daljši naslov zahteva manjšo velikost kot »Izbrani projekti.« (112 → 76 px pri C2), zato je C2 manj »posterski« od prejšnje C, a ostaja jasno nad posterji kartic (Flexido 49,6 px @1440). Na mobilnem sta oba nad izjavami posterja (37,6 px): C2 44 px, D 48,5 px. Prva vrsta kartic se @1440 spusti za 58 (C2) oz. 69 px (D) glede na sedanjo stran; prvi par kartic ostane v celoti viden v 900-px oknu.

### Preverjanje C2 in D

- 320 / 375 / 768 / 1024 / 1440 / 1920 px, vsak brez in s stresnim slogom WCAG 1.4.12: `scrollWidth = clientWidth`, 0 elementov uvoda zunaj okna, odstavek ne prekriva besedila naslova, uvod brez fiksne višine (`height: auto`, brez `min/max-height`, `overflow: visible`). S stresom se naslov prelomi v 3 vrstice (C2 od 320 do 1920, D pod 1024) oz. 2 (D ≥ 1024), mreža se spusti.
- Slike: pred vsakim zajemom je stran prevozena do dna in počakano, da so vse `img` v karticah `complete` z `naturalWidth > 0` (Ulterior, ArtBite 2×2, Hardshelljacket; Flexido, Odstrani, Dema Plus sta tipografski brez slik).
- Kartice (širina, višina, levi rob druge kartice) enake sedanji /work pri vseh širinah.
- Konzola: 5 različnih sporočil, vsa obstoječa dev opozorila `next/image`; **0 novih** glede na sedanjo /work.
- `npx eslint app/work/page.tsx`: 0/0 v obeh kopijah; `tsc --noEmit`: 0 diagnostik za datoteko. Pisave: istih 9 datotek.

### Vsebinsko ponavljanje (samo opozorilo)

Novi H1 ima isti ritem treh kratkih stavkov kot poster kartice **Dema Plus** (»Gradimo. Po načrtu. Do izvedbe.«), ki je na namizju v drugi vrsti, desno — zelo blizu naslovu. Poleg tega zaključni nadnaslov »Od zasnove do izvedbe« ponovi »Zasnovano … Izvedeno.«, odstavek uvoda pa »… do … delujoče izvedbe«. Nič ni spremenjeno.

### Dokazi

- C2: `c2-intro-375.png`, `c2-intro-1440.png`, `c2-full-1440.png`; `c2-320/375/768/1024/1440/1920.png`, `c2-320-stress.png`, `c2-1440-stress.png`; `c2-measure.json`; `candidate-c2.diff`.
- D: enako z `d-*`; `candidate-d.diff`.
- Skripti `measure2.cjs`, `baseline2.cjs`.

Zagon, če se strežnika ustavita:

```bash
cd /private/tmp/claude-501/-Users-bauma--claude-spares-spare-QTbzxL/1f7a36a7-3b5e-4156-a4fd-855426e751e7/scratchpad/work-intro-c && npx next dev -p 3103
```

```bash
cd /private/tmp/claude-501/-Users-bauma--claude-spares-spare-QTbzxL/1f7a36a7-3b5e-4156-a4fd-855426e751e7/scratchpad/work-intro-d && npx next dev -p 3104
```

Integracija katerekoli spremeni samo `app/work/page.tsx`.

### Točen diff kandidata C2

```diff
--- a/app/work/page.tsx
+++ b/app/work/page.tsx
@@ -338,18 +338,32 @@
           <section
             data-section="selected-work"
             aria-labelledby="work-heading"
-            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-28 text-white sm:pb-12 sm:pt-32 lg:pb-[3.25rem] lg:pt-36"
+            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-24 text-white sm:pb-12 sm:pt-28 lg:pb-[3.25rem] lg:pt-28"
           >
             <div className="mini-page-rail">
-              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Work</p>
-              <h1
-                id="work-heading"
-                className="home-bridge-heading mt-5 text-balance text-[1.625rem] font-medium [font-optical-sizing:auto] sm:mt-6 sm:text-3xl"
-              >
-                Izbrani projekti
-              </h1>
+              {/*
+               * Intro: the serif H1 as a large statement, "Zasnovano. Oblikovano." over "Izvedeno." from `lg` (below that
+               * the words wrap naturally), the lead beside it. From `xl` (a fixed 1216px rail) the lead closes the row at
+               * the rail's right edge, its last line on the H1's last baseline; from `lg` to `xl` it sits under the H1 in
+               * the right card column.
+               */}
+              <div data-work-intro className="lg:grid lg:grid-cols-2 lg:gap-x-10 xl:flex xl:items-end xl:justify-between xl:gap-x-12">
+                <h1
+                  id="work-heading"
+                  className="font-serif text-[clamp(2.75rem,1.5rem+5vw,4.5rem)] lg:col-span-2 lg:text-[min(5rem,7.6vw)] xl:min-w-0 xl:text-[4.75rem] font-normal leading-none tracking-[-0.03em] break-words"
+                >
+                  <span className="lg:block">Zasnovano. Oblikovano.</span> <span className="lg:block">Izvedeno.</span>
+                </h1>
+                <p
+                  data-work-lead
+                  className="mt-4 max-w-[34rem] text-pretty text-[1.0625rem] leading-[1.55] text-white/74 sm:mt-5 lg:col-start-2 lg:mt-6 lg:max-w-[31rem] lg:text-[1.125rem] xl:mt-0 xl:w-[24rem] xl:shrink-0 xl:pb-1"
+                >
+                  Spletne strani in digitalne rešitve. Od izhodišča in ključnih odločitev do oblikovanja in delujoče
+                  izvedbe.
+                </p>
+              </div>
 
-              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-14 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
+              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-16 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
                 {PROJECTS.map((p, i) => {
                   const id = `work-${p.slug}`;
                   const { Art } = p;
```

### Točen diff kandidata D

```diff
--- a/app/work/page.tsx
+++ b/app/work/page.tsx
@@ -338,18 +338,32 @@
           <section
             data-section="selected-work"
             aria-labelledby="work-heading"
-            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-28 text-white sm:pb-12 sm:pt-32 lg:pb-[3.25rem] lg:pt-36"
+            className="bg-[var(--mini-surface-work,#080a0f)] pb-9 pt-24 text-white sm:pb-12 sm:pt-28 lg:pb-[3.25rem] lg:pt-28"
           >
             <div className="mini-page-rail">
-              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Work</p>
-              <h1
-                id="work-heading"
-                className="home-bridge-heading mt-5 text-balance text-[1.625rem] font-medium [font-optical-sizing:auto] sm:mt-6 sm:text-3xl"
-              >
-                Izbrani projekti
-              </h1>
+              {/*
+               * Intro: the serif H1 as one line across the rail from `lg`, sized from the rail's width (the intro is an
+               * inline-size container; the line is 14.1em wide), the lead under it in the right card column. Below `sm` one
+               * word per line; between them the words wrap naturally.
+               */}
+              <div data-work-intro className="lg:grid lg:grid-cols-2 lg:gap-x-10 lg:[container-type:inline-size] xl:gap-x-12">
+                <h1
+                  id="work-heading"
+                  className="font-serif text-[clamp(3rem,2rem+4.4vw,4.5rem)] lg:col-span-2 lg:text-[min(5.25rem,calc(100cqi/14.6))] font-normal leading-none tracking-[-0.03em] break-words"
+                >
+                  <span className="max-sm:block">Zasnovano.</span> <span className="max-sm:block">Oblikovano.</span>{" "}
+                  <span className="max-sm:block">Izvedeno.</span>
+                </h1>
+                <p
+                  data-work-lead
+                  className="mt-5 max-w-[34rem] text-pretty text-[1.0625rem] leading-[1.55] text-white/74 lg:col-start-2 lg:mt-6 lg:max-w-[31rem] lg:text-[1.125rem]"
+                >
+                  Spletne strani in digitalne rešitve. Od izhodišča in ključnih odločitev do oblikovanja in delujoče
+                  izvedbe.
+                </p>
+              </div>
 
-              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-14 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
+              <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:mt-16 lg:gap-x-10 lg:gap-y-[60px] xl:gap-x-12">
                 {PROJECTS.map((p, i) => {
                   const id = `work-${p.slug}`;
                   const { Art } = p;
```

## Integracija A in osvežitev kandidata (27. 10. 2026)

**Odločitev (Gregor):** potrjena je varianta A z naslovom »Izbrani projekti.« in odstavkom »Spletne strani in digitalne rešitve. Od izhodišča in ključnih odločitev do oblikovanja in delujoče izvedbe.« B, C/C2 in D ter naslov »Zasnovano. Oblikovano. Izvedeno.« so **odloženi** (predogledi in dokazi ostajajo kot zgodovina; v glavni projekt in kandidat ni prenesena nobena njihova koda).

### Integracija

- Pred prenosom: `app/work/page.tsx` v glavnem projektu je bil bajtno enak izhodišču predloga, začasna kopija A (`work-intro`) je še obstajala in njen diff je bil enak dokumentiranemu [candidate.diff](./bauma-v3-work-intro-proposal-evidence/candidate.diff).
- Prenos: `git apply bauma-v3-work-intro-proposal-evidence/candidate.diff` (samo delovno drevo, brez indexa) — ena hunk v sekciji `selected-work`: brez oznake »WORK«, H1 v DM Serif Display (`font-serif`, `clamp(2.25rem,1.2rem+4.6vw,4.5rem)`, od `lg` `min(5rem,6.4vw)`), od `lg` dva stolpca na mreži kartic, odstavek 17/18 px, odmiki 96/112/128 px, uvod → mreža 40/48/64 px. Datoteka je zdaj bajtno enaka preverjeni kopiji A. Metapodatki (`TITLE`, `DESCRIPTION`, `slPageMetadata`), kartice, zaključek, glava, kontakt in noga niso spremenjeni; druge strani in skupna tipografija niso spremenjene.
- **Spremenjena koda:** samo `app/work/page.tsx`.

### Preverjanje v glavnem projektu (`next dev` na :3000, `measure2.cjs`)

| Širina | H1 | Prelomi | Odstavek | 1. vrsta kartic |
|---|---|---|---|---|
| 320 | 36 px | 1 vrstica | 272 px, pod | 293 |
| 375 | 36,5 px | 1 vrstica | 327 px, pod | 267 |
| 768 | 54,5 px | 1 vrstica | 544 px, pod | 287 |
| 1024 | 65,5 px | 1 vrstica | 460 px, desni stolpec | 258 |
| 1440 | 80 px | 1 vrstica | 496 px, desni stolpec | 272 |
| 1920 | 80 px | 1 vrstica | 496 px, desni stolpec | 272 |

- Mere so pri vseh širinah enake preverjenemu predogledu A (vrh H1 in začetek mreže).
- Povečani razmiki (WCAG 1.4.12) pri 320, 375, 768, 1024, 1440, 1920: H1 se prelomi v »Izbrani« / »projekti.«, brez preliva (`scrollWidth = clientWidth`), 0 elementov uvoda zunaj okna, odstavek ne prekriva naslova, uvod brez fiksne višine.
- En `h1`, besedilo »Izbrani projekti.«; kartice (širina, višina, levi rob druge) enake kot pred integracijo; slike kartic naložene pred zajemom (Ulterior, ArtBite, Hardshelljacket; ostale tri so tipografske).
- Konzola: 0 novih sporočil (obstoječa dev opozorila `next/image`); pisave: istih 9 datotek.
- `npx eslint app/work/page.tsx` 0/0; `tsc --noEmit` exit 0; `git diff --check -- app/work/page.tsx` čist.
- Posnetki: [integration/final-375.png](./bauma-v3-work-intro-proposal-evidence/integration/final-375.png), [integration/final-1440.png](./bauma-v3-work-intro-proposal-evidence/integration/final-1440.png), `final-intro-*`, `final-full-1440.png`, stresni posnetki, `final-measure.json`.

### Osvežitev lokalnega izdajnega kandidata

Prejšnja mapa kandidata (`…/086dd670…/scratchpad/candidate`) ne obstaja več, zato je kandidat **ponovno sestavljen po dokumentiranem postopku** ([build-candidate.sh](./bauma-v3-release-candidate-review-evidence/build-candidate.sh) + obstoječi potrjeni manifesti):

- Lokacija: `/private/tmp/claude-501/-Users-bauma--claude-spares-spare-QTbzxL/1f7a36a7-3b5e-4156-a4fd-855426e751e7/scratchpad/candidate` (+ CoW `candidate-stg` za staging gradnjo; `candidate-dev` za labe). Začasno območje seje.
- HEAD nespremenjen (`6b2fa07`). Pred sestavo: vseh 1459 datotek potrjenega kandidata primerjanih z glavnim drevesom po [candidate-sha256.txt](./bauma-v3-release-candidate-review-evidence/candidate-sha256.txt) — razlikujeta se **samo** `app/work/page.tsx` (ta integracija) in `docs/audits/bauma-v3-audit-register.md` (dopolnitve). Seznam datotek sestave je enak potrjenemu (1459).
- Dodana dokumentacija (manifest dopolnitve [manifest-docs-refresh.txt](./bauma-v3-work-intro-proposal-evidence/candidate-refresh/manifest-docs-refresh.txt)): ta zapis in mapa `bauma-v3-work-intro-proposal-evidence/` (brez sprememb kode). Drugi predogledi, nesledeni labi in začasne datoteke **niso** vključeni.

| Korak | Rezultat |
|---|---|
| `npm ci` | exit 0; `package.json` in `package-lock.json` pred/po enaka (SHA-256) |
| `tsc --noEmit` | exit 0 |
| Gradnja `SITE_ENV=production VERCEL_ENV=production` | exit 0, 47 statičnih strani |
| Gradnja `SITE_ENV=staging VERCEL_ENV=production` (ločena kopija) | exit 0 |
| `http-check.mjs` produkcija (`next start`) | povzetek **identičen** potrjenemu (45 vrstic): `/work` 200, `index, follow`, canonical + `og:url`, title »Izbrani spletni projekti — Bauma«; zapore `/lab`, `/mini`, `/about-preview` 404; sitemap 11 URL; robots `Allow: /` |
| `http-check.mjs` staging | povzetek **identičen** potrjenemu: vse `noindex, nofollow` + `X-Robots-Tag`, robots `Disallow: /`, `/lab/**` 307 |
| `browser-check.mjs` (19 strani @1440, 6 @375) | povzetek enak potrjenemu (razlika le v naslovu testnega strežnika); posnetki vseh strani **bajtno enaki** prejšnjemu kandidatu razen `/work` @1440 in @375 (nov uvod, pregledano) |
| `runtime-fonts.mjs` | enako: `/work` 9 pisav, italic Fraunces 0, normalni Fraunces za wordmark ArtBite |
| `lab-check.mjs` (`next dev`, 16 sledenih lab poti) | enako potrjenemu: vse 200, 0 4xx, 0 pokvarjenih slik, 0 napak |

Dokazi: [candidate-refresh/](./bauma-v3-work-intro-proposal-evidence/candidate-refresh/) (logi, povzetki, JSON, `shots-cand/`).

**Ni ponovljeno:** celoten ESLint kandidatovega obsega (samo ciljni za `app/work/page.tsx`), pikselna primerjava proti celotnemu drevesu (posnetki so primerjani s prejšnjim kandidatom). Samo Chromium; gostovanje (Vercel/CDN), Safari in bralnik zaslona niso preverjeni. work.bauma.si in bauma.si nista spremenjena; noindex na stagingu je potrjen v lokalni gradnji, ne na gostovanju.
