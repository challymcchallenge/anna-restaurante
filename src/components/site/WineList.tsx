import React from 'react'

import type { SiteData, WineRow } from '@/lib/site/data'
import { amount, price } from '@/lib/site/format'
import { asMedia, pictureSources } from '@/lib/site/media'
import { UI } from '@/lib/site/strings'
import {
  byOrigin,
  searchText,
  typeLabel,
  vintageLabel,
  volumeIfOther,
  volumeMl,
  wineTitle,
  type WineType,
} from '@/lib/site/wines'

import { ExampleTag } from './Bits'
import { ChipFilter } from './ChipFilter'

/**
 * Lista de vinuri (D-46): pe Acasă în formatul închis, la /catalog-vinuri în formatul deschis.
 * Filtrul pe tip e un grup de butoane radio: merge fără JavaScript (CSS `:has`), cu tastatura
 * (săgețile) și e anunțat corect de cititoarele de ecran.
 */

/** Logo-ul Grupului: varianta pentru fundal închis sau deschis, cu rezervă pe cealaltă. */
export function GroupLogo({
  site,
  onDark = false,
  className,
  decorative = false,
}: {
  site: SiteData
  onDark?: boolean
  className?: string
  /** Lângă un titlu care numește deja grupul: fără text alternativ. */
  decorative?: boolean
}) {
  const s = site.settings
  const logo = onDark
    ? (asMedia(s?.logoGroupDark) ?? asMedia(s?.logoGroup))
    : (asMedia(s?.logoGroup) ?? asMedia(s?.logoGroupDark))
  if (!logo) return null
  const src = pictureSources(logo, 640)
  return (
    <picture className={className}>
      {src.avif && <source type="image/avif" srcSet={src.avif} sizes="240px" />}
      {src.webp && <source type="image/webp" srcSet={src.webp} sizes="240px" />}
      <img
        src={src.src}
        width={src.width || 240}
        height={src.height || 52}
        alt={decorative ? '' : logo.alt || UI.groupTitle}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

export function WineFilter({ name, types }: { name: string; types: WineType[] }) {
  if (types.length < 2) return null
  return (
    <ChipFilter
      name={name}
      legend={UI.wineFilter}
      options={[{ value: 'all', label: UI.allWines }, ...types.map((t) => ({ value: t, label: typeLabel(t) }))]}
    />
  )
}

/** Un rând pe Acasă (poza 6): numele, prețul auriu; dedesubt denumirea · anul · volumul. */
export function WineItem({ wine }: { wine: WineRow }) {
  const meta = [
    wine.appellation,
    vintageLabel(wine),
    volumeMl(wine.volume),
    wine.priceGlass != null ? `${price(wine.priceGlass)} ${UI.glass}` : null,
  ].filter(Boolean)
  return (
    <li className="wine-item">
      <p className="wine-name">{wineTitle(wine)}</p>
      <p className="wine-price">{price(wine.priceBottle)}</p>
      <p className="wine-meta">
        {meta.join(' · ')}
        {wine.placeholder && <ExampleTag className="row-tag" />}
      </p>
    </li>
  )
}

/** Un rând la /catalog-vinuri (poza 7): **producătorul** vinul · anul · prețul; dedesubt denumirea și soiurile. */
export function WineLine({ wine, glass = false }: { wine: WineRow; glass?: boolean }) {
  const detail = [wine.appellation, wine.grapes, glass ? null : volumeIfOther(wine.volume)].filter(Boolean)
  const value = glass ? wine.priceGlass : wine.priceBottle
  return (
    <li className="wine-line" data-q={searchText(wine)}>
      <p className="wine-line-name">
        {wine.producer && <strong>{wine.producer}</strong>} {wine.name}
      </p>
      <span className="wine-line-year">
        {wine.vintage ? wine.vintage : <abbr title={UI.nonVintageTitle}>{UI.nonVintage}</abbr>}
      </span>
      <span className="wine-line-price">
        {amount(value)}
        <span className="sr-only"> {UI.currency}</span>
      </span>
      {(detail.length > 0 || wine.placeholder) && (
        <p className="wine-line-detail">
          {detail.join(' · ')}
          {wine.placeholder && <ExampleTag className="row-tag" />}
        </p>
      )}
    </li>
  )
}

/** Un grup de la /catalog-vinuri: titlul tipului, legenda, apoi țara · regiunea. */
export function WineSheetGroup({
  type,
  wines,
  glass = false,
}: {
  type: WineType | 'glass'
  wines: WineRow[]
  glass?: boolean
}) {
  const id = `vinuri-${type}`
  return (
    <section className="wine-group" data-type={type} aria-labelledby={id}>
      <div className="wine-group-head">
        <h2 id={id} className="wine-group-title">
          {UI.wineGroups[type]}
        </h2>
        <p className="wine-legend">{glass ? UI.wineLegendGlass : UI.wineLegend}</p>
      </div>
      {byOrigin(wines).map((o) => (
        <div key={o.origin} className="wine-origin">
          {o.origin && <h3 className="wine-origin-title">{o.origin}</h3>}
          <ul className="wine-lines">
            {o.wines.map((w) => (
              <WineLine key={w.id} wine={w} glass={glass} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
