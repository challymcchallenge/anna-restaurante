import Link from 'next/link'
import React from 'react'

import type { SiteData } from '@/lib/site/data'
import { asMedia, pictureSources, videoSources } from '@/lib/site/media'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'
import type { Gallery, Media } from '@/payload-types'

import { ExampleTag } from './Bits'
import { Icon } from './Icons'
import { Picture } from './Picture'

/**
 * Galeria (PLAN F3 pasul 8, content-model 4.10 și 5.7, S-05, F-30, F-31): mozaic pe categorii.
 * Forma plăcii vine din proporțiile fișierului: lată, înaltă sau pătrată. Un clip arată posterul
 * cu semnul de redare. Linkul duce la fișierul mare (fără JavaScript); la /galerie, fereastra
 * GalleryLightbox îl deschide peste pagină.
 */

type Shape = 'wide' | 'tall' | 'square'

export function shapeOf(media: Pick<Media, 'width' | 'height'> | null): Shape {
  const ratio = media?.width && media?.height ? media.width / media.height : 1
  return ratio >= 1.3 ? 'wide' : ratio <= 0.85 ? 'tall' : 'square'
}

/** Imaginea de arătat (fotografia sau posterul clipului) și clipul, dacă e unul. */
export function galleryVisual(item: Gallery): { image: Media | null; clip: Media | null } {
  const file = asMedia(item.file)
  if (!file) return { image: null, clip: null }
  if (file.kind === 'clip') return { image: asMedia(file.poster), clip: file }
  return { image: file, clip: null }
}

export const categoryOf = (item: Gallery) =>
  typeof item.category === 'object' && item.category ? item.category : null

/**
 * Acasă (1–8 elemente): o așezare fixă, după număr, care umple mereu rândurile: prima fotografie
 * mare (2 × 2), apoi plăci de 1, 2 sau 4 coloane. Pe telefon, 2 coloane; „w4” ocupă tot rândul.
 * Fotografia se decupează în placă (punctul focal din panou).
 */
export type HomeTile = 'solo' | 'big' | 'one' | 'w2' | 'w4'
const HOME_LAYOUT: Record<number, HomeTile[]> = {
  1: ['solo'],
  2: ['big', 'big'],
  3: ['big', 'w2', 'w2'],
  4: ['big', 'one', 'one', 'w2'],
  5: ['big', 'one', 'one', 'one', 'one'],
  6: ['big', 'one', 'one', 'one', 'one', 'w4'],
  7: ['big', 'one', 'one', 'one', 'one', 'w2', 'w2'],
  8: ['big', 'one', 'one', 'one', 'one', 'w2', 'one', 'one'],
}
export const homeLayout = (n: number): HomeTile[] => HOME_LAYOUT[Math.min(Math.max(n, 0), 8)] ?? []

const SIZES: Record<Shape | HomeTile, string> = {
  wide: '(min-width: 1024px) 620px, 100vw',
  tall: '(min-width: 1024px) 310px, 50vw',
  square: '(min-width: 1024px) 310px, 50vw',
  solo: '(min-width: 1280px) 1240px, 100vw',
  big: '(min-width: 1024px) 620px, 100vw',
  one: '(min-width: 1024px) 310px, 50vw',
  w2: '(min-width: 1024px) 620px, 100vw',
  w4: '(min-width: 1280px) 1240px, 100vw',
}

export const tileSizes = (shape: Shape | HomeTile) => SIZES[shape]

export function GalleryTile({
  item,
  href,
  id,
  tile,
  priority = false,
}: {
  item: Gallery
  href?: string
  id?: string
  /** Pe Acasă: placa din așezarea fixă; altfel forma vine din proporțiile fișierului. */
  tile?: HomeTile
  /** Prima placă din /galerie (elementul LCP): se încarcă imediat, cu prioritate mare. */
  priority?: boolean
}) {
  const { image, clip } = galleryVisual(item)
  if (!image) return null
  const shape = tile ?? shapeOf(image)
  const big = pictureSources(image, 1920)
  const category = categoryOf(item)
  const label = item.caption || image.alt || ''
  return (
    <li className={`gal-item gal-item--${shape}`} id={id} data-cat={category?.id}>
      <a
        className="gal-link"
        href={href ?? (clip?.url || big.src)}
        aria-label={clip ? `${UI.clip}: ${label}` : UI.enlarge(label)}
        data-avif={big.avif ?? undefined}
        data-webp={big.webp ?? undefined}
        data-src={big.src}
        data-w={big.width || undefined}
        data-h={big.height || undefined}
        data-alt={image.alt ?? ''}
        data-caption={item.caption ?? ''}
        data-category={category?.name ?? ''}
        data-video={clip ? JSON.stringify(videoSources(clip)) : undefined}
      >
        <Picture media={image} sizes={SIZES[shape]} priority={priority} />
        {clip && (
          <span className="gal-play" aria-hidden="true">
            <Icon name="play" />
          </span>
        )}
      </a>
      {item.placeholder && <ExampleTag floating className="photo-tag" />}
    </li>
  )
}

/** Acasă · Galerie (content-model 4.10): elementele bifate „Pe Acasă”, apoi „Vezi galeria”. */
export function GallerySection({ site, id }: { site: SiteData; id: string }) {
  const s = section(site.home, 'gallery')
  const titleId = `${id}-titlu`
  // Doar elementele care au imagine (un clip fără poster nu are ce arăta în mozaic).
  const items = site.galleryHome.filter((i) => galleryVisual(i).image)
  const layout = homeLayout(items.length)
  return (
    <section className="gallery paper-section" id={id} aria-labelledby={titleId}>
      <div className="wrap">
        <div className="gal-head">
          <h2 id={titleId}>{s?.title}</h2>
          {s?.placeholder && <ExampleTag className="section-tag" />}
        </div>
        {items.length > 0 && (
          <div className="gal-frame">
            <ul className="gal-mosaic gal-mosaic--home">
              {items.map((item, i) => (
                <GalleryTile key={item.id} item={item} href={`/galerie#g-${item.id}`} tile={layout[i]} />
              ))}
            </ul>
          </div>
        )}
        {s?.buttonLabel && (
          <Link className="btn btn-secondary section-cta" href="/galerie">
            <Icon name="image" />
            {s.buttonLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
