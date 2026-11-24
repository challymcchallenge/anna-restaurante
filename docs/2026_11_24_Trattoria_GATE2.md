# GATE 2 · Trattoria da Vittoria — raport faza 2 (direcție de design)

Data: 24.11.2026 · Stare: **GO primit: B · Carta, cu butoane verzi (D-41); fonturi gratuite, setul de 4 (D-42); pictograma desenată (D-43). F2 închis** · Commit-uri: `22083c5` (skill-uri, PRODUCT.md), `a373348` (direcții, contrast, logo-uri) și următoarele, pe `main`

## 1. Concluzie

Cele două direcții sunt gata. Le vezi pe telefon (390 px) și pe desktop (1440 px), cu hero, bara de cazare și insigna premiului. **Tot textul trece de 4,5:1**, măsurat pe pixelii reali de sub fiecare rând, inclusiv textul peste fotografie:

| Direcție | Telefon | Desktop |
|---|---|---|
| A · Cotto | minimum 5,09:1 (21 de rânduri) | minimum 5,09:1 (40 de rânduri) |
| B · Carta | minimum 6,82:1 (34 de rânduri) | minimum 5,67:1 (48 de rânduri) |

Fonturile sunt gratuite (licență OFL) și apropiate de cele de pe vineyard.co.za. Toate 4 au ș, ț, ă, â, î corecte, verificate în fișierul fontului. Logo-urile Trattoria, Grupul ANNA și BizTech intră în Biblioteca media a Trattoriei la următorul build. **Recomandarea mea: B · Carta**, motivele sunt în secțiunea 3.

## 2. Unde am rămas (din fișiere și din istoricul git)

1. F0 și F1 sunt închise cu GO (`docs/2026_11_24_Trattoria_GATE0.md`, `..._GATE1.md`). Deciziile ajung la D-40.
2. Producția rulează pe Vercel (dub1) și Supabase (eu-west-1), cu Payload 3.94.1 și Next.js 16.4.6. Panoul are 20 de colecții, 52 de elemente marcate „Exemplu · de înlocuit” și RLS pe 57/57 tabele.
3. Site-ul public nu există încă (F3). F2 a pornit de la wireframe-urile S-01 / S-01b și de la `design/content-model.md`.
4. Deschise pentru F2 erau OQ #1 (brand), OQ #2 (clipuri și postere hero) și setul de fonturi G3, amânat din F1.
5. Estimarea totală rămâne 13–17 sesiuni. F2 s-a făcut într-o sesiune.

## 3. Cele două direcții

Le-am ales cu skill-ul Impeccable. Am scris 7 direcții posibile, din lumea unei trattorii și din Târgu Jiu, ordonate după cât de bine se potrivesc. Tragerea la sorți (`concept-seed`) a ales a 6-a, „Cotto”. Regula Impeccable îmi permite să adaug alegerea mea de top, „Carta”.

| | **A · Cotto** (direcția trasă la sorți) | **B · Carta** (alegerea mea) |
|---|---|---|
| Ideea | Bucătăria de familie italiană, ziua: podea de teracotă (cotto), pereți cu var, plăci așezate cu rost | Meniul și lista de vinuri, seara: copertă închisă cu folio auriu, pagini de hârtie crem |
| Pentru cine lucrează cel mai bine | Familii, cursurile de pizza, prânzul | Vizitatorul nr. 1 (localnici la cină și ocazii), vinurile și premiul |
| Paletă | Calce `#F2E8DC`, cotto `#9A4428`, cotto ars `#7C3420`, cerneală `#2B1D17`, alamă `#E4BF7E` (doar etichete pe cotto ars) | Copertă `#1C1416`, folio `#D6AE66` (din inelul logo-ului), hârtie `#F5EDE0`, cerneală `#241A17`, bordo `#7B2333` |
| Strategia de culoare | Teracota ține câmpuri întregi: placa din hero, bara de cazare, cardurile | Paletă completă cu 4 roluri. Coperta e hero-ul, hârtia e conținutul |
| Titluri | **Tenor Sans** (lat, „roman”, ca o inscripție) | **Belleza** (cea mai apropiată de Optima) |
| Text | **Host Grotesk** | **Hanken Grotesk** (cea mai apropiată de PP Mori) |
| Semnătura | Rostul de 3 px dintre plăci, muchii drepte, fără degradeuri între culori | Chenarul dublu de folio al copertei și rândurile de meniu cu linie de puncte |
| Hero | Fotografia pe toată lățimea; textul pe o placă de cotto, nu pe imagine | Fotografia pe toată lățimea, cu o umbră caldă dinspre stânga; textul direct pe imagine |
| Bara de cazare | Rând de plăci pe cotto ars, cu rost între ele | Fâșie de hârtie, ca o notă prinsă de meniu |
| Stil foto | Lumină de zi, de sus sau la 45°: făină, mâini, paste, aluat | Seară, lumină caldă: cuptorul, pahare, flacără, prim-planuri |
| Mișcare (un singur moment) | Placa și bara „se așază” una după alta, 620 ms | Chenarul de folio se trasează o dată, textul urcă 12 px |
| Riscul | Fotografiile reci, verzi sau albastre se bat cu teracota. Merge doar cu fotografii calde | Negru cu auriu poate părea „scump”, deci intimidant (anti-obiectivul tău). Îl echilibrează hârtia crem, fotografiile cu oameni și textele calde |

**De ce recomand B:** vizitatorul nr. 1 vine la cină. B pune în prim-plan exact ce poți spune doar tu: seara, vinurile și premiul. Folosește și singurul font care seamănă cu adevărat cu Optima de pe vineyard.co.za (Belleza). Cere însă fotografii de seară bune. A e mai cald pentru familii și mai sigur pe telefon, unde textul nu stă niciodată pe fotografie.

Comun ambelor: bara fixă de jos pe telefon (Rezervă o masă · Meniu · Sună), insigna lângă tagline (72 px pe telefon, 96 px pe desktop), eticheta „Exemplu · de înlocuit” cu iconiță și text, `prefers-reduced-motion` respectat și ținte de atingere de 48–52 px.

## 4. Contrastul, cifrele

### 4.1 Pe randarea reală (scripts/f2/contrast-measure.mjs)

Pentru fiecare rând de text: culoarea textului față de **fiecare pixel** de sub el, cu textul ascuns. Valoarea raportată e percentila 5, adică pixelul aproape cel mai slab. Rezultatele complete sunt în `docs/f2/contrast-a-cotto.json` și `docs/f2/contrast-b-carta.json`.

| Element | A telefon | A desktop | B telefon | B desktop |
|---|---|---|---|---|
| Tagline (h1) | 5,90 | 5,90 | **7,97** (peste fotografie; cel mai slab pixel 6,88) | 14,34 (peste fotografie) |
| Insigna (text) | 5,90 | 5,90 | 13,39 | 14,87 |
| Subtitlul | 5,90 | 5,90 | 13,13 | 14,35 |
| „Rezervă o masă” | 5,90 | 5,90 | 8,70 | 8,70 |
| Bara de cazare: titlu / etichete / valori | 8,05 / 5,09 / 8,05 | 8,05 / 5,09 / 8,05 | 14,63 | 14,63 / 5,67 / 14,63 |
| „Cere ofertă de cazare” | — | 8,05 | — | 8,20 |
| Antet: telefon, RO | 13,44 | 13,44 | 6,82 | 7,71 / 7,84 |
| Eticheta „Exemplu · de înlocuit” | 13,02 | 12,83 | 12,97 | 12,83 |
| **Minimul paginii** | **5,09** | **5,09** | **6,82** | **5,67** |

Am reparat în timpul lucrului: în B, telefonul și „RO” din antet stăteau peste tencuiala luminoasă a cuptorului (4,18:1 și 4,29:1). Am întărit umbra de sus: acum 7,71:1 și 7,84:1.

### 4.2 Perechile din paletă (WCAG 2.x)

| Direcție | Text | Fundal | Contrast |
|---|---|---|---|
| A | Cerneală `#2B1D17` | Calce `#F2E8DC` | 13,44:1 |
| A | Text secundar `#5C463B` | Calce | 7,25:1 |
| A | Cremă `#FAF3EA` | Cotto `#9A4428` | 5,90:1 |
| A | Cremă | Cotto ars `#7C3420` | 8,05:1 |
| A | Alamă `#E4BF7E` | Cotto ars | 5,09:1 |
| B | Cremă `#F3E9DA` | Copertă `#1C1416` | 15,05:1 |
| B | Cremă secundar `#BDAE9C` | Copertă | 8,35:1 |
| B | Folio `#D6AE66` | Copertă | 8,70:1 |
| B | Copertă (pe buton auriu) | Folio | 8,70:1 |
| B | Cerneală `#241A17` | Hârtie `#F5EDE0` | 14,63:1 |
| B | Text secundar `#5A4A42` | Hârtie | 7,25:1 |
| B | Folio închis `#7A5628` | Hârtie | 5,67:1 |
| B | Cremă | Bordo `#7B2333` | 8,20:1 |

Interzise pentru text, doar decor: alamă pe cotto (3,73:1) și cotto deschis `#C9774F` pe calce (2,78:1).

## 5. Fonturile

| Font | Rol | Seamănă cu | Licență | ș ț ă â î | Greutăți |
|---|---|---|---|---|---|
| Belleza | titluri B | Optima (vineyard.co.za) | OFL 1.1, gratuit | da, ș și ț cu virgulă (U+0218–021B) | 400 |
| Tenor Sans | titluri A | Optima, mai lat | OFL 1.1 | da | 400 |
| Hanken Grotesk | text B | PP Mori (vineyard.co.za) | OFL 1.1 | da | 100–900 + italic |
| Host Grotesk | text A | PP Mori | OFL 1.1 | da | 300–800 + italic |

Verificarea: `fontTools`, pe fișierele `@fontsource/*` 5.3.0, plus o planșă randată (virgulă, nu sedilă).

Respinse:
- **Marcellus:** nu are ș și ț cu virgulă (U+0218–021B lipsesc).
- **Cagliostro:** nu are subsetul latin-ext.
- **Playfair Display / Karla**, propuse de UI UX Pro Max: nu seamănă cu fonturile de pe vineyard.

**Originalele:** Optima (Linotype/Monotype) și PP Mori (Pangram Pangram) sunt comerciale. Prețul licenței web **nu l-am verificat**. Dacă le vrei pe cele exacte, e o cheltuială de decis (D-31).

## 6. Skill-urile folosite

Taste, Impeccable și UI UX Pro Max nu erau instalate în sesiunea cloud. Le-am instalat la cererea ta, cu metoda recomandată de autori, în proiect și global. Versiunile sunt în `docs/versions.md`.

| Skill | Ce am folosit | Rezultat |
|---|---|---|
| Impeccable 4.10.0 | `context`, interviul pentru `PRODUCT.md` (3 întrebări), `concept-seed`, `craft-floor`, `detect`, `first-viewport` | Direcția trasă: A; alegerea mea: B. Toate verificările de prim ecran trec, la ambele direcții. 2 excepții înguste ale detectorului, cu motiv (secțiunea 8) |
| UI UX Pro Max 2.15.0 | `--design-system` pentru „restaurant italian” și căutare în baza de fonturi | Recomandare generică (roșu cu auriu, Playfair/Karla). Am păstrat doar lista de verificare: 4,5:1, 44 px, `prefers-reduced-motion` |
| Taste 2.5.1 | Regulile pentru localuri (fotografia conduce, bara de telefon, un îndemn pe ecran, micro-animații) și `photos.mjs search` pentru fotografii provizorii | 6 fotografii Wikimedia Commons cu licență liberă (CC0, CC BY, CC BY-SA), cu credite. 9 fișiere descărcate de Taste erau corupte; le-am refăcut din sursă |
| design-elevation (design-skills) | Protocolul de rafinare | Scară de spațiere pe 4 px, un singur accent pe ecran |

Conflicte, rezolvate după `CLAUDE.md`:
- Taste interzice telefoanele reale, adresa completă și hero-urile întunecate la localuri. Am păstrat telefoanele (D-17) și hero-ul închis din B, pentru că scena e cina.
- Impeccable interzice etichetele deasupra titlurilor. Nu am folosit niciuna.

## 7. Logo-uri în Biblioteca media

| Fișier | În bibliotecă | În Setări |
|---|---|---|
| `seed/media/trattoria-da-vittoria/logo-trattoria-da-vittoria.png` (1024 × 1024, PNG transparent) | „Logo Trattoria da Vittoria”, tip Logo | Logo principal |
| `.../logo-grup-anna.png` (1009 × 1008) | „Logo Grupul ANNA” | Logo grup (footer) |
| `.../logo-biztech-consulting.png` (1024 × 1024) | „Logo BizTech Consulting (realizator)” | — (pe site, creditul rămâne text, ADR-013) |

**Aplicat pe producție (24.11.2026, 14:08 UTC):** deploy `dpl_9YX6qkL7k2aDqxo1MzorMUpiiJKB` READY în 41 s. Conținutul de pornire a raportat `{"media":3,"settingsMedia":2}`: 3 logo-uri create (id 3, 4, 5, restaurantul 1), fiecare cu 10 variante AVIF/WebP, iar Logo principal și Logo grup au fost completate. URL-urile publice Supabase răspund 200 (1.005.590, 600.777 și 687.204 octeți). Un logo șters intenționat din panou nu mai e pus la loc. Setările se completează doar dacă sunt goale. Probat pe o bază locală: 16/16 teste de integrare, dintre care 2 noi.

## 8. Excepții ale detectorului Impeccable (în `.impeccable/config.json`)

| Regulă | Fișier | Motiv |
|---|---|---|
| `low-contrast` | `design/f2/directia-b-carta.html` | Fals pozitiv: detectorul compară textul crem cu fundalul paginii, nu cu coperta. Măsurat pe randare: minimum 5,67:1 |
| `cream-palette` | ambele machete | Cremul vine din marmura logo-ului (`#F8EAD8` măsurat), deci e o culoare a brandului |

## 9. Ce lipsește (detaliile sunt în `docs/materiale-necesare.md`)

| # în listă | Ce | Stare acum |
|---|---|---|
| 1, 3 | Logo Trattoria, logo ANNA | **primite**; intră în bibliotecă la build |
| 2 | Logo pe fundal închis | nu mai e necesar: medalionul se vede bine și pe copertă (B) |
| 4 | Pictograma de filă | **lipsește**: medalionul nu se citește la 32 px. Propun un „V” din script-ul logo-ului, pe fond crem (de desenat; îmi spui dacă îl fac eu) |
| 5 | Culori și fonturi | propuse aici; se închid la alegerea ta |
| 7, 8 | Clipurile hero, 16:9 și 9:16 | mai târziu (cum ai spus); acum fotografii provizorii |
| 9 | Posterele hero | mai târziu; acum fotografii provizorii |
| 31 (nou) | Fotografii pentru direcția aleasă | A: zi, făină, mâini, paste. B: seară, cuptor, pahare, oameni la masă. Cele 5 fotografii provizorii din machete se înlocuiesc |

## 10. Ce aleg eu, ce alegi tu

| # | Decizie | Propunerea mea |
|---|---|---|
| G2-1 | **Direcția: A · Cotto sau B · Carta** | **B** |
| G2-2 | Fonturile: OFL gratuite (Belleza/Hanken sau Tenor/Host) sau originalele plătite (Optima + PP Mori) | gratuite; originalele doar dacă vrei identic vineyard |
| G2-3 | Setul aprobat G3 (fonturile din care aleg toate restaurantele) | toate 4 fonturile verificate. Fiecare restaurant alege câte un font pentru titluri și unul pentru text |
| G2-4 | Pictograma de filă (favicon) | un „V” din script-ul logo-ului; îl desenez eu, dacă vrei |

## 11. Planul pentru după GO

1. `docs/design-system.md`: tokenii direcției alese, tipografia, spațierea, componentele (buton, insignă, bara de cazare, bara de jos, eticheta „Exemplu”), mișcarea și stilul foto.
2. Variabilele de temă pe restaurant: câmpurile „Font titluri” și „Font text” în Setări, din setul aprobat G3 (migrație nouă), plus culorile direcției puse în Setările Trattoriei. Panoul verifică deja contrastul de 4,5:1 la salvare.
3. Contractul direcției, în fișa de suprafață Impeccable, pentru F3.

## 12. După GO (24.11.2026)

Ce a cerut Alin: „GO B, dar culorile butoanelor să fie mai atractive (poate o paletă de verde pentru cele roșii?), fonturi gratuite, dar și câteva variante de font potrivite pentru restaurant și hotel (plus cât ar costa fonturile vineyard), setul de 4, desenează tu favicon-ul.”

| Cerere | Rezultat |
|---|---|
| Butoane mai atractive, verde în loc de roșu | Bordo `#7B2333` → **verde smarald `#14613F`**, din familia verdelui din steag (`#036625` măsurat, prea strident pentru butoane). Butonul principal: folio cu luciu (`#E2BD78` → `#CFA45A`), lumină interioară și umbră caldă. Contrast măsurat: auriu 8,63:1, verde 6,43:1; minimul paginii 6,43 pe telefon și 5,67 pe desktop. Verdele nu se folosește pe copertă (2,42:1). Comparația celor 3 verzi și a bordo-ului e în istoricul sesiunii; ales: smarald |
| Variante de fonturi pentru restaurant și hotel | `design/f2/fonturi.html`: **8 perechi** OFL pe copertă și pe hârtie, cu butoanele noi: Belleza + Hanken (aleasă), Tenor + Host, Bodoni Moda + Hanken, Cormorant Garamond + Albert Sans, Gilda Display + Jost, Cinzel + Figtree, Bellefair + Mulish, Forum + Schibsted. Toate trec testul ș ț ă â î. Respinse: Marcellus, Italiana, Della Respira și Cagliostro (fără ș și ț cu virgulă) |
| Cât costă fonturile vineyard | **Optima Nova Regular:** 57,99 USD pentru 10.000 de afișări pe lună (MyFonts; 104,09 / 25.000; 144,98 / 50.000). **PP Mori:** „de la 40 USD” pe licență și greutate; pentru firme, 1 an. **Estimare: ≥ 178 USD în primul an** pentru Trattoria (Optima Nova Regular + 3 greutăți Mori), Mori anual, și licențe separate pe fiecare restaurant. Detalii și surse: `docs/versions.md`, F-1…F-4 |
| Setul de 4 | `src/theme/fonts.ts`; în Setări: „Font titluri” (Belleza / Tenor Sans), „Font text” (Hanken / Host) |
| Favicon desenat | `design/brand/favicon/`: SVG detaliat, SVG pentru 16–48 px, PNG 512 / 192 / 180 / 48 / 32 / 16, ICO. În Biblioteca media și în Setări → Pictogramă de filă |
| `docs/design-system.md` | Culori, contraste, tipografie, spațiere, componente, mișcare, fotografie, tema pe restaurant, verificare |
| Tema pe restaurant | Setări → Culori: 6 roluri (fundal, text, fundal închis, text pe fundal închis, accent, accent secundar), cu 5 perechi verificate la 4,5:1 la salvare. Variabile CSS în `src/theme/theme.ts`. Migrația `20261124_143006_f2_theme` (4 coloane). Trattoria primește tema B prin `settingsFill`, doar în câmpurile goale |
| Teste | Integrare **20/20** (4 noi pentru temă). `tsc` fără erori, lint 0 erori, build local reușit |
| Aplicat pe producție | Deploy `dpl_B9f94cbyAu26Lz9iF5Dez9fJDqL4` READY în 56 s. Migrația `f2_theme` a rulat în 141 ms. Conținutul de pornire a raportat `{"media":1,"settingsMedia":1,"settingsFill":9}`. Verificat prin SQL de citire: Trattoria are cele 6 culori, Belleza + Hanken Grotesk, tema deschisă, logo (3), logo grup (4) și pictograma de filă (6). Biblioteca media are 4 logo-uri, fără dubluri |
| **Incident (rezolvat)** | Push-ul pe ramura sesiunii a pornit un build de **preview** în paralel cu producția. Preview-ul folosește aceeași bază de date și a încercat aceeași migrație. A picat la prima instrucțiune („type already exists”), într-o tranzacție, fără efecte și fără să ruleze conținutul de pornire. Cauza era în `scripts/vercel-build.sh` din F0. Reparat: migrațiile și conținutul de pornire rulează acum doar când `VERCEL_ENV=production` |
| Contractul direcției pentru F3 | `.impeccable/surfaces/design-f2-directia-b-carta-html.md` (Impeccable), legat de `src/app/(frontend)/page.tsx` |

## 13. Fișiere

- Machete: `design/f2/directia-a-cotto.html`, `design/f2/directia-b-carta.html`
- Pagina de comparație: `design/2026_11_24_Trattoria_Directii_F2.html`, publicată privat la https://claude.ai/artifact/EdsBx1Fghq6us6soUPfBG5
- Capturi: `design/f2/capturi/f2-a-cotto-{telefon,desktop}[-pagina].webp`, `design/f2/capturi/f2-b-carta-{telefon,desktop}[-pagina].webp`
- Contrast: `docs/f2/contrast-*.json`, `scripts/f2/contrast-measure.mjs`, `scripts/f2/capture.mjs`
- Context pentru skill-uri: `PRODUCT.md`
- După GO: `docs/design-system.md`, `design/f2/fonturi.html`, `design/brand/favicon/`, `src/theme/`, `src/migrations/20261124_143006_f2_theme.ts`, `tests/int/f2-theme.int.spec.ts`, `.impeccable/surfaces/design-f2-directia-b-carta-html.md`

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
