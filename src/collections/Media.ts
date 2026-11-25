import type { CollectionConfig, ImageSize } from 'payload'
import { APIError } from 'payload'

import { authenticated } from '../access/roles'
import { text } from '../fields'

/**
 * Biblioteca media (content-model 6, ADR-004, ADR-005, D-07, D-24, D-27).
 *
 * Fluxul (design/flows/flow-incarcare-media.mmd):
 * 1. În panou, butonul „Alege și convertește” (MediaUploadControl) convertește fișierul în browser:
 *    fotografie → master JPEG de cel mult 2560 px (HEIC prin heic-to); logo → PNG/SVG, fără JPEG;
 *    BADGE → neatins; clip → MP4 H.264 + variantă eficientă (AV1/HEVC) + poster, maximum 120 s (D-61).
 * 2. Fișierul convertit urcă direct în Supabase Storage (clientUploads, ADR-003).
 * 3. Serverul generează variantele AVIF q55 e2 + WebP q78 e4, pe 5 lățimi (actualizarea ADR-004).
 * Originalul nu urcă niciodată pe server (D-27).
 */

export const MEDIA_KINDS = [
  { value: 'photo', label: 'Fotografie' },
  { value: 'clip', label: 'Clip video' },
  { value: 'logo', label: 'Logo' },
  { value: 'badge', label: 'Logo oficial de premiu (BADGE)' },
  { value: 'video-variant', label: 'Variantă video (automată)' },
  { value: 'video-poster', label: 'Imagine de început a unui clip (automată)' },
] as const

export type MediaKind = (typeof MEDIA_KINDS)[number]['value']

/** Lățimile variantelor (actualizarea ADR-004 după F0). */
export const VARIANT_WIDTHS = [640, 960, 1280, 1920, 2560] as const

/** Latura maximă a masterului (ADR-004). */
export const MASTER_MAX_SIDE = 2560

/** Durata maximă a unui clip, în secunde (D-24, mărită la 120 s prin D-61). */
export const CLIP_MAX_SECONDS = 120

/** Clipurile din hero-ul de pe Acasă: cel mult atât, ca prima pagină să se încarce repede (D-61). */
export const HERO_CLIP_MAX_SECONDS = 30

const hideSize: ImageSize['admin'] = {
  disableGroupBy: true,
  disableListColumn: true,
  disableListFilter: true,
}

const imageSizes: ImageSize[] = VARIANT_WIDTHS.flatMap((width) => [
  {
    name: `avif${width}`,
    width,
    fit: 'inside',
    formatOptions: { format: 'avif', options: { quality: 55, effort: 2 } },
    admin: hideSize,
  },
  {
    name: `webp${width}`,
    width,
    fit: 'inside',
    formatOptions: { format: 'webp', options: { quality: 78, effort: 4 } },
    admin: hideSize,
  },
])

const ALLOWED: Record<MediaKind, string[]> = {
  photo: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  logo: ['image/png', 'image/svg+xml', 'image/webp'],
  badge: ['image/png', 'image/svg+xml', 'image/jpeg', 'image/webp'],
  clip: ['video/mp4', 'video/webm'],
  'video-variant': ['video/mp4', 'video/webm'],
  'video-poster': ['image/jpeg', 'image/webp'],
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Fișier media', plural: 'Bibliotecă media' },
  admin: {
    group: 'Conținut',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'kind', 'alt', 'filesize', 'updatedAt'],
    description:
      'Păstrează originalul la tine; pe site rămâne doar varianta optimizată (D-27). Folosește butonul „Alege și convertește”.',
    // Variantele video și imaginile de început se creează automat și nu se aleg separat.
    baseFilter: () => ({ kind: { not_in: ['video-variant', 'video-poster'] } }),
  },
  access: {
    // Fișierele sunt publice pe site; pluginul multi-tenant restrânge panoul pe restaurant.
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    // Fără limită de mărime în browser pentru original; pe server ajung doar variantele (D-27).
    mimeTypes: [...new Set(Object.values(ALLOWED).flat())],
    imageSizes,
    adminThumbnail: ({ doc }) => {
      const sizes = (doc as any)?.sizes
      return sizes?.webp640?.url || (doc as any)?.url || null
    },
    focalPoint: true,
    crop: false,
    bulkUpload: false,
    pasteURL: false,
    admin: {
      components: {
        controls: ['/components/admin/media/MediaUploadControl#MediaUploadControl'],
      },
    },
  },
  hooks: {
    beforeChange: [
      // Gardă pe server: refuză originalele neconvertite și formatele nepotrivite tipului ales.
      ({ data, req }) => {
        if (!req.file && !data?.mimeType) return data
        const kind = (data?.kind ?? 'photo') as MediaKind
        const mime = String(data?.mimeType ?? req.file?.mimetype ?? '')
        const allowed = ALLOWED[kind] ?? []
        if (mime && !allowed.includes(mime)) {
          throw new APIError(
            `Tipul „${MEDIA_KINDS.find((k) => k.value === kind)?.label}” nu acceptă fișiere ${mime}. Folosește butonul „Alege și convertește”.`,
            400,
            undefined,
            true,
          )
        }
        const w = Number(data?.width) || 0
        const h = Number(data?.height) || 0
        if ((kind === 'photo' || kind === 'logo') && Math.max(w, h) > MASTER_MAX_SIDE) {
          throw new APIError(
            `Imaginea are ${w} × ${h} px; limita este ${MASTER_MAX_SIDE} px pe latura lungă. Folosește butonul „Alege și convertește”, care o micșorează în browser.`,
            400,
            undefined,
            true,
          )
        }
        if (kind === 'clip' && Number(data?.durationSeconds) > CLIP_MAX_SECONDS + 0.5) {
          throw new APIError(
            `Clipul are ${Number(data?.durationSeconds).toFixed(1)} s; limita este ${CLIP_MAX_SECONDS} s.`,
            400,
            undefined,
            true,
          )
        }
        return data
      },
    ],
    afterChange: [
      // Leagă variantele de clipul lor, ca să fie șterse odată cu el.
      async ({ doc, req }) => {
        if (doc?.kind !== 'clip') return doc
        const ids = [doc.efficientVariant, doc.poster]
          .map((v: any) => (v && typeof v === 'object' ? v.id : v))
          .filter(Boolean)
        if (ids.length === 0) return doc
        await req.payload.update({
          collection: 'media',
          where: { and: [{ id: { in: ids } }, { variantOf: { exists: false } }] },
          data: { variantOf: doc.id },
          req,
          overrideAccess: true,
        })
        return doc
      },
    ],
    afterDelete: [
      // Ștergerea unui clip șterge și variantele lui (varianta eficientă, imaginea de început).
      async ({ doc, req }) => {
        if (doc?.kind !== 'clip') return
        await req.payload.delete({
          collection: 'media',
          where: { variantOf: { equals: doc.id } },
          req,
          overrideAccess: true,
        })
      },
    ],
  },
  fields: [
    {
      name: 'kind',
      label: 'Tip',
      type: 'select',
      required: true,
      defaultValue: 'photo',
      index: true,
      options: MEDIA_KINDS.map((k) => ({ value: k.value, label: k.label })),
      admin: {
        position: 'sidebar',
        description:
          'Se completează la încărcare. Logo: PNG sau SVG, fără conversie în JPEG. BADGE: fișierul oficial, neatins.',
      },
    },
    {
      name: 'alt',
      label: 'Text alternativ',
      type: 'text',
      localized: true,
      maxLength: 140,
      admin: {
        description:
          'Ce se vede în imagine, pentru cititoarele de ecran și Google. Obligatoriu la fotografii și clipuri.',
        components: { Field: '/components/admin/CountedField#CountedTextField' },
      },
      validate: ((value: unknown, { siblingData, req }: any) => {
        const kind = siblingData?.kind ?? 'photo'
        const needsAlt = kind === 'photo' || kind === 'clip'
        if (needsAlt && (req?.locale ?? 'ro') === 'ro' && !value) {
          return 'Fără text alternativ, fișierul nu poate fi salvat.'
        }
        if (typeof value === 'string' && value.length > 140) return 'Cel mult 140 de caractere.'
        return true
      }) as any,
    },
    text({ name: 'title', label: 'Titlu intern', max: 60, nt: true, description: 'Doar pentru căutare în panou.' }),
    text({ name: 'credit', label: 'Credit foto', max: 60, nt: true }),
    {
      type: 'row',
      fields: [
        {
          name: 'hasChildren',
          label: 'Sunt copii în imagine',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'parentalConsent',
          label: 'Acordul părinților confirmat',
          type: 'checkbox',
          defaultValue: false,
          admin: { condition: (_, sibling) => Boolean(sibling?.hasChildren) },
          validate: ((value: unknown, { siblingData }: any) =>
            !siblingData?.hasChildren || value === true
              ? true
              : 'Bifează după ce ai acordul părinților (Q-25). Fără el, fișierul nu se salvează.') as any,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Detalii de conversie (se completează automat)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'originalName',
          label: 'Fișierul inițial',
          type: 'text',
          admin: { readOnly: true, description: 'Rămâne la tine; nu a urcat pe server.' },
        },
        {
          name: 'originalBytes',
          label: 'Mărimea inițială (octeți)',
          type: 'number',
          admin: { readOnly: true },
        },
        {
          name: 'durationSeconds',
          label: 'Durata clipului (s)',
          type: 'number',
          admin: { readOnly: true, condition: (data) => data?.kind === 'clip' },
        },
        {
          name: 'efficientVariant',
          label: 'Variantă video eficientă',
          type: 'upload',
          relationTo: 'media',
          admin: { readOnly: true, condition: (data) => data?.kind === 'clip' },
        },
        {
          name: 'poster',
          label: 'Imaginea de început',
          type: 'upload',
          relationTo: 'media',
          admin: { readOnly: true, condition: (data) => data?.kind === 'clip' },
        },
        {
          name: 'codec',
          label: 'Codec',
          type: 'text',
          admin: { readOnly: true, condition: (data) => data?.kind !== 'photo' },
        },
        {
          name: 'variantOf',
          label: 'Variantă a clipului',
          type: 'relationship',
          relationTo: 'media',
          index: true,
          admin: { readOnly: true, condition: (data) => Boolean(data?.variantOf) },
        },
      ],
    },
  ],
}

