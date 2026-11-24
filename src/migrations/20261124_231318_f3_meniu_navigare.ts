import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_settings_navigation_target" AS ENUM('stay', 'kitchen', 'wines', 'reviews', 'parties', 'privateEvents', 'pizza', 'hotel', 'gallery', 'contact', 'pagePrivateEvents', 'pageParties', 'pagePizza', 'pageGallery', 'pageWines', 'pageContact');
  CREATE TYPE "public"."enum_settings_navigation_display" AS ENUM('header', 'more', 'hidden');
  CREATE TABLE "settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target" "enum_settings_navigation_target" NOT NULL,
  	"display" "enum_settings_navigation_display" DEFAULT 'header' NOT NULL
  );
  
  CREATE TABLE "settings_navigation_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "settings_navigation" ADD CONSTRAINT "settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_navigation_locales" ADD CONSTRAINT "settings_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings_navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "settings_navigation_order_idx" ON "settings_navigation" USING btree ("_order");
  CREATE INDEX "settings_navigation_parent_id_idx" ON "settings_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "settings_navigation_locales_locale_parent_id_unique" ON "settings_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "settings_navigation_locales_parent_id_idx" ON "settings_navigation_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "settings_navigation" CASCADE;
  DROP TABLE "settings_navigation_locales" CASCADE;
  DROP TYPE "public"."enum_settings_navigation_target";
  DROP TYPE "public"."enum_settings_navigation_display";`)
}
