# BAUMA V3 — Home: prioriteta hero fotografije

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07` (necommitano drevo). **Odločitev: kandidat ni prenesen; koda v glavnem projektu je nespremenjena.** Dokazi: [mapa](./bauma-v3-home-hero-priority-evidence/).

## Pregled

[`MiniHeroPhotoBackground.tsx`](../../app/components/blocks/mini/MiniHeroPhotoBackground.tsx) ima dva `<link rel="preload" as="image">`: telefon `(max-width: 767px)` → `w=2048`, širše `(min-width: 768px)` → `w=3840`, enaka optimizer URL-ja kot CSS `--road` (`MiniHeroPhotoBackground.css`; ujemanje potrjeno, 1280 px breakpoint `--road` ne spreminja). Komponento uporablja samo `MiniHero` na Home. Kandidat je dodal `fetchPriority="high"` na obe povezavi ([diff](./bauma-v3-home-hero-priority-evidence/candidate.diff)); nič drugega.

## Metoda

Izolirani kopiji istega stanja (osnova = `m-perf`, kandidat = kopija z diffom, lasten `.next`, `SITE_ENV=production`, `VERCEL_ENV=production`, gradnji koda 0, prosta vrata), obe strežnika hkrati v prostem teku, zagoni **zaporedni in prepleteni** (osnova, kandidat, osnova, …), nov kontekst brez predpomnilnika, hladni zagon vsake različice zavržen. Profila kot v [baseline](./bauma-v3-performance-baseline.md): mobile 375 × 812, DPR 2, CPU ×4, 1,6 Mbps / 750 kbps / 150 ms RTT (CDP emulacija); desktop 1440 × 900, DPR 1, brez omejevanja. Mobile: 5 parov (3 + 2 dodatna, ker razlika ni bila prepričljiva); desktop: 3 pari. Skripti in surovi zagoni v mapi dokazov.

## Rezultati (mediana, min–max)

| Profil | Različica | n | FCP ms | LCP ms | LCP element | CLS | hero začetek ms | hero konec ms | hero začetna prioriteta | spremembe prioritete | prenos KB | zahtev | zadnja pisava konec ms |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| mobile | osnova | 5 | 1376 (1376–1392) | 3756 (3744–3780) | div.bauma-hero-photo.pointer-events-none | 0 (0) | 178 (171–180) | 3730 (3716–3767) | Low | ["High"] | 796 (796) | 40 (40) | 4109 (4108–4123) |
| mobile | kandidat | 5 | 1384 (1376–1396) | 3764 (3752–3796) | div.bauma-hero-photo.pointer-events-none | 0 (0) | 173 (170–186) | 3745 (3723–3767) | High | [] | 796 (796) | 40 (40) | 4110 (4103–4116) |
| desktop | osnova | 3 | 116 (116) | 116 (116) | span.bauma-hero-h1-desktop.bauma-hero-h1-sentence | 0 (0) | 8 (8) | 33 (32–33) | Low | ["High"] | 984 (984) | 57 (57) | 22 (22–23) |
| desktop | kandidat | 3 | 116 (96–124) | 116 (96–124) | span.bauma-hero-h1-desktop.bauma-hero-h1-sentence | 0 (0) | 8 (8) | 23 (22–24) | High | [] | 984 (984) | 57 (57) | 22 (21–22) |

## Preverjeno

- **Surovi HTML kandidata** vsebuje `<link rel="preload" as="image" … fetchPriority="high" media="…">` pri obeh povezavah (React izpiše `fetchPriority`; HTML atributi niso občutljivi na velikost črk). CDP: začetna prioriteta hero slike **High** (osnova **Low**).
- **Osnova je prioriteto že dvignila**: CDP zabeleži spremembo Low → High po odkritju slike v CSS (`["High"]`). Kandidat ima High od začetka, brez spremembe. Začetek zahteve se ni premaknil (mobile 178 → 173 ms).
- **Samo ustrezna različica:** mobile vedno `w=2048` (1 zahteva, 81,5 KB), desktop `w=3840` (1 zahteva, 212 KB); brez podvojenih zahtev; prenos in število zahtev enaka (796 KB / 40; 984 KB / 57).
- **Preload ujemanje in opozorila:** brez konzolnih opozoril o neuporabljenem preloadu za hero sliko. Desktop konzola (obe različici enako): opozorila o `preload` CSS kosih in lokalni 404 za `/_vercel/insights/script.js`.
- **Besedilo:** FCP mobile 1376 → 1384 ms, desktop 116 → 116 ms (v okviru razpona); zadnja pisava končana 4109 → 4110 ms (mobile), desktop LCP je še vedno naslov (`span.bauma-hero-h1-desktop`). Prikaz besedila ni poznejši.
- **Videz:** posnetki Home (reduced motion, po umiritvi) pri 375 × 812 (750 × 1624) in 1440 × 900 so **piksel za piksel enaki** (0 različnih bajtov; [pixel-compare](./bauma-v3-home-hero-priority-evidence/pixel-compare.txt)).
- Kandidat v izolirani kopiji: ESLint 0 napak, `tsc --noEmit` 0. CLS 0 v vseh zagonih.

## Zaključek in odločitev

- **LCP mobile se ni izboljšal:** 3756 ms (3744–3780) → 3764 ms (3752–3796); razlika je znotraj šuma, brez izboljšanja. Hero slika je ob ~175 ms že v teku in jo zaključi ~3,7 s pri obeh različicah.
- **Hipoteza iz baseline (nizka prioriteta zadržuje sliko) ni potrjena** v tej metodi: slika ni čakala v vrsti zaradi prioritete; začne takoj in se pri emulirani povezavi **deli pasovno širino** z 10 pisavami (427 KB), 12 skripti (184 KB) in CSS (skupaj 796 KB pri ~200 KB/s ≈ 4 s). Emulacija pasu v CDP ne uveljavlja prioritet kot pravi HTTP/2 strežnik/CDN, zato dejanskega učinka na Vercelu **ne trdim ne v eno ne v drugo smer**.
- **Odločitev:** korist ni potrjena → sprememba **ni prenesena** v glavni projekt (`git status` za datoteko: brez sprememb). Dodanega preloada, pisav, videa Flexido in drugih strani nisem spreminjal.

## Naslednja hipoteza (ni izvedena)

LCP mobilno je omejen s skupno količino bajtov pred zaključkom slike (pisave 427 KB imajo isto prioriteto High). Ločen poskus bi moral zmanjšati bajte, ki tekmujejo (npr. manj ali pozneje naloženih pisav; to zahteva svojo presojo vizuala in FOUT) in ga meriti z isto metodo. Pred tem priporočam meritev pri pravem omrežnem omejevanju z dejansko prioritizacijo (npr. test na stagingu na Vercelu), ker lokalna emulacija prioritet ne razlikuje.

## Omejitve

Lokalne laboratorijske meritve (ni terenskih Core Web Vitals, ni zagotovilo za Vercel/CDN), en računalnik (Apple M3), ena emulacija, 3–5 parov; TTFB lokalen; Chromium 151; hosting, CDN in HTTP/2 prioritizacija niso preverjeni. `work.bauma.si` ostaja noindex, `bauma.si` nespremenjen.
