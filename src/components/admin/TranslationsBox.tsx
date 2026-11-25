'use client'

import { Button } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'

/**
 * Tabloul de bord · Traduceri (F4, D-64): pe fiecare limbă, câte documente sunt netraduse, traduse
 * automat, verificate de om sau de refăcut. „Tradu tot site-ul” lucrează în ture de ~45 s (o cerere
 * nu poate dura oricât) și se repetă singur până nu mai rămâne nimic.
 */

type Counts = { none: number; auto: number; verified: number; 'stale-auto': number; 'stale-verified': number }
type Overview = Record<string, Counts> & { documents: number }

const NAMES: Record<string, string> = { en: 'Engleză', it: 'Italiană', fr: 'Franceză', de: 'Germană', zh: 'Chineză', sv: 'Suedeză' }

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

export function TranslationsBox({ tenantId, admin }: { tenantId: number | string; admin: boolean }) {
  const [data, setData] = useState<{ available: boolean; overview: Overview } | null>(null)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const [tick, setTick] = useState(0)
  const load = useCallback(() => setTick((t) => t + 1), [])
  useEffect(() => {
    let alive = true
    call({ action: 'overview', tenantId })
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e instanceof Error ? e.message : String(e)))
    return () => {
      alive = false
    }
  }, [tenantId, tick])

  const runAll = async () => {
    setRunning(true)
    setError(null)
    setLog([])
    let cost = 0
    let done = 0
    try {
      for (let round = 1; round <= 60; round++) {
        const r = await call({ action: 'batch', tenantId, mode: 'missing' })
        cost += r.costUsd ?? 0
        done += r.done ?? 0
        setLog((l) => [
          ...l,
          `Tura ${round}: ${r.done} traduceri, ${r.failed?.length ?? 0} erori, mai rămân ${r.remaining}. Cost până acum: ${cost.toFixed(3)} USD.`,
          ...(r.failed ?? []).slice(0, 5).map((f: { collection: string; id: string; locale: string; error: string }) => `  · ${f.collection} #${f.id} (${f.locale}): ${f.error}`),
        ])
        if (!r.remaining || (r.done === 0 && r.failed?.length)) break
      }
      setLog((l) => [...l, `Gata: ${done} traduceri, ${cost.toFixed(3)} USD.`])
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
      load()
    }
  }

  const ov = data?.overview
  const locales = ov ? Object.keys(NAMES).filter((l) => ov[l]) : []
  const pending = ov ? locales.reduce((n, l) => n + ov[l].none + ov[l]['stale-auto'], 0) : 0

  return (
    <section className="anna-dashboard__card">
      <h3>Traduceri</h3>
      {!ov ? (
        <p>{error ?? 'Se încarcă…'}</p>
      ) : (
        <>
          <p>
            {ov.documents} documente cu texte de tradus. Pe site, un text netradus apare în română. Un text verificat de om
            nu se suprascrie automat.
          </p>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, marginBottom: 12 }}>
            <thead>
              <tr>
                {['Limba', 'Netraduse', 'Traduse automat', 'Verificate de om', 'De retradus', 'De reverificat'].map((h) => (
                  <th key={h} scope="col" style={{ textAlign: 'left', padding: '4px 12px 4px 0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locales.map((l) => (
                <tr key={l}>
                  <th scope="row" style={{ textAlign: 'left', padding: '4px 12px 4px 0' }}>
                    {NAMES[l]}
                  </th>
                  <td>{ov[l].none}</td>
                  <td>{ov[l].auto}</td>
                  <td>{ov[l].verified}</td>
                  <td>{ov[l]['stale-auto']}</td>
                  <td>{ov[l]['stale-verified']}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.available && <p>Traducerea automată nu e pornită pe acest server (lipsește TRANSLATE_API_KEY).</p>}
          {admin && data?.available && (
            <Button buttonStyle="primary" size="small" disabled={running || pending === 0} onClick={() => void runAll()}>
              {running ? 'Se traduce…' : pending ? `Tradu tot site-ul (${pending})` : 'Totul e tradus'}
            </Button>
          )}
          {log.length > 0 && (
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, maxHeight: 220, overflow: 'auto' }} aria-live="polite">
              {log.join('\n')}
            </pre>
          )}
          {error && <p role="alert">{error}</p>}
        </>
      )}
    </section>
  )
}
