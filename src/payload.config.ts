import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { parseFromAddress } from './lib/email'

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

const from = parseFromAddress(process.env.EMAIL_FROM)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Supabase: șirul de conectare prin pooler (ADR-003).
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
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
    // Supabase Storage prin API-ul compatibil S3, încărcare directă din browser (ADR-003).
    // Fără variabilele S3 (dezvoltare locală), fișierele rămân pe disc.
    s3Storage({
      enabled: s3Ready,
      alwaysInsertFields: true,
      clientUploads: true,
      collections: {
        media: true,
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
