# -*- coding: utf-8 -*-
"""Generează manualul de utilizare Trattoria da Vittoria (HTML), în formatul manualului K9 Friends.
Rulare: python3 build_manual.py [--inline]   (--inline = imaginile și fonturile în fișier, un singur HTML)
"""
import base64, html, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CAP = os.path.join(HERE, 'capturi')
IMG = os.path.join(HERE, 'img')
PDF = '--pdf' in sys.argv
INLINE = '--inline' in sys.argv or PDF
OUT_DIR = os.path.join(HERE, 'out')
NAME = '2026_11_26_Trattoria_Manual_Utilizare'
DATA = '26 noiembrie 2026'
SITE = 'https://anna-restaurante-alinlabau-9308s-projects.vercel.app'

os.makedirs(OUT_DIR, exist_ok=True)
if not INLINE:
    for d in ('img', 'capturi'):
        os.makedirs(os.path.join(OUT_DIR, d), exist_ok=True)

def esc(s):
    return html.escape(s, quote=False)

_used = set()
def src(kind, name):
    """Calea (sau data URI) unei imagini; copiază fișierul în out/ când nu e inline."""
    folder = CAP if kind == 'capturi' else IMG
    path = os.path.join(folder, name)
    if PDF:
        alt = os.path.join(HERE, kind + '-pdf', re.sub(r'\.webp$', '.jpg', name))
        if os.path.exists(alt):
            path = alt
    if not os.path.exists(path):
        return None
    if INLINE:
        mime = 'image/jpeg' if path.endswith('.jpg') else 'image/webp' if name.endswith('.webp') else 'image/png' if name.endswith('.png') else 'image/svg+xml'
        return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()
    if (kind, name) not in _used:
        shutil.copy(path, os.path.join(OUT_DIR, kind, name))
        _used.add((kind, name))
    return f'{kind}/{name}'

ALIN = src('img', 'alin-320.webp')
GEORGE = src('img', 'george-320.webp')
BT = src('img', 'biztech-logo-400.webp')
TRAT = src('img', 'trattoria-240.png')

def banner_wide(key, alt):
    s = src('img', f'bw-{key}.webp')
    return f'<figure class="bt-banner"><img src="{s}" alt="{esc(alt)}" width="1860" height="470" loading="lazy"></figure>' if s else ''

def voice(text):
    return f'<p class="voice"><img src="{ALIN}" alt="" width="40" height="40" loading="lazy"><span>{text}</span></p>'

# ------------------------------------------------------------------ capturile
# (cheie-fișier, titlu, adresă, legendă). Numerotarea e în ordinea de aici.
FLOWS = [
    ('flux-prima-vizita', 'Prima vizită', 'Ce vede un oaspete care deschide site-ul pentru prima dată, de sus până jos pe pagina Acasă.', [
        ('00-cookies', 'Bannerul de cookies', '/', 'Prima dată apare bannerul: „Accept” pornește statisticile Google (doar pe domeniul davittoria.ro), „Refuz” le lasă oprite. Până la o alegere, site-ul nu trimite nimic către Google. Alegerea se ține minte 12 luni și se poate schimba din „Setări cookie-uri”, în subsol.'),
        ('01-acasa', 'Coperta', '/', 'Titlul, subtitlul, butoanele „Rezervă o masă” (deschide ialoc) și „Meniu Digital” (filă nouă), peste clipul sau slideshow-ul copertei. Medalionul cu logo-ul stă în mijlocul meniului. Butonul rotund din dreapta oprește mișcarea. Jos, bara de cazare. Toate textele vin din Pagina Acasă → Hero.'),
        ('14-meniu', 'Meniul', '/', 'Pe desktop: „Catalog vinuri”, „Il Ritmo della Notte”, „Mai mult” cu restul paginilor, telefonul de rezervări, limba și „Rezervă o masă”. Pe telefon, același meniu se deschide într-un panou lateral. Ordinea și etichetele se schimbă din Setări restaurant → Meniu de navigare.'),
        ('15-limba', 'Alegerea limbii', '/', 'Site-ul vorbește 7 limbi: română, engleză, italiană, franceză, germană, chineză și suedeză. Adresa rămâne în română (de exemplu /en/galerie), ca linkurile să nu se rupă niciodată.'),
        ('02-cazare', 'Bara de cazare', '/#cazare', '„Cazare la Hotel ANNA”: sosire, plecare, camere și oaspeți, apoi „Cere ofertă de cazare”. Nu este o rezervare automată: cererea ajunge la recepție, care confirmă disponibilitatea (textul de sub bară este editabil). Limitele de adulți și copii se setează din panou.'),
        ('03-bucataria', 'Bucătăria', '/#bucataria', 'Categoriile de preparate într-un slider cu fotografii (până la 20 de categorii), cu titlul și textul introductiv editabile. Fiecare categorie poate duce la meniul digital.'),
        ('04-vinuri', 'Vinurile', '/#vinuri', 'Lista de vinuri pe scurt: insigna Wine Spectator (din Premii și distincții), filtrele pe tip și câteva vinuri, cu buton către lista completă. Insigna intră și în datele pentru Google, cât timp are nivelul și anul completate.'),
        ('05-recenzii', 'Ce spun oaspeții', '/#recenzii', 'Recenziile reale de pe Google, cu prenume și inițială, și butonul „Lasă o recenzie”. Se adaugă din Recenzii, cu limba recenziei aleasă corect; nu se scriu recenzii inventate.'),
        ('06-petreceri', 'Weekendul începe la Trattoria', '/#petreceri', 'Agenda serilor tematice: afișele serilor viitoare, cu data, tipul (DJ, artist, formație) și invitatul. O seară trecută iese singură din agendă. Butonul duce la pagina „Il Ritmo della Notte”.'),
        ('07-evenimente-private', 'Un salon doar al vostru', '/#evenimente-private', 'Saloanele (fotografie, capacitate, dotări), tipurile de evenimente și butonul „Cere ofertă”. Saloanele se editează din Saloane; tipurile, din Pagina Acasă → Evenimente private.'),
        ('08-cursuri-pizza', 'Azi gătesc cei mici', '/#cursuri-pizza', 'Cursul de pizza pentru copii: fotografia (și clipul, când este pornit), vârsta, durata, prețul, locurile, butonul de înscriere și linkul către pagina cursului.'),
        ('09-hotel', 'După cină, rămâi peste noapte', '/#hotel', 'Hotel ANNA: fotografiile, adresa, telefonul recepției și butonul „Cere ofertă de cazare”. Datele hotelului vin din Pagina Acasă → Hotel.'),
        ('10-galerie', 'Trattoria, în imagini', '/#galerie', 'Cel mult 8 fotografii sau clipuri bifate „Pe Acasă” în Galerie, cu linkul către galeria completă. Până după sărbători, secțiunea arată fotografiile de Crăciun (D-77).'),
        ('12-intrebari', 'Întrebările frecvente', '/#intrebari', 'Întrebările din grupul „Acasă” (cel mult 5), cu răspunsul care se deschide la clic. Se editează din Întrebări frecvente; fiecare grup apare pe pagina lui.'),
        ('11-contact', 'Spune-ne ce plănuiești', '/#contact', 'Butoanele către formularul de contact, cu subiectul deja ales (Rezervă o masă, Eveniment privat, Curs de pizza pentru copii, Cazare), linkul către Sesizări, telefoanele și programul. Harta Google se încarcă doar la clic pe „Arată harta”, ca să nu pună cookie-uri.'),
        ('13-footer', 'Subsolul', '/', 'Contact și program, linkurile Grupului ANNA (din Linkuri grup), paginile legale, Sesizări, „Setări cookie-uri”, rețelele sociale și, centrat, creditul BizTech cu logo-ul și cele 3 rânduri (D-63).'),
    ]),
    ('flux-rezervari', 'Rezervarea mesei și cazarea', 'Cele două drumuri care aduc oaspeți: masa, prin ialoc, și camera, prin cererea către recepție.', [
        ('17-ialoc', 'Fereastra ialoc', '/', '„Rezervă o masă” deschide fereastra ialoc peste pagină: numărul de persoane, data, durata, zona (terasă, fumători, nefumători), ora liberă și confirmarea. Rezervarea ajunge direct la restaurant, în contul ialoc. De la o seară tematică, fereastra se deschide pe data serii.'),
        ('16-cazare-calendar', 'Calendarul din bara de cazare', '/#cazare', 'Sosirea și plecarea se aleg dintr-un calendar; nopțile se numără singure. Camerele, adulții și copiii au limitele setate în panou (implicit 6 adulți, 4 copii).'),
        ('27-contact-cazare', 'Cererea de cazare', '/contact?subiect=cazare', 'Butonul „Cere ofertă de cazare” deschide formularul de contact cu subiectul „Cazare” și datele deja completate: sosire, plecare, adulți, copii, tipul de cameră. După trimitere, oaspetele vede termenul de răspuns, iar cererea apare în Cereri primite.'),
    ]),
    ('flux-seri', 'Serile, evenimentele private și cursurile', 'Paginile proprii pentru ce se întâmplă în Trattoria dincolo de masa de fiecare zi.', [
        ('18-petreceri', 'Il Ritmo della Notte', '/petreceri', 'Serile viitoare, fiecare cu afiș, dată, oră, tip, invitat, text și „Rezervă masă” pe data serii. Jos, arhiva „Cum a fost”, cu fotografiile de după eveniment. Serile sunt și evenimente în datele pentru Google (Event).'),
        ('19-evenimente-private', 'Evenimente private', '/evenimente-private', 'Fiecare salon cu fotografie, capacitate la masă și la cocktail, dotări și text. Tipurile de evenimente ca etichete. Butonul duce la formular, cu subiectul „Eveniment privat” și salonul ales.'),
        ('20-cursuri-pizza', 'Cursuri de pizza', '/cursuri-pizza-copii', 'Textul complet al cursului, clipul principal (9:16, cu sunet, pornește la cerere), galeria foto-video, vârsta, durata, prețul, locurile și butonul de înscriere, care deschide formularul cu subiectul „Curs de pizza pentru copii”.'),
    ]),
    ('flux-galerie-vinuri', 'Galeria și lista de vinuri', 'Două pagini de răsfoit: fotografiile locului și cele peste 150 de vinuri.', [
        ('21-galerie', 'Galeria', '/galerie', 'Toate fotografiile și clipurile, filtrate pe categorii (Local, Restaurant, Saloane private, Catering, Il Ritmo della Notte, Seri de Crăciun…). Categoriile și ordinea se schimbă din panou. Pe producție sunt 122 de elemente.'),
        ('22-galerie-fereastra', 'Fereastra mare', '/galerie', 'Clic pe o fotografie: se deschide mare, cu legenda și săgețile pentru următoarea. Se închide cu Escape sau cu X. Clipurile pornesc aici, cu sunetul lor.'),
        ('23-catalog-vinuri', 'Lista de vinuri', '/catalog-vinuri', 'Insigna Wine Spectator, căutarea, filtrele pe tip (Spumant, Alb, Roșu, Rosé, Desert) și lista: nume, producător, regiune, an, preț pe sticlă și la pahar. Butonul „Descarcă PDF” apare când lista în PDF este încărcată în Pagina Acasă → Vinuri.'),
        ('24-vinuri-cautare', 'Căutarea în listă', '/catalog-vinuri', 'Căutarea filtrează lista pe măsură ce scrieți (aici: „barolo”), după nume, producător sau regiune, fără reîncărcarea paginii.'),
        ('25-vinuri-filtru', 'Filtrul pe tip', '/catalog-vinuri', 'Un clic pe un tip (aici: Roșu) arată doar vinurile lui; filtrele se combină cu căutarea. Tipul fiecărui vin se alege în panou, la Vinuri.'),
    ]),
    ('flux-contact', 'Contact și sesizări', 'Un singur formular cu subiect, plus formularul separat de sesizări. Nimic nu se pierde: fiecare trimitere se salvează în panou.', [
        ('26-contact', 'Formularul de contact', '/contact', '„Cu ce te putem ajuta?”: Rezervă o masă (deschide ialoc), Eveniment privat, Curs de pizza pentru copii, Cazare și Întrebare. Câmpurile se schimbă după subiect. Alături, telefoanele pe subiecte, adresa și programul. Fiecare subiect are destinatarii lui de email, setați în panou.'),
        ('28-contact-erori', 'Greșelile din formular', '/contact?subiect=eveniment-privat', 'La trimitere fără câmpurile obligatorii, formularul le marchează pe fiecare, cu mesajul lângă câmp, și mută focusul pe prima greșeală. Acordul pentru prelucrarea datelor este obligatoriu și se salvează cu ora lui.'),
        ('35-harta', 'Harta, la clic', '/contact', 'Harta Google apare doar după „Arată harta”, ca pagina să nu încarce nimic de la Google înainte de acordul oaspetelui. Coordonatele și adresa vin din Setări restaurant → Contact și program.'),
        ('29-sesizari', 'Sesizări', '/formular-de-reclamatie', 'Formularul de reclamații păstrat de pe vechiul site, la aceeași adresă: data vizitei, motivul (din lista „Motive de sesizare”), ospătarul (opțional), mesajul. Sesizările le vede doar Administratorul, în Cereri primite.'),
    ]),
    ('flux-limbi', 'Limbi și paginile legale', 'Aceleași pagini, în 7 limbi, și paginile pe care le cere legea.', [
        ('32-en', 'Acasă în engleză', '/en', 'Textele, butoanele, meniul și bannerul de cookies, toate în engleză. Traducerile se fac automat din română și se pot corecta manual în panou; o limbă corectată de om nu mai este suprascrisă.'),
        ('34-it-petreceri', 'Serile în italiană', '/it/petreceri', 'Pagina „Il Ritmo della Notte” în italiană. Numele serilor și ale invitaților nu se traduc; descrierile, da.'),
        ('33-zh-vinuri', 'Lista de vinuri în chineză', '/zh/catalog-vinuri', 'Lista de vinuri în chineză: numele vinurilor rămân ca în original, tipurile și etichetele se traduc. Fontul pentru chineză se încarcă doar pe paginile /zh.'),
        ('30-termeni', 'Termeni și condiții', '/termeni', 'Paginile legale (Termeni, Confidențialitate, Cookies) se editează din Pagini legale, cu titluri și liste, și au „Actualizat la” automat. Textele juristului se completează înainte de lansare.'),
        ('31-cookies', 'Politica de cookies', '/cookies', 'Politica adaptată pentru Trattoria: ce cookie-uri există (statisticile Google după acord, ialoc în fereastra de rezervare, harta la clic), cât țin și cum se retrage acordul. Până completează juristul parantezele drepte, pagina poartă eticheta „Exemplu · de înlocuit”.'),
    ]),
    ('flux-admin', 'Panoul de administrare', 'Ecranele din care echipa schimbă site-ul. Capturile sunt făcute pe o copie locală a panoului, cu conținutul de pornire și câteva date de probă; pe producție listele sunt pline.', [
        ('50-login', 'Intrarea în panou', '/admin/login', 'Adresa panoului este /admin (după lansare: davittoria.ro/admin). Email și parolă; fiecare om are contul lui, cu rolul Administrator sau Editor. Parola se schimbă din propriul cont.'),
        ('51-tablou', 'Tabloul de bord', '/admin', 'Prima pagină după intrare: conținutul provizoriu rămas (cu linkuri către fiecare element), cererile noi, serile apropiate, ce lipsește din Setări și starea traducerilor. Când contorul „Conținut provizoriu” ajunge la 0, site-ul este gata de lansare.'),
        ('52-pagina-acasa', 'Pagina Acasă', '/admin/collections/home-page', 'O filă pe secțiune (Hero, Bară de cazare, Bucătăria, Vinuri, Ce spun oaspeții, Petreceri și agenda, Evenimente private, Cursuri de pizza, Hotel, Galerie, Contact). Fiecare are „Pornită” (oprită = dispare de pe site și din meniu), „Provizoriu” și „Ordine”. În dreapta, starea traducerilor și butonul „Tradu automat”.'),
        ('69-limba-continut', 'Limba conținutului', '/admin', 'Selectorul din dreapta sus schimbă limba în care editați: alegeți Engleză, corectați, salvați, și acea limbă devine „Verificat de om”. Textele marcate „Nu se traduce” (nume proprii, numere de telefon) sunt aceleași în toate limbile.'),
        ('53-seri-lista', 'Seri tematice', '/admin/collections/events', 'Lista serilor, cu data, tipul și starea (viitoare sau trecută). „Creați unul nou” adaugă o seară. Căutarea, coloanele și filtrele sunt deasupra listei.'),
        ('54-seara', 'O seară tematică', '/admin/collections/events/…', 'Numele serii, data și ora de început (ora României), ora de sfârșit, tipul, invitatul, afișul (4:5, minimum 1080 × 1350 px; este și imaginea de distribuire), descrierea, intrarea, „Rezervare cu data serii” și, după eveniment, „Fotografii după eveniment”. „Activ” oprit = nu apare pe site, dar rămâne în panou.'),
        ('55-biblioteca', 'Biblioteca media', '/admin/collections/media', 'Toate fotografiile, clipurile și PDF-urile, cu miniaturi de 160 × 120 px (D-81), tipul, textul alternativ și mărimea. Originalul rămâne la dumneavoastră: pe server stau doar variantele optimizate (D-27).'),
        ('56-biblioteca-creeaza', 'Încărcarea unui fișier', '/admin/collections/media/create', '„Ce încarci?” (fotografie, clip sau document PDF), apoi „Alege și convertește”: panoul micșorează și convertește fișierul în browser, înainte de încărcare (merge și cu HEIC de pe iPhone). Textul alternativ este obligatoriu; pentru copii în fotografie, bifa „Acordul părinților confirmat”.'),
        ('57-galerie', 'Galerie', '/admin/collections/gallery', 'Elementele galeriei: fișierul, categoria, legenda și bifa „Pe Acasă” (cel mult 8). Ordinea se schimbă trăgând rândurile. Categoriile se gestionează din Categorii de galerie.'),
        ('58-recenzii', 'Recenzii', '/admin/collections/reviews', 'Numele (prenume și inițială), textul, nota, sursa (Google), limba recenziei, „Pe Acasă” și „Activ”. Doar recenzii reale, copiate de pe Google.'),
        ('59-vinuri', 'Vinuri', '/admin/collections/wines', 'Lista vinurilor: nume, tip, preț pe sticlă și la pahar, producător, regiune, an, „Recomandat” și „Activ”. Pe site, lista se filtrează după tip și se caută după nume, producător și regiune.'),
        ('60-intrebari', 'Întrebări frecvente', '/admin/collections/faqs', 'Întrebarea, răspunsul și grupul (Acasă, Evenimente private, Cursuri de pizza, Cazare, Restaurant). Pe Acasă apar cel mult 5. Doar răspunsuri confirmate de manager.'),
        ('61-saloane', 'Saloane', '/admin/collections/salons', 'Fiecare salon: nume, capacitate la masă și la cocktail, dotări, fotografii, text. Apar pe Acasă și pe pagina Evenimente private, și ca opțiune în formularul de eveniment privat. Tipurile de camere ale hotelului stau în Tipuri de camere.'),
        ('62-setari', 'Setări restaurant · Identitate', '/admin/collections/settings/…', 'Un document pe restaurant: tagline, logo-urile (principal, pe fundal închis, grup, pictograma de filă), culorile, fonturile, tema implicită, formele decorative și imaginea de distribuire implicită. Nimic specific Trattoriei nu este scris în cod (ADR-002).'),
        ('63-setari-integrari', 'Setări restaurant · Integrări', '/admin/collections/settings/…', 'ID-ul ialoc, ID-ul statisticilor Google (G-… sau GT-…; gol = fără statistici și fără banner), adresa meniului digital, bucătăria și nivelul de preț pentru Google. Fila „Contact și program” are adresa, coordonatele, telefoanele pe subiecte, programul pe zile și rețelele sociale.'),
        ('64-setari-cereri', 'Setări restaurant · Cereri și emailuri', '/admin/collections/settings/…', 'Un rând pe subiect (Eveniment privat, Curs de pizza pentru copii, Cazare, Întrebare, Sesizare): „Subiect activ”, destinatarii (cel mult 5), copia (nu apare pe site și nu stă în cod, D-15) și termenul de răspuns afișat. Tot aici: „Păstrează cererile (luni)”, setat la 12 luni. Adresele din captură sunt estompate.'),
        ('65-cereri', 'Cereri primite', '/admin/collections/submissions', 'Fiecare trimitere din formulare: subiectul, numele, telefonul, emailul, mesajul, detaliile pe subiect, acordul GDPR cu ora lui și starea (Nouă, În lucru, Rezolvată). Datele trimise nu se modifică; se schimbă doar starea (D-37). Editorul vede doar cursurile de pizza și întrebările.'),
        ('66-premii', 'Premii și distincții', '/admin/collections/awards', 'Premiul Wine Spectator: numele, nivelul, anul, insigna (orice imagine, cu transparență), legătura către sursă și bifa „În datele pentru Google”. Apare pe copertă, în secțiunea Vinuri și în subsol.'),
        ('67-redirectionari', 'Redirecționări', '/admin/collections/redirects', 'Adresele vechiului site davittoria.ro (16, citite din harta lui) și unde duc acum, ca linkurile din Google și din rețele să nu dea eroare după mutarea domeniului. Se pot adăuga oricând altele: „De la” și „Către”.'),
        ('68-utilizatori', 'Utilizatori', '/admin/collections/users', 'Conturile echipei, fiecare cu rolul lui și cu restaurantele la care are acces. Doar Administratorul creează conturi și atribuie restaurante. Un Editor nu se poate adăuga singur la alt restaurant.'),
    ]),
]

NUM = {}
_n = 0
for _fid, _t, _d, shots in FLOWS:
    for key, *_ in shots:
        _n += 1
        NUM[key] = f'{_n:02d}'
TOTAL_SHOTS = _n

def n(*keys):
    return '–'.join(NUM[k] for k in keys) if len(keys) == 2 else ', '.join(NUM[k] for k in keys)

def shot_html(key, title, url, cap):
    d = src('capturi', f'desktop-{key}.webp')
    p = src('capturi', f'telefon-{key}.webp')
    if not d and not p:
        return ''
    media = ''
    if d:
        media += (f'<figure class="desk"><div class="chrome" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span>'
                  f'<span class="addr">{esc(url)}</span></div><img src="{d}" alt="Captură pe desktop: {esc(title)}" width="1800" height="1125" loading="lazy" decoding="async"></figure>')
    if p:
        media += (f'<div class="phone-wrap"><figure class="phone"><img src="{p}" alt="Captură pe telefon: {esc(title)}" width="780" height="1688" loading="lazy" decoding="async"></figure><p class="cap">telefon</p></div>')
    cls = 'shot' + ('' if d else ' only-phone')
    return (f'<article class="{cls}" id="captura-{NUM[key]}">\n'
            f'  <div class="shot-head"><span class="shot-n">{NUM[key]}</span><h4>{esc(title)}</h4><p class="url">{esc(url)}</p></div>\n'
            f'  <p class="shot-cap">{cap}</p>\n'
            f'  <div class="shot-media">{media}</div>\n</article>\n')

def flows_html():
    out = []
    for fid, title, desc, shots in FLOWS:
        body = ''.join(shot_html(*s) for s in shots)
        if fid == 'flux-prima-vizita':
            body += banner_wide('agent', 'BizTech: Un agent AI care răspunde și la 3 noaptea')
        out.append(f'<section class="flow-sec" id="{fid}" aria-labelledby="{fid}-h">\n<header><h3 id="{fid}-h">{esc(title)}</h3><p>{esc(desc)}</p></header>\n{body}</section>')
    return '\n'.join(out)

# ------------------------------------------------------------------ hărțile SVG (desenate din date)
def tw(text, px=13):
    """Lățimea aproximativă a unui text (Nunito Sans)."""
    w = 0
    for ch in text:
        w += 0.33 if ch in ' il.,:;\'' else 0.62 if ch.isupper() else 0.48 if ch.isdigit() else 0.52
    return w * px

def mindmap(root, rootsub, left, right, aria):
    """left/right: liste de grupuri (etichetă, clasă de culoare, [frunze]); o frunză = text sau (text, 'muted')."""
    LEAF_H, LEAF_GAP, GROUP_GAP, PAD = 24, 6, 26, 14
    def layout(groups):
        y = PAD
        rows = []
        for label, col, leaves in groups:
            ys = []
            for lf in leaves:
                ys.append(y)
                y += LEAF_H + LEAF_GAP
            rows.append((label, col, leaves, ys, (ys[0] + ys[-1]) / 2 + LEAF_H / 2 if ys else y))
            y += GROUP_GAP
        return rows, y - GROUP_GAP + PAD
    L, hl = layout(left)
    R, hr = layout(right)
    H = max(hl, hr, 140)
    offL = (H - hl) / 2
    offR = (H - hr) / 2
    cy = H / 2
    parts = []
    maxl = 0
    maxr = 0
    def group_w(label):
        return max(140, tw(label, 15) + 36)
    for side, rows, off in (('L', L, offL), ('R', R, offR)):
        sgn = -1 if side == 'L' else 1
        for label, col, leaves, ys, gcy in rows:
            gcy += off
            gw = group_w(label)
            gx = sgn * 165 if side == 'R' else -165 - gw
            # ramura principală
            parts.append(f'<path class="mm-edge h-{col}" d="M{sgn*85},{cy} C{sgn*125},{cy} {sgn*125},{gcy} {sgn*165},{gcy}"/>')
            outer = sgn * (165 + gw)
            leafx = sgn * (165 + gw + 50)
            for lf, ly in zip(leaves, ys):
                ly += off
                text, flag = (lf, '') if isinstance(lf, str) else lf
                lw = tw(text) + 26
                lcy = ly + LEAF_H / 2
                parts.append(f'<path class="mm-edge thin h-{col}" d="M{outer},{gcy} C{outer + sgn*30},{gcy} {leafx - sgn*30},{lcy} {leafx},{lcy}"/>')
                rx = leafx if side == 'R' else leafx - lw
                cls = 'mm-leaf h-' + col + (' hidden-page' if flag == 'muted' else '')
                parts.append(f'<rect class="{cls}" x="{rx:.0f}" y="{ly:.0f}" width="{lw:.0f}" height="{LEAF_H}" rx="12"/>')
                parts.append(f'<text class="mm-lt{" muted" if flag == "muted" else ""}" x="{rx + 13:.0f}" y="{ly + 16.5:.1f}">{esc(text)}</text>')
                if side == 'L':
                    maxl = max(maxl, -(rx))
                else:
                    maxr = max(maxr, rx + lw)
            parts.append(f'<rect class="mm-group h-{col}" x="{gx:.0f}" y="{gcy - 18:.0f}" width="{gw:.0f}" height="36" rx="18"/>')
            parts.append(f'<text class="mm-gt" x="{gx + gw/2:.0f}" y="{gcy + 5:.0f}" text-anchor="middle">{esc(label)}</text>')
    # rădăcina
    parts.append(f'<rect class="mm-root" x="-85" y="{cy - 32:.0f}" width="170" height="64" rx="20"/>')
    parts.append(f'<text class="mm-rt" x="0" y="{cy - 3:.0f}" text-anchor="middle">{esc(root)}</text>')
    parts.append(f'<text class="mm-rs" x="0" y="{cy + 17:.0f}" text-anchor="middle">{esc(rootsub)}</text>')
    x0 = -(maxl + 12)
    W = maxl + maxr + 24
    return (f'<svg class="dg mm" viewBox="{x0:.0f} 0 {W:.0f} {H:.0f}" role="img" aria-label="{esc(aria)}" xmlns="http://www.w3.org/2000/svg">\n'
            + '\n'.join(parts) + '\n</svg>')

SITE_MAP = mindmap('Trattoria', 'davittoria.ro', [
    ('Meniu', 'brand', ['Catalog vinuri', 'Il Ritmo della Notte', 'Mai mult ▾', 'Telefon rezervări', 'Limba (7)', 'Rezervă o masă']),
    ('Mai mult', 'ochre', ['Evenimente private', 'Cursuri de pizza', 'Galerie', 'Hotel ANNA (extern)', 'Contact']),
    ('Subsol', 'plum', ['Termeni și condiții', 'Confidențialitate', 'Politica de cookies', 'Sesizări', 'Setări cookie-uri', 'Linkurile Grupului ANNA', 'Rețele sociale', 'Credit BizTech']),
], [
    ('Acasă', 'green', ['Coperta: clip sau slideshow', 'Bara de cazare', 'Bucătăria', 'Vinurile', 'Ce spun oaspeții', 'Agenda serilor', 'Evenimente private', 'Cursuri de pizza', 'Hotel ANNA', 'Galerie', 'Întrebări frecvente', 'Contact și harta']),
    ('Din pagini', 'blue', ['Fereastra ialoc', 'Meniul digital (filă nouă)', 'Formularul, cu subiect ales', 'Harta Google, la clic', 'Descarcă PDF (vinuri)', 'Fereastra mare a galeriei']),
    ('Limbi', 'neutral', ['/ (română)', '/en', '/it', '/fr', '/de', '/zh', '/sv']),
], 'Harta mentală a site-ului public: meniul, secțiunile paginii Acasă, subsolul, ce se deschide din pagini și limbile')

ADMIN_MAP = mindmap('Panoul', '/admin', [
    ('Conținut', 'green', ['Pagina Acasă (11 secțiuni)', 'Seri tematice', 'Galerie', 'Categorii de galerie', 'Bibliotecă media', 'Recenzii', 'Întrebări frecvente', 'Saloane', 'Tipuri de camere', 'Vinuri', 'Categorii de preparate', 'Linkuri grup', 'Pagini legale', 'Motive de sesizare']),
    ('Tablou de bord', 'blue', ['Conținut provizoriu rămas', 'Cereri noi', 'Seri apropiate', 'Traduceri', 'Lipsește din Setări']),
], [
    ('Cereri primite', 'ochre', ['Cazare', 'Eveniment privat', 'Curs de pizza pentru copii', 'Întrebare', 'Sesizare', 'Stare: Nouă · În lucru · Rezolvată']),
    ('Setări', 'brand', ['Setări restaurant: Identitate', 'Contact și program', 'Meniu de navigare', 'Integrări', 'Cereri și emailuri', 'Premii și distincții', 'Redirecționări']),
    ('Acces', 'plum', ['Utilizatori (Administrator, Editor)', 'Restaurante (tenanți)', 'Limba conținutului (7)', 'Tradu automat']),
], 'Harta mentală a panoului: grupurile din meniu, tabloul de bord, cererile, setările și accesul')

def product_map():
    """Harta produsului: cine folosește site-ul și cu ce servicii lucrează el."""
    p = []
    def box(x, y, w, h, t, s, cls='pm-box'):
        p.append(f'<rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="12"/>')
        p.append(f'<text class="pm-t" x="{x + w/2}" y="{y + 25}" text-anchor="middle">{esc(t)}</text>')
        if s:
            p.append(f'<text class="pm-s" x="{x + w/2}" y="{y + 43}" text-anchor="middle">{esc(s)}</text>')
    def chip(x, y, w, t):
        p.append(f'<rect class="pm-chip" x="{x}" y="{y}" width="{w}" height="24" rx="12"/>')
        p.append(f'<text class="pm-ct" x="{x + w/2}" y="{y + 16}" text-anchor="middle">{esc(t)}</text>')
    def edge(d, label=None, lx=0, ly=0, dashed=False, anchor='middle'):
        p.append(f'<path class="pm-edge{" dashed" if dashed else ""}" d="{d}" marker-end="url(#pm-arrow)"/>')
        if label:
            p.append(f'<text class="pm-l" x="{lx}" y="{ly}" text-anchor="{anchor}">{esc(label)}</text>')
    p.append('<defs><marker id="pm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="pm-head"/></marker></defs>')
    # oamenii
    box(12, 90, 160, 56, 'Oaspete', 'telefon sau desktop', 'pm-box person')
    box(12, 300, 160, 56, 'Oaspete care rezervă', 'masă sau cameră', 'pm-box person')
    box(12, 510, 160, 56, 'Echipa', 'Administrator, Editor', 'pm-box person')
    # cadrul Vercel
    p.append('<rect class="pm-frame" x="250" y="34" width="330" height="606" rx="18"/>')
    p.append('<text class="pm-ft" x="266" y="58">Vercel · Dublin (dub1) · Next.js 16</text>')
    p.append('<rect class="pm-box accent" x="270" y="70" width="290" height="300" rx="14"/>')
    p.append('<text class="pm-t big" x="415" y="98" text-anchor="middle">Site public</text>')
    p.append('<text class="pm-s" x="415" y="118" text-anchor="middle">randat pe server · 7 limbi · 11 pagini</text>')
    chips = ['Acasă', 'Serile', 'Evenimente private', 'Cursuri de pizza', 'Galerie', 'Lista de vinuri', 'Contact', 'Sesizări', 'Pagini legale', 'Cookies + GA']
    for i, c in enumerate(chips):
        chip(284 + (i % 2) * 134, 134 + (i // 2) * 34, 128, c)
    p.append('<text class="pm-s" x="415" y="352" text-anchor="middle">sitemap · Open Graph · date pentru Google · redirecționări</text>')
    p.append('<rect class="pm-box accent2" x="270" y="388" width="290" height="160" rx="14"/>')
    p.append('<text class="pm-t big" x="415" y="416" text-anchor="middle">Panoul /admin</text>')
    p.append('<text class="pm-s" x="415" y="436" text-anchor="middle">Payload 3 · multi-restaurant · în română</text>')
    for i, c in enumerate(['Conținut', 'Cereri primite', 'Setări', 'Utilizatori', 'Tradu automat', 'Alege și convertește']):
        chip(284 + (i % 2) * 134, 452 + (i // 2) * 30, 128, c)
    p.append('<rect class="pm-box" x="270" y="566" width="290" height="56" rx="12"/>')
    p.append('<text class="pm-t" x="415" y="590" text-anchor="middle">Vercel Cron · 02:23 UTC</text>')
    p.append('<text class="pm-s" x="415" y="608" text-anchor="middle">șterge cererile mai vechi de 12 luni</text>')
    # serviciile
    box(650, 60, 222, 60, 'Supabase', 'Postgres 17 + fișiere media · Irlanda')
    box(650, 150, 222, 60, 'Resend', 'emailurile formularelor · la lansare')
    box(650, 240, 222, 60, 'ialoc', 'rezervările de masă, în fereastră')
    box(650, 330, 222, 60, 'Claude Haiku 5.5', 'traducerile, la build și din panou')
    box(650, 420, 222, 60, 'Google', 'Analytics după „Accept” · harta la clic')
    box(650, 510, 222, 60, 'Meniul digital', 'serviciu extern, în filă nouă')
    box(650, 600, 222, 56, 'GitHub + Vercel build', 'codul; fiecare push publică site-ul')
    # săgeți
    edge('M172,118 L250,118', 'citește', 211, 108)
    edge('M172,328 L250,328', 'formulare, ialoc', 211, 318)
    edge('M172,538 L270,538', 'editează', 221, 528)
    edge('M580,90 L650,90', 'date, media', 615, 80)
    edge('M580,180 L650,180', 'trimite', 615, 170)
    edge('M560,270 L650,270', 'fereastră', 605, 260)
    edge('M560,360 L650,360', 'traduce', 605, 350, dashed=True)
    edge('M580,450 L650,450', 'doar cu acord', 615, 440, dashed=True)
    edge('M560,540 L650,540', 'link', 605, 530, dashed=True)
    edge('M580,628 L650,628', 'migrații, seed', 615, 618, dashed=True)
    return ('<svg class="dg pm" viewBox="0 0 884 666" role="img" aria-label="Harta produsului: oaspeții și echipa folosesc site-ul și panoul de pe Vercel, care lucrează cu Supabase, Resend, ialoc, Claude, Google, meniul digital și GitHub" xmlns="http://www.w3.org/2000/svg">\n'
            + '\n'.join(p) + '\n</svg>')

# ------------------------------------------------------------------ CSS
K9_CSS = open(os.path.join(HERE, 'k9.css'), encoding='utf-8').read()
FONTS_CSS = open(os.path.join(HERE, 'fonts.css'), encoding='utf-8').read() if INLINE else ''
EXTRA_CSS = """
/* Trattoria: bannerele BizTech și mici completări */
.bt-banner { margin: 34px 0 0; border: 1px solid var(--line); border-radius: var(--r-lg); overflow: hidden; background: #FFFFFF; break-inside: avoid; }
.bt-banner img { width: 100%; height: auto; display: block; }
.fw-grid { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 32px; align-items: start; }
.sq-banner { margin: 0; border: 1px solid var(--line); border-radius: var(--r-lg); overflow: hidden; background: #FFFFFF; }
.sq-banner img { width: 100%; height: auto; display: block; }
.shot.only-phone .shot-media { grid-template-columns: clamp(150px, 19%, 210px); }
.tbl-env td:first-child { font-family: var(--f-mono); font-size: 0.8rem; white-space: nowrap; }
.bt-strip .k9 img.round { border-radius: 50%; }
.topbar .brand img { border-radius: 50%; }
@media screen and (max-width: 720px) { .fw-grid { grid-template-columns: 1fr; } .sq-banner { max-width: 320px; } }
@media print {
  .bt-banner { margin-top: 12px; border-radius: 10px; }
  .fw-grid { grid-template-columns: minmax(0, 1fr) 56mm; gap: 8mm; }
  .sq-banner { border-radius: 10px; }
  .doc-foot { display: none !important; }
  .tbl-env table { font-size: 8pt; }
  .toc { grid-template-columns: 1fr 1fr; }
  /* paginile late: titlul și harta pe aceeași pagină */
  .wide-page .sec-head { margin-bottom: 6px; gap: 6px; }
  .wide-page .sec-head p { max-width: none; font-size: 9pt; line-height: 1.35; }
  .wide-page .voice { font-size: 10pt; }
  .fig-box svg { max-height: 108mm; }
  /* cuvântul înainte pe o pagină */
  .foreword { gap: 8px; }
  .foreword p:not(.eyebrow) { font-size: 9.5pt; line-height: 1.45; }
  .fw-sign { padding-top: 8px; margin-top: 0; }
  /* coperta pe o pagină */
  .bt-page .wrap { gap: 6px; }
  .bt-hero { gap: 10mm; }
  .bt-hero .lead { font-size: 9pt; margin-top: 6px; }
  .presenter img { width: 24mm; height: 24mm; }
  .presenter strong { font-size: 11pt; }
  .presenter span:not(.eyebrow) { font-size: 8pt; }
  .bt-card p { font-size: 8.5pt; line-height: 1.35; }
  .portrait { width: 17mm; height: 17mm; }
  .person { padding: 6px 10px; gap: 4px 10px; }
  .person ul { font-size: 8pt; gap: 1px; }
  .person h3 { font-size: 11pt; }
  .svc p { font-size: 8pt; }
  .svc { padding: 7px 9px; gap: 2px; }
  .services { gap: 8px; }
  .team-line { font-size: 10pt; }
  .bt-strip { padding-bottom: 6px; }
  .bt-strip .k9 img { width: 36px; height: 36px; }
  #inceput .bt-hero h1 { font-size: 20pt; }
  .bt-card p { font-size: 8pt; }
  .bt-hero .lead { font-size: 8.5pt; }
  .people { gap: 8px; }
  .person ul li { line-height: 1.3; }
  .svc p { font-size: 7.5pt; line-height: 1.3; }
  .svc h3 { font-size: 9pt; }
  /* pagina de închidere BizTech, pe o pagină */
  #biztech .bt-hero .lead { font-size: 8.5pt; }
  #biztech .bt-title { font-size: 20pt; }
  .case { padding: 8px 12px; gap: 8px; }
  .case-figs b { font-size: 13pt; }
  .quote blockquote { font-size: 9pt; }
  .steps li { padding: 5px 7px; }
  .howwork { gap: 4px; }
  .contact-grid div { padding: 4px 8px; }
  .contact-grid dd { font-size: 8pt; }
  .bt-close { padding: 8px 12px; gap: 4px; }
  .bt-close p { font-size: 8.5pt; }
  .proof div { padding: 4px 8px; }
  .proof b { font-size: 13pt; }
}
"""

# ------------------------------------------------------------------ conținutul
def pages_table():
    rows = [
        ('Acasă', '/', 'logo, meniu', 'Coperta cu clip sau slideshow, bara de cazare, Bucătăria, Vinurile, recenziile, agenda serilor, evenimentele private, cursul de pizza, Hotel ANNA, galeria, întrebările, contactul', n('01-acasa', '13-footer')),
        ('Il Ritmo della Notte', '/petreceri', 'meniu, agenda de pe Acasă', 'Serile viitoare, „Rezervă masă” pe data serii, arhiva „Cum a fost”', NUM['18-petreceri']),
        ('Evenimente private', '/evenimente-private', 'Mai mult, secțiunea de pe Acasă', 'Saloanele cu capacitate și dotări, tipurile de evenimente, cererea de ofertă', NUM['19-evenimente-private']),
        ('Cursuri de pizza', '/cursuri-pizza-copii', 'Mai mult, secțiunea de pe Acasă', 'Textul complet, clipul, galeria, detaliile și înscrierea', NUM['20-cursuri-pizza']),
        ('Galerie', '/galerie', 'Mai mult, secțiunea de pe Acasă', 'Toate fotografiile și clipurile, pe categorii, cu fereastra mare', n('21-galerie', '22-galerie-fereastra')),
        ('Lista de vinuri', '/catalog-vinuri', 'meniu („Catalog vinuri”)', 'Căutare, filtre pe tip, insigna Wine Spectator, „Descarcă PDF”', n('23-catalog-vinuri', '25-vinuri-filtru')),
        ('Contact', '/contact', 'Mai mult, subsol, butoanele de pe Acasă', 'Formularul unic cu subiect (cazare, eveniment privat, curs de pizza, întrebare), telefoane, program, harta la clic', n('26-contact', '28-contact-erori') + ', ' + NUM['35-harta']),
        ('Sesizări', '/formular-de-reclamatie', 'subsol, linkul din Contact', 'Formularul de reclamații, cu motiv, data vizitei și ospătar', NUM['29-sesizari']),
        ('Termeni și condiții', '/termeni', 'subsol', 'Pagină legală, editabilă din Pagini legale', NUM['30-termeni']),
        ('Confidențialitate', '/confidentialitate', 'subsol', 'Politica de confidențialitate: operatorul, datele din formulare, 12 luni de păstrare', '—'),
        ('Politica de cookies', '/cookies', 'subsol, bannerul', 'Cookie-urile folosite și cum se retrage acordul', NUM['31-cookies']),
        ('Hotel ANNA', 'site extern', 'Mai mult, secțiunea Hotel', 'Deschide site-ul hotelului, în filă nouă', '—'),
        ('Meniul digital', 'adresă externă', 'butonul „Meniu Digital”, bara de jos pe telefon, Bucătăria', 'Meniul cu prețuri, în filă nouă; adresa se schimbă din Setări → Integrări', '—'),
    ]
    tr = ''.join(f'<tr><td>{esc(a)}</td><td><code>{esc(b)}</code></td><td>{esc(c)}</td><td>{esc(d)}</td><td>{e}</td></tr>' for a, b, c, d, e in rows)
    return f'<div class="tbl tbl-pages"><table><thead><tr><th scope="col">Pagina</th><th scope="col">Adresa</th><th scope="col">Unde o găsiți</th><th scope="col">Ce face</th><th scope="col">Capturi</th></tr></thead><tbody>{tr}</tbody></table></div>'

def flows_chips():
    def chips(items):
        out = []
        for it in items:
            if isinstance(it, tuple):
                out.append(f'<li><span class="{it[1]}">{esc(it[0])}</span></li>')
            else:
                out.append(f'<li><span>{esc(it)}</span></li>')
        return ''.join(out)
    data = [
        ('Masă', ['Acasă sau orice pagină', '„Rezervă o masă”', ('fereastra ialoc', 'ext'), 'persoane, data, zona, ora', ('confirmarea vine de la ialoc', 'mail')]),
        ('Seară tematică', ['Agenda de pe Acasă', 'Il Ritmo della Notte', '„Rezervă masă” pe data serii', ('ialoc, cu data aleasă', 'ext')]),
        ('Cazare', ['Bara de cazare', 'date, camere, oaspeți', 'Contact, subiect „Cazare”, precompletat', ('email la recepție', 'mail'), ('Cereri primite', 'adm'), 'recepția confirmă în max 30 min']),
        ('Eveniment privat', ['Evenimente private', 'salonul', '„Cere ofertă”', 'Contact, subiect „Eveniment privat”', ('email la echipa de evenimente', 'mail'), ('Cereri primite', 'adm')]),
        ('Curs de pizza', ['Cursuri de pizza', '„Înscrie copilul”', 'Contact, subiect „Curs de pizza”', ('email', 'mail'), ('Cereri primite (și Editorul)', 'adm')]),
        ('Întrebare', ['Contact', 'subiect „Întrebare”', ('email', 'mail'), ('Cereri primite', 'adm')]),
        ('Sesizare', ['Subsol sau Contact', 'Sesizări', 'motiv, data vizitei, mesaj', ('email', 'mail'), ('Cereri primite (doar Administratorul)', 'adm')]),
        ('Vinuri', ['Catalog vinuri', 'căutare și filtre', '„Descarcă PDF”']),
        ('Limbă', ['Selectorul RO', '/en, /it, /fr, /de, /zh, /sv', 'aceeași adresă, altă limbă']),
        ('Cookies', ['Bannerul', '„Accept” sau „Refuz”', ('Google Analytics, doar după Accept și doar pe domeniu', 'ext'), '„Setări cookie-uri” în subsol']),
        ('Conținut nou', [('Panou → Conținut', 'adm'), 'salvare', 'apare la următoarea încărcare a paginii', ('„Tradu automat” pentru cele 6 limbi', 'adm')]),
    ]
    return '<div class="flows">' + ''.join(f'<div class="flow"><b>{esc(b)}</b><ol>{chips(items)}</ol></div>' for b, items in data) + '</div>'

def features():
    cards = [
        ('', 'Acasă și coperta', ['Coperta cu <b>clip</b> (desktop 16:9, telefon 9:16, cel mult 30 s) sau <b>slideshow</b> cu durata cadrului editabilă (implicit 3 s); poster înaintea clipului; buton de pauză.', '11 secțiuni, fiecare cu „Pornită”, „Provizoriu” și „Ordine”; o secțiune oprită dispare și din meniu.', 'Pe telefon, bara fixă de jos cu „Rezervă o masă” și „Meniu”.', 'Respectă „Reducere mișcare”: clipul stă, cadrele se schimbă fără animație.']),
        ('k-green', 'Rezervări și cazare', ['Fereastra <b>ialoc</b> pe orice pagină și pe data serii, din agenda serilor.', 'Bara de cazare cu calendar, camere, adulți și copii (limite din panou) → cerere precompletată către recepție.', 'Textul „recepția confirmă în max 30 min” editabil.']),
        ('k-ochre', 'Seri, evenimente, cursuri', ['Seri tematice cu afiș 4:5, dată și oră, tip, invitat, intrare; ies singure din agendă; arhiva „Cum a fost”.', 'Saloane cu capacități și dotări; tipuri de evenimente; salonul ales ajunge în cerere.', 'Cursul de pizza cu text complet, clip 9:16 cu sunet, galerie, detalii și înscriere.']),
        ('k-blue', 'Galerie și vinuri', ['Galeria pe categorii, cel mult 8 pe Acasă, fereastră mare cu legende; clipurile cu sunetul lor.', 'Lista de vinuri cu căutare, filtre pe tip, preț pe sticlă și la pahar, „Recomandat”, insigna Wine Spectator, PDF de descărcat.', 'Categoriile de preparate într-un slider, cu link către meniul digital.']),
        ('k-plum', 'Formulare și cereri', ['Un formular cu 5 subiecte (cazare, eveniment privat, curs de pizza, întrebare; sesizările pe pagina lor), câmpuri care se schimbă după subiect, validare pe loc, acord GDPR cu oră.', 'Fiecare trimitere se salvează în Cereri primite, cu stare (Nouă, În lucru, Rezolvată); datele trimise nu se modifică.', 'Emailuri către destinatarii fiecărui subiect (cel mult 5 + copie), cu subiectul „[Subiect] de pe site-ul [Restaurant]”; se conectează la lansare, prin Resend.', 'Ștergerea automată a cererilor mai vechi de 12 luni, zilnic.']),
        ('k-neutral', 'Limbi, Google, viteză', ['7 limbi, adrese românești, selector în meniu; traduceri automate cu Claude, corectură în panou, stări „Netradus / Tradus automat / Verificat de om / De reverificat”.', 'Date pentru Google: Restaurant (adresă, program, meniu, rezervări, premiul), WebSite, Event pentru seri; sitemap cu 77 de adrese și <code>hreflang</code>; Open Graph pe fiecare pagină.', '16 adrese vechi redirecționate (301) după mutarea domeniului.', 'Lighthouse mobil: Acasă 89, /en 89, /zh 80; accesibilitate 100; 0 depășiri la 360–1920 px.']),
        ('', 'Cookies și statistici', ['Banner cu „Accept” și „Refuz” de aceeași greutate; nimic către Google înainte de alegere.', 'Google Analytics (eticheta site-ului vechi) doar după „Accept”, doar pe davittoria.ro; Consent Mode cu reclamele refuzate; cookie-urile <code>_ga</code> țin 13 luni.', 'Alegerea stă 12 luni; „Setări cookie-uri” în subsol; retragerea șterge cookie-urile.', 'Harta Google se încarcă doar la clic.']),
        ('k-green', 'Panoul: conținut', ['Totul ce vede oaspetele se editează din panou: texte, fotografii, clipuri, seri, recenzii, întrebări, saloane, camere, vinuri, premii, linkuri, pagini legale, meniul de navigare, telefoane, program, destinatari.', 'Biblioteca media cu „Alege și convertește” (HEIC, clipuri până la 120 s, PDF), text alternativ obligatoriu, acordul părinților pentru copii, miniaturi de 160 × 120 px.', '„Provizoriu” = eticheta „Exemplu · de înlocuit” pe site; contorul din Tabloul de bord.', 'Butonul „Tradu automat” pe fiecare document; limba conținutului din dreapta sus.']),
        ('k-ochre', 'Panoul: administrare', ['Roluri: Administrator (tot) și Editor (grupul Conținut + cursuri de pizza și întrebări din cereri).', 'Multi-restaurant (ADR-002): același panou servește alte restaurante ale grupului, ca tenanți separați, cu propriile setări, culori și fonturi.', 'Setări restaurant pe file: Identitate, Contact și program, Meniu de navigare, Integrări, Cereri și emailuri.', 'Redirecționări, Premii și distincții, Utilizatori, Restaurante.']),
    ]
    out = []
    for k, t, items in cards:
        li = ''.join(f'<li>{i}</li>' for i in items)
        out.append(f'<div class="feat {k}"><h3>{esc(t)}</h3><ul>{li}</ul></div>')
    return '<div class="feat-grid">' + ''.join(out) + '</div>'

def roles_table():
    rows = [
        ('Pagina Acasă, Seri tematice, Galerie și categorii, Bibliotecă media, Recenzii, Întrebări frecvente, Saloane, Tipuri de camere, Vinuri, Categorii de preparate, Linkuri grup, Pagini legale, Motive de sesizare', True, True),
        ('„Tradu automat” și corectura traducerilor, în toate limbile', True, True),
        ('Cereri primite: curs de pizza și întrebări (doar „Stare”)', True, True),
        ('Cereri primite: cazare, evenimente private, sesizări', True, False),
        ('Premii și distincții (insigna Wine Spectator)', True, False),
        ('Setări restaurant: identitate, culori, fonturi, telefoane, program, meniu, integrări, destinatari de email, păstrarea cererilor', True, False),
        ('Redirecționări', True, False),
        ('Utilizatori și Restaurante (conturi, roluri, atribuirea restaurantelor)', True, False),
        ('Variabilele din Vercel, domeniul, cheile serviciilor (în afara panoului)', 'BizTech', False),
    ]
    def cell(v):
        if v is True:
            return '<td class="yes">✓ da</td>'
        if v is False:
            return '<td class="no">– nu</td>'
        return f'<td class="yes">{esc(v)}</td>'
    tr = ''.join(f'<tr><td>{esc(a)}</td>{cell(b)}{cell(c)}</tr>' for a, b, c in rows)
    return f'<div class="tbl"><table><thead><tr><th scope="col">Acțiunea</th><th scope="col" class="yes">Administrator</th><th scope="col" class="yes">Editor</th></tr></thead><tbody>{tr}</tbody></table></div>'

def emails_table():
    rows = [
        ('Cerere de cazare din bara de cazare sau din Contact', 'destinatarii subiectului „Cazare” (recepția), cu copie', '„Cazare de pe site-ul Trattoria da Vittoria”: sosire, plecare, adulți, copii, tipul de cameră, mesajul, datele de contact'),
        ('Cerere de eveniment privat', 'destinatarii subiectului „Eveniment privat”, cu copie', 'tipul de eveniment, data, numărul de invitați, salonul, mesajul'),
        ('Înscriere la cursul de pizza', 'destinatarii subiectului „Curs de pizza pentru copii”', 'numărul de copii, vârstele, data dorită'),
        ('Întrebare', 'destinatarii subiectului „Întrebare”', 'mesajul și datele de contact'),
        ('Sesizare', 'destinatarii subiectului „Sesizare”', 'data vizitei, motivul, ospătarul, mesajul; fotografia bonului ca atașament (planificat, G6-3)'),
        ('Oaspetele', 'pe ecran', 'confirmarea și termenul de răspuns afișat, setat pe subiect'),
    ]
    tr = ''.join(f'<tr><td>{esc(a)}</td><td>{esc(b)}</td><td>{esc(c)}</td></tr>' for a, b, c in rows)
    return f'<div class="tbl"><table><thead><tr><th scope="col">Când</th><th scope="col">Cine primește</th><th scope="col">Ce conține</th></tr></thead><tbody>{tr}</tbody></table></div>'

def howto():
    H = []
    def how(hid, title, who, steps, tip=None):
        li = ''.join(f'<li>{s}</li>' for s in steps)
        t = f'<p class="tip">{tip}</p>' if tip else ''
        H.append(f'<article class="how" id="{hid}"><h3>{esc(title)}</h3><p class="who">{esc(who)}</p><ol>{li}</ol>{t}</article>')
    K = lambda s: f'<span class="kbd">{esc(s)}</span>'
    how('cum-intrati', 'Intrați în panou', 'Toată echipa', [
        f'Deschideți <code>{esc(SITE)}/admin</code> (după lansare: <code>davittoria.ro/admin</code>).',
        'Introduceți emailul și parola primite de la Alin. Fiecare om are contul lui; nu împărțiți parola.',
        'În dreapta sus vedeți <b>Limba conținutului</b>: lăsați „Română” când scrieți conținut nou.',
        f'Când terminați, apăsați pe avatar, apoi {K("Deconectare")}.',
    ], 'Dacă panoul se poartă ciudat după o actualizare a site-ului, închideți fila și deschideți-o din nou (sau Ctrl+Shift+R).')
    how('cum-fotografie', 'Încărcați o fotografie sau un clip', 'Toată echipa', [
        f'<b>Bibliotecă media</b> → {K("Creați unul nou")} → alegeți „Ce încarci?” (fotografie, clip sau document PDF).',
        f'{K("Alege și convertește")}: panoul micșorează și convertește fișierul în browser, înainte de încărcare. Merge și cu HEIC de pe iPhone.',
        'Scrieți <b>textul alternativ</b>: ce se vede, într-o propoziție („Masă pentru doi, cu pizza și vin roșu, pe terasă”). Este obligatoriu.',
        'Clipuri: cel mult 120 s; pe copertă intră doar clipuri de cel mult 30 s. Verificați „Codec și sunet”: trebuie să scrie „cu sunet” dacă originalul are sunet.',
        'Copii în fotografie: bifați „Acordul părinților confirmat” doar dacă aveți acordul. Apoi ' + K('Salvează') + '.',
    ], 'Originalul rămâne la dumneavoastră: pe server se păstrează doar variantele optimizate. Păstrați-l într-un dosar al restaurantului.')
    how('cum-seara', 'Publicați o seară tematică', 'Toată echipa', [
        f'<b>Seri tematice</b> → {K("Creați unul nou")}.',
        'Numele serii (cel mult 50 de caractere), data și ora de început (ora României, în viitor), ora de sfârșit (opțională), tipul și numele invitatului.',
        'Afișul (4:5, minimum 1080 × 1350 px): este și imaginea care apare când cineva distribuie pagina. Descrierea scurtă și „Intrare” (de exemplu „Intrare liberă”).',
        'Lăsați bifat „Rezervare cu data serii”: „Rezervă masă” deschide ialoc direct pe data serii.',
        f'{K("Salvează")}, apoi {K("Tradu automat")} pentru cele 6 limbi. Seara apare în agenda de pe Acasă și pe „Il Ritmo della Notte”.',
    ], 'După eveniment, adăugați fotografiile la „Fotografii după eveniment”: intră în arhiva „Cum a fost”. Seara trecută iese singură din agendă.')
    how('cum-galerie', 'Adăugați în galerie sau pe Acasă', 'Toată echipa', [
        f'<b>Galerie</b> → {K("Creați unul nou")}: alegeți fișierul din Biblioteca media (sau încărcați-l pe loc), categoria și, opțional, o legendă.',
        'Bifați <b>„Pe Acasă”</b> ca elementul să apară în secțiunea Galerie de pe prima pagină (cel mult 8).',
        'Ordinea se schimbă trăgând rândurile în listă. Categoriile noi se fac din <b>Categorii de galerie</b>.',
    ], 'După sărbători, galeria de pe Acasă revine la cea de dinainte, la cererea dumneavoastră (D-77).')
    how('cum-recenzie', 'O recenzie sau o întrebare frecventă', 'Toată echipa', [
        f'<b>Recenzii</b> → {K("Creați unul nou")}: numele cu prenume și inițială („Mihai M.”), textul exact de pe Google, nota, limba recenziei, „Pe Acasă”.',
        f'<b>Întrebări frecvente</b> → {K("Creați unul nou")}: întrebarea, răspunsul și grupul (Acasă, Evenimente private, Cursuri de pizza, Cazare, Restaurant).',
        'Pe Acasă apar cel mult 5 întrebări. Scrieți doar răspunsuri confirmate de manager. Fără recenzii inventate.',
    ])
    how('cum-acasa', 'Schimbați un text de pe Acasă', 'Toată echipa', [
        '<b>Pagina Acasă</b> → fila secțiunii (Hero, Bucătăria, Vinuri, Hotel …).',
        'Schimbați titlul, textul introductiv, etichetele butoanelor sau fotografiile. Fiecare câmp arată câte caractere mai aveți.',
        '„Pornită” oprită ascunde secțiunea de pe site și din meniu; „Ordine” o mută. Când înlocuiți un text-exemplu cu cel real, debifați „Provizoriu”.',
        f'{K("Salvează")}. Schimbarea apare pe site la următoarea încărcare a paginii.',
    ], 'Hero: „Mod media” alege între clip și slideshow; „Durata unui cadru” este în secunde. Clipurile lungi merg pe paginile proprii, nu pe copertă.')
    how('cum-traducere', 'Traduceți și corectați o limbă', 'Toată echipa', [
        f'Scrieți întâi <b>în română</b> și apăsați {K("Salvează")}.',
        f'Apăsați {K("Tradu automat")} (în dreapta): cele 6 limbi primesc textul, cu starea „Tradus automat”.',
        'Ca să corectați o limbă: alegeți-o din <b>Limba conținutului</b> (dreapta sus), corectați, salvați. Limba devine „Verificat de om” și nu mai este suprascrisă.',
        'Când schimbați româna, limbile „Tradus automat” se retraduc singure; cele verificate primesc „De reverificat”.',
    ], 'Numele proprii, telefoanele și numele italienești ale preparatelor sunt marcate „Nu se traduce” și rămân la fel peste tot.')
    how('cum-cerere', 'Răspundeți la o cerere', 'Administrator; Editor pentru cursuri și întrebări', [
        '<b>Cereri primite</b>: cererile noi sunt primele; Tabloul de bord arată câte sunt.',
        'Deschideți cererea: subiectul, datele de contact, mesajul și detaliile (date, camere, salon, copii, motiv).',
        f'Sunați sau scrieți omului, apoi schimbați <b>„Stare”</b> în „În lucru” sau „Rezolvată” și {K("Salvează")}. Datele trimise nu se pot modifica.',
        'Emailul către destinatari pleacă singur la fiecare cerere (după conectarea Resend, la lansare); câmpul „Email trimis” arată dacă a plecat.',
    ], 'Cererile mai vechi de 12 luni se șterg singure, în fiecare noapte. Termenul se schimbă din Setări restaurant → Cereri și emailuri.')
    how('cum-setari', 'Schimbați telefoane, program, destinatari', 'Administrator', [
        '<b>Setări restaurant</b> → <b>Contact și program</b>: adresa, coordonatele, telefoanele pe subiecte (rezervări, evenimente, curs de pizza), programul pe zile și nota la program, rețelele sociale, linkul de recenzie Google.',
        '<b>Cereri și emailuri</b>: pe fiecare subiect, „Subiect activ” (oprit = butonul dispare din formular), destinatarii (cel mult 5), copia și termenul de răspuns afișat.',
        '<b>Integrări</b>: ID-ul ialoc, ID-ul statisticilor Google, adresa meniului digital, bucătăria și nivelul de preț pentru Google.',
        f'<b>Meniu de navigare</b>: elementele din meniu și ordinea lor. {K("Salvează")}.',
    ], 'Un număr de telefon sau o adresă de email nu se scrie niciodată în cod: totul vine de aici.')
    how('cum-vin', 'Adăugați un vin și lista în PDF', 'Toată echipa (PDF-ul: Administrator)', [
        f'<b>Vinuri</b> → {K("Creați unul nou")}: numele, tipul, producătorul, regiunea, anul, prețul pe sticlă și la pahar, „Recomandat”, „Activ”.',
        'Lista în PDF: <b>Bibliotecă media</b> → „Ce încarci?” → „Document PDF” → „Alege și convertește” → Salvează.',
        f'Apoi <b>Pagina Acasă</b> → <b>Vinuri</b> → „Lista de vinuri în PDF” → alegeți fișierul → {K("Salvează")}. Butonul „Descarcă PDF” apare pe /catalog-vinuri, în toate limbile.',
    ])
    how('cum-premiu', 'Premiul, redirecționările, un cont nou', 'Administrator', [
        '<b>Premii și distincții</b> → premiul Wine Spectator: numele, nivelul, anul, insigna oficială (orice imagine, cu transparență), legătura către sursă și „În datele pentru Google”. Nivelul și anul goale = premiul nu intră în datele pentru Google.',
        f'<b>Redirecționări</b> → {K("Creați unul nou")}: „De la” (adresa veche, fără domeniu) și „Către” (pagina nouă). Au efect după mutarea domeniului.',
        f'<b>Utilizatori</b> → {K("Creați unul nou")}: numele, emailul, o parolă temporară, rolul (Administrator sau Editor) și restaurantele la care are acces. Trimiteți-i omului parola pe alt canal decât emailul contului.',
    ], 'Nu ștergeți elemente ca să le „ascundeți”: debifați „Activ” sau „Pornită”. Ștergerea nu se poate anula.')
    return '<div class="howto">' + ''.join(H) + '</div>'

def faq():
    qa = [
        ('De ce nu apare pe site ce am salvat?', ['Reîncărcați pagina site-ului: schimbările apar la următoarea încărcare. Dacă după un minut tot nu apar, verificați „Activ” sau „Pornită” pe element și scrieți-i lui Alin.']),
        ('Ce înseamnă „Provizoriu” și eticheta „Exemplu · de înlocuit”?', ['Un element bifat „Provizoriu” apare pe site cu eticheta vizibilă „Exemplu · de înlocuit”: este conținut de pornire, scris ca să se vadă cum arată pagina. Când puneți textul și fotografia reale, debifați „Provizoriu”. Tabloul de bord numără ce a mai rămas; înainte de lansare contorul trebuie să fie 0.']),
        ('Cum ascund o secțiune de pe Acasă?', ['Pagina Acasă → fila secțiunii → debifați „Pornită”. Secțiunea dispare de pe Acasă și din meniu; conținutul rămâne în panou și o puteți porni oricând.']),
        ('De ce nu merge „Tradu automat” pe copia locală din capturi?', ['Pe copia locală folosită pentru capturi, cheia de traducere nu este setată, de aceea butonul este gri. Pe producție butonul este activ și traduce cele 6 limbi în câteva secunde.']),
        ('Rezervările de masă ajung în panou?', ['Nu. Rezervările de masă se fac în fereastra ialoc și ajung în contul ialoc al restaurantului, ca până acum. În panou ajung doar cererile din formulare: cazare, evenimente private, cursuri de pizza, întrebări, sesizări.']),
        ('Cine primește emailul când cineva trimite o cerere?', ['Destinatarii setați pe subiect în Setări restaurant → Cereri și emailuri (cel mult 5, plus copie). Subiectul emailului se compune singur: „[Subiect] de pe site-ul [Nume restaurant]”. Emailurile se conectează la lansare, prin Resend; până atunci cererile se salvează în panou, iar câmpul „Email trimis” rămâne nebifat.']),
        ('Ce se întâmplă cu datele oaspeților?', ['Se păstrează în Cereri primite, cu acordul și ora acordului, și se șterg automat după 12 luni (termen ales cu juristul). Datele trimise nu se pot modifica, doar starea cererii. Baza de date stă la Supabase, în Irlanda; site-ul rulează la Vercel, în Dublin.']),
        ('Ce vede un Editor și ce nu?', ['Editorul lucrează în grupul Conținut (Pagina Acasă, seri, galerie, media, recenzii, întrebări, saloane, vinuri, linkuri, pagini legale) și vede, din cereri, doar cursurile de pizza și întrebările, unde schimbă doar „Stare”. Setările, premiile, redirecționările, utilizatorii și cererile de cazare, evenimente și sesizări le vede doar Administratorul.']),
        ('Pot încărca fotografii direct de pe iPhone?', ['Da. „Alege și convertește” citește și fișierele HEIC și le convertește în browser, înainte de încărcare. Clipurile se convertesc la fel, cu sunetul păstrat (cel mult 120 s).']),
        ('De ce sunt adresele în română și în engleză?', ['Ca linkurile să nu se rupă niciodată: /en/galerie este galeria în engleză, /de/petreceri serile în germană. Google primește, pentru fiecare pagină, lista variantelor în cele 7 limbi (hreflang), deci arată varianta potrivită fiecărui vizitator.']),
        ('Când pornesc statisticile Google?', ['Pe domeniul davittoria.ro, după lansare, și doar pentru vizitatorii care apasă „Accept” pe bannerul de cookies. Pe adresa temporară bannerul apare, dar statisticile nu se încarcă, ca vizitele de probă să nu intre în rapoarte.']),
        ('Cum adaug al doilea restaurant al grupului?', ['Panoul este făcut pentru mai multe restaurante (ADR-002): fiecare este un „Restaurant” separat, cu setările, culorile, fonturile, conținutul și utilizatorii lui. Al doilea restaurant este Etapa 2 a planului; se adaugă din Restaurante, apoi se completează setările și conținutul de pornire.']),
        ('Ce fac dacă panoul arată o eroare?', ['Faceți o captură de ecran și trimiteți-o lui Alin, cu ce încercați să faceți. Dacă încărcarea unui fișier este refuzată, citiți mesajul: de obicei fișierul e prea mare (peste 50 MB după conversie) sau clipul e prea lung.']),
    ]
    out = []
    for q, ps in qa:
        out.append(f'<details open><summary>{esc(q)}</summary><div>' + ''.join(f'<p>{p}</p>' for p in ps) + '</div></details>')
    return '<div class="faq">' + ''.join(out) + '</div>'

def recs():
    cards = [
        ('Conținutul, înainte de domeniu', ['<b>0 elemente provizorii</b> în Tabloul de bord: categoriile din Bucătărie, saloanele, camerele, serile-exemplu, paginile legale.', 'Textul juristului pentru Termeni, Confidențialitate și Cookies: parantezele drepte (operatorul de date, adresa pentru datele personale) se completează din Pagini legale.', 'Verificarea englezei; celelalte limbi se corectează pe măsură ce le citiți.', 'Fotografiile reale pentru categoriile din Bucătărie, saloane și camere; clipul cursului cu sunet; PDF-ul listei de vinuri; insigna oficială Wine Spectator, cu nivelul și anul corecte.']),
        ('Fotografii și clipuri bune', ['Fotografii orizontale pentru copertă și carduri, verticale (4:5) pentru afișele serilor; lumină naturală, fără filtre puternice.', 'Clipuri scurte, fără sunet pe copertă (cel mult 30 s), cu sunet pe paginile proprii (cel mult 120 s).', 'Textul alternativ scris pentru fiecare imagine: ajută la accesibilitate și la Google.', 'Nu încărcați fotografii cu copii fără acordul părinților.']),
        ('Conturi și siguranță', ['Un cont pe om, cu rolul potrivit; parole lungi, nefolosite în altă parte; conturile oamenilor plecați se dezactivează.', 'Cheile serviciilor (Vercel, Supabase, Resend, ialoc, Google) nu se scriu în panou, în cod sau în emailuri; le ține Alin, în Vercel.', 'Recenzii doar reale, premii doar cu sursă; nimic inventat pe site.']),
        ('După lansare', ['Prima săptămână: erorile din Vercel verificate zilnic; un email real primit pe fiecare subiect.', 'Google Search Console cu domeniul și sitemap-ul; Google Business Profile cu adresa site-ului.', 'Reveniți periodic în Tabloul de bord: cereri noi, seri apropiate, traduceri de reverificat.', 'Etapa următoare (R2): efectele sezoniere, sunetul de fundal, comutatorul de temă, al doilea restaurant în panou.']),
    ]
    out = ''.join(f'<div class="rec"><h3>{esc(t)}</h3><ul>' + ''.join(f'<li>{i}</li>' for i in items) + '</ul></div>' for t, items in cards)
    checklist = [
        ('Domeniul <code>davittoria.ro</code> și <code>www</code> adăugate în proiectul Vercel; DNS mutat de pe vechiul hosting; <code>www</code> → <code>davittoria.ro</code>', 'Alin + BizTech'),
        ('Panou → Restaurante → Trattoria → „Adrese pe care se servește site-ul”: <code>davittoria.ro</code>, <code>www.davittoria.ro</code>', 'BizTech'),
        ('Resend: domeniul de trimitere verificat în DNS; <code>RESEND_API_KEY</code> și <code>EMAIL_FROM</code> în Vercel; un email real primit pe fiecare subiect', 'Alin + BizTech'),
        ('<code>ALLOW_INDEXING=true</code> în Vercel (Production), apoi republicare: fără <code>noindex</code> pe domeniu, <code>robots.txt</code> cu <code>Sitemap</code>; adresa <code>*.vercel.app</code> rămâne neindexată', 'Alin + BizTech'),
        ('Redirecționările de pe cele 16 adrese vechi, probate pe domeniu', 'BizTech'),
        ('ialoc pe domeniul final: fereastra și rezervarea cu data serii; domeniul permis în configurarea widgetului, dacă ialoc o cere', 'BizTech + Alin'),
        ('Lighthouse mobil pe domeniu: <code>/</code>, <code>/en</code>, <code>/zh</code> (ținte ≥ 85 / ≥ 95)', 'BizTech'),
        ('Toate formularele probate cap-coadă, cu emailul primit', 'BizTech + Alin'),
        ('Google: Rich Results Test pe Acasă (Restaurant) și pe serile (Event); Search Console cu sitemap-ul; Google Business Profile cu adresa site-ului', 'Alin + BizTech'),
        ('Statisticile: 0 cereri către Google înainte de „Accept”, apoi pagina vizualizată în Google Analytics → În timp real; numele cookie-ului <code>_ga_…</code> trecut în politica de cookies', 'BizTech + Alin'),
        ('Curățenia importului de fotografii: tokenul de import șters din Vercel, folderul Drive pe „Restricted”', 'Alin + BizTech'),
        ('Vechiul hosting oprit abia după ce DNS-ul s-a propagat și redirecționările merg', 'Alin'),
    ]
    cl = ''.join(f'<li><span>{t}</span><span class="owner">{esc(o)}</span></li>' for t, o in checklist)
    return f'<div class="recs">{out}</div><div class="sub"><h3>Ziua lansării, pas cu pas</h3><p class="measure">Lista din <code>docs/2026_11_25_Trattoria_Checklist_Lansare.md</code>, secțiunile B și C. Se bifează în ordine; <code>CRON_SECRET</code> este deja pus (25.11.2026).</p><ol class="checklist">{cl}</ol></div>'

def tech():
    stack = [
        ('Next.js', '16.4.6', 'Site-ul public și panoul, randate pe server; rutele pe limbi; rescrierea adreselor românești'),
        ('Payload CMS', '3.94.1', 'Panoul de administrare, colecțiile, rolurile, multi-restaurant, interfața în română'),
        ('React', '19.2.9', 'Componentele interfeței'),
        ('PostgreSQL (Supabase)', '17.12', 'Baza de date: conținut, setări, cereri; migrații la fiecare publicare'),
        ('Supabase Storage', 'bucket „media”', 'Fotografiile, clipurile și PDF-urile, în variantele optimizate'),
        ('Node.js / pnpm', '22.23.5 / 10.28', 'Mediul de rulare și gestionarul de pachete'),
        ('sharp', '0.35.4', 'Variantele de imagine pe server'),
        ('heic-to / mediabunny', '1.6.7 / 1.66.3', '„Alege și convertește”: HEIC și clipuri, în browser, doar în panou'),
        ('Playwright / Vitest', '1.63.0 / —', 'Teste: 166 de verificări automate, probe de navigare și capturi'),
    ]
    services = [
        ('Vercel', 'Găzduirea site-ului și a panoului, în Dublin (dub1); publicare automată la fiecare push; variabilele de mediu; Cron pentru ștergerea cererilor (02:23 UTC)'),
        ('Supabase', 'Postgres 17 și fișierele media, proiectul anna-restaurante, regiunea eu-west-1 (Irlanda)'),
        ('GitHub', 'Codul, în challymcchallenge/anna-restaurante, ramura main (D-08)'),
        ('Resend', 'Emailurile formularelor, de pe domeniul davittoria.ro; se conectează la lansare (planul gratuit: 100 de emailuri pe zi)'),
        ('ialoc', 'Rezervările de masă, în fereastra ialoc (ID-ul în Setări → Integrări)'),
        ('Claude (Anthropic), modelul Haiku 5.5', 'Traducerile automate în 6 limbi, la build și la butonul „Tradu automat”'),
        ('Google Analytics', 'Statistici de vizitare, doar după „Accept”, doar pe domeniu, cu eticheta site-ului vechi'),
        ('Google Maps', 'Harta din Contact, încărcată la clic'),
        ('Meniul digital', 'Serviciu extern al restaurantului; adresa se schimbă din Setări → Integrări'),
    ]
    env = [
        ('DATABASE_URI', 'Conexiunea la baza de date Supabase (pooler, portul 6543)'),
        ('PAYLOAD_SECRET', 'Cheia cu care panoul semnează sesiunile de autentificare'),
        ('S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY', 'Accesul la fișierele media din Supabase Storage'),
        ('RESEND_API_KEY, EMAIL_FROM', 'Trimiterea emailurilor și adresa expeditorului (la lansare)'),
        ('NEXT_PUBLIC_SITE_URL', 'Adresa publică a site-ului, folosită în sitemap, Open Graph și emailuri'),
        ('ALLOW_INDEXING', '„true” doar pe domeniul final: permite indexarea în Google'),
        ('TRANSLATE_API_KEY', 'Cheia pentru traducerile automate'),
        ('MEDIA_IMPORT_TOKEN', 'Importul în masă al fotografiilor (temporar; se șterge la lansare)'),
        ('CRON_SECRET', 'Protejează adresa de ștergere a cererilor; pus pe 25.11.2026'),
    ]
    t1 = ''.join(f'<tr><td>{esc(a)}</td><td>{esc(b)}</td><td>{esc(c)}</td></tr>' for a, b, c in stack)
    t2 = ''.join(f'<tr><td>{esc(a)}</td><td>{esc(b)}</td></tr>' for a, b in services)
    t3 = ''.join(f'<tr><td>{esc(a)}</td><td>{esc(b)}</td></tr>' for a, b in env)
    return (f'<div class="two"><div><h3 style="margin-bottom:10px">Componentele</h3><div class="tbl"><table><thead><tr><th scope="col">Componentă</th><th scope="col">Versiune</th><th scope="col">Rol</th></tr></thead><tbody>{t1}</tbody></table></div></div>'
            f'<div><h3 style="margin-bottom:10px">Serviciile</h3><div class="tbl"><table><thead><tr><th scope="col">Serviciu</th><th scope="col">Ce face</th></tr></thead><tbody>{t2}</tbody></table></div></div></div>'
            f'<div class="sub"><h3>Variabilele de mediu (doar numele)</h3><p class="measure">Valorile stau doar în Vercel (Settings → Environment Variables) și le pune Alin. Nu apar în cod, în repo, în panou sau în acest manual.</p>'
            f'<div class="tbl tbl-env"><table><thead><tr><th scope="col">Variabilă</th><th scope="col">La ce folosește</th></tr></thead><tbody>{t3}</tbody></table></div>'
            f'<p class="note" style="margin-top:14px"><b>Unde este totul:</b> deciziile în <code>docs/DECISIONS.md</code> (D-01 … D-81), arhitectura în <code>docs/ADR.md</code>, starea proiectului în <code>docs/2026_11_25_Trattoria_Stare_Proiect.md</code>, ghidul editorului și checklist-ul de lansare în <code>docs/</code>, playbook-ul în <code>docs/playbooks/</code>. Versiunile și limitele verificate, cu data, în <code>docs/versions.md</code>.</p></div>')

SERVICES = [
    ('M3 21h18M6 17V11M11 17V6M16 17v-4M21 17V8', 'Dashboard și analiză AI', 'Raportare inteligentă pentru HoReCa, legată de Breeze POS, ExpresSoft POS, Charisma ERP &amp; HCM sau SAGA Web. Primul dashboard în cel mult 10 zile lucrătoare de la contract, termen garantat în contract.'),
    ('M4 5h16M4 12h10M4 19h6M17 15l2 2 3-4', 'Management de proiect', 'Implementarea sau înlocuirea unui POS, ERP, CRM, HCM sau a unei flote auto, de la A la Z.'),
    ('M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z', 'Consultanță IT și strategie AI', 'Audit și cazuri de utilizare cu ROI ridicat, inclusiv pentru administrații publice cu fonduri #DigiLocal sau PNRR.'),
    ('M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16', 'Software și agenți AI', 'Site-uri, aplicații și automatizări cu fluxuri de lucru cu agenți AI, ca site-ul și panoul Trattoria da Vittoria.'),
]
def services_html():
    out = []
    for d, t, p in SERVICES:
        out.append(f'<div class="svc"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{d}"/></svg></span><h3>{t}</h3><p>{p}</p></div>')
    return '<div class="services" aria-label="Serviciile BIZTECH">' + ''.join(out) + '</div>'

PEOPLE = f'''
<div class="people" id="fondatori">
  <article class="person">
    <img class="portrait" src="{ALIN}" alt="Alin Lăbău" width="320" height="320">
    <div class="who-head"><h3>Alin Lăbău</h3><p class="role">Co-fondator BIZTECH Consulting · Consultant IT &amp; AI Project Manager</p></div>
    <ul>
      <li>15+ ani în IT, în companii internaționale: transformă complexitatea tehnologică în soluții simple și eficiente.</li>
      <li>Nokia (stagiu în Finlanda, apoi cercetare în Lund, Suedia), Microsoft (R&amp;D în Suedia, smartphone-urile Lumia), Hays / Volkswagen (parcarea inteligentă din vehiculele Grupului VAG, pe platforma electrică MEB).</li>
      <li>Din 2024, proiecte prin BIZTECH Consulting în HoReCa, în România și Suedia. Black Belt Lean Six Sigma.</li>
      <li>Limbi: română, engleză, suedeză.</li>
    </ul>
    <p class="contact-line"><a href="mailto:alin@biztech.ro">alin@biztech.ro</a> · <a href="tel:+40772295031">+40 772 295 031</a> · <a href="https://www.linkedin.com/in/alin-labau" target="_blank" rel="noopener">linkedin.com/in/alin-labau</a></p>
  </article>
  <article class="person">
    <img class="portrait" src="{GEORGE}" alt="George Lăbău" width="320" height="320">
    <div class="who-head"><h3>George Lăbău</h3><p class="role">Co-fondator BIZTECH Consulting · Medic specialist ATI &amp; Business Manager</p></div>
    <ul>
      <li>Îmbină medicina de înaltă precizie (anestezie și terapie intensivă) cu managementul de business.</li>
      <li>Coordonează direcția financiară, contractarea și achizițiile, plus relațiile pe termen lung cu clienții.</li>
      <li>Interese: inovația AI în sănătate, cu sisteme AI în spitalele din România, și robotica medicală și umanoidă.</li>
      <li>Limbi: română, engleză, italiană.</li>
    </ul>
    <p class="contact-line"><a href="mailto:george@biztech.ro">george@biztech.ro</a></p>
  </article>
</div>'''

def section_head(num, hid, title, voice_text, para):
    return (f'<div class="sec-head"><span class="sec-num">{num}</span><h2 id="{hid}-h">{esc(title)}</h2>{voice(voice_text)}'
            + (f'<p>{para}</p>' if para else '') + '</div>')

SQ = src('img', 'bsq-automatizam.webp')

BODY = f'''
<div class="topbar"><div class="wrap">
  <a class="brand" href="#inceput"><img src="{TRAT}" alt="" width="30" height="30">Manual Trattoria da Vittoria</a>
  <nav aria-label="Navigare rapidă"><a href="#cuprins">Cuprins</a><a class="opt" href="#fluxuri">Capturi</a><a class="opt" href="#instructiuni">Pași</a><a class="opt" href="#intrebari">Întrebări</a><a href="#biztech">BizTech</a></nav>
</div></div>

<section class="bt-page" id="inceput" aria-labelledby="titlu">
  <div class="wrap">
    <div class="bt-strip">
      <div class="k9">
        <img class="round" src="{TRAT}" alt="Logo Trattoria da Vittoria" width="54" height="54">
        <div><strong>Trattoria da Vittoria</strong><span class="muted small">Manual de utilizare · {DATA}</span></div>
      </div>
      <span class="eyebrow">Dezvoltat de BIZTECH Consulting SRL pentru Grupul ANNA</span>
    </div>
    <div class="bt-hero">
      <div>
        <p class="eyebrow">Manual de utilizare</p>
        <h1 id="titlu" class="doc-title">Manual de utilizare · Site și panou de administrare · Trattoria da Vittoria</h1>
        <p class="lead">Cum folosesc oaspeții site-ul Trattoriei, pe telefon și pe desktop, și cum îl administrează echipa dumneavoastră din panou. Cu capturi reale, hărți și pași simpli.</p>
      </div>
      <div class="presenter">
        <img src="{ALIN}" alt="Alin Lăbău" width="320" height="320">
        <div><span class="eyebrow">Prezentat de</span><strong>Alin Lăbău</strong><span>Co-fondator BIZTECH Consulting · Consultant IT &amp; AI Project Manager</span></div>
      </div>
    </div>
    <div class="bt-card">
      <img class="badge" src="{BT}" alt="Insigna BizTech" width="120" height="120">
      <div>
        <h2>100% AI Solutions &amp; Agentic Work-Flows made with <span class="heart">❤️</span> by BizTech Consulting SRL</h2>
        <p>Site-ul și panoul Trattoriei da Vittoria au fost construite de BIZTECH Consulting cu agenți AI și cu oameni care pun suflet în fiecare proiect: un site premium în 7 limbi și un panou refolosibil pentru celelalte restaurante ale Grupului ANNA. Același mod de lucru îl aducem în orice firmă: soluții AI și fluxuri de lucru cu agenți, dashboard-uri de raportare, management de proiect, consultanță IT și dezvoltare software, în România și în Suedia.</p>
        <div class="cta-row">
          <a class="btn btn-outline" href="https://www.biztech.ro/" target="_blank" rel="noopener">Programați analiza gratuită</a>
          <span class="phone-line">sau scrieți-ne pe WhatsApp: <a href="tel:+40772295031"><b>+40 772 295 031</b></a> · <a href="mailto:contact@biztech.ro"><b>contact@biztech.ro</b></a></span>
        </div>
      </div>
    </div>
    <p class="team-line">„Doi co-fondatori cu perspective complementare — tehnologie, management și medicină — uniți de aceeași convingere: inovația trebuie să producă rezultate măsurabile.”</p>
    {PEOPLE}
  </div>
</section>

<section class="sec" id="cuvant-inainte" aria-labelledby="cuvant-inainte-h">
  <div class="wrap">
    <div class="fw-grid">
    <div class="foreword">
      <p class="eyebrow">De la Alin Lăbău</p>
      <h2 id="cuvant-inainte-h">Cuvânt înainte</h2>
      <p>Stimate domnule Lemnaru, stimată echipă a Trattoriei da Vittoria,</p>
      <p>Mă numesc Alin Lăbău și sunt co-fondator al BIZTECH Consulting, consultant IT și AI Project Manager. Colaborăm din 2024, de la dashboard-urile Grupului ANNA, și vă mulțumesc că ne-ați încredințat și noul site al Trattoriei: locul în care un oaspete rezervă o masă, își alege vinul, descoperă serile cu DJ, înscrie copilul la cursul de pizza sau cere o cameră la Hotel ANNA.</p>
      <p>În manualul acesta vă arăt site-ul public, pas cu pas, așa cum îl vede un oaspete pe telefon și pe desktop, apoi panoul de administrare, din care echipa dumneavoastră schimbă texte, fotografii, seri, recenzii, vinuri, telefoane și destinatari de email, fără să ne sune pentru fiecare virgulă. Tot ce vede oaspetele și se poate schimba în timp se editează din panou; nimic specific Trattoriei nu este scris în cod, așa că același panou va servi și celelalte restaurante ale grupului.</p>
      <p>Fiecare capitol începe cu câteva rânduri de la mine. Capturile sunt reale și numerotate: desktopul și, alături, telefonul, cu explicația ecranului deasupra. La final găsiți pașii de dinaintea lansării pe davittoria.ro și lista tehnologiilor, fără nicio cheie sau parolă.</p>
      <p>Dacă aveți întrebări sau vedeți ceva ce poate fi spus mai clar, scrieți-mi sau sunați-mă. Vă răspund cu drag.</p>
      <div class="fw-sign">
        <img src="{ALIN}" alt="" width="64" height="64" loading="lazy">
        <div><b>Alin Lăbău</b><span>Co-fondator BIZTECH Consulting · Consultant IT &amp; AI Project Manager</span><span>Târgu Jiu, {DATA}</span><span><a href="mailto:alin@biztech.ro">alin@biztech.ro</a> · <a href="tel:+40772295031">+40 772 295 031</a></span></div>
      </div>
    </div>
    <figure class="sq-banner"><img src="{SQ}" alt="BizTech: Automatizăm ce îți mănâncă timpul. Tu te ocupi de clienți, noi punem agenții AI să facă restul." width="980" height="864" loading="lazy"></figure>
    </div>
    <div style="margin-top:30px">{services_html()}</div>
  </div>
</section>

<section class="sec" id="cuprins" aria-labelledby="cuprins-h">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Cuprins</p><h2 id="cuprins-h">Ce găsiți în manual</h2><p>Fiecare capitol se deschide dintr-un clic. Capturile sunt numerotate în ordinea fluxurilor, pe desktop și pe telefon.</p></div>
    <ol class="toc">
      <li><a href="#pe-scurt"><span>Pe scurt: site-ul și cum citiți manualul</span></a></li>
      <li><a href="#structura"><span>Structura site-ului și navigația</span></a><ul><li><a href="#harta-site">Harta mentală a site-ului</a></li><li><a href="#navigatie">Drumurile prin site</a></li><li><a href="#pagini">Toate paginile</a></li><li><a href="#harta-admin">Harta panoului</a></li></ul></li>
      <li><a href="#harta-produsului"><span>Harta produsului</span></a></li>
      <li><a href="#fluxuri"><span>Fluxurile de utilizare, cu capturi</span></a><ul>{''.join(f'<li><a href="#{fid}">{esc(t)}</a></li>' for fid, t, _d, _s in FLOWS)}</ul></li>
      <li><a href="#functionalitati"><span>Lista completă de funcționalități</span></a><ul><li><a href="#roluri">Cine ce poate face</a></li><li><a href="#emailuri">Emailurile automate</a></li></ul></li>
      <li><a href="#instructiuni"><span>Instrucțiuni pas cu pas</span></a></li>
      <li><a href="#intrebari"><span>Întrebări frecvente</span></a></li>
      <li><a href="#recomandari"><span>Recomandări și pașii dinainte de lansare</span></a></li>
      <li><a href="#tehnologii"><span>Tehnologii, servicii și variabile de mediu</span></a></li>
      <li><a href="#biztech"><span>BizTech: următorul proiect poate fi al dumneavoastră</span></a></li>
    </ol>
    {banner_wide('idee', 'BizTech: De la idee până la lansare')}
  </div>
</section>

<section class="sec" id="pe-scurt" aria-labelledby="pe-scurt-h">
  <div class="wrap">
    {section_head('01', 'pe-scurt', 'Pe scurt', 'Încep cu esențialul: ce face site-ul, pentru cine am scris manualul și cum să citiți capturile.',
      'Trattoria da Vittoria (Strada Victoriei 8, Târgu Jiu, Grupul ANNA) are un site nou, în 7 limbi, și un panou din care echipa îl administrează. Oaspeții rezervă o masă prin ialoc, cer o cameră la Hotel ANNA, văd serile cu DJ, saloanele, cursul de pizza pentru copii, galeria și lista de peste 150 de vinuri. Site-ul rulează pe adresa temporară de mai jos până la mutarea domeniului davittoria.ro.')}
    <div class="facts">
      <div class="fact"><b>7 limbi</b><span>română, engleză, italiană, franceză, germană, chineză, suedeză; 77 de adrese în sitemap</span></div>
      <div class="fact"><b>11 pagini</b><span>Acasă cu 11 secțiuni, 7 pagini proprii, 3 pagini legale</span></div>
      <div class="fact"><b>5 subiecte</b><span>de cereri din formulare: cazare, eveniment privat, curs de pizza, întrebare, sesizare</span></div>
      <div class="fact"><b>{TOTAL_SHOTS} de ecrane</b><span>în capturi, pe desktop și pe telefon</span></div>
    </div>
    <div class="two" style="margin-top:18px">
      <div class="panel"><h3>Pentru cine este manualul</h3><ul>
        <li><b>Conducerea și managerul restaurantului</b>: ce face site-ul, ce drumuri fac oaspeții și ce se poate schimba fără programator.</li>
        <li><b>Echipa care administrează</b> (Administrator și Editor): cum arată fiecare ecran din panou și ce face fiecare buton.</li>
        <li><b>Recepția hotelului și echipa de evenimente</b>: de unde vin cererile și ce primesc pe email.</li>
      </ul></div>
      <div class="panel"><h3>Cum citiți capturile</h3><ul>
        <li>Fiecare captură are un număr, un titlu și adresa paginii, cu explicația deasupra.</li>
        <li>Desktopul este la 1440 × 900 px, telefonul la 390 × 844 px (iPhone).</li>
        <li>Site-ul este capturat pe {DATA}, de pe producție (adresa temporară), cu bannerul de cookies refuzat după prima captură. Niciun formular nu a fost trimis.</li>
        <li>Panoul este capturat pe o copie locală, cu conținutul de pornire și câteva date de probă; adresele de email din Setări sunt estompate.</li>
      </ul></div>
    </div>
    <p class="note" style="margin-top:18px"><b>Adresele:</b> site-ul <a href="{SITE}">{SITE}</a>, panoul <a href="{SITE}/admin">{SITE}/admin</a>. După lansare: <b>davittoria.ro</b> și <b>davittoria.ro/admin</b>.</p>
  </div>
</section>

<section class="sec wide-page" id="structura" aria-labelledby="structura-h">
  <div class="wrap">
    {section_head('02', 'structura', 'Structura site-ului și navigația', 'În capitolul acesta vă arăt cum este organizat site-ul: meniul, secțiunile paginii Acasă, paginile proprii și drumurile pe care le face un oaspete.',
      'Pagina Acasă spune toată povestea, de sus până jos, cu 11 secțiuni pe care le porniți, le opriți și le reordonați din panou. Paginile proprii duc mai departe: serile, evenimentele private, cursul de pizza, galeria, lista de vinuri, contactul. Meniul are două intrări directe și „Mai mult” cu restul.')}
    <figure class="fig" id="harta-site">
      <div class="fig-box">{SITE_MAP}</div>
      <figcaption>Harta mentală a site-ului public. Stânga: ce este în meniu și în subsol. Dreapta: secțiunile paginii Acasă, ce se deschide din pagini și limbile.</figcaption>
    </figure>
  </div>
</section>

<section class="sec" id="navigatie" aria-labelledby="navigatie-h">
  <div class="wrap">
    <div class="sub" style="margin-top:0">
      <h3 id="navigatie-h">Drumurile prin site</h3>
      <p class="measure">Fiecare rând este un drum real al unui oaspete, de la prima pagină până unde ajunge cererea lui.</p>
      <p class="legend flow-legend"><span><i style="background:var(--band);border-color:var(--line)"></i> pagină pe site</span><span><i style="background:var(--blue-soft);border-color:var(--blue)"></i> serviciu extern</span><span><i style="background:var(--green-soft);border-color:var(--green)"></i> email</span><span><i style="background:var(--plum-soft);border-color:var(--plum)"></i> panou</span></p>
      {flows_chips()}
    </div>
    <div class="sub" id="pagini">
      <h3>Toate paginile</h3>
      <p class="measure">Adresele rămân românești în toate limbile: în engleză, galeria este <code>/en/galerie</code>. Numerele din ultima coloană trimit la capturi.</p>
      {pages_table()}
    </div>
  </div>
</section>

<section class="sec wide-page" id="harta-admin" aria-labelledby="harta-admin-h">
  <div class="wrap">
    <div class="sec-head">
      <h3 id="harta-admin-h" style="font-size:var(--t-h2)">Harta panoului</h3>
      {voice('Aici vedeți cum este organizat panoul și ce vede fiecare rol.')}
      <p>Meniul panoului este în stânga pe desktop și sub butonul cu trei linii pe telefon. Grupul <b>Conținut</b> este al întregii echipe; <b>Setări</b>, <b>Utilizatori</b> și cererile sensibile sunt ale Administratorului. Tabloul de bord arată ce mai este de făcut.</p>
    </div>
    <figure class="fig">
      <div class="fig-box">{ADMIN_MAP}</div>
      <figcaption>Harta mentală a panoului. Editorul vede grupul Conținut și, din cereri, doar cursurile de pizza și întrebările.</figcaption>
    </figure>
  </div>
</section>

<section class="sec wide-page" id="harta-produsului" aria-labelledby="harta-produsului-h">
  <div class="wrap">
    {section_head('03', 'harta-produsului', 'Harta produsului', 'Pe o singură hartă vă arăt cum lucrează site-ul cu serviciile din spatele lui, de la rezervări la emailuri.',
      'Site-ul și panoul rulează pe Vercel, în Dublin. Datele și fișierele stau la Supabase, în Irlanda. Rezervările de masă trec prin ialoc, în fereastra de pe site. Emailurile pleacă prin Resend, de la lansare. Traducerile le face Claude, la fiecare publicare și la butonul „Tradu automat”. Google primește ceva doar după „Accept” pe banner sau la clic pe hartă.')}
    <figure class="fig">
      <div class="fig-box">{product_map()}</div>
      <figcaption>Săgețile pline sunt drumurile de fiecare zi; cele punctate, serviciile chemate la nevoie. Nimic de la Google nu se încarcă fără acordul oaspetelui.</figcaption>
    </figure>
  </div>
</section>

<section class="sec" id="fluxuri" aria-labelledby="fluxuri-h">
  <div class="wrap">
    {section_head('04', 'fluxuri', 'Fluxurile de utilizare, cu capturi', 'Vă duc pe drumul unui oaspete, ecran cu ecran. La final găsiți și ecranele de lucru din panou.',
      'Capturile urmează drumul unui oaspete: întâi desktopul, alături telefonul. Ce scrie sub fiecare titlu este ce poate face omul pe ecranul acela și ce se întâmplă după.')}
    {flows_html()}
  </div>
</section>

<section class="sec" id="functionalitati" aria-labelledby="functionalitati-h">
  <div class="wrap">
    {section_head('05', 'functionalitati', 'Lista completă de funcționalități', 'Am adunat aici tot ce face site-ul, pe zone, și cine ce poate face în panou.',
      f'Funcționalitățile sunt cele de la data capturilor, {DATA}, după F5 sesiunea 1 (D-78 … D-81). Ce este planificat pentru lansare este marcat ca atare.')}
    {features()}
    <div class="sub" id="roluri"><h3>Cine ce poate face</h3>{roles_table()}</div>
    <div class="sub" id="emailuri"><h3>Emailurile automate</h3><p class="measure">Pleacă prin Resend, de pe domeniul davittoria.ro, după conectarea de la lansare (pasul B3 din lista de lansare). Până atunci, cererile se salvează în panou, iar „Email trimis” rămâne nebifat.</p>{emails_table()}</div>
    {banner_wide('rapoarte', 'BizTech: Rapoarte inteligente din POS și ERP')}
  </div>
</section>

<section class="sec" id="instructiuni" aria-labelledby="instructiuni-h">
  <div class="wrap">
    {section_head('06', 'instructiuni', 'Instrucțiuni pas cu pas', 'Pentru echipa dumneavoastră am scris pașii pentru treburile de fiecare zi din panou.',
      'Numele butoanelor sunt scrise exact cum apar pe ecran. Pașii sunt aceiași pe telefon și pe desktop.')}
    {howto()}
    {banner_wide('automatizam', 'BizTech: Automatizăm ce îți mănâncă timpul')}
  </div>
</section>

<section class="sec" id="intrebari" aria-labelledby="intrebari-h">
  <div class="wrap">
    {section_head('07', 'intrebari', 'Întrebări frecvente', 'Aici găsiți răspunsuri scurte la întrebările practice despre site și panou.', '')}
    {faq()}
    {banner_wide('imm', 'BizTech: Primul proiect AI pentru IMM-ul dumneavoastră')}
  </div>
</section>

<section class="sec" id="recomandari" aria-labelledby="recomandari-h">
  <div class="wrap">
    {section_head('08', 'recomandari', 'Recomandări și pașii dinainte de lansare', 'Câteva sfaturi din experiența celorlalte proiecte și lista exactă pentru ziua în care site-ul trece pe davittoria.ro.',
      'Site-ul este gata tehnic (F0–F5 sesiunea 1). Rămân conținutul real în locul exemplelor, textele juristului, emailurile și domeniul. Ordinea de mai jos este cea din checklist-ul de lansare.')}
    {recs()}
  </div>
</section>

<section class="sec" id="tehnologii" aria-labelledby="tehnologii-h">
  <div class="wrap">
    {section_head('09', 'tehnologii', 'Tehnologii, servicii și variabile de mediu', 'Pentru cine vrea să știe ce este sub capotă: componentele, serviciile și, doar cu numele, variabilele de configurare.',
      'Versiunile sunt cele din repo la 26.11.2026 (<code>docs/versions.md</code>, verificate în registrul npm și în documentațiile oficiale). Nicio cheie, parolă sau adresă privată nu apare în acest manual.')}
    {tech()}
  </div>
</section>

<section class="bt-page" id="biztech" aria-labelledby="biztech-h">
  <div class="wrap">
    <div class="bt-strip">
      <div class="k9"><img src="{BT}" alt="Insigna BizTech" width="54" height="54"><div><strong>BIZTECH Consulting SRL</strong><span class="muted small">Business &amp; Technology · 100% AI Solutions &amp; Agentic Work-Flows for SMEs</span></div></div>
      <span class="eyebrow">Colaborări comerciale</span>
    </div>
    <div class="bt-hero">
      <div>
        <p class="eyebrow">Ați citit manualul unui site construit de BIZTECH</p>
        <h2 id="biztech-h" class="bt-title">Următorul proiect poate fi al dumneavoastră</h2>
        <p class="lead">Am construit site-ul și panoul Trattoriei da Vittoria cu agenți AI și cu oameni care pun suflet în fiecare proiect. Pentru celelalte restaurante ale grupului, pentru firme și administrații publice lucrăm la fel: o discuție, o analiză gratuită, apoi rezultate pe care le puteți măsura.</p>
      </div>
      <img class="bt-badge" src="{BT}" alt="" width="200" height="200">
    </div>
    <div class="proof" aria-label="Pe scurt despre BIZTECH">
      <div><b>15+</b><span>ani în IT, la Nokia, Microsoft și Volkswagen</span></div>
      <div><b>10</b><span>zile lucrătoare, cel mult, de la contract la primul dashboard</span></div>
      <div><b>2</b><span>țări: România și Suedia</span></div>
      <div><b>7</b><span>limbi pe site-ul Trattoria da Vittoria, cu traduceri automate</span></div>
    </div>
    <div class="case" id="studiu-de-caz">
      <div>
        <p class="eyebrow">Studiu de caz · Grupul ANNA, Târgu Jiu · HoReCa, colaborare din 2024</p>
        <div class="case-figs">
          <div><b>4</b><span>locații într-un singur dashboard</span></div>
          <div><b>163.000</b><span>comenzi pe an, analizate automat</span></div>
          <div><b>7</b><span>centre de profit, comparate lună de lună</span></div>
          <div><b>3,4% → 1,25%</b><span>retururi, după expunerea anomaliei</span></div>
        </div>
      </div>
      <figure class="quote">
        <blockquote>„Pe plan personal, Alin s-a dovedit un colaborator excelent — de încredere, serios și mereu orientat spre soluții. Îl recomand cu toată încrederea!”</blockquote>
        <figcaption>Călin Lemnaru, Administrator, Grupul ANNA · LinkedIn, 31 octombrie 2025, tradus din engleză</figcaption>
      </figure>
    </div>
    <div class="howwork">
      <h3>Cum lucrăm</h3>
      <ol class="steps">
        <li><b>Discuție inițială</b><span>pe WhatsApp sau 30 de minute pe Google Meet</span></li>
        <li><b>Analiză gratuită și ofertare</b></li>
        <li><b>Contractare</b><span>NDA, acord GDPR, avans 10%</span></li>
        <li><b>Implementare</b></li>
        <li><b>Livrare și rafinare</b></li>
        <li><b>Mentenanță și suport</b><span>abonament lunar, urgențe 24/7</span></li>
      </ol>
      <p class="small muted">Datele dumneavoastră rămân ale dumneavoastră.</p>
    </div>
    <dl class="contact-grid">
      <div><dt>E-mail</dt><dd><a href="mailto:contact@biztech.ro">contact@biztech.ro</a></dd></div>
      <div><dt>Alin Lăbău</dt><dd><a href="mailto:alin@biztech.ro">alin@biztech.ro</a></dd></div>
      <div><dt>George Lăbău</dt><dd><a href="mailto:george@biztech.ro">george@biztech.ro</a></dd></div>
      <div><dt>Telefon România și WhatsApp</dt><dd><a href="tel:+40772295031">+40 772 295 031</a></dd></div>
      <div><dt>Telefon Suedia</dt><dd><a href="tel:+46720123475">+46 720 123 475</a></dd></div>
      <div><dt>Program</dt><dd>Luni–Duminică, 09:00–18:00 · Urgențe 24/7</dd></div>
      <div><dt>Web</dt><dd><a href="https://www.biztech.ro/" target="_blank" rel="noopener">www.biztech.ro</a></dd></div>
      <div><dt>LinkedIn</dt><dd><a href="https://www.linkedin.com/in/alin-labau" target="_blank" rel="noopener">linkedin.com/in/alin-labau</a></dd></div>
      <div class="c-addr"><dt>Adresa</dt><dd>B-dul Republicii, Bloc 30, Scara 1, Parter, Târgu Jiu, Gorj, 210153, România</dd></div>
      <div class="span3"><dt>Firma</dt><dd>BIZTECH CONSULTING SRL · Cod fiscal RO35626946 · Reg. Com. J2016000138184 · EUID ROONRC.J2016000138184</dd></div>
    </dl>
    <div class="bt-close">
      <h2>Programați analiza gratuită</h2>
      <p>Începem cu o discuție pe WhatsApp sau cu un apel video de 30 de minute pe Google Meet. Apoi primiți analiza gratuită și oferta.</p>
      <div class="cta-row" style="margin-top:4px">
        <a class="btn btn-light" href="https://www.biztech.ro/" target="_blank" rel="noopener">Programați analiza gratuită</a>
        <a class="btn btn-ghost-light" href="https://wa.me/40772295031" target="_blank" rel="noopener">Scrieți-ne pe WhatsApp</a>
      </div>
      <p class="phone-line"><b>+40 772 295 031</b> · <b>contact@biztech.ro</b> · <b>www.biztech.ro</b></p>
    </div>
  </div>
</section>

<footer class="doc-foot" aria-label="BizTech">
  <div class="wrap">
    <img src="{BT}" alt="Insigna BizTech" width="96" height="96">
    <p>100% AI Solutions &amp; Agentic Work-Flows for SMEs</p>
    <p>Made with <span class="heart">❤️</span> by BizTech Consulting SRL</p>
    <p>Alin Labau - AI Project Manager | <a href="tel:+40772295031">+40 772 295 031</a> | <a href="https://www.biztech.ro/" target="_blank" rel="noopener">www.biztech.ro</a></p>
    <p class="k9line">Manual de utilizare · Site și panou de administrare · Trattoria da Vittoria · Grupul ANNA, Târgu Jiu · {DATA}</p>
  </div>
</footer>
'''

FONT_LINK = '' if INLINE else '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&display=swap">'

HTML = f'''<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Manual Trattoria da Vittoria</title>
<meta name="description" content="Manual de utilizare pentru site-ul și panoul de administrare Trattoria da Vittoria (Grupul ANNA, Târgu Jiu): fluxuri cu capturi, hărți, funcționalități, instrucțiuni pas cu pas, întrebări frecvente și pașii de dinaintea lansării. De BizTech Consulting SRL.">
<meta name="robots" content="noindex">
{FONT_LINK}
<style>
{FONTS_CSS}
{K9_CSS}
{EXTRA_CSS}
</style>
</head>
<body>
{BODY}
</body>
</html>
'''

out_file = os.path.join(OUT_DIR, NAME + ('.pdf.html' if PDF else '.inline.html' if INLINE else '.html'))
open(out_file, 'w', encoding='utf-8').write(HTML)
print(out_file, round(os.path.getsize(out_file) / 1024 / 1024, 2), 'MB', TOTAL_SHOTS, 'capturi')
