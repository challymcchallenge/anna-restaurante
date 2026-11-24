/**
 * Limbile site-ului (D-28, ADR-007). Româna este implicită și stă la rădăcina adresei;
 * celelalte au prefix (/en, /it …). Traducerile se fac în F4; până atunci, pe site se
 * afișează textul în română acolo unde traducerea lipsește (content-model 9).
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
