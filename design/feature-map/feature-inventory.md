# Trattoria da Vittoria - inventar de funcționalități (runda 1, 2026-11-24)

Actualizat cu deciziile lui Alin din 2026-11-24 (D-01 ... D-21). ID-urile sunt de lucru până la validarea de către client; după aceea devin permanente. F-59 ... F-62 au fost adăugate după prima numerotare, de aceea F-60 stă în modulul Restaurant.
Surse: brieful clientului (secțiunile 1-4), contextul transmis cu cererea, analiza davittoria.ro, meniudigital.ro, hotelanna.ro și vineyard.co.za din 2026-11-24.

| ID | Feature | Module | Roles | Priority | Release | Needs | Status | Source |
|---|---|---|---|---|---|---|---|---|
| F-01 | Hero cu video sau slideshow | Acasă și navigare | Oaspete | Must | MVP | F-48 | new | brief 2.1 |
| F-02 | Rezervă o masă - widget rezervări | Acasă și navigare | Oaspete | Must | MVP | - | existing | brief 2.1; decis de Alin 2026-11-24: ialoc.ro, mod popup |
| F-03 | Meniu - link către meniul digital | Acasă și navigare | Oaspete | Must | MVP | - | existing | brief 2.1 |
| F-04 | Bară cerere cazare pe Home | Acasă și navigare | Turist | Should | MVP | F-26 | new | brief 2.1; imagine-model Vineyard primită 2026-11-24 |
| F-05 | Navigare principală și ancore | Acasă și navigare | Oaspete | Must | MVP | - | new | decis de Alin 2026-11-24: structură hibridă (D-11) |
| F-06 | Bară fixă de acțiuni pe mobil | Acasă și navigare | Oaspete | Should | MVP | F-02, F-03 | proposed | DESI |
| F-07 | Animații 3D în hero | Acasă și navigare | Oaspete | Could | R2 | F-01 | new | brief 2.1; decis de Alin 2026-11-24: doar pe desktop |
| F-08 | Slider categorii de preparate | Restaurant | Oaspete | Must | MVP | F-49 | new | brief 2.2 |
| F-09 | Slider vinuri recomandate | Restaurant | Oaspete | Must | MVP | F-62 | new | brief 2.2 |
| F-10 | Catalog complet de vinuri | Restaurant | Oaspete | Must | MVP | F-62 | new | brief 2.2; decis de Alin 2026-11-24: catalog de sine stătător în site, la /catalog-vinuri (D-14) |
| F-11 | Vinuri preluate automat din portal | Restaurant | Oaspete | Should | Later | F-10 | deferred | decis de Alin 2026-11-24: portalul de vinuri se construiește ulterior (D-14) |
| F-12 | Recenzii oaspeți restaurant | Restaurant | Oaspete | Must | MVP | F-51 | new | brief 2.2; decis de Alin 2026-11-24: recenziile reale vin mai târziu, până atunci exemple marcate |
| F-13 | Lasă o recenzie pe Google | Restaurant | Oaspete | Must | MVP | - | existing | brief 2.2 |
| F-14 | Recenzii Google preluate automat | Restaurant | Oaspete | Could | Later | F-12 | proposed | DESI |
| F-60 | Premii și distincții afișate | Restaurant | Oaspete | Must | MVP | F-61 | new | decis de Alin 2026-11-24: premiul Wine Spectator într-un loc relevant |
| F-15 | Saloane private cu slider foto | Evenimente și petreceri | Organizator | Must | MVP | F-49 | new | brief 2.3 |
| F-16 | Cerere Rezervă salonul | Evenimente și petreceri | Organizator | Must | MVP | F-32 | new | brief 2.3 |
| F-17 | Agenda evenimentelor următoare | Evenimente și petreceri | Oaspete | Must | MVP | F-50 | new | brief 2.3 (calendar sau widget); decis de Alin 2026-11-24: serile sunt o colecție din panou |
| F-18 | Petreceri tematice - prezentare | Evenimente și petreceri | Oaspete | Must | MVP | F-49 | new | brief 2.4; decis de Alin 2026-11-24: fără listă fixă de teme |
| F-19 | Rezervă masă la un eveniment | Evenimente și petreceri | Oaspete | Should | MVP | F-02, F-17 | proposed | DESI |
| F-20 | Calendar lunar tip grilă | Evenimente și petreceri | Oaspete | Could | Later | F-17 | undecided | brief 2.3 (calendar sau widget) |
| F-21 | Adaugă evenimentul în calendarul meu | Evenimente și petreceri | Oaspete | Could | R2 | F-17 | proposed | DESI |
| F-22 | Prezentare cursuri cu foto și video | Cursuri de pizza pentru copii | Părinte | Must | MVP | F-49 | new | brief 2.5 |
| F-23 | Înscriere la curs | Cursuri de pizza pentru copii | Părinte | Must | MVP | F-32 | new | brief 2.5 |
| F-24 | Sesiuni cu date și locuri | Cursuri de pizza pentru copii | Părinte | Should | R3 | F-23, F-55 | proposed | DESI |
| F-25 | Plată online pentru loc | Cursuri de pizza pentru copii | Părinte | Could | Later | F-24 | proposed | DESI |
| F-26 | Cerere de rezervare cazare | Cazare Hotel ANNA | Turist | Must | MVP | F-32 | new | brief 2.1, 2.6 |
| F-27 | Prezentare Hotel ANNA cu galerie | Cazare Hotel ANNA | Turist | Must | MVP | F-49 | new | brief 2.6 |
| F-28 | Recenzii oaspeți hotel | Cazare Hotel ANNA | Turist | Should | MVP | F-51 | new | brief 2.6; decis de Alin 2026-11-24: recenziile reale vin mai târziu, până atunci exemple marcate |
| F-29 | Widget central de booking ANNA | Cazare Hotel ANNA | Turist | Should | Later | - | deferred | context: platforma de rezervări a hotelurilor ANNA |
| F-30 | Galerie mozaic pe categorii | Galerie | Oaspete | Must | MVP | F-48 | new | brief 2.7 |
| F-31 | Foto mare și video la click | Galerie | Oaspete | Must | MVP | F-30 | proposed | implicit într-o galerie |
| F-32 | Formular unic cu selector de subiect | Contact și cereri | Oaspete | Must | MVP | - | proposed | DESI - înlocuiește formularele separate din brief 2.8 |
| F-33 | Formular de sesizări | Contact și cereri | Oaspete | Must | MVP | - | existing | brief 2.8; /formular-de-reclamatie/ pe site-ul actual |
| F-34 | Confirmare pe ecran și pe email | Contact și cereri | Oaspete | Must | MVP | F-32 | new | brief 4 (Resend) |
| F-35 | Date de contact, program și hartă | Contact și cereri | Oaspete | Must | MVP | - | new | brief 2.8 |
| F-36 | Butoane rapide Sună și WhatsApp | Contact și cereri | Oaspete | Should | MVP | - | proposed | DESI; WhatsApp de confirmat |
| F-37 | Abonare la noutăți - newsletter | Contact și cereri | Oaspete | Could | Later | - | deferred | acceptat de Alin 2026-11-24: nu acum (D-32) |
| F-38 | Footer cu Grupul ANNA | Experiența pe site | Oaspete | Must | MVP | F-49 | new | brief 2.9 |
| F-39 | Pagini legale și acord cookies | Experiența pe site | Oaspete | Must | MVP | - | new | brief 2.9; acordul cookies e propunere DESI |
| F-40 | Secțiuni FAQ | Experiența pe site | Oaspete | Should | MVP | F-49 | new | brief 3 |
| F-41 | Selector de limbă - 7 limbi | Experiența pe site | Turist | Must | MVP | F-57 | new | brief 3, 4; decis de Alin 2026-11-24: traduceri native, fiecare limbă cu adresa ei (D-28) |
| F-42 | Comutator temă dark - light | Experiența pe site | Oaspete | Should | R2 | - | new | brief 3 |
| F-43 | Efecte sezoniere | Experiența pe site | Oaspete | Could | R2 | F-54 | new | brief 3; decis de Alin 2026-11-24: rulează și pe mobil |
| F-44 | Sunet de fundal la buton | Experiența pe site | Oaspete | Could | R2 | F-54 | new | brief 3; decis de Alin 2026-11-24: buton pe mobil și desktop, oprit implicit (D-21) |
| F-45 | SEO de bază și redirecționări | Experiența pe site | Oaspete | Must | MVP | - | proposed | DESI |
| F-46 | Măsurare conversii | Experiența pe site | Personal | Should | MVP | F-39 | proposed | DESI |
| F-47 | Autentificare și roluri | Panou de administrare | Editor, Administrator | Must | MVP | - | new | decis de Alin 2026-11-24: roluri Administrator și Editor (D-16) |
| F-48 | Bibliotecă media - foto, video, sunet | Panou de administrare | Personal | Must | MVP | F-47 | new | brief 3; decis de Alin 2026-11-24: conversie automată la încărcare |
| F-49 | Editare texte și secțiuni | Panou de administrare | Personal | Must | MVP | F-47 | new | brief 3 |
| F-50 | Administrare evenimente și petreceri | Panou de administrare | Personal | Must | MVP | F-47 | new | brief 3 (implicit) |
| F-51 | Administrare recenzii | Panou de administrare | Personal | Must | MVP | F-47 | new | brief 3 (implicit) |
| F-52 | Inbox cereri cu stări | Panou de administrare | Personal | Should | R2 | F-32, F-47 | proposed | DESI |
| F-53 | Setări site - program, telefoane, linkuri | Panou de administrare | Personal | Must | MVP | F-47 | proposed | DESI |
| F-54 | Setări efecte sezoniere și sunet | Panou de administrare | Personal | Could | R2 | F-48 | new | brief 3 |
| F-55 | Administrare sesiuni cursuri | Panou de administrare | Personal | Should | R3 | F-47 | proposed | DESI |
| F-56 | Previzualizare înainte de publicare | Panou de administrare | Personal | Should | R2 | F-49 | proposed | DESI |
| F-57 | Traduceri administrate pe limbi | Panou de administrare | Editor | Must | MVP | F-49 | new | decis de Alin 2026-11-24: texte pe limbi în CMS, traduse automat și corectabile (D-28) |
| F-58 | Site nou pentru alt restaurant | Panou de administrare | Administrator | Must | R3 | F-49, F-53 | new | brief 4; decis de Alin 2026-11-24: un panou, restaurante complet separate (D-12) |
| F-59 | Conținut provizoriu marcat vizibil | Panou de administrare | Personal | Must | MVP | F-49 | new | decis de Alin 2026-11-24: nimic ascuns în timpul construcției |
| F-61 | Administrare premii și distincții | Panou de administrare | Administrator | Must | MVP | F-47 | new | decis de Alin 2026-11-24; modul refolosibil la celelalte restaurante |
| F-62 | Administrare catalog de vinuri | Panou de administrare | Editor | Must | MVP | F-47 | new | decis de Alin 2026-11-24: colecție simplă în panou (D-14) |

## Feature notes
- F-01 Hero cu video sau slideshow: video de fundal scurt, fără sunet, sau slideshow; fotografia apare întâi. Tagline decis: The Best Restaurant in Town.
- F-02 Rezervă o masă - widget rezervări: butonul deschide fereastra ialoc; scriptul se încarcă la prima atingere; dacă nu se încarcă, rămâne telefonul.
- F-04 Bară cerere cazare pe Home: după modelul Vineyard: sosire, plecare, oaspeți, buton; trimite o cerere, nu rezervă pe loc. Pe mobil devine un buton care deschide un panou.
- F-06 Bară fixă de acțiuni pe mobil: trei butoane mereu vizibile pe telefon: Rezervă o masă, Meniu, Sună.
- F-07 Animații 3D în hero: decis: doar pe desktop, niciodată pe mobil. Ce anume se animă rămâne de clarificat (Q-14).
- F-08 Slider categorii de preparate: 8 categorii acceptate (D-32), editabile din panou: alegere, ordine, fotografie, text scurt.
- F-09 Slider vinuri recomandate: arată vinurile bifate «recomandat» în catalogul din panou.
- F-12 Recenzii oaspeți restaurant: până sosesc recenziile reale, secțiunea arată exemple cu eticheta «Exemplu · de înlocuit»; nu se ascunde.
- F-10 Catalog complet de vinuri: pagină proprie la /catalog-vinuri, cu insigna premiului în antet; alimentată din colecția din panou și proiectată ca să poată fi alimentată ulterior de portalul de vinuri.
- F-62 Administrare catalog de vinuri: fiecare vin: nume, producător, tip, regiune, an, preț, recomandat, disponibil. Câmpurile sunt propunere (Q-35).
- F-11 Vinuri preluate automat din portal: amânată până există portalul de vinuri.
- F-57 Traduceri administrate pe limbi: comutator de limbă pe document, buton «Tradu automat», stare pe limbă: netradus, tradus automat, verificat de om. Se face după finalizarea conținutului în română.
- F-47 Autentificare și roluri: Administrator: tot, inclusiv setări, utilizatori, restaurante. Editor: conținut, media, evenimente, recenzii. Publicare directă (presupunere).
- F-26 Cerere de rezervare cazare: merge la rezervari@hotelanna.ro, cu copie configurată în panou; emailul spune de pe ce site vine cererea.
- F-36 Butoane rapide Sună și WhatsApp: Sună: +40 356 630 238 pentru mese, 0764 816 462 pentru saloane. WhatsApp nu apare la lansare (neconfirmat).
- F-33 Formular de sesizări: pagină separată, cu legătură discretă din Contact și din footer.
- F-16 Cerere Rezervă salonul: peste 40 de invitați: cererea este îndrumată către Riviera Events sau ANNA Events (D-32).
- F-42 Comutator temă dark - light: o singură temă la lansare; comutatorul vine în R2 (D-32).
- F-46 Măsurare conversii: se păstrează contul de statistici existent (D-32).
- F-38 Footer cu Grupul ANNA: rețele: Facebook, Instagram, YouTube și TikTok de grup (D-30); credit realizator pe 2 rânduri.
- F-53 Setări site - program, telefoane, linkuri: include destinatarii de email pe subiect, ID-ul ialoc, limbile active și redirecționările.
- F-17 Agenda evenimentelor următoare: listă cu următoarele evenimente (nu doar luna curentă); evenimentele trecute ies singure din listă; fără evenimente, apare un mesaj, secțiunea nu dispare.
- F-18 Petreceri tematice - prezentare: text de prezentare și arhivă foto a serilor trecute; nicio listă de teme scrisă în cod.
- F-50 Administrare evenimente și petreceri: fiecare seară: nume, dată și oră, tip (DJ, artist, formație), numele invitatului, afiș sau fotografie, descriere scurtă, buton de rezervare.
- F-19 Rezervă masă la un eveniment: din cardul unui eveniment se deschide widgetul de rezervări, dacă se poate cu data evenimentului deja aleasă.
- F-24 Sesiuni cu date și locuri: părintele alege o dată din listă și vede câte locuri mai sunt.
- F-29 Widget central de booking ANNA: înlocuiește F-04 și F-26 când platforma de rezervări a hotelurilor ANNA este gata.
- F-32 Formular unic cu selector de subiect: subiecte: eveniment privat, curs de pizza, cazare, întrebare; rezervarea de masă trimite la widget.
- F-41 Selector de limbă - 7 limbi: ro, en, it, fr, de, zh, sv; selector în antet și în footer; fiecare limbă are adresa ei (/en, /it …) și se indexează; tagline-ul și numele proprii nu se traduc.
- F-43 Efecte sezoniere: decis: rulează pe mobil și pe desktop; livrare în R2 (D-32). Limitele de siguranță sunt propunerea mea.
- F-44 Sunet de fundal la buton: buton în antet pe mobil și pe desktop, oprit implicit; pornește doar la apăsare.
- F-45 SEO de bază și redirecționări: titluri și descrieri pe pagină, date structurate de restaurant (inclusiv premiul), hartă a site-ului; /catalog-vinuri păstrată, /valori-nutritionale/ redirecționată către meniul digital (de confirmat).
- F-52 Inbox cereri cu stări: toate cererile într-un loc, cu stări: nouă, în lucru, rezolvată. Cererile se păstrează încă din MVP; ecranul vine în R2.
- F-28 Recenzii oaspeți hotel: la fel ca F-12: exemple marcate vizibil până sosesc recenziile reale.
- F-60 Premii și distincții afișate: insigna oficială, nemodificată, în 4 locuri decise: antetul secțiunii Vinuri, hero lângă tagline, antetul paginii de vinuri, footer. Până la acordare, spațiu rezervat cu textul «nivel și an la confirmare».
- F-61 Administrare premii și distincții: pentru fiecare premiu: logo oficial, nume, nivel, an, legătură către sursă, activ sau inactiv, locurile în care apare.
- F-59 Conținut provizoriu marcat vizibil: orice text, fotografie sau recenzie provizorie poartă pe site eticheta «Exemplu · de înlocuit»; panoul numără ce a rămas de înlocuit.
- F-48 Bibliotecă media - foto, video, sunet: omul alege fișierul de pe telefon; conversia se face automat, în browser; pe server rămâne doar varianta optimizată; clipuri de cel mult 30 de secunde; punct focal și text alternativ obligatoriu.
- F-58 Site nou pentru alt restaurant: comutator de restaurant în panou; urmează Citybar & Josper Grill, SuperBistro și Terasa Anna (D-25); fiecare are logo, paletă, fonturi din setul aprobat, domeniu, contact, meniu, media și secțiunile lui.

## Rules
- Rezervarea de masă se face doar în fereastra ialoc; site-ul nu colectează rezervări de masă prin formular (D-03).
- Pe mobil rulează doar video-ul de fundal și efectele sezoniere; animațiile 3D și efectele grele doar pe desktop (D-02).
- Tot conținutul public (texte, fotografii, evenimente, recenzii, FAQ, categoriile din slider) se schimbă din panoul de administrare, fără programator.
- Nicio secțiune nu se ascunde în timpul construcției; conținutul provizoriu poartă eticheta «Exemplu · de înlocuit» (D-08).
- Un eveniment trecut iese singur din agendă; fără evenimente viitoare apare un mesaj, secțiunea nu dispare.
- Temele serilor nu sunt fixate în cod: fiecare seară este un element creat din panou, cu nume, dată, tip, invitat, afiș și descriere (D-09).
- Sunetul este oprit implicit și pornește doar la apăsarea butonului, pe mobil și pe desktop (D-21); efectele în mișcare se opresc pentru vizitatorii care au cerut mișcare redusă în setările dispozitivului (propunere DESI).
- Salon Trattoria: până la 25 de invitați; Salon Vittoria: până la 40 (de confirmat, A-08).
- Insigna Wine Spectator apare în 4 locuri: antetul secțiunii Vinuri, hero lângă tagline, antetul paginii de vinuri, footer; logo-ul oficial se folosește întreg, cu tot cu nivel, fără decupare, recolorare sau redesenare (D-10, D-20).
- Legarea domeniului se face după primirea premiului și cere zero elemente provizorii (D-08, D-20).
- Restaurantele din panou sunt complet separate: conținut, media, branding, domeniu; un editor vede doar restaurantul lui (D-12).
- Roluri: Administrator (tot) și Editor (conținut, media, evenimente, recenzii) (D-16).
- Antet și «Sună pentru rezervare»: +40 356 630 238. Evenimente private și «Rezervă salonul»: 0764 816 462 (D-17).
- Emailul unei cereri spune de pe ce site vine: «Cerere de cazare de pe site-ul Trattoria da Vittoria»; destinatarii se editează din panou, pe subiect (D-15).
- Traduceri (D-28): texte pe limbi în CMS, traduse automat și corectabile de om; limbi ro, en, it, fr, de, zh, sv; fiecare limbă are adresa ei și se indexează. Nu se traduc: tagline-ul, numele proprii, denumirile italiene de preparate, numele de vinuri și producători, saloanele, serile și premiile.
- Media (D-07, D-24, D-27): conversia se face automat la încărcare, în browser; pe server stau doar variantele optimizate; clipurile au cel mult 30 de secunde.
- Ținte Lighthouse pe mobil: performanță minimum 85, accesibilitate minimum 95 (D-26).
- Site-ul în construcție: adresă temporară Vercel, neindexată, fără parolă (D-22).
- Footer: Facebook, Instagram, YouTube și TikTok (ultimele două, conturi de grup) (D-30); creditul realizatorului pe site-ul public are 2 rânduri (regula lui Alin pentru site-uri).
- Cererile pentru peste 40 de invitați sunt îndrumate către Riviera Events sau ANNA Events (D-32).

## Needs architect
- Stack aprobat (D-23): Next.js, Payload CMS 3, Supabase (Postgres și Storage), Vercel, Resend. Subiectele de mai jos rămân cerințe de verificat la implementare.
- Traduceri native (D-28): adrese pe limbă (/en, /it …), semnalarea limbilor către Google, starea pe limbă a fiecărui document, serviciul de traducere automată și costul lui (D-31), ce se întâmplă cu traducerile când se schimbă textul în română.
- Media (D-24, D-27): conversia în browser pentru fotografii (inclusiv HEIC) și clipuri de cel mult 30 de secunde, de probat în faza 0 pe telefoane obișnuite; ce variantă maximă se păstrează pentru decupări ulterioare; formatul audio pentru sunetul de fundal; limitele de mărime la încărcare.
- Model multi-restaurant (D-12): un panou, restaurante complet separate (conținut, media, branding, domeniu), izolarea editorilor pe restaurant; cum se servesc mai multe domenii din aceeași instalare.
- Catalogul de vinuri (D-14): colecție simplă acum, cu o structură pe care portalul de vinuri o poate alimenta sau înlocui ulterior la aceeași adresă /catalog-vinuri.
- Widgetul ialoc (D-03): încărcare amânată a scriptului terț, ce cookies pune și dacă cere acord, rezervă pe telefon când scriptul nu se încarcă, legarea parametrului de limbă de selectorul de limbă. În script apar doar limbile ro și en; restul: neverificat.
- Marcajul «provizoriu» pe fiecare element de conținut și verificarea «zero provizorii» înainte de lansare (D-08).
- Zona de cazare: formular acum, widgetul platformei de rezervări ANNA mai târziu, fără refacerea paginii.
- Două variante de hero (D-02): cum se decide «mobil» față de «desktop» și ce se întâmplă pe tabletă.
- Formulare: protecție anti-spam, păstrarea cererilor și a acordului GDPR, durata de păstrare, încărcare de fișiere la sesizări.
- Email prin Resend: domeniu verificat, adrese de destinație pe subiect, ce se întâmplă dacă trimiterea eșuează.
- Cât de repede apare pe site o modificare făcută în panou (țintă propusă: sub 60 de secunde).
- Date despre copii în formularul de curs și fotografii cu minori: ce se colectează și cu ce acord (de confirmat juridic).
- Redirecționări (D-19): /valori-nutritionale/ către meniul digital (de confirmat), /formular-de-reclamatie păstrată pentru sesizări (de confirmat), /catalog-vinuri păstrată.
- Roluri (D-16): Administrator și Editor; jurnal de modificări; publicare directă.
- Premii și distincții (D-20): proprietatea award în datele structurate de restaurant; logo-ul oficial servit nemodificat (fără conversie care îi schimbă aspectul).
- Emailuri pe subiect (D-15): destinatari și copie editabile din panou; subiectul emailului include numele site-ului.
- Lucrul direct pe main (D-08) pe adresă temporară Vercel, neindexată, fără parolă (D-22); legarea domeniului davittoria.ro după primirea premiului (D-20); ce se întâmplă cu site-ul vechi până atunci.
- Ținte Lighthouse pe mobil (D-26): performanță minimum 85 cu video în hero și efect sezonier; accesibilitate minimum 95.

## Decisions (Alin, 2026-11-24)
- D-01: Tagline: «The Best Restaurant in Town», în engleză, exact așa. Consecință: Este titlul din hero. Nu se traduce în nicio limbă și se exclude de la traducerea automată. Titlurile de secțiune sunt în română, cu câteva cuvinte italiene (D-32).
- D-02: Pe mobil rulează doar video-ul de fundal și efectele sezoniere. Animațiile 3D și alte efecte grele rulează doar pe desktop. Consecință: Două variante de hero: mobil și desktop. Limitele de siguranță din secțiunea 4 rămân propunerea mea. Sunetul: D-21.
- D-03: Rezervarea de masă se face prin ialoc.ro, widget în mod popup (ID local 4385). Consecință: Butonul «Rezervă o masă» deschide fereastra ialoc de oriunde din site. Scriptul este al unui terț: se încarcă amânat, are rezervă pe telefon și limba lui urmează selectorul de limbă.
- D-04: ADR-urile nu există încă; se scriu după brainstorm, odată cu planul de lucru. Consecință: Tot ce propun aici este materie primă pentru ADR-uri. Subiectele pentru arhitect sunt în secțiunea 8.
- D-05: Termen: cât mai curând, fără dată fixă. Consecință: MVP lat, dar subțire: toate secțiunile din brief, fiecare în forma cea mai simplă. Efectele, sunetul, tema și 3D vin în etape.
- D-06: Recenziile reale vin mai târziu și se introduc din panou. Consecință: Secțiunile de recenzii se construiesc din MVP și primesc exemple marcate vizibil până sosesc cele reale (vezi D-08).
- D-07: Conversie media automată la încărcare: fotografii în AVIF cu rezervă WebP, în mai multe dimensiuni; logo-uri și iconițe în SVG, neschimbate; video în MP4 H.264 ca bază plus o variantă mai eficientă, cu poster static. (Completată de D-24 și D-27.) Consecință: Omul încarcă fișierul de pe telefon, sistemul face restul. Fluxul din panou este în secțiunea 8. Unde se face conversia și ce se păstrează: D-24 și D-27.
- D-08: Nimic ascuns în timpul construcției: se lucrează direct pe ramura main, într-un repo GitHub nou, și totul este vizibil pe parcurs. Consecință: Nicio secțiune nu se ascunde până are conținut final. Conținutul provizoriu poartă eticheta «Exemplu · de înlocuit». Checklistul de lansare are punctul «niciun conținut provizoriu rămas».
- D-09: Petreceri tematice: lista de teme nu este fixă. Majoritatea serilor sunt cu DJ sau cu artiști și formații invitate. Consecință: Serile sunt o colecție creată din panou, nu o listă de teme scrisă în cod. Site-ul arată următoarele seri și o arhivă foto. Secțiunea funcționează cu orice temă.
- D-10: Premiul Wine Spectator (Restaurant Awards) trebuie afișat într-un loc relevant pe pagină. Consecință: Modul «Premii și distincții», administrat din panou și refolosibil pentru alte premii și alte restaurante. Un premiu apare ca obținut doar după confirmare; până atunci, în construcție, doar ca spațiu rezervat. Locurile au fost decise ulterior: D-20.
- D-11: Structură hibridă: Acasă pe secțiuni + pagini proprii. Consecință: Harta site-ului din runda 1 devine baza wireframe-urilor: Acasă cu 11 secțiuni + Evenimente private, Petreceri și agenda, Cursuri de pizza, Galerie, Catalog de vinuri, Contact, Sesizări, pagini legale.
- D-12: Un singur panou de administrare; restaurantele sunt complet separate ca și conținut și branding. Consecință: Comutator de restaurant în panou. Fiecare restaurant are logo, paletă, fonturi dintr-un set aprobat, domeniu, date de contact, meniu, media, secțiuni pornite sau oprite și ordinea lor. Un editor al unui restaurant nu vede conținutul altuia.
- D-13: ÎNLOCUITĂ de D-28. Inițial: GTranslate gratuit la lansare; tagline-ul exclus de la traducere. Consecință: Rămâne valabil doar: tagline-ul nu se traduce. Restul este înlocuit de traducerile native din D-28.
- D-14: Portalul de vinuri se construiește ulterior; catalogul de vinuri din site este de sine stătător la lansare. Adresa rămâne /catalog-vinuri. Consecință: Pagină proprie de catalog (S-23) și o colecție simplă de vinuri în panou (F-62), proiectate ca să poată fi alimentate mai târziu de portal.
- D-15: Cererile de cazare se trimit la rezervari@hotelanna.ro, cu o copie la o adresă configurată în panou. Emailul precizează de unde vine cererea. Adresele destinatare sunt editabile din panou, pe subiect. Consecință: Subiectul emailului: «Cerere de cazare de pe site-ul Trattoria da Vittoria». În Setări: destinatari și copie pentru fiecare subiect.
- D-16: Administrează Alin și Social Media Managerul. Două roluri: Administrator (tot, inclusiv setări, utilizatori, restaurante) și Editor (conținut, media, evenimente, recenzii). Consecință: Publicare directă, fără flux de aprobare (presupunere, A-17).
- D-17: Telefoane: +40 356 630 238 este robotul telefonic care preia rezervările de mese; 0764 816 462 este managerul, pentru rezervarea saloanelor. Al treilea număr nu se folosește. Consecință: Primul număr apare în antet și în «Sună pentru rezervare» (rezerva ferestrei ialoc). Al doilea apare în Evenimente private și la «Rezervă salonul».
- D-18: Instagram: instagram.com/trattoriadavittoria. Consecință: Legătură în footer și în Contact, alături de Facebook.
- D-19: Adrese vechi: /valori-nutritionale/ nu se păstrează ca pagină (informația este în meniul digital); /catalog-vinuri se păstrează. Consecință: Propunere de confirmat: /valori-nutritionale/ redirecționează către meniul digital, ca linkul existent să nu dea eroare. Presupunere de confirmat: pagina de sesizări păstrează adresa /formular-de-reclamatie.
- D-20: Insigna premiului Wine Spectator se construiește în toate cele 4 locuri (antetul secțiunii Vinuri, hero lângă tagline, antetul paginii de vinuri, footer) + date structurate. Site-ul se finalizează complet chiar dacă premiul nu a sosit; domeniul se leagă după primirea premiului. Consecință: Insigna este parte din design, nu opțională. Până la acordare: spațiu de insignă cu textul «Wine Spectator Restaurant Award · nivel și an la confirmare». Modulul din panou primește logo-ul oficial, nivelul și anul. Site-ul stă pe o adresă temporară, neindexată, până la legarea domeniului (D-22).
- D-21: Sunet de fundal: buton pe ambele platforme (mobil și desktop), oprit implicit; pornește doar la apăsare. Consecință: Butonul de sunet apare în antet pe telefon și pe desktop. Pe telefon se oprește singur când pagina iese din prim-plan sau când pornește un clip. Livrare în R2 (D-32).
- D-22: Site-ul în construcție stă pe o adresă temporară Vercel, neindexată, fără parolă. Consecință: Oricine are linkul îl poate vedea; de aceea eticheta «Exemplu · de înlocuit» pe conținutul provizoriu rămâne obligatorie (D-08).
- D-23: Stack aprobat: Next.js + Payload CMS 3 + Supabase (Postgres și Storage) + Vercel. Email: Resend. Consecință: Modelul de conținut (content-model.md) descrie colecțiile care se construiesc în Payload. Secțiunea 8 rămâne lista de cerințe de utilizare pe care implementarea trebuie să le respecte.
- D-24: Video: fără serviciu plătit. Câteva clipuri, de cel mult 30 de secunde. Conversia se face automat la încărcare, în browser; fișierele stau în stocarea proprie. Detaliul tehnic se probează în faza 0. Consecință: În fluxul de încărcare: limită de 30 de secunde pe clip, cu mesaj clar dacă este mai lung. Progresul arată întâi conversia pe dispozitiv, apoi încărcarea.
- D-25: Celelalte restaurante din panou: Restaurant Citybar & Josper Grill (citybar.ro), Restaurant SuperBistro (superbistro.ro), Restaurant Terasa Anna (terasa-anna.ro). Consecință: Apar cu numele lor în comutatorul de restaurant; conținutul lor intră în R3.
- D-26: Ținte Lighthouse pe mobil: performanță minimum 85, accesibilitate minimum 95. Consecință: Intră în checklistul de dinaintea legării domeniului, alături de pragurile Core Web Vitals.
- D-27: Pe server nu se păstrează fișierele inițiale: se stochează doar variantele optimizate pentru web. Fișierele inițiale rămân pe calculatorul lui Alin. Consecință: În fluxul de încărcare apare mesajul «Păstrează originalul la tine; pe site rămâne doar varianta optimizată». O decupare nouă la calitate maximă poate cere reîncărcarea fișierului (A-23).
- D-28: Traduceri (înlocuiește D-13): texte pe limbi în CMS, traduse automat și corectabile de om. Fără GTranslate. Limbi: ro (implicit), en, it, fr, de, zh, sv. Consecință: Fiecare limbă are adresa ei (/en, /it …) și se indexează. Fiecare câmp de text este marcat «se traduce» sau «nu se traduce». În panou: comutator de limbă pe document, buton «Tradu automat», stare pe limbă (netradus, tradus automat, verificat de om). Traducerile intră în MVP, după finalizarea conținutului în română. Fereastra ialoc rămâne doar ro și en.
- D-29: Există video și fotografii. Hero-ul se proiectează pe video. Consecință: Modul slideshow rămâne în panou doar ca rezervă.
- D-30: Rețele sociale în footer: Instagram instagram.com/trattoriadavittoria; YouTube youtube.com/@AnnaEvents; TikTok tiktok.com/@anna.events (ultimele două sunt conturi la nivel de grup). Consecință: Apar în footer alături de Facebook. WhatsApp nu a fost menționat și nu apare.
- D-31: Buget: servicii plătite doar unde este neapărat nevoie; se preferă variantele gratuite sau cu cel mai bun raport calitate-preț. Consecință: Harta se încarcă la atingere; conversia video se face fără serviciu plătit (D-24).
- D-32: «OK la toate propunerile» pentru întrebările deschise: unde exista o recomandare, ea devine decizie. Consecință: Acceptate: Q-10, Q-12, Q-15, Q-16, Q-18, Q-19, Q-20, Q-24, Q-27, Q-28, Q-29 și modul de lucru de la Q-11. Rămân deschise întrebările cu răspuns liber: Q-11 (detalii), Q-14, Q-17, Q-25, Q-34, Q-35.

## Closed questions
- Q-01: Structura site-ului: one-page strict sau hibrid? Răspuns: Hibrid: Acasă pe secțiuni + pagini proprii (D-11).
- Q-02: La ce ADR-uri te referi? Răspuns: Nu există încă. Se scriu după brainstorm, odată cu planul de lucru; până atunci am libertate deplină de a propune.
- Q-03: CMS refolosibil: un panou sau instalări separate? Răspuns: Un singur panou, cu restaurante complet separate ca și conținut și branding (D-12). Celelalte restaurante: Citybar & Josper Grill, SuperBistro, Terasa Anna (D-25).
- Q-04: Cum se traduc cele 6 limbi? Răspuns: Texte pe limbi în CMS, traduse automat și corectabile de om; fără GTranslate; fiecare limbă are adresa ei (D-28, care înlocuiește D-13).
- Q-05: Portalul de vinuri este online înainte de lansare? Adresa finală? Răspuns: Portalul se construiește ulterior. Catalogul de vinuri este de sine stătător în site, la adresa /catalog-vinuri (D-14).
- Q-06: Rezervările de masă rămân pe ialoc.ro? Răspuns: Da: ialoc.ro, widget în mod popup, ID local 4385.
- Q-07: Cazare: unde ajung cererile? Răspuns: La rezervari@hotelanna.ro, cu copie la o adresă configurată în panou; emailul spune de pe ce site vine cererea (D-15). Termenul de răspuns promis rămâne de stabilit (Q-34).
- Q-08: Există o dată de lansare? Răspuns: Cât mai curând, fără dată fixă. MVP-ul trebuie să fie lansabil repede; restul vine în etape.
- Q-09: Cine administrează site-ul? Răspuns: Alin și Social Media Managerul; două roluri: Administrator și Editor (D-16).
- Q-10: Agenda: ce evenimente apar? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): seri tematice și alte evenimente publice; disponibilitatea saloanelor nu se afișează public. Serile le introduce Editorul; câmpul „Intrare" rămâne opțional la fiecare seară.
- Q-12: «Formular de înscriere» din Contact: la ce se referă? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): înscrierea la cursurile de pizza.
- Q-13: Există video și fotografii pentru hero? Răspuns: Da, există video și fotografii; hero-ul se proiectează pe video (D-29). Acordul pentru fotografiile cu copii rămâne de confirmat juridic (Q-25).
- Q-15: Temă: comutatorul dark / light la lansare? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): o singură temă la lansare, comutatorul vine în R2. Care este tema implicită se stabilește în direcția vizuală (Q-17).
- Q-16: Efectele sezoniere și sunetul: la lansare sau în R2? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): în R2. Drepturile pentru muzică se verifică înainte de construcție.
- Q-18: Confirmi selecția de 8 categorii pentru slider? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): Recomandări din partea casei, Antipasti, Pasta e Risotto, Pizza, Preparate Marine, Preparate Vită, Deserturi, Buona Mattina. Rămân editabile din panou.
- Q-19: Limba titlurilor de secțiune în versiunea română? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): română, cu câteva cuvinte italiene; tagline-ul rămâne în engleză.
- Q-20: Sesizări: păstrăm formularul de azi sau îl simplificăm? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): simplificat: ospătar opțional, data vizitei adăugată, fotografia bonului opțională; cele 9 motive rămân ca listă de pornire; destinatarii se configurează în panou; adresa /formular-de-reclamatie se păstrează.
- Q-21: Adrese de email pe subiect și telefonul corect? Răspuns: +40 356 630 238 este robotul telefonic pentru rezervări de mese; 0764 816 462 este managerul, pentru saloane; al treilea număr nu se folosește (D-17). Adresele pe subiect se editează din panou (D-15).
- Q-22: Ce deceniu este la «anii '_0»? Răspuns: Nu mai contează: lista de teme nu este fixă (D-09).
- Q-23: Listele de recenzii Răspuns: Vin mai târziu și se introduc din panou. Până atunci, exemple marcate vizibil.
- Q-24: FAQ: cine scrie întrebările și răspunsurile? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): DESI propune întrebările și răspunsuri-exemplu marcate; localul le confirmă sau le înlocuiește.
- Q-26: Rețele sociale? Răspuns: Instagram: instagram.com/trattoriadavittoria. YouTube (@AnnaEvents) și TikTok (@anna.events) sunt conturi la nivel de grup; apar în footer (D-18, D-30). WhatsApp nu a fost menționat.
- Q-27: Newsletter sau vouchere cadou? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): nu acum.
- Q-28: Evenimente cu peste 40 de invitați: trimitem către Riviera Events sau ANNA Events? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): da, cererea rămâne în grup.
- Q-29: Păstrăm contul de statistici Google existent? Răspuns: Acceptat de Alin, 24.11.2026 (D-32): da.
- Q-30: Buget pentru servicii plătite lunar? Răspuns: Servicii plătite doar unde este neapărat nevoie; se preferă variantele gratuite sau cu cel mai bun raport calitate-preț (D-31).
- Q-31: Adresă temporară sau direct pe domeniu în construcție? Răspuns: Adresă temporară, neindexată, până la legarea domeniului (D-20).
- Q-32: Premii: ce premii confirmate există și unde apare insigna? Răspuns: Insigna Wine Spectator se construiește în toate cele 4 locuri + date structurate; nivelul, anul și logo-ul oficial vin odată cu premiul; domeniul se leagă după primirea lui (D-20).
- Q-33: Care sunt celelalte 3 restaurante din panou? Răspuns: Restaurant Citybar & Josper Grill (citybar.ro), Restaurant SuperBistro (superbistro.ro), Restaurant Terasa Anna (terasa-anna.ro) (D-25).

## Assumptions
- A-01: Noul site înlocuiește site-ul WordPress actual, pe același domeniu davittoria.ro, după primirea premiului (D-20).
- A-03: Meniul rămâne pe meniudigital.ro; nu reconstruim meniul în CMS.
- A-06: Cursurile de pizza nu au plată online la lansare; înscrierea este o cerere confirmată de personal (Q-11).
- A-08: Capacitățile saloanelor sunt cele de pe site-ul actual: Salon Trattoria până la 25 de invitați, Salon Vittoria până la 40.
- A-09: Programul este 8:00-24:00, zilnic (afișat pe site-ul actual și pe meniul digital).
- A-10: Vizitatorii nu au conturi; se autentifică doar personalul.
- A-11: Editorul lucrează și de pe telefon: anunță o seară și încarcă fotografii din local.
- A-13: Împărțirea MVP / R2 / R3 este propunerea mea; părțile despre temă, efecte și sunet (R2) sunt acceptate (D-32).
- A-14: «Nimic ascuns» (D-08) se referă la perioada de construcție. La legarea domeniului, o secțiune fără conținut real este fie completată, fie oprită de tine din panou, ca decizie explicită.
- A-17: Publicarea este directă, fără flux de aprobare (presupunerea coordonatorului la D-16, de confirmat).
- A-18: Pagina de sesizări păstrează adresa /formular-de-reclamatie, iar /valori-nutritionale/ redirecționează către meniul digital (D-19, de confirmat).
- A-20: WhatsApp nu apare la lansare, fiindcă nu a fost confirmat un număr pentru restaurant.
- A-21: Câmpurile unui vin (producător, regiune, an, preț la sticlă și la pahar) sunt propunerea mea; lista reală nu a putut fi citită (Q-35).
- A-22: Dacă premiul întârzie sau nu este acordat, cele 4 locuri de insignă pot fi oprite din modulul de premii fără refacerea paginilor; decizia despre legarea domeniului în acest caz nu a fost luată.
- A-23: Fără fișierele inițiale pe server (D-27), schimbarea punctului focal lucrează pe cea mai mare variantă păstrată; pentru o decupare nouă la calitate maximă, panoul cere reîncărcarea fișierului. De probat în faza 0.
- A-24: Traducerea automată se pornește de om, pe document, după ce textul în română este final; o modificare ulterioară a textului în română marchează traducerile ca «de reverificat» (propunere DESI).
- A-25: Emailurile de confirmare pleacă în limba în care vizitatorul a folosit site-ul (consecință a D-28; de confirmat).

## Open questions

Grupa A blochează arhitectura, grupa B designul și conținutul, grupa C sunt detalii.

- Q-11 (B): Cursuri de pizza: vârsta copiilor, durata, prețul și numărul de locuri? (Modul de lucru este acceptat: înscriere prin formular în MVP, sesiuni cu locuri în R3, fără plată online la început.) Recomandare: Până la răspuns, câmpurile rămân goale pe pagină și nu se afișează.
- Q-14 (B): «Animații 3D» (decis: doar pe desktop, în R2): ce anume se animă? Opțiuni: a) Mișcare în adâncime: straturi care se deplasează la derulare, titluri care apar; b) Obiect 3D interactiv (de exemplu o farfurie sau o sticlă care se rotește); c) Tur virtual 3D, ca la referință și ca pe hotelanna.ro. Recomandare: a) ca punct de plecare, dar alegerea este a ta: b) cere un model 3D realizat separat, c) este o legătură către un tur existent.
- Q-17 (B): Brand: există logo-uri (Trattoria, ANNA), culori și fonturi stabilite? Opțiuni: a) Există manual de brand; b) Doar logo; c) Pornim de la zero. Recomandare: Am nevoie de ele înainte de direcția vizuală (runda 3), nu pentru wireframe-uri.
- Q-25 (C): Juridic: cine furnizează textele paginilor legale, ce elemente obligatorii trebuie în footer (de exemplu legături ANPC) și ce acord este necesar pentru fotografiile cu copii? Recomandare: De confirmat cu juristul grupului; nu inventez cerințe legale.
- Q-34 (C): Ce termen de răspuns promitem în confirmări: cazare, salon, curs, sesizare? Recomandare: Un termen pe subiect, editabil din panou; apare pe ecranul de confirmare și în email.
- Q-35 (C): Lista de vinuri: ce informații are fiecare vin (producător, regiune, an, preț la sticlă și la pahar)? Există cerințe ale premiului pentru forma listei? Recomandare: Am propus un set de câmpuri în modelul de conținut; de verificat cu lista actuală și cu regulamentul premiului.
