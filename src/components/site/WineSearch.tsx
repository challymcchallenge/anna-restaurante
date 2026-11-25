'use client'

import React, { useEffect, useState } from 'react'

import { clientUI } from '@/lib/site/i18n/client'

import { Icon } from './Icons'

const norm = (v: string) =>
  v
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

/**
 * Căutarea din /catalog-vinuri (wireframe S-23, S-23b): ascunde rândurile care nu se potrivesc,
 * apoi regiunile și tipurile rămase goale. Lista e randată pe server; fără JavaScript se vede toată.
 * Rezultatul se anunță cititoarelor de ecran; fără rezultat apare o singură ieșire: „Vezi toate vinurile”.
 */
export function WineSearch({ boardId, locale }: { boardId: string; locale: string }) {
  const UI = clientUI(locale)
  const [query, setQuery] = useState('')
  const [found, setFound] = useState<number | null>(null)

  useEffect(() => {
    const board = document.getElementById(boardId)
    if (!board) return
    const terms = norm(query).split(/\s+/).filter(Boolean)
    const apply = () => {
      const type = board.querySelector<HTMLInputElement>('.chip-filter input:checked')?.value ?? 'all'
      let visible = 0
      board.querySelectorAll<HTMLElement>('.wine-group').forEach((group) => {
        let inGroup = 0
        group.querySelectorAll<HTMLElement>('.wine-origin').forEach((origin) => {
          let inOrigin = 0
          origin.querySelectorAll<HTMLElement>('[data-q]').forEach((row) => {
            const ok = terms.every((t) => (row.dataset.q ?? '').includes(t))
            row.hidden = !ok
            if (ok) inOrigin++
          })
          origin.hidden = inOrigin === 0
          inGroup += inOrigin
        })
        group.hidden = inGroup === 0
        // „La pahar” repetă vinuri din listă: nu intră în numărătoare.
        if (group.dataset.type !== 'glass' && (type === 'all' || group.dataset.type === type)) visible += inGroup
      })
      setFound(terms.length ? visible : null)
    }
    apply()
    board.addEventListener('change', apply)
    return () => board.removeEventListener('change', apply)
  }, [query, boardId])

  const reset = () => {
    const all = document.getElementById(boardId)?.querySelector<HTMLInputElement>('.chip-filter input[value="all"]')
    if (all) {
      all.checked = true
      all.dispatchEvent(new Event('change', { bubbles: true }))
    }
    setQuery('')
  }

  return (
    <>
      <div className="wine-search">
        <label htmlFor={`${boardId}-cauta`} className="sr-only">
          {UI.wineSearch}
        </label>
        <Icon name="search" />
        <input
          id={`${boardId}-cauta`}
          type="search"
          value={query}
          placeholder={UI.wineSearchShort}
          autoComplete="off"
          enterKeyHint="search"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <p className="sr-only" role="status">
        {found != null && found > 0 ? UI.wineCount(found) : ''}
      </p>
      {found === 0 && (
        <div className="wine-empty" role="status">
          <p className="wine-empty-title">{UI.wineNoResults(query.trim())}</p>
          <p>{UI.wineNoResultsHint}</p>
          <button type="button" className="btn btn-secondary" onClick={reset}>
            {UI.wineClear}
          </button>
        </div>
      )}
    </>
  )
}
