import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { lang } from 'next/root-params'

import { DEFAULT_LOCALE, isLocale, localePath, type LocaleCode } from '@/lib/locales'

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

export function isActiveLocale(site: SiteData, locale: string): boolean {
  if (locale === DEFAULT_LOCALE) return true
  return ((site.settings?.activeLocales as string[] | null | undefined) ?? []).includes(locale)
}

/** Limbile din selector: româna și cele pornite din panou, în ordinea din `LOCALES`. */
export function activeLocales(site: SiteData): LocaleCode[] {
  const on = new Set<string>([DEFAULT_LOCALE, ...((site.settings?.activeLocales as string[] | null) ?? [])])
  return (['ro', 'en', 'it', 'fr', 'de', 'zh', 'sv'] as LocaleCode[]).filter((l) => on.has(l))
}

/**
 * `canonical` și `hreflang` (F4, D-64) pentru o pagină: adresa ei în fiecare limbă pornită, plus
 * `x-default` = româna. `path` e adresa fără prefix (`/`, `/galerie`, `/termeni`).
 */
export function localeAlternates(site: SiteData, path: string) {
  const languages: Record<string, string> = {}
  for (const l of activeLocales(site)) languages[l] = localePath(l, path)
  if (Object.keys(languages).length > 1) languages['x-default'] = path
  return {
    canonical: localePath(site.locale, path),
    languages: Object.keys(languages).length > 1 ? languages : undefined,
  }
}
