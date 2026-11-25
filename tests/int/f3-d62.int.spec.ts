// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Field } from 'payload'
import { describe, expect, it } from 'vitest'

import { Settings } from '@/collections/Settings'

/**
 * D-62: formele decorative și valurile dintre secțiuni. Fișierele din CSS există, culoarea vine din
 * temă (nu e scrisă în SVG), iar comutatoarele din Setări pornesc „pe” și „Discret”.
 */

const root = process.cwd()
const css = readFileSync(join(root, 'src/app/(frontend)/styles.css'), 'utf8')

type Node = { name?: string; type?: string; fields?: Field[]; tabs?: { fields: Field[] }[]; [k: string]: unknown }

function findField(fields: Field[], name: string): Node | null {
  for (const f of fields as unknown as Node[]) {
    if (f.name === name) return f
    for (const inner of [f.fields, ...(f.tabs ?? []).map((t) => t.fields)]) {
      if (Array.isArray(inner)) {
        const hit = findField(inner, name)
        if (hit) return hit
      }
    }
  }
  return null
}

describe('D-62 · forme decorative și valuri', () => {
  it('Fiecare fișier din CSS există în public/decor și e o mască (doar negru)', () => {
    const urls = [...new Set([...css.matchAll(/url\(\/decor\/([a-z-]+\.svg)\)/g)].map((m) => m[1]))]
    expect(urls.length).toBeGreaterThanOrEqual(14)
    for (const file of urls) {
      const path = join(root, 'public/decor', file)
      expect(existsSync(path), file).toBe(true)
      const svg = readFileSync(path, 'utf8')
      const colors = [...svg.matchAll(/(?:fill|stroke)="(#[0-9a-fA-F]{3,6})"/g)].map((m) => m[1].toLowerCase())
      expect(colors.every((c) => c === '#000'), file).toBe(true)
    }
  })

  it('Fiecare secțiune de pe Acasă are motivul ei', () => {
    for (const cls of ['kitchen', 'wines', 'reviews', 'parties', 'private', 'pizza', 'hotel', 'gallery', 'contact-home', 'faq']) {
      expect(css, cls).toMatch(new RegExp(`\\.${cls}[ ,][^{]*\\{ --decor: url\\(/decor/`))
    }
  })

  it('Comutatoarele din Setări: forme și valuri pornite, intensitatea „Discret”', () => {
    expect(findField(Settings.fields, 'decorShapes')).toMatchObject({ type: 'checkbox', defaultValue: true })
    expect(findField(Settings.fields, 'decorWaves')).toMatchObject({ type: 'checkbox', defaultValue: true })
    const level = findField(Settings.fields, 'decorLevel') as { defaultValue: string; options: { value: string }[] }
    expect(level.defaultValue).toBe('subtle')
    expect(level.options.map((o) => o.value)).toEqual(['subtle', 'medium', 'visible'])
  })

  it('Fără liniile de contur (scoase la cererea lui Alin)', () => {
    expect(css).not.toContain('contour.svg')
    expect(existsSync(join(root, 'public/decor/contour.svg'))).toBe(false)
  })

  it('Fără decor în modul de contrast forțat și la tipărire', () => {
    expect(css).toMatch(/@media \(forced-colors: active\), print \{[^}]*display: none/)
  })
})
