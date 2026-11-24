// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { FORM_MESSAGES, roomsFromQuery, subjectFromSlug, validRequest, type Lookups } from '@/lib/site/contact'

/**
 * F3 pasul 9 · Contact și sesizări (S-06, S-06b, S-07, content-model 7), fără browser:
 * - subiectul vine din adresă (`?subiect=cazare`) și trebuie să fie pornit în Setări;
 * - telefonul, emailul și acordul sunt obligatorii; câmpurile pe subiect se verifică pe server;
 * - datele se păstrează la prânz UTC (aceeași zi în orice fus orar);
 * - camerele din bara de cazare devin totaluri și un rând de text pentru hotel.
 * Trimiterea cap-coadă (salvarea în „Cereri primite”) e probată în browser: raportul pasului 9.
 */

const lookups: Lookups = {
  today: '2026-11-24',
  activeSubjects: ['privateEvent', 'pizzaCourse', 'accommodation', 'question', 'complaint'],
  salonIds: [1, 2],
  roomTypeIds: [7],
  reasonIds: [11, 12],
}
const person = { telefon: '0722 000 111', email: 'ana@exemplu.ro', acord: 'da', nume: 'Ana P.' }

describe('F3 · pasul 9 · formularele', () => {
  it('Subiectul din adresă: doar cele cunoscute și pornite', () => {
    expect(subjectFromSlug('cazare')).toBe('accommodation')
    expect(subjectFromSlug('eveniment-privat')).toBe('privateEvent')
    expect(subjectFromSlug('altceva')).toBeNull()
    const off = validRequest({ subiect: 'curs-pizza', copiiCurs: '2', ...person }, { ...lookups, activeSubjects: ['accommodation'] })
    expect(off.errors.subiect).toBe(FORM_MESSAGES.subject)
  })

  it('Telefonul, emailul și acordul sunt obligatorii (S-06b: 3 câmpuri marcate)', () => {
    const r = validRequest({ subiect: 'intrebare', mesaj: 'Aveți terasă?' }, lookups)
    expect(Object.keys(r.errors).sort()).toEqual(['acord', 'email', 'telefon'])
    expect(r.data).toBeNull()
    expect(validRequest({ subiect: 'intrebare', mesaj: 'x', ...person, telefon: '123' }, lookups).errors.telefon).toBe(FORM_MESSAGES.phone)
    expect(validRequest({ subiect: 'intrebare', mesaj: 'x', ...person, email: 'ana@' }, lookups).errors.email).toBe(FORM_MESSAGES.email)
  })

  it('Cazare: sosirea de azi încolo, plecarea după sosire; datele la prânz UTC', () => {
    const bad = validRequest({ subiect: 'cazare', sosire: '2026-11-20', plecare: '2026-11-20', adultiTotal: '0', ...person }, lookups)
    expect(Object.keys(bad.errors).sort()).toEqual(['adultiTotal', 'plecare', 'sosire'])
    const ok = validRequest(
      { subiect: 'cazare', sosire: '2026-12-20', plecare: '2026-12-23', adultiTotal: '3', copiiTotal: '1', tipCamera: '7', ...person },
      lookups,
    )
    expect(ok.data?.details).toEqual({
      checkIn: '2026-12-20T12:00:00.000Z',
      checkOut: '2026-12-23T12:00:00.000Z',
      adults: 3,
      kids: 1,
      roomType: 7,
    })
  })

  it('Eveniment privat, curs de pizza, întrebare: câmpurile proprii', () => {
    expect(Object.keys(validRequest({ subiect: 'eveniment-privat', ...person }, lookups).errors).sort()).toEqual(['dataEveniment', 'invitati'])
    const ev = validRequest({ subiect: 'eveniment-privat', dataEveniment: '2026-12-12', invitati: '32', salon: '2', tipEveniment: 'Botez', ...person }, lookups)
    expect(ev.data?.details).toEqual({ eventDate: '2026-12-12T12:00:00.000Z', guests: 32, salon: 2, eventType: 'Botez' })
    // Un salon care nu e al restaurantului se ignoră.
    expect(validRequest({ subiect: 'eveniment-privat', dataEveniment: '2026-12-12', invitati: '10', salon: '99', ...person }, lookups).data?.details.salon).toBeUndefined()
    expect(validRequest({ subiect: 'curs-pizza', ...person }, lookups).errors.copiiCurs).toBe(FORM_MESSAGES.children)
    expect(validRequest({ subiect: 'intrebare', ...person }, lookups).errors.mesaj).toBe(FORM_MESSAGES.question)
  })

  it('Sesizare: data vizitei cel târziu azi, un motiv din panou, descrierea', () => {
    const bad = validRequest({ subiect: 'sesizare', dataVizitei: '2026-12-01', motiv: '99', ...person }, lookups)
    expect(Object.keys(bad.errors).sort()).toEqual(['dataVizitei', 'mesaj', 'motiv'])
    const ok = validRequest({ subiect: 'sesizare', dataVizitei: '2026-11-20', motiv: '12', mesaj: 'Am așteptat mult.', ospatar: 'Mihai', ...person }, lookups)
    expect(ok.data?.details).toEqual({ visitDate: '2026-11-20T12:00:00.000Z', reason: 12, waiter: 'Mihai' })
  })

  it('Camerele din bara de cazare: totaluri și rândul pentru hotel', () => {
    expect(roomsFromQuery(['2', '1'], ['0', '1'])).toEqual({ adults: 3, kids: 1, summary: 'Camera 1: 2 adulți · Camera 2: 1 adult, 1 copil' })
    expect(roomsFromQuery(['2'], ['0'])).toEqual({ adults: 2, kids: 0, summary: '' })
    expect(roomsFromQuery([], [])).toEqual({ adults: 0, kids: 0, summary: '' })
  })
})
