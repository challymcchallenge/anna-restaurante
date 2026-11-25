import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { ContactForm } from '@/components/site/ContactForm'
import { ContactDetails, ContactMap } from '@/components/site/ContactSection'
import { PageCover } from '@/components/site/Events'
import { Icon } from '@/components/site/Icons'
import { formContext, roomsFromQuery } from '@/lib/site/contact-context'
import { renderedAt, telHref, todayIso } from '@/lib/site/format'
import { sitePage, sitePageMeta } from '@/lib/site/page'
import { section } from '@/lib/site/sections'
import { lp, renderLocale, UI } from '@/lib/site/i18n/server'

/**
 * S-06 · Contact: formularul unic cu subiect (F-32), datele de contact și sesizările.
 * Butoanele din site și bara de cazare deschid pagina cu subiectul și datele deja completate
 * (`/contact?subiect=cazare&sosire=…`). Apar doar subiectele pornite în Setări → Cereri și emailuri.
 */
export const generateMetadata = (): Promise<Metadata> => sitePageMeta('contact', 'pageContact')

type Search = Record<string, string | string[] | undefined>
const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : [])
const first = (v: string | string[] | undefined) => list(v)[0] ?? ''

export default async function ContactPage({ searchParams }: { searchParams: Promise<Search> }) {
  const site = await sitePage('contact')
  const q = await searchParams
  const c = section(site.home, 'contact')
  const hotel = section(site.home, 'hotel')
  const { active, urgent, responseTimes } = formContext(site)
  const subjects = active.filter((x) => x.key !== 'complaint')
  const complaintOn = active.some((x) => x.key === 'complaint')

  // Precompletarea din bara de cazare și din butoanele de cerere.
  const rooms = roomsFromQuery(list(q.adulti), list(q.copii))
  const initial: Record<string, string> = {
    subiect: subjects.some((x) => x.slug === first(q.subiect)) ? first(q.subiect) : (subjects[0]?.slug ?? ''),
    sosire: first(q.sosire),
    plecare: first(q.plecare),
    ...(rooms.adults ? { adultiTotal: String(rooms.adults), copiiTotal: String(rooms.kids) } : {}),
    ...(rooms.summary ? { camereDetaliu: rooms.summary } : {}),
  }
  const tel = telHref(site.settings?.phoneReservations)

  return (
    <>
      <PageCover title={c?.menuLabel || 'Contact'} intro={c?.title} placeholder={Boolean(c?.placeholder)} />
      <section className="contact-page paper-section" aria-label={c?.menuLabel || 'Contact'}>
        <div className="wrap contact-grid">
          <div className="contact-main">
            {subjects.length > 0 ? (
              <ContactForm locale={renderLocale()}
                mode="contact"
                subjects={subjects}
                initial={initial}
                today={todayIso()}
                startedAt={renderedAt()}
                salons={site.salons.map((x) => ({ id: x.id, name: x.name, capacity: x.capacity }))}
                roomTypes={site.roomTypes.map((x) => ({ id: x.id, name: x.name }))}
                reasons={[]}
                hotelName={[hotel?.hotelName, hotel?.hotelAddress].filter(Boolean).join(', ') || null}
                urgent={urgent}
                responseTimes={responseTimes}
                book={{ label: section(site.home, 'hero')?.bookLabel || UI.form.bookTable, tel, ialoc: Boolean(site.settings?.ialocId) }}
              />
            ) : (
              <p className="cf-note">
                {UI.form.noSubjects} {tel && <a href={tel}>{site.settings?.phoneReservations}</a>}
              </p>
            )}
            {complaintOn && (
              <p className="contact-complaint">
                {UI.form.complaintLink}{' '}
                <Link className="text-link" href={lp('/formular-de-reclamatie')}>
                  {UI.form.complaintCta}
                  <Icon name="arrow-up-right" />
                </Link>
              </p>
            )}
          </div>
          <aside className="contact-aside" aria-labelledby="contact-faster">
            <h2 id="contact-faster" className="contact-aside-title">
              {UI.form.faster}
            </h2>
            <ContactDetails site={site} />
            <ContactMap site={site} />
          </aside>
        </div>
      </section>
    </>
  )
}
