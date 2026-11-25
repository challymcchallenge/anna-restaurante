// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { Redirects } from '@/collections/AdminAreas'
import { normalizeOldPath } from '@/lib/redirect-path'

/**
 * F5 (G7-2, D-59): adresele de pe davittoria.ro (harta site-ului citită pe 25.11.2026: 16 adrese) duc
 * pe pagina potrivită după mutarea domeniului. Adresele cu mai multe segmente (`/gallery/locatie/`)
 * trec acum prin `[slug]/[...rest]`.
 */

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')
const seed = JSON.parse(read('seed/trattoria-da-vittoria.json'))

describe('F5 · redirecționările adreselor vechi', () => {
  it('adresa veche se normalizează la fel la salvare și la căutare', () => {
    expect(normalizeOldPath('/Gallery/Locatie/')).toBe('/gallery/locatie')
    expect(normalizeOldPath('meniu')).toBe('/meniu')
    expect(normalizeOldPath('/')).toBe('/')
    const from = Redirects.fields.find((f) => 'name' in f && f.name === 'from') as {
      hooks: { beforeValidate: ((a: { value: unknown }) => unknown)[] }
    }
    expect(from.hooks.beforeValidate[0]({ value: '/3D-Flip-Book/Meniu/' })).toBe('/3d-flip-book/meniu')
  })

  it('lista din seed acoperă toate adresele vechi care nu mai există, fără să șteargă ce e în panou', () => {
    const list = seed.lists.find((l: { collection: string }) => l.collection === 'redirects')
    expect(list.keepPlaceholders).toBe(true)
    const map = Object.fromEntries(list.items.map((i: { from: string; to: string }) => [i.from, i.to]))
    const menu = 'https://www.meniudigital.ro/trattoriadavittoria'
    expect(map).toEqual({
      '/trattoria': '/',
      '/test': '/',
      '/1hm': '/',
      '/la-multi-ani': '/',
      '/meniu': menu,
      '/meniu-3d-teste': menu,
      '/3d-flip-book/meniu': menu,
      '/3d-flip-book/valori-nutritionale': menu,
      '/3d-flip-book/test': '/',
      '/gallery/evenimente': '/galerie',
      '/gallery/locatie': '/galerie',
      '/gallery/catalog-vinuri': '/catalog-vinuri',
    })
    // /valori-nutritionale exista deja (D-19); /, /catalog-vinuri și /formular-de-reclamatie rămân pagini.
    expect(seed.collections.redirects[0].from).toBe('/valori-nutritionale')
    for (const i of list.items) expect(i.from).toBe(normalizeOldPath(i.from))
  })

  it('adresele cu mai multe segmente se caută în Redirecționări, altfel 404', () => {
    const page = read('src/app/(frontend)/[lang]/[slug]/[...rest]/page.tsx')
    expect(page).toContain('getRedirect(site.tenant.id, path)')
    expect(page).toContain('if (!r) notFound()')
    const data = read('src/lib/site/data.ts')
    expect(data).toContain('{ from: { in: [from, `${from}/`] } }')
  })
})
