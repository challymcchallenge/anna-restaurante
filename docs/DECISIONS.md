# Decizii — Trattoria da Vittoria

Sursa de adevăr pentru proiect. Dacă un fișier din `design/` sau `docs/` contrazice această listă, câștigă lista. O decizie se schimbă doar de către Alin.

Ultima actualizare: 24.11.2026

| ID | Subiect | Decizie |
|---|---|---|
| D-01 | Tagline | „The Best Restaurant in Town”. Rămâne în engleză, nu se traduce. |
| D-02 | Mobil și desktop | Mobil: video de fundal + efecte sezoniere. Desktop: în plus animații 3D. |
| D-03 | Rezervare masă | Widget ialoc.ro în mod popup (`https://widget.ialoc.ro/embed.js`, `ialocEmbedWidget.init/show/hide`, `source: 'ialoc-widget-embed'`, `embedMode: 'popup'`). Configurare: https://v2.ialoc.ro/widget-setup/4385 |
| D-04 | ADR-uri | Se scriu acum, odată cu planul. Vezi `docs/ADR.md`. |
| D-05 | Termen | Cât mai curând, fără dată fixă. |
| D-06 | Recenzii | Lista vine de la Alin ulterior; se introduc din panou. |
| D-07 | Conversie media | Automată la încărcare: fotografii AVIF + WebP, SVG neschimbat, video în format eficient. |
| D-08 | Construcție | Repo GitHub nou, lucru direct pe `main`, nimic ascuns. Conținut provizoriu etichetat vizibil „Exemplu · de înlocuit”. |
| D-09 | Petreceri tematice | Colecție gestionată din panou, fără teme fixe în cod. Majoritatea sunt cu DJ, artiști sau formații. |
| D-10 | Premii | Modul „Premii și distincții” în panou. |
| D-11 | Structură | Hibrid: Acasă pe secțiuni + pagini proprii. |
| D-12 | Restaurante | Un singur panou; conținut și branding complet separate pe restaurant. |
| ~~D-13~~ | ~~Traduceri~~ | ~~GTranslate gratuit~~ — înlocuită de D-28. |
| D-14 | Vinuri | Portalul de vinuri vine ulterior. Catalogul din site este de sine stătător, la `/catalog-vinuri`. |
| D-15 | Cereri de cazare | Către `rezervari@hotelanna.ro`, cu copie la adresa lui Alin (se configurează în panou, nu în cod). Emailul precizează de pe ce site vine cererea. |
| D-16 | Administratori | Alin (Administrator) și Social Media Managerul (Editor). |
| D-17 | Telefoane | `+40 356 630 238` = robot telefonic pentru rezervări de mese (antet, rezervă pentru ialoc). `0764 816 462` = manager, direct, pentru saloane. Niciun alt număr. |
| D-18 | Instagram | https://www.instagram.com/trattoriadavittoria/ |
| D-19 | Adrese vechi | `/valori-nutritionale` nu se păstrează ca pagină → redirecționare către meniul digital. `/catalog-vinuri` se păstrează. |
| D-20 | Premiul Wine Spectator | Insigna se construiește în toate cele 4 locuri: hero lângă tagline, antet secțiune vinuri, antet pagină vinuri, footer; plus date structurate. Site-ul se finalizează complet; domeniul `davittoria.ro` se leagă după primirea premiului. |
| D-21 | Sunet de fundal | La apăsarea butonului, pe mobil și desktop, oprit implicit. Sunetele se administrează din panou. |
| D-22 | Adresă temporară | Pe Vercel, neindexată, **fără parolă**. |
| D-23 | Stack | Aprobat: Next.js + Payload CMS 3 + Supabase (Postgres, Storage) + Vercel Pro + Resend. Alin are deja Vercel Pro și Supabase Pro. |
| D-24 | Video | Fără serviciu plătit. Doar câteva clipuri, maximum 30 de secunde fiecare. |
| D-25 | Celelalte restaurante | Restaurant Citybar & Josper Grill (https://citybar.ro/), Restaurant SuperBistro (https://www.superbistro.ro/), Restaurant Terasa Anna (https://terasa-anna.ro/). |
| D-26 | Ținte Lighthouse (mobil) | Performanță ≥ 85, accesibilitate ≥ 95. |
| D-27 | Originale | Pe server nu se păstrează originalele, doar variantele optimizate. Originalele rămân pe calculatorul lui Alin. |
| D-28 | Traduceri | Texte pe limbi în CMS, traduse automat și corectabile de om. Limbi: `ro` (implicit), `en`, `it`, `fr`, `de`, `zh`, `sv`. Întâi se finalizează site-ul în română. |
| D-29 | Materiale | Există video și fotografii. |
| D-30 | Rețele sociale | Instagram (D-18), YouTube https://www.youtube.com/@AnnaEvents, TikTok https://www.tiktok.com/@anna.events |
| D-31 | Buget | Servicii plătite doar unde e neapărat nevoie; se preferă variante gratuite sau cu cel mai bun raport calitate-preț. |
| D-32 | Recomandările DESI | Acceptate pentru întrebările deschise care aveau o recomandare, cu excepțiile din D-28, D-29, D-30, D-31. |
| D-33 | Efecte, sunet, 3D, temă (GATE 0, 24.11.2026) | **După lansare (R2).** Efectele sezoniere, sunetul de fundal, animațiile 3D și comutatorul de temă nu intră în lansare. Rezolvă contradicția C1 (design D-32 / Q-15, Q-16 față de PLAN F4 și ADR-010). |
| D-34 | Motorul de traducere (GATE 0, 24.11.2026) | **Claude Haiku 5.5 prin API**, cu protecția termenilor prin marcaje `{n}`. Cheia (`TRANSLATE_API_KEY`) o pune Alin în Vercel înainte de F4. |
| D-35 | Video, varianta eficientă (GATE 0, 24.11.2026) | **Se păstrează AV1** (HEVC pe dispozitivele Apple), alături de H.264. Pe clipul real: −43% față de H.264. |
| D-36 | Email (24.11.2026) | Domeniul de trimitere și testul Resend se fac **la final**, odată cu mutarea DNS a domeniului de pe vechiul hosting. Site-ul vechi rămâne activ până atunci. |

## Linkuri-cheie

- Site actual: https://davittoria.ro
- Meniu digital (extern): https://www.meniudigital.ro/trattoriadavittoria
- Recenzie Google: https://g.page/r/CcvVjOcZMWuYEBM/review
- Hotel ANNA: https://www.hotelanna.ro
- Referință vizuală (stil și ritm, nu copie): https://www.vineyard.co.za/
- Adresă: Strada Victoriei nr. 8, Târgu Jiu, România
