# BAUMA V3 — Ulterior: dostopnost tehničnih podrobnosti (D1, D2, D3)

Datum: **27. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Spremembe so lokalne in necommitane. Gostovanje in okolja niso spremenjeni; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dev strežnik na 3000 ni bil ustavljen (ob zajemu stanja »pred« sem izvirni datoteki za nekaj sekund vrnil in nato obnovil popravljeni). Vidno besedilo, slike, nakupni prikaz, druge rekonstrukcije, metapodatki, OG slike, politika indeksiranja, konfiguracija, odvisnosti in lockfile so nespremenjeni. Ni nakupa, pošte, produkcijske gradnje ali celotnega lint pregleda. Dokazi: [bauma-v3-ulterior-points-a11y-fix-evidence](./bauma-v3-ulterior-points-a11y-fix-evidence/). Izhodišče: [bauma-v3-safari-voiceover-review.md](./bauma-v3-safari-voiceover-review.md).

## Spremenjene datoteke

- `app/components/blocks/mini/UlteriorTechnicalProof.tsx` (D1, D2)
- `app/components/blocks/mini/UlteriorVisualProof.tsx` (D3)

Diff proti začetku koraka: [changes.diff](./bauma-v3-ulterior-points-a11y-fix-evidence/changes.diff).

## D1 — `aria-pressed` je odražal fokus in lebdenje, ne izbire

**Vzrok:** `isActive = index === visibleIndex`, kjer je `visibleIndex = hoveredIndex ?? selectedIndex`, in `onFocus`/`onMouseEnter` nastavita `hoveredIndex`; ta vrednost se je uporabljala za vizualni poudarek in za `aria-pressed`. Pritisnjeno stanje je zato sledilo začasnemu predogledu.

**Stanje pred spremembo (preverjeno):** nič ni izbrano ob nalaganju; klik/Enter/Space izbere točko (en par gumbov); ponovna aktivacija izbrane točke je ne prekliče (**ni možnosti preklica**, enako kot izvirnik: »nothing is selected at first«, izbira se samo menja); izbira vedno hkrati velja za oba gumba iste točke.

**Popravek:** `aria-pressed={index === selectedIndex}` na obeh nizih gumbov (točke na sliki in vrstice seznama). Vizualni poudarek (`isActive`, hover/fokus predogled in razlaga v panelu) je nespremenjen. Vedenje ob kliku, Enter in Space je nespremenjeno; preklic izbire nisem uvajal.

## D2 — povezava z razlago

**Ugotovitev (ni kršitev samo zaradi manjkajočega `aria-live`):** razlaga je vidni panel pod seznamom, ki kaže predogledano ali izbrano točko. Gumbi so imeli samo ime (`aria-label`); razlaga ni bila programsko povezana s točko, zato je uporabnik bralnika po fokusu ali aktivaciji ni dobil, če ni ročno brskal do panela.

**Izbrana rešitev: stabilen ID + `aria-describedby` na vsakem gumbu, ki kaže na skriti odstavek z lastnim besedilom te točke.** V komponenti je pet skritih `<p hidden id="…-detail-0N">` (ID-ji prek `useId`, enolični), vsak gumb točke N (na sliki in v seznamu) ima `aria-describedby` na isti odstavek N.

Zakaj to:
- razlaga se prebere skupaj z gumbom, **fokus se ne prestavlja**, nič se ne napoveduje ob premiku miške (ni žive regije, ki bi se odzivala na lebdenje ali fokus);
- opis vedno pripada **pravi točki**, tudi ko panel začasno kaže predogled druge točke (opis je vezan na točko, ne na panel);
- skupni cilj ne podvaja besedila, gumba iste točke ne povzročata dodatnih napovedi (ni žive regije, ki bi se sprožila dvakrat);
- gumbi ostanejo gumbi (brez `tabs` vzorca ali predelave).

Zakaj ne drugo: **živa regija** bi bila vezana na izbiro, a pri aktivaciji bi opis (že prebran ob fokusu) ponovila; vezava na vidni panel bi napovedovala predogled ob hoverju/fokusu. **`aria-controls`** nima zanesljive podpore v bralnikih in panel ni ena stabilna celica, ki bi jo kontrola krmili (kaže tudi predogled). **`aria-describedby` na panel** bi kazal na vsebino druge točke med predogledom.

## D3 — jezik Visual Proof

`UlteriorVisualProof.tsx`: `lang="en"` na uvodnem bloku (oznaka »Visual Proof«, naslov »The shell is quiet, but not generic.«, odstavek) in na vsakem `<figure>` (angleški `alt` slik in podnapisi »Profile view«, »Rear hood detail«, »Back view«). Slovenski deli niso označeni kot angleški: ime regije »Hardshell: pogledi izdelka« in podnapis strani »Razdelek „Visual Proof“ na strani Hardshell …« ostanejo `sl`. Tehnični prikaz je že imel `lang="en"`.

## Rezultati pred in po (Chromium; [skript](./bauma-v3-ulterior-points-a11y-fix-evidence/behaviour-points.cjs), [pred](./bauma-v3-ulterior-points-a11y-fix-evidence/behaviour-points.before.json), [po](./bauma-v3-ulterior-points-a11y-fix-evidence/behaviour-points.after.json))

Vedenjski preizkus pri 375 × 812 in 1440 × 900 (pred: 32 preverjanj, 8 padlih, vsa v D1; po: **104 preverjanj, 0 padlih**):

| Preverjanje | Pred | Po |
|---|---|---|
| Začetno stanje: 10 gumbov, nobena izbrana | da | da |
| Hover brez klika | `aria-pressed="true"` na točki pod miško | nič pritisnjeno; panel prikaže predogled |
| Fokus (Tab) brez aktivacije | `true` na obeh gumbih točke | nič pritisnjeno; panel prikaže predogled |
| Enter na fokusirani točki 01 | 01 pritisnjena | 01 pritisnjena (oba gumba) |
| Tab na 02 po izbiri 01 | pritisnjen 02, izbira 01 »izgubljena« | **01 ostane pritisnjena**; panel prikaže predogled 02; po izgubi fokusa spet 01 |
| Space na 02 | 02 izbrana | 02 izbrana, 01 ne |
| Ponovna aktivacija izbrane | ostane izbrana | ostane izbrana (brez preklica, nespremenjeno) |
| Klik na vrstico 04; hover čez 01 | izbira se zamenja z lebdenjem | 04 ostane izbrana na obeh gumbih |
| Dostopno ime / stanje (CDP) | »01 — Detachable hood«, `pressed=false`, brez opisa | enako ime; **opis = lastno besedilo točke**; `pressed=true` samo na obeh gumbih izbrane točke |
| Opis ob izbrani 04 in predogledu druge točke | — | vsak gumb ohrani opis svoje točke |
| `aria-describedby` cilji | — | 10 sklicev na 5 obstoječih enoličnih ID-jev |
| Tab / Shift+Tab | 10 postaj | 10 postaj (5 točk na sliki, nato 5 v seznamu); Shift+Tab obratno |
| Jezik | Visual Proof `sl` (angleško besedilo) | uvod, podnapisi in `alt` `en`; ime regije in slovenski podnapis `sl` |
| Fokus viden | da | da (`:focus-visible`, kolobar obstoječega sloga) |
| Konzola, `pageerror` | 0 | 0 |

**Videz in odzivnost nespremenjena** ([pixel-compare.cjs](./bauma-v3-ulterior-points-a11y-fix-evidence/pixel-compare.cjs), [rezultat](./bauma-v3-ulterior-points-a11y-fix-evidence/pixel-compare.json)): zajem komponente v štirih stanjih (začetno, hover 03, fokus seznama 02, izbrana 04) pri obeh širinah je pred/po piksel za pikslom **enak v 7 od 8 primerov**; osmi (hover 03 pri 375 px) se razlikuje samo v 31 × 31 px okoli označbe točke 03 med prehodom (v ponovnih zagonih 2 bajta ali 5031 bajtov; vrednost niha med zagoni, torej prehod animacije, ne regresija).

`npx tsc --noEmit` izhod 0, ESLint na obeh datotekah izhod 0, `git diff --check` izhod 0 ([logi](./bauma-v3-ulterior-points-a11y-fix-evidence/)). `git status` se razlikuje samo za `UlteriorVisualProof.tsx` (nov vnos spremembe).

## Omejitve

- Vse je **Chromium 151 (Playwright, CDP dostopnostno drevo)**. **Safari in VoiceOver nista bila preverjena**: Safari ni avtomatiziran (zahteva sistemsko nastavitev), WebKit ni nameščen, VoiceOver bi se vklopil samo po dogovoru z Gregom. Iz dostopnostnega drevesa ne sklepam, kaj bo VoiceOver dejansko napovedal; zlasti ni znano, ali bo bralnik opis prebral ob fokusu ali na zahtevo (odvisno od nastavitev).
- Podvojeni gumbi (točka na sliki in vrstica seznama z istim imenom in opisom) ostanejo; pri tipkanju skozi oba niza se isti opis prebere dvakrat (po eno za vsak gumb).
- Preklica izbire (toggle off) po zasnovi ni; `aria-pressed` zato opisuje izbiro, ne preklopnika.
- Stanje je lokalno preverjeno; gostovanje ni preverjeno.

## Status

D1, D2 in D3 so **lokalno popravljeni in preverjeni v Chromiumu**. **Safari in VoiceOver ostaneta odprta.** Dostopnost kot celota ni zaključena.
