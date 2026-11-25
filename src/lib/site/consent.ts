/**
 * F5 (G14-3, D-79): acordul pentru cookies de statistici (Google Analytics). Funcții pure, folosite de
 * bannerul din browser (`CookieConsent.tsx`) și de teste. Modelul e cel din politica grupului (textul
 * aprobat de jurist pentru Riviera Events): nimic de la Google până la „Accept”; „Refuz” sau retragerea
 * acordului șterg cookie-urile `_ga`; alegerea se ține 12 luni în browser, apoi întrebăm din nou.
 */

/** Cheia din `localStorage` (e alegerea vizitatorului, nu un cookie). */
export const CONSENT_KEY = 'cookies-consent'

/** 12 luni, apoi bannerul apare din nou. */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 3600 * 1000

/** Cookie-urile Google Analytics țin 13 luni (în loc de 2 ani, implicit), ca în politica grupului. */
export const GA_COOKIE_EXPIRES_S = 395 * 24 * 3600

export type ConsentChoice = 'granted' | 'denied'
export type StoredConsent = { choice: ConsentChoice; at: number }

/** Alegerea salvată, dacă e validă și mai nouă de 12 luni; altfel nimic (bannerul apare). */
export function readConsent(raw: string | null | undefined, now: number = Date.now()): StoredConsent | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw) as Partial<StoredConsent>
    if ((v.choice !== 'granted' && v.choice !== 'denied') || typeof v.at !== 'number') return null
    if (v.at > now + 60_000 || now - v.at > CONSENT_MAX_AGE_MS) return null
    return { choice: v.choice, at: v.at }
  } catch {
    return null
  }
}

export function writeConsent(choice: ConsentChoice, now: number = Date.now()): string {
  return JSON.stringify({ choice, at: now } satisfies StoredConsent)
}

/** ID-ul etichetei Google din panou (G-…, GT-…), altfel nimic. */
export function analyticsTagId(value: string | null | undefined): string | null {
  const v = (value ?? '').trim().toUpperCase()
  return /^(G|GT)-[A-Z0-9]{4,20}$/.test(v) ? v : null
}

/**
 * Statisticile se încarcă doar pe domeniul restaurantului: nu pe adresa temporară `*.vercel.app` și nu
 * local. Altfel vizitele de probă s-ar amesteca în aceeași proprietate Google Analytics cu ale site-ului
 * de acum (davittoria.ro). Bannerul apare oricum, ca să poată fi văzut și probat înainte de lansare.
 */
export function analyticsHostAllowed(host: string | null | undefined): boolean {
  if (!host) return false
  const hostname = host.split(':')[0].toLowerCase()
  if (hostname === 'localhost' || hostname === '127.0.0.1') return false
  if (hostname.endsWith('.vercel.app')) return false
  return true
}

/** Domeniile pe care pot sta cookie-urile `_ga`, ca să le ștergem la „Refuz”: gazda și părinții ei. */
export function cookieDomains(hostname: string): string[] {
  const parts = hostname.split('.')
  const out = ['']
  for (let i = 0; i < parts.length - 1; i++) out.push(parts.slice(i).join('.'), `.${parts.slice(i).join('.')}`)
  return [...new Set(out)]
}
