// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * D-73: clipul cursului de pizza n-avea sunet nici după reîncărcare. Conversia din browser copiază acum
 * sunetul ca atare (fără decodare și recodare), verifică ce piste a aruncat mediabunny și spune în panou
 * dacă clipul are sunet. Proba în browser (Chromium, sursă VP8 + Opus): sunetul rămâne în H.264 și în AV1,
 * și fără codor audio.
 */

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')
const convert = read('src/components/admin/media/convert.ts')
const control = read('src/components/admin/media/MediaUploadControl.tsx')

describe('D-73 · sunetul clipurilor', () => {
  it('sunetul se copiază, nu se recodează', () => {
    expect(convert).toContain('audio: {},')
    expect(convert).not.toMatch(/audio: \{ (quality|discard)/)
  })
  it('pistele aruncate se verifică; varianta mută se sare dacă principalul are sunet', () => {
    expect(convert).toContain("conversion.discardedTracks.find((d) => d.track.type === 'audio')")
    expect(convert).toContain('efficientCodec = null')
    expect(convert).toMatch(/audio: 'none' \| 'kept' \| 'lost'/)
  })
  it('panoul arată dacă are sunet și avertizează când s-a pierdut', () => {
    expect(control).toContain("'cu sunet'")
    expect(control).toContain('FĂRĂ SUNET (pierdut la conversie)')
    expect(control).toContain("result.audio === 'lost'")
    expect(read('src/collections/Media.ts')).toContain("label: 'Codec și sunet'")
  })
})
