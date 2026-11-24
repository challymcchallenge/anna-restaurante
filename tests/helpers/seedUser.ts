import crypto from 'crypto'
import { getPayload } from 'payload'

import './env'
import config from '../../src/payload.config.js'

/** Conturi locale pentru teste, cu parole generate la fiecare rulare. */
export const testUser = {
  email: `admin.e2e.${process.pid}@example.test`,
  password: crypto.randomBytes(12).toString('base64url'),
}

export const testEditor = {
  email: `editor.e2e.${process.pid}@example.test`,
  password: crypto.randomBytes(12).toString('base64url'),
}

async function recreate(data: Record<string, unknown> & { email: string }) {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: data.email } } })
  await payload.create({ collection: 'users', data: data as any })
}

export async function seedTestUser(): Promise<void> {
  await recreate({ ...testUser, name: 'Admin E2E', role: 'administrator' })
}

/** Editor pe primul restaurant (cel cu ordinea cea mai mică). */
export async function seedTestEditor(): Promise<void> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'tenants', sort: '_order', limit: 1 })
  if (!docs[0]) throw new Error('Nu există niciun restaurant în baza locală.')
  await recreate({ ...testEditor, name: 'Editor E2E', role: 'editor', tenants: [{ tenant: docs[0].id }] })
}

export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({
    collection: 'users',
    where: { email: { in: [testUser.email, testEditor.email] } },
  })
}
