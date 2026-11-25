# Starea proiectului și predarea către sesiunea următoare

Trattoria da Vittoria · 25.11.2026 (actualizat după F4) · scris la cererea lui Alin, ca sesiunea nouă să pornească din fișiere, nu din memoria conversației.

## Concluzia

- **F0–F4 sunt gata, pe producție. GATE 4 e prezentat** (`docs/2026_11_25_Trattoria_GATE4.md`, pagina HTML https://claude.ai/artifact/YTzaimKk6noRhFqDrDRgmM). Aștept „GO” pentru F5 și răspunsurile G11-1 … G11-3.
- **7 limbi live**, conținut tradus integral (Haiku 5.5); FAQ la cursuri și cazare (D-65); fotografiile demo și nota din footer scoase (D-66).
- **Cifrele de acum (producție, Lighthouse mobil, mediane):** `/` 86, `/en` 89, `/zh` 82 (sub țintă, G11-3); accesibilitate 100, CLS 0. Teste: 105/105.

## Unde e totul

| Ce | Unde |
|---|---|
| Site (producție) | https://anna-restaurante-alinlabau-9308s-projects.vercel.app |
| Panou | https://anna-restaurante-alinlabau-9308s-projects.vercel.app/admin |
| Cod | GitHub `challymcchallenge/anna-restaurante`, ramura `main` (D-08) |
| Raportul GATE 3 (pagină HTML, privată) | https://claude.ai/artifact/Jz61TqNb2Mzskz1B34ZXUP |
| Deciziile | `docs/DECISIONS.md` (ultima: D-66) |
| Ce lipsește de la Alin | `docs/materiale-necesare.md`, `docs/OPEN-QUESTIONS.md` |
| Ultima migrație | `20261125_044503_f4_traduceri` |
| Raportul F4 | `docs/2026_11_25_Trattoria_F4.md` |
| Raportul GATE 4 (pagină HTML, privată) | https://claude.ai/artifact/YTzaimKk6noRhFqDrDRgmM |

Vercel: proiectul `prj_fUZFnSKhbgQ253uFVnheAfPFswnR`, echipa `team_lDyFQlTkuMOZxQFCMMH1ZZnX`, regiunea dub1. La fiecare publicare, build-ul rulează `payload migrate` și seed-ul (`scripts/seed-starter.ts`).

## Ce s-a schimbat după GATE 3

| # | Pe scurt |
|---|---|
| D-55, D-56 | Recenziile reale de pe Google (7 restaurant, 7 hotel), traduse în română; câmpul „Limba” pe recenzie |
| D-57 | Subtitlul din hero |
| D-58, D-59 | Descrierile saloanelor, camerelor și hotelului din davittoria.ro și hotelanna.ro; răspunsurile la întrebări; dotările saloanelor (catering, platouri) |
| D-60 | Logo-ul din antet de 2× la deschidere (96 / 144 px), 1,5× la scroll; antet transparent sus; meniul de navigare se ordonează din Setări |
| D-61 | Toate fotografiile cu colțuri rotunjite (16 px); clipuri de până la 120 s (peste 30 s la 720p), coperta Acasă doar ≤ 30 s |
| D-62 | Footer compact cu triunghiuri; desene fine pe fundalul fiecărei secțiuni; margini ondulate între fundaluri diferite; comutatoare în Setări → Identitate. Liniile de contur din colț au fost scoase la cererea lui Alin |
| D-63 | Creditul BizTech: logo rotund cât logo-ul Trattoria (96 / 144 px) și 3 rânduri, centrate; înlocuiește cele 2 rânduri din ADR-013 |

## Ce așteaptă de la Alin

1. **GO pentru F5** și răspunsurile **G11-1** (pagina de cookies cu textul Riviera Events), **G11-2** (numele categoriilor traductibile), **G11-3** (abaterea `/zh`).
2. **Verificarea englezei** (F4-7) în panou.
3. **Fotografiile reale** (galeria apare singură când există cel puțin un element; categoriile, saloanele și camerele au plăci „fără fotografie”).
4. **Un clip real de 1–2 minute** și **câmpurile „[de completat]” din paginile legale** (D-59).

## Ce urmează, pe faze

- **F4**: gata, GATE 4 prezentat. Efectele, sunetul, 3D și tema sunt mutate după lansare (D-33).
- **F5** (2 sesiuni): emailurile prin Resend cu domeniul verificat (D-36), audit de finisare, date structurate, sitemap, redirecționările de pe adresele vechi (G7-2), ștergerea automată a cererilor vechi, ghidul pentru editor, checklist de lansare.
- **La final:** playbook-ul proiectului în vault-ul Obsidian, după standardul de denumire.

## Note tehnice pentru sesiunea nouă

- **Local:** Postgres 16 în container. Dacă serverul nu pornește cu `ECONNREFUSED 5432`: `pg_ctlcluster 16 main start`. Apoi `pnpm dev` (port 3000). Valorile din `.env.local` nu se citesc și nu se afișează; pentru date se folosesc scripturi temporare `pnpm payload run scripts/_x.ts`, șterse după.
- **Verificări:** `pnpm exec tsc --noEmit`, `pnpm lint` (0 erori; avertismentele sunt vechi), `pnpm exec vitest run` (87/87), `pnpm build`.
- **Contrast:** `node scripts/f2/contrast-measure.mjs <url> <etichetă> <out.json>`. Atenție: medalionul din antet trece peste rânduri la derulare și dă rezultate false. Se confirmă repetând măsurarea cu `.site-header` ascuns (D-62).
- **Lighthouse:** `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome npx -y lighthouse@13.6.0 <url> --quiet --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=<fișier>`. SEO 66 pe adresa temporară e intenționat (`noindex`, ADR-012).
- **Seed-ul** nu e tranzacțional: la o eroare rămâne aplicat pe jumătate și se reia la rularea următoare. Schimbările de conținut pe producție merg prin „swaps” cu versiune (`src/seed/starter.ts`).
- **Desenele decorative** se regenerează cu `python3 scripts/f3/generate-decor.py` (ieșire în `public/decor`).
- **Next 16 în dev:** dacă paginile arată date vechi, oprește serverul și șterge `.next/dev/cache`.

## Note tehnice F4

- **Rute:** paginile stau sub `src/app/(frontend)/[lang]/`. `next.config.ts` rescrie `/x` în `/ro/x` (afterFiles) și redirecționează `/ro/x` → `/x`. Limba vine din `next/root-params` (`pageLocale()`); componentele de pe server folosesc `UI` din `src/lib/site/i18n/server.ts` (limba cererii, prin `React.cache`), iar linkurile `lp('/…')`. Componentele din browser primesc `locale` și folosesc `clientUI(locale)` (doar fișierele `*.client.ts`).
- **Traduceri:** `src/lib/translate/` (segmente, motor, serviciu, câmpuri și reguli pe colecție, `/api/translate`). Probă locală fără cheie: `translateDocument(..., { translate: fake })`.
- **Completarea traducerilor** rulează la build (`scripts/translate-repair.ts`, o dată pe versiune, jurnal `translateRepair:<versiune>` pe restaurant); ce rămâne în română apare în jurnalul build-ului cu motivul (`long`, `terms`, `same`, `missing`).
- **Local:** containerul nou nu avea `.env.local`; am creat unul doar local (baza `trattoria` pe Postgres 16, secret generat), plus restaurantul de probă cu `pnpm payload run scripts/local-tenant.ts`. Valorile nu sunt în repo.

## Cum pornești sesiunea nouă

Textul de lipit la începutul sesiunii:

> Continuăm proiectul Trattoria da Vittoria. Citește întâi `CLAUDE.md`, apoi `docs/2026_11_25_Trattoria_Stare_Proiect.md`, `docs/DECISIONS.md` (până la D-66), `docs/PLAN.md` (Faza 5) și `docs/2026_11_25_Trattoria_GATE4.md`. Suntem la GATE 4. [GO F5 + răspunsuri G11 / altă cerere]

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
