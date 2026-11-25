import React from 'react'

import type { SiteData } from '@/lib/site/data'
import { price, telHref } from '@/lib/site/format'
import { asMedia } from '@/lib/site/media'
import { requestHref } from '@/lib/site/requests'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/i18n/server'
import type { Media } from '@/payload-types'

import { ExampleTag, ExternalLink } from './Bits'
import { Chapter, RequestButton } from './Events'
import { Icon } from './Icons'
import { Picture } from './Picture'
import { ReviewCard } from './ReviewCard'

/**
 * Acasă · Cazare la Hotel ANNA (PLAN F3 pasul 7, content-model 4.9, wireframe S-01 secțiunea 9).
 * Prezentarea, fotografiile hotelului, tipurile de camere, recenziile grupului Hotel și cererea
 * de ofertă (D-15: o cerere, confirmată de hotel; nu o rezervare pe loc). Prețul „de la” apare
 * doar dacă e completat în panou. Fără fotografii: numele pe copertă, ca la saloane.
 */
export function Hotel({ site, id }: { site: SiteData; id: string }) {
  const s = section(site.home, 'hotel')
  const stay = section(site.home, 'stay')
  const titleId = `${id}-titlu`
  const photos = ((s?.photos ?? []) as (number | Media)[]).map(asMedia).filter((m): m is Media => Boolean(m))
  const [lead, ...more] = photos
  const where = [s?.hotelName, s?.hotelAddress].filter(Boolean).join(' · ')
  const rooms = site.roomTypes
  const reviews = site.hotelReviews

  return (
    <section className="hotel cover-section" id={id} aria-labelledby={titleId}>
      <div className="wrap hotel-grid">
        <div className="hotel-head">
          <h2 id={titleId}>{s?.title}</h2>
          {s?.intro && <p className="section-intro">{s.intro}</p>}
          {where && (
            <p className="hotel-where">
              <Icon name="map-pin" />
              {where}
            </p>
          )}
          {(s?.hotelPhone || s?.hotelEmail) && (
            <p className="hotel-reach">
              {s?.hotelPhone && telHref(s.hotelPhone) && (
                <a href={telHref(s.hotelPhone) as string}>
                  <Icon name="phone" />
                  {s.hotelPhone}
                </a>
              )}
              {s?.hotelEmail && <a href={`mailto:${s.hotelEmail}`}>{s.hotelEmail}</a>}
            </p>
          )}
          {s?.priceFrom != null && (
            <p className="hotel-price">
              {UI.priceFrom} <b>{price(s.priceFrom)}</b>
              {s.priceNote ? ` · ${s.priceNote}` : ''}
            </p>
          )}
          {s?.placeholder && <ExampleTag className="section-tag" />}
          <div className="private-cta">
            <RequestButton
              className="btn btn-primary"
              href={requestHref(site.settings, 'accommodation')}
              label={stay?.buttonLabel || ''}
              phone={site.settings?.phoneReservations}
            />
            {s?.hotelUrl && (
              <ExternalLink href={s.hotelUrl} className="text-link text-link--dark">
                {UI.visitSite(s.hotelUrl)}
                <Icon name="arrow-up-right" />
              </ExternalLink>
            )}
          </div>
        </div>

        <div className={`hotel-photos${more.length ? ' hotel-photos--more' : ''}`}>
          <div className="hotel-photo hotel-photo--lead">
            {lead ? (
              <Picture media={lead} sizes="(min-width: 1024px) 56vw, 100vw" />
            ) : (
              <Chapter>{s?.hotelName || s?.menuLabel}</Chapter>
            )}
          </div>
          {more.map((m) => (
            <div key={m.id} className="hotel-photo">
              <Picture media={m} sizes="(min-width: 1024px) 28vw, 50vw" />
            </div>
          ))}
        </div>
      </div>

      {rooms.length > 0 && (
        <div className="wrap">
          <h3 className="mini-title hotel-mini">{UI.roomsTitle}</h3>
          <ul className="hotel-rooms">
            {rooms.map((r) => {
              const photo = asMedia(r.photo)
              return (
                <li key={r.id} className="hotel-room">
                  <span className="hotel-room-visual">
                    {photo ? (
                      <Picture media={photo} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
                    ) : (
                      <Chapter>{r.name}</Chapter>
                    )}
                  </span>
                  <p className="hotel-room-name">{r.name}</p>
                  {r.description && <p className="hotel-room-desc">{r.description}</p>}
                  {r.placeholder && <ExampleTag className="row-tag" />}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="wrap">
          <h3 className="mini-title hotel-mini">{UI.hotelReviewsTitle}</h3>
          <ul className="review-list hotel-reviews">
            {reviews.map((v) => (
              <ReviewCard key={v.id} review={v} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
