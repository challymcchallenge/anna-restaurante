// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { Media } from '@/collections/Media'

/**
 * Cerut de Alin (25.11.2026, D-81): miniaturile din panou de 3 ori mai mari, ca fotografiile să se
 * recunoască la alegere. Lista Bibliotecii media și fereastra „Alegeți dintre cele existente”:
 * 40 × 40 → 160 × 120 px; fotografia aleasă: 40 → 160 × 120 px; câmpurile cu mai multe fotografii:
 * 25–26 → 100 × 75 px. Sursa miniaturii rămâne varianta WebP de 640 px.
 */
const scss = readFileSync(join(process.cwd(), 'src/app/(payload)/custom.scss'), 'utf8')

describe('D-81 · miniaturile din panou', () => {
  it('mărimile noi, pe clasele Payload 3.94.1 (fișier în listă, câmp cu una sau mai multe fotografii)', () => {
    expect(scss).toContain('--media-thumb-w: 160px;')
    expect(scss).toContain('--media-thumb-h: 120px;')
    expect(scss).toContain('--media-thumb-sm-w: 100px;')
    expect(scss).toContain('--media-thumb-sm-h: 75px;')
    expect(scss).toMatch(/\.file__thumbnail \{\s*width: var\(--media-thumb-w\);/)
    expect(scss).toContain('.upload-field-card--size-medium .thumbnail {')
    expect(scss).toContain('.upload--has-many__dragItem .thumbnail {')
  })

  it('miniatura vine din varianta de 640 px, deci rămâne clară la 160 px', () => {
    const thumb = (Media.upload as { adminThumbnail: (a: { doc: unknown }) => string | null }).adminThumbnail
    expect(thumb({ doc: { mimeType: 'image/jpeg', url: '/o.jpg', sizes: { webp640: { url: '/v640.webp' } } } })).toBe('/v640.webp')
  })
})
