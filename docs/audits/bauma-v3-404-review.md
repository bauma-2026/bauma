# BAUMA V3 — pregled obstoječe 404 strani

27. 10. 2026 · `staging/bauma-v3` · HEAD `6b2fa07`. **Samo pregled**; koda, konfiguracija, prepisi, metapodatki in odvisnosti niso spremenjeni. Dokazi: [mapa](./bauma-v3-404-review-evidence/).

## 1. Implementacija

- Lastne 404 ni: v `app/` ni `not-found.tsx` ne `global-not-found.tsx`. Neznane poti izriše **privzeta Next.js 404** znotraj korenskega layouta `app/layout.tsx` (`<html lang="sl">`, `<body class="… bg-[#080808] text-white">`, fiksna temna plast, `Analytics`).
- `next.config.ts`: v ne-staging produkcijski gradnji `rewrites().beforeFiles` preusmeri `/lab/:path*`, `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview` na `/_not-found`; optimizator slik za `/lab/…` gre na isto pot v vsaki produkcijski gradnji. Zapore torej uporabljajo isto privzeto 404. Staging: `/lab/:path*` → 307 na `/`.
- Dinamična pot `app/novice/[slug]` kliče `notFound()` (druga pot do 404).

## 2. Produkcijsko vedenje (izolirani gradnji A in B, Chromium ni potreben; surov HTTP)

[A-summary](./bauma-v3-404-review-evidence/A-summary.txt) · [B-summary](./bauma-v3-404-review-evidence/B-summary.txt) · [A-http.json](./bauma-v3-404-review-evidence/A-http.json) · [B-http.json](./bauma-v3-404-review-evidence/B-http.json)

| Zahteva (navigacijski dokument) | A (production) | B (staging) |
|---|---|---|
| `/ne-obstaja-bauma-review`, `/work/ne-obstaja-bauma-review`, `/en/not-found-bauma-review` | 404, text/html | 404, `X-Robots-Tag: noindex, nofollow` |
| `/lab/pristop-directions`, `/lab/…/v1-1440-full.png` | **404** | **307 → `/`** (staging preusmeritev ohranjena) |
| `/_next/image?url=/lab/…` | 404 | 404 (brez 500) |
| `/mini`, `/en/mini`, `/about-preview`, `/en/about-preview` | **404** | 200 (predogledi odprti, noindex) |
| `/` | 200, `index, follow` | 200, noindex, `X-Robots-Tag` |
| `/novice/ne-obstaja-bauma-review` | 404 (glej 5c) | 404 |

RSC odgovori (`RSC: 1`): na 404 poteh status 404 `text/x-component`; za obstoječe strani brez `?_rsc` Next odgovori 307 na `?_rsc=…` (zaščita pred predpomnjenjem). To ni uporabniška 404 in iz njega ne sklepam o njej; uporabniška stran je navigacijski dokument.

## 3. HTTP in metapodatki (404, enako v A in B razen `X-Robots-Tag` v B)

- Status **404**, brez preusmeritev; en `<html>` in en `<body>`.
- `<html lang="sl">` tudi za `/en/…` neznane poti (znana težava korenskega jezika, EN prenova).
- `<title>` in `og:title`/opis: **enaki kot na domači strani** (»Bauma — Jasna struktura. Več odločitev.«), podedovano iz korenskih metapodatkov.
- Robots: dve oznaki, `noindex` (vstavi Next za not-found) in `noindex, nofollow` (korenski privzeti). Vrednosti se ne nasprotujejo; skupni učinek noindex, nofollow. V B še `X-Robots-Tag: noindex, nofollow`; v A glave ni.
- **Brez** `canonical`, `hreflang` in `og:url` — domači strani torej ne prevzame canonicala. `og:image`/`twitter:image` = `https://bauma.si/og/bauma-og-v3.png` (skupna SL slika; ni zavajajoče, lastne ne zahtevam).

## 4. Uporabniška izkušnja (Chromium 151, 375 × 812 in 1440 × 900; [posnetki](./bauma-v3-404-review-evidence/404-m375.png), [1440](./bauma-v3-404-review-evidence/404-d1440.png), [ux404.json](./bauma-v3-404-review-evidence/ux404.json))

- Vsebina: `H1 »404«`, `H2 »This page could not be found.«` (angleško, 14 px) v slovenskem dokumentu; **povezav in gumbov ni** (ni poti nazaj na Home). Brez preliva.
- **Črno besedilo na temni podlagi:** privzeti stil napake (`body{color:#000}`, brez plasti) preglasi Tailwind `text-white` (utility v `@layer`); podlaga je zaradi korenske plasti `#080808`. Pri svetli shemi OS je kontrast **#000 na #080808 = 1,05 : 1** — besedilo je praktično nevidno (posnetka). Pri temni shemi OS (`prefers-color-scheme: dark`) privzeti stil preklopi na belo besedilo in je berljivo ([dark404.json](./bauma-v3-404-review-evidence/dark404.json)). Stran torej ni berljiva za uporabnike s svetlo shemo.
- Tipkovnica: ni fokusabilnih elementov (Tab ostane na `body`); dostopna imena povezav ni kaj preverjati. Semantika: dva naslova (`h1`, `h2`), brez `main`/landmarka.
- Neposredno nalaganje in notranja navigacija (`window.next.router.push` z Home) dasta enak 404 (title, besedilo, brez pageerror pri navigaciji). Omejitev: klika na pravo povezavo do neznane poti nisem ponovil brez spremembe aplikacije.
- Konzola: 404 za sam dokument in za `/_vercel/insights/script.js` (Analytics skript zunaj Vercela; značilnost lokalnega testa, ne napaka strani).

## 5. Presoja

**a) Potrjena funkcionalna napaka:** 404 je pri svetli shemi OS skoraj neberljiva (kontrast 1,05 : 1) in nima poti nazaj. Pravilna statusna koda, noindex in zapore delujejo.

**b) Vsebinske/oblikovne pomanjkljivosti:** besedilo v angleščini v slovenskem dokumentu; generičen naslov (enak domači strani); ni povezave na Home; brez landmarka; podvojena (nenasprotujoča) robots oznaka; `/en/…` neznana pot dobi isto (slovensko označeno) stran.

**c) Pomanjkljivost na robu:** `/novice/<neznan slug>` vrne 404 z drugačnim dokumentom: surov HTML je `<html id="__next_error__">` brez `lang` in brez fontov, naslov »404: This page could not be found.«; po hidraciji se prikaže enaka vsebina. Pot ni v sitemapu in je noindex; je odvisna od poznejše odločitve o `/novice`.

**d) Izbirno:** lastna OG slika, EN različica besedila, dodatna navigacija.

## 6. Predlog najmanjšega posega (ni izveden; potrebna potrditev)

Ena nova datoteka `app/not-found.tsx` (~25 vrstic), brez sprememb `next.config.ts`, prepisov, indeksiranja ali odvisnosti; obstoječi pisavi (`font-serif` DM Serif Display za naslov, `font-sans` Inter) in barve (`#080808` podlaga, `text-white`, `text-white/70`), **brez** fotografij, animacij in kocke. Besedilo (SL):

- naslov (h1): **Strani ni mogoče najti.**
- odstavek: **Naslov morda ne obstaja več ali je napačen.**
- povezava (`next/link`, `href="/"`, vidni fokusni obroč kot drugod na strani): **Nazaj na domačo stran**
- `<main>` landmark; barve nastavljene tako, da preglasijo privzeti stil; `metadata.title`: »Strani ni mogoče najti — Bauma« (robots ostane noindex).

Po potrditvi preveriti: A/B gradnji (404 status, zaprte lab/mini/about-preview poti še vedno 404, staging 307), kontrast pri svetli in temni shemi, tipkovnica/fokus pri obeh širinah, en `<html>`/`<body>`, metapodatki (brez canonical/og:url), ESLint/tsc. EN besedilo za `/en/…` in jezik dokumenta ostaneta v EN prenovi.

## 7. Nepreverjeno

Objavljen staging/produkcija (Vercel obnašanje 404, `_vercel` skript); Safari/Firefox in bralniki zaslona; klik na pravo povezavo do neznane poti; vpliv na iskalnike (noindex potrjen v HTML in glavi, ne v iskalniku); `/novice` v produkciji; bundler (statična analiza). Ni preverjen noben zunanji naslov.
