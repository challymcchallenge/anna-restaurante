import { headers } from 'next/headers'
import React from 'react'

import { Parties, Pizza, PrivateEvents } from '@/components/site/Events'
import { Hero } from '@/components/site/Hero'
import { Kitchen, Reviews, Wines } from '@/components/site/Restaurant'
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
          case 'kitchen':
            return <Kitchen key={s.key} site={site} id={s.id} />
          case 'wines':
            return <Wines key={s.key} site={site} id={s.id} />
          case 'reviews':
            return <Reviews key={s.key} site={site} id={s.id} />
          case 'parties':
            return <Parties key={s.key} site={site} id={s.id} />
          case 'privateEvents':
            return <PrivateEvents key={s.key} site={site} id={s.id} />
          case 'pizza':
            return <Pizza key={s.key} site={site} id={s.id} />
          // „stay” (cererea de cazare) stă în hero, la baza copertei.
          default:
            return null
        }
      })}
    </>
  )
}
