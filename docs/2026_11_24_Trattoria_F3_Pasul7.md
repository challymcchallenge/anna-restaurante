# F3 · pasul 7 · Cazare la Hotel ANNA · Trattoria da Vittoria — raport (oprire înainte de pasul 8)

Data: 24.11.2026 · Stare: **gata, în așteptarea „GO” pentru pasul 8** · Decizie: D-48 (G5 și pasul 7) · Commit pe `main`: `20c6b43`

## 1. Concluzie

Secțiunea **Cazare · Hotel ANNA** e pe Acasă, live: https://anna-restaurante-alinlabau-9308s-projects.vercel.app/#hotel

| Țintă | Rezultat măsurat |
|---|---|
| Lighthouse mobil, performanță ≥ 85 | **Acasă: 86 / 90 / 92 (mediana 90)** (înainte: 90 / 89 / 90) |
| Lighthouse mobil, accesibilitate ≥ 95 | **100** la toate rulările |
| Contrast ≥ 4,5:1, pe pagina afișată | **420 de rânduri, 0 sub prag**, minimum 5,38:1 |
| Teste de integrare | **39/39** (4 noi) |
| Derulare orizontală (390, 1024, 1440 px) | **0 px** |

## 2. Ce s-a construit

| Ce | Cum arată | Din panou |
|---|---|---|
| Prezentarea | Pe copertă, după Cursurile de pizza (care sunt pe hârtie). Titlul „După cină, rămâi peste noapte.”, textul, adresa hotelului cu pictograma de hartă | Pagina Acasă → Cazare · Hotel ANNA |
| Prețul „de la” | Apare doar dacă îl completezi (wireframe, nota 12). Acum e gol | Preț „de la” / Mențiune la preț |
| Fotografiile | Prima mare, celelalte două dedesubt. Fără fotografii apare „Hotel ANNA” pe copertă, ca la saloane | Fotografii (cel mult 3) |
| Camerele | Câte un card pentru fiecare tip: fotografia (sau numele pe copertă), numele, descrierea | Tipuri de camere |
| Recenziile hotelului | Cel mult 3 din grupul Hotel. Acum e 1, cu eticheta „Exemplu · de înlocuit” | Recenzii → Grup: Hotel |
| „Cere ofertă de cazare” | Butonul principal. Duce la Contact cu subiectul Cazare (D-15); pagina Contact vine la pasul 9, până atunci linkul dă 404 (G3-3). Eticheta e cea din bara de cazare, ca aceeași acțiune să aibă același nume | Pagina Acasă → Bară de cazare → Etichetă buton |
| „Vezi hotelanna.ro” | Link secundar, se deschide în filă nouă. Domeniul se scrie singur din adresa din panou | Site-ul hotelului |
| Meniul | „Hotel ANNA” duce la `/#hotel` | Eticheta din meniu |

**Fără pagină proprie:** hotelul are site-ul lui (hotelanna.ro). O pagină în plus ar repeta același conținut.

## 3. Cifrele

### 3.1 Lighthouse 13.6.0, mobil, pe producție (`20c6b43`)

| Rulare | Performanță | Accesibilitate | LCP | TBT | CLS |
|---|---|---|---|---|---|
| 1 | 86 | 100 | 3,2 s | 270 ms | 0 |
| 2 | 90 | 100 | 3,1 s | 200 ms | 0 |
| 3 | 92 | 100 | 3,2 s | 130 ms | 0 |

Acasă are acum 892 de elemente în pagină (înainte: 829). SEO e 66, din cauza `noindex`, pus intenționat pe adresa temporară (ADR-012).

### 3.2 Contrast pe randare (`docs/f3/contrast-pasul-7-acasa.json`)

| Lățime | Rânduri | Sub 4,5:1 | Cel mai slab |
|---|---|---|---|
| Telefon | 196 | 0 | 5,38:1 (aceleași etichete folio pe hârtie, de la pașii 4–6) |
| Desktop | 224 | 0 | 5,38:1 |

### 3.3 Capturi

`design/f3/capturi/2026_11_24_Trattoria_F3_P7_hotel-{telefon,1024,desktop}.webp`

O problemă găsită pe capturi și reparată înainte de publicare: clasele `.rooms` / `.room` erau deja folosite de panoul „Camere și oaspeți” din bara de cazare, iar cardurile camerelor primeau fundalul de hârtie. Le-am redenumit `hotel-rooms` / `hotel-room`.

## 4. Ce lipsește (`docs/materiale-necesare.md`)

| # | Ce | Pe site acum |
|---|---|---|
| 12 | Fotografiile hotelului (3) și ale celor 2 tipuri de camere | numele pe copertă |
| 18 | Recenziile reale ale hotelului | 1 exemplu, etichetat |
| 24 | Descrierile camerelor | „Descriere scurtă, de înlocuit.” |
| 35 | Prețul „de la” (opțional) | ascuns |

## 5. Pașii următori (după GO)

- **Pasul 8:** galeria mozaic pe categorii.
- **Pasul 9:** Contact cu formularul, pagina de sesizări și proba ialoc cu data serii (G4-1).

Pagina HTML a raportului (privată): https://claude.ai/artifact/GRtdrB3zztE7wzQutnfbkj

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
