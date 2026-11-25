import {
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type {
  CheckboxField,
  Field,
  RichTextField,
  SelectField,
  TextField,
  TextareaField,
  UploadField,
  Validate,
  Where,
} from 'payload'
import { upload as defaultUploadValidate } from 'payload/shared'

/**
 * Helperi pentru câmpurile din content-model.md.
 * - `localized: true` = „se traduce” (D-28, ADR-007); restul = „nu se traduce” (NT).
 * - `max` = limita de caractere: panoul arată un contor și nu lasă depășirea (content-model 1).
 */

const COUNTED_TEXT = '/components/admin/CountedField#CountedTextField'
const COUNTED_TEXTAREA = '/components/admin/CountedField#CountedTextareaField'

export const NT_NOTE = 'Nu se traduce: aceeași valoare în toate limbile.'

type BaseOpts = {
  name: string
  label: string
  required?: boolean
  /** „se traduce” */
  localized?: boolean
  /** „nu se traduce”: adaugă mențiunea în descriere */
  nt?: boolean
  description?: string
  defaultValue?: string
  condition?: (data: any, siblingData: any) => boolean
  validate?: Validate
  readOnly?: boolean
  width?: string
}

const describe = (o: BaseOpts) =>
  [o.description, o.nt ? NT_NOTE : undefined].filter(Boolean).join(' ') || undefined

/** Un `validate` propriu înlocuiește validarea implicită: păstrăm obligatoriu + limita. */
const withBasics = (o: BaseOpts & { max?: number }) =>
  o.validate
    ? ((value: unknown, args: any) => {
        if (o.required && (value === undefined || value === null || value === '')) {
          return 'Câmpul este obligatoriu.'
        }
        if (o.max && typeof value === 'string' && value.length > o.max) {
          return `Cel mult ${o.max} caractere.`
        }
        return (o.validate as any)(value, args)
      })
    : undefined

export const text = (o: BaseOpts & { max?: number }): TextField => ({
  name: o.name,
  label: o.label,
  type: 'text',
  required: o.required,
  localized: o.localized,
  maxLength: o.max,
  defaultValue: o.defaultValue,
  validate: withBasics(o) as any,
  admin: {
    description: describe(o),
    condition: o.condition,
    readOnly: o.readOnly,
    width: o.width,
    components: o.max ? { Field: COUNTED_TEXT } : undefined,
  },
})

export const textarea = (o: BaseOpts & { max?: number }): TextareaField => ({
  name: o.name,
  label: o.label,
  type: 'textarea',
  required: o.required,
  localized: o.localized,
  maxLength: o.max,
  defaultValue: o.defaultValue,
  validate: withBasics(o) as any,
  admin: {
    description: describe(o),
    condition: o.condition,
    readOnly: o.readOnly,
    components: o.max ? { Field: COUNTED_TEXTAREA } : undefined,
  },
})

/** Lungimea textului vizibil dintr-un document Lexical. */
export function lexicalTextLength(value: unknown): number {
  let total = 0
  const walk = (node: any) => {
    if (!node || typeof node !== 'object') return
    if (typeof node.text === 'string') total += node.text.length
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk((value as any)?.root)
  return total
}

/**
 * „Text formatat”: doar aldin, cursiv, legătură, listă (content-model 1).
 * La paginile legale sunt permise și titluri de secțiune (5.12).
 */
export const richText = (o: BaseOpts & { max?: number; headings?: boolean }): RichTextField => ({
  name: o.name,
  label: o.label,
  type: 'richText',
  // Obligatoriu doar în română (limba de bază); validat mai jos, nu prin NOT NULL în baza de date.
  localized: o.localized,
  editor: lexicalEditor({
    features: [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      LinkFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      ...(o.headings ? [HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] })] : []),
    ],
  }),
  validate: ((value: unknown, args: any) => {
    if (o.required && lexicalTextLength(value) === 0 && args?.req?.locale === 'ro') {
      return 'Câmpul este obligatoriu.'
    }
    if (o.max && lexicalTextLength(value) > o.max) {
      return `Textul are ${lexicalTextLength(value)} caractere; limita este ${o.max}.`
    }
    return true
  }) as RichTextField['validate'],
  admin: {
    description: [
      o.required ? 'Obligatoriu.' : undefined,
      describe(o),
      o.max ? `Cel mult ${o.max} caractere.` : undefined,
    ]
      .filter(Boolean)
      .join(' '),
    condition: o.condition,
  },
})

/** Câmp obligatoriu, dar care poate rămâne gol cât timp elementul este „Provizoriu” (D-08). */
export const requiredUnlessPlaceholder =
  (
    message = 'Obligatoriu. Dacă nu ai încă materialul, bifează „Provizoriu”.',
  ): ((value: unknown, args: any) => true | string) =>
  (value, args) => {
    const placeholder = Boolean(args?.siblingData?.placeholder ?? args?.data?.placeholder)
    const empty =
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    return !empty || placeholder ? true : message
  }

/** Formatele de fotografie din content-model 1 (afișate ca indicație lângă câmp). */
export const PHOTO_FORMATS = {
  'HERO-L': 'HERO-L · 16:9 · minimum 2400 × 1350 px',
  'HERO-P': 'HERO-P · 9:16 · minimum 1080 × 1920 px',
  'CARD-P': 'CARD-P · 4:5 · minimum 1080 × 1350 px',
  'CARD-L': 'CARD-L · 3:2 · minimum 1800 × 1200 px',
  GAL: 'GAL · format liber · minimum 1600 px pe latura lungă',
  SHARE: 'SHARE · 1,91:1 · minimum 1200 × 630 px',
  LOGO: 'LOGO · SVG; dacă nu există, PNG transparent de minimum 600 px lățime',
  BADGE: 'BADGE · fișierul oficial, nemodificat',
} as const

export type PhotoFormat = keyof typeof PHOTO_FORMATS

type MediaKind = 'photo' | 'clip' | 'logo' | 'badge'

/** Referință către Biblioteca media, filtrată pe tipul de fișier. */
export const media = (
  o: Omit<BaseOpts, 'localized' | 'nt' | 'defaultValue'> & {
    format?: PhotoFormat
    kinds?: MediaKind[]
    hasMany?: boolean
    minRows?: number
    maxRows?: number
    /** obligatoriu, cu excepția elementelor provizorii */
    requiredUnlessPlaceholder?: boolean
    /** Clipurile mai lungi nu se pot alege aici (de exemplu hero-ul de pe Acasă, D-61). */
    maxClipSeconds?: number
  },
): UploadField => {
  const kinds = o.kinds ?? ['photo']
  const softRequired = o.requiredUnlessPlaceholder ? requiredUnlessPlaceholder() : undefined
  const filterOptions: Where = o.maxClipSeconds
    ? {
        and: [
          { kind: { in: kinds } },
          { or: [{ kind: { not_equals: 'clip' } }, { durationSeconds: { less_than_equal: o.maxClipSeconds + 0.5 } }] },
        ],
      }
    : { kind: { in: kinds } }
  const base = {
    name: o.name,
    label: o.label,
    type: 'upload' as const,
    relationTo: 'media' as const,
    required: o.required,
    filterOptions,
    admin: {
      description:
        [o.format ? PHOTO_FORMATS[o.format] : undefined, o.description].filter(Boolean).join(' · ') ||
        undefined,
      condition: o.condition,
    },
    validate: (async (value: unknown, args: any) => {
      const result = await (defaultUploadValidate as any)(value, args)
      if (result !== true) return result
      if (softRequired) {
        const soft = softRequired(value, args)
        if (soft !== true) return soft
      }
      if (o.maxClipSeconds && value) {
        const ids = (Array.isArray(value) ? value : [value]).map((v) => (typeof v === 'object' && v ? (v as { id: number }).id : v))
        for (const id of ids) {
          const doc = await args.req.payload.findByID({ collection: 'media', id, depth: 0, req: args.req }).catch(() => null)
          if (doc?.kind === 'clip' && Number(doc.durationSeconds) > o.maxClipSeconds + 0.5) {
            return `Aici intră doar clipuri de cel mult ${o.maxClipSeconds} s (acesta are ${Number(doc.durationSeconds).toFixed(0)} s). Clipurile lungi se folosesc pe paginile proprii (D-61).`
          }
        }
      }
      if (o.validate) return (o.validate as any)(value, args)
      return true
    }) as UploadField['validate'],
  }
  if (o.hasMany) {
    return { ...base, hasMany: true, minRows: o.minRows, maxRows: o.maxRows } as UploadField
  }
  return base as UploadField
}

/** Câmpurile comune tuturor elementelor de conținut (content-model 1). */
export const contentFlags = (): CheckboxField[] => [
  {
    name: 'active',
    label: 'Activ',
    type: 'checkbox',
    defaultValue: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Oprit = nu apare pe site, dar rămâne în panou.',
    },
  },
  {
    name: 'placeholder',
    label: 'Provizoriu',
    type: 'checkbox',
    defaultValue: false,
    index: true,
    admin: {
      position: 'sidebar',
      description:
        'Pornit = pe site apare eticheta „Exemplu · de înlocuit”; intră în contorul din Tabloul de bord (D-08).',
    },
  },
]

/** Pentru secțiunile paginii Acasă: aceleași bife, în interiorul secțiunii. */
export const sectionFlags = (): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'enabled',
        label: 'Pornită',
        type: 'checkbox',
        defaultValue: true,
        admin: { description: 'Oprită = secțiunea dispare de pe Acasă și din meniu.' },
      },
      {
        name: 'placeholder',
        label: 'Provizoriu',
        type: 'checkbox',
        defaultValue: false,
        admin: { description: 'Pornit = textele sunt exemple, de înlocuit (D-08).' },
      },
      {
        name: 'order',
        label: 'Ordine',
        type: 'number',
        min: 0,
        admin: { width: '120px' },
      },
    ],
  },
  text({ name: 'menuLabel', label: 'Etichetă în meniu', max: 20, localized: true }),
]

export const select = (
  o: Omit<BaseOpts, 'localized' | 'nt' | 'defaultValue'> & {
    options: { value: string; label: string }[]
    defaultValue?: string | string[]
    hasMany?: boolean
  },
): SelectField =>
  ({
    name: o.name,
    label: o.label,
    type: 'select',
    required: o.required,
    hasMany: o.hasMany,
    options: o.options,
    defaultValue: o.defaultValue,
    admin: { description: o.description, condition: o.condition, width: o.width },
  }) as SelectField

const URL_RE = /^https?:\/\/[^\s/$.?#].[^\s]*$/i

export const validateUrl = (value: unknown): true | string =>
  !value || (typeof value === 'string' && URL_RE.test(value))
    ? true
    : 'Adresă invalidă. Exemplu: https://www.exemplu.ro'

export const url = (o: Omit<BaseOpts, 'localized' | 'nt'>): TextField =>
  text({ ...o, validate: o.validate ?? (validateUrl as Validate) })

/** Telefon: cifre, spații, +, cratime și paranteze; minimum 9 cifre. */
/** Telefoanele din panou: cu prefixul internațional (D-52), de exemplu +40 356 630 238. */
export const validatePhone = (value: unknown): true | string => {
  if (!value) return true
  if (typeof value !== 'string' || !/^\+[1-9][\d\s().-]*$/.test(value)) {
    return 'Folosește prefixul internațional. Exemplu: +40 356 630 238'
  }
  const digits = value.replace(/\D/g, '').length
  return digits >= 10 && digits <= 15 ? true : 'Număr prea scurt sau prea lung.'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Listă de adrese de email (cel mult `max`). */
export const emailList = (o: Omit<BaseOpts, 'localized' | 'nt'> & { max: number }): TextField =>
  ({
    name: o.name,
    label: o.label,
    type: 'text',
    hasMany: true,
    maxRows: o.max,
    validate: ((value: unknown, args: any) => {
      const list = Array.isArray(value) ? value : []
      const bad = list.find((v) => typeof v !== 'string' || !EMAIL_RE.test(v))
      if (bad) return `Adresă de email invalidă: ${String(bad)}`
      if (list.length > o.max) return `Cel mult ${o.max} adrese.`
      if (o.validate) return (o.validate as any)(value, args)
      return true
    }) as TextField['validate'],
    admin: { description: o.description, condition: o.condition },
  }) as TextField

/** Culoare în format #RRGGBB. */
export const validateHexColor = (value: unknown): true | string =>
  !value || (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value))
    ? true
    : 'Culoare invalidă. Format: #RRGGBB, de exemplu #1B1B1B.'

/** Raportul de contrast WCAG între două culori #RRGGBB. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, b2] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    const ch = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b2)
  }
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
