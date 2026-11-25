import Link from 'next/link'
import React from 'react'

import type { SiteData } from '@/lib/site/data'
import { asMedia } from '@/lib/site/media'
import { section } from '@/lib/site/sections'
import { lp, renderLocale, UI } from '@/lib/site/i18n/server'
import { byTypeGroups, typesIn } from '@/lib/site/wines'

import { AwardBadge, awardsFor, ExampleTag, ExternalLink } from './Bits'
import { Icon } from './Icons'
import { Picture } from './Picture'
import { ReviewCard } from './ReviewCard'
import { SliderArrows } from './SliderArrows'
import { GroupLogo, WineFilter, WineItem } from './WineList'

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
        {cats.length > 1 && <SliderArrows locale={renderLocale()} trackId={trackId} />}
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

/* ---------- Vinuri: lista de vinuri, pe copertă (D-46, poza 6 a lui Alin) ---------- */

export function Wines({ site, id }: { site: SiteData; id: string }) {
  const w = section(site.home, 'wines')
  const award = awardsFor(site.awards, 'wines-section')[0]
  const wines = site.wines
  const titleId = `${id}-titlu`

  return (
    <section className="wines cover-section" id={id} aria-labelledby={titleId}>
      <div className="wrap">
        <header className="wines-head">
          <GroupLogo site={site} onDark className="wines-logo" />
          <h2 id={titleId}>{w?.title}</h2>
          {w?.intro && <p className="section-intro">{w.intro}</p>}
          {w?.placeholder && <ExampleTag className="section-tag" />}
          {award && (
            <div className="wines-award">
              <AwardBadge award={award} size="section" />
              {award.line && <p className="wines-line">{award.line}</p>}
            </div>
          )}
        </header>

        {wines.length > 0 && (
          <div className="wine-board">
            <WineFilter name={`${id}-tip`} types={typesIn(wines)} />
            <div className="wine-groups">
              {byTypeGroups(wines).map((g) => (
                <section
                  key={g.type}
                  className="wine-group"
                  data-type={g.type}
                  aria-labelledby={`${id}-${g.type}`}
                >
                  <h3 id={`${id}-${g.type}`} className="wine-group-title">
                    {UI.wineGroups[g.type]}
                  </h3>
                  <ul className="wine-items">
                    {g.wines.map((x) => (
                      <WineItem key={x.id} wine={x} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}

        {w?.buttonLabel && (
          <div className="wines-cta">
            <Link className="btn btn-ghost" href={lp('/catalog-vinuri')}>
              <Icon name="wine" />
              {w.buttonLabel}
            </Link>
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
            {reviews.map((v, n) => (
              <ReviewCard key={v.id} review={v} lead={n === 0} />
            ))}
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
