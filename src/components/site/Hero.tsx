import React from 'react'

import type { Media } from '@/payload-types'
import type { SiteData } from '@/lib/site/data'
import { telHref, todayIso } from '@/lib/site/format'
import { asMedia, focalPosition, pictureSources, videoSources } from '@/lib/site/media'
import { isOn, section } from '@/lib/site/sections'

import { AwardBadge, awardsFor, BookButton, ExampleTag, ExternalLink } from './Bits'
import { HeroMotion } from './HeroMotion'
import { StayRequest } from './StayRequest'
import { renderLocale } from '@/lib/site/i18n/server'

const DESKTOP = '(min-width: 1024px)'

/**
 * Un cadru al copertei: imaginea de telefon (9:16) sub 1024 px, cea de desktop (16:9) de la 1024 px,
 * fiecare în AVIF și WebP. Dacă lipsește una, se folosește cealaltă.
 */
const MOBILE_SIZES = '88vw'

function Frame({
  desktop,
  mobile,
  priority,
  deferred = false,
  className,
}: {
  desktop: Media | null
  mobile: Media | null
  priority: boolean
  /** Cadrele 2…n din slideshow: adresele stau în `data-*` până după încărcarea paginii (HeroMotion). */
  deferred?: boolean
  className?: string
}) {
  const d = desktop ?? mobile
  const m = mobile ?? desktop
  if (!d || !m) return null
  const ds = pictureSources(d, 1920)
  const ms = pictureSources(m, 960)
  // Un cadru amânat nu cere nimic la deschidere: fotografia LCP (primul cadru) are rețeaua singură (D-60).
  const set = (v: string | null) => (deferred ? { 'data-srcset': v ?? undefined } : { srcSet: v ?? undefined })
  return (
    <picture className={className}>
      {ds.avif && <source media={DESKTOP} type="image/avif" {...set(ds.avif)} sizes="100vw" />}
      {ds.webp && <source media={DESKTOP} type="image/webp" {...set(ds.webp)} sizes="100vw" />}
      {/* Pe telefon, coperta cere o variantă cu ~12% sub densitatea ecranului: sub umbra copertei nu
          se vede, iar fișierul are cam jumătate din mărime pe 4G (D-60, LCP cu fotografiile reale). */}
      {ms.avif && <source type="image/avif" {...set(ms.avif)} sizes={MOBILE_SIZES} />}
      {ms.webp && <source type="image/webp" {...set(ms.webp)} sizes={MOBILE_SIZES} />}
      <img
        {...(deferred ? { 'data-src': ms.src } : { src: ms.src })}
        width={ms.width || undefined}
        height={ms.height || undefined}
        alt={m.alt ?? ''}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        style={{ objectPosition: focalPosition(m) }}
      />
    </picture>
  )
}

/**
 * Hero (content-model 4.1, wireframe S-01, contractul direcției B): coperta. Fotografia sau clipul
 * pe toată lățimea, cu umbra caldă dinspre stânga; tagline-ul (D-01, în engleză), insigna premiului
 * (D-20), subtitlul, „Rezervă o masă” și „Meniu”; la bază, fâșia de hârtie a cererii de cazare.
 * Pe telefon, acțiunile stau în bara fixă de jos.
 */
export function Hero({ site, id }: { site: SiteData; id: string }) {
  const hero = section(site.home, 'hero')
  const s = site.settings
  const award = awardsFor(site.awards, 'hero')[0]
  const tel = telHref(s?.phoneReservations)

  // Cadrele: în modul video, posterul (apare primul, D-29); în modul slideshow, cadrele din panou.
  const slides =
    hero?.mediaMode === 'slideshow'
      ? (hero.slides ?? []).map((f) => ({ desktop: asMedia(f.desktop), mobile: asMedia(f.mobile) }))
      : [{ desktop: asMedia(hero?.posterDesktop), mobile: asMedia(hero?.posterMobile) }]
  const frames = slides.filter((f) => f.desktop || f.mobile)

  const clipDesktop = hero?.mediaMode !== 'slideshow' ? asMedia(hero?.videoDesktop) : null
  const clipMobile = hero?.mediaMode !== 'slideshow' ? asMedia(hero?.videoMobile) : null
  const video =
    clipDesktop || clipMobile
      ? {
          desktop: videoSources((clipDesktop ?? clipMobile) as Media),
          mobile: videoSources((clipMobile ?? clipDesktop) as Media),
        }
      : null

  const stay = isOn(site.home, 'stay') ? section(site.home, 'stay') : null

  return (
    <section className="hero" id={id} data-hero="" aria-labelledby="hero-title">
      <div className="hero-media">
        {frames.map((f, i) => (
          <Frame
            key={i}
            desktop={f.desktop}
            mobile={f.mobile}
            priority={i === 0}
            deferred={i > 0}
            className={`hero-frame${i === 0 ? ' is-active' : ''}`}
          />
        ))}
        {(video || frames.length > 1) && <HeroMotion locale={renderLocale()} video={video} frames={frames.length} interval={Math.min(15, Math.max(2, Number(hero?.slideSeconds) || 3)) * 1000} />}
      </div>
      <div className="cover-frame" aria-hidden="true" />
      {hero?.placeholder && <ExampleTag floating className="hero-tag" />}

      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1 id="hero-title" className="rise" style={{ '--i': 0 } as React.CSSProperties}>
            {/* Tagline-ul rămâne în engleză și nu se traduce (D-01). */}
            <span lang="en">{s?.tagline}</span>
          </h1>
          {award && (
            <div className="hero-award rise" style={{ '--i': 1 } as React.CSSProperties}>
              <AwardBadge award={award} size="hero" />
            </div>
          )}
          {hero?.subtitle && (
            <p className="hero-sub rise" style={{ '--i': 2 } as React.CSSProperties}>
              {hero.subtitle}
            </p>
          )}
          <div className="hero-actions rise" style={{ '--i': 3 } as React.CSSProperties}>
            <BookButton label={hero?.bookLabel || 'Rezervă o masă'} ialocId={s?.ialocId} tel={tel} />
            {s?.digitalMenuUrl && (
              <ExternalLink href={s.digitalMenuUrl} className="btn btn-ghost">
                {hero?.menuButtonLabel || 'Meniu'}
              </ExternalLink>
            )}
          </div>
        </div>

        {stay && (
          <div className="stay rise" style={{ '--i': 4 } as React.CSSProperties}>
            <StayRequest locale={renderLocale()}
              id="cazare"
              title={stay.title}
              note={stay.note}
              buttonLabel={stay.buttonLabel}
              maxAdults={stay.maxAdults ?? 6}
              maxChildren={stay.maxChildren ?? 4}
              today={todayIso()}
              tag={stay.placeholder ? <ExampleTag className="stay-tag" /> : undefined}
            />
          </div>
        )}
      </div>
    </section>
  )
}
