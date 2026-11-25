import { DEFAULT_LOCALE, type LocaleCode } from '@/lib/locales'

import { deClient } from './de.client'
import { enClient } from './en.client'
import { frClient } from './fr.client'
import { itClient } from './it.client'
import { roClient, type ClientDict } from './ro.client'
import { svClient } from './sv.client'
import { zhClient } from './zh.client'

/**
 * Textele componentelor care rulează în browser (formulare, calendar, galerie, căutarea de vinuri).
 * Se importă doar partea „client” a fiecărei limbi, ca dicționarele complete să rămână pe server.
 */
export const CLIENT_DICTS: Record<LocaleCode, ClientDict> = {
  ro: roClient,
  en: enClient,
  it: itClient,
  fr: frClient,
  de: deClient,
  zh: zhClient,
  sv: svClient,
}

export function clientUI(locale: string | null | undefined): ClientDict {
  return CLIENT_DICTS[(locale ?? DEFAULT_LOCALE) as LocaleCode] ?? roClient
}
