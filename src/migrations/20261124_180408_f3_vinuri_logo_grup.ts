import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "wines" ADD COLUMN "appellation" varchar;
  ALTER TABLE "settings" ADD COLUMN "logo_group_dark_id" integer;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_group_dark_id_media_id_fk" FOREIGN KEY ("logo_group_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "settings_logo_group_dark_idx" ON "settings" USING btree ("logo_group_dark_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" DROP CONSTRAINT "settings_logo_group_dark_id_media_id_fk";
  
  DROP INDEX "settings_logo_group_dark_idx";
  ALTER TABLE "wines" DROP COLUMN "appellation";
  ALTER TABLE "settings" DROP COLUMN "logo_group_dark_id";`)
}
