// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { incompleteTranslations, translateDocument } from '@/lib/translate/service'

/**
 * F4, completarea traducerilor: un text prea lung pentru limita câmpului primește o a treia încercare (scurtarea propriei
 * traduceri), iar bucățile rămase în română sunt găsite și completate. Fără rețea: traducător fals.
 */

let payload: Payload
let tenantId: number

beforeAll(async () => {
  payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: 'trattoria-da-vittoria' } }, limit: 1, depth: 0 })
  tenantId = docs[0].id as number
})

/** Prima traducere iese prea lungă; scurtarea (care primește textul „LONG…”) întoarce un text scurt. */
const fake = async (items: { id: string; text: string; max?: number }[]) => ({
  texts: new Map(items.map((i) => [i.id, i.text.startsWith('LONG') ? 'Short and correct.' : `LONG ${'x'.repeat(400)}`])),
  inputTokens: 0,
  outputTokens: 0,
})

describe('F4 · scurtarea și completarea traducerilor', () => {
  it('un text peste limită e scurtat la a treia încercare, nu rămâne în română', async () => {
    const faq = (await payload.find({ collection: 'faqs', where: { tenant: { equals: tenantId } }, limit: 1, depth: 0 })).docs[0]
    const r = await translateDocument(payload, { collection: 'faqs', id: faq.id, locales: ['sv'], terms: [], translate: fake as never })
    expect(r.outcomes[0].ok).toBe(true)
    const sv = await payload.findByID({ collection: 'faqs', id: faq.id, locale: 'sv', fallbackLocale: false, depth: 0 })
    expect(sv.question).toBe('Short and correct.')
    expect(sv.i18nStatus).toBe('auto')
  })

  it('o bucată identică cu româna într-un document „tradus automat” e găsită', async () => {
    const faq = (await payload.find({ collection: 'faqs', where: { tenant: { equals: tenantId } }, limit: 1, depth: 0 })).docs[0]
    await payload.update({ collection: 'faqs', id: faq.id, locale: 'sv', data: { question: faq.question } as never, depth: 0, context: { i18nAuto: true } })
    const found = await incompleteTranslations(payload, tenantId, ['sv'])
    const hit = found.find((f) => f.collection === 'faqs' && f.id === faq.id)
    expect(hit?.paths).toContain('sv:question')
    // Completarea o repară.
    await translateDocument(payload, { collection: 'faqs', id: faq.id, locales: ['sv'], terms: [], translate: fake as never })
    const after = await incompleteTranslations(payload, tenantId, ['sv'])
    expect(after.find((f) => f.collection === 'faqs' && f.id === faq.id)).toBeUndefined()
  })

  it('mai multe limbi pe același document: fiecare limbă își păstrează traducerea (salvări pe rând)', async () => {
    const home = (await payload.find({ collection: 'home-page', where: { tenant: { equals: tenantId } }, limit: 1, depth: 0 })).docs[0]
    const tag = async (items: { id: string; text: string }[], locale: string) => ({
      texts: new Map(items.map((i) => [i.id, `${locale}:${i.text}`.slice(0, 40)])),
      inputTokens: 0,
      outputTokens: 0,
    })
    const r = await translateDocument(payload, { collection: 'home-page', id: home.id, locales: ['it', 'fr', 'de'], terms: [], translate: tag as never })
    expect(r.outcomes.every((o) => o.ok)).toBe(true)
    for (const l of ['it', 'fr', 'de'] as const) {
      const d = (await payload.findByID({ collection: 'home-page', id: home.id, locale: l, fallbackLocale: false, depth: 0 })) as unknown as {
        kitchen: { title: string }
        privateEvents: { eventTypes?: { label: string }[] }
      }
      expect(d.kitchen.title.startsWith(`${l}:`), l).toBe(true)
      for (const t of d.privateEvents.eventTypes ?? []) expect(t.label.startsWith(`${l}:`), `${l} eventTypes`).toBe(true)
    }
  })
})
