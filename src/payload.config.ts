import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { ro } from '@payloadcms/translations/languages/ro'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { adminOnlyField, isAdmin } from './access/roles'
import { Awards, Redirects, Submissions } from './collections/AdminAreas'
import {
  ComplaintReasons,
  DishCategories,
  Faqs,
  Gallery,
  GalleryCategories,
  GroupLinks,
  LegalPages,
} from './collections/Catalog'
import { Events } from './collections/Events'
import { HomePage } from './collections/HomePage'
import { Media } from './collections/Media'
import { Reviews } from './collections/Reviews'
import { Settings } from './collections/Settings'
import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { RoomTypes, Salons } from './collections/Venues'
import { Wines } from './collections/Wines'
import { parseFromAddress } from './lib/email'
import { DEFAULT_LOCALE, LOCALES } from './lib/locales'
import { publicFileUrl, supabasePublicBase } from './lib/media/publicUrl'
import { withSiteRevalidation } from './lib/site/revalidate'
import { withTranslation } from './lib/translate/collection'
import { translateEndpoint } from './lib/translate/endpoint'
import type { Config } from './payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Variabilele de mediu: numele vin din .env.example (ADR-003, ADR-009). Valorile le pune Alin.
const s3Ready = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ENDPOINT &&
    process.env.S3_REGION &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
)

const mediaPublicBase = supabasePublicBase(process.env.S3_ENDPOINT, process.env.S3_BUCKET)

const from = parseFromAddress(process.env.EMAIL_FROM)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · Panou ANNA' },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // Tabloul de bord (S-12): conținut provizoriu rămas și serile apropiate.
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
    },
  },
  // Panoul în română (F1). Limba interfeței; conținutul are limbile lui (localization).
  i18n: {
    supportedLanguages: { ro },
    fallbackLanguage: 'ro',
    // Corecturi la traducerea oficială Payload („Localitate” înseamnă oraș, nu limbă).
    translations: {
      ro: { general: { locale: 'Limba conținutului', locales: 'Limbi' } } as any,
    },
  },
  // Texte pe limbi (D-28, ADR-007). Româna e implicită; unde lipsește traducerea, se afișează româna.
  localization: {
    locales: LOCALES.map((l) => ({ code: l.code, label: l.label })),
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  // Tot ce apare pe site golește cache-ul site-ului public la salvare (F3, src/lib/site/revalidate.ts).
  // Colecțiile cu texte „se traduce” primesc starea traducerii și retraducerea automată (F4).
  collections: [
    ...[
      HomePage,
      Events,
      DishCategories,
      Wines,
      Reviews,
      Salons,
      RoomTypes,
      Gallery,
      GalleryCategories,
      Faqs,
      ComplaintReasons,
      GroupLinks,
      LegalPages,
      Media,
    ]
      .map(withTranslation)
      .map(withSiteRevalidation),
    Submissions,
    ...[Settings, Awards, Redirects, Tenants].map(withTranslation).map(withSiteRevalidation),
    Users,
  ],
  editor: lexicalEditor(),
  // Traducerile din panou (F4, D-64): /api/translate.
  endpoints: [translateEndpoint],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Clipurile convertite ajung la ~12 MB (F0); 50 MB acoperă un clip de 30 s cu marjă.
  upload: { limits: { fileSize: 50_000_000 } },
  db: postgresAdapter({
    // Supabase: șirul de conectare prin Shared pooler (ADR-003).
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Schema se schimbă doar prin migrații (src/migrations), la fel local și în producție.
    push: false,
  }),
  // Fără RESEND_API_KEY, Payload doar afișează emailurile în consolă (dezvoltare locală).
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: from.address,
        defaultFromName: from.name,
      })
    : undefined,
  sharp,
  plugins: [
    // Un panou, mai multe restaurante, separate complet (ADR-002, D-12).
    multiTenantPlugin<Config>({
      tenantsSlug: 'tenants',
      collections: {
        'home-page': { isGlobal: true },
        settings: { isGlobal: true },
        events: {},
        'dish-categories': {},
        wines: {},
        reviews: {},
        salons: {},
        'room-types': {},
        gallery: {},
        'gallery-categories': {},
        faqs: {},
        'complaint-reasons': {},
        'group-links': {},
        'legal-pages': {},
        media: {},
        submissions: {},
        awards: {},
        redirects: {},
      },
      // Administratorul vede toate restaurantele.
      userHasAccessToAllTenants: (user) => isAdmin(user),
      tenantsArrayField: {
        includeDefaultField: true,
        // Doar Administratorul atribuie restaurante; un Editor nu se poate adăuga singur la altul.
        arrayFieldAccess: { create: adminOnlyField, update: adminOnlyField },
        tenantFieldAccess: { create: adminOnlyField, update: adminOnlyField },
      },
      i18n: {
        translations: {
          ro: {
            'nav-tenantSelector-label': 'Restaurant',
            'assign-tenant-button-label': 'Mută la alt restaurant',
            'assign-tenant-modal-title': 'Mută „{{title}}”',
            'field-assignedTenant-label': 'Restaurant',
          },
        },
      },
    }),
    // Supabase Storage prin API-ul compatibil S3, încărcare directă din browser (ADR-003).
    // Fișierele se servesc direct din URL-ul public Supabase (F1). Fără variabilele S3
    // (dezvoltare locală), fișierele rămân pe disc.
    s3Storage({
      enabled: s3Ready,
      alwaysInsertFields: true,
      clientUploads: true,
      collections: {
        media: mediaPublicBase
          ? {
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename: file, prefix }) =>
                publicFileUrl(mediaPublicBase, file, prefix),
            }
          : true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
