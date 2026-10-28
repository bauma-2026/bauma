# BAUMA V3 — jezik dokumenta na /en

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07`. **Popravek ni izveden.** Brez reorganizacije poti ni primerne rešitve; ta zapis vsebuje samo ugotovitve in predlog. Koda, konfiguracija in okolja so nespremenjeni.

## Vzrok

- Obstaja natanko en korenski layout, [`app/layout.tsx`](../../app/layout.tsx), ki trdo izpiše `<html lang="sl">`. Vse poti (SL in `/en*`) so otroci tega layouta.
- [`app/en/layout.tsx`](../../app/en/layout.tsx) lahko vrne le `<div lang="en" className="contents">`. Ta označi vsebino, ne pa `<html>`; ugnezden `<html>` ni dovoljen.
- Posledica v streženem HTML (izolirana produkcijska gradnja, `SITE_ENV=staging`, `VERCEL_ENV=production`, [dokaz](./bauma-v3-en-document-language-evidence/served-html-before.txt)): `/en`, `/en/mini`, `/en/about-preview`, `/en/privacy`, `/en/terms`, `/en/cookies` imajo vsi natanko en `<html lang="sl">` in en `<div lang="en">`. `/`, `/pristop`, `/work`, `/o-nas`, `/work/ulterior`, `/zasebnost`, `/mini` in 404 imajo `<html lang="sl">`. Drugih `/en` poti je pet; vse so prizadete enako.
- Naslov, meta opis in `<head>` torej ostajajo označeni kot slovenski, tudi na angleških straneh.

## Zakaj ni najmanjšega popravka znotraj sedanje strukture

- `next/root-params` (`<html lang={await lang()}>`) zahteva dinamični segment pred korenskim layoutom (`app/[lang]/…`). To bi uvedlo predpono v URL (`/sl/…`) in spremenilo URL-je, canonicale, hreflang in sitemap. Zavrnjeno.
- Layouti ne prejmejo poti; branje `headers()` brez middleware/proxyja pot ne razkrije, zahteva pa dinamično izrisovanje vseh strani (zdaj so statične). Zavrnjeno (tudi zahteve prepovedujejo middleware/proxy, `useEffect`, `document.documentElement.lang`, `suppressHydrationWarning`).
- Edina strukturno ustrezna rešitev je več korenskih layoutov prek skupin poti.

## Predlog (ni izveden)

Dve skupini poti, vsaka s svojim korenskim layoutom, brez sprememb URL-jev:

- `app/(sl)/layout.tsx` z `<html lang="sl">`; vanj se premaknejo vse sedanje SL poti in `lab`.
- `app/(en)/layout.tsx` z `<html lang="en">`; vanj `app/en/…` (URL `/en/…` ostane, ker so skupine v oklepajih).
- `app/layout.tsx` se odstrani. Skupno (pisave, `globals.css`, skript `HASH_LANDING_SCRIPT`, `Analytics`, privzeti metapodatki) gre v skupno komponento ali modul, ki ga uporabita oba layouta. `robots.ts`, `sitemap.ts` in ikone ostanejo v `app/`.

### Vpliv (ocena iz sedanje kode; ni izmerjen)

- **Obseg premika:** v `app/` brez `lab` je 60 datotek z relativnimi uvozi (~240 uvozov z `../`), v `app/lab` še 274 datotek (34 jih uvaža iz neposredno nadrejenih map). Dodatna globina za eno mapo lomi relativne uvoze; potrebni so popravki poti ali alias.
- **Navigacija SL ⇄ EN** (`/` → `/en`, `/en` → `/`): prehod med korenskima layoutoma je poln prehod strani, ne več mehka navigacija. Vidno vedenje preklopnika jezika se spremeni.
- **404 in zapore razvojnih poti:** brez `app/layout.tsx` `/_not-found` (tudi rewrite iz `next.config.ts` za zaprte poti) ne dobi `<html>`. Potrebna je ločena rešitev za globalni 404; ni preverjena. To je največje tveganje za zapore `/lab` v produkciji in staging.
- **Nespremenjeno po načrtu:** URL-ji, canonicali, hreflang, sitemap, `isIndexable`, `X-Robots-Tag`, metapodatki in OG slike, če se privzeti metapodatki prenesejo 1:1.
- **Preverjanje po izvedbi:** izolirana gradnja `SITE_ENV=staging VERCEL_ENV=production`, surovi HTML vseh poti, matrika indeksiranja zaradi 404, navigacije, hydration, vizualno 375×812 in 1440×900.

### Alternativa

Stanje pustiti do prave EN prenove. `/en` ima že `lang="en"` na vsebini, zato je pokrit del izraza (WCAG 3.1.2), ni pa pokrit jezik dokumenta (3.1.1) niti naslov in meta. Tveganje: bralnik zaslona lahko izgovori angleški `<title>` s slovenskim izgovorom.

## Odločitev Grega

Izvesti reorganizacijo skupin poti zdaj (srednje velik premik, tveganje 404), pred ali ob prenovi EN, ali sprejeti stanje do takrat.

## Omejitve

Preverjen je samo Chromium-neodvisen surovi HTML (curl) iz lokalne izolirane gradnje; ni preverjena objavljena stran, brskalniki ali bralniki zaslona. Predlog je ocena brez poskusne izvedbe.
