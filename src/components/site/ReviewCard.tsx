import React from 'react'

import { monthYear } from '@/lib/site/format'
import { UI } from '@/lib/site/i18n/server'
import type { Review } from '@/payload-types'

import { ExampleTag, ExternalLink } from './Bits'
import { Icon } from './Icons'

/** Limba paginii publice până la traduceri (F4, ADR-007). */
const PAGE_LANG = 'ro'

/**
 * O recenzie (content-model 5.3), pe Acasă la restaurant și la hotel. Citatul rămâne în limba în
 * care l-a scris oaspetele și primește `lang`, ca cititoarele de ecran să-l pronunțe corect (D-55).
 * Fără dată, sub citat apare doar sursa.
 */
export function ReviewCard({ review: v, lead = false }: { review: Review; lead?: boolean }) {
  const source = UI.sources[v.source] ?? ''
  const when = monthYear(v.date)
  const lang = v.language && v.language !== PAGE_LANG ? v.language : undefined
  return (
    <li className={`review${lead ? ' review--lead' : ''}`}>
      <figure>
        <blockquote lang={lang}>
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
