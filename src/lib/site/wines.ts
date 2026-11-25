import { WINE_TYPES } from '@/collections/Wines'

import type { WineRow } from './data'
import { UI } from './i18n/server'

/**
 * Lista de vinuri (D-46): gruparea pe tip, apoi pe țară și regiune (ordinea din panou), și
 * textele unui rând. Folosită de secțiunea de pe Acasă și de /catalog-vinuri.
 */

export type WineType = WineRow['type']

/** Numele tipului în limba paginii (F4); româna din panou ca rezervă. */
export const typeLabel = (t: string) => UI.wineTypes[t] ?? WINE_TYPES.find((w) => w.value === t)?.label ?? t

/** Tipurile prezente în listă, în ordinea fixă (spumant, alb, rosé, roșu, desert). */
export function typesIn(wines: WineRow[]): WineType[] {
  return WINE_TYPES.map((t) => t.value as WineType).filter((t) => wines.some((w) => w.type === t))
}

export function byTypeGroups(wines: WineRow[]): { type: WineType; wines: WineRow[] }[] {
  return typesIn(wines).map((type) => ({ type, wines: wines.filter((w) => w.type === type) }))
}

/** „Franța · Champagne”: țara și regiunea, în ordinea primei apariții din panou. */
export function byOrigin(wines: WineRow[]): { origin: string; wines: WineRow[] }[] {
  const groups = new Map<string, WineRow[]>()
  for (const w of wines) {
    const origin = [w.country, w.region].filter(Boolean).join(' · ')
    groups.set(origin, [...(groups.get(origin) ?? []), w])
  }
  return [...groups].map(([origin, list]) => ({ origin, wines: list }))
}

/** Numele afișat: producătorul, apoi vinul („Dom Pérignon Vintage Brut”). */
export const wineTitle = (w: WineRow) => [w.producer, w.name].filter(Boolean).join(' ')

/** Anul; fără an = „NV” (non-vintage). */
export const vintageLabel = (w: WineRow) => (w.vintage ? String(w.vintage) : UI.nonVintage)

/** Volumul în ml, ca pe etichetă: 375 ml, 750 ml, 1.500 ml. */
export function volumeMl(v: string | null | undefined): string {
  const ml = Math.round(Number(v || '0.75') * 1000)
  return `${new Intl.NumberFormat(UI.intl).format(ml)} ml`
}

/** Volumul în litri, doar când nu e sticla obișnuită de 0,75 l („1,5 l”). */
export const volumeIfOther = (v: string | null | undefined) =>
  v && v !== '0.75' ? `${v.replace('.', ',')} l` : null

/** Textul după care caută vizitatorul: fără diacritice, litere mici. */
export function searchText(w: WineRow): string {
  return [w.producer, w.name, w.appellation, w.region, w.country, w.grapes, w.vintage, typeLabel(w.type)]
    .filter(Boolean)
    .join(' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}
