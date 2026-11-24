# Meta prompt — site Trattoria da Vittoria

**Folosire:** deschide Claude Code în folderul repo-ului (după pașii din `README.md`) și lipește PROMPTUL PRINCIPAL. Rulează o singură fază pe sesiune. La fiecare poartă (GATE) scrie „GO” ca să continue. La sesiunile următoare folosește PROMPTUL DE CONTINUARE.

---

## PROMPTUL PRINCIPAL (copy-paste, prima sesiune)

```
Construim site-ul premium Trattoria da Vittoria (Târgu Jiu, Grupul ANNA) și panoul de administrare refolosibil pentru celelalte restaurante ale grupului. Planul, deciziile și arhitectura sunt deja aprobate și se află în acest repo.

## Înainte de orice
Citește, în această ordine, și confirmă-mi în 10 rânduri ce ai înțeles:
1. CLAUDE.md
2. docs/DECISIONS.md
3. docs/ADR.md
4. docs/PLAN.md
5. docs/OPEN-QUESTIONS.md
6. design/content-model.md, design/DECISIONS.md, design/feature-map/feature-inventory.md, design/flows/screens.md

Dacă găsești o contradicție între ele, listeaz-o. Nu o rezolva singur: docs/DECISIONS.md câștigă.

## Reguli pentru toată durata proiectului
1. Rulezi O SINGURĂ fază pe sesiune. La fiecare GATE te oprești, rezumi ce ai produs, listezi întrebările deschise și aștepți „GO”.
2. Fiecare fază se termină cu fișiere în repo. Faza următoare pornește din fișiere, nu din memoria conversației.
3. Înainte să folosești orice skill sau server MCP (SOFI, DESI, superpowers, Taste, Impeccable, UI-UX-pro-max, Magic UI, ReactBits, marketing-skills, Supabase, Vercel, Resend), citește-i documentația și folosește doar comenzile, componentele și proprietățile pe care le returnează efectiv. Nu inventa nume de componente sau props.
4. Orice versiune de bibliotecă, preț sau limită de plan o verifici în documentația oficială și o notezi cu data în docs/versions.md. Ce nu poți verifica marchezi „neverificat”.
5. Marchezi presupunerile cu [PRESUPUNERE]. Nu umpli goluri în tăcere: întrebi.
6. ADR-urile sunt aprobate. Dacă un test din faza 0 arată că unul nu ține, îmi prezinți rezultatul, o alternativă și recomandarea ta; schimbarea o aprob eu.
7. Lucrăm direct pe main. Commit după fiecare pas care funcționează.
8. Mobile-first. Ținte Lighthouse pe mobil: performanță ≥ 85, accesibilitate ≥ 95. Raportezi cifrele reale, nu estimări.
9. Nimic specific Trattoriei nu intră direct în cod: fiecare restaurant este un tenant, iar conținutul se editează din panou.
10. Conținutul provizoriu poartă eticheta vizibilă „Exemplu · de înlocuit”. Nu scrii recenzii, premii sau cifre fără această etichetă.
11. Securitate: nu citi și nu afișa .env, chei sau tokenuri; valorile le pun eu. Fără scripturi de instalare prin pipe. Întreabă înainte de comenzi cu drepturi ridicate, de ieșiri în rețea în afara instalării de pachete și de orice ștergere sau suprascriere.
12. Răspunsuri scurte: concluzia întâi. Când am ceva de făcut, îmi dai calea completă a fișierului și linkul.

## Ce faci acum
Rulezi Faza 0 din docs/PLAN.md (Pregătire și teste):
a) Verifici versiunile curente (Payload 3.x stabil, Next.js cerut de el, Node) și le scrii în docs/versions.md.
b) Inițializezi proiectul conform ADR-001, îl legi la Supabase (ADR-003) și la Vercel (ADR-006). Îmi spui exact ce variabile trebuie să completez în .env.local și în Vercel, pornind de la .env.example. Te oprești până confirm că le-am pus.
c) Configurezi adresa temporară neindexată, fără parolă (ADR-012): meta noindex, antet X-Robots-Tag, robots.txt cu Disallow.
d) Configurezi multi-tenant (ADR-002) cu tenantul „Trattoria da Vittoria” și un tenant de probă „Citybar & Josper Grill”. Îmi arăți că un Editor al unuia nu vede conținutul celuilalt.
e) Rulezi cele 5 teste din Faza 0 (imagini, video, ialoc, traduceri, email) și scrii rezultatul fiecăruia în docs/spikes/<nume>.md: ce ai probat, cifrele măsurate, concluzia.
f) Refaci estimarea de sesiuni din docs/PLAN.md.

GATE 0: îmi dai un tabel cu ADR-urile marcate TEST F0 (confirmat / de schimbat, cu motiv) și aștepți „GO”.

Începe cu citirea fișierelor și cu rezumatul de 10 rânduri.
```

---

## PROMPTUL DE CONTINUARE (copy-paste, sesiunile următoare)

Înlocuiește `N` cu numărul fazei.

```
Continuăm proiectul Trattoria da Vittoria. Citește CLAUDE.md, docs/DECISIONS.md, docs/ADR.md, docs/PLAN.md, docs/OPEN-QUESTIONS.md și tot ce s-a adăugat în docs/ de la ultima fază (docs/spikes/, docs/versions.md, docs/design-system.md dacă există). Spune-mi în 5 rânduri unde am rămas, pe baza fișierelor și a istoricului git.

Apoi rulează Faza N din docs/PLAN.md, pas cu pas, cu aceleași reguli ca până acum: o singură fază, te oprești la GATE N, raportezi cifre reale și aștepți „GO”.
```

---

## Note de utilizare

- **Faza 0 are un punct de oprire la pasul b):** Claude Code îți spune ce variabile lipsesc, tu le completezi în `.env.local` și în Vercel, apoi confirmi. Cheile nu trec prin conversație.
- **Faza 1 are nevoie de `design/content-model.md`.** Dacă schimbi un câmp, schimbă-l acolo întâi.
- **Faza 2 are nevoie de materialele de brand** (logo-uri, culori, fonturi) și de un clip video pentru hero. Fără ele, direcțiile de design se fac pe conținut provizoriu.
- **Faza 3 este cea mai lungă** (6–8 sesiuni). Poți rula câte 2–3 pași din ea pe sesiune și să ceri oprire după fiecare.
- **Cea mai scumpă greșeală posibilă:** să sari peste GATE 0. Dacă încărcarea de imagini sau conversia video nu merg cum scrie în ADR, afli în faza 3, când costă de câteva ori mai mult.
- **Dacă un skill nu pornește cu comanda lui**, scrie în prompt calea către `SKILL.md` al skill-ului.
