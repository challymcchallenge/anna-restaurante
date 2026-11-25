import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { isIndexingAllowed } from '@/lib/indexing'
import { siteOrigin } from '@/lib/site/seo'

// robots.txt (ADR-012): „Disallow: /” cât timp indexarea nu este permisă.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host')

  if (!isIndexingAllowed(host)) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  // F5: după lansare, robots.txt anunță și sitemap-ul pe limbi.
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${siteOrigin(host)}/sitemap.xml`,
  }
}
