import React from 'react'

import type { SiteData } from '@/lib/site/data'

/** Hero (content-model 4.1). Pasul 1: doar coperta și tagline-ul; pasul 2 îl completează. */
export function Hero({ site, id }: { site: SiteData; id: string }) {
  return (
    <section className="hero" id={id} data-hero="" aria-labelledby="hero-title">
      <div className="wrap hero-in">
        <h1 id="hero-title">
          <span lang="en">{site.settings?.tagline}</span>
        </h1>
      </div>
    </section>
  )
}
