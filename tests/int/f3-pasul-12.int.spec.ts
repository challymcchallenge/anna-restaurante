// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { UI } from '@/lib/site/strings'
import { lexicalText, seedStarterContent } from '@/seed/starter'
import seed from '../../seed/trattoria-da-vittoria.json'

/**
 * F3 pasul 12 (D-54): textele finale ale secțiunilor intră o singură dată, doar unde textul e încă
 * cel vechi; eticheta „Exemplu” iese de pe secțiunile fără fotografii demo. Doar pe baza locală.
 */

let payload: Payload
let tenantId: number

type Swap = { collection: string; field: string; from: unknown; to: unknown; match?: unknown }
const swaps = (seed as unknown as { swaps: Swap[] }).swaps.filter((s) => s.collection === 'home-page')
const textOf = (v: unknown) => (v && typeof v === 'object' && '$richText' in v ? String((v as { $richText: string }).$richText) : v)
const LIMITS: Record<string, number> = {
  'kitchen.title': 50,
  'kitchen.intro': 160,
  'parties.intro': 160,
  'parties.emptyMessage': 120,
  'privateEvents.intro': 200,
  'pizza.shortText': 300,
  'pizza.fullText': 1200,
  'hotel.intro': 300,
  'contact.intro': 160,
}

const home = async () =>
  (await payload.find({ collection: 'home-page', where: { tenant: { equals: tenantId } }, limit: 1, depth: 0 })).docs[0] as unknown as Record<
    string,
    Record<string, unknown>
  > & { id: number }

describe('F3 pasul 12 · textele finale', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: 'trattoria-da-vittoria' } }, limit: 1 })
    tenantId = (docs[0]?.id ??
      (await payload.create({ collection: 'tenants', data: { name: 'Trattoria da Vittoria', slug: 'trattoria-da-vittoria' } as never })).id) as number
    await seedStarterContent({ payload })
  })

  it('Textele noi: în limitele din content-model, fără „!” și fără liniuță lungă', () => {
    for (const [field, max] of Object.entries(LIMITS)) {
      const swap = swaps.find((s) => s.field === field)
      expect(swap, field).toBeTruthy()
      const text = String(textOf(swap!.to))
      expect(text.length, field).toBeLessThanOrEqual(max)
      expect(text, field).not.toMatch(/[!—]/)
    }
  })

  it('Pe baza locală: textele noi sunt pe Acasă; eticheta rămâne doar unde sunt fotografii demo', async () => {
    const h = await home()
    expect(h.kitchen.title).toBe('Bucătăria, de la antipasti la desert.')
    expect(h.contact.intro).toMatch(/te sunăm noi\.$/)
    expect(lexicalText(h.pizza.fullText)).toContain('Cum îl înscrii')
    expect(lexicalText(h.pizza.fullText)).not.toContain('Q-11')
    for (const g of ['stay', 'kitchen', 'reviews', 'parties', 'privateEvents', 'gallery', 'contact']) expect(h[g].placeholder, g).toBe(false)
    for (const g of ['hero', 'pizza', 'hotel']) expect(h[g].placeholder, g).toBe(true)
  })

  it('Ca pe producție: textul vechi se schimbă; un text scris din panou rămâne', async () => {
    const swap = swaps.find((s) => s.field === 'contact.intro')!
    const key = `swap:home-page:contact.intro`
    const clearLog = async () => {
      const t = (await payload.find({ collection: 'tenants', where: { id: { equals: tenantId } }, depth: 0 })).docs[0]
      const log = { ...((t.starterContentLog as Record<string, string>) ?? {}) }
      delete log[key]
      await payload.update({ collection: 'tenants', id: tenantId, data: { starterContentLog: log } as never })
    }
    const setIntro = async (intro: unknown) => {
      const h = await home()
      await payload.update({ collection: 'home-page', id: h.id, data: { contact: { ...h.contact, intro } } as never })
    }

    await setIntro(swap.from)
    await clearLog()
    await seedStarterContent({ payload })
    expect((await home()).contact.intro).toBe(swap.to)

    await setIntro('Textul scris de Alin.')
    await clearLog()
    await seedStarterContent({ payload })
    expect((await home()).contact.intro).toBe('Textul scris de Alin.')

    await setIntro(swap.to)
  })

  it('Descrierea Acasă fără subtitlu: numele, adresa și programul din Setări', () => {
    expect(UI.homeMeta('Restaurant X', 'Strada Y nr. 1, Oraș', ['Zilnic 8:00–24:00'])).toBe(
      'Restaurant X, Strada Y nr. 1, Oraș. Program: Zilnic 8:00–24:00.',
    )
    expect(UI.homeMeta('Restaurant X', '', [])).toBe('Restaurant X.')
  })
})
