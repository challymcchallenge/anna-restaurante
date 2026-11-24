/**
 * F2 · Capturi pentru raportul GATE 2.
 * Prim ecran: 390 × 844 (telefon) și 1440 × 900 (desktop), la densitate 2, cu animațiile încheiate.
 * Pagina întreagă: densitate 1, fără animații (reducedMotion), ca să nu se reia momentul de intrare.
 * Utilizare: node scripts/f2/capture.mjs <pagina.html> design/f2/capturi/<prefix>
 */
import { createRequire } from 'module'
import path from 'path'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const [file, out] = process.argv.slice(2)
const b = await chromium.launch()
for (const [name, vp] of [['telefon', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
  for (const [suffix, dpr, motion, full] of [['', 2, 'no-preference', false], ['-pagina', 1, 'reduce', true]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: dpr, reducedMotion: motion })
    const p = await ctx.newPage()
    await p.goto('file://' + path.resolve(file))
    await p.evaluate(() => document.fonts.ready)
    await p.waitForTimeout(1800)
    await p.screenshot({ path: `${out}-${name}${suffix}.png`, fullPage: full })
    await ctx.close()
  }
}
await b.close()
