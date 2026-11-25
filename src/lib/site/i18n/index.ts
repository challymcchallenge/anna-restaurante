import { DEFAULT_LOCALE, type LocaleCode } from '@/lib/locales'

import { de } from './de'
import { en } from './en'
import { fr } from './fr'
import { it } from './it'
import { ro, type Dict } from './ro'
import { sv } from './sv'
import { zh } from './zh'

export type { ClientDict, Dict } from './ro'

/** Dicționarele complete, pe limbă (doar pe server: componentele din browser folosesc `./client`). */
export const DICTS: Record<LocaleCode, Dict> = { ro, en, it, fr, de, zh, sv }

/** Textele fixe ale interfeței în limba paginii; o limbă necunoscută primește româna. */
export function ui(locale: string | null | undefined): Dict {
  return DICTS[(locale ?? DEFAULT_LOCALE) as LocaleCode] ?? ro
}
