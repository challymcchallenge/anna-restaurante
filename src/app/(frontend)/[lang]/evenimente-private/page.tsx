import React from 'react'

import { FaqList, PageCover, RequestButton } from '@/components/site/Events'
import { ExampleTag } from '@/components/site/Bits'
import { Picture } from '@/components/site/Picture'
import type { Media } from '@/payload-types'
import { slugify, telHref } from '@/lib/site/format'
import { asMedia } from '@/lib/site/media'
import { sitePage, sitePageMeta } from '@/lib/site/page'
import { requestHref } from '@/lib/site/requests'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/i18n/server'

/** S-02 · Evenimente private: saloanele, cu fotografiile lor, cererea și întrebările frecvente. */
export const generateMetadata = () => sitePageMeta('privateEvents', 'pagePrivateEvents')

export default async function PrivateEventsPage() {
  const site = await sitePage('privateEvents')
  const s = section(site.home, 'privateEvents')
  const types = (s?.eventTypes ?? []).map((t) => t.label).filter(Boolean)
  const phone = site.settings?.phoneEvents
  const href = requestHref(site.settings, 'privateEvent')
  const tel = telHref(phone)

  return (
    <>
      <PageCover title={s?.menuLabel || s?.title || ''} intro={s?.intro} placeholder={Boolean(s?.placeholder)}>
        {types.length > 0 && (
          <ul className="types types--dark">
            {types.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </PageCover>

      {site.salons.map((salon, i) => {
        const photos = ((salon.photos ?? []) as (number | Media)[]).map(asMedia).filter(Boolean) as Media[]
        const where = [salon.location, UI.upTo(salon.capacity)].filter(Boolean).join(' · ')
        const id = slugify(salon.name)
        return (
          <section
            key={salon.id}
            className={`salon-page paper-section${i % 2 ? ' salon-page--flip' : ''}`}
            id={id}
            aria-labelledby={`${id}-t`}
          >
            <div className="wrap salon-page-grid">
              <div className="salon-gallery">
                {photos.length > 0 ? (
                  <ul className="photo-track" aria-label={`${salon.name}: ${UI.gallery}`}>
                    {photos.map((m) => (
                      <li key={m.id}>
                        <Picture media={m} sizes="(min-width: 1024px) 55vw, 88vw" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="salon-visual">
                    <span className="chapter" aria-hidden="true">
                      <span>{salon.name}</span>
                    </span>
                  </span>
                )}
              </div>
              <div className="salon-text">
                <h2 id={`${id}-t`}>{salon.name}</h2>
                <p className="salon-where">{where.charAt(0).toUpperCase() + where.slice(1)}</p>
                <p className="section-intro">{salon.description}</p>
                {(salon.amenities ?? []).length > 0 && (
                  <>
                    <h3 className="mini-title">{UI.amenities}</h3>
                    <ul className="types">
                      {(salon.amenities ?? []).map((a) => (
                        <li key={a.id ?? a.label}>{a.label}</li>
                      ))}
                    </ul>
                  </>
                )}
                {salon.placeholder && <ExampleTag className="section-tag" />}
              </div>
            </div>
          </section>
        )
      })}

      <section className="cta-band cover-section" aria-label={s?.buttonLabel ?? UI.callManager}>
        <div className="wrap cta-band-in">
          <p className="cta-band-title">{s?.title}</p>
          <div className="private-cta">
            <RequestButton href={href} label={s?.buttonLabel || UI.callManager} phone={phone} className="btn btn-primary" />
            {href && tel && phone && (
              <a className="text-link text-link--dark" href={tel}>
                {UI.callManager} · {phone}
              </a>
            )}
          </div>
        </div>
      </section>

      <FaqList faqs={site.faqs} group="private-events" />
    </>
  )
}
