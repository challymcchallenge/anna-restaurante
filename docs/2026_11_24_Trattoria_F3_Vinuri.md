# F3 · Lista de vinuri și logo-ul Grupului ANNA · Trattoria da Vittoria — raport

Data: 24.11.2026 · Stare: **gata; urmează F3 pasul 7** · Decizii: D-46 (lista de vinuri, logo-ul), D-47 (răspunsurile G4) · Commit-uri pe `main`: `6b0abdf` (lista, paginile, logo-ul), `8838390` (descrierea paginii, contrastul pe foaie)

## 1. Concluzie

Am făcut cele trei modificări cerute. Sunt live pe adresa temporară: https://anna-restaurante-alinlabau-9308s-projects.vercel.app

1. **Logo-ul Grupului ANNA** (cel orizontal, trimis de tine) apare în footer și deasupra titlului „Lista de vinuri”, pe Acasă și pe pagina de vinuri.
2. **Lista de pe Acasă are formatul din poza închisă**, cu filtre: Toate, Spumant, Alb, Rosé, Roșu.
3. **Toată lista ta (155 de rânduri) e în panou.** Pe Acasă sunt 5 vinuri din fiecare tip. „Vezi lista de vinuri” deschide `/catalog-vinuri`, în formatul deschis la culoare, cu toate vinurile.

| Țintă | Rezultat măsurat |
|---|---|
| Lighthouse mobil, performanță ≥ 85 | **Acasă 90 / 89 / 90** (înainte: 91 / 87 / 91). **Lista de vinuri: mediană 96** (5 rulări, 90–99) |
| Lighthouse mobil, accesibilitate ≥ 95 | **100** la toate cele 8 rulări |
| Contrast ≥ 4,5:1, pe pagina afișată | **2.120 de rânduri, 0 sub prag**, minimum 5,38:1 |
| Teste de integrare | **35/35** (5 noi) |

## 2. Ce s-a construit

| Ce | Cum arată | Din panou |
|---|---|---|
| Logo-ul grupului | Varianta albă pe fundal închis (footer, Acasă, coperta paginii de vinuri). Varianta neagră pe hârtie, la finalul listei de vinuri | Setări restaurant → Logo grup / Logo grup pe fundal închis (câmp nou) |
| **Vinuri pe Acasă** (poza 6) | Logo, „Lista de vinuri”, insigna premiului, filtrele. Grupe pe tip, cu titlu auriu. Rândul are numele și prețul auriu, iar dedesubt denumirea · anul sau NV · volumul. Pe desktop sunt 2 coloane | Vinuri → bifa „Recomandat” (cel mult 5 din fiecare tip) |
| **`/catalog-vinuri`** (poza 7) | Toate vinurile disponibile, pe tip, apoi țară · regiune („Franța · Champagne”). Rândul are **producătorul** îngroșat, vinul, anul și prețul, iar dedesubt denumirea și soiurile. Lista începe cu „Vinuri la pahar”. Are filtre pe tip, căutare („barolo”, „recas”, fără diacritice) și un mesaj când nu găsește nimic | Vinuri: ordinea din panou; „Disponibil” oprit = vinul dispare |
| Filtrele | Funcționează și fără JavaScript, cu tastatura (săgețile) și cu cititorul de ecran | — |

**De ce nu e italic rândul al doilea:** fonturile temei nu au variantă italică. Un italic simulat de browser arată strâmb. Rândul al doilea e mai mic și mai deschis la culoare.

**De ce pagina de vinuri are copertă închisă:** antetul site-ului stă peste o copertă, la fel ca pe celelalte pagini. Lista propriu-zisă e pe hârtie, ca în poza 7.

## 3. Lista de vinuri

**Ce am importat:** 155 de rânduri = **153 de vinuri**. Cele 2 rânduri „la pahar” (Sole Chardonnay Barrique și Sole Rosé 2025, 23 lei) au devenit prețul la pahar al aceleiași sticle. Cele 5 vinuri-exemplu au fost șterse; vinurile adăugate de mână în panou nu se ating.

| Tip | Vinuri | Pe Acasă |
|---|---|---|
| Spumant (cu Champagne) | 22 | 5 |
| Alb | 50 | 5 |
| Rosé | 20 | 5 |
| Roșu | 59 | 5 |
| Desert | 2 | — |

**Cele 20 de pe Acasă** (alegerea mea, de confirmat la G5-1):

- **Spumant:** Dom Pérignon Vintage Brut 2012 (2.000), Dom Pérignon Vintage Rosé 2009 (3.100), Ruinart Blanc de Blancs Brut (950), Veuve Clicquot Yellow Label Brut (600), Bellavista Pas Operé 2015 (430)
- **Alb:** De Ladoucette Baron de L Pouilly-Fumé 2023 (800), Jermann Vintage Tunina 2022 (530), Le Domaine d'Henri Chablis Premier Cru Troesmes 2021 (250), Cramele Recaș La Stejari Chardonnay 2020 (330), Château Purcari Alb de Purcari 2020 (200)
- **Rosé:** Domaines Ott Clos Mireille 2020 (310), G.D. Vajra Rosabella 2025 (140), Recaș Solo Quinta Rosé 2025 (170), Catleya Perfect Simplu Rosé magnum 2024 (180), Château Purcari Rosé 2025 (110)
- **Roșu:** Opus One 2018 (2.900), Château Pape Clément Pessac-Léognan 2012 (850), Val di Suga Brunello di Montalcino 2016 (350), G.D. Vajra Barolo Albe 2017 (320), Davino Flamboyant 2020 (400)

**Ce am dedus [PRESUPUNERE]:**

- **Tipul vinului.** PDF-ul nu are coloană de culoare; l-am dedus din nume și din notele PDF-ului.
- **Regiunea geografică.** E dedusă din denumirea de origine. De exemplu, „D.O.C.G. Barolo” înseamnă Piemont, iar „D.O.C. – C.M.D. Recaș” înseamnă Banat.
- **Soiurile, la 19 vinuri.** Unele le-ai dat tu în poza 7 (Dom Pérignon, Moët, Ruinart, Veuve Clicquot, Barolo, Brunello, Opus One). Altele sunt impuse de denumire (Chablis, Pouilly-Fumé, Moscato d'Asti, Primitivo di Manduria, Dolcetto, Barbera, Greco di Tufo, Picpoul de Pinet). La celelalte vinuri se vede doar denumirea de origine.
- **Pinot Grigio Friuli, Piera Martellozzo, „2026”.** Anul e imposibil în noiembrie 2026, așa că vinul e **ascuns** (Disponibil = nu) până confirmi anul.

**Rândurile „De verificat pe etichetă” (33) și „Decizie de stoc / preț” (11)** sunt pe site. În panou, coloana „Cod extern” arată rândul din inventar (de exemplu `inventar-194` = Dom Pérignon Lady Gaga).

## 4. Cifrele

### 4.1 Lighthouse 13.6.0, mobil, pe producție

| Pagina | Rulări | Performanță | Accesibilitate | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| Acasă (`6b0abdf`) | 3 | 90 / 89 / 90 | 100 | 3,0–3,3 s | 160–240 ms | 0 |
| Lista de vinuri (`6b0abdf`) | 3 | 95 / 96 / 99 | 100 | 0,9–1,0 s | 130–250 ms | 0 |
| Lista de vinuri (`8838390`) | 2 | 90 / 97 | 100 | 0,9–1,1 s | 200–400 ms | 0 |

SEO e 66 peste tot, din cauza `noindex`, pus intenționat pe adresa temporară (ADR-012). La prima versiune a paginii de vinuri, SEO era 58, pentru că lipsea descrierea paginii. Acum descrierea se compune din listă: „Lista de vinuri Trattoria da Vittoria: 152 de vinuri din Franța, Italia, S.U.A., Austria, Republica Moldova și România…”. Dacă scrii un text introductiv în panou, acela îl înlocuiește.

Lista completă are 1.689 de elemente în pagină (Acasă: 829). Performanța rămâne peste 90, pentru că pagina nu încarcă fotografii.

### 4.2 Contrast pe randare (`docs/f3/contrast-vinuri-*.json`)

| Pagina | Telefon | Desktop | Cel mai slab |
|---|---|---|---|
| Acasă | 174 rânduri, 0 sub prag | 202, 0 | 5,38:1 (aceleași etichete folio pe hârtie de la pașii 4–6) |
| Lista de vinuri | 870, 0 | 874, 0 | 5,38:1 telefon, 5,66:1 desktop |

Pe desktop, foaia e mai deschisă decât hârtia paginii. La prima măsurare, rândul al doilea ieșea la 4,64:1: peste prag, dar cu marjă mică. L-am închis la culoare și acum e la 5,66:1.

### 4.3 Alte verificări

- **Detectorul Impeccable** nu găsește nimic pe pagina publicată, în afara excepției aprobate pentru hârtia direcției B (D-41).
- **Filtrele și căutarea (Playwright):**
  - „Rosé” lasă doar grupa Rosé;
  - „barolo” găsește cele 2 Barolo Albe;
  - „amarone” cu filtrul „Alb” afișează „Niciun vin nu se potrivește cu „amarone”” și butonul „Vezi toate vinurile”.
- **Importul pe producție:** 153 de vinuri adăugate, 5 exemple șterse, 2 logo-uri încărcate, 3 schimbări (titlul secțiunii, eticheta „Exemplu” de pe secțiune, logo-ul grupului). A doua rulare nu mai face nimic.
- **Teste:** 35/35. Cele noi verifică:
  - lista importată;
  - că un vin pus de Administrator nu se șterge și nu se dublează;
  - că un titlu schimbat de Administrator nu e suprascris;
  - formatarea (NV, 1.500 ml, 2.000);
  - gruparea și căutarea fără diacritice.

### 4.4 Capturi

`design/f3/capturi/2026_11_24_Trattoria_F3_Vinuri_*.webp`:
- Acasă: toate vinurile și filtrul „Spumant”, pe telefon și desktop;
- footerul cu logo-ul;
- `/catalog-vinuri`: primul ecran, spumantele, căutarea și mesajul „niciun rezultat”.

## 5. Ce alegi tu

| # | Întrebare | Ce am făcut |
|---|---|---|
| G5-1 | Confirmi cele 20 de vinuri de pe Acasă? | Lista de mai sus; le schimbi din Vinuri → „Recomandat” |
| G5-2 | Vrei soiurile și la celelalte vinuri, după fișele producătorilor? | Doar la 19 vinuri |
| G5-3 | Culoarea a 4 vinuri: Vlădoi Brizza și Recaș Muse Day = alb; Belle Mare Le Rivage = rosé; Segarcea Demidulce = desert. Corect? | Așa sunt acum |
| G5-4 | Verifici rândurile „de verificat” și „decizie” și oprești „Disponibil” la ce nu mai vinzi? | Toate sunt vizibile, cu excepția Pinot Grigio „2026” |

**G4-1 … G4-3** sunt rezolvate („OK to all”, D-47). Proba ialoc cu data serii o fac la pasul 9.

## 6. Pașii următori

Continui F3:

- **pasul 7:** Cazare Hotel ANNA;
- **pasul 8:** galeria;
- **pasul 9:** Contact, sesizări și proba ialoc cu data serii (G4-1).

Mă opresc la următoarea oprire pentru „GO”. Fotografiile rămân demo până le trimiți.

Pagina HTML a raportului (privată): https://claude.ai/artifact/VwanYgGYeVZUConPLHfdGT

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
