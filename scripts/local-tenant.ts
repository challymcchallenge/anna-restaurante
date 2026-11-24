/**
 * Doar local: creează restaurantul Trattoria (servit pe localhost) și un Administrator de probă,
 * apoi aplică conținutul de pornire (seed/*.json). Refuză orice bază care nu este locală.
 * Rulare: pnpm payload run scripts/local-tenant.ts
 */
import crypto from 'crypto'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { seedStarterContent } from '../src/seed/starter'

const uri = process.env.DATABASE_URI || ''
if (!/@(localhost|127\.0\.0\.1)(:\d+)?\//.test(uri)) {
  throw new Error('Doar pe o bază de date locală.')
}

const payload = await getPayload({ config })
const slug = 'trattoria-da-vittoria'
const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: slug } }, limit: 1 })
if (!docs[0]) {
  await payload.create({
    collection: 'tenants',
    data: {
      name: 'Trattoria da Vittoria',
      slug,
      hosts: [{ host: 'localhost' }, { host: '127.0.0.1' }],
    } as any,
  })
}
const users = await payload.count({ collection: 'users' })
if (users.totalDocs === 0) {
  // Parolă generată la fiecare rulare; se afișează doar în consola locală.
  const password = crypto.randomBytes(12).toString('base64url')
  await payload.create({
    collection: 'users',
    data: { email: 'admin@local.test', name: 'Admin local', password, role: 'administrator' } as any,
  })
  payload.logger.info(`[local] Administrator: admin@local.test / ${password}`)
}
const report = await seedStarterContent({ payload })
payload.logger.info(`[local] ${JSON.stringify(report)}`)
process.exit(0)
