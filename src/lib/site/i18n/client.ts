import { DEFAULT_LOCALE, type LocaleCode } from '@/lib/locales'

import { deClient } from './de'
import { enClient } from './en'
import { frClient } from './fr'
import { itClient } from './it'
import { roClient, type ClientDict } from './ro'
import { svClient } from './sv'
import { zhClient } from './zh'

/**
 * Textele componentelor care rulează în browser (formulare, calendar, galerie, căutarea de vinuri).
 * Se importă doar partea „client” a fiecărei limbi, ca dicționarele complete să rămână pe server.
 */
const CLIENT: Record<LocaleCode, ClientDict> = {
  ro: roClient,
  en: enClient,
  it: itClient,
  fr: frClient,
  de: deClient,
  zh: zhClient,
  sv: svClient,
}

export function clientUI(locale: string | null | undefined): ClientDict {
  return CLIENT[(locale ?? DEFAULT_LOCALE) as LocaleCode] ?? roClient
}
