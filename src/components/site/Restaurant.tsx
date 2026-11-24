import React from 'react'

import { WINE_TYPES } from '@/collections/Wines'
import type { SiteData } from '@/lib/site/data'
import { monthYear, price } from '@/lib/site/format'
import { asMedia } from '@/lib/site/media'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'

import { AwardBadge, awardsFor, ExampleTag, ExternalLink } from './Bits'
import { Icon } from './Icons'
import { Picture } from './Picture'
import { SliderArrows } from './SliderArrows'

/**
 * Secțiunea Restaurant (PLAN F3 pasul 3, content-model 4.3–4.5): Bucătăria, Vinuri, Ce spun oaspeții.
 * Tot conținutul vine din panou; conținutul provizoriu poartă eticheta „Exemplu · de înlocuit”.
 */

/* ---------- Bucătăria: sliderul de categorii (G3-1, D-44) ---------- */

export function Kitchen({ site, id }: { site: SiteData; id: string }) {
  const k = section(site.home, 'kitchen')
  const menuUrl = site.settings?.digitalMenuUrl
  const cats = site.dishCategories
  const anyPlaceholder = Boolean(k?.placeholder) || cats.some((c) => c.placeholder)
  const titleId = `${id}-titlu`
  const trackId = `${id}-categorii`

  return (
    <section className="kitchen paper-section" id={id} aria-labelledby={titleId}>
      <div className="wrap cat-head">
        <div className="cat-head-text">
          <h2 id={titleId}>{k?.title}</h2>
          {k?.intro && <p className="section-intro">{k.intro}</p>}
          {anyPlaceholder && <ExampleTag className="section-tag" />}
        </div>
        {cats.length > 1 && <SliderArrows trackId={trackId} />}
      </div>

      {cats.length > 0 && (
        <ul className="cat-track" id={trackId} aria-labelledby={titleId}>
          {cats.map((c) => {
            const href = c.link || menuUrl
            const photo = asMedia(c.photo)
            const card = (
              <>
                <span className="cat-visual">
                  {photo ? (
                    <Picture media={photo} sizes="(min-width: 1280px) 300px, (min-width: 1024px) 30vw, 72vw" />
                  ) : (
                    // Fără fotografie: pagina de titlu a capitolului, pe copertă, cu chenar de folio.
                    <span className="chapter" aria-hidden="true">
                      <span>{c.name}</span>
                    </span>
                  )}
                </span>
                <span className="cat-name">{c.name}</span>
                {c.shortText && <span className="cat-note">{c.shortText}</span>}
              </>
            )
            return (
              <li key={c.id} className="cat">
                {href ? (
                  <ExternalLink href={href} className="cat-card">
                    {card}
                  </ExternalLink>
                ) : (
                  <span className="cat-card">{card}</span>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {menuUrl && k?.buttonLabel && (
        <div className="wrap">
          <ExternalLink href={menuUrl} className="btn btn-secondary section-cta">
            <Icon name="book" />
            {k.buttonLabel}
          </ExternalLink>
        </div>
      )}
    </section>
  )
}

/* ---------- Vinuri: lista de vinuri, pe copertă ---------- */

const typeLabel = (t: string) => WINE_TYPES.find((w) => w.value === t)?.label ?? t
const volumeLabel = (v: string | null | undefined) => (v ? `${v.replace('.', ',')} l` : '')

export function Wines({ site, id }: { site: SiteData; id: string }) {
  const w = section(site.home, 'wines')
  const award = awardsFor(site.awards, 'wines-section')[0]
  const wines = site.wines
  const visual = wines.map((x) => ({ wine: x, photo: asMedia(x.photo) })).find((x) => x.photo)
  const titleId = `${id}-titlu`

  return (
    <section className="wines cover-section" id={id} aria-labelledby={titleId}>
      <div className="wrap">
        <header className="wines-head">
          {award && (
            <div className="wines-award">
              <AwardBadge award={award} size="section" />
              {award.line && <p className="wines-line">{award.line}</p>}
            </div>
          )}
          <h2 id={titleId}>{w?.title}</h2>
          {w?.intro && <p className="section-intro">{w.intro}</p>}
          {w?.placeholder && <ExampleTag className="section-tag" />}
        </header>

        <div className={`wines-body${visual ? '' : ' wines-body--list'}`}>
          {wines.length > 0 && (
            <ul className="wine-list">
              {wines.map((x) => {
                const meta = [
                  typeLabel(x.type),
                  [x.region, x.country].filter(Boolean).join(', '),
                  x.vintage ? String(x.vintage) : null,
                ].filter(Boolean)
                return (
                  <li key={x.id} className="wine">
                    <div className="wine-main">
                      <h3 className="wine-name">{x.name}</h3>
                      {x.producer && <p className="wine-producer">{x.producer}</p>}
                      <p className="wine-meta">
                        {meta.join(' · ')}
                        {x.placeholder && <ExampleTag className="row-tag" />}
                      </p>
                    </div>
                    <span className="wine-dots" aria-hidden="true" />
                    <p className="wine-price">
                      <span className="wine-amount">{price(x.priceBottle)}</span>
                      <span className="wine-unit">
                        {UI.bottle} {volumeLabel(x.volume)}
                      </span>
                      {x.priceGlass != null && (
                        <span className="wine-unit">
                          {price(x.priceGlass)} {UI.glass}
                        </span>
                      )}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
          {visual?.photo && (
            <div className="wines-photo">
              <Picture media={visual.photo} sizes="(min-width: 1024px) 34vw, 100vw" />
              {visual.wine.placeholder && <ExampleTag floating className="photo-tag" />}
            </div>
          )}
        </div>

        {w?.buttonLabel && (
          <div className="wines-cta">
            <a className="btn btn-ghost" href="/catalog-vinuri">
              <Icon name="wine" />
              {w.buttonLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------- Ce spun oaspeții ---------- */

export function Reviews({ site, id }: { site: SiteData; id: string }) {
  const r = section(site.home, 'reviews')
  const reviews = site.reviews
  const reviewUrl = site.settings?.googleReviewUrl
  const titleId = `${id}-titlu`

  return (
    <section className="reviews paper-section" id={id} aria-labelledby={titleId}>
      <div className="wrap reviews-grid">
        <div className="reviews-head">
          <h2 id={titleId}>{r?.title}</h2>
          {r?.placeholder && <ExampleTag className="section-tag" />}
        </div>
        {reviews.length > 0 && (
          <ul className="review-list">
            {reviews.map((v, n) => {
              const source = UI.sources[v.source] ?? ''
              const when = monthYear(v.date)
              return (
                <li key={v.id} className={`review${n === 0 ? ' review--lead' : ''}`}>
                  <figure>
                    <blockquote>
                      <p>„{v.text}”</p>
                    </blockquote>
                    <figcaption>
                      {v.rating ? (
                        <span className="review-stars" role="img" aria-label={UI.ratingLabel(v.rating)}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Icon key={i} name="star" className={i < (v.rating ?? 0) ? 'is-on' : ''} />
                          ))}
                        </span>
                      ) : null}
                      <span className="review-author">{v.author}</span>
                      <span className="review-source">
                        {source &&
                          (v.sourceUrl ? <ExternalLink href={v.sourceUrl}>{source}</ExternalLink> : source)}
                        {source && when ? ' · ' : ''}
                        {when}
                      </span>
                      {v.placeholder && <ExampleTag className="row-tag" />}
                    </figcaption>
                  </figure>
                </li>
              )
            })}
          </ul>
        )}
        {reviewUrl && r?.buttonLabel && (
          <div className="reviews-cta">
            <ExternalLink href={reviewUrl} className="btn btn-secondary">
              <Icon name="star" />
              {r.buttonLabel}
            </ExternalLink>
          </div>
        )}
      </div>
    </section>
  )
}
