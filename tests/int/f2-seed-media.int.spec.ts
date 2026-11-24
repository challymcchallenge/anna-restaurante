// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { seedStarterContent } from '@/seed/starter'

/**
 * F2 · logo-urile primite de la Alin ajung în Biblioteca media a Trattoriei (seed/trattoria-da-vittoria.json → media)
 * și completează în Setări „Logo principal” și „Logo grup”, doar dacă sunt goale. A doua rulare nu dublează nimic.
 * Doar pe baza locală (tests/helpers/env.ts refuză producția).
 */

let payload: Payload
let tenantId: number

describe('F2 · logo-uri în Biblioteca media', () => {
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

  it('Încarcă cele 3 logo-uri ca „Logo” și le leagă în Setări', async () => {
    await seedStarterContent({ payload })
    const { docs: media } = await payload.find({
      collection: 'media',
      where: { and: [{ tenant: { equals: tenantId } }, { kind: { equals: 'logo' } }] },
      limit: 10,
      depth: 0,
    })
    const byTitle = Object.fromEntries(media.map((m: any) => [m.title, m]))
    expect(Object.keys(byTitle)).toEqual(
      expect.arrayContaining([
        'Logo Trattoria da Vittoria',
        'Logo Grupul ANNA',
        'Logo Grupul ANNA, orizontal, pe fundal deschis',
        'Logo Grupul ANNA, orizontal, pe fundal închis',
        'Logo BizTech Consulting (realizator)',
      ]),
    )
    expect(byTitle['Logo Trattoria da Vittoria'].mimeType).toBe('image/png')
    expect(byTitle['Logo Trattoria da Vittoria'].width).toBe(1024)

    const { docs: settings } = await payload.find({
      collection: 'settings',
      where: { tenant: { equals: tenantId } },
      limit: 1,
      depth: 0,
    })
    expect(settings[0].logo).toBe(byTitle['Logo Trattoria da Vittoria'].id)
    // D-46: logo-ul orizontal al grupului, negru pe fundal deschis și alb pe fundal închis.
    expect(settings[0].logoGroup).toBe(byTitle['Logo Grupul ANNA, orizontal, pe fundal deschis'].id)
    expect(settings[0].logoGroupDark).toBe(byTitle['Logo Grupul ANNA, orizontal, pe fundal închis'].id)
  })

  it('A doua rulare nu dublează logo-urile', async () => {
    const report = await seedStarterContent({ payload })
    for (const r of report) expect(r.created).toEqual({})
    const { totalDocs } = await payload.count({
      collection: 'media',
      where: {
        and: [
          { tenant: { equals: tenantId } },
          { title: { equals: 'Logo Trattoria da Vittoria' } },
        ],
      },
    })
    expect(totalDocs).toBe(1)
  })
})
