// @vitest-environment node
import crypto from 'crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { cleanupOldRequests, cleanupRequestsEndpoint, cronAuthOk, retentionCutoff } from '@/lib/requests/cleanup'
import config from '@/payload.config'

/**
 * F5 (G7-3, D-59): cererile mai vechi decât termenul din panou se șterg o dată pe zi. Doar la
 * restaurantul care are termenul completat; fără `CRON_SECRET`, adresa nu răspunde (404).
 */

let payload: Payload
const tag = crypto.randomBytes(4).toString('hex')
const created: { collection: any; id: number }[] = []
let tenantA: number
let tenantB: number
let settingsA: { id: number; requestsRetentionMonths?: number | null }

const make = (tenant: number) =>
  payload.create({
    collection: 'submissions',
    data: { subject: 'question', name: `Vechi ${tag}`, phone: '+40 700 000 000', email: `vechi.${tag}@example.test`, consent: true, tenant } as any,
    overrideAccess: true,
  })

describe('F5 · ștergerea automată a cererilor vechi', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const tenants = await payload.find({ collection: 'tenants', sort: '_order', limit: 1 })
    tenantA = tenants.docs[0].id as number
    const b = await payload.create({ collection: 'tenants', data: { name: `Test B ${tag}`, slug: `test-b-${tag}` } as any })
    created.push({ collection: 'tenants', id: b.id as number })
    tenantB = b.id as number
    const s = await payload.find({ collection: 'settings', where: { tenant: { equals: tenantA } }, limit: 1, depth: 0, overrideAccess: true })
    settingsA = s.docs[0] as never
  })

  afterAll(async () => {
    await payload.update({ collection: 'settings', id: settingsA.id, data: { requestsRetentionMonths: settingsA.requestsRetentionMonths ?? null } as any, overrideAccess: true })
    await payload.delete({ collection: 'submissions', where: { email: { equals: `vechi.${tag}@example.test` } }, overrideAccess: true })
    for (const { collection, id } of created.reverse()) await payload.delete({ collection, id }).catch(() => undefined)
  })

  it('data-limită: cu N luni în urmă', () => {
    expect(retentionCutoff(6, new Date('2026-11-25T02:23:00Z')).toISOString()).toBe('2026-05-25T02:23:00.000Z')
    expect(retentionCutoff(12, new Date('2026-11-25T02:23:00Z')).toISOString()).toBe('2025-11-25T02:23:00.000Z')
  })

  it('șterge doar cererile mai vechi decât termenul, doar la restaurantul cu termen; gol = nimic', async () => {
    const a = await make(tenantA)
    const b = await make(tenantB)
    const inSevenMonths = new Date(Date.now() + 7 * 31 * 24 * 3600 * 1000)

    // Fără termen: nimic nu se șterge, nici peste 7 luni.
    await payload.update({ collection: 'settings', id: settingsA.id, data: { requestsRetentionMonths: null } as any, overrideAccess: true })
    expect((await cleanupOldRequests(payload, inSevenMonths)).find((r) => r.tenant === tenantA)).toBeUndefined()

    // Termen 12 luni: cererea de azi rămâne peste 7 luni.
    await payload.update({ collection: 'settings', id: settingsA.id, data: { requestsRetentionMonths: 12 } as any, overrideAccess: true })
    await cleanupOldRequests(payload, inSevenMonths)
    expect((await payload.findByID({ collection: 'submissions', id: a.id, overrideAccess: true }).catch(() => null))?.id).toBe(a.id)

    // Termen 6 luni: peste 7 luni, cererea restaurantului A se șterge; cea a restaurantului B (fără termen) rămâne.
    await payload.update({ collection: 'settings', id: settingsA.id, data: { requestsRetentionMonths: 6 } as any, overrideAccess: true })
    const report = await cleanupOldRequests(payload, inSevenMonths)
    expect(report.find((r) => r.tenant === tenantA)?.deleted).toBeGreaterThanOrEqual(1)
    expect(await payload.findByID({ collection: 'submissions', id: a.id, overrideAccess: true }).catch(() => null)).toBeNull()
    expect((await payload.findByID({ collection: 'submissions', id: b.id, overrideAccess: true }))?.id).toBe(b.id)
  })

  it('adresa: 404 fără CRON_SECRET, 401 cu alt cod; Vercel o cheamă zilnic', async () => {
    const old = process.env.CRON_SECRET
    delete process.env.CRON_SECRET
    const req = (auth?: string) => ({ headers: new Headers(auth ? { authorization: auth } : {}), payload }) as any
    expect((await cleanupRequestsEndpoint.handler(req('Bearer x'))).status).toBe(404)
    process.env.CRON_SECRET = 'un-cod-de-proba-destul-de-lung'
    expect((await cleanupRequestsEndpoint.handler(req('Bearer altceva'))).status).toBe(401)
    expect(cronAuthOk('Bearer un-cod-de-proba-destul-de-lung')).toBe(true)
    if (old === undefined) delete process.env.CRON_SECRET
    else process.env.CRON_SECRET = old
    const vercel = JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8'))
    expect(vercel.crons).toEqual([{ path: '/api/cleanup-requests', schedule: '23 2 * * *' }])
  })
})
