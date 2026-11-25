// Analiza fotografiilor descărcate: dimensiuni, SHA-256, amprentă perceptuală (dHash 64 biți),
// claritate (varianța Laplacianului pe 512 px), luminozitate medie. HEIC: doar ce poate citi sharp.
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
const root = process.argv[2]
const out = []
for (const folder of readdirSync(join(root, 'orig'))) {
  for (const name of readdirSync(join(root, 'orig', folder))) {
    const p = join(root, 'orig', folder, name)
    const buf = readFileSync(p)
    const rec = { folder, name, bytes: statSync(p).size, sha: createHash('sha256').update(buf).digest('hex').slice(0, 16) }
    if (/\.mp4$/i.test(name)) { rec.kind = 'clip'; out.push(rec); continue }
    try {
      const img = sharp(buf, { failOn: 'none' }).rotate()
      const meta = await sharp(buf).metadata()
      const swap = (meta.orientation ?? 1) >= 5
      rec.width = swap ? meta.height : meta.width; rec.height = swap ? meta.width : meta.height
      rec.format = meta.format; rec.alpha = meta.hasAlpha
      const g = await img.clone().greyscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer()
      let bits = ''
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits += g[y * 9 + x] > g[y * 9 + x + 1] ? '1' : '0'
      rec.dhash = BigInt('0b' + bits).toString(16).padStart(16, '0')
      const small = img.clone().greyscale().resize(512, 512, { fit: 'inside' })
      const { data } = await small.clone().raw().toBuffer({ resolveWithObject: true })
      rec.brightness = Math.round(data.reduce((s, v) => s + v, 0) / data.length)
      const lap = await small.clone().convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0], offset: 128 }).raw().toBuffer()
      const mean = lap.reduce((s, v) => s + v, 0) / lap.length
      rec.sharpness = Math.round(lap.reduce((s, v) => s + (v - mean) ** 2, 0) / lap.length)
      rec.kind = 'photo'
    } catch (e) { rec.kind = 'error'; rec.error = String(e.message).slice(0, 120) }
    out.push(rec)
  }
}
writeFileSync(join(root, 'analysis.json'), JSON.stringify(out, null, 1))
console.log('analizate:', out.length, '| erori:', out.filter((r) => r.kind === 'error').map((r) => `${r.folder}/${r.name}: ${r.error}`).join(' ; ') || 0)
