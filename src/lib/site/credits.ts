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
  // Lista de vinuri nu arată fotografii (D-46).
  // F3 pașii 4–6: afișele serilor, fotografiile saloanelor, fotografia și galeria cursului.
  if (isOn(home, 'parties')) refs.push(...site.eventsUpcoming.map((e) => e.poster))
  if (isOn(home, 'privateEvents')) refs.push(...site.salons.flatMap((x) => (x.photos ?? []) as MediaRef[]))
  if (isOn(home, 'pizza')) {
    const pizza = section(home, 'pizza')
    refs.push(pizza?.photo, ...((pizza?.gallery ?? []) as MediaRef[]))
  }

  // F3 pasul 7: fotografiile hotelului și ale camerelor.
  if (isOn(home, 'hotel')) {
    refs.push(...((section(home, 'hotel')?.photos ?? []) as MediaRef[]), ...site.roomTypes.map((r) => r.photo))
  }

  const credits = refs
    .map(asMedia)
    .filter((m): m is Media => Boolean(m?.credit))
    .map((m) => (m.credit as string).trim())
  return [...new Set(credits)]
}
