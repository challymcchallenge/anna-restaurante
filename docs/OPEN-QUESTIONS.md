# Întrebări deschise — Trattoria da Vittoria

Niciuna nu blochează faza 0. Coloana „Până la” arată faza înaintea căreia e nevoie de răspuns. Lista detaliată a întrebărilor de design este în `design/feature-map/feature-inventory.md`.

| # | Întrebare | Până la | Cine răspunde |
|---|---|---|---|
| ~~1~~ | ~~Materialele de brand~~ — **rezolvat în F2**: logo-uri primite, culori și fonturi decise (D-41, D-42), pictogramă desenată (D-43) | — | — |
| 2 | Clipul video pentru hero și setul de fotografii pe categorii (amânat la cererea lui Alin; machetele folosesc fotografii provizorii) | F3 | Alin |
| 3 | Ce anume se animă în 3D pe desktop | După lansare (D-33) | Alin |
| ~~4~~ | ~~Lista de recenzii~~ — **rezolvat: D-55, D-56** | — | — |
| ~~5~~ | ~~Lista reală de vinuri~~ — **rezolvat: D-46, D-48** | — | — |
| 6 | Cursurile de pizza: frecvență, vârste, locuri, preț, cum se confirmă înscrierea | F3 | Alin |
| 7 | Termenul de răspuns promis pe fiecare subiect (cazare, salon, curs, sesizare) | F3 | Alin |
| 8 | Acordul părinților pentru fotografiile cu copii | F3 | Alin |
| 9 | Texte legale: termeni, confidențialitate, cookies | F5 | Alin |
| 10 | Domeniul de trimitere pentru emailuri (ex. un subdomeniu al davittoria.ro) | **F5** (D-36: la final, cu mutarea DNS) | Alin |
| ~~11~~ | ~~Linkurile către celelalte site-uri ale Grupului ANNA~~ — **rezolvat: D-40** | — | — |
| 12 | Confirmarea celor 8 categorii din slider (propunerea DESI, acceptată prin D-32) | F3 | Alin |

## De verificat tehnic (faza 0) — **toate rezolvate pe 24.11.2026**, vezi `docs/spikes/` și `docs/2026_11_24_Trattoria_GATE0.md`

| # | Ce | ADR |
|---|---|---|
| T1 | Lățimile și calitatea variantelor AVIF/WebP; HEIC de pe iPhone | ADR-004 |
| T2 | Conversia video în browser, pe laptop și pe telefon | ADR-005 |
| T3 | Cookies ialoc și nevoia de consimțământ | ADR-008 |
| T4 | Motorul de traducere automată, pornind de la cele gratuite | ADR-007 |
| T5 | Costul real al proiectului Supabase suplimentar în organizația Pro | ADR-006 |
| T6 | Dacă meniul digital permite legături directe pe categorie | — |
| ~~13~~ | ~~Linkul paginii de Facebook~~ — **rezolvat: D-40** (C2 închisă) | — | — |

## Întrebări noi după F1 (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_GATE1.md`, secțiunea 5

| # | Întrebare | Până la | Cine răspunde |
|---|---|---|---|
| ~~14~~ | ~~Cererile primite: cine le vede~~ — **rezolvat: D-37** | — | — |
| ~~15~~ | ~~Destinatarii de email~~ — **rezolvat: D-51** | — | — |
| ~~16~~ | ~~Cele 9 motive de sesizare~~ — **rezolvat: D-39**, preluate de pe davittoria.ro | — | — |
| ~~17~~ | ~~Adresele site-urilor grupului~~ — **rezolvat: D-40**, 11 linkuri, inclusiv Fabrica Mezeluri GorjANNA | — | — |
| 18 | Poziția pe hartă a restaurantului (latitudine, longitudine) | F3 | Alin |

## Întrebări noi după F2 (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_GATE2.md`, secțiunea 10

| # | Întrebare | Până la | Cine răspunde |
|---|---|---|---|
| ~~G2-1~~ | ~~Direcția de design~~ — **rezolvat: D-41**, B · Carta cu butoane verzi | — | — |
| ~~G2-2~~ | ~~Fonturi gratuite sau plătite~~ — **rezolvat: D-42**, gratuite | — | — |
| ~~G2-3~~ | ~~Setul aprobat G3~~ — **rezolvat: D-42**, cele 4 | — | — |
| ~~G2-4~~ | ~~Pictograma de filă~~ — **rezolvat: D-43**, desenată | — | — |
| G2-5 | Dintre variantele de fonturi din `design/f2/fonturi.html`, vrei vreuna în locul perechii Belleza + Hanken Grotesk sau adăugată în set? (Implicit: rămâne Belleza + Hanken Grotesk) | F3 | Alin |

## Întrebări noi după F3, pașii 1–3 (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_F3_Pasii1-3.md`, secțiunea 8

| # | Întrebare | Până la | Cine răspunde |
|---|---|---|---|
| ~~G3-1~~ | ~~Categoriile din Bucătăria: rânduri de meniu cu fotografie alături (macheta B aprobată la GATE 2, `docs/design-system.md`) sau slider de carduri cu fotografie (cuvântul din PLAN F3 și wireframe-ul S-01)? Am construit rândurile; contradicția e semnalată~~ — **rezolvat: D-44**, slider de categorii | — | — |
| ~~G3-2~~ | ~~Antetul compact care rămâne sus pe desktop după primul ecran (nou față de machetă, ca „Rezervă o masă” să fie mereu la un clic) — îl păstrăm?~~ — **rezolvat: D-44**, rămâne | — | — |
| ~~G3-3~~ | ~~Linkurile spre pagini încă neconstruite (`/contact` din cererea de cazare, `/catalog-vinuri`, paginile legale, `/formular-de-reclamatie`) dau 404 până la pașii 9–10. Le las vizibile (implicit) sau le ascund până atunci?~~ — **rezolvat: D-44**, rămân vizibile | — | — |
| ~~G3-4~~ | ~~Fotografiile provizorii din F2 (Wikimedia, cu credit) sunt acum în Biblioteca media pe producție. Rămân până vin cele reale (implicit) sau le scot?~~ — **rezolvat: D-44**, rămân | — | — |

## Întrebări noi după F3, pașii 4–6 (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_F3_Pasii4-6.md`, secțiunea 7

| # | Întrebare | Până la | Cine răspunde |
|---|---|---|---|
| ~~G4-1~~ | ~~„Rezervă masă” pe cardul unei seri: să deschidă fereastra ialoc cu data serii preselectată? Câmpul „Rezervare cu data serii” există; nu l-am legat încă, pentru că ar cere o a doua inițializare ialoc, neprobată (F0 a probat doar una). Acum deschide fereastra obișnuită~~ — **rezolvat: D-47** | — | — |
| ~~G4-2~~ | ~~PLAN F3 pasul 4 pomenește „agenda lunii” la Evenimente private; wireframe-ul S-02 nu o are. Agenda serilor e pe `/petreceri`. Vrei și pe pagina saloanelor o listă a serilor din luna curentă?~~ — **rezolvat: D-47** | — | — |
| ~~G4-3~~ | ~~Câte camere poate avea o cerere de cazare? Am pus cel mult 4 [PRESUPUNERE]; maximele de adulți (6) și copii (4) se aplică pe cameră~~ — **rezolvat: D-47** | — | — |

## Întrebări noi după lista de vinuri (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_F3_Vinuri.md`

| # | Întrebare | Până la | Cine răspunde |
|---|---|---|---|
| ~~G5-1~~ | ~~Confirmi cele 20 de vinuri recomandate pe Acasă (5 din fiecare tip)? Le schimbi din panou: Vinuri → bifa „Recomandat”~~ — **rezolvat: D-48** | — | — |
| ~~G5-2~~ | ~~Soiurile: PDF-ul nu le are. Le-am pus doar la 19 vinuri (din poza 7 sau impuse de denumire). Le completez și la celelalte, după fișele producătorilor, sau rămân doar denumirea de origine?~~ — **rezolvat: D-48** | — | — |
| ~~G5-3~~ | ~~Culoarea a 4 vinuri e dedusă [PRESUPUNERE]: Familia Vlădoi Brizza și Recaș Muse Day = alb; Domaine de Belle Mare Le Rivage = rosé (nota din PDF); Domeniul Coroanei Segarcea Demidulce = desert. Corect?~~ — **rezolvat: D-48** | — | — |
| ~~G5-4~~ | ~~Rândurile „De verificat pe etichetă” (33) și „Decizie de stoc / preț” (11) din PDF sunt pe site, cu excepția Pinot Grigio Friuli „2026” (ascuns). Le verifici în panou (Vinuri, coloana „Cod extern” = rândul din inventar) și oprești „Disponibil” la ce nu mai vinzi?~~ — **rezolvat: D-48** | — | — |

## Întrebări noi după F3 pasul 9 (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_F3_Pasul9.md`

| # | Întrebare | Până la | Cine răspunde |
|---|---|---|---|
| ~~G6-1~~ | ~~Pe producție, în Setări → Cereri și emailuri e pornit doar subiectul Cazare. Pe `/contact` apare deci doar Cazare (plus „Rezerv o masă”), iar pagina de sesizări dă telefonul. Îmi dai destinatarii pentru Eveniment privat, Curs de pizza, Întrebare și Sesizare (#27), ca să le pornești? Cererile se salvează în panou și fără email; emailurile pleacă din F5~~ — **rezolvat: D-51** | — | — |
| ~~G6-2~~ | ~~Harta: am pus „Vezi pe hartă” (deschide Google Maps), fără hartă încorporată. O hartă încorporată ar încărca un serviciu terț la fiecare vizită (cookies, viteză). Propun una care se încarcă doar la clic. O vrei?~~ — **rezolvat: D-51** | — | — |
| ~~G6-3~~ | ~~Fotografia bonului la sesizări (content-model 7, opțional): nu am făcut-o, pentru că încărcarea de fișiere de către vizitatori cere verificări de siguranță. Propun s-o fac în F5, ca atașament la emailul către manager, fără să rămână pe server. De acord?~~ — **rezolvat: D-51** | — | — |
| ~~G6-4~~ | ~~Pe confirmarea unei cereri de cazare, „Dacă este urgent” arată acum telefonul de rezervări al restaurantului. Vrei telefonul recepției Hotel ANNA? Dacă da, îmi dai numărul și adaug câmpul în Setări~~ — **rezolvat: D-51** | — | — |


## Întrebări noi după F3 pasul 10 (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_F3_Pasul10.md`, secțiunea 4

| # | Întrebare | Când trebuie | Cine răspunde |
|---|---|---|---|
| ~~G7-1~~ | ~~Juristul și ciornele legale~~ — **rezolvat: D-59** | — | — |
| ~~G7-2~~ | ~~Lista adreselor de pe davittoria.ro~~ — **rezolvat: D-59** | — | — |
| ~~G7-3~~ | ~~Cât timp păstrăm cererile~~ — **rezolvat: D-59** | — | — |

## Întrebări noi la GATE 3 (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_GATE3.md`, secțiunea 7

| # | Întrebare | Când trebuie | Cine răspunde |
|---|---|---|---|
| ~~G8-1~~ | ~~Subtitlul din hero~~ — **rezolvat: D-57**, „Bucătărie italiană și peste 150 de vinuri, pe Strada Victoriei 8, în Târgu Jiu.” | — | — |
| ~~G8-2~~ | ~~Ce are bucătăria pe care alt restaurant italian din Târgu Jiu nu poate spune?~~ — **rezolvat: D-59** | — | — |
| ~~G8-3~~ | ~~Descrierile saloanelor și camerelor și răspunsurile la întrebări~~ — **rezolvat: D-58** (5 răspunsuri rămân la G9-1) | — | — |
| ~~G8-4~~ | ~~Recenziile reale: iau 3–4 recenzii publice din profilul Google, cu numele scurtat și sursa?~~ — **rezolvat: D-55** | — | — |

## Întrebări noi după G8-3 (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_GATE3.md`, secțiunea 10

| # | Întrebare | Când trebuie | Cine răspunde |
|---|---|---|---|
| ~~G9-1~~ | ~~Răspunsurile pe care nu le-am găsit pe site-uri~~ — **rezolvat: D-59** | — | — |
| ~~G9-2~~ | ~~Apartamentele VIP Riviera în formularul de cazare~~ — **rezolvat: D-59** | — | — |

## Întrebări noi în F4 (25.11.2026) — detalii în `docs/2026_11_25_Trattoria_F4.md`

| # | Întrebare | Când trebuie | Cine răspunde |
|---|---|---|---|
| ~~G10-1~~ | ~~FAQ la cursuri și la hotel~~ — **rezolvat: D-65** (3 + 4 întrebări, doar fapte confirmate) | — | — |
| ~~G10-2~~ | ~~Termeni care nu se traduc~~ — **rezolvat: D-65** | — | — |

## Întrebări noi la GATE 4 (25.11.2026) — detalii în `docs/2026_11_25_Trattoria_GATE4.md`

| # | Întrebare | Când trebuie | Cine răspunde |
|---|---|---|---|
| ~~G11-1~~ | ~~pagina de cookies~~ — **rezolvat: D-67** | — | — |
| ~~G11-2~~ | ~~numele categoriilor traductibile~~ — **rezolvat: D-67** | — | — |
| ~~G11-3~~ | ~~abaterea /zh acceptată~~ — **rezolvat: D-67** | — | — |


## Întrebări deschise după D-72 (25.11.2026)

| # | Întrebare | Când trebuie | Cine răspunde |
|---|---|---|---|
| ~~G12-1~~ | ~~Slideshow-ul cu „Reducere mișcare”~~ — **rezolvat: D-76** (cadrele se schimbă instant, cu pauză) | — | — |
| ~~G12-2~~ | ~~Coperta pe video fără clip de desktop~~ — **rezolvat: D-76** (Alin a revenit la slideshow) | — | — |

## Importul în masă al fotografiilor (cerut de Alin, 25.11.2026) — propunerea în `docs/2026_11_25_Trattoria_Stare_Proiect.md`, „Sesiunea următoare”

| # | Întrebare | Când trebuie | Cine răspunde |
|---|---|---|---|
| ~~G13-1~~ | ~~Cum ajung fotografiile~~ — **rezolvat: D-75** (folder Google Drive public, descărcat integral) | — | — |
| (vechi) G13-1 | **Cum ajung fotografiile la Claude:** (a) un dosar Google Drive, citit prin conectorul Drive (recomandat acum); (b) dosarul local prin Remote Control (dosarele de pe S360ProBook2 nu sunt oferite sesiunilor din cloud: actualizează aplicația Claude și alege un dosar care nu e ascuns); (c) o arhivă .zip atașată în conversație, dacă e mică | înainte de import | Alin |
| ~~G13-2~~ | ~~Cât de multe~~ — **rezolvat: D-75** (144 de fișiere, 426 MB: 104 JPEG, 22 HEIC, 13 PNG, 5 MP4) | — | — |
| (vechi) G13-2 | **Cât de multe și ce fel:** număr aproximativ, mărimea totală, formate (JPG, HEIC de pe iPhone, PNG, clipuri) | înainte de import | Alin |
| ~~G13-3~~ | ~~Ce pot înlocui~~ — **rezolvat: D-75** („doar galeria”) | — | — |
| (vechi) G13-3 | **Ce pot înlocui:** doar golurile (galerie, categorii, saloane, camere, seri) sau și ce e acum pe site (cadrele copertei, fotografia cursului) | înainte de import | Alin |
| ~~G13-4~~ | ~~Copii în fotografii~~ — **rezolvat: D-75** („avem acordul de la toți”) | — | — |
| (vechi) G13-4 | **Copii în fotografii:** panoul cere „Acordul părinților confirmat” (Q-25). Confirmi acordul pentru fotografiile cu copii (cursul de pizza) sau le lăsăm deoparte? | înainte de import | Alin |
| ~~G13-5~~ | ~~Încărcarea pe producție~~ — **rezolvat: D-75** (varianta A; 122 de elemente în galerie) | — | — |
| (vechi) G13-5 | **Încărcarea pe producție:** un punct de import temporar (`/api/media-import`), protejat cu un token pe care îl pui tu în Vercel (`MEDIA_IMPORT_TOKEN`) și în formularul securizat de credențiale; îl ștergem după import. Fără parole în conversație. DA / altă variantă? | înainte de import | Alin |

## Întrebări noi în F5, sesiunea 1 (25.11.2026) — detalii în `docs/f5/2026_11_25_Trattoria_F5_Sesiunea1.md`

| # | Întrebare | Când trebuie | Cine răspunde |
|---|---|---|---|
| ~~G14-1~~ | ~~Cât timp păstrăm cererile primite~~ — **rezolvat: D-79** (12 luni) | — | — |
| ~~G14-2~~ | ~~Paginile vechi fără echivalent~~ — **rezolvat: D-79** (rămân redirecționate la Acasă) | — | — |
| ~~G14-3~~ | ~~Statistici după lansare~~ — **rezolvat: D-79** (Google Analytics cu banner, eticheta GT-NCLXCCBJ) | — | — |
| ~~G14-4~~ | ~~Nivel de preț pentru Google~~ — **rezolvat: D-79** (opțional, din panou) | — | — |
| ~~G14-5~~ | ~~Domeniul de trimitere pentru emailuri și ziua mutării DNS~~ — **rezolvat: D-79** (davittoria.ro, în sesiunea 2) | — | — |

## Întrebări noi după D-79 (25.11.2026)

| # | Întrebare | Când trebuie | Cine răspunde |
|---|---|---|---|
| ~~G15-1~~ | ~~Paginile Cookies și Confidențialitate cu textele Riviera Events~~ — **rezolvat: D-80** (înlocuite cu varianta pentru Trattoria, „Provizoriu” până completează juristul) | — | — |
