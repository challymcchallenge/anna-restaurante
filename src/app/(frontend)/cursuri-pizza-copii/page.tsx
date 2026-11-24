import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { ExampleTag } from '@/components/site/Bits'
import { Chapter, CourseDetails, FaqList, PageCover, RequestButton } from '@/components/site/Events'
import { Picture } from '@/components/site/Picture'
import type { Media } from '@/payload-types'
import { asMedia, videoSources } from '@/lib/site/media'
import { sitePage, sitePageMeta } from '@/lib/site/page'
import { requestHref } from '@/lib/site/requests'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'

/** S-04 · Cursuri de pizza pentru copii: textul complet, detaliile, galeria și înscrierea. */
export const generateMetadata = () => sitePageMeta('pizza', 'Cursuri de pizza')

export default async function PizzaPage() {
  const site = await sitePage('pizza')
  const s = section(site.home, 'pizza')
  const photo = asMedia(s?.photo)
  const gallery = ((s?.gallery ?? []) as (number | Media)[]).map(asMedia).filter(Boolean) as Media[]

  return (
    <>
      <PageCover title={s?.menuLabel || s?.title || ''} intro={s?.shortText} placeholder={Boolean(s?.placeholder)} />

      <section className="course paper-section" aria-labelledby="course-t">
        <div className="wrap course-grid">
          <div className="course-text">
            <h2 id="course-t">{s?.title}</h2>
            {s?.fullText && <RichText data={s.fullText as never} className="prose" />}
          </div>
          <aside className="course-side">
            <div className="course-photo">
              {photo ? (
                <Picture media={photo} sizes="(min-width: 1024px) 35vw, 100vw" />
              ) : (
                <Chapter>{s?.menuLabel || s?.title}</Chapter>
              )}
            </div>
            <CourseDetails pizza={s} />
            <RequestButton
              href={requestHref(site.settings, 'pizzaCourse')}
              label={s?.buttonLabel || ''}
              phone={site.settings?.phoneReservations}
            />
          </aside>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="course-gallery paper-section" aria-labelledby="course-g">
          <div className="wrap">
            <h2 id="course-g">{UI.gallery}</h2>
            <ul className="archive-grid">
              {gallery.map((m) => (
                <li key={m.id} className="archive-item">
                  {m.kind === 'clip' ? (
                    <video controls preload="none" playsInline muted poster={asMedia(m.poster)?.url ?? undefined}>
                      {videoSources(m).map((v) => (
                        <source key={v.src} src={v.src} type={v.type} />
                      ))}
                    </video>
                  ) : (
                    <Picture media={m} sizes="(min-width: 1024px) 25vw, 50vw" />
                  )}
                </li>
              ))}
            </ul>
            {s?.placeholder && <ExampleTag className="section-tag" />}
          </div>
        </section>
      )}

      <FaqList faqs={site.faqs} group="pizza" />
    </>
  )
}
