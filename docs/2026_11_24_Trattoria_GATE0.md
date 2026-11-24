# GATE 0 · Trattoria da Vittoria — raport faza 0

Data: 24.11.2026 · Stare: **aștept „GO” de la Alin**. Detaliile fiecărui test sunt în `docs/spikes/`.

## 1. ADR-uri marcate TEST F0

| ADR | Verdict | Motiv (cifre măsurate) | Ce rămâne |
|---|---|---|---|
| **ADR-003** Supabase (Postgres prin pooler, Storage S3, `clientUploads`) | **Confirmat parțial** | CORS pe endpoint-ul S3: preflight OK (`Allow-Origin: *`, PUT, `If-None-Match`), deși nu se poate configura. Bucket `media` creat. Migrația inițială creează 13 tabele pe o bază goală. `clientUploads` este **obligatoriu pentru video** (aproximativ 22,5 MB per clip, peste limita de 4,5 MB) | Conexiunea prin pooler și o încărcare reală, după ce pui variabilele în Vercel |
| **ADR-004** Imagini | **Confirmat, cu 3 ajustări** | Master de 2560 px în browser: 0,4–0,7 s (10,4 MB → 1,08 MB). HEIC de 12 MP: 3,0 s prin `heic-to`. Variante pe Vercel (dub1): **9,4 s** per fotografie, 447 MB memorie | Ajustări: **AVIF q55 cu efort 2** (34 s → 7–9 s, SSIM 0,921 față de 0,923); **HEIC decodat în browser** (`sharp` nu poate pe server); lățimi 640/960/1280/1920/2560. Proba pe telefonul tău |
| **ADR-005** Video | **Confirmat (laptop, aproximat în container)** | Clip de 30 s, 1080p: H.264 **12,1 MB în 9,9–15,5 s**; AV1 10,2 MB în 25–38 s; poster 0,1 s. Clipul de 31,7 s e respins imediat | Proba pe telefon. Decizia ta: păstrăm AV1, doar cu 15% mai mic, sau doar H.264 |
| **ADR-007** Traduceri: alegerea motorului | **De ales de tine** | MyMemory (gratuit): calitate bună, dar a tradus numele protejate în 4 limbi din 6. Cu marcaje `{n}`: **4 din 4 păstrate**. Claude Haiku 5.5: aproximativ **0,10–0,15 USD** pentru tot site-ul în 6 limbi | **Recomandare: Claude Haiku 5.5** + marcaje. Fără cost: MyMemory + marcaje (50.000 caractere/zi) |
| **ADR-008** ialoc | **Confirmat, cu o corecție de integrare** | 0 cereri înainte de clic. Fereastra se deschide în 0,6–1,9 s. **0 cookies**, stocare goală (GA în Consent Mode refuzat). `defaultDate` funcționează (rezervare cu data serii). Rezerva telefonică apare la eroare | Corecție: în modul popup, fereastra se deschide prin `selector`, nu prin `show()`. Confirmarea juridică pentru absența bannerului (Q-25) |

## 2. Celelalte rezultate din F0

| ADR | Rezultat |
|---|---|
| ADR-001 Stack | Payload 3.94.1 + Next.js 16.4.6 + Node 22.23.5 (local) / 26.13.1 (Vercel). Build-ul de producție trece pe Vercel |
| ADR-002 Multi-tenant | **Confirmat: 21/21 verificări**. Editorul Trattoria vede 2 seri, cel Citybar 1; GET pe seara celuilalt restaurant dă 404; nu își poate da singur rol sau alt restaurant. Capturi din panou în `docs/spikes/img/` |
| ADR-006 Găzduire | Prețuri verificate. **Funcțiile Vercel mutate în dub1 (Dublin)**, lângă Supabase eu-west-1 (erau în iad1, SUA) |
| ADR-009 Email | **Amânat la decizia ta** (domeniul vine la final). Limite verificate: 100 de emailuri pe zi, iar CC contează separat, deci 50 de cereri cu copie pe zi |
| ADR-012 Neindexare | **Confirmat pe producție**: adresa e publică (Standard Protection), cu meta `noindex`, `X-Robots-Tag` și `robots.txt` `Disallow: /`. Pe `*.vercel.app` rămâne neindexat și după lansare |
| T6 Meniu digital | Linkuri pe categorie: **da**, prin `#id-categorie` |

## 3. Contradicții găsite (nerezolvate; `docs/DECISIONS.md` câștigă)

| # | Contradicție | Fișiere | Impact |
|---|---|---|---|
| C1 | **Efecte sezoniere, sunet, 3D și comutatorul de temă:** în design sunt în **R2, după lansare** (Q-15, Q-16 acceptate prin D-32; F-07, F-42, F-43, F-44, F-54 = R2). În `docs/PLAN.md` și ADR-010 sunt în **F4, înainte de lansare** (GATE 4 cu efectele pornite) | design/DECISIONS.md, feature-inventory.md, content-model.md §1 vs PLAN F4, ADR-010 | 2 sesiuni în plus sau în minus înainte de lansare. **Decizia ta** |
| C2 | Facebook apare în footer și Contact (design D-18, D-30, F-38), dar `docs/DECISIONS.md` nu dă un link de Facebook | design vs docs/DECISIONS D-18, D-30 | Câmpul există în panou; rămâne gol până primesc linkul |
| C3 | Celelalte restaurante intră în **R3** în design (D-25, F-58) și în „Etapa 2” în `docs/PLAN.md` | design vs PLAN „După lansare” | Doar ordinea după lansare |
| C4 | `/valori-nutritionale` → meniul digital: decis în `docs/DECISIONS` D-19, „de confirmat” în design (A-18) | design vs docs | Aplic D-19 (decis) |
| C5 | ADR-003/ADR-006 cer „regiune UE”, dar funcțiile Vercel rulau implicit în SUA | vercel.json | **Rezolvat tehnic** (dub1); îți semnalez schimbarea |

## 4. De făcut de tine (în ordine)

| # | Ce | Unde | Timp |
|---|---|---|---|
| 1 | ~~Vercel → Standard Protection~~ **făcut de Claude Code**, după acordarea dreptului de scriere | — | — |
| 2 | Cele **4 secrete** în Vercel (celelalte 5 le-a pus Claude Code) | `docs/2026_11_24_Trattoria_Variabile_Mediu.md` · https://vercel.com/alinlabau-9308s-projects/anna-restaurante/settings/environment-variables | 10 min |
| 3 | Proba pe telefon și laptop: un clip și 2–3 fotografii, apoi „Copiază rezultatele” | https://anna-restaurante-alinlabau-9308s-projects.vercel.app/spike/f0-media.html (după pasul 1) | 5 min |
| 4 | Decizii: C1 (efecte înainte sau după lansare), motorul de traducere, AV1 da sau nu | răspuns în conversație | — |
| 5 | Opțional: cheie API Anthropic pentru testul cu Claude Haiku 5.5 (prin formular securizat) | — | 2 min |

## 5. Întrebări deschise (din `docs/OPEN-QUESTIONS.md`, fără schimbări)

Niciuna nu blochează F1, în afară de **#5 (lista reală de vinuri)**, necesară până la F1. Restul au termen F2–F5.

## 6. Estimarea refăcută

**16–22 de sesiuni** (inițial 15–21), sau **14–20** dacă efectele rămân în R2. Detaliile sunt în `docs/PLAN.md`.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
