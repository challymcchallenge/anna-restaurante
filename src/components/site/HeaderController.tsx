'use client'

import { useEffect } from 'react'

/**
 * Comportamentul antetului, fără să-l randeze (markup-ul rămâne pe server):
 * - butoanele `[data-nav-open]` deschid panoul de navigare (`<dialog>` nativ: focus în panou,
 *   Esc închide, restul paginii inert); un link din panou îl închide;
 * - antetul e transparent cât pagina stă sus, cu logo-ul mare; la primul scroll devine plin,
 *   cu logo-ul mai mic, și rămâne sus (D-60), ca „Rezervă o masă” să fie la un gest distanță;
 * - F5: saltul la o secțiune de pe Acasă (`/#galerie`) ajunge exact pe ea (vezi `goToSection`).
 */

/**
 * F5 (audit, proba pe telefon): secțiunile au `content-visibility: auto` cu o înălțime estimată de
 * 900 px. La un salt spre o ancoră, browserul calcula poziția cu estimările, iar secțiunile reale
 * (mai înalte pe telefon) împingeau ținta cu 600–2.000 px sub ecran. Aici secțiunile se așază o clipă
 * cu înălțimea reală (`.cv-all`), derularea merge la țintă, apoi optimizarea revine: mărimea reținută
 * (`contain-intrinsic-size: auto`) ține pagina pe loc.
 */
function goToSection(target: HTMLElement, smooth: boolean) {
  const root = document.documentElement
  root.classList.add('cv-all')
  void target.getBoundingClientRect()
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' })
  window.setTimeout(() => root.classList.remove('cv-all'), 400)
}

/** Ținta unei ancore de secțiune (`<section id>`) de pe pagina curentă, altfel nimic. */
function sectionTarget(hash: string): HTMLElement | null {
  if (!hash || hash === '#') return null
  const el = document.getElementById(decodeURIComponent(hash.slice(1)))
  return el && el.matches('section[id]') ? el : null
}

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
      // Link spre o secțiune a paginii curente (de exemplu „Galerie” din meniu, pe Acasă).
      const link = el.closest('a[href]') as HTMLAnchorElement | null
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (link.target && link.target !== '_self') return
      const url = new URL(link.href, location.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return
      const target = sectionTarget(url.hash)
      if (!target) return
      event.preventDefault()
      if (location.hash !== url.hash) history.pushState(null, '', url.hash)
      goToSection(target, !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
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

    // Pagina deschisă direct cu ancoră (de exemplu din meniu, de pe /galerie spre /#galerie).
    const initial = sectionTarget(location.hash)
    if (initial) window.requestAnimationFrame(() => goToSection(initial, false))

    return () => {
      document.removeEventListener('click', onClick)
      panel?.removeEventListener('close', onClose)
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
