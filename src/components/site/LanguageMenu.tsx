'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import { localePath, stripLocale } from '@/lib/locales'

/**
 * Selectorul de limbă (F4, D-64): codul limbii curente și, la deschidere, lista limbilor pornite din
 * panou, fiecare cu adresa aceleiași pagini în limba ei. `<details>` funcționează și fără JavaScript;
 * linkurile sunt `<a>` simple, pentru că fiecare limbă are layoutul ei (`<html lang>`).
 */
export function LanguageMenu({
  current,
  locales,
  label,
  currentLabel,
  className = 'lang',
}: {
  current: string
  locales: { code: string; label: string }[]
  /** „Alege limba”, în limba paginii */
  label: string
  /** „Limba: Română”, pentru cititoarele de ecran */
  currentLabel: string
  className?: string
}) {
  const path = stripLocale(usePathname() || '/')
  if (locales.length < 2) {
    return (
      <span className={className}>
        <span aria-hidden="true">{current.toUpperCase()}</span>
        <span className="sr-only">{currentLabel}</span>
      </span>
    )
  }
  return (
    <details className={`${className} lang-menu`}>
      <summary title={label}>
        <span aria-hidden="true">{current.toUpperCase()}</span>
        <span className="sr-only">
          {currentLabel}. {label}
        </span>
      </summary>
      <ul>
        {locales.map((l) => (
          <li key={l.code}>
            <a
              href={localePath(l.code, path)}
              hrefLang={l.code}
              lang={l.code}
              aria-current={l.code === current ? 'true' : undefined}
            >
              <span className="lang-code" aria-hidden="true">
                {l.code.toUpperCase()}
              </span>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
