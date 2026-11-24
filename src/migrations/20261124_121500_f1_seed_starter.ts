import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedStarterContent } from '../seed/starter'

/**
 * Conținutul de pornire din `seed/*.json` (F1): doar pentru restaurantele care există și doar
 * acolo unde nu au încă elemente. Totul e marcat „Provizoriu”, cu excepția faptelor din DECISIONS.md.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await seedStarterContent({ payload, req })
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Conținutul se șterge din panou, nu prin migrație: poate fi deja editat de om.
}
