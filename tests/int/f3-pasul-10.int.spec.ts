// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import config from '@/payload.config'
import { legalHeadings } from '@/components/site/LegalContent'
import { getSlugPage } from '@/lib/site/data'
import { lexicalText, seedStarterContent, toLexical } from '@/seed/starter'

/**
 * F3 pasul 10: paginile legale la adresa scurtă, cu titluri ancorate și cuprins; o adresă care nu
 * e pagină legală poate fi o redirecționare din panou (R5); altfel 404. Doar pe baza locală.
 */
vi.mock('next/cache', () => ({ unstable_cache: <T,>(fn: T) => fn, revalidateTag: () => {} }))

let payload: Payload
let tenantId: number

type Block = { type: string; tag?: string; children?: { text?: string }[] }
const blocks = (doc: unknown) => (doc as { root: { children: Block[] } }).root.children

describe('F3 pasul 10 · paginile legale și redirecționările', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: 'trattoria-da-vittoria' } }, limit: 1 })
    tenantId = (docs[0]?.id ??
      (await payload.create({ collection: 'tenants', data: { name: 'Trattoria da Vittoria', slug: 'trattoria-da-vittoria' } as never })).id) as number
    await seedStarterContent({ payload })
  })

  it('toLexical: titlul ține primul rând, restul blocului devine paragraf sau listă', () => {
    const doc = toLexical('Intro.\n\n## Ce date primim\nNumele și telefonul.\n\n### Detaliu\n\n## Unde\n- Supabase\n- Vercel')
    expect(blocks(doc).map((b) => b.tag ?? b.type)).toEqual(['paragraph', 'h2', 'paragraph', 'h3', 'h2', 'ul'])
    expect(blocks(doc)[2].children?.[0].text).toBe('Numele și telefonul.')
    expect(blocks(doc)[5].children).toHaveLength(2)
    // Textul fără titluri rămâne paragraful vechi, ca înainte (swaps compară cu lexicalText).
    expect(lexicalText(toLexical('Unu.\n\nDoi.'))).toBe('Unu.\n\nDoi.')
  })

  it('Cuprinsul: doar titlurile h2, cu ancore fără diacritice', () => {
    const toc = legalHeadings(toLexical('## Cine răspunde de date\nx\n\n### Sub\n\n## Drepturile tale'))
    expect(toc).toEqual([
      { id: 'cine-raspunde-de-date', text: 'Cine răspunde de date' },
      { id: 'drepturile-tale', text: 'Drepturile tale' },
    ])
  })

  it('Seed: cele 3 pagini legale au ciorna cu titluri, etichetată „Exemplu”', async () => {
    for (const slug of ['termeni', 'confidentialitate', 'cookies']) {
      const { docs } = await payload.find({
        collection: 'legal-pages',
        where: { and: [{ tenant: { equals: tenantId } }, { slug: { equals: slug } }] },
        limit: 1,
        depth: 0,
      })
      const page = docs[0]
      expect(page, slug).toBeTruthy()
      expect(page.placeholder, slug).toBe(true)
      expect(legalHeadings(page.content).length, slug).toBeGreaterThanOrEqual(4)
      expect(lexicalText(page.content), slug).toContain('[de completat')
    }
  })

  it('Ca pe producție: textul provizoriu vechi devine ciorna cu titluri; un text scris din panou rămâne', async () => {
    const seed = (await import('../../seed/trattoria-da-vittoria.json')).default as unknown as {
      swaps: { collection: string; match?: { slug: string }; field: string; from: { $richText: string } }[]
    }
    const swap = seed.swaps.find((s) => s.collection === 'legal-pages' && s.match?.slug === 'cookies')!
    const key = `swap:legal-pages:${JSON.stringify(swap.match)}:content`
    const find = async () =>
      (
        await payload.find({
          collection: 'legal-pages',
          where: { and: [{ tenant: { equals: tenantId } }, { slug: { equals: 'cookies' } }] },
          limit: 1,
          depth: 0,
        })
      ).docs[0]
    const clearLog = async () => {
      const t = (await payload.find({ collection: 'tenants', where: { id: { equals: tenantId } }, depth: 0 })).docs[0]
      const log = { ...((t.starterContentLog as Record<string, string>) ?? {}) }
      delete log[key]
      await payload.update({ collection: 'tenants', id: tenantId, data: { starterContentLog: log } as never })
    }
    const page = await find()
    const draft = page.content

    await payload.update({ collection: 'legal-pages', id: page.id, data: { content: toLexical(swap.from.$richText) as never } })
    await clearLog()
    await seedStarterContent({ payload })
    expect(legalHeadings((await find()).content).map((h) => h.id)).toContain('servicii-terte')

    await payload.update({ collection: 'legal-pages', id: page.id, data: { content: toLexical('Textul juristului.') as never } })
    await clearLog()
    await seedStarterContent({ payload })
    expect(lexicalText((await find()).content)).toBe('Textul juristului.')

    await payload.update({ collection: 'legal-pages', id: page.id, data: { content: draft as never } })
  })

  it('Adresa scurtă: pagină legală, redirecționare din panou sau nimic', async () => {
    const legal = await getSlugPage(tenantId, 'confidentialitate')
    expect(legal.page?.slug).toBe('confidentialitate')
    expect(legal.redirect).toBeNull()

    const nutrition = await getSlugPage(tenantId, 'valori-nutritionale')
    expect(nutrition.page).toBeNull()
    expect(nutrition.redirect).toEqual({ to: 'https://www.meniudigital.ro/trattoriadavittoria', permanent: true })

    const none = await getSlugPage(tenantId, 'nu-exista')
    expect(none).toEqual({ page: null, redirect: null })
  })
})
