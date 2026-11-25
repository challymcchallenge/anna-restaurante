// @vitest-environment node
import type { Field, UploadField } from 'payload'
import { describe, expect, it } from 'vitest'

import { HomePage } from '@/collections/HomePage'
import { CLIP_MAX_SECONDS, HERO_CLIP_MAX_SECONDS } from '@/collections/Media'
import { media } from '@/fields'

/**
 * D-61: clipurile urcă până la 120 s, dar coperta de pe Acasă primește doar clipuri de cel mult
 * 30 s (ca pagina principală să se încarce repede). Fără bază de date: câmpul se verifică direct.
 */

function findFields(fields: Field[], name: string, out: UploadField[] = []): UploadField[] {
  for (const f of fields as any[]) {
    if (f.name === name && f.type === 'upload') out.push(f)
    if (Array.isArray(f.fields)) findFields(f.fields, name, out)
    if (Array.isArray(f.tabs)) for (const t of f.tabs) findFields(t.fields, name, out)
  }
  return out
}

/** Un `req` minimal: `findByID` întoarce clipul cu durata dată. */
const reqWith = (durationSeconds: number, kind = 'clip') => ({
  req: {
    payload: { collections: {}, db: { defaultIDType: 'number' }, findByID: async () => ({ id: 7, kind, durationSeconds }) },
    t: (k: string) => k,
  },
  relationTo: 'media',
  required: false,
})

describe('D-61 · clipuri de până la 120 s, coperta Acasă doar până la 30 s', () => {
  it('Limitele: 120 s pentru orice clip, 30 s pentru copertă', () => {
    expect(CLIP_MAX_SECONDS).toBe(120)
    expect(HERO_CLIP_MAX_SECONDS).toBe(30)
  })

  it('Coperta (video desktop și telefon) arată în listă doar clipurile de cel mult 30 s', () => {
    for (const name of ['videoDesktop', 'videoMobile']) {
      const [field] = findFields(HomePage.fields, name)
      expect(field, name).toBeTruthy()
      expect(JSON.stringify(field.filterOptions)).toContain('"durationSeconds":{"less_than_equal":30.5}')
    }
  })

  it('Câmpul cu limită respinge un clip de 90 s și primește unul de 25 s sau o fotografie', async () => {
    const field = media({ name: 'v', label: 'V', kinds: ['clip'], maxClipSeconds: 30 })
    const validate = field.validate as (v: unknown, a: unknown) => Promise<true | string>
    expect(await validate(7, reqWith(90))).toMatch(/cel mult 30 s \(acesta are 90 s\)/)
    expect(await validate(7, reqWith(25))).toBe(true)
    expect(await validate(7, reqWith(0, 'photo'))).toBe(true)
  })

  it('Fără limită proprie (galerie, pagini), câmpul primește un clip de 120 s', async () => {
    const field = media({ name: 'g', label: 'G', kinds: ['photo', 'clip'], hasMany: true })
    const validate = field.validate as (v: unknown, a: unknown) => Promise<true | string>
    expect(await validate([7], reqWith(120))).toBe(true)
    expect(JSON.stringify(field.filterOptions)).not.toContain('durationSeconds')
  })
})
