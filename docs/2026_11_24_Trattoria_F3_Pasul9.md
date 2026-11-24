# F3 · pasul 9 · Contact, sesizări, ialoc cu data · Trattoria da Vittoria — raport (oprire înainte de pasul 10)

Data: 24.11.2026 · Stare: **gata, în așteptarea „GO” pentru pasul 10** · Decizie: D-50 · Commit pe `main`: `d506945` · Raportul pasului 8 e în același push: `docs/2026_11_24_Trattoria_F3_Pasul8.md`

## 1. Concluzie

Am făcut cele trei piese ale pasului 9 și proba ialoc cu data serii (G4-1):
- pagina **Contact** cu formularul unic;
- pagina de **sesizări**;
- secțiunea **Contact** de pe Acasă.

Totul e live: https://anna-restaurante-alinlabau-9308s-projects.vercel.app/contact

| Țintă | Rezultat măsurat pe producție |
|---|---|
| Lighthouse mobil, performanță ≥ 85 | **Acasă 91 / 91 / 91 · Contact 98 / 99 / 96 · Sesizări 95 / 100 / 99** |
| Lighthouse mobil, accesibilitate ≥ 95 | **100** la toate cele 9 rulări |
| Contrast ≥ 4,5:1, pe pagina afișată | **706 rânduri, 0 sub prag**, minimum 5,0:1 |
| Teste de integrare | **49/49** (6 noi) |
| Formularul cap-coadă | **probat local**, toate subiectele: cererea se salvează în „Cereri primite”. Pe producție: doar validarea (nu am creat cereri de probă în panoul tău) |
| G4-1, ialoc cu data serii | **probat pe rețea:** `defaultDate=2026-12-12` de pe cardul serii, fără dată din antet, `2026-12-18` de pe a doua seară |

**De știut:** pe producție, în Setări → Cereri și emailuri e pornit doar subiectul **Cazare**. Celelalte au fost oprite la pașii anteriori, pentru că lipsesc destinatarii (#27). De aceea:
- pe `/contact` apar doar „Rezerv o masă” și „Cazare”;
- pagina de sesizări dă telefonul.

Ca să apară toate subiectele, le pornești din panou (G6-1).

## 2. Ce s-a construit

| Ce | Cum arată | Din panou |
|---|---|---|
| **`/contact`** (S-06) | Sus sunt butoanele de subiect: „Rezerv o masă” deschide ialoc; celelalte sunt subiectele pornite. Câmpurile se schimbă după subiect, și fără JavaScript. Dedesubt: numele, telefonul, emailul, detaliile și acordul. Pe desktop, alături, „Mai repede prin telefon” | Setări → Cereri și emailuri (subiect activ, termen de răspuns) |
| Precompletarea | Din bara de cazare vin sosirea, plecarea, adulții și copiii (totaluri), plus rândul „Camera 1: 2 adulți · Camera 2: 1 adult, 1 copil”, care intră în mesajul către hotel. Butoanele „Rezervă salonul”, „Înscrie copilul” și „Cere ofertă de cazare” deschid formularul cu subiectul ales | — |
| Eveniment privat | Tip, dată, invitați, salon preferat. După numărul de invitați apare „Potrivit: Salon Vittoria (până la 40 de invitați)”. Peste capacitate, mesajul îndrumă spre Grupul ANNA (D-32) | Saloane (capacitate) |
| Curs de pizza | Câți copii, vârstele, data dorită, nota despre alergii („le discutăm la confirmare”) | — |
| Cazare | Sosire, plecare, adulți, copii, tipul de cameră (opțional), nota „Cererea merge la Hotel ANNA…” | Tipuri de camere; Pagina Acasă → Hotel |
| **Greșelile** (S-06b) | Sus: „Mai sunt 3 câmpuri de completat. Le-am marcat mai jos.” Lângă fiecare câmp, mesajul cu semnul „!” (nu doar culoare). Focusul sare la primul câmp greșit, iar ce s-a scris rămâne | — |
| **Confirmarea** (S-06c) | „Am primit cererea ta”, ce s-a cerut („Cazare · duminică, 20 decembrie 2026 – miercuri, 23 decembrie 2026 · 3 adulți, 1 copil”), „Te sunăm noi.”, termenul de răspuns (dacă e completat), telefonul pentru urgențe, „Înapoi la Acasă”. **Nu promite email:** emailurile pleacă din F5 (D-36) | Termen de răspuns afișat |
| **Salvarea** | În „Cereri primite”: subiectul, datele, detaliile pe subiect, acordul cu momentul lui, „Email trimis: nu”. Cererea rămâne în panou orice ar fi | Cereri primite |
| Anti-spam | Un câmp ascuns pe care oamenii nu-l văd și un timp minim de 2,5 secunde de la deschiderea paginii | — |
| **`/formular-de-reclamatie`** (S-07) | Adresa veche, păstrată. Conține data vizitei (cel târziu azi), motivul (cele 9 din panou, cu explicația lor), ce s-a întâmplat, ospătarul (opțional), datele tale și acordul. Dacă subiectul Sesizare e oprit, pagina dă telefonul | Motive de sesizare; Setări → Sesizare |
| **Acasă · Contact** (4.11) | Titlul, textul, „Rezervă o masă” (verde, butonul principal), subiectele pornite (fiecare duce la `/contact?subiect=…`), telefoanele, adresa cu „Vezi pe hartă”, programul. Dedesubt, cel mult 5 întrebări frecvente din grupul Acasă | Pagina Acasă → Contact; Întrebări frecvente |
| **ialoc cu data serii** (G4-1) | „Rezervă masă” de pe cardul unei seri deschide fereastra ialoc cu data serii preselectată. Se poate opri pe fiecare seară din „Rezervare cu data serii” | Seri tematice |

**Cum merge data în ialoc:** am citit scriptul oficial `embed.js`. ialoc ia data din adresa paginii (`?defaultDate=`) în momentul clicului și o păstrează pentru clicurile următoare. De aceea punem data butonului în adresă doar pe durata clicului (goală pentru „Rezervă o masă”) și refacem adresa imediat. Proba pe rețea, cu localul ialoc 4385:

| Clic | Adresa ferestrei ialoc |
|---|---|
| Cardul serii din 12 decembrie | `…&defaultDate=2026-12-12&…` |
| „Rezervă o masă” din antet | fără `defaultDate` |
| Cardul serii din 18 decembrie | `…&defaultDate=2026-12-18&…` |

Adresa paginii rămâne `/petreceri`.

## 3. Cifrele

### 3.1 Lighthouse 13.6.0, mobil, pe producție (`d506945`)

| Pagina | Performanță | Accesibilitate | LCP | TBT | CLS |
|---|---|---|---|---|---|
| Acasă | 91 / 91 / 91 | 100 | 3,3–3,4 s | 90–150 ms | 0 |
| `/contact` | 98 / 99 / 96 | 100 | 1,0–1,1 s | 120–230 ms | 0 |
| `/formular-de-reclamatie` | 95 / 100 / 99 | 100 | 0,9 s | 90–260 ms | 0,001 |

SEO 66 peste tot: `noindex` pus intenționat pe adresa temporară (ADR-012).

### 3.2 Contrast pe randare (`docs/f3/contrast-pasul-9-*.json`)

| Pagina | Telefon | Desktop | Cel mai slab |
|---|---|---|---|
| Acasă | 221, 0 sub prag | 249, 0 | 5,0:1 („Rezervări mese”, pe hârtia caldă) |
| `/contact` | 64, 0 | 68, 0 | 5,38:1 |
| `/formular-de-reclamatie` | 50, 0 | 54, 0 | 5,38:1 |

### 3.3 Proba formularelor (Playwright, local, cu toate subiectele pornite pe baza locală)

- **Precompletarea:** din bara de cazare (2 camere) au venit „Cazare”, 20–23 decembrie, 3 adulți, 1 copil și rândul cu camerele.
- **Trimiterea fără telefon, email și acord:** „Mai sunt 3 câmpuri…”, focusul pe „Telefon”, datele rămân completate.
- **Trimiterea completă:** apare confirmarea, iar în panou se salvează cererea cu `checkIn` / `checkOut`, 3 adulți și 1 copil, mesajul cu camerele, acordul și momentul lui, „Email trimis: nu”.
- **Eveniment privat:** la 32 de invitați apare „Potrivit: Salon Vittoria (până la 40 de invitați)”; la 60, îndrumarea spre Grupul ANNA.
- **„Am o întrebare”:** rămâne doar grupul întrebării, iar eticheta devine „Întrebarea ta”.
- **Sesizarea:** goală dă „Mai sunt 6 câmpuri…”; completată se salvează cu motivul și data vizitei.
- **Fără erori:** 0 erori în consolă și 0 px derulare orizontală.
- **Pe producție:** trimiterea goală întoarce „Mai sunt 3 câmpuri de completat”, deci acțiunea de server merge. Nu am trimis cereri reale.

Două greșeli găsite la probă și reparate:
- focusul mergea pe sumar, nu pe primul câmp greșit, cum cere S-06b;
- salonul era preselectat înainte să scrii numărul de invitați.

### 3.4 Capturi

`design/f3/capturi/2026_11_24_Trattoria_F3_P9_*.webp`:
- producția: Contact pe Acasă, `/contact` cu Cazare, greșelile, sesizările (telefon și desktop);
- proba locală cu toate subiectele: greșelile, confirmarea, sesizarea, pagina pe desktop;
- fereastra ialoc deschisă de pe cardul serii.

## 4. Ce alegi tu

| # | Întrebare | Ce am făcut |
|---|---|---|
| G6-1 | Pornești subiectele Eveniment privat, Curs de pizza, Întrebare și Sesizare? Fiecare cere cel puțin un destinatar (#27) | Doar Cazare e pornit; celelalte rămân la telefon |
| G6-2 | Hartă încorporată (încărcată doar la clic) sau rămâne linkul „Vezi pe hartă”? | Link spre Google Maps; cu coordonatele (#22) duce exact la punct |
| G6-3 | Fotografia bonului la sesizări: o fac în F5, ca atașament la emailul către manager, fără s-o păstrez pe server? | Nefăcută acum |
| G6-4 | Telefonul recepției Hotel ANNA pentru „Dacă este urgent” la cazare? | Acum: telefonul de rezervări al restaurantului |

## 5. Pasul următor (după GO)

**Pasul 10 — paginile proprii rămase:** paginile legale (termeni, confidențialitate, cookies) din „Pagini legale”, cu textele provizorii etichetate până vin cele ale juristului (Q-25). `/catalog-vinuri` și paginile saloanelor sunt deja făcute. Apoi pasul 11 (emailurile Resend) e programat în F5 (D-36), iar pasul 12 (textele finale) și GATE 3 încheie faza.

Pagina HTML a raportului pașilor 8–9 (privată): https://claude.ai/artifact/RKZ6gD1ZHf82MPY2RZMDRY

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
