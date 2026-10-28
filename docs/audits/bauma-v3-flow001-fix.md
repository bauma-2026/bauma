# BAUMA V3 — popravek FLOW-001: fokus po izbiri Kontakta (2026-10-25)

Veja `staging/bauma-v3`, HEAD `6b2fa07`. Obstoječe necommitane spremembe ohranjene; nič ni commitano, pushano ali deployano. Prejšnja poročila niso prepisana.

## Vzrok

`scrollToFragment` (MiniHeader.tsx) je samo pomaknil pogled in zapisal hash; fokus je ostal na povezavi Kontakt v glavi, naslednji Tab je zato šel naprej po glavi/uvodu. Cilj `#contact` je tudi zgolj ničvelikostni `<span>` (`data-anchor-marker`) v `MiniFinalCTA`, ki ne more prejeti fokusa. Na mobilnem je dodatno cleanup `useMobileMenuChrome` ob zaprtju menija vedno vrnil fokus na hamburger in prepisal navigacijo.

## Rešitev

- `MiniFinalCTA.tsx`: naslov `h2` dobi `id="contact-heading"` in `tabIndex={-1}` (programski cilj, ni Tab postaja) ter `focus:outline-none`.
- `MiniHeader.tsx`: tabela `FRAGMENT_FOCUS_TARGET = { contact: "contact-heading" }`; po pomiku in `pushState` `scrollToFragment` kliče `focus({ preventScroll: true })`. Pri zapiranju menija se z modulsko zastavico `focusHandoffPending` (nastavljeno pred zaprtjem, počiščeno v `go`) preskoči vrnitev fokusa na hamburger. Zaporedje je zagotovljeno z zastavico in obstoječima dvema `requestAnimationFrame`, ne s časovnikom. Escape in gumb za zapiranje zastavice ne nastavita, torej fokus še vedno vrneta na hamburger.
- Drugi fragmenti (ni vnosa v tabeli) in `MiniHeaderEn` (uporablja samo `useMobileMenuChrome`) se obnašajo kot prej.

Spremenjeni datoteki: `app/components/blocks/mini/MiniHeader.tsx`, `app/components/blocks/mini/MiniFinalCTA.tsx`.

## Rezultati (Chromium 151, dejanski Tab/Enter, lokalni dev)

- **Kontakt → Enter** (1440×900 in 375×812; na 375 prek menija z Enter): aktivni element po Enter je `h2#contact-heading`, po naslednjem Tab `a "Pošljite opis"` (mailto, ni aktiviran), pogled ostane pri kontaktu, hash `#contact`, drsenje odklenjeno. Velja za vseh 10 strani: `/`, `/pristop`, `/work`, `/o-nas` in šest `/work/*`. Shift+Tab gre nazaj na zadnjo povezavo pred kontaktom (npr. `/pristop`: “Vsi projekti”).
- **Reduced motion** (`/`, `/pristop`, `/work/flexido`, obe širini): enak rezultat.
- **Mobilni meni** (/pristop, 375): Escape → fokus `#bauma-mobile-menu-trigger`, scrollY 300 → 300, drsenje odklenjeno; zapiranje z gumbom → trigger, odklenjeno; “O nas” → `/o-nas`, odklenjeno; Kontakt (Enter in tap) zapre meni, fokus na naslovu kontakta.
- **Klik** na desktopu: fokus na naslovu, hash `#contact`; **Nazaj**: hash prazen, scrollY 0. **Hero** “Opišite projekt” → `#contact` (1440 y 2937; 375 y 3824), “Kaj delamo ↓” → `#kaj-delamo` (848 / 727); naravna hash navigacija, naslednji Tab doseže “Pošljite opis”.
- **Pravna stran** `/zasebnost` Kontakt → `/#contact`; naslednji Tab “Pošljite opis”.
- **TypeScript** `tsc --noEmit`: 0 napak. **ESLint** na obeh datotekah: 0 napak, 1 stari opozorilo `no-img-element` (MiniHeader.tsx:342, ni povezano).

## Dokazni posnetki

`docs/audits/bauma-v3-flow001-evidence/`: `{home,pristop,work-flexido}-{1440,375}-after-enter.png` in `-after-tab.png`. Aktivni element: po Enter `h2#contact-heading`; po Tab `a` “Pošljite opis→” (`mailto:info@bauma.si?subject=…`).

## Omejitve

- Samo Chromium, lokalni dev; Safari/VoiceOver in dejanski zaslonski bralnik niso preverjeni (naslov dobi fokus brez vidnega obroča).
- Dotik je Playwright emulacija; mailto ni bil aktiviran.
- Hero povezavi ostaneta privzeta hash navigacija (fokus ostane na prejšnjem mestu, naslednji Tab ga vseeno vodi na “Pošljite opis”); po navodilih nespremenjeni.
- Posnetki kažejo pogled, ne fokusa (naslov nima vidnega obroča); dokaz fokusa so izpisi aktivnega elementa zgoraj.
