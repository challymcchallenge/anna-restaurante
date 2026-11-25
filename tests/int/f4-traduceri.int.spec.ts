// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { localePath, stripLocale } from '@/lib/locales'
import { DICTS } from '@/lib/site/i18n'
import { ro, roClient } from '@/lib/site/i18n/ro'
import { chunk } from '@/lib/translate/engine'
import {
  collectSegments,
  fromMarkup,
  hasTranslatableFields,
  protectTerms,
  restoreTerms,
  sourceHash,
  toMarkup,
  translationState,
} from '@/lib/translate/segments'

/**
 * F4 (D-64): adresele pe limbi, dicționarele interfeței și partea fără rețea a traducerilor
 * (ce se traduce, textul formatat, termenii protejați, starea pe limbă).
 */

describe('F4 · adresele pe limbi (F4-1)', () => {
  it('româna fără prefix, celelalte cu prefix; adresele rămân în română', () => {
    expect(localePath('ro', '/galerie')).toBe('/galerie')
    expect(localePath('en', '/galerie')).toBe('/en/galerie')
    expect(localePath('en', '/')).toBe('/en')
    expect(localePath('de', '/#vinuri')).toBe('/de#vinuri')
    expect(localePath('it', '/contact?subiect=cazare')).toBe('/it/contact?subiect=cazare')
    expect(localePath('xx', '/galerie')).toBe('/galerie')
  })

  it('calea fără limbă, inclusiv adresa internă /ro', () => {
    expect(stripLocale('/en/galerie')).toBe('/galerie')
    expect(stripLocale('/en')).toBe('/')
    expect(stripLocale('/ro/termeni')).toBe('/termeni')
    expect(stripLocale('/galerie')).toBe('/galerie')
    expect(stripLocale('/')).toBe('/')
  })

  it('next.config: rescrie româna sub /ro și trimite /ro/… la adresa fără prefix', () => {
    const cfg = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8')
    expect(cfg).toContain("{ source: '/', destination: '/ro' }")
    expect(cfg).toContain("destination: '/ro/:path'")
    expect(cfg).toContain("{ source: '/ro/:path*', destination: '/:path*', permanent: true }")
    // Panoul, API-ul, fișierele și /_next nu se rescriu.
    const source = cfg.match(/source: '(\/:path\(\(\?![^']+)'/)?.[1] ?? ''
    const re = new RegExp(`^${source.replace('/:path(', '/(').replace(/\\\\/g, '\\')}$`)
    expect(re.test('/galerie')).toBe(true)
    expect(re.test('/termeni')).toBe(true)
    expect(re.test('/admin')).toBe(false)
    expect(re.test('/api/translate')).toBe(false)
    expect(re.test('/en/galerie')).toBe(false)
    expect(re.test('/robots.txt')).toBe(false)
    expect(re.test('/_next/static/x.js')).toBe(false)
  })
})

describe('F4 · textele fixe în 7 limbi', () => {
  const shape = (v: unknown): unknown =>
    typeof v === 'function'
      ? `fn${(v as (...a: unknown[]) => unknown).length}`
      : Array.isArray(v)
        ? v.map(() => 's')
        : v && typeof v === 'object'
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)]))
          : typeof v

  it('fiecare limbă are exact cheile românei', () => {
    for (const [code, dict] of Object.entries(DICTS)) {
      expect(shape(dict), code).toEqual(shape(ro))
    }
  })

  it('formatul datelor, Open Graph și nota de pe paginile legale (F4-4)', () => {
    expect(DICTS.en.intl).toBe('en-GB')
    expect(DICTS.zh.ogLocale).toBe('zh_CN')
    expect(ro.legalTranslationNote).toBe('')
    for (const code of ['en', 'it', 'fr', 'de', 'zh', 'sv'] as const) expect(DICTS[code].legalTranslationNote.length).toBeGreaterThan(10)
  })

  it('partea din browser e un subset al dicționarului complet', () => {
    for (const k of Object.keys(roClient)) expect(Object.keys(ro)).toContain(k)
  })

  it('pluralul: 1 / 2 / 21', () => {
    expect(DICTS.en.summaryGuests(1)).toMatch(/^1 guest$/)
    expect(DICTS.en.summaryGuests(21)).toMatch(/^21 guests$/)
    expect(ro.summaryGuests(21)).toBe('21 de invitați')
  })
})

/* ---------------- Traducerile din panou ---------------- */

const FIELDS = [
  { type: 'text', name: 'title', localized: true, maxLength: 60 },
  { type: 'text', name: 'name' },
  {
    type: 'group',
    name: 'hero',
    fields: [
      { type: 'text', name: 'subtitle', localized: true },
      { type: 'array', name: 'items', fields: [{ type: 'text', name: 'label', localized: true }] },
    ],
  },
  { type: 'richText', name: 'body', localized: true },
  { type: 'select', name: 'i18nStatus', localized: true },
] as never

const text = (t: string, format = 0) => ({ type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 })
const DOC = {
  title: 'Bine ați venit la Trattoria da Vittoria',
  name: 'Salon Vittoria',
  hero: { subtitle: 'Bucătărie italiană', items: [{ id: 'a', label: 'Pizza din cuptor' }, { id: 'b', label: '' }] },
  body: {
    root: {
      type: 'root',
      children: [
        { type: 'paragraph', children: [text('Rezervă la '), text('Salon Vittoria', 1), text(' acum.')] },
        {
          type: 'list',
          children: [{ type: 'listitem', children: [text('Parcare '), { type: 'link', fields: { url: 'https://x.ro' }, children: [text('gratuită')] }] }],
        },
      ],
    },
  },
}

describe('F4 · ce se traduce dintr-un document', () => {
  it('doar câmpurile „se traduce”, nevide, inclusiv din grupuri, liste și text formatat', () => {
    const segs = collectSegments(FIELDS, DOC)
    expect(segs.map((s) => s.path.join('.'))).toEqual([
      'title',
      'hero.subtitle',
      'hero.items.0.label',
      'body.root.children.0',
      'body.root.children.1.children.0',
    ])
    expect(segs[0].max).toBe(60)
    expect(segs[3].source).toBe('Rezervă la <1>Salon Vittoria</1> acum.')
    expect(segs[4].source).toBe('Parcare <1>gratuită</1>')
    expect(hasTranslatableFields(FIELDS)).toBe(true)
    expect(hasTranslatableFields([{ type: 'text', name: 'x' }] as never)).toBe(false)
  })

  it('textul formatat se reface cu formatarea și linkul la locul lor', () => {
    const p = DOC.body.root.children[0].children as never
    expect(toMarkup(p)).toBe('Rezervă la <1>Salon Vittoria</1> acum.')
    const back = fromMarkup(p, 'Book the <1>Salon Vittoria</1> now.')!
    expect(back.map((n) => n.text)).toEqual(['Book the ', 'Salon Vittoria', ' now.'])
    expect(back[1].format).toBe(1)
    const li = (DOC.body.root.children[1] as { children: { children: unknown[] }[] }).children[0].children as never
    const liBack = fromMarkup(li, 'Free <1>parking</1>')!
    expect(liBack[1].type).toBe('link')
    expect((liBack[1].fields as { url: string }).url).toBe('https://x.ro')
    expect(liBack[1].children?.[0].text).toBe('parking')
    // Marcaje pierdute sau dublate: refuzat (apelantul folosește textul simplu).
    expect(fromMarkup(p, 'Book the Salon Vittoria now.')).toBeNull()
    expect(fromMarkup(p, '<1>a</1><1>b</1>')).toBeNull()
  })

  it('termenii protejați devin {n} și revin; un marcaj pierdut e semnalat', () => {
    const p = protectTerms('Salonul Salon Vittoria din Trattoria da Vittoria', ['Vittoria', 'Salon Vittoria', 'Trattoria da Vittoria'])
    // Cel mai lung întâi: „Trattoria da Vittoria” nu e rupt de „Vittoria”.
    expect(p.text).toBe('Salonul {1} din {0}')
    expect(restoreTerms('The {1} at {0}', p.used)).toEqual({ text: 'The Salon Vittoria at Trattoria da Vittoria', ok: true })
    expect(restoreTerms('The room at {0}', p.used).ok).toBe(false)
    expect(restoreTerms('{0} {1} {2}', p.used).ok).toBe(false)
  })

  it('starea pe limbă: netradus, tradus, verificat, de retradus / de reverificat', () => {
    const h = sourceHash(collectSegments(FIELDS, DOC))
    expect(translationState(null, null, h)).toBe('none')
    expect(translationState('auto', h, h)).toBe('auto')
    expect(translationState('verified', h, h)).toBe('verified')
    const changed = sourceHash(collectSegments(FIELDS, { ...DOC, title: 'Alt titlu' }))
    expect(changed).not.toBe(h)
    expect(translationState('auto', h, changed)).toBe('stale-auto')
    expect(translationState('verified', h, changed)).toBe('stale-verified')
    // Un câmp care nu se traduce nu schimbă amprenta.
    expect(sourceHash(collectSegments(FIELDS, { ...DOC, name: 'Alt salon' }))).toBe(h)
  })

  it('bucățile pe cereri: cel mult 40 sau ~6.000 de caractere', () => {
    const items = Array.from({ length: 95 }, (_, i) => ({ id: `s${i}`, text: 'x'.repeat(100) }))
    expect(chunk(items).map((c) => c.length)).toEqual([40, 40, 15])
    const big = Array.from({ length: 5 }, (_, i) => ({ id: `b${i}`, text: 'y'.repeat(2500) }))
    expect(chunk(big).map((c) => c.length)).toEqual([2, 2, 1])
  })
})

describe('F4 · durata funcției API', () => {
  it('ruta /api are maxDuration 120 s (traducerile pe ture)', () => {
    const route = readFileSync(join(process.cwd(), 'src/app/(payload)/api/[...slug]/route.ts'), 'utf8')
    expect(route).toMatch(/export const maxDuration = 120/)
  })
})

describe('G10 (D-65) · întrebări la cursuri și la cazare, termeni care nu se traduc', () => {
  const seed = JSON.parse(readFileSync(join(process.cwd(), 'seed/trattoria-da-vittoria.json'), 'utf8'))
  it('3 întrebări la cursuri, 4 la cazare, toate cu răspuns (fără „Provizoriu”)', () => {
    const list = seed.lists.find((l: { version: string }) => l.version === '2026-11-25-g10')
    const by = (g: string) => list.items.filter((i: { group: string }) => i.group === g)
    expect(by('pizza')).toHaveLength(3)
    expect(by('stay')).toHaveLength(4)
    expect(list.items.every((i: { placeholder: boolean; answer: { $richText: string } }) => !i.placeholder && i.answer.$richText.length > 20)).toBe(true)
  })
  it('termenii din Setări și secțiunea de sub Hotel', () => {
    const swap = seed.swaps.find((s: { field: string }) => s.field === 'doNotTranslate')
    expect(swap.to).toEqual(['Hotel ANNA', 'Grupul ANNA', 'Wine Spectator', 'Riviera Events', 'VIP Riviera'])
    const home = readFileSync(join(process.cwd(), 'src/app/(frontend)/[lang]/page.tsx'), 'utf8')
    expect(home).toContain('<FaqList faqs={site.faqs} group="stay" title={UI.faqStayTitle} />')
    for (const d of Object.values(DICTS)) expect(d.faqStayTitle.length).toBeGreaterThan(3)
  })
})

describe('D-67 · cererile de după GATE 4', () => {
  const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')
  it('insigna premiului acceptă orice imagine; sliderul are până la 20 de categorii', () => {
    expect(read('src/collections/AdminAreas.ts')).toContain("kinds: ['badge', 'logo', 'photo']")
    expect(read('src/lib/site/data.ts')).toMatch(/collection: 'dish-categories', where: of\(\), sort: '_order', limit: 20/)
  })
  it('clipurile își păstrează sunetul; clipul cursului stă în locul fotografiei, fără muted', () => {
    const convert = read('src/components/admin/media/convert.ts')
    expect(convert).not.toContain('discard: true')
    expect(convert).toContain('audio: { quality: MB.QUALITY_MEDIUM }')
    const page = read('src/app/(frontend)/[lang]/cursuri-pizza-copii/page.tsx')
    expect(page).toContain("allGallery.find((m) => m.kind === 'clip')")
    expect(page).not.toMatch(/<video[^>]*\bmuted\b/)
  })
  it('numele categoriei se traduce; pagina de cookies cu textul altui site se înlocuiește o singură dată', () => {
    expect(read('src/collections/Catalog.ts')).toMatch(/name: 'name', label: 'Nume', max: 32, required: true, localized: true/)
    const seed = JSON.parse(read('seed/trattoria-da-vittoria.json'))
    const swap = seed.swaps.find((s: { match?: { slug?: string }; whenContains?: string }) => s.match?.slug === 'cookies' && s.whenContains)
    expect(swap.whenContains).toBe('rivieraevents.ro')
    expect(swap.alsoSet).toEqual({ placeholder: true })
    expect(swap.to.$richText).toContain('Limba aleasă stă în adresa paginii')
  })
})
