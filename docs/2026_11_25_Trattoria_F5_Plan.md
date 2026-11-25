# F5 · Verificare și lansare: planul de lucru

Trattoria da Vittoria · 25.11.2026 · GO F5: D-67 · Ordinea cerută de Alin: **Resend și domeniul la final**.

## Concluzia

F5 are 2 sesiuni (PLAN). **Sesiunea 1** face tot ce nu depinde de domeniu sau de Resend. **Sesiunea 2** leagă emailurile, domeniul și face lansarea, la GATE 5.

## Sesiunea 1 (25.11.2026) · fără domeniu, fără Resend

| # | Ce | Sursa |
|---|---|---|
| 1 | Proba de navigare prin linkuri pe producție: toate paginile, 7 limbi, telefon și desktop | Stare proiect, D-72 |
| 2 | Date structurate (Restaurant, cu premiul când e activ; serile ca Event), sitemap pe limbi cu `hreflang`, Open Graph pe fiecare pagină | PLAN F5.3, D-20 |
| 3 | Redirecționările de pe davittoria.ro: harta site-ului vechi citită (16 adrese), propunere, adrese cu mai multe segmente | G7-2, D-53, D-59 |
| 4 | Ștergerea automată a cererilor vechi, după termenul din panou (gol = nu se șterge) | G7-3, D-59 |
| 5 | Audit de finisare (Impeccable), accesibilitate, tastatură, lățimi 360 / 390 / 768 / 1280 / 1920 px; cookies reale (ialoc, harta) | PLAN F5.1, F5.2, F5.4 |
| 6 | Ghidul editorului și checklist-ul de lansare | PLAN F5.5, F5.6 |
| 7 | Publicare, Lighthouse pe producție (inclusiv `/zh`), predarea | D-26, G11-3 |

## Sesiunea 2 · la final (D-36, D-67)

| # | Ce | De la Alin |
|---|---|---|
| 1 | Emailurile prin Resend pentru toate formularele (ADR-009), fotografia bonului la sesizări ca atașament (G6-3) | Domeniul de trimitere în DNS, `RESEND_API_KEY`, `EMAIL_FROM` |
| 2 | Domeniul `davittoria.ro` legat, `noindex` scos (`ALLOW_INDEXING=true`), redirecționările probate pe domeniu | DNS, momentul (D-20: după premiu) |
| 3 | ialoc pe domeniul final, `/zh` re-măsurat pe domeniul final | — |
| 4 | Curățenia importului (D-75): `MEDIA_IMPORT_TOKEN`, secretul din mediu, folderul Drive pe „Restricted” | Confirmarea că nu mai adaugă fotografii |
| 5 | Google Business Profile, Search Console, analytics; GATE 5 | Accesele |

## Ce nu intră în F5

Efectele sezoniere, sunetul de fundal, 3D și comutatorul de temă: după lansare (D-33).

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
