# GATE 3 · Faza 3, site-ul public · Trattoria da Vittoria — raport

Data: 24.11.2026 · Stare: **oprire la GATE 3, aștept „GO” pentru F4** · Decizii în F3: D-44 … D-54 · Ultimul commit de cod: `16f55fe`

## 1. Concluzie

Site-ul public e gata și live: Acasă cu 11 secțiuni și 9 pagini proprii, cu textele finale acolo unde faptele sunt confirmate.

https://anna-restaurante-alinlabau-9308s-projects.vercel.app

| Criteriul GATE 3 (PLAN) | Rezultat |
|---|---|
| Fiecare secțiune arătată pe telefon și desktop | **13 secțiuni pe Acasă** (antet, 11 secțiuni, footer) și **8 pagini**, pe telefon (390 px) și desktop (1440 px): `design/f3/capturi/2026_11_24_Trattoria_GATE3_*.webp` |
| Toate formularele probate cap-coadă | **Local, cu toate subiectele pornite:** 5 din 5 trimise complet (eveniment privat, curs de pizza, cazare, întrebare, sesizare); confirmare pe ecran și cerere salvată în „Cereri primite” (de la 3 la 8), 0 erori în consolă. **Pe producție:** validarea, la toate 5 (nu am creat cereri de probă în panoul tău) |
| … „cu emailul primit” | **Mutat în F5 (D-36).** Emailurile pleacă odată cu domeniul de trimitere. PLAN și D-36 se contrazic aici; câștigă D-36. Cererile se salvează în panou și acum |
| Lighthouse măsurat fără efecte | **Performanță 85–99** (27 de rulări pe 9 pagini, ținta ≥ 85), **accesibilitate 100** la toate. Efectele nu există la lansare (D-33) |
| În plus: contrast pe randare | **3.135 rânduri de text pe 9 pagini, 0 sub 4,5:1**; cel mai slab 4,68:1 |
| În plus: teste de integrare | **63/63** |

**Ce rămâne „Exemplu · de înlocuit”** e marcat vizibil pe site și listat în `docs/materiale-necesare.md`: fotografiile și clipurile, recenziile, serile, descrierile saloanelor și camerelor, răspunsurile la întrebări, detaliile cursului de pizza și textele juridice (secțiunea 6).

## 2. Ce s-a construit în F3

| Pas | Ce | Decizie | Raport |
|---|---|---|---|
| 1–3 | Antet, navigare, footer, bara de jos pe telefon; hero cu bara de cazare; Bucătăria (slider de categorii), Vinuri, Ce spun oaspeții | D-44, D-45 | `…_F3_Pasii1-3.md` |
| 4–6 | Evenimente private și saloanele; Petreceri și agenda; Cursuri de pizza | D-44 | `…_F3_Pasii4-6.md` |
| Vinuri | Lista reală (153 de vinuri), 5 recomandate pe tip pe Acasă, `/catalog-vinuri`, logo-ul Grupului ANNA | D-46, D-48 | `…_F3_Vinuri.md` |
| 7 | Cazare · Hotel ANNA | D-48 | `…_F3_Pasul7.md` |
| 8 | Galeria (Acasă și `/galerie`) | D-49 | `…_F3_Pasul8.md` |
| 9 | Contact cu formularul unic, sesizări, ialoc cu data serii | D-50, D-51, D-52 | `…_F3_Pasul9.md` |
| 10 | Paginile legale (ciorne pentru jurist), redirecționările | D-53 | `…_F3_Pasul10.md` |
| 11 | Emailurile Resend | mutat în F5 (D-36) | — |
| 12 | Textele finale | D-54 | acest raport, secțiunea 3 |

## 3. Pasul 12: textele

Am scris după `PRODUCT.md`, ghidul de ton aprobat de tine. Vizitatorul nr. 1 e localnicul care alege unde ia cina. Tonul e cald, nu intimidant, fără kitsch italian. Nicio cifră, recenzie sau premiu fără sursă. Am urmat și ghidul de copywriting din marketing-skills: fără tipare de text generat, fără „!”, cu un singur îndemn principal pe secțiune.

**Am păstrat** titlurile care aveau deja voce: „Nu ne crede pe cuvânt.”, „Weekendul începe la Trattoria.”, „Un salon doar al vostru.”, „Azi gătesc cei mici.”, „După cină, rămâi peste noapte.”, „Spune-ne ce plănuiești.” și „Lista de vinuri” (D-46).

| Secțiune | Înainte | Acum | De ce |
|---|---|---|---|
| Bucătăria · titlu | Bucătăria. Descoperă meniul, fel cu fel. | Bucătăria, de la antipasti la desert. | Spune ce găsești, cu un cuvânt italian (D-32) |
| Bucătăria · text | (gol) | Pizza, paste și risotto, pește, vită și deserturi, iar dimineața micul dejun Buona Mattina. Tot meniul, cu valorile nutriționale, e în meniul digital. | Categoriile reale; valorile nutriționale sunt în meniul digital (D-19) |
| Petreceri · text | Seri cu DJ, artiști și formații. Rezervă-ți masa din timp. | Seri cu DJ, formații și artiști invitați. Alegi seara din agendă și îți rezervi masa direct pentru data ei. | Spune ce face butonul serii (G4-1) |
| Petreceri · fără seri | Pregătim următoarea seară | Pregătim următoarea seară și o anunțăm aici. Până atunci, te așteptăm la masă în orice zi. | Dă un pas următor; restaurantul e deschis zilnic |
| Evenimente private · text | Onomastici, botezuri, tăieri de moț, prezentări, teambuilding. | Avem două saloane: Salon Trattoria, la etaj, și Salon Vittoria, la mansardă. Ne spui data și câți invitați vin, iar noi te sunăm cu disponibilitatea. | Tipurile apar deja ca listă sub text; textul spune ce se întâmplă după cerere |
| Cursuri de pizza · scurt | Pentru o zi, copiii devin mici maeștri pizzaioli! Vor descoperi secretele… | Pentru o zi, copiii devin pizzaioli. Întind aluatul cu mâinile lor, își aleg ingredientele preferate și își pregătesc propria pizza. | Aceleași fapte, la prezent, fără „!” și fără „secretele” |
| Cursuri de pizza · complet | Același paragraf + „Detaliile… se completează după confirmarea localului (Q-11).” | Cum arată cursul, apoi „Cum îl înscrii” în 3 pași | Nota internă era vizibilă pentru vizitatori și paragraful apărea de două ori |
| Hotel · text | Cazare la Hotel ANNA, pe Bd. Ecaterina Teodoroiu 17… | Hotel ANNA face parte din Grupul ANNA, ca și Trattoria. Alegi datele și camerele, trimiți cererea de aici, iar recepția hotelului îți confirmă oferta prin telefon sau email. | Adresa apare deja sub text; legătura de grup e un argument (PRODUCT.md) |
| Contact · text | Cu ce te putem ajuta? | Masa o rezervi direct. Pentru un eveniment, un curs de pizza sau o cameră la Hotel ANNA, alegi subiectul și te sunăm noi. | Spune ce se rezervă direct și ce prin cerere |

Fiecare text se schimbă o singură dată și doar dacă e încă cel vechi. Un text scris de tine în panou rămâne neatins (testat). **Eticheta „Exemplu”** a ieșit de pe secțiunile cu text final și fără fotografii demo: cazare, recenzii, petreceri, evenimente private, galerie, contact. La bucătărie rămâne cât timp categoriile au fotografii demo. Pe hero, cursul de pizza și hotel rămâne până vin fotografiile.

**Ce n-am scris, pentru că lipsesc faptele:**
- un detaliu care deosebește bucătăria: cuptorul, bucătarul, o rețetă a casei;
- răspunsurile la întrebările frecvente;
- descrierile saloanelor și ale camerelor;
- recenziile reale;
- detaliile cursului de pizza.

Sunt întrebările G8-2 și G8-3. Recenziile reale au venit după GATE 3 (D-55, secțiunea 9).

**Pe producție, subtitlul din hero era gol** (golit din panou). După GATE 3 ai ales subtitlul propus (G8-1, D-57). Acasă primește acum descrierea pentru căutare din nume, adresă și program: „Trattoria da Vittoria, Strada Victoriei nr. 8, Târgu Jiu. Program: Zilnic 8:00–24:00.”

## 4. Cifrele, pe producție

### 4.1 Lighthouse 13.6.0, mobil, 3 rulări pe pagină

| Pagina | Performanță | Accesibilitate | LCP | TBT | CLS max |
|---|---|---|---|---|---|
| Acasă | 87 / 87 / 90 | 100 | 3,3–3,6 s | 171–235 ms | 0,056 |
| `/evenimente-private` | 98 / 99 / 98 | 100 | 1,0–1,0 s | 148–155 ms | 0,000 |
| `/petreceri` | 97 / 97 / 98 | 100 | 0,8–1,0 s | 180–196 ms | 0,001 |
| `/cursuri-pizza-copii` | 99 / 99 / 99 | 100 | 0,8–0,9 s | 96–148 ms | 0,000 |
| `/galerie` | 85 / 86 / 86 | 100 | 3,4–3,6 s | 225–290 ms | 0,000 |
| `/contact` | 97 / 97 / 95 | 100 | 1,0–1,1 s | 185–273 ms | 0,001 |
| `/formular-de-reclamatie` | 98 / 92 / 98 | 100 | 1,0–1,0 s | 151–355 ms | 0,000 |
| `/catalog-vinuri` | 98 / 97 / 96 | 100 | 1,0–1,2 s | 158–226 ms | 0,000 |
| `/termeni` | 95 / 93 / 98 | 100 | 0,8–0,8 s | 161–333 ms | 0,000 |

**De urmărit în F5:**
- `/galerie` e la limită (85–86), pentru că elementul cel mai mare e prima fotografie demo din mozaic. Măsor din nou cu fotografiile reale.
- Pe Acasă, 2 din 3 rulări au o deplasare de 0,056 pe blocul de text din hero (pragul „bun” e 0,1). Lighthouse nu-i dă o cauză, iar în proba mea pe telefon emulat a ieșit 0,0001. O caut la auditul de finisare.

SEO 66 peste tot: `noindex` pus intenționat pe adresa temporară (ADR-012).

### 4.2 Contrast pe randare (`docs/f3/contrast-gate3-*.json`)

| Pagina | Telefon | Desktop | Cel mai slab |
|---|---|---|---|
| Acasă | 232, 0 sub prag | 259, 0 sub prag | 5:1 („Rezervări mese”) |
| `/evenimente-private` | 64, 0 sub prag | 68, 0 sub prag | 4,68:1 („La etaj · până la 25 de invitați”) |
| `/petreceri` | 58, 0 sub prag | 62, 0 sub prag | 5,85:1 („DJ · Invitat: Numele DJ-ului · Intrare l”) |
| `/cursuri-pizza-copii` | 50, 0 sub prag | 54, 0 sub prag | 6,43:1 („Înscrie copilul”) |
| `/galerie` | 47, 0 sub prag | 51, 0 sub prag | 8,53:1 („Rezervă o masă”) |
| `/contact` | 70, 0 sub prag | 74, 0 sub prag | 5,38:1 („Rezervări mese”) |
| `/formular-de-reclamatie` | 82, 0 sub prag | 86, 0 sub prag | 5,38:1 („Rezervări mese”) |
| `/catalog-vinuri` | 872, 0 sub prag | 876, 0 sub prag | 5,38:1 („Vinuri la pahar”) |
| `/termeni` | 63, 0 sub prag | 67, 0 sub prag | 5,38:1 („Cuprins”) |

Total: **3.135 de rânduri, 0 sub 4,5:1.**

## 5. Formularele

Pe baza locală, cu toate subiectele pornite ca pe producție (D-51), am trimis de pe telefon câte o cerere completă din fiecare formular. Pe producție am probat doar validarea, ca să nu-ți pun cereri de probă în panou.

| Formular | Local: trimis complet | Producție: trimis gol |
|---|---|---|
| Eveniment privat (botez, 30 de invitați) | „Am primit cererea ta”, cerere salvată | „Mai sunt 5 câmpuri de completat.” |
| Curs de pizza (2 copii, 6 și 8 ani) | confirmare, salvată | „Mai sunt 4 câmpuri…” |
| Cazare (3 nopți, 2 adulți, 1 copil) | confirmare, salvată | „Mai sunt 5 câmpuri…” |
| Întrebare | confirmare, salvată | „Mai sunt 4 câmpuri…” |
| Sesizare | confirmare, salvată | „Mai sunt 6 câmpuri…” |

În „Cereri primite” au apărut exact 5 cereri noi (de la 3 la 8), câte una pe subiect, și 0 erori în consolă. Emailul către destinatari pleacă la final, odată cu domeniul de trimitere (D-36).

## 6. Ce rămâne „Exemplu · de înlocuit”

| Pe site | Ce trebuie | `materiale-necesare.md` |
|---|---|---|
| Hero: fotografia (clipul lipsește) | clipurile desktop și telefon, posterele | #7, #8, #9 |
| Bucătăria: 3 fotografii provizorii, 5 coperți cu nume | o fotografie pe categorie | #10 |
| ~~Ce spun oaspeții: 3 recenzii exemplu; hotel: 1~~ | **rezolvat după GATE 3: 7 + 7 recenzii reale de pe Google (D-55)** | #18 |
| Petreceri: 3 seri exemplu | serile reale (le pune Editorul) și afișele | #15 |
| Saloane: descrieri și fotografii | descrieri, fotografii, confirmarea capacităților | #11, #24 |
| Cursul de pizza: fotografia; vârsta, durata, prețul, locurile | detaliile (Q-11) și fotografiile, cu acordul părinților | #13, #16, #25 |
| Hotel: fotografii, descrierile camerelor | fotografii, descrieri | #12, #24 |
| Galerie: 5 fotografii provizorii | fotografiile pe categorii | #14 |
| Întrebări frecvente: 6 răspunsuri | răspunsurile | #23 |
| Paginile legale | textele juristului | #28 |
| Insigna Wine Spectator | logo-ul, nivelul și anul, la primire | #30 |

## 7. Ce alegi tu

| # | Întrebare | Ce propun |
|---|---|---|
| ~~G8-1~~ | ~~Subtitlul din hero~~ | **Rezolvat: D-57**, „Bucătărie italiană și peste 150 de vinuri, pe Strada Victoriei 8, în Târgu Jiu.” |
| ~~G8-2~~ | ~~Ce are doar bucătăria voastră~~ | **Rezolvat: D-59** (secțiunea 11) |
| ~~G8-3~~ | ~~Descrieri și răspunsuri~~ | **Rezolvat: D-58** (secțiunea 10); 5 răspunsuri rămân la G9-1 |
| ~~G8-4~~ | ~~Recenziile reale~~ | **Rezolvat: D-55**, 7 + 7 de pe Google, pe site |
| G7-1 … G7-3 | Juristul, adresele vechi, termenul de păstrare a cererilor (din pasul 10) | Rămân deschise |

## 8. Faza următoare, după GO: F4

Efectele, sunetul, 3D și comutatorul de temă sunt mutate după lansare (D-33). F4 cuprinde:
- **traducerile** în cele 6 limbi (ADR-007), cu Claude Haiku 5.5 prin API (D-34);
- selectorul de limbă și `hreflang`;
- întrebările frecvente unde sunt relevante.

**Înainte de F4, de la tine:** cheia `TRANSLATE_API_KEY` în Vercel (D-34), pe care o pui tu. Numele variabilei e în `docs/2026_11_24_Trattoria_Variabile_Mediu.md`.

## 9. După GATE 3: recenziile reale (D-55)

Ai extras 14 recenzii de pe profilurile Google: 7 pentru restaurant și 7 pentru Hotel ANNA, toate de 5 stele. Ele înlocuiesc cele 4 exemple, iar eticheta „Exemplu” a dispărut de pe recenzii.

| Unde | Primele 3 (apar pe Acasă) | În panou, active, pentru rotație |
|---|---|---|
| Ce spun oaspeții | Dodo D. („Best restaurant in town by far…”), Mihai M. (atmosfera, pianul), Vlad D. (pizza, focaccia, servirea) | Alin T., Alexandra-Ioana M., Danijel D., Enna S. |
| Hotel ANNA | Mihaela, România (micul dejun); Christopher, Australia (recepția, parcarea); Adina, România (camerele) | Ramona, Zompara, Ana, Christian |

Cum le-am preluat:
- **Numele:** scurtate la prenume și inițială. La hotel apar prenumele și țara, cum erau în extras.
- **Citatele:** în română (D-56, la cererea ta), traduse de mine din extrasul în engleză, cu „…” unde fuseseră scurtate; am scos emoticoanele. Formularea poate diferi de original; originalul exact se poate pune din panou.
- **Data:** extrasul nu are luna, deci sub citat apare doar „Google”. Câmpul „Luna și anul” a devenit opțional; îl poți completa din panou.
- **Limba:** câmp nou, „Limba recenziei”, acum „Română” la toate. O recenzie lăsată în altă limbă primește `lang` corect (WCAG 3.1.2), iar în F4 știm din ce limbă se traduce.

**De verificat de tine:** Christopher (Australia), Zompara (Serbia), Ana (Olanda), Danijel și Enna au scris probabil în engleză. Le-am tradus și pe ele, cum ai cerut.

Teste: 66/66 (3 noi). Migrația: `20261124_221615_f3_recenzii_limba`.

## 10. După GATE 3: saloane, camere, hotel și întrebări (D-58)

Am luat faptele de pe davittoria.ro și hotelanna.ro (24.11.2026; sursele sunt în `docs/f3/2026_11_24_Trattoria_Surse_G8-3.md`). Le-am scris cu o scenă pe care oaspetele și-o poate imagina, cu beneficii concrete și cu un singur îndemn la final. N-am adăugat nimic ce nu scrie pe site-urile voastre.

| Unde | Text nou |
|---|---|
| Salon Trattoria | Un cadru intim pentru mesele la care fiecare invitat contează: o aniversare în familie, o onomastică, o tăiere de moț. Atmosfera e caldă, iar priveliștea de sus face restul. Ne spui data și câți invitați vin, iar noi te sunăm cu disponibilitatea. |
| Salon Vittoria | Cel mai încăpător salon al nostru, cu o atmosferă rafinată, pentru botezuri, aniversări rotunde sau o cină de firmă. Meniul îl gândim împreună cu tine, iar priveliștea de la mansardă rămâne în poze. Alegi data, iar managerul de evenimente te sună să stabiliți detaliile. |
| Camere Premium | Proaspăt renovate, cu paturi comode și lenjerii de calitate superioară. Dimineața te așteaptă bufetul suedez, cu mezeluri din mezelăria proprie. |
| Apartamente VIP Riviera | Pe malul Jiului, în complexul Riviera Events, cu acces la o grădină plină de flori. Pentru o seară romantică sau o nuntă de aur. Rezervări: +40 742 220 060. |
| Hotel · text | Hotel ANNA face parte din Grupul ANNA, ca și Trattoria. Micul dejun e inclus, parcarea e gratuită, iar copiii până la 5 ani stau gratuit. Alegi datele și camerele, trimiți cererea de aici, iar recepția îți confirmă oferta prin telefon sau email. |
| Hotel · preț | de la 320 lei · pe noapte, cu mic dejun inclus |
| Întrebare: Pot veni cu copiii? | Da, copiii sunt bineveniți. Pentru ei organizăm cursuri de pizza, unde își fac singuri pizza, iar pentru tăieri de moț și aniversări avem două saloane. Îl înscrii de pe pagina Cursuri de pizza. |
| Întrebare: Cum rezerv un salon…? | Apeși „Rezervă salonul”, alegi data și ne spui câți invitați vin. Te sunăm noi cu disponibilitatea. Dacă vrei să vorbești direct cu managerul de evenimente, inclusiv despre un meniu personalizat: +40 764 816 462. |
| Întrebare nouă: Puteți pregăti un meniu personalizat? | Da. Meniul și cateringul le stabilim împreună cu tine, după ocazie și numărul de invitați. Sună managerul de evenimente la +40 764 816 462 sau trimite cererea din formular, iar noi te sunăm. |

**Pe scurt:**
- **Eticheta „Exemplu”:** rămâne pe saloane și camere până vin fotografiile, pentru că panoul cere fotografii pentru un element care nu e provizoriu.
- **Răspunsuri care lipsesc:** cinci întrebări n-au răspuns pe site-uri (G9-1).
- **Apartamentele VIP Riviera** nu sunt la adresa hotelului și se rezervă la alt număr (G9-2).
- **Prețul de 320 lei** e cel de pe hotelanna.ro azi. Când se schimbă la hotel, îl schimbi din panou.

**Adresele site-ului vechi** (pentru G7-2): le-am notat din harta site-ului, în același fișier de surse; redirecționările le hotărâm în F5.

Teste: 71/71 (4 noi).

## 11. După GATE 3: bucătăria, saloanele, întrebările (D-59)

| Unde | Acum |
|---|---|
| Bucătăria · titlu | Cuptor pe lemne, făină și ingrediente din Italia. |
| Bucătăria · text | Rețetele sunt ale casei: pizza din cuptorul pe lemne, paste și risotto, pește, vită și deserturi. Dimineața, Buona Mattina. Tot meniul e în meniul digital. |
| Categoria Pizza | Din cuptorul pe lemne, cu făină din Italia |
| Evenimente private · text | Două saloane, la etaj și la mansardă, cu catering la cerere și o gamă largă de platouri pentru orice eveniment. Ne spui data și câți invitați vin, iar noi te sunăm cu disponibilitatea. |
| Cardurile saloanelor | Dotări: Catering la cerere · Meniu personalizat · Platouri pentru evenimente |
| Întrebări pe Acasă (5) | copiii, rezervarea salonului, parcarea (peste 150 de locuri, vizavi), preparate vegetariene și vegane, animalele de companie |
| Întrebări la Evenimente private (2) | meniul personalizat (catering și platouri), „Cum stabilim detaliile evenimentului?” (la telefon, +40 764 816 462) |
| Apartamente VIP Riviera | fără numărul separat: aceeași recepție ca Hotel ANNA (G9-2) |

G7-1 … G7-3 sunt aprobate de jurist. Paginile legale rămân „Provizoriu” până se completează ce e între paranteze drepte. Teste: 72/72.

**După GATE 3 (24.11.2026):** au intrat recenziile reale de pe Google, 7 pentru restaurant și 7 pentru hotel (D-55). Detalii în secțiunea 9.

Pagina HTML a raportului (privată): https://claude.ai/artifact/Jz61TqNb2Mzskz1B34ZXUP

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
