# F0 · Test „video” (ADR-005)

Data: 24.11.2026 · Rezultat: **CONFIRMAT pe laptop (aproximat în container)**. **Telefonul rămâne de probat de tine.**

## Ce s-a probat

Conversie în browser, fără serviciu plătit (D-24), cu **WebCodecs prin `mediabunny` 1.66.3** (MPL-2.0). Biblioteca se încarcă doar în panou, la alegerea unui clip. Pagina de test: `public/spike/f0-media.html`.

Pentru fiecare clip se creează:
- MP4 H.264, latura lungă de cel mult 1920 px, fără sunet, `fastStart` (redare înainte de descărcarea completă);
- o variantă mai eficientă, după ce știe dispozitivul: AV1, apoi HEVC, apoi VP9;
- imaginea de început (poster), JPEG.

Clipurile mai lungi de 30 s sunt respinse înainte de conversie, cu un mesaj care spune durata găsită (D-24).

`ffmpeg.wasm` nu a fost folosit: licența GPL-2.0+, aproximativ 30 MB de descărcat și conversie mult mai lentă, pe un singur fir.

Clipuri de test (doar în container): filmare reală „Jellyfish”, 1080p, H.264, 25 Mbps (test-videos.co.uk), lipită de 3 ori până la 30 s:

| Clip | Mărime | Rezoluție | Durată |
|---|---|---|---|
| clip-30s-16x9.mp4 | 94,4 MB | 1920×1080 | 30,03 s |
| clip-30s-9x16.mp4 (decupat vertical, 17 Mbps) | 64,2 MB | 1080×1920 | 30,03 s |
| clip-31s-16x9.mp4 | 99,7 MB | 1920×1080 | 31,6 s |

## Rezultate (Chromium 158 headless, 4 vCPU, codare software, fără GPU)

Codecuri disponibile în acest Chromium: H.264, VP9 și AV1 (decodare și codare); HEVC nu.

| Clip | Ieșire | Mărime | Debit | Timp conversie | Viteză |
|---|---|---|---|---|---|
| 16:9, 94,4 MB | MP4 H.264 | **12,1 MB** | 3,22 Mbps | **9,9 s** | 3,0× timp real |
| 16:9 | MP4 AV1 | 10,2 MB | 2,73 Mbps | 25,3 s | 1,2× |
| 16:9 | Poster JPEG | 159 KB | — | 65 ms | — |
| 9:16, 64,2 MB | MP4 H.264 | **12,1 MB** | 3,22 Mbps | **15,5 s** | 1,9× |
| 9:16 | MP4 AV1 | 10,3 MB | 2,74 Mbps | 37,8 s | 0,8× |
| 9:16 | Poster JPEG | 119 KB | — | 59 ms | — |
| 31,6 s | — | **respins** în < 1 s: „are 31,7 s; limita este 30 s” | — | — | — |

Biblioteca se încarcă în 0,3–0,7 s, dintr-un CDN.

## Rezultate pe laptopul lui Alin (24.11.2026)

Windows 10/11, Chrome 157, 8 nuclee, 16 GB RAM. Clip real al restaurantului: `Evenimente_Trattoria_1.mov`, filmat cu iPhone, **HEVC** (`hvc1.2.4.L123.B0`), 1080×1920, 10,27 s, 16,5 MB.

| Ieșire | Mărime | Debit | Timp conversie | Viteză |
|---|---|---|---|---|
| MP4 H.264 | **4,71 MB** | 3,67 Mbps | **2,2 s** | 4,7× timp real |
| MP4 AV1 | **2,68 MB** (−43% față de H.264) | 2,08 Mbps | **7,9 s** | 1,3× |
| Poster JPEG | 182 KB | — | 0,86 s | — |

- Pe material real, AV1 iese cu **43% mai mic** decât H.264 (pe clipul de test din container: doar 15%).
- Extrapolat la 30 s: aproximativ **6,6 s pentru H.264 și 23 s pentru AV1** pe laptop. [PRESUPUNERE] Extrapolare liniară.
- HEVC de pe iPhone se decodează în Chrome pe Windows. Câmpul `type` al fișierului `.mov` vine gol pe Windows, deci în F1 acceptăm clipurile și după extensie (`.mov`, `.mp4`).
- Încărcat pe server: 7,6 MB pentru 10 s. Peste limita de 4,5 MB, deci confirmă din nou că `clientUploads` e necesar pentru video.

## Concluzie

- **ADR-005 se confirmă** pentru laptop: un clip de 30 s se convertește în **10–16 s (H.264)**, respectiv **25–38 s (AV1)**, pe un procesor fără accelerare hardware. Un laptop real, care are de obicei codare H.264 hardware, ar trebui să fie mai rapid. [PRESUPUNERE] Neverificat pe laptopul tău.
- Pe server ajung **aproximativ 22,5 MB per clip** (H.264 + AV1 + poster). Asta depășește limita de 4,5 MB a Vercel, deci **`clientUploads` (ADR-003) este obligatoriu pentru video**.
- Pe clipul de test, AV1 a ieșit doar cu 15% mai mic; **pe clipul real al lui Alin, cu 43% mai mic**. Recomand să păstrăm varianta AV1. În F1 reglez debitul pe codec, cu verificare vizuală. Dacă diferența rămâne mică, putem renunța la a doua variantă și scurtăm timpul la jumătate. Decizia o iei tu.
- Safari nu codează AV1 prin WebCodecs. Pe Mac și iPhone, varianta eficientă va fi HEVC (cu hardware Apple), alegerea se face automat în pagină. Neprobat aici, rămâne pentru proba pe telefon.
- Mux nu este necesar.

## De făcut de tine (aproximativ 5 minute) — laptop: FĂCUT; telefon: rămâne

1. Treci Vercel pe Standard Protection (`docs/2026_11_24_Trattoria_Variabile_Mediu.md`, pasul 1).
2. Pe telefon (ideal iPhone și un Android), deschide https://anna-restaurante-alinlabau-9308s-projects.vercel.app/spike/f0-media.html
3. La „Clip video”, alege un clip de aproximativ 20–30 s filmat cu telefonul. Opțional, și 2–3 fotografii la „Fotografii”.
4. Apasă „Copiază rezultatele” și trimite-mi textul. Repetă pe laptop.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
