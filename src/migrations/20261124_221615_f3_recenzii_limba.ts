import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reviews_language" AS ENUM('ro', 'en', 'it', 'fr', 'de', 'sv', 'zh');
  ALTER TABLE "reviews" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "reviews" ADD COLUMN "language" "enum_reviews_language" DEFAULT 'ro' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "reviews" DROP COLUMN "language";
  DROP TYPE "public"."enum_reviews_language";`)
}
