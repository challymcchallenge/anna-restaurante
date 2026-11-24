# F3 · pașii 4–6 · Trattoria da Vittoria — raport (oprire înainte de pasul 7)

Data: 24.11.2026 · Stare: **gata, în așteptarea „GO”** · Decizii: D-44 (răspunsurile G3), D-45 (widgetul de cazare) · Commit-uri pe `main`: `3e591a3` (cazare), `28e6e5a` (slider), `8d6a630` (pașii 4–6), `291c2b9` (teste, contrast), `de342ce` (performanță, documente)

## 1. Concluzie

Am făcut cele trei lucruri cerute la GO. Toate sunt live pe adresa temporară: https://anna-restaurante-alinlabau-9308s-projects.vercel.app

1. **Widgetul de cazare arată ca referința ta** (D-45): bară-pastilă, calendar deasupra câmpului, camere cu −/+.
2. **Bucătăria are sliderul de categorii** (G3-1, D-44).
3. **Pașii 4–6:** Evenimente private, Petreceri și agenda, Cursuri de pizza, fiecare cu secțiunea de pe Acasă și pagina proprie.

| Țintă | Rezultat măsurat |
|---|---|
| Lighthouse mobil, performanță ≥ 85 | **Acasă (producție, înainte de ultima reparație): 85 / 87 / 91.** După ce panoul de cazare de pe telefon se montează la deschidere, Acasă local: 90 / 90 / 90 (rezultatul de producție e în secțiunea 3). Paginile noi, pe producție: Evenimente private 94 / 94, Petreceri 98 / 99, Cursuri de pizza 98 / 97 |
| Lighthouse mobil, accesibilitate ≥ 95 | **100** la toate rulările |
| Contrast ≥ 4,5:1, pe pagina afișată | **648 de rânduri pe 4 pagini, 0 sub prag**, minimum 5,38:1 |
| Teste de integrare | **30/30** (5 noi) |

## 2. Ce s-a construit

| Ce | Telefon | Desktop | Din panou |
|---|---|---|---|
| **Cererea de cazare** (D-45) | Butonul-fâșie deschide panoul S-01b cu aceleași câmpuri; calendarul și camerele se deschid în panou | Bară-pastilă pe copertă: Sosire ❖ Plecare ❖ Camere și oaspeți ❖ „Cere ofertă de cazare”; câmpul deschis are contur; calendarul și camerele apar deasupra | Pagina Acasă → Bară de cazare (titlu, notă, buton, maxime) |
| Calendarul | Săptămâna începe lunea; zilele trecute sunt inactive, azi e marcat, intervalul colorat. Tastatura: săgeți, PageUp/PageDown, Enter, Esc. După sosire se deschide singură plecarea | | — |
| Camere și oaspeți | „Camera 1: 2 adulți”, adulți și copii cu −/+, „Adaugă cameră”, „Șterge camera” (cel mult 4 camere [PRESUPUNERE]) | | maxime pe cameră: 6 adulți, 4 copii |
| **Bucătăria: slider** (G3-1) | Un card 4:5 și marginea următorului, derulare cu degetul | 4 carduri, săgeți care se dezactivează la capete; fără rotire automată | Categorii de preparate |
| **Petreceri** (Acasă, pe copertă) | Următoarele 3 seri, derulare | 3 carduri | Seri tematice; Pagina Acasă → Petreceri |
| Cardul unei seri | Afișul (cu data pe o etichetă) sau, fără afiș, data mare pe copertă; numele, ziua și ora, tipul, invitatul, intrarea, „Rezervă masă” (ialoc) | | Seri tematice |
| `/petreceri` (S-03) | Toate serile viitoare; fără seri: mesajul din panou, Facebook și Instagram, „Rezervă o masă pentru weekend” (S-03b); arhiva „Cum a fost” cu fotografiile serilor trecute | | Seri tematice → Fotografii după eveniment |
| **Evenimente private** (Acasă) | Tipurile (Onomastici, Botezuri…), cele 2 saloane („La etaj · până la 25 de invitați”), „Rezervă salonul”, „Vezi saloanele” | | Pagina Acasă → Evenimente private; Saloane |
| `/evenimente-private` (S-02) | Fiecare salon cu fotografiile lui (derulare), descrierea, dotările; banda „Rezervă salonul”; întrebările frecvente ale grupului | | Saloane; Întrebări frecvente (grup Evenimente private) |
| **Cursuri de pizza** (Acasă) | Fotografia, textul scurt, detaliile (doar cele completate), „Înscrie copilul”, „Totul despre curs” | | Pagina Acasă → Cursuri de pizza |
| `/cursuri-pizza-copii` (S-04) | Textul complet, detaliile, înscrierea, galeria foto-video, întrebările grupului Cursuri | | aceleași |

**Cum funcționează butoanele de cerere:** „Rezervă salonul” și „Înscrie copilul” deschid formularul de Contact cu subiectul ales, dar numai dacă subiectul e pornit în Setări → Cereri și emailuri. Acum subiectele sunt oprite, pentru că lipsesc destinatarii (#27). Până le pornești, butoanele sună: saloanele la manager (0764 816 462, D-17), cursul la rezervări.

**O secțiune oprită în panou** dispare de pe Acasă, din meniu, și pagina ei dă 404.

## 3. Cifrele

### 3.1 Lighthouse 13.6.0, mobil (producție)

| Pagina | Rulări | Performanță | Accesibilitate | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| Acasă (deploy `dpl_8oCNCK…`) | 3 | 85 / 87 / 91 | 100 | 3,1–3,3 s | 110–350 ms | 0 |
| Acasă (după montarea la cerere, deploy `de342ce`) | 3 | vezi 3.2 | 100 | | | |
| Evenimente private | 2 | 94 / 94 | 100 | 0,8 s | 290–300 ms | 0 |
| Petreceri | 2 | 98 / 99 | 100 | 0,8 s | 140–180 ms | 0,001 |
| Cursuri de pizza | 2 | 98 / 97 | 100 | 0,8 s | 160–190 ms | 0,017 |

SEO 66 peste tot: `noindex` intenționat pe adresa temporară (ADR-012).

### 3.2 Acasă după reparație

Local, build de producție: 90 / 90 / 90, TBT 80–100 ms. Cauza scăderii: Acasă avea 817 noduri în DOM (față de 623 după pașii 1–3), iar widgetul de cazare era randat de două ori: în bară și, ascuns, în panoul de pe telefon. Acum panoul se montează la prima deschidere.

### 3.3 Contrast pe randare

| Pagina | Telefon | Desktop | Cel mai slab |
|---|---|---|---|
| Acasă | 142 rânduri, 0 sub prag | 170, 0 | 5,38:1 (etichetele „Sosire” / „La etaj…”, folio pe hârtie) |
| Evenimente private | 60, 0 | 64, 0 | 5,38:1 |
| Petreceri | 57, 0 | 61, 0 | 5,85:1 |
| Cursuri de pizza | 45, 0 | 49, 0 | 6,43:1 |

Fișiere: `docs/f3/contrast-pasii-4-6-*.json`. Am corectat trei erori ale scriptului de măsurare:

1. Măsura textul din răspunsurile frecvente închise, care nu se vede.
2. Măsura rândurile aflate pe jumătate sub bara fixă de jos.
3. Nu ținea seama că secțiunile cu `content-visibility` își schimbă înălțimea când apar.

Am verificat fiecare caz pe captură. Nu era o problemă de culoare.

### 3.4 Alte verificări

- **Fără derulare orizontală pe 4 pagini × 2 lățimi:** am găsit și reparat o lățire falsă a paginii în Chrome, cauzată de coloanele în procente ale benzilor cu derulare (`contain: paint`).
- **Widgetul de cazare (Playwright):**
  - săgeata dreapta de două ori + Enter alege 27 noiembrie, iar panoul se închide;
  - 2 camere (2 + 0 și 1 + 1) dau „2 camere · 3 adulți, 1 copil”;
  - trimiterea duce la `/contact?subiect=cazare&sosire=2026-11-24&plecare=2026-11-27&camere=2&adulti=2&copii=0&adulti=1&copii=1`;
  - pe telefon, Esc închide doar calendarul, nu și panoul.

## 4. Capturi

`design/f3/capturi/2026_11_24_Trattoria_F3_P46_*.webp`:
- cazarea: calendar desktop, camere desktop, 1024 px, calendar telefon;
- sliderul de categorii: desktop și telefon;
- Acasă: primul ecran și pagina întreagă, telefon și desktop;
- cele 3 pagini noi, telefon și desktop.

Referințele tale: `design/f3/referinte/`.

## 5. Ce lipsește (detalii și locul din panou: `docs/materiale-necesare.md`)

| # | Ce | Pe site acum |
|---|---|---|
| 11 | Fotografiile saloanelor (3–10 fiecare) | numele salonului pe copertă |
| 13 | Fotografia și galeria cursului de pizza | „Cursuri de pizza” pe copertă |
| 15 | Afișele serilor | data mare pe copertă |
| 23 | Răspunsurile la întrebările frecvente | 3 pe pagina saloanelor, etichetate |
| 24 | Descrierile reale ale saloanelor | textul „Descriere de înlocuit…” |
| 25 | Vârsta, durata, prețul, locurile la curs | ascunse până le completezi |
| 27 | Destinatarii pentru Eveniment privat și Curs de pizza | butoanele sună până atunci |

## 6. Skill-uri și reguli

- **Impeccable:** am continuat în aceeași direcție (fără direcție nouă) și am respectat `craft-floor`. Fără etichete deasupra titlurilor: tipul serii stă după nume, nu deasupra. Un singur buton principal pe ecran: pe copertă, cardurile au butoane fantomă.
- **Taste:** fără carusel cu rotire automată, micro-animații (fotografia crește 1,03, butoanele urcă 1 px).
- **UI UX Pro Max:** ținte de 44 px la −/+ și săgeți, `aria-label` pe butoanele cu iconiță, focus vizibil în calendar.

## 7. Ce alegi tu

| # | Întrebare | Ce am făcut |
|---|---|---|
| G4-1 | „Rezervă masă” pe cardul unei seri cu data serii preselectată în ialoc? | Deschide fereastra obișnuită. Data cere o a doua inițializare ialoc, neprobată (F0 a probat una); o probez la pasul 9, cu acordul tău pentru testul de rețea spre ialoc |
| G4-2 | „Agenda lunii” la Evenimente private (PLAN) lipsește din wireframe-ul S-02 | Agenda e pe `/petreceri`; nu am pus-o și pe pagina saloanelor |
| G4-3 | Câte camere într-o cerere de cazare? | Cel mult 4 [PRESUPUNERE]; maximele de adulți și copii se aplică pe cameră |

## 8. Pașii următori propuși (după GO)

F3 pașii 7–9:
- **7:** Cazare Hotel ANNA (prezentare, galerie, recenziile hotelului).
- **8:** Galeria mozaic.
- **9:** Contact, cu formularul care primește parametrii de la cazare și de la butoanele de cerere, plus pagina de sesizări.

Emailurile Resend (pasul 11) și testul cu domeniul verificat rămân pentru F5 (D-36).

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
