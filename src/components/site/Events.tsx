import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import React from 'react'

import type { Event, Faq, Media, Salon } from '@/payload-types'
import type { SiteData } from '@/lib/site/data'
import { eventParts, eventWhen, slugify, telHref } from '@/lib/site/format'
import { asMedia } from '@/lib/site/media'
import { requestHref } from '@/lib/site/requests'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'

import { BookButton, ExampleTag } from './Bits'
import { Icon } from './Icons'
import { Picture } from './Picture'

/**
 * F3 pașii 4–6 (PLAN): Evenimente private (S-02), Petreceri și agenda (S-03), Cursuri de pizza (S-04).
 * Tot conținutul vine din panou: Saloane, Seri tematice, Pagina Acasă, Întrebări frecvente.
 */

/* ---------- Piese comune ---------- */

/** Coperta unei pagini proprii: titlul paginii pe fundalul închis, sub antet. */
export function PageCover({
  title,
  intro,
  children,
  placeholder,
  above,
}: {
  title: string
  intro?: string | null
  children?: React.ReactNode
  placeholder?: boolean
  /** Deasupra titlului (de exemplu logo-ul grupului la lista de vinuri). */
  above?: React.ReactNode
}) {
  return (
    <section className="page-cover" data-hero="" aria-labelledby="page-title">
      <div className="cover-frame" aria-hidden="true" />
      <div className="wrap page-cover-in">
        <Link className="back-link" href="/">
          <Icon name="chevron-left" />
          {UI.home}
        </Link>
        {above}
        <h1 id="page-title" className="rise" style={{ '--i': 0 } as React.CSSProperties}>
          {title}
        </h1>
        {intro && (
          <p className="page-intro rise" style={{ '--i': 1 } as React.CSSProperties}>
            {intro}
          </p>
        )}
        {children}
        {placeholder && <ExampleTag className="section-tag" />}
      </div>
    </section>
  )
}

/** Fără fotografie: pagina de titlu a capitolului, pe copertă, cu chenar de folio. */
export function Chapter({ children }: { children: React.ReactNode }) {
  return (
    <span className="chapter" aria-hidden="true">
      <span>{children}</span>
    </span>
  )
}

/** Întrebări frecvente dintr-un grup (content-model 5.8), deschise pe rând. */
export function FaqList({ faqs, group, title = UI.faqTitle }: { faqs: Faq[]; group: Faq['group']; title?: string }) {
  const items = faqs.filter((f) => f.group === group)
  if (!items.length) return null
  return (
    <section className="faq paper-section" aria-labelledby={`faq-${group}`}>
      <div className="wrap faq-grid">
        <h2 id={`faq-${group}`}>{title}</h2>
        <div className="faq-list">
          {items.map((f) => (
            <details key={f.id} className="faq-item">
              <summary>
                <span>{f.question}</span>
                <Icon name="plus" />
              </summary>
              <div className="faq-answer">
                {f.answer && <RichText data={f.answer as never} disableContainer />}
                {f.placeholder && <ExampleTag className="row-tag" />}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Butonul de cerere: Contact cu subiectul ales, sau telefonul dacă subiectul e oprit în Setări. */
function RequestButton({
  href,
  label,
  phone,
  className = 'btn btn-secondary',
}: {
  href: string | null
  label: string
  phone: string | null | undefined
  className?: string
}) {
  if (href) {
    return (
      <Link className={className} href={href}>
        {label}
      </Link>
    )
  }
  const tel = telHref(phone)
  if (!tel) return null
  return (
    <a className={className} href={tel}>
      <Icon name="phone" />
      {label}
    </a>
  )
}

/* ---------- Seri tematice ---------- */

const typeOf = (e: Event) => UI.eventTypes[e.type] ?? ''

/** O seară: afișul (sau data, mare, pe copertă), numele, ziua și ora, invitatul, intrarea. */
export function EventCard({ event, site, sizes }: { event: Event; site: SiteData; sizes: string }) {
  const poster = asMedia(event.poster)
  const p = eventParts(event.startsAt)
  const meta = [typeOf(event), event.guest ? `${UI.guest}: ${event.guest}` : null, event.entry].filter(Boolean)
  return (
    <article className="event">
      <div className="event-visual">
        {poster ? (
          <>
            <Picture media={poster} sizes={sizes} />
            <span className="event-plate" aria-hidden="true">
              <b>{p.day}</b>
              {p.monthShort}
            </span>
          </>
        ) : (
          <span className="chapter chapter--date" aria-hidden="true">
            <span>
              <b>{p.day}</b>
              <em>{p.month}</em>
              <small>
                {p.weekday} · {p.time}
              </small>
            </span>
          </span>
        )}
      </div>
      <h3 className="event-name">{event.name}</h3>
      <p className="event-when">
        <time dateTime={event.startsAt}>{eventWhen(event.startsAt)}</time>
      </p>
      {meta.length > 0 && <p className="event-meta">{meta.join(' · ')}</p>}
      {event.description && <p className="event-desc">{event.description}</p>}
      {event.placeholder && <ExampleTag className="row-tag" />}
      <div className="event-cta">
        <BookButton
          label={UI.bookTable}
          ialocId={site.settings?.ialocId}
          tel={telHref(site.settings?.phoneReservations)}
          className="btn btn-ghost"
          date={event.bookWithDate !== false ? p.ymd : null}
        />
      </div>
    </article>
  )
}

/** Mesajul fără seri viitoare (S-03b): secțiunea nu dispare (D-08). */
export function NoEvents({ site, message }: { site: SiteData; message: string }) {
  const social = site.settings?.social
  const nets = [
    social?.facebook ? { name: 'Facebook', url: social.facebook } : null,
    social?.instagram ? { name: 'Instagram', url: social.instagram } : null,
  ].filter(Boolean) as { name: string; url: string }[]
  return (
    <div className="no-events">
      <p className="no-events-msg">{message}</p>
      {nets.length > 0 && (
        <p className="no-events-follow">
          {UI.announceOn}{' '}
          {nets.map((n, i) => (
            <React.Fragment key={n.name}>
              {i > 0 && ' și '}
              <a href={n.url} target="_blank" rel="noopener">
                {n.name}
                <span className="sr-only"> {UI.newTab}</span>
              </a>
            </React.Fragment>
          ))}
          .
        </p>
      )}
      <BookButton
        label={UI.bookForWeekend}
        ialocId={site.settings?.ialocId}
        tel={telHref(site.settings?.phoneReservations)}
        className="btn btn-primary"
      />
    </div>
  )
}

/** Acasă · Petreceri și agenda (content-model 4.6): următoarele 3 seri, pe copertă. */
export function Parties({ site, id }: { site: SiteData; id: string }) {
  const s = section(site.home, 'parties')
  const events = site.eventsUpcoming.slice(0, 3)
  const titleId = `${id}-titlu`
  const trackId = `${id}-seri`
  return (
    <section className="parties cover-section" id={id} aria-labelledby={titleId}>
      <div className="wrap cat-head">
        <div className="cat-head-text">
          <h2 id={titleId}>{s?.title}</h2>
          {s?.intro && <p className="section-intro">{s.intro}</p>}
          {s?.placeholder && <ExampleTag className="section-tag" />}
        </div>
        <Link className="text-link text-link--dark" href="/petreceri">
          {UI.seeAllEvents}
          <Icon name="arrow-up-right" />
        </Link>
      </div>
      {events.length > 0 ? (
        <>
          <ul className="event-track" id={trackId} aria-labelledby={titleId}>
            {events.map((e) => (
              <li key={e.id}>
                <EventCard event={e} site={site} sizes="(min-width: 1024px) 380px, 78vw" />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="wrap">
          <NoEvents site={site} message={s?.emptyMessage || ''} />
        </div>
      )}
    </section>
  )
}

/* ---------- Evenimente private ---------- */

/** Un salon: fotografia (sau numele pe copertă), amplasarea și capacitatea, descrierea. */
export function SalonCard({ salon, sizes, href }: { salon: Salon; sizes: string; href?: string }) {
  const photo = asMedia((salon.photos as (number | Media)[] | null | undefined)?.[0])
  const where = [salon.location, UI.upTo(salon.capacity)].filter(Boolean).join(' · ')
  const visual = (
    <span className="salon-visual">
      {photo ? <Picture media={photo} sizes={sizes} /> : <Chapter>{salon.name}</Chapter>}
    </span>
  )
  return (
    <article className="salon">
      {href ? (
        <Link href={href} className="salon-link" aria-label={`${salon.name}: ${UI.seePhotos}`}>
          {visual}
        </Link>
      ) : (
        visual
      )}
      <h3 className="salon-name">{salon.name}</h3>
      <p className="salon-where">{where.charAt(0).toUpperCase() + where.slice(1)}</p>
      <p className="salon-desc">{salon.description}</p>
      {salon.placeholder && <ExampleTag className="row-tag" />}
    </article>
  )
}

/** Acasă · Evenimente private (content-model 4.7). */
export function PrivateEvents({ site, id }: { site: SiteData; id: string }) {
  const s = section(site.home, 'privateEvents')
  const titleId = `${id}-titlu`
  const types = (s?.eventTypes ?? []).map((t) => t.label).filter(Boolean)
  const phone = site.settings?.phoneEvents
  const tel = telHref(phone)
  const href = requestHref(site.settings, 'privateEvent')
  return (
    <section className="private paper-section" id={id} aria-labelledby={titleId}>
      <div className="wrap private-grid">
        <div className="private-head">
          <h2 id={titleId}>{s?.title}</h2>
          {s?.intro && <p className="section-intro">{s.intro}</p>}
          {types.length > 0 && (
            <ul className="types" aria-label={s?.title ?? undefined}>
              {types.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {s?.placeholder && <ExampleTag className="section-tag" />}
          <div className="private-cta">
            <RequestButton href={href} label={s?.buttonLabel || UI.callManager} phone={phone} />
            {/* Telefonul managerului (D-17), doar dacă butonul duce la formular; altfel butonul e telefonul. */}
            {href && tel && phone && (
              <a className="text-link" href={tel}>
                {UI.callManager} · {phone}
              </a>
            )}
          </div>
          <Link className="text-link" href="/evenimente-private">
            {UI.seeSalons}
            <Icon name="arrow-up-right" />
          </Link>
        </div>
        {site.salons.length > 0 && (
          <div className="salons">
            {site.salons.map((salon) => (
              <SalonCard
                key={salon.id}
                salon={salon}
                sizes="(min-width: 1024px) 30vw, 100vw"
                href={`/evenimente-private#${slugify(salon.name)}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------- Cursuri de pizza pentru copii ---------- */

/** Detaliile cursului: apar doar cele completate (content-model 4.8, Q-11). */
export function CourseDetails({ pizza }: { pizza: ReturnType<typeof section<'pizza'>> }) {
  const rows = (['age', 'duration', 'price', 'seats'] as const)
    .map((k) => ({ k, label: UI.courseDetails[k], value: pizza?.[k] }))
    .filter((r) => r.value)
  if (!rows.length) return null
  return (
    <dl className="details">
      {rows.map((r) => (
        <div key={r.k} className="details-row">
          <dt>{r.label}</dt>
          <span className="details-dots" aria-hidden="true" />
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Acasă · Cursuri de pizza (content-model 4.8). */
export function Pizza({ site, id }: { site: SiteData; id: string }) {
  const s = section(site.home, 'pizza')
  const photo = asMedia(s?.photo)
  const titleId = `${id}-titlu`
  return (
    <section className="pizza paper-section paper-section--warm" id={id} aria-labelledby={titleId}>
      <div className="wrap pizza-grid">
        <div className="pizza-visual">
          {photo ? <Picture media={photo} sizes="(min-width: 1024px) 50vw, 100vw" /> : <Chapter>{s?.menuLabel || s?.title}</Chapter>}
        </div>
        <div className="pizza-text">
          <h2 id={titleId}>{s?.title}</h2>
          {s?.shortText && <p className="section-intro">{s.shortText}</p>}
          <CourseDetails pizza={s} />
          {s?.placeholder && <ExampleTag className="section-tag" />}
          <div className="private-cta">
            <RequestButton
              href={requestHref(site.settings, 'pizzaCourse')}
              label={s?.buttonLabel || ''}
              phone={site.settings?.phoneReservations}
            />
            <Link className="text-link" href="/cursuri-pizza-copii">
              {UI.aboutCourse}
              <Icon name="arrow-up-right" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export { RequestButton }
