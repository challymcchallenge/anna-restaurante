import { headers } from 'next/headers'
import React from 'react'

import { jsonLdHtml, siteOrigin } from '@/lib/site/seo'

/**
 * F5: date structurate schema.org (JSON-LD), din panou. `build` primește adresa de bază a site-ului
 * (din antetul `host`), ca adresele să fie absolute pe domeniul restaurantului.
 */
export async function JsonLd({ build }: { build: (origin: string) => unknown[] }) {
  const origin = siteOrigin((await headers()).get('host'))
  if (!origin) return null
  const items = build(origin).filter(Boolean)
  return (
    <>
      {items.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }} />
      ))}
    </>
  )
}
