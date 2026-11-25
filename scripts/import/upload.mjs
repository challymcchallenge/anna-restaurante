// Încărcarea în galerie prin POST /api/media-import (D-75). Reluabil: starea în <lucru>/upload-state.json.
// Utilizare: node scripts/import/upload.mjs <baseUrl> <lucru> <plan.json> [--only=N] [--dry]
// Codul de import: pe producție îl adaugă proxy-ul sesiunii (antetul x-import-token); local, din LOCAL_IMPORT_TOKEN.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [base, work, planPath, ...flags] = process.argv.slice(2)
const only = Number((flags.find((f) => f.startsWith('--only=')) || '').split('=')[1]) || Infinity
const dry = flags.includes('--dry')
const TENANT = 'trattoria-da-vittoria'
const plan = JSON.parse(readFileSync(planPath, 'utf8'))
const statePath = join(work, 'upload-state.json')
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : {}
const save = () => writeFileSync(statePath, JSON.stringify(state, null, 1))
const header = process.env.LOCAL_IMPORT_TOKEN ? ['-H', `x-import-token: ${process.env.LOCAL_IMPORT_TOKEN}`] : []

function curl(args) {
  const out = execFileSync('curl', ['-sS', '--max-time', '180', '-w', '\n%{http_code}', ...header, ...args], { encoding: 'utf8', maxBuffer: 10e6 })
  const i = out.lastIndexOf('\n')
  const status = Number(out.slice(i + 1)), body = out.slice(0, i)
  let data; try { data = JSON.parse(body) } catch { data = { raw: body.slice(0, 300) } }
  if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data).slice(0, 300)}`)
  return data
}
function upload(key, path, mime, data) {
  if (state[key]) return state[key]
  if (dry) return (state[key] = `dry-${key}`)
  const r = curl(['-X', 'POST', '--form-string', `data=${JSON.stringify({ ...data, tenantSlug: TENANT })}`, '-F', `file=@${path};type=${mime}`, `${base}/api/media-import`])
  state[key] = r.id; save()
  console.log(`${r.existing ? '=' : '+'} ${key} → media #${r.id}`)
  return r.id
}

let n = 0
for (const it of plan) {
  if (it.status !== 'import' || n >= only) continue
  n++
  const title = `Galerie · ${it.folder} · ${it.code}`
  if (it.clip) {
    const dir = join(work, 'clips'), stem = it.file.replace(/\.mp4$/, '')
    const poster = upload(`${title} · poster`, join(dir, `${stem}-poster.jpg`), 'image/jpeg', { kind: 'video-poster', title: `${title} · poster`, alt: '' })
    const av1 = existsSync(join(dir, `${stem}-av1.mp4`)) ? upload(`${title} · AV1`, join(dir, `${stem}-av1.mp4`), 'video/mp4', { kind: 'video-variant', title: `${title} · AV1`, codec: 'av1' }) : null
    const meta = JSON.parse(readFileSync(join(work, 'clips.json'), 'utf8')).find((c) => c.name === it.file)
    upload(title, join(dir, it.file), 'video/mp4', { kind: 'clip', title, alt: it.alt, originalName: it.file, durationSeconds: meta?.dur, poster, ...(av1 ? { efficientVariant: av1 } : {}), codec: `H.264${av1 ? ' + AV1' : ''} · cu sunet` })
  } else {
    const path = join(work, 'conv', it.folder, it.file)
    upload(title, path, 'image/jpeg', { kind: 'photo', title, alt: it.alt, originalName: it.file, originalBytes: statSync(path).size, ...(it.kids ? { hasChildren: true, parentalConsent: true } : {}) })
  }
}

// Elementele de galerie, în ordinea planului (pe categorii, apoi după număr); clipurile la sfârșitul categoriei lor.
const order = ['Restaurant', 'Specialități', 'Saloane private', 'Catering', 'Il Ritmo della Notte', 'Last Christmas "26', 'Kinder pizzaioli', 'Echipa ANNA']
const items = []
for (const cat of order) for (const clip of [false, true]) for (const it of plan) {
  if (it.category !== cat || Boolean(it.clip) !== clip || it.status === 'exclude') continue
  const file = it.status === 'reuse' ? it.reuseMediaId : state[`Galerie · ${it.folder} · ${it.code}`]
  if (file) items.push({ file, category: it.categoryId, onHome: it.onHome })
}
if (!dry && n >= plan.filter((i) => i.status === 'import').length) {
  for (let i = 0; i < items.length; i += 25) {
    const r = curl(['-X', 'POST', '-H', 'content-type: application/json', '--data-binary', JSON.stringify({ action: 'gallery', tenantSlug: TENANT, items: items.slice(i, i + 25) }), `${base}/api/media-import`])
    console.log(`galerie ${i + 1}–${i + r.items.length}: ${r.items.filter((x) => !x.existing).length} noi, ${r.items.filter((x) => x.existing).length} existente`)
  }
} else console.log(`fișiere: ${n}; elemente de galerie pregătite: ${items.length}${dry ? ' (probă, fără încărcare)' : ' (galeria se creează după toate fișierele)'}`)
