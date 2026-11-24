'use client'

import { useEffect } from 'react'

/**
 * Comportamentul antetului, fără să-l randeze (markup-ul rămâne pe server):
 * - butoanele `[data-nav-open]` deschid panoul de navigare (`<dialog>` nativ: focus în panou,
 *   Esc închide, restul paginii inert); un link din panou îl închide;
 * - antetul e transparent cât pagina stă sus, cu logo-ul mare; la primul scroll devine plin,
 *   cu logo-ul mai mic, și rămâne sus (D-60), ca „Rezervă o masă” să fie la un gest distanță.
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

    // Antetul plin: de la primii pixeli de scroll, pe orice pagină (D-60).
    let frame = 0
    const update = () => {
      frame = 0
      if (header) header.dataset.stuck = String(window.scrollY > 8)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      document.removeEventListener('click', onClick)
      panel?.removeEventListener('close', onClose)
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
