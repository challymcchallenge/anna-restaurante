import React from 'react'

import type { Media } from '@/payload-types'
import { focalPosition, pictureSources } from '@/lib/site/media'

/**
 * O fotografie din Biblioteca media (ADR-004): AVIF, apoi WebP, apoi rezerva; dimensiunile reale
 * (fără salt de pagină), punctul focal din panou și textul alternativ de pe fișier.
 */
export function Picture({
  media,
  sizes,
  className,
  priority = false,
  alt,
  fallbackWidth,
}: {
  media: Media
  sizes: string
  className?: string
  /** Imaginea principală a primului ecran: se încarcă imediat, cu prioritate. */
  priority?: boolean
  /** Altă descriere decât cea din panou (de exemplu, gol pentru o imagine pur decorativă). */
  alt?: string
  fallbackWidth?: number
}) {
  const s = pictureSources(media, fallbackWidth)
  return (
    <picture className={className}>
      {s.avif && <source type="image/avif" srcSet={s.avif} sizes={sizes} />}
      {s.webp && <source type="image/webp" srcSet={s.webp} sizes={sizes} />}
      <img
        src={s.src}
        width={s.width || undefined}
        height={s.height || undefined}
        alt={alt ?? media.alt ?? ''}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        style={{ objectPosition: focalPosition(media) }}
      />
    </picture>
  )
}
