# BAUMA V3 — nadzorovana varnostna nadgradnja Next.js/sharp

Datum: 25. 10. 2026. Veja `staging/bauma-v3`, HEAD `6b2fa07926df85731122b430f25ae786a97f06a8`. Lokalno delovno drevo vključuje predhodne necommitane spremembe. Ta zapis opisuje lokalno spremembo in izoliran preizkus, ne objavljenega staginga. Izhodiščna manifesta sta shranjena zunaj repozitorija v `/tmp/bauma-security-20261025/before/`.

## Izbira in primarni viri

| Paket | Prej | Potem | Pot in razlog |
|---|---:|---:|---|
| next | 16.1.6 | 16.4.1 | Neposredna odvisnost; stabilni 16.x, ki pokrije v auditu navedene najvišje popravljene razpone. |
| eslint-config-next | 16.1.6 | 16.4.1 | Razvojna neposredna odvisnost, usklajena z Next. |
| sharp | 0.34.5 | 0.35.5 | `projekt → next → sharp`, tranzitivno, brez override ali neposredne odvisnosti. Potrjeno tudi v nameščenem drevesu. |
| react / react-dom | 19.2.3 / 19.2.3 | 19.2.3 / 19.2.3 | Ostajata usklajena in znotraj peer razponov. |

[Next SVG image optimization advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) in [Next use-cache advisory](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr) za prizadete 16.x navajata popravek 16.4.1; prvi zahteva tudi sharp ≥0.35.5. [Sharp advisory](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w) navaja popravek 0.35.5. Prejšnji 16.1.6 in 0.34.5 sta v navedenih prizadetih razponih. Drugi relevantni advisoryji in njihovi posebni pogoji so ohranjeni v [tehničnem auditu](./bauma-v3-technical-audit.md#tech-002--nextjs-in-sharp-sta-v-prizadetih-varnostnih-razponih) in njegovi matriki. Izkoristljivost prejšnjega stanja na strani ni bila dokazana.

Podatki uradnega npm registra za `next@16.4.1`, `eslint-config-next@16.4.1` in `sharp@0.35.5`: Next zahteva Node ≥20.9, sprejme React 18.2 ali 19 in določa opcijski sharp `^0.35.5`; eslint-config-next zahteva ESLint ≥9 in TypeScript ≥3.3. Uporabljeno Node 25.6.1 in npm 11.9.0. Preverjeno z `npm view ... version engines peerDependencies optionalDependencies --json`; [Next v registru](https://www.npmjs.com/package/next/v/16.4.1), [sharp v registru](https://www.npmjs.com/package/sharp/v/0.35.5). To ne potrjuje različice Node ali platforme na gostovanju.

Spremenjena sta `package.json` in obstoječi `package-lock.json`; lock ni bil izbrisan. Npm je spremenil 43 obstoječih različic, dodal dve platformni sharp postavki in odstranil podrejeni Next PostCSS. Med spremljajočimi spremembami sta PostCSS 8.5.14 → 8.5.23 in nanoid 3.3.12 → 3.3.20. Ni sprememb Reacta ali aplikacijske kode. Prvi ovoj ukaza za lock je po uspešnem npm izhodu naletel na zsh rezervirano spremenljivko `status`; npm dnevnik sam potrjuje izhod 0 in nastali lock je nato uspešno prestal `npm ci`.

## Izolirano preverjanje

Kopiran je bil aktualni nabor tracked/untracked izvorov in assetov, vključno z labi; izpuščeni so bili obstoječi node_modules, buildi in začasni dokazni/backup artefakti. Sveža namestitev ni kopija prejšnjega node_modules. Produkcijska gradnja in lokalni strežnik sta uporabljala `SITE_ENV=production VERCEL_ENV=production`; obstoječi dev strežnik in njegov `.next` nista bila uporabljena.

| Ukaz | Izhod | Rezultat |
|---|---:|---|
| `npm ci --no-audit --no-fund --cache /tmp/bauma-security-20261025/npm-cache` | 0 | Čista namestitev 424 paketov. |
| `npm ls next eslint-config-next react react-dom sharp --all --json` | 0 | Različice zgoraj, brez prijavljenega peer konflikta. |
| `node node_modules/typescript/bin/tsc --noEmit` | 0 | Celotni TypeScript uspešen. |
| `npm run lint -- . --format json --output-file /tmp/bauma-security-20261025/evidence/eslint-results.json` | 1 | 26 napak in 69 opozoril. Primerjava poti, vrstic, stolpcev, pravil in resnosti z auditom 04: **0 novih, 0 izginulih, 95 obstoječih**. Lint ni uspešen; TECH-001 ostaja odprt. |
| `npm run build` | 0 | Produkcijski build uspešen, tudi TypeScript in 208 generiranih strani. Labs niso odstranjeni. |
| `npm audit --json --cache /tmp/bauma-security-20261025/audit-cache` | 1 | 8 paketnih skupin: 1 low, 2 moderate, 5 high, 0 critical. |
| `npm audit --omit=dev --json --cache /tmp/bauma-security-20261025/audit-cache-prod` | 1 | 3 paketne skupine: 2 moderate, 1 high, 0 critical. |

Točna časovna in ukazna evidenca, očiščeni dnevniki in strojni rezultati so v [dokazni mapi](./bauma-v3-security-evidence/). Število paketnih skupin ni število dejansko izkoristljivih napak.

## Preostali advisoryji

Novi npm audit ne navaja Next ali sharp; ne navaja več niti PostCSS in nanoid, ki sta bila v prejšnjem poročilu. To dokazuje odpravo trenutnih različicnih ujemanj iz vrnjenega npm rezultata, ne pa odsotnosti vseh prihodnjih ranljivosti.

Produkcijski lock še navaja [source-map-js](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) (high: zlonameren indexed source map), [fflate](https://github.com/advisories/GHSA-px8p-9vwx-vf98) (moderate: nepravilen ZIP64) in [baseline-browser-mapping](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) (moderate: neveljaven vhod). Prejšnji pregled ni ugotovil javnega uporabniškega vhoda teh vrst; dejanska runtime dosegljivost ni neodvisno dokazana. Celotni graf dodatno navaja razvojne @babel/core, brace-expansion, browserslist, js-yaml in zod; pogoji in poti so v [tehničnem auditu](./bauma-v3-technical-audit.md#tech-003--dodatna-tranzitivna-opozorila-potrebujejo-razvrstitev-in-ciljni-update) ter svežih dnevnikih. Niso bile izvedene nepovezane množične nadgradnje. TECH-003 ostaja odprt za ciljno obravnavo in preverjanje dosegljivosti.

## Produkcijski runtime in vzorčne regresije

Lokalni izolirani Next 16.4.1, Chromium 151.0.7922.34, 375 × 812 z mobilnim/touch načinom in 1440 × 900. Pregledanih je 17 zahtevanih strani pri obeh velikostih in neobstoječa pot; vse pričakovane strani vrnejo 200, neobstoječa pot 404. Po pomiku in nalaganju pisav ni zabeleženih `pageerror`; zajeti odgovori pisav so 200 in ni zaznanih pokvarjenih vidno izrisanih slik. Na Flexido so trije dejanski optimizer odgovori 200 `image/webp`, slike imajo nenicelno naravno širino. Lokalni `/_vercel/insights/script.js` vrača 404, saj lokalni Next strežnik ne zagotavlja Vercelovega skripta; to ni dokaz napake aplikacije ali stanje deploya.

Mobilni meni se odpre in zapre z Escape, po navigaciji se drsenje odklene. Kontakt → Enter postavi fokus na naslov kontakta, naslednji Tab na »Pošljite opis«; pošte nismo aktivirali. Flexido → naslednji Ulterior → Nazaj → Vsi projekti deluje, tehnični točki Ulterior se odzoveta na klik in Tab/Enter. Domače in `/work` kartice imajo na desktopu dvig 3 px in prehoda 150/220 ms; pri reduced motion dviga ni. Na vzorcu prve kartice na obeh poteh in širinah se kartica ob povečanih uporabniških razmikih poveča. To ni celovit ponovni pregled dostopnosti; Safari, prava povečava, čisti zajemi vseh kartic ter dejanski bralnik zaslona ostajajo odprti po registru. Hero je zajet v runtime prehodu; popolna vizualna primerjava z odobreno napravo ni bila narejena. Selektor prvega H1 lahko izmeri 16 px za ovoj, zato ta vrednost sama ni meritev vidnega napisa.

## Naslednji korak in omejitve

Lokalno nadgradnjo je treba po izboru uporabnika prenesti v ustrezen commit in pred objavo preveriti točno objavljeno revizijo na dejanskem gostovanju, vključno z Node/platformo in Safari. Celotni lint (TECH-001), preostala ujemanja (TECH-003), javni obseg labov (TECH-004) in okoljska potrditev ostajajo odprti. Trenutni dev strežnik še uporablja stare nameščene odvisnosti; ko bo varno, je potrebna namestitev iz novega locka in ponovni zagon tega strežnika. Ti koraki niso bili izvedeni v njegovem delujočem drevesu. Ni commita, pusha ali deploya.
