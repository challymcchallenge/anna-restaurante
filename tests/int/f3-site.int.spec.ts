// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { pageMediaCredits } from '@/lib/site/credits'
import type { SiteData } from '@/lib/site/data'
import { hoursSummary, price, telHref } from '@/lib/site/format'
import { navItems, orderedSections } from '@/lib/site/sections'
import { seedStarterContent } from '@/seed/starter'

/**
 * F3 pașii 1–3: logica site-ului public, fără browser.
 * - navigarea se construiește din secțiunile pornite, în ordinea din panou; ce nu încape în antet
 *   merge în panoul de navigare;
 * - formatele (telefon, program, preț);
 * - conținutul de pornire pune fotografiile provizorii doar în câmpurile goale, o singură dată;
 * - creditele foto apar o singură dată pe pagină.
 */

let payload: Payload
let tenantId: number

const home = (sections: Record<string, unknown>) => sections as unknown as SiteData['home']

describe('F3 · site public', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'tenants',
      where: { slug: { equals: 'trattoria-da-vittoria' } },
      limit: 1,
    })
    tenantId = (docs[0]?.id ??
      (
        await payload.create({
          collection: 'tenants',
          data: { name: 'Trattoria da Vittoria', slug: 'trattoria-da-vittoria' } as any,
        })
      ).id) as number
  })

  it('Navigarea: doar secțiunile pornite, construite și cu etichetă, în ordinea din panou', () => {
    const h = home({
      hero: { enabled: true, order: 1, menuLabel: 'Acasă' },
      stay: { enabled: true, order: 2, menuLabel: 'Cazare' },
      kitchen: { enabled: true, order: 4, menuLabel: 'Bucătăria' },
      wines: { enabled: false, order: 3, menuLabel: 'Vinuri' },
      reviews: { enabled: true, order: 3, menuLabel: 'Recenzii' },
      contact: { enabled: true, order: 0, menuLabel: 'Contact' },
    })
    expect(orderedSections(h).map((s) => s.key)).toEqual(['contact', 'hero', 'stay', 'reviews', 'kitchen'])
    const items = navItems(h)
    // Acasă nu apare (logo-ul duce acolo); Vinuri e oprită; ordinea vine din panou (Contact are 0).
    expect(items.map((i) => i.label)).toEqual(['Contact', 'Cazare', 'Recenzii', 'Bucătăria'])
    expect(items.map((i) => i.href)).toEqual(['/#contact', '/#cazare', '/#recenzii', '/#bucataria'])
    // 4 etichete nu încap la 1024 px (cu „Mai mult”), deci ultimele două apar de la 1280 px.
    expect(items.map((i) => i.tier)).toEqual([1, 1, 2, 2])
  })

  it('Navigarea: ce nu încape în antet trece în „Mai mult”, în ordine', () => {
    const item = (n: number, menuLabel: string) => ({ enabled: true, order: n, menuLabel })
    // 4 etichete de 10 litere (≈ 120 px fiecare): la 1024 px încap 2 lângă „Mai mult”, de la 1280 px toate.
    const ten = navItems(home({ stay: item(1, 'Abcdefghij'), kitchen: item(2, 'Abcdefghij'), wines: item(3, 'Abcdefghij'), reviews: item(4, 'Abcdefghij') }))
    expect(ten.map((i) => i.tier)).toEqual([1, 1, 2, 2])
    // Etichete lungi: doar prima în antet; restul în panou, la orice lățime.
    const long = 'Etichetă destul de lungă'
    const many = navItems(home({ stay: item(1, long), kitchen: item(2, long), wines: item(3, long), reviews: item(4, long) }))
    expect(many.map((i) => i.tier)).toEqual([1, 3, 3, 3])
  })

  it('Formate: telefon, program, preț', () => {
    expect(telHref('+40 356 630 238')).toBe('tel:+40356630238')
    expect(telHref('0764 816 462')).toBe('tel:0764816462')
    expect(telHref('123')).toBeNull()
    const week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => ({ day, opens: '08:00', closes: '24:00' }))
    expect(hoursSummary(week as any)).toEqual(['Zilnic 8:00–24:00'])
    const mixed = week.map((d) => (d.day === 'sun' ? { ...d, closed: true } : d))
    expect(hoursSummary(mixed as any)).toEqual(['Luni–Sâmbătă: 8:00–24:00', 'Duminică: închis'])
    expect(price(135)).toBe('135 lei')
    expect(price(37.5)).toBe('37,50 lei')
  })

  it('D-66: fotografiile demo (Wikimedia) au fost scoase și nu revin la următorul build', async () => {
    await seedStarterContent({ payload })
    const demo = await payload.find({
      collection: 'media',
      where: { and: [{ tenant: { equals: tenantId } }, { credit: { contains: 'Wikimedia Commons' } }] },
      depth: 0,
      limit: 50,
    })
    expect(demo.docs).toHaveLength(0)
    const { docs } = await payload.find({ collection: 'home-page', where: { tenant: { equals: tenantId } }, limit: 1, depth: 1 })
    const hero: any = docs[0]?.hero
    expect(hero?.posterDesktop ?? null).toBeNull()
    // Textele din același grup rămân neatinse.
    expect(hero?.subtitle).toBeTruthy()
    const pizza = await payload.find({
      collection: 'dish-categories',
      where: { and: [{ tenant: { equals: tenantId } }, { name: { equals: 'Pizza' } }] },
      limit: 1,
      depth: 0,
    })
    expect(pizza.docs[0]?.photo ?? null).toBeNull()
  })

  it('Creditele foto: fiecare o dată, doar pentru imaginile din secțiunile pornite', () => {
    const photo = (credit: string) => ({ id: 1, url: '/x.webp', credit }) as any
    const site = {
      home: home({ hero: { enabled: true, posterDesktop: photo('A, CC BY 2.0'), posterMobile: photo('A, CC BY 2.0') }, kitchen: { enabled: false } }),
      dishCategories: [{ photo: photo('B, CC0') }],
      wines: [],
    } as unknown as SiteData
    expect(pageMediaCredits(site)).toEqual(['A, CC BY 2.0'])
  })
})
