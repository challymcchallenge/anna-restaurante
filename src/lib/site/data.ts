import { unstable_cache } from 'next/cache'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import { WINE_TYPES } from '@/collections/Wines'
import config from '@/payload.config'
import type {
  Award,
  DishCategory,
  Event,
  Faq,
  GroupLink,
  HomePage,
  LegalPage,
  Review,
  Salon,
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
  /** F3 pașii 4–6 */
  salons: Salon[]
  /** Serile de azi încolo, în ordine; o seară trecută iese singură (content-model 5.4). */
  eventsUpcoming: Event[]
  /** Serile trecute, cele mai noi întâi (arhiva foto). */
  eventsPast: Event[]
  faqs: Faq[]
}

/** Începutul zilei de azi în ora României, ca o seară de azi să rămână în agendă toată ziua. */
function startOfTodayBucharest(): string {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(new Date())
  const probe = new Date(`${ymd}T12:00:00Z`)
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Bucharest', hour: '2-digit', hour12: false }).format(probe),
  )
  return new Date(Date.UTC(Number(ymd.slice(0, 4)), Number(ymd.slice(5, 7)) - 1, Number(ymd.slice(8, 10)), -(hour - 12))).toISOString()
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

  const today = startOfTodayBucharest()
  const [settings, home, awards, groupLinks, legalPages, dishCategories, wines, reviews, salons, upcoming, past, faqs] =
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
      payload.find({ collection: 'salons', where: of(), sort: '_order', limit: 10, depth: 1 }),
      payload.find({
        collection: 'events',
        where: of([{ startsAt: { greater_than_equal: today } }]),
        sort: 'startsAt',
        limit: 24,
        depth: 1,
      }),
      payload.find({
        collection: 'events',
        where: of([{ startsAt: { less_than: today } }]),
        sort: '-startsAt',
        limit: 12,
        depth: 1,
      }),
      payload.find({ collection: 'faqs', where: of(), sort: '_order', limit: 50, depth: 0 }),
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
    salons: salons.docs,
    eventsUpcoming: upcoming.docs,
    eventsPast: past.docs,
    faqs: faqs.docs,
  }
}

/**
 * Cheia include deploy-ul: pe Vercel, cache-ul `unstable_cache` trece de la un deploy la altul, iar
 * conținutul de pornire (seed) rulează la build, în afara unei cereri Next, deci nu-l poate goli.
 */
const BUILD = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? 'local'

const loadCached = unstable_cache(load, ['site-data', BUILD], { tags: [SITE_TAG], revalidate: 600 })

/** O singură încărcare pe cerere (antetul, pagina și footerul folosesc aceleași date). */
export const getSite = cache(async (host: string | null | undefined): Promise<SiteData | null> => {
  if (!host) return null
  const hostname = host.split(':')[0].toLowerCase()
  return loadCached(hostname)
})
