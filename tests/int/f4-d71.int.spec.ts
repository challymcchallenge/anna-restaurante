// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { HomePage } from '@/collections/HomePage'
import { LOCALE_CODES } from '@/lib/locales'
import { clientUI } from '@/lib/site/i18n/client'

/**
 * D-71: (1) slideshow-ul copertei schimbă cadrul la 3 s (înainte 6 s), cu durata editabilă în panou.
 * (2) Clipul cursului de pizza apare și pe Acasă, lângă fotografie, cu pauză și sunet; se poate opri din panou.
 */

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')
const tabs = (HomePage.fields[0] as { tabs: { name?: string; fields: any[] }[] }).tabs
const field = (tab: string, name: string) => tabs.find((t) => t.name === tab)!.fields.find((f) => f.name === name)

describe('D-71 · slideshow-ul la 3 s', () => {
  it('câmpul din panou: implicit 3 s, între 2 și 15', () => {
    const f = field('hero', 'slideSeconds')
    expect([f.type, f.defaultValue, f.min, f.max]).toEqual(['number', 3, 2, 15])
  })
  it('coperta trimite intervalul din panou; fără valoare, 3 s', () => {
    expect(read('src/components/site/Hero.tsx')).toContain('Number(hero?.slideSeconds) || 3)) * 1000')
    const motion = read('src/components/site/HeroMotion.tsx')
    expect(motion).toContain('interval = 3000')
    expect(motion).not.toContain('}, 6000)')
  })
})

describe('D-71 · clipul cursului pe Acasă', () => {
  it('comutatorul din panou, pornit implicit', () => {
    const f = field('pizza', 'videoOnHome')
    expect([f.type, f.defaultValue]).toEqual(['checkbox', true])
  })
  it('același clip ca pe pagina cursului; nu se descarcă până nu ajunge pe ecran', () => {
    const events = read('src/components/site/Events.tsx')
    expect(events).toContain("asMedia(s?.video) ?? gallery.find((m) => m.kind === 'clip')")
    const card = read('src/components/site/ClipCard.tsx')
    expect(card).toContain('preload="none"')
    expect(card).toContain('IntersectionObserver')
    expect(card).toContain('useMotionAllowed')
  })
  it('butoanele de pauză și sunet au text în toate cele 7 limbi', () => {
    for (const code of LOCALE_CODES) {
      const d = clientUI(code)
      for (const k of ['clipPlay', 'clipPause', 'clipSoundOn', 'clipSoundOff'] as const) expect(d[k]).toBeTruthy()
    }
  })
})
