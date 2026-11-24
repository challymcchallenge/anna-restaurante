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
    expect(rooms.find((r) => r.name === 'Apartamente VIP Riviera')?.description).toContain('+40 742 220 060')
  })

  it('Întrebări: 8, fără dubluri; 3 cu răspuns și îndemn, celelalte „Provizoriu”', async () => {
    const faqs = await all('faqs')
    expect(faqs).toHaveLength(8)
    expect(new Set(faqs.map((f) => `${f.group}|${f.question}`)).size).toBe(8)
    const answered = faqs.filter((f) => !f.placeholder)
    expect(answered.map((f) => f.question)).toEqual([
      'Pot veni cu copiii?',
      'Cum rezerv un salon pentru un eveniment?',
      'Puteți pregăti un meniu personalizat?',
    ])
    for (const f of answered) expect(lexicalText(f.answer)).not.toMatch(/de confirmat/)
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
