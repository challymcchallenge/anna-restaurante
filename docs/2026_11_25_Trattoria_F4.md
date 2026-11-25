# F4 · Traducerile: ce s-a construit și ce urmează

Trattoria da Vittoria · 25.11.2026 · GO F4 primit (D-64) · Stare: **construit și publicat; aștept prima rulare a traducerilor pe producție (pașii lui Alin, mai jos), apoi GATE 4**

## Concluzia

- **Site-ul știe acum 7 limbi.** Româna rămâne la rădăcină (`/galerie`), celelalte au prefix (`/en/galerie`, `/zh/contact` …). Textele fixe ale interfeței (butoane, formulare, calendar, mesaje de eroare) sunt traduse în toate cele 6 limbi. Conținutul din panou se traduce cu Claude Haiku 5.5, din panou.
- **Pe producție, limbile sunt încă oprite** (Setări → Limbi active = doar română), deci `/en` dă 404. Le pornești tu după prima traducere (F4-7).
- **Cifre măsurate:** teste 100/100. Lighthouse mobil pe Acasă (română), 5 rulări pe producție: performanță 79 / 87 / 88 / 86 / 84 (mediana **86**), accesibilitate **100** la toate, CLS 0. Înainte de F4: 86–89.
- **Cost estimat al primei rulări:** sub 0,50 USD pentru tot site-ul în 6 limbi (neverificat; cifra reală apare în Tabloul de bord la final și în Console → Usage).

## Ce faci tu (circa 10 minute)

1. Deschide panoul: https://anna-restaurante-alinlabau-9308s-projects.vercel.app/admin
2. Din comutatorul **Restaurant** (meniul din stânga) alege **Trattoria da Vittoria**.
3. În **Tablou de bord → Traduceri**, apasă **„Tradu tot site-ul”**. Lasă fila deschisă până scrie „Gata” (estimat 3–6 minute, neverificat pe producție). Fiecare tură apare în listă, cu costul.
4. **Setări restaurant → Integrări → Limbi active**: bifează toate cele 7 limbi și salvează.
5. Scrie-mi „gata”. Măsor Lighthouse pe `/en` și `/zh`, fac capturile și închid GATE 4.
6. Verifică engleza (F4-7): orice corectură salvată în panou, cu „Limba conținutului: English”, marchează documentul „Verificat de om”.

## Ce s-a construit

| Parte | Ce face | Unde |
|---|---|---|
| Adrese pe limbi (F4-1) | Româna fără prefix; `/ro/…` scris de mână duce la adresa fără prefix (308). Panoul, API-ul și fișierele nu sunt atinse | `next.config.ts` (rescrieri), `src/app/(frontend)/[lang]/` |
| Limba paginii | `<html lang>`, `og:locale`, `canonical`, `hreflang` pentru fiecare limbă pornită plus `x-default` | `src/lib/site/locale.ts` |
| Selectorul de limbă | În antet, în panoul de pe telefon și în footer; păstrează pagina curentă. Merge și fără JavaScript (`<details>`) | `src/components/site/LanguageMenu.tsx` |
| Textele fixe în 7 limbi | Aceleași chei, în aceeași ordine, în fiecare limbă (verificat de test). Browserul primește doar partea lui: 15,1 KB comprimat, toate limbile | `src/lib/site/i18n/` |
| Chineza (F4-5) | Fontul sistemului (PingFang, YaHei, Noto Sans CJK) după fonturile temei, fără font web în plus | `src/theme/theme.ts` |
| Motorul (D-34) | `claude-haiku-5-5`, fără raționament, efort scăzut, răspuns JSON validat. Termenii care nu se traduc devin `{0}`, `{1}`; formatările și linkurile devin `<1>…</1>` | `src/lib/translate/engine.ts`, `segments.ts` |
| Siguranța textului | Un rezultat cu un termen pierdut, cu marcaje stricate sau peste limita câmpului se mai încearcă o dată. Dacă tot nu iese, rămâne româna, nu un text greșit | `src/lib/translate/service.ts` |
| Stare pe limbă | Netradus, Tradus automat, Verificat de om, De retradus, De reverificat. Starea e scrisă în cuvinte, nu doar marcată prin culoare | panoul „Traduceri” din bara laterală a fiecărui document |
| Butoane | Pe document: „Tradu automat” (nu atinge ce a verificat un om), „Retradu în …”, „Marchează verificat”. În Tabloul de bord: cifrele pe limbă și „Tradu tot site-ul” | `src/components/admin/` |
| Automat (F4-2) | Schimbi un text în română: limbile pornite care sunt traduse automat sau netraduse se retraduc singure după salvare. Cele verificate de om apar „De reverificat”. Corectura de om într-o limbă = „Verificat de om” | `src/lib/translate/collection.ts` |
| Recenzii (F4-3) | Sub citatul tradus apare „Tradus automat din română”; ghilimelele după limbă | `ReviewCard.tsx` |
| Pagini legale (F4-4) | În celelalte limbi: „Aceasta este o traducere automată. Versiunea în română prevalează.” | `[lang]/[slug]/page.tsx` |
| Formularul de contact | Mesajele de lângă câmpuri și rezumatul confirmării în limba paginii; cererea ajunge în panou la fel | `contact/actions.ts` |
| Termeni care nu se traduc | Automat: numele restaurantului, tagline-ul, saloanele, camerele, categoriile, serile, linkurile grupului. În plus, lista ta din Setări → Integrări | `Settings.ts` |

Migrația `20261125_044503_f4_traduceri` a rulat pe producție (152 ms). Ruta `/api` are acum durata maximă de 120 s, pentru turele de traducere.

## Cum am probat fără cheie

Cheia stă doar în Vercel; nu o am local, cum e corect. Am probat motorul pe baza locală cu un traducător fals („[EN] …”):

- 227 de documente din 15 colecții scrise în engleză, 0 erori. Româna a rămas neatinsă, inclusiv în liste (dotările saloanelor) și în textul formatat (paginile legale).
- „Tradu tot site-ul”, simulat cu 1,5 s pe cerere: 2 limbi × 223 de documente, în 6 ture, cu 24 de cereri. Fără gruparea bucăților ar fi fost circa 450 de cereri.
- Paginile `/`, `/en`, `/zh/contact` și `/en/termeni`: 0 erori în consolă (după ce am mutat selectorul din footer dintr-un `<p>` într-un `<div>`).

**Ce nu e probat încă:** un apel real către Anthropic, care se face la pasul 3 al tău. Dacă ceva nu merge, mesajul apare în Tabloul de bord, iar site-ul rămâne în română.

## Presupuneri și limite

- [PRESUPUNERE] Rata de cereri a contului Anthropic nou e suficientă pentru 4 cereri în paralel. La limită, SDK-ul reîncearcă singur (de 3 ori).
- Meniul de pe desktop socotește lățimea etichetelor pe litere latine. La chineză, semnele sunt socotite de 1,6 ori mai late (aproximare, de verificat pe capturi).
- Recenziile verificate de om primesc tot mențiunea „Tradus automat din …”.
- Fereastra ialoc rămâne în ro și en; în celelalte limbi se deschide în engleză (ADR-007).

## Întrebări G10: rezolvate (D-65)

- **G10-1 (DA):** 3 întrebări la Cursurile de pizza (ce face copilul, înscrierea, alergiile) și 4 la Cazare (micul dejun, copiii, parcarea, rezervarea), doar din fapte confirmate. Cele de cazare apar pe Acasă sub Hotel, la „Întrebări despre cazare”. Vârsta, durata, prețul și locurile la curs lipsesc până le confirmi (OQ #6).
- **G10-2 (DA):** Hotel ANNA, Grupul ANNA, Wine Spectator, Riviera Events și VIP Riviera sunt în Setări → Integrări → „Termeni care nu se traduc”.

Intră pe producție la publicare, înainte de prima traducere: „Tradu tot site-ul” le traduce odată cu restul.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
