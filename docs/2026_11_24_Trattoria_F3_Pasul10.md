# F3 · pasul 10 · Paginile legale și redirecționările · Trattoria da Vittoria — raport (oprire înainte de pasul 12)

Data: 24.11.2026 · Stare: **gata, în așteptarea „GO” pentru pasul 12** · Decizie: D-53 · Commit-uri pe `main`: `1f7273e`, `25db085`, `e66a419`

## 1. Concluzie

Paginile legale sunt live, cu cuprins și titluri cu ancoră. Textele provizorii au devenit **ciorne factuale pentru jurist**. Redirecționările se pun din panou, iar o adresă inexistentă dă 404. Cu pasul ăsta, toate paginile proprii din pasul 10 sunt gata (`/catalog-vinuri` și saloanele erau deja făcute).

- https://anna-restaurante-alinlabau-9308s-projects.vercel.app/termeni
- https://anna-restaurante-alinlabau-9308s-projects.vercel.app/confidentialitate
- https://anna-restaurante-alinlabau-9308s-projects.vercel.app/cookies

| Țintă | Rezultat măsurat pe producție |
|---|---|
| Lighthouse mobil, performanță ≥ 85 | **`/confidentialitate` 99 / 97 / 98 · `/termeni` 99 / 99 / 99** |
| Lighthouse mobil, accesibilitate ≥ 95 | **100** la toate cele 6 rulări |
| Contrast ≥ 4,5:1, pe pagina afișată | **258 de rânduri, 0 sub prag**, cel mai slab 5,38:1 |
| Teste de integrare | **59/59** (6 noi) |
| Adrese | 3 pagini cu 200 · `/valori-nutritionale` 308 spre meniul digital · `/nu-exista` 404 · `/TERMENI` 308 spre `/termeni` |

**Important:** ciornele **nu sunt text juridic**. Descriu doar ce face site-ul azi. Ce decide juristul e marcat „[de completat]”, iar paginile rămân etichetate „Exemplu · de înlocuit” până le debifează cineva din panou.

## 2. Ce s-a construit

| Ce | Cum arată | Din panou |
|---|---|---|
| **Pagina legală** (content-model 5.12) | Coperta are titlul, „Actualizat la 24 noiembrie 2026” (data ultimei modificări) și eticheta „Exemplu”. Pe hârtie e textul, cu titluri și liste. | Pagini legale: titlu, adresă scurtă, conținut, Provizoriu, Activ, În footer |
| **Cuprinsul** | Apare de la 2 titluri în sus. Pe desktop stă lângă text și rămâne vizibil la derulare; pe telefon e deasupra textului. Fiecare titlu are o adresă proprie, de exemplu `/confidentialitate#servicii-terte` | Se face singur din titlurile textului |
| **Ciornele** | Termeni: 6 secțiuni. Confidențialitate: 6 secțiuni. Cookies: 4 secțiuni. Spun ce date se păstrează din formular, unde (Supabase în Irlanda, Vercel la Dublin), ce face ialoc, că harta Google se încarcă doar la clic și că site-ul public nu scrie cookies | Juristul le corectează direct în editor |
| **Redirecționările** (R5) | O adresă care nu e pagină legală se caută în Redirecționări. `/valori-nutritionale` → meniul digital (308). Dacă nu există nici acolo: 404 | Redirecționări: De la, Către, Permanent, Activ |
| **Descrierea pentru căutare** | Se face singură din titlu, restaurant și secțiuni, de cel mult 160 de caractere: „Politica de confidențialitate · Trattoria da Vittoria: cine răspunde de date, ce date primim…” | — |
| **O singură adresă pe pagină** | `/TERMENI` → `/termeni` (308) | — |

Ce mai trebuie completat în ciorne (8 locuri):

| Pagina | Ce lipsește |
|---|---|
| Termeni | firma care administrează restaurantul, CUI, sediul · confirmarea că prețul valabil e cel din restaurant · drepturile asupra textelor, fotografiilor și mărcilor |
| Confidențialitate | operatorul de date, CUI, sediul, adresa pentru date personale · cât timp se păstrează cererile · emailurile de confirmare (din F5) · drepturile vizitatorului și plângerea la ANSPDCP |
| Cookies | cum controlează vizitatorul cookies |

**Cum ajung ciornele pe producție:** seed-ul le pune o singură dată și doar peste textul provizoriu vechi. Un text scris deja din panou rămâne neatins (testat).

## 3. Cifrele

### 3.1 Lighthouse 13.6.0, mobil, pe producție (`25db085`)

| Pagina | Performanță | Accesibilitate | LCP | TBT | CLS |
|---|---|---|---|---|---|
| `/confidentialitate` | 99 / 97 / 98 | 100 | 1,0 s | 140–200 ms | 0 |
| `/termeni` | 99 / 99 / 99 | 100 | 0,9 s | 90–130 ms | 0 |

SEO 66: `noindex` pus intenționat pe adresa temporară (ADR-012). Prima măsurare a dat 58, pentru că lipsea descrierea paginii. Am adăugat-o și scorul a urcat la 66.

### 3.2 Contrast pe randare (`docs/f3/contrast-pasul-10-*.json`)

| Pagina | Telefon | Desktop | Cel mai slab |
|---|---|---|---|
| `/confidentialitate` | 67, 0 sub prag | 71, 0 | 5,38:1 („Cuprins”) |
| `/cookies` | 58, 0 | 62, 0 | 5,38:1 |

### 3.3 Probe

- **Local:** 6 titluri cu ancoră pe `/confidentialitate`, cuprins, liste, 0 erori în consolă, 0 px derulare orizontală pe telefon și desktop.
- **Pe producție:** `/admin`, `/galerie`, `/petreceri`, `/catalog-vinuri`, `/formular-de-reclamatie` merg ca înainte; ruta nouă nu le acoperă.
- **Teste noi** (`tests/int/f3-pasul-10.int.spec.ts`):
  - conversia textului în titluri și liste;
  - cuprinsul;
  - descrierea;
  - ciornele din seed;
  - proba „ca pe producție” (textul vechi devine ciornă, textul scris din panou rămâne);
  - pagină / redirecționare / nimic.

Am găsit și reparat două greșeli:
- **Titlurile ieșeau ca text „## …”:** în ciornă, titlul și paragraful erau pe rânduri vecine, iar conversia aștepta un rând gol între ele. Acum titlul ține doar primul rând. Producția nu a primit varianta greșită.
- **O eroare de lint în footer:** cu ruta nouă, Next trata și legătura spre sesizări ca adresă internă. Legăturile interne din footer folosesc acum `Link`.

### 3.4 Capturi

`design/f3/capturi/2026_11_24_Trattoria_F3_P10_*.webp`: cele trei pagini, cu primul ecran și pagina întreagă, pe telefon și desktop (12 fișiere).

## 4. Ce alegi tu

| # | Întrebare | Ce propun |
|---|---|---|
| G7-1 | Cine e juristul grupului și cum lucrează: corectează direct în panou sau trimite textul? (Q-25) | Îi trimiți linkurile de mai sus; corectează în panou (Pagini legale) și debifează „Provizoriu” la final |
| G7-2 | Adresele site-ului vechi davittoria.ro: le fac lista înainte de mutarea domeniului (D-36), ca vizitatorii și Google să nu dea de 404? | În F5 citesc harta site-ului vechi (cerere de rețea spre davittoria.ro, cu acordul tău) și propun redirecționările. **[PRESUPUNERE]** Adresele vechi cu mai multe segmente (`/categorie/pagina/`) cer atunci o regulă în plus |
| G7-3 | Cât timp păstrăm cererile și sesizările în panou? (intră în Confidențialitate) | Hotărăști tu cu juristul. În F5 pot face ștergerea automată după termenul ales |

## 5. Pasul următor (după GO)

- **Pasul 11** (emailurile Resend) e mutat în F5, odată cu domeniul (D-36).
- **Pasul 12:** textele finale în română, cu cârlige de marketing și un singur îndemn clar pe secțiune.
- **GATE 3** încheie faza: fiecare secțiune arătată pe telefon și desktop, plus Lighthouse.

Pagina HTML a raportului (privată): https://claude.ai/artifact/XnmA8Xk1JDqFD3jVvYXNRK

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
