# ADR-uri — Trattoria da Vittoria

Stare generală: **Aprobat de Alin pe 24.11.2026**, cu excepția părților marcate `TEST F0`, care se confirmă sau se schimbă prin probă în faza 0. Rezultatul fiecărui test se scrie în `docs/spikes/` și, dacă schimbă decizia, ADR-ul se actualizează cu aprobarea lui Alin.

Fapte verificate în documentația oficială pe 24.11.2026 sunt marcate `[verificat]`. Restul sunt presupuneri de lucru și se verifică înainte de folosire.

---

## ADR-001 — Next.js cu Payload CMS 3, într-o singură aplicație

- **Decizie:** site-ul public și panoul `/admin` stau în același proiect Next.js. Payload pe linia stabilă 3.x. Versiunea de Next.js este cea cerută de Payload la inițializare.
- **De ce:** panoul vine cu bibliotecă media, roluri, ciorne, versiuni și traduceri pe câmp. Cerința este un CMS complet și refolosibil.
- **Fapte:** ultima versiune stabilă văzută este 3.92.0; cere Node ≥ 22.23.4 `[verificat]`. Payload 4 există doar ca beta `[verificat]` — nu se folosește.
- **Alternative respinse:** panou propriu peste Supabase (mult mai multă muncă); WordPress (nu acoperă panoul unic multi-brand).
- **Consecințe:** se urmăresc actualizările de securitate Payload.

## ADR-002 — Un panou, mai multe restaurante, separate complet

- **Decizie:** pluginul oficial `@payloadcms/plugin-multi-tenant`. Fiecare restaurant este un tenant cu: domeniu, logo, paletă, fonturi (din set aprobat), date de contact, meniu, media, secțiuni activate și ordinea lor.
- **Roluri:** Administrator (tot, toate restaurantele) și Editor (conținut, media, evenimente, recenzii; doar restaurantele atribuite; fără acces la Premii, Setări, Utilizatori).
- **Fapte:** pluginul adaugă un câmp de tenant pe colecțiile alese; setările globale trebuie modelate ca o colecție per tenant; găsirea tenantului după domeniu pe site-ul public o scriem noi `[verificat]`.
- **Limită acceptată:** toate restaurantele aleg din aceeași bibliotecă de secțiuni. O secțiune nouă cere dezvoltare și devine apoi disponibilă tuturor.
- **Restaurante:** Trattoria da Vittoria (primul), apoi Citybar & Josper Grill, SuperBistro, Terasa Anna. În faza 0 se creează Trattoria + un al doilea tenant de probă, ca să dovedim separarea.
- **Alternativă respinsă:** șablon copiat per restaurant (4 instalări, 4 baze de date, fiecare corecție de 4 ori).

## ADR-003 — Supabase pentru date și fișiere

- **Decizie:** Postgres pentru conținut, utilizatori și cereri. Supabase Storage prin adaptorul `@payloadcms/storage-s3`, cu încărcare directă din browser (`clientUploads`).
- **Fapte:** pe Vercel, încărcările prin server sunt limitate la 4,5 MB; `clientUploads: true` le ocolește și cere CORS `PUT` pe bucket `[verificat]`.
- **Consecințe:** proiect Supabase nou, în organizația Pro existentă, regiune UE. Conexiune prin pooler, potrivită pentru funcții serverless. `TEST F0`

## ADR-004 — Imagini: doar variante optimizate, fără originale pe server

- **Decizie (D-07, D-27):**
  1. La încărcare, browserul micșorează fotografia la cel mult 2560 px pe latura lungă și o trimite ca fișier „master” optimizat. Originalul din aparat nu urcă pe server.
  2. Serverul generează din master variantele AVIF și WebP, pe mai multe lățimi.
  3. Site-ul le servește cu `<picture>` și `srcset`, fără transformare la cerere.
  4. SVG-urile (logo-uri, iconițe) rămân neschimbate.
- **Obligatoriu la fiecare imagine:** text alternativ, punct focal, formatul din `design/content-model.md`.
- **De ce:** respectă cerința de a nu ține originale; nu consumă transformări de imagini taxate la Vercel.
- **Consecință acceptată:** o schimbare ulterioară de calitate peste nivelul masterului cere reîncărcarea originalului de pe calculatorul lui Alin.
- **De stabilit în faza 0:** lățimile exacte, calitatea AVIF/WebP, comportamentul la HEIC de pe iPhone, timpul și memoria funcției la generare. `TEST F0`

## ADR-005 — Video fără serviciu plătit, audio fără conversie

- **Decizie (D-24):** clipuri de maximum 30 de secunde. Conversia se face automat în browser, la încărcare (MP4 H.264 + o variantă mai eficientă + imagine statică de început), iar rezultatul se stochează în Supabase Storage. Se stochează doar variantele convertite.
- **Reguli:** un clip mai lung de 30 s este refuzat cu mesaj clar. Video-ul de fundal rulează fără sunet, în buclă, cu imaginea statică afișată întâi.
- **Audio:** fișiere MP3 încărcate din panou, servite neschimbate.
- **Plan de rezervă, dacă testul în browser eșuează:**
  1. Mux, planul gratuit: până la 10 clipuri stocate și 100.000 de minute livrate pe lună `[verificat]`. Limita de 10 clipuri este strânsă pentru 4 restaurante.
  2. Script local de conversie rulat de Alin înainte de încărcare (are originalele pe calculator).
- **De stabilit în faza 0:** durata conversiei pe laptop și pe telefon, dimensiunea rezultată, dacă merge de pe telefonul Editorului. `TEST F0`

## ADR-006 — Găzduire pe conturile Pro existente

- **Decizie:** proiect nou în echipa Vercel Pro existentă; proiect nou în organizația Supabase Pro existentă.
- **Fapte:** planul gratuit Vercel este doar pentru uz necomercial; un proiect suplimentar într-o organizație Supabase Pro costă 10 USD pe lună (compute) `[verificat]`.
- **Cost suplimentar estimat:** 10 USD pe lună, plus consum peste limitele incluse.

## ADR-007 — Traduceri native în CMS

- **Decizie (D-28):** traducerile pe câmp ale Payload. Limbi: `ro` implicit, apoi `en`, `it`, `fr`, `de`, `zh`, `sv`. Româna fără prefix în adresă; celelalte cu prefix (`/en`, `/it` …), cu `hreflang`.
- **Flux:** conținutul se scrie în română. Butonul „Tradu automat” completează celelalte limbi. Fiecare text are stare pe limbă: netradus, tradus automat, verificat de om. Omul poate corecta orice.
- **Nu se traduc:** tagline-ul, numele proprii, denumirile italiene de preparate, numele de vinuri și producători. Lista completă: `design/content-model.md`.
- **Ordine:** întâi site-ul complet în română, apoi traducerile (faza 4).
- **Motorul de traducere:** se alege în faza 0, pornind de la variantele gratuite (D-31). `TEST F0`
- **Limită:** fereastra ialoc are doar română și engleză; în celelalte limbi se deschide în engleză.

## ADR-008 — Rezervări: ialoc pentru mese, formular pentru cazare

- **Mese (D-03):** „Rezervă o masă” apelează `ialocEmbedWidget.show()`. Scriptul se încarcă amânat. Dacă nu se încarcă, butonul devine „Sună pentru rezervare” cu `+40 356 630 238`.
- **Cazare:** bara din hero (check-in, check-out, camere și oaspeți, buton), după modelul din `design/`. Trimite o cerere prin email (D-15), nu o rezervare fermă. Este un modul care poate fi înlocuit ulterior cu widgetul platformei de rezervări ANNA.
- **De stabilit în faza 0:** ce cookies pune ialoc și dacă e nevoie de consimțământ înainte de încărcare. `TEST F0`

## ADR-009 — Formulare și email

- **Decizie:** un formular cu selector de subiect (vezi `design/flows/flow-contact.mmd`). Fiecare cerere se salvează întâi în baza de date, apoi pleacă pe email prin Resend. Destinatarii se editează din panou, pe subiect.
- **Anti-spam:** fără puzzle pentru vizitator (câmp-capcană + limită de frecvență; un serviciu invizibil doar dacă e nevoie).
- **Fapte:** planul gratuit Resend are 100 de emailuri pe zi; fiecare destinatar în copie se numără separat `[verificat]`.
- **Consecințe:** domeniul de trimitere se verifică în DNS. Sesizările au pagină separată la `/formular-de-reclamatie`.

## ADR-010 — Efecte cu buget de performanță

- **Decizie (D-02, D-21, D-26):** mobil: video + efecte sezoniere. Desktop: în plus 3D. Sunet la buton pe ambele, oprit implicit. Efectele se aleg din panou, pe sezon și pe platformă.
- **Reguli:** `prefers-reduced-motion` → imagine statică, fără efecte. Codul 3D se încarcă doar pe desktop și doar după ce pagina e utilizabilă. Cel mult un efect sezonier activ.
- **Ținte, măsurate la fiecare poartă:** Lighthouse mobil, performanță ≥ 85, accesibilitate ≥ 95. Se raportează cifrele reale.
- **Nedefinit încă:** ce anume se animă în 3D.

## ADR-011 — Catalog de vinuri de sine stătător

- **Decizie (D-14):** colecție în panou, pagină la `/catalog-vinuri`, slider cu vinurile recomandate pe Acasă. Câmp „cod extern” pentru legarea ulterioară cu portalul de vinuri.
- **Câmpuri:** propunerea din `design/content-model.md`, de confirmat cu lista reală de vinuri.

## ADR-012 — Premiul Wine Spectator și momentul lansării

- **Decizie (D-20, D-22):** modulul „Premii și distincții”. Insigna apare în cele 4 locuri + date structurate. Site-ul se finalizează complet; domeniul se leagă după primirea premiului.
- **În construcție:** adresă temporară Vercel, **neindexată** (`noindex` în meta, antet `X-Robots-Tag`, `robots.txt` cu `Disallow: /`), **fără parolă**.
- **Insigna:** spațiu cu dimensiunile finale; fișierul oficial al logo-ului, cu nivelul și anul, se încarcă din panou când sosește. Logo-ul se folosește complet, fără recolorare sau decupare.
- **La legarea domeniului:** se scoate `noindex`, se verifică lista din `docs/PLAN.md`, faza 5.

## ADR-013 — Mod de lucru și adrese vechi

- **Decizie (D-08):** repo nou, direct pe `main`. O fază pe sesiune de Claude Code, cu poartă de aprobare la final.
- **Conținut provizoriu:** etichetat vizibil „Exemplu · de înlocuit”; panoul arată câte elemente provizorii au rămas.
- **Adrese:** `/catalog-vinuri` și `/formular-de-reclamatie` se păstrează; `/valori-nutritionale` → redirecționare către meniul digital.
- **Footer site public:** credit discret, centrat, pe 2 rânduri: „Made with ❤️ by BizTech Consulting SRL” / „www.biztech.ro / +40772295031” (link către https://www.biztech.ro și `tel:+40772295031`).
