import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * GATE 1 (24.11.2026):
 * - motivele de sesizare primesc o „Explicație” (cele 9 de pe site-ul actual au titlu + explicație, D-39);
 * - conținutul de pornire ține un jurnal pe colecție (src/seed/starter.ts).
 *
 * Restaurantele care au primit deja conținutul de pornire în F1 primesc în jurnal cele 14 colecții
 * aplicate atunci, ca o colecție golită intenționat din panou să nu fie completată din nou.
 */
const F1_SEEDED = [
  'settings',
  'home-page',
  'gallery-categories',
  'dish-categories',
  'wines',
  'reviews',
  'events',
  'salons',
  'room-types',
  'faqs',
  'group-links',
  'legal-pages',
  'awards',
  'redirects',
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "complaint_reasons_locales" ADD COLUMN "explanation" varchar;
  ALTER TABLE "tenants" ADD COLUMN "starter_content_log" jsonb;`)

  await db.execute(sql`
    UPDATE "tenants"
    SET "starter_content_log" = (
      SELECT jsonb_object_agg(c, to_char("starter_content_at" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
      FROM unnest(${sql.raw(`ARRAY[${F1_SEEDED.map((c) => `'${c}'`).join(', ')}]::text[]`)}) AS c
    )
    WHERE "starter_content_at" IS NOT NULL AND "starter_content_log" IS NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "complaint_reasons_locales" DROP COLUMN IF EXISTS "explanation";
  ALTER TABLE "tenants" DROP COLUMN IF EXISTS "starter_content_log";`)
}
