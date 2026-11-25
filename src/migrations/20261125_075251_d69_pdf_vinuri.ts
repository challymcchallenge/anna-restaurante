import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_media_kind" ADD VALUE 'document' BEFORE 'video-variant';
  ALTER TABLE "home_page" ADD COLUMN "wines_pdf_id" integer;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_wines_pdf_id_media_id_fk" FOREIGN KEY ("wines_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_wines_wines_pdf_idx" ON "home_page" USING btree ("wines_pdf_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" DROP CONSTRAINT "home_page_wines_pdf_id_media_id_fk";
  
  ALTER TABLE "media" ALTER COLUMN "kind" SET DATA TYPE text;
  ALTER TABLE "media" ALTER COLUMN "kind" SET DEFAULT 'photo'::text;
  DROP TYPE "public"."enum_media_kind";
  CREATE TYPE "public"."enum_media_kind" AS ENUM('photo', 'clip', 'logo', 'badge', 'video-variant', 'video-poster');
  ALTER TABLE "media" ALTER COLUMN "kind" SET DEFAULT 'photo'::"public"."enum_media_kind";
  ALTER TABLE "media" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_media_kind" USING "kind"::"public"."enum_media_kind";
  DROP INDEX "home_page_wines_wines_pdf_idx";
  ALTER TABLE "home_page" DROP COLUMN "wines_pdf_id";`)
}
