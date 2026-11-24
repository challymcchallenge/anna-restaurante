import { VARIANT_WIDTHS } from '@/collections/Media'
import type { Media } from '@/payload-types'

/**
 * Imaginile site-ului (ADR-004): variantele AVIF și WebP generate la încărcare, servite cu
 * `<picture>` și `srcset`, fără transformare la cerere. SVG-urile se servesc neschimbate.
 */

export type MediaRef = number | Media | null | undefined

/** Documentul media, doar dacă a fost adus (depth ≥ 1) și are fișier. */
export function asMedia(ref: MediaRef): Media | null {
  return ref && typeof ref === 'object' && ref.url ? ref : null
}

type Size = { url?: string | null; width?: number | null; height?: number | null }

function variants(media: Media, format: 'avif' | 'webp'): { url: string; width: number }[] {
  const sizes = (media.sizes ?? {}) as Record<string, Size | undefined>
  return VARIANT_WIDTHS.map((w) => sizes[`${format}${w}`])
    .filter((s): s is Size => Boolean(s?.url && s.width))
    .map((s) => ({ url: s.url as string, width: s.width as number }))
}

export type PictureSources = {
  avif: string | null
  webp: string | null
  src: string
  width: number
  height: number
}

/** Sursele unei imagini: `srcset` AVIF și WebP și o rezervă (`src`) pentru browsere vechi. */
export function pictureSources(media: Media, fallbackWidth = 960): PictureSources {
  const width = media.width ?? 0
  const height = media.height ?? 0
  if (media.mimeType === 'image/svg+xml') {
    return { avif: null, webp: null, src: media.url as string, width, height }
  }
  const avif = variants(media, 'avif')
  const webp = variants(media, 'webp')
  const set = (list: { url: string; width: number }[]) =>
    list.length ? list.map((s) => `${s.url} ${s.width}w`).join(', ') : null
  // Rezerva: cea mai mică variantă WebP de cel puțin `fallbackWidth`, altfel cea mai mare existentă.
  const fallback =
    webp.find((s) => s.width >= fallbackWidth) ?? webp[webp.length - 1] ?? { url: media.url as string }
  return { avif: set(avif), webp: set(webp), src: fallback.url as string, width, height }
}

/** Punctul focal ales în panou, pentru `object-position`. */
export function focalPosition(media: Media): string | undefined {
  if (media.focalX == null || media.focalY == null) return undefined
  return `${media.focalX}% ${media.focalY}%`
}

/** Clipul hero: varianta eficientă întâi (AV1, HEVC sau VP9), apoi H.264 (ADR-005, D-35). */
export function videoSources(clip: Media): { src: string; type: string }[] {
  const out: { src: string; type: string }[] = []
  const eff = asMedia(clip.efficientVariant)
  if (eff?.url) {
    const codec = String(eff.codec ?? '').toLowerCase()
    const type =
      codec === 'av1'
        ? 'video/mp4; codecs="av01.0.08M.08"'
        : codec === 'hevc'
          ? 'video/mp4; codecs="hvc1"'
          : codec === 'vp9'
            ? 'video/webm; codecs="vp9"'
            : (eff.mimeType ?? 'video/mp4')
    out.push({ src: eff.url, type })
  }
  if (clip.url) out.push({ src: clip.url, type: 'video/mp4; codecs="avc1.640028"' })
  return out
}
