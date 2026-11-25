# F5 · sesiunea 1: verificare și pregătirea lansării

Trattoria da Vittoria · 25.11.2026 · Decizia: D-78 · Planul: `docs/2026_11_25_Trattoria_F5_Plan.md` · Stare: **sesiunea 1 gata, pe producție; urmează sesiunea 2 (Resend, domeniul, GATE 5)** · Pagina HTML (privată): https://claude.ai/artifact/WPqR2GLALuLnmtKHexFkhZ

## Concluzia

- **Tot ce nu depinde de domeniu și de Resend e gata și publicat** (ordinea cerută în D-67).
- **Navigarea prin linkuri pe producție: 2.288 de clicuri în 7 limbi, 0 greșite.** Pe telefon, saltul din meniu spre secțiunile de jos ale paginii Acasă era greșit în 17 din 32 de cazuri; reparat, 30/30.
- **Auditul de finisare: 16 → 18/20.** O problemă de accesibilitate reală, reparată: titlul copertei pe telefoanele scurte (iPhone SE: 2,23 → 3,26:1).
- **Lighthouse mobil pe producție (mediane):** Acasă 89, `/en` 89, `/zh` 80 (abaterea acceptată în G11-3); accesibilitate 100, CLS 0.
- **Teste: 155/155** (33 de fișiere). `tsc` și lint: 0 erori.
- **G14 rezolvate (D-79):** 12 luni pentru cereri; **Google Analytics cu banner de cookies** (`GT-NCLXCCBJ`, doar după „Accept”, doar pe domeniu). Acasă cu bannerul: mediana 86 (ținta 85 atinsă). **Deschis: G15-1** (textele legale Riviera Events pe Trattoria).
- **De la Alin:** G15-1 rezolvat (D-80); `CRON_SECRET` pus (verificat 401, 25.11.2026).

## Ce s-a făcut

| # | Ce | Rezultat pe producție |
|---|---|---|
| 1 | **Date structurate** (Google) | Acasă: Restaurant (adresă, program, meniu, rezervări, 4 rețele, premiul „Wine Spectator Restaurant Award, GRAND AWARD 2027”) și WebSite (7 limbi). `/petreceri`: 4 seri ca Event (Electric VIOLIN, Romantic JAZZ, Romanian FOLK, Romantic ROCK) |
| 2 | **Open Graph pe fiecare pagină** | Înainte: toate paginile aveau titlul de pe Acasă și nicio imagine. Acum: titlul, adresa și imaginea paginii (de exemplu `/galerie` → prima fotografie din galerie, `/petreceri` → afișul serii) |
| 3 | **Sitemap pe limbi** | `/sitemap.xml`: 77 de adrese (11 pagini × 7 limbi), cu `hreflang` și `x-default`. robots.txt îl anunță abia după lansare |
| 4 | **Adresele vechi** (G7-2) | Harta davittoria.ro: 16 adrese. 3 rămân pagini, 13 se redirecționează (12 noi). Probate pe adresa Vercel: toate ajung la ținta corectă |
| 5 | **Ștergerea cererilor vechi** (G7-3) | Termenul în panou; rulare zilnică prin Vercel Cron. Pornită: termenul de 12 luni pus, `CRON_SECRET` pus de Alin (adresa răspunde 401 fără cod) |
| 6 | **Auditul de finisare** (Impeccable) | `docs/f5/2026_11_25_Trattoria_Audit_F5.md`: 3 reparații, 0 depășiri la 360–1920 px, focus vizibil, 0 cookies |
| 7 | **Ghidul editorului** | `docs/2026_11_25_Trattoria_Ghid_Editor.md` |
| 8 | **Checklist-ul de lansare** | `docs/2026_11_25_Trattoria_Checklist_Lansare.md` (A: conținut, B: tehnic, C: ziua lansării) |

## Lighthouse mobil (producție, 5 rulări pe pagină)

| Pagina | Rulări (performanță) | Mediana | Accesibilitate | CLS | TBT (ms) | Ținta 85 |
|---|---|---|---|---|---|---|
| `/` (română) | 89, 87, 93, 89, 92 | **89** | 100 | 0 | 183–372 | atinsă |
| `/en` | 93, 89, 89, 90, 88 | **89** | 100 | 0 | 198–336 | atinsă |
| `/zh` | 81, 81, 80, 80, 77 | **80** | 100 | 0 | 534–645 | sub țintă: abaterea acceptată în G11-3 (GATE 4: 82); se re-măsoară pe domeniul final, în sesiunea 2 |

**De știut:** o primă serie (Acasă 86, `/en` 79, `/zh` 76) a rulat în paralel cu suita de teste pe aceeași mașină; TBT-ul a urcat la 340–950 ms din cauza procesorului ocupat. Am aruncat-o și am repetat cu mașina liberă (cifrele de mai sus). Schimbările din F5 adaugă puțin pe pagină: datele structurate (câțiva KB în HTML) și ~30 de linii de JavaScript în antet.

## Contradicții semnalate

- **PLAN F5.5–F5.6** numește fișierele `docs/ghid-editor.md` și `docs/launch-checklist.md`; `CLAUDE.md` cere `YYYY_MM_DD_Trattoria_Titlu`. Am urmat regula din `CLAUDE.md` și am actualizat PLAN.
- **Coperta pe telefon (D-70):** cu cadrele din D-77, titlul cădea sub 3:1 pe ecranele scurte. Am păstrat aspectul cerut de Alin de la 390 px în sus și am întărit umbra doar unde contrastul cădea sub prag.

## Întrebări (G14, rezolvate prin D-79)

| # | Întrebare | Propunerea mea |
|---|---|---|
| G14-1 | Cât timp păstrăm cererile primite? | 12 luni [PRESUPUNERE], de confirmat cu juristul; apoi termenul în panou și `CRON_SECRET` în Vercel |
| G14-2 | Paginile vechi fără echivalent (`/la-multi-ani`, `/1hm`, `/test`, `/3d-flip-book/test`) | Rămân redirecționate la Acasă |
| G14-3 | Statistici după lansare | Decizie la lansare: (a) fără, (b) Vercel Web Analytics (neverificat dacă pune cookies), (c) Google Analytics cu banner |
| G14-4 | Nivel de preț pentru Google | Opțional, din panou |
| G14-5 | Domeniul de trimitere pentru emailuri și ziua mutării DNS | `davittoria.ro`, cu o adresă de trimitere de tipul `rezervari@davittoria.ro` |

## Ce face Alin

1. Răspunde la G14-1 … G14-5.
2. Pune `CRON_SECRET` în Vercel: https://vercel.com/alinlabau-9308s-projects/anna-restaurante/settings/environment-variables (Production, Sensitive, cel puțin 16 caractere).
3. Trimite ghidul editorului Social Media Managerului: pagina https://claude.ai/artifact/45BL6VdJMtaUea1bxX3Ujp (privată: o partajezi din meniul Share) sau `docs/2026_11_25_Trattoria_Ghid_Editor.md`.
4. Continuă checklist-ul de lansare, secțiunea A (conținut).

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
