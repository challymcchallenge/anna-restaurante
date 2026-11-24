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

/**
 * Secțiunea Restaurant (PLAN F3 pasul 3, content-model 4.3–4.5): Bucătăria, Vinuri, Ce spun oaspeții.
 * Tot conținutul vine din panou; conținutul provizoriu poartă eticheta „Exemplu · de înlocuit”.
 */

/* ---------- Bucătăria: o pagină de meniu ---------- */

export function Kitchen({ site, id }: { site: SiteData; id: string }) {
  const k = section(site.home, 'kitchen')
  const menuUrl = site.settings?.digitalMenuUrl
  const cats = site.dishCategories
  const withPhoto = cats
    .map((c, i) => ({ c, i, photo: asMedia(c.photo) }))
    .filter((x) => x.photo)
  const anyPlaceholder = Boolean(k?.placeholder) || cats.some((c) => c.placeholder)
  const titleId = `${id}-titlu`

  return (
    <section className="kitchen paper-section" id={id} aria-labelledby={titleId}>
      <div className={`wrap kitchen-grid${withPhoto.length ? '' : ' kitchen-grid--text'}`}>
        <div className="kitchen-head">
          <h2 id={titleId}>{k?.title}</h2>
          {k?.intro && <p className="section-intro">{k.intro}</p>}
          {anyPlaceholder && !withPhoto.length && <ExampleTag className="section-tag" />}
        </div>

        {withPhoto.length > 0 && (
          // Fotografia categoriei: pe desktop se schimbă după rândul peste care treci (CSS :has).
          <div className="kitchen-photos">
            {withPhoto.map(({ i, photo }, n) => (
              <div key={i} className={`kitchen-photo${n === 0 ? ' is-default' : ''}`} data-photo={i}>
                {/* Doar prima are text alternativ; celelalte apar la trecerea peste rândul lor. */}
                <Picture media={photo!} sizes="(min-width: 1024px) 38vw, 100vw" alt={n === 0 ? undefined : ''} />
              </div>
            ))}
            {anyPlaceholder && <ExampleTag floating className="photo-tag" />}
          </div>
        )}

        <div className="kitchen-menu">
          {cats.length > 0 && (
            <ul className="menu-list">
              {cats.map((c, i) => {
                const href = c.link || menuUrl
                const row = (
                  <>
                    <span className="menu-name">{c.name}</span>
                    <span className="menu-dots" aria-hidden="true" />
                    {c.shortText && <span className="menu-note">{c.shortText}</span>}
                  </>
                )
                return (
                  <li key={c.id} className="menu-row" data-photo={asMedia(c.photo) ? i : undefined}>
                    {href ? <ExternalLink href={href}>{row}</ExternalLink> : <span className="menu-row-static">{row}</span>}
                  </li>
                )
              })}
            </ul>
          )}
          {menuUrl && k?.buttonLabel && (
            <ExternalLink href={menuUrl} className="btn btn-secondary section-cta">
              <Icon name="book" />
              {k.buttonLabel}
            </ExternalLink>
          )}
        </div>
      </div>
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
