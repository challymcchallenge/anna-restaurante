# GATE 4 · Traducerile

Trattoria da Vittoria · 25.11.2026 · Decizii în F4: D-64, D-65, D-66 · Stare: **oprire la GATE 4, aștept „GO” pentru F5**

## Concluzia

- **Site-ul e live în 7 limbi**: română la rădăcină și `/en`, `/it`, `/fr`, `/de`, `/zh`, `/sv`. Conținutul e tradus automat în toate cele 6 limbi, cu starea „tradus automat”; Alin verifică engleza.
- **Fotografiile demo și nota „Fotografii provizorii” din footer sunt scoase** (D-66). Galeria nu apare până se încarcă fotografii reale.
- **Lighthouse mobil, pe producție** (mediana rulărilor):

| Pagina | Rulări | Mediana performanță | Accesibilitate | CLS | Ținta |
|---|---|---|---|---|---|
| `/` (română) | 79, 87, 88, 86, 84, 84, 87 | **86** | 100 | 0 | atinsă |
| `/en` | 87, 90, 90, 86, 89 | **89** | 100 | 0 | atinsă |
| `/zh` | 81, 79, 87, 86, 83, 79 | **82** | 100 | 0 | **sub 85** (vezi mai jos) |

Best practices 100 peste tot. SEO 69 e intenționat (`noindex` pe adresa temporară, ADR-012). `prefers-reduced-motion` probat pe `/en` (Playwright, 25.11.2026): cu „reduce” se descarcă 7 imagini în loc de 11 (cadrele 2–5 ale copertei nu se mai încarcă, D-60) și nu rulează nicio animație; F4 n-a adăugat mișcare.

- **Teste: 105/105.** Lint: 0 erori.

## `/zh` sub 85: ce am măsurat

Pe `/zh`, „Style & Layout” durează 650–800 ms, față de ~410 ms pe `/en`. Scriptul e același. Am probat două remedii pe un build local:

| Probă | „Style & Layout” pe `/zh` | Rezultat |
|---|---|---|
| A · cum e acum | 621–691 ms | referința |
| B · fără niciun font web pe `/zh` (doar fontul sistemului) | 604–674 ms | −3%: fonturile nu sunt cauza; renunțat, ca literele latine să rămână în fonturile temei |
| C · secțiunile de sub primul ecran randate abia la derulare | 688–706 ms | fără efect; renunțat |

Cauza e așezarea textului chinezesc pe dispozitivul emulat de Lighthouse. Local, cu același cod, `/zh` are 88–96. Propunerea mea: accept abaterea pentru `/zh` și re-măsor în F5, pe domeniul final.

## Ce s-a schimbat după „Gata”

| Ce | Detalii |
|---|---|
| D-66 | Seed-ul a șters o singură dată cele 6 fotografii Wikimedia și cele 5 elemente demo ale galeriei. Pe producție: 0 fișiere Wikimedia, 0 elemente în galerie, nicio notă de credit, `/galerie` 404 |
| Completarea traducerilor | După prima rulare au rămas ~20 de bucăți în română (din circa 1.400). Am reparat trei cauze: (1) traducerile peste limita câmpului: acum se scurtează în două trepte, la 85% și la 70% din limită; (2) salvările simultane pe același document în mai multe limbi se suprascriau (Pagina Acasă): acum se salvează pe rând; (3) rezultatele întoarse netraduse: acum se reiau pe bucăți mici. Completarea a rulat o singură dată la build: 0,0236 + 0,0212 USD + a treia trecere (sub 0,03 USD, neverificat) |
| Etichete rămase în română | Tipurile de vin din filtre, motivele de sesizare și subiectele formularului de contact apar acum în limba paginii |

## Întrebări pentru GATE 4

| # | Întrebare | Propunerea mea |
|---|---|---|
| G11-1 | **Pagina de cookies** de pe producție vorbește despre **rivieraevents.ro** și cheile „riviera-tema” și „riviera-limba”: pare textul site-ului Riviera Events. Tabelul („Ce · Unde · De ce · Cât timp”) e lipit ca paragrafe, iar 4–10 rânduri din el rămân netraduse în chineză și suedeză | O rescriu pentru Trattoria, pornind de la ciorna din D-53: site-ul public nu folosește cookies, iar harta se încarcă doar la clic. Rămâne „Provizoriu” până o aprobă juristul |
| G11-2 | **Categoriile noi din Bucătărie** au nume românești (Vită, Berbecuț, Preparate …). Numele categoriilor sunt „nu se traduce” (content-model 9, gândit pentru nume italienești), deci apar în română în toate limbile | Fac numele traductibil (o migrație mică). Numele italienești (Antipasti, Pizza …) rămân la fel, protejate automat |
| G11-3 | `/zh` are mediana 82 (ținta 85) | Accept abaterea și re-măsor în F5 pe domeniul final |
| GATE 4 | **GO pentru F5?** | F5: emailurile prin Resend, auditul de finisare, datele structurate, sitemap-ul pe limbi, redirecționările de pe adresele vechi, ghidul pentru editor, checklist-ul de lansare |

## Ce face Alin

1. Răspunde la G11-1 … G11-3 și dă GO pentru F5.
2. Verifică engleza (F4-7): orice corectură salvată în panou, cu „Limba conținutului: English”, marchează documentul „Verificat de om”.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
