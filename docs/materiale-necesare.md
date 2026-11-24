# Materiale necesare — Trattoria da Vittoria

Data: 24.11.2026 · Actualizat în F3 (pașii 1–6) · Lista se actualizează la fiecare fază. Coloana „Până la” arată faza înaintea căreia e nevoie de material.

Unde se pun: totul se încarcă sau se scrie din panou, cu Trattoria aleasă în comutatorul „Restaurant”.
Panoul: https://anna-restaurante-alinlabau-9308s-projects.vercel.app/admin

Contorul din Tabloul de bord arată câte elemente provizorii au rămas. La lansare trebuie să arate 0 (D-08, PLAN F5).

## 1. Brand și identitate

| # | Material | Format | Unde în panou | Până la | Sursa cerinței |
|---|---|---|---|---|---|
| ~~1~~ | ~~Logo Trattoria, varianta principală~~ — **primit (F2)**: PNG transparent 1024 × 1024, în Biblioteca media și în Logo principal din 24.11.2026 (deploy `dpl_9YX6qkL7k2aDqxo1MzorMUpiiJKB`) (`seed/media/trattoria-da-vittoria/`). Un SVG ar fi și mai clar la dimensiuni mici, dacă există | — | Setări restaurant → Identitate → Logo principal | — | OQ #1 |
| ~~2~~ | ~~Logo Trattoria pe fundal închis~~ — **nu mai e necesar (F2)**: medalionul se vede bine și pe fundal închis | — | … → Logo pe fundal închis | — | R1 (opțional) |
| ~~3~~ | ~~Logo Grupul ANNA~~ — **primit (F2)**: PNG transparent, în Logo grup din 24.11.2026 | — | … → Logo grup | — | R1 |
| ~~4~~ | ~~Pictograma de filă~~ — **gata (F2, D-43)**: desenată de Claude Code (`design/brand/favicon/`), în Biblioteca media și în Setări la următorul build | — | … → Pictogramă de filă | — | R1 |
| ~~5~~ | ~~Culorile și fonturile~~ — **decise (D-41, D-42)**: `docs/design-system.md`; în Setări la următorul build | — | — | — | OQ #1, Q-17 |
| 6 | Imaginea de distribuire pe rețele | 1200 × 630 px | … → Imagine de distribuire implicită | F3 | R1, SHARE |

## 2. Fotografii și clipuri

Încărcare: Bibliotecă media → „Alege și convertește”. Originalul rămâne la tine; pe server ajunge doar varianta optimizată (D-27). Clipurile au cel mult 30 de secunde (D-24).

| # | Material | Format recomandat | Câte | Până la |
|---|---|---|---|---|
| 7 | Clip hero pentru desktop (în machete: fotografie provizorie) | 16:9, fără sunet, ≤ 30 s | 1 | F3 (amânat la cererea ta) |
| 8 | Clip hero pentru telefon (în machete: fotografie provizorie) | 9:16, fără sunet, ≤ 30 s | 1 | F3 (amânat la cererea ta) |
| 9 | Poster hero desktop / telefon (imaginea care apare înaintea clipului). **F3: acum stă o fotografie provizorie** (pizza în cuptor, Wikimedia), cu „Exemplu · de înlocuit” pe hero. Se înlocuiește în Pagina Acasă → Hero → Poster desktop / Poster telefon | 16:9, min. 2400 × 1350 · 9:16, min. 1080 × 1920 | 2 | F3 (amânat la cererea ta) |
| 10 | Câte o fotografie pentru fiecare din cele 8 categorii de preparate. **F3: 3 provizorii** (Recomandări din partea casei, Pasta e Risotto, Pizza), **5 lipsesc** (Antipasti, Preparate Marine, Preparate Vită, Deserturi, Buona Mattina). Pe desktop, fotografia se schimbă când treci peste rândul categoriei. Unde: Categorii de preparate → Fotografie | 4:5, min. 1080 × 1350 | 8 | F3 |
| 11 | Saloanele Trattoria și Vittoria. **F3: pe Acasă și pe `/evenimente-private` stă acum numele salonului pe copertă, în locul fotografiei**; prima fotografie apare pe Acasă, toate pe pagina saloanelor. Unde: Saloane → Fotografii | 3:2, min. 1800 × 1200 | 3–10 pe salon | F3 |
| 12 | Hotel ANNA și cele 2 tipuri de camere | 3:2 | 3 + 2 | F3 |
| 13 | Cursul de pizza pentru copii. **F3: lipsește; pe Acasă și pe `/cursuri-pizza-copii` stă „Cursuri de pizza” pe copertă.** Galeria apare pe pagina cursului când are elemente. Unde: Pagina Acasă → Cursuri de pizza → Fotografie / Galerie | 3:2 | 1 + galerie (cel mult 12) | F3 |
| 14 | Galerie pe categorii (Restaurant, Preparate, Vinuri, Petreceri, Hotel, Evenimente) | min. 1600 px pe latura lungă | 6–8 pe Acasă, restul în galerie | F3 |
| 15 | Afișele serilor tematice. **F3: fără afiș, cardul serii arată data mare pe copertă**; cu afiș, data apare pe o etichetă de hârtie peste el. Unde: Seri tematice → Afiș sau fotografie | 4:5 | câte unul pe seară | la fiecare seară |
| 16 | Acordul părinților pentru fotografiile cu copii | confirmare scrisă | — | F3 (Q-25, OQ #8) |
| 31 | Fotografiile pentru direcția aleasă în F2, în locul celor 5 fotografii provizorii din machete (Wikimedia Commons, `design/f2/assets/foto/credits.json`). **F3: cele 6 provizorii sunt acum în Biblioteca media a Trattoriei, cu titlul „Exemplu · de înlocuit: …” și creditul lor (apare într-un rând în footer). Le ștergi din panou când pui fotografiile tale; nu mai revin.** Direcția aleasă e B · Carta: seară, lumină caldă, cuptorul, pahare, prim-planuri de preparate, oameni la masă (fără fețe recognoscibile fără acord) | ca la 9 și 10 | 5–8 | F3 |

## 3. Texte și liste

| # | Material | Unde în panou | Până la | Sursa |
|---|---|---|---|---|
| ~~17~~ | ~~Lista reală de vinuri~~ — **primită (PDF din 19.11.2026), importată: D-46.** Rămân verificările din G5-2 … G5-4 | Vinuri | F3 | D-46 |
| 18 | Recenziile reale, pentru restaurant și pentru hotel. **F3: Acasă arată primele 3 din grupul Restaurant, fiecare cu „Exemplu · de înlocuit”**; legătura „Lasă o recenzie” merge deja la recenzia Google | Recenzii (4 exemple acum) | F3 | D-06, OQ #4 |
| 32 (nou, F3) | Textul introductiv pentru **Bucătăria** și pentru **Vinuri** (câmpul e gol, secțiunile arată doar titlul). Un rând, cel mult 160 de caractere fiecare | Pagina Acasă → Bucătăria / Vinuri → Text introductiv | F3 | content-model 4.3, 4.4 |
| 33 (nou, F3) | Rândul de lângă insigna premiului în secțiunea Vinuri (gol acum) | Premii și distincții → Wine Spectator → Rând de text | F3 | content-model 5.10 |
| ~~34~~ | ~~Fotografii ale sticlelor de vin~~ — **nu mai e nevoie**: lista de vinuri nu arată fotografii (D-46); câmpul rămâne pentru portalul de vinuri (D-14) | Vinuri → Fotografie | — | D-46 |
| ~~19~~ | ~~Cele 9 motive de sesizare~~ — **gata** (D-39) | Motive de sesizare | — | D-39 |
| ~~20~~ | ~~Adresele site-urilor grupului~~ — **gata** (D-40, 11 linkuri) | Linkuri grup | — | D-40 |
| ~~21~~ | ~~Linkul paginii de Facebook~~ — **gata** (D-40) | Setări → Rețele sociale | — | D-40 |
| 22 | Poziția restaurantului pe hartă (latitudine, longitudine) | Setări → Contact și program → Adresă | F3 | content-model R2 |
| 23 | Răspunsurile la cele 7 întrebări frecvente (sau altele). **F3: cele 3 din grupul Evenimente private apar pe `/evenimente-private`, cu „Exemplu · de înlocuit”** | Întrebări frecvente | F3 | Q-24 |
| 24 | Descrierile saloanelor și a camerelor; confirmarea capacităților 25 / 40 și a amplasării (etaj / mansardă) | Saloane, Tipuri de camere | F3 | A-08 |
| 25 | Cursurile de pizza: vârstă, durată, preț, locuri, cum se confirmă înscrierea. **F3: rândurile apar pe Acasă și pe pagina cursului imediat ce completezi câmpurile** | Pagina Acasă → Cursuri de pizza | F3 | Q-11, OQ #6 |
| 26 | Termenul de răspuns pe fiecare subiect (cazare, salon, curs, întrebare, sesizare) | Setări → Cereri și emailuri | F3 | Q-34, OQ #7 |
| 27 | Destinatarii emailurilor pentru Eveniment privat, Curs de pizza, Întrebare, Sesizare (Cazare are deja rezervari@hotelanna.ro) și adresa ta de copie. **F3: cât timp subiectul e oprit, „Rezervă salonul” sună managerul și „Înscrie copilul” sună la rezervări; după ce pornești subiectul, butonul deschide formularul** | Setări → Cereri și emailuri | F3 | D-15, ADR-009 |
| 28 | Textele juridice: termeni, confidențialitate, cookies | Pagini legale (3 pagini provizorii) | F5 | Q-25, OQ #9 |
| 29 | ID-ul contului de statistici existent | Setări → Integrări → ID statistici | F5 | D-32 |
| 30 | Logo-ul oficial al premiului Wine Spectator, cu nivelul și anul | Premii și distincții | la primire | D-20 |

## 4. Deja completate din `docs/DECISIONS.md`

Motivele de sesizare (D-39), Facebook și cele 11 linkuri ale grupului (D-40), tagline (D-01), adresa (Strada Victoriei nr. 8, Târgu Jiu), telefoanele (D-17), programul zilnic 8:00–24:00 (content-model R2), Instagram, YouTube, TikTok (D-18, D-30), linkul de recenzie Google, ID-ul ialoc 4385 (D-03), meniul digital, destinatarul pentru Cazare (D-15), redirecționarea `/valori-nutritionale` (D-19).

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
