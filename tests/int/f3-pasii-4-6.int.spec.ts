// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { eventParts, eventWhen, slugify } from '@/lib/site/format'
import { requestHref } from '@/lib/site/requests'
import { navItems, orderedSections } from '@/lib/site/sections'
import type { SiteData } from '@/lib/site/data'
import { plural, ro as UI } from '@/lib/site/i18n/ro'

/**
 * F3 pașii 4–6 și widgetul de cazare (D-45), fără browser:
 * - pluralul românesc din sumarul camerelor și al invitaților;
 * - data unei seri în ora României;
 * - butoanele de cerere duc la Contact doar pentru subiectele pornite în Setări;
 * - secțiunile noi apar pe Acasă și în meniu.
 */

const home = (sections: Record<string, unknown>) => sections as unknown as SiteData['home']

describe('F3 · pașii 4–6', () => {
  it('Plural românesc: 1 adult, 2 adulți, 20 de invitați', () => {
    expect(plural(1, 'adult', 'adulți')).toBe('1 adult')
    expect(plural(2, 'adult', 'adulți')).toBe('2 adulți')
    expect(plural(0, 'copil', 'copii')).toBe('0 copii')
    expect(plural(19, 'invitat', 'invitați')).toBe('19 invitați')
    expect(plural(25, 'invitat', 'invitați')).toBe('25 de invitați')
    expect(plural(101, 'invitat', 'invitați')).toBe('101 invitați')
    expect(UI.upTo(40)).toBe('până la 40 de invitați')
  })

  it('Data unei seri, în ora României (iarna UTC+2, vara UTC+3)', () => {
    // 12 decembrie 2026, 20:00 la București = 18:00 UTC
    expect(eventWhen('2026-12-12T18:00:00.000Z')).toBe('sâmbătă, 12 decembrie · 20:00')
    const p = eventParts('2027-07-03T18:30:00.000Z')
    expect([p.day, p.month, p.time, p.ymd]).toEqual(['3', 'iulie', '21:30', '2027-07-03'])
  })

  it('Ancorele saloanelor: fără diacritice și spații', () => {
    expect(slugify('Salon Trattoria')).toBe('salon-trattoria')
    expect(slugify('Sala Mică — Mansardă')).toBe('sala-mica-mansarda')
  })

  it('Cererile: Contact doar pentru subiectele pornite; altfel telefonul (null aici)', () => {
    const settings = { requests: { privateEvent: { active: true }, pizzaCourse: { active: false } } } as never
    expect(requestHref(settings, 'privateEvent')).toBe('/contact?subiect=eveniment-privat')
    expect(requestHref(settings, 'pizzaCourse')).toBeNull()
    expect(requestHref(null, 'accommodation')).toBeNull()
  })

  it('Secțiunile noi apar pe Acasă și în meniu, în ordinea din panou', () => {
    const h = home({
      hero: { order: 1 },
      parties: { order: 2, menuLabel: 'Petreceri' },
      privateEvents: { order: 3, menuLabel: 'Evenimente private' },
      pizza: { order: 4, menuLabel: 'Cursuri de pizza', enabled: false },
    })
    expect(orderedSections(h).map((s) => s.key)).toEqual(['hero', 'parties', 'privateEvents'])
    expect(navItems(h).map((i) => i.href)).toEqual(['/#petreceri', '/#evenimente-private'])
  })
})
