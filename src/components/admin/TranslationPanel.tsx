'use client'

import { Button, useDocumentInfo, useLocale } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'

/**
 * Panoul „Traduceri” din bara laterală a fiecărui document cu texte de tradus (F4, D-64, DESI 9):
 * starea fiecărei limbi, în cuvinte (nu doar culoare), și butoanele:
 * - „Tradu automat”: completează limbile netraduse și pe cele traduse automat; nu atinge ce a verificat un om;
 * - pe limba deschisă: „Retradu această limbă” și „Marchează verificat”.
 * După o acțiune, pagina se reîncarcă, ca formularul să arate textele noi.
 */

type State = 'none' | 'auto' | 'verified' | 'stale-auto' | 'stale-verified'

const LABEL: Record<State, string> = {
  none: 'Netradus',
  auto: 'Tradus automat',
  verified: 'Verificat de om',
  'stale-auto': 'De retradus',
  'stale-verified': 'De reverificat',
}

const MARK: Record<State, string> = {
  none: '○',
  auto: '◐',
  verified: '●',
  'stale-auto': '△',
  'stale-verified': '△',
}

const NAMES: Record<string, string> = {
  en: 'Engleză',
  it: 'Italiană',
  fr: 'Franceză',
  de: 'Germană',
  zh: 'Chineză',
  sv: 'Suedeză',
}

async function call(body: Record<string, unknown>) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || `Eroare ${res.status}`)
  return data
}

export function TranslationPanel() {
  const { id, collectionSlug } = useDocumentInfo()
  const locale = useLocale()
  const [states, setStates] = useState<{ locale: string; state: State }[] | null>(null)
  const [available, setAvailable] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id || !collectionSlug) return
    try {
      const data = await call({ action: 'states', collection: collectionSlug, id })
      setStates(data.states)
      setAvailable(Boolean(data.available))
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e))
    }
  }, [id, collectionSlug])

  useEffect(() => {
    void load()
  }, [load])

  if (!id) {
    return (
      <div className="field-type translation-panel">
        <p className="field-label">Traduceri</p>
        <p className="field-description">După prima salvare (în română) poți traduce documentul.</p>
      </div>
    )
  }

  const run = async (label: string, body: Record<string, unknown>) => {
    setBusy(label)
    setMessage(null)
    try {
      const r = await call({ collection: collectionSlug, id, ...body })
      const failed = (r.outcomes ?? []).filter((o: { ok: boolean }) => !o.ok)
      if (failed.length) {
        setMessage(`Nu s-a putut traduce: ${failed.map((f: { locale: string; error: string }) => `${f.locale} (${f.error})`).join('; ')}`)
        await load()
      } else {
        window.location.reload()
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }

  const current = locale?.code
  const currentState = states?.find((s) => s.locale === current)?.state

  return (
    <div className="field-type translation-panel" style={{ marginBottom: 24 }}>
      <p className="field-label" style={{ marginBottom: 8 }}>
        Traduceri
      </p>
      {!states ? (
        <p className="field-description">Se încarcă…</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: '0 0 12px', padding: 0, fontSize: 13, lineHeight: 1.7 }}>
          {states.map((s) => (
            <li key={s.locale} style={{ fontWeight: s.locale === current ? 700 : 400 }}>
              <span aria-hidden="true" style={{ display: 'inline-block', width: 16 }}>
                {MARK[s.state]}
              </span>
              {NAMES[s.locale] ?? s.locale}: {LABEL[s.state]}
            </li>
          ))}
        </ul>
      )}
      {!available && (
        <p className="field-description">Traducerea automată nu e pornită pe acest server (lipsește TRANSLATE_API_KEY).</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
        <Button buttonStyle="secondary" size="small" disabled={!available || Boolean(busy)} onClick={() => run('all', { action: 'doc' })}>
          {busy === 'all' ? 'Se traduce…' : 'Tradu automat'}
        </Button>
        {current && current !== 'ro' && (
          <>
            <Button
              buttonStyle="subtle"
              size="small"
              disabled={!available || Boolean(busy)}
              onClick={() => run('one', { action: 'doc', locales: [current] })}
            >
              {busy === 'one' ? 'Se traduce…' : `Retradu în ${(NAMES[current] ?? current).toLowerCase()}`}
            </Button>
            {currentState && currentState !== 'none' && currentState !== 'verified' && (
              <Button buttonStyle="subtle" size="small" disabled={Boolean(busy)} onClick={() => run('verify', { action: 'verify', locale: current })}>
                {busy === 'verify' ? 'Se salvează…' : 'Marchează verificat'}
              </Button>
            )}
          </>
        )}
      </div>
      <p className="field-description" style={{ marginTop: 8 }}>
        „Tradu automat” nu suprascrie un text verificat de om. O corectură salvată într-o limbă o marchează „Verificat de om”.
      </p>
      {message && (
        <p role="alert" style={{ color: 'var(--theme-error-500)', fontSize: 13 }}>
          {message}
        </p>
      )}
    </div>
  )
}
