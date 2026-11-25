# Checklist de lansare · Trattoria da Vittoria

25.11.2026 · PLAN F5.6 · Se bifează în ordine. Ce scrie **Alin** e o acțiune a lui; ce scrie **Claude** se face în sesiunea 2 a F5 (D-36, D-67: Resend și domeniul la final).

## A. Conținut (înainte de domeniu)

| # | Ce | Cine | Stare la 25.11.2026 |
|---|---|---|---|
| A1 | **0 elemente provizorii** (contorul din panou). Rămase: categoriile din Bucătărie (fără fotografii), saloanele, camerele, serile-exemplu, paginile legale | Alin | deschis |
| A2 | **Insigna Wine Spectator:** fișierul oficial, cu nivelul și anul corecte (D-20, D-68). Bifa „În datele pentru Google” e pusă (F5) | Alin | deschis (insigna actuală: Grand Award 2027, de confirmat) |
| A3 | **Textul juristului** pentru Termeni, Confidențialitate, Cookies: firma, CUI, operatorul de date, termenul de păstrare (D-59) | Alin | deschis |
| A4 | **Termenul de păstrare a cererilor:** Setări → Cereri și emailuri → „Păstrează cererile (luni)” și același termen în Confidențialitate (G7-3) | Alin | deschis |
| A5 | **Verificarea englezei** (F4-7) | Alin | deschis |
| A6 | **Fotografiile reale** pentru categoriile din Bucătărie, saloane, camere | Alin | deschis |
| A7 | **Clipul cursului de pizza cu sunet** (D-73) și **PDF-ul listei de vinuri** (D-69) | Alin | deschis |
| A8 | **Galeria de Crăciun** de pe Acasă înapoi la cea de dinainte, după sărbători (D-77) | Claude, la cererea lui Alin | programat |

## B. Tehnic (înainte de domeniu)

| # | Ce | Cine | Stare |
|---|---|---|---|
| B1 | **`CRON_SECRET`** în Vercel (Production, Sensitive, cel puțin 16 caractere): pornește ștergerea zilnică a cererilor vechi. Fără el, adresa răspunde 404 și nu se șterge nimic | Alin | deschis |
| B2 | **Curățenia importului (D-75):** `MEDIA_IMPORT_TOKEN` șters din Vercel (adresa răspunde apoi 404), secretul „Cod import galerie Trattoria” șters din mediul ANNA-Restaurante, folderul Drive pe „Restricted” | Alin | amânat la cererea lui Alin |
| B3 | **Resend:** domeniul de trimitere verificat în DNS, `RESEND_API_KEY`, `EMAIL_FROM`; emailurile pentru toate formularele (ADR-009); fotografia bonului la sesizări ca atașament (G6-3) | Alin (DNS, cheie) + Claude (cod) | sesiunea 2 |
| B4 | **Un email real primit** la `rezervari@hotelanna.ro` și la fiecare destinatar (D-51); planul gratuit Resend: 100 de emailuri pe zi, fiecare copie se numără | Claude + Alin | sesiunea 2 |

## C. Ziua lansării (domeniul)

| # | Ce | Cine |
|---|---|---|
| C1 | Domeniul `davittoria.ro` (și `www`) adăugat în proiectul Vercel; DNS mutat de pe vechiul hosting; `www` → `davittoria.ro` | Alin + Claude |
| C2 | Panou → Restaurante → Trattoria → „Adrese pe care se servește site-ul”: `davittoria.ro`, `www.davittoria.ro` | Claude |
| C3 | **`ALLOW_INDEXING=true`** în Vercel (Production), apoi republicare. Verificat: fără `noindex` pe domeniu, `robots.txt` cu `Allow` și `Sitemap`, adresa `*.vercel.app` rămâne neindexată | Alin + Claude |
| C4 | **Redirecționările** de pe adresele vechi, probate pe domeniu (16 adrese, `docs/f5/2026_11_25_Trattoria_Adrese_vechi.md`) | Claude |
| C5 | **ialoc pe domeniul final:** fereastra, rezervarea cu data serii; domeniul permis în configurarea widgetului (https://v2.ialoc.ro/widget-setup/4385), dacă ialoc o cere | Claude + Alin |
| C6 | **Lighthouse mobil pe domeniu:** `/`, `/en`, `/zh` (G11-3); ținte ≥ 85 / ≥ 95 | Claude |
| C7 | Toate formularele probate cap-coadă, cu emailul primit | Claude + Alin |
| C8 | **Google:** Rich Results Test pe `/` (Restaurant) și `/petreceri` (Event); Search Console cu domeniul și sitemap-ul `https://davittoria.ro/sitemap.xml`; Google Business Profile cu adresa site-ului | Alin + Claude |
| C9 | **Statistici:** site-ul vechi are eticheta Google `GT-NCLXCCBJ`. Site-ul nou nu pune cookies. Statisticile cu cookies cer banner de consimțământ (PLAN F5.4). De decis | Alin |
| C10 | Vechiul hosting oprit abia după ce DNS-ul s-a propagat și redirecționările merg | Alin |

## D. După lansare

- Prima săptămână: erorile din Vercel (runtime) verificate zilnic.
- R2 (D-33): efectele sezoniere, sunetul de fundal, 3D, comutatorul de temă.
- Etapa 2 (PLAN): al doilea restaurant în panou.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
