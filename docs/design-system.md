# Sistemul de design · Trattoria da Vittoria (direcția B · Carta)

Data: 24.11.2026 · Faza 2, după GO · Decizii: **D-41** (direcția B, butoane verzi), **D-42** (fonturi gratuite, setul aprobat de 4), **D-43** (pictograma de filă). Sursa de adevăr pentru F3. Machetele: `design/f2/directia-b-carta.html` (interactivă) și `design/f2/capturi/f2-b-carta-*.webp`.

Sistemul e pe restaurant: culorile și fonturile se citesc din „Setări restaurant” (ADR-002), iar componentele folosesc doar variabilele CSS din secțiunea 8. Valorile de mai jos sunt cele ale Trattoriei și valorile implicite pentru un restaurant nou.

## 1. Ideea

Acasă e meniul de seară al casei: o **copertă** închisă cu chenar de **folio** auriu, care se deschide în **pagini de hârtie**. Semnăturile sunt chenarul dublu de folio, rândurile de meniu cu linie de puncte și cele două butoane: auriu, apoi verde. Contractul complet al direcției, pentru verificarea finală din F3: `.impeccable/surfaces/design-f2-directia-b-carta-html.md`.

Anti-obiective (Alin, 24.11.2026): să nu pară rece și intimidant; să nu fie kitsch italian (fără steaguri decorative, fără fețe de masă în carouri). Tricolorul apare doar în logo.

## 2. Culori

| Rol | Câmp în Setări | Variabilă CSS | Trattoria | Unde |
|---|---|---|---|---|
| Hârtie | `colors.background` „Fundal (pagini)” | `--c-bg` | `#F5EDE0` | fundalul paginilor, fâșia de cazare |
| Cerneală | `colors.text` „Text” | `--c-text` | `#241A17` | textul de pe hârtie |
| Text secundar | derivat: 70% text peste hârtie | `--c-text-2` | ≈ `#635953` | note, explicații |
| Copertă | `colors.surfaceDark` „Fundal închis” | `--c-dark` | `#1C1416` | hero, footer, bara de jos pe telefon |
| Text pe copertă | `colors.textOnDark` | `--c-on-dark` | `#F3E9DA` | text pe copertă |
| Text secundar pe copertă | derivat: 75% text peste copertă | `--c-on-dark-2` | ≈ `#BDB3A8` | note pe copertă |
| Folio | `colors.accent` „Accent” | `--c-accent` | `#D6AE66` | butonul principal, chenarul, etichetele pe copertă |
| Text pe folio | = copertă | `--c-on-accent` | `#1C1416` | textul butonului principal |
| Verde smarald | `colors.accent2` „Accent secundar” | `--c-accent-2` | `#14613F` | butonul secundar, starea de hover a rândurilor de meniu |
| Text pe verde | = hârtie | `--c-on-accent-2` | `#F5EDE0` | textul butonului secundar |

Verdele vine din familia verdelui din steagul logo-ului (`#036625` măsurat), mai profund ca să nu țipe. A înlocuit bordo-ul la cererea lui Alin (D-41).

### Contrast (minimum 4,5:1, verificat la salvare în panou)

| Pereche | Raport |
|---|---|
| Cerneală pe hârtie | 14,63:1 |
| Text secundar (`#635953`) pe hârtie | ≥ 4,5:1 (testat în `tests/int/f2-theme.int.spec.ts`) |
| Text pe copertă | 15,05:1 |
| Folio pe copertă (etichete, linii) | 8,70:1 |
| Copertă pe folio (butonul principal) | 8,70:1; pe luciul `#CFA45A`–`#E2BD78`: 8,63:1 măsurat |
| Hârtie pe verde (butonul secundar) | 6,43:1 |
| Folio închis `#7A5628` pe hârtie (etichetele câmpurilor) | 5,67:1 |

Măsurat pe randarea machetei (`scripts/f2/contrast-measure.mjs`, `docs/f2/contrast-b-carta.json`): minimum **6,43:1 pe telefon** și **5,67:1 pe desktop**, pe 82 de rânduri de text, inclusiv tagline-ul peste fotografie (7,97:1 pe telefon).

**Interzis:** verde pe copertă (2,42:1). Pe fundalul închis, butonul e mereu auriu. Nicio culoare nouă pentru text fără verificarea de contrast.

## 3. Tipografie

Setul aprobat (G3, D-42), în `src/theme/fonts.ts`: titluri **Belleza** sau **Tenor Sans**, text **Hanken Grotesk** sau **Host Grotesk**. Toate sunt OFL 1.1, găzduite în `public/fonts/`, cu ș, ț, ă, â, î verificate. Trattoria: **Belleza + Hanken Grotesk**.

| Stil | Font | Telefon | Desktop | Detalii |
|---|---|---|---|---|
| Tagline (h1) | titluri | 40–48 px / 1,02 | 80 px / 0,98 | `lang="en"`, tracking −0,01 em, maximum 10–11 caractere pe rând |
| Titlu de secțiune (h2) | titluri | 32–40 px / 1,08 | 52 px / 1,08 | `text-wrap: balance`, maximum 16 caractere pe rând |
| Nume în meniu, titlu de card | titluri | 24 px | 28 px | |
| Text | text | 17 px / 1,55 | 18 px / 1,55 | maximum 44–70 de caractere pe rând |
| Subtitlu hero | text | 18 px | 20 px | |
| Butoane | text 600 | 15 px | 15 px | tracking 0,02 em |
| Etichete (câmpuri, navigare) | text 500–600 | 12–13 px | 12–13 px | majuscule, tracking 0,12 em |

Fără etichetă deasupra titlurilor și fără numerotare decorativă de secțiuni (craft-floor Impeccable).

## 4. Spațiere și așezare

- Scara de spațiere, pe 4 px: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Container de 1280 px. Margini laterale egale: 20 px pe telefon, 80 px de la 1024 px în sus.
- Un singur punct de schimbare principal: 1024 px. Sub el: o coloană, bara fixă de jos, cazarea ca buton.
- Între secțiuni: 64 px pe telefon, 96 px pe desktop. Mai mult spațiu deasupra unui titlu decât sub el.

## 5. Componente

| Componentă | Reguli |
|---|---|
| **Antet** | Peste copertă, text crem. Logo-medalion în centru (48 / 72 px). Navigare în majuscule cu tracking. Telefonul +40 356 630 238 (D-17), limba și „Rezervă o masă” |
| **Copertă (hero)** | Clip sau poster pe toată lățimea, cu o umbră caldă dinspre stânga (`#1C1416`, 95% → 0%) și sus, pentru antet. Chenar dublu de folio inset 24 px, doar pe desktop. Textul în stânga |
| **Buton principal** | Pastilă, minimum 48 px (52 px în bara de jos). Folio cu luciu: `linear-gradient(180deg, #E2BD78, #CFA45A)`, lumină interioară sus, umbră caldă dedesubt. La hover urcă 1 px, la apăsare scale 0,98. **Unul singur pe ecran** |
| **Buton secundar** | Pastilă verde smarald, text hârtie. Hover `#17704A`, apăsat `#0F4F33`. Doar pe hârtie |
| **Buton fantomă** | Contur crem 60% pe copertă („Meniu”, „Sună”) |
| **Insigna premiului** (D-20) | Spațiu rezervat 72 px pe telefon și 96 px pe desktop, ramă punctată de folio, medalion rotund și textul „Wine Spectator Restaurant Award · nivel și an la confirmare”. Când sosește logo-ul oficial, acesta îl înlocuiește nemodificat |
| **Cerere de cazare** (D-15) | Pe desktop: fâșie de hârtie la baza copertei (titlu, notă, Sosire, Plecare, Oaspeți, „Cere ofertă de cazare” verde). Pe telefon: un buton-fâșie care deschide panoul S-01b |
| **Bara de jos (telefon)** | Fixă, pe copertă, cu linie de folio sus: „Rezervă o masă” (auriu), „Meniu”, „Sună” |
| **Rând de meniu** | Nume (titluri), linie de puncte, notă (text secundar). Hover: verde. Linie de 1 px între rânduri |
| **„Exemplu · de înlocuit”** (D-08) | Pastilă închisă 86%, ramă punctată, iconiță și text (12,8:1). Pe orice conținut provizoriu |
| **Focus** | Contur de 2 px în culoarea folio, plus halou închis de 6 px; vizibil pe hârtie și pe copertă |

Iconițe: un singur set, contur 1,6 px, stilul Lucide (ISC). Niciun emoji și niciun caracter Unicode în loc de iconiță.

## 6. Mișcare

- **Un singur moment, la încărcare:** chenarul de folio se trasează o dată (1100 ms, `cubic-bezier(0.16, 1, 0.3, 1)`). Textul hero urcă 12 px, cu 90 ms între elemente.
- **Micro-interacțiuni:** butonul urcă 1 px la hover și se apasă (scale 0,98); fotografia de card se mărește cu 1,03 în cadrul ei; rândul de meniu își schimbă culoarea în 160 ms.
- **`prefers-reduced-motion`:** fără animații și fără tranziții.
- **Efectele sezoniere, sunetul, 3D și comutatorul de temă:** R2 (D-33).

## 7. Fotografie

- **Seara, lumină caldă (tungsten, flacără):** cuptorul, mâini, pahare, prim-planuri de preparate. Oameni la masă, fără fețe recognoscibile fără acord (pentru copii: Q-25).
- **Formatele din content-model:** HERO-L 16:9 și HERO-P 9:16 pentru poster și clip, CARD-P 4:5, CARD-L 3:2.
- **Text peste imagine:** doar pe copertă, cu umbra caldă. Contrastul se măsoară pe randare înainte de lansare.
- **Fotografiile provizorii din machete:** Wikimedia Commons, `design/f2/assets/foto/credits.json`. Se înlocuiesc (`docs/materiale-necesare.md`, #31).

## 8. Tema pe restaurant (cod)

| Fișier | Ce face |
|---|---|
| `src/theme/fonts.ts` | Setul aprobat (4 fonturi), opțiunile din panou, regulile `@font-face` doar pentru fonturile alese |
| `src/theme/theme.ts` | `DEFAULT_THEME_COLORS`, cele 5 perechi de contrast, `validateColorField` (folosit în panou), `themeCssVars`, `themeStyleSheet` pentru `<head>` în F3 |
| `src/collections/Settings.ts` | Identitate → Culori (6 câmpuri) și „Font titluri” / „Font text” |
| `src/migrations/20261124_143006_f2_theme.ts` | Coloanele noi (`colors_surface_dark`, `colors_text_on_dark`, `font_heading`, `font_text`) |
| `seed/trattoria-da-vittoria.json` → `settingsFill` | Pune tema B în Setările Trattoriei, doar unde câmpurile sunt goale |

Un font nou intră în set doar după verificarea diacriticelor (fontTools, U+0218–021B), cu licență OFL sau plătită și aprobat de Alin, plus o migrație pentru opțiunea nouă.

## 9. Brand

- **Logo:** medalionul Trattoria (PNG 1024 px, în Biblioteca media; Setări → Logo principal). Se vede bine și pe copertă, deci nu e nevoie de o variantă pe fundal închis.
- **Logo grup:** Grupul ANNA, în footer.
- **Pictograma de filă (D-43):** `design/brand/favicon/`. `favicon.svg` (detaliat), `favicon-mic.svg` (pentru 16–48 px), PNG 512 / 192 / 180 / 48 / 32 / 16 și `favicon.ico`. Desen: disc copertă, inel de folio, „V” din Alex Brush (OFL), cel mai apropiat de script-ul din logo. PNG-ul de 512 px e în Biblioteca media și în Setări → Pictogramă de filă.
- **Creditul din footer (ADR-013):** două rânduri discrete, text.

## 10. Verificare înainte de fiecare poartă

1. `node scripts/f2/contrast-measure.mjs <pagină> <etichetă> <ieșire.json>`: toate rândurile ≥ 4,5:1.
2. `.claude/skills/impeccable/scripts/impeccable detect <fișiere>` și `first-viewport <pagină> --thesis .hero --action <buton>`.
3. Lighthouse pe mobil: performanță ≥ 85, accesibilitate ≥ 95 (D-26), cifre raportate.
4. La finalul lui F3: revizia de final Impeccable (`impeccable-finish-reviewer`) și `DESIGN.md` scris din site-ul construit.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
