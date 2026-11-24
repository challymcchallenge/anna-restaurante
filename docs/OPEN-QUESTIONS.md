# Întrebări deschise — Trattoria da Vittoria

Niciuna nu blochează faza 0. Coloana „Până la” arată faza înaintea căreia e nevoie de răspuns. Lista detaliată a întrebărilor de design este în `design/feature-map/feature-inventory.md`.

| # | Întrebare | Până la | Cine răspunde |
|---|---|---|---|
| 1 | Materialele de brand: ~~logo-uri (Trattoria, ANNA)~~ **primite în F2**; culorile și fonturile propuse în F2 (G2-1, G2-2) | GATE 2 | Alin |
| 2 | Clipul video pentru hero și setul de fotografii pe categorii (amânat la cererea lui Alin; machetele folosesc fotografii provizorii) | F3 | Alin |
| 3 | Ce anume se animă în 3D pe desktop | F4 | Alin |
| 4 | Lista de recenzii (restaurant și hotel) | F3 | Alin |
| 5 | Lista reală de vinuri și câmpurile fiecărui vin. Colecția există, cu 5 exemple provizorii; câmpurile se pot ajusta după lista reală | **F3** (mutat din F1: nu blochează panoul) | Alin |
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
| 15 | Destinatarii de email pentru Eveniment privat, Curs de pizza, Întrebare, Sesizare și adresa de copie (se pun în panou) | F3 | Alin |
| ~~16~~ | ~~Cele 9 motive de sesizare~~ — **rezolvat: D-39**, preluate de pe davittoria.ro | — | — |
| ~~17~~ | ~~Adresele site-urilor grupului~~ — **rezolvat: D-40**, 11 linkuri, inclusiv Fabrica Mezeluri GorjANNA | — | — |
| 18 | Poziția pe hartă a restaurantului (latitudine, longitudine) | F3 | Alin |

## Întrebări noi după F2 (24.11.2026) — detalii în `docs/2026_11_24_Trattoria_GATE2.md`, secțiunea 10

| # | Întrebare | Până la | Cine răspunde |
|---|---|---|---|
| G2-1 | Direcția de design: A · Cotto sau B · Carta (propunerea mea: B) | GATE 2 | Alin |
| G2-2 | Fonturi OFL gratuite sau originalele plătite de pe vineyard.co.za (Optima + PP Mori; preț neverificat) | GATE 2 | Alin |
| G2-3 | Setul aprobat G3: toate cele 4 fonturi verificate, din care alege fiecare restaurant | GATE 2 | Alin |
| G2-4 | Pictograma de filă: un „V” din script-ul logo-ului, desenat de Claude Code | F3 | Alin |
