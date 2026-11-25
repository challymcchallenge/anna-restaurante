import { createHash, timingSafeEqual } from 'node:crypto'
import type { Endpoint, Payload } from 'payload'

/**
 * F5 (G7-3, D-59): ștergerea automată a cererilor vechi. Termenul se alege în panou, pe restaurant
 * (Setări → Cereri și emailuri → „Păstrează cererile (luni)”); gol = nu se șterge nimic.
 *
 * Rulează o dată pe zi prin Vercel Cron (`vercel.json` → `crons`), care cheamă `GET /api/cleanup-requests`
 * cu antetul `Authorization: Bearer <CRON_SECRET>` (documentația Vercel „Managing Cron Jobs”,
 * verificat pe 25.11.2026). Fără `CRON_SECRET` în Vercel, adresa răspunde 404 și nu se șterge nimic.
 */

export type CleanupReport = { tenant: number; months: number; before: string; deleted: number }[]

/** Data-limită: cererile trimise înainte de ea se șterg (aceeași zi, cu `months` luni în urmă). */
export function retentionCutoff(months: number, now: Date = new Date()): Date {
  const d = new Date(now)
  d.setUTCMonth(d.getUTCMonth() - months)
  return d
}

export async function cleanupOldRequests(payload: Payload, now: Date = new Date()): Promise<CleanupReport> {
  const { docs: settings } = await payload.find({
    collection: 'settings',
    where: { requestsRetentionMonths: { greater_than: 0 } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })
  const report: CleanupReport = []
  for (const s of settings) {
    const tenant = typeof s.tenant === 'object' && s.tenant ? s.tenant.id : (s.tenant as number)
    const months = Number(s.requestsRetentionMonths)
    if (!tenant || !Number.isFinite(months) || months < 1) continue
    const before = retentionCutoff(months, now).toISOString()
    const { docs } = await payload.delete({
      collection: 'submissions',
      where: { and: [{ tenant: { equals: tenant } }, { createdAt: { less_than: before } }] },
      overrideAccess: true,
      depth: 0,
    })
    report.push({ tenant, months, before, deleted: docs.length })
  }
  return report
}

/** Antetul trimis de Vercel Cron, comparat în timp constant. */
export function cronAuthOk(header: string | null | undefined, secret = process.env.CRON_SECRET): boolean {
  if (!secret || secret.length < 16 || !header) return false
  const a = createHash('sha256').update(header).digest()
  const b = createHash('sha256').update(`Bearer ${secret}`).digest()
  return timingSafeEqual(a, b)
}

export const cleanupRequestsEndpoint: Endpoint = {
  path: '/cleanup-requests',
  method: 'get',
  handler: async (req) => {
    if (!process.env.CRON_SECRET) return Response.json({ error: 'Not found' }, { status: 404 })
    if (!cronAuthOk(req.headers.get('authorization'))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const report = await cleanupOldRequests(req.payload)
    req.payload.logger.info(`[cereri] ștergerea automată: ${JSON.stringify(report)}`)
    return Response.json({ report })
  },
}
