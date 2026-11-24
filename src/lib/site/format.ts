import type { Setting } from '@/payload-types'

import { DAY_LABELS, UI } from './strings'

/** `tel:` din numărul afișat: păstrează doar + și cifrele. */
export function telHref(phone: string | null | undefined): string | null {
  if (!phone) return null
  const digits = phone.replace(/[^\d+]/g, '')
  return digits.length >= 9 ? `tel:${digits}` : null
}

const time = (t: string | null | undefined) => (t ? t.replace(/^0(\d)/, '$1') : '')

/**
 * Programul pe scurt: „Zilnic 8:00–24:00” când toate cele 7 zile sunt la fel, altfel câte un rând
 * pe zile consecutive cu același program.
 */
export function hoursSummary(hours: Setting['hours']): string[] {
  if (!hours?.length) return []
  const label = (h: NonNullable<Setting['hours']>[number]) =>
    h.closed ? UI.closed : `${time(h.opens)}–${time(h.closes)}`
  const labels = hours.map(label)
  if (hours.length === 7 && labels.every((l) => l === labels[0])) return [`${UI.daily} ${labels[0]}`]
  const out: string[] = []
  let start = 0
  for (let i = 1; i <= hours.length; i++) {
    if (i === hours.length || labels[i] !== labels[start]) {
      const from = DAY_LABELS[hours[start].day] ?? hours[start].day
      const to = DAY_LABELS[hours[i - 1].day] ?? hours[i - 1].day
      out.push(`${start === i - 1 ? from : `${from}–${to}`}: ${labels[start]}`)
      start = i
    }
  }
  return out
}

/** „octombrie 2026”, în ora României. */
export function monthYear(iso: string | null | undefined, locale = 'ro-RO'): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Bucharest',
  }).format(new Date(iso))
}

/** Preț în lei, fără zecimale inutile: „135 lei”, „37,50 lei”. */
export function price(value: number | null | undefined, locale = 'ro-RO'): string | null {
  if (value == null) return null
  const n = new Intl.NumberFormat(locale, {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
  return `${n} ${UI.currency}`
}

/** Data de azi (AAAA-LL-ZZ) în ora României, pentru câmpurile de dată. */
export function todayIso(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(new Date())
}
