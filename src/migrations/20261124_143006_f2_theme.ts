import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_settings_font_heading" AS ENUM('belleza', 'tenor-sans');
  CREATE TYPE "public"."enum_settings_font_text" AS ENUM('hanken-grotesk', 'host-grotesk');
  ALTER TABLE "settings" ADD COLUMN "colors_surface_dark" varchar;
  ALTER TABLE "settings" ADD COLUMN "colors_text_on_dark" varchar;
  ALTER TABLE "settings" ADD COLUMN "font_heading" "enum_settings_font_heading";
  ALTER TABLE "settings" ADD COLUMN "font_text" "enum_settings_font_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" DROP COLUMN "colors_surface_dark";
  ALTER TABLE "settings" DROP COLUMN "colors_text_on_dark";
  ALTER TABLE "settings" DROP COLUMN "font_heading";
  ALTER TABLE "settings" DROP COLUMN "font_text";
  DROP TYPE "public"."enum_settings_font_heading";
  DROP TYPE "public"."enum_settings_font_text";`)
}
