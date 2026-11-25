import type { Metadata } from 'next'
import React from 'react'
import { preload } from 'react-dom'

import { PageCover } from '@/components/site/Events'
import { ChipFilter } from '@/components/site/ChipFilter'
import { galleryVisual, GalleryTile, shapeOf, tileSizes } from '@/components/site/Gallery'
import { GalleryLightbox } from '@/components/site/GalleryLightbox'
import { pageMediaCredits } from '@/lib/site/credits'
import { pictureSources } from '@/lib/site/media'
import { getGallery } from '@/lib/site/data'
import { getActiveSite, localeAlternates } from '@/lib/site/locale'
import { sitePage } from '@/lib/site/page'
import { section } from '@/lib/site/sections'
import { renderLocale, UI } from '@/lib/site/i18n/server'

/**
 * S-05 · Galerie (F-30, F-31): toate fotografiile și clipurile active, în mozaic, cu filtre pe
 * categorie (doar categoriile care au elemente). La click, fotografia mare sau clipul, peste pagină.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getActiveSite()
  if (!site) return {}
  const s = section(site.home, 'gallery')
  const { items, categories } = await getGallery(site.tenant.id, site.locale)
  return {
    title: `${s?.menuLabel || s?.title || UI.pageLabels.pageGallery} · ${site.tenant.name}`,
    // Secțiunea nu are text introductiv: descrierea se compune din galerie.
    description: UI.galleryMeta(site.tenant.name, items.length, categories.map((c) => c.name)),
    alternates: localeAlternates(site, '/galerie'),
  }
}

export default async function GalleryPage() {
  const site = await sitePage('gallery')
  const s = section(site.home, 'gallery')
  const { items, categories } = await getGallery(site.tenant.id, site.locale)

  // Prima fotografie e elementul LCP: se preîncarcă din <head>, în formatul ales de browser (AVIF).
  const first = items.map((i) => galleryVisual(i).image).find(Boolean)
  if (first) {
    const src = pictureSources(first, 960)
    preload(src.src, {
      as: 'image',
      fetchPriority: 'high',
      imageSrcSet: src.avif ?? src.webp ?? undefined,
      imageSizes: tileSizes(shapeOf(first)),
      type: src.avif ? 'image/avif' : undefined,
    })
  }

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
              {items.map((item, i) => (
                <GalleryTile key={item.id} item={item} id={`g-${item.id}`} priority={i === 0} />
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
      <GalleryLightbox locale={renderLocale()} boardId="galerie" />
    </>
  )
}
