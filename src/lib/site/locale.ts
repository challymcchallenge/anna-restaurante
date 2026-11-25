import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { lang } from 'next/root-params'

import { DEFAULT_LOCALE, isLocale, type LocaleCode } from '@/lib/locales'

import { isActiveLocale } from './alternates'
import { getSite, type SiteData } from './data'
import { setRenderLocale } from './i18n/server'

/**
 * Limba paginii curente (F4): segmentul `[lang]` din adresă. Româna nu are prefix: `next.config.ts`
 * rescrie `/galerie` în `/ro/galerie`, deci aici ajunge mereu un cod valid.
 */
export async function pageLocale(): Promise<LocaleCode> {
  const value = await lang()
  return isLocale(value) ? value : DEFAULT_LOCALE
}

/** Datele site-ului în limba paginii (antet, pagini, footer). */
export async function getPageSite(): Promise<SiteData | null> {
  const locale = await pageLocale()
  setRenderLocale(locale)
  return getSite((await headers()).get('host'), locale)
}

/**
 * Ca `getPageSite`, dar o limbă care nu e pornită în Setări → Limbi active dă 404 (D-28):
 * vizitatorul nu ajunge pe o limbă netradusă.
 */
export async function getActiveSite(): Promise<SiteData | null> {
  const site = await getPageSite()
  if (site && !isActiveLocale(site, site.locale)) notFound()
  return site
}

// Funcțiile pure (fără cererea curentă) stau în `alternates.ts`, ca să poată fi folosite și în teste (F5).
export { activeLocales, isActiveLocale, localeAlternates } from './alternates'
