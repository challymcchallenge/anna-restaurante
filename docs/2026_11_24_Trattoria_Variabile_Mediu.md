# Variabile de mediu și setări de făcut de Alin (F0)

Data: 24.11.2026. Valorile secrete nu trec prin conversație și nu intră în repo. Numele variabilelor sunt cele din `.env.example`.

## 1. Vercel: protecția adresei de producție (D-22)

Acum adresa https://anna-restaurante-alinlabau-9308s-projects.vercel.app cere login Vercel (setarea `all_except_custom_domains`). Conectorul Vercel din sesiune are doar drept de citire, deci schimbarea o faci tu.

1. Deschide https://vercel.com/alinlabau-9308s-projects/anna-restaurante/settings/deployment-protection
2. La **Vercel Authentication** alege **Standard Protection**, apoi Save.

Efect: producția devine publică, fără parolă; previzualizările rămân protejate. Neindexarea o face aplicația (ADR-012, deja activă).

## 2. Supabase: de unde iei valorile

Proiect: `anna-restaurante` (ref `fmkqpdwqvpwspsxmmkxh`, eu-west-1). Bucket-ul `media` (public) este deja creat.

| Valoare | Unde o găsești |
|---|---|
| Șirul de conectare la baza de date | Panoul proiectului → butonul **Connect** (sus) → **Transaction pooler** (portul 6543). Înlocuiești `[YOUR-PASSWORD]` cu parola bazei de date. Dacă nu o mai ai: Project Settings → Database → Reset database password |
| Cheile S3 | Storage → Settings (S3 Connection) → **New access key**. Primești un *Access key ID* și un *Secret access key*; al doilea se vede o singură dată |

Panoul proiectului: https://supabase.com/dashboard/project/fmkqpdwqvpwspsxmmkxh

## 3. Vercel: Environment Variables

Pagina: https://vercel.com/alinlabau-9308s-projects/anna-restaurante/settings/environment-variables
Mediu: **Production** și **Preview**. Variabilele secrete le marchezi **Sensitive**.

| Variabilă | Valoare | Secret |
|---|---|---|
| `DATABASE_URI` | Șirul *Transaction pooler* de la pasul 2, cu parola completată | da |
| `PAYLOAD_SECRET` | Un șir aleator de 64 de caractere, generat de tine (vezi mai jos) | da |
| `S3_ENDPOINT` | `https://fmkqpdwqvpwspsxmmkxh.storage.supabase.co/storage/v1/s3` | nu |
| `S3_REGION` | `eu-west-1` | nu |
| `S3_BUCKET` | `media` | nu |
| `S3_ACCESS_KEY_ID` | *Access key ID* de la pasul 2 | da |
| `S3_SECRET_ACCESS_KEY` | *Secret access key* de la pasul 2 | da |
| `NEXT_PUBLIC_SITE_URL` | `https://anna-restaurante-alinlabau-9308s-projects.vercel.app` | nu |
| `ALLOW_INDEXING` | `false` | nu |

Nu se pun acum:
- `RESEND_API_KEY` și `EMAIL_FROM`: la final, odată cu domeniul de trimitere (decizia ta din 24.11.2026).
- `TRANSLATE_API_KEY`: după ce alegi motorul de traducere la GATE 0.

Generarea `PAYLOAD_SECRET` în PowerShell, pe calculatorul tău:

```powershell
$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); ($b | ForEach-Object { $_.ToString('x2') }) -join ''
```

## 4. După ce le pui

1. Scrie-mi „variabilele sunt puse”.
2. Eu declanșez un deploy nou. Build-ul rulează migrația bazei de date (`scripts/vercel-build.sh`) și verific că tabelele apar în Supabase.
3. Tu creezi contul tău la `/admin` pe adresa de producție. Primul cont creat devine automat Administrator.

## 5. Opțional: `.env.local` pe calculatorul tău

Doar dacă vrei să rulezi aplicația local. Copiezi `.env.example` în `.env.local`, în folderul repo-ului de pe calculator, și pui aceleași valori ca în Vercel, cu `NEXT_PUBLIC_SITE_URL=http://localhost:3000`. Fișierul este ignorat de git (`.gitignore`: `.env*.local`).

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
