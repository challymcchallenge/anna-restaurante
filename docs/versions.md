# Versiuni, prețuri și limite verificate

Ultima verificare: **24.11.2026**. Sursa versiunilor: registrul npm (`npm view`) și `package.json` / `pnpm-lock.yaml`. Sursa prețurilor și limitelor: paginile oficiale ale furnizorilor, citite pe 24.11.2026. Ce nu s-a putut citi pe pagina oficială este marcat **neverificat**.

## Stack (ADR-001)

| Componentă | Versiune folosită | Ultima stabilă (npm, 24.11.2026) | Observație |
|---|---|---|---|
| Payload (`payload`) | 3.94.1 | 3.94.1, publicată 20.11.2026 | Linia 3.x. ADR-001 nota 3.92.0, între timp au apărut 3.93/3.94. `4.0.0-beta.11` există doar ca beta și nu se folosește |
| `@payloadcms/next`, `db-postgres`, `plugin-multi-tenant`, `storage-s3`, `email-resend`, `richtext-lexical`, `ui` | 3.94.1 | 3.94.1 | Toate pachetele Payload pe aceeași versiune, fixată exact |
| Next.js | 16.4.6 | 16.4.6, publicată 09.11.2026 | Cerut de `@payloadcms/next` 3.94.1: `>=15.2.9 <15.3.0 \|\| … \|\| >=16.4.5 <17.0.0`. Șablonul oficial `create-payload-app@3.94.1` alege 16.4.6 |
| React / React DOM | 19.2.9 | 19.3.1 | Versiunea fixată de șablonul Payload; nu o urcăm separat |
| Node.js | container: 22.23.5 · Vercel: 26.x (setarea proiectului) | — | Payload 3.94.1 cere `^22.23.5 \|\| ^24.22.3 \|\| >=26.13.1`. ADR-001 nota „≥ 22.23.4”, cerința reală este ≥ 22.23.5 |
| pnpm | 10.28.0 | — | `package.json` acceptă `^9 \|\| ^10 \|\| ^11` |
| sharp | 0.35.4 | 0.35.5 | Procesarea imaginilor pe server (ADR-004) |
| pg / drizzle-orm | 8.20.0 / 0.45.2 | — | Aduse de `@payloadcms/db-postgres` |
| @aws-sdk/client-s3 | 3.1176.0 | — | Adus de `@payloadcms/storage-s3` |
| TypeScript | 5.7.3 | — | Din șablonul Payload |
| Playwright (teste) | 1.63.0 | — | Din șablonul Payload |
| PostgreSQL | Supabase: 17.12 · container: 16 | — | Proiectul Supabase `anna-restaurante` (eu-west-1) rulează Postgres 17 |

## Servicii: prețuri și limite

| # | Fapt | Valoare | Sursă oficială | Stare |
|---|---|---|---|---|
| 1 | Vercel Hobby | Doar uz personal sau necomercial | https://vercel.com/legal/terms | verificat |
| 2 | Vercel Pro | 20 USD pe lună pe loc de dezvoltator; locurile Viewer sunt gratuite; include 20 USD credit de consum | https://vercel.com/pricing | verificat |
| 3 | Vercel: corpul cererii către o funcție | 4,5 MB implicit. Varianta de 20 MiB e în beta și cere Fluid compute, 4 GB și o variabilă specială | https://vercel.com/docs/functions/limitations | verificat |
| 4 | Vercel Pro: durata și memoria funcțiilor (Fluid) | Durată: 300 s implicit, maxim 800 s. Memorie: 2 GB / 1 vCPU implicit, maxim 4 GB / 2 vCPU | https://vercel.com/docs/functions/limitations | verificat |
| 5 | Vercel „Standard Protection” | Domeniile de producție, inclusiv `.vercel.app` atribuite producției, rămân publice; previzualizările sunt protejate | https://vercel.com/docs/deployment-protection | verificat |
| 6 | Supabase: proiect suplimentar într-o organizație Pro | Compute Micro: aproximativ 10 USD pe lună. Planurile plătite includ 10 USD credit de compute, care acoperă un singur proiect Micro | https://supabase.com/pricing , https://supabase.com/docs/guides/platform/manage-your-usage/compute | verificat |
| 7 | Supabase Pro: stocare și trafic | 100 GB stocare incluși, apoi 0,0213 USD/GB. 250 GB trafic, apoi 0,09 USD/GB | https://supabase.com/pricing | verificat |
| 8 | Supabase: mărimea maximă a unui fișier | Free: 50 MB. Pro: până la 500 GB, configurabil | https://supabase.com/docs/guides/storage/uploads/file-limits | verificat |
| 9 | Supabase Storage S3 | Endpoint `https://<ref>.storage.supabase.co/storage/v1/s3`. PutObject, multipart și URL-uri presemnate sunt suportate. Cheile S3 ocolesc RLS și se folosesc doar pe server | https://supabase.com/docs/guides/storage/s3/compatibility , …/s3/authentication | verificat |
| 10 | Supabase Storage S3: CORS | Nu se poate configura (PutBucketCors nu e implementat). Măsurat pe 24.11.2026: preflight-ul răspunde cu `Access-Control-Allow-Origin: *` și permite PUT și `If-None-Match` | compatibility (mai sus) + test propriu, `docs/spikes/imagini.md` | verificat (test propriu) |
| 11 | Supabase pooler (Supavisor), mod tranzacție | Port 6543, recomandat pentru serverless; fără prepared statements | https://supabase.com/docs/guides/database/connecting-to-postgres | verificat |
| 12 | Resend, plan gratuit | 100 de emailuri pe zi, 3.000 pe lună, 3 domenii | https://resend.com/pricing , https://resend.com/docs/knowledge-base/account-quotas-and-limits | verificat |
| 13 | Resend: destinatari în CC/BCC | Fiecare destinatar contează ca email separat în cotă | account-quotas-and-limits (mai sus) | verificat |
| 14 | Resend fără domeniu verificat | Trimite doar la adresa contului Resend, de pe `resend.dev` | https://resend.com/docs/knowledge-base/403-error-resend-dev-domain | verificat |
| 15 | Mux, plan gratuit | 10 clipuri stocate, 100.000 de minute livrate pe lună | https://www.mux.com/pricing (minutele) ; https://www.mux.com/docs/changelog/video-free-plan (limita de 10) | verificat |
| 16 | DeepL API Free | 500.000 de caractere (licența nu precizează „pe lună”). Nu e clar dacă planul mai poate fi cumpărat. Nu am putut citi lista de limbi | https://www.deepl.com/en/pro-license | parțial; restul **neverificat** |
| 17 | Google Cloud Translation | Pagina de prețuri se încarcă doar în browser; nu am putut citi cifrele | https://cloud.google.com/translate/pricing | **neverificat** |
| 18 | Azure AI Translator F0 | 2 milioane de caractere pe lună, gratuit. Prețul S1 nu apare pe pagină | https://azure.microsoft.com/en-us/pricing/details/cognitive-services/translator/ | F0 verificat; S1 **neverificat** |

## Configurația constatată în conturi (24.11.2026)

| Ce | Valoare |
|---|---|
| Proiect Supabase | `anna-restaurante`, ref `fmkqpdwqvpwspsxmmkxh`, regiunea eu-west-1 (Irlanda), Postgres 17.12, ACTIVE_HEALTHY |
| Bucket Supabase | `media`, public. Creat de Claude Code pe 24.11.2026 |
| Proiect Vercel | `anna-restaurante` (`prj_fUZFnSKhbgQ253uFVnheAfPFswnR`), echipa `alinlabau-9308s-projects`, legat de GitHub `challymcchallenge/anna-restaurante`, ramura `main` |
| Adresa temporară de producție | https://anna-restaurante-alinlabau-9308s-projects.vercel.app |
| Protecția Vercel | **Standard Protection** (`prod_deployment_urls_and_all_previews`), setată pe 24.11.2026. Înainte era `all_except_custom_domains`, care contrazicea D-22 |
| Regiunea funcțiilor Vercel | **dub1** (Dublin), prin `vercel.json`. Înainte: iad1 (SUA) |
| Variabile Vercel puse | `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `NEXT_PUBLIC_SITE_URL`, `ALLOW_INDEXING` (Production + Preview). Lipsesc cele 4 secrete |

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
