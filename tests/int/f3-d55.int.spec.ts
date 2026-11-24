// @vitest-environment node
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { ReviewCard } from '@/components/site/ReviewCard'
import type { Review } from '@/payload-types'
import { seedStarterContent } from '@/seed/starter'

/**
 * D-55, D-56: recenziile reale de pe Google, în română, înlocuiesc o singură dată exemplele; o recenzie adăugată din
 * panou rămâne; citatul în altă limbă primește `lang`; fără dată apare doar sursa. Doar local.
 */

let payload: Payload
let tenantId: number

const reviewsOf = async (group: 'restaurant' | 'hotel') =>
  (
    await payload.find({
      collection: 'reviews',
      where: { and: [{ tenant: { equals: tenantId } }, { group: { equals: group } }, { active: { equals: true } }] },
      sort: '_order',
      limit: 50,
      depth: 0,
    })
  ).docs

describe('D-55 · recenziile reale', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: 'trattoria-da-vittoria' } }, limit: 1 })
    tenantId = (docs[0]?.id ??
      (await payload.create({ collection: 'tenants', data: { name: 'Trattoria da Vittoria', slug: 'trattoria-da-vittoria' } as never })).id) as number
    await seedStarterContent({ payload })
  })

  it('7 + 7 recenzii reale, fără exemple; primele 3 sunt cele alese pentru Acasă', async () => {
    const restaurant = await reviewsOf('restaurant')
    const hotel = await reviewsOf('hotel')
    expect(restaurant.filter((r) => !r.placeholder).map((r) => r.author).slice(0, 3)).toEqual(['Dodo D.', 'Mihai M.', 'Vlad D.'])
    expect(hotel.filter((r) => !r.placeholder).map((r) => r.author).slice(0, 3)).toEqual(['Mihaela, România', 'Christopher, Australia', 'Adina, România'])
    const all = [...restaurant, ...hotel]
    expect(all.filter((r) => r.placeholder)).toHaveLength(0)
    expect(all.filter((r) => r.source === 'google' && r.language === 'ro' && r.rating === 5 && !r.date).length).toBeGreaterThanOrEqual(14)
    // D-56: în română, la cererea lui Alin.
    expect(restaurant[0].text).toMatch(/^De departe cel mai bun restaurant din oraș\./)
    for (const r of all) expect(r.text, r.author).not.toMatch(/\p{Extended_Pictographic}/u)
  })

  it('O recenzie scrisă din panou rămâne când lista se aplică din nou', async () => {
    const mine = await payload.create({
      collection: 'reviews',
      data: { tenant: tenantId, author: 'Recenzia lui Alin', group: 'restaurant', text: 'Text din panou.', source: 'google', language: 'ro' } as never,
    })
    const t = (await payload.find({ collection: 'tenants', where: { id: { equals: tenantId } }, depth: 0 })).docs[0]
    const log = { ...((t.starterContentLog as Record<string, string>) ?? {}) }
    delete log['list:reviews:2026-11-24-google']
    await payload.update({ collection: 'tenants', id: tenantId, data: { starterContentLog: log } as never })
    await seedStarterContent({ payload })

    const restaurant = await reviewsOf('restaurant')
    expect(restaurant.some((r) => r.id === mine.id)).toBe(true)
    expect(restaurant.filter((r) => r.author === 'Dodo D.')).toHaveLength(1)
    await payload.delete({ collection: 'reviews', id: mine.id })
  })

  it('Cardul: citatul în engleză are lang="en"; fără dată apare doar „Google”', () => {
    const base = { id: 1, author: 'Ana, Olanda', group: 'hotel', text: 'The apartment is huge.', source: 'google', rating: 5 }
    const en = renderToStaticMarkup(React.createElement(ReviewCard, { review: { ...base, language: 'en' } as unknown as Review }))
    expect(en).toContain('<blockquote lang="en">')
    expect(en).toMatch(/review-source">Google<\/span>/)
    const ro = renderToStaticMarkup(React.createElement(ReviewCard, { review: { ...base, language: 'ro' } as unknown as Review }))
    expect(ro).toContain('<blockquote>')
  })
})
