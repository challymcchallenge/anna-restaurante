import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { DEFAULT_LOCALE } from '@/lib/locales'
import { getSite } from '@/lib/site/data'
import { sitemapEntries, siteOrigin } from '@/lib/site/seo'

/**
 * F5 (PLAN F5.3): sitemap pe limbi. Fiecare pagină care există, în fiecare limbă pornită din panou,
 * cu `hreflang` către celelalte (documentația Next.js 16.4.6, „Generate a localized Sitemap”).
 * Restaurantul se găsește după adresă (ADR-002). Cât timp indexarea e oprită, robots.txt nu-l anunță.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host')
  const origin = siteOrigin(host)
  const site = await getSite(host, DEFAULT_LOCALE)
  if (!site || !origin) return []
  return sitemapEntries(site, origin)
}
