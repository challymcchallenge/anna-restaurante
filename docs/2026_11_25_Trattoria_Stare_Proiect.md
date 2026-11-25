# Starea proiectului și predarea către sesiunea următoare

Trattoria da Vittoria · 25.11.2026 · scris la cererea lui Alin, ca sesiunea nouă să pornească din fișiere, nu din memoria conversației.

## Concluzia

- **F0–F3 sunt gata, pe producție.** GATE 3 e prezentat (`docs/2026_11_24_Trattoria_GATE3.md`). După el au intrat 9 cereri ale lui Alin, D-55…D-63, toate live și verificate.
- **Pasul următor: F4 (traducerile).** Pornește doar după **„GO”** de la Alin și după ce Alin pune **`TRANSLATE_API_KEY`** în Vercel → Settings → Environment Variables (numele variabilelor: `docs/2026_11_24_Trattoria_Variabile_Mediu.md`).
- **Cifrele de acum (producție, Lighthouse mobil):** Acasă: performanță 86–89, accesibilitate 100, CLS 0. `/galerie`: 87–89. `/evenimente-private`: 99. Teste: 87/87. Contrast: 0 rânduri sub 4,5:1 (măsurat cu antetul ascuns).

## Unde e totul

| Ce | Unde |
|---|---|
| Site (producție) | https://anna-restaurante-alinlabau-9308s-projects.vercel.app |
| Panou | https://anna-restaurante-alinlabau-9308s-projects.vercel.app/admin |
| Cod | GitHub `challymcchallenge/anna-restaurante`, ramura `main` (D-08) |
| Raportul GATE 3 (pagină HTML, privată) | https://claude.ai/artifact/Jz61TqNb2Mzskz1B34ZXUP |
| Deciziile | `docs/DECISIONS.md` (ultima: D-63) |
| Ce lipsește de la Alin | `docs/materiale-necesare.md`, `docs/OPEN-QUESTIONS.md` |
| Ultima migrație | `20261125_002159_f3_decor` |

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

1. **„GO” pentru F4** și **`TRANSLATE_API_KEY`** în Vercel.
2. **Un clip real de 1–2 minute** încărcat din panou, ca să înlocuim estimarea (~25 MB la 120 s, neverificată) cu cifra reală și timpul de conversie.
3. **Fotografiile** care înlocuiesc plăcile „Exemplu · de înlocuit”: saloanele, hotelul și camerele, categoriile din Bucătărie, galeria (lista: `docs/materiale-necesare.md`). Pe producție, hero-ul și cursul de pizza au deja fotografii reale, puse din panou.
4. **Paginile legale:** câmpurile „[de completat]” din ciornele aprobate de jurist (D-59).
5. Opțional: dacă vrea formele decorative mai vizibile, Setări → Identitate → „Cât de vizibile sunt formele” = Mediu.

## Ce urmează, pe faze

- **F4** (1–2 sesiuni): traducerile în cele 6 limbi (ADR-007, Claude Haiku 5.5, D-34), selectorul de limbă, `hreflang`; Alin verifică engleza. Efectele, sunetul, 3D și tema sunt mutate după lansare (D-33). GATE 4: Lighthouse mobil ≥ 85 / ≥ 95.
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

## Cum pornești sesiunea nouă

Textul de lipit la începutul sesiunii:

> Continuăm proiectul Trattoria da Vittoria. Citește întâi `CLAUDE.md`, apoi `docs/2026_11_25_Trattoria_Stare_Proiect.md`, `docs/DECISIONS.md` (până la D-63) și `docs/PLAN.md`, Faza 4. Suntem la GATE 3. [GO F4 / altă cerere]

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
