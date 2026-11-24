import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { getSite, type SiteData } from './data'
import { isOn, section, type SectionKey } from './sections'

/**
 * Paginile proprii (D-11, structura hibridă): fiecare ține de o secțiune de pe Acasă. Dacă
 * secțiunea e oprită din panou, pagina nu există (404), ca meniul și site-ul să spună același lucru.
 */
export async function sitePage(key: SectionKey): Promise<SiteData> {
  const site = await getSite((await headers()).get('host'))
  if (!site || !isOn(site.home, key)) notFound()
  return site
}

export async function sitePageMeta(key: SectionKey, fallback: string): Promise<Metadata> {
  const site = await getSite((await headers()).get('host'))
  if (!site) return {}
  const s = section(site.home, key) as { menuLabel?: string | null; intro?: string | null; shortText?: string | null } | null
  const title = s?.menuLabel || fallback
  return {
    title: `${title} · ${site.tenant.name}`,
    description: s?.intro || s?.shortText || undefined,
  }
}
