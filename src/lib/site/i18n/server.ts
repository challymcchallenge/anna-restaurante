import { cache } from 'react'

import { DEFAULT_LOCALE, isLocale, localePath, type LocaleCode } from '@/lib/locales'

import { ui, type Dict } from './index'

/**
 * Limba randării curente (F4), una pe cerere (`React.cache` e golit la fiecare cerere). O setează
 * `getPageSite()` (layout, pagini, metadate) înainte de orice componentă; în afara unei randări
 * (Server Actions, scripturi) rămâne româna.
 */
const store = cache((): { locale: LocaleCode } => ({ locale: DEFAULT_LOCALE }))

export function setRenderLocale(locale: string): void {
  store().locale = isLocale(locale) ? locale : DEFAULT_LOCALE
}

export function renderLocale(): LocaleCode {
  return store().locale
}

/**
 * Textele fixe în limba randării curente. Componentele de pe server scriu `UI.close`, ca înainte;
 * `UI` citește la fiecare acces din dicționarul limbii paginii.
 */
export const UI: Dict = new Proxy({} as Dict, {
  get: (_target, key) => (ui(store().locale) as Record<string | symbol, unknown>)[key],
  has: (_target, key) => key in ui(store().locale),
  ownKeys: () => Reflect.ownKeys(ui(store().locale)),
  getOwnPropertyDescriptor: (_target, key) => ({
    configurable: true,
    enumerable: true,
    value: (ui(store().locale) as Record<string | symbol, unknown>)[key],
  }),
})

/** Adresa internă în limba randării curente: `lp('/galerie')` → `/en/galerie` pe pagina în engleză. */
export function lp(path: string): string {
  return localePath(store().locale, path)
}
