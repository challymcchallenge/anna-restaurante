import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Marcajul „conținut de pornire aplicat” pe restaurant (vezi src/seed/starter.ts). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenants" ADD COLUMN "starter_content_at" timestamp(3) with time zone;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenants" DROP COLUMN IF EXISTS "starter_content_at";`)
}
