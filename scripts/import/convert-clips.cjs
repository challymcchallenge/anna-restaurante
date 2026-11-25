/* eslint-disable @typescript-eslint/no-require-imports -- script CommonJS rulat cu Playwright-ul global (NODE_PATH), vezi README */
const { chromium } = require('playwright')
const fs = require('fs'), path = require('path')
;(async () => {
  const [base, srcDir, outDir] = process.argv.slice(2)
  fs.mkdirSync(outDir, { recursive: true })
  const b = await chromium.launch(); const p = await b.newPage()
  await p.goto(base + '/e2e/index.html')
  const res = []
  for (const name of fs.readdirSync(srcDir).sort()) {
    const r = await p.evaluate(async (name) => {
      const blob = await (await fetch(`/import/orig/Videos/${encodeURIComponent(name)}`)).blob()
      const { convertClip } = await import('/e2e/convert.js')
      const out = await convertClip(new File([blob], name, { type: 'video/mp4' }), () => {})
      const b64 = async (f) => { const u = new Uint8Array(await f.arrayBuffer()); let s = ''; for (let k = 0; k < u.length; k += 0x8000) s += String.fromCharCode.apply(null, u.subarray(k, k + 0x8000)); return btoa(s) }
      return { files: [[out.h264.name, await b64(out.h264)], ...(out.efficient ? [[out.efficient.name, await b64(out.efficient)]] : []), [out.poster.name, await b64(out.poster)]], dur: out.durationSeconds, w: out.width, h: out.height, audio: out.audio, note: out.audioNote, eff: out.efficientCodec }
    }, name)
    for (const [n, d] of r.files) fs.writeFileSync(path.join(outDir, n), Buffer.from(d, 'base64'))
    res.push({ name, dur: r.dur, w: r.w, h: r.h, audio: r.audio, note: r.note, eff: r.eff, files: r.files.map(([n, d]) => [n, Math.round(Buffer.from(d, 'base64').length / 1024) + ' KB']) })
  }
  fs.writeFileSync(path.join(outDir, '..', 'clips.json'), JSON.stringify(res, null, 1))
  res.forEach((x) => console.log(x.name, x.dur + ' s', `${x.w}×${x.h}`, 'sunet:', x.audio, x.note || '', '|', x.files.map((f) => f.join(' ')).join(', ')))
  await b.close()
})()
