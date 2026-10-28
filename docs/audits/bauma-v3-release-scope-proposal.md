# BAUMA V3 — predlog obsega izdaje

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07926df85731122b430f25ae786a97f06a8`. **Predlog; ni dovoljenje za objavo.** Kandidat ni sestavljen, nič ni v stagingu, ni bilo gradenj, vej, commita ali brisanja. Dokazi: [mapa](./bauma-v3-release-scope-evidence/) ([stanje Git](./bauma-v3-release-scope-evidence/git-state.txt), [razvrstitev vseh datotek](./bauma-v3-release-scope-evidence/classification.tsv), [povzetek](./bauma-v3-release-scope-evidence/classification-summary.txt), manifesti `manifest-A…G.txt`). Vsebin `.env*` in `.vercel/` nisem odpiral (obstajata, oba sta v `.gitignore`).

## 1. Stanje

- Veja `staging/bauma-v3`, HEAD `6b2fa07`. **Staged: 0.** Nestaged sledene spremembe: **41** (vse `M`; brez izbrisanih in preimenovanih). Nesledene: **5942** datotek v 98 vnosih (`git status` kaže 139 vrstic), skupaj ~1,0 GB.
- Orodje za vsa spodnja štetja: statična analiza uvozov in nizov (skripti `reach-release.cjs`, `tracked-needs-untracked.cjs`, `classify.cjs`; samo berejo). **Meja:** dinamični uvozi z izračunano potjo in nizi iz zunanjih podatkov niso zajeti; nobena gradnja ni bila izvedena.

## 2. Predlog obsega

| Skupina | Datotek / velikost | Predlog | Manifest |
|---|---|---|---|
| **A1** aplikacijska koda V3 | 35 sledenih `M` | vključi | [manifest-A](./bauma-v3-release-scope-evidence/manifest-A.txt) |
| **A2** konfiguracija in odvisnosti | 6 sledenih `M`: `next.config.ts`, `lib/siteEnv.ts`, `app/robots.ts`, `app/sitemap.ts`, `package.json`, `package-lock.json` | vključi (skupaj; `package.json` + lock: `next`/`eslint-config-next` 16.1.6 → 16.4.1) | A |
| **A3** nova koda, ki jo uvaža sledena javna koda | 3 nesledene: `lib/indexing.ts`, `app/not-found.tsx`, `app/components/blocks/mini/DemaPlusProjectProof.tsx` | **vključi — obvezno** | A |
| **B** javna sredstva, uporabljena v javni kodi | 4 nesledene (0,3 MB): `public/og/bauma-og-main-v3.png`, `public/work/dema-plus/proof/related-{debeli-rtic,golovec,hisa-soncek}.webp` | **vključi — obvezno** | [manifest-B](./bauma-v3-release-scope-evidence/manifest-B.txt) |
| **C** dokumentacija in dokazi | 45 poročil, 1 doc V2, 40 dokaznih map (955 datotek, 80,9 MB) | poročila in `bauma-v2-visual-layer.md` vključi; dokazne mape po presoji (§3) | [manifest-C](./bauma-v3-release-scope-evidence/manifest-C.txt) |
| **D** lab koda, potrebna za uvoze/gradnjo | **0** | ni potrebna (glej spodaj) | – |
| **E** samostojni lab eksperimenti | 2061 datotek, 271,6 MB: 57 nesledenih map `app/lab` (239 datotek), `public/lab` (1814 datotek, 269,9 MB), `MiniSelectedWork.tsx` in `components/home/approach/v2/copy.ts` (uvažajo jih samo labi), sredstva samo za lab | **ločena odločitev; privzeto izključi** | [manifest-E](./bauma-v3-release-scope-evidence/manifest-E.txt) |
| **F** začasno, orodja, zajemi, obnovitve | 2790 datotek, 614,1 MB: `.claude/` 354,5 MB, `lab-screenshots/` 206,2 MB, `tmp/` 49,9 MB, `.recovery/` 2,9 MB, `scripts/` (103) 0,5 MB, `test-results/`, `.playwright-browsers/` | izključi | [manifest-F](./bauma-v3-release-scope-evidence/manifest-F.txt) |
| **G** nejasno | 99 datotek, 69,1 MB | odločitev pred sestavo | [manifest-G](./bauma-v3-release-scope-evidence/manifest-G.txt) |

### Utemeljitev in odvisnosti

- **A3 in B so edino, kar sledena koda potrebuje od nesledenega.** 15 sledenih datotek uvaža nesledene: `lib/indexing.ts` (14: `app/layout.tsx`, `app/page.tsx`, `/en`, `/pristop`, `/o-nas`, `/work`, vseh 6 študij, `robots.ts`, `sitemap.ts`) in `DemaPlusProjectProof.tsx` (`app/work/dema-plus/page.tsx`). **Tveganje izpustitve: gradnja takoj pade** (neobstoječ modul). `app/not-found.tsx` ni uvožen, a je samodejna 404 konvencija; brez nje se vrne črno besedilo na temnem ozadju (404-review). `bauma-og-main-v3.png` in tri Dema Plus sličice: brez njih manjkajo slike (SL OG in prikaz referenc).
- **Javna koda → lab: 0 uvozov.** Iz 31 vstopnih točk zunaj `app/lab` (168 dosegljivih datotek) nobena ne uvaža `app/lab/**` ali `components/lab/**`, in nobena ne navaja sredstva iz `public/lab`. Sledeni labi (13 map v `app/lab`, 35 datotek, vključno z `app/lab/layout.tsx`) ne uvažajo nobene nesledene datoteke. Zato **D = prazno**. Hkrati zapora `/lab` (TECH-004) velja na HTTP ravni; sledeni labi so v HEAD in se še vedno gradijo. Zapora **ni razlog za odstranitev** datotek iz gradnje: odločitev E je o velikosti in hrambi, ne o tem, da bi jih javno kodo kaj uvažala. Sledeni lab `og-social-preview` navaja nesledeni `public/og/bauma-og-v2.png` in `-en-v2.png` (E); brez njiju je slika na zaprti lab strani prazna.
- **Fraunces:** edine deklaracije italic so v nesledenih labih (E). Če E ostane izven izdaje, italic preload na javnih poteh nastane le, če se labi vključijo (spremembe `preload: false` so zapisane v teh nesledenih datotekah). **Vpliv izključitve E na manifest in CSS kose ni preverjen** — to preveri kandidat.
- **G** podrobno: `app/en/mini/page.tsx` (zaprta pot, `next.config.ts` jo prepiše na 404; brez nje `/en/mini` je običajen 404; ni uvožena), `MobileHeroObjectMotion.tsx` in `lib/heroParityProbe.ts` (**nihče ju ne uvaža**, ne labi ne javna koda), `AGENTS.md` (ustvari `next dev`; vsebuje navodilo o Next 16), `BAUMA — Content Review/` (3 uredniški dokumenti za Pristop), `public/raw` (38 datotek, 49,4 MB: surove slike in `hero-production.mp4` — kopija videa, ki je že sledena v `public/work/flexido/proof/`), `public/work/preview` (4 PNG, 7,9 MB, generična imena), `public/home/hero-concrete|hero-system`, `public/images/atmosphere/concrete-hero-01.webp`, `public/work-preview`, `public/production-transfer`, preostali `public/work/flexido/{preview,hero}` — vse **brez navedbe v kodi** (`/work/flexido/preview/*hero*|*solutions*` so že sledena sredstva). Tveganje izpustitve: nobeno za gradnjo; izgubi se samo delovno gradivo.

## 3. Dokazi in velikost

- `docs/audits`: **989 datotek, 82,7 MB** (PNG 64,3 MB v 251 datotekah, JSON 12,6 MB v 239); sledeni sta samo 2 datoteki v `docs/` (`bauma-v2-geometry.md`, `bauma-v2-system.md`). Največje: `bauma-v3-lab-font-preload-fix-evidence` 22,5 MB, `…dema-credibility-evidence` 10,1 MB (en PNG 3,3 MB), `…visual-verification-codex-evidence` 5,2 MB, `…home-hero-priority-evidence` 4,1 MB, `…flexido-credibility-evidence` 3,9 MB. Največje posamezne: `dema-1440x900-full.png` 3,3 MB, `…m375_work_artbite.png` 1,7 MB (×2), `capture-metadata.json` 1,4 MB.
- **Trajni dokazi (predlog hrambe):** poročila (`*.md`), skripti (`*.mjs`/`*.cjs`/`*.py`/`*.sh`), diffi, majhni `*.txt`/`*.json`/`*.log`, `README` map. **Veliki ponovljivi izhodi:** posnetki PNG (zlasti `*-before/*-after` pari, ki so pri pixel-compare bajtno enaki; **43 datotek > 20 KB je popolnih duplikatov, 18,2 MB**), surovi zajemi `capture-metadata.json`, WebM. Odločitev o izpustu ali stiskanju posnetkov je Gregova; zdaj ničesar ne spreminjam.
- **Ni** `node_modules`, `.next`, brskalniških binarnih datotek (`.playwright-browsers` vsebuje eno povezavo, 4 KB), `.env*`, `.DS_Store` med nesledenimi. `test-results/` vsebuje en `.last-run.json`. `.recovery/` je 76 datotek (3 MB, vključno s `full-working-tree.patch` in `staged.patch`) — obnovitvena kopija iz 5. 8. 2026. `components/spatial/` in `src/` sta ignorirani mapi brez izvornih datotek (samo `.DS_Store`, prazni lab kosi).
- **Lint:** dokazni `.cjs` skripti povzročajo del lint napak (TECH-001: 63 od 92 v `docs/`). Hramba dokazov in lint obseg sta ločeni odločitvi; skriptov ne izločam iz izdaje zaradi lintanja.

### Predlog `.gitignore` (ni izveden)

```
# lokalna orodja in zajemi (ne spreminjajo gradnje)
/lab-screenshots/
/tmp/
/test-results/
/.playwright-browsers/
/.claude/lab-screens/
```

Vpliv: skrije ~1686 nesledenih datotek (`lab-screenshots` 638, `tmp` 390, `.claude/lab-screens` ~1580 manj `launch.json`, `test-results` 1, `.playwright-browsers` 1; ~611 MB), ne briše ničesar z diska; `git status` postane pregleden. `/.recovery/` in `/scripts/` namenoma nista na seznamu (odločitev: obnovitev, odločitev glede skriptov). Če je `launch.json` želen v repozitoriju, `.claude/` ne ignoriraj v celoti. Sprememba `.gitignore` je sama po sebi tudi izdajna sprememba.

## 4. Odprti pogoji pred objavo

**Potrjene napake / odprte potrjene ugotovitve** (iz registra in poročil):
- **TECH-001:** celoten lint ne uspe; zadnja osnova **92 napak in 107 opozoril** (obseg: celotno drevo, 719 datotek; števila **niso nova meritev**). Kategorije: javno izvršljiva koda 0, skupna V2 hooka 2 (po pregledu JSX ju javna stran ne izriše), lab/zaprte poti 20, dokazne/obnovitvene 70.
- **EN-001 / napačen korenski `lang="sl"` na `/en`:** potrjeno, **odloženo za EN prenovo, ni odpravljeno**; ni zapisane uredniške odločitve, da je izjema sprejemljiva.
- **ArtBite wordmark** na `/work` pri uporabniških razmikih ≤ 898 px (izstop ~70–85 px): **odprta odločitev** (register, A11Y-005 in zapis kartic; brez novejšega dokaza).

**Manjkajoča ročna preverjanja:** funkcionalni Safari (Gregov vizualni pregled je opravljen) in VoiceOver; A11Y-008 (numerična presoja kontrasta nad fotografijami).

**Uredniške in obsegovne odločitve:** obseg E in G (zgoraj); hramba dokazov in morebitni `.gitignore`; `/approach`, `/contact`, `/novice` (odločitev iz route-exposure pregleda: ostajajo odprte poti ali ne); ali `AGENTS.md` vstopi v repozitorij; ali bo `app/en/mini/page.tsx` del izdaje.

**Možno šele na gostovanju / nepreverjeno:** TECH-003/004/005 na gostovanju, pravilni `SITE_ENV`/`VERCEL_ENV` na obeh projektih, dejanski HTTP/`X-Robots-Tag`/robots/sitemap objavljenega artefakta, dosegljivost absolutnega OG URL-ja, doseg `hardshelljacket.com` (**nepreverjeno**, ne potrjeno kot pokvarjeno), produkcijska zmogljivost na CDN in terenski CWV/INP, povezava vej z domenami (ni potrjena v tej seji; zapis v projektnem spominu »main → bauma.si; staging/bauma-v3 → work.bauma.si« je neverificiran podatek).

**Že zaprto v lokalnem obsegu (ni pogoj sam po sebi):** Proof & Credibility (pregledani obseg), SL metapodatki + glavna OG slika (lokalno), 404 z glavo (lokalno), omejitev lab preloadov Fraunces (lokalno). Projektne OG slike in nadaljnje optimizacije (normalni Fraunces 66 KiB, video Flexido, prioriteta hero) **niso samodejno pogoj prve objave**; to ni zapisana uredniška izjema, temveč predlog.

## 5. Prihodnji izdajni postopek (predlog, ne izvaja se)

1. **Potrditev obsega:** Grega odloči E, G, hrambo dokazov, `.gitignore`, `AGENTS.md`, `/en/mini`; manifest se zamrzne.
2. **Izolirani kandidat:** nova izolirana kopija/veja iz HEAD + točno potrjeni manifest; brez dotika delovnega drevesa.
3. **Preverjanje točno tega kandidata:** lint (ciljno + zapis osnove), `tsc`, produkcijska gradnja z `SITE_ENV=production`/`VERCEL_ENV=production` in ločeno `staging`/`production`; robots/sitemap/X-Robots-Tag, zapore razvojnih poti, font manifest brez italic Fraunces, 404, pixel-compare in zmogljivost vs. zadnja lokalna osnova; preveri, da gradnja ne odvisi od izključenih datotek.
4. **Selektivni commit** (poznejši, ločeno odobren; izbirno dodajanje po poteh, ne `git add -A`).
5. **Staging objava** (ločeno odobrena): `work.bauma.si` mora ostati noindex; pregled dejansko objavljenega artefakta in izvedljivih točk iz §4 (gostovanje).
6. **Produkcijska objava** (ločeno odobrena): `bauma.si` se ne spreminja do izrecne odločitve; pred gradnjo preveriti `SITE_ENV`/`VERCEL_ENV` na ciljnem projektu.

## 6. Odprte odločitve pred sestavo kandidata

1. E: ali labi (57 nesledenih map + `public/lab` 270 MB) vstopijo v izdajo? (predlog: ne)
2. G: usoda `app/en/mini/page.tsx`, `MobileHeroObjectMotion.tsx`, `lib/heroParityProbe.ts`, `AGENTS.md`, `BAUMA — Content Review/`, `public/raw` & drugih nereferenciranih sredstev.
3. Hramba dokazov (82,7 MB; 18,2 MB duplikatov) in `.gitignore`.
4. `/approach`, `/contact`, `/novice`; ArtBite wordmark; ali se `/en` `lang` sprejme za prvo izdajo (zapisana uredniška odločitev).
5. Kdaj se opravi funkcionalni Safari/VoiceOver pregled.
