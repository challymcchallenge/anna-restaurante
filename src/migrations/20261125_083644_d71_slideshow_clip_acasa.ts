import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" ADD COLUMN "hero_slide_seconds" numeric DEFAULT 3;
  ALTER TABLE "home_page" ADD COLUMN "pizza_video_on_home" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" DROP COLUMN "hero_slide_seconds";
  ALTER TABLE "home_page" DROP COLUMN "pizza_video_on_home";`)
}
