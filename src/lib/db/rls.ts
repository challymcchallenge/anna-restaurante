import { sql } from '@payloadcms/db-postgres'

/**
 * Protecție suplimentară pe Supabase (propunerea din F0, PLAN F1): RLS pornit pe toate tabelele
 * din schema `public`, fără politici. Payload se conectează ca proprietar al tabelelor și nu este
 * afectat; rolurile `anon` și `authenticated` ale API-ului Supabase nu văd niciun rând.
 * Se apelează la sfârșitul fiecărei migrații care creează tabele.
 */
export async function enableRowLevelSecurity(db: { execute: (query: any) => Promise<unknown> }) {
  await db.execute(sql`
    DO $$
    DECLARE t record;
    BEGIN
      FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
      END LOOP;
    END $$;
  `)
}
