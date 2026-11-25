#!/usr/bin/env python3
"""
D-62: generează motivele decorative (public/decor/*.svg) și valurile dintre secțiuni.

Fișierele sunt măști (doar negru + transparență): culoarea vine din temă, în CSS
(`background: var(--c-accent)` + `mask-image`), deci nimic din tenant nu e scris aici.
Motivele sunt line-art cu un singur grosime de linie, ca ilustrațiile dintr-o carte de vinuri,
plus o pată organică abstractă, mai slabă, în spate.

Rulare: python3 scripts/f3/generate-decor.py
"""
import math
import os
import random

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'decor')
SW = 1.6  # grosimea liniei în unități viewBox (400); la 360 px pe ecran ≈ 1,4 px


def f(v):
    return f'{v:.1f}'.rstrip('0').rstrip('.')


def bez(p0, p1, p2, p3, t):
    u = 1 - t
    x = u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0]
    y = u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1]
    dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0])
    dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1])
    return x, y, math.degrees(math.atan2(dy, dx))


def cubic(p0, p1, p2, p3):
    return f'M{f(p0[0])} {f(p0[1])}C{f(p1[0])} {f(p1[1])} {f(p2[0])} {f(p2[1])} {f(p3[0])} {f(p3[1])}'


def leaf(x, y, angle, length, width, rib=True):
    l, w = length, width
    d = f'M0 0C{f(l*.3)} {f(-w)} {f(l*.7)} {f(-w)} {f(l)} 0C{f(l*.7)} {f(w)} {f(l*.3)} {f(w)} 0 0Z'
    r = f'<path d="M{f(l*.1)} 0L{f(l*.82)} 0"/>' if rib else ''
    return f'<g transform="translate({f(x)} {f(y)}) rotate({f(angle)})"><path d="{d}"/>{r}</g>'


def grain(x, y, angle, length, width):
    """Bob de grâu: picătură cu vârful pe direcția `angle`."""
    l, w = length, width
    d = f'M0 0C{f(l*.25)} {f(-w)} {f(l*.8)} {f(-w*.7)} {f(l)} 0C{f(l*.8)} {f(w*.7)} {f(l*.25)} {f(w)} 0 0Z'
    return f'<g transform="translate({f(x)} {f(y)}) rotate({f(angle)})"><path d="{d}"/></g>'


def smooth_closed(points):
    """Catmull-Rom → Bézier, curbă închisă prin puncte."""
    n = len(points)
    d = f'M{f(points[0][0])} {f(points[0][1])}'
    for i in range(n):
        p0, p1, p2, p3 = points[(i - 1) % n], points[i], points[(i + 1) % n], points[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f'C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}'
    return d + 'Z'


def smooth_open(points):
    d = f'M{f(points[0][0])} {f(points[0][1])}'
    n = len(points)
    for i in range(n - 1):
        p0 = points[max(i - 1, 0)]
        p1, p2 = points[i], points[i + 1]
        p3 = points[min(i + 2, n - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f'C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}'
    return d


def blob(cx, cy, r, seed, n=7, wobble=0.22, scale=1.0):
    rnd = random.Random(seed)
    radii = [r * (1 - wobble + 2 * wobble * rnd.random()) for _ in range(n)]
    off = rnd.random() * math.tau
    pts = []
    for i in range(n):
        a = off + i * math.tau / n
        pts.append((cx + math.cos(a) * radii[i] * scale, cy + math.sin(a) * radii[i] * scale * 0.9))
    return smooth_closed(pts)


def soft(d, opacity=0.2):
    """Pata abstractă din spate: plină, mult mai slabă decât liniile."""
    return f'<path d="{d}" fill="#000" fill-opacity="{opacity}" stroke="none"/>'


def svg(body, view=400):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view} {view}" fill="none" stroke="#000" '
        f'stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round">{body}</svg>\n'
    )


def star5(cx, cy, r):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.45
        a = -math.pi / 2 + i * math.pi / 5
        pts.append(f'{f(cx + rr * math.cos(a))} {f(cy + rr * math.sin(a))}')
    return f'<path d="M{"L".join(pts)}Z"/>'


def sparkle(cx, cy, r):
    k = r * 0.22
    return (
        f'<path d="M{f(cx)} {f(cy-r)}C{f(cx+k*.3)} {f(cy-k)} {f(cx+k)} {f(cy-k*.3)} {f(cx+r)} {f(cy)}'
        f'C{f(cx+k)} {f(cy+k*.3)} {f(cx+k*.3)} {f(cy+k)} {f(cx)} {f(cy+r)}'
        f'C{f(cx-k*.3)} {f(cy+k)} {f(cx-k)} {f(cy+k*.3)} {f(cx-r)} {f(cy)}'
        f'C{f(cx-k)} {f(cy-k*.3)} {f(cx-k*.3)} {f(cy-k)} {f(cx)} {f(cy-r)}Z"/>'
    )


def dot(cx, cy, r=2.4):
    return f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="#000" stroke="none"/>'


# ---------- Bucătăria: ramură de măslin și spic de grâu ----------
def kitchen():
    out = [soft(blob(215, 205, 150, 11))]
    p = ((70, 352), (150, 300), (226, 176), (330, 58))
    out.append(f'<path d="{cubic(*p)}"/>')
    for i, t in enumerate([0.12, 0.22, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.91]):
        x, y, a = bez(*p, t)
        side = 1 if i % 2 else -1
        size = 62 - t * 26
        out.append(leaf(x, y, a + side * 38, size, size * 0.19))
    x, y, a = bez(*p, 1)
    out.append(leaf(x, y, a, 40, 8))
    for t, side in [(0.47, 1), (0.69, -1)]:
        x, y, a = bez(*p, t)
        nx, ny = math.cos(math.radians(a + 90 * side)), math.sin(math.radians(a + 90 * side))
        ox, oy = x + nx * 26, y + ny * 26
        out.append(f'<path d="M{f(x)} {f(y)}Q{f(x + nx * 14)} {f(y + ny * 10)} {f(ox)} {f(oy)}"/>')
        out.append(f'<ellipse cx="{f(ox + nx * 10)}" cy="{f(oy + ny * 10)}" rx="8.5" ry="11.5" transform="rotate({f(a)} {f(ox + nx * 10)} {f(oy + ny * 10)})"/>')
    # spicul, subțire, în contrapunct
    s = ((356, 384), (348, 330), (338, 268), (316, 206))
    out.append(f'<path d="{cubic(*s)}"/>')
    for i, t in enumerate([0.55, 0.63, 0.71, 0.79, 0.87, 0.95]):
        x, y, a = bez(*s, t)
        for side in (-1, 1):
            out.append(grain(x, y, a + side * 26, 26, 6.5))
            ex = x + math.cos(math.radians(a + side * 26)) * 26
            ey = y + math.sin(math.radians(a + side * 26)) * 26
            ax = ex + math.cos(math.radians(a + side * 14)) * 30
            ay = ey + math.sin(math.radians(a + side * 14)) * 30
            out.append(f'<path d="M{f(ex)} {f(ey)}L{f(ax)} {f(ay)}" stroke-width="{SW*.7}"/>')
    x, y, a = bez(*s, 1)
    out.append(grain(x, y, a, 26, 6.5))
    return svg(''.join(out))


# ---------- Vinuri: ciorchine, frunză de viță, cârcel ----------
def wines():
    out = [soft(blob(205, 215, 150, 23))]
    rows = [4, 5, 4, 3, 2, 1]
    r, dx, dy = 14.5, 29, 25.5
    top = 170
    for j, n in enumerate(rows):
        y = top + j * dy
        x0 = 205 - (n - 1) * dx / 2
        for i in range(n):
            out.append(f'<circle cx="{f(x0 + i * dx)}" cy="{f(y)}" r="{r}"/>')
    out.append('<path d="M205 156C205 132 214 110 236 92"/>')
    # frunza: palmată, cinci lobi
    cx, cy, R = 290, 118, 62
    pts = []
    for k in range(120):
        th = k / 120 * math.tau
        rr = R * (0.8 + 0.2 * math.cos(5 * (th - 0.35)))
        if abs(((th - math.radians(215)) + math.pi) % math.tau - math.pi) < 0.22:
            rr *= 0.55  # crestătura de la codiță
        pts.append((cx + rr * math.cos(th), cy + rr * math.sin(th) * 0.92))
    out.append(f'<path d="{smooth_closed(pts[::2])}"/>')
    sx, sy = cx + R * 0.42 * math.cos(math.radians(215)), cy + R * 0.42 * math.sin(math.radians(215))
    for k in range(5):
        th = 0.35 + k * math.tau / 5
        out.append(f'<path d="M{f(sx)} {f(sy)}L{f(cx + R * 0.78 * math.cos(th))} {f(cy + R * 0.78 * math.sin(th) * 0.92)}" stroke-width="{SW*.75}"/>')
    out.append(f'<path d="M236 92L{f(sx)} {f(sy)}"/>')
    # cârcelul
    sp = []
    for k in range(60):
        t = k / 59
        rr = 34 * (1 - t) + 4
        th = math.pi * 0.2 + t * math.tau * 1.6
        sp.append((150 + rr * math.cos(th), 108 + rr * math.sin(th)))
    out.append(f'<path d="M222 104C200 96 186 104 {f(sp[0][0])} {f(sp[0][1])}"/>')
    out.append(f'<path d="{smooth_open(sp[::2])}"/>')
    return svg(''.join(out))


# ---------- Recenzii: cunună de lauri și cinci stele ----------
def reviews():
    out = [soft(blob(200, 210, 150, 5))]
    cx, cy, R = 200, 212, 132
    for side in (-1, 1):
        a0, a1 = 98, 236
        pts = []
        for k in range(40):
            a = math.radians(90 - side * (8 + (a1 - a0) * k / 39))
            pts.append((cx + R * math.cos(a), cy + R * math.sin(a)))
        out.append(f'<path d="{smooth_open(pts[::3])}"/>')
        for k in range(1, 12):
            t = k / 12
            a = math.radians(90 - side * (8 + (a1 - a0) * t))
            x, y = cx + R * math.cos(a), cy + R * math.sin(a)
            tang = math.degrees(a) - side * 90
            size = 40 - t * 14
            out.append(leaf(x, y, tang - side * 32, size, size * 0.24))
            out.append(leaf(x, y, tang + side * 30, size * 0.9, size * 0.22))
    out.append('<path d="M186 346C194 336 206 336 214 346M200 340L188 366M200 340L212 366"/>')
    for i in range(5):
        a = math.radians(-90 + (i - 2) * 17)
        out.append(star5(cx + 86 * math.cos(a), cy + 30 + 86 * math.sin(a), 11))
    return svg(''.join(out))


# ---------- Petreceri: serpentine și confetti ----------
def parties():
    out = [soft(blob(210, 200, 150, 41))]
    for k, (amp, ph, y0) in enumerate([(26, 0.0, 120), (20, 1.4, 200), (30, 2.6, 285)]):
        pts = []
        for i in range(25):
            t = i / 24
            x = 40 + t * 330
            y = y0 - t * 70 + amp * math.sin(ph + t * math.tau * 1.35) * (0.6 + 0.4 * t)
            pts.append((x, y))
        out.append(f'<path d="{smooth_open(pts)}"/>')
    rnd = random.Random(7)
    for i in range(16):
        x, y = 50 + rnd.random() * 310, 40 + rnd.random() * 320
        kind = i % 4
        if kind == 0:
            out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(3 + rnd.random() * 3)}"/>')
        elif kind == 1:
            s = 5 + rnd.random() * 3
            out.append(f'<path d="M{f(x)} {f(y-s)}L{f(x+s*.7)} {f(y)}L{f(x)} {f(y+s)}L{f(x-s*.7)} {f(y)}Z"/>')
        elif kind == 2:
            out.append(sparkle(x, y, 7 + rnd.random() * 4))
        else:
            out.append(dot(x, y, 2.6))
    return svg(''.join(out))


# ---------- Saloane și evenimente private: două pahare care ciocnesc ----------
def flute(x, y, rot):
    body = (
        '<ellipse cx="0" cy="-150" rx="19" ry="4.5"/>'
        '<path d="M-19 -150C-19 -88 -10 -46 0 -38C10 -46 19 -88 19 -150"/>'
        '<path d="M-17 -112C-6 -108 6 -116 17 -112" stroke-width="1.1"/>'
        '<path d="M0 -38L0 40"/><ellipse cx="0" cy="42" rx="27" ry="6"/>'
        f'{dot(-4, -70, 2)}{dot(5, -88, 1.7)}{dot(-2, -98, 1.4)}'
    )
    return f'<g transform="translate({f(x)} {f(y)}) rotate({f(rot)})">{body}</g>'


def private():
    out = [soft(blob(205, 215, 150, 17))]
    out.append(flute(162, 318, -15))
    out.append(flute(250, 318, 15))
    for a in (-120, -90, -60):
        r1, r2 = 16, 34
        cx, cy = 205, 152
        out.append(f'<path d="M{f(cx + r1*math.cos(math.radians(a)))} {f(cy + r1*math.sin(math.radians(a)))}L{f(cx + r2*math.cos(math.radians(a)))} {f(cy + r2*math.sin(math.radians(a)))}"/>')
    out.append(sparkle(300, 92, 12))
    out.append(sparkle(112, 120, 8))
    for (x, y, r) in [(212, 118, 3.5), (196, 96, 2.6), (218, 78, 2)]:
        out.append(f'<circle cx="{x}" cy="{y}" r="{r}"/>')
    return svg(''.join(out))


# ---------- Cursuri de pizza: felie și boneta de bucătar ----------
def pizza():
    out = [soft(blob(200, 210, 150, 29))]
    slice_ = (
        '<path d="M0 0L-78 -196M0 0L78 -196"/>'
        '<path d="M-86 -192Q0 -246 86 -192"/><path d="M-78 -196Q0 -232 78 -196"/>'
        '<circle cx="-22" cy="-150" r="12"/><circle cx="24" cy="-120" r="11"/><circle cx="-6" cy="-74" r="9"/>'
        '<circle cx="34" cy="-170" r="7"/>'
        f'{leaf(-40, -110, -20, 26, 6)}{leaf(10, -40, 210, 22, 5)}'
        '<path d="M-34 -100C-30 -88 -36 -80 -30 -70" stroke-width="1.1"/>'
    )
    out.append(f'<g transform="translate(176 340) rotate(-18)">{slice_}</g>')
    hat = (
        '<path d="M-34 0L-30 -36M34 0L30 -36M-34 0L34 0M-33 -10L33 -10"/>'
        '<path d="M-30 -36C-58 -40 -60 -82 -30 -80C-30 -108 4 -114 12 -92C26 -112 62 -98 50 -72C68 -62 56 -32 30 -36"/>'
        '<path d="M-6 -36L-4 -64M14 -36L16 -60" stroke-width="1.1"/>'
    )
    out.append(f'<g transform="translate(300 148) rotate(10)">{hat}</g>')
    rnd = random.Random(3)
    for _ in range(9):
        out.append(dot(250 + rnd.random() * 110, 210 + rnd.random() * 120, 1.6 + rnd.random()))
    return svg(''.join(out))


# ---------- Hotel: semilună, stele și orbita nopții ----------
def hotel():
    out = [soft(blob(210, 200, 150, 13))]
    c1, r1 = (205, 205), 92
    c2, r2 = (246, 176), 78
    d = math.dist(c1, c2)
    a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    h = math.sqrt(r1 * r1 - a * a)
    mx = c1[0] + a * (c2[0] - c1[0]) / d
    my = c1[1] + a * (c2[1] - c1[1]) / d
    i1 = (mx + h * (c2[1] - c1[1]) / d, my - h * (c2[0] - c1[0]) / d)
    i2 = (mx - h * (c2[1] - c1[1]) / d, my + h * (c2[0] - c1[0]) / d)
    out.append(
        f'<path d="M{f(i1[0])} {f(i1[1])}A{r1} {r1} 0 1 0 {f(i2[0])} {f(i2[1])}A{r2} {r2} 0 0 1 {f(i1[0])} {f(i1[1])}Z"/>'
    )
    out.append(f'<circle cx="{c1[0]}" cy="{c1[1]}" r="128" stroke-dasharray="1 11" stroke-width="2.2"/>')
    out.append(sparkle(312, 96, 18))
    out.append(sparkle(326, 268, 9))
    out.append(sparkle(96, 104, 11))
    out.append(sparkle(270, 340, 7))
    for (x, y) in [(352, 160), (80, 300), (140, 56), (300, 50)]:
        out.append(dot(x, y, 2))
    return svg(''.join(out))


# ---------- Galerie: rame suprapuse, cu un peisaj ----------
def frame(x, y, w, h, rot, inner=''):
    return (
        f'<g transform="translate({f(x)} {f(y)}) rotate({f(rot)})">'
        f'<rect x="{f(-w/2)}" y="{f(-h/2)}" width="{f(w)}" height="{f(h)}" rx="10"/>'
        f'<rect x="{f(-w/2+10)}" y="{f(-h/2+10)}" width="{f(w-20)}" height="{f(h-20)}" rx="5" stroke-width="1.1"/>{inner}</g>'
    )


def gallery():
    out = [soft(blob(205, 205, 150, 31))]
    out.append(frame(150, 160, 150, 112, -9))
    out.append(frame(268, 128, 112, 140, 8))
    scene = '<path d="M-64 30L-24 -12L4 14L26 -6L66 30" stroke-width="1.4"/><circle cx="30" cy="-24" r="10"/>'
    out.append(frame(212, 262, 170, 124, -2, scene))
    return svg(''.join(out))


# ---------- Contact: acul de hartă, undele și drumul punctat ----------
def contact():
    out = [soft(blob(210, 205, 150, 37))]
    pin = (
        '<path d="M0 0C-26 -36 -50 -64 -50 -100A50 50 0 1 1 50 -100C50 -64 26 -36 0 0Z"/>'
        '<circle cx="0" cy="-100" r="18"/>'
    )
    out.append(f'<g transform="translate(236 236)">{pin}</g>')
    for rx, ry, dash in [(34, 9, ''), (62, 16, ''), (92, 24, ' stroke-dasharray="2 9"')]:
        out.append(f'<ellipse cx="236" cy="238" rx="{rx}" ry="{ry}"{dash}/>')
    path = [(40, 360), (90, 330), (70, 280), (130, 262), (170, 300), (200, 270)]
    out.append(f'<path d="{smooth_open(path)}" stroke-dasharray="0.5 10" stroke-width="3"/>')
    return svg(''.join(out))


# ---------- Întrebări: două bule de dialog ----------
def faq():
    out = [soft(blob(205, 205, 150, 19))]
    out.append('<path d="M80 110C80 92 94 80 112 80H262C280 80 294 92 294 110V196C294 214 280 226 262 226H160L118 262L126 226H112C94 226 80 214 80 196Z"/>')
    out.append('<path d="M164 128C166 112 178 104 192 104C208 104 218 114 218 128C218 150 190 150 190 170" stroke-width="2.2"/>')
    out.append(dot(190, 192, 3.4))
    out.append('<path d="M330 214C330 202 320 194 308 194H226C214 194 204 202 204 214V266C204 278 214 286 226 286H290L318 310L314 286C324 284 330 276 330 266Z"/>')
    for x in (244, 267, 290):
        out.append(dot(x, 240, 3))
    return svg(''.join(out))


# ---------- Linii de contur: forma abstractă din colțul opus, comună ----------
def contour():
    out = []
    for i, s in enumerate([1.0, 0.8, 0.6, 0.4]):
        out.append(f'<path d="{blob(200, 200, 170, 101, n=8, wobble=0.16, scale=s)}"{" stroke-dasharray=\"1 8\"" if i == 0 else ""}/>')
    return svg(''.join(out))


# ---------- Valurile dintre secțiuni (mască pe lățime, cu un ecou subțire) ----------
WAVES = {
    'a': 'M0 30C240 4 480 54 720 30S1200 62 1440 30',
    'b': 'M0 44C520 -6 1080 70 1440 18',
    'c': 'M0 36C120 14 240 14 360 36S600 58 720 36 960 14 1080 36 1320 58 1440 36',
    'd': 'M0 22C120 20 200 46 380 50C620 56 700 22 960 16C1180 12 1260 44 1440 44',
}


def wave(d):
    # umplutura: de sus până la curbă (curba e parcursă invers ca să închidem conturul corect)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 64" preserveAspectRatio="none">'
        f'<path d="{d}V0H0Z" fill="#000"/>'
        f'<path d="{d}" transform="translate(0 7)" fill="none" stroke="#000" stroke-opacity=".55" '
        f'stroke-width="1.2" vector-effect="non-scaling-stroke"/>'
        f'</svg>\n'
    )


def main():
    os.makedirs(OUT, exist_ok=True)
    motifs = {
        'kitchen': kitchen, 'wines': wines, 'reviews': reviews, 'parties': parties, 'private': private,
        'pizza': pizza, 'hotel': hotel, 'gallery': gallery, 'contact': contact, 'faq': faq, 'contour': contour,
    }
    for name, fn in motifs.items():
        with open(os.path.join(OUT, f'{name}.svg'), 'w') as fh:
            fh.write(fn())
    for k, d in WAVES.items():
        with open(os.path.join(OUT, f'wave-{k}.svg'), 'w') as fh:
            fh.write(wave(d))
    total = sum(os.path.getsize(os.path.join(OUT, n)) for n in os.listdir(OUT))
    print(f'{len(motifs) + len(WAVES)} fișiere în public/decor, {total} octeți')


if __name__ == '__main__':
    main()
