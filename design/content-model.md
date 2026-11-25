# Trattoria da Vittoria - model de conținut (2026-11-24, actualizat cu D-22 ... D-32)

Din acest document se construiesc colecțiile din panou, în Payload CMS 3 (stack aprobat, D-23). Descrie **ce** conținut există și ce reguli are; **cum** se stochează este decizia arhitectului.

- Decis de Alin: structura hibridă (D-11), un panou cu restaurante complet separate (D-12, D-25), traduceri native pe limbi (D-28, care înlocuiește D-13), catalog de vinuri de sine stătător (D-14), destinatari de email pe subiect (D-15), rolurile Administrator și Editor (D-16), telefoanele (D-17), conversia media în browser, fără fișiere inițiale pe server, clipuri de cel mult 120 de secunde, iar pe coperta de pe Acasă de cel mult 30 (D-07, D-24, D-27, D-61), conținutul provizoriu marcat (D-08), serile ca și colecție (D-09), premiile în 4 locuri (D-10, D-20), sunetul (D-21), rețelele din footer (D-30).
- Acceptat de Alin (D-32): cele 8 categorii din slider, sesizările simplificate, tema unică la lansare, efectele și sunetul în R2.
- **Propunere DESI, de validat la implementare:** toate limitele de lungime, rapoartele de aspect și dimensiunile minime de mai jos, plus câmpurile unui vin (Q-35). Limitele de mărime la încărcare și formatul audio nu sunt încă stabilite; durata maximă a unui clip este 120 de secunde; pe coperta de pe Acasă, 30 de secunde (D-24, D-61).

## 1. Convenții

| Notație | Înseamnă |
|---|---|
| **R** | Per restaurant: fiecare restaurant are valorile lui; un Editor vede doar restaurantul lui (D-12) |
| **G** | Global: o singură valoare pentru tot panoul; o schimbă doar Administratorul |
| **Da / Nu** în coloana Oblig. | Obligatoriu sau opțional la salvare |
| Coloana **Traducere** | „se traduce" = câmpul are o valoare pentru fiecare limbă (ro, en, it, fr, de, zh, sv) și intră la „Tradu automat"; „nu se traduce" = aceeași valoare în toate limbile; „-" = nu este text (D-28) |
| **NT** | Marcaj în coloana Reguli pentru câmpurile care nu se traduc |
| Limită | Număr maxim de caractere, cu spații; panoul arată un contor și nu lasă depășirea |

### Tipuri de câmp

| Tip | Descriere |
|---|---|
| text | Un rând, fără formatare |
| text lung | Mai multe rânduri, fără formatare |
| text formatat | Doar: aldin, cursiv, legătură, listă. Fără titluri, culori, imagini |
| număr / preț | Preț: RON, fără zecimale afișate dacă sunt zero |
| dată / oră / dată-oră | Fus orar: România |
| bifă | Da sau nu |
| alegere / alegere multiplă | Dintr-o listă fixă, scrisă în coloana Reguli |
| imagine / video / audio / logo | Referință către un fișier din Biblioteca media (secțiunea 6) |
| referință | Legătură către un element din altă colecție |
| url / telefon / email / culoare | Validate ca format |

### Câmpuri comune tuturor elementelor de conținut (R)

| Câmp | Tip | Oblig. | Reguli | Traducere |
|---|---|---|---|---|
| Activ | bifă | Da | Oprit = nu apare pe site, dar rămâne în panou | - |
| Provizoriu | bifă | Da | Pornit = pe site apare eticheta „Exemplu · de înlocuit"; intră în contorul din tabloul de bord (D-08) | - |
| Ordine | număr | Nu | Doar unde ordinea este manuală; se schimbă prin tragere | - |
| Modificat de, modificat la | sistem | - | Pentru istoric și anulare | - |

### Formate de fotografie (propunere DESI)

Omul alege fișierul; decupajul se face după punctul focal, la încărcare (D-07, D-27). Dacă fișierul este sub minim, panoul avertizează, dar nu blochează.

| Cod | Folosit la | Raport de aspect | Dimensiune minimă a fișierului încărcat |
|---|---|---|---|
| HERO-L | Hero pe desktop: poster și cadre de slideshow | 16:9 | 2400 × 1350 px |
| HERO-P | Hero pe telefon: poster și cadre de slideshow | 9:16 | 1080 × 1920 px |
| CARD-P | Categorii de preparate, vinuri, afișul unei seri | 4:5 | 1080 × 1350 px |
| CARD-L | Saloane, tipuri de camere, cursuri, Cazare | 3:2 | 1800 × 1200 px |
| GAL | Galerie, fotografii după eveniment | liber | 1600 px pe latura lungă |
| SHARE | Imaginea de distribuire pe rețele | 1,91:1 | 1200 × 630 px |
| LOGO | Logo-uri | liber | SVG; dacă nu există, PNG transparent de minimum 600 px lățime |
| BADGE | Logo-ul oficial al unui premiu | cel al fișierului oficial | Fișierul oficial, nemodificat: fără decupare, recolorare sau punct focal (D-10) |

Video pentru hero: două fișiere, unul pe lat (16:9) pentru desktop și unul pe înalt (9:16) pentru telefon, fără sunet, de cel mult 30 de secunde fiecare (D-24). Materialul există (D-29).

## 2. Global (G) - doar Administrator

### G1. Restaurante

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Nume | text | Da | 60 | NT. Apare în comutatorul de restaurant și în subiectul emailurilor | nu se traduce |
| Identificator scurt | text | Da | 30 | Litere mici și cratime; nu se schimbă după creare | nu se traduce |
| Domeniu | url | Nu | - | Gol până la legarea domeniului (D-20); până atunci site-ul stă pe adresa temporară Vercel, neindexată, fără parolă (D-22) | - |
| Indexare de către Google | bifă | Da | - | Oprită implicit; se pornește la legarea domeniului | - |
| Activ | bifă | Da | - | | - |

La lansare există un singur restaurant: Trattoria da Vittoria. Urmează, în R3 (D-25): Restaurant Citybar & Josper Grill (citybar.ro), Restaurant SuperBistro (superbistro.ro), Restaurant Terasa Anna (terasa-anna.ro).

### G2. Utilizatori

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Nume | text | Da | 60 | | nu se traduce |
| Email | email | Da | - | Folosit la autentificare | - |
| Rol | alegere | Da | - | Administrator sau Editor (D-16) | - |
| Restaurante | alegere multiplă | Da pentru Editor | - | Administratorul le vede pe toate; Editorul doar pe cele bifate (D-12) | - |
| Activ | bifă | Da | - | | - |

| Zonă din panou | Administrator | Editor |
|---|---|---|
| Conținut, Bibliotecă media, Evenimente, Vinuri, Recenzii, FAQ | da | da |
| Premii și distincții | da | nu (propunere) |
| Setări, Utilizatori, Restaurante, Redirecționări | da | nu |

Publicarea este directă, fără aprobare (presupunere, A-17).

### G3. Set aprobat de fonturi

| Câmp | Tip | Oblig. | Reguli | Traducere |
|---|---|---|---|---|
| Nume font | text | Da | NT | nu se traduce |
| Rol | alegere | Da | Titluri sau Text | - |
| Acoperă diacriticele românești | bifă | Da | Obligatoriu pornit: ș, ț, ă, â, î | - |

Setul îl stabilește echipa de design în runda 3 și este livrat odată cu site-ul, nu încărcat din panou. Fiecare restaurant alege din el (R1).

## 3. Setări per restaurant (R) - doar Administrator

### R1. Identitate

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Tagline | text | Da | 40 | NT. Trattoria: „The Best Restaurant in Town" (D-01) | nu se traduce |
| Logo principal | logo | Da | - | LOGO | - |
| Logo pe fundal închis | logo | Nu | - | LOGO; dacă lipsește, se folosește cel principal | - |
| Logo grup | logo | Nu | - | LOGO; la Trattoria: logo ANNA, în footer | - |
| Pictogramă de filă | logo | Da | - | SVG sau PNG pătrat, minimum 512 px | - |
| Culoare fundal, text, accent, accent secundar | culoare | Da | - | Panoul verifică contrastul text pe fundal: minimum 4,5:1; sub prag, nu lasă salvarea | - |
| Font titluri, font text | referință G3 | Da | - | | - |
| Temă implicită | alegere | Da | - | Închisă sau deschisă; o singură temă la lansare, comutatorul pentru vizitatori vine în R2 (D-32). Care temă: Q-17 | - |
| Imagine de distribuire implicită | imagine | Da | - | SHARE | - |
| Forme decorative pe secțiuni | da/nu | Nu | - | Pornit implicit. Desene fine pe fundal, câte unul potrivit fiecărei secțiuni; culoarea vine din temă (D-62) | - |
| Margini ondulate între secțiuni | da/nu | Nu | - | Pornit implicit. Unde se schimbă culoarea fundalului, marginea e șerpuită (D-62) | - |
| Cât de vizibile sunt formele | alegere | Nu | - | Discret (implicit), Mediu, Vizibil (D-62) | - |

### R2. Contact și program

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Adresă: stradă și număr, oraș, județ, țară | text | Da | 60 fiecare | Trattoria: Strada Victoriei nr. 8, Târgu Jiu | nu se traduce |
| Poziție pe hartă | număr × 2 | Da | - | Latitudine, longitudine | - |
| Telefon rezervări mese | telefon | Da | - | +40 356 630 238. Apare în antet, în Contact și ca rezervă a ferestrei ialoc (D-17) | - |
| Telefon evenimente | telefon | Nu | - | 0764 816 462. Apare în Evenimente private și la „Rezervă salonul" (D-17) | - |
| Program | 7 rânduri: zi, deschis de la, până la, închis | Da | - | Trattoria: zilnic 8:00 - 24:00 | - |
| Notă la program | text | Nu | 120 | | se traduce |
| Facebook, Instagram, YouTube, TikTok, TripAdvisor | url | Nu | - | Instagram: instagram.com/trattoriadavittoria. YouTube: youtube.com/@AnnaEvents și TikTok: tiktok.com/@anna.events sunt conturi la nivel de grup (D-30). Apar în footer | - |
| Legătură recenzie Google | url | Nu | - | Folosită de butonul „Lasă o recenzie" | - |
| Alte rețele | listă: nume + url | Nu | 5 rânduri | Apar doar dacă sunt completate | nu se traduce |

### R3. Integrări

| Câmp | Tip | Oblig. | Reguli | Traducere |
|---|---|---|---|---|
| ID ialoc | text | Da | Trattoria: 4385 (D-03) | nu se traduce |
| Adresa meniului digital | url | Da | Trattoria: meniudigital.ro/trattoriadavittoria | - |
| Limbi active | alegere multiplă | Da | ro (implicită), en, it, fr, de, zh, sv (D-28). Fiecare limbă are adresa ei: /en, /it, /fr, /de, /zh, /sv; româna stă la rădăcină | - |
| ID statistici | text | Nu | Se păstrează contul existent (D-32) | nu se traduce |

### R4. Cereri și emailuri - un rând pentru fiecare subiect

Subiecte fixe: Eveniment privat, Curs de pizza pentru copii, Cazare, Întrebare, Sesizare.

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Destinatari | listă de email | Da | 5 | Cazare: rezervari@hotelanna.ro (D-15) | - |
| Copie | listă de email | Nu | 5 | Configurată de Administrator; nu apare nicăieri pe site | - |
| Termen de răspuns afișat | text | Nu | 60 | Apare în confirmare; gol până la Q-34 | se traduce |
| Subiect activ | bifă | Da | - | Oprit = butonul dispare din formular | - |

Subiectul emailului se generează singur: „[Subiect] de pe site-ul [Nume restaurant]", de exemplu „Cerere de cazare de pe site-ul Trattoria da Vittoria" (D-15).

### R5. Redirecționări

| Câmp | Tip | Oblig. | Reguli | Traducere |
|---|---|---|---|---|
| De la | text | Da | Adresă veche, relativă | nu se traduce |
| Către | url | Da | Adresă nouă sau externă | - |

La Trattoria, de pornire: `/valori-nutritionale/` către meniul digital (propunere, de confirmat la D-19).

## 4. Secțiunile paginii Acasă (R)

Fiecare secțiune are în plus: **Pornită** (bifă), **Ordine** (număr), **Etichetă în meniu** (text, 20). Oprirea unei secțiuni o scoate și din meniu. Tipurile de secțiune sunt fixe; nu se pot crea secțiuni noi din panou.

### 4.1 Hero

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Mod media | alegere | Da | - | Video (implicit, D-29) sau Slideshow (rezervă) | - |
| Video desktop | video | Da dacă mod = Video | - | 16:9, fără sunet, cel mult 30 s (D-61: doar clipurile scurte) | - |
| Video telefon | video | Da dacă mod = Video | - | 9:16, fără sunet, cel mult 30 s (D-02, D-24, D-61) | - |
| Poster desktop | imagine | Da | - | HERO-L; apare înaintea clipului | - |
| Poster telefon | imagine | Da | - | HERO-P | - |
| Cadre de slideshow | listă: imagine desktop + imagine telefon | Da dacă mod = Slideshow | 5 cadre | HERO-L + HERO-P | - |
| Subtitlu | text | Nu | 90 | | se traduce |
| Etichetă buton rezervare | text | Da | 22 | Implicit „Rezervă o masă"; deschide fereastra ialoc | se traduce |
| Etichetă buton meniu | text | Da | 22 | Implicit „Meniu"; deschide meniul digital în filă nouă | se traduce |

Tagline-ul vine din R1. Insigna de premiu vine din colecția Premii (5.10). Butonul de sunet stă în antet, pe telefon și pe desktop (D-21).

### 4.2 Bară de cazare

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 30 | „Cazare la Hotel ANNA" | se traduce |
| Text sub bară | text | Da | 90 | Spune că este o cerere, confirmată de hotel | se traduce |
| Etichetă buton | text | Da | 26 | „Cere ofertă de cazare" | se traduce |
| Maximum de adulți, maximum de copii | număr | Da | - | Implicit 6 și 4 (presupunere) | - |

Pe telefon bara este un buton care deschide panoul S-01b. Trimite cererea cu subiectul Cazare (R4).

### 4.3 Bucătăria

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 50 | | se traduce |
| Text introductiv | text lung | Nu | 160 | | se traduce |
| Etichetă buton | text | Da | 26 | „Vezi meniul complet" | se traduce |

Cardurile vin din colecția Categorii de preparate (5.1).

### 4.4 Vinuri

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 50 | | se traduce |
| Text introductiv | text lung | Nu | 160 | | se traduce |
| Etichetă buton | text | Da | 26 | „Vezi lista de vinuri"; duce la /catalog-vinuri | se traduce |

Cardurile sunt vinurile bifate „Recomandat" (5.2), cel mult 10. Insigna și rândul de lângă ea vin din Premii (5.10).

### 4.5 Ce spun oaspeții

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 50 | | se traduce |
| Etichetă buton | text | Da | 26 | „Lasă o recenzie"; folosește legătura din R2 | se traduce |

Arată primele 3 recenzii active din grupul Restaurant (5.3).

### 4.6 Petreceri și agenda

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 50 | | se traduce |
| Text introductiv | text lung | Nu | 160 | | se traduce |
| Mesaj fără seri viitoare | text | Da | 120 | Implicit „Pregătim următoarea seară" | se traduce |

Arată următoarele 3 seri din colecția Seri tematice (5.4).

### 4.7 Evenimente private

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 50 | | se traduce |
| Text introductiv | text lung | Nu | 200 | | se traduce |
| Tipuri de evenimente | listă de text | Nu | 8 × 24 | De exemplu: onomastici, botezuri, tăieri de moț | se traduce |
| Etichetă buton | text | Da | 26 | „Rezervă salonul" | se traduce |

Cardurile vin din colecția Saloane (5.5). Aceleași câmpuri alimentează și antetul paginii S-02.

### 4.8 Cursuri de pizza pentru copii

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 50 | | se traduce |
| Text scurt | text lung | Da | 300 | Pe Acasă | se traduce |
| Fotografie | imagine | Da | - | CARD-L | - |
| Etichetă buton | text | Da | 26 | „Înscrie copilul" | se traduce |
| Text complet | text formatat | Da | 1200 | Pe pagina S-04 | se traduce |
| Galerie foto-video | listă media | Nu | 12 | GAL | - |
| Vârstă, durată, preț, număr de locuri | text | Nu | 40 fiecare | Goale până la Q-11; apar doar dacă sunt completate | se traduce |

Sesiunile cu date și locuri vin în R3 (F-24).

### 4.9 Cazare - Hotel ANNA

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 50 | | se traduce |
| Text introductiv | text lung | Da | 300 | | se traduce |
| Numele hotelului | text | Da | 40 | NT | nu se traduce |
| Adresa hotelului | text | Da | 80 | Bd. Ecaterina Teodoroiu 17, Târgu Jiu | nu se traduce |
| Site-ul hotelului | url | Nu | - | hotelanna.ro | - |
| Preț „de la" și mențiune | preț + text | Nu | 40 | Apare doar dacă este completat și confirmat | se traduce |
| Fotografii | listă de imagini | Da | 3 | CARD-L | - |

Tipurile de camere vin din 5.6; recenziile din grupul Hotel (5.3).

### 4.10 Galerie

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 50 | | se traduce |
| Etichetă buton | text | Da | 26 | „Vezi galeria" | se traduce |

Arată 6-8 elemente bifate „Pe Acasă" din colecția Galerie (5.7).

### 4.11 Contact și întrebări frecvente

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 50 | | se traduce |
| Text introductiv | text lung | Nu | 160 | | se traduce |

Adresa, programul, telefoanele și harta vin din R2. Butoanele de subiect vin din R4. Întrebările vin din FAQ, grupul Acasă (5.8), cel mult 5.

### 4.12 Footer

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Text drepturi | text | Da | 80 | | se traduce |
| Credit realizator | fix | - | - | Două rânduri, discrete: „Made with ❤️ by BizTech Consulting SRL" / „www.biztech.ro / +40772295031". Nu se editează din panou și nu se traduce | - |

Conține în plus: logo grup (R1), rândul „Premii și distincții" (5.10), Linkuri grup (5.11), Pagini legale (5.12), contact și rețele (R2), selectorul de limbă (R3).

## 5. Colecții (R)

### 5.1 Categorii de preparate

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Nume | text | Da | 32 | NT, de exemplu „Pasta e Risotto" | nu se traduce |
| Text scurt | text | Nu | 70 | | se traduce |
| Fotografie | imagine | Da | - | CARD-P | - |
| Legătură | url | Nu | - | Gol = adresa meniului digital din R3 | - |

De pornire, cele 8 acceptate (D-32): Recomandări din partea casei, Antipasti, Pasta e Risotto, Pizza, Preparate Marine, Preparate Vită, Deserturi, Buona Mattina. Cel mult 10 active. Ordine manuală.

### 5.2 Vinuri (câmpuri propuse, Q-35)

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Nume | text | Da | 60 | NT | nu se traduce |
| Producător | text | Nu | 50 | NT | nu se traduce |
| Tip | alegere | Da | - | Spumant, Alb, Rosé, Roșu, Desert | - |
| Țară | text | Nu | 30 | | se traduce |
| Regiune sau denumire de origine | text | Nu | 50 | NT | nu se traduce |
| An | număr | Nu | - | Patru cifre; gol = fără an | - |
| Soiuri | text | Nu | 60 | | nu se traduce |
| Preț la sticlă | preț | Da | - | RON | - |
| Volum | alegere | Da | - | 0,375 l, 0,75 l (implicit), 1,5 l | - |
| Preț la pahar | preț | Nu | - | Gol = nu se servește la pahar | - |
| Descriere scurtă | text lung | Nu | 160 | | se traduce |
| Fotografie | imagine | Nu | - | CARD-P | - |
| Recomandat | bifă | Da | - | Apare în sliderul de pe Acasă; cel mult 10 | - |
| Disponibil | bifă | Da | - | Oprit = rămâne în panou, dispare din listă | - |
| Cod extern | text | Nu | 40 | Pentru legarea ulterioară cu portalul de vinuri (D-14) | nu se traduce |

Ordine: pe tip, apoi manuală.

### 5.3 Recenzii

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Autor | text | Da | 30 | NT; prenume și inițială | nu se traduce |
| Text | text lung | Da | 280 | | se traduce |
| Sursă | alegere | Da | - | Google, TripAdvisor, Facebook, Altă sursă | - |
| Legătură către sursă | url | Nu | - | | - |
| Luna și anul | dată | Nu (D-55) | - | Se afișează „octombrie 2026"; fără dată apare doar sursa | - |
| Limba recenziei | alegere | Da | - | Limba în care a scris oaspetele (ro, en, it, fr, de, sv, zh); citatul primește `lang` (D-55) | - |
| Notă | număr | Nu | - | 1-5 | - |
| Grup | alegere | Da | - | Restaurant sau Hotel | - |

Recenziile-exemplu au „Provizoriu" pornit până sosesc cele reale (D-06, D-08). Cele reale de pe Google au venit pe 24.11.2026 (D-55).

### 5.4 Seri tematice (D-09)

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Numele serii | text | Da | 50 | NT | nu se traduce |
| Data și ora de început | dată-oră | Da | - | La publicare trebuie să fie în viitor | - |
| Ora de sfârșit | oră | Nu | - | | - |
| Tip | alegere | Da | - | DJ, Artist, Formație, Altul | - |
| Numele invitatului | text | Nu | 50 | NT | nu se traduce |
| Afiș sau fotografie | imagine | Da | - | CARD-P; este și imaginea de distribuire | - |
| Descriere scurtă | text lung | Nu | 200 | | se traduce |
| Intrare | text | Nu | 40 | De exemplu „Intrare liberă"; se completează la fiecare seară, dacă este cazul | se traduce |
| Rezervare cu data serii | bifă | Da | - | Pornit implicit: butonul deschide fereastra ialoc cu data serii (de probat) | - |
| Fotografii după eveniment | listă de imagini | Nu | 20 | GAL; apar în arhiva foto și în Galerie, categoria Petreceri | - |

Stare calculată: viitoare sau trecută. O seară trecută iese singură din agendă și intră în arhivă. Nu există o listă de teme: orice nume este valid.

### 5.5 Saloane

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Nume | text | Da | 30 | NT: „Salon Trattoria", „Salon Vittoria" | nu se traduce |
| Amplasare | text | Nu | 40 | „la etaj", „la mansardă" | se traduce |
| Capacitate maximă | număr | Da | - | 25 și 40 (A-08). Formularul sugerează salonul după numărul de invitați; peste cea mai mare capacitate, îndrumă către Riviera Events sau ANNA Events (D-32) | - |
| Descriere | text lung | Da | 300 | | se traduce |
| Fotografii | listă de imagini | Da | 3-10 | CARD-L | - |
| Dotări | listă de text | Nu | 8 × 30 | | se traduce |

### 5.6 Tipuri de camere

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Nume | text | Da | 40 | NT: „Camere Premium", „Apartamente VIP Riviera" | nu se traduce |
| Descriere | text lung | Nu | 160 | | se traduce |
| Fotografie | imagine | Da | - | CARD-L | - |

Apar și ca opțiuni la „Tip de cameră" în cererea de cazare.

### 5.7 Galerie

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Fișier | imagine sau video | Da | - | GAL | - |
| Categorie | referință | Da | - | Restaurant, Preparate, Vinuri, Petreceri, Hotel, Evenimente (listă editabilă: nume, 20 de caractere, ordine) | - |
| Legendă | text | Nu | 80 | | se traduce |
| Pe Acasă | bifă | Da | - | Cel mult 8 | - |

### 5.8 Întrebări frecvente

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Întrebare | text | Da | 120 | | se traduce |
| Răspuns | text formatat | Da | 600 | | se traduce |
| Grup | alegere | Da | - | Acasă, Evenimente private, Cursuri de pizza, Cazare, Restaurant | - |

### 5.9 Motive de sesizare

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Motiv | text | Da | 80 | De pornire: cele 9 de pe site-ul actual (acceptat, D-32) | se traduce |

### 5.10 Premii și distincții (D-10, D-20) - doar Administrator

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Numele premiului | text | Da | 60 | NT: „Wine Spectator Restaurant Award" | nu se traduce |
| Organizație | text | Da | 40 | NT | nu se traduce |
| Nivel | text | Nu | 40 | NT; gol până la acordare | nu se traduce |
| An | număr | Nu | - | Gol până la acordare | - |
| Logo oficial | logo | Nu | - | BADGE; gol până la acordare. Se afișează exact cum a fost încărcat | - |
| Rând de text | text | Nu | 90 | Lângă insignă, în antetul secțiunii Vinuri | se traduce |
| Legătură către sursă | url | Nu | - | | - |
| Locuri de afișare | alegere multiplă | Da | - | Hero, Antet secțiune Vinuri, Antet pagină vinuri, Footer. Implicit: toate patru (D-20) | - |
| În datele pentru Google | bifă | Da | - | Are efect doar când nivelul și anul sunt completate | - |

Cât timp nivelul, anul sau logo-ul lipsesc, în locul insignei apare spațiul rezervat cu textul „[Numele premiului] · nivel și an la confirmare", iar elementul rămâne „Provizoriu". Dimensiunea minimă oficială a logo-ului: de verificat când sosește fișierul.

### 5.11 Linkuri grup

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Nume | text | Da | 40 | NT | nu se traduce |
| Adresă | url | Da | - | | - |

De pornire la Trattoria: cele 10 legături de pe site-ul actual.

### 5.12 Pagini legale

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Titlu | text | Da | 60 | | se traduce |
| Adresă scurtă | text | Da | 40 | | nu se traduce |
| Conținut | text formatat | Da | - | Aici sunt permise și titluri de secțiune | se traduce |
| În footer | bifă | Da | - | | - |

Textele vin de la juristul grupului (Q-25); până atunci, „Provizoriu". Se traduc ca orice alt text.

### 5.13 Efecte sezoniere și sunete (R2)

| Câmp | Tip | Oblig. | Reguli | Traducere |
|---|---|---|---|---|
| Efect | alegere | Da | Ninsoare, Frunze, Petale, Niciunul | - |
| Mod | alegere | Da | Oprit, Automat după dată, Manual | - |
| Perioadă | dată × 2 | Da dacă mod = Automat | | - |
| Pe telefon, pe desktop | bifă × 2 | Da | Ambele pornite implicit (D-02) | - |
| Sunet: fișier, titlu, ordine | audio + text | Nu | Format și limite: de stabilit la implementare. Butonul apare pe telefon și pe desktop, oprit implicit (D-21) | - |

## 6. Biblioteca media (R)

Un fișier se încarcă o singură dată și poate fi folosit în mai multe locuri. Conversia se face automat la încărcare, în browser (D-24). **Pe server stau doar variantele optimizate; fișierul inițial rămâne la cel care încarcă** (D-27). Panoul afișează: „Păstrează originalul la tine; pe site rămâne doar varianta optimizată".

| Câmp | Tip | Oblig. | Limită | Reguli | Traducere |
|---|---|---|---|---|---|
| Variante optimizate | sistem | Da | - | Fotografii: AVIF cu rezervă WebP, în mai multe dimensiuni. Clipuri: MP4 H.264 plus o variantă mai eficientă, cu poster static. SVG neschimbat (D-07) | - |
| Tip | sistem | Da | - | Fotografie, Clip, Sunet, Logo | - |
| Titlu intern | text | Nu | 60 | Doar pentru căutare în panou; nu se traduce | nu se traduce |
| Text alternativ | text | Da la fotografii și clipuri | 140 | Fără el, fișierul nu poate fi salvat | se traduce |
| Punct focal | poziție | Da la fotografii | - | Se alege la încărcare; implicit centru; nu se aplică la Logo și BADGE | - |
| Credit foto | text | Nu | 60 | NT | nu se traduce |
| Sunt copii în imagine | bifă | Da | - | Propunere DESI | - |
| Acordul părinților confirmat | bifă | Da dacă bifa de sus e pornită | - | Propunere DESI; regula juridică: de confirmat (Q-25) | - |
| Mărime înainte și după, folosit în | sistem | - | - | Afișate, nu editabile | - |

| Regulă la încărcare | Valoare | Sursă |
|---|---|---|
| Formate acceptate | JPG, PNG, HEIC; MP4, MOV; SVG pentru logo-uri | D-07 |
| Durata maximă a unui clip | 120 de secunde; un clip mai lung este respins cu un mesaj care spune durata lui și limita. Peste 30 s, clipul se convertește la 720p. Coperta de pe Acasă primește doar clipuri de cel mult 30 s | D-24, D-61 |
| Mărimea maximă a fișierului | de stabilit după proba din faza 0 | - |
| Schimbarea punctului focal după încărcare | Lucrează pe cea mai mare variantă păstrată; pentru o decupare nouă la calitate maximă, panoul cere reîncărcarea fișierului | A-23, de probat |

## 7. Cereri (R) - înregistrări create de formulare, nu de personal

| Câmp | Tip | Reguli | Traducere |
|---|---|---|---|
| Subiect | alegere | Cele 5 din R4 | - |
| Nume, telefon, email, mesaj | text | Telefon și email obligatorii | nu se traduce |
| Câmpuri pe subiect | după caz | Eveniment privat: tip, dată, număr de invitați, salon. Curs: număr de copii, vârste, dată dorită. Cazare: sosire, plecare, adulți, copii, tip de cameră. Sesizare: data vizitei, motiv, descriere, ospătar (opțional), fotografia bonului (opțional) | - |
| Acord pentru prelucrarea datelor | bifă + moment | Obligatoriu; se păstrează împreună cu cererea | - |
| Email trimis | sistem | Da sau nu; cererea se păstrează oricum | - |
| Stare | alegere | Nouă, În lucru, Rezolvată; ecranul vine în R2 (F-52) | - |

Durata de păstrare: subiect pentru arhitect. Nu cerem alergii sau alte date de sănătate în formulare.

## 8. Ce este global și ce este per restaurant

| Global (G) | Per restaurant (R) |
|---|---|
| Lista de restaurante, utilizatorii și rolurile, setul aprobat de fonturi, tipurile de secțiune, formatele de fotografie | Identitate (logo, paletă, fonturi alese), domeniu, contact, program, integrări, destinatari de email, redirecționări, secțiunile pornite și ordinea lor, toate colecțiile din secțiunea 5, biblioteca media, cererile |

## 9. Traduceri (D-28)

- Limbi: ro (implicită), en, it, fr, de, zh, sv. Fiecare limbă are adresa ei și se indexează. Fără GTranslate.
- Coloana **Traducere** din fiecare tabel spune dacă un câmp are valoare pe limbă.
- **Nu se traduc:** tagline-ul, numele restaurantului și al hotelului, denumirile italiene de categorii și preparate, numele de vinuri, producători și regiuni, saloanele, tipurile de camere, numele serilor și ale invitaților, premiile și organizațiile, autorii recenziilor, numele din Linkuri grup, creditul realizatorului.
- **Recenziile:** textul unei recenzii se traduce, cu mențiunea „tradus din română" lângă el (propunere DESI), ca să nu pară scris de oaspete în altă limbă.

| Element în panou | Comportament |
|---|---|
| Comutator de limbă pe document | Arată aceleași câmpuri în limba aleasă; câmpurile „nu se traduce" sunt blocate și afișează valoarea comună |
| Buton „Tradu automat" | Completează câmpurile „se traduce" goale, în limba aleasă sau în toate limbile; nu suprascrie un text „verificat de om" fără confirmare |
| Stare pe limbă, pe fiecare document | Netradus, Tradus automat, Verificat de om. Starea are text, nu doar culoare |
| Modificarea textului în română | Marchează traducerile existente „de reverificat" (propunere DESI, A-24) |
| Pe site, când o traducere lipsește | Se afișează textul în română, nu un spațiu gol (propunere DESI) |

Ordinea de lucru: întâi conținutul în română, final; apoi traducerile (D-28). Fereastra ialoc rămâne doar în ro și en.

## 10. Întrebări care ating modelul

- Q-35: câmpurile unui vin și cerințele premiului pentru forma listei.
- Q-34: termenele de răspuns pe subiect.
- Q-17: brandul, din care vin paleta, fonturile și tema implicită.
- Q-11: vârsta, durata, prețul și numărul de locuri la cursurile de pizza.
- Q-25: textele juridice și acordul pentru fotografiile cu copii.
- De probat în faza 0: conversia în browser, mărimea maximă la încărcare; de stabilit: formatul audio.
