import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" ADD COLUMN "serves_cuisine" varchar;
  ALTER TABLE "settings" ADD COLUMN "price_range" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" DROP COLUMN "serves_cuisine";
  ALTER TABLE "settings" DROP COLUMN "price_range";`)
}
