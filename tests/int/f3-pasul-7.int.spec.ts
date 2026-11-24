// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { pageMediaCredits } from '@/lib/site/credits'
import type { SiteData } from '@/lib/site/data'
import { requestHref } from '@/lib/site/requests'
import { navItems, orderedSections } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'
import { seedStarterContent } from '@/seed/starter'

/**
 * F3 pasul 7 · Cazare la Hotel ANNA (content-model 4.9, 5.6, D-15):
 * - secțiunea apare pe Acasă și în meniu (/#hotel), în ordinea din panou;
 * - „Cere ofertă de cazare” duce la Contact cu subiectul Cazare (pornit în Setări, cu destinatar);
 * - linkul spre site-ul hotelului își scrie singur numele domeniului;
 * - creditele foto includ fotografiile hotelului și ale camerelor, doar cu secțiunea pornită;
 * - conținutul de pornire are 2 tipuri de camere și o recenzie de hotel, marcate „Exemplu”.
 * Doar pe baza locală (tests/helpers/env.ts refuză producția).
 */

let payload: Payload
let tenantId: number

const home = (sections: Record<string, unknown>) => sections as unknown as SiteData['home']

describe('F3 · pasul 7 · Hotel ANNA', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: 'trattoria-da-vittoria' } }, limit: 1 })
    tenantId = (docs[0]?.id ??
      (
        await payload.create({
          collection: 'tenants',
          data: { name: 'Trattoria da Vittoria', slug: 'trattoria-da-vittoria' } as never,
        })
      ).id) as number
    await seedStarterContent({ payload })
  })

  it('Secțiunea apare pe Acasă și în meniu, la ancora #hotel', () => {
    const h = home({
      pizza: { order: 8, menuLabel: 'Cursuri de pizza' },
      hotel: { order: 9, menuLabel: 'Hotel ANNA' },
    })
    expect(orderedSections(h).map((s) => s.key)).toEqual(['pizza', 'hotel'])
    expect(navItems(h).map((i) => i.href)).toEqual(['/#cursuri-pizza', '/#hotel'])
    expect(orderedSections(home({ hotel: { order: 9, enabled: false } }))).toEqual([])
  })

  it('Cererea de ofertă: Contact cu subiectul Cazare; linkul hotelului își scrie domeniul', () => {
    const settings = { requests: { accommodation: { active: true, recipients: ['x@example.com'] } } } as never
    expect(requestHref(settings, 'accommodation')).toBe('/contact?subiect=cazare')
    expect(UI.visitSite('https://www.hotelanna.ro')).toBe('Vezi hotelanna.ro')
    expect(UI.visitSite('nu-e-adresa')).toBe('Vezi site-ul hotelului')
  })

  it('Creditele foto: fotografiile hotelului și ale camerelor, doar cu secțiunea pornită', () => {
    const photo = (credit: string) => ({ id: credit, url: '/x.webp', credit }) as never
    const site = (enabled: boolean) =>
      ({
        home: home({ hotel: { enabled, photos: [photo('Hotel, CC BY 4.0')] } }),
        dishCategories: [],
        wines: [],
        eventsUpcoming: [],
        salons: [],
        roomTypes: [{ photo: photo('Cameră, CC0') }, { photo: photo('Hotel, CC BY 4.0') }],
      }) as unknown as SiteData
    expect(pageMediaCredits(site(true))).toEqual(['Hotel, CC BY 4.0', 'Cameră, CC0'])
    expect(pageMediaCredits(site(false))).toEqual([])
  })

  it('Conținutul de pornire: 2 tipuri de camere și o recenzie de hotel, marcate „Exemplu”', async () => {
    const rooms = await payload.find({ collection: 'room-types', where: { tenant: { equals: tenantId } }, sort: '_order', depth: 0 })
    expect(rooms.docs.map((r) => r.name)).toEqual(expect.arrayContaining(['Camere Premium', 'Apartamente VIP Riviera']))
    expect(rooms.docs.every((r) => r.placeholder)).toBe(true)
    const reviews = await payload.find({
      collection: 'reviews',
      where: { and: [{ tenant: { equals: tenantId } }, { group: { equals: 'hotel' } }] },
      depth: 0,
    })
    expect(reviews.totalDocs).toBeGreaterThanOrEqual(1)
    expect(reviews.docs.every((r) => r.placeholder)).toBe(true)
  })
})
