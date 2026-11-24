'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

import { plural, UI } from '@/lib/site/strings'

/**
 * Cererea de cazare (content-model 4.2, D-15, D-45): o bară-pastilă cu Sosire · Plecare · Camere și
 * oaspeți și butonul de cerere, după referința aleasă de Alin (design/f3/referinte/). Fiecare câmp
 * deschide deasupra lui un panou: calendarul sau camerele cu adulți și copii.
 *
 * Este o cerere de ofertă, nu o rezervare: trimite la Contact cu subiectul Cazare și datele
 * completate (design/flows/flow-cazare.mmd). Parametrii: `sosire`, `plecare` (AAAA-LL-ZZ),
 * `camere`, apoi `adulti` și `copii` repetați, câte unul pe cameră, în ordine.
 */

/** Iconiță din setul paginii (simbolurile sunt în pagină, src/components/site/Icons.tsx). */
const I = ({ name, className }: { name: string; className?: string }) => (
  <svg className={['icon', className].filter(Boolean).join(' ')} aria-hidden="true" focusable="false">
    <use href={`#i-${name}`} />
  </svg>
)

/** [PRESUPUNERE] Cel mult 4 camere într-o cerere; hotelul confirmă oricum disponibilitatea. */
const MAX_ROOMS = 4

type Room = { adults: number; children: number }
type Panel = 'arrive' | 'depart' | 'guests' | null

/* ---------- Date calendaristice, ca text AAAA-LL-ZZ (fără fus orar) ---------- */

const toUtc = (iso: string) => new Date(`${iso}T00:00:00Z`)
const isoOf = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (iso: string, n: number) => {
  const d = toUtc(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return isoOf(d)
}
const addMonths = (y: number, m: number, n: number) => {
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 }
}
const ym = (iso: string) => ({ y: Number(iso.slice(0, 4)), m: Number(iso.slice(5, 7)) })
const fmt = (iso: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('ro-RO', { ...o, timeZone: 'UTC' }).format(toUtc(iso))
const short = (iso: string) => fmt(iso, { day: 'numeric', month: 'short', year: 'numeric' })
const long = (iso: string) => fmt(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const title = (y: number, m: number) => {
  const t = fmt(`${y}-${String(m).padStart(2, '0')}-01`, { month: 'long', year: 'numeric' })
  return t.charAt(0).toUpperCase() + t.slice(1)
}
/** Cele 42 de zile afișate pentru o lună, începând cu lunea (convenția din România). */
function monthDays(y: number, m: number): string[] {
  const first = new Date(Date.UTC(y, m - 1, 1))
  const offset = (first.getUTCDay() + 6) % 7
  first.setUTCDate(1 - offset)
  return Array.from({ length: 42 }, (_, i) => addDays(isoOf(first), i))
}

/* ---------- Calendarul ---------- */

function Calendar({
  label,
  value,
  min,
  today,
  range,
  onPick,
}: {
  label: string
  value: string
  min: string
  today: string
  range: [string, string]
  onPick: (iso: string) => void
}) {
  const [view, setView] = useState(() => ym(value))
  const [focus, setFocus] = useState(value)
  const grid = useRef<HTMLTableElement>(null)
  const minMonth = ym(min)
  const canPrev = view.y > minMonth.y || (view.y === minMonth.y && view.m > minMonth.m)
  const days = monthDays(view.y, view.m)

  // Focusul pe ziua aleasă la deschidere și după mutarea cu tastatura.
  useEffect(() => {
    grid.current?.querySelector<HTMLButtonElement>(`button[data-day="${focus}"]`)?.focus()
  }, [focus, view])

  const move = (iso: string) => {
    if (iso < min) return
    setFocus(iso)
    const v = ym(iso)
    if (v.y !== view.y || v.m !== view.m) setView(v)
  }
  const onKey = (e: React.KeyboardEvent) => {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (e.key in steps) {
      e.preventDefault()
      move(addDays(focus, steps[e.key]))
    } else if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault()
      const d = toUtc(focus)
      d.setUTCMonth(d.getUTCMonth() + (e.key === 'PageUp' ? -1 : 1))
      move(isoOf(d))
    }
  }

  return (
    <div className="cal" role="dialog" aria-label={label}>
      <div className="cal-head">
        <button
          className="cal-nav"
          type="button"
          aria-label={UI.stay.prevMonth}
          disabled={!canPrev}
          onClick={() => setView(addMonths(view.y, view.m, -1))}
        >
          <I name="chevron-left" />
        </button>
        <p className="cal-title" aria-live="polite">
          {title(view.y, view.m)}
        </p>
        <button
          className="cal-nav"
          type="button"
          aria-label={UI.stay.nextMonth}
          onClick={() => setView(addMonths(view.y, view.m, 1))}
        >
          <I name="chevron-right" />
        </button>
      </div>
      <table className="cal-grid" ref={grid} onKeyDown={onKey}>
        <thead>
          <tr>
            {UI.stay.weekdays.map((d, i) => (
              <th key={d} scope="col" abbr={UI.stay.weekdaysLong[i]}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, w) => (
            <tr key={w}>
              {days.slice(w * 7, w * 7 + 7).map((iso) => {
                const outside = ym(iso).m !== view.m
                const past = iso < min
                const selected = iso === range[0] || iso === range[1]
                const inRange = iso > range[0] && iso < range[1]
                return (
                  <td key={iso}>
                    <button
                      type="button"
                      data-day={iso}
                      className={[
                        'cal-day',
                        outside ? 'is-outside' : '',
                        iso === today ? 'is-today' : '',
                        selected ? 'is-selected' : '',
                        inRange ? 'is-range' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      tabIndex={iso === focus ? 0 : -1}
                      disabled={past}
                      aria-pressed={selected}
                      aria-current={iso === today ? 'date' : undefined}
                      aria-label={`${long(iso)}${iso === today ? `, ${UI.stay.today}` : ''}`}
                      onClick={() => onPick(iso)}
                    >
                      {Number(iso.slice(8, 10))}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Camere și oaspeți ---------- */

function Stepper({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <div className="stepper" role="group" aria-labelledby={id}>
      <span className="stepper-label" id={id}>
        {label}
      </span>
      <button
        className="step"
        type="button"
        aria-label={UI.stay.fewer(label)}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <I name="minus" />
      </button>
      <output className="step-value" aria-live="polite">
        {value}
      </output>
      <button
        className="step"
        type="button"
        aria-label={UI.stay.more(label)}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <I name="plus" />
      </button>
    </div>
  )
}

const roomSummary = (r: Room) =>
  [plural(r.adults, 'adult', 'adulți'), r.children ? plural(r.children, 'copil', 'copii') : null]
    .filter(Boolean)
    .join(', ')

function guestsSummary(rooms: Room[]) {
  const a = rooms.reduce((s, r) => s + r.adults, 0)
  const c = rooms.reduce((s, r) => s + r.children, 0)
  return `${plural(rooms.length, 'cameră', 'camere')} · ${plural(a, 'adult', 'adulți')}, ${plural(c, 'copil', 'copii')}`
}

/* ---------- Bara (desktop) și panoul (telefon), cu aceeași logică ---------- */

type WidgetProps = {
  uid: string
  variant: 'bar' | 'sheet'
  today: string
  maxAdults: number
  maxChildren: number
  buttonLabel: string
}

function StayWidget({ uid, variant, today, maxAdults, maxChildren, buttonLabel }: WidgetProps) {
  const [arrive, setArrive] = useState(today)
  const [depart, setDepart] = useState(addDays(today, 1))
  const [rooms, setRooms] = useState<Room[]>([{ adults: 2, children: 0 }])
  const [open, setOpen] = useState<Panel>(null)
  const root = useRef<HTMLFormElement>(null)

  const close = (field?: Panel) => {
    setOpen(null)
    if (field) root.current?.querySelector<HTMLButtonElement>(`[data-field="${field}"]`)?.focus()
  }

  // Un clic în afara barei sau Esc închide panoul deschis.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Esc închide doar panoul, nu și fereastra de pe telefon.
        e.preventDefault()
        e.stopPropagation()
        close(open)
      }
    }
    document.addEventListener('pointerdown', onDown)
    root.current?.addEventListener('keydown', onKey)
    const el = root.current
    return () => {
      document.removeEventListener('pointerdown', onDown)
      el?.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pickArrive = (iso: string) => {
    setArrive(iso)
    if (depart <= iso) setDepart(addDays(iso, 1))
    setOpen('depart') // după sosire urmează plecarea, ca în referință
  }
  const pickDepart = (iso: string) => {
    if (iso <= arrive) {
      // o zi înainte de sosire: devine noua sosire
      setArrive(iso)
      setDepart(addDays(iso, 1))
      return
    }
    setDepart(iso)
    close('depart')
  }
  const setRoom = (i: number, patch: Partial<Room>) =>
    setRooms((rs) => rs.map((r, n) => (n === i ? { ...r, ...patch } : r)))

  const field = (
    name: Exclude<Panel, null>,
    icon: string,
    label: string,
    value: string,
    panel: React.ReactNode,
  ) => (
    <div className={`sfield${open === name ? ' is-open' : ''}`}>
      <button
        className="sfield-btn"
        type="button"
        data-field={name}
        aria-expanded={open === name}
        aria-controls={`${uid}-${name}`}
        onClick={() => setOpen(open === name ? null : name)}
      >
        <I name={icon} className="sfield-icon" />
        <span className="sfield-text">
          <span className="sfield-label">{label}</span>
          <span className="sfield-value">{value}</span>
        </span>
        <I name="chevron-down" className="sfield-chevron" />
      </button>
      {open === name && (
        <div className="spop" id={`${uid}-${name}`}>
          {panel}
        </div>
      )}
    </div>
  )

  const ornament = variant === 'bar' ? <I name="ornament" className="sbar-orn" /> : null

  return (
    <form className={`sbar sbar--${variant}`} ref={root} action="/contact" method="get">
      <input type="hidden" name="subiect" value="cazare" />
      <input type="hidden" name="sosire" value={arrive} />
      <input type="hidden" name="plecare" value={depart} />
      <input type="hidden" name="camere" value={rooms.length} />
      {rooms.map((r, i) => (
        <React.Fragment key={i}>
          <input type="hidden" name="adulti" value={r.adults} />
          <input type="hidden" name="copii" value={r.children} />
        </React.Fragment>
      ))}

      {field(
        'arrive',
        'calendar',
        UI.stay.arrive,
        short(arrive),
        <Calendar
          label={UI.stay.chooseArrive}
          value={arrive}
          min={today}
          today={today}
          range={[arrive, depart]}
          onPick={pickArrive}
        />,
      )}
      {ornament}
      {field(
        'depart',
        'calendar',
        UI.stay.depart,
        short(depart),
        <Calendar
          key={arrive}
          label={UI.stay.chooseDepart}
          value={depart}
          min={addDays(today, 1)}
          today={today}
          range={[arrive, depart]}
          onPick={pickDepart}
        />,
      )}
      {ornament}
      {field(
        'guests',
        'door',
        UI.stay.roomsGuests,
        guestsSummary(rooms),
        <div className="rooms" role="dialog" aria-label={UI.stay.roomsGuests}>
          {rooms.map((r, i) => (
            <div className="room" key={i}>
              <p className="room-title">
                {UI.stay.room(i + 1)}: {roomSummary(r)}
              </p>
              <Stepper
                id={`${uid}-r${i}-a`}
                label={UI.stay.adults}
                value={r.adults}
                min={1}
                max={Math.max(1, maxAdults)}
                onChange={(n) => setRoom(i, { adults: n })}
              />
              <Stepper
                id={`${uid}-r${i}-c`}
                label={UI.stay.children}
                value={r.children}
                min={0}
                max={Math.max(0, maxChildren)}
                onChange={(n) => setRoom(i, { children: n })}
              />
            </div>
          ))}
          <button
            className="pill pill--dark"
            type="button"
            disabled={rooms.length >= MAX_ROOMS}
            onClick={() => setRooms((rs) => [...rs, { adults: 1, children: 0 }])}
          >
            {UI.stay.addRoom}
            <I name="plus" />
          </button>
          <button
            className="pill pill--outline"
            type="button"
            disabled={rooms.length <= 1}
            onClick={() => setRooms((rs) => rs.slice(0, -1))}
          >
            {UI.stay.removeRoom}
          </button>
        </div>,
      )}
      {ornament}
      <button className="btn btn-secondary sbar-submit" type="submit">
        {variant === 'sheet' ? UI.stay.continue : buttonLabel}
      </button>
    </form>
  )
}

type Props = {
  id: string
  title: string
  note: string
  buttonLabel: string
  maxAdults: number
  maxChildren: number
  /** Data de azi în ora României (AAAA-LL-ZZ). */
  today: string
  /** Eticheta „Exemplu · de înlocuit”, randată pe server, dacă textele sunt provizorii. */
  tag?: React.ReactNode
}

export function StayRequest({ id, title, note, buttonLabel, maxAdults, maxChildren, today, tag }: Props) {
  const uid = useId().replace(/:/g, '')
  const sheet = useRef<HTMLDialogElement>(null)
  const common = { today, maxAdults, maxChildren, buttonLabel }

  return (
    <div className="stay-request" id={id}>
      {/* Desktop: titlul și nota deasupra barei-pastilă, pe copertă */}
      <div className="stay-desktop">
        <div className="stay-caption">
          <h2 className="stay-title" id={`${uid}-t`}>
            {title}
          </h2>
          <p className="stay-note">{note}</p>
          {tag}
        </div>
        <div role="group" aria-labelledby={`${uid}-t`}>
          <StayWidget uid={`${uid}d`} variant="bar" {...common} />
        </div>
      </div>

      {/* Telefon: un buton-fâșie care deschide panoul S-01b, cu aceleași câmpuri */}
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
        <div className="stay-sheet-head">
          <h2 className="stay-title" id={`${uid}-st`}>
            {title}
          </h2>
          <button className="nav-close" type="button" aria-label={UI.stay.close} onClick={() => sheet.current?.close()}>
            <I name="x" />
          </button>
        </div>
        <p className="stay-note">{note}</p>
        {tag}
        <StayWidget uid={`${uid}m`} variant="sheet" {...common} />
      </dialog>
    </div>
  )
}
