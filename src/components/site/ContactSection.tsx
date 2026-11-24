import Link from 'next/link'
import React from 'react'

import { formContext } from '@/lib/site/contact-context'
import type { SiteData } from '@/lib/site/data'
import { hoursSummary, telHref } from '@/lib/site/format'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'

import { BookButton, ExampleTag, ExternalLink } from './Bits'
import { FaqList } from './Events'
import { Icon } from './Icons'
import { MapSketch } from './MapSketch'

/** Linkul spre hartă: după coordonate, dacă sunt în Setări, altfel după adresă (fără cheie de API). */
export function mapHref(site: SiteData): string | null {
  const a = site.settings?.address
  if (a?.lat != null && a?.lng != null) return `https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}`
  const text = [a?.street, a?.city, a?.country].filter(Boolean).join(', ')
  return text ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}` : null
}

/** Ce caută harta: coordonatele din Setări, dacă există, altfel adresa. */
export function mapQuery(site: SiteData): string | null {
  const a = site.settings?.address
  if (a?.lat != null && a?.lng != null) return `${a.lat},${a.lng}`
  const text = [a?.street, a?.city, a?.country].filter(Boolean).join(', ')
  return text || null
}

/** Schița hărții, cu harta reală la clic (G6-2, D-51). */
export function ContactMap({ site }: { site: SiteData }) {
  const query = mapQuery(site)
  if (!query) return null
  return <MapSketch query={query} name={site.tenant.name} street={site.settings?.address?.street} />
}

/** Datele de contact din Setări (R2): telefoanele, adresa cu harta, programul. */
export function ContactDetails({ site }: { site: SiteData }) {
  const s = site.settings
  const address = [s?.address?.street, s?.address?.city].filter(Boolean).join(', ')
  const telR = telHref(s?.phoneReservations)
  const telE = telHref(s?.phoneEvents)
  const telP = telHref(s?.phonePizza)
  const map = mapHref(site)
  return (
    <ul className="contact-list">
      {s?.phoneReservations && telR && (
        <li>
          <Icon name="phone" />
          <span>
            <span className="contact-note">{UI.reservationsPhone}</span>
            <a href={telR}>{s.phoneReservations}</a>
          </span>
        </li>
      )}
      {s?.phoneEvents && telE && (
        <li>
          <Icon name="phone" />
          <span>
            <span className="contact-note">{UI.eventsPhone}</span>
            <a href={telE}>{s.phoneEvents}</a>
          </span>
        </li>
      )}
      {s?.phonePizza && telP && (
        <li>
          <Icon name="phone" />
          <span>
            <span className="contact-note">{UI.pizzaPhone}</span>
            <a href={telP}>{s.phonePizza}</a>
          </span>
        </li>
      )}
      {address && (
        <li>
          <Icon name="map-pin" />
          <span>
            {address}
            {map && (
              <>
                <br />
                <ExternalLink href={map} className="text-link">
                  {UI.form.seeMap}
                  <Icon name="arrow-up-right" />
                </ExternalLink>
              </>
            )}
          </span>
        </li>
      )}
      {hoursSummary(s?.hours).map((h) => (
        <li key={h}>
          <Icon name="clock" />
          <span>{h}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Acasă · Contact și întrebări frecvente (content-model 4.11): titlul, textul, subiectele pornite
 * (fiecare deschide Contact cu subiectul ales), „Rezerv o masă” (ialoc), datele de contact și
 * cel mult 5 întrebări din grupul Acasă.
 */
export function ContactSection({ site, id }: { site: SiteData; id: string }) {
  const c = section(site.home, 'contact')
  const titleId = `${id}-titlu`
  const { active } = formContext(site)
  const subjects = active.filter((x) => x.key !== 'complaint')
  const complaintOn = active.some((x) => x.key === 'complaint')
  const hero = section(site.home, 'hero')
  const faqs = site.faqs.filter((f) => f.group === 'home').slice(0, 5)
  return (
    <>
      <section className="contact-home paper-section paper-section--warm" id={id} aria-labelledby={titleId}>
        <div className="wrap contact-home-grid">
          <div className="contact-home-text">
            <h2 id={titleId}>{c?.title}</h2>
            {c?.intro && <p className="section-intro">{c.intro}</p>}
            {c?.placeholder && <ExampleTag className="section-tag" />}
            <ul className="contact-subjects">
              <li>
                <BookButton
                  className="btn btn-secondary"
                  label={hero?.bookLabel || UI.form.bookTable}
                  ialocId={site.settings?.ialocId}
                  tel={telHref(site.settings?.phoneReservations)}
                />
              </li>
              {subjects.map((x) => (
                <li key={x.key}>
                  <Link className="btn btn-ghost-paper" href={`/contact?subiect=${x.slug}`}>
                    {x.key === 'question' ? UI.form.question : x.label}
                  </Link>
                </li>
              ))}
            </ul>
            {complaintOn && (
              <p className="contact-complaint">
                {UI.form.complaintLink}{' '}
                <Link className="text-link" href="/formular-de-reclamatie">
                  {UI.form.complaintCta}
                  <Icon name="arrow-up-right" />
                </Link>
              </p>
            )}
          </div>
          <div className="contact-home-side">
            <ContactDetails site={site} />
            <ContactMap site={site} />
          </div>
        </div>
      </section>
      <FaqList faqs={faqs} group="home" />
    </>
  )
}
