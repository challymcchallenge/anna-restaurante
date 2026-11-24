/**
 * F2 · Măsurarea contrastului pe randarea reală (WCAG 2.x, raport de luminanță relativă).
 *
 * Pentru fiecare rând de text vizibil: culoarea calculată a textului se compară cu FIECARE pixel
 * de fundal de sub acel rând (captură făcută cu textul ascuns). Se raportează cel mai slab pixel
 * (minim) și percentila 5. Așa se măsoară și textul așezat peste fotografie/video, nu doar culorile
 * declarate în CSS.
 *
 * Utilizare: node scripts/f2/contrast-measure.mjs <pagina.html | http://…> <eticheta> <ieșire.json> [light|dark]
 * (F3: acceptă și adresa site-ului pornit local, de exemplu http://localhost:3000/.)
 * Rulează pe 390 × 844 (telefon) și 1440 × 900 (desktop), cu animațiile încheiate.
 */
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const [file, label, out, scheme = 'light'] = process.argv.slice(2)
if (!file || !out) {
  console.error('Utilizare: node scripts/f2/contrast-measure.mjs <pagina.html> <eticheta> <ieșire.json>')
  process.exit(2)
}

const lin = (c) => {
  c /= 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Decodează un PNG prin browser (fără dependențe în plus): întoarce RGBA pentru o regiune. */
async function pixelsOf(page, pngBuffer) {
  const b64 = pngBuffer.toString('base64')
  return page.evaluate(async (data) => {
    const img = new Image()
    img.src = 'data:image/png;base64,' + data
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0)
    window.__px = { w: c.width, h: c.height, d: Array.from(ctx.getImageData(0, 0, c.width, c.height).data) }
    return { w: c.width, h: c.height }
  }, b64)
}

const browser = await chromium.launch()
const results = []
for (const [device, viewport] of [
  ['telefon', { width: 390, height: 844 }],
  ['desktop', { width: 1440, height: 900 }],
]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'no-preference', colorScheme: scheme })
  const page = await ctx.newPage()
  await page.goto(/^https?:\/\//.test(file) ? file : 'file://' + path.resolve(file))
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1800)

  const docH = await page.evaluate(() => document.documentElement.scrollHeight)
  const seen = new Map()
  for (let y = 0; y < docH; y += viewport.height - 120) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(250)
    // 1) rândurile de text vizibile, cu culoarea lor calculată
    const lines = await page.evaluate(() => {
      const out = []
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let n
      let idx = 0
      while ((n = walker.nextNode())) {
        const t = n.textContent.replace(/\s+/g, ' ').trim()
        if (!t) continue
        const el = n.parentElement
        if (!el || el.closest('svg, script, style, .sr-only, [aria-hidden="true"]')) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue
        const r = document.createRange()
        r.selectNodeContents(n)
        const rects = [...r.getClientRects()].filter((q) => q.width > 2 && q.height > 2)
        // rgb(r, g, b[, a]) are valori 0–255; color(srgb r g b [/ a]) (de exemplu din color-mix) are 0–1.
        const isSrgb = cs.color.startsWith('color(srgb')
        const nums = cs.color.replace('color(srgb', '').match(/[\d.]+/g).map(Number)
        const m = isSrgb ? [...nums.slice(0, 3).map((v) => v * 255), nums[3] ?? 1] : nums
        let path = []
        for (let e = el; e && e !== document.body; e = e.parentElement) path.unshift(e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/)[0] : ''))
        for (const q of rects) {
          if (q.top < 0 || q.bottom > innerHeight || q.left < 0 || q.right > innerWidth) continue
          // textul acoperit de alt element (de exemplu bara fixă de jos) nu se vede: nu se măsoară
          const hit = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2)
          if (!hit || !(hit === el || el.contains(hit) || hit.contains(el))) continue
          out.push({
            key: path.join('>') + '|' + t.slice(0, 40) + '|' + idx,
            text: t.slice(0, 60),
            selector: path.slice(-3).join(' > '),
            fontSize: parseFloat(cs.fontSize),
            fontWeight: Number(cs.fontWeight) || 400,
            color: m.slice(0, 3),
            alpha: m.length > 3 ? m[3] : 1,
            rect: { x: q.left, y: q.top, w: q.width, h: q.height },
            scrollY: scrollY,
          })
        }
        idx++
      }
      return out
    })
    // 2) fundalul fără text
    await page.addStyleTag({ content: '*{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important;caret-color:transparent!important} svg{visibility:hidden!important}', })
    await page.waitForTimeout(80)
    const bg = await page.screenshot()
    await page.evaluate(() => document.querySelectorAll('style').forEach((s) => { if (s.textContent.startsWith('*{color:transparent')) s.remove() }))
    await pixelsOf(page, bg)
    const measured = await page.evaluate((ls) => {
      const { w, d } = window.__px
      return ls.map((l) => {
        const xs = Math.max(0, Math.floor(l.rect.x)), xe = Math.min(w - 1, Math.ceil(l.rect.x + l.rect.w))
        const ys = Math.max(0, Math.floor(l.rect.y + l.rect.h * 0.15)), ye = Math.ceil(l.rect.y + l.rect.h * 0.85)
        const px = []
        for (let y = ys; y < ye; y += 1) for (let x = xs; x < xe; x += 1) {
          const i = (y * w + x) * 4
          px.push([d[i], d[i + 1], d[i + 2]])
        }
        return { ...l, px }
      })
    }, lines)
    for (const l of measured) {
      // text semitransparent: se compune peste fiecare pixel de fundal
      const ratios = l.px.map((p) => {
        const c = l.alpha < 1 ? l.color.map((v, k) => v * l.alpha + p[k] * (1 - l.alpha)) : l.color
        return ratio(c, p)
      }).sort((a, b) => a - b)
      if (!ratios.length) continue
      const min = ratios[0]
      const p5 = ratios[Math.floor(ratios.length * 0.05)]
      const large = l.fontSize >= 24 || (l.fontSize >= 18.66 && l.fontWeight >= 700)
      const prev = seen.get(l.key)
      const rec = {
        device, text: l.text, selector: l.selector, fontSize: l.fontSize, fontWeight: l.fontWeight,
        color: '#' + l.color.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase(),
        min: +min.toFixed(2), p5: +p5.toFixed(2), large, pass45: p5 >= 4.5,
      }
      if (!prev || rec.p5 < prev.p5) seen.set(l.key, rec)
    }
  }
  results.push(...seen.values())
  await ctx.close()
}
await browser.close()

fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, JSON.stringify({ page: file, label, measuredAt: new Date().toISOString(), method: 'pixel-sampling WCAG 2.x, p5 of background pixels under each text line', lines: results }, null, 1))
const fails = results.filter((r) => !r.pass45)
const byDev = (d) => results.filter((r) => r.device === d)
for (const d of ['telefon', 'desktop']) {
  const rs = byDev(d)
  const worst = rs.reduce((a, b) => (b.p5 < a.p5 ? b : a), rs[0])
  console.log(`${label} · ${d}: ${rs.length} rânduri de text, cel mai slab p5 = ${worst?.p5}:1 („${worst?.text}”, ${worst?.selector}), sub 4,5:1: ${rs.filter((r) => !r.pass45).length}`)
}
if (fails.length) for (const f of fails) console.log('  SUB PRAG', f.device, f.p5, f.min, f.color, f.text, '|', f.selector)
