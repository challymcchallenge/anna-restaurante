import { cookies } from 'next/headers'
import type { CollectionSlug, Payload, TypedUser, Where } from 'payload'
import Link from 'next/link'
import React from 'react'

import { isAdmin } from '@/access/roles'

import { TranslationsBox } from './TranslationsBox'

/**
 * Tabloul de bord (S-12): câte elemente provizorii au rămas (D-08, ADR-013), serile apropiate
 * și ce mai lipsește din Setări. Contorul trebuie să arate 0 înainte de lansare (PLAN, F5).
 */

type Props = { payload: Payload; user?: TypedUser | null }

const PLACEHOLDER_COLLECTIONS: { slug: CollectionSlug; label: string; adminOnly?: boolean }[] = [
  { slug: 'events', label: 'Seri tematice' },
  { slug: 'dish-categories', label: 'Categorii de preparate' },
  { slug: 'wines', label: 'Vinuri' },
  { slug: 'reviews', label: 'Recenzii' },
  { slug: 'salons', label: 'Saloane' },
  { slug: 'room-types', label: 'Tipuri de camere' },
  { slug: 'gallery', label: 'Galerie' },
  { slug: 'faqs', label: 'Întrebări frecvente' },
  { slug: 'group-links', label: 'Linkuri grup' },
  { slug: 'legal-pages', label: 'Pagini legale' },
  { slug: 'awards', label: 'Premii și distincții', adminOnly: true },
]

const HOME_SECTIONS: { key: string; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'stay', label: 'Bară de cazare' },
  { key: 'kitchen', label: 'Bucătăria' },
  { key: 'wines', label: 'Vinuri' },
  { key: 'reviews', label: 'Ce spun oaspeții' },
  { key: 'parties', label: 'Petreceri și agenda' },
  { key: 'privateEvents', label: 'Evenimente private' },
  { key: 'pizza', label: 'Cursuri de pizza' },
  { key: 'hotel', label: 'Cazare · Hotel ANNA' },
  { key: 'gallery', label: 'Galerie' },
  { key: 'contact', label: 'Contact' },
  { key: 'footer', label: 'Footer' },
]

const dateFormat = new Intl.DateTimeFormat('ro-RO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Bucharest',
})

export async function Dashboard({ payload, user }: Props) {
  if (!user) return null
  const admin = isAdmin(user as { role?: 'administrator' | 'editor' })
  const tenantCookie = (await cookies()).get('payload-tenant')?.value
  const tenantId = tenantCookie ? Number(tenantCookie) || tenantCookie : undefined
  const byTenant = (where: Where): Where =>
    tenantId ? { and: [where, { tenant: { equals: tenantId } }] } : where

  const tenant = tenantId
    ? await payload.findByID({ collection: 'tenants', id: tenantId, depth: 0, user, overrideAccess: false }).catch(() => null)
    : null

  const rows = await Promise.all(
    PLACEHOLDER_COLLECTIONS.filter((c) => admin || !c.adminOnly).map(async (c) => {
      const { totalDocs } = await payload.count({
        collection: c.slug,
        where: byTenant({ placeholder: { equals: true } }),
        user,
        overrideAccess: false,
      })
      return { ...c, count: totalDocs }
    }),
  )

  const home = await payload
    .find({ collection: 'home-page', where: byTenant({}), limit: 1, depth: 0, user, overrideAccess: false })
    .then((r) => r.docs[0] as Record<string, any> | undefined)
    .catch(() => undefined)
  const homePlaceholders = HOME_SECTIONS.filter((s) => home?.[s.key]?.placeholder)

  const total = rows.reduce((sum, r) => sum + r.count, 0) + homePlaceholders.length

  const upcoming = await payload.find({
    collection: 'events',
    where: byTenant({ and: [{ startsAt: { greater_than: new Date().toISOString() } }, { active: { equals: true } }] }),
    sort: 'startsAt',
    limit: 5,
    depth: 0,
    user,
    overrideAccess: false,
  })

  // Cereri noi: Administratorul le vede pe toate, Editorul doar cursurile de pizza și întrebările (D-37).
  const newRequests = await payload.count({
    collection: 'submissions',
    where: byTenant({ status: { equals: 'new' } }),
    user,
    overrideAccess: false,
  })

  const missing: string[] = []
  if (admin && !tenantId) {
    missing.push('Alege un restaurant din comutatorul „Restaurant” din meniu, ca să vezi ce lipsește din Setările lui.')
  } else if (admin) {
    const settings = await payload
      .find({ collection: 'settings', where: byTenant({}), limit: 1, depth: 0, user, overrideAccess: false })
      .then((r) => r.docs[0] as Record<string, any> | undefined)
      .catch(() => undefined)
    if (!settings) missing.push('Setările restaurantului nu sunt create.')
    else {
      if (!settings.logo) missing.push('Logo principal')
      if (!settings.favicon) missing.push('Pictogramă de filă')
      if (settings.address?.lat == null || settings.address?.lng == null) missing.push('Poziția pe hartă (latitudine, longitudine)')
      if (!settings.social?.facebook) missing.push('Linkul de Facebook (C2)')
      const inactive = Object.entries(settings.requests ?? {})
        .filter(([, v]: [string, any]) => !v?.active)
        .map(([k]) => k)
      if (inactive.length) missing.push(`Destinatari de email pentru ${inactive.length} din 5 subiecte (până atunci, butoanele lor nu apar în formular)`)
    }
  }

  return (
    <div className="anna-dashboard">
      <h2 className="anna-dashboard__title">
        Tablou de bord{tenant ? ` · ${(tenant as { name?: string }).name}` : admin ? ' · toate restaurantele' : ''}
      </h2>

      <section className={`anna-dashboard__card${total > 0 ? ' anna-dashboard__card--warn' : ' anna-dashboard__card--ok'}`}>
        <h3>
          Conținut provizoriu rămas: <strong data-testid="placeholder-total">{total}</strong>
        </h3>
        <p>
          Elementele bifate „Provizoriu” apar pe site cu eticheta „Exemplu · de înlocuit”. Înainte de lansare
          contorul trebuie să arate 0.
        </p>
        <ul>
          {rows
            .filter((r) => r.count > 0)
            .map((r) => (
              <li key={r.slug}>
                <Link href={`/admin/collections/${r.slug}?where[placeholder][equals]=true`}>{r.label}</Link>: {r.count}
              </li>
            ))}
          {homePlaceholders.length > 0 && (
            <li>
              <Link href="/admin/collections/home-page">Pagina Acasă</Link>: {homePlaceholders.length} secțiuni (
              {homePlaceholders.map((s) => s.label).join(', ')})
            </li>
          )}
        </ul>
      </section>

      <section className={`anna-dashboard__card${newRequests.totalDocs > 0 ? ' anna-dashboard__card--warn' : ''}`}>
        <h3>
          Cereri noi: <strong data-testid="new-requests">{newRequests.totalDocs}</strong>
        </h3>
        <p>
          {admin
            ? 'Toate subiectele.'
            : 'Înscrieri la cursurile de pizza pentru copii și întrebări.'}{' '}
          <Link href="/admin/collections/submissions?where[status][equals]=new">Vezi cererile noi</Link>
        </p>
      </section>

      <section className="anna-dashboard__card">
        <h3>Seri apropiate</h3>
        {upcoming.docs.length === 0 ? (
          <p>Nicio seară viitoare. <Link href="/admin/collections/events/create">Adaugă o seară</Link></p>
        ) : (
          <ul>
            {upcoming.docs.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/collections/events/${e.id}`}>{e.name}</Link> · {dateFormat.format(new Date(e.startsAt))}
                {e.placeholder ? ' · Exemplu · de înlocuit' : ''}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Traducerile (F4, D-64): cifrele pe limbă și „Tradu tot site-ul”. */}
      {tenantId != null && <TranslationsBox tenantId={tenantId} admin={admin} />}

      {admin && missing.length > 0 && (
        <section className="anna-dashboard__card">
          <h3>Lipsește din Setări</h3>
          <ul>
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p>
            <Link href="/admin/collections/settings">Deschide Setări restaurant</Link>
          </p>
        </section>
      )}
    </div>
  )
}
