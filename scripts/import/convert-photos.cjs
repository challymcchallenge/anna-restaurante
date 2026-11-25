// Conversia ca în panou: convertImage(file, 'photo') din convert.ts, rulat în Chromium (HEIC prin heic-to).
const { chromium } = require('playwright')
const fs = require('fs'), path = require('path')
;(async () => {
  const [base, listFile, outDir] = process.argv.slice(2)
  const list = JSON.parse(fs.readFileSync(listFile, 'utf8'))
  const b = await chromium.launch()
  const p = await b.newPage()
  p.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 160)))
  await p.goto(base + '/e2e/index.html')
  const results = []
  let i = 0
  for (const it of list) {
    i++
    const r = await p.evaluate(async ({ folder, name }) => {
      const t0 = performance.now()
      const res = await fetch(`/import/orig/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`)
      const blob = await res.blob()
      const type = /\.heic$/i.test(name) ? 'image/heic' : /\.png$/i.test(name) ? 'image/png' : 'image/jpeg'
      const file = new File([blob], name, { type })
      try {
        const { convertImage } = await import('/e2e/convert.js')
        const out = await convertImage(file, 'photo')
        const buf = new Uint8Array(await out.file.arrayBuffer())
        let s = ''; for (let k = 0; k < buf.length; k += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(k, k + 0x8000))
        return { ok: true, b64: btoa(s), type: out.file.type, outName: out.file.name, width: out.width, height: out.height, decoder: out.decoder, warnings: out.warnings, ms: Math.round(performance.now() - t0) }
      } catch (e) { return { ok: false, error: String(e.message || e).slice(0, 200) } }
    }, it)
    if (r.ok) {
      const dir = path.join(outDir, it.folder); fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, r.outName), Buffer.from(r.b64, 'base64'))
      results.push({ ...it, outName: r.outName, type: r.type, width: r.width, height: r.height, bytes: Buffer.from(r.b64, 'base64').length, decoder: r.decoder, warnings: r.warnings, ms: r.ms })
    } else results.push({ ...it, error: r.error })
    if (i % 16 === 0) console.log(`${i}/${list.length}`)
  }
  fs.writeFileSync(path.join(outDir, '..', 'converted.json'), JSON.stringify(results, null, 1))
  const err = results.filter((x) => x.error)
  console.log('gata:', results.length - err.length, 'convertite,', err.length, 'erori'); err.forEach((x) => console.log('  ', x.folder, x.name, x.error))
  await b.close()
})()
