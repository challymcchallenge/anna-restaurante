/**
 * F3 · GATE 3: câte o captură pentru fiecare secțiune a unei pagini (antet, secțiunile din <main>,
 * footer), pe telefon (390 px) și desktop (1440 px), la densitate 2, fără animații. Secțiunile se
 * desenează toate (content-visibility) și imaginile amânate se încarcă înainte.
 * Utilizare: node scripts/f3/capture-sections.mjs <url> <prefix-ieșire>
 * Ieșire: <prefix>-<id secțiune>-telefon.png / -desktop.png și o listă JSON cu ce s-a capturat.
 */
import { writeFileSync } from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const [url, out] = process.argv.slice(2)
const sizes = [['telefon', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]
const b = await chromium.launch()
const list = []
for (const [name, vp] of sizes) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: 'reduce' })
  const p = await ctx.newPage()
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.addStyleTag({ content: '.paper-section,.cover-section,.site-footer{content-visibility:visible!important} .phone-bar{display:none!important}' })
  await p.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 100))
    }
    window.scrollTo(0, 0)
  })
  await p.waitForLoadState('networkidle')
  const ids = await p.evaluate(() => {
    const els = [document.querySelector('header.site-header'), ...document.querySelectorAll('main > section, main > header, main > div > section'), document.querySelector('footer.site-footer')]
    return els.filter(Boolean).map((el, i) => {
      const id = el.id || el.getAttribute('aria-labelledby') || el.className.split(' ')[0] || `s${i}`
      el.setAttribute('data-cap', String(i))
      return { i, id: id.replace(/[^a-z0-9-]/gi, '-').toLowerCase() }
    })
  })
  let headerFreed = false
  for (const { i, id } of ids) {
    // După captura antetului, antetul lipit nu mai acoperă începutul celorlalte secțiuni.
    if (id !== 'site-header' && !headerFreed) {
      await p.addStyleTag({ content: 'header.site-header{position:static!important;transform:none!important}' })
      headerFreed = true
    }
    // Decupajul ține și ce iese din secțiune (de exemplu bara de cazare de sub hero).
    const box = await p.evaluate((n) => {
      const el = document.querySelector(`[data-cap="${n}"]`)
      if (!el) return null
      const r = el.getBoundingClientRect()
      let bottom = r.bottom
      for (const d of el.querySelectorAll('*')) {
        const dr = d.getBoundingClientRect()
        if (dr.height > 0 && getComputedStyle(d).position !== 'fixed') bottom = Math.max(bottom, dr.bottom)
      }
      return { y: r.top + window.scrollY, height: bottom - r.top }
    }, i)
    if (!box || box.height < 20) continue
    const file = `${out}-${String(i).padStart(2, '0')}-${id}-${name}.png`
    await p.screenshot({ path: file, fullPage: true, clip: { x: 0, y: box.y, width: vp.width, height: box.height } })
    list.push({ size: name, id, file, height: Math.round(box.height) })
  }
  await ctx.close()
}
await b.close()
writeFileSync(`${out}-sectiuni.json`, JSON.stringify(list, null, 1))
console.log(list.map((l) => `${l.size} ${l.id} ${l.height}px`).join('\n'))
