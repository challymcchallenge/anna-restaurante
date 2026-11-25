# Auditul de finisare F5 (Impeccable · audit)

Trattoria da Vittoria · 25.11.2026 · Site-ul public de pe producție, telefon și desktop · PLAN F5.1, F5.2, F5.4

## Concluzia

- **Scor Impeccable: 16/20 înainte, 18/20 după corecții** (bandă „Good” → „Excellent”).
- **1 problemă de accesibilitate reală (P1), reparată:** pe telefoanele scurte (360 × 780, 375 × 667), titlul copertei avea 2,23–2,74:1 pe cadrele noi din D-77 (prag 3:1). Acum ≥ 3,08:1; de la 390 px în sus nu se schimbă nimic.
- **Navigarea prin linkuri pe producție: 2.288 de clicuri în 7 limbi, 0 greșeli**, 0 erori în consolă.
- **1 problemă de navigare pe telefon (P2), reparată:** din meniul lateral, salturile spre Cursuri, Galerie, Hotel și Contact lăsau secțiunea cu 600–2.000 px sub ecran (17 din 32). Acum 30/30 pe producție.
- **0 cookies** pe site-ul public: la încărcare, după fereastra ialoc și după „Arată harta”. Nu e nevoie de banner [PRESUPUNERE juridică, Q-25].

## Scorul

| # | Dimensiune | Scor | Constatarea principală |
|---|---|---|---|
| 1 | Accesibilitate | 3 → 4 | Contrastul titlului copertei pe telefoanele scurte (reparat) |
| 2 | Performanță | 3 | Lighthouse mobil Acasă mediana 86–92 (D-71…D-77); meniul din antet face încărcare completă |
| 3 | Temă | 3 | Culorile și fonturile din panou, pe restaurant; comutatorul de temă e după lansare (D-33) |
| 4 | Responsive | 4 | 0 depășiri orizontale la 360, 390, 768, 1280, 1920 px, pe 11 pagini |
| 5 | Integritatea implementării | 3 → 4 | Rânduri de ~93 de caractere în paginile legale (reparat); restul semnalărilor țin de direcția aprobată |
| **Total** | | **16 → 18/20** | |

**Verdict integritate: trece.** Sistemul e propriu (B · Carta, D-41): copertă cu folio, hârtie, chenar dublu, margini ondulate, forme decorative pe secțiuni. Detectorul semnalează fundalul crem ca „ales din reflex”; aici e hârtia din direcția aprobată de Alin la GATE 2, deci fals pozitiv.

## Ce am măsurat (producție, 25.11.2026)

| Probă | Rezultat |
|---|---|
| Detectorul Impeccable, 9 pagini × 2 lățimi (390, 1280) | 23 de semnalări: 6 fundal crem (direcția aprobată), 6 spațiere pe eticheta hărții (etichetă scurtă, fals pozitiv), 5 rânduri lungi pe `/termeni` (reparat), 1 contrast pe subtitlul copertei (fals pozitiv: măsurat în animația de intrare; real ≥ 7,7:1 pe desktop), 1 cuvânt singur pe ultimul rând (reparat) |
| Contrastul copertei, cadru cu cadru, slideshow oprit, cei mai luminoși 5% din pixelii din spatele textului | Desktop 1280 / 1920: titlu ≥ 9,94:1, subtitlu ≥ 11,23:1. Tabletă 768: ≥ 4,37 / 5,24. Telefon: vezi mai jos |
| Lățimi 360 / 390 / 768 / 1280 / 1920 px, 11 pagini (inclusiv `/en`, `/zh/catalog-vinuri`) | 0 depășiri orizontale, 0 imagini fără `alt`, titluri în ordine (un singur h1), 0 erori în consolă |
| Tastatura pe Acasă, primele 45 de opriri | „Sari la conținut” primul, focus vizibil pe toate |
| Ținte de atingere sub 24 px | Telefoanele din footer și Contact: 120 × 21 px (trec prin excepția de spațiere WCAG 2.5.8, rândurile au 30 px; Lighthouse 100); căsuțele de bifat 20–22 px au eticheta apăsabilă alături |
| Cookies | 0 la încărcare, 0 după ialoc (fereastra `widget.ialoc.ro` deschisă), 0 după harta Google, 0 chei în `localStorage`. **Neverificat:** cookies terțe din interiorul ferestrelor ialoc și Google Maps, dacă browserul le blochează |

### Contrastul titlului pe telefon (prag 3:1, text mare)

| Ecran | Înainte (cadre 1–5) | După |
|---|---|---|
| 360 × 780 | 2,74 · 2,73 · 3,97 · 4,85 · 7,12 | 3,10 · 3,08 · 4,42 · 5,26 · 7,60 |
| 375 × 667 (iPhone SE) | 2,23 · 2,73 · 2,81 · 5,11 · 5,54 | 3,26 · 3,88 · 3,99 · 6,34 · 7,03 |
| 390 × 844 | 3,51 · 3,29 · 5,10 · 4,84 · 6,14 | identic |
| 412 × 915 | 4,43 · 4,25 · 5,64 · 4,85 · 5,45 | identic |

Cauza: titlul stă la ~330 px de marginea de jos pe orice telefon, dar umbra era definită doar în procente, deci pe ecranele scurte acoperea mai puțin. Corecția: aceleași trepte ca în D-70, cu minimul în pixeli de la 390 × 844 (`max(30%, 232px)` …). Probată întâi pe producție, injectată în pagină, apoi scrisă în cod.

## Constatări, pe prioritate

| P | Problema | Unde | Ce am făcut |
|---|---|---|---|
| P1 | Titlul copertei sub 3:1 pe telefoanele scurte, cu cadrele din D-77 (WCAG 1.4.3) | `styles.css`, `.hero::before` | **Reparat** (tabelul de mai sus) |
| P2 | Pe telefon, saltul din meniu spre o secțiune de jos a paginii Acasă (Cursuri, Galerie, Hotel, Contact) lăsa secțiunea la 600–2.000 px sub ecran. Cauza: secțiunile au `content-visibility: auto` cu înălțimea estimată de 900 px | `HeaderController.tsx`, `.cv-all` | **Reparat:** la salt, secțiunile se așază o clipă cu înălțimea reală. Local, build de producție: 18/18 (cu corecția neutralizată: 3 greșite); producție: 30/30 |
| P2 | Rânduri de ~93 de caractere în paginile legale (citire obositoare) | `.legal-text` | **Reparat:** paragrafele la 31em, ~75 de caractere |
| P2 | Paginile proprii moșteneau titlul Open Graph al paginii Acasă; nicio imagine de distribuire | toate paginile | **Reparat** în pasul de date structurate (F5, `pageMetadata`) |
| P3 | Un cuvânt singur pe ultimul rând al notei hărții | `.map-note` | **Reparat:** `text-wrap: pretty` |
| P3 | Linkurile din meniul antetului sunt `<a>` simple: de pe o pagină proprie, fac încărcare completă (~1 s în plus) | `SiteHeader.tsx` | **Neaplicat:** atinge rutarea reparată în D-72; câștigul e mic. De reluat după lansare, cu proba de navigare |
| P3 | Telefoanele din footer au 21 px înălțime | `SiteFooter.tsx` | **Neaplicat:** trec prin excepția de spațiere; Lighthouse 100 |

## Observații de conținut (nu de cod, pentru Alin)

- **Bucătăria:** categoriile n-au încă fotografii (D-66), deci pe desktop apar 5 plăci închise la culoare, una lângă alta. Fotografiile reale sunt cea mai mare îmbunătățire vizuală rămasă.
- **Texte scrise din panou:** „Dimineața, Buona Mattina dragii noștri! ❤️” (Bucătăria) și „Recepția hotelului confirmă disponibilitatea în max 30m ❤️” (bara de cazare). „30m” se poate citi și „30 de metri”; propun „în cel mult 30 de minute”. Emoticoanele în text sunt alegerea ta; restul site-ului nu le folosește.

## Proba de navigare prin linkuri (producție)

Clic pe fiecare link intern, din fiecare pagină, în fiecare limbă (desktop 1280 px, Chromium); după clic, adresa, titlul și h1 se compară cu încărcarea directă a aceleiași adrese.

| Limba | Clicuri | Greșite | Cu încărcare completă (corect, dar mai lent) |
|---|---|---|---|
| ro | 296 | 0 | 140 |
| en, it, fr, de, zh, sv | 332 fiecare | 0 | 161 fiecare |
| **Total** | **2.288** | **0** | |

Încărcările complete vin din selectorul de limbă (normal: se schimbă limba paginii) și din linkurile simple `<a>` ale meniului (P3 de mai sus). **Pe telefon** (iPhone 13, atingeri reale, meniul lateral, ro și en, de pe Acasă și de pe `/galerie`): 30/30 după corecție.

## Ce rămâne pentru sesiunea 2

Re-măsurarea Lighthouse pe domeniul final (inclusiv `/zh`, G11-3), proba ialoc pe domeniu, emailurile.
