'use client'

import Link from 'next/link'
import React, { useActionState, useEffect, useRef, useState } from 'react'

import { submitRequest, type FormState } from '@/app/(frontend)/[lang]/contact/actions'
import type { Subject } from '@/lib/site/requests'
import { clientUI } from '@/lib/site/i18n/client'
import { localePath } from '@/lib/locales'

import { Icon } from './Icons'

/**
 * Formularul unic de Contact (S-06, S-06b, S-06c) și cel de sesizări (S-07).
 * - Subiectele sunt butoane radio: câmpurile potrivite apar prin CSS (`:has`), deci și fără JavaScript.
 * - Greșelile apar lângă câmp, cu text și semn (nu doar culoare); sus, câte câmpuri lipsesc;
 *   focusul sare la primul câmp greșit. Ce s-a scris rămâne în formular.
 * - Confirmarea spune ce s-a cerut și cine răspunde; emailul de confirmare vine în F5 (D-36).
 */

export type ContactFormProps = {
  mode: 'contact' | 'complaint'
  subjects: { key: Subject; slug: string; label: string }[]
  initial: Record<string, string>
  today: string
  startedAt: number
  salons: { id: number; name: string; capacity: number }[]
  roomTypes: { id: number; name: string }[]
  reasons: { id: number; reason: string; explanation?: string | null }[]
  hotelName?: string | null
  urgent: Partial<Record<Subject, { phone: string; tel: string; email?: string }>>
  responseTimes: Partial<Record<Subject, string>>
  book?: { label: string; tel: string | null; ialoc: boolean }
  /** Limba paginii (F4): textele, mesajele de validare și linkurile. */
  locale: string
}

const initialState: FormState = { status: 'idle', attempt: 0 }

function Field({
  name,
  label,
  error,
  hint,
  children,
  errorMark,
}: {
  name: string
  label: string
  error?: string
  hint?: string
  children: React.ReactElement<Record<string, unknown>>
  errorMark: string
}) {
  const describedBy = [hint ? `${name}-hint` : null, error ? `${name}-err` : null].filter(Boolean).join(' ') || undefined
  return (
    <div className={`cf-field${error ? ' cf-field--error' : ''}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      {React.cloneElement(children, {
        id: `f-${name}`,
        name,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {hint && (
        <p className="cf-hint" id={`${name}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="cf-error" id={`${name}-err`}>
          <span className="cf-error-mark" aria-hidden="true">
            !
          </span>
          <span className="sr-only">{errorMark} </span>
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm(props: ContactFormProps) {
  const { mode, subjects, initial, today, salons, roomTypes, reasons, locale } = props
  const UI = clientUI(locale)
  const [state, action, pending] = useActionState(submitRequest, initialState)
  const values = { ...initial, ...(state.values ?? {}) }
  const errors = state.errors ?? {}
  const formRef = useRef<HTMLFormElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)
  const [guests, setGuests] = useState(Number(values.invitati) || 0)
  const selected = values.subiect || subjects[0]?.slug || ''
  const [current, setCurrent] = useState(selected)

  // După trimitere: focusul pe primul câmp greșit sau pe confirmare.
  useEffect(() => {
    if (state.status === 'error') {
      // S-06b: focusul sare la primul câmp cu problemă; sumarul (role="alert") e anunțat oricum.
      const first =
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]') ??
        formRef.current?.querySelector<HTMLElement>('.cf-summary')
      first?.focus()
    } else if (state.status === 'ok') {
      doneRef.current?.focus()
    }
  }, [state])

  if (state.status === 'ok') {
    const subject = state.subject
    const urgent = subject ? props.urgent[subject] : undefined
    const response = subject ? props.responseTimes[subject] : undefined
    return (
      <div className="cf-done" ref={doneRef} tabIndex={-1} role="status">
        <p className="cf-done-title">
          <Icon name="ornament" />
          {UI.form.doneTitle}
        </p>
        {state.summary && state.summary.length > 0 && <p className="cf-done-summary">{state.summary.join(' · ')}</p>}
        <p>
          {UI.form.weCall}
          {response ? ` ${response}` : ''}
        </p>
        {urgent && (
          <p>
            {UI.form.urgent} <a href={urgent.tel}>{urgent.phone}</a>
            {urgent.email && (
              <>
                {' · '}
                <a href={`mailto:${urgent.email}`}>{urgent.email}</a>
              </>
            )}
          </p>
        )}
        <Link className="btn btn-secondary" href={localePath(locale, '/')}>
          {UI.form.backHome}
        </Link>
      </div>
    )
  }

  // Salonul potrivit, doar după ce vizitatorul scrie numărul de invitați.
  const fit = guests > 0 ? salons.filter((s) => s.capacity >= guests).sort((a, b) => a.capacity - b.capacity)[0] : undefined
  const maxCapacity = Math.max(0, ...salons.map((s) => s.capacity))
  const missing = Object.keys(errors).filter((k) => k !== 'form').length
  const v = (k: string) => values[k] ?? ''

  return (
    <form ref={formRef} key={state.attempt} action={action} noValidate className={`cf cf--${mode}`}>
      <input type="hidden" name="limba" value={locale} />
      {(missing > 0 || errors.form) && (
        <div className="cf-summary" role="alert" tabIndex={-1}>
          <span className="cf-error-mark" aria-hidden="true">
            !
          </span>
          {errors.form ?? UI.form.missing(missing)}
        </div>
      )}

      <input type="hidden" name="t" value={props.startedAt} />
      {/* Capcană pentru roboți: oamenii nu văd și nu completează acest câmp. */}
      <div className="cf-trap" aria-hidden="true">
        <label htmlFor="f-website">Site</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {mode === 'complaint' ? (
        <input type="hidden" name="subiect" value={subjects[0]?.slug} />
      ) : (
        <fieldset
          className="cf-subjects"
          onChange={(e) => {
            const input = e.target as unknown as HTMLInputElement
            if (input.name === 'subiect') setCurrent(input.value)
          }}
        >
          <legend>{UI.form.subjectLegend}</legend>
          <div className="chip-filter">
            {props.book && (
              <span className="chip chip--action">
                {props.book.ialoc ? (
                  <button type="button" data-ialoc="">
                    {UI.form.bookTable}
                    <Icon name="arrow-up-right" />
                  </button>
                ) : props.book.tel ? (
                  <a href={props.book.tel}>
                    {UI.form.bookTable}
                    <Icon name="phone" />
                  </a>
                ) : null}
              </span>
            )}
            {subjects.map((s) => (
              <span key={s.key} className="chip">
                <input type="radio" name="subiect" id={`s-${s.slug}`} value={s.slug} defaultChecked={s.slug === selected} />
                <label htmlFor={`s-${s.slug}`}>{s.key === 'question' ? UI.form.question : s.label}</label>
              </span>
            ))}
          </div>
          {errors.subiect && (
            <p className="cf-error" id="subiect-err">
              <span className="cf-error-mark" aria-hidden="true">
                !
              </span>
              <span className="sr-only">{UI.form.errorMark} </span>
              {errors.subiect}
            </p>
          )}
        </fieldset>
      )}

      {subjects.some((s) => s.key === 'privateEvent') && (
        <div className="cf-group" data-subject="eveniment-privat">
          <Field errorMark={UI.form.errorMark} name="tipEveniment" label={UI.form.eventType} hint={UI.form.eventTypeHint} error={errors.tipEveniment}>
            <input type="text" maxLength={60} defaultValue={v('tipEveniment')} />
          </Field>
          <div className="cf-row">
            <Field errorMark={UI.form.errorMark} name="dataEveniment" label={UI.form.eventDate} error={errors.dataEveniment}>
              <input type="date" min={today} defaultValue={v('dataEveniment')} />
            </Field>
            <Field errorMark={UI.form.errorMark} name="invitati" label={UI.form.guests} error={errors.invitati}>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                defaultValue={v('invitati')}
                onChange={(e) => setGuests(Number(e.target.value) || 0)}
              />
            </Field>
          </div>
          {guests > 0 && salons.length > 0 && (
            <p className="cf-note" aria-live="polite">
              {fit ? UI.form.salonFits(fit.name, fit.capacity) : UI.form.salonTooMany(maxCapacity)}
            </p>
          )}
          {salons.length > 1 && (
            <Field errorMark={UI.form.errorMark} name="salon" label={UI.form.salon}>
              <select defaultValue={v('salon') || (fit ? String(fit.id) : '')} key={fit?.id ?? 'none'}>
                <option value="">{UI.form.salonAny}</option>
                {salons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>
      )}

      {subjects.some((s) => s.key === 'pizzaCourse') && (
        <div className="cf-group" data-subject="curs-pizza">
          <div className="cf-row">
            <Field errorMark={UI.form.errorMark} name="copiiCurs" label={UI.form.children} error={errors.copiiCurs}>
              <input type="number" inputMode="numeric" min={1} defaultValue={v('copiiCurs')} />
            </Field>
            <Field errorMark={UI.form.errorMark} name="varste" label={UI.form.ages} hint={UI.form.agesHint} error={errors.varste}>
              <input type="text" maxLength={60} defaultValue={v('varste')} />
            </Field>
          </div>
          <Field errorMark={UI.form.errorMark} name="dataDorita" label={UI.form.preferredDate} error={errors.dataDorita}>
            <input type="date" min={today} defaultValue={v('dataDorita')} />
          </Field>
          <p className="cf-note">{UI.form.allergies}</p>
        </div>
      )}

      {subjects.some((s) => s.key === 'accommodation') && (
        <div className="cf-group" data-subject="cazare">
          <div className="cf-row">
            <Field errorMark={UI.form.errorMark} name="sosire" label={UI.form.checkIn} error={errors.sosire}>
              <input type="date" min={today} defaultValue={v('sosire')} />
            </Field>
            <Field errorMark={UI.form.errorMark} name="plecare" label={UI.form.checkOut} error={errors.plecare}>
              <input type="date" min={today} defaultValue={v('plecare')} />
            </Field>
          </div>
          <div className="cf-row">
            <Field errorMark={UI.form.errorMark} name="adultiTotal" label={UI.form.adults} error={errors.adultiTotal}>
              <input type="number" inputMode="numeric" min={1} defaultValue={v('adultiTotal') || '2'} />
            </Field>
            <Field errorMark={UI.form.errorMark} name="copiiTotal" label={UI.form.kids} error={errors.copiiTotal}>
              <input type="number" inputMode="numeric" min={0} defaultValue={v('copiiTotal') || '0'} />
            </Field>
          </div>
          {v('camereDetaliu') && (
            <>
              <input type="hidden" name="camereDetaliu" value={v('camereDetaliu')} />
              <p className="cf-note">{v('camereDetaliu')}</p>
            </>
          )}
          {roomTypes.length > 0 && (
            <Field errorMark={UI.form.errorMark} name="tipCamera" label={UI.form.roomType}>
              <select defaultValue={v('tipCamera')}>
                <option value="">{UI.form.roomAny}</option>
                {roomTypes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {props.hotelName && <p className="cf-note">{UI.form.hotelNote(props.hotelName)}</p>}
        </div>
      )}

      {subjects.some((s) => s.key === 'question') && (
        <div className="cf-group" data-subject="intrebare">
          <p className="cf-note">{UI.form.questionNote}</p>
        </div>
      )}

      {mode === 'complaint' && (
        <div className="cf-group cf-group--always">
          <Field errorMark={UI.form.errorMark} name="dataVizitei" label={UI.form.visitDate} error={errors.dataVizitei}>
            <input type="date" max={today} defaultValue={v('dataVizitei')} />
          </Field>
          <fieldset className={`cf-reasons${errors.motiv ? ' cf-field--error' : ''}`} aria-describedby={errors.motiv ? 'motiv-err' : undefined}>
            <legend>{UI.form.reason}</legend>
            {reasons.map((r, i) => (
              <label key={r.id} className="cf-reason">
                <input
                  type="radio"
                  name="motiv"
                  value={r.id}
                  defaultChecked={v('motiv') === String(r.id)}
                  aria-invalid={errors.motiv && i === 0 ? true : undefined}
                />
                <span>
                  <b>{r.reason}</b>
                  {r.explanation && <small>{r.explanation}</small>}
                </span>
              </label>
            ))}
            {errors.motiv && (
              <p className="cf-error" id="motiv-err">
                <span className="cf-error-mark" aria-hidden="true">
                  !
                </span>
                <span className="sr-only">{UI.form.errorMark} </span>
                {errors.motiv}
              </p>
            )}
          </fieldset>
          <Field errorMark={UI.form.errorMark} name="ospatar" label={UI.form.waiter} hint={UI.form.waiterHint} error={errors.ospatar}>
            <input type="text" maxLength={60} defaultValue={v('ospatar')} />
          </Field>
        </div>
      )}

      <div className="cf-person">
        <Field errorMark={UI.form.errorMark} name="nume" label={UI.form.name} error={errors.nume}>
          <input type="text" autoComplete="name" maxLength={80} defaultValue={v('nume')} />
        </Field>
        <div className="cf-row">
          <Field errorMark={UI.form.errorMark} name="telefon" label={UI.form.phone} error={errors.telefon}>
            <input type="tel" autoComplete="tel" inputMode="tel" maxLength={30} defaultValue={v('telefon')} />
          </Field>
          <Field errorMark={UI.form.errorMark} name="email" label={UI.form.email} error={errors.email}>
            <input type="email" autoComplete="email" inputMode="email" maxLength={120} defaultValue={v('email')} />
          </Field>
        </div>
        <Field errorMark={UI.form.errorMark}
          name="mesaj"
          label={mode === 'complaint' ? UI.form.description : current === 'intrebare' ? UI.form.questionLabel : UI.form.details}
          hint={mode === 'complaint' || current === 'intrebare' ? undefined : UI.form.detailsHint}
          error={errors.mesaj}
        >
          <textarea rows={4} maxLength={2000} defaultValue={v('mesaj')} />
        </Field>
        <div className={`cf-consent${errors.acord ? ' cf-field--error' : ''}`}>
          <input
            type="checkbox"
            id="f-acord"
            name="acord"
            value="da"
            defaultChecked={v('acord') === 'da'}
            aria-invalid={errors.acord ? true : undefined}
            aria-describedby={errors.acord ? 'acord-err' : undefined}
          />
          <label htmlFor="f-acord">{UI.form.consent}</label>
          {errors.acord && (
            <p className="cf-error" id="acord-err">
              <span className="cf-error-mark" aria-hidden="true">
                !
              </span>
              <span className="sr-only">{UI.form.errorMark} </span>
              {errors.acord}
            </p>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-secondary cf-submit" disabled={pending}>
        {pending ? UI.form.sending : mode === 'complaint' ? UI.form.complaintSubmit : UI.form.submit}
      </button>
    </form>
  )
}
