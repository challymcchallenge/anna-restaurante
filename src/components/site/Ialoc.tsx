'use client'

import { useEffect } from 'react'

/**
 * Rezervarea de masă prin fereastra ialoc (D-03, ADR-008, docs/spikes/ialoc.md).
 *
 * - Scriptul ialoc NU se încarcă odată cu pagina (0 cereri către ialoc înainte de clic, F0).
 * - La primul clic pe un buton `[data-ialoc]`: se încarcă fragmentul oficial, se inițializează în
 *   modul popup cu `selector` pe toate butoanele, apoi clicul se retransmite (soluția probată în F0).
 * - Dacă ialoc nu răspunde în 6 s sau scriptul nu se încarcă: butoanele devin „Sună pentru
 *   rezervare”, cu telefonul de rezervări din panou (D-17).
 *
 * ID-ul localului și limba vin din Setări (nimic specific unui restaurant în cod).
 */

declare global {
  interface Window {
    ialocEmbedWidget?: { init: (o: Record<string, unknown>) => void; _q?: unknown[] }
    __ialocEmbedWidgetLoaded?: boolean
  }
}

const SELECTOR = '[data-ialoc]'
const TIMEOUT_MS = 6000

let loading: Promise<void> | null = null

function load(venueId: string, locale: string): Promise<void> {
  if (loading) return loading
  loading = new Promise((resolve, reject) => {
    const w = window as unknown as Record<string, any>
    // Fragmentul oficial ialoc (v2.ialoc.ro/widget-setup), rescris lizibil: coadă de comenzi + script async.
    if (!w.ialocEmbedWidget) {
      const queue: { _q: unknown[]; [k: string]: unknown } = { _q: [] }
      for (const method of ['init', 'show', 'hide']) {
        queue[method] = (...args: unknown[]) => queue._q.push([method, args])
      }
      w.ialocEmbedWidget = queue
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://widget.ialoc.ro/embed.js'
      script.onerror = () => reject(new Error('embed.js nu s-a încărcat'))
      document.head.appendChild(script)
    }
    const timer = window.setTimeout(() => reject(new Error('ialoc nu a răspuns')), TIMEOUT_MS)
    w.ialocEmbedWidget.init({
      venueId,
      source: 'ialoc-widget-embed',
      locale: locale === 'ro' ? 'ro' : 'en',
      embedMode: 'popup',
      selector: SELECTOR,
    })
    const check = window.setInterval(() => {
      if (window.__ialocEmbedWidgetLoaded) {
        window.clearInterval(check)
        window.clearTimeout(timer)
        resolve()
      }
    }, 25)
  })
  return loading
}

export function IalocLoader({ venueId, locale }: { venueId: string; locale: string }) {
  useEffect(() => {
    let ready = false
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(SELECTOR)
      if (!target || ready) return
      event.preventDefault()
      target.setAttribute('aria-busy', 'true')
      load(venueId, locale).then(
        () => {
          ready = true
          target.removeAttribute('aria-busy')
          target.click()
        },
        () => {
          target.removeAttribute('aria-busy')
          // Rezerva: butoanele ascunse, linkurile „Sună pentru rezervare” vizibile (CSS).
          document.documentElement.dataset.ialoc = 'failed'
          const fallback = target.nextElementSibling
          if (fallback instanceof HTMLElement && fallback.classList.contains('ialoc-fallback')) {
            fallback.focus()
          }
        },
      )
    }
    // G4-1 (D-47): ialoc citește data din adresa paginii (`?defaultDate=`) chiar în momentul clicului
    // și o păstrează pentru clicurile următoare. Înaintea lui (faza de captură), punem data butonului
    // (sau nimic, pentru „Rezervă o masă”) și refacem adresa imediat după.
    const onCapture = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(SELECTOR)
      if (!target) return
      const original = window.location.href
      const url = new URL(original)
      url.searchParams.set('defaultDate', target.dataset.ialocDate ?? '')
      window.history.replaceState(window.history.state, '', url)
      window.setTimeout(() => window.history.replaceState(window.history.state, '', original), 0)
    }
    document.addEventListener('click', onCapture, true)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onCapture, true)
      document.removeEventListener('click', onClick)
    }
  }, [venueId, locale])
  return null
}
