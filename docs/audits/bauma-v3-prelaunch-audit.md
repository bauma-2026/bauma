# BAUMA V3 — Pred-objavni audit 01: vizualna konsistentnost

READ-ONLY audit. V kodi ni bilo spremenjeno nič; ustvarjena je samo ta datoteka. Nič ni commitano, pushano ali deployano.

## 1. Osnova (ponovljivost)

| | |
|---|---|
| Datum | 2026-10-25 |
| Veja | `staging/bauma-v3` |
| HEAD | `6b2fa07926df85731122b430f25ae786a97f06a8` (BAUMA V3 staging: legal pages in the V3 frame, tighter "Kaj delamo" rows) |
| Pregledano | lokalni `next dev` (localhost:3000) = HEAD + necommitane spremembe spodaj |
| Brskalnik | Playwright Chromium 151.0.7922.34 (headless). Safari/Firefox NISO bili pregledani. |
| Širine | 320 (samo prelivanje/prelomi), 375, 768, 1440 px; višina 900 |
| Stanja | pisave počakane (`document.fonts.ready`), stran skrolana skozi za lazy slike; meritve privzeto z `reducedMotion: reduce`; hover/focus/reduced-motion kartic posebej z obema nastavitvama |

Necommitane spremembe, ki vplivajo na pregledane strani (`git diff --stat`, 6 datotek, +67/−26):

- `app/components/blocks/mini/MiniSelectedWorkHome.tsx` – nov prop `lift` (privzeto `false`), ovoj `.work-lift .work-lift-home`, `CARD_ARROW*` za puščico kartice.
- `app/components/blocks/mini/SelectedWorkMotion.css` – pravila `.work-lift` (dvig 3px; 220 ms, na `/` 150 ms prek `.work-lift-home`; samo `hover: hover` + `pointer: fine`, `:focus-visible`, brez gibanja pri `prefers-reduced-motion`).
- `app/page.tsx` – `<MiniSelectedWorkHome topRule={false} lift />`.
- `app/work/page.tsx` – kartice ovite v `<div className="work-lift">`.
- `app/components/blocks/mini/MiniServicesBoxes.css` – spremenljivka `--msx-hd` (razmik naslov → opis v škatlah storitev).
- `app/components/blocks/mini/MiniSystemHome.tsx` – `max-sm:min-h-0` za figure sistemske kocke.

Untracked datoteke (labi, `.claude/`, `.recovery/` …) niso predmet audita.

**Strani:** `/`, `/work`, `/pristop`, `/o-nas`, `/work/{flexido,ulterior,odstrani-tattoo,dema-plus,artbite,hardshelljacket}`, `/pogoji-uporabe`, `/zasebnost`, `/piskotki` (vseh 13 × 4 širine). `/en` in angleške pravne strani NISO pregledane (samo evidenca: header-jezikovno preklapljanje je prisotno, vsebina ni bila brana).

## 2. Povzetek obstoječega vizualnega sistema

- **Kontejner:** `.mini-page-rail`, max 1216 px; stranski odmiki 24 (<640) / 32 (768) / 112 px levo na 1440. Logo v headerju, vsi naslovi in noga sledijo isti levi črti na vseh 13 straneh (izmerjeno). Pravne strani: stolpec 608 px na isti levi črti.
- **Header:** fiksen, 52 px na vseh straneh in širinah; Kontakt je modro polnilo (`#4169e1`) povsod razen na hero `/`, kjer je obroba (namerno, hero-faza).
- **Noga/zaključek:** logo+info@ vrstica 64 px (mobilno) / 80 px (≥768) in pravni pas 89 / 57 px — enaka na vseh straneh. Gumb CTA 144×48 (144×52 na 375).
- **Barve:** Base `#080a0f`, Raised `#0d0f15`, Work `#161a21`; poudarek Royal Blue `#7c97f0` (`--mini-accent-text`), CTA `#4169e1`.
- **Tipografske vloge:** Inter (opsz pin) za UI in naslove; DM Serif Display za hero in H1 na `/pristop`, `/o-nas`; IBM Plex Mono 12 px / 500 / 0.08em modro za eyebrow (v `[data-home-typography]`); `homeTypography*.css` definira H2/H3 lestvico samo za strani s tem atributom.
- **Interakcije:** obroba fokusa 2 px, offset 3 px, `--mini-accent-text` (header, kartice, CaseStudyNav, noga). Kartice na `/` in `/work`: dvig 3 px (150/220 ms), puščica 3 px desno; ArtBite ima dodatni barvni hover.

## 3. Potrjene namerne izjeme

| Izjema | Potrditev |
|---|---|
| Hero ima svoj tipografski sistem (DM Serif, drugačen H1) | naloga + `globals.css` |
| Rekonstrukcije naročnikov (pisave Arial/ui-sans, barve, gumbi, višine, okvirji 6/8 px radij) | naloga; `PROOF_FRAME` |
| Pravne strani: ožji stolpec 608 px, preprosta noga brez CTA | `MiniLegalShell.tsx` |
| ArtBite dodatni barvni hover | `ArtBiteSurface.css`, naloga |
| Različne višine študij primerov | naloga |
| Hover dvig 150 ms (`/`) vs 220 ms (`/work`) | komentar v `SelectedWorkMotion.css` (“homepage … shorter 150ms”) |
| Flexido vrstica “tok med stroji.” razpotegnjena (justify) | `MiniSelectedWorkSurfaces.tsx:90,103` (namerna zasnova artworka) |
| Hero `Kontakt` kot obroba, na ostalih modro polnilo | hero-faza headerja |
| `/pristop` in `/o-nas` imata drugačno besedilo zaključka (“Imate projekt? Pišite nam.”) | `ctaCopy` v obeh straneh |
| `/work` + študije primerov: `spacing="roomy"` zaključek (509 vs 437 px na `/`) | `MiniClosingBookend` prop, komentar v Flexido |
| Prelivajoči se elementi pri 320–768 (carousel Dema/Ulterior/ArtBite, slike v clip karticah) | `scrollWidth == clientWidth` na vseh straneh; elementi so v `overflow-hidden`/snap kontejnerjih |

## 4. Preverjeno brez odstopanj

- Horizontalnega prelivanja strani ni na nobeni od 13 strani pri 320/375/768/1440.
- Header 52 px, leva črta (24/32/112), noga in pravni pas enaki povsod; zaključni CTA gumb enak (14 px / 500).
- Case-study uvodi (eyebrow 11/16.5, H1 56/53.2 −0.045em, uvod 18/30.6 .70, meta 15/24 .72, razmaki 24 px) so med šestimi stranmi identični (razen VIS-003).
- Reduced-motion: dvig kartic izklopljen (`transform: none`, 0 s) na `/` in `/work`; puščica se barvno odzove tudi brez gibanja.
- Footer/legal povezave: 12 px / 400 / .60 povsod.

## 5. Ugotovitve

Oznake: **N** napaka · **P** potrebna presoja · **I** namerna razlika. Pomembnost: **A** nujno pred objavo · **B** manjši popravek · **C** kasneje.

### VIS-001 — Dva sistema eyebrowov (P, B)
- **Kje:** eyebrowi na šestih `/work/*` (“Case / …”, “Izbrani projekti” v CaseStudyNav, odseki v Ulterior “Visual Proof”) in na legal (“Pravno”) vs. `/`, `/work`, `/pristop`, `/o-nas`.
- **Opažanje (1440, enako ≤768):** študije primerov in legal: Inter 11 px / 500 / letter-spacing 2.42 px (0.22em), bela .60. Preostale strani: IBM Plex Mono 12 px / 500 / 0.96 px, `#7c97f0` (Contact: bela). Zaključek (Kontakt) na isti strani je že mono — ista stran ima tako dve družini eyebrowa.
- **Vzorec:** `[data-home-typography] p.uppercase` v `app/homeTypography.css` (homepage foundation).
- **Izvor:** `const EYEBROW` v vseh `app/work/*/page.tsx`; `EYEBROW` v `app/components/work/CaseStudyNav.tsx`; legal `app/pogoji-uporabe|zasebnost|piskotki/page.tsx` (nista pod `data-home-typography`).
- **Namera:** ni potrjena (case strani so bile zgrajene pred promocijo mono eyebrowa — memo “Typography foundation”). Lahko bi bilo namerno, da so case strani Inter “tihi” z belo.
- **Najmanjši predlog:** odločitev; če poenotiti, ovij samo eyebrow (ne rekonstrukcij) v isti scope, ne spreminjaj velikosti drugje.

### VIS-002 — H1 ima tri vloge (P, B)
- 375 / 768 / 1440 px: `/` hero (DM Serif); `/pristop`, `/o-nas` DM Serif 36→54.5→72 / 400; `/work` Inter 26→30→30 / 500 (−0.02em); `/work/*` in legal Inter 30→48→56 / 600 (−0.035em).
- `/work` je očitno najtišji H1 (30 px) glede na strani okoli sebe (56 px na case, 72 px na Pristop). Tiho indeksno vlogo potrjuje zapisek “quiet editorial” (work-index-b lab), vendar H1 ni zapisano kot odobren.
- **Izvor:** `app/work/page.tsx` (H1), `PristopPage.css`, `ONas.css`, `home-primary-heading` na case straneh.
- **Predlog:** potrditi, da je /work H1 namerno 30/500; sicer samo ta ena vrednost.

### VIS-003 — Flexido: uvod 16 px višje na ≥1024 px (N, B)
- Flexido `section` `lg:pt-32` (128 px); ostalih pet `lg:pt-36` (144 px). Izmerjeno 1440: eyebrow y=128 vs 144, H1 y=168.5 vs 184.5; ≤768 enako.
- **Izvor:** `app/work/flexido/page.tsx:112` (ostali: dema-plus:105, hardshelljacket:99, artbite:106, odstrani-tattoo:77, ulterior:108).
- **Predlog:** `lg:pt-32` → `lg:pt-36`, če ni namerno (razlog v kodi/zapiskih ni najden).

### VIS-004 — Zaključni H2 (P, B)
- `/pristop` in `/o-nas`: 24 px (375) → 44/48.4 px (≥768), brez Kontakt eyebrowa; `/work`, `/work/*`: 24 → 36/40.3 px z eyebrowom “Kontakt”; `/`: 28 → 36 px (contact 28/36 v `homeTypographyV11.css`).
- Besedilo je namerno drugačno (VIS-izjeme); velikost naslova in manjkajoč eyebrow pa verjetno posledica tega, da `/pristop` in `/o-nas` ne uporabljata istega scopea kot `/work`. Višina zaključka: 421 (Pristop/O nas), 437 (`/`), 509 (`/work`, case; “roomy”).
- **Izvor:** `app/pristop/page.tsx:172`, `app/o-nas/page.tsx:100` vs `app/work/page.tsx:423` (`spacing="roomy"`); `MiniClosingBookend`.
- **Predlog:** potrditi, da je 44 px H2 brez eyebrowa namerno za “Imate projekt?” (zaključek “brez eyebrowa” vs “z eyebrowom”).

### VIS-005 — Hover/focus kartic: samo `/` in `/work` (P, A?/B)
- Kartice `MiniSelectedWorkHome` na `/pristop` in `/o-nas` so iste kot na `/`, vendar `lift` ni prižgan: ni dviga (`.work-lift` ne obstaja), puščica v mirovanju bela .65 (na `/` in `/work` .48), pri fokusu se puščica ne posvetli (ostane .65), pri hoverju pa ja (.92).
- Komentar v `SelectedWorkMotion.css` pravi “`/` and `/work` cards only” — namera je omejitev, a isti kartici na dveh straneh se tako obnašata različno. Ker je dvig še necommitan, je to odločitev pred objavo.
- **Izvor:** `MiniSelectedWorkHome.tsx` (prop `lift`), `app/pristop/page.tsx`, `app/o-nas/page.tsx`.
- **Predlog:** `lift` tudi na teh dveh straneh ali jasno potrditi izjemo.

### VIS-006 — Kartice na `/work` imajo drug napis kot isti projekti drugje (P, C)
- `/work`: ime 20 px / 500 (−0.018em), opis 15 px / 22 / .70; `/`, `/pristop`, `/o-nas`: ime 24 px (22 mobilno) / 600, opis 13 / 20 / .60. Na `/work` je izvor `Caption()` (`app/work/page.tsx:309`).
- Verjetno namerno (“tihi uredniški podpis” na indeksu); namera ni v tem auditu potrjena.

### VIS-007 — Puščica “Vsi projekti ↗” vs “→” (P, B)
- Notranja povezava “Vsi projekti” ima `↗` v `CaseStudyNav`, `→` na `/`, `/work`, `/pristop`, `/o-nas`. `↗` se na case straneh uporablja tudi za zunanje povezave (flexido.eu ↗, hardshelljacket.com ↗), kar zamegli pomen.
- **Izvor:** `app/components/work/CaseStudyNav.tsx` (`&nbsp;↗`). **Predlog:** `→` za notranjo povezavo, ali potrditi namen.

### VIS-008 — Fokus zunanje povezave v uvodu case strani (N, B)
- Povezave tipa “flexido.eu ↗” (6 strani) imajo `FOCUS` = 1 px outline, offset 4 px, bel .5; sistem povsod drugje 2 px / offset 3 px / accent. Izmerjeno: 1 px solid, offset 4 px (v primerjavi z 2 px / 3 px).
- **Izvor:** `const FOCUS` v `app/work/{flexido,ulterior,odstrani-tattoo,dema-plus,artbite,hardshelljacket}/page.tsx`.
- **Predlog:** zamenjati z isto konstanto kot `CaseStudyNav`/`LINK_FOCUS`.

### VIS-009 — Barva povezav v besedilu (P, C)
- `gregor@bauma.si` na `/o-nas`: bela .60, podčrtana; legal `info@`: .90; case “source link”: .85. Podpis je lahko namerno tiši, a tri vrednosti za isto vrsto povezave.
- **Izvor:** `app/o-nas/page.tsx`, `MiniLegalShell`/legal strani, case `page.tsx`.

### VIS-010 — Nizek kontrast pomožnih besedil (P, C; za naslednjo fazo)
- Case podnapisi (`CAPTION`: 14 px, bela .40 na `#161a21`) ≈ 3.8:1; `/pristop` oznake “VI/BAUMA/USKLAJEVANJE” 11 px mono, bela .45 na Base ≈ 4.5:1 (mejno). Vzorci so dosledni; zapisano za dostopnostni audit, ne popravljati zdaj.
- **Izvor:** `const CAPTION` v case straneh, `PristopPage.css`.

### VIS-011 — Sistemska pisava v rekonstrukcijah (P, C)
- Flexido/Dema/ArtBite proof naslovi imajo `ui-sans-serif, system-ui` (Mac: SF), ne Interja ali Arial kot Odstrani/Hardshell. Če je tako tudi na odjemalčevih straneh, je pravilno; **ni preverjeno** proti živim straneh.

## 6. Skupni vzroki in predlagan vrstni red ozkih popravkov

1. **VIS-003** (1 vrstica, jasna napaka).
2. **VIS-008** (ena konstanta `FOCUS` v 6 datotekah).
3. **VIS-005** — odločitev o `lift` na `/pristop` in `/o-nas` (pred commitom necommitanega).
4. **VIS-007** (puščica) – po odločitvi.
5. **Skupni vzrok VIS-001 + VIS-004 + VIS-002:** `data-home-typography` scope se uporablja na `/`, `/pristop`, `/o-nas`, `/work`, zaključkih, ne pa na case/legal. Eno odločitveno vprašanje (“ali case/legal prevzamejo mono eyebrow in zaključek?”) pokrije tri ugotovitve.
6. Kasneje: VIS-006, VIS-009, VIS-010, VIS-011.

## 7. Omejitve preverjanja

- Brskalnik: samo Chromium 151 (headless); nobenega Safari/Firefox.
- Lokalni dev strežnik (Next dev), ne staging: `https://work.bauma.si` je odgovoril 200, a ni bil vizualno primerjan; razlike med lokalnim stanjem in deployanim niso preverjene.
- Širine: 320 samo za prelivanje; vmesne širine (npr. 640, 898 `/work` Wide zamenjava, 1024, 1280) niso sistematično pregledane.
- Hover/focus: izmerjeno samo na karticah in tab-sprehodu po `/work/flexido`, `/o-nas`, `/pogoji-uporabe`; barve obrob pri fokusu so lahko med CSS prehodom (meritev takoj po Tab) — zanesljive so širina/offset, ne barva. Hover na CaseStudyNav, gumbih CTA in nogi ni bil meritvovan.
- `/en` in angleške pravne strani: nepregledane.
- Hero `/` je bil pregledan le zunanje (H1, spacing), ne podrobno; v H1 meritvi `/` je prvi `h1` 16 px (DM Serif) — zunaj obsega, ne preverjeno.
- Posnetki in surove meritve so v seji (scratchpad), niso v repozitoriju.
