# BAUMA V3 — minimalni popravek 404

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07`. Lokalno in necommitano. Prejšnji [pregled](./bauma-v3-404-review.md) je ohranjen. Dokazi: [mapa](./bauma-v3-404-fix-evidence/).

## Sprememba

| Datoteka | Vsebina |
|---|---|
| `app/not-found.tsx` (nova) | Lastna 404 v korenskem layoutu (brez drugega `html`/`body`): `main`, en `h1` »Strani ni mogoče najti.« (DM Serif, `text-balance`), odstavek »Naslov morda ne obstaja več ali je napačen.« (`text-white/70`), `next/link` na `/` »Nazaj na domačo stran →« z belim 2 px fokusnim obrisom. Lastna podlaga `#080a0f` in `text-white` na `main`; globalne barve nespremenjene. |
| `app/novice/[slug]/page.tsx` | Dodan `export const dynamicParams = false;` (ostalo nespremenjeno; [diff](./bauma-v3-404-fix-evidence/diff-novice-vs-start.diff)). |

**Title:** Next v tej različici podpira `export const metadata` v `not-found.tsx`; v streženem HTML je `<title>Strani ni mogoče najti — Bauma</title>` (potrjeno v A in B), brez `useEffect`, proxyja ali spremembe skupnega templata.

**/novice/<neznan slug>:** vzrok je bil lokalen. Brez `dynamicParams = false` je neznan slug šel v dinamični izris, `notFound()` pa je odgovoril z golim dokumentom `<html id="__next_error__">` (brez `lang` in layouta; digest `NEXT_HTTP_ERROR_FALLBACK;404`). Zdaj je neznan slug nepodprta pot in dobi isto 404 v korenskem layoutu, `lang="sl"`. Veljavna zapisa (`/novice/odstrani-tattoo-structure`, `/novice/dema-plus-preview`), `/novice`, URL-ji in noindex so nespremenjeni (200, naslovi nespremenjeni; vsebino strani kode nisem spreminjal).

Nespremenjeno: prepisi TECH-004, `isIndexable`, robots.txt, sitemap, canonical/hreflang, metapodatki veljavnih strani, OG slike, EN struktura, odvisnosti, lockfile.

## Rezultati dveh produkcijskih gradenj (izolirani kopiji, svoj `.next`, prosta vrata)

Gradnji: A `SITE_ENV=production VERCEL_ENV=production`, B `SITE_ENV=staging VERCEL_ENV=production`; obe končani s kodo 0 ([A](./bauma-v3-404-fix-evidence/build-A.log), [B](./bauma-v3-404-fix-evidence/build-B.log)). Surovi HTTP: [A](./bauma-v3-404-fix-evidence/A-http.json), [B](./bauma-v3-404-fix-evidence/B-http.json), [povzetki](./bauma-v3-404-fix-evidence/A-summary.txt).

| Pot | A | B |
|---|---|---|
| `/ne-obstaja-bauma-review`, `/work/ne-obstaja-…`, `/en/not-found-…`, `/novice/ne-obstaja-…` | 404, nov naslov, 1 `html`, 1 `body`, brez preusmeritve | enako + `X-Robots-Tag: noindex, nofollow` |
| `/novice/odstrani-tattoo-structure`, `/novice/dema-plus-preview`, `/novice` | 200 | 200, noindex |
| `/lab/pristop-directions`, lab datoteka, optimizator za `/lab/…` | 404 | 307 → `/` (lab); optimizator 404 |
| `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview` | 404 | 200, noindex |
| `/` | 200, `index, follow`, canonical/og:url `https://bauma.si` | 200, noindex |

Vsi 404 odgovori: dve robots oznaki, `noindex` (Next) in `noindex, nofollow` (korenski privzeti) — vrednosti se ne nasprotujejo; brez `canonical`, `hreflang`, `og:url`; OG slika ostaja skupna SL slika. RSC odgovori niso uporabljeni za sklepanje o uporabniški strani.

## Vizualno in dostopnost (Chromium 151; [ux-fix.json](./bauma-v3-404-fix-evidence/ux-fix.json), posnetki `fix-*.png`)

- 375 × 812 in 1440 × 900, svetla in temna shema OS: kontrast naslova in povezave **19,8 : 1**, odstavka **9,66 : 1** (v obeh shemah enako; prej 1,05 : 1 pri svetli shemi). Brez vodoravnega preliva; vsa besedila v vidnem polju tudi pri razmikih po WCAG 1.4.12 (višina vrstice 1,5, črke 0,12 em, besede 0,16 em, odstavki 2 em).
- Tab: prvi fokus na povezavi, `:focus-visible`, obris 2 px solid bel. Enter odpre `/` (potrjeno v vseh štirih kombinacijah).
- Neposredno nalaganje in odjemalska navigacija (`window.next.router.push` z Home): enako besedilo in title, brez JS napak in brez hydration opozoril.
- Konzola: ob 404 odgovoru brskalnik zapiše »Failed to load resource« za sam dokument (pričakovan omrežni 404) in za `/_vercel/insights/script.js` (Vercel Analytics lokalno; ločeno od JS napak). JS napak: 0.
- ESLint na obeh spremenjenih datotekah: 0; `tsc --noEmit`: 0; `git diff --check`: 0 (dokazi `eslint-targeted.txt`, `tsc.txt`, `diff-check.txt`). Celotnega linta in matrike vseh okolij nisem ponavljal.

## Omejitve

- Jezik: neznane `/en/…` poti dobijo skupno slovensko 404 (`lang="sl"`) do EN prenove.
- Preverjen samo Chromium; ne Safari/Firefox/bralniki zaslona; objavljeno okolje (Vercel) ni preverjeno.
- Klik na dejansko povezavo do neznane poti ni ponovljen brez spremembe aplikacije (uporabljen `router.push`).
- `dynamicParams = false` velja za `/novice/[slug]`; vsebine in odločitve o prihodnosti `/novice` (legacy, noindex) ta poseg ne obravnava.
- Naslov in opis 404 v og/twitter ostajata korenska (Bauma privzeto); lastne OG slike ni.

---

# Dopolnitev 27. 10. 2026: obstoječa glava na 404

Dokazi v isti [mapi](./bauma-v3-404-fix-evidence/): `ux-header.mjs`, `ux-header.json`, `ux-header-summary.txt`, posnetka [1440 × 900](./bauma-v3-404-fix-evidence/header-d1440x900.png) in [375 × 812](./bauma-v3-404-fix-evidence/header-m375x812.png), [mobilni meni](./bauma-v3-404-fix-evidence/header-menu-m375.png), [320 px z razmiki](./bauma-v3-404-fix-evidence/header-m320x568-spacing.png), diffa [not-found](./bauma-v3-404-fix-evidence/diff-not-found-header.diff) in [MiniHeader](./bauma-v3-404-fix-evidence/diff-MiniHeader.diff) proti začetnemu stanju.

## Sprememba

| Datoteka | Vsebina |
|---|---|
| `app/not-found.tsx` | Ovito v `MiniPalette`; nad `main` je skupna `MiniHeader` kot na `/work` in študijah (`refined`, ista navigacija Pristop / Work / O nas) s `contactHref="/#contact"` in `trackSections={false}`. Vsebina 404 (besedilo, tipografija, povezava »Nazaj na domačo stran →«) nespremenjena; zgornji odmik `pt-28` upošteva fiksno glavo (52 px). Brez noge, kontakta, fotografij. |
| `app/components/blocks/mini/MiniHeader.tsx` | Nov izbirni prop `trackSections` (privzeto `true`), ki pri `false` ne posreduje scroll-spy stanja. Glava se drugje ne spremeni (privzeto vedenje potrjeno: `/zasebnost` na dnu še vedno označi Kontakt). |

**Zakaj `trackSections`:** brez njega je bil Kontakt na 404 označen z `aria-current="location"`. Scroll-spy ima pravilo »blizu konca strani → Kontakt«, na 404 pa stran ne drsi, zato je pogoj vedno resničen. Ker je zahteva, da na 404 nobena povezava ni označena kot aktivna, je dodan ozek izbirni prop (privzeta pot nespremenjena). To je edini poseg v skupno komponento.

## Kontakt

Povezava Kontakt na 404 je `/#contact` (namizje in mobilni meni). Klik odpre domačo stran na `#contact` (Home kontakt v vidnem polju, `top` 518 px pri 900 px višine); iz mobilnega menija se meni zapre in naslov je enak. Zahteve `mailto` ni bilo (0), JS napak 0. Fokus po prihodu ostane na `body`, enako kot pri enakem prehodu iz `/zasebnost` (obstoječe vedenje, ne spremenjeno). Na drugih straneh Kontakt ni spremenjen.

## Preverjanje (ena izolirana gradnja `SITE_ENV=production`, `VERCEL_ENV=production`, koda 0; [log](./bauma-v3-404-fix-evidence/build-A-header.log))

- Neznana vrhnja pot, `/work/…`, `/en/…`, `/novice/<neznan>`, `/lab/pristop-directions`, lab datoteka, optimizator za lab, `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview`: pravi **404** brez preusmeritve, nova glava (1 `header`, povezava `/#contact`), sedanja vsebina in title »Strani ni mogoče najti — Bauma«, en `html`/`body`, noindex (dve nenasprotujoči si oznaki), brez canonical, hreflang in og:url. Veljavni zapisi `/novice/…` in `/novice` ostajajo 200 ([AH-summary](./bauma-v3-404-fix-evidence/AH-summary.txt)).
- Logotip → `/`; Pristop → `/pristop`; Work → `/work`; O nas → `/o-nas` (vse pravilno). `aria-current` na 404: nobene povezave (namizje, mobilni meni, odjemalska navigacija).
- Glava ne prekriva vsebine: spodnji rob glave 52 px, naslov od 132 px navzdol (najslabši primer 320 × 568 z razmiki). Brez navpičnega drsenja pri 1440 × 900, 375 × 812, 320 × 568, 1440 × 500 in 375 × 500 (in pri razmikih WCAG 1.4.12); pri 200 % besedila je 375 × 812 za 7 px višji od okna, povezava je dosegljiva s pomikom, brez vodoravnega preliva.
- Tab: logotip → Pristop → Work → O nas → EN → Kontakt → »Nazaj na domačo stran →« z vidnim 2 px belim obrisom. Mobilni meni: odpre se (`role=dialog`, `aria-modal`), Escape ga zapre in fokus se vrne na »Odpri meni«. Odpiranje menija prenese fokus na »Zapri meni«, enako kot na `/zasebnost` ([baseline](./bauma-v3-404-fix-evidence/baseline-header.json)).
- Konzola: 0 JS napak, 0 hydration opozoril; pričakovani omrežni 404 za dokument in lokalni `/_vercel/insights/script.js`, ločeno.
- ESLint na `not-found.tsx` in `MiniHeader.tsx`: 0 napak (1 obstoječe opozorilo `no-img-element` v `MiniHeader`); `tsc --noEmit` 0; `git diff --check` 0.

## Omejitve

Samo Chromium; ni preverjeno Safari/bralnikov zaslona ali objavljeno okolje. Gradnja B in širša matrika niso ponovljeni (konfiguracija, prepisi in indeksiranje nespremenjeni). Skupna slovenska 404 na `/en/…` ostaja do EN prenove (glava ima `EN` povezavo na `/en`). Pri 200 % besedila se pojavi 7 px navpičnega drsenja (pričakovano pri `min-h-screen` z glavo).
