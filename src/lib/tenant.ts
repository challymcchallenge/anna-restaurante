import type { Payload } from 'payload'

import type { Tenant } from '@/payload-types'

/**
 * Găsește restaurantul după adresa cererii (ADR-002: „găsirea tenantului după domeniu o scriem noi”).
 * Caută în „Domeniu” și în „Adrese pe care se servește site-ul”. Nimic specific unui restaurant în cod.
 */
export async function getTenantByHost(
  payload: Payload,
  host: string | null | undefined,
): Promise<Tenant | null> {
  if (!host) return null
  const hostname = host.split(':')[0].toLowerCase()

  const { docs } = await payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 1,
    where: {
      and: [
        { active: { equals: true } },
        { or: [{ domain: { equals: hostname } }, { 'hosts.host': { equals: hostname } }] },
      ],
    },
  })

  return docs[0] ?? null
}
