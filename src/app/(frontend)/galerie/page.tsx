import React from 'react'

import { PageCover } from '@/components/site/Events'
import { ChipFilter } from '@/components/site/ChipFilter'
import { categoryOf, galleryVisual, GalleryTile } from '@/components/site/Gallery'
import { GalleryLightbox } from '@/components/site/GalleryLightbox'
import { pageMediaCredits } from '@/lib/site/credits'
import { getGallery } from '@/lib/site/data'
import { sitePage, sitePageMeta } from '@/lib/site/page'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'

/**
 * S-05 · Galerie (F-30, F-31): toate fotografiile și clipurile active, în mozaic, cu filtre pe
 * categorie (doar categoriile care au elemente). La click, fotografia mare sau clipul, peste pagină.
 */
export const generateMetadata = () => sitePageMeta('gallery', 'Galerie')

export default async function GalleryPage() {
  const site = await sitePage('gallery')
  const s = section(site.home, 'gallery')
  const { items, categories } = await getGallery(site.tenant.id)

  // Filtrul pe categorie: o regulă CSS pe categorie (id numeric), fără JavaScript.
  const rules = categories
    .map((c) => `.gal-board:has(.chip-filter input[value="${c.id}"]:checked) .gal-item:not([data-cat="${c.id}"]){display:none}`)
    .join('')
  // Creditele foto ale elementelor care nu apar deja în footer (acolo sunt cele de pe Acasă).
  const shown = new Set(pageMediaCredits(site))
  const credits = [
    ...new Set(
      items
        .map((i) => galleryVisual(i).image?.credit?.trim())
        .filter((c): c is string => Boolean(c) && !shown.has(c as string)),
    ),
  ]

  return (
    <>
      <PageCover title={s?.menuLabel || s?.title || ''} intro={s?.menuLabel ? s?.title : null} placeholder={Boolean(s?.placeholder)} />
      <section className="gallery-page paper-section" aria-label={s?.menuLabel || s?.title || undefined}>
        <div className="wrap gal-board" id="galerie">
          {rules && <style>{rules}</style>}
          {categories.length > 1 && (
            <ChipFilter
              name="categorie"
              legend={UI.galleryFilter}
              options={[{ value: 'all', label: UI.allPhotos }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))]}
            />
          )}
          <div className="gal-frame">
            <ul className="gal-mosaic">
              {items.map((item) => (
                <GalleryTile key={item.id} item={item} id={`g-${item.id}`} />
              ))}
            </ul>
          </div>
          {credits.length > 0 && (
            <p className="gal-credits">
              {UI.photoCredits}: {credits.join(' · ')}
            </p>
          )}
        </div>
      </section>
      <GalleryLightbox boardId="galerie" />
    </>
  )
}
