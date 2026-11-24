# F3 · pașii 1–3 · Trattoria da Vittoria — raport (oprire înainte de pasul 4)

Data: 24.11.2026 · Stare: **gata, în așteptarea „GO”** · Commit-uri pe `main`: `3d8d06b` (pasul 1), `e8ae93e` (pasul 2), `613dbcd` (pasul 3), `18251b5` (teste, reparații), `38b52a4` (performanță, capturi) · Producție: deploy `dpl_5Ns3FSy4Ha3oNo3kpyhUuQVG3w8h`, READY

## 1. Concluzie

Antetul, navigarea, footerul, hero-ul cu cererea de cazare și secțiunea Restaurant (Bucătăria, Vinuri, Ce spun oaspeții) sunt construite pe direcția B · Carta și **sunt live pe adresa temporară**: https://anna-restaurante-alinlabau-9308s-projects.vercel.app (neindexată, fără parolă).

| Țintă | Rezultat măsurat |
|---|---|
| Lighthouse mobil, performanță ≥ 85 (D-26) | **Producție: 86 / 91 / 90 / 91 / 95, mediană 91** (5 rulări). Local, build de producție: 90 / 90 / 93 |
| Lighthouse mobil, accesibilitate ≥ 95 | **100** la toate cele 8 rulări (5 producție + 3 local) |
| Contrast text ≥ 4,5:1, pe randare | **268 de rânduri, 0 sub prag.** Minimum 5,85:1 pe telefon, 5,38:1 pe desktop; tagline-ul peste fotografie 8,05:1 (telefon) și 14,35:1 (desktop) |
| Nimic specific Trattoriei în componente | Culorile și fonturile vin din Setări (`src/theme`), textele și imaginile din panou, telefoanele, linkurile și ID-ul ialoc din Setări |
| Teste de integrare | **25/25**, rulate de două ori la rând pe o bază proaspătă (5 noi pentru F3) |

## 2. Unde am rămas (din fișiere și istoricul git)

1. F0, F1 și F2 sunt închise cu GO; deciziile ajung la D-43 (B · Carta cu butoane verzi, fonturi OFL Belleza + Hanken, pictograma desenată).
2. Producția rulează pe Vercel (dub1) + Supabase (eu-west-1), Payload 3.94.1 / Next 16.4.6; panoul are tema pe restaurant și logo-urile.
3. Site-ul public nu exista: `page.tsx` era pagina de verificare din F0. Acum are pașii 1–3.
4. Contractul direcției: `.impeccable/surfaces/design-f2-directia-b-carta-html.md`; macheta-sursă: `design/f2/directia-b-carta.html`.
5. Deschise pentru F3: clipul și posterele hero, fotografiile pe categorii, lista de vinuri, recenziile reale, G2-5 (fonturi; implicit Belleza + Hanken).

## 3. Ce s-a construit

| Pas | Ce vede vizitatorul | De unde vine conținutul |
|---|---|---|
| 1 · Antet | Logo-medalion în centru; navigarea din secțiunile pornite (ce nu încape în antet stă în „Mai mult”); telefonul de rezervări, limba (RO), „Rezervă o masă”. Pe desktop, după primul ecran, antetul rămâne sus, compact | Pagina Acasă → fiecare secțiune: Pornită, Ordine, Etichetă în meniu; Setări → Logo, Telefon rezervări |
| 1 · Navigare | Panoul de navigare (telefon: ecran întreg; desktop: din „Mai mult”), cu Esc, focus pe „Închide”, restul paginii inert | aceleași |
| 1 · Footer | Contact (adresă, „Zilnic 8:00–24:00”, cele 2 telefoane D-17), rețelele (4 iconițe), Grupul ANNA (11 linkuri, D-40), Premii și distincții (insigna 56 px), Informații (3 pagini legale + Sesizări), limba, drepturile, creditele foto într-un rând, creditul BizTech pe 2 rânduri (ADR-013) | Setări, Linkuri grup, Premii, Pagini legale, Pagina Acasă → Footer |
| 1 · Bara de jos (telefon) | „Rezervă o masă” · „Meniu” · „Sună”, fixă | Setări → ID ialoc, Meniu digital, Telefon |
| 2 · Hero | Fotografia (sau clipul) pe toată lățimea, umbra caldă dinspre stânga, chenarul dublu de folio care se trasează o dată; tagline-ul în engleză (D-01), insigna rezervată 72/96 px (D-20), subtitlul, „Rezervă o masă” + „Meniu” | Pagina Acasă → Hero (poster/clip telefon și desktop), Setări → Tagline, Premii |
| 2 · Clip | Pornește după încărcarea paginii, peste poster; AV1/HEVC apoi H.264; buton de pauză; fără clip la „reducerea mișcării” sau economie de date | Pagina Acasă → Hero → Video (încă gol: #7, #8) |
| 2 · Cazare (D-15) | Desktop: fâșia de hârtie (Sosire, Plecare, Adulți, Copii, „Cere ofertă de cazare”). Telefon: butonul-fâșie care deschide panoul S-01b („Continuă”). Plecarea trebuie să fie după sosire; trimite la `/contact?subiect=cazare&sosire=…&plecare=…&adulti=…&copii=…` | Pagina Acasă → Bară de cazare (titlu, notă, maxime) |
| 3 · Bucătăria | Categoriile ca rânduri de meniu cu linie de puncte; pe desktop, fotografia de alături se schimbă când treci peste un rând; fiecare rând duce la meniul digital (sau la legătura proprie a categoriei) | Categorii de preparate, Setări → Meniu digital |
| 3 · Vinuri | „Carta dei vini” pe copertă: insigna (spațiu rezervat 120 px), titlul, vinurile „Recomandat” + „Disponibil” pe tip, cu prețul la sticlă și la pahar; fotografia primului vin care are una; „Vezi lista de vinuri” | Vinuri, Premii |
| 3 · Ce spun oaspeții | O recenzie mare și două mai mici (primele 3 active din grupul Restaurant), cu autorul, sursa și luna; „Lasă o recenzie” spre recenzia Google | Recenzii, Setări → Legătură recenzie Google |

Rezervarea la masă: scriptul ialoc se încarcă doar la primul clic (0 cereri către ialoc înainte, ca în F0); dacă nu răspunde în 6 s, butoanele devin „Sună pentru rezervare” (ADR-008).

Capturi: `design/f3/capturi/2026_11_24_Trattoria_F3_*.webp` (telefon, desktop, 1024 px, panoul de navigare, panoul de cazare, Bucătăria cu fotografia schimbată).

## 4. Cifrele

### 4.1 Lighthouse 13.6.0, mobil (simulare implicită), fără efecte

| Rulare | Performanță | Accesibilitate | Bune practici | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Producție 1 | 86 | 100 | 100 | 66 | 3,3 s | 320 ms | 0 |
| Producție 2 | 91 | 100 | 100 | 66 | 3,2 s | 160 ms | 0 |
| Producție 3 | 90 | 100 | 100 | 66 | 3,3 s | 160 ms | 0 |
| Producție 4 | 91 | 100 | 100 | 66 | 3,3 s | 140 ms | 0 |
| Producție 5 | 95 | 100 | 100 | 66 | 2,9 s | 90 ms | 0 |
| Local 1–3 (build de producție) | 90 / 90 / 93 | 100 | — | — | 3,2–3,5 s | 100–110 ms | 0 |

- **SEO 66 este intenționat:** `noindex` pe adresa temporară (ADR-012). Se ridică la legarea domeniului.
- **Două reparații făcute pe parcurs**, care au urcat performanța de la 84–89 la 86–95:
  1. Payload adăuga pe toate adresele `Critical-CH: Sec-CH-Prefers-Color-Scheme` (pentru tema panoului). Pe site, asta făcea browserul să reîncarce documentul o dată (610 ms în simulare). Regula rămâne acum doar pe `/admin` (`next.config.ts`).
  2. Secțiunile de sub primul ecran nu se mai așază până nu se apropie de ecran (`content-visibility`): lucrul pe documentul paginii scade de la ~620 la ~460 ms. Ancorele din meniu ajung tot sub antet (verificat la 390 și 1440 px).
- Variația între rulări vine din TBT (90–320 ms), adică din procesorul simulat. Cea mai slabă rulare: 86.
- Rezultatele JSON nu sunt în repo (sunt mari). Comanda: `CHROME_PATH=<chromium> npx lighthouse@13.6.0 <adresa> --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --output=json`.

### 4.2 Contrast pe randare (`scripts/f2/contrast-measure.mjs`, percentila 5 a pixelilor de sub fiecare rând)

| Element | Telefon | Desktop |
|---|---|---|
| Tagline peste fotografie | 8,05 | 14,35 |
| Insigna (textul) | 12,93–15,05 | 14,59–15,05 |
| Subtitlul hero | 13,14 | 14,71 |
| Etichetele cererii de cazare („Sosire”, folio pe hârtie) | — | **5,38** (cel mai slab de pe desktop) |
| Nota butonului de cazare | **5,85** (cel mai slab de pe telefon) | — |
| Nota rândurilor de meniu | 5,85 | 5,85 |
| Detaliile vinurilor, pe copertă | 8,83 | 8,83 |
| Sursa recenziilor | 5,85 | 5,85 |
| Eticheta „Exemplu · de înlocuit” | 12,25 | 12,25 |
| **Total** | 128 rânduri, 0 sub 4,5 | 140 rânduri, 0 sub 4,5 |

Fișiere: `docs/f3/contrast-pasii-1-3.json` (local) și `docs/f3/contrast-pasii-1-3-productie.json` (producție, aceleași cifre). Scriptul citea greșit culorile calculate cu `color-mix()`; l-am reparat înainte de măsurare.

### 4.3 Verificări Impeccable (prim ecran și detector)

| Verificare | 1440 × 900 | 390 × 844 |
|---|---|---|
| Hero-ul în primul ecran | 96% | 100% |
| „Rezervă o masă” întreg în primul ecran și răspunde la clic | da | da (bara de jos) |
| Cifrele din primul ecran au eticheta de exemplu | da | da |
| Detectorul pe pagina randată | 0 probleme după excepția „cream-palette” (hârtia aprobată în D-41, notată în `.impeccable/config.json`) | |

### 4.4 Probe de comportament (Playwright)

Panoul de navigare se deschide, focusul cade în panou, Esc îl închide și `aria-expanded` revine la `false`. Panoul de cazare: plecarea înainte de sosire arată „Plecarea trebuie să fie după sosire.” sub câmp; trimiterea duce la `/contact?subiect=cazare&sosire=2026-12-20&plecare=2026-12-22&adulti=3&copii=0`. Bucătăria: trecerea peste „Pizza” arată fotografia ei. Antetul compact apare după hero.

## 5. Conținutul de pornire pe producție

La build, conținutul de pornire a raportat `{"media":6,"mediaFill":6}`: cele 6 fotografii provizorii din machetele F2 (Wikimedia Commons, licențe CC BY / CC BY-SA / CC0) sunt acum în Biblioteca media a Trattoriei, cu titlul „Exemplu · de înlocuit: …” și creditul lor. Au fost puse **doar în câmpuri goale**: posterele hero (2), categoriile Recomandări din partea casei, Pasta e Risotto și Pizza (3), vinul Chianti Classico DOCG (1). Creditele apar într-un singur rând în footer. Dacă ștergi una din panou, nu mai revine.

## 6. Skill-urile folosite

| Skill | Ce am folosit | Rezultat |
|---|---|---|
| Impeccable 4.10.0 | `context` (contractul direcției B, mod Persuade), `craft-floor` înainte de cod, `detect` pe pagina randată, `first-viewport` la 1440 și 390 | Toate verificările de prim ecran trec; detectorul: 0 după excepția aprobată |
| Taste 2.5.1 | Regulile pentru localuri: fotografia conduce, creditele într-un rând în footer (nu sub imagini), micro-animații (buton +1 px, fotografie 1,03, link subliniat), bara de telefon, un îndemn principal pe ecran | Aplicate. Nu am rulat „deal”-ul de paletă și erou: direcția e decisă (D-41) |
| UI UX Pro Max 2.15.0 | Lista de verificare (4,5:1, 44 px, `prefers-reduced-motion`) și 2 căutări: „focus not obscured” → `scroll-padding` sub antet și deasupra barei de jos; „Next.js cache” → cache explicit | Aplicate |

Conflicte, rezolvate după `CLAUDE.md` (ca în F2): Taste cere fără telefoane reale, fără adresă completă și fără hero întunecat la localuri; proiectul are telefoanele (D-17), adresa și coperta închisă (D-41).

## 7. Ce lipsește (detaliile și locul din panou: `docs/materiale-necesare.md`)

| # | Ce | Stare acum |
|---|---|---|
| 7, 8 | Clipurile hero 16:9 și 9:16 | lipsesc; clipul e construit și pornește singur când îl încarci |
| 9 | Posterele hero | fotografie provizorie (pizza în cuptor) |
| 10 | Fotografiile celor 8 categorii | 3 provizorii, 5 lipsesc |
| 17 | Lista reală de vinuri | 5 exemple, fiecare cu „Exemplu · de înlocuit” |
| 18 | Recenziile reale | 3 exemple pe Acasă, fiecare cu „Exemplu · de înlocuit” |
| 32 (nou) | Textul introductiv pentru Bucătăria și Vinuri | gol |
| 33 (nou) | Rândul de lângă insignă, în Vinuri | gol |
| 34 (nou, opțional) | Fotografii ale sticlelor | una provizorie |
| 6 | Imaginea de distribuire 1200 × 630 | lipsește |
| 30 | Logo-ul oficial al premiului | la primire |

Panoul: https://anna-restaurante-alinlabau-9308s-projects.vercel.app/admin (Trattoria aleasă în comutatorul „Restaurant”).

## 8. Ce aleg eu, ce alegi tu

| # | Întrebare | Ce am făcut / propunerea mea |
|---|---|---|
| G3-1 | **Categoriile: rânduri de meniu sau slider?** PLAN F3 și wireframe-ul S-01 spun „slider de carduri”; macheta B aprobată la GATE 2 și `docs/design-system.md` au rânduri de meniu cu fotografie alături. Contradicție semnalată, nerezolvată în tăcere | Am construit rândurile (macheta aprobată e mai nouă). Recomand să rămână: e semnătura direcției și funcționează și cu 5 categorii fără fotografie |
| G3-2 | Antetul compact pe desktop după primul ecran (nu era în machetă) | Adăugat, pentru principiul „rezervarea la un gest distanță”. Recomand să rămână |
| G3-3 | Linkurile spre pagini încă neconstruite (`/contact`, `/catalog-vinuri`, cele 3 pagini legale, `/formular-de-reclamatie`) dau 404 până la pașii 9–10 | Le-am lăsat vizibile (adresa e temporară și neindexată). Le pot ascunde până atunci |
| G3-4 | Fotografiile provizorii din Biblioteca media de pe producție | Rămân, etichetate, până vin cele reale |
| G2-5 | Fonturile (din GATE 2) | Implicit Belleza + Hanken Grotesk |

**[PRESUPUNERI] luate fără să te opresc:** selectorul de limbă arată doar „RO” până la F4 (D-38); „Acasă” nu apare în meniu (logo-ul duce acolo); pe Vinuri, butonul e fantomă pe copertă (verdele nu se folosește pe fundal închis, `docs/design-system.md`); textul fix al interfeței (etichete, „Sună”, „nivel și an la confirmare”) stă în `src/lib/site/strings.ts`, pregătit pentru traduceri în F4.

## 9. Propunere pentru sesiunea următoare (după GO)

F3 pașii 4–6: Evenimente private (saloanele, galerie, „Rezervă salonul”, agenda lunii), Petreceri tematice și pagina de agendă, Cursuri de pizza (prezentare, galerie, înscriere). Secțiunile apar singure în meniu pe măsură ce se construiesc (`src/lib/site/sections.ts` → `built: true`).

Îmbunătățire propusă, nefăcută: o variantă de 320 px pentru logo-uri (acum antetul încarcă varianta de 640 px, 29 KB, pentru un logo de 48–72 px). Cere o migrație și reîncărcarea logo-urilor; aștept acordul tău.

## 10. Fișiere

- Site: `src/app/(frontend)/layout.tsx`, `page.tsx`, `styles.css`; `src/components/site/` (antet, panou, footer, bara de jos, hero, clip, cazare, Restaurant, insignă, iconițe, ialoc); `src/lib/site/` (date cu cache, secțiuni și navigare, imagini, formate, credite, texte fixe, revalidare)
- Panou: `src/payload.config.ts` (golirea cache-ului la orice salvare), `src/theme/theme.ts` (`--c-accent-ink`), `src/seed/starter.ts` (`mediaFill`), `seed/trattoria-da-vittoria.json`, `seed/media/trattoria-da-vittoria/provizorii/`
- Configurare: `next.config.ts` (Critical-CH doar pe /admin), `eslint.config.mjs`, `vitest.config.mts`
- Teste și măsurători: `tests/int/f3-site.int.spec.ts`, `docs/f3/contrast-*.json`, `scripts/f3/capture.mjs`, `scripts/local-tenant.ts` (doar local)
- Capturi: `design/f3/capturi/`
- Pagina HTML a raportului (privată, cu capturile și graficul Lighthouse): https://claude.ai/artifact/5svuGdrQyy6xT9JDeT5SEj

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
