// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import config from '@/payload.config'
import { lexicalDeepText, lexicalText, seedStarterContent, toLexical } from '@/seed/starter'

/**
 * F5 (G15-1, D-80): paginile Cookies și Confidențialitate aveau pe producție textele site-ului Riviera
 * Events, puse din panou. Seed-ul le înlocuiește o singură dată cu varianta adaptată pentru Trattoria,
 * doar dacă textul e încă cel Riviera (inclusiv un fragment dintr-o listă), și le marchează „Provizoriu”.
 * Un text scris altfel din panou rămâne. Doar pe baza locală.
 */
vi.mock('next/cache', () => ({ unstable_cache: <T,>(fn: T) => fn, revalidateTag: () => {} }))

let payload: Payload
let tenantId: number

const text = (t: string, format = 0) => ({ type: 'text', text: t, format, mode: 'normal', style: '', detail: 0, version: 1 })
/** Ca pe producție: titlu, paragraf cu bold și link, listă. */
const rivieraLike = (marker: 'heading' | 'list') => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      { type: 'heading', tag: 'h2', version: 1, children: [text(marker === 'heading' ? 'Ce folosește rivieraevents.ro' : 'Cine ne ajută')] },
      {
        type: 'paragraph',
        version: 1,
        children: [text('Scrieți-ne la ', 0), { type: 'autolink', version: 2, fields: { url: 'mailto:x@y.ro' }, children: [text('x@y.ro', 1)] }],
      },
      {
        type: 'list',
        tag: 'ul',
        listType: 'bullet',
        version: 1,
        children: [{ type: 'listitem', value: 1, version: 1, children: [text('Web3Forms', 1), text(' transmite mesajele din formular.')] }],
      },
    ],
  },
})

async function page(slug: string) {
  const { docs } = await payload.find({
    collection: 'legal-pages',
    where: { and: [{ tenant: { equals: tenantId } }, { slug: { equals: slug } }] },
    limit: 1,
    depth: 0,
  })
  return docs[0]
}

async function clearLog(prefix: string) {
  const t = (await payload.find({ collection: 'tenants', where: { id: { equals: tenantId } }, depth: 0 })).docs[0]
  const log = { ...((t.starterContentLog as Record<string, string>) ?? {}) }
  for (const k of Object.keys(log)) if (k.startsWith(prefix) && k.endsWith(':2026-11-25-g15')) delete log[k]
  await payload.update({ collection: 'tenants', id: tenantId, data: { starterContentLog: log } as never })
}

describe('F5 · G15-1 · textele legale Riviera înlocuite pentru Trattoria', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: 'trattoria-da-vittoria' } }, limit: 1 })
    tenantId = docs[0].id as number
    await seedStarterContent({ payload })
  })

  it('textul din listă se vede la căutare (lexicalText citea doar paragrafele și titlurile)', () => {
    const doc = rivieraLike('list')
    expect(lexicalText(doc)).not.toContain('Web3Forms')
    expect(lexicalDeepText(doc)).toContain('Web3Forms transmite mesajele')
    expect(lexicalDeepText(doc)).toContain('x@y.ro')
  })

  it('Cookies și Confidențialitate cu text Riviera → varianta Trattoria, „Provizoriu”; un text al juristului rămâne', async () => {
    const cookies = await page('cookies')
    const privacy = await page('confidentialitate')
    const original = { cookies: cookies.content, privacy: privacy.content, cp: cookies.placeholder, pp: privacy.placeholder }
    try {
      await payload.update({ collection: 'legal-pages', id: cookies.id, data: { content: rivieraLike('heading') as never, placeholder: false } })
      await payload.update({ collection: 'legal-pages', id: privacy.id, data: { content: rivieraLike('list') as never, placeholder: false } })
      await clearLog('swap:legal-pages:')
      await seedStarterContent({ payload })
      const c = await page('cookies')
      const p = await page('confidentialitate')
      expect(lexicalDeepText(c.content)).toContain('Ce folosește site-ul Trattoria da Vittoria')
      expect(lexicalDeepText(c.content)).toContain('cookies-consent')
      expect(lexicalDeepText(c.content)).not.toContain('rivieraevents.ro')
      expect(c.placeholder).toBe(true)
      expect(lexicalDeepText(p.content)).toContain('le păstrăm 12 luni')
      expect(lexicalDeepText(p.content)).not.toContain('Web3Forms')
      expect(p.placeholder).toBe(true)

      // Textul final al juristului (fără Riviera) nu se atinge, nici dacă seed-ul rulează din nou.
      await payload.update({ collection: 'legal-pages', id: c.id, data: { content: toLexical('Textul juristului.') as never } })
      await clearLog('swap:legal-pages:')
      await seedStarterContent({ payload })
      expect(lexicalText((await page('cookies')).content)).toBe('Textul juristului.')
    } finally {
      await payload.update({ collection: 'legal-pages', id: cookies.id, data: { content: original.cookies as never, placeholder: original.cp } })
      await payload.update({ collection: 'legal-pages', id: privacy.id, data: { content: original.privacy as never, placeholder: original.pp } })
    }
  })
})
