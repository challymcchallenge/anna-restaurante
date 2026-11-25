import React from 'react'

import { getActiveSite } from '@/lib/site/locale'

import { FaqList, Parties, Pizza, PrivateEvents } from '@/components/site/Events'
import { ContactSection } from '@/components/site/ContactSection'
import { GallerySection } from '@/components/site/Gallery'
import { Hero } from '@/components/site/Hero'
import { Hotel } from '@/components/site/Hotel'
import { Kitchen, Reviews, Wines } from '@/components/site/Restaurant'
import { UI } from '@/lib/site/i18n/server'
import { orderedSections } from '@/lib/site/sections'

/**
 * Acasă (S-01): secțiunile pornite din panou, în ordinea din panou (content-model 4).
 * Tagline-ul vine din Setări; secțiunile încă neconstruite în F3 nu apar (PLAN F3, pașii 4–9).
 */
export default async function HomePage() {
  const site = await getActiveSite()
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
          case 'hotel':
            // G10-1: întrebările despre cazare stau imediat sub Hotel (hotelul nu are pagină proprie, D-48).
            return (
              <React.Fragment key={s.key}>
                <Hotel site={site} id={s.id} />
                <FaqList faqs={site.faqs} group="stay" title={UI.faqStayTitle} />
              </React.Fragment>
            )
          case 'gallery':
            return <GallerySection key={s.key} site={site} id={s.id} />
          case 'contact':
            return <ContactSection key={s.key} site={site} id={s.id} />
          // „stay” (cererea de cazare) stă în hero, la baza copertei.
          default:
            return null
        }
      })}
    </>
  )
}
