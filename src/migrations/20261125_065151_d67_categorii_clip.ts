import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * D-67 (scrisă de mână peste cea generată, care ar fi pierdut numele categoriilor):
 * - „Clip principal” la cursul de pizza (`pizza_video_id`);
 * - G11-2: numele categoriei de preparate devine traductibil. Numele existent se copiază întâi în
 *   rândurile pe limbi (inclusiv un rând „ro” unde lipsește), apoi coloana veche se șterge.
 *   În celelalte limbi, numele se retraduce la build (scripts/translate-repair.ts).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_page" ADD COLUMN "pizza_video_id" integer;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_pizza_video_id_media_id_fk" FOREIGN KEY ("pizza_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_pizza_pizza_video_idx" ON "home_page" USING btree ("pizza_video_id");

  ALTER TABLE "dish_categories_locales" ADD COLUMN "name" varchar;
  INSERT INTO "dish_categories_locales" ("_locale", "_parent_id")
    SELECT 'ro', dc."id" FROM "dish_categories" dc
    WHERE NOT EXISTS (
      SELECT 1 FROM "dish_categories_locales" l WHERE l."_parent_id" = dc."id" AND l."_locale" = 'ro'
    );
  UPDATE "dish_categories_locales" l SET "name" = dc."name" FROM "dish_categories" dc WHERE l."_parent_id" = dc."id";
  ALTER TABLE "dish_categories_locales" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "dish_categories" DROP COLUMN "name";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_pizza_video_id_media_id_fk";
  DROP INDEX "home_page_pizza_pizza_video_idx";
  ALTER TABLE "home_page" DROP COLUMN "pizza_video_id";

  ALTER TABLE "dish_categories" ADD COLUMN "name" varchar;
  UPDATE "dish_categories" dc SET "name" = l."name" FROM "dish_categories_locales" l WHERE l."_parent_id" = dc."id" AND l."_locale" = 'ro';
  ALTER TABLE "dish_categories" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "dish_categories_locales" DROP COLUMN "name";`)
}
