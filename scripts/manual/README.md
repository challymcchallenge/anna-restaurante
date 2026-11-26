# Manualul de utilizare (D-82)

Generatorul manualului `docs/manual/2026_11_26_Trattoria_Manual_Utilizare.html` și al PDF-ului, în formatul manualului K9 Friends (`k9.css` = stilurile de referință).

1. Capturi de pe producție: `node shoot-site.cjs https://<site> <dosar-capturi>` (desktop 1440 × 900, telefon 390 × 844).
2. Capturi din panou, pe copia locală: `ADMIN_PW_FILE=<fișier cu parola contului de probă> node shoot-admin.cjs http://localhost:3000 <dosar-capturi>`.
3. HTML: `python3 build_manual.py` (dosar `out/`, imagini separate), `--inline` (un singur fișier), `--pdf` (imagini JPEG, pentru PDF).
4. PDF: `node make-pdf.cjs out/…pdf.html out/…pdf` (A4, paginile cu hărți pe landscape, creditul BizTech și numărul paginii în subsol).

Scriptul `build_manual.py` așteaptă lângă el `capturi/`, `img/` (portrete, logo-uri, bannere), `fonts.css` (Fraunces și Nunito Sans, din pachetele `@fontsource` 5.3.0, ca `@font-face` în base64).
