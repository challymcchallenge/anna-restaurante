# Versiuni, prețuri și limite verificate

Ultima verificare: **24.11.2026** (F0; completat în F1). Sursa versiunilor: registrul npm (`npm view`) și `package.json` / `pnpm-lock.yaml`. Sursa prețurilor și limitelor: paginile oficiale ale furnizorilor, citite pe 24.11.2026. Ce nu s-a putut citi pe pagina oficială este marcat **neverificat**.

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
| `@payloadcms/translations` (F1) | 3.94.1 | 3.94.1 | Interfața panoului în română. Două etichete corectate în config („Localitate” → „Limba conținutului”) |
| `heic-to` (F1) | 1.6.7 | 1.6.7, publicată 27.10.2026 | Decodare HEIC în browser, doar în panou. LGPL-3.0, încărcată separat (3,2 MB), doar la un fișier HEIC |
| `mediabunny` (F1) | 1.66.3 | 1.66.4, publicată 24.11.2026, 10:36 UTC | Conversie video prin WebCodecs, doar în panou. MPL-2.0, încărcată separat (765 KB). Rămânem pe 1.66.3, probată în F0; 1.66.4 are câteva ore |

## Skill-uri de design (F2, instalate pe 24.11.2026, la cererea lui Alin)

Instalate cu metoda recomandată de fiecare autor, în proiect (`.claude/skills/`, salvate în repo) și global (`~/.claude/skills/` din containerul cloud; **se pierde la închiderea sesiunii**). Documentația fiecăruia a fost citită înainte de folosire.

| Skill | Sursă | Versiune / commit | Comanda folosită | Ce instalează |
|---|---|---|---|---|
| Impeccable | github.com/pbakaus/impeccable (Apache-2.0) | npm `impeccable` 4.10.0 (publicat 18.11.2026); motor binar 0.1.27, verificat SHA-256 | `npx impeccable@4.10.0 install --providers=claude --scope=project -y` și `--scope=global` | skill `impeccable`, 5 agenți `impeccable-*` în `.claude/agents/`, hook de verificare design în `.claude/settings.json` (mutat din `settings.local.json`) |
| Taste (tasteskill 2.5.1) | github.com/Leonxlnx/taste-skill | commit `6c0b5c7` (22.11.2026), notat în `skills-lock.json` | `npx skills@1.9.0 add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend -a claude-code -y` și `-g` | skill `design-taste-frontend` (40 MB, 1.631 de fișiere, inclusiv fotografii și scripturi de verificare) |
| UI UX Pro Max | github.com/nextlevelbuilder/ui-ux-pro-max-skill | CLI npm `ui-ux-pro-max-cli` 2.15.0 (publicat 13.08.2026; fișierele lui diferă de commit-ul `a4fc248` din repo, publicat azi) | `npx ui-ux-pro-max-cli@2.15.0 init --ai claude` și `--global` | skill-urile `ui-ux-pro-max`, `design`, `design-system`, `brand`, `banner-design`, `slides`, `ui-styling` |

Conflicte cu regulile proiectului (câștigă `CLAUDE.md` și `docs/DECISIONS.md`): Taste cere fără numere de telefon reale și fără adresă completă (regula 9) și fără hero întunecat la localuri; proiectul are telefoanele D-17 și adresa decisă. Impeccable cere un interviu pentru `PRODUCT.md`: făcut cu Alin pe 24.11.2026 (3 întrebări).

Pe calculatorul tău, pentru instalare globală: aceleași comenzi cu `--scope=global` / `-g` / `--global`, rulate în terminal.

## Fonturi (F2, 24.11.2026)

Setul aprobat (D-42), servit din `public/fonts/`; sursa: pachetele npm `@fontsource/*` 5.3.0, licență OFL 1.1 (textul licenței lângă fișiere). Diacriticele (U+0218–021B, ă â î) au fost verificate cu fontTools în fiecare fișier.

| Font | Pachet | Greutăți | Rol |
|---|---|---|---|
| Belleza | `@fontsource/belleza` 5.3.0 | 400 | titluri (Trattoria) |
| Tenor Sans | `@fontsource/tenor-sans` 5.3.0 | 400 | titluri |
| Hanken Grotesk | `@fontsource/hanken-grotesk` 5.3.0 | 400, 500, 600 | text (Trattoria) |
| Host Grotesk | `@fontsource/host-grotesk` 5.3.0 | 400, 500, 600 | text |
| Alex Brush | `@fontsource/alex-brush` 5.3.0 | 400 | doar litera „V” din pictograma de filă (D-43), convertită în contur |

Fonturile de pe vineyard.co.za (citit pe 24.11.2026; nu se cumpără, D-42):

| # | Fapt | Valoare | Sursă oficială | Stare |
|---|---|---|---|---|
| F-1 | Optima Nova Regular (Linotype), licență web | 57,99 USD / 10.000 de afișări pe lună; 104,09 / 25.000; 144,98 / 50.000. Licența Desktop pentru 1 utilizator: 57,99 USD | https://www.myfonts.com/products/pro-regular-optima-nova-lt-1078902 | verificat |
| F-2 | Durata licenței web MyFonts | „Majoritatea fonturilor web au licență anuală” (FAQ MyFonts); pentru Linotype nu e precizat | https://www.myfonts.com/pages/faq | **neverificat** pentru Optima Nova |
| F-3 | PP Mori (Pangram Pangram) | „Licenses start at $40”; licența se cumpără pe fiecare greutate și utilizare; prețul pe afișări îl calculează site-ul în browser | https://pangrampangram.com/products/mori | parțial; prețul exact **neverificat** |
| F-4 | Durata licenței Pangram pentru firme | 1 an, apoi reînnoire | https://pangrampangram.com/pages/faq | verificat |

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
| Variabile Vercel | Toate cele 9 (Production + Preview); cele 4 secrete de tip Sensitive, puse de Alin |
| Conexiune la baza de date | Supavisor **Shared pooler**, mod Transaction, port 6543 (IPv4). Dedicated pooler și conexiunea directă merg doar pe IPv6 și nu sunt accesibile de pe Vercel |
| Migrații pe producție | `20261124_102321_initial` (batch 1), 24.11.2026 |
| Restaurante în producție | Trattoria da Vittoria (id 1, cu adresa temporară Vercel) și Citybar & Josper Grill (id 2, de probă), create prin SQL pe 24.11.2026 |
| Test Storage pe producție | 1 fotografie încărcată din panou (24.11.2026), citită prin Payload și prin URL-ul public: ambele 200 |
| Securitate Supabase (advisors) | F0: 0 probleme. **F1: RLS pornit pe toate tabelele din `public`** (fără politici; Payload este proprietarul tabelelor și nu e afectat) |
| Migrații pe producție (F1) | `20261124_120825_f1_content_model`, `20261124_121504_f1_tenants_order`, `20261124_122707_f1_starter_flag` (batch 2, 24.11.2026, 581 + 421 + 137 ms pe build-ul Vercel) |
| Conținut de pornire (F1) | `seed/trattoria-da-vittoria.json`, aplicat o singură dată de `scripts/seed-starter.ts` după migrații |

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
