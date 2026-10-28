# BAUMA V3 — Safari in VoiceOver: zaključni pregled ključnih poti

Datum: **27. 10. 2026**. Veja **`staging/bauma-v3`**, HEAD **`6b2fa07926df85731122b430f25ae786a97f06a8`**. Lokalna stran (dev strežnik na 3000, ni ustavljen). Ta korak **ni spreminjal ničesar**: koda, vidna vsebina, metapodatki, OG slike, konfiguracija, odvisnosti, lockfile, sistemske nastavitve in oddaljeno upravljanje Safarija so nedotaknjeni; ničesar ni nameščeno; VoiceOver ni vklopljen; brez gradenj, commita, pusha in deploya; gostovanje ni spremenjeno; `work.bauma.si` ostane noindex, `bauma.si` nespremenjen. Dokazi: [bauma-v3-safari-voiceover-review-evidence](./bauma-v3-safari-voiceover-review-evidence/).

## 1. Katera orodja so dejansko na voljo (in kaj je bilo uporabljeno)

| Orodje | Stanje | Uporabljeno |
|---|---|---|
| Pravi Safari | nameščen, 17,5 (macOS 14,5) | **Ne** (ni avtomatiziran; ročni pregled opravi Grega) |
| `safaridriver` | prisoten (Safari 17.5) | **Ne**: zahteva »Allow Remote Automation«, ki je sistemska nastavitev in je nisem smel vklopiti |
| VoiceOver | prisoten, ne teče | **Ne**: vklop spreminja upravljanje računalnika; samo po dogovoru z Gregom |
| Playwright WebKit | **ni nameščen** (izvedljiva datoteka ne obstaja), nameščanje ni dovoljeno | **Ne** |
| Chromium 151 (Playwright + CDP dostopnostno drevo) | na voljo | **Da**, vsi spodnji avtomatizirani rezultati |

Podrobnosti: [tools-detected.txt](./bauma-v3-safari-voiceover-review-evidence/tools-detected.txt). **Vsi avtomatizirani rezultati spodaj so iz Chromiuma. To ni preizkus Safarija, WebKita ali VoiceOver** in ne dokazuje, kako bo VoiceOver kaj napovedal.

## 2. Kaj je pregledal Grega

**Grega je stran ročno vizualno pregledal v Safariju in ni opazil težav.** To je zabeleženo kot njegov ročni vizualni pregled; ni to test VoiceOver, tipkovnice v Safariju ali celotne dostopnosti.

## 3. Rezultati po poteh (Chromium, razen kjer je navedeno)

**1. Glava in mobilni meni** ([skript](./bauma-v3-safari-voiceover-review-evidence/keyboard-header-contact.cjs), [rezultat](./bauma-v3-safari-voiceover-review-evidence/keyboard-header-contact.json))
- Namizni vrstni red Tab (Home 1440): Bauma — domov → Pristop → Work → O nas → EN → Kontakt → Opišite projekt → Kaj delamo; fokus viden (obris 2 px).
- Mobilni meni (375, `/pristop`): gumb ima `aria-expanded`, meni je `role="dialog"` `aria-modal="true"` z imenom »Meni«; ob odprtju ostane fokus na gumbu (ime »Zapri meni«); Tab: Pristop → Work → O nas → EN → Kontakt → Bauma — domov → Zapri meni → (krog); **Escape zapre meni, fokus se vrne na »Odpri meni«**, drsenje telesa odklenjeno.
- Opažanje (brez posega): v DOM vrstnem redu menija sta logotip in gumb za zapiranje po povezavah, vizualno pa sta zgoraj.

**2. Kontakt** (isti skript)
- Namizje: Enter na »Kontakt« → fokus na `h2#contact-heading`, hash `#contact`, naslednji Tab → »Pošljite opis« (`mailto` ni aktiviran).
- Mobilni meni: Enter na »Kontakt« → meni zaprt, fokus na `h2#contact-heading`, naslednji Tab → »Pošljite opis«. Skladno s popravkom FLOW-001.
- Fokusni obroč na »Pošljite opis«: Home 2 px `#7c97f0`, odmik 3 px; zaključek natural-midnight (`/work`) 2 px bel, odmik 3 px; viden na obeh ([posnetka](./bauma-v3-safari-voiceover-review-evidence/)). Naslov `contact-heading` namenoma nima obroča (programski cilj).

**3. Projektne kartice** (Chromium, [prejšnji pregled](./bauma-v3-card-names-artbite-overflow.md), ponovljen preizkus 375/1440): dostopno ime = ime projekta prek `aria-labelledby`, opis prek `aria-describedby`, Tab in Enter delujeta, fokus viden. **Dejanska napoved VoiceOver in bralni vrstni red NISO preverjeni.**

**4. Ulterior** ([skript](./bauma-v3-safari-voiceover-review-evidence/ulterior-points.cjs), [rezultat](./bauma-v3-safari-voiceover-review-evidence/ulterior-points.json))
- Deset gumbov (5 točk na sliki + 5 v seznamu), vsak 44 × 44 px, imena »01 — Detachable hood« … v `lang="en"`; začetno nobena ni izbrana; Tab/Enter/Space delujejo.
- **Potrjene napake spodaj (D1–D3).**

**5. Razmiki in gibanje** ([skript](./bauma-v3-safari-voiceover-review-evidence/cards-stress-reduced-motion.cjs), [rezultat](./bauma-v3-safari-voiceover-review-evidence/cards-stress-reduced-motion.json), [ArtBite](./bauma-v3-safari-voiceover-review-evidence/artbite-overflow.json))
- Kartice (`/`, `/work`, `/pristop`, `/o-nas`) pri 320 in 375 px s povečanimi razmiki (vrstica 1,5, črke 0,12 em, besede 0,16 em, odstavek 2 em): brez preliva dokumenta, naslovi in opisi znotraj kartic.
- `/work/artbite` pri 320, 375 in 1440 px, privzeto in s povečanimi razmiki na celotni strani, po zadnjem popravku: brez preliva (320 / 320), brez odrezanega besedila.
- Home, reduced motion (375 in 1440): kocka `data-mode="reduced"`, `phase="open"`, `reveal=0,720`, nespremenjeno v šestih vzorcih, 0 tekočih animacij, 0 napak.
- Safari/WebKit pregled razmikov in gibanja **ni izveden**.

## 4. Potrjene napake (Ulterior, `/work/ulterior`; zaznano v Chromiumu, napoved VoiceOver ni preverjena)

**D1 — `aria-pressed` sledi fokusu in lebdenju, ne izbiri.** `UlteriorTechnicalProof.tsx`: `isActive = index === visibleIndex`, kjer je `visibleIndex = hoveredIndex ?? selectedIndex`, in `onFocus` nastavi `hoveredIndex`.
- *Koraki:* Tab na točko »02 — Waterproof zippers« → `aria-pressed="true"` na obeh gumbih »02« (točka in seznam), čeprav ni izbrana; Enter; Tab na »03« → »02« ni več pritisnjen (pritisnjen je »03«); izbira se vidi šele po izgubi fokusa.
- *Pričakovano:* `aria-pressed="true"` samo za izbrano točko, neodvisno od fokusa.
- *Dejansko:* pritisnjeno stanje sledi fokusu; izbira se začasno izgubi med tipkanjem po točkah. Brez fokusa AX drevo kaže `pressed=false` povsod.
- *Predlagani najmanjši popravek:* `aria-pressed={index === selectedIndex}`, vidno poudarjanje (`isActive`) pa ostane na `visibleIndex`.

**D2 — razlaga izbrane točke ni programsko povezana.** Panel z naslovom in besedilom (»Detail map … Select a detail on the jacket …«) nima `aria-live`, `aria-controls` ali `aria-describedby`; gumbi imajo samo `aria-label`. Uporabnik bralnika po aktivaciji ne dobi razlage.
- *Predlog:* `aria-live="polite"` na panelu (vsebina iz izbire) ali `aria-describedby` na panel; skupaj z D1.

**D3 — angleško besedilo brez `lang="en"` v Visual Proof.** Na `/work/ulterior` so izpostavljeni angleški nizi: `h2` »The shell is quiet, but not generic.«, odstavek »The hardshell is the clearest product expression …« in dva `figcaption` »Rear hood detail«; nadrejeni jezik je `sl`. (Tehnični prikaz ima `lang="en"`; prikazi z `role="img"` imajo slovenska imena.) Bralnik bo besedilo prebral s slovenskim glasom.
- *Predlog:* `lang="en"` na ovoju Visual Proof (ali na teh elementih).

**Opažanje brez posega:** isti gumb je podvojen (točka in seznam z istim imenom, 10 gumbov), pri fokusu na enega se vizualno poudari tudi par. Hardshelljacket: angleška vsebina je v `role="img"` z slovenskimi imeni, brez izpostavljenega angleškega besedila.

## 5. Še neizvedeno

- Pravi Safari (tipkovnica, fokus, razmiki, reduced motion, 320 px) in WebKit avtomatizacija.
- **VoiceOver**: napoved imen kartic, opisov, točk Ulterior, napoved jezika, bralni vrstni red.
- Dostopnost kot celota ni zaključena.

## 6. Kratek ročni pregled za Grega (Safari + VoiceOver, največ 6 korakov)

1. **Safari, tipkovnica:** v Safariju Tab privzeto preskoči povezave; uporabite **Option+Tab** (ali vklopite »Press Tab to highlight each item«). Na Home preglejte vrstni red glave in vidnost fokusa; v načinu »Responsive Design« (375 px) odprite meni, preverite Escape in vrnitev fokusa na gumb.
2. **Kontakt:** Enter na »Kontakt« (glava in mobilni meni) → pogled pri kontaktu; naslednji Option+Tab → »Pošljite opis« z vidnim obročem (Home in `/work`). Pošte ne odpirajte.
3. **VoiceOver (Cmd+F5), kartice** na Home in `/work`: ali napove samo ime projekta (npr. »Odstrani Tattoo, povezava«) z opisom in ali je vrstni red branja smiseln; Enter odpre projekt.
4. **VoiceOver, `/work/ulterior`:** pojdite skozi točke tehničnih podrobnosti; ali napove »pritisnjeno« že ob fokusu (D1), ali dobite razlago (D2) in ali je angleško besedilo v »Visual Proof« prebrano z angleškim glasom (D3).
5. **Safari, razmiki in gibanje:** `/work/artbite` pri 320 px (Responsive Design Mode) ne sme imeti vodoravnega drsenja; z vklopljenim Sistemske nastavitve → Dostopnost → Zaslon → »Zmanjšaj gibanje« mora kocka na Home ostati statična.
6. **Izklop:** po pregledu izklopite VoiceOver (Cmd+F5) in po potrebi vrnite nastavitev tipkovnice.

## Povzetek

1. **Uspešno preverjeno (Chromium):** tipkovnični vrstni red glave, odpiranje/zapiranje menija z Escape in vrnitev fokusa, tok Kontakt → naslov → »Pošljite opis«, vidni obroči na Home in natural-midnight zaključku, imena in opisi kartic, tehnične točke Ulterior (tipkovnica), razmiki pri 320/375 px na karticah in ArtBite, reduced motion kocke na Home. Grega je stran ročno vizualno pregledal v Safariju.
2. **Potrjene napake:** D1, D2, D3 (Ulterior); popravki še niso izvedeni.
3. **Neizvedeno:** pravi Safari, WebKit, VoiceOver.
4. **Ročni koraki za Grega:** razdelek 6.
