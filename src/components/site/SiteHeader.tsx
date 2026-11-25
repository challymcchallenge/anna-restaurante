import Link from 'next/link'
import React from 'react'

import type { SiteData } from '@/lib/site/data'
import { activeLocales } from '@/lib/site/locale'
import { telHref } from '@/lib/site/format'
import { asMedia, pictureSources } from '@/lib/site/media'
import { navItems, section } from '@/lib/site/sections'
import { lp, UI } from '@/lib/site/i18n/server'
import { LOCALES } from '@/lib/locales'

import { BookButton } from './Bits'
import { Icon } from './Icons'
import { HeaderController } from './HeaderController'
import { LanguageMenu } from './LanguageMenu'

/** Lățimea afișată a logo-ului la deschidere (D-60): 96 px pe telefon, 144 px de la 1024 px. */
const BRAND_SIZES = '(min-width: 1024px) 144px, 96px'

/** Logo-ul principal, pe copertă (medalionul se vede bine pe fundal închis, GATE 2). */
function Brand({ site, className }: { site: SiteData; className: string }) {
  const logo = asMedia(site.settings?.logoDark) ?? asMedia(site.settings?.logo)
  const name = site.tenant.name
  if (!logo) {
    return (
      <Link className={`${className} brand--text`} href={lp('/')}>
        {name}
      </Link>
    )
  }
  const s = pictureSources(logo, 640)
  return (
    <Link className={className} href={lp('/')} aria-label={UI.homeLink(name)}>
      <picture>
        {s.avif && <source type="image/avif" srcSet={s.avif} sizes={BRAND_SIZES} />}
        {s.webp && <source type="image/webp" srcSet={s.webp} sizes={BRAND_SIZES} />}
        {/* Fără fetchPriority="high": banda rămâne pentru fotografia copertei (LCP, D-60). */}
        <img src={s.src} width={s.width || 144} height={s.height || 144} alt="" />
      </picture>
    </Link>
  )
}

/** Selectorul de limbă (F4, D-64): limbile pornite în Setări → Limbi active, în ordinea din `LOCALES`. */
export function Language({ site, className = 'lang' }: { site: SiteData; className?: string }) {
  const current = LOCALES.find((l) => l.code === site.locale) ?? LOCALES[0]
  const locales = activeLocales(site).map((code) => ({ code, label: LOCALES.find((l) => l.code === code)?.label ?? code }))
  return (
    <LanguageMenu
      current={current.code}
      locales={locales}
      label={UI.chooseLanguage}
      currentLabel={UI.languageCurrent(current.label)}
      className={className}
    />
  )
}

export function SiteHeader({ site }: { site: SiteData }) {
  const items = navItems(site.home, site.settings?.navigation, {
    sectionLabels: UI.sectionLabels,
    pageLabels: UI.pageLabels,
    wideGlyphs: site.locale === 'zh',
  }).map((i) => ({ ...i, href: lp(i.href) }))
  const hasMoreLg = items.some((i) => i.tier > 1)
  const hasMoreXl = items.some((i) => i.tier > 2)
  const phone = site.settings?.phoneReservations ?? null
  const tel = telHref(phone)
  const bookLabel = section(site.home, 'hero')?.bookLabel || 'Rezervă o masă'

  return (
    <>
      <header className="site-header" data-header="">
        <div className="wrap header-in">
          <div className="header-left">
            <button
              className="nav-toggle"
              type="button"
              data-nav-open=""
              aria-controls="nav-panel"
              aria-expanded="false"
              aria-label={UI.openNav}
            >
              <Icon name="menu" />
            </button>
            {items.length > 0 && (
              <nav className="nav-main" aria-label={UI.navLabel}>
                <ul>
                  {items.map((item) => (
                    <li key={item.id} className={`tier-${item.tier}`}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
                {hasMoreLg && (
                  <button
                    className={`nav-more${hasMoreXl ? '' : ' nav-more--lg-only'}`}
                    type="button"
                    data-nav-open=""
                    aria-controls="nav-panel"
                    aria-expanded="false"
                  >
                    {UI.moreNav}
                    <Icon name="chevron-down" />
                  </button>
                )}
              </nav>
            )}
          </div>
          <Brand site={site} className="brand" />
          <div className="header-right">
            {phone && tel && (
              <a className="header-phone" href={tel}>
                <Icon name="phone" />
                {phone}
              </a>
            )}
            <Language site={site} />
            <BookButton
              label={bookLabel}
              ialocId={site.settings?.ialocId}
              tel={tel}
              className="btn btn-primary header-cta"
            />
          </div>
        </div>
      </header>

      <dialog id="nav-panel" className="nav-panel" aria-label={UI.navLabel}>
        <div className="wrap nav-panel-in">
          <div className="nav-panel-head">
            {/* Primul element din panou: focusul cade pe „Închide” la deschidere. */}
            <form method="dialog">
              <button className="nav-close" type="submit" aria-label={UI.closeNav}>
                <Icon name="x" />
              </button>
            </form>
            <Brand site={site} className="brand brand--panel" />
          </div>
          <nav aria-label={UI.navLabel}>
            <ul className="nav-panel-list">
              {items.map((item) => (
                <li key={item.id}>
                  <a href={item.href} data-nav-close="">
                    <span className="nav-panel-label">{item.label}</span>
                    <Icon name="chevron-right" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav-panel-foot">
            {phone && tel && (
              <a className="nav-panel-phone" href={tel}>
                <Icon name="phone" />
                <span>
                  <span className="nav-panel-phone-label">{UI.reservationsPhone}</span>
                  {phone}
                </span>
              </a>
            )}
            <Language site={site} className="lang lang--panel" />
          </div>
        </div>
      </dialog>
      <HeaderController />
    </>
  )
}
