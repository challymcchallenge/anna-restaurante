'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { UI } from '@/lib/site/strings'

type Source = { src: string; type: string }

/** Mișcarea e permisă doar fără `prefers-reduced-motion` și fără economie de date. Pe server: nu. */
function useMotionAllowed() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () =>
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !(navigator as { connection?: { saveData?: boolean } }).connection?.saveData,
    () => false,
  )
}

/**
 * Mișcarea copertei (D-02, D-29, ADR-005): clipul fără sunet, în buclă, peste poster; sau, în modul
 * slideshow, cadrele care se schimbă la 6 s. Posterul rămâne imaginea principală a primului ecran:
 * clipul pornește doar după încărcarea paginii, ca să nu întârzie afișarea.
 *
 * - `prefers-reduced-motion` sau economia de date: rămâne posterul, fără clip și fără derulare.
 * - Butonul de pauză oprește mișcarea (WCAG 2.2.2: orice se mișcă peste 5 s se poate opri).
 * - Clipul de telefon (9:16) sub 1024 px, cel de desktop (16:9) de la 1024 px.
 */
export function HeroMotion({
  video,
  frames,
}: {
  video: { desktop: Source[]; mobile: Source[] } | null
  frames: number
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [sources, setSources] = useState<Source[] | null>(null)
  const [playing, setPlaying] = useState(false)
  const allowed = useMotionAllowed()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!allowed || !video) return
    const start = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches
      setSources(desktop ? video.desktop : video.mobile)
    }
    if (document.readyState === 'complete') {
      const t = window.setTimeout(start, 300)
      return () => window.clearTimeout(t)
    }
    window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [video, allowed])

  // Slideshow: cadrul activ se schimbă la 6 s (clasa `is-active`, tranziția e în CSS).
  useEffect(() => {
    if (video || frames < 2 || !allowed || paused) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('.hero-frame'))
    let i = Math.max(0, els.findIndex((e) => e.classList.contains('is-active')))
    const t = window.setInterval(() => {
      els[i]?.classList.remove('is-active')
      i = (i + 1) % els.length
      els[i]?.classList.add('is-active')
    }, 6000)
    return () => window.clearInterval(t)
  }, [video, frames, allowed, paused])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (paused) v.pause()
    else v.play().catch(() => setPlaying(false))
  }, [paused, sources])

  const moving = allowed && (Boolean(sources) || (!video && frames > 1))

  return (
    <>
      {sources && (
        <video
          ref={ref}
          className={`hero-video${playing ? ' is-playing' : ''}`}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
      {moving && (
        <button
          className="hero-pause"
          type="button"
          aria-label={paused ? UI.play : UI.pause}
          onClick={() => setPaused((p) => !p)}
        >
          <svg className="icon" aria-hidden="true" focusable="false">
            <use href={paused ? '#i-play' : '#i-pause'} />
          </svg>
        </button>
      )}
    </>
  )
}
