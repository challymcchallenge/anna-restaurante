# F0 · Test „ialoc” (ADR-008)

Data: 24.11.2026 · Rezultat: **CONFIRMAT**, cu o corecție de integrare (modul popup se deschide prin `selector`, nu prin `show()`).

## Ce s-a probat

Pagina de test: `public/spike/f0-ialoc.html`. Fragmentul oficial vine din https://v2.ialoc.ro/widget-setup/4385 (pagina „Widget Setup for Trattoria da Vittoria”): `venueId: '4385'`, `source: 'ialoc-widget-embed'`, `locale: 'ro'`, `embedMode: 'popup'`. Scriptul `https://widget.ialoc.ro/embed.js` (18,9 KB, `cache-control: max-age=300`) l-am citit integral, ca să folosesc doar opțiunile pe care le are.

Rulat în Chromium 158 headless, pe un ecran de telefon (390×844), în 4 scenarii.

## Rezultate

| Măsurătoare | A: implicit, RO | B: `conversionTracking: false` | C: EN + `defaultDate` | D: ialoc blocat |
|---|---|---|---|---|
| Cereri către ialoc înainte de clic | **0** | 0 | 0 | 0 |
| Încărcarea scriptului după clic | 714 ms (fără cache) | 172 ms | 48 ms | eșuat |
| Fereastra de rezervare încărcată, de la clic | **1.907 ms** (fără cache) | 797 ms | 605 ms | — |
| Rezerva „Sună pentru rezervare” | — | — | — | apare imediat la eroare (aproximativ 130 ms); la blocaj fără răspuns, după 6 s |
| Cookies (toate domeniile, prin CDP) | **0** | 0 | 0 | 0 |
| localStorage / sessionStorage (pagină și fereastră) | **gol** | gol | gol | gol |

Capturi: `docs/spikes/img/f0-ialoc-A-implicit-ro.png`, `…-C-en-cu-data.png` (afișează „Sat 5 Dec” preselectat și EN), `…-D-ialoc-blocat.png`.

### Servicii terțe încărcate de fereastra ialoc

`widget.ialoc.ro`, `api.ialoc.ro`, `www.googletagmanager.com`, `www.google-analytics.com`, `eu-assets.i.posthog.com`, `eu.i.posthog.com`. Le încarcă **și cu `conversionTracking: false`**.

Google Analytics rulează în **Consent Mode cu consimțământ refuzat**: parametrii `gcs=G100`, `npa=1`, fără cookies. Am verificat că browserul ar fi permis cookies terțe: un cookie de probă setat în fereastră a rămas. PostHog nu scrie nimic în stocare. Datele trimise sunt măsurători fără cookies (pagină vizitată, IP, browser).

### Opțiuni găsite în `embed.js`

| Opțiune | Folosire la noi |
|---|---|
| `venueId` | ID-ul ialoc al restaurantului, din panou (content-model R3) |
| `locale` | `ro` sau `en`; celelalte limbi ale site-ului deschid în `en` (ADR-007) |
| `defaultDate` | **Rezervare cu data serii** (content-model 5.4, „de probat”): funcționează, data apare preselectată |
| `persons` | numărul de persoane (opțional) |
| `selector` | **obligatoriu în modul popup**: fereastra se deschide la clic pe elementele din selector |
| `conversionTracking` | `true` implicit; `false` nu oprește GA și PostHog din fereastră |
| `setConsent({marketing})` | transmite acordul către fereastră, dacă vom avea un banner de consimțământ |
| `callback(data)` | primește `reservation_hash` după o rezervare; util pentru măsurarea conversiilor (F-46) |

## Concluzie

- **ADR-008 se confirmă**: scriptul se încarcă doar la clic, fereastra apare în 0,6–1,9 s, iar dacă ialoc nu răspunde, butonul devine „Sună pentru rezervare” (cu numărul din panou, D-17).
- **Corecție de integrare:** în modul popup, `ialocEmbedWidget.show()` doar arată fereastra; adresa ferestrei se setează la clic pe un element din `selector`. Soluția testată: la primul clic încărcăm scriptul, inițializăm cu `selector` pe butoanele „Rezervă o masă” și retransmitem clicul. Merge din prima.
- **Cookies:** în configurația actuală a contului ialoc, fereastra **nu setează cookies și nu scrie în stocarea browserului**. Pe această bază, ialoc nu cere un banner de consimțământ. [PRESUPUNERE juridică, de confirmat cu juristul grupului, Q-25.] Politica de confidențialitate trebuie să menționeze ialoc, Google Analytics și PostHog ca servicii terțe ale ferestrei de rezervare.
- **Atenție:** dacă cineva activează în contul ialoc pixelii Google Ads, Meta sau TikTok (ialoc manager → Settings → Marketing & conversion tracking), concluzia de mai sus nu mai e valabilă. Atunci e nevoie de banner și de `setConsent`.

## T6 · Meniul digital: linkuri directe pe categorie

**Da, funcționează.** `https://www.meniudigital.ro/trattoriadavittoria#<id-categorie>` derulează direct la categoria respectivă. Testat cu `#6655ca45f79bbdb28c749654`, care duce la „Preparate Pasăre” (secțiunea ajunge sus pe ecran). ID-urile se văd în codul paginii (`clicktarget="…"`). Pagina nu are adrese proprii pe categorie, doar ancore.

Consecință pentru F1: câmpul „Legătură” al unei categorii (content-model 5.1) poate primi linkul cu ancoră. Dacă meniul digital refăcut își schimbă ID-urile, linkurile trebuie actualizate din panou.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
