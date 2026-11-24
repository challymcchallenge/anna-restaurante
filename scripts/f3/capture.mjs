/**
 * F3 · Capturi ale site-ului public, pentru rapoartele de pas și GATE 3.
 * Prim ecran la 390 × 844 și 1440 × 900 (densitate 2, cu momentul de intrare încheiat) și pagina
 * întreagă (densitate 1, fără animații). Imaginile amânate se încarcă înainte (derulare lentă).
 * Utilizare: node scripts/f3/capture.mjs <url> <prefix-ieșire> [lățimi suplimentare, ex. 1024x768,768x1024]
 */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const [url, out, extra = ''] = process.argv.slice(2)
const sizes = [['telefon', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]
for (const s of extra.split(',').filter(Boolean)) {
  const [w, h] = s.split('x').map(Number)
  sizes.push([`${w}`, { width: w, height: h }])
}
const b = await chromium.launch()
for (const [name, vp] of sizes) {
  for (const [suffix, dpr, motion, full] of [['', 2, 'no-preference', false], ['-pagina', 1, 'reduce', true]]) {
    if (suffix === '' && !['telefon', 'desktop'].includes(name)) continue
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: dpr, reducedMotion: motion })
    const p = await ctx.newPage()
    await p.goto(url, { waitUntil: 'networkidle' })
    await p.evaluate(() => document.fonts.ready)
    if (full) {
      // content-visibility: auto nu desenează secțiunile din afara ecranului; captura întreagă le cere pe toate.
      await p.addStyleTag({ content: '.paper-section,.cover-section,.site-footer{content-visibility:visible!important}' })
      // Derulare pas cu pas, ca imaginile cu loading="lazy" să se încarce; apoi înapoi sus.
      await p.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 120))
        }
        window.scrollTo(0, 0)
      })
      await p.waitForLoadState('networkidle')
      await p.waitForTimeout(400)
    } else {
      await p.waitForTimeout(1800)
    }
    await p.screenshot({ path: `${out}-${name}${suffix}.png`, fullPage: full })
    await ctx.close()
  }
}
await b.close()
