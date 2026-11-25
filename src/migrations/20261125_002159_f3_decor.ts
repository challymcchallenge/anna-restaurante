import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_settings_decor_level" AS ENUM('subtle', 'medium', 'visible');
  ALTER TABLE "settings" ADD COLUMN "decor_shapes" boolean DEFAULT true;
  ALTER TABLE "settings" ADD COLUMN "decor_waves" boolean DEFAULT true;
  ALTER TABLE "settings" ADD COLUMN "decor_level" "enum_settings_decor_level" DEFAULT 'subtle';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" DROP COLUMN "decor_shapes";
  ALTER TABLE "settings" DROP COLUMN "decor_waves";
  ALTER TABLE "settings" DROP COLUMN "decor_level";
  DROP TYPE "public"."enum_settings_decor_level";`)
}
