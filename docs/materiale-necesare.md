# Materiale necesare — Trattoria da Vittoria

Data: 24.11.2026 · Faza 1 · Lista se actualizează la fiecare fază. Coloana „Până la” arată faza înaintea căreia e nevoie de material.

Unde se pun: totul se încarcă sau se scrie din panou, cu Trattoria aleasă în comutatorul „Restaurant”.
Panoul: https://anna-restaurante-alinlabau-9308s-projects.vercel.app/admin

Contorul din Tabloul de bord arată câte elemente provizorii au rămas. La lansare trebuie să arate 0 (D-08, PLAN F5).

## 1. Brand și identitate

| # | Material | Format | Unde în panou | Până la | Sursa cerinței |
|---|---|---|---|---|---|
| 1 | Logo Trattoria, varianta principală | SVG; altfel PNG transparent, minimum 600 px lățime | Setări restaurant → Identitate → Logo principal | F2 | OQ #1, content-model R1 |
| 2 | Logo Trattoria pe fundal închis | idem | … → Logo pe fundal închis | F2 | R1 (opțional) |
| 3 | Logo Grupul ANNA, pentru footer | idem | … → Logo grup | F2 | R1 |
| 4 | Pictograma de filă (favicon) | SVG sau PNG pătrat, minimum 512 px | … → Pictogramă de filă | F2 | R1 |
| 5 | Culorile și fonturile brandului, dacă există un ghid | PDF sau listă de coduri #RRGGBB | trimise mie; paleta finală se stabilește în F2 | F2 | OQ #1, Q-17 |
| 6 | Imaginea de distribuire pe rețele | 1200 × 630 px | … → Imagine de distribuire implicită | F3 | R1, SHARE |

## 2. Fotografii și clipuri

Încărcare: Bibliotecă media → „Alege și convertește”. Originalul rămâne la tine; pe server ajunge doar varianta optimizată (D-27). Clipurile au cel mult 30 de secunde (D-24).

| # | Material | Format recomandat | Câte | Până la |
|---|---|---|---|---|
| 7 | Clip hero pentru desktop | 16:9, fără sunet, ≤ 30 s | 1 | F2 |
| 8 | Clip hero pentru telefon | 9:16, fără sunet, ≤ 30 s | 1 | F2 |
| 9 | Poster hero desktop / telefon (imaginea care apare înaintea clipului) | 16:9, min. 2400 × 1350 · 9:16, min. 1080 × 1920 | 2 | F2 |
| 10 | Câte o fotografie pentru fiecare din cele 8 categorii de preparate | 4:5, min. 1080 × 1350 | 8 | F3 |
| 11 | Saloanele Trattoria și Vittoria | 3:2, min. 1800 × 1200 | 3–10 pe salon | F3 |
| 12 | Hotel ANNA și cele 2 tipuri de camere | 3:2 | 3 + 2 | F3 |
| 13 | Cursul de pizza pentru copii | 3:2 | 1 + galerie (cel mult 12) | F3 |
| 14 | Galerie pe categorii (Restaurant, Preparate, Vinuri, Petreceri, Hotel, Evenimente) | min. 1600 px pe latura lungă | 6–8 pe Acasă, restul în galerie | F3 |
| 15 | Afișele serilor tematice | 4:5 | câte unul pe seară | la fiecare seară |
| 16 | Acordul părinților pentru fotografiile cu copii | confirmare scrisă | — | F3 (Q-25, OQ #8) |

## 3. Texte și liste

| # | Material | Unde în panou | Până la | Sursa |
|---|---|---|---|---|
| 17 | **Lista reală de vinuri** (nume, producător, tip, regiune, an, preț la sticlă și la pahar, volum) | Vinuri. Acum sunt 5 exemple, marcate „Provizoriu” | **F1 → F3** | OQ #5, Q-35 |
| 18 | Recenziile reale, pentru restaurant și pentru hotel | Recenzii (4 exemple acum) | F3 | D-06, OQ #4 |
| 19 | Cele 9 motive de sesizare de pe site-ul actual | Motive de sesizare (gol acum) | F3 | content-model 5.9, D-32 |
| 20 | Adresele celor 6 site-uri ale grupului fără link: Anna Delivery, Cofetăria Anna, Piscina Anna Summer Events, Anna Events, Riviera Events, Hotel Anna Junior | Linkuri grup | F3 | OQ #11 |
| 21 | Linkul paginii de Facebook a Trattoriei | Setări → Contact și program → Rețele sociale | F3 | C2, OQ #13 |
| 22 | Poziția restaurantului pe hartă (latitudine, longitudine) | Setări → Contact și program → Adresă | F3 | content-model R2 |
| 23 | Răspunsurile la cele 7 întrebări frecvente (sau altele) | Întrebări frecvente | F3 | Q-24 |
| 24 | Descrierile saloanelor și a camerelor; confirmarea capacităților 25 / 40 și a amplasării (etaj / mansardă) | Saloane, Tipuri de camere | F3 | A-08 |
| 25 | Cursurile de pizza: vârstă, durată, preț, locuri, cum se confirmă înscrierea | Pagina Acasă → Cursuri de pizza | F3 | Q-11, OQ #6 |
| 26 | Termenul de răspuns pe fiecare subiect (cazare, salon, curs, întrebare, sesizare) | Setări → Cereri și emailuri | F3 | Q-34, OQ #7 |
| 27 | Destinatarii emailurilor pentru Eveniment privat, Curs de pizza, Întrebare, Sesizare (Cazare are deja rezervari@hotelanna.ro) și adresa ta de copie | Setări → Cereri și emailuri | F3 | D-15, ADR-009 |
| 28 | Textele juridice: termeni, confidențialitate, cookies | Pagini legale (3 pagini provizorii) | F5 | Q-25, OQ #9 |
| 29 | ID-ul contului de statistici existent | Setări → Integrări → ID statistici | F5 | D-32 |
| 30 | Logo-ul oficial al premiului Wine Spectator, cu nivelul și anul | Premii și distincții | la primire | D-20 |

## 4. Deja completate din `docs/DECISIONS.md`

Tagline (D-01), adresa (Strada Victoriei nr. 8, Târgu Jiu), telefoanele (D-17), programul zilnic 8:00–24:00 (content-model R2), Instagram, YouTube, TikTok (D-18, D-30), linkul de recenzie Google, ID-ul ialoc 4385 (D-03), meniul digital, destinatarul pentru Cazare (D-15), redirecționarea `/valori-nutritionale` (D-19).

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
