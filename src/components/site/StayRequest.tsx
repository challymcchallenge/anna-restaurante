'use client'

import React, { useId, useRef, useState } from 'react'

import { UI } from '@/lib/site/strings'

/** Iconiță din setul paginii (simbolurile sunt deja în pagină, src/components/site/Icons.tsx). */
const I = ({ name }: { name: string }) => (
  <svg className="icon" aria-hidden="true" focusable="false">
    <use href={`#i-${name}`} />
  </svg>
)

type Props = {
  id: string
  title: string
  note: string
  buttonLabel: string
  maxAdults: number
  maxChildren: number
  /** Data de azi în ora României (AAAA-LL-ZZ), pentru `min`. */
  today: string
  /** Eticheta „Exemplu · de înlocuit”, randată pe server, dacă textele sunt provizorii. */
  tag?: React.ReactNode
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

const nextDay = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

/**
 * Câmpurile cererii de cazare (content-model 4.2, D-15): sosire, plecare, adulți, copii.
 * Este o cerere de ofertă, nu o rezervare: trimite către formularul de Contact cu subiectul Cazare,
 * cu datele deja completate (design/flows/flow-cazare.mmd); acolo se trimite emailul către hotel.
 */
function Fields({
  uid,
  today,
  maxAdults,
  maxChildren,
  layout,
}: {
  uid: string
  today: string
  maxAdults: number
  maxChildren: number
  layout: 'row' | 'sheet'
}) {
  const [arrive, setArrive] = useState('')
  const [depart, setDepart] = useState('')
  const [error, setError] = useState('')
  const departMin = arrive ? nextDay(arrive) : nextDay(today)

  return (
    <>
      <div className="field">
        <label className="field-label" htmlFor={`${uid}-sosire`}>
          <I name="calendar" />
          {UI.stay.arrive}
        </label>
        <input
          className="field-input"
          id={`${uid}-sosire`}
          type="date"
          name="sosire"
          min={today}
          value={arrive}
          onChange={(e) => {
            setArrive(e.target.value)
            if (depart && e.target.value && depart <= e.target.value) setDepart('')
            setError('')
          }}
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor={`${uid}-plecare`}>
          <I name="calendar" />
          {UI.stay.depart}
        </label>
        <input
          className="field-input"
          id={`${uid}-plecare`}
          type="date"
          name="plecare"
          min={departMin}
          value={depart}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${uid}-err` : undefined}
          onChange={(e) => {
            setDepart(e.target.value)
            setError(arrive && e.target.value && e.target.value <= arrive ? UI.stay.departAfterArrive : '')
          }}
        />
        {error && (
          <p className="field-error" id={`${uid}-err`} role="alert">
            {error}
          </p>
        )}
      </div>
      <fieldset className={`field field--guests field--${layout}`}>
        <legend className="field-label">
          <I name="users" />
          {UI.stay.guests}
        </legend>
        <div className="guests">
          <label className="guest">
            <span className="guest-label">{UI.stay.adults}</span>
            <select className="field-input" name="adulti" defaultValue="2">
              {range(1, Math.max(1, maxAdults)).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="guest">
            <span className="guest-label">{UI.stay.children}</span>
            <select className="field-input" name="copii" defaultValue="0">
              {range(0, Math.max(0, maxChildren)).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>
    </>
  )
}

/** Plecarea trebuie să fie după sosire; altfel formularul nu pleacă. */
function validDates(form: HTMLFormElement) {
  const a = (form.elements.namedItem('sosire') as HTMLInputElement | null)?.value
  const d = (form.elements.namedItem('plecare') as HTMLInputElement | null)?.value
  return !(a && d && d <= a)
}

export function StayRequest({ id, title, note, buttonLabel, maxAdults, maxChildren, today, tag }: Props) {
  const uid = useId().replace(/:/g, '')
  const sheet = useRef<HTMLDialogElement>(null)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validDates(e.currentTarget)) {
      e.preventDefault()
      e.currentTarget.querySelector<HTMLInputElement>('input[name="plecare"]')?.focus()
    }
  }

  return (
    <div className="stay-request" id={id}>
      {/* Desktop: fâșia de hârtie la baza copertei */}
      <form className="stay-row" action="/contact" method="get" onSubmit={onSubmit} aria-labelledby={`${uid}-t`}>
        <input type="hidden" name="subiect" value="cazare" />
        <div className="stay-head">
          <h2 className="stay-title" id={`${uid}-t`}>
            {title}
          </h2>
          <p className="stay-note">{note}</p>
          {tag}
        </div>
        <Fields uid={`${uid}d`} today={today} maxAdults={maxAdults} maxChildren={maxChildren} layout="row" />
        <button className="btn btn-secondary stay-submit" type="submit">
          {buttonLabel}
        </button>
      </form>

      {/* Telefon: un buton-fâșie care deschide panoul S-01b */}
      <button
        className="stay-mobile"
        type="button"
        aria-haspopup="dialog"
        aria-controls={`${uid}-sheet`}
        onClick={() => sheet.current?.showModal()}
      >
        <span>
          <span className="stay-mobile-title">{title}</span>
          <span className="stay-mobile-note">{UI.stay.mobileNote}</span>
        </span>
        <I name="chevron-right" />
      </button>
      <dialog className="stay-sheet" id={`${uid}-sheet`} ref={sheet} aria-labelledby={`${uid}-st`}>
        <form action="/contact" method="get" onSubmit={onSubmit}>
          <input type="hidden" name="subiect" value="cazare" />
          <div className="stay-sheet-head">
            <h2 className="stay-title" id={`${uid}-st`}>
              {title}
            </h2>
            <button
              className="nav-close"
              type="button"
              aria-label={UI.stay.close}
              onClick={() => sheet.current?.close()}
            >
              <I name="x" />
            </button>
          </div>
          <p className="stay-note">{note}</p>
          {tag}
          <div className="stay-sheet-fields">
            <Fields uid={`${uid}m`} today={today} maxAdults={maxAdults} maxChildren={maxChildren} layout="sheet" />
          </div>
          <button className="btn btn-secondary stay-submit" type="submit">
            {UI.stay.continue}
          </button>
        </form>
      </dialog>
    </div>
  )
}
