'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { REQUEST_SUBJECTS } from '@/collections/AdminAreas'
import { validRequest, type FieldErrors, type FormValues } from '@/lib/site/contact'
import { getSite } from '@/lib/site/data'
import { todayIso } from '@/lib/site/format'
import type { Subject } from '@/lib/site/requests'

export type FormState = {
  status: 'idle' | 'error' | 'ok'
  /** Crește la fiecare trimitere, ca formularul să se refacă din valorile întoarse. */
  attempt: number
  errors?: FieldErrors
  values?: Record<string, string>
  subject?: Subject
  /** Ce a cerut vizitatorul, pentru confirmare (S-06c). */
  summary?: string[]
}

const SUBJECT_KEYS = REQUEST_SUBJECTS.map((s) => s.value) as Subject[]

/** Valorile formularului (cele cu același nume, de exemplu `adulti`, rămân liste). */
function read(form: FormData): FormValues {
  const out: FormValues = {}
  for (const key of new Set(form.keys())) {
    const all = form.getAll(key).filter((v): v is string => typeof v === 'string')
    out[key] = all.length > 1 ? all : (all[0] ?? '')
  }
  return out
}

/**
 * Trimiterea formularului de Contact sau de sesizări (F3 pasul 9, ADR-009): validare, apoi
 * salvare în „Cereri primite”. Cererea rămâne în panou chiar dacă emailul nu pleacă; emailurile
 * prin Resend vin în F5 (D-36), așa că `emailSent` rămâne `false` până atunci.
 */
export async function submitRequest(prev: FormState, form: FormData): Promise<FormState> {
  const attempt = (prev?.attempt ?? 0) + 1
  const values = read(form)
  const flat = Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v]),
  ) as Record<string, string>

  // Capcană anti-spam: un câmp ascuns pe care oamenii nu-l văd și un timp minim de completare.
  const started = Number(flat.t || 0)
  if (flat.website || !started || Date.now() - started < 2500) {
    return { status: 'ok', attempt, summary: [] }
  }

  const site = await getSite((await headers()).get('host'))
  if (!site) return { status: 'error', attempt, errors: { form: 'Formularul nu e disponibil acum.' }, values: flat }

  const payload = await getPayload({ config: await config })
  const requests = (site.settings?.requests ?? {}) as Record<string, { active?: boolean | null }>
  const reasons = await payload.find({
    collection: 'complaint-reasons',
    where: { and: [{ tenant: { equals: site.tenant.id } }, { active: { equals: true } }] },
    limit: 50,
    depth: 0,
  })

  const { errors, data } = validRequest(values, {
    today: todayIso(),
    activeSubjects: SUBJECT_KEYS.filter((k) => requests[k]?.active),
    salonIds: site.salons.map((s) => s.id),
    roomTypeIds: site.roomTypes.map((r) => r.id),
    reasonIds: reasons.docs.map((r) => r.id),
  })
  if (!data) return { status: 'error', attempt, errors, values: flat }

  // Camerele din bara de cazare intră în mesaj, ca hotelul să le vadă pe toate.
  const rooms = flat.camereDetaliu?.trim()
  const message = [rooms, data.message].filter(Boolean).join('\n\n') || undefined

  try {
    await payload.create({
      collection: 'submissions',
      overrideAccess: true,
      data: {
        tenant: site.tenant.id,
        subject: data.subject,
        status: 'new',
        name: data.name,
        phone: data.phone,
        email: data.email,
        message,
        details: data.details,
        consent: true,
        consentAt: new Date().toISOString(),
        emailSent: false,
      } as never,
    })
  } catch (error) {
    payload.logger.error(`[contact] cererea nu s-a salvat: ${(error as Error).message}`)
    return {
      status: 'error',
      attempt,
      errors: { form: 'Cererea nu s-a putut trimite. Încearcă din nou sau sună-ne.' },
      values: flat,
    }
  }

  const label = REQUEST_SUBJECTS.find((s) => s.value === data.subject)?.label ?? ''
  return { status: 'ok', attempt, subject: data.subject, summary: [label, ...summaryLines(data.details, site)] }
}

function summaryLines(details: Record<string, string | number | null>, site: NonNullable<Awaited<ReturnType<typeof getSite>>>) {
  const day = (iso: unknown) =>
    typeof iso === 'string'
      ? new Intl.DateTimeFormat('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso))
      : null
  const lines: string[] = []
  if (details.eventDate) lines.push(day(details.eventDate) as string)
  if (details.guests) lines.push(`${details.guests} ${Number(details.guests) === 1 ? 'invitat' : Number(details.guests) < 20 ? 'invitați' : 'de invitați'}`)
  if (details.salon) lines.push(site.salons.find((s) => s.id === details.salon)?.name ?? '')
  if (details.children) lines.push(`${details.children} ${Number(details.children) === 1 ? 'copil' : 'copii'}`)
  if (details.preferredDate) lines.push(day(details.preferredDate) as string)
  if (details.checkIn && details.checkOut) lines.push(`${day(details.checkIn)} – ${day(details.checkOut)}`)
  if (details.adults) lines.push(`${details.adults} ${Number(details.adults) === 1 ? 'adult' : 'adulți'}${details.kids ? `, ${details.kids} ${Number(details.kids) === 1 ? 'copil' : 'copii'}` : ''}`)
  if (details.visitDate) lines.push(day(details.visitDate) as string)
  return lines.filter(Boolean)
}
