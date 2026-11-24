import type { Setting } from '@/payload-types'

/**
 * Legăturile „cerere” (D-15, ADR-009): un buton de cerere deschide Contact cu subiectul deja ales
 * (design/flows/screens.md). Formularul de Contact se construiește la pasul 9.
 *
 * Un subiect se trimite doar dacă e pornit în Setări → Cereri și emailuri (și are destinatari).
 * Altfel butonul devine telefonul potrivit (D-17): saloanele la manager, restul la rezervări.
 */
export const SUBJECT_SLUGS = {
  privateEvent: 'eveniment-privat',
  pizzaCourse: 'curs-pizza',
  accommodation: 'cazare',
  question: 'intrebare',
  complaint: 'sesizare',
} as const

export type Subject = keyof typeof SUBJECT_SLUGS

export function requestHref(settings: Setting | null | undefined, subject: Subject): string | null {
  const active = Boolean((settings?.requests as Record<string, { active?: boolean | null }> | undefined)?.[subject]?.active)
  return active ? `/contact?subiect=${SUBJECT_SLUGS[subject]}` : null
}
