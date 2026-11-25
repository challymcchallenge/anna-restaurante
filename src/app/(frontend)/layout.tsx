import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import React from 'react'
import { preload } from 'react-dom'

import { IconSprite } from '@/components/site/Icons'
import { IalocLoader } from '@/components/site/Ialoc'
import { PhoneBar, SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { isIndexingAllowed } from '@/lib/indexing'
import { getSite } from '@/lib/site/data'
import { hoursSummary } from '@/lib/site/format'
import { asMedia } from '@/lib/site/media'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'
import { fontFiles } from '@/theme/fonts'
import { resolveColors, themeFonts, themeStyleSheet } from '@/theme/theme'
import './styles.css'

/**
 * Site-ul public (F3). Restaurantul se găsește după adresă (ADR-002); tema (culori, fonturi),
 * logo-ul, pictograma de filă și textele vin din „Setări restaurant” și din „Pagina Acasă”.
 */

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')
  // Meta robots (ADR-012): noindex cât timp indexarea nu este permisă.
  const robots = isIndexingAllowed(host) ? undefined : { index: false, follow: false }
  const site = await getSite(host)
  if (!site) return { robots, title: 'Site în construcție' }

  const s = site.settings
  const title = [site.tenant.name, s?.tagline].filter(Boolean).join(' · ')
  const address = [s?.address?.street, s?.address?.city].filter(Boolean).join(', ')
  const description =
    section(site.home, 'hero')?.subtitle || UI.homeMeta(site.tenant.name, address, hoursSummary(s?.hours))
  const favicon = asMedia(s?.favicon)
  const share = asMedia(s?.shareImage)
  return {
    title,
    description,
    robots,
    icons: favicon
      ? {
          icon: [{ url: favicon.url as string, type: favicon.mimeType ?? undefined }],
          apple: [{ url: favicon.url as string }],
        }
      : undefined,
    openGraph: {
      title,
      description,
      siteName: site.tenant.name,
      locale: 'ro_RO',
      type: 'website',
      images: share?.url ? [{ url: share.url, width: share.width ?? undefined, height: share.height ?? undefined }] : undefined,
    },
  }
}

export async function generateViewport(): Promise<Viewport> {
  const site = await getSite((await headers()).get('host'))
  return {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    // Bara browserului pe telefon, în culoarea copertei.
    themeColor: resolveColors(site?.settings?.colors).surfaceDark,
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const site = await getSite((await headers()).get('host'))

  if (!site) {
    return (
      <html lang="ro">
        <body className="no-site">
          <main>
            <h1>Niciun restaurant configurat pentru această adresă</h1>
            <p>Adresa se adaugă din panou: Restaurante → Adrese pe care se servește site-ul.</p>
          </main>
        </body>
      </html>
    )
  }

  const settings = site.settings
  // Fonturile primului ecran (greutatea 400), încărcate devreme: latin și latin-ext, unde stau ă, ș, ț.
  for (const font of themeFonts(settings)) {
    for (const file of fontFiles(font).filter((f) => f.weight === 400)) {
      preload(file.url, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
    }
  }
  const locale = (settings?.activeLocales?.[0] as string) || 'ro'

  return (
    <html lang={locale}>
      <head>
        <style id="tema" dangerouslySetInnerHTML={{ __html: themeStyleSheet(settings) }} />
      </head>
      {/* Decorul (D-62): formele de pe fundal și valurile dintre secțiuni, din Setări → Identitate. */}
      <body
        data-decor={settings?.decorShapes === false ? 'off' : 'on'}
        data-decor-level={settings?.decorLevel || 'subtle'}
        data-waves={settings?.decorWaves === false ? 'off' : 'on'}
      >
        <a className="skip-link" href="#continut">
          {UI.skipToContent}
        </a>
        <IconSprite />
        <SiteHeader site={site} />
        <main id="continut" tabIndex={-1}>
          {props.children}
        </main>
        <SiteFooter site={site} />
        <PhoneBar site={site} />
        {settings?.ialocId && <IalocLoader venueId={settings.ialocId} locale={locale} />}
      </body>
    </html>
  )
}
