# F0 · Test „traduceri” (ADR-007)

Data: 24.11.2026 · Rezultat: **motorul se alege la GATE 0**. Recomandarea mea: **Claude Haiku 5.5 prin API**, cu marcaje de protecție. Varianta fără niciun cost: **MyMemory**, cu aceleași marcaje.

## Ce s-a probat

Texte de probă (`scripts/f0/translation-texts.json`):
- **meniu:** „Risotto ai funghi porcini: orez Carnaroli gătit lent în supă de legume, cu hribi, unt și Parmigiano Reggiano maturat 24 de luni. Un fel de mâncare cald și cremos, perfect pentru serile reci de toamnă.” (199 de caractere)
- **eveniment:** „Vineri seara, DJ-ul nostru aduce cele mai bune hituri din anii '90 și 2000. Rezervă-ți masa din timp: locurile din Salon Vittoria se ocupă repede. Intrare liberă.” (161 de caractere)
- Termeni care **nu se traduc** (ADR-007, content-model 9): Risotto ai funghi porcini, Carnaroli, Parmigiano Reggiano, Salon Vittoria, The Best Restaurant in Town.
- Limbi: en, it, fr, de, zh, sv.

| Motor | Probat? | De ce |
|---|---|---|
| MyMemory (gratuit, fără cont) | **da**, 12 traduceri + 4 cu protecție | singurul gratuit accesibil fără cheie |
| Claude (modelul acestei sesiuni) | da, ca **referință de calitate** | arată ce poate un motor LLM; **Claude Haiku 5.5 prin API nu a fost rulat**, pentru că nu există cheie |
| DeepL API Free, Azure Translator F0, Google Cloud Translation | nu | cer cont și cheie; prețurile și limitele sunt în `docs/versions.md` |

## Rezultate măsurate

### MyMemory, fără protecție

Timp: 720–1.522 ms pe cerere. Limită oficială: 5.000 de caractere pe zi anonim, 50.000 pe zi cu o adresă de email în cerere (https://mymemory.translated.net/doc/usagelimits.php).

| Limba | Termeni păstrați | Observații |
|---|---|---|
| en | toți | corect, natural |
| it | **„Salone Vittoria”** (tradus) | în rest corect |
| fr | **„Risotto aux cèpes”** (tradus) | în rest corect, natural |
| de | **„Risotto mit Steinpilzen”** (tradus) | tutuire („Reserviere deinen Tisch”), neobișnuit pentru un restaurant premium |
| zh | **„牛肝菌烩饭”, „卡纳罗利米”, „帕尔马干酪”** (tot tradus) | Salon Vittoria transcris și pus în paranteză |
| sv | toți | corect |

Termeni protejați păstrați: **2 limbi din 6**.

### MyMemory, cu marcaje de protecție

Fiecare termen protejat se înlocuiește înainte de traducere cu `{0}`, `{1}` … și se pune la loc după.

| Text → limba | Termeni păstrați |
|---|---|
| meniu → fr | **toți** |
| meniu → de | **toți** |
| eveniment → it | **toți** |
| meniu → zh | **toți** |

Rezultat: 4 din 4. Metoda funcționează la orice motor și o folosim indiferent de alegere.

### Referința Claude (stil premium, termeni păstrați, „Sie” în germană)

| Limba | Meniu | Eveniment |
|---|---|---|
| en | Risotto ai funghi porcini: Carnaroli rice slow-cooked in vegetable broth with porcini mushrooms, butter and Parmigiano Reggiano aged for 24 months. A warm, creamy dish, perfect for cold autumn evenings. | This Friday night, our DJ brings you the best hits of the '90s and 2000s. Book your table early – seats in the Salon Vittoria fill up fast. Free entry. |
| it | Risotto ai funghi porcini: riso Carnaroli cotto lentamente in brodo vegetale, con funghi porcini, burro e Parmigiano Reggiano stagionato 24 mesi. Un piatto caldo e cremoso, perfetto per le fredde serate d'autunno. | Venerdì sera il nostro DJ porta i migliori successi degli anni '90 e 2000. Prenota il tuo tavolo per tempo: i posti nel Salon Vittoria vanno a ruba. Ingresso libero. |
| fr | Risotto ai funghi porcini : riz Carnaroli mijoté lentement dans un bouillon de légumes, avec des cèpes, du beurre et du Parmigiano Reggiano affiné 24 mois. Un plat chaud et crémeux, idéal pour les soirées fraîches d'automne. | Vendredi soir, notre DJ vous fait revivre les meilleurs tubes des années 90 et 2000. Réservez votre table à l'avance : les places du Salon Vittoria partent vite. Entrée libre. |
| de | Risotto ai funghi porcini: Carnaroli-Reis, langsam in Gemüsebrühe gegart, mit Steinpilzen, Butter und 24 Monate gereiftem Parmigiano Reggiano. Ein warmes, cremiges Gericht – perfekt für kalte Herbstabende. | Am Freitagabend spielt unser DJ die besten Hits der 90er- und 2000er-Jahre. Reservieren Sie Ihren Tisch rechtzeitig – die Plätze im Salon Vittoria sind schnell vergeben. Eintritt frei. |
| zh | Risotto ai funghi porcini：以蔬菜高汤慢火烹煮的 Carnaroli 米，搭配牛肝菌、黄油和陈酿 24 个月的 Parmigiano Reggiano。温暖绵滑，是寒冷秋夜的理想之选。 | 本周五晚，我们的 DJ 将为您带来 90 年代和 2000 年代的经典金曲。请提前预订座位——Salon Vittoria 的位置很快就会订满。免费入场。 |
| sv | Risotto ai funghi porcini: Carnaroli-ris som långkokas i grönsaksbuljong med karljohansvamp, smör och Parmigiano Reggiano lagrad i 24 månader. En varm och krämig rätt, perfekt för kalla höstkvällar. | På fredagskvällen spelar vår DJ de största hitsen från 90- och 2000-talet. Boka ditt bord i god tid – platserna i Salon Vittoria går åt snabbt. Fri entré. |

Evaluarea calității este a mea. Verificarea umană rămâne obligatorie (ADR-007: „verificat de om”); tu verifici engleza.

## Cost estimat

[PRESUPUNERE] Volum: aproximativ **60.000 de caractere** de tradus per restaurant. Estimarea pornește de la limitele de lungime din content-model: secțiuni, categorii, aproximativ 50 de vinuri, recenzii, FAQ, pagini legale și texte alternative. Asta înseamnă **360.000 de caractere** pentru prima traducere în 6 limbi.

| Motor | Cost pentru prima traducere (360.000 caractere) | Lunar, apoi | Observații |
|---|---|---|---|
| MyMemory, cu email | 0 USD, dar **8 zile** (50.000 caractere/zi) | 0 USD | Fără control asupra tonului; poate returna potriviri dintr-o memorie de traducere publică. Condițiile de utilizare comercială sunt **neverificate** |
| Azure Translator F0 | 0 USD (2 milioane caractere/lună gratuit) | 0 USD | Neprobat; cere cont Azure |
| DeepL API Free | 0 USD (500.000 caractere) | 0 USD | Neprobat; nu e clar dacă planul mai poate fi cumpărat |
| **Claude Haiku 5.5** | **aproximativ 0,10–0,15 USD** | sub 0,05 USD | 0,10 USD intrare / 0,50 USD ieșire per milion de tokeni (pagina oficială, 24.11.2026). [PRESUPUNERE] aproximativ 3 caractere pe token |
| Claude Sonnet 5.5 | aproximativ 1,75 USD | sub 0,50 USD | 2 / 10 USD per milion de tokeni |

## Concluzie și recomandare

1. **Protecția termenilor prin marcaje** `{n}` se folosește indiferent de motor. Fără ea, MyMemory a tradus numele de preparate sau saloane în 4 limbi din 6.
2. **Recomandare: Claude Haiku 5.5 prin API.** Costă cenți pentru tot site-ul și primește în aceeași cerere glosarul, lista „nu se traduce” și tonul pe limbă (de exemplu „Sie” în germană). Respectă D-31: plătit, dar cel mai bun raport calitate-preț. Înainte de decizia finală îl rulez pe aceleași texte, dacă îmi dai o cheie API Anthropic (vezi „De făcut”).
3. **Varianta fără niciun cost:** MyMemory cu marcaje și adresă de email (50.000 caractere/zi). Calitate bună în test, dar fără control al tonului și cu prima traducere întinsă pe mai multe zile.
4. Fereastra ialoc rămâne doar în ro și en (ADR-007).

## De făcut (decizia ta la GATE 0)

- Alegi motorul: Claude Haiku 5.5 (recomandat), MyMemory sau altul.
- Pentru Claude: o cheie API Anthropic. Mi-o dai printr-un formular securizat al mediului; eu nu văd valoarea și nu intră în repo. După alegere, în Vercel ca `TRANSLATE_API_KEY`.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
