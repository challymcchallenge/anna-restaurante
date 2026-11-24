'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { UI } from '@/lib/site/strings'

import { Icon } from './Icons'

type Slide = {
  id: string
  avif?: string
  webp?: string
  src: string
  width?: number
  height?: number
  alt: string
  caption: string
  category: string
  video: { src: string; type: string }[] | null
}

const read = (a: HTMLAnchorElement): Slide => {
  const d = a.dataset
  return {
    id: a.closest('li')?.id ?? '',
    avif: d.avif,
    webp: d.webp,
    src: d.src ?? a.href,
    width: d.w ? Number(d.w) : undefined,
    height: d.h ? Number(d.h) : undefined,
    alt: d.alt ?? '',
    caption: d.caption ?? '',
    category: d.category ?? '',
    video: d.video ? (JSON.parse(d.video) as Slide['video']) : null,
  }
}

/**
 * Fotografia mare și clipul la click (F-31), pe /galerie. Un `<dialog>` nativ: focusul intră în
 * fereastră, Esc închide, restul paginii devine inert; la închidere focusul revine pe placa apăsată.
 * Săgețile și glisarea trec la elementul vecin, doar printre cele vizibile cu filtrul ales.
 * Adresa primește `#g-<id>`, așa că o fotografie de pe Acasă se deschide direct aici.
 * Fără JavaScript, plăcile rămân linkuri spre fișierul mare.
 */
export function GalleryLightbox({ boardId }: { boardId: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLAnchorElement | null>(null)
  const links = useRef<HTMLAnchorElement[]>([])
  const touchX = useRef<number | null>(null)
  const [index, setIndex] = useState(-1)
  const [slide, setSlide] = useState<Slide | null>(null)
  const [count, setCount] = useState(0)

  const show = useCallback((i: number) => {
    const list = links.current
    if (!list.length) return
    const n = (i + list.length) % list.length
    setIndex(n)
    setSlide(read(list[n]))
    const id = list[n].closest('li')?.id
    if (id) history.replaceState(null, '', `#${id}`)
  }, [])

  useEffect(() => {
    const board = document.getElementById(boardId)
    if (!board) return
    const visible = () =>
      Array.from(board.querySelectorAll<HTMLAnchorElement>('a.gal-link')).filter((a) => a.offsetParent !== null)
    const open = (a: HTMLAnchorElement) => {
      links.current = visible()
      setCount(links.current.length)
      opener.current = a
      const i = links.current.indexOf(a)
      show(i < 0 ? 0 : i)
      if (!dialog.current?.open) dialog.current?.showModal()
    }
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const a = (event.target as Element | null)?.closest<HTMLAnchorElement>('a.gal-link')
      if (!a || !board.contains(a)) return
      event.preventDefault()
      open(a)
    }
    board.addEventListener('click', onClick)
    // O fotografie aleasă pe Acasă (/galerie#g-12) se deschide direct.
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null
    const linked = target?.querySelector<HTMLAnchorElement>('a.gal-link')
    if (linked) open(linked)
    return () => board.removeEventListener('click', onClick)
  }, [boardId, show])

  const onClose = () => {
    setSlide(null)
    setIndex(-1)
    history.replaceState(null, '', location.pathname + location.search)
    // Focusul revine pe placa ultimei fotografii văzute (sau pe cea apăsată).
    ;(links.current[index] ?? opener.current)?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') show(index + 1)
    else if (event.key === 'ArrowLeft') show(index - 1)
  }

  const many = count > 1

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={UI.galleryDialog}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current
        const end = e.changedTouches[0]?.clientX
        touchX.current = null
        if (start == null || end == null || Math.abs(end - start) < 48) return
        show(end < start ? index + 1 : index - 1)
      }}
    >
      {slide && (
        <figure className="lightbox-figure">
          <div className="lightbox-media">
            {slide.video ? (
              <video key={slide.id} controls autoPlay playsInline poster={slide.src}>
                {slide.video.map((v) => (
                  <source key={v.src} src={v.src} type={v.type} />
                ))}
              </video>
            ) : (
              <picture key={slide.id}>
                {slide.avif && <source type="image/avif" srcSet={slide.avif} sizes="100vw" />}
                {slide.webp && <source type="image/webp" srcSet={slide.webp} sizes="100vw" />}
                <img src={slide.src} width={slide.width} height={slide.height} alt={slide.alt} decoding="async" />
              </picture>
            )}
          </div>
          <figcaption className="lightbox-caption">
            <span>
              {slide.caption}
              {slide.caption && slide.category ? ' · ' : ''}
              {slide.category}
            </span>
            {many && <span className="lightbox-count">{UI.galleryCount(index + 1, count)}</span>}
          </figcaption>
        </figure>
      )}
      <form method="dialog" className="lightbox-close">
        <button type="submit" className="icon-btn" aria-label={UI.close}>
          <Icon name="x" />
        </button>
      </form>
      {many && (
        <>
          <button type="button" className="icon-btn lightbox-prev" aria-label={UI.prev} onClick={() => show(index - 1)}>
            <Icon name="chevron-left" />
          </button>
          <button type="button" className="icon-btn lightbox-next" aria-label={UI.next} onClick={() => show(index + 1)}>
            <Icon name="chevron-right" />
          </button>
        </>
      )}
    </dialog>
  )
}
