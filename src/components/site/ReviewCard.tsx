import React from 'react'

import { monthYear } from '@/lib/site/format'
import { renderLocale, UI } from '@/lib/site/i18n/server'
import type { Review } from '@/payload-types'

import { ExampleTag, ExternalLink } from './Bits'
import { Icon } from './Icons'

/**
 * O recenzie (content-model 5.3), pe Acasă la restaurant și la hotel. Citatul rămâne în limba în
 * care l-a scris oaspetele și primește `lang`, ca cititoarele de ecran să-l pronunțe corect (D-55).
 * Fără dată, sub citat apare doar sursa. În altă limbă (F4-3, D-64): citatul tradus are sub el
 * „Tradus automat din …”; netradus, rămâne în limba oaspetelui, cu `lang`.
 */
export function ReviewCard({ review: v, lead = false }: { review: Review; lead?: boolean }) {
  const source = UI.sources[v.source] ?? ''
  const when = monthYear(v.date)
  const page = renderLocale()
  const original = v.language || 'ro'
  const translated = page !== original && (v.i18nStatus === 'auto' || v.i18nStatus === 'verified')
  const lang = !translated && original !== page ? original : undefined
  return (
    <li className={`review${lead ? ' review--lead' : ''}`}>
      <figure>
        <blockquote lang={lang}>
          <p>
            {UI.quotes[0]}
            {v.text}
            {UI.quotes[1]}
          </p>
        </blockquote>
        {translated && <p className="review-translated">{UI.translatedFrom(UI.languageNames[original] ?? original)}</p>}
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
            {source && (v.sourceUrl ? <ExternalLink href={v.sourceUrl}>{source}</ExternalLink> : source)}
            {source && when ? ' · ' : ''}
            {when}
          </span>
          {v.placeholder && <ExampleTag className="row-tag" />}
        </figcaption>
      </figure>
    </li>
  )
}
