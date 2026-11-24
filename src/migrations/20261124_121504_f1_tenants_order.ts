import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { generateNKeysBetween } from 'payload/shared'

import { enableRowLevelSecurity } from '../lib/db/rls'

/**
 * Restaurantele primesc ordine manuală (F1). Ordinea inițială = ordinea creării, ca după
 * autentificare comutatorul să aleagă primul restaurant creat, nu primul în ordine alfabetică.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenants" ADD COLUMN "_order" varchar;
  CREATE INDEX "tenants__order_idx" ON "tenants" USING btree ("_order");`)

  const result = (await db.execute(sql`SELECT "id" FROM "tenants" ORDER BY "id"`)) as { rows: { id: number }[] }
  const keys = generateNKeysBetween(null, null, result.rows.length)
  for (const [index, row] of result.rows.entries()) {
    await db.execute(sql`UPDATE "tenants" SET "_order" = ${keys[index]} WHERE "id" = ${row.id}`)
  }

  await enableRowLevelSecurity(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "tenants__order_idx";
  ALTER TABLE "tenants" DROP COLUMN IF EXISTS "_order";`)
}
