import type { Metadata } from 'next'
import { getPayload } from 'payload'
import React from 'react'

import { getActiveSite, localeAlternates } from '@/lib/site/locale'

import { ContactForm } from '@/components/site/ContactForm'
import { ContactDetails, ContactMap } from '@/components/site/ContactSection'
import { PageCover } from '@/components/site/Events'
import config from '@/payload.config'
import { formContext } from '@/lib/site/contact-context'
import { renderedAt, telHref, todayIso } from '@/lib/site/format'
import { sitePage } from '@/lib/site/page'
import { renderLocale, UI } from '@/lib/site/i18n/server'

/**
 * S-07 · Sesizări, la adresa păstrată de pe site-ul vechi (D-19, D-32): data vizitei, motivul
 * (cele 9 din panou, D-39), ce s-a întâmplat, ospătarul (opțional). Merge la subiectul Sesizare;
 * dacă subiectul e oprit în Setări, pagina dă telefonul.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getActiveSite()
  return site
    ? {
        title: `${UI.form.complaintTitle} · ${site.tenant.name}`,
        description: UI.form.complaintIntro,
        alternates: localeAlternates(site, '/formular-de-reclamatie'),
      }
    : {}
}

export default async function ComplaintPage() {
  const site = await sitePage('contact')
  const { active, urgent, responseTimes } = formContext(site)
  const complaint = active.find((x) => x.key === 'complaint')
  const payload = await getPayload({ config: await config })
  const reasons = complaint
    ? (
        await payload.find({
          // F4: motivele în limba paginii (traduse din panou), cu româna unde lipsește traducerea.
          locale: site.locale,
          collection: 'complaint-reasons',
          where: { and: [{ tenant: { equals: site.tenant.id } }, { active: { equals: true } }] },
          sort: '_order',
          limit: 50,
          depth: 0,
        })
      ).docs
    : []
  const tel = telHref(site.settings?.phoneReservations)

  return (
    <>
      <PageCover title={UI.form.complaintTitle} intro={UI.form.complaintIntro} />
      <section className="contact-page paper-section" aria-label={UI.form.complaintTitle}>
        <div className="wrap contact-grid">
          <div className="contact-main">
            {complaint ? (
              <ContactForm locale={renderLocale()}
                mode="complaint"
                subjects={[complaint]}
                initial={{ subiect: complaint.slug }}
                today={todayIso()}
                startedAt={renderedAt()}
                salons={[]}
                roomTypes={[]}
                reasons={reasons.map((r) => ({ id: r.id, reason: r.reason, explanation: r.explanation }))}
                urgent={urgent}
                responseTimes={responseTimes}
              />
            ) : (
              <p className="cf-note">
                {UI.form.complaintOff} {tel && <a href={tel}>{site.settings?.phoneReservations}</a>}
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
