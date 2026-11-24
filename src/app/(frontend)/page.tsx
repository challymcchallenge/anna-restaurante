import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { getTenantByHost } from '@/lib/tenant'
import './styles.css'

/**
 * Pagină de verificare F0: arată restaurantul găsit după adresă și serile lui.
 * Site-ul real (hero, secțiuni) se construiește în F3.
 */
export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const tenant = await getTenantByHost(payload, headers.get('host'))

  if (!tenant) {
    return (
      <div className="home">
        <div className="content">
          <h1>Niciun restaurant configurat pentru această adresă</h1>
          <p>Adresa se adaugă din panou: Restaurante → Adrese pe care se servește site-ul.</p>
        </div>
      </div>
    )
  }

  const { docs: events } = await payload.find({
    collection: 'events',
    depth: 0,
    limit: 10,
    sort: 'startsAt',
    where: { and: [{ tenant: { equals: tenant.id } }, { active: { equals: true } }] },
  })

  return (
    <div className="home">
      <div className="content">
        <h1>{tenant.name}</h1>
        <p>Site în construcție (F0).</p>
        <h2>Seri tematice</h2>
        {events.length === 0 && <p>Nicio seară introdusă.</p>}
        <ul>
          {events.map((event) => (
            <li key={event.id} data-tenant={tenant.slug}>
              {event.name}
              {event.placeholder && <span className="placeholder"> · Exemplu · de înlocuit</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
