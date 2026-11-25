'use client'

import { useEffect, useState } from 'react'

import { clientUI } from '@/lib/site/i18n/client'

/**
 * Săgețile unui slider (G3-1): derulează lista cu câte un card, fără rotire automată. Lista rămâne
 * derulabilă cu degetul, cu mouse-ul și cu tastatura (linkurile din carduri). O săgeată se
 * dezactivează la capătul ei.
 */
export function SliderArrows({ trackId, locale }: { trackId: string; locale: string }) {
  const UI = clientUI(locale)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const track = document.getElementById(trackId)
    if (!track) return
    const update = () => {
      const max = track.scrollWidth - track.clientWidth
      setEdge({ start: track.scrollLeft <= 2, end: track.scrollLeft >= max - 2 })
    }
    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [trackId])

  const go = (dir: -1 | 1) => {
    const track = document.getElementById(trackId)
    const card = track?.querySelector<HTMLElement>('li')
    if (!track || !card) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="slider-arrows">
      <button className="slider-arrow" type="button" aria-controls={trackId} aria-label={UI.prev} disabled={edge.start} onClick={() => go(-1)}>
        <svg className="icon" aria-hidden="true" focusable="false">
          <use href="#i-chevron-left" />
        </svg>
      </button>
      <button className="slider-arrow" type="button" aria-controls={trackId} aria-label={UI.next} disabled={edge.end} onClick={() => go(1)}>
        <svg className="icon" aria-hidden="true" focusable="false">
          <use href="#i-chevron-right" />
        </svg>
      </button>
    </div>
  )
}
