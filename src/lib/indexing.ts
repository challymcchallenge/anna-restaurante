/**
 * Neindexare în construcție (ADR-012, D-22).
 *
 * Indexarea este permisă DOAR dacă sunt îndeplinite toate condițiile:
 * 1. ALLOW_INDEXING === 'true' (comutator global, „false” până la lansare);
 * 2. cererea vine pe un domeniu propriu, nu pe *.vercel.app și nu pe localhost.
 *
 * Comutatorul pe restaurant („Indexare de către Google”, content-model G1) se adaugă în F1.
 */
export const NOINDEX_VALUE = 'noindex, nofollow'

export function isIndexingAllowed(host: string | null | undefined): boolean {
  if (process.env.ALLOW_INDEXING !== 'true') return false
  if (!host) return false
  const hostname = host.split(':')[0].toLowerCase()
  if (hostname === 'localhost' || hostname === '127.0.0.1') return false
  if (hostname.endsWith('.vercel.app')) return false
  return true
}
