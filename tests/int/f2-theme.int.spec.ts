// @vitest-environment node
import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { contrastRatio } from '@/fields'
import config from '@/payload.config'
import { seedStarterContent } from '@/seed/starter'
import { APPROVED_FONTS, fontFiles } from '@/theme/fonts'
import {
  contrastReport,
  DEFAULT_THEME_COLORS,
  resolveColors,
  themeCssVars,
  themeStyleSheet,
} from '@/theme/theme'

/**
 * F2 după GO (D-41, D-42, D-43): tema pe restaurant.
 * - setul aprobat are 4 fonturi (2 pentru titluri, 2 pentru text) și toate fișierele există în public/fonts;
 * - culorile direcției B (cu butoanele verzi) trec toate cele 5 perechi de contrast;
 * - panoul refuză o culoare care strică o pereche;
 * - conținutul de pornire completează tema și pictograma de filă doar unde câmpurile sunt goale.
 */

let payload: Payload
let tenantId: number

describe('F2 · tema pe restaurant', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'tenants',
      where: { slug: { equals: 'trattoria-da-vittoria' } },
      limit: 1,
    })
    tenantId = (docs[0]?.id ??
      (
        await payload.create({
          collection: 'tenants',
          data: { name: 'Trattoria da Vittoria', slug: 'trattoria-da-vittoria' } as any,
        })
      ).id) as number
  })

  it('Setul aprobat: 4 fonturi, 2 + 2, cu fișierele în public/fonts', () => {
    expect(APPROVED_FONTS.map((f) => f.id)).toEqual([
      'belleza',
      'tenor-sans',
      'hanken-grotesk',
      'host-grotesk',
    ])
    expect(APPROVED_FONTS.filter((f) => f.role === 'heading')).toHaveLength(2)
    for (const font of APPROVED_FONTS) {
      for (const file of fontFiles(font)) {
        expect(fs.existsSync(path.join(process.cwd(), 'public', file.url)), file.url).toBe(true)
      }
    }
  })

  it('Culorile direcției B trec toate perechile la minimum 4,5:1', () => {
    const report = contrastReport(DEFAULT_THEME_COLORS)
    expect(report).toHaveLength(5)
    for (const r of report) expect(r.ratio, r.label).toBeGreaterThanOrEqual(4.5)
    // Textul secundar (70% text peste fundal) rămâne peste prag: #635953 pe hârtie.
    expect(contrastRatio('#635953', DEFAULT_THEME_COLORS.background)).toBeGreaterThanOrEqual(4.5)
  })

  it('Variabilele CSS: valorile lipsă se completează din direcția B', () => {
    const vars = themeCssVars({ colors: { accent2: '#0f4f33' }, fontHeading: 'tenor-sans' })
    expect(vars['--c-accent-2']).toBe('#0F4F33')
    expect(vars['--c-bg']).toBe('#F5EDE0')
    expect(vars['--font-display']).toMatch(/^'Tenor Sans'/)
    expect(vars['--font-text']).toMatch(/^'Hanken Grotesk'/)
    expect(resolveColors({ text: 'roșu' }).text).toBe(DEFAULT_THEME_COLORS.text)
    const css = themeStyleSheet(null)
    expect(css).toContain("font-family:'Belleza'")
    expect(css).toContain('/fonts/hanken-grotesk-latin-ext-600-normal.woff2')
  })

  it('Conținutul de pornire completează tema și pictograma doar unde e gol; panoul refuză un buton ilizibil', async () => {
    await seedStarterContent({ payload })
    const { docs } = await payload.find({
      collection: 'settings',
      where: { tenant: { equals: tenantId } },
      limit: 1,
      depth: 1,
    })
    const s: any = docs[0]
    expect(s.colors).toMatchObject({ surfaceDark: '#1C1416', accent2: '#14613F' })
    expect(s.fontHeading).toBe('belleza')
    expect(s.fontText).toBe('hanken-grotesk')
    expect(s.favicon?.title).toBe('Pictogramă de filă Trattoria')

    // O valoare pusă de Administrator nu se suprascrie la următoarea rulare.
    await payload.update({
      collection: 'settings',
      id: s.id,
      data: { fontText: 'host-grotesk' } as any,
    })
    await seedStarterContent({ payload })
    const again: any = await payload.findByID({ collection: 'settings', id: s.id, depth: 0 })
    expect(again.fontText).toBe('host-grotesk')

    // Verde deschis pe butonul secundar: textul (fundalul) nu se mai citește.
    await expect(
      payload.update({
        collection: 'settings',
        id: s.id,
        data: { colors: { ...again.colors, accent2: '#7BC47F' } } as any,
      }),
    ).rejects.toThrow()
  })
})
