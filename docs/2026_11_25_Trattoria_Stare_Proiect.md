# Starea proiectului și predarea către sesiunea următoare

Trattoria da Vittoria · 25.11.2026 (actualizat după D-72, la sfârșitul sesiunii F4) · scris la cererea lui Alin, ca sesiunea nouă să pornească din fișiere, nu din memoria conversației.

## Concluzia

- **F0–F4 sunt gata, pe producție. GO pentru F5 primit (D-67)**, cu o schimbare de ordine: **Resend și domeniul se conectează la final**, după tot restul.
- **După GATE 4 au venit 9 cereri și reparații (D-66 … D-74)**, toate publicate și verificate pe producție (tabelul de mai jos).
- **D-72 a reparat un bug serios:** din F4 până la D-72, pe Vercel, linkurile interne către paginile în română schimbau adresa, dar afișau Acasă până la reîncărcare. Acum merg.
- **Cifre (producție, Lighthouse mobil):** Acasă mediana 86 (5 rulări după D-71), `/catalog-vinuri` 91, `/en` 89, `/zh` 82 (acceptat, G11-3, se re-măsoară în F5); accesibilitate 100, CLS 0. **Teste: 131/131** (27 de fișiere). tsc și lint: 0 erori.
- **Deschise:** G12-1 (slideshow pe telefoane cu „Reducere mișcare”) și G12-2 (coperta pe video, fără clip de desktop), în `docs/OPEN-QUESTIONS.md`.

## Unde e totul

| Ce | Unde |
|---|---|
| Site (producție) | https://anna-restaurante-alinlabau-9308s-projects.vercel.app |
| Panou | https://anna-restaurante-alinlabau-9308s-projects.vercel.app/admin |
| Cod | GitHub `challymcchallenge/anna-restaurante`, ramura `main` (D-08); copia sesiunii: `biztech/stoic-johnson-oxvj0z` |
| Deciziile | `docs/DECISIONS.md` (ultima: D-75) |
| Întrebări deschise | `docs/OPEN-QUESTIONS.md` (G12-1, G12-2) |
| Ce lipsește de la Alin | `docs/materiale-necesare.md`, secțiunea „Ce așteaptă de la Alin” de mai jos |
| Ultima migrație | `20261125_083644_d71_slideshow_clip_acasa` |
| Raportul F4 | `docs/2026_11_25_Trattoria_F4.md` |
| Raportul GATE 4 | `docs/2026_11_25_Trattoria_GATE4.md` și pagina HTML privată https://claude.ai/artifact/YTzaimKk6noRhFqDrDRgmM |
| Raportul GATE 3 (pagină HTML, privată) | https://claude.ai/artifact/Jz61TqNb2Mzskz1B34ZXUP |

Vercel: proiectul `prj_fUZFnSKhbgQ253uFVnheAfPFswnR`, echipa `team_lDyFQlTkuMOZxQFCMMH1ZZnX`, regiunea dub1. La fiecare publicare, build-ul rulează `payload migrate`, seed-ul (`scripts/seed-starter.ts`) și completarea traducerilor (`scripts/translate-repair.ts`). Supabase: proiectul `fmkqpdwqvpwspsxmmkxh`, bucket-ul `media` public, fără restricții de tip sau mărime (verificat 25.11.2026).

## Ce s-a schimbat după GATE 4

| # | Pe scurt |
|---|---|
| D-66 | Fotografiile demo Wikimedia și nota „Fotografii provizorii” din footer, scoase; galeria fără elemente nu apare |
| D-67 | G11 (cookies rescris pentru Trattoria, „Provizoriu”; numele categoriilor se traduc; `/zh` 82 acceptat); insigna premiului acceptă orice imagine; clipurile își păstrează sunetul; clipul cursului în locul fotografiei pe pagina cursului (9:16); pictograma de filă = logo-ul original; sliderul Bucătăriei până la 20 de categorii |
| D-68 | Insigna Wine Spectator Grand Award 2027, pusă prin seed, cu transparență; unealta de încărcare păstrează ca PNG fotografiile cu pixeli transparenți |
| D-69 | Insigna oficială de 2 ori mai mare (hero 144/192, Vinuri 240, footer 112 px); tipul „Document PDF” în Biblioteca media; câmpul „Lista de vinuri în PDF” (Pagina Acasă → Vinuri) și butonul „Descarcă PDF” pe `/catalog-vinuri`, în 7 limbi |
| D-70 | Pe telefon, umbra de jos a copertei mai ușoară (72/58/20 %, contrast măsurat: titlu ≥ 3,25:1, subtitlu ≥ 5,06:1); bara fixă de jos doar cu „Rezervă o masă” și „Meniu” |
| D-71 | Slideshow-ul la 3 s, editabil (Pagina Acasă → Hero → „Durata unui cadru”); clipul cursului de pizza și pe Acasă, în colaj lângă fotografie: nu se descarcă până la ecran, pornește fără sunet, butoane de pauză și sunet; comutator „Arată clipul și pe Acasă” |
| D-72 | **Bug reparat:** pe Vercel, cererile routerului au sufix (`/galerie.rsc`, `/galerie.segments/_tree.segment.rsc`, Acasă `/index.rsc`); rescrierea românei le rata și cădeau pe `/[lang]` cu „lang = galerie”. Regula din `next.config.ts` le trimite acum la `/ro/…`. Test `f4-d72` |
| D-73 | **Clipul fără sunet:** conversia copiază acum sunetul ca atare, verifică pistele aruncate și spune în panou („Codec și sunet”) dacă clipul are sunet. Clipul de pe site n-are pistă audio deloc; trebuie reîncărcat, cu fila panoului redeschisă |
| D-74 | **Eroare în panou** la „Text complet (pagina cursului)” (Lexical #17): textul din seed (D-54) avea un subtitlu, editorul n-avea titluri. Câmpul are acum H2 și H3; test care oprește repetarea |

## Ce așteaptă de la Alin

1. **PDF-ul listei de vinuri:** Biblioteca media → Creează → „Ce încarci?” → „Document PDF” → „Alege și convertește” → Salvează; apoi Pagina Acasă → Vinuri → „Lista de vinuri în PDF” → Salvează (D-69).
2. **Clipul cursului de pizza (D-73):** cel de pe site n-are pistă audio. Închide și redeschide fila panoului (codul nou), reîncarcă originalul din Biblioteca media, verifică „Codec și sunet” = „cu sunet”, apoi alege clipul la Pagina Acasă → Cursuri de pizza → „Clip principal” (sau scoate-l pe cel vechi din galerie). Spune din ce browser încarci.
3. **G12-2, coperta:** clip 16:9 la „Clip desktop” sau înapoi la „Slideshow”.
4. **G12-1, slideshow pe telefon:** ce telefon și ce browser; dacă vrea schimbarea propusă (cadre fără estompare și cu „Reducere mișcare”).
5. **Verificarea englezei** (F4-7), **textul juristului** pentru paginile legale (cookies e „Provizoriu”) și **fotografiile reale** pentru galerie, categorii, saloane și camere.
6. La lansare: **fișierul oficial Wine Spectator**, cu nivelul și anul corecte (D-20, D-68).

## Ce urmează, pe faze

- **F4:** gata, cu cererile D-66 … D-72. Efectele, sunetul, 3D și tema sunt mutate după lansare (D-33).
- **F5** (2 sesiuni, GO primit): audit de finisare, date structurate, sitemap pe limbi, redirecționările de pe adresele vechi (G7-2), ștergerea automată a cererilor vechi, ghidul pentru editor, checklist de lansare, re-măsurarea `/zh`; **la final** emailurile prin Resend și domeniul (D-36, D-67). În auditul F5 intră și o probă de **navigare prin linkuri pe producție** (nu doar încărcări directe), pe toate paginile și limbile.
- **La final:** playbook-ul proiectului în vault-ul Obsidian, după standardul de denumire.

## Importul în masă al fotografiilor (D-75, în lucru)

**Stare (25.11.2026):** Alin a dat GO (H11 Il Ritmo, H11 Kinder și B10 intră; din grupul sanitar rămân C4 și C10; varianta A). Adresa `/api/media-import` e publicată; `MEDIA_IMPORT_TOKEN` e pus de Alin în Vercel (Production, Sensitive), iar același cod e salvat ca secret de rețea al mediului ANNA-Restaurante (antet `x-import-token`). Urmează: republicarea, încărcarea cu `scripts/import/upload.mjs` (111 fișiere, 122 de elemente de galerie) și curățenia (variabila din Vercel, secretul din mediu, folderul Drive pe „Restricted”). Înainte de GO: fotografiile erau descărcate, convertite și analizate. Raportul pentru „GO” e aici: https://claude.ai/artifact/HqvuobpDTZ7g17h5BRzVk6. Se așteaptă răspunsul lui Alin la propuneri și la G13-5 (cum se încarcă). Fișierele convertite erau doar în containerul sesiunii; se refac după `scripts/import/README.md`.

### Propunerea inițială

Alin are multe fotografii într-un dosar local și încărcarea una câte una durează prea mult. Propunerea (de aprobat, întrebările G13 din `docs/OPEN-QUESTIONS.md`):

1. **Transferul** (G13-1): dosar Google Drive citit prin conector, sau dosarul local prin Remote Control, sau .zip.
2. **Duplicatele:** identice (SHA-256) și aproape identice (amprentă perceptuală, de exemplu dHash), inclusiv față de fotografiile deja în Biblioteca media de pe producție. Se păstrează varianta cu rezoluția cea mai mare.
3. **Calitatea:** rezoluția față de formatul locului (HERO, CARD-L 1800 × 1200, GAL 1600 px pe latura lungă), fotografii neclare sau întunecate, semnalate.
4. **Clasificarea:** Claude se uită la fiecare fotografie (planșe cu miniaturi) și propune locul: cadre de copertă, galerie (pe categoriile din panou), categoriile din Bucătărie, saloane, camere, cursul de pizza, seri; plus textul alternativ în română (de verificat) și semnalarea copiilor din imagine (G13-4).
5. **Raportul pentru aprobare:** o pagină HTML cu miniaturile grupate pe locul propus, duplicatele și semnalările. Nimic nu se încarcă înainte de „GO”.
6. **Conversia:** cu același cod ca butonul „Alege și convertește” (`convert.ts`, rulat în Chromium; HEIC prin heic-to, clipurile cu sunet, D-73), deci rezultatul e identic cu încărcarea din panou.
7. **Încărcarea** (G13-5): prin punctul de import temporar cu token, apoi legarea în câmpuri (galerie, categorii …); traducerea textelor alternative merge la build. Tokenul se șterge după import.

## Note tehnice pentru sesiunea nouă

- **Local:** Postgres 16 în container. Dacă serverul nu pornește cu `ECONNREFUSED 5432`: `pg_ctlcluster 16 main start`. Apoi `pnpm dev` (port 3000). Valorile din `.env.local` nu se citesc și nu se afișează; pentru date se folosesc scripturi temporare `pnpm payload run scripts/tmp-x.ts`, șterse după. Local, fișierele media stau pe disc (`media/`), nu în Supabase.
- **Verificări:** `pnpm exec tsc --noEmit`, `pnpm lint` (0 erori; avertismentele sunt vechi), `pnpm vitest run --config ./vitest.config.mts` (131/131), `pnpm build`.
- **Build de producție local:** `pnpm build && npx next start -p 3100`. Atenție: **rutarea Vercel diferă de `next start`** (sufixele `.rsc` / `.segments`, D-72). Ordinea exactă a rutelor primită de Vercel se vede cu un adaptor de diagnostic: un modul cu `onBuildComplete(ctx)` care scrie `ctx.routing` într-un fișier, rulat cu `NEXT_ADAPTER_PATH=<modul> pnpm build`.
- **Next 16 în dev:** dacă paginile arată date vechi, oprește serverul și șterge `.next/dev/cache/fetch-cache`. Scripturile `payload run` nu pot goli cache-ul Next (`revalidateTag` merge doar într-o cerere Next).
- **Contrast:** `node scripts/f2/contrast-measure.mjs <url> <etichetă> <out.json>`; medalionul din antet dă rezultate false la derulare, se repetă cu `.site-header` ascuns (D-62). Pentru textul de pe copertă (D-70): fundalul fotografiat cu textul ascuns, pe fiecare cadru, percentila 95 a luminozității din spatele textului.
- **Lighthouse:** `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome npx -y lighthouse@13.6.0 <url> --quiet --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility --output=json --output-path=<fișier>`. Rezultatele variază mult din TBT (200–500 ms): minim 5 rulări, se raportează mediana. SEO 66 pe adresa temporară e intenționat (`noindex`, ADR-012).
- **Playwright:** scripturile din afara proiectului au nevoie de `NODE_PATH="$(npm root -g):$PWD/node_modules"` ca să găsească `playwright` și `sharp`.
- **Seed-ul** nu e tranzacțional: la o eroare rămâne aplicat pe jumătate și se reia la rularea următoare. Schimbările de conținut pe producție merg prin „swaps” cu versiune; `mediaFill` acceptă `replace` (D-68); codul: `src/seed/starter.ts`.
- **Desenele decorative** se regenerează cu `python3 scripts/f3/generate-decor.py` (ieșire în `public/decor`).

## Note tehnice F4

- **Rute:** paginile stau sub `src/app/(frontend)/[lang]/`. `next.config.ts` rescrie `/x` în `/ro/x` (afterFiles; plus sufixele `.rsc` / `.segments` și `/index.rsc` → `/ro.rsc`, D-72) și redirecționează `/ro/x` → `/x`. Limba vine din `next/root-params` (`pageLocale()`); componentele de pe server folosesc `UI` din `src/lib/site/i18n/server.ts`, iar linkurile `lp('/…')`. Componentele din browser primesc `locale` și folosesc `clientUI(locale)` (doar fișierele `*.client.ts`).
- **Traduceri:** `src/lib/translate/` (segmente, motor, serviciu, câmpuri și reguli pe colecție, `/api/translate`). Probă locală fără cheie: `translateDocument(..., { translate: fake })`. Completarea rulează la fiecare build; ce rămâne în română apare în jurnalul build-ului cu motivul (`long`, `terms`, `same`, `missing`).
- **Componente noi după GATE 4:** `ClipCard.tsx` (clipul de pe Acasă, D-71), `useMotionAllowed` exportat din `HeroMotion.tsx`, `downloadUrl()` în `src/lib/site/media.ts` (`?download=` pe Supabase, D-69), `prepareDocument()` în `src/components/admin/media/convert.ts` (verificarea PDF ca pe server, D-69).

## Cum pornești sesiunea nouă

Textul de lipit la începutul sesiunii:

> Continuăm proiectul Trattoria da Vittoria. Citește întâi `CLAUDE.md`, apoi `docs/2026_11_25_Trattoria_Stare_Proiect.md`, `docs/DECISIONS.md` (până la D-75), `docs/OPEN-QUESTIONS.md` (G12, G13), `docs/PLAN.md` (Faza 5) și `docs/2026_11_25_Trattoria_GATE4.md`. GO F5 primit (D-67). [Importul fotografiilor: răspunsurile G13 / Pornește F5 / răspunsuri G12 / altă cerere]

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
