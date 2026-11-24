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
  Gallery,
  GalleryCategory,
  GroupLink,
  HomePage,
  LegalPage,
  Review,
  RoomType,
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
  /** Recomandatele (D-46), pe tip. */
  wines: WineRow[]
  reviews: Review[]
  /** F3 pașii 4–6 */
  salons: Salon[]
  /** Serile de azi încolo, în ordine; o seară trecută iese singură (content-model 5.4). */
  eventsUpcoming: Event[]
  /** Serile trecute, cele mai noi întâi (arhiva foto). */
  eventsPast: Event[]
  faqs: Faq[]
  /** F3 pasul 7: tipurile de camere și recenziile hotelului (content-model 4.9, 5.6). */
  roomTypes: RoomType[]
  hotelReviews: Review[]
  /** F3 pasul 8: elementele de galerie bifate „Pe Acasă” (cel mult 8), cu fișierul și categoria. */
  galleryHome: Gallery[]
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

/** Câmpurile unui vin pe care le afișează lista (Acasă și /catalog-vinuri). */
const WINE_FIELDS = {
  name: true,
  producer: true,
  type: true,
  country: true,
  region: true,
  appellation: true,
  vintage: true,
  grapes: true,
  priceBottle: true,
  volume: true,
  priceGlass: true,
  placeholder: true,
} as const

export type WineRow = Pick<Wine, 'id' | keyof typeof WINE_FIELDS>

/** Vinurile: pe tip (spumant, alb, rosé, roșu, desert), apoi în ordinea din panou (content-model 5.2). */
function byType<T extends { type: Wine['type'] }>(wines: T[]): T[] {
  const rank = (w: T) => WINE_TYPES.findIndex((t) => t.value === w.type)
  return wines
    .map((w, i) => ({ w, i }))
    .sort((a, b) => rank(a.w) - rank(b.w) || a.i - b.i)
    .map(({ w }) => w)
}

async function load(hostname: string): Promise<SiteData | null> {
  const payload = await getPayload({ config: await config })
  const tenant = await getTenantByHost(payload, hostname)
  if (!tenant) return null

  const of = (extra: Where[] = []): Where => ({
    and: [{ tenant: { equals: tenant.id } }, active, ...extra],
  })
  const own: Where = { tenant: { equals: tenant.id } }

  const today = startOfTodayBucharest()
  const [
    settings,
    home,
    awards,
    groupLinks,
    legalPages,
    dishCategories,
    wines,
    reviews,
    salons,
    upcoming,
    past,
    faqs,
    roomTypes,
    hotelReviews,
    galleryHome,
  ] = await Promise.all([
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
      // Recomandatele de pe Acasă: cel mult 5 din fiecare tip (D-46), fără fotografii.
      payload.find({
        collection: 'wines',
        where: of([{ featured: { equals: true } }, { available: { equals: true } }]),
        sort: '_order',
        limit: 25,
        depth: 0,
        select: WINE_FIELDS,
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
      payload.find({ collection: 'room-types', where: of(), sort: '_order', limit: 6, depth: 1 }),
      payload.find({
        collection: 'reviews',
        where: of([{ group: { equals: 'hotel' } }]),
        sort: '_order',
        limit: 3,
        depth: 0,
      }),
      // depth 2: clipurile aduc și posterul, cu variantele lui.
      payload.find({ collection: 'gallery', where: of([{ onHome: { equals: true } }]), sort: '_order', limit: 8, depth: 2 }),
    ])


  return {
    tenant,
    settings: settings.docs[0] ?? null,
    home: home.docs[0] ?? null,
    awards: awards.docs,
    groupLinks: groupLinks.docs,
    legalPages: legalPages.docs,
    dishCategories: dishCategories.docs,
    wines: byType(wines.docs as WineRow[]),
    reviews: reviews.docs,
    salons: salons.docs,
    eventsUpcoming: upcoming.docs,
    eventsPast: past.docs,
    faqs: faqs.docs,
    roomTypes: roomTypes.docs,
    hotelReviews: hotelReviews.docs,
    galleryHome: galleryHome.docs,
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

/**
 * Lista completă de la /catalog-vinuri (S-23, D-46): vinurile active și disponibile, pe tip, apoi în
 * ordinea din panou. Separat de `getSite`, ca Acasă să nu încarce toată lista.
 */
async function loadWineList(tenantId: number): Promise<WineRow[]> {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'wines',
    where: { and: [{ tenant: { equals: tenantId } }, active, { available: { equals: true } }] },
    sort: '_order',
    limit: 1000,
    pagination: false,
    depth: 0,
    select: WINE_FIELDS,
  })
  return byType(docs as WineRow[])
}

const wineListCached = unstable_cache(loadWineList, ['wine-list', BUILD], { tags: [SITE_TAG], revalidate: 600 })

export const getWineList = cache((tenantId: number) => wineListCached(tenantId))

/**
 * Galeria completă de la /galerie (S-05, F-30): elementele active, în ordinea din panou, și
 * categoriile care au cel puțin un element. Separat de `getSite`, ca Acasă să nu încarce tot.
 */
async function loadGallery(tenantId: number): Promise<{ items: Gallery[]; categories: GalleryCategory[] }> {
  const payload = await getPayload({ config: await config })
  const of: Where = { and: [{ tenant: { equals: tenantId } }, active] }
  const [items, categories] = await Promise.all([
    payload.find({ collection: 'gallery', where: of, sort: '_order', limit: 500, pagination: false, depth: 2 }),
    payload.find({ collection: 'gallery-categories', where: of, sort: '_order', limit: 30, depth: 0 }),
  ])
  const used = new Set(items.docs.map((i) => (typeof i.category === 'object' ? i.category?.id : i.category)))
  return { items: items.docs, categories: categories.docs.filter((c) => used.has(c.id)) }
}

const galleryCached = unstable_cache(loadGallery, ['gallery', BUILD], { tags: [SITE_TAG], revalidate: 600 })

export const getGallery = cache((tenantId: number) => galleryCached(tenantId))

/**
 * O pagină proprie după adresa scurtă (F3 pasul 10): pagina legală activă cu acest `slug` sau,
 * dacă nu există, redirecționarea activă din panou (R5, de exemplu /valori-nutritionale).
 */
async function loadSlug(
  tenantId: number,
  slug: string,
): Promise<{ page: LegalPage | null; redirect: { to: string; permanent: boolean } | null }> {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'legal-pages',
    where: { and: [{ tenant: { equals: tenantId } }, active, { slug: { equals: slug } }] },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return { page: docs[0], redirect: null }
  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    where: { and: [{ tenant: { equals: tenantId } }, active, { from: { in: [`/${slug}`, `/${slug}/`] } }] },
    limit: 1,
    depth: 0,
  })
  const r = redirects[0]
  return { page: null, redirect: r ? { to: r.to, permanent: r.permanent !== false } : null }
}

const slugCached = unstable_cache(loadSlug, ['slug-page', BUILD], { tags: [SITE_TAG], revalidate: 600 })

export const getSlugPage = cache((tenantId: number, slug: string) => slugCached(tenantId, slug))
