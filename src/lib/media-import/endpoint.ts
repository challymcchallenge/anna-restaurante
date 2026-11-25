import { createHash, timingSafeEqual } from 'node:crypto'
import type { Endpoint, PayloadRequest } from 'payload'

/**
 * `POST /api/media-import` (D-75): importul temporar al fotografiilor lui Alin în galerie.
 *
 * - Merge doar cât există `MEDIA_IMPORT_TOKEN` în Vercel (cel puțin 32 de caractere); altfel răspunde 404.
 * - Cererea trebuie să aibă antetul `x-import-token` egal cu el (comparat în timp constant). Valoarea
 *   o pune Alin și în formularul securizat al sesiunii; nu apare în cod, în repo sau în conversație.
 * - Poate crea fișiere media (fotografii, clipuri și variantele lor) și elemente de galerie, pentru un
 *   restaurant. D-77: poate și schimba trei lucruri, cerute de Alin: bifele „Pe Acasă” din galerie, ordinea
 *   unor elemente din galerie (doar între ele, cu cheile lor de ordine) și cadrele copertei. Nu șterge nimic.
 * - E sigură la reluare: un fișier cu același titlu intern sau un element de galerie cu același fișier
 *   nu se creează a doua oară; se întoarce cel existent.
 *
 * După import, Alin șterge `MEDIA_IMPORT_TOKEN` din Vercel și adresa nu mai răspunde.
 */

const json = (body: unknown, status = 200) => Response.json(body, { status })

const MAX_BYTES = 4_000_000
const KINDS = ['photo', 'clip', 'video-poster', 'video-variant'] as const
const MEDIA_FIELDS = [
  'kind',
  'alt',
  'title',
  'originalName',
  'originalBytes',
  'durationSeconds',
  'codec',
  'poster',
  'efficientVariant',
  'hasChildren',
  'parentalConsent',
] as const

/** Codul primit e cel din Vercel? Fără cod setat (sau prea scurt), importul e oprit. */
export function importTokenOk(header: string | null | undefined, expected = process.env.MEDIA_IMPORT_TOKEN): boolean {
  if (!expected || expected.length < 32 || !header) return false
  const a = createHash('sha256').update(header).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

/** Doar câmpurile permise, cu titlul intern marcat ca import. */
export function pickMediaData(data: Record<string, unknown>): Record<string, unknown> | string {
  const kind = data.kind as (typeof KINDS)[number]
  if (!KINDS.includes(kind)) return `Tip nepermis: ${String(data.kind)}`
  if (typeof data.title !== 'string' || !data.title.trim()) return 'Lipsește titlul intern (cheia de reluare).'
  const out: Record<string, unknown> = {}
  for (const k of MEDIA_FIELDS) if (data[k] !== undefined) out[k] = data[k]
  return out
}

async function tenantId(req: PayloadRequest, slug: unknown): Promise<number | null> {
  if (typeof slug !== 'string' || !slug) return null
  const r = await req.payload.find({ collection: 'tenants', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })
  return (r.docs[0]?.id as number | undefined) ?? null
}

async function createMedia(req: PayloadRequest): Promise<Response> {
  if (!req.formData) return json({ error: 'Cererea nu are fișier (multipart).' }, 400)
  const form = await req.formData()
  const file = form.get('file')
  let data: Record<string, unknown>
  try {
    data = JSON.parse(String(form.get('data') ?? '{}'))
  } catch {
    return json({ error: 'Câmpul „data” nu e JSON valid.' }, 400)
  }
  if (!(file instanceof Blob) || !file.size) return json({ error: 'Lipsește fișierul.' }, 400)
  if (file.size > MAX_BYTES) return json({ error: `Fișierul are ${file.size} octeți; limita este ${MAX_BYTES}.` }, 400)
  const fields = pickMediaData(data)
  if (typeof fields === 'string') return json({ error: fields }, 400)
  const tenant = await tenantId(req, data.tenantSlug)
  if (!tenant) return json({ error: 'Restaurant necunoscut.' }, 400)

  const existing = await req.payload.find({
    collection: 'media',
    where: { and: [{ title: { equals: fields.title } }, { tenant: { equals: tenant } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs[0]) return json({ id: existing.docs[0].id, existing: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  const name = (file as File).name || 'fisier'
  const doc = await req.payload.create({
    collection: 'media',
    data: { ...fields, tenant } as never,
    file: { data: buffer, mimetype: file.type, name, size: buffer.length },
    overrideAccess: true,
    locale: 'ro',
  })
  return json({ id: doc.id, created: true })
}

type GalleryItem = { file: number; category: number; onHome?: boolean }

async function createGallery(req: PayloadRequest, body: { tenantSlug?: string; items?: GalleryItem[] }): Promise<Response> {
  const tenant = await tenantId(req, body.tenantSlug)
  if (!tenant) return json({ error: 'Restaurant necunoscut.' }, 400)
  const items = Array.isArray(body.items) ? body.items.slice(0, 50) : []
  const out: { file: number; id: number | string; existing?: boolean }[] = []
  for (const it of items) {
    if (!Number.isInteger(it.file) || !Number.isInteger(it.category)) return json({ error: 'Element nevalid.', out }, 400)
    const found = await req.payload.find({
      collection: 'gallery',
      where: { and: [{ file: { equals: it.file } }, { tenant: { equals: tenant } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (found.docs[0]) {
      out.push({ file: it.file, id: found.docs[0].id, existing: true })
      continue
    }
    const doc = await req.payload.create({
      collection: 'gallery',
      data: { file: it.file, category: it.category, onHome: Boolean(it.onHome), active: true, placeholder: false, tenant } as never,
      overrideAccess: true,
      locale: 'ro',
    })
    out.push({ file: it.file, id: doc.id })
  }
  return json({ items: out })
}

/** Lista de id-uri: întregi, fără dubluri, între `min` și `max` elemente. */
export function idList(v: unknown, min: number, max: number): number[] | null {
  if (!Array.isArray(v) || v.length < min || v.length > max) return null
  if (!v.every((x) => Number.isInteger(x) && x > 0)) return null
  return new Set(v).size === v.length ? (v as number[]) : null
}

/** Cadrele copertei: 1–5, fiecare cu imagine de desktop și de telefon. */
export function slideList(v: unknown): { desktop: number; mobile: number }[] | null {
  if (!Array.isArray(v) || v.length < 1 || v.length > 5) return null
  const ok = v.every((s) => s && Number.isInteger(s.desktop) && Number.isInteger(s.mobile))
  return ok ? v.map((s) => ({ desktop: s.desktop, mobile: s.mobile })) : null
}

type ManageBody = { action?: string; tenantSlug?: string; fileIds?: unknown; slides?: unknown }

/** D-77: „Pe Acasă” exact pentru aceste fișiere (cel mult 8); restul elementelor pierd bifa. */
async function homeGallery(req: PayloadRequest, tenant: number, body: ManageBody): Promise<Response> {
  const ids = idList(body.fileIds, 1, 8)
  if (!ids) return json({ error: 'fileIds: între 1 și 8 id-uri de fișiere, fără dubluri.' }, 400)
  const own = { tenant: { equals: tenant } }
  const wanted = await req.payload.find({ collection: 'gallery', where: { and: [own, { file: { in: ids } }] }, limit: 20, depth: 0, overrideAccess: true })
  if (wanted.docs.length !== ids.length) return json({ error: 'Unele fișiere nu sunt în galerie.', found: wanted.docs.length }, 400)
  const off = await req.payload.find({ collection: 'gallery', where: { and: [own, { onHome: { equals: true } }, { file: { not_in: ids } }] }, limit: 50, depth: 0, overrideAccess: true })
  for (const d of off.docs) await req.payload.update({ collection: 'gallery', id: d.id, data: { onHome: false } as never, overrideAccess: true })
  for (const d of wanted.docs) if (!d.onHome) await req.payload.update({ collection: 'gallery', id: d.id, data: { onHome: true } as never, overrideAccess: true })
  return json({ onHome: ids, cleared: off.docs.length })
}

/** D-77: aceleași chei de ordine, redistribuite între elementele date, în ordinea dată. */
async function reorderGallery(req: PayloadRequest, tenant: number, body: ManageBody): Promise<Response> {
  const ids = idList(body.fileIds, 2, 60)
  if (!ids) return json({ error: 'fileIds: între 2 și 60 de id-uri de fișiere, fără dubluri.' }, 400)
  const found = await req.payload.find({ collection: 'gallery', where: { and: [{ tenant: { equals: tenant } }, { file: { in: ids } }] }, limit: 100, depth: 0, overrideAccess: true })
  if (found.docs.length !== ids.length) return json({ error: 'Unele fișiere nu sunt în galerie.', found: found.docs.length }, 400)
  const byFile = new Map(found.docs.map((d) => [typeof d.file === 'object' ? (d.file as { id: number }).id : (d.file as number), d]))
  const keys = found.docs.map((d) => String((d as { _order?: string })._order ?? '')).sort()
  if (keys.some((k) => !k)) return json({ error: 'Element fără cheie de ordine.' }, 400)
  for (const [i, fileId] of ids.entries()) {
    const doc = byFile.get(fileId)!
    if ((doc as { _order?: string })._order !== keys[i]) await req.payload.update({ collection: 'gallery', id: doc.id, data: { _order: keys[i] } as never, overrideAccess: true })
  }
  return json({ order: ids })
}

/** D-77: cadrele copertei (Pagina Acasă → Hero → Cadre de slideshow); restul copertei rămâne neatins. */
async function heroSlides(req: PayloadRequest, tenant: number, body: ManageBody): Promise<Response> {
  const slides = slideList(body.slides)
  if (!slides) return json({ error: 'slides: 1–5 cadre, fiecare cu desktop și mobile (id-uri de fișiere).' }, 400)
  const home = await req.payload.find({ collection: 'home-page', where: { tenant: { equals: tenant } }, limit: 1, depth: 0, overrideAccess: true })
  if (!home.docs[0]) return json({ error: 'Pagina Acasă lipsește.' }, 400)
  await req.payload.update({ collection: 'home-page', id: home.docs[0].id, data: { hero: { slides } } as never, overrideAccess: true, locale: 'ro' })
  return json({ slides: slides.length })
}

export const mediaImportEndpoint: Endpoint = {
  path: '/media-import',
  method: 'post',
  handler: async (req) => {
    if (!process.env.MEDIA_IMPORT_TOKEN) return json({ error: 'Not found' }, 404)
    if (!importTokenOk(req.headers.get('x-import-token'))) return json({ error: 'Cod de import greșit.' }, 401)
    const type = req.headers.get('content-type') ?? ''
    if (type.includes('multipart/form-data')) return createMedia(req)
    const body = (await req.json?.().catch(() => ({}))) as ManageBody & { items?: GalleryItem[] }
    if (body?.action === 'gallery') return createGallery(req, body)
    if (['homeGallery', 'reorderGallery', 'heroSlides'].includes(String(body?.action))) {
      const tenant = await tenantId(req, body.tenantSlug)
      if (!tenant) return json({ error: 'Restaurant necunoscut.' }, 400)
      if (body.action === 'homeGallery') return homeGallery(req, tenant, body)
      if (body.action === 'reorderGallery') return reorderGallery(req, tenant, body)
      return heroSlides(req, tenant, body)
    }
    return json({ error: 'Acțiune necunoscută.' }, 400)
  },
}
