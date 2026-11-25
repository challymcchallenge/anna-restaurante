import React from 'react'

import type { Award } from '@/payload-types'
import { asMedia, pictureSources } from '@/lib/site/media'
import { UI } from '@/lib/site/i18n/server'

import { Icon } from './Icons'

/**
 * Eticheta obligatorie pe conținutul provizoriu (D-08): semn + text, nu doar culoare.
 * `floating`: peste o imagine; altfel în rândul textului.
 */
export function ExampleTag({ floating = false, className }: { floating?: boolean; className?: string }) {
  return (
    <span className={['example-tag', floating ? 'example-tag--float' : '', className].filter(Boolean).join(' ')}>
      <Icon name="image" />
      {UI.example}
    </span>
  )
}

/**
 * „Rezervă o masă” (D-03): deschide fereastra ialoc (src/components/site/Ialoc.tsx). Lângă el stă,
 * ascuns, „Sună pentru rezervare”, care apare dacă ialoc nu răspunde (ADR-008). Fără ID ialoc în
 * Setări, rămâne doar telefonul.
 */
export function BookButton({
  label,
  ialocId,
  tel,
  className = 'btn btn-primary',
  date,
}: {
  label: string
  ialocId: string | null | undefined
  tel: string | null
  className?: string
  /** AAAA-LL-ZZ: fereastra ialoc se deschide cu data preselectată (G4-1, D-47). */
  date?: string | null
}) {
  const call = (cls: string) =>
    tel ? (
      <a className={cls} href={tel}>
        <Icon name="phone" />
        {UI.callForBooking}
      </a>
    ) : null
  if (!ialocId) return call(className)
  const fallback = call(`${className} ialoc-fallback`)
  return (
    <>
      <button className={className} type="button" data-ialoc="" data-ialoc-date={date || undefined} aria-haspopup="dialog">
        {label}
      </button>
      {fallback}
    </>
  )
}

/** Link extern, cu mențiunea pentru cititoarele de ecran. */
export function ExternalLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener">
      {children}
      <span className="sr-only"> {UI.newTab}</span>
    </a>
  )
}

export type AwardPlacement = 'hero' | 'wines-section' | 'wines-page' | 'footer'

/** Premiile active care au locul dat bifat în panou. */
export function awardsFor(awards: Award[], placement: AwardPlacement) {
  return awards.filter((a) => a.placements?.includes(placement))
}

/**
 * Insigna premiului (D-10, D-20, ADR-012). Până la acordare (fără nivel, an sau logo): spațiul
 * rezervat, cu dimensiunile finale și textul „nivel și an la confirmare”. După: logo-ul oficial,
 * exact cum a fost încărcat (fără recolorare sau decupare), la înălțimea locului.
 */
export function AwardBadge({
  award,
  size,
  tone = 'dark',
  className,
}: {
  award: Award
  /** Înălțimea locului: hero 72/96, Vinuri 120, footer 56 (wireframe S-01); logo-ul oficial, dublu (D-69). */
  size: 'hero' | 'section' | 'footer'
  tone?: 'dark' | 'light'
  className?: string
}) {
  const badge = asMedia(award.badge)
  const confirmed = Boolean(award.level && award.year && badge)
  const cls = ['award', `award--${size}`, `award--${tone}`, className].filter(Boolean).join(' ')

  if (confirmed && badge) {
    const s = pictureSources(badge, 640)
    const label = `${award.name}, ${award.level} ${award.year}`
    const img = (
      <span className={`${cls} award--official`}>
        {/* BADGE: fișierul oficial, nemodificat (fără variante), la înălțimea locului. */}
        <img src={badge.url as string} width={s.width || undefined} height={s.height || undefined} alt={label} />
      </span>
    )
    return award.sourceUrl ? (
      <a className="award-link" href={award.sourceUrl} target="_blank" rel="noopener">
        {img}
        <span className="sr-only">{UI.newTab}</span>
      </a>
    ) : (
      img
    )
  }

  return (
    <span className={`${cls} award--pending`} role="img" aria-label={UI.awardPendingLabel(award.name)}>
      <span className="award-seal" aria-hidden="true">
        <Icon name="award" />
      </span>
      <span className="award-text" aria-hidden="true">
        <strong>{award.name}</strong>
        {UI.awardPending}
      </span>
    </span>
  )
}
