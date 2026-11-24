# F3 · pasul 8 · Galeria · Trattoria da Vittoria — raport (oprire înainte de pasul 9)

Data: 24.11.2026 · Stare: **gata, în așteptarea „GO” pentru pasul 9** · Decizie: D-49 · Commit-uri pe `main`: `a07c133` (galeria), `d71d314` (corectură de tip în test), `f30bb67`, `ce81552`, `641cb8a` (descrierea paginii, prioritatea primei fotografii)

## 1. Concluzie

Galeria e live, pe Acasă și pe pagina ei: https://anna-restaurante-alinlabau-9308s-projects.vercel.app/galerie

| Țintă | Rezultat măsurat |
|---|---|
| Lighthouse mobil, performanță ≥ 85 | **Acasă: 85 / 92 / 93 (mediana 92).** `/galerie`: **mediana 86 pe 12 rulări**, dar 3 rulări sub prag (81, 83, 84) |
| Lighthouse mobil, accesibilitate ≥ 95 | **100** la toate cele 15 rulări |
| Contrast ≥ 4,5:1, pe pagina afișată | **532 de rânduri, 0 sub prag**, minimum 5,38:1 |
| Teste de integrare | **43/43** (4 noi) |
| Derulare orizontală (390 și 1440 px), erori în consolă | **0 px, 0 erori** |

## 2. Ce s-a construit

| Ce | Cum arată | Din panou |
|---|---|---|
| **Galeria pe Acasă** (4.10) | Titlul „Trattoria, în imagini.”, fotografiile bifate „Pe Acasă” (cel mult 8), „Vezi galeria”. Prima fotografie e mare, celelalte o încadrează. Așezarea depinde doar de număr (1–8) și umple mereu rândurile întregi, pe telefon și pe desktop | Galerie → „Pe Acasă”; ordinea din listă |
| **`/galerie`** (S-05, F-30) | Toate fotografiile și clipurile active, într-un mozaic după proporțiile fiecăreia: late, înalte sau pătrate. Filtrele pe categorie apar doar pentru categoriile care au elemente (acum: Restaurant, Preparate, Vinuri) | Galerie; Categorii de galerie |
| **Fotografia mare și clipul la click** (F-31) | Fereastra se deschide peste pagină, pe fundalul copertei. Are săgețile ‹ ›, glisare pe telefon, tastele ← →, Esc, legenda · categoria și numărul „2 din 5”. La închidere, focusul revine pe fotografia văzută ultima. Clipurile se redau cu controale, din varianta eficientă (AV1/HEVC/VP9) sau H.264 | Legendă |
| O fotografie apăsată pe Acasă | Se deschide direct mare, pe `/galerie` (`/galerie#g-…`) | — |
| Fără JavaScript | Fotografiile rămân linkuri spre fișierul mare; filtrele merg (CSS) | — |

**Conținut de pornire:** 5 elemente din fotografiile provizorii deja folosite pe site (Wikimedia Commons, cu credit), marcate „Exemplu · de înlocuit”. Creditele lor apar în footer.

## 3. Cifrele

### 3.1 Lighthouse 13.6.0, mobil, pe producție

| Pagina | Rulări | Performanță | Accesibilitate | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| Acasă (`d71d314`) | 3 | 85 / 92 / 93 | 100 | 3,1–3,3 s | 90–330 ms | 0 |
| `/galerie`, prima versiune | 3 | 86 / 87 / 91 | 100 | 3,3–3,7 s | 150–220 ms | 0 |
| `/galerie`, cu prioritate pe 2 fotografii | 3 | 86 / 86 / 84 | 100 | 3,2–3,7 s | 250–300 ms | 0 |
| `/galerie`, prioritate doar pe prima | 3 | 81 / 87 / 89 | 100 | 3,3–3,9 s | 200–310 ms | 0 |
| `/galerie`, plus preîncărcarea | 3 | 83 / 87 / 86 | 100 | 3,5–3,8 s | 180–320 ms | 0 |

**Pe scurt:** pe `/galerie`, elementul LCP e prima fotografie din mozaic (fotografia demo cu cuptorul, 960 px pe telefon). Încercările de a o grăbi nu au schimbat mult. Indicația de preîncărcare ajunge la browser după ce antetul paginii a plecat deja. Media rulărilor rămâne în jur de 86, cu variații de ±4 de la o rulare la alta. **Riscul:** o rulare poate ieși sub 85. Vreau să revin la asta când vin fotografiile reale: atunci măsor din nou și, dacă e nevoie, micșorez prima imagine pe telefon.

SEO e 66, din cauza `noindex` (ADR-012). Prima versiune a paginii `/galerie` avea 58, pentru că lipsea descrierea; acum descrierea se compune din galerie.

### 3.2 Contrast pe randare (`docs/f3/contrast-pasul-8-*.json`)

| Pagina | Telefon | Desktop | Cel mai slab |
|---|---|---|---|
| Acasă | 204, 0 sub prag | 232, 0 | 5,38:1 |
| `/galerie` | 46, 0 | 50, 0 | 8,53:1 |

### 3.3 Verificări (Playwright)

- **Deschiderea de pe Acasă:** fotografia apăsată se deschide mare pe `/galerie` („2 din 5”).
- **Navigarea în fereastră:** tasta → trece la „3 din 5”, iar adresa devine `#g-3`.
- **Închiderea:** Esc închide fereastra, focusul revine pe ultima fotografie văzută, iar adresa se curăță.
- **Filtrul:** „Preparate” arată 3 din 5 fotografii.
- **Fără erori:** 0 erori în consolă și 0 px derulare orizontală, la 390 și la 1440 px.
- **Două greșeli găsite pe capturi și reparate:**
  - fereastra nu încăpea în ecran pe desktop (rândul grilei creștea după fotografie);
  - pe Acasă, cu 5 fotografii, rămânea o jumătate de rând goală (de aici așezarea fixă).

### 3.4 Capturi

`design/f3/capturi/2026_11_24_Trattoria_F3_P8_galerie-{acasa,pagina,filtru,fotografie}-{telefon,desktop}.webp`

## 4. Ce lipsește (`docs/materiale-necesare.md`)

| # | Ce | Pe site acum |
|---|---|---|
| 14 | Fotografiile galeriei pe categorii (Restaurant, Preparate, Vinuri, Petreceri, Hotel, Evenimente), min. 1600 px pe latura lungă; pe Acasă 6–8, prima e mare | 5 exemple |

## 5. Pasul următor (după GO)

**Pasul 9:** pagina Contact, cu datele, harta și formularul cu subiect. Formularul primește datele din bara de cazare și de la butoanele „Rezervă salonul”, „Înscrie copilul” și „Cere ofertă de cazare”. Tot la pasul 9: pagina de sesizări și proba ialoc cu data serii (G4-1, cu testul de rețea spre ialoc aprobat). Emailurile prin Resend rămân pentru F5 (D-36).

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
