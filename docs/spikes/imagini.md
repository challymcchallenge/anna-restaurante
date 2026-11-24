# F0 · Test „imagini” (ADR-004)

Data: 24.11.2026 · Rezultat: **CONFIRMAT, cu 3 ajustări** (setarea AVIF, decodarea HEIC în browser, lățimile). Mai rămân 2 probe care cer variabilele Supabase și telefonul tău (sfârșitul documentului).

## Ce s-a probat

1. **În browser:** fotografie mare sau HEIC → master de cel mult 2560 px pe latura lungă, JPEG q0,9. Pagina de test: `public/spike/f0-media.html`. Fluxul: `createImageBitmap` cu orientarea EXIF, micșorare de calitate înaltă, `canvas.toBlob`. HEIC-ul care nu se decodează nativ trece prin `heic-to` 1.6.7 (libheif 1.23.7 în WebAssembly, LGPL-3.0, încărcat doar la nevoie).
2. **Pe server:** din master, variante AVIF și WebP pe 5 lățimi (640, 960, 1280, 1920, 2560), cu `sharp` 0.35.4 (libvips 8.18.6, aom 3.15.0). Așa face și Payload cu `imageSizes`. Codul: `src/lib/media/variants-benchmark.ts` și `scripts/f0/variants-benchmark.ts`.
3. **Calitate:** SSIM față de o micșorare fără pierderi (ffmpeg `ssim`).

Fișiere de test (doar în container, nu în repo):

| Fișier | Sursă | Mărime | Rezoluție |
|---|---|---|---|
| interior.jpg | Unsplash (licență Unsplash) | 10,39 MB | 5596×3731 |
| pizza.jpg | Unsplash | 8,18 MB | 5184×3456 |
| table.jpg | Unsplash | 3,42 MB | 4402×2935 |
| iphone-12mp.heic | generat din pizza.jpg cu `heif-enc` (x265), ca un iPhone de 12 MP | 2,40 MB | 4032×3024 |
| example.heic | exemplul oficial libheif | 0,72 MB | 1280×854 |

## Rezultate: browser (master)

Chromium 158 headless, 4 vCPU Xeon 2,1 GHz, fără GPU. Coloana „4× mai lent” încetinește procesorul de 4 ori (CDP), ca aproximare pentru un telefon mediu. Încetinirea nu afectează firele de decodare din fundal, deci cifrele reale de pe telefon trebuie măsurate pe telefon (vezi „De făcut”).

| Fișier | Decodor | Timp total | Timp total, 4× mai lent | Master | JPEG | WebP |
|---|---|---|---|---|---|---|
| interior.jpg (10,39 MB) | browser | 730 ms | 1.186 ms | 2560×1707 | **1,08 MB** | 0,62 MB |
| pizza.jpg (8,18 MB) | browser | 563 ms | 999 ms | 2560×1707 | 1,05 MB | 0,63 MB |
| table.jpg (3,42 MB) | browser | 407 ms | 735 ms | 2560×1707 | 0,87 MB | 0,44 MB |
| iphone-12mp.heic (2,40 MB) | heic-to (wasm) | 3.014 ms (+419 ms încărcarea bibliotecii) | 3.861 ms | 2560×1920 | 1,16 MB | 0,68 MB |
| example.heic (0,72 MB) | heic-to (wasm) | 332 ms | 447 ms | 1280×854 (nemărit) | 0,43 MB | 0,32 MB |

- Fotografia de 10,39 MB ajunge un master de 1,08 MB (−90%). Originalul nu urcă pe server (D-27).
- Toate masterele au sub 1,2 MB, mult sub limita de 4,5 MB a funcțiilor Vercel. **Pentru fotografii, `clientUploads` nu este strict necesar**; pentru video este (vezi `video.md`).
- **`sharp` nu poate decoda HEIC pe server** (binarele precompilate nu includ HEVC; eroare „bad seek”). Decodarea HEIC trebuie făcută în browser. Safari decodează HEIC nativ; Chrome are nevoie de `heic-to`.

## Rezultate: server (variante AVIF + WebP)

### Setarea implicită AVIF (calitate 50, efort 4) e prea lentă

| Mediu | Timp pentru 10 variante | Memorie maximă (RSS) |
|---|---|---|
| Container, 1 nucleu, secvențial | **34,4 s** (AVIF 2560 px singur: 15,4 s) | 416 MB |
| Container, 1 nucleu, paralel | 35,6 s | 510 MB |
| Container, 4 nuclee, paralel | 18,4 s | 564 MB |

### Comparație de setări (1920 px, interior.jpg, 1 nucleu)

| Format și setare | Mărime | Timp | SSIM |
|---|---|---|---|
| AVIF q50, efort 4 (implicit sharp) | 153 KB | 9.429 ms | 0,923 |
| **AVIF q55, efort 2 (ales)** | **189 KB** | **1.942 ms** | **0,921** |
| AVIF q50, efort 0 | 180 KB | 314 ms | 0,900 |
| WebP q78, efort 4 (ales) | 296 KB | 260 ms | 0,927 |
| WebP q82, efort 4 | 348 KB | 311 ms | 0,937 |
| JPEG q80 mozjpeg | 377 KB | 420 ms | 0,926 |

AVIF q55 cu efort 2 are practic aceeași calitate ca setarea implicită (SSIM 0,921 față de 0,923), e de **4,9 ori mai rapid** și iese cu 24% mai mare. Rămâne cu **36% mai mic** decât WebP la calitate apropiată.

### Cu setarea aleasă (AVIF q55 e2 + WebP q78 e4)

| Mediu | Fotografie | Timp pentru 10 variante | Memorie maximă |
|---|---|---|---|
| Container, 1 nucleu | interior | 6,7 s | 361 MB |
| Container, 1 nucleu | pizza | 7,4 s | 339 MB |
| Container, 2 nuclee, paralel | interior | 3,6 s | 504 MB |
| **Vercel, iad1 (SUA), secvențial** | interior | **9,2 s** | 418 MB din 2.389 MB |
| Vercel, iad1, paralel | interior | 9,1 s | 554 MB |
| **Vercel, dub1 (Dublin), secvențial** | interior | **9,4 s** | 447 MB |

Mărimile variantelor pentru interior.jpg, cu setarea aleasă:

| Lățime | AVIF | WebP |
|---|---|---|
| 640 | 30 KB | 50 KB |
| 960 | 59 KB | 96 KB |
| 1280 | 95 KB | 154 KB |
| 1920 | 189 KB | 296 KB |
| 2560 | 330 KB | 505 KB |
| **Total** | **703 KB** | **1.101 KB** |

## Concluzie

ADR-004 **se confirmă**, cu 3 ajustări, pe care le propun:

1. **AVIF: calitate 55, efort 2** în loc de setarea implicită (34 s → 7–9 s per fotografie, aceeași calitate măsurată).
2. **HEIC se decodează în browser** cu `heic-to` (LGPL-3.0, se încarcă doar la un fișier HEIC). Serverul nu poate decoda HEIC.
3. **Lățimi: 640, 960, 1280, 1920, 2560**, generate secvențial (varianta paralelă nu câștigă timp pe Vercel și consumă cu 30% mai multă memorie).

Alte constatări:
- O fotografie durează aproximativ **9–10 s pe Vercel**, în timpul încărcării. Asta e sub limita de 300 s a funcției. Dacă devine incomod pentru Editor (de exemplu o galerie de 20 de fotografii = aproximativ 3 minute), mutăm generarea într-o sarcină de fundal (Payload Jobs) în F1.
- Funcțiile Vercel rulau implicit în iad1 (SUA). Le-am mutat în dub1 (Dublin, `vercel.json` → `regions`), lângă Supabase eu-west-1.
- SSIM nu surprinde bine netezirea specifică AVIF. Calitatea finală se verifică vizual în F1, pe fotografiile reale ale Trattoriei.

## De făcut (necesită variabile sau telefonul tău)

| Probă | Ce lipsește |
|---|---|
| Fotografie reală de pe telefon (iPhone și Android): timp și master | Tu deschizi `/spike/f0-media.html` pe telefon, după ce treci Vercel pe Standard Protection |
| Încărcarea masterului în Supabase Storage prin Payload (`clientUploads`) și citirea publică | Variabilele `S3_*` în Vercel. Preflight-ul CORS e deja verificat: `Access-Control-Allow-Origin: *`, PUT și `If-None-Match` permise |

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
