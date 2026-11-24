import { SUBJECT_SLUGS, type Subject } from './requests'

/**
 * Formularul unic de Contact și cel de sesizări (F3 pasul 9, S-06, S-06b, S-07, content-model 7).
 * Validarea e o funcție pură: aceleași reguli pe server și în teste. Mesajele sunt în cuvinte
 * obișnuite, lângă câmp (S-06b). Nu cerem date de sănătate (content-model 7).
 */

export const subjectFromSlug = (slug: string | null | undefined): Subject | null =>
  (Object.entries(SUBJECT_SLUGS).find(([, s]) => s === slug)?.[0] as Subject | undefined) ?? null

export const FORM_MESSAGES = {
  phone: 'Scrie un număr de telefon, ca să te putem suna.',
  email: 'Scrie adresa de email, de exemplu nume@exemplu.ro.',
  consent: 'Bifează acordul, ca să-ți putem răspunde.',
  subject: 'Alege despre ce ne scrii.',
  eventDate: 'Alege data evenimentului, de azi încolo.',
  guests: 'Scrie câți invitați vor fi.',
  children: 'Scrie câți copii vin la curs.',
  preferredDate: 'Alege o dată de azi încolo.',
  checkIn: 'Alege data sosirii, de azi încolo.',
  checkOut: 'Plecarea trebuie să fie după sosire.',
  adults: 'Scrie câți adulți vin (cel puțin unul).',
  kids: 'Scrie câți copii vin (0 dacă nu vin copii).',
  question: 'Scrie întrebarea ta.',
  visitDate: 'Alege data vizitei, cel târziu azi.',
  reason: 'Alege motivul sesizării.',
  description: 'Spune-ne pe scurt ce s-a întâmplat.',
  tooLong: (max: number) => `Cel mult ${max} de caractere.`,
} as const

export type FormValues = Record<string, string | string[]>
export type FieldErrors = Record<string, string>

export type RequestData = {
  subject: Subject
  name?: string
  phone: string
  email: string
  message?: string
  details: Record<string, string | number | null>
}

export type Lookups = {
  /** Data de azi, AAAA-LL-ZZ, în ora României. */
  today: string
  activeSubjects: Subject[]
  salonIds: number[]
  roomTypeIds: number[]
  reasonIds: number[]
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T12:00:00Z`))
/** Data la prânz UTC: rămâne aceeași zi în orice fus orar. */
export const dateAtNoon = (v: string) => `${v}T12:00:00.000Z`
const int = (v: string) => (/^\d{1,4}$/.test(v) ? Number(v) : null)

export function validRequest(values: FormValues, lookups: Lookups): { errors: FieldErrors; data: RequestData | null } {
  const errors: FieldErrors = {}
  const subject = subjectFromSlug(one(values.subiect))
  if (!subject || !lookups.activeSubjects.includes(subject)) errors.subiect = FORM_MESSAGES.subject

  const phone = one(values.telefon)
  const digits = phone.replace(/\D/g, '')
  if (!/^[+\d\s().-]{6,30}$/.test(phone) || digits.length < 9 || digits.length > 15) errors.telefon = FORM_MESSAGES.phone
  const email = one(values.email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) errors.email = FORM_MESSAGES.email
  if (one(values.acord) !== 'da') errors.acord = FORM_MESSAGES.consent
  const name = one(values.nume)
  if (name.length > 80) errors.nume = FORM_MESSAGES.tooLong(80)
  const message = one(values.mesaj)
  if (message.length > 2000) errors.mesaj = FORM_MESSAGES.tooLong(2000)

  const details: RequestData['details'] = {}
  const { today } = lookups

  if (subject === 'privateEvent') {
    const date = one(values.dataEveniment)
    if (!isDate(date) || date < today) errors.dataEveniment = FORM_MESSAGES.eventDate
    else details.eventDate = dateAtNoon(date)
    const guests = int(one(values.invitati))
    if (!guests || guests < 1 || guests > 2000) errors.invitati = FORM_MESSAGES.guests
    else details.guests = guests
    const type = one(values.tipEveniment)
    if (type.length > 60) errors.tipEveniment = FORM_MESSAGES.tooLong(60)
    else if (type) details.eventType = type
    const salon = int(one(values.salon))
    if (salon && lookups.salonIds.includes(salon)) details.salon = salon
  }

  if (subject === 'pizzaCourse') {
    const children = int(one(values.copiiCurs))
    if (!children || children < 1 || children > 50) errors.copiiCurs = FORM_MESSAGES.children
    else details.children = children
    const ages = one(values.varste)
    if (ages.length > 60) errors.varste = FORM_MESSAGES.tooLong(60)
    else if (ages) details.ages = ages
    const date = one(values.dataDorita)
    if (date && (!isDate(date) || date < today)) errors.dataDorita = FORM_MESSAGES.preferredDate
    else if (date) details.preferredDate = dateAtNoon(date)
  }

  if (subject === 'accommodation') {
    const checkIn = one(values.sosire)
    const checkOut = one(values.plecare)
    if (!isDate(checkIn) || checkIn < today) errors.sosire = FORM_MESSAGES.checkIn
    else details.checkIn = dateAtNoon(checkIn)
    if (!isDate(checkOut) || (isDate(checkIn) && checkOut <= checkIn)) errors.plecare = FORM_MESSAGES.checkOut
    else details.checkOut = dateAtNoon(checkOut)
    const adults = int(one(values.adultiTotal))
    if (!adults || adults < 1 || adults > 60) errors.adultiTotal = FORM_MESSAGES.adults
    else details.adults = adults
    const kids = int(one(values.copiiTotal) || '0')
    if (kids === null || kids > 40) errors.copiiTotal = FORM_MESSAGES.kids
    else details.kids = kids
    const room = int(one(values.tipCamera))
    if (room && lookups.roomTypeIds.includes(room)) details.roomType = room
  }

  if (subject === 'question' && !message) errors.mesaj = FORM_MESSAGES.question

  if (subject === 'complaint') {
    const visit = one(values.dataVizitei)
    if (!isDate(visit) || visit > today) errors.dataVizitei = FORM_MESSAGES.visitDate
    else details.visitDate = dateAtNoon(visit)
    const reason = int(one(values.motiv))
    if (!reason || !lookups.reasonIds.includes(reason)) errors.motiv = FORM_MESSAGES.reason
    else details.reason = reason
    if (!message) errors.mesaj = FORM_MESSAGES.description
    const waiter = one(values.ospatar)
    if (waiter.length > 60) errors.ospatar = FORM_MESSAGES.tooLong(60)
    else if (waiter) details.waiter = waiter
  }

  if (Object.keys(errors).length || !subject) return { errors, data: null }
  return {
    errors,
    data: { subject, name: name || undefined, phone, email, message: message || undefined, details },
  }
}

/**
 * Camerele din bara de cazare (D-45): `camere`, `adulti[]`, `copii[]` din adresă → totaluri și un
 * rând de text pentru mesajul cererii („Camera 1: 2 adulți · Camera 2: 1 adult, 1 copil”).
 */
export function roomsFromQuery(adults: string[], kids: string[]): { adults: number; kids: number; summary: string } {
  const rows = adults.map((a, i) => ({ a: Math.max(0, Number(a) || 0), k: Math.max(0, Number(kids[i]) || 0) }))
  const word = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
  return {
    adults: rows.reduce((s, r) => s + r.a, 0),
    kids: rows.reduce((s, r) => s + r.k, 0),
    summary:
      rows.length > 1
        ? rows
            .map((r, i) => `Camera ${i + 1}: ${word(r.a, 'adult', 'adulți')}${r.k ? `, ${word(r.k, 'copil', 'copii')}` : ''}`)
            .join(' · ')
        : '',
  }
}
