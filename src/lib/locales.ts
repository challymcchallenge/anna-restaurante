/**
 * Limbile site-ului (D-28, ADR-007). Româna este implicită și stă la rădăcina adresei;
 * celelalte au prefix (/en, /it …). Traducerile se fac în F4; până atunci, pe site se
 * afișează textul în română acolo unde traducerea lipsește (content-model 9). Rutele: F4 (D-64).
 */
export const LOCALES = [
  { code: 'ro', label: 'Română' },
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
  { code: 'sv', label: 'Svenska' },
] as const

export type LocaleCode = (typeof LOCALES)[number]['code']

export const DEFAULT_LOCALE: LocaleCode = 'ro'

export const LOCALE_CODES = LOCALES.map((l) => l.code) as LocaleCode[]

export function isLocale(value: unknown): value is LocaleCode {
  return typeof value === 'string' && (LOCALE_CODES as string[]).includes(value)
}

/**
 * Adresa unei pagini în limba dată (F4-1, D-64): româna fără prefix, celelalte cu `/en`, `/it` …
 * Adresele rămân în română. `/` → `/en`; `/#vinuri` → `/en#vinuri`; `/galerie` → `/en/galerie`.
 */
export function localePath(locale: string | null | undefined, path: string): string {
  if (!locale || locale === DEFAULT_LOCALE || !isLocale(locale)) return path
  if (!path.startsWith('/')) return path
  if (path === '/') return `/${locale}`
  if (path.startsWith('/#') || path.startsWith('/?')) return `/${locale}${path.slice(1)}`
  return `/${locale}${path}`
}

/**
 * Calea fără prefixul de limbă: `/en/galerie` → `/galerie`, `/en` → `/`. Scoate și `/ro`, adresa
 * internă a paginilor în română (rescrierea din `next.config.ts`).
 */
export function stripLocale(path: string): string {
  const m = path.match(/^\/([a-z]{2})(?=\/|$|[?#])(.*)$/)
  if (!m || !isLocale(m[1])) return path || '/'
  return m[2] ? (m[2].startsWith('/') ? m[2] : `/${m[2]}`) : '/'
}
