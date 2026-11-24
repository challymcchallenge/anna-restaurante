# Plan de lucru — Trattoria da Vittoria

Regulă: **o fază pe sesiune de Claude Code**. La fiecare poartă (GATE) lucrul se oprește, se rezumă ce s-a produs, se listează întrebările deschise și se așteaptă „GO” de la Alin.

Estimarea în sesiuni este orientativă și se reface după faza 0.

| Fază | Sesiuni (estimare inițială) | Sesiuni (refăcută după F0, 24.11.2026) | Real / refăcută după F1 (24.11.2026) | Motiv |
|---|---|---|---|---|
| F0 Pregătire și teste | 1–2 | 1 + 0,5 | **1,5 (real)** | Rămân: conexiunea Supabase și încărcarea S3 după variabile, proba pe telefon |
| F1 Panou și model de conținut | 2–3 | **3–4** | **1 (real)** + proba ta | 13 colecții + setări pe restaurant + traduceri pe câmp + panou în română. Încărcarea media are nevoie de o componentă proprie în panou (conversie în browser, HEIC, video, punct focal) |
| F2 Direcție de design | 1–2 | 1–2 | 1–2 | — |
| F3 Site public | 6–8 | 6–8 | 6–8 | — |
| F4 Traduceri și FAQ | 3–4 | **1–2** | 1–2 | Efectele, sunetul, 3D și tema trec după lansare (D-33) |
| F5 Verificare și lansare | 2 | 2 | 2 | Include testul de email cu domeniul verificat (mutat din F0 la decizia lui Alin) |
| **Total** | **15–21** | **14–20** | **13–17** | Decis la GATE 0 (D-33) |

---

## Faza 0 — Pregătire și teste

**Se face**
1. Inițializare proiect conform ADR-001 (versiunile se verifică în documentația oficială și se notează cu data în `docs/versions.md`).
2. Legare la Supabase (ADR-003) și la Vercel (ADR-006). Adresa temporară neindexată, fără parolă (ADR-012).
3. Multi-tenant (ADR-002): tenantul Trattoria + un tenant de probă. Dovadă că un Editor al unuia nu vede conținutul celuilalt.
4. Teste, fiecare cu rezultat scris în `docs/spikes/<nume>.md` (ce s-a probat, cifre măsurate, concluzie):
   - `imagini`: fotografie de 8–12 MB și una HEIC → master ≤ 2560 px → variante AVIF/WebP. Dimensiuni, timp, calitate.
   - `video`: clip de 30 s convertit în browser, pe laptop și pe telefon. Durată, dimensiune rezultată.
   - `ialoc`: încărcare amânată, deschidere din buton, rezerva la telefon, lista de cookies.
   - `traduceri`: 2–3 motoare, pornind de la cele gratuite; calitate pe un text de meniu și unul de eveniment în cele 6 limbi; cost.
   - `email`: un email de probă prin Resend, cu copie.

**GATE 0:** toate testele au rezultat scris. ADR-urile marcate `TEST F0` sunt confirmate sau au propunere de schimbare. Estimarea pe faze este refăcută.

## Faza 1 — Panou și model de conținut

**Se face**
1. Colecțiile și setările din `design/content-model.md`, cu câmpurile marcate „se traduce” / „nu se traduce” (ADR-007).
2. Roluri Administrator și Editor (ADR-002). Comutator de restaurant.
3. Biblioteca media cu fluxul de încărcare din `design/flows/flow-incarcare-media.mmd` (ADR-004, ADR-005).
4. Modulele: Evenimente și seri tematice, Recenzii, Premii și distincții, Vinuri, Saloane, Cursuri de pizza, Galerie, FAQ, Cereri primite. (Sunete și Efecte sezoniere trec în R2, D-33.)
5. Conținut provizoriu etichetat „Exemplu · de înlocuit” + contor în panou.
6. Lista de materiale lipsă pentru Alin: `docs/materiale-necesare.md`.

**Intrări din F0** (vezi `docs/ADR.md` → „Actualizări după faza 0” și `docs/spikes/`)
- Încărcarea media se face într-o componentă proprie în panou: master de 2560 px în browser, HEIC prin `heic-to`, video prin `mediabunny` (H.264 + AV1/HEVC + poster), limita de 30 s, acceptare după extensie. Logo-urile rămân PNG/SVG; BADGE neatins.
- Variante pe server: AVIF q55 e2 + WebP q78 e4, lățimi 640–2560, secvențial. Fișierele se servesc din URL-ul public Supabase.
- Panoul în română. Restaurantele de pe producție: Trattoria (id 1) și Citybar (id 2, de probă).
- Propunere de securitate: RLS activat și drepturile `anon`/`authenticated` revocate pe tabelele din `public`, ca protecție suplimentară (advisors: 0 probleme acum).
- De primit de la Alin: lista de vinuri (OQ #5), linkul de Facebook (C2).

**GATE 1:** Alin adaugă din panou, singur, o seară tematică, o fotografie și un vin. Editorul de probă nu poate deschide Premii și Setări.

**Stare (24.11.2026):** construită și pusă în producție; testele automate ale porții trec (14 de integrare, 7 în browser). Aștept proba lui Alin și „GO”. Raport: `docs/2026_11_24_Trattoria_GATE1.md`.

## Faza 2 — Direcție de design

**Se face**
1. Două direcții de design (paletă, tipografie, spațiere, stil foto, ton al animațiilor), pornind de la wireframe-urile din `design/` și de la referința vineyard.co.za ca nivel de calitate, nu ca model de copiat.
2. Se folosesc skill-urile instalate (Taste, Impeccable, UI UX Pro și celelalte), după citirea documentației fiecăruia.
3. Pentru fiecare direcție: Acasă pe telefon și pe desktop, cu hero, bara de cazare și insigna de premiu. Contrast verificat.
4. Direcția aleasă → `docs/design-system.md` + variabile de temă pe restaurant.

**GATE 2:** Alin alege o direcție.

## Faza 3 — Site public

Ordinea de construcție; după fiecare pas, build + capturi pe telefon și desktop:

1. Antet, navigare, footer (cu premii, grup ANNA, rețele sociale, selector de limbă, credit BizTech).
2. Hero: video, tagline, butoanele „Rezervă o masă” (ialoc) și „Meniu” (link extern), bara de cazare.
3. Restaurant: slider de categorii, vinuri recomandate, recenzii, „Lasă o recenzie”.
4. Evenimente private: saloanele Trattoria și Vittoria, galerie, „Rezervă salonul”, agenda lunii.
5. Petreceri tematice și pagina de agendă.
6. Cursuri de pizza pentru copii: prezentare, galerie, înscriere.
7. Cazare Hotel ANNA: prezentare, galerie, cerere de rezervare, recenzii.
8. Galerie mozaic pe categorii.
9. Contact: date, hartă, formularul cu subiect; pagina de sesizări.
10. Paginile proprii: `/catalog-vinuri`, saloane, pagini legale.
11. Emailuri prin Resend pentru toate formularele (ADR-009).
12. Texte: română, cu cârlige de marketing și un singur îndemn clar pe secțiune (plugin marketing-skills).

**GATE 3:** fiecare secțiune arătată pe telefon și desktop. Toate formularele probate cap-coadă, cu emailul primit. Lighthouse măsurat fără efecte.

## Faza 4 — Efecte, sunet, traduceri

**Se face**
1. Efecte sezoniere configurabile din panou (iarnă, toamnă, primăvară, vară), pe mobil și desktop.
2. Animații 3D pe desktop (după ce Alin definește ce se animă).
3. Sunet de fundal la buton; administrare sunete din panou.
4. Comutator de temă deschisă / închisă.
5. Traduceri (ADR-007): rulare automată pe cele 6 limbi, stare pe limbă, selector de limbă, `hreflang`. Alin verifică engleza; restul rămân „tradus automat” până sunt verificate.
6. Secțiuni FAQ acolo unde sunt relevante.

**GATE 4:** Lighthouse mobil cu efectele pornite: performanță ≥ 85, accesibilitate ≥ 95, cifre reale. `prefers-reduced-motion` probat.

## Faza 5 — Verificare și lansare

**Se face**
1. Audit de finisare (Impeccable); se aplică doar modificările listate și explicate.
2. Accesibilitate, tastatură, lățimi 360, 390, 768, 1280, 1920 px.
3. Date structurate (Restaurant, cu premiul când este activ), sitemap pe limbi, Open Graph.
4. Redirecționări (ADR-013). Pagini legale și cookies; consimțământ doar dacă există cookies neesențiale.
5. Ghid scurt pentru Social Media Manager: `docs/ghid-editor.md`.
6. `docs/launch-checklist.md`.

**Checklist de lansare (minim)**
- [ ] Niciun conținut provizoriu rămas (contorul din panou arată 0).
- [ ] Logo-ul oficial al premiului încărcat, cu nivelul și anul corecte.
- [ ] `noindex` scos; `robots.txt` și sitemap corecte.
- [ ] Domeniul legat; redirecționările de pe adresele vechi probate.
- [ ] Domeniul de trimitere Resend verificat; un email real primit la `rezervari@hotelanna.ro`.
- [ ] ialoc probat pe domeniul final.
- [ ] Google Business Profile, Search Console, analytics.

**GATE 5:** lansarea publică, la decizia lui Alin.

---

## După lansare

- **Etapa 2:** al doilea restaurant în panou (Citybar, SuperBistro sau Terasa Anna), calendar extins, verificarea umană a traducerilor.
- **Etapa 3:** legătura cu portalul de vinuri și cu widgetul de rezervări ANNA.
