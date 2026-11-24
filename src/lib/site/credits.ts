import type { Media } from '@/payload-types'

import type { SiteData } from './data'
import { asMedia, type MediaRef } from './media'
import { isOn, section } from './sections'

/**
 * Creditele foto ale paginii, într-un singur rând în footer (nu sub imagini). Se citesc din câmpul
 * „Credit foto” al fișierelor afișate; fotografiile provizorii cu licență CC BY / CC BY-SA cer
 * atribuire (design/f2/assets/foto/credits.json).
 */
export function pageMediaCredits(site: SiteData): string[] {
  const refs: MediaRef[] = []
  const home = site.home
  if (isOn(home, 'hero')) {
    const hero = section(home, 'hero')
    refs.push(hero?.posterDesktop, hero?.posterMobile)
    for (const slide of hero?.slides ?? []) refs.push(slide.desktop, slide.mobile)
  }
  if (isOn(home, 'kitchen')) refs.push(...site.dishCategories.map((c) => c.photo))
  if (isOn(home, 'wines')) refs.push(...site.wines.map((w) => w.photo))

  const credits = refs
    .map(asMedia)
    .filter((m): m is Media => Boolean(m?.credit))
    .map((m) => (m.credit as string).trim())
  return [...new Set(credits)]
}
