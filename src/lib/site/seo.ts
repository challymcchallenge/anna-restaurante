import type { Metadata } from 'next'

import { localePath, type LocaleCode } from '@/lib/locales'
import type { Award, Event, Media, Setting } from '@/payload-types'

import type { SiteData } from './data'
import { ui } from './i18n'
import { activeLocales, localeAlternates } from './alternates'
import { asMedia } from './media'
import { isOn, NAV_PAGES, section } from './sections'

/**
 * F5 (PLAN F5.3): ce văd motoarele de căutare și rețelele sociale. Totul vine din panou (Setări,
 * Pagina Acasă, Premii, Seri), deci merge la fel pentru orice restaurant (ADR-002).
 *
 * - `pageMetadata`: titlu, descriere, canonical + hreflang și Open Graph / Twitter pe fiecare pagină
 *   (înainte, paginile proprii moșteneau Open Graph-ul paginii Acasă).
 * - `restaurantLd`, `websiteLd`, `eventsLd`: date structurate schema.org (JSON-LD).
 * - `sitemapEntries`: paginile care există efectiv, cu adresa în fiecare limbă pornită.
 */

/** Adresa de bază a site-ului, din antetul `host` (fiecare restaurant are domeniul lui). */
export function siteOrigin(host: string | null | undefined): string | null {
  if (!host) return null
  const hostname = host.split(':')[0].toLowerCase()
  const local = hostname === 'localhost' || hostname === '127.0.0.1'
  return `${local ? 'http' : 'https'}://${host}`
}

const abs = (url: string, origin: string) => new URL(url, origin).href

/** Imaginea de distribuire de rezervă: cea din Setări, altfel primul cadru al copertei, altfel logo-ul. */
export function fallbackShareImage(site: SiteData): Media | null {
  const hero = section(site.home, 'hero')
  const first = hero?.mediaMode === 'slideshow' ? hero.slides?.[0]?.desktop : hero?.posterDesktop
  return asMedia(site.settings?.shareImage) ?? asMedia(first) ?? asMedia(site.settings?.logo)
}

/** Metadatele unei pagini: canonical și hreflang (F4), plus Open Graph și Twitter proprii paginii. */
export function pageMetadata(
  site: SiteData,
  o: { title: string; description?: string | null; path: string; image?: Media | null },
): Metadata {
  const UI = ui(site.locale)
  const description = o.description || undefined
  const image = (o.image && o.image.url ? o.image : null) ?? fallbackShareImage(site)
  const images = image?.url
    ? [{ url: image.url, width: image.width ?? undefined, height: image.height ?? undefined, alt: image.alt ?? undefined }]
    : undefined
  return {
    title: o.title,
    description,
    alternates: localeAlternates(site, o.path),
    openGraph: {
      title: o.title,
      description,
      url: localePath(site.locale, o.path),
      siteName: site.tenant.name,
      locale: UI.ogLocale,
      alternateLocale: activeLocales(site)
        .filter((l) => l !== site.locale)
        .map((l) => ui(l).ogLocale),
      type: 'website',
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: o.title,
      description,
      images: images?.map((i) => i.url),
    },
  }
}

// ---------------------------------------------------------------------------------------------
// Date structurate (JSON-LD)
// ---------------------------------------------------------------------------------------------

const DAY: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

/** Țara ca cod ISO 3166-1 (recomandarea Google); un nume necunoscut rămâne cum e scris. */
const COUNTRY: Record<string, string> = { romania: 'RO', 'românia': 'RO', italia: 'IT', italy: 'IT' }
function countryCode(country: string | null | undefined): string | undefined {
  if (!country) return undefined
  return COUNTRY[country.trim().toLowerCase()] ?? country
}

/** „24:00” nu e o oră validă în schema.org; Google cere 23:59 pentru „până la miezul nopții”. */
const hhmm = (t: string) => (t === '24:00' ? '23:59' : t)

function openingHours(hours: Setting['hours']) {
  const byTime = new Map<string, string[]>()
  for (const h of hours ?? []) {
    if (h.closed || !h.opens || !h.closes || !DAY[h.day]) continue
    const key = `${hhmm(h.opens)}|${hhmm(h.closes)}`
    byTime.set(key, [...(byTime.get(key) ?? []), DAY[h.day]])
  }
  return [...byTime].map(([key, days]) => {
    const [opens, closes] = key.split('|')
    return { '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens, closes }
  })
}

function postalAddress(s: Setting | null) {
  const a = s?.address
  if (!a?.street && !a?.city) return undefined
  return {
    '@type': 'PostalAddress',
    streetAddress: a?.street || undefined,
    addressLocality: a?.city || undefined,
    addressRegion: a?.county || undefined,
    addressCountry: countryCode(a?.country),
  }
}

/** Premiile cu nivel și an completate (aceeași regulă ca insigna, D-68) și bifate „În datele pentru Google”. */
export function activeAwards(awards: Award[]): string[] {
  return awards
    .filter((a) => a.level && a.year && a.structuredData !== false)
    .map((a) => `${a.name}, ${a.level} ${a.year}`)
}

const restaurantId = (origin: string) => `${origin}/#restaurant`

/** Restaurantul (schema.org Restaurant), pe Acasă. Fără recenzii: Google nu le arată pentru propriul site. */
export function restaurantLd(site: SiteData, origin: string) {
  const s = site.settings
  const image = fallbackShareImage(site)
  const logo = asMedia(s?.logo)
  const social = s?.social
  const sameAs = [
    social?.facebook,
    social?.instagram,
    social?.youtube,
    social?.tiktok,
    social?.tripadvisor,
    ...(s?.otherNetworks ?? []).map((n) => n.url),
  ].filter((u): u is string => Boolean(u))
  const award = activeAwards(site.awards)
  const hours = openingHours(s?.hours)
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': restaurantId(origin),
    name: site.tenant.name,
    slogan: s?.tagline || undefined,
    description: section(site.home, 'hero')?.subtitle || undefined,
    url: abs(localePath(site.locale, '/'), origin),
    image: image?.url ? abs(image.url, origin) : undefined,
    logo: logo?.url ? abs(logo.url, origin) : undefined,
    telephone: s?.phoneReservations || undefined,
    address: postalAddress(s ?? null),
    geo:
      typeof s?.address?.lat === 'number' && typeof s?.address?.lng === 'number'
        ? { '@type': 'GeoCoordinates', latitude: s.address.lat, longitude: s.address.lng }
        : undefined,
    openingHoursSpecification: hours.length ? hours : undefined,
    servesCuisine: s?.servesCuisine || undefined,
    priceRange: s?.priceRange || undefined,
    hasMenu: s?.digitalMenuUrl || undefined,
    acceptsReservations: s?.ialocId ? true : undefined,
    award: award.length ? award : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  }
}

/** Numele site-ului în rezultatele Google (schema.org WebSite), pe Acasă. */
export function websiteLd(site: SiteData, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.tenant.name,
    url: abs('/', origin),
    inLanguage: activeLocales(site),
  }
}

/** Minutele din zi în ora României. */
function localMinutes(iso: string): number {
  const [h, m] = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bucharest',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .format(new Date(iso))
    .split(':')
    .map(Number)
  return h * 60 + m
}

/** Sfârșitul serii: „Ora de sfârșit” e doar oră; dacă e înainte de început, e a doua zi. */
export function eventEnd(startsAt: string, endsAt: string | null | undefined): string | undefined {
  if (!endsAt) return undefined
  let delta = localMinutes(endsAt) - localMinutes(startsAt)
  if (delta <= 0) delta += 24 * 60
  return new Date(new Date(startsAt).getTime() + delta * 60_000).toISOString()
}

const PERFORMER: Record<string, string> = { dj: 'Person', artist: 'Person', band: 'MusicGroup', other: 'Person' }

/** Serile viitoare (schema.org Event), pe /petreceri. Serile-exemplu („Provizoriu”) nu intră. */
export function eventsLd(site: SiteData, origin: string, events: Event[] = site.eventsUpcoming) {
  const s = site.settings
  const place = { '@type': 'Place', name: site.tenant.name, address: postalAddress(s ?? null) }
  return events
    .filter((e) => !e.placeholder && e.startsAt)
    .map((e) => {
      const poster = asMedia(e.poster)
      return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: e.name,
        startDate: e.startsAt,
        endDate: eventEnd(e.startsAt, e.endsAt),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: place,
        image: poster?.url ? [abs(poster.url, origin)] : undefined,
        description: e.description || undefined,
        performer: e.guest ? { '@type': PERFORMER[e.type] ?? 'Person', name: e.guest } : undefined,
        organizer: { '@type': 'Organization', name: site.tenant.name, url: abs('/', origin) },
        url: abs(localePath(site.locale, NAV_PAGES.pageParties.href), origin),
      }
    })
}

// ---------------------------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------------------------

/** Paginile care există (aceleași condiții ca paginile: secțiunea pornită, galeria nevidă). */
export function sitePaths(site: SiteData): { path: string; lastModified?: string }[] {
  const home = site.home
  const updated = home?.updatedAt
  const paths: { path: string; lastModified?: string }[] = [{ path: '/', lastModified: updated }]
  const pages: [Parameters<typeof isOn>[1], string][] = [
    ['privateEvents', NAV_PAGES.pagePrivateEvents.href],
    ['parties', NAV_PAGES.pageParties.href],
    ['pizza', NAV_PAGES.pagePizza.href],
    ['wines', NAV_PAGES.pageWines.href],
    ['contact', NAV_PAGES.pageContact.href],
    ['contact', '/formular-de-reclamatie'],
  ]
  for (const [key, path] of pages) if (isOn(home, key)) paths.push({ path, lastModified: updated })
  if (isOn(home, 'gallery') && site.galleryCount > 0) paths.push({ path: NAV_PAGES.pageGallery.href, lastModified: updated })
  for (const p of site.legalPages) if (p.slug) paths.push({ path: `/${p.slug}`, lastModified: p.updatedAt })
  return paths
}

export function sitemapEntries(site: SiteData, origin: string) {
  const locales: LocaleCode[] = activeLocales(site)
  return sitePaths(site).flatMap(({ path, lastModified }) => {
    const languages = Object.fromEntries(locales.map((l) => [l, abs(localePath(l, path), origin)]))
    return locales.map((l) => ({
      url: abs(localePath(l, path), origin),
      lastModified,
      alternates: locales.length > 1 ? { languages: { ...languages, 'x-default': abs(path, origin) } } : undefined,
    }))
  })
}

/** `<script type="application/ld+json">`: `<` scris ca < (recomandarea Next.js, ghidul JSON-LD). */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
