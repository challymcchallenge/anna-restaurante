# Product

<!-- impeccable:product-schema 1 -->

Sursa adevărului rămâne `docs/DECISIONS.md` (apoi `docs/ADR.md`, apoi `design/`). Acest fișier rezumă, pentru skill-urile de design, ce este confirmat. Creat în F2, 24.11.2026, din documentele proiectului și din runda de întrebări cu Alin (24.11.2026).

## Platform

web

## Users

- **Vizitatorul nr. 1 (confirmat de Alin, 24.11.2026):** localnicii din Târgu Jiu care aleg unde iau cina sau unde sărbătoresc o ocazie (cupluri, prieteni, aniversări). Treaba lor: să simtă locul și să rezerve o masă. Acțiunea principală a site-ului: „Rezervă o masă” (fereastra ialoc, D-03).
- Celelalte publicuri, cu acțiunea lor: familii (cursuri de pizza pentru copii, botezuri, onomastici), organizatori de evenimente private (saloanele Trattoria și Vittoria, 25 / 40 de locuri), turiști și oaspeți ai Hotel ANNA (cerere de cazare, D-15).
- În panou: Administratorul (Alin) și Editorul (Social Media Managerul), fără cunoștințe tehnice (D-16).

## Product Purpose

Site premium pentru Trattoria da Vittoria (Strada Victoriei nr. 8, Târgu Jiu, Grupul ANNA) și un panou refolosibil pentru celelalte restaurante ale grupului. Succes: rezervări de masă, cereri pentru saloane, înscrieri la cursuri, cereri de cazare; conținut ținut la zi de personal, fără programator. Lighthouse mobil: performanță ≥ 85, accesibilitate ≥ 95 (D-26).

## Positioning

Confirmat de Alin (24.11.2026) — ce poate spune Trattoria și niciun alt restaurant din Târgu Jiu nu poate:

- bucătăria italiană autentică;
- vinurile, cu premiul Wine Spectator Restaurant Award pentru care restaurantul candidează (D-20; nivelul și anul nu sunt încă acordate);
- cursurile de pizza pentru copii;
- totul într-un loc, în Grupul ANNA: masă, cazare la Hotel ANNA, saloane, evenimente;
- serile și atmosfera: petreceri tematice cu DJ, artiști, formații (D-09).

Tagline: „The Best Restaurant in Town”, în engleză, netradus (D-01).

## Operating Context

- Rezervarea de masă se face doar prin fereastra ialoc.ro (ID 4385); rezerva este telefonul robot +40 356 630 238 (D-03, D-17). Saloanele: managerul, 0764 816 462.
- Meniul este extern: meniudigital.ro/trattoriadavittoria.
- Cazarea este o cerere prin email către rezervari@hotelanna.ro, confirmată de hotel; nu este rezervare fermă (D-15).
- Conținutul vine din panou (Payload CMS), pe restaurant (tenant). Nimic specific Trattoriei în cod (ADR-002).

## Capabilities and Constraints

- Stack: Next.js 16 + Payload CMS 3 + Supabase + Vercel + Resend (D-23, ADR-001).
- Multi-restaurant: fiecare restaurant are logo, paletă, fonturi dintr-un set aprobat, conținut separat (D-12). Tema de culori se citește din „Setări restaurant”.
- Limbi: română întâi; en, it, fr, de, zh, sv în F4 (D-28). Fonturile trebuie să acopere ș, ț, ă, â, î.
- Hero pe video (16:9 desktop, 9:16 telefon, ≤ 30 s, fără sunet), poster afișat întâi (D-29, D-24).
- La lansare: o singură temă; efectele sezoniere, sunetul, 3D și comutatorul de temă vin în R2 (D-33).
- Pe telefon: bară fixă jos cu „Rezervă o masă”, „Meniu”, „Sună” (wireframe S-01).
- Insigna premiului: în 4 locuri (hero, antet secțiune Vinuri, antet pagină vinuri, footer). Până la acordare, spațiu rezervat cu textul „Wine Spectator Restaurant Award · nivel și an la confirmare”. Logo-ul oficial se folosește nemodificat (D-10, D-20).
- Nedecis: ce se animă în 3D (R2), lista reală de vinuri, recenziile reale.

## Brand Commitments

- Logo Trattoria da Vittoria: insignă rotundă, inel auriu, fond de marmură crem, panglică tricoloră italiană, „Vittoria” în script negru. Logo Grupul ANNA: „A” negru cu arc roșu și inimă, inel cromat. Ambele furnizate de Alin pe 24.11.2026.
- Fonturile: lui Alin îi plac cele de pe vineyard.co.za (Optima la titluri, PP Mori la text). Referința vineyard.co.za este nivel de calitate, nu model de copiat.
- Vocea: română, cu câteva cuvinte italiene în titluri (D-32, Q-19); emoție, cârlig clar, un singur îndemn principal pe secțiune, fără clișee (CLAUDE.md). Mesaj existent: „Vă așteptăm cu drag și vă servim cu plăcere!”.
- **Anti-obiective (confirmate de Alin, 24.11.2026):** să nu pară rece și intimidant (prea „fine dining”, distant, încât familiile să nu îndrăznească să intre); să nu fie kitsch italian (fețe de masă în carouri, steaguri peste tot, clișee de pizzerie).
- Creditul pe site: discret, 2 rânduri, „Made with ❤️ by BizTech Consulting SRL” / „www.biztech.ro / +40772295031” (ADR-013).

## Evidence on Hand

- Logo-uri: Trattoria, ANNA (și BizTech, pentru documente). Restul materialelor lipsă sunt listate în `docs/materiale-necesare.md`.
- Clipurile și fotografiile există (D-29), dar nu sunt încă încărcate. Recenziile reale, lista de vinuri și premiul **nu există încă**: nu se inventează; conținutul provizoriu poartă eticheta vizibilă „Exemplu · de înlocuit” (D-08).

## Product Principles

1. Rezervarea unei mese este la un gest distanță, pe orice ecran.
2. Cald și primitor înainte de luxos: premiat, dar nu intimidant.
3. Italia reală, nu decor: preparatele, vinurile și oamenii vorbesc, nu clișeele.
4. Totul se schimbă din panou; designul rezistă la conținut real și la conținut lipsă.
5. Adevărul înainte de efect: nicio cifră, recenzie sau premiu fără sursă.

## Accessibility & Inclusion

Contrast text/fundal minimum 4,5:1, verificat și raportat; `prefers-reduced-motion` respectat; text alternativ la fiecare imagine; ținte de atingere de minimum 44 px; WCAG 2.2 AA ca țintă.
