// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * D-74: în panou, „Text complet (pagina cursului)” dădea „Lexical error #17 … heading”: seed-ul (D-54)
 * scrisese în el un subtitlu („### Cum îl înscrii”), dar editorul câmpului nu avea titluri.
 * Regula: orice text din seed cu titluri (`#`, `##`, `###` …) intră doar într-un câmp care are titluri.
 */

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')
const hasHeading = (md: string) => /(^|\n)#{1,6} /.test(md)

/** Câmpurile rich text care au titluri în editor (`headings: true`), după sursa colecțiilor. */
const HEADINGS = new Set(['home-page.pizza.fullText', 'legal-pages.content'])

describe('D-74 · titlurile din textele seed-ului', () => {
  it('câmpurile cu titluri au editorul configurat pentru titluri', () => {
    expect(read('src/collections/HomePage.ts')).toMatch(/name: 'fullText'[^\n]*headings: true/)
    expect(read('src/collections/Catalog.ts')).toMatch(/name: 'content'[^\n]*headings: true/)
  })

  it('niciun text cu titluri din seed nu ajunge într-un câmp fără titluri', () => {
    const seed = JSON.parse(read('seed/trattoria-da-vittoria.json'))
    const bad: string[] = []
    if (hasHeading(seed.homePage?.pizza?.fullText?.$richText ?? '') && !HEADINGS.has('home-page.pizza.fullText')) bad.push('homePage.pizza.fullText')
    for (const s of seed.swaps ?? []) {
      const md = s.to?.$richText
      if (typeof md !== 'string' || !hasHeading(md)) continue
      const key = `${s.collection}.${s.field}`
      if (!HEADINGS.has(key)) bad.push(key)
    }
    for (const c of seed.collections?.['legal-pages'] ?? []) if (hasHeading(c.content?.$richText ?? '') && !HEADINGS.has('legal-pages.content')) bad.push('legal-pages.content')
    expect(bad).toEqual([])
  })
})
