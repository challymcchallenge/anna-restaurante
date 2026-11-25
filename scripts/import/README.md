# Importul fotografiilor din Google Drive în galerie (D-75)

Folosit pe 25.11.2026 pentru cele 144 de fișiere ale lui Alin. Folderul Drive e listat în
`docs/f4/2026_11_25_Trattoria_Import_Galerie_drive.json`, iar planul (categorii, texte alternative,
decizii) în `docs/f4/2026_11_25_Trattoria_Import_Galerie_plan.json`. Fișierele descărcate și convertite
nu stau în repo; se refac în câteva minute:

1. **Descărcarea** (folderul trebuie să fie „Anyone with the link”): pentru fiecare `id` din manifest,
   `curl -sL "https://drive.usercontent.google.com/download?id=<id>&export=download&confirm=t"` în
   `<lucru>/orig/<folder>/<titlu>`; se verifică mărimea față de `fileSize`.
2. **Analiza** (`node analyze.mjs <lucru>`, din rădăcina proiectului, ca să găsească `sharp`): SHA-256
   (duplicate exacte), dHash (aproape identice), claritate, luminozitate. `sharp` nu citește HEIC (HEVC);
   acelea se analizează după conversie.
3. **Conversia ca în panou:** `convert.ts` construit cu esbuild pentru browser și rulat în Chromium
   (`convert-photos.cjs`, `convert-clips.cjs`), servit de pe `localhost` (WebCodecs cer context sigur).
   HEIC prin heic-to; fotografii ≤ 2560 px, JPEG q0,9; clipuri H.264 + AV1 + imagine de început, cu sunet (D-73).
4. **Raportul** pentru „GO”: https://claude.ai/artifact/HqvuobpDTZ7g17h5BRzVk6 (privat).
5. **Încărcarea:** după răspunsul la G13-5 (adresă de import cu token sau fișiere prin seed).

6. **Modificări (D-77)**, prin aceeași adresă și același cod: `{"action":"homeGallery","tenantSlug":"…","fileIds":[…]}` (cel mult 8, în ordinea de pe Acasă), `{"action":"reorderGallery",…,"fileIds":[…]}` (redistribuie cheile de ordine existente ale acelor elemente), `{"action":"heroSlides",…,"slides":[{"desktop":id,"mobile":id}]}` (1–5 cadre). Numerele fișierelor se iau din `/api/media` după titlul intern („Galerie · <folder> · <cod>”).
