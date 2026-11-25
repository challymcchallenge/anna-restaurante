// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * F5 (auditul de finisare, docs/f5/2026_11_25_Trattoria_Audit_F5.md): corecțiile aplicate.
 */

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')
const css = read('src/app/(frontend)/[lang]/styles.css')

describe('F5 · audit', () => {
  it('coperta pe telefon: treptele umbrei au un minim în pixeli (titlul ≥ 3:1 și pe ecranele scurte)', () => {
    expect(css).toContain('58%, transparent) max(30%, 232px)')
    expect(css).toContain('20%, transparent) max(60%, 463px), transparent max(78%, 602px)')
  })

  it('paginile legale: ~75 de caractere pe rând', () => {
    expect(css).toContain('.legal-text > p, .legal-text > ul, .legal-text > ol { max-width: 31em; }')
  })

  it('saltul la o secțiune de pe Acasă ajunge pe ea, deși secțiunile au content-visibility: auto', () => {
    expect(css).toContain('.paper-section, .cover-section, .site-footer { content-visibility: auto;')
    expect(css).toContain('.cv-all .paper-section, .cv-all .cover-section, .cv-all .site-footer { content-visibility: visible; }')
    const ctrl = read('src/components/site/HeaderController.tsx')
    expect(ctrl).toContain("root.classList.add('cv-all')")
    expect(ctrl).toContain("el.matches('section[id]')")
    // și la deschiderea directă a paginii cu ancoră (de pe altă pagină)
    expect(ctrl).toContain('const initial = sectionTarget(location.hash)')
  })
})
