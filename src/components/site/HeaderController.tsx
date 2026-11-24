'use client'

import { useEffect } from 'react'

/**
 * Comportamentul antetului, fără să-l randeze (markup-ul rămâne pe server):
 * - butoanele `[data-nav-open]` deschid panoul de navigare (`<dialog>` nativ: focus în panou,
 *   Esc închide, restul paginii inert); un link din panou îl închide;
 * - pe desktop, după primul ecran, antetul rămâne sus, compact, ca „Rezervă o masă” să fie
 *   mereu la un gest distanță (PRODUCT.md, principiul 1). Pe telefon face asta bara de jos.
 */
export function HeaderController() {
  useEffect(() => {
    const panel = document.getElementById('nav-panel') as HTMLDialogElement | null
    const header = document.querySelector<HTMLElement>('[data-header]')
    const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-open]'))
    const setExpanded = (v: boolean) =>
      triggers.forEach((t) => t.setAttribute('aria-expanded', String(v)))

    const onClick = (event: MouseEvent) => {
      const el = event.target as Element | null
      if (!panel || !el) return
      if (el.closest('[data-nav-open]')) {
        panel.showModal()
        setExpanded(true)
      } else if (el.closest('[data-nav-close]')) {
        panel.close()
      }
    }
    const onClose = () => setExpanded(false)
    document.addEventListener('click', onClick)
    panel?.addEventListener('close', onClose)

    // Antetul compact: apare după ce hero-ul a ieșit din ecran.
    const hero = document.querySelector('[data-hero]')
    let observer: IntersectionObserver | null = null
    if (header && hero && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          header.dataset.stuck = String(!entry.isIntersecting)
        },
        { rootMargin: '-120px 0px 0px 0px' },
      )
      observer.observe(hero)
    }

    return () => {
      document.removeEventListener('click', onClick)
      panel?.removeEventListener('close', onClose)
      observer?.disconnect()
    }
  }, [])
  return null
}
