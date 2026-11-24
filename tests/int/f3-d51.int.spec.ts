// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { mapQuery } from '@/components/site/ContactSection'
import type { SiteData } from '@/lib/site/data'
import { validatePhone } from '@/fields'
import { lexicalText, seedStarterContent } from '@/seed/starter'

/**
 * D-51 (răspunsurile G6): destinatarii pe subiect intră o singură dată din seed, fără să atingă un
 * subiect configurat altfel din panou; telefonul și emailul recepției Hotel ANNA; harta caută după
 * coordonate, altfel după adresă. Doar pe baza locală (tests/helpers/env.ts refuză producția).
 */

let payload: Payload
let tenantId: number

const settingsOf = async () =>
  (await payload.find({ collection: 'settings', where: { tenant: { equals: tenantId } }, limit: 1, depth: 0 })).docs[0]
const clearLog = async (key: string) => {
  const t = (await payload.find({ collection: 'tenants', where: { id: { equals: tenantId } }, depth: 0 })).docs[0]
  const log = { ...((t.starterContentLog as Record<string, string>) ?? {}) }
  delete log[key]
  await payload.update({ collection: 'tenants', id: tenantId, data: { starterContentLog: log } as never })
}

describe('D-51 · destinatari, recepția hotelului, harta', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: 'trattoria-da-vittoria' } }, limit: 1 })
    tenantId = (docs[0]?.id ??
      (await payload.create({ collection: 'tenants', data: { name: 'Trattoria da Vittoria', slug: 'trattoria-da-vittoria' } as never })).id) as number
    await seedStarterContent({ payload })
  })

  it('Destinatarii: un subiect gol se completează; unul scris altfel din panou rămâne', async () => {
    const before = await settingsOf()
    const original = before.requests
    const requests = {
      ...(before.requests as object),
      privateEvent: { active: false, recipients: [], cc: [] },
      question: { active: true, recipients: ['altcineva@exemplu.ro'], cc: [] },
    }
    await payload.update({ collection: 'settings', id: before.id, data: { requests } as never })
    await clearLog('requests:2026-11-24')
    await seedStarterContent({ payload })

    const after = (await settingsOf()).requests as Record<string, { active?: boolean; recipients?: string[]; cc?: string[] }>
    expect(after.privateEvent.active).toBe(true)
    expect(after.privateEvent.recipients).toHaveLength(5)
    expect(after.privateEvent.cc).toEqual(['catalinamohora@gmail.com', 'alin.labau@gmail.com'])
    expect(after.question.recipients).toEqual(['altcineva@exemplu.ro'])
    expect(after.accommodation.recipients?.[0]).toBe('rezervari@hotelanna.ro')

    await payload.update({ collection: 'settings', id: before.id, data: { requests: original } as never })
  })

  it('Recepția Hotel ANNA: telefonul și emailul, în Pagina Acasă → Hotel', async () => {
    const home = (await payload.find({ collection: 'home-page', where: { tenant: { equals: tenantId } }, depth: 0 })).docs[0]
    expect(home.hotel?.hotelPhone).toBe('+40 253 206 333')
    expect(home.hotel?.hotelEmail).toBe('rezervari@hotelanna.ro')
  })

  it('Harta: coordonatele, dacă sunt în Setări, altfel adresa', () => {
    const site = (address: object) => ({ settings: { address } }) as unknown as SiteData
    expect(mapQuery(site({ street: 'Strada Victoriei nr. 8', city: 'Târgu Jiu', country: 'România' }))).toBe(
      'Strada Victoriei nr. 8, Târgu Jiu, România',
    )
    expect(mapQuery(site({ street: 'x', city: 'y', lat: 45.0355, lng: 23.2741 }))).toBe('45.0355,23.2741')
    expect(mapQuery(site({}))).toBeNull()
  })

  it('D-52: telefoanele cu prefix internațional; telefonul pentru cursul de pizza; FAQ actualizată', async () => {
    expect(validatePhone('0764 816 462')).toMatch(/prefixul internațional/)
    expect(validatePhone('+40 764 816 462')).toBe(true)
    expect(validatePhone('+40 72')).toMatch(/prea scurt/)
    const s = await settingsOf()
    expect([s.phoneReservations, s.phoneEvents, s.phonePizza]).toEqual(['+40 356 630 238', '+40 764 816 462', '+40 727 417 498'])
    const { docs } = await payload.find({
      collection: 'faqs',
      where: { and: [{ tenant: { equals: tenantId } }, { question: { equals: 'Cum rezerv un salon pentru un eveniment?' } }] },
      depth: 0,
    })
    expect(lexicalText(docs[0]?.answer)).toBe('Din pagina Evenimente private sau la telefon +40 764 816 462.')
  })
})
