// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { navItems, type NavEntry } from '@/lib/site/sections'
import type { HomePage } from '@/payload-types'
import { seedStarterContent } from '@/seed/starter'

/**
 * D-60: meniul de navigare se ordonează și se afișează din „Setări → Meniu de navigare”; lista
 * goală păstrează meniul automat din secțiunile Acasă. Doar pe baza locală (pentru seed).
 */

const home = {
  hero: { menuLabel: 'Acasă', order: 1 },
  stay: { menuLabel: 'Cazare', order: 2 },
  kitchen: { menuLabel: 'Bucătăria', order: 3 },
  wines: { menuLabel: 'Vinuri', order: 4 },
  reviews: { menuLabel: 'Recenzii', order: 5 },
  parties: { menuLabel: 'Petreceri', order: 6, enabled: false },
  contact: { menuLabel: 'Contact', order: 11 },
} as unknown as HomePage

let payload: Payload

describe('D-60 · meniul de navigare din Setări', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await seedStarterContent({ payload })
  })

  it('Lista goală: meniul automat, ca înainte (secțiunile pornite, în ordinea de pe Acasă)', () => {
    expect(navItems(home, []).map((i) => i.label)).toEqual(['Cazare', 'Bucătăria', 'Vinuri', 'Recenzii', 'Contact'])
    expect(navItems(home, null)).toEqual(navItems(home, []))
  })

  it('Ordinea, eticheta proprie, „Ascuns”, „Doar în «Mai mult»”, pagina proprie, secțiunea oprită', () => {
    const nav: NavEntry[] = [
      { target: 'wines', display: 'header', label: 'Vinul casei' },
      { target: 'kitchen', display: 'header' },
      { target: 'stay', display: 'hidden' },
      { target: 'parties', display: 'header' }, // oprită în Pagina Acasă: nu apare
      { target: 'pageWines', display: 'more' },
      { target: 'contact', display: 'header' },
    ]
    const items = navItems(home, nav)
    expect(items.map((i) => [i.label, i.href])).toEqual([
      ['Vinul casei', '/#vinuri'],
      ['Bucătăria', '/#bucataria'],
      ['Lista de vinuri', '/catalog-vinuri'],
      ['Contact', '/#contact'],
    ])
    expect(items.find((i) => i.href === '/catalog-vinuri')?.tier).toBe(3)
    expect(items.find((i) => i.label === 'Vinul casei')?.tier).toBe(1)
  })

  it('Seed: meniul de acum, completat o singură dată (10 secțiuni, „În antet”)', async () => {
    const { docs } = await payload.find({ collection: 'settings', limit: 1, depth: 0 })
    const nav = (docs[0] as unknown as { navigation?: NavEntry[] }).navigation ?? []
    expect(nav.map((n) => n.target)).toEqual(['stay', 'kitchen', 'wines', 'reviews', 'parties', 'privateEvents', 'pizza', 'hotel', 'gallery', 'contact'])
    expect(nav.every((n) => n.display === 'header')).toBe(true)
  })
})
