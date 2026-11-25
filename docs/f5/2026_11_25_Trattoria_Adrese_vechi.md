# Adresele vechi de pe davittoria.ro și redirecționările (G7-2)

Trattoria da Vittoria · 25.11.2026 · Sursa: harta site-ului vechi (`https://davittoria.ro/wp-sitemap.xml`, WordPress), citită pe 25.11.2026 cu acordul din D-59, plus linkurile interne din paginile lui.

## Concluzia

16 adrese pe site-ul vechi. 3 rămân pagini pe site-ul nou, 13 se redirecționează (301) spre pagina potrivită. Intră prin seed o singură dată; se schimbă din panou: Setări → Redirecționări. Au efect abia după mutarea domeniului (F5, sesiunea 2).

| Adresa veche | Ce era | Duce la | Motiv |
|---|---|---|---|
| `/` | Acasă | `/` | aceeași pagină |
| `/catalog-vinuri/` | Lista de vinuri | `/catalog-vinuri` | se păstrează (D-14, ADR-013) |
| `/formular-de-reclamatie/` | Sesizări | `/formular-de-reclamatie` | se păstrează (ADR-013) |
| `/valori-nutritionale/` | Valori nutriționale | meniul digital | D-19 (exista din F3) |
| `/meniu` | scurtătură (301 spre meniul 3D) | meniul digital | aceeași intenție |
| `/meniu-3d-teste/` | „MENIU 3D TESTE” | meniul digital | meniul de test |
| `/3d-flip-book/meniu/` | meniul ca broșură 3D | meniul digital | aceeași intenție |
| `/3d-flip-book/valori-nutritionale/` | valorile nutriționale ca broșură | meniul digital | D-19 |
| `/3d-flip-book/test/` | broșură de test | `/` | pagină de test |
| `/gallery/evenimente/` | galerie „Evenimente” | `/galerie` | galeria nouă, filtrabilă pe categorii |
| `/gallery/locatie/` | galerie „Locație” | `/galerie` | idem |
| `/gallery/catalog-vinuri/` | galerie „Catalog vinuri” | `/catalog-vinuri` | lista de vinuri |
| `/trattoria/` | pagina „Trattoria” | `/` | prezentarea e pe Acasă |
| `/la-multi-ani/` | pagină protejată cu parolă | `/` | **[PRESUPUNERE]** felicitare internă; nu are echivalent |
| `/1hm/` | pagină cu un clip | `/` | **[PRESUPUNERE]** fără echivalent |
| `/test/` | pagină de test | `/` | pagină de test |

**De știut:** adresele cu „/” la final fac un pas în plus (`/trattoria/` → `/trattoria` → `/`); Google urmează până la 10 pași. Fișierele din `/wp-content/uploads/…` (imagini vechi) dau 404; nu au echivalent unu-la-unu.

Site-ul vechi are și eticheta Google `GT-NCLXCCBJ` (statistici). Site-ul nou nu încarcă statistici (fără cookies); decizia intră în checklist-ul de lansare.
