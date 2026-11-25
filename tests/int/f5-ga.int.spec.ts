// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { Settings } from '@/collections/Settings'
import {
  analyticsHostAllowed,
  analyticsTagId,
  CONSENT_MAX_AGE_MS,
  cookieDomains,
  GA_COOKIE_EXPIRES_S,
  readConsent,
  writeConsent,
} from '@/lib/site/consent'
import { DICTS } from '@/lib/site/i18n'
import { CLIENT_DICTS } from '@/lib/site/i18n/client'

/**
 * F5 (G14-3, D-79): Google Analytics (eticheta GT-NCLXCCBJ de pe davittoria.ro) doar cu acordul
 * vizitatorului, după modelul politicii grupului: nimic de la Google până la „Accept”, reclamele
 * refuzate, cookie-urile 13 luni, alegerea 12 luni, „Setări cookie-uri” în footer.
 */

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')

describe('F5 · acordul pentru statistici', () => {
  it('alegerea ține 12 luni; una stricată sau expirată nu contează (bannerul apare din nou)', () => {
    const now = Date.UTC(2026, 10, 25)
    expect(readConsent(writeConsent('granted', now), now)).toEqual({ choice: 'granted', at: now })
    expect(readConsent(writeConsent('denied', now - CONSENT_MAX_AGE_MS + 1000), now)?.choice).toBe('denied')
    expect(readConsent(writeConsent('granted', now - CONSENT_MAX_AGE_MS - 1000), now)).toBeNull()
    expect(readConsent('{"choice":"poate","at":1}', now)).toBeNull()
    expect(readConsent('nu e json', now)).toBeNull()
    expect(readConsent(null, now)).toBeNull()
  })

  it('ID-ul din panou: doar G-… sau GT-…; statisticile doar pe domeniul propriu', () => {
    expect(analyticsTagId(' gt-ncl xccbj')).toBeNull()
    expect(analyticsTagId('gt-NCLXCCBJ')).toBe('GT-NCLXCCBJ')
    expect(analyticsTagId('G-ABC123XYZ')).toBe('G-ABC123XYZ')
    expect(analyticsTagId('UA-12345-1')).toBeNull()
    expect(analyticsTagId('')).toBeNull()
    expect(analyticsHostAllowed('davittoria.ro')).toBe(true)
    expect(analyticsHostAllowed('www.davittoria.ro')).toBe(true)
    expect(analyticsHostAllowed('anna-restaurante-alinlabau-9308s-projects.vercel.app')).toBe(false)
    expect(analyticsHostAllowed('localhost:3000')).toBe(false)
    expect(analyticsHostAllowed(null)).toBe(false)
  })

  it('la „Refuz”, cookie-urile _ga se șterg de pe gazdă și de pe domeniile părinte', () => {
    expect(cookieDomains('www.davittoria.ro')).toEqual(['', 'www.davittoria.ro', '.www.davittoria.ro', 'davittoria.ro', '.davittoria.ro'])
    expect(GA_COOKIE_EXPIRES_S).toBe(395 * 24 * 3600) // 13 luni, ca în politica grupului
  })

  it('bannerul: Consent Mode cu reclamele refuzate, eticheta abia după „Accept”, „Setări cookie-uri” îl redeschide', () => {
    const c = read('src/components/site/CookieConsent.tsx')
    expect(c).toContain("ad_storage: 'denied'")
    expect(c).toContain("ad_user_data: 'denied'")
    expect(c).toContain("ad_personalization: 'denied'")
    expect(c).toContain("analytics_storage: 'granted'")
    expect(c).toContain('cookie_expires: GA_COOKIE_EXPIRES_S')
    expect(c).toContain('https://www.googletagmanager.com/gtag/js?id=')
    expect(c).toContain("if (granted && load) loadAnalytics(tagId)")
    expect(c).toContain("closest?.('[data-cookie-settings]')")
    // Cele două butoane au aceeași clasă (Refuz la fel de vizibil ca Accept).
    expect(c.match(/className="btn btn-ghost"/g)).toHaveLength(2)
    const layout = read('src/app/(frontend)/[lang]/layout.tsx')
    expect(layout).toContain('load={analyticsHostAllowed(host)}')
    expect(read('src/components/site/SiteFooter.tsx')).toContain('analyticsTagId(s?.analyticsId) && (')
  })

  it('textele bannerului și „Setări cookie-uri” există în toate cele 7 limbi', () => {
    for (const [locale, d] of Object.entries(CLIENT_DICTS)) {
      for (const k of ['title', 'text', 'policy', 'accept', 'reject'] as const) expect(d.cookies[k], `${locale}.${k}`).toBeTruthy()
    }
    for (const [locale, d] of Object.entries(DICTS)) expect(d.cookieSettings, locale).toBeTruthy()
    expect(Object.keys(CLIENT_DICTS)).toHaveLength(7)
  })

  it('seed: eticheta de pe site-ul vechi și păstrarea cererilor 12 luni (G14-1), o singură dată, doar dacă e gol', () => {
    const seed = JSON.parse(read('seed/trattoria-da-vittoria.json'))
    const swap = (field: string) => seed.swaps.find((s: { collection: string; field: string }) => s.collection === 'settings' && s.field === field)
    expect(swap('analyticsId')).toMatchObject({ from: null, to: 'GT-NCLXCCBJ' })
    expect(swap('requestsRetentionMonths')).toMatchObject({ from: null, to: 12 })
  })

  it('panoul refuză un ID care nu e G-… sau GT-…', () => {
    const tabs = (Settings.fields.find((f) => 'type' in f && f.type === 'tabs') as { tabs: { label: string; fields: any[] }[] }).tabs
    const integ = tabs.find((t) => t.label === 'Integrări')!
    const row = integ.fields.find((f) => f.type === 'row' && f.fields.some((x: any) => x.name === 'analyticsId'))
    const field = row.fields.find((x: any) => x.name === 'analyticsId')
    expect(field.validate('GT-NCLXCCBJ')).toBe(true)
    expect(field.validate('')).toBe(true)
    expect(field.validate('UA-123-1')).toContain('GT-NCLXCCBJ')
  })
})
