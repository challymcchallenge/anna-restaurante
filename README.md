# Trattoria da Vittoria — pachet de pornire

Tot ce are nevoie Claude Code ca să înceapă construcția. Data: 24.11.2026.

## Ce este în pachet

| Fișier | Rol |
|---|---|
| `CLAUDE.md` | Regulile proiectului; Claude Code îl citește automat |
| `docs/DECISIONS.md` | Cele 32 de decizii ale tale. Sursa de adevăr |
| `docs/ADR.md` | 13 ADR-uri: arhitectura aprobată |
| `docs/PLAN.md` | 6 faze cu porți de aprobare |
| `docs/META-PROMPT.md` | Promptul de lipit în Claude Code |
| `docs/OPEN-QUESTIONS.md` | Ce mai e de stabilit și până când |
| `.env.example` | Numele variabilelor de mediu, fără valori |
| `design/` | Livrabilele DESI: model de conținut, feature map, fluxuri, wireframe-uri. Trebuie să stea în rădăcina repo-ului, lângă `docs/` |

## Pași de pornire

### 1. Repo
1. Creează un repo GitHub nou, privat. Nume propus: `anna-restaurante` (aplicația va găzdui toate cele 4 restaurante).
2. Clonează-l pe calculator și dezarhivează în rădăcina lui `2026_11_24_Trattoria_Pachet_Complet.zip`. După dezarhivare trebuie să vezi, unul lângă altul: `CLAUDE.md`, `README.md`, `.env.example`, `docs/` și `design/`.
3. Primul commit pe `main`: „Pachet de pornire: decizii, ADR-uri, plan, design”.

### 2. Supabase
1. În organizația ta Pro, creează un proiect nou, într-o regiune din UE.
2. Notează-ți, fără să le lipești în vreo conversație: șirul de conectare la baza de date (varianta pooler) și cheile de acces S3 pentru Storage.
3. Creează un bucket pentru media. Setările de CORS le dă Claude Code în faza 0.

### 3. Vercel
1. Importă repo-ul ca proiect nou în echipa ta Pro.
2. La Deployment Protection, lasă adresa de producție `*.vercel.app` publică (decizia D-22: fără parolă). Neindexarea o face aplicația.
3. Nu lega încă domeniul `davittoria.ro` (decizia D-20).

### 4. Resend
1. Adaugă domeniul de trimitere și pune înregistrările DNS cerute.
2. Creează o cheie API doar pentru trimitere.

### 5. Variabile de mediu
1. Copiază `.env.example` în `.env.local` și completează valorile.
2. Pune aceleași valori în Vercel, la Environment Variables.
3. `.env.local` nu se comite. Verifică să fie în `.gitignore` (îl creează Claude Code la inițializare).

### 6. Claude Code
1. Deschide Claude Code în folderul repo-ului.
2. Lipește PROMPTUL PRINCIPAL din `docs/META-PROMPT.md`.
3. La fiecare GATE, citește rezumatul și scrie „GO” sau ce vrei schimbat.

## Costuri lunare estimate

| Serviciu | Suplimentar |
|---|---|
| Vercel Pro (existent) | 0 USD, plus consum peste creditul inclus |
| Supabase Pro (existent), proiect nou | 10 USD |
| Resend, plan gratuit | 0 USD |
| Video, traduceri | 0 USD dacă testele din faza 0 confirmă variantele gratuite |
| **Total** | **aproximativ 10 USD pe lună** |

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
