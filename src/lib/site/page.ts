import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { SiteData } from './data'
import { ui } from './i18n'
import { getActiveSite, localeAlternates } from './locale'
import { isOn, NAV_PAGES, section, type SectionKey } from './sections'

/**
 * Paginile proprii (D-11, structura hibridă): fiecare ține de o secțiune de pe Acasă. Dacă
 * secțiunea e oprită din panou, pagina nu există (404), ca meniul și site-ul să spună același lucru.
 */
export async function sitePage(key: SectionKey): Promise<SiteData> {
  const site = await getActiveSite()
  if (!site || !isOn(site.home, key)) notFound()
  return site
}

export async function sitePageMeta(key: SectionKey, pageKey: string): Promise<Metadata> {
  const site = await getActiveSite()
  if (!site) return {}
  const fallback = ui(site.locale).pageLabels[pageKey] ?? ''
  const s = section(site.home, key) as { menuLabel?: string | null; intro?: string | null; shortText?: string | null } | null
  const title = s?.menuLabel || fallback
  const path = (NAV_PAGES as Record<string, { href: string }>)[pageKey]?.href ?? '/'
  return {
    title: `${title} · ${site.tenant.name}`,
    description: s?.intro || s?.shortText || undefined,
    alternates: localeAlternates(site, path),
  }
}
