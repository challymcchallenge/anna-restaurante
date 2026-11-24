/**
 * F0-d: dovada că un Editor al unui restaurant nu vede și nu modifică conținutul altuia (ADR-002).
 *
 * Rulare (doar pe o bază locală / de test):
 *   F0_CREDS_FILE=/cale/în/afara/repo.json pnpm payload run scripts/f0/multi-tenant-proof.ts
 *
 * Toate verificările folosesc Local API cu overrideAccess: false și user = Editorul,
 * adică exact regulile de acces aplicate și în panou și în API-ul REST.
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '../../src/payload.config'

type Fixture = { name: string; slug: string; hosts: string[]; events: string[] }

const fixtures: { tenants: Fixture[] } = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'scripts/f0/fixtures.json'), 'utf8'),
)

const results: { test: string; ok: boolean; detail: string }[] = []
const check = (test: string, ok: boolean, detail: string) => {
  results.push({ test, ok, detail })
  console.log(`${ok ? 'TRECUT ' : 'PICAT  '} | ${test} | ${detail}`)
}

async function expectDenied(fn: () => Promise<unknown>): Promise<string> {
  try {
    await fn()
    return 'PERMIS'
  } catch (err) {
    return (err as Error).name || 'Error'
  }
}

const payload = await getPayload({ config })
const password = () => crypto.randomBytes(12).toString('base64url')
const creds: Record<string, string> = {}

// 1. Restaurante, utilizatori și conținut de probă (idempotent).
const tenantIds: Record<string, number> = {}
for (const t of fixtures.tenants) {
  const found = await payload.find({ collection: 'tenants', where: { slug: { equals: t.slug } } })
  const doc =
    found.docs[0] ??
    (await payload.create({
      collection: 'tenants',
      data: { name: t.name, slug: t.slug, hosts: t.hosts.map((host) => ({ host })) },
    }))
  tenantIds[t.slug] = doc.id as number
}

async function upsertUser(email: string, data: Record<string, unknown>) {
  creds[email] = password()
  const found = await payload.find({ collection: 'users', where: { email: { equals: email } } })
  if (found.docs[0]) {
    return payload.update({
      collection: 'users',
      id: found.docs[0].id,
      data: { ...data, password: creds[email] },
    })
  }
  return payload.create({
    collection: 'users',
    data: { email, password: creds[email], ...data } as never,
  })
}

const admin = await upsertUser('admin.f0@example.test', {
  name: 'Administrator F0',
  role: 'administrator',
})
const editors: Record<string, Awaited<ReturnType<typeof upsertUser>>> = {}
for (const t of fixtures.tenants) {
  editors[t.slug] = await upsertUser(`editor.${t.slug}@example.test`, {
    name: `Editor ${t.name}`,
    role: 'editor',
    tenants: [{ tenant: tenantIds[t.slug] }],
  })
}

const eventIds: Record<string, number[]> = {}
const mediaIds: Record<string, number> = {}
for (const [i, t] of fixtures.tenants.entries()) {
  await payload.delete({ collection: 'events', where: { tenant: { equals: tenantIds[t.slug] } } })
  eventIds[t.slug] = []
  for (const [j, name] of t.events.entries()) {
    const ev = await payload.create({
      collection: 'events',
      data: {
        name,
        startsAt: new Date(Date.now() + (j + 1) * 7 * 86400000).toISOString(),
        type: 'dj',
        placeholder: true,
        tenant: tenantIds[t.slug],
      },
    })
    eventIds[t.slug].push(ev.id as number)
  }
  await payload.delete({ collection: 'media', where: { tenant: { equals: tenantIds[t.slug] } } })
  const png = await sharp({
    create: { width: 64, height: 64, channels: 3, background: i ? '#204060' : '#602020' },
  })
    .png()
    .toBuffer()
  const media = await payload.create({
    collection: 'media',
    data: { kind: 'photo', alt: `Exemplu · de înlocuit — ${t.slug}`, tenant: tenantIds[t.slug] },
    file: { data: png, mimetype: 'image/png', name: `f0-${t.slug}.png`, size: png.length },
  })
  mediaIds[t.slug] = media.id as number
}

// 2. Verificări pentru fiecare Editor față de celălalt restaurant.
const slugs = fixtures.tenants.map((t) => t.slug)
for (const own of slugs) {
  const other = slugs.find((s) => s !== own)!
  const user = editors[own]
  const as = { user, overrideAccess: false } as const
  const label = `Editor ${own}`

  const ev = await payload.find({ collection: 'events', ...as, depth: 0, limit: 100 })
  const evTenants = [...new Set(ev.docs.map((d) => d.tenant))]
  check(
    `${label}: listă seri`,
    ev.totalDocs === eventIds[own].length && evTenants.every((x) => x === tenantIds[own]),
    `vede ${ev.totalDocs} seri, toate din restaurantele [${evTenants.join(',')}]; ale lui: ${eventIds[own].length}`,
  )

  const foreignEvent = eventIds[other][0]
  const r1 = await expectDenied(() =>
    payload.findByID({ collection: 'events', id: foreignEvent, ...as }),
  )
  check(`${label}: deschide seara altui restaurant`, r1 !== 'PERMIS', r1)

  const r2 = await expectDenied(() =>
    payload.update({ collection: 'events', id: foreignEvent, data: { name: 'modificat' }, ...as }),
  )
  check(`${label}: modifică seara altui restaurant`, r2 !== 'PERMIS', r2)

  const r3 = await expectDenied(() =>
    payload.delete({ collection: 'events', id: foreignEvent, ...as }),
  )
  check(`${label}: șterge seara altui restaurant`, r3 !== 'PERMIS', r3)

  const r4 = await expectDenied(async () => {
    const created = await payload.create({
      collection: 'events',
      data: {
        name: 'intrus',
        startsAt: new Date().toISOString(),
        type: 'dj',
        tenant: tenantIds[other],
      },
      ...as,
    })
    // Dacă a fost creată, verificăm unde a ajuns și o ștergem.
    const landed = (created as { tenant?: number }).tenant
    await payload.delete({ collection: 'events', id: created.id })
    if (landed === tenantIds[other]) return created
    throw Object.assign(new Error('redirecționat'), { name: `Creată în restaurantul ${landed}` })
  })
  check(`${label}: creează seară în alt restaurant`, r4 !== 'PERMIS', r4)

  const md = await payload.find({ collection: 'media', ...as, depth: 0 })
  check(
    `${label}: bibliotecă media`,
    md.docs.every((d) => d.tenant === tenantIds[own]) && md.totalDocs === 1,
    `vede ${md.totalDocs} fișiere, din restaurantele [${[...new Set(md.docs.map((d) => d.tenant))].join(',')}]`,
  )

  const r5 = await expectDenied(() =>
    payload.findByID({ collection: 'media', id: mediaIds[other], ...as }),
  )
  check(`${label}: deschide fișier media al altui restaurant`, r5 !== 'PERMIS', r5)

  const tn = await payload.find({ collection: 'tenants', ...as, depth: 0 })
  check(
    `${label}: listă restaurante`,
    tn.totalDocs === 1 && tn.docs[0].id === tenantIds[own],
    `vede ${tn.totalDocs}: ${tn.docs.map((d) => d.name).join(', ')}`,
  )

  const us = await payload.find({ collection: 'users', ...as, depth: 0 })
  check(
    `${label}: listă utilizatori`,
    us.totalDocs === 1 && us.docs[0].id === user.id,
    `vede ${us.totalDocs}: ${us.docs.map((d) => d.email).join(', ')}`,
  )

  await payload
    .update({
      collection: 'users',
      id: user.id,
      data: {
        role: 'administrator',
        tenants: [{ tenant: tenantIds[own] }, { tenant: tenantIds[other] }],
      },
      ...as,
    })
    .catch(() => null)
  const after = await payload.findByID({ collection: 'users', id: user.id, depth: 0 })
  const afterTenants = (after.tenants ?? []).map((t) => t.tenant)
  check(
    `${label}: își dă singur rol de Administrator sau alt restaurant`,
    after.role === 'editor' && afterTenants.length === 1 && afterTenants[0] === tenantIds[own],
    `după încercare: rol=${after.role}, restaurante=[${afterTenants.join(',')}]`,
  )
}

const adminEvents = await payload.find({
  collection: 'events',
  user: admin,
  overrideAccess: false,
  depth: 0,
})
const allEvents = Object.values(eventIds).flat().length
check(
  'Administrator: vede serile tuturor restaurantelor',
  adminEvents.totalDocs === allEvents,
  `vede ${adminEvents.totalDocs} din ${allEvents}`,
)

const passed = results.filter((r) => r.ok).length
console.log(`\nREZULTAT: ${passed}/${results.length} verificări trecute`)

if (process.env.F0_CREDS_FILE) {
  fs.writeFileSync(
    process.env.F0_CREDS_FILE,
    JSON.stringify({ creds, tenantIds, eventIds, results }, null, 2),
    { mode: 0o600 },
  )
}
process.exit(passed === results.length ? 0 : 1)
