import React from 'react'

import { ExampleTag } from '@/components/site/Bits'
import { EventCard, NoEvents, PageCover } from '@/components/site/Events'
import { Picture } from '@/components/site/Picture'
import type { Media } from '@/payload-types'
import { asMedia } from '@/lib/site/media'
import { eventParts } from '@/lib/site/format'
import { sitePage, sitePageMeta } from '@/lib/site/page'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'

/** S-03 · Petreceri și agenda: toate serile viitoare și arhiva foto („Cum a fost”). */
export const generateMetadata = () => sitePageMeta('parties', 'Petreceri')

export default async function PartiesPage() {
  const site = await sitePage('parties')
  const s = section(site.home, 'parties')
  // Arhiva: serile trecute care au fotografii de după eveniment (sau măcar afișul).
  const archive = site.eventsPast
    .map((e) => ({ e, photo: asMedia((e.photosAfter as (number | Media)[] | null | undefined)?.[0]) ?? asMedia(e.poster) }))
    .filter((x) => x.photo)

  return (
    <>
      <PageCover title={s?.menuLabel || s?.title || ''} intro={s?.intro} placeholder={Boolean(s?.placeholder)} />

      <section className="agenda paper-section" aria-labelledby="agenda-t">
        <div className="wrap">
          <h2 id="agenda-t">{UI.upcomingTitle}</h2>
          {site.eventsUpcoming.length > 0 ? (
            <ul className="agenda-grid">
              {site.eventsUpcoming.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} site={site} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
                </li>
              ))}
            </ul>
          ) : (
            <NoEvents site={site} message={s?.emptyMessage || ''} />
          )}
        </div>
      </section>

      {archive.length > 0 && (
        <section className="archive paper-section" aria-labelledby="archive-t">
          <div className="wrap">
            <h2 id="archive-t">{UI.archiveTitle}</h2>
            <p className="section-intro">{UI.archiveIntro}</p>
            <ul className="archive-grid">
              {archive.map(({ e, photo }) => {
                const p = eventParts(e.startsAt)
                return (
                  <li key={e.id} className="archive-item">
                    <Picture media={photo as Media} sizes="(min-width: 1024px) 25vw, 50vw" />
                    <p className="archive-name">
                      {e.name} · {p.month}
                    </p>
                    {e.placeholder && <ExampleTag className="row-tag" />}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
