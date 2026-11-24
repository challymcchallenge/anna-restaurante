import { headers } from 'next/headers'
import React from 'react'

import { Hero } from '@/components/site/Hero'
import { getSite } from '@/lib/site/data'
import { orderedSections } from '@/lib/site/sections'

/**
 * Acasă (S-01): secțiunile pornite din panou, în ordinea din panou (content-model 4).
 * Tagline-ul vine din Setări; secțiunile încă neconstruite în F3 nu apar (PLAN F3, pașii 4–9).
 */
export default async function HomePage() {
  const site = await getSite((await headers()).get('host'))
  if (!site) return null

  return (
    <>
      {orderedSections(site.home).map((s) => {
        switch (s.key) {
          case 'hero':
            return <Hero key={s.key} site={site} id={s.id} />
          default:
            return null
        }
      })}
    </>
  )
}
