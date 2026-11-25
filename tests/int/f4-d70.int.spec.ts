// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { DICTS } from '@/lib/site/i18n'

/**
 * D-70: (1) pe telefon, umbra de jos a copertei e mai ușoară, ca fotografia să se vadă; desktopul
 * rămâne neschimbat. (2) Bara fixă de jos are doar „Rezervă o masă” și „Meniu”.
 */

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')
const css = read('src/app/(frontend)/[lang]/styles.css')

describe('D-70 · coperta pe telefon', () => {
  it('gradientul de jos pornește de la 72% (nu 96%) și se termină la 78% din înălțime', () => {
    expect(css).toContain(
      'linear-gradient(0deg, color-mix(in srgb, var(--c-dark) 72%, transparent) 0%, color-mix(in srgb, var(--c-dark) 58%, transparent) 30%, color-mix(in srgb, var(--c-dark) 20%, transparent) 60%, transparent 78%);',
    )
    expect(css).not.toContain('var(--c-dark) 96%, transparent) 0%, color-mix(in srgb, var(--c-dark) 90%, transparent) 42%')
  })

  it('textul are umbră fină doar pe telefon; desktopul își păstrează gradientul', () => {
    expect(css).toMatch(/@media \(max-width: 1023px\) \{\s*\/\*[^*]*\*\/\s*\.hero h1, \.hero-sub \{ text-shadow:/)
    expect(css).toContain('linear-gradient(90deg, color-mix(in srgb, var(--c-dark) 95%, transparent) 0%')
  })
})

describe('D-70 · bara de jos', () => {
  it('doar Rezervă o masă și Meniu, în coloane egale', () => {
    const footer = read('src/components/site/SiteFooter.tsx')
    const bar = footer.slice(footer.indexOf('export function PhoneBar'))
    expect(bar).toContain('<BookButton')
    expect(bar).toContain('<Icon name="book" />')
    expect(bar).not.toContain('name="phone"')
    expect(css).toContain('grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr);')
  })

  it('eticheta „Sună” a ieșit din toate cele 7 limbi', () => {
    for (const d of Object.values(DICTS)) expect('call' in d).toBe(false)
  })
})
