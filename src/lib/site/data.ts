import { unstable_cache } from 'next/cache'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import { WINE_TYPES } from '@/collections/Wines'
import config from '@/payload.config'
import type {
  Award,
  DishCategory,
  GroupLink,
  HomePage,
  LegalPage,
  Review,
  Setting,
  Tenant,
  Wine,
} from '@/payload-types'

import { getTenantByHost } from '../tenant'

/**
 * Datele site-ului public pentru un restaurant (ADR-002): găsit după adresă, apoi tot ce afișează
 * antetul, Acasă și footerul. Vizitatorul vede doar elementele „Activ”.
 *
 * Cache (Next 16 fără Cache Components): rezultatul se păstrează pe adresă și se golește la orice
 * salvare din panou (eticheta `SITE_TAG`, src/lib/site/revalidate.ts) sau după 10 minute.
 */
export const SITE_TAG = 'site'

export type SiteData = {
  tenant: Tenant
  settings: Setting | null
  home: HomePage | null
  awards: Award[]
  groupLinks: GroupLink[]
  legalPages: LegalPage[]
  dishCategories: DishCategory[]
  wines: Wine[]
  reviews: Review[]
}

const active: Where = { active: { equals: true } }

async function load(hostname: string): Promise<SiteData | null> {
  const payload = await getPayload({ config: await config })
  const tenant = await getTenantByHost(payload, hostname)
  if (!tenant) return null

  const of = (extra: Where[] = []): Where => ({
    and: [{ tenant: { equals: tenant.id } }, active, ...extra],
  })
  const own: Where = { tenant: { equals: tenant.id } }

  const [settings, home, awards, groupLinks, legalPages, dishCategories, wines, reviews] =
    await Promise.all([
      payload.find({ collection: 'settings', where: own, limit: 1, depth: 1 }),
      // depth 2: clipurile din hero aduc și varianta eficientă și imaginea de început.
      payload.find({ collection: 'home-page', where: own, limit: 1, depth: 2 }),
      payload.find({ collection: 'awards', where: of(), sort: '_order', limit: 10, depth: 1 }),
      payload.find({ collection: 'group-links', where: of(), sort: '_order', limit: 30, depth: 0 }),
      payload.find({
        collection: 'legal-pages',
        where: of([{ inFooter: { equals: true } }]),
        sort: '_order',
        limit: 10,
        depth: 0,
      }),
      payload.find({ collection: 'dish-categories', where: of(), sort: '_order', limit: 10, depth: 1 }),
      payload.find({
        collection: 'wines',
        where: of([{ featured: { equals: true } }, { available: { equals: true } }]),
        sort: '_order',
        limit: 10,
        depth: 1,
      }),
      payload.find({
        collection: 'reviews',
        where: of([{ group: { equals: 'restaurant' } }]),
        sort: '_order',
        limit: 3,
        depth: 0,
      }),
    ])

  // Vinurile: pe tip (spumant, alb, rosé, roșu, desert), apoi în ordinea din panou (content-model 5.2).
  const typeRank = (w: Wine) => WINE_TYPES.findIndex((t) => t.value === w.type)
  const sortedWines = wines.docs
    .map((w, i) => ({ w, i }))
    .sort((a, b) => typeRank(a.w) - typeRank(b.w) || a.i - b.i)
    .map(({ w }) => w)

  return {
    tenant,
    settings: settings.docs[0] ?? null,
    home: home.docs[0] ?? null,
    awards: awards.docs,
    groupLinks: groupLinks.docs,
    legalPages: legalPages.docs,
    dishCategories: dishCategories.docs,
    wines: sortedWines,
    reviews: reviews.docs,
  }
}

const loadCached = unstable_cache(load, ['site-data'], { tags: [SITE_TAG], revalidate: 600 })

/** O singură încărcare pe cerere (antetul, pagina și footerul folosesc aceleași date). */
export const getSite = cache(async (host: string | null | undefined): Promise<SiteData | null> => {
  if (!host) return null
  const hostname = host.split(':')[0].toLowerCase()
  return loadCached(hostname)
})
