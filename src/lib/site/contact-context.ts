import { REQUEST_SUBJECTS } from '@/collections/AdminAreas'
import type { ContactFormProps } from '@/components/site/ContactForm'

import type { SiteData } from './data'
import { telHref } from './format'
import { SUBJECT_SLUGS, type Subject } from './requests'

export { roomsFromQuery } from './contact'

/** Datele comune ale formularului (Contact și sesizări). Destinatarii și copia nu ajung în browser. */
export function formContext(site: SiteData) {
  const s = site.settings
  const requests = (s?.requests ?? {}) as Record<string, { active?: boolean | null; responseTime?: string | null }>
  const active = REQUEST_SUBJECTS.filter((x) => requests[x.value]?.active).map((x) => ({
    key: x.value as Subject,
    slug: SUBJECT_SLUGS[x.value as Subject],
    label: x.label,
  }))
  const phone = (p: string | null | undefined) => (p && telHref(p) ? { phone: p, tel: telHref(p) as string } : undefined)
  const urgent: ContactFormProps['urgent'] = {
    privateEvent: phone(s?.phoneEvents ?? s?.phoneReservations),
    pizzaCourse: phone(s?.phoneReservations),
    // D-51: la cazare, recepția Hotel ANNA (din Pagina Acasă → Hotel), altfel rezervările restaurantului.
    accommodation: (() => {
      const hotel = site.home?.hotel
      const p = phone(hotel?.hotelPhone) ?? phone(s?.phoneReservations)
      return p ? { ...p, email: hotel?.hotelEmail || undefined } : undefined
    })(),
    question: phone(s?.phoneReservations),
    complaint: phone(s?.phoneReservations),
  }
  const responseTimes = Object.fromEntries(
    REQUEST_SUBJECTS.map((x) => [x.value, requests[x.value]?.responseTime ?? undefined]).filter(([, t]) => t),
  ) as ContactFormProps['responseTimes']
  return { active, urgent, responseTimes }
}

