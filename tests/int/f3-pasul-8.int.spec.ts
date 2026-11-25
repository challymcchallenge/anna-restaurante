// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { galleryVisual, homeLayout, shapeOf } from '@/components/site/Gallery'
import { pageMediaCredits } from '@/lib/site/credits'
import type { SiteData } from '@/lib/site/data'
import { navItems, orderedSections } from '@/lib/site/sections'
import type { Gallery } from '@/payload-types'
import { seedStarterContent } from '@/seed/starter'

/**
 * F3 pasul 8 · Galeria (content-model 4.10, 5.7, S-05, F-30, F-31):
 * - pe Acasă, așezarea fixă umple mereu rândurile întregi, pentru 1–8 elemente, pe 4 și pe 2 coloane;
 * - forma plăcii din /galerie vine din proporții; un clip arată posterul;
 * - conținutul de pornire: 5 elemente din fotografiile provizorii, cu categoria găsită după nume;
 * - creditele foto includ elementele de pe Acasă; secțiunea apare în meniu la /#galerie.
 * Doar pe baza locală (tests/helpers/env.ts refuză producția).
 */

let payload: Payload
let tenantId: number

const SPAN: Record<string, [number, number, number]> = {
  // [coloane pe desktop, coloane pe telefon, rânduri]
  solo: [4, 2, 2],
  big: [2, 2, 2],
  one: [1, 1, 1],
  w2: [2, 2, 1],
  w4: [4, 2, 1],
}

/** Așază plăcile ca `grid-auto-flow: dense` și întoarce numărul de celule goale. */
function holes(tiles: string[], cols: number): number {
  const grid: boolean[][] = []
  const free = (r: number, c: number, w: number, h: number) => {
    for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) if (x >= cols || grid[y]?.[x]) return false
    return true
  }
  for (const t of tiles) {
    const [dc, mc, h] = SPAN[t]
    const w = cols === 4 ? dc : mc
    let placed = false
    for (let r = 0; !placed; r++) {
      for (let c = 0; c + w <= cols && !placed; c++) {
        if (free(r, c, w, h)) {
          for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) (grid[y] ??= [])[x] = true
          placed = true
        }
      }
    }
  }
  let empty = 0
  for (const row of grid) for (let x = 0; x < cols; x++) if (!row?.[x]) empty++
  return empty
}

describe('F3 · pasul 8 · Galerie', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: 'trattoria-da-vittoria' } }, limit: 1 })
    tenantId = (docs[0]?.id ??
      (await payload.create({ collection: 'tenants', data: { name: 'Trattoria da Vittoria', slug: 'trattoria-da-vittoria' } as never })).id) as number
    await seedStarterContent({ payload })
  })

  it('Acasă: așezarea fixă umple rândurile întregi pentru 1–8 elemente, pe 4 și pe 2 coloane', () => {
    for (let n = 1; n <= 8; n++) {
      const tiles = homeLayout(n)
      expect(tiles).toHaveLength(n)
      expect([n, holes(tiles, 4)]).toEqual([n, 0])
      expect([n, holes(tiles, 2)]).toEqual([n, 0])
    }
    expect(homeLayout(12)).toHaveLength(8)
  })

  it('Forma plăcii din proporții; un clip arată posterul', () => {
    expect(shapeOf({ width: 1920, height: 1280 })).toBe('wide')
    expect(shapeOf({ width: 800, height: 1000 })).toBe('tall')
    expect(shapeOf({ width: 1200, height: 1100 })).toBe('square')
    const poster = { id: 2, url: '/p.webp', width: 1920, height: 1080 }
    const clip = { id: 1, url: '/c.mp4', kind: 'clip', poster }
    expect(galleryVisual({ file: clip } as unknown as Gallery)).toEqual({ image: poster, clip })
    const photo = { id: 3, url: '/f.webp', kind: 'photo' }
    expect(galleryVisual({ file: photo } as unknown as Gallery)).toEqual({ image: photo, clip: null })
  })

  it('D-66: elementele demo ale galeriei au fost scoase; galeria goală nu apare', async () => {
    const { docs } = await payload.find({ collection: 'gallery', where: { tenant: { equals: tenantId } }, depth: 1, limit: 50 })
    expect(docs.filter((d) => d.placeholder)).toHaveLength(0)
    expect(docs.some((d) => typeof d.file === 'object' && /Wikimedia/.test(String(d.file?.credit ?? '')))).toBe(false)
    const gallery = readFileSync(join(process.cwd(), 'src/components/site/Gallery.tsx'), 'utf8')
    expect(gallery).toContain('if (!site.galleryCount) return null')
    const header = readFileSync(join(process.cwd(), 'src/components/site/SiteHeader.tsx'), 'utf8')
    expect(header).toContain("hidden: site.galleryCount ? [] : ['gallery', 'galerie', 'pageGallery']")
  })

  it('Creditele foto și meniul', () => {
    const photo = (credit: string) => ({ id: credit, url: '/x.webp', kind: 'photo', credit }) as never
    const site = {
      home: { gallery: { enabled: true, order: 10, menuLabel: 'Galerie' } },
      dishCategories: [],
      wines: [],
      eventsUpcoming: [],
      salons: [],
      roomTypes: [],
      galleryHome: [{ file: photo('A, CC0') }, { file: photo('A, CC0') }, { file: photo('B, CC BY 2.0') }],
    } as unknown as SiteData
    expect(pageMediaCredits(site)).toEqual(['A, CC0', 'B, CC BY 2.0'])
    expect(orderedSections(site.home).map((s) => s.key)).toEqual(['gallery'])
    expect(navItems(site.home).map((i) => i.href)).toEqual(['/#galerie'])
  })
})
