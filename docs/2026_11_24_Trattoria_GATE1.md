# GATE 1 · Trattoria da Vittoria — raport faza 1 (panou și model de conținut)

Data: 24.11.2026 · Stare: **GO primit de la Alin (24.11.2026). Deciziile: D-37 (Editorul vede cererile de curs de pizza și întrebările), D-38 (restul presupunerilor acceptate), D-39 (motivele de sesizare preluate de pe site-ul actual).** F1 închis · Commit-uri: `8ec6208`, `5813e37`, `31d15d9`, `8ff6f54` pe `main` · Deploy de producție: READY (`dpl_7LMPWGNXnPa6s1H5zWgqfQ51s4Yd`, 80 s cu migrații și conținut de pornire)

Panoul: https://anna-restaurante-alinlabau-9308s-projects.vercel.app/admin

## 1. Concluzie

F1 este gata de proba ta. Panoul e în română și are 20 de colecții, cu 41 de câmpuri pe limbi (7 limbi, `ro` implicit). Încărcarea media convertește în browser și generează pe server 10 variante AVIF/WebP. Restaurantul Trattoria are conținut de pornire: 52 de elemente marcate „Exemplu · de înlocuit” și contorul lor în Tabloul de bord. Testele automate trec: 14 de integrare și 7 în browser, inclusiv cele 3 condiții ale GATE 1. Pe producție, RLS e pornit pe 57/57 tabele.

## 2. Ce s-a construit (PLAN F1, pașii 1–6)

| Pas | Rezultat | Fișiere |
|---|---|---|
| 1. Colecții și setări din content-model | 20 de colecții: Pagina Acasă (11 secțiuni + footer), Seri tematice, Categorii de preparate, Vinuri, Recenzii, Saloane, Tipuri de camere, Galerie + categorii, FAQ, Motive de sesizare, Linkuri grup, Pagini legale, Bibliotecă media, Cereri primite, Setări restaurant, Premii, Redirecționări, Restaurante, Utilizatori. **41 de câmpuri „se traduce”** (pe limbi), 30 marcate „nu se traduce”. Limitele de caractere cu contor sub câmp | `src/collections/`, `src/fields/index.ts` |
| 2. Roluri și comutator de restaurant | Editorul nu vede în meniu și nu poate deschide: Premii, Setări, Redirecționări, Cereri primite, Utilizatori, Restaurante (panou: „Nimic găsit”; API: 403). Comutatorul „Restaurant” vine din pluginul oficial; restaurantele au acum ordine manuală (Trattoria prima) | `src/access/roles.ts`, `src/payload.config.ts` |
| 3. Biblioteca media | Butonul „Alege și convertește” (S-14…S-14e): fotografie → master JPEG ≤ 2560 px; HEIC prin heic-to; logo PNG/SVG fără JPEG; BADGE neatins; clip → H.264 + AV1/HEVC + poster, ≤ 30 s, acceptat și după extensie (.mov). Pe server: 10 variante (AVIF q55 e2 + WebP q78 e4 × 640/960/1280/1920/2560). Fișierele se servesc din URL-ul public Supabase. Garda de pe server refuză originalele neconvertite. Text alternativ obligatoriu; punct focal | `src/collections/Media.ts`, `src/components/admin/media/` |
| 4. Module | Toate modulele din plan. Cursurile de pizza sunt secțiunea 4.8 din Pagina Acasă, cu textul complet al paginii, cum cere content-model | `src/collections/` |
| 5. Conținut provizoriu + contor | Tabloul de bord: „Conținut provizoriu rămas”, cu legături filtrate pe colecții, seri apropiate și ce lipsește din Setări. Conținutul de pornire stă în `seed/trattoria-da-vittoria.json` (date, nu cod) și s-a aplicat o singură dată | `src/components/admin/Dashboard.tsx`, `src/seed/starter.ts`, `scripts/seed-starter.ts` |
| 6. Materiale lipsă | 30 de puncte, cu format, loc în panou și termen | `docs/materiale-necesare.md` |

## 3. Cifre măsurate

| Ce | Rezultat | Unde |
|---|---|---|
| Teste de integrare (Local API) | **14/14** în 2,3 s | `tests/int/f1-access.int.spec.ts` |
| Teste în browser (Playwright) | **7/7** în 12 s, pe build de producție local | `tests/e2e/` |
| Fotografie 5184 × 3456, 13,43 MB → master | **2560 × 1707, 1,50 MB, în 0,5 s** (Chromium în container, fără GPU) | test `admin-media` |
| Variante pe server (aceeași fotografie, zgomot sintetic) | 10 din 10; AVIF 7–498 KB, WebP 9–801 KB; salvare 3,5 s local. Pe Vercel, F0 a măsurat 9,4 s per fotografie | `api/media` |
| Clip 8 s, 1080 × 1920, .mov 12,1 MB | H.264 **3,22 MB** + AV1 5,62 MB + poster 97 KB, în **8,3 s** | test `clip-8s` |
| Clip de 32 s | **respins** imediat: „Clipul are 32,0 s; limita este 30 s (D-24)” | captură `f1-admin-clip-rejected.png` |
| Build local / Vercel | 29 s / 80 s (migrații 1,1 s, conținut de pornire ~28 s, Next.js ~37 s) | jurnalul Vercel |
| Pagini din panou (build local) | 720–906 ms | Tablou de bord, Setări, Acasă, Seri, Media nouă |
| Producție, acces anonim | Premii 403, Setări 403, Cereri 403; Seri/Vinuri/Acasă 200 (doar elementele active) | `curl` |
| Neindexare | `X-Robots-Tag: noindex, nofollow` | producție |
| Supabase | **RLS 57/57 tabele**; advisors: 0 WARN/ERROR, 57 INFO „RLS fără politici” (intenționat) | `get_advisors` |
| Fișierul media din F0 | Textul alternativ păstrat la mutarea pe limbi; URL public Supabase 200 (311.164 octeți) | producție |

**Atenție, AV1:** pe clipul de test sintetic, AV1 a ieșit mai mare decât H.264 (5,62 față de 3,22 MB). Pe clipul tău real din F0, AV1 a ieșit cu 43% mai mic. Concluzia D-35 rămâne valabilă pentru material real. Verific din nou cu primul clip real încărcat.

## 4. Ce faci tu pentru GATE 1 (aproximativ 15 minute)

1. Deschide https://anna-restaurante-alinlabau-9308s-projects.vercel.app/admin și intră cu contul tău.
2. În meniu, la „Restaurant”, alege **Trattoria da Vittoria**.
3. **O fotografie:** Bibliotecă media → Creați unul nou → „Alege și convertește” → o fotografie de pe telefon. Completează textul alternativ → Salvează.
4. **O seară tematică:** Seri tematice → Creați unul nou → nume, dată în viitor, tip; la „Afiș” alege fotografia de la pasul 3 → Salvează.
5. **Un vin:** Vinuri → Creați unul nou → nume, tip, preț la sticlă → Salvează.
6. **Editorul de probă:** Utilizatori → Creați unul nou → email, nume, parolă, rol **Editor**, restaurant Trattoria. Intră cu el într-o fereastră privată. În meniu nu trebuie să apară Premii și Setări. Adresele `/admin/collections/awards` și `/admin/collections/settings` trebuie să arate „Nimic găsit”.
7. Scrie-mi „GO” sau ce vrei schimbat.

## 5. Decizii și presupuneri de confirmat

| # | Ce | Propunerea mea | De ce |
|---|---|---|---|
| G1-1 | Cine vede **Cererile primite** | Doar Administratorul [PRESUPUNERE] | Conțin date personale. Destinatarii primesc oricum emailul. Dacă vrei ca Social Media Managerul să le vadă, schimb o linie |
| G1-2 | **Limbile active** până la F4 | Doar `ro` [PRESUPUNERE] | Celelalte se pornesc după traduceri (D-28). Câmpurile pe limbi există deja |
| G1-3 | **Sunetul clipurilor** | Toate clipurile fără sunet [PRESUPUNERE] | Hero-ul cere fără sunet (ADR-005). Pentru clipuri de galerie cu muzică aș adăuga o bifă „Păstrează sunetul” (R2) |
| G1-4 | Mărimea maximă a unui fișier **după** conversie | 50 MB | Un clip de 30 s ajunge la ~12 MB (F0). Originalul nu are limită: nu urcă pe server |
| G1-5 | Bifa „Provizoriu” la elementele noi | Oprită implicit | Ce adaugi tu e conținut real. Exemplele de pornire o au pornită |
| G1-6 | Subiectele de email fără destinatar | Oprite (butonul lor nu apare în formular) până pui adresele | Doar Cazare are destinatar decis (D-15) |
| G1-7 | Adresele paginilor legale | `/termeni`, `/confidentialitate`, `/cookies` [PRESUPUNERE] | Se pot schimba din panou |

## 6. Mutate sau amânate (cu motiv)

| Ce | Unde | Motiv |
|---|---|---|
| Setul aprobat de fonturi (G3) și alegerea lor pe restaurant | F2 | Fonturile vin din direcția de design |
| Starea traducerii pe limbă, „Tradu automat”, blocarea câmpurilor „nu se traduce” în celelalte limbi | F4 | ADR-007; câmpurile pe limbi există deja |
| „Folosit în” la fiecare fișier media | după F3 | Necesită legături din 12 colecții; nu blochează nimic |
| Durata de păstrare a cererilor | F5 | Propun 24 de luni [PRESUPUNERE], cu ștergere automată |
| Fotografia bonului la sesizări | F3 | Biblioteca media este publică; bonul are nevoie de un loc privat |
| `mediabunny` 1.66.4 | — | Publicată azi, la 10:36 UTC. Rămânem pe 1.66.3, probată în F0 |

## 7. Probleme găsite și rezolvate în F1

| # | Problemă | Rezolvare |
|---|---|---|
| 1 | După autentificare, pluginul alegea **primul restaurant alfabetic (Citybar)** la deschiderea Setărilor. Exista riscul să editezi restaurantul greșit | Restaurantele au ordine manuală; implicit, ordinea creării (Trattoria = prima). Tabloul de bord cere alegerea restaurantului |
| 2 | Conținutul de pornire, scris ca migrație, **pica pe o bază nouă** când o migrație ulterioară schimba schema. Am prins asta în simularea producției, înainte de push | Rulează după migrații (`scripts/seed-starter.ts`), o singură dată pe restaurant, cu un marcaj pe restaurant |
| 3 | Migrația generată automat pierdea textul alternativ existent (coloana trece pe limbi) și nu putea fi anulată | Copiere explicită în română; anularea probată dus-întors |
| 4 | Lint-ul nu pornea din F0 (`@eslint/eslintrc` lipsă) | Configurația nativă `eslint-config-next` 16: 0 erori |
| 5 | Traducerea oficială Payload afișa „Localitate” pentru limba conținutului | Suprascrisă: „Limba conținutului” |

## 8. Contradicții (nerezolvate în tăcere)

| # | Ce | Fișiere | Ce am aplicat |
|---|---|---|---|
| C2 | Facebook în footer și Contact, fără link în DECISIONS | design vs D-18/D-30 | Câmpul există; Tabloul de bord îl arată ca lipsă |
| C6 | PLAN F1 numește „Cursuri de pizza” modul separat; content-model 4.8 îl pune ca secțiune a paginii Acasă | PLAN vs content-model | Am urmat content-model (secțiunea „Cursuri de pizza”, cu textul complet al paginii). Pot face și o intrare separată în meniu |
| C7 | content-model 5.1 dă numele „Recomandări din partea casei”; wireframe-ul scrie „Recomandările casei” | content-model / D-32 vs wireframe | Am aplicat D-32 |

## 9. Estimarea refăcută

F1 era estimat la 3–4 sesiuni; s-a făcut într-una. Total: **13–17 sesiuni** (era 14–20). Detaliile sunt în `docs/PLAN.md`.

## 10. Capturi (în `docs/img/`)

`f1-admin-dashboard.png` (contorul: 52), `f1-admin-settings-cereri.png`, `f1-admin-home.png`, `f1-admin-media-converted.png`, `f1-admin-clip-rejected.png`, `f1-editor-dashboard.png` (contorul Editorului: 51, fără Premii), `f1-editor-phone-event.png`, `f1-editor-phone-awards.png` („Nimic găsit”).

## 11. După GO (24.11.2026)

| Ce | Rezultat |
|---|---|
| D-37 | Editorul vede în meniu „Cereri primite”, doar cu subiectele Curs de pizza și Întrebare; schimbă doar „Stare”. Tabloul de bord arată „Cereri noi”. Probat: 4 cereri de test, Editorul vede 2, nu poate modifica Cazare și nu poate șterge |
| D-39 | Cele 9 motive de sesizare, cu explicația lor, în colecția „Motive de sesizare”. **Abatere de la content-model 5.9**: am adăugat câmpul „Explicație” (120 de caractere, pe limbi), ca textul de pe site-ul actual să rămână întreg. Cel mai lung text are ~95 de caractere, peste limita de 80 a unui singur câmp |
| Conținutul de pornire | Jurnal pe colecție: o colecție nouă din `seed/*.json` se aplică la următorul build; una golită intenționat din panou nu se mai completează. Probat pe copia producției: recenziile șterse au rămas șterse, motivele s-au adăugat |
| Propunere | Pe pagina descărcată de pe davittoria.ro apar linkul de Facebook și adresele celor 10 site-uri ale grupului. **Nu le-am aplicat**; aștept confirmarea ta (vezi `docs/OPEN-QUESTIONS.md`, #13 și #17) |

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
