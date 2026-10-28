# BAUMA V3 — produkcijska osnova zmogljivosti

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07` (delovno drevo necommitano). **Samo meritev**; koda, konfiguracija, sredstva, odvisnosti in metapodatki niso spremenjeni. Dokazi: [mapa](./bauma-v3-performance-baseline-evidence/) ([surovi zagoni](./bauma-v3-performance-baseline-evidence/raw/), [okolje](./bauma-v3-performance-baseline-evidence/environment.txt), [tabela](./bauma-v3-performance-baseline-evidence/summary-table.md)).

## 1. Metoda in okolje

- **Izolirana kopija** delovnega drevesa (`app/ lib/ components/ public/` + konfiguracijske datoteke; ob HEAD 6b2fa07 je bilo 139 vnosov v `git status`), lasten `.next`, `SITE_ENV=production`, `VERCEL_ENV=production`, `next build` (koda 0) in `next start` na prostih vratih. Dev strežnik ni bil uporabljen za meritve in 3000 ni bil ustavljen.
- **Orodje:** Lighthouse ni nameščen; uporabljen Chromium 151 + CDP (playwright-core 1.62.1, ki je že v projektu), Apple M3, 8 jeder, macOS 14.5, Node 25.6.1. Ni nameščanja v glavni projekt. Metoda **ni Lighthouse** in ne daje Lighthouse ocene ali TBT.
- **Profila:** *mobilni* 375 × 812, DPR 2, CPU ×4, omrežje 1,6 Mbps down / 750 kbps up / 150 ms RTT (CDP emulacija); *namizni* 1440 × 900, DPR 1, brez omejevanja. Vsak zagon: nov kontekst (prazen brskalniški predpomnilnik), zaporedno, 3 toplih zagoni na kombinacijo; hladni optimizer (prvi zagon po zagonu strežnika) zabeležen posebej. Skripti: `perf.mjs`, `timeline.mjs`, `use.mjs`, `summarize.mjs`, `run-all.sh`.
- **Strani:** `/`, `/work` in **`/work/flexido`**. Izbira študije po pregledu sredstev (Flexido: 6,9 MB v `public/work/flexido`, 22 datotek, `<video>`), nato preverjena z eno primerjavo šestih študij (namizno, 1 zagon): Flexido **4891 KB**, Dema Plus 1111, ArtBite 976, Hardshelljacket 839, Ulterior 838, Odstrani Tattoo 834 ([raw/studies](./bauma-v3-performance-baseline-evidence/raw/studies/)). Zato Ulterior (tehnične točke) ni izmerjen interaktivno.
- **Meje:** lokalni strežnik (TTFB ≈ 0 ni napoved gostovanja), brez CDN/HTTP/2 prioritizacije, brez terenskih CWV/INP. Izris brez GPU (WebGL: *ANGLE SwiftShader*, programsko) — rezultati kocke se ne posplošujejo na naprave. Analitika ni blokirana; lokalni 404 za `/_vercel/insights/script.js` je zabeležen.

## 2. Rezultati nalaganja (mediana, v oklepaju min–max treh toplih zagonov)

| Stran | Profil | FCP ms | LCP ms (element) | CLS | dolge naloge (n / skupaj ms) | blokada po FCP ms* | prenos KB | zahtev | JS KB (enc.) | skript ms (CDP) |
|---|---|---|---|---|---|---|---|---|---|---|
| / | mobile | 1372 (1364–1384) | 3736 (3728–3800) (div.bauma-hero-photo.pointer-events-none) | 0 (0) | 1 / 56 (55–57) | 6 (5–7) | 796 (796) | 40 (40) | 180 (180) | 96 (96–97) |
| / | desktop | 104 (96–112) | 104 (96–112) (span.bauma-hero-h1-desktop.bauma-hero-h1-sentence) | 0 (0) | 0 / 0 (0) | 0 (0) | 984 (984) | 57 (57) | 201 (201) | 27 (26–27) |
| /work | mobile | 1288 (1280–1288) | 2228 (2220–2236) (img.wul-photo) | 0 (0) | 1 / 58 (55–59) | 8 (5–9) | 849 (849) | 55 (55) | 184 (184) | 56 (52–58) |
| /work | desktop | 44 (44) | 60 (60–64) (img.wul-photo) | 0 (0) | 0 / 0 (0) | 0 (0) | 917 (917) | 73 (73) | 203 (203) | 15 (15) |
| /work/flexido | mobile | 1216 (1204–1216) | 1216 (1204–1216) (p.mt-6.max-w-[44ch]) | 0 (0) | 1 / 59 (58–60) | 9 (8–10) | 787 (787) | 44 (44) | 180 (180) | 57 (56–58) |
| /work/flexido | desktop | 72 (56–88) | 108 (108–132) (video.absolute.inset-0) | 0 (0) | 0 / 0 (0) | 0 (0) | 4891 (4891) | 64 (64) | 201 (201) | 22 (19–33) |

Hladni optimizer (prvi zagon po zagonu strežnika, 1 zagon):

| Stran | Profil | FCP | LCP | prenos KB |
|---|---|---|---|---|
| / | mobile | 1500 | 3888 | 796 |
| / | desktop | 132 | 132 | 984 |
| /work | mobile | 1288 | 2220 | 849 |
| /work | desktop | 68 | 124 | 917 |
| /work/flexido | mobile | 1208 | 1208 | 787 |
| /work/flexido | desktop | 88 | 88 | 4891 |

\* »blokada po FCP« = vsota (trajanje − 50 ms) dolgih nalog po FCP v opazovanem oknu — **nadomestek, ni Lighthouse TBT**. Brez premikov postavitve (CLS 0) in brez 4xx na straneh razen lokalnega Vercel Analytics. TTFB (lokalno) < 30 ms. Mobilni FCP 1,2–1,4 s je pri tej emulaciji posledica prenosa fontov/CSS/JS (glej 3.1).

## 3. Ugotovitve (največ tri)

### 3.1 Home, mobilno: LCP ≈ 3,7 s in slika hero tekmuje s pisavami in JS

- **Izmerjeno:** LCP 3736 ms (3728–3800), element `div.bauma-hero-photo` (CSS ozadje); FCP 1372 ms. Slika `road-evening-01.jpg&w=2048` je le 81,5 KB, zahtevana ob ~226 ms s prioriteto **Low** (`<link rel=preload as=image>` brez `fetchpriority`), končana ob ~3,8 s. Hkrati ob ~224 ms začne **10 pisav (427 KB)** s prioriteto High, CSS in 12 skriptov (184 KB): skupaj 796 KB, od tega pisave 54 % ([timeline](./bauma-v3-performance-baseline-evidence/raw/timeline-home-mobile.json)). Brez dolgih nalog, ki bi pojasnile zamik (1 naloga 56 ms).
- **Verjetni vzrok:** pas je omejen (200 KB/s), slika z nizko prioriteto čaka za pisavami in skripti. **Dodatni dokaz:** učinek `fetchpriority="high"` in zmanjšanja preloadanih pisav še ni izmerjen; HTTP/2 prioritizacija na CDN-ju lahko vedenje spremeni. Namizno: hero slika 212 KB (`w=3840` pri 1440 px/DPR 1) — ali je prevelika, potrebuje dokaz o prikazani velikosti (rez je namerno zasnovan po breakpointu). LCP namizno 104 ms je besedilo.
- **Razvrstitev:** smiselno, če je popravek majhen.

### 3.2 Flexido, namizno: 4,05 MB video ob vsakem nalaganju

- **Izmerjeno:** `hero-production.mp4` (1280 × 720, 41 s, ~795 kb/s, 4 145 537 B) je v celoti prenesen ob nalaganju (`autoplay loop`, `preload="metadata"`), 83 % od 4891 KB strani; druge študije ≤ 1111 KB. LCP element je `video` (poster `flexido-hero-still.webp` 54 KB). Na mobilnem je video `display:none` in se **ne prenese** (787 KB). Zunaj vidnega polja brskalnik video ustavi (`paused: true` po drsenju).
- **Verjetni vzrok:** zanka brez omejitve prenosa. **Dodatni dokaz:** koliko bi prihranil ponovni zapis (bitrate/trajanje) in ali se kakovost sprejme — vizualna odločitev (Grega); na hitri povezavi uporabnik tega verjetno ne opazi.
- **Razvrstitev:** lahko počaka (ne spreminjati samo zaradi ocene; potrebna potrditev vizuala).

### 3.3 Brez ozkih grl pri JS, premikih in delu zunaj vidnega polja

- **Izmerjeno:** JS 180–203 KB (enc.), skript 15–97 ms (CDP, mobilno ×4 do 97 ms), CLS 0 povsod, dolge naloge ≤ 1 (≤ 60 ms). Med drsenjem do konca (obe širini): 12–25 novih zahtev (večinoma `?_rsc` prefetch povezav in lazy kos JS/CSS), 45–141 KB, CLS 0, brez dolgih nalog. Kocka na Home: **60 rAF/s in ~170 ms/s glavne niti, ko je vidna** (programski izris, glej meje), **0 rAF/s zunaj vidnega polja**; pri `prefers-reduced-motion: reduce` 0 rAF. Meni (mobilno, CPU ×4): odpiranje 28–40 ms; Kontakt → vidni kontakt na Home ≈ 530–550 ms (animiran premik); brez klika na mailto.
- **Razvrstitev:** brez ukrepa.

## 4. Predlogi

| Razvrstitev | Predlog |
|---|---|
| Potrebno pred objavo | Nič potrjenega iz teh meritev. Gostovanje, CDN in terenske meritve ostajajo nepreverjene. |
| Smiselno, če majhno | 3.1: `fetchPriority="high"` na obeh preload povezavah hero slike. |
| Lahko počaka | 3.2 (video, odločitev o ponovnem zapisu); pregled števila preloadanih pisav; prevelikost namizne hero slike (po meritvi prikazane velikosti). |

### Predlagani naslednji paket (en sam)

**Prioriteta hero slike na Home.** Datoteka: `app/components/blocks/mini/MiniHeroPhotoBackground.tsx` (dve `<link rel="preload" as="image">`: dodati `fetchPriority="high"`). Pričakovani učinek: slika (81 KB mobilno) se prenese pred skripti in drugimi pisavami; LCP mobilno se zmanjša, FCP in namizje ostanejo. Brez vizualne spremembe. Preverjanje: ista `perf.mjs`/`timeline.mjs` (3 × mobilno, 3 × namizno, pred/po v izolirani kopiji), preverba, da CLS ostane 0 in da se slika ne zahteva dvakrat; ESLint/tsc. Če izboljšave ni, preloadanih pisav ne spreminjati brez ločenega dokaza. Tveganje: nizko.

## 5. Omejitve

Laboratorijske meritve na enem računalniku, ena emulirana omrežna/CPU nastavitev, tri ponovitve (ni statistične moči); ni Lighthouse; ni terenskih CWV/INP; hosting, CDN in HTTP/2 prioritizacija niso preverjeni; programski izris (SwiftShader) ne predstavlja GPU naprav; TTFB je lokalen; Ulterior tehnične točke niso izmerjene; Safari ni merjen.
