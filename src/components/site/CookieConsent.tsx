'use client'

import React, { useEffect, useRef, useSyncExternalStore } from 'react'

import { clientUI } from '@/lib/site/i18n/client'
import {
  CONSENT_KEY,
  cookieDomains,
  GA_COOKIE_EXPIRES_S,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from '@/lib/site/consent'

/**
 * F5 (G14-3, D-79): bannerul de cookies pentru statistici. Apare doar dacă în Setări → Integrări e
 * completat „ID statistici” (eticheta Google a restaurantului, de exemplu GT-NCLXCCBJ de pe davittoria.ro).
 *
 * - Până la „Accept”, nu se încarcă nimic de la Google (fără cereri, fără cookies).
 * - „Accept”: eticheta Google (gtag.js), cu Consent Mode: statistici permise, reclamele refuzate
 *   (ad_storage, ad_user_data, ad_personalization), cookie-urile țin 13 luni.
 * - „Refuz” sau retragerea acordului: cookie-urile `_ga` se șterg; dacă statisticile erau pornite,
 *   pagina se reîncarcă, ca eticheta să nu mai ruleze.
 * - Alegerea stă 12 luni în browser (`localStorage`), apoi întrebăm din nou. „Setări cookie-uri” din
 *   footer (`[data-cookie-settings]`) redeschide bannerul.
 * - `load` e fals pe adresa temporară și local: bannerul apare, dar statisticile nu se încarcă.
 */

type GtagWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  __gaLoaded?: boolean
}

function loadAnalytics(tagId: string) {
  const w = window as GtagWindow
  if (w.__gaLoaded) return
  w.__gaLoaded = true
  w.dataLayer = w.dataLayer || []
  // gtag primește obiectul `arguments`, ca în fragmentul oficial Google.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments)
  }
  w.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  })
  w.gtag('js', new Date())
  w.gtag('config', tagId, {
    cookie_expires: GA_COOKIE_EXPIRES_S,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`
  document.head.appendChild(s)
}

/** Șterge cookie-urile Google Analytics de pe acest site. Întoarce `true` dacă statisticile rulau. */
function clearAnalytics(): boolean {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid')
  for (const name of names) {
    for (const domain of cookieDomains(location.hostname)) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
    }
  }
  return Boolean((window as GtagWindow).__gaLoaded) || names.length > 0
}

/**
 * Alegerea vizitatorului, citită din `localStorage` ca „magazin extern” (`useSyncExternalStore`): pe
 * server și la hidratare nu se afișează nimic, apoi bannerul apare doar dacă nu există o alegere validă.
 * `forced` = redeschis din footer. `memory` ține alegerea când browserul refuză `localStorage`.
 */
const SERVER = 'server'
let forced = false
let memory: string | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function readRaw(): string {
  try {
    return window.localStorage.getItem(CONSENT_KEY) ?? memory ?? ''
  } catch {
    return memory ?? ''
  }
}

const getSnapshot = () => `${forced ? 1 : 0}|${readRaw()}`
const getServerSnapshot = () => SERVER

function save(choice: ConsentChoice) {
  memory = writeConsent(choice)
  try {
    window.localStorage.setItem(CONSENT_KEY, memory)
  } catch {
    // fără localStorage: alegerea ține cât stă pagina deschisă
  }
  forced = false
  notify()
}

export function CookieConsent({
  tagId,
  load,
  locale,
  policyHref,
}: {
  tagId: string
  load: boolean
  locale: string
  policyHref: string | null
}) {
  const t = clientUI(locale).cookies
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const stored = snapshot === SERVER ? null : readConsent(snapshot.slice(2))
  const open = snapshot !== SERVER && (snapshot.startsWith('1|') || !stored)
  const granted = stored?.choice === 'granted'
  const reopened = useRef(false)
  const firstButton = useRef<HTMLButtonElement>(null)

  // Acordul dat (acum sau la o vizită anterioară, în ultimele 12 luni): statisticile pornesc.
  useEffect(() => {
    if (granted && load) loadAnalytics(tagId)
  }, [granted, load, tagId])

  // „Setări cookie-uri” din footer redeschide bannerul.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = event.target as Element | null
      if (!el?.closest?.('[data-cookie-settings]')) return
      event.preventDefault()
      reopened.current = true
      forced = true
      notify()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Redeschis din footer: focusul trece în banner (la prima vizită nu-l mutăm).
  useEffect(() => {
    if (open && reopened.current) {
      reopened.current = false
      firstButton.current?.focus()
    }
  }, [open])

  const choose = (choice: ConsentChoice) => {
    save(choice)
    if (choice === 'denied' && clearAnalytics()) window.location.reload()
  }

  if (!open) return null
  return (
    <section className="cookie-banner" aria-labelledby="cookie-banner-title" data-cookie-banner="">
      <p id="cookie-banner-title" className="cookie-banner-title">
        {t.title}
      </p>
      <p className="cookie-banner-text">
        {t.text}{' '}
        {policyHref && <a href={policyHref}>{t.policy}</a>}
      </p>
      <div className="cookie-banner-actions">
        <button ref={firstButton} type="button" className="btn btn-ghost" onClick={() => choose('denied')}>
          {t.reject}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => choose('granted')}>
          {t.accept}
        </button>
      </div>
    </section>
  )
}
