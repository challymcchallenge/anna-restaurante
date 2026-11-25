// @vitest-environment node
import { describe, expect, it } from 'vitest'

import nextConfig from '../../next.config'

/**
 * D-72: pe Vercel, cererile routerului au sufix (`/galerie.rsc`, `/galerie.segments/_tree.segment.rsc`,
 * Acasă: `/index.rsc`). Rescrierea românei la rădăcină trebuie să le trimită la `/ro/…`, altfel cad pe
 * `/[lang]` cu „lang = galerie” și linkurile interne afișează Acasă până la reîncărcare.
 */

type Rule = { source: string; destination: string }

async function rules(): Promise<Rule[]> {
  const r = await (nextConfig as { rewrites: () => Promise<{ afterFiles: Rule[] }> }).rewrites()
  return r.afterFiles
}

/** Aplică regulile ca Next: prima care se potrivește (sursele simple exact, `:path(regex)` pe restul). */
function rewrite(list: Rule[], path: string): string {
  for (const { source, destination } of list) {
    const m = source.match(/^\/:path\((.*)\)$/)
    if (m) {
      if (new RegExp(`^(?:${m[1]})$`).test(path.slice(1))) return destination.replace(':path', path.slice(1))
      continue
    }
    const rest = source.match(/^(.*):rest\*$/)
    if (rest && path.startsWith(rest[1])) return destination.replace(':rest*', path.slice(rest[1].length))
    if (source === path) return destination
  }
  return path
}

describe('D-72 · rescrierea românei și cererile routerului', () => {
  it('paginile și cererile lor .rsc / .segments ajung la /ro/…', async () => {
    const list = await rules()
    expect(rewrite(list, '/catalog-vinuri')).toBe('/ro/catalog-vinuri')
    expect(rewrite(list, '/catalog-vinuri.rsc')).toBe('/ro/catalog-vinuri.rsc')
    expect(rewrite(list, '/catalog-vinuri.segments/_tree.segment.rsc')).toBe('/ro/catalog-vinuri.segments/_tree.segment.rsc')
    expect(rewrite(list, '/termeni.rsc')).toBe('/ro/termeni.rsc')
  })

  it('Acasă: /, /index.rsc și /index.segments/… ajung la /ro', async () => {
    const list = await rules()
    expect(rewrite(list, '/')).toBe('/ro')
    expect(rewrite(list, '/index.rsc')).toBe('/ro.rsc')
    expect(rewrite(list, '/index.segments/_tree.segment.rsc')).toBe('/ro.segments/_tree.segment.rsc')
  })

  it('celelalte limbi, panoul, API-ul și fișierele rămân neatinse', async () => {
    const list = await rules()
    for (const p of ['/en.rsc', '/en/catalog-vinuri.rsc', '/zh.segments/_tree.segment.rsc', '/ro.rsc', '/admin.rsc', '/api/media', '/logo.png', '/decor/pizza.svg', '/robots.txt', '/_next/static/x.js']) {
      expect(rewrite(list, p)).toBe(p)
    }
  })
})
