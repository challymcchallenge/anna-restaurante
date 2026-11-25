'use client'

import { useEffect, useRef, useState } from 'react'

import { clientUI } from '@/lib/site/i18n/client'
import { useMotionAllowed } from './HeroMotion'

type Source = { src: string; type: string }

/**
 * Clipul cursului de pizza pe Acasă, lângă fotografie (D-71).
 *
 * - Nu descarcă nimic până nu ajunge pe ecran (`preload="none"`; se vede doar imaginea de început).
 * - Pe ecran pornește singur, fără sunet, în buclă; când iese de pe ecran se oprește.
 * - Cu `prefers-reduced-motion` sau economie de date nu pornește singur: rămâne imaginea, cu butonul de pornire.
 * - Două butoane: pauză/pornire (WCAG 2.2.2) și sunet. Sunetul pornește doar la apăsare.
 */
export function ClipCard({
  sources,
  poster,
  ratio,
  label,
  locale,
  className,
}: {
  sources: Source[]
  poster?: string
  /** Lățime / înălțime, de exemplu 9 / 16. */
  ratio: number
  label: string
  locale: string
  className?: string
}) {
  const UI = clientUI(locale)
  const ref = useRef<HTMLVideoElement>(null)
  const allowed = useMotionAllowed()
  const [inView, setInView] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const shouldPlay = inView && !stopped && (allowed || started)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (shouldPlay) v.play().catch(() => setPlaying(false))
    else v.pause()
  }, [shouldPlay])

  useEffect(() => {
    if (ref.current) ref.current.muted = muted
  }, [muted])

  const togglePlay = () => {
    if (playing) {
      setStopped(true)
    } else {
      setStopped(false)
      setStarted(true)
    }
  }
  const toggleSound = () => {
    setMuted((m) => !m)
    if (!playing) {
      setStopped(false)
      setStarted(true)
    }
  }

  return (
    <div className={['clip-card', className].filter(Boolean).join(' ')}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-label={label}
        style={{ aspectRatio: String(ratio) }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      <div className="clip-controls">
        <button type="button" aria-label={playing ? UI.clipPause : UI.clipPlay} onClick={togglePlay}>
          <svg className="icon" aria-hidden="true" focusable="false">
            <use href={playing ? '#i-pause' : '#i-play'} />
          </svg>
        </button>
        <button type="button" aria-label={muted ? UI.clipSoundOn : UI.clipSoundOff} onClick={toggleSound}>
          <svg className="icon" aria-hidden="true" focusable="false">
            <use href={muted ? '#i-volume-x' : '#i-volume-2'} />
          </svg>
        </button>
      </div>
    </div>
  )
}
