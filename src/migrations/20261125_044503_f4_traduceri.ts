import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_events_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_dish_categories_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_wines_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_reviews_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_salons_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_room_types_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_gallery_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_gallery_categories_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_faqs_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_complaint_reasons_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_legal_pages_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_media_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_settings_i18n_status" AS ENUM('auto', 'verified');
  CREATE TYPE "public"."enum_awards_i18n_status" AS ENUM('auto', 'verified');
  ALTER TABLE "home_page_locales" ADD COLUMN "i18n_status" "enum_home_page_i18n_status";
  ALTER TABLE "home_page_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "i18n_status" "enum_events_i18n_status";
  ALTER TABLE "events_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "dish_categories_locales" ADD COLUMN "i18n_status" "enum_dish_categories_i18n_status";
  ALTER TABLE "dish_categories_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "wines_locales" ADD COLUMN "i18n_status" "enum_wines_i18n_status";
  ALTER TABLE "wines_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "reviews_locales" ADD COLUMN "i18n_status" "enum_reviews_i18n_status";
  ALTER TABLE "reviews_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "salons_locales" ADD COLUMN "i18n_status" "enum_salons_i18n_status";
  ALTER TABLE "salons_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "room_types_locales" ADD COLUMN "i18n_status" "enum_room_types_i18n_status";
  ALTER TABLE "room_types_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "gallery_locales" ADD COLUMN "i18n_status" "enum_gallery_i18n_status";
  ALTER TABLE "gallery_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "gallery_categories_locales" ADD COLUMN "i18n_status" "enum_gallery_categories_i18n_status";
  ALTER TABLE "gallery_categories_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "faqs_locales" ADD COLUMN "i18n_status" "enum_faqs_i18n_status";
  ALTER TABLE "faqs_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "complaint_reasons_locales" ADD COLUMN "i18n_status" "enum_complaint_reasons_i18n_status";
  ALTER TABLE "complaint_reasons_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "legal_pages_locales" ADD COLUMN "i18n_status" "enum_legal_pages_i18n_status";
  ALTER TABLE "legal_pages_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "media_locales" ADD COLUMN "i18n_status" "enum_media_i18n_status";
  ALTER TABLE "media_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "settings_locales" ADD COLUMN "i18n_status" "enum_settings_i18n_status";
  ALTER TABLE "settings_locales" ADD COLUMN "i18n_source" varchar;
  ALTER TABLE "awards_locales" ADD COLUMN "i18n_status" "enum_awards_i18n_status";
  ALTER TABLE "awards_locales" ADD COLUMN "i18n_source" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "home_page_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "events_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "events_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "dish_categories_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "dish_categories_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "wines_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "wines_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "reviews_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "reviews_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "salons_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "salons_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "room_types_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "room_types_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "gallery_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "gallery_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "gallery_categories_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "gallery_categories_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "faqs_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "faqs_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "complaint_reasons_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "complaint_reasons_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "legal_pages_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "legal_pages_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "media_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "media_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "settings_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "settings_locales" DROP COLUMN "i18n_source";
  ALTER TABLE "awards_locales" DROP COLUMN "i18n_status";
  ALTER TABLE "awards_locales" DROP COLUMN "i18n_source";
  DROP TYPE "public"."enum_home_page_i18n_status";
  DROP TYPE "public"."enum_events_i18n_status";
  DROP TYPE "public"."enum_dish_categories_i18n_status";
  DROP TYPE "public"."enum_wines_i18n_status";
  DROP TYPE "public"."enum_reviews_i18n_status";
  DROP TYPE "public"."enum_salons_i18n_status";
  DROP TYPE "public"."enum_room_types_i18n_status";
  DROP TYPE "public"."enum_gallery_i18n_status";
  DROP TYPE "public"."enum_gallery_categories_i18n_status";
  DROP TYPE "public"."enum_faqs_i18n_status";
  DROP TYPE "public"."enum_complaint_reasons_i18n_status";
  DROP TYPE "public"."enum_legal_pages_i18n_status";
  DROP TYPE "public"."enum_media_i18n_status";
  DROP TYPE "public"."enum_settings_i18n_status";
  DROP TYPE "public"."enum_awards_i18n_status";`)
}
