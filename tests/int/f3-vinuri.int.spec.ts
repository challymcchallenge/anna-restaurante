// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import type { WineRow } from '@/lib/site/data'
import { amount } from '@/lib/site/format'
import { byOrigin, byTypeGroups, searchText, typesIn, vintageLabel, volumeIfOther, volumeMl, wineTitle } from '@/lib/site/wines'
import { seedStarterContent } from '@/seed/starter'

/**
 * Lista de vinuri (D-46):
 * - lista reală din seed/trattoria-da-vittoria.json (153 de vinuri, 5 recomandate din fiecare tip) înlocuiește
 *   o singură dată exemplele; vinurile puse de Administrator nu se șterg și nu se dublează;
 * - schimbările de pornire (titlul secțiunii, logo-ul grupului) nu ating ce a schimbat Administratorul;
 * - rândul unui vin: NV, volumul, gruparea pe țară · regiune, căutarea fără diacritice.
 * Doar pe baza locală (tests/helpers/env.ts refuză producția).
 */

let payload: Payload
let tenantId: number

const wine = (w: Partial<WineRow>): WineRow =>
  ({ id: 1, name: 'Vin', type: 'red', priceBottle: 100, volume: '0.75', ...w }) as WineRow

describe('F3 · lista de vinuri (D-46)', () => {
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

  it('Lista reală: 153 de vinuri, 5 recomandate din fiecare tip, fără exemple', async () => {
    const { docs } = await payload.find({
      collection: 'wines',
      where: { tenant: { equals: tenantId } },
      limit: 1000,
      pagination: false,
      depth: 0,
    })
    const fromList = docs.filter((w) => w.externalCode?.startsWith('inventar-'))
    expect(fromList).toHaveLength(153)
    expect(docs.filter((w) => w.placeholder)).toHaveLength(0)
    const featured = (t: string) => docs.filter((w) => w.featured && w.type === t).length
    expect([featured('sparkling'), featured('white'), featured('rose'), featured('red')]).toEqual([5, 5, 5, 5])

    const sole = docs.find((w) => w.name === 'Sole Chardonnay Barrique' && w.vintage === 2025)
    expect([sole?.priceBottle, sole?.priceGlass, sole?.appellation]).toEqual([140, 23, 'D.O.C. – C.M.D. Recaș'])
    // Anul 2026 e imposibil în noiembrie 2026: vinul rămâne în panou, ascuns până la confirmare.
    expect(docs.find((w) => w.name === 'Pinot Grigio Friuli')?.available).toBe(false)
    const dp = docs.find((w) => w.producer === 'Dom Pérignon' && w.name === 'Vintage Brut')
    expect([dp?.priceBottle, dp?.vintage, dp?.region, dp?.country]).toEqual([2000, 2012, 'Champagne', 'Franța'])
    expect(docs.find((w) => w.producer === 'Catleya' && w.name === 'Perfect Simplu Rosé')?.volume).toBe('1.5')
  })

  it('A doua versiune a listei: șterge doar exemplele, păstrează și nu dublează vinurile Administratorului', async () => {
    const { docs: tenants } = await payload.find({ collection: 'tenants', where: { id: { equals: tenantId } }, depth: 0 })
    const log = { ...((tenants[0].starterContentLog as Record<string, string>) ?? {}) }
    const example = await payload.create({
      collection: 'wines',
      data: { name: 'Exemplu de șters', type: 'red', priceBottle: 1, volume: '0.75', placeholder: true, tenant: tenantId },
    })
    // Un vin din listă, șters și pus la loc de Administrator (fără eticheta de exemplu).
    const { docs: ruinart } = await payload.find({
      collection: 'wines',
      where: { and: [{ tenant: { equals: tenantId } }, { producer: { equals: 'Ruinart' } }] },
      depth: 0,
    })
    expect(ruinart).toHaveLength(1)

    delete log['list:wines:2026-11-19']
    await payload.update({ collection: 'tenants', id: tenantId, data: { starterContentLog: log } as never })
    const report = await seedStarterContent({ payload })
    expect(report[0]?.created).toEqual({ 'wines:lista': 0, 'wines:exemple-sterse': 1 })

    const after = await payload.find({ collection: 'wines', where: { id: { equals: example.id } }, depth: 0 })
    expect(after.totalDocs).toBe(0)
    const again = await payload.count({
      collection: 'wines',
      where: { and: [{ tenant: { equals: tenantId } }, { producer: { equals: 'Ruinart' } }] },
    })
    expect(again.totalDocs).toBe(1)
  })

  it('Schimbările de pornire nu ating ce a schimbat Administratorul', async () => {
    const { docs: homes } = await payload.find({ collection: 'home-page', where: { tenant: { equals: tenantId } }, depth: 0 })
    const home = homes[0]
    const { docs: tenants } = await payload.find({ collection: 'tenants', where: { id: { equals: tenantId } }, depth: 0 })
    const log = { ...((tenants[0].starterContentLog as Record<string, string>) ?? {}) }

    // 1. Titlul vechi de pornire → se schimbă în „Lista de vinuri”.
    await payload.update({
      collection: 'home-page',
      id: home.id,
      data: { wines: { ...home.wines, title: 'Pentru fiecare fel, un vin pe măsură.' } } as never,
    })
    delete log['swap:home-page:wines.title']
    await payload.update({ collection: 'tenants', id: tenantId, data: { starterContentLog: log } as never })
    await seedStarterContent({ payload })
    let current = (await payload.findByID({ collection: 'home-page', id: home.id, depth: 0 })).wines
    expect(current?.title).toBe('Lista de vinuri')

    // 2. Un titlu scris de Administrator → rămâne.
    await payload.update({
      collection: 'home-page',
      id: home.id,
      data: { wines: { ...current, title: 'Pivnița noastră' } } as never,
    })
    const { docs: t2 } = await payload.find({ collection: 'tenants', where: { id: { equals: tenantId } }, depth: 0 })
    const log2 = { ...((t2[0].starterContentLog as Record<string, string>) ?? {}) }
    delete log2['swap:home-page:wines.title']
    await payload.update({ collection: 'tenants', id: tenantId, data: { starterContentLog: log2 } as never })
    await seedStarterContent({ payload })
    current = (await payload.findByID({ collection: 'home-page', id: home.id, depth: 0 })).wines
    expect(current?.title).toBe('Pivnița noastră')

    await payload.update({ collection: 'home-page', id: home.id, data: { wines: { ...current, title: 'Lista de vinuri' } } as never })
  })

  it('Rândul unui vin: NV, volumul, suma fără monedă', () => {
    expect(vintageLabel(wine({ vintage: null }))).toBe('NV')
    expect(vintageLabel(wine({ vintage: 2012 }))).toBe('2012')
    expect([volumeMl('0.75'), volumeMl('1.5'), volumeMl('0.375')]).toEqual(['750 ml', '1.500 ml', '375 ml'])
    expect([volumeIfOther('0.75'), volumeIfOther('1.5')]).toEqual([null, '1,5 l'])
    expect([amount(2000), amount(950)]).toEqual(['2.000', '950'])
    expect(wineTitle(wine({ producer: 'Dom Pérignon', name: 'Vintage Brut' }))).toBe('Dom Pérignon Vintage Brut')
  })

  it('Gruparea: pe tip în ordinea fixă, apoi țara · regiunea în ordinea din panou; căutarea fără diacritice', () => {
    const list = [
      wine({ id: 1, type: 'red', country: 'Italia', region: 'Piemont' }),
      wine({ id: 2, type: 'sparkling', country: 'Franța', region: 'Champagne' }),
      wine({ id: 3, type: 'red', country: 'România', region: 'Banat', producer: 'Cramele Recaș', name: 'Selene Fetească Neagră' }),
      wine({ id: 4, type: 'red', country: 'Italia', region: 'Piemont' }),
    ]
    expect(typesIn(list)).toEqual(['sparkling', 'red'])
    expect(byTypeGroups(list).map((g) => g.wines.map((w) => w.id))).toEqual([[2], [1, 3, 4]])
    expect(byOrigin(byTypeGroups(list)[1].wines).map((o) => [o.origin, o.wines.length])).toEqual([
      ['Italia · Piemont', 2],
      ['România · Banat', 1],
    ])
    expect(searchText(list[2])).toContain('feteasca neagra')
    expect(searchText(list[2])).toContain('recas')
  })
})
