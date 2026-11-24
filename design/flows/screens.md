# Trattoria da Vittoria - inventar de ecrane (actualizat 2026-11-24, deciziile D-01 ... D-32)

Structura hibridă este decisă (D-11). ID-urile sunt folosite în wireframe-urile din runda 2, deci sunt permanente: nu se renumerotează.

## Site public

| ID | Screen | Purpose | Features | Reached from |
|---|---|---|---|---|
| S-01 | Acasă | Prezintă localul și duce spre rezervare; 11 secțiuni + footer | F-01, F-02, F-03, F-04, F-05, F-06, F-08, F-09, F-12, F-13, F-15, F-17, F-18, F-22, F-27, F-28, F-30, F-35, F-38, F-40, F-60 | intrare directă, Google, cod QR |
| S-01b | Acasă - panoul de cazare | Pe telefon: sosire, plecare, oaspeți, unul sub altul | F-04 | S-01 |
| S-01c | Acasă - fereastra ialoc deschisă | Rezervarea de masă, în fereastra ialoc, peste pagină | F-02 | orice pagină |
| S-01d | Acasă - rezervare indisponibilă | Scriptul ialoc nu a răspuns: butonul devine Sună pentru rezervare | F-02, F-36 | orice pagină |
| S-02 | Evenimente private - Saloane | Compară Salon Trattoria și Salon Vittoria și trimite cererea | F-15, F-16, F-40 | S-01, meniu |
| S-03 | Petreceri și agenda | Arată următoarele seri (DJ, artist, formație) și arhiva foto; fără listă fixă de teme | F-17, F-18, F-19, F-21 | S-01, meniu, rețele sociale |
| S-03b | Petreceri și agenda - fără seri viitoare | Mesaj și arhivă foto; secțiunea nu dispare | F-17, F-18 | S-03 |
| S-04 | Cursuri de pizza pentru copii | Prezintă cursul și primește înscrierea | F-22, F-23, F-24, F-40 | S-01, meniu, reclame |
| S-05 | Galerie | Fotografii și clipuri pe categorii | F-30, F-31 | S-01, meniu |
| S-06 | Contact | Date de contact, hartă, formular unic cu subiect | F-32, F-34, F-35, F-36 | S-01, S-02, S-04, meniu |
| S-06b | Contact - câmpuri de corectat | Arată ce lipsește, lângă fiecare câmp | F-32 | S-06 |
| S-06c | Contact - cerere trimisă | Confirmă cererea și spune ce urmează | F-34 | S-06 |
| S-06d | Contact - eroare la trimitere | Păstrează datele, oferă reîncercare și telefon | F-34 | S-06 |
| S-07 | Sesizări | Primește o sesizare despre o vizită | F-33, F-34 | S-06, footer |
| S-07b | Sesizări - sesizare trimisă | Confirmă înregistrarea și termenul de răspuns | F-34 | S-07 |
| S-08 | Pagini legale | Termeni, confidențialitate, cookies | F-39 | footer |
| S-09 | Pagină negăsită | Readuce vizitatorul la Acasă sau la rezervare | F-45 | linkuri vechi sau greșite |
| S-23 | Catalog de vinuri | Lista completă de vinuri, cu filtre și insigna premiului în antet | F-10, F-60 | S-01, meniu |
| S-23b | Catalog de vinuri - niciun rezultat | Filtrele nu găsesc nimic; oferă ștergerea filtrelor | F-10 | S-23 |
| S-10 | Detaliu eveniment · proposed | Pagină proprie pentru un eveniment, bună de distribuit | F-17, F-19, F-21 | S-03, rețele sociale |

## Panou de administrare

| ID | Screen | Purpose | Features | Reached from |
|---|---|---|---|---|
| S-11 | Autentificare | Intrarea personalului | F-47 | adresa panoului |
| S-12 | Tablou de bord | Evenimente apropiate, numărul de elemente provizorii rămase, scurtături; cereri noi din R2 | F-50, F-59, F-52 | S-11 |
| S-13 | Conținut și secțiuni | Comutator de restaurant; secțiuni cu ordine și pornit/oprit; număr de elemente provizorii | F-49, F-58, F-59 | S-12 |
| S-13b | Conținut - editare secțiune | Câmpurile unei secțiuni și lista ei (de exemplu categoriile din slider); comutator de limbă și „Tradu automat" | F-49, F-57, F-59 | S-13 |
| S-14 | Bibliotecă media | Încărcare cu conversie automată în browser, progres, avertizări, punct focal, text alternativ; pe server doar variantele optimizate | F-48 | S-12 |
| S-14b | Bibliotecă media - se convertește și se încarcă | Arată progresul conversiei pe dispozitiv, apoi al încărcării | F-48 | S-14 |
| S-14c | Bibliotecă media - conversie eșuată | Spune că fișierul nu a fost modificat și oferă reîncercare | F-48 | S-14 |
| S-14d | Bibliotecă media - verifică și completează | Rezultat, avertizări, punct focal, text alternativ obligatoriu | F-48 | S-14b |
| S-14e | Bibliotecă media - fișier respins | Spune ce formate sunt acceptate; la clipuri, durata găsită și limita de 30 de secunde | F-48 | S-14 |
| S-15 | Evenimente | Seri tematice: nume, dată, tip, invitat, afiș, descriere, buton de rezervare; fotografii după eveniment | F-50, F-55 | S-12 |
| S-15b | Evenimente - seară nouă | Formularul unei seri: nume, dată, tip, invitat, afiș, descriere | F-50 | S-15 |
| S-15c | Evenimente - seară publicată | Confirmă publicarea și oferă Vezi pe site | F-50 | S-15b |
| S-15d | Evenimente - câmpuri de corectat | Arată ce lipsește, lângă fiecare câmp | F-50 | S-15b |
| S-16 | Recenzii | Recenzii restaurant și hotel | F-51 | S-12 |
| S-17 | Cereri | Inbox cu stări (R2) | F-52 | S-12 |
| S-18 | Setări site | Program, telefoane, linkuri, widgeturi | F-53 | S-12 |
| S-19 | Efecte și sunet | Efect sezonier și sunete (R2) | F-54 | S-12 |
| S-20 | Traduceri | Starea pe limbă a fiecărui document (netradus, tradus automat, verificat de om) și „Tradu automat"; comutatorul de limbă apare și în fiecare ecran de editare | F-57 | S-12 |
| S-21 | Restaurante | Trattoria da Vittoria; în R3: Citybar & Josper Grill, SuperBistro, Terasa Anna (doar Administrator) | F-58 | S-12 |
| S-22 | Premii și distincții | Logo oficial, nume, nivel, an, sursă, activ sau inactiv, locuri de afișare | F-61 | S-12 |
| S-24 | Vinuri | Colecția de vinuri: nume, producător, tip, regiune, an, preț, recomandat, disponibil | F-62 | S-12 |

## Sisteme externe către care trimite site-ul (nu sunt ecrane ale acestui proiect)

- Fereastra de rezervări ialoc.ro, mod popup, ID local 4385 (decis de Alin, D-03).
- Meniu digital: meniudigital.ro/trattoriadavittoria.
- hotelanna.ro; formularul de recenzie Google; site-urile Grupului ANNA.

## Reguli generale (valabile pe orice ecran)

- Fiecare ecran care încarcă sau trimite date are stările: gol, se încarcă, eroare.
- Butonul "Rezervă o masă" este prezent pe fiecare pagină publică.
- Un buton de cerere deschide Contact cu subiectul deja ales (de exemplu "Rezervă salonul" deschide subiectul Eveniment privat).
- Agenda fără seri viitoare: apare mesajul "Pregătim următoarea seară" și arhiva foto; secțiunea nu dispare (D-08, D-09).
- Nicio secțiune nu se ascunde în timpul construcției; conținutul provizoriu poartă eticheta "Exemplu · de înlocuit" (D-08).
- Pe mobil: video de fundal și efecte sezoniere; animații 3D și efecte grele doar pe desktop (D-02).
- Dacă fereastra ialoc nu se încarcă, butonul devine "Sună pentru rezervare"; dacă harta nu se încarcă, rămân adresa și telefonul.

## Adrese (propunere, de confirmat de arhitect)

| Ecran | Adresă | Observație |
|---|---|---|
| S-01 | / | |
| S-02 | /evenimente-private | |
| S-03 | /petreceri | |
| S-04 | /cursuri-pizza-copii | |
| S-05 | /galerie | |
| S-06 | /contact | subiectul ales poate veni în adresă, de exemplu /contact?subiect=cazare |
| toate | /en/…, /it/…, /fr/…, /de/…, /zh/…, /sv/… | fiecare limbă are adresa ei; româna stă la rădăcină (D-28) |
| S-07 | /formular-de-reclamatie | adresa de azi, păstrată (acceptat, D-32) |
| S-08 | /termeni, /confidentialitate, /cookies | |
| S-23 | /catalog-vinuri | adresa de azi, păstrată (D-14, D-19) |
| - | /valori-nutritionale/ | nu mai este pagină; redirecționează către meniul digital (propunere la D-19) |

## Fluxuri (flows/)

- flow-contact.mmd: cerere prin formularul cu selector de subiect.
- flow-cazare.mmd: cerere de cazare din bara sau panoul de pe Acasă.
- flow-rezervare-masa.mmd: fereastra ialoc și rezerva pe telefon.
- flow-incarcare-media.mmd: conversie automată în browser, clipuri de cel mult 30 de secunde, punct focal și text alternativ.
- flow-publicare-eveniment.mmd: anunțarea unei seri din panou, de pe telefon.

## Roluri în panou (D-16)

- Administrator: tot, inclusiv Setări, Utilizatori, Restaurante, Premii și distincții.
- Editor: Conținut, Bibliotecă media, Evenimente, Vinuri, Recenzii. Vede doar restaurantul lui (D-12).
