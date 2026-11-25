// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * D-76 (G12-1, Alin: „cadrele se schimbă și atunci, fără estompare, cu butonul de pauză”): slideshow-ul
 * copertei se derulează și cu `prefers-reduced-motion` sau economie de date. Clipul tot nu pornește singur.
 */

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')
const motion = read('src/components/site/HeroMotion.tsx')
const css = read('src/app/(frontend)/[lang]/styles.css')

describe('D-76 · slideshow-ul pentru toți vizitatorii', () => {
  it('cadrele se încarcă și se derulează fără condiția de mișcare permisă', () => {
    expect(motion).toContain('if (video || frames < 2) return')
    expect(motion).toContain('if (video || frames < 2 || paused) return')
  })
  it('clipul rămâne oprit fără mișcare permisă; butonul de pauză apare cât se derulează slideshow-ul', () => {
    expect(motion).toContain('if (!allowed || !video) return')
    expect(motion).toContain('const moving = (allowed && Boolean(sources)) || (!video && frames > 1)')
  })
  it('cu prefers-reduced-motion, tranzițiile sunt oprite (schimbarea e instant)', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\*, \*::before, \*::after \{ animation: none !important; transition: none !important;/)
  })
})
