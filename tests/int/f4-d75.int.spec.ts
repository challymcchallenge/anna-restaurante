// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { importTokenOk, pickMediaData } from '@/lib/media-import/endpoint'

/**
 * D-75: adresa de import temporară. Fără `MEDIA_IMPORT_TOKEN` (sau cu unul scurt) e oprită; codul greșit
 * e refuzat; se pot crea doar tipurile de fișiere permise, cu un titlu intern (cheia de reluare).
 */

const GOOD = 'a'.repeat(20) + 'B'.repeat(20)

describe('D-75 · adresa de import', () => {
  it('codul: oprit fără valoare sau sub 32 de caractere; doar valoarea exactă trece', () => {
    expect(importTokenOk(GOOD, undefined)).toBe(false)
    expect(importTokenOk('scurt', 'scurt')).toBe(false)
    expect(importTokenOk(null, GOOD)).toBe(false)
    expect(importTokenOk(GOOD + 'x', GOOD)).toBe(false)
    expect(importTokenOk(GOOD, GOOD)).toBe(true)
  })

  it('datele: doar câmpurile și tipurile permise, cu titlu intern', () => {
    expect(pickMediaData({ kind: 'logo', title: 'x' })).toMatch(/Tip nepermis/)
    expect(pickMediaData({ kind: 'photo' })).toMatch(/titlul intern/)
    const ok = pickMediaData({ kind: 'photo', title: 'Galerie · Restaurant · C1', alt: 'Salonul', tenant: 99, filename: 'x', hasChildren: true }) as Record<string, unknown>
    expect(ok).toEqual({ kind: 'photo', title: 'Galerie · Restaurant · C1', alt: 'Salonul', hasChildren: true })
  })
})
