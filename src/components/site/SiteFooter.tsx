import React from 'react'

import type { SiteData } from '@/lib/site/data'
import { hoursSummary, telHref } from '@/lib/site/format'
import { asMedia } from '@/lib/site/media'
import { pageMediaCredits } from '@/lib/site/credits'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'

import { AwardBadge, awardsFor, BookButton, ExampleTag, ExternalLink } from './Bits'
import { Icon, type IconName } from './Icons'
import { Language } from './SiteHeader'
import { GroupLogo } from './WineList'

const SOCIAL: { key: 'facebook' | 'instagram' | 'youtube' | 'tiktok'; label: string }[] = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
]

/**
 * Footerul (content-model 4.12, wireframe S-01 secțiunea 12): contact și rețele, Grupul,
 * premiile, paginile legale, limba, drepturile, creditele foto și creditul realizatorului.
 */
export function SiteFooter({ site }: { site: SiteData }) {
  const s = site.settings
  const footer = site.home?.footer
  const address = [s?.address?.street, s?.address?.city].filter(Boolean).join(', ')
  const hours = hoursSummary(s?.hours)
  const telR = telHref(s?.phoneReservations)
  const telE = telHref(s?.phoneEvents)
  const telP = telHref(s?.phonePizza)
  // Footerul e pe copertă: varianta pentru fundal închis, cu rezervă pe cea obișnuită.
  const groupLogo = asMedia(s?.logoGroupDark) ?? asMedia(s?.logoGroup)
  const groupName = groupLogo?.alt || UI.groupTitle
  const awards = awardsFor(site.awards, 'footer')
  const credits = pageMediaCredits(site)
  const socials = SOCIAL.filter((n) => s?.social?.[n.key])
  const others = (s?.otherNetworks ?? []).filter((n) => n.url)

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <section className="footer-col footer-contact" aria-labelledby="f-contact">
            <h2 id="f-contact" className="footer-title">
              {UI.contactTitle}
            </h2>
            {address && (
              <p className="footer-line">
                <Icon name="map-pin" />
                {address}
              </p>
            )}
            {hours.map((h) => (
              <p className="footer-line" key={h}>
                <Icon name="clock" />
                {h}
              </p>
            ))}
            {s?.phoneReservations && telR && (
              <p className="footer-line">
                <Icon name="phone" />
                <span>
                  <span className="footer-note">{UI.reservationsPhone}</span>
                  <a href={telR}>{s.phoneReservations}</a>
                </span>
              </p>
            )}
            {s?.phoneEvents && telE && (
              <p className="footer-line">
                <Icon name="phone" />
                <span>
                  <span className="footer-note">{UI.eventsPhone}</span>
                  <a href={telE}>{s.phoneEvents}</a>
                </span>
              </p>
            )}
            {s?.phonePizza && telP && (
              <p className="footer-line">
                <Icon name="phone" />
                <span>
                  <span className="footer-note">{UI.pizzaPhone}</span>
                  <a href={telP}>{s.phonePizza}</a>
                </span>
              </p>
            )}
            {(socials.length > 0 || others.length > 0) && (
              <ul className="footer-social" aria-label={UI.socialTitle}>
                {socials.map((n) => (
                  <li key={n.key}>
                    <a href={s?.social?.[n.key] as string} target="_blank" rel="noopener" aria-label={`${n.label} ${UI.newTab}`}>
                      <Icon name={n.key as IconName} />
                    </a>
                  </li>
                ))}
                {others.map((n) => (
                  <li key={n.url}>
                    <ExternalLink href={n.url} className="footer-social-text">
                      {n.name}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {site.groupLinks.length > 0 && (
            <section className="footer-col footer-group" aria-labelledby="f-group">
              <h2 id="f-group" className="footer-title footer-title--logo">
                {groupLogo ? <GroupLogo site={site} onDark className="footer-logo" /> : groupName}
              </h2>
              <ul className="footer-links footer-links--cols">
                {site.groupLinks.map((l) => (
                  <li key={l.id}>
                    {l.url ? (
                      <ExternalLink href={l.url}>{l.name}</ExternalLink>
                    ) : (
                      <span>{l.name}</span>
                    )}
                    {l.placeholder && <ExampleTag />}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="footer-col footer-side">
            {awards.length > 0 && (
              <section aria-labelledby="f-awards">
                <h2 id="f-awards" className="footer-title">
                  {UI.awardsTitle}
                </h2>
                <div className="footer-awards">
                  {awards.map((a) => (
                    <AwardBadge key={a.id} award={a} size="footer" />
                  ))}
                </div>
              </section>
            )}
            <section aria-labelledby="f-legal">
              <h2 id="f-legal" className="footer-title">
                {UI.legalTitle}
              </h2>
              <ul className="footer-links">
                {site.legalPages.map((p) => (
                  <li key={p.id}>
                    <a href={`/${p.slug}`}>{p.title}</a>
                  </li>
                ))}
                <li>
                  <a href="/formular-de-reclamatie">{UI.complaints}</a>
                </li>
              </ul>
              <p className="footer-lang">
                {UI.languageLabel}: <Language site={site} className="lang lang--footer" />
              </p>
            </section>
          </div>
        </div>

        <div className="footer-base">
          {footer?.copyright && <p className="footer-copy">{footer.copyright}</p>}
          {credits.length > 0 && (
            <p className="footer-credits">
              {UI.photoCredits}: {credits.join(' · ')}
            </p>
          )}
          {/* Creditul realizatorului (ADR-013): fix, 2 rânduri, discret; nu se editează din panou. */}
          <p className="footer-maker">
            Made with ❤️ by BizTech Consulting SRL
            <br />
            <a href="https://www.biztech.ro" target="_blank" rel="noopener">
              www.biztech.ro
            </a>{' '}
            / <a href="tel:+40772295031">+40772295031</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

/** Bara fixă de jos, doar pe telefon (wireframe S-01): Rezervă o masă · Meniu · Sună. */
export function PhoneBar({ site }: { site: SiteData }) {
  const s = site.settings
  const hero = section(site.home, 'hero')
  const tel = telHref(s?.phoneReservations)
  return (
    <nav className="phone-bar" aria-label={UI.quickActions}>
      <BookButton label={hero?.bookLabel || 'Rezervă o masă'} ialocId={s?.ialocId} tel={tel} />
      {s?.digitalMenuUrl && (
        <ExternalLink href={s.digitalMenuUrl} className="btn btn-ghost">
          <Icon name="book" />
          {hero?.menuButtonLabel || 'Meniu'}
        </ExternalLink>
      )}
      {tel && (
        <a className="btn btn-ghost" href={tel}>
          <Icon name="phone" />
          {UI.call}
        </a>
      )}
    </nav>
  )
}
