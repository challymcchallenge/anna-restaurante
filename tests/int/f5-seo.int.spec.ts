// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import type { SiteData } from '@/lib/site/data'
import {
  activeAwards,
  eventEnd,
  eventsLd,
  jsonLdHtml,
  pageMetadata,
  restaurantLd,
  sitemapEntries,
  siteOrigin,
} from '@/lib/site/seo'

/**
 * F5 (PLAN F5.3): date structurate (Restaurant cu premiul activ, WebSite, serile ca Event), sitemap pe
 * limbi și Open Graph propriu pe fiecare pagină (înainte, paginile proprii moșteneau titlul de pe Acasă).
 */

const media = (url: string, extra: Record<string, unknown> = {}) => ({ id: 1, url, width: 1600, height: 900, alt: 'Alt', mimeType: 'image/jpeg', ...extra })

function fakeSite(over: Partial<SiteData> = {}, settings: Record<string, unknown> = {}): SiteData {
  return {
    locale: 'ro',
    tenant: { id: 1, name: 'Trattoria da Vittoria' },
    settings: {
      tagline: 'The Best Restaurant in Town',
      address: { street: 'Strada Victoriei nr. 8', city: 'Târgu Jiu', county: 'Gorj', country: 'România', lat: 45.03, lng: 23.27 },
      phoneReservations: '+40 356 630 238',
      hours: [
        { day: 'mon', opens: '08:00', closes: '24:00' },
        { day: 'tue', opens: '08:00', closes: '24:00' },
        { day: 'sun', opens: '10:00', closes: '22:00' },
        { day: 'sat', closed: true },
      ],
      social: { facebook: 'https://facebook.com/x', instagram: 'https://instagram.com/x' },
      otherNetworks: [{ name: 'Altă rețea', url: 'https://example.org/x' }],
      digitalMenuUrl: 'https://www.meniudigital.ro/x',
      ialocId: '4385',
      servesCuisine: 'Italian',
      activeLocales: ['ro', 'en', 'zh'],
      logo: media('/api/media/file/logo.png'),
      ...settings,
    },
    home: {
      updatedAt: '2026-11-25T10:00:00.000Z',
      hero: { subtitle: 'Bucătărie italiană.', mediaMode: 'slideshow', slides: [{ desktop: media('https://cdn.example/c17.jpg') }] },
      gallery: { enabled: true },
      parties: { enabled: true },
      privateEvents: { enabled: false },
      pizza: { enabled: true },
      wines: { enabled: true },
      contact: { enabled: true },
    },
    awards: [],
    legalPages: [{ slug: 'termeni', updatedAt: '2026-11-24T00:00:00.000Z' }],
    eventsUpcoming: [],
    galleryCount: 0,
    salons: [],
    ...over,
  } as unknown as SiteData
}

describe('F5 · date structurate', () => {
  it('Restaurant: adresa cu țara ISO, programul (24:00 → 23:59, ziua închisă lipsește), meniul, rezervări, rețele', () => {
    const ld = restaurantLd(fakeSite(), 'https://davittoria.ro')
    expect(ld['@type']).toBe('Restaurant')
    expect(ld.address).toMatchObject({ addressLocality: 'Târgu Jiu', addressCountry: 'RO' })
    expect(ld.geo).toMatchObject({ latitude: 45.03, longitude: 23.27 })
    expect(ld.openingHoursSpecification).toEqual([
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday'], opens: '08:00', closes: '23:59' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '10:00', closes: '22:00' },
    ])
    expect(ld.hasMenu).toBe('https://www.meniudigital.ro/x')
    expect(ld.acceptsReservations).toBe(true)
    expect(ld.servesCuisine).toBe('Italian')
    expect(ld.sameAs).toEqual(['https://facebook.com/x', 'https://instagram.com/x', 'https://example.org/x'])
    // Imaginea: primul cadru al copertei (fără imagine de distribuire în Setări); logo-ul, absolut.
    expect(ld.image).toBe('https://cdn.example/c17.jpg')
    expect(ld.logo).toBe('https://davittoria.ro/api/media/file/logo.png')
    // Fără recenzii și fără nivel de preț necompletat.
    expect(ld).not.toHaveProperty('aggregateRating')
    expect(ld.priceRange).toBeUndefined()
  })

  it('premiul intră doar cu nivel și an completate și bifa „În datele pentru Google” (D-20, D-68)', () => {
    const awards = [
      { name: 'Wine Spectator Restaurant Award', level: 'GRAND AWARD', year: 2027, structuredData: true },
      { name: 'Fără an', level: 'X', year: null, structuredData: true },
      { name: 'Debifat', level: 'Y', year: 2026, structuredData: false },
      { name: 'Nebifat (implicit)', level: 'Z', year: 2026 },
    ] as never
    expect(activeAwards(awards)).toEqual(['Wine Spectator Restaurant Award, GRAND AWARD 2027'])
    expect(restaurantLd(fakeSite({ awards }), 'https://x.ro').award).toEqual(['Wine Spectator Restaurant Award, GRAND AWARD 2027'])
    expect(restaurantLd(fakeSite(), 'https://x.ro').award).toBeUndefined()
  })

  it('serile: cele-exemplu nu intră; sfârșitul trece de miezul nopții când ora e mai mică decât începutul', () => {
    // 20:00 ora României (UTC+2 iarna) = 18:00 UTC; sfârșit 02:00 → a doua zi, 00:00 UTC.
    expect(eventEnd('2026-12-12T18:00:00.000Z', '2026-11-20T00:00:00.000Z')).toBe('2026-12-13T00:00:00.000Z')
    expect(eventEnd('2026-12-12T18:00:00.000Z', '2026-11-20T21:00:00.000Z')).toBe('2026-12-12T21:00:00.000Z')
    expect(eventEnd('2026-12-12T18:00:00.000Z', null)).toBeUndefined()
    const site = fakeSite({
      eventsUpcoming: [
        { id: 1, name: 'Il Ritmo della Notte', startsAt: '2026-12-12T18:00:00.000Z', type: 'dj', guest: 'DJ X', placeholder: false, poster: media('https://cdn.example/p.jpg') },
        { id: 2, name: 'Seară-exemplu', startsAt: '2026-12-19T18:00:00.000Z', type: 'band', placeholder: true },
      ] as never,
    })
    const ld = eventsLd(site, 'https://davittoria.ro')
    expect(ld).toHaveLength(1)
    expect(ld[0]).toMatchObject({
      '@type': 'Event',
      name: 'Il Ritmo della Notte',
      startDate: '2026-12-12T18:00:00.000Z',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      performer: { '@type': 'Person', name: 'DJ X' },
      image: ['https://cdn.example/p.jpg'],
      url: 'https://davittoria.ro/petreceri',
    })
    expect(ld[0].location).toMatchObject({ '@type': 'Place', address: { addressCountry: 'RO' } })
  })

  it('JSON-LD: „<” e scris \\u003c (ghidul JSON-LD din Next.js 16.4.6)', () => {
    expect(jsonLdHtml({ name: '</script><script>alert(1)</script>' })).not.toContain('<')
  })
})

describe('F5 · sitemap pe limbi', () => {
  it('doar paginile care există, în fiecare limbă pornită, cu hreflang și x-default', () => {
    const entries = sitemapEntries(fakeSite(), 'https://davittoria.ro')
    const urls = entries.map((e) => e.url)
    // privateEvents oprită, galeria goală → lipsesc; pagina legală din panou → prezentă.
    expect(urls).toContain('https://davittoria.ro/')
    expect(urls).toContain('https://davittoria.ro/en/petreceri')
    expect(urls).toContain('https://davittoria.ro/zh/termeni')
    expect(urls).not.toContain('https://davittoria.ro/evenimente-private')
    expect(urls.some((u) => u.includes('/galerie'))).toBe(false)
    expect(urls.some((u) => u.includes('/it/'))).toBe(false) // italiana nu e pornită
    const wines = entries.find((e) => e.url === 'https://davittoria.ro/en/catalog-vinuri')!
    expect(wines.alternates?.languages).toEqual({
      ro: 'https://davittoria.ro/catalog-vinuri',
      en: 'https://davittoria.ro/en/catalog-vinuri',
      zh: 'https://davittoria.ro/zh/catalog-vinuri',
      'x-default': 'https://davittoria.ro/catalog-vinuri',
    })
    // Galeria apare când are elemente.
    const withGallery = sitemapEntries(fakeSite({ galleryCount: 3 }), 'https://davittoria.ro').map((e) => e.url)
    expect(withGallery).toContain('https://davittoria.ro/galerie')
  })

  it('robots.txt anunță sitemap-ul doar când indexarea e permisă', () => {
    const robots = readFileSync(join(process.cwd(), 'src/app/robots.ts'), 'utf8')
    expect(robots).toMatch(/if \(!isIndexingAllowed\(host\)\) \{\s*return \{ rules: \{ userAgent: '\*', disallow: '\/' \} \}/)
    expect(robots).toContain('sitemap: `${siteOrigin(host)}/sitemap.xml`')
    expect(siteOrigin('davittoria.ro')).toBe('https://davittoria.ro')
    expect(siteOrigin('localhost:3000')).toBe('http://localhost:3000')
  })
})

describe('F5 · Open Graph pe fiecare pagină', () => {
  it('titlul, adresa și limba paginii; imaginea paginii sau cea implicită; card mare pe Twitter', () => {
    const site = fakeSite({ locale: 'en' } as Partial<SiteData>)
    const m = pageMetadata(site, { title: 'Parties · Trattoria da Vittoria', description: 'D', path: '/petreceri' })
    expect(m.openGraph).toMatchObject({ title: 'Parties · Trattoria da Vittoria', url: '/en/petreceri', locale: 'en_GB' })
    expect((m.openGraph as { alternateLocale: string[] }).alternateLocale).toEqual(['ro_RO', 'zh_CN'])
    expect((m.openGraph as { images: { url: string }[] }).images[0].url).toBe('https://cdn.example/c17.jpg')
    expect(m.twitter).toMatchObject({ card: 'summary_large_image' })
    expect(m.alternates?.canonical).toBe('/en/petreceri')
    const own = pageMetadata(site, { title: 'T', path: '/galerie', image: media('https://cdn.example/g.jpg') as never })
    expect((own.openGraph as { images: { url: string }[] }).images[0].url).toBe('https://cdn.example/g.jpg')
  })

  it('toate paginile proprii folosesc pageMetadata (nu mai moștenesc Open Graph-ul paginii Acasă)', () => {
    for (const f of ['galerie', 'catalog-vinuri', 'formular-de-reclamatie', '[slug]']) {
      expect(readFileSync(join(process.cwd(), `src/app/(frontend)/[lang]/${f}/page.tsx`), 'utf8')).toContain('pageMetadata(')
    }
    expect(readFileSync(join(process.cwd(), 'src/lib/site/page.ts'), 'utf8')).toContain('pageMetadata(')
  })
})
