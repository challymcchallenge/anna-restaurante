# F0-d · Multi-tenant: separarea dintre restaurante

Data: 24.11.2026 · ADR-002 · Rezultat: **CONFIRMAT** (21/21 verificări prin Local API, confirmat și prin REST și în panou)

## Ce s-a probat

Configurație: pluginul oficial `@payloadcms/plugin-multi-tenant` 3.94.1. Colecții legate de restaurant: `media`, `events` (Seri tematice, formă minimă). Restaurantele sunt colecția `tenants`. Rolurile sunt câmpul `role` pe `users`.

Date de probă (`scripts/f0/fixtures.json`), pe baza locală Postgres 16 din container:

| Restaurant | Editor | Seri | Media |
|---|---|---|---|
| Trattoria da Vittoria | `editor.trattoria-da-vittoria@example.test` | 2 (provizorii) | 1 |
| Citybar & Josper Grill | `editor.citybar-josper-grill@example.test` | 1 (provizorie) | 1 |
| (toate) | `admin.f0@example.test` (Administrator) | 3 | 2 |

Conturile sunt doar locale, cu parole generate la fiecare rulare, în afara repo-ului.

Rulare: `F0_CREDS_FILE=<cale în afara repo> pnpm payload run scripts/f0/multi-tenant-proof.ts`

## Rezultate măsurate

### Local API, cu regulile de acces aplicate (`overrideAccess: false`)

| Verificare (pentru fiecare Editor, față de celălalt restaurant) | Trattoria | Citybar |
|---|---|---|
| Lista de seri: vede doar serile proprii | 2 din 2, restaurant [1] | 1 din 1, restaurant [2] |
| Deschide seara altui restaurant | refuzat (NotFound) | refuzat (NotFound) |
| Modifică seara altui restaurant | refuzat (Forbidden) | refuzat (Forbidden) |
| Șterge seara altui restaurant | refuzat (Forbidden) | refuzat (Forbidden) |
| Creează o seară în alt restaurant | refuzat (ValidationError) | refuzat (ValidationError) |
| Biblioteca media: doar fișierele proprii | 1 fișier, restaurant [1] | 1 fișier, restaurant [2] |
| Deschide un fișier media al altui restaurant | refuzat (NotFound) | refuzat (NotFound) |
| Lista de restaurante | 1: Trattoria da Vittoria | 1: Citybar & Josper Grill |
| Lista de utilizatori | 1: doar contul propriu | 1: doar contul propriu |
| Își dă singur rol de Administrator sau alt restaurant | ignorat: rol=editor, restaurante=[1] | ignorat: rol=editor, restaurante=[2] |

Administratorul vede 3 din 3 seri, din ambele restaurante. **Total: 21/21 trecute.**

### API REST (`/api/...`, autentificare cu JWT)

| Cont | Seri | Media | Restaurante vizibile | GET direct seara #1 (Trattoria) / #3 (Citybar) |
|---|---|---|---|---|
| Administrator | 3 | 2 | ambele | 200 / 200 |
| Editor Trattoria | 2 | 1 | Trattoria da Vittoria | 200 / **404** |
| Editor Citybar | 1 | 1 | Citybar & Josper Grill | **404** / 200 |

### Panou (`/admin/collections/events`)

| Cont | Rânduri în lista „Seri tematice” | Captură |
|---|---|---|
| Administrator | 3 | `docs/spikes/img/f0-panou-admin-f0.png` |
| Editor Trattoria | 2 | `docs/spikes/img/f0-panou-editor-trattoria-da-vittoria.png` |
| Editor Citybar | 1 | `docs/spikes/img/f0-panou-editor-citybar-josper-grill.png` |

### Site public: restaurantul ales după adresă

| Adresă (Host) | Rezultat |
|---|---|
| `trattoria.localhost` | „Trattoria da Vittoria” + cele 2 seri ale ei |
| `citybar.localhost` | „Citybar & Josper Grill” + seara ei |
| `necunoscut.localhost` | „Niciun restaurant configurat pentru această adresă” |

## Concluzie

ADR-002 se confirmă. Pluginul oficial separă conținutul și media pe restaurant atât în panou, cât și în API. Un Editor nu își poate lărgi singur accesul.

## De reținut pentru F1

- Restaurantul pentru o adresă se găsește după câmpurile „Domeniu” și „Adrese pe care se servește site-ul” (`src/lib/tenant.ts`). [PRESUPUNERE] Adresa temporară Vercel se adaugă din panou, la Restaurante, pe Trattoria.
- Primul cont creat în panou devine automat Administrator (hook în `src/collections/Users.ts`).
- Serile sunt publice la citire, prin `/api/events`, pentru toate restaurantele. Sunt conținut public al site-urilor. În F1 citirea publică se limitează la elementele „Activ”.
- Panoul este încă în engleză. Traducerea în română a interfeței se face în F1.
- Premii, Setări și Utilizatori ca zone interzise Editorului se probează la GATE 1, când există colecțiile.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
