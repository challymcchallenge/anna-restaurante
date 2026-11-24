// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { lexicalText, seedStarterContent } from '@/seed/starter'
import seed from '../../seed/trattoria-da-vittoria.json'

/**
 * D-58 (G8-3): descrierile saloanelor și camerelor, faptele hotelului și răspunsurile la întrebări,
 * din davittoria.ro și hotelanna.ro. Saloanele și camerele rămân „Provizoriu” până vin fotografiile.
 * Doar pe baza locală.
 */

let payload: Payload
let tenantId: number

const all = async (collection: 'faqs' | 'salons' | 'room-types') =>
  (await payload.find({ collection, where: { tenant: { equals: tenantId } }, limit: 50, depth: 0, sort: '_order' })).docs as unknown as Record<
    string,
    unknown
  >[]
const home = async () =>
  (await payload.find({ collection: 'home-page', where: { tenant: { equals: tenantId } }, limit: 1, depth: 0 })).docs[0] as unknown as {
    id: number
    hotel: Record<string, unknown>
  }

describe('D-58 · saloane, camere, hotel, întrebări', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: 'trattoria-da-vittoria' } }, limit: 1 })
    tenantId = (docs[0]?.id ??
      (await payload.create({ collection: 'tenants', data: { name: 'Trattoria da Vittoria', slug: 'trattoria-da-vittoria' } as never })).id) as number
    await seedStarterContent({ payload })
  })

  it('Saloane și camere: textele noi, în limite; eticheta rămâne până vin fotografiile', async () => {
    for (const s of await all('salons')) {
      expect(String(s.description).length, String(s.name)).toBeLessThanOrEqual(300)
      expect(s.description, String(s.name)).not.toMatch(/de înlocuit/)
      expect(s.placeholder, String(s.name)).toBe(true)
    }
    const rooms = await all('room-types')
    for (const r of rooms) expect(String(r.description).length, String(r.name)).toBeLessThanOrEqual(160)
    // D-59 (G9-2): aceeași recepție ca Hotel ANNA, deci fără alt număr în descriere.
    const vip = String(rooms.find((r) => r.name === 'Apartamente VIP Riviera')?.description)
    expect(vip).toContain('Riviera Events')
    expect(vip).not.toMatch(/742/)
  })

  it('Întrebări (D-59): 7, fără dubluri, toate cu răspuns; 5 pe Acasă', async () => {
    const faqs = await all('faqs')
    expect(faqs).toHaveLength(7)
    expect(new Set(faqs.map((f) => `${f.group}|${f.question}`)).size).toBe(7)
    expect(faqs.filter((f) => f.placeholder)).toHaveLength(0)
    expect(faqs.filter((f) => f.group === 'home')).toHaveLength(5)
    for (const f of faqs) expect(lexicalText(f.answer), String(f.question)).not.toMatch(/de confirmat/)
    const parking = faqs.find((f) => f.question === 'Aveți parcare?')
    expect(lexicalText(parking?.answer)).toContain('peste 150 de locuri')
  })

  it('D-59: dotările saloanelor, Pizza din cuptorul pe lemne, titlul Bucătăriei', async () => {
    for (const s of await all('salons'))
      expect((s.amenities as { label: string }[]).map((a) => a.label), String(s.name)).toEqual([
        'Catering la cerere',
        'Meniu personalizat',
        'Platouri pentru evenimente',
      ])
    const pizza = (await payload.find({ collection: 'dish-categories', where: { and: [{ tenant: { equals: tenantId } }, { name: { equals: 'Pizza' } }] }, depth: 0 })).docs[0]
    expect(pizza.shortText).toBe('Din cuptorul pe lemne, cu făină din Italia')
    const h = (await payload.find({ collection: 'home-page', where: { tenant: { equals: tenantId } }, limit: 1, depth: 0 })).docs[0] as unknown as Record<string, Record<string, string>>
    expect(h.kitchen.title).toBe('Cuptor pe lemne, făină și ingrediente din Italia.')
    expect(h.privateEvents.intro).toMatch(/catering la cerere și o gamă largă de platouri/)
  })

  it('Hotel: micul dejun, parcarea, copiii; prețul „de la 320”', async () => {
    const h = await home()
    expect(h.hotel.intro).toMatch(/copiii până la 5 ani stau gratuit/)
    expect(h.hotel.priceFrom).toBe(320)
    expect(h.hotel.priceNote).toBe('pe noapte, cu mic dejun inclus')
  })

  it('A doua schimbare a aceluiași câmp (version) rulează o dată și ocolește un text scris din panou', async () => {
    const swap = (seed as unknown as { swaps: { field: string; version?: string; from: unknown; to: unknown }[] }).swaps.find(
      (s) => s.field === 'hotel.intro' && s.version === 'g8-3',
    )!
    const key = 'swap:home-page:hotel.intro:g8-3'
    const clearLog = async () => {
      const t = (await payload.find({ collection: 'tenants', where: { id: { equals: tenantId } }, depth: 0 })).docs[0]
      const log = { ...((t.starterContentLog as Record<string, string>) ?? {}) }
      delete log[key]
      await payload.update({ collection: 'tenants', id: tenantId, data: { starterContentLog: log } as never })
    }
    const setIntro = async (intro: unknown) => {
      const h = await home()
      await payload.update({ collection: 'home-page', id: h.id, data: { hotel: { ...h.hotel, intro } } as never })
    }
    await setIntro(swap.from)
    await clearLog()
    await seedStarterContent({ payload })
    expect((await home()).hotel.intro).toBe(swap.to)

    await setIntro('Textul scris de Alin.')
    await clearLog()
    await seedStarterContent({ payload })
    expect((await home()).hotel.intro).toBe('Textul scris de Alin.')
    await setIntro(swap.to)
  })
})
