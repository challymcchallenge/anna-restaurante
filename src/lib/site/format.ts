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

/** Doar suma, fără monedă (lista de vinuri are moneda în legendă: „0,75 l · lei”). */
export function amount(value: number | null | undefined, locale = 'ro-RO'): string | null {
  return price(value, locale)?.replace(` ${UI.currency}`, '') ?? null
}

/** Momentul randării paginii (ms), pentru timpul minim de completare al formularelor (anti-spam). */
export function renderedAt(): number {
  return new Date().getTime()
}

/** Data de azi (AAAA-LL-ZZ) în ora României, pentru câmpurile de dată. */
export function todayIso(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(new Date())
}

const BUC = 'Europe/Bucharest'

/** Părțile datei unei seri, în ora României: „sâmbătă”, „12”, „decembrie”, „dec.”, „20:00”. */
export function eventParts(iso: string, locale = 'ro-RO') {
  const d = new Date(iso)
  const part = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...o, timeZone: BUC }).format(d)
  return {
    weekday: part({ weekday: 'long' }),
    day: part({ day: 'numeric' }),
    month: part({ month: 'long' }),
    monthShort: part({ month: 'short' }),
    time: part({ hour: '2-digit', minute: '2-digit', hour12: false }),
    ymd: new Intl.DateTimeFormat('en-CA', { timeZone: BUC }).format(d),
  }
}

/** „sâmbătă, 12 decembrie · 20:00” */
export function eventWhen(iso: string, locale = 'ro-RO'): string {
  const p = eventParts(iso, locale)
  return `${p.weekday}, ${p.day} ${p.month} · ${p.time}`
}

/** Identificator de ancoră din nume: „Salon Trattoria” → „salon-trattoria”. */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
